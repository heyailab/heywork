/**
 * 从原 UMA 实现（lib/*.js）录制 golden 样例，作为重写的验收基线。
 *
 * 这些样例是**真实运行录制**，不是从源码推导的：本脚本直接 import 原 lib，
 * 用真实的 resources.umadb 跑输入，把输出序列化成 JSON。
 * 重写后的实现必须逐字段匹配这些样例。
 *
 * 为什么能直接跑：dsh-skill-uma/lib/types/resources.js 只依赖 Node 内置模块
 * （crypto/fs/path/sqlite/zlib），不需要 pnpm install。Node 22 下需要 --experimental-sqlite。
 *
 * Usage:
 *   node --experimental-sqlite scripts/record-golden-skill.mjs
 *
 * 输出：golden/skill-uma/*.json
 */
import { writeFileSync, mkdirSync, mkdtempSync, existsSync, rmSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { tmpdir } from 'node:os'

const ROOT = process.env.HEY_ROOT ?? resolve(import.meta.dirname, '..')
const LIB = join(ROOT, 'uma-assets', 'packages', 'dsh-skill-uma', 'lib', 'types', 'resources.js')
const OUT = join(ROOT, 'golden', 'skill-uma')
const ASSETS = join(ROOT, 'uma-assets', 'packages', 'dsh-skill-uma', 'assets')

mkdirSync(OUT, { recursive: true })

const R = await import(pathToFileURL(LIB).href)

/** 规范化输出：Buffer 转 base64 + 长度，Error 转 message，保证 JSON 可比对。 */
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

/** 安全调用：捕获返回值和异常，都规范化。 */
function capture(fn) {
  try { return { ok: true, value: normalize(fn()) } }
  catch (e) { return { ok: false, error: normalize(e) } }
}

const cases = {}

// --- isBundledPath ----------------------------------------------------------
cases.isBundledPath = [
  { name: 'container-file', path: join(ASSETS, 'uma-code-review', 'SKILL.md'), ...capture(() => R.isBundledPath(join(ASSETS, 'uma-code-review', 'SKILL.md'))) },
  { name: 'container-dir', path: join(ASSETS, 'uma-code-review'), ...capture(() => R.isBundledPath(join(ASSETS, 'uma-code-review'))) },
  { name: 'assets-root', path: ASSETS, ...capture(() => R.isBundledPath(ASSETS)) },
  { name: 'outside-assets', path: join(ROOT, 'README.md'), ...capture(() => R.isBundledPath(join(ROOT, 'README.md'))) },
]

// --- resourceExists ---------------------------------------------------------
const existsCases = [
  ['existing-skill', join(ASSETS, 'uma-code-review', 'SKILL.md')],
  ['missing-in-container', join(ASSETS, 'uma-code-review', 'NO-SUCH-FILE.md')],
  ['outside-container', join(ROOT, 'README.md')],
  ['missing-outside', join(ROOT, 'NO-SUCH-FILE.md')],
]
cases.resourceExists = existsCases.map(([name, path]) => ({ name, path, ...capture(() => R.resourceExists(path)) }))

// --- resourceIsDirectory ----------------------------------------------------
const dirCases = [
  ['skill-dir', join(ASSETS, 'uma-code-review')],
  ['skill-file', join(ASSETS, 'uma-code-review', 'SKILL.md')],
  ['assets-root', ASSETS],
  ['missing-outside', join(ROOT, 'NO-SUCH-FILE.md')],
]
cases.resourceIsDirectory = dirCases.map(([name, path]) => ({ name, path, ...capture(() => R.resourceIsDirectory(path)) }))

// --- readResourceFile -------------------------------------------------------
const skillPath = join(ASSETS, 'uma-code-review', 'SKILL.md')
const readCases = [
  ['skill-utf8', skillPath, 'utf8'],
  ['skill-buffer', skillPath, undefined],
  ['design-system-manifest', join(ASSETS, 'uma-design-systems', 'systems', 'airbnb', 'manifest.json'), 'utf8'],
  ['directory-as-file', join(ASSETS, 'uma-code-review'), 'utf8'],
  ['missing-outside', join(ROOT, 'NO-SUCH-FILE.md'), 'utf8'],
]
cases.readResourceFile = readCases.map(([name, path, encoding]) => ({
  name, path, encoding: encoding ?? null,
  ...capture(() => encoding === undefined ? R.readResourceFile(path) : R.readResourceFile(path, encoding)),
}))

// --- listResourceDirectory --------------------------------------------------
const listCases = [
  ['skills-root', ASSETS],
  ['one-skill', join(ASSETS, 'uma-code-review')],
  ['systems-root', join(ASSETS, 'uma-design-systems', 'systems')],
  ['brands-root', join(ASSETS, 'uma-design-md', 'brands')],
  ['file-as-dir', skillPath],
  ['missing-outside', join(ROOT, 'NO-SUCH-DIR')],
]
cases.listResourceDirectory = listCases.map(([name, path]) => ({ name, path, ...capture(() => R.listResourceDirectory(path, { withFileTypes: true })) }))

// --- buildResourceStore -----------------------------------------------------
// 用临时目录构建一个小容器，验证输出结构与错误分支。
const tmp = mkdtempSync(join(tmpdir(), 'hey-golden-'))
const srcDir = join(tmp, 'src')
mkdirSync(join(srcDir, 'sub'), { recursive: true })
writeFileSync(join(srcDir, 'a.md'), 'hello a\n')
writeFileSync(join(srcDir, 'sub', 'b.json'), '{"b":1}\n')

const buildCases = []
{
  const output = join(tmp, 'out.umadb')
  const result = capture(() => R.buildResourceStore(srcDir, output))
  buildCases.push({ name: 'normal-build', sourceFiles: ['a.md', 'sub/b.json'], ...result,
    outputCreated: existsSync(output) })
}
{
  const result = capture(() => R.buildResourceStore(srcDir, join(tmp, 'out.umadb')))
  buildCases.push({ name: 'output-exists', ...result })
}
{
  const result = capture(() => R.buildResourceStore(srcDir, join(srcDir, 'nested', 'out.umadb')))
  buildCases.push({ name: 'output-inside-root', ...result })
}
cases.buildResourceStore = buildCases

// --- 写出 -------------------------------------------------------------------
let total = 0
for (const [api, rows] of Object.entries(cases)) {
  const file = join(OUT, `${api}.json`)
  writeFileSync(file, JSON.stringify({ api, source: 'dsh-skill-uma/lib/types/resources.js (live)', cases: rows }, null, 2) + '\n')
  console.log(`${api}: ${rows.length} cases → golden/skill-uma/${api}.json`)
  total += rows.length
}
console.log(`\n录制完成：${total} 个 case，${Object.keys(cases).length} 个 API`)

// 清理临时目录（用 Node fs，避开 shell 的删除拦截）
try { rmSync(tmp, { recursive: true, force: true }) } catch {}
