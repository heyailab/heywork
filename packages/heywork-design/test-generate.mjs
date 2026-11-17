/**
 * Self-test for packages/heywork-design/src/generate.js.
 * Minimal in-memory mocks — no node_modules, no real container.
 */
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { registerGenerateTools } from './src/generate.js'

const key = (path) => (path.length > 1 ? path.replace(/\/+$/, '') : path)
const entry = (name, type = 'file') => ({
  name,
  isDirectory: () => type === 'directory',
  isFile: () => type === 'file',
  isSymbolicLink: () => type === 'symlink',
})

// --- mock resource layer ----------------------------------------------------
const files = new Map([
  ['/assets/design-skill/SKILL.md', Buffer.from('# Design skill')],
  ['/assets/design-skill/references/layouts.md', Buffer.from('Layout guidance for grids.')],
])
const dirs = new Set(['/assets/design-skill', '/assets/design-skill/references'])
const folder = {
  '/assets/design-skill': [
    entry('references', 'directory'),
    entry('SKILL.md'),
    entry('dangling', 'symlink'),
  ],
  '/assets/design-skill/references': [entry('layouts.md')],
}
const resources = {
  resourceExists: (path) => files.has(key(path)) || dirs.has(key(path)),
  resourceIsDirectory: (path) => dirs.has(key(path)),
  readResourceFile: (path) => files.get(key(path)),
  listResourceDirectory: (path) => folder[key(path)] ?? [],
}

// --- mock sandbox fs / working directory ------------------------------------
let lstatValue = { type: 'file', version: 7 }
let statValue = { version: 7 }
let bytesValue = Buffer.from('<!doctype html><html><body>Hello</body></html>')
let contained = true
const fs = {
  resolve: async (path) => (path === '.' ? '/workspace' : `/workspace/${path}`),
  lstat: async () => lstatValue,
  stat: async () => statValue,
  readBytes: async (_target, _signal, limit) => bytesValue.subarray(0, limit),
  contains: () => contained,
}
const workingDirectory = { ensure: async () => '/workspace' }

const registered = []
const deps = {
  defineTool: (descriptor) => descriptor,
  tools: { register: (descriptor) => registered.push(descriptor) },
  resources,
  fs,
  workingDirectory,
}
const config = { assetRoot: '/assets', previewMaxBytes: 262144, resourceMaxBytes: 32768 }
const roots = {
  systems: [],
  systemCatalog: [],
  references: [],
  knowledge: [
    {
      path: 'uma-team/references/quality.md',
      heading: 'Contrast rules',
      text: 'Ensure a contrast ratio of at least 4.5 for body text.',
    },
    {
      path: 'uma-design-craft/references/tokens.md',
      heading: 'Design tokens',
      text: 'Use design tokens for consistent color.',
    },
    {
      path: 'uma-delivery-docs/templates/prd.md',
      heading: 'PRD acceptance criteria',
      text: `${'x'.repeat(1200)} acceptance criteria live here.`,
    },
    {
      path: 'uma-quality-gate/references/contrast.md',
      heading: '对比度检查',
      text: '正文对比度需要达标。',
    },
  ],
}

registerGenerateTools(deps, config, roots)

const byName = (name) => registered.find((tool) => tool.name === name)
const preview = byName('design_preview')
const resourceRead = byName('hey_resource_read')
const knowledge = byName('hey_knowledge_search')
const exec = { agent: {}, signal: undefined }

let checks = 0
const ok = (label) => { checks += 1; console.log(`  ok - ${label}`) }

// --- registration / schema --------------------------------------------------
assert.equal(registered.length, 3)
assert.deepEqual(registered.map((tool) => tool.name), [
  'hey_resource_read', 'design_preview', 'hey_knowledge_search',
])
ok('注册 3 个工具且名字逐字符合冻结契约')

assert.equal(preview.parameters.path.type, 'string')
assert.equal(preview.parameters.path.required, true)
assert.equal(preview.output.schema.additionalProperties, false)
assert.deepEqual(Object.keys(preview.output.schema.properties), ['path', 'html', 'sha256'])
assert.equal(resourceRead.parameters.skill.required, true)
assert.equal(resourceRead.output.schema.type, 'string')
assert.equal(knowledge.output.schema.properties.results.items.properties.score.type, 'integer')
ok('参数/输出 schema 逐字段匹配 spec')

// --- design_preview: normal + render + meta ---------------------------------
const previewArgs = { path: '.design/my-app/home.html' }
const previewResult = await preview.execute(previewArgs, exec)
assert.equal(previewResult.path, previewArgs.path)
assert.equal(previewResult.html, bytesValue.toString('utf8'))
assert.equal(previewResult.sha256, createHash('sha256').update(bytesValue).digest('hex'))
assert.equal(
  preview.output.render(previewArgs, previewResult)[0].text,
  'Static prototype snapshot: .design/my-app/home.html\nSource SHA-256: '
    + `${previewResult.sha256}\nThis previews saved source only; runtime interactions and build/tests remain separate.`,
)
assert.deepEqual(preview.output.presentationMeta(previewArgs, previewResult), {
  kind: 'hey-design-preview', version: 1, ...previewResult,
})
assert.deepEqual(preview.presentCall(previewArgs), {
  card: 'generic', title: 'Preview saved UI prototype', kind: 'read', rawInput: previewArgs,
})
ok('design_preview 正常返回 + render + presentationMeta + presentCall')

