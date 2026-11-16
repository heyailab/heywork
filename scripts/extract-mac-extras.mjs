/**
 * Vendor the first-party packages the UMA product layers mount but the public
 * deepseek-harness repository does not publish.
 *
 * The Mac app's `app.asar` carries 362 `@deepseek-ai/*` packages; the pinned
 * upstream ref carries 406, and the two sets differ by the UMA bundle plus 11
 * first-party packages that only the UMA edition builds (knowledge base, project
 * wiki, coding workbench, design studio, worktree, task query). The UMA desktop
 * layer stack mounts them by name, so a Windows package without them fails to
 * boot the profile — the difference is invisible at build time because the
 * prepare-stage runtime smoke runs before injection.
 *
 * This script extracts exactly those packages (plus their non-upstream
 * dependency closure) out of the Mac asar into `uma-assets/packages/`, and writes
 * `uma-assets/packages.extras.json` with the source version, byte size and
 * per-file SHA-256 so the vendored copy stays auditable.
 *
 * Usage:
 *   node scripts/extract-mac-extras.mjs --asar "<...>/UMA Studio.app/Contents/Resources/app.asar"
 *   node scripts/extract-mac-extras.mjs --asar <path> --dry-run
 */
import { createHash } from 'node:crypto'
import { closeSync, mkdirSync, openSync, readFileSync, readSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'

const ARGS = process.argv.slice(2)
const argValue = (name, fallback) => {
  const index = ARGS.indexOf(name)
  return index === -1 ? fallback : ARGS[index + 1]
}
const DRY_RUN = ARGS.includes('--dry-run')
const PORT_ROOT = process.env.UMA_PORT_ROOT ?? resolve(import.meta.dirname, '..')
const DSH_ROOT = process.env.UMA_DSH_ROOT ?? join(PORT_ROOT, 'deepseek-harness')
const OUT = resolve(argValue('--out', join(PORT_ROOT, 'uma-assets', 'packages')))
const ASAR = argValue('--asar', undefined)
if (ASAR === undefined) {
  console.error('extract-mac-extras: --asar <path to app.asar> is required')
  process.exit(2)
}

/** Packages the UMA layers mount that the public repository does not ship. */
const SEEDS = [
  '@deepseek-ai/dsh-knowledge',
  '@deepseek-ai/dsh-task-query',
  '@deepseek-ai/dsh-worktree',
  '@deepseek-ai/dsh-coding-workbench',
  '@deepseek-ai/dsh-tool-repo-wiki',
  '@deepseek-ai/dsh-util-repo-wiki',
  '@deepseek-ai/dsh-client-ui-knowledge',
  '@deepseek-ai/dsh-client-ui-repo-wiki',
  '@deepseek-ai/dsh-client-ui-design-studio',
  '@deepseek-ai/dsh-api-account-controller',
  '@deepseek-ai/dsh-deepseek-account-platform',
]

/**
 * Third-party packages the extracted closure imports at module scope or from a
 * worker. They join the `deps/` pool that inject-uma.mjs tops up only when the
 * materialized tree is missing them, so a tree that already hoists them (zod via
 * the CUA packages, js-yaml via the dsh CLI) pays nothing while a tree that does
 * not still resolves every import. Sizes: zod 5.2 MB, pdfjs-dist 15.4 MB,
 * picomatch 91 KB, typescript 19.0 MB, js-yaml 395 KB, papaparse 216 KB,
 * yaml 774 KB (dsh-skill-uma parses skill front matter with it, so its absence
 * would break every uma_resource_read).
 */
const POOL_DEPS = ['zod', 'pdfjs-dist', 'picomatch', 'typescript', 'js-yaml', 'papaparse', 'yaml']

// ------------------------------------------------------------------ asar reader

/**
 * Parse the asar header and expose both the entry tree and a file reader.
 * Layout: [u32=4][u32=pickle size][u32=header string size][header JSON][pad to 4][data].
 * @param path - archive path.
 * @returns entry tree, data-region base offset, and a `read(node)` returning the file bytes.
 */
function openArchive(path) {
  const fd = openSync(path, 'r')
  const head = Buffer.alloc(16)
  readSync(fd, head, 0, 16, 0)
  const headerStringSize = head.readUInt32LE(12)
  const header = Buffer.alloc(headerStringSize)
  readSync(fd, header, 0, headerStringSize, 16)
  const tree = JSON.parse(header.toString('utf8'))
  const dataStart = Math.ceil((16 + headerStringSize) / 4) * 4
  const read = node => {
    if (node.link !== undefined) return readFileSync(node.link)
    const buffer = Buffer.alloc(node.size ?? 0)
    if (buffer.length > 0) readSync(fd, buffer, 0, buffer.length, dataStart + Number(node.offset ?? 0))
    return buffer
  }
  return { fd, tree, read, close: () => closeSync(fd) }
}

const archive = openArchive(ASAR)
const scopedRoot = archive.tree.files.dsh?.files?.node_modules?.files?.['@deepseek-ai']?.files
if (scopedRoot === undefined) {
  console.error('extract-mac-extras: unexpected asar layout (dsh/node_modules/@deepseek-ai missing)')
  process.exit(2)
}

/** Flatten one package subtree into `[relative path, node]` pairs. */
function flatten(node, prefix = '', out = []) {
  for (const [name, child] of Object.entries(node.files ?? {})) {
    const path = prefix === '' ? name : `${prefix}/${name}`
    if (child.files !== undefined) flatten(child, path, out)
    else out.push([path, child])
  }
  return out
}

const packageNode = name => scopedRoot[name.slice('@deepseek-ai/'.length)]

// ------------------------------------------------- "upstream" source of truth

const upstream = new Set()
const scan = directory => {
  if (!existsSync(directory)) return
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.desktop-build') continue
    const path = join(directory, entry.name)
    if (entry.isDirectory()) { scan(path); continue }
    if (entry.name !== 'package.json') continue
    try {
      const manifest = JSON.parse(readFileSync(path, 'utf8'))
      if (typeof manifest.name === 'string') upstream.add(manifest.name)
    } catch { /* not a package manifest */ }
  }
}
for (const scope of ['packages', 'apps', 'vendor']) scan(join(DSH_ROOT, scope))
if (upstream.size === 0) {
  console.error(`extract-mac-extras: no upstream manifests found under ${DSH_ROOT}; refuse to guess`)
  process.exit(2)
}

