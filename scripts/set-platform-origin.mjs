/**
 * Replace the platform origin (currently studio.umayun.com) with the real HEY domain.
 *
 * WHY THIS IS SEPARATE:
 *   The origin is a live service endpoint (hosted account, mandatory-update policy,
 *   feedback upload, knowledge base). Guessing it would silently break login and
 *   policy checks. Everything else got renamed uma->hey already; this one waits for
 *   the real value from the project owner.
 *
 * Usage:
 *   node scripts/set-platform-origin.mjs --origin https://your.real.domain [--dry-run]
 *
 * The origin must be a bare https origin (no path, no credentials, no port unless
 * intentional) — the desktop policy code validates exactly this shape.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.env.HEY_ROOT ?? new URL('..', import.meta.url).pathname
const OLD = 'studio.umayun.com'
const idx = process.argv.indexOf('--origin')
const origin = idx >= 0 ? process.argv[idx + 1] : undefined
const DRY = process.argv.includes('--dry-run')

if (origin === undefined) {
  console.error('set-platform-origin: --origin <https://your.real.domain> is required')
  console.error(`current origin: ${OLD}`)
  process.exit(2)
}
let host
try {
  const url = new URL(origin)
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.username || url.password || url.search || url.hash) {
    throw new Error('not a bare https origin')
  }
  host = url.host
} catch {
  console.error(`set-platform-origin: invalid origin: ${origin} (need https://host with no path/query)`)
  process.exit(2)
}

const files = execFileSync('git', ['ls-files', '-z'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
  .split('\0').filter(Boolean)
  .filter(f => !f.includes('set-platform-origin.mjs'))

let changed = 0
for (const rel of files) {
  let src
  try { src = readFileSync(join(ROOT, rel), 'utf8') } catch { continue }
  if (!src.includes(OLD)) continue
  const count = (src.match(/studio\.umayun\.com/gu) ?? []).length
  const out = src.replaceAll(OLD, host)
  if (!DRY) writeFileSync(join(ROOT, rel), out, 'utf8')
  changed++
  console.log(`${DRY ? 'would change' : 'changed'}: ${rel} (${count})`)
}
console.log(`\n${DRY ? 'DRY RUN' : 'APPLIED'}: ${changed} files -> ${host}`)
if (!DRY) console.log('Remember to rebuild packages/patches that embed the origin at build time.')
