/**
 * P4 UI 挂载契约门禁：重写模块 vs 原 bundle 的 slot 覆盖对比。
 *
 * 从每个原 UMA client.js 用正则提取 slots.inject/registerFactory/register 的目标名，
 * 再用 harness 执行对应重写模块，断言每个原 slot 都能在重写版中被观测到。
 * 这是"界面能出现在正确位置"的静态可证部分；像素/时序仍需真机确认。
 *
 * 用法：node packages/heywork-ui/verify-mounts.mjs
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runModule, REPO_ROOT } from './harness/loader.js'

// 重写模块 → 原包目录
const PAIRS = [
  ['brand', 'dsh-client-ui-uma-brand'],
  ['design-studio', 'dsh-client-ui-design-studio'],
  ['design-cards', 'dsh-client-ui-uma-design'],
  ['knowledge', 'dsh-client-ui-knowledge'],
  ['repo-wiki', 'dsh-client-ui-repo-wiki'],
  ['task-budget', 'dsh-client-ui-uma-task-budget'],
  ['remotes', 'dsh-client-uma-remotes'],
]

function originalSlots(pkg) {
  const src = readFileSync(resolve(REPO_ROOT, 'uma-assets', 'packages', pkg, 'lib', 'client.js'), 'utf8')
  return new Set([...src.matchAll(/slots\.(?:inject|registerFactory|register)\(\s*['"`]([\w.-]+)/g)].map(m => m[1]))
}

let missing = 0
let totalSlots = 0
for (const [mod, pkg] of PAIRS) {
  const result = await runModule(`./packages/heywork-ui/src/${mod}.client.js`)
  const got = new Set(result.calls.slots.map(s => s.name).filter(Boolean))
  const want = originalSlots(pkg)
  const miss = [...want].filter(x => !got.has(x))
  totalSlots += want.size
  missing += miss.length
  const tag = miss.length === 0 ? 'OK' : `MISSING ${miss.join(',')}`
  console.log(`${mod.padEnd(16)} ${tag.padEnd(30)} orig=${want.size} rewritten=${got.size}`)
}

console.log(`\noriginal slots: ${totalSlots}, missing: ${missing}`)
if (missing > 0) {
  console.error('verify-mounts: FAILED — rewritten modules do not cover all original mount points')
  process.exit(1)
}
console.log('verify-mounts: OK — all mount points covered')
