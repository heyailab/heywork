/**
 * Assert the bundled resource container still holds everything the tool packages
 * hard-require before they register a single tool.
 *
 * `dsh-tool-uma-design` throws during module init — which takes the whole desktop
 * profile down, not just the design family — when any of these is empty:
 *
 *   systems.length === 0    → no design systems under assets/uma-design-systems/systems
 *   references.length === 0 → no DESIGN.md references under assets/uma-design-md/brands
 *   knowledge.length === 0  → no sections under any KNOWLEDGE_ROOTS entry
 *
 * Those three live entirely inside `dsh-skill-uma/resources.umadb` (the `assets/`
 * directory does not exist on disk by design: `locate()` in the package's
 * resources module walks up from `<skillRoot>/assets` to the sibling
 * `resources.umadb` and resolves the relative POSIX path inside it). A container
 * swapped for a different build — or truncated by a bad copy — therefore passes
 * every other gate we have and only fails on the user's first window. This script
 * decrypts the container and counts what is really in there.
 *
 * Reads the source container only (uma-assets/packages/dsh-skill-uma); it does not
 * need a materialized dsh tree, so it runs in the same second-scale slot as
 * verify-hey-platform.mjs.
 *
 * Usage:
 *   node scripts/verify-skill-container.mjs [path-to.umadb]
 *
 * node:sqlite needs --experimental-sqlite before Node 24; the script relaunches
 * itself once with that flag rather than making every caller remember it.
 */
import { createDecipheriv, createHash } from 'node:crypto'
import { brotliDecompressSync } from 'node:zlib'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join, resolve } from 'node:path'

const SELF = fileURLToPath(import.meta.url)
const PORT_ROOT = process.env.HEY_ROOT ?? resolve(import.meta.dirname, '..')
const container = resolve(process.argv[2] ?? join(PORT_ROOT, 'uma-assets', 'packages', 'dsh-skill-uma', 'resources.umadb'))

/** Lower bounds, not exact counts: a newer Mac build may add systems without breaking the product. */
const MINIMUM = { skills: 20, systems: 400, brands: 60 }

if (!existsSync(container)) {
  console.error(`verify-skill-container: not found: ${container}`)
  process.exit(2)
}

let DatabaseSync
try {
  ({ DatabaseSync } = await import('node:sqlite'))
} catch {
  // Node < 24 ships node:sqlite behind a flag; hand the run to a child that has it.
  const child = spawnSync(process.execPath, ['--experimental-sqlite', SELF, ...process.argv.slice(2)], { stdio: 'inherit' })
  process.exit(child.status ?? 1)
}

const KEY = createHash('sha256').update('UMA Studio local resource container v1').digest()
const MAXIMUM = 2 * 1024 * 1024
const db = new DatabaseSync(container, { readOnly: true })
const statement = db.prepare('SELECT kind, nonce, value, tag FROM resources WHERE id = ?')

/** Decrypt one entry; AAD binds kind and the POSIX-relative path, exactly as the runtime does. */
function read(path) {
  const row = statement.get(createHash('sha256').update(path).digest('hex'))
  if (row === undefined) return undefined
  const decipher = createDecipheriv('aes-256-gcm', KEY, Buffer.from(row.nonce))
  decipher.setAAD(Buffer.from(`${row.kind}:${path}`))
  decipher.setAuthTag(Buffer.from(row.tag))
  const bytes = brotliDecompressSync(Buffer.concat([decipher.update(row.value), decipher.final()]), { maxOutputLength: MAXIMUM })
  return { kind: row.kind, bytes }
}

/** Directory entries of one container path, or an empty list when it is absent. */
function entries(path) {
  const row = read(path)
  if (row === undefined || row.kind !== 1) return []
  return JSON.parse(row.bytes.toString('utf8'))
}

const problems = []
const notes = []

function atLeast(label, actual, minimum, detail = '') {
  if (actual < minimum) problems.push(`${label}: ${actual} < ${minimum}${detail === '' ? '' : ` (${detail})`}`)
}

// ---------------------------------------------------------------- skills
const root = entries('')
const skills = root.filter(entry => entry.directory).map(entry => entry.name)
atLeast('skill directories', skills.length, MINIMUM.skills)
const withoutSkill = skills.filter(skill => read(`${skill}/SKILL.md`) === undefined)
if (withoutSkill.length > 0) problems.push(`skills without SKILL.md: ${withoutSkill.join(', ')}`)
notes.push(`skills: ${skills.length}`)

// ------------------------------------------------------- design assets
const systems = entries('uma-design-systems/systems').filter(entry => entry.directory)
atLeast('design systems', systems.length, MINIMUM.systems, 'dsh-tool-uma-design throws when empty')

const brands = entries('uma-design-md/brands').filter(entry => entry.directory)
atLeast('DESIGN.md brands', brands.length, MINIMUM.brands, 'dsh-tool-uma-design throws when empty')

const systemWithoutManifest = systems.filter(system => read(`uma-design-systems/systems/${system.name}/manifest.json`) === undefined)
if (systemWithoutManifest.length > 0) {
  problems.push(`design systems without manifest.json: ${systemWithoutManifest.length} (first: ${systemWithoutManifest[0].name})`)
}
const brandWithoutDoc = brands.filter(brand => read(`uma-design-md/brands/${brand.name}/DESIGN.md`) === undefined)
if (brandWithoutDoc.length > 0) {
  problems.push(`brands without DESIGN.md: ${brandWithoutDoc.length} (first: ${brandWithoutDoc[0].name})`)
}
notes.push(`design systems: ${systems.length} (+${systemWithoutManifest.length === 0 ? 'all manifests' : 'MANIFEST GAP'})`)
notes.push(`DESIGN.md brands: ${brands.length}`)

// --------------------------------------------------- knowledge roots
// Same list the design package collects its prompt sections from; read it out of
// the package instead of copying it, so a future edit cannot silently diverge.
const designIndex = join(PORT_ROOT, 'uma-assets', 'packages', 'dsh-tool-uma-design', 'lib', 'index.js')
const declaredRoots = (() => {
  if (!existsSync(designIndex)) return undefined
  const source = readFileSync(designIndex, 'utf8')
  const match = /const KNOWLEDGE_ROOTS = \[([\s\S]*?)\]/u.exec(source)
  return match === null ? undefined : [...match[1].matchAll(/"([^"]+)"/gu)].map(hit => hit[1])
})()
if (declaredRoots === undefined || declaredRoots.length === 0) {
  problems.push(`cannot read KNOWLEDGE_ROOTS from ${designIndex} — the design package moved it`)
} else {
  const empty = declaredRoots.filter(root => read(root) === undefined)
  if (empty.length > 0) problems.push(`knowledge roots missing from the container: ${empty.join(', ')}`)
  notes.push(`knowledge roots: ${declaredRoots.length - empty.length}/${declaredRoots.length} present`)
}

const size = (statSync(container).size / 1024 / 1024).toFixed(1)
console.log(`container: ${container} (${size} MB)`)
for (const note of notes) console.log(`  ${note}`)

db.close()

if (problems.length > 0) {
  console.error('\nverify-skill-container: FAILED')
  for (const problem of problems) console.error(`  - ${problem}`)
  process.exit(1)
}
console.log('verify-skill-container: OK — skills, design systems, brands and knowledge roots are all intact')
