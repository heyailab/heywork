/**
 * packages/heywork-delivery 自测（spec: specs/delivery.md）。
 * 运行：node packages/heywork-delivery/test-delivery.mjs
 */
import assert from 'node:assert/strict'
import * as m from './src/index.js'

const {
  ARTIFACTS,
  BUILTIN_CODING_GUIDES,
  CODING_STANDARD_RULES,
  CODING_STANDARD_SOURCES,
  REQUIRED_ARTIFACTS,
  evaluateArtifact,
  evaluateCheckpoint,
  evaluateGate,
  parseUmaSshTarget,
  redactDevelopmentText,
  requiredArtifacts,
  selectCodingStandards,
  splitFrontmatter,
  umaSshUri
} = m

let cases = 0
function check(name, fn) {
  fn()
  cases += 1
  console.log(`ok ${cases} - ${name}`)
}

// ---------------------------------------------------------------------------
// 1. 导出面（spec §2 / E:13-28）
// ---------------------------------------------------------------------------
check('14 个导出存在且顺序与 spec 一致', () => {
  assert.deepEqual(Object.keys(m), [
    'ARTIFACTS',
    'BUILTIN_CODING_GUIDES',
    'CODING_STANDARD_RULES',
    'CODING_STANDARD_SOURCES',
    'REQUIRED_ARTIFACTS',
    'evaluateArtifact',
    'evaluateCheckpoint',
    'evaluateGate',
    'parseUmaSshTarget',
    'redactDevelopmentText',
    'requiredArtifacts',
    'selectCodingStandards',
    'splitFrontmatter',
    'umaSshUri'
  ])
  for (const key of Object.keys(m)) assert.ok(m[key] !== undefined, key)
})

// ---------------------------------------------------------------------------
// 2. 常量表（spec §1.2 / §3-§7）
// ---------------------------------------------------------------------------
check('ARTIFACTS 八类且含 preview；运行时未冻结', () => {
  assert.deepEqual(ARTIFACTS, ['research', 'prd', 'architecture', 'uiux', 'spec', 'preview', 'qa', 'delivery'])
  assert.equal(ARTIFACTS.length, 8)
  assert.equal(Object.isFrozen(ARTIFACTS), false)
})

check('REQUIRED_ARTIFACTS 七件且不含 preview；运行时未冻结', () => {
  assert.deepEqual(REQUIRED_ARTIFACTS, ['research', 'prd', 'architecture', 'uiux', 'spec', 'qa', 'delivery'])
  assert.equal(REQUIRED_ARTIFACTS.length, 7)
  assert.equal(REQUIRED_ARTIFACTS.includes('preview'), false)
  assert.equal(Object.isFrozen(REQUIRED_ARTIFACTS), false)
})

check('CODING_STANDARD_SOURCES 12 项，id 顺序与冻结一致', () => {
  assert.equal(CODING_STANDARD_SOURCES.length, 12)
  assert.deepEqual(CODING_STANDARD_SOURCES.map((s) => s.id), [
    'w3c-wcag22', 'postgres-isolation', 'google-review',
    'alibaba-p3c', 'google-ts', 'python-pep8', 'go-review',
    'microsoft-dotnet', 'microsoft-rest', 'uber-go', 'owasp-asvs5', 'tencent-secguide'
  ])
  assert.equal(Object.isFrozen(CODING_STANDARD_SOURCES), true)
  assert.equal(Object.isFrozen(CODING_STANDARD_SOURCES[0]), true)
  assert.equal(CODING_STANDARD_SOURCES[0].notice.includes('Copyright © 2020–2024 World Wide Web Consortium'), true)
})