// --- design_preview: error branches (逐字) ----------------------------------
await assert.rejects(() => preview.execute(previewArgs, {}),
  /^Error: design_preview requires an Agent Session$/)
await assert.rejects(() => preview.execute({ path: '/tmp/x.html' }, exec),
  /design_preview requires a saved HTML variant under \.design\/<project>\//)
const savedLstat = lstatValue
lstatValue = undefined
await assert.rejects(() => preview.execute(previewArgs, exec),
  /design_preview requires a regular HTML file/)
lstatValue = savedLstat
contained = false
await assert.rejects(() => preview.execute(previewArgs, exec),
  /design_preview path leaves the workspace/)
contained = true
const savedBytes = bytesValue
bytesValue = Buffer.from('\0')
await assert.rejects(() => preview.execute(previewArgs, exec),
  /design_preview requires nonempty UTF-8 HTML text/)
// Known behavior: strict fatal decode of the bounded page tail — no trimming.
bytesValue = Buffer.concat([Buffer.from('ok '), Buffer.from([0xe4])])
await assert.rejects(() => preview.execute(previewArgs, exec), TypeError)
bytesValue = savedBytes
statValue = { version: 8 }
await assert.rejects(() => preview.execute(previewArgs, exec),
  /Prototype changed while reading; retry the preview/)
statValue = { version: 7 }
ok('design_preview 6 条具名错误 + 页尾 UTF-8 原生 TypeError 全部逐字匹配')

// --- hey_resource_read: directory + text ------------------------------------
const dirResult = JSON.parse(await resourceRead.execute({ skill: 'design-skill' }))
assert.equal(dirResult.reference, 'hey-resource://design-skill/')
assert.equal(dirResult.kind, 'directory')
assert.equal(dirResult.nextOffset, null)
assert.deepEqual(dirResult.entries.map((item) => item.name), ['references', 'SKILL.md'])
assert.equal(dirResult.entries.every((item) => item.kind === 'directory' || item.kind === 'file'), true)
ok('hey_resource_read 目录列举：reference/排序/符号链接过滤')

const textResult = await resourceRead.execute({
  skill: 'design-skill', path: 'references/layouts.md',
})
assert.equal(
  textResult,
  'Resource: hey-resource://design-skill/references/layouts.md\n'
    + 'Next byte offset: complete\n\nLayout guidance for grids.',
)
assert.equal(resourceRead.output.render({}, textResult)[0].text, textResult)
ok('hey_resource_read 文本分页格式与 render')

// resource/knowledge execute() throw synchronously by spec (Promise.resolve(throw…));
// wrap them so assert.rejects observes a rejected promise.
const rejectsWith = (fn, expected) => assert.rejects(
  async () => { await fn() },
  expected,
)

// single outward error regardless of internal cause
const outward = 'HEY resource could not be read; use the installed skill name and its relative resource path'
await rejectsWith(() => resourceRead.execute({ skill: 'missing-skill' }),
  (error) => error.message === outward)
await rejectsWith(() => resourceRead.execute({ skill: 'design-skill', path: '../x' }),
  (error) => error.message === outward)
await rejectsWith(() => resourceRead.execute({ skill: 'design-skill', offset: -1 }),
  (error) => error.message === outward)
ok('hey_resource_read 内部异常统一为唯一对外包装错误')

// --- hey_knowledge_search ---------------------------------------------------
const kArgs = { query: 'contrast' }
const kResult = await knowledge.execute(kArgs)
assert.equal(kResult.query, 'contrast')
assert.equal(kResult.results[0].path, 'hey-knowledge://uma-team/references/quality.md')
assert.equal(kResult.results[0].heading, 'Contrast rules')
assert.equal(typeof kResult.results[0].score, 'number')
assert.ok(kResult.results[0].score > 0)
ok('hey_knowledge_search 正常命中 + path/heading/score 结构')

const bigram = await knowledge.execute({ query: '对比度' })
assert.equal(bigram.results[0].path.startsWith('hey-knowledge://'), true)
assert.ok(bigram.results[0].score > 0)
ok('hey_knowledge_search 中文 bigram 展开')

const clamped = await knowledge.execute({ query: 'acceptance criteria', limit: 0, maxSnippetChars: 99999 })
assert.equal(clamped.results.length, 1)
assert.ok(clamped.results[0].snippet.includes('…'))
assert.ok(clamped.results[0].snippet.length <= 2002)
ok('hey_knowledge_search limit/maxSnippetChars 静默钳制')

await rejectsWith(() => knowledge.execute({ query: '   ' }),
  /^Error: hey_knowledge_search requires at least one search term$/)
const empty = await knowledge.execute({ query: 'zzz-no-match' })
assert.deepEqual(empty.results, [])
assert.equal(knowledge.output.render(empty, empty)[0].text,
  'No bundled knowledge matched "zzz-no-match".')
ok('hey_knowledge_search 空 query 错误 + 零匹配 render')

assert.deepEqual(knowledge.presentCall(kArgs), {
  card: 'generic', title: 'Search Uma knowledge: contrast', kind: 'other', rawInput: kArgs,
})
ok('hey_knowledge_search presentCall')

console.log(`\nALL PASS — ${checks} checks, 3 tools registered.`)
