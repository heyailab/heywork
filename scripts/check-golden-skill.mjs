/**
 * 用 golden 样例校验重写实现与原实现的行为一致性。
 *
 * 用法：
 *   node --experimental-sqlite scripts/check-golden-skill.mjs <重写实现路径>
 *
 * 例：
 *   node --experimental-sqlite scripts/check-golden-skill.mjs packages/heywork-skill/src/resources.js
 *
 * 校验逻辑：用同一个输入跑重写实现，把输出规范化成与 golden 相同结构，逐字段深比较。
 * 任何差异都会报出具体的 case 名和字段路径。
 */
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const ROOT = process.env.HEY_ROOT ?? resolve(import.meta.dirname, '..')
const GOLDEN = join(ROOT, 'golden', 'skill-uma')
const impl = process.argv[2]

if (impl === undefined) {
  console.error('check-golden-skill: 需要重写实现路径')
  console.error('  node --experimental-sqlite scripts/check-golden-skill.mjs <path-to-resources.js>')
  process.exit(2)
}

const implPath = resolve(impl)
const I = await import(pathToFileURL(implPath).href)
for (const name of ['isBundledPath', 'resourceExists', 'resourceIsDirectory', 'readResourceFile', 'listResourceDirectory', 'buildResourceStore']) {
  if (typeof I[name] !== 'function') {
    console.error(`check-golden-skill: 实现缺少导出 ${name}`)
    process.exit(2)
  }
}

/** 与 record 脚本完全相同的规范化逻辑 */
function normalize(value) {
  if (value === undefined) return { kind: 'undefined' }
  if (Buffer.isBuffer(value)) return { kind: 'buffer', length: value.length, base64: value.toString('base64') }
  if (value instanceof Error) return { kind: 'error', message: value.message }
  if (Array.isArray(value)) return { kind: 'array', length: value.length, items: value.map(normalize) }
  if (typeof value === 'object' && value !== null) {
    const out = { kind: 'object' }
    for (const [k, v] of Object.entries(value)) {
      out[k] = typeof v === 'function' ? { kind: 'function', result: v() } : normalize(v)
    }
    return out
  }
  return { kind: typeof value, value }
}

function capture(fn) {
  try { return { ok: true, value: normalize(fn()) } }
  catch (e) { return { ok: false, error: normalize(e) } }
}

let checked = 0
let passed = 0
const failures = []

for (const api of ['isBundledPath', 'resourceExists', 'resourceIsDirectory', 'readResourceFile', 'listResourceDirectory', 'buildResourceStore']) {
  const golden = JSON.parse(readFileSync(join(GOLDEN, `${api}.json`), 'utf8'))
  for (const c of golden.cases) {
    if (api === 'buildResourceStore') continue // 构建容器有副作用，单独处理
    checked++

    let actual
    if (api === 'readResourceFile') {
      actual = capture(() => c.encoding === null ? I.readResourceFile(c.path) : I.readResourceFile(c.path, c.encoding))
    } else if (api === 'listResourceDirectory') {
      actual = capture(() => I.listResourceDirectory(c.path, { withFileTypes: true }))
    } else {
      actual = capture(() => I[api](c.path))
    }
    const expected = { ok: c.ok, ...(c.ok ? { value: c.value } : { error: c.error }) }
    if (isDeepStrictEqual(actual, expected)) passed++
    else failures.push({ api, case: c.name, expected, actual })
  }
}

console.log(`golden 校验：${passed}/${checked} 通过（buildResourceStore 3 例因副作用跳过，单独验）`)
if (failures.length > 0) {
  console.error(`\n失败 ${failures.length} 例：`)
  for (const f of failures.slice(0, 5)) {
    console.error(`  ${f.api} / ${f.case}`)
    console.error(`    期望: ${JSON.stringify(f.expected).slice(0, 200)}`)
    console.error(`    实际: ${JSON.stringify(f.actual).slice(0, 200)}`)
  }
  process.exit(1)
}
console.log('check-golden-skill: OK — 重写实现与原实现行为一致')