check('CODING_STANDARD_RULES 23 项，顺序与冻结一致', () => {
  assert.equal(CODING_STANDARD_RULES.length, 23)
  assert.deepEqual(CODING_STANDARD_RULES.map((r) => r.id), [
    'HEY.STD.KEYBOARD_FOCUS', 'HEY.STD.ACCESSIBLE_ERRORS', 'HEY.STD.TRANSACTION_RETRY',
    'HEY.STD.REVIEW_COUNTEREXAMPLE', 'HEY.STD.ORDER_REPLAY', 'HEY.STD.TENANT_SCOPE',
    'HEY.STD.PROJECT_PRECEDENCE', 'HEY.STD.SEMANTIC_NAMES', 'HEY.STD.JAVA_LAYERING',
    'HEY.STD.JAVA_RESOURCE_LIFETIME', 'HEY.STD.TS_UNTRUSTED_TYPES', 'HEY.STD.TS_MODULE_BOUNDARIES',
    'HEY.STD.PYTHON_PUBLIC_NAMES', 'HEY.STD.GO_PACKAGES', 'HEY.STD.GO_ERRORS_CONTEXT',
    'HEY.STD.GO_GOROUTINE_LIFETIME', 'HEY.STD.DOTNET_PUBLIC_NAMING', 'HEY.STD.API_COMPATIBILITY',
    'HEY.STD.AUTHORIZATION_RESOURCE', 'HEY.STD.INPUT_PARAMETERIZATION', 'HEY.STD.SECRET_HANDLING',
    'HEY.STD.FILE_PATH_SCOPE', 'HEY.STD.OUTBOUND_TARGET_SCOPE'
  ])
  assert.equal(Object.isFrozen(CODING_STANDARD_RULES), true)
  const rule = CODING_STANDARD_RULES[0]
  assert.equal(Object.isFrozen(rule), true)
  assert.equal(Object.isFrozen(rule.languages), true)
  assert.equal(Object.isFrozen(rule.sourceIds), true)
  assert.equal(Object.isFrozen(rule.summary), true)
  const orderReplay = CODING_STANDARD_RULES.find((r) => r.id === 'HEY.STD.ORDER_REPLAY')
  assert.deepEqual(orderReplay.sourceIds, ['microsoft-rest', 'postgres-isolation'])
})

check('BUILTIN_CODING_GUIDES 14 项（9 内置 + 5 工程），顺序与冻结一致', () => {
  assert.equal(BUILTIN_CODING_GUIDES.length, 14)
  assert.deepEqual(BUILTIN_CODING_GUIDES.map((g) => g.id), [
    'architecture-and-naming', 'typescript-and-frontend', 'java-services', 'go-services',
    'python-projects', 'dotnet-apis', 'http-api-contracts', 'secure-boundaries',
    'testing-and-review', 'accessible-product-ui', 'database-concurrency',
    'review-evidence', 'order-payment-lifecycle', 'saas-tenant-authorization'
  ])
  assert.deepEqual(BUILTIN_CODING_GUIDES.slice(0, 9).map((g) => g.version), Array(9).fill('2026.11.09.1'))
  assert.deepEqual(BUILTIN_CODING_GUIDES.slice(9).map((g) => g.version), Array(5).fill('2026.11.12.1'))
  assert.equal(Object.isFrozen(BUILTIN_CODING_GUIDES), true)
  const g = BUILTIN_CODING_GUIDES[0]
  assert.equal(Object.isFrozen(g), true)
  assert.equal(Object.isFrozen(g.languages), true)
  assert.equal(Object.isFrozen(g.sourceIds), true)
  assert.equal(Object.isFrozen(g.title), true)
  assert.equal(Object.isFrozen(g.body), true)
  assert.ok(g.body.zh.includes('UMA 验证流程'))
  assert.ok(g.body.en.includes('UMA verification'))
})

// ---------------------------------------------------------------------------
// 3. splitFrontmatter（spec §15）
// ---------------------------------------------------------------------------
check('splitFrontmatter 正常 / CRLF / 无闭合 / 空串 / 闭合在结尾', () => {
  assert.deepEqual(splitFrontmatter('---\nstatus: draft\n---\nBODY'), { frontmatter: 'status: draft', body: 'BODY' })
  assert.deepEqual(splitFrontmatter('---\r\nstatus: draft\r\n---\r\nBODY'), { frontmatter: 'status: draft', body: 'BODY' })
  assert.deepEqual(splitFrontmatter('---\nstatus: draft\nBODY'), { frontmatter: '', body: '---\nstatus: draft\nBODY' })
  assert.deepEqual(splitFrontmatter(''), { frontmatter: '', body: '' })
  assert.deepEqual(splitFrontmatter('---\na: b\n---'), { frontmatter: 'a: b', body: '' })
  assert.deepEqual(splitFrontmatter('---\na: 1\n---\nX\n---\na: 2\n---\nY'), { frontmatter: 'a: 1', body: 'X\n---\na: 2\n---\nY' })
})