// ------------------------------------------------------- dependency closure

const closure = new Map()
const hoisted = new Set()
const unresolved = new Set()
const treeModules = archive.tree.files.dsh?.files?.node_modules?.files ?? {}
const queue = [...SEEDS]
while (queue.length > 0) {
  const name = queue.shift()
  if (closure.has(name) || upstream.has(name) || hoisted.has(name)) continue
  const node = packageNode(name)
  if (node === undefined) {
    // Third-party dependencies live at the tree root, where the upstream closure
    // already hoists them; only their presence is checked, never their content.
    if (treeModules[name] !== undefined) { hoisted.add(name); continue }
    unresolved.add(name)
    continue
  }
  const manifest = JSON.parse(archive.read(node.files['package.json']).toString('utf8'))
  closure.set(name, { manifest, node })
  for (const field of ['dependencies', 'optionalDependencies']) {
    for (const dependency of Object.keys(manifest[field] ?? {})) queue.push(dependency)
  }
}

// ------------------------------------------------------------------- extract

const report = []
let bytes = 0
for (const [name, { manifest, node }] of [...closure].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
  if (upstream.has(name)) continue // satisfied by the pinned upstream tree
  const vendored = join(OUT, name.slice('@deepseek-ai/'.length))
  const files = flatten(node)
  const digest = createHash('sha256')
  let packageBytes = 0
  for (const [path, file] of files) {
    const body = archive.read(file)
    packageBytes += body.length
    digest.update(`${path}\0`).update(body)
  }
  bytes += packageBytes
  report.push({
    name,
    version: manifest.version,
    files: files.length,
    bytes: packageBytes,
    sha256: digest.digest('hex'),
    natives: files.filter(([path]) => /\.(node|exe|dll|dylib|so)$/u.test(path)).map(([path]) => path),
  })
  if (DRY_RUN) continue
  if (existsSync(vendored)) {
    console.log(`  ${name.padEnd(44)} already vendored — left untouched`)
    continue
  }
  for (const [path, file] of files) {
    const destination = join(OUT, name.slice('@deepseek-ai/'.length), path)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, archive.read(file))
  }
}
// ------------------------------------------------- third-party pool dependencies

for (const name of POOL_DEPS) {
  const node = treeModules[name]
  if (node === undefined) { unresolved.add(name); continue }
  const files = flatten(node)
  const digest = createHash('sha256')
  let poolBytes = 0
  for (const [path, file] of files) {
    const body = archive.read(file)
    poolBytes += body.length
    digest.update(`${path}\0`).update(body)
  }
  const manifest = JSON.parse(archive.read(node.files['package.json']).toString('utf8'))
  report.push({ name, version: manifest.version, files: files.length, bytes: poolBytes, sha256: digest.digest('hex'), natives: [], pool: 'deps' })
  bytes += poolBytes
  if (DRY_RUN) continue
  const vendored = join(PORT_ROOT, 'uma-assets', 'deps', name)
  if (existsSync(vendored)) { console.log(`  ${name.padEnd(44)} already vendored — left untouched`); continue }
  for (const [path, file] of files) {
    const destination = join(vendored, path)
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, archive.read(file))
  }
}

archive.close()

if (unresolved.size > 0) {
  console.error(`extract-mac-extras: ${unresolved.size} package(s) referenced but absent from the archive:`)
  for (const name of unresolved) console.error(`  ${name}`)
}

for (const entry of report) {
  console.log(`  ${entry.name.padEnd(44)} ${String(entry.version).padEnd(12)} ${(entry.bytes / 1024).toFixed(0).padStart(6)} KB  ${entry.files} files${entry.natives.length > 0 ? `  NATIVE: ${entry.natives.join(', ')}` : ''}`)
}
console.log(`extract-mac-extras: ${report.length} packages, ${(bytes / 1024 / 1024).toFixed(1)} MB${DRY_RUN ? ' (dry run)' : ''}`)

if (!DRY_RUN) {
  const manifestPath = join(PORT_ROOT, 'uma-assets', 'packages.extras.json')
  writeFileSync(manifestPath, `${JSON.stringify({
    source: 'UMA Studio.app/Contents/Resources/app.asar → dsh/node_modules/@deepseek-ai',
    desktopVersion: '0.2.2-rc.3',
    note: 'First-party packages the UMA desktop layers mount but the public deepseek-harness ref does not publish.',
    packages: report,
  }, undefined, 2)}\n`)
  console.log(`extract-mac-extras: wrote ${manifestPath}`)
}
if (unresolved.size > 0) process.exit(1)
