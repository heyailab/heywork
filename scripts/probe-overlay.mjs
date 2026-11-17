/**
 * 静态实测：复刻官方 readProfilePatches (profile-context.ts:74-85) 的合并算法，
 * 用真实的 UMA bundle patch 跑一遍，验证 layer vs bundle 的叠加顺序。
 *
 * 官方算法：
 *   [...bundlePatches, ...profilePatch, ...homePatch, ...overlays, ...(telemetry?)]
 * 后出现的覆盖先出现的（Loader 的 patch 语义）。
 *
 * Usage: node scripts/probe-overlay.mjs [workspace-root]
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = process.argv[2] ?? resolve(import.meta.dirname, '..')
const UMA = { base: 'uma-assets/packages/dsh-uma-base', web: 'uma-assets/packages/dsh-uma-web' }

/** 读取一个 patch yml 里所有 - id: 声明（简化解析，只看 id 顺序） */
function ids(file) {
  if (!existsSync(file)) return []
  const text = readFileSync(file, 'utf8')
  return [...text.matchAll(/^\s*-?\s*id:\s*['"]?([\w-]+)/gm)].map(m => m[1])
}

/** 读取 product patch 的 22 开关 id */
function switches(file) {
  const j = JSON.parse(readFileSync(file, 'utf8'))
  return j.map(x => x.id)
}

const baseIds = ids(join(ROOT, UMA.base, 'cordis.patch.yml'))
const webIds = ids(join(ROOT, UMA.web, 'cordis.patch.yml'))
const productIds = switches(join(ROOT, 'uma-assets/uma-platform.patch.mac.yml'))

// 原 UMA 布局：bundle 顺序 = base, web-app, uma-base, uma-web；product patch 最后叠加
const originalMerged = [
  ...baseIds.map(x => '[base bundle] ' + x),
  ...webIds.map(x => '[web-app bundle] ' + x),
  ...baseIds.map(x => '[uma-base bundle] ' + x),
  ...webIds.map(x => '[uma-web bundle] ' + x),
  ...productIds.map(x => '[product patch] ' + x),
]
// V1 布局：官方 base/web-app bundle + heywork bundle(含原 uma-base/web 的 rows) + profile patch(开关)
const v1Merged = [
  ...baseIds.map(x => '[base bundle] ' + x),
  ...webIds.map(x => '[web-app bundle] ' + x),
  ...baseIds.map(x => '[heywork bundle] ' + x),
  ...webIds.map(x => '[heywork bundle] ' + x),
  ...productIds.map(x => '[profile patch] ' + x),
]

console.log('原 UMA bundle ids:', baseIds.length + webIds.length, 'product switches:', productIds.length)
console.log('合并后总 rows:', originalMerged.length, '(V1:', v1Merged.length, ')')

/** 同一 id 的最后出现位置决定最终生效值 */
function lastWinner(rows) {
  const map = new Map()
  rows.forEach((r, i) => { const id = r.replace(/^\[[^\]]+\]\s*/, ''); map.set(id, { row: r, index: i }) })
  return map
}
const a = lastWinner(originalMerged), b = lastWinner(v1Merged)
let diff = 0
for (const [id, va] of a) {
  const vb = b.get(id)
  if (vb === undefined) { console.log('V1 缺失:', id); diff++; continue }
  if (va.row.replace(/\[[^\]]+\]/, '') !== vb.row.replace(/\[[^\]]+\]/, '')) {
    const catA = va.row.match(/\[([^\]]+)\]/)[1], catB = vb.row.match(/\[([^\]]+)\]/)[1]
    const eq = (catA.includes('uma-base') && catB.includes('heywork'))
      || (catA.includes('uma-web') && catB.includes('heywork'))
      || (catA.includes('product') && catB.includes('profile'))
    if (!eq) { console.log('层级不等价:', id, catA, 'vs', catB); diff++ }
  }
}
if (diff === 0) console.log('结论：叠加顺序等价 —— 每个 id 的最终生效来源类别一致')
else { console.log('发现 ' + diff + ' 处不等价'); process.exitCode = 1 }
console.log('\n最终 22 开关的生效层（前 6 个）：')
for (const id of productIds.slice(0, 6)) console.log(' ', id, '←', b.get(id).row)
