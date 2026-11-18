/**
 * design-studio 模块挂载契约测试（从 specs/ui-design-studio.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-design-studio.mjs
 */
import { runModule } from './harness/loader.js'

const r = await runModule('./packages/heywork-ui/src/design-studio.client.js', {
  config: { showInternalLibrary: false },
})
let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }

// §1 identity & §2.3 export surface
ok(r.id === '@heywork/dsh-client-ui-design-studio', 'module id')
ok(r.exports.join(',') === 'Config,apply,inject', `export surface = ${r.exports.join(',')}`)
ok(r.Config?.showInternalLibrary === false, 'Config.showInternalLibrary default false (spec §2.1)')

// §5.2 — all 7 slot entries / 4 distinct slot names.
// harness records slots.inject and the inner register separately; dedupe via Set.
const slots = r.calls.slots
const slotNames = [...new Set(
  [...slots.filter(s => s.op === 'inject'), ...slots.filter(s => s.op === 'register')].map(s => s.name),
)]
const expectedSlots = [
  'main',
  'sidebar.panellist',
  'sidebar.right.pane.tab',
  'conversation.session.header.menu',
]
for (const name of expectedSlots) ok(slotNames.includes(name), `slot mounted: ${name}`)
ok(slotNames.length === expectedSlots.length, `distinct slot count = ${expectedSlots.length} (got ${slotNames.length})`)
ok(slots.some(s => s.op === 'register' && s.name === 'main'), 'main entries registered via slots.register')

// §3.2 / §6.1 — locale namespace + frozen effect label.
ok(r.calls.locale.some(l => l.op === 'register' && l.ns === 'uiDesignStudio'), 'locale register NS uiDesignStudio')
const labels = r.calls.effects.map(e => e.label)
ok(labels.includes('ui-design-studio: dictionaries'), 'effect label: dictionaries')
ok(labels.includes('ui-design-studio: resources'), 'effect label: resources')

// §6.2 / §4.4 — frozen identifiers and resource protocol registration.
ok(r.calls.services.some(s => s.includes('resources.register')), 'ctx.resources.register called')
ok(r.source.includes('uma-verification') && r.source.includes('uma-delivery-artifacts'), 'frozen resource protocols kept')
ok(r.source.includes('uma-operations') && r.source.includes('uma-design'), 'frozen panel id / agentPreset kept')

console.log(`design-studio: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
