/**
 * knowledge 模块挂载契约测试（从 specs/ui-knowledge.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-knowledge.mjs
 */
import { runModule } from './harness/loader.js'

const r = await runModule('./packages/heywork-ui/src/knowledge.client.js', {
  config: { showBuiltinStandards: false, refreshMs: 2000 },
})
let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }

// §1.1 / §2.3 — identity & export surface (browser side per spec §二).
ok(r.id === '@heywork/dsh-client-ui-knowledge', 'module id')
ok(r.exports.join(',') === 'Config,apply,inject', `export surface = ${r.exports.join(',')}`)

// §2.1 — Config schema defaults.
ok(r.Config?.showBuiltinStandards === false, 'Config.showBuiltinStandards default false')
ok(r.Config?.refreshMs === 2000, 'Config.refreshMs default 2000')

// §4.1 — browser ctx-service inject (6 items, source-level frozen list).
const injectLine = (r.source.match(/const inject = \[[^\]]*\]/) || [''])[0]
const browserInject = [...injectLine.matchAll(/'([^']+)'/g)].map(m => m[1])
ok(browserInject.join(',') === 'slots,locale,remote,remote.knowledge,uiWorkspace,workspaces',
  `browser inject = ${browserInject.join(',')}`)

// §5.2 / §6.1 — the four injected slot names; dedupe via Set (harness records inject + inner register).
const slots = r.calls.slots
const injectNames = [...new Set(slots.filter(s => s.op === 'inject').map(s => s.name))]
const expectedInject = [
  'main', 'main.knowledge.library', 'main.knowledge.experience', 'sidebar.panellist',
]
for (const s of expectedInject) ok(injectNames.includes(s), `slot inject: ${s}`)
ok(injectNames.length === expectedInject.length,
  `distinct injected slot count = ${expectedInject.length} (got ${injectNames.length})`)
ok(slots.some(s => s.op === 'register' && s.name === 'main'), 'main entry registered via slots.register')

// §4.5 / §5.2 — main.knowledge.wiki is reserved via children and only probed/subscribed here.
ok(r.source.includes("'main.knowledge.wiki'"), 'frozen wiki sub-slot kept')
ok(r.source.includes('entriesOfSlot') && r.source.includes('subscribe'),
  'wiki availability probe (entriesOfSlot/subscribe) kept')

// §3.2 / §4.4 / §6.1 — locale namespace + frozen effect labels.
ok(r.calls.locale.some(l => l.op === 'register' && l.ns === 'knowledge'), 'locale register NS knowledge')
const labels = r.calls.effects.map(e => e.label)
ok(labels.includes('knowledge: dictionaries'), 'effect label: knowledge: dictionaries')
ok(labels.includes('knowledge: owned requests'), 'effect label: knowledge: owned requests')

// §4.2 / §4.3 — ctx.remote.knowledge.* reached through the deep recorder chain.
ok(r.calls.services.some(s => s.includes('remote.knowledge.catalog')), 'ctx.remote.knowledge.catalog called')
ok(r.calls.services.some(s => s.includes('remote.knowledge.search')), 'ctx.remote.knowledge.search called')

// §4.5 / §6.2 — frozen identifiers and the ask prompt prefix.
ok(r.source.includes('__UMA_KNOWLEDGE_UI__'), 'frozen global bootstrap key kept')
ok(r.source.includes('UMA_KNOWLEDGE_BASE:') &&
   r.source.includes('Use the associated knowledge as evidence.'), 'frozen ask prompt prefix kept')
ok(r.source.includes("'standard'"), 'frozen agentPreset standard kept')
ok(r.source.includes('__DSH_DIRECTORY_PICKER__') && r.source.includes('__DSH_HOST_PATHS__'),
  'frozen native bridge globals kept')

// §4.3 — all 25 remote.knowledge methods present in source.
const remoteMethods = [
  'catalog', 'importLocal', 'detail', 'createTeam', 'createBase', 'updateBase', 'archiveBase',
  'upload', 'note', 'createNoteIfAbsent', 'syncSource', 'watchSource', 'updateDocument',
  'retryDocument', 'document', 'restoreRevision', 'original', 'search', 'experienceHistory',
  'experienceCapture', 'setExperienceCapture', 'listExperiences', 'saveExperience',
  'transitionExperience', 'deleteExperience',
]
ok(remoteMethods.every(m => r.source.includes(`remote.knowledge.${m}`)),
  'all 25 remote.knowledge methods present in source')

console.log(`knowledge: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
