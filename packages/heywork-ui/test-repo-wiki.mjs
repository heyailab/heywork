/**
 * repo-wiki 模块挂载契约测试（从 specs/ui-repo-wiki.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-repo-wiki.mjs
 */
import { runModule } from './harness/loader.js'

const r = await runModule('./packages/heywork-ui/src/repo-wiki.client.js', {
  config: {
    autoGenerateOnOpen: false, autoUpdateDefault: true,
    generationRefreshMs: 3000, autoUpdateIntervalMs: 30000, autoUpdateDebounceMs: 1500,
  },
})
let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }

// §1.1 / §2.3 — identity & export surface (Config + apply + inject per spec §二 / §1.3).
ok(r.id === '@heywork/dsh-client-ui-repo-wiki', 'module id')
ok(r.exports.join(',') === 'Config,apply,inject', `export surface = ${r.exports.join(',')}`)

// §2.1 — Config schema defaults (all five fields).
ok(r.Config?.autoGenerateOnOpen === false, 'Config.autoGenerateOnOpen default false')
ok(r.Config?.autoUpdateDefault === true, 'Config.autoUpdateDefault default true')
ok(r.Config?.generationRefreshMs === 3000, 'Config.generationRefreshMs default 3000')
ok(r.Config?.autoUpdateIntervalMs === 30000, 'Config.autoUpdateIntervalMs default 30000')
ok(r.Config?.autoUpdateDebounceMs === 1500, 'Config.autoUpdateDebounceMs default 1500')

// §4.1 — browser ctx-service inject (9 items, source-level frozen list).
const injectLine = (r.source.match(/const inject = \[[\s\S]*?\]/) || [''])[0]
const browserInject = [...injectLine.matchAll(/'([^']+)'/g)].map(m => m[1])
ok(browserInject.join(',') === 'slots,locale,uiWorkspace,sessions,workspaces,remote,remote.session,remote.workspaceFiles,remote.projectWiki',
  `browser inject = ${browserInject.join(',')}`)

// §5.1 / §6.1 — single injected slot: main.knowledge.wiki (dedupe via Set).
const slots = r.calls.slots
const injectNames = [...new Set(slots.filter(s => s.op === 'inject').map(s => s.name))]
ok(injectNames.includes('main.knowledge.wiki'), 'slot inject: main.knowledge.wiki')
ok(injectNames.length === 1, `distinct injected slot count = 1 (got ${injectNames.length})`)
ok(slots.some(s => s.op === 'register' && s.name === 'main.knowledge.wiki'), 'WikiPageView registered into wiki sub-slot')

// §3.2 / §4.4 / §6.1 — locale namespace + all three frozen effect labels.
ok(r.calls.locale.some(l => l.op === 'register' && l.ns === 'repoWiki'), 'locale register NS repoWiki')
const labels = r.calls.effects.map(e => e.label)
ok(labels.includes('repo-wiki: dictionaries'), 'effect label: repo-wiki: dictionaries')
ok(labels.includes('repo-wiki: local automatic-generation consent'), 'effect label: local consent')
ok(labels.includes('repo-wiki: operation supervision'), 'effect label: operation supervision')

// §4.2 / §4.3 — key ctx services reached through deep recorder chains.
ok(r.calls.services.some(s => s.includes('sessions.list')), 'ctx.sessions.list called')
ok(r.calls.services.some(s => s.includes('remote.projectWiki.readOwned')), 'ctx.remote.projectWiki.readOwned called')
ok(r.calls.services.some(s => s.includes('remote.projectWiki.summary')), 'ctx.remote.projectWiki.summary called')
ok(r.calls.services.some(s => s.includes('remote.session.modelCatalog')), 'ctx.remote.session.modelCatalog called')
ok(r.calls.services.some(s => s.includes('uiWorkspace.openSession')), 'ctx.uiWorkspace.openSession called')

// §4.5 — frozen internal identifiers kept verbatim in source.
ok(r.source.includes('umaStudio.repoWiki.autoUpdate.v1'), 'frozen local preference key kept')
ok(r.source.includes("'.uma/wiki'"), 'frozen WIKI_ROOT kept')
ok(r.source.includes("'zh'") && r.source.includes("'en'"), 'frozen WIKI_LANGUAGES zh/en kept')
ok(r.source.includes("'repo-wiki'") && r.source.includes("'repoWiki'"), 'frozen agentPreset / session source kept')
ok(r.source.includes('./client.mermaid.min.js') && r.source.includes("securityLevel: 'strict'"),
  'frozen lazy Mermaid block kept')

// §6.1 — frozen console.warn prefixes kept.
ok(r.source.includes('Repository Wiki automatic-update preferences could not be read; automatic generation is disabled.') &&
   r.source.includes('Repository Wiki update preferences could not be saved.') &&
   r.source.includes('Project Wiki source supervision stopped.'), 'frozen console.warn messages kept')

console.log(`repo-wiki: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