// ---------------------------------------------------------------------------
// 4. evaluateArtifact（spec §9）
// ---------------------------------------------------------------------------
check('evaluateArtifact 通过分支：section 齐全、无占位符、ready:true', () => {
  const r = evaluateArtifact('research', '---\nstatus: approved\nowner: alice\nupdated: 2026-11-18\n---\n## Finding\nA finding.\n## Open question\nAny blockers?\n')
  assert.equal(r.status, 'approved')
  assert.equal(r.owner, 'alice')
  assert.equal(r.updated, '2026-11-18')
  assert.deepEqual(r.missingSections, [])
  assert.deepEqual(r.placeholders, [])
  assert.equal(r.ready, true)
  assert.ok(r.body.startsWith('## Finding'))
})

check('evaluateArtifact 失败分支：缺 section + TODO/lorem 去重大写', () => {
  const r = evaluateArtifact('research', '---\nstatus: reviewed\n---\nTODO fix TODOX lorem ipsum FIXME\n')
  assert.equal(r.status, 'unknown') // reviewed 非法
  assert.equal(r.owner, null)
  assert.equal(r.updated, null)
  assert.deepEqual(r.missingSections, ['finding|发现', 'open question|待定|未决'])
  assert.deepEqual(r.placeholders, ['TODO', 'LOREM IPSUM', 'FIXME'])
  assert.equal(r.ready, false)
})

check('evaluateArtifact draft / 缺 status / CRLF / 空串', () => {
  const draft = evaluateArtifact('qa', '---\r\nstatus: draft\r\n---\r\ngate result')
  assert.equal(draft.status, 'draft')
  assert.equal(draft.ready, true)
  assert.deepEqual(draft.missingSections, [])
  const noStatus = evaluateArtifact('qa', '---\nowner: bob\n---\nresult')
  assert.equal(noStatus.status, 'unknown')
  assert.equal(noStatus.owner, 'bob')
  const empty = evaluateArtifact('research', '')
  assert.deepEqual(empty, {
    status: 'unknown', owner: null, updated: null, body: '',
    missingSections: ['finding|发现', 'open question|待定|未决'], placeholders: [], ready: false
  })
})

// ---------------------------------------------------------------------------
// 5. requiredArtifacts 五分支（spec §12）
// ---------------------------------------------------------------------------
check('requiredArtifacts 五分支 + 非法值落入默认 + product/delivery 返回常量引用', () => {
  assert.deepEqual(requiredArtifacts('patch', 'documents'), [])
  assert.deepEqual(requiredArtifacts('patch', 'delivery'), [])
  assert.deepEqual(requiredArtifacts('feature', 'documents'), ['spec'])
  assert.deepEqual(requiredArtifacts('feature', 'delivery'), ['spec', 'qa', 'delivery'])
  assert.deepEqual(requiredArtifacts('product', 'documents'), ['research', 'prd', 'architecture', 'uiux'])
  assert.strictEqual(requiredArtifacts('product', 'delivery'), REQUIRED_ARTIFACTS)
  assert.strictEqual(requiredArtifacts('weird', 'weird'), REQUIRED_ARTIFACTS)
  assert.deepEqual(requiredArtifacts('feature', 'weird'), ['spec', 'qa', 'delivery'])
})

// ---------------------------------------------------------------------------
// 6. evaluateGate（spec §10）
// ---------------------------------------------------------------------------
const allReady = REQUIRED_ARTIFACTS.map((artifact) => ({ artifact, ready: true }))

