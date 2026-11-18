#!/usr/bin/env node
/**
 * 从 beta5 Mac app.asar 抽取 77 个客户端 UI/API 依赖包到 uma-assets/packages/。
 *
 * 背景：这 77 个 @deepseek-ai 客户端包（layout/renderer/sidebar/primitives/workspace/
 * chat/conversation/theme + api-* + locale/resources）在上游开源 dsh 里不存在，
 * 但 7 个 UMA UI 包的 dsh.client.inject 依赖它们。没有它们，UMA 面板无处挂载。
 *
 * 与 extract-mac-extras.mjs 的关系：那个脚本抽的是"服务端一等包"（11 个），
 * 这个脚本抽的是"客户端 UI 地基"（77 个）。两者都从同一 app.asar 抽取，
 * 共用 packages.extras.json 清单格式（追加，不覆盖）。
 *
 * 用法：
 *   node scripts/extract-client-ui.mjs --asar <path to app.asar> [--dry-run]
 */
import {
  closeSync, mkdirSync, openSync, readFileSync, readSync, writeFileSync, existsSync,
} from 'node:fs'
import { createHash } from 'node:crypto'
import { join, dirname } from 'node:path'
const ARGS = process.argv.slice(2)
const arg = (n, f) => { const i = ARGS.indexOf(n); return i >= 0 ? ARGS[i + 1] : f }
const DRY = ARGS.includes('--dry-run')
const ROOT = process.env.HEY_ROOT ?? dirname(import.meta.dirname)
const ASAR = arg('--asar', undefined)
const OUT = join(ROOT, 'uma-assets', 'packages')
const MANIFEST = join(ROOT, 'uma-assets', 'client-ui.extras.json')
const LIMIT = Number(arg('--limit', '0')) || 0   // 0 = all
const OFFSET = Number(arg('--offset', '0')) || 0
const ONLY = arg('--only', '')                   // comma-separated package names

if (!ASAR || !existsSync(ASAR)) {
  console.error('usage: node scripts/extract-client-ui.mjs --asar <app.asar path>')
  process.exit(2)
}

// --- asar reader (same layout as extract-mac-extras.mjs) ---
const fd = openSync(ASAR, 'r')
const head = Buffer.alloc(16); readSync(fd, head, 0, 16, 0)
const hs = head.readUInt32LE(12)
const hbuf = Buffer.alloc(hs); readSync(fd, hbuf, 0, hs, 16)
const tree = JSON.parse(hbuf.toString('utf8'))
const dataStart = Math.ceil((16 + hs) / 4) * 4
const read = node => {
  const b = Buffer.alloc(node.size ?? 0)
  if (b.length) readSync(fd, b, 0, b.length, dataStart + Number(node.offset ?? 0))
  return b
}
const scope = tree.files.dsh?.files?.node_modules?.files?.['@deepseek-ai']?.files
if (!scope) { console.error('unexpected asar layout'); process.exit(2) }

// --- 目标包名：客户端 UI / API / locale / resources / cordis-client ---
const isClientPackage = n =>
  /^dsh-client-(ui-|locale$|resources$|connection$|file-upload$|modules$|shortcuts$)/.test(n) ||
  /^dsh-api-(remotes|workspace|session|gateway|job-controller|remote-access|terminal-controller)/.test(n) ||
  n === 'dsh-cordis-client-runner'
const allTargets = Object.keys(scope).filter(isClientPackage).sort()
const targets = ONLY
  ? ONLY.split(',').filter(n => scope[n])
  : (LIMIT > 0 ? allTargets.slice(OFFSET, OFFSET + LIMIT) : allTargets.slice(OFFSET))

console.log(`目标客户端包: ${targets.length} 个 (总 ${allTargets.length}, offset ${OFFSET})`)
if (DRY) { console.log(targets.join('\n')); closeSync(fd); process.exit(0) }

// 已有清单则合并（分批抽取时保留之前的结果）
const manifest = existsSync(MANIFEST)
  ? JSON.parse(readFileSync(MANIFEST, 'utf8'))
  : {
      source: 'beta5 app.asar → dsh/node_modules/@deepseek-ai',
      desktopVersion: '1.0.0-beta5.20261118.3',
      note: 'Client UI/API packages required by the 7 UMA UI panels; absent from upstream dsh.',
      files: [],
    }
manifest.files = manifest.files.filter(f => !targets.includes(f.package))
let totalBytes = 0
for (const name of targets) {
  const pkgNode = scope[name]
  const dest = join(OUT, name)
  mkdirSync(dest, { recursive: true })
  const files = []
  const walk = (node, prefix = '') => {
    for (const [n, child] of Object.entries(node.files ?? {})) {
      const rel = prefix ? `${prefix}/${n}` : n
      if (child.files !== undefined) { walk(child, rel); continue }
      mkdirSync(dirname(join(dest, rel)), { recursive: true })
      const bytes = read(child)
      writeFileSync(join(dest, rel), bytes)
      files.push({
        path: rel,
        size: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      })
      totalBytes += bytes.length
    }
  }
  walk(pkgNode)
  manifest.files.push({ package: name, fileCount: files.length, files })
  console.log(`  ${name.padEnd(38)} ${files.length} files`)
}
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
closeSync(fd)
console.log(`\n完成: ${targets.length} 包, ${totalBytes} 字节`)
console.log(`清单: ${MANIFEST}`)
