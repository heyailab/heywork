#!/usr/bin/env node
/**
 * P4 客户端 UI 依赖闭合门禁。
 *
 * 检查 7 个 UMA UI 包的 dsh.client.inject 依赖是否全部可解析：
 *   - 资产库 uma-assets/packages/ 里从 beta5 抽取的 82 个包
 *   - 上游开源仓库 deepseek-harness/packages/client/ 里的公开包（如 ui-primitives）
 *
 * 背景：这些依赖在上游开源 dsh 里大多不存在，是 P4 UI 挂载的硬地基。
 * 任何一个缺失都会让对应面板静默不出现（cordis 对不可解析的 inject 只警告）。
 *
 * 用法：node scripts/verify-client-ui-deps.mjs
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const ROOT = process.env.HEY_ROOT ?? dirname(import.meta.dirname)
const ASSETS = join(ROOT, 'uma-assets', 'packages')
const MANIFEST = join(ROOT, 'uma-assets', 'client-ui.extras.json')
const DSH_CLIENT = join(ROOT, 'deepseek-harness', 'packages', 'client')

const available = new Set(readdirSync(ASSETS))
if (existsSync(DSH_CLIENT)) {
  for (const d of readdirSync(DSH_CLIENT)) {
    const pj = join(DSH_CLIENT, d, 'package.json')
    if (!existsSync(pj)) continue
    try {
      const j = JSON.parse(readFileSync(pj, 'utf8'))
      if (j.name?.startsWith('@deepseek-ai/')) available.add(j.name.slice('@deepseek-ai/'.length))
    } catch { /* not a manifest */ }
  }
}

// 清单完整性：声明的包必须都在磁盘
let manifestCount = 0
if (existsSync(MANIFEST)) {
  const m = JSON.parse(readFileSync(MANIFEST, 'utf8'))
  manifestCount = m.files.length
  for (const f of m.files) {
    if (!available.has(f.package)) {
      console.error(`verify-client-ui-deps: manifest package missing on disk: ${f.package}`)
      process.exit(1)
    }
  }
}

// inject 闭合检查
const pkgs = readdirSync(ASSETS).filter(d =>
  /^dsh-client/.test(d) && existsSync(join(ASSETS, d, 'package.json')))
const missing = new Map()
let total = 0
let ok = 0
for (const p of pkgs) {
  let j
  try { j = JSON.parse(readFileSync(join(ASSETS, p, 'package.json'), 'utf8')) } catch { continue }
  for (const dep of j.dsh?.client?.inject ?? []) {
    const n = dep.replace('@deepseek-ai/', '')
    if (!n.startsWith('dsh-')) continue
    total++
    if (available.has(n)) ok++
    else {
      if (!missing.has(n)) missing.set(n, [])
      missing.get(n).push(p)
    }
  }
}

console.log(`client-ui manifest: ${manifestCount} packages`)
console.log(`inject deps resolved: ${ok}/${total}`)
if (missing.size) {
  console.error('unresolved inject targets:')
  for (const [n, users] of missing) console.error(`  ${n} ← ${users.join(', ')}`)
  process.exit(1)
}
console.log('OK — client UI dependency closure is complete')