check('evaluateGate 全套齐 → ready；空 → 缺 7 件', () => {
  assert.deepEqual(evaluateGate(allReady), { ready: true, missing: [], blocked: [] })
  const empty = evaluateGate([])
  assert.deepEqual(empty.missing, REQUIRED_ARTIFACTS)
  assert.deepEqual(empty.blocked, REQUIRED_ARTIFACTS)
  assert.equal(empty.ready, false)
})

check('evaluateGate 缺件、preview 不 ready 也进 blocked、重复项', () => {
  const partial = evaluateGate([{ artifact: 'research', ready: true }, { artifact: 'prd', ready: true }])
  assert.deepEqual(partial.missing, ['architecture', 'uiux', 'spec', 'qa', 'delivery'])
  assert.deepEqual(partial.blocked, partial.missing)
  const withPreview = evaluateGate([...allReady, { artifact: 'preview', ready: false }])
  assert.deepEqual(withPreview.missing, [])
  assert.deepEqual(withPreview.blocked, ['preview'])
  assert.equal(withPreview.ready, false)
  const dupe = evaluateGate([...allReady.filter((e) => e.artifact !== 'qa'), { artifact: 'qa', ready: false }, { artifact: 'qa', ready: false }])
  assert.deepEqual(dupe.blocked, ['qa', 'qa'])
})

// ---------------------------------------------------------------------------
// 7. evaluateCheckpoint（spec §11）
// ---------------------------------------------------------------------------
check('evaluateCheckpoint patch 恒 ready；非必需 preview 不阻塞', () => {
  assert.deepEqual(evaluateCheckpoint([], 'patch', 'delivery'), { ready: true, missing: [], blocked: [] })
  assert.deepEqual(evaluateCheckpoint([{ artifact: 'preview', ready: false }], 'patch', 'documents'), { ready: true, missing: [], blocked: [] })
  assert.deepEqual(evaluateCheckpoint([{ artifact: 'spec', ready: true }, { artifact: 'preview', ready: false }], 'feature', 'documents'), { ready: true, missing: [], blocked: [] })
})

check('evaluateCheckpoint 各阶段缺件 / 阻塞 / 重复（与 evaluateGate 的差异）', () => {
  const missingSpec = evaluateCheckpoint([], 'feature', 'documents')
  assert.deepEqual(missingSpec, { ready: false, missing: ['spec'], blocked: ['spec'] })
  const dupe = evaluateCheckpoint([{ artifact: 'spec', ready: false }, { artifact: 'spec', ready: false }], 'feature', 'documents')
  assert.deepEqual(dupe.blocked, ['spec', 'spec'])
  const featureDelivery = evaluateCheckpoint([{ artifact: 'spec', ready: true }], 'feature', 'delivery')
  assert.deepEqual(featureDelivery.missing, ['qa', 'delivery'])
  const productDocs = evaluateCheckpoint([{ artifact: 'research', ready: true }], 'product', 'documents')
  assert.deepEqual(productDocs.missing, ['prd', 'architecture', 'uiux'])
  const productDelivery = evaluateCheckpoint([...allReady, { artifact: 'preview', ready: false }], 'product', 'delivery')
  assert.deepEqual(productDelivery, { ready: true, missing: [], blocked: [] })
})

// ---------------------------------------------------------------------------
// 8. parseUmaSshTarget / umaSshUri（spec §13 / §16）
// ---------------------------------------------------------------------------
check('parseUmaSshTarget 正常输入', () => {
  assert.deepEqual(parseUmaSshTarget('alice@example.com'), { user: 'alice', host: 'example.com', port: 22 })
  assert.deepEqual(parseUmaSshTarget('ssh -p 2222 alice@example.com'), { user: 'alice', host: 'example.com', port: 2222 })
  assert.deepEqual(parseUmaSshTarget('ssh alice@example.com -p 2200'), { user: 'alice', host: 'example.com', port: 2200 })
  assert.deepEqual(parseUmaSshTarget('ssh://alice@example.com:2022'), { user: 'alice', host: 'example.com', port: 2022 })
  assert.deepEqual(parseUmaSshTarget('alice@[::1]:2222'), { user: 'alice', host: '::1', port: 2222 })
  assert.deepEqual(parseUmaSshTarget('  alice@example.com  '), { user: 'alice', host: 'example.com', port: 22 })
  assert.deepEqual(parseUmaSshTarget('alice@example.com.'), { user: 'alice', host: 'example.com.', port: 22 })
})

