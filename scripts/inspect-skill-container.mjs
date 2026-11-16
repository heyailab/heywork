/**
 * Print what the bundled skill container actually holds, without launching UMA.
 *
 * `dsh-skill-uma/resources.umadb` is an AES-256-GCM + Brotli container keyed by
 * sha256('UMA Studio local resource container v1'); the key derivation is the
 * Mac build's and platform-independent, so the Windows package reads the very
 * same bytes that ship on macOS. This script is the acceptance evidence for the
 * "20 bundled skills load through uma_resource_read" criterion.
 *
 * Usage:
 *   node --experimental-sqlite scripts/inspect-skill-container.mjs [path-to.umadb]
 */
import { createDecipheriv, createHash } from 'node:crypto'
import { brotliDecompressSync } from 'node:zlib'
import { DatabaseSync } from 'node:sqlite'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const PORT_ROOT = process.env.UMA_PORT_ROOT ?? resolve(import.meta.dirname, '..')
const container = resolve(process.argv[2] ?? join(PORT_ROOT, 'uma-assets', 'packages', 'dsh-skill-uma', 'resources.umadb'))
if (!existsSync(container)) {
  console.error(`inspect-skill-container: not found: ${container}`)
  process.exit(2)
}

const KEY = createHash('sha256').update('UMA Studio local resource container v1').digest()
const db = new DatabaseSync(container, { readOnly: true })
const statement = db.prepare('SELECT kind, nonce, value, tag FROM resources WHERE id = ?')

/** Decrypt one entry; the AAD binds kind and path, so a moved file cannot be replayed. */
function read(path) {
  const row = statement.get(createHash('sha256').update(path).digest('hex'))
  if (row === undefined) return undefined
  const decipher = createDecipheriv('aes-256-gcm', KEY, Buffer.from(row.nonce))
  decipher.setAAD(Buffer.from(`${row.kind}:${path}`))
  decipher.setAuthTag(Buffer.from(row.tag))
  return { kind: row.kind, bytes: brotliDecompressSync(Buffer.concat([decipher.update(row.value), decipher.final()])) }
}

/** Directory listing entries of one container path. */
function entries(path) {
  const row = read(path)
  if (row === undefined || row.kind !== 1) return []
  return JSON.parse(row.bytes.toString('utf8'))
}

const skills = entries('').filter(entry => entry.directory).map(entry => entry.name).sort()
const totals = db.prepare('SELECT kind, COUNT(*) AS count FROM resources GROUP BY kind').all()
const files = totals.find(row => row.kind === 0)?.count ?? 0
const directories = totals.find(row => row.kind === 1)?.count ?? 0

console.log(`container: ${container}`)
console.log(`entries: ${directories} directories, ${files} files`)
console.log(`skills: ${skills.length}`)
for (const skill of skills) {
  const children = entries(skill).map(entry => `${entry.name}${entry.directory ? '/' : ''}`)
  const document = read(`${skill}/SKILL.md`)
  const heading = document === undefined
    ? '(no SKILL.md)'
    : /^#\s+(.+)$/m.exec(document.bytes.toString('utf8'))?.[1] ?? '(untitled)'
  console.log(`  ${skill.padEnd(20)} ${heading.slice(0, 60)}`)
  console.log(`  ${''.padEnd(20)} ${children.join(' ')}`)
}
db.close()