check('parseUmaSshTarget 畸形输入全部返回 undefined', () => {
  const bad = [
    '', '   ',
    'ssh -p 1 alice@example.com -p 2',
    'ssh -p 2222 alice@example.com:22',
    'alice@example.com:0',
    'alice@example.com:65536',
    'x'.repeat(321),
    'alice@-bad.example.com',
    'alice@example..com',
    'alice@[1:2:3:4:5:6:7:8:9]', // 正则命中但 new URL 校验失败
    'alice@[gg::1]',
    'alice:pw@example.com',
    'admin@example.com; rm -rf /'
  ]
  for (const input of bad) assert.equal(parseUmaSshTarget(input), undefined, input)
})

check('umaSshUri 格式化 + IPv6 方括号 + 往返', () => {
  assert.equal(umaSshUri({ user: 'alice', host: 'example.com', port: 22 }), 'ssh://alice@example.com:22')
  assert.equal(umaSshUri({ user: 'alice', host: '::1', port: 2222 }), 'ssh://alice@[::1]:2222')
  const target = parseUmaSshTarget('ssh -p 2222 alice@[::1]')
  assert.deepEqual(target, { user: 'alice', host: '::1', port: 2222 })
  assert.equal(umaSshUri(target), 'ssh://alice@[::1]:2222')
})

// ---------------------------------------------------------------------------
// 9. redactDevelopmentText（spec §14）
// ---------------------------------------------------------------------------
check('redactDevelopmentText 四条规则脱敏', () => {
  assert.equal(redactDevelopmentText('Authorization: Bearer abcDEF._~-123'), 'Authorization: Bearer [redacted]')
  assert.equal(redactDevelopmentText('BEARER xyz'), 'BEARER [redacted]')
  // 规则 3 会继续匹配规则 2 产出的 `token=[redacted]&api_key=abc`，
  // 且其值类 [^\s,;]+ 允许 '&'，因此尾部被吞掉——这是"不修正正则边界"的链式已知行为。
  assert.equal(redactDevelopmentText('GET /x?token=s3cr3t&api_key=abc'), 'GET /x?token=[redacted]')
  assert.equal(redactDevelopmentText('password: hunter2; next'), 'password: [redacted]; next')
  assert.equal(redactDevelopmentText('access_token=abc123, done'), 'access_token=[redacted], done')
  assert.equal(redactDevelopmentText('use sk-abcdefghijklmnopqrst now'), 'use [redacted] now')
  assert.equal(redactDevelopmentText('sk-short123456789'), 'sk-short123456789') // 不足 16 个
  assert.equal(redactDevelopmentText('nothing to hide'), 'nothing to hide')
  assert.equal(redactDevelopmentText(''), '')
})

// ---------------------------------------------------------------------------
// 10. selectCodingStandards（spec §8，重点 && 优先级）
// ---------------------------------------------------------------------------
check('selectCodingStandards 别名归一 / nodejs 连带 javascript / 大小写空白', () => {
  const sel = selectCodingStandards([' ts ', 'NODE', 'node.js', 'TS', '', 'all'])
  assert.equal(sel.catalogVersion, '2026.11.12.1')
  assert.deepEqual(sel.languages, ['javascript', 'nodejs', 'typescript'])
  const ids = sel.rules.map((r) => r.id)
  assert.ok(ids.includes('HEY.STD.TS_UNTRUSTED_TYPES'))
  assert.ok(ids.includes('HEY.STD.TS_MODULE_BOUNDARIES'))
  assert.ok(ids.includes('HEY.STD.FILE_PATH_SCOPE')) // nodejs
  assert.ok(sel.guides.map((g) => g.id).includes('typescript-and-frontend'))
  assert.equal(Object.isFrozen(sel), true)
  assert.equal(Object.isFrozen(sel.rules), true)
  assert.equal(Object.isFrozen(sel.guides), true)
  assert.equal(Object.isFrozen(sel.sources), true)
  assert.equal(Object.isFrozen(sel.policy), true)
  assert.equal(Object.isFrozen(sel.languages), true)
})

check('selectCodingStandards 空数组：默认选中所有 all 标签项；显式关闭则为空', () => {
  const on = selectCodingStandards([])
  assert.deepEqual(on.languages, [])
  assert.deepEqual(on.rules.map((r) => r.id), [
    'HEY.STD.REVIEW_COUNTEREXAMPLE', 'HEY.STD.PROJECT_PRECEDENCE',
    'HEY.STD.SEMANTIC_NAMES', 'HEY.STD.SECRET_HANDLING'
  ])
  assert.deepEqual(on.guides.map((g) => g.id), [
    'architecture-and-naming', 'secure-boundaries', 'testing-and-review', 'review-evidence'
  ])
  const off = selectCodingStandards([], { includeGeneral: false })
  assert.deepEqual(off.rules, [])
  assert.deepEqual(off.guides, [])
  assert.deepEqual(off.sources, [])
})

check('selectCodingStandards && 优先级：includeGeneral:false 时已选标签仍命中（禁止加括号修正）', () => {
  const sel = selectCodingStandards(['typescript'], { includeGeneral: false })
  assert.deepEqual(sel.languages, ['typescript'])
  const ids = sel.rules.map((r) => r.id)
  // 无括号语义：selected.has('typescript') 为真 → 即使 includeGeneral:false 也命中
  assert.ok(ids.includes('HEY.STD.TS_UNTRUSTED_TYPES'), '已选标签必须命中')
  assert.ok(ids.includes('HEY.STD.TS_MODULE_BOUNDARIES'), '已选标签必须命中')
  assert.ok(sel.guides.map((g) => g.id).includes('typescript-and-frontend'), '已选标签的指南必须命中')
  // 但纯 "all" 项必须被 includeGeneral:false 挡住（两种括号语义在此点相同，进一步佐证 gating 生效）
  assert.equal(ids.includes('HEY.STD.PROJECT_PRECEDENCE'), false)
  assert.equal(sel.guides.map((g) => g.id).includes('secure-boundaries'), false)
  // 若为 (selected.has(tag) || tag === "all") && includeGeneral !== false，上方两个 assert.ok 会全部失败
})

check('selectCodingStandards 未知标签不猜框架；sources 为选中并集子集；policy 逐字', () => {
  const unknown = selectCodingStandards(['ruby'])
  assert.deepEqual(unknown.languages, ['ruby'])
  assert.deepEqual(unknown.rules.map((r) => r.id).sort(), [
    'HEY.STD.PROJECT_PRECEDENCE', 'HEY.STD.REVIEW_COUNTEREXAMPLE',
    'HEY.STD.SECRET_HANDLING', 'HEY.STD.SEMANTIC_NAMES'
  ].sort())
  assert.equal(unknown.guides.some((g) => g.languages.includes('ruby')), false)

  const go = selectCodingStandards(['go'])
  const expectedIds = new Set([...go.rules, ...go.guides].flatMap((v) => v.sourceIds))
  assert.deepEqual(go.sources.map((s) => s.id), CODING_STANDARD_SOURCES.filter((s) => expectedIds.has(s.id)).map((s) => s.id))
  assert.ok(go.sources.length > 0)
  assert.deepEqual(go.policy, {
    projectRulesFirst: true,
    selectedRulesAreNotVerified: true,
    requiredChecksNeedReceipts: true,
    notes: {
      zh: '项目规则优先；外部规范按语言和任务选用。选择规则不等于验证通过；缺少实际检查或评审证据时保持未验证。',
      en: 'Project rules take precedence. Select external guidance by language and task; selection is not verification. Missing check or review evidence remains unverified.'
    }
  })
})

console.log(`\nAll ${cases} checks passed.`)
