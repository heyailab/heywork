/**
 * design-cards 模块挂载契约测试（从 specs/ui-design-cards.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-design-cards.mjs
 */
import { runModule } from './harness/loader.js'

const r = await runModule('./packages/heywork-ui/src/design-cards.client.js')
let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }

// §1 identity & §2.4 export surface (no Config for this package — spec §2.1).
ok(r.id === '@heywork/dsh-client-ui-uma-design', 'module id')
ok(r.exports.join(',') === 'apply,inject', `export surface = ${r.exports.join(',')}`)
ok(r.Config === undefined, 'no Config export (spec §2.1)')

// §5.1 — both slots mounted; dedupe inject/register records via Set.
const slots = r.calls.slots
const slotNames = [...new Set(
  [...slots.filter(s => s.op === 'inject'), ...slots.filter(s => s.op === 'register')].map(s => s.name),
)]
ok(slotNames.includes('tool.call.toolview'), 'slot mounted: tool.call.toolview')
ok(slotNames.includes('conversation.chat.node'), 'slot mounted: conversation.chat.node')
ok(slotNames.length === 2, `distinct slot count = 2 (got ${slotNames.length})`)
ok(slots.filter(s => s.op === 'register').length === 14, '14 slot entries registered (13 toolview + 1 chat.node)')

// §3.2 / §6.1 — locale namespace + frozen effect labels.
ok(r.calls.locale.some(l => l.op === 'register' && l.ns === 'ui-uma-design'), 'locale register NS ui-uma-design')
const labels = r.calls.effects.map(e => e.label)
ok(labels.includes('ui-uma-design: dictionaries'), 'effect label: dictionaries')
ok(labels.includes('ui-uma-design: css'), 'effect label: css')

// §6.1 / §4.3 — resource activity event registration + frozen identifiers.
ok(r.calls.services.some(s => s.includes('uiConversation.events')), 'ctx.uiConversation.events registration touched')
const toolviewKeys = [
  'design_preview', 'uma_artifact_write', 'uma_gate_status',
  'design_project_create', 'design_project_status',
  'design_asset_list', 'design_asset_get', 'uma_resource_read', 'uma_knowledge_search',
  'design_rule_search', 'design_begin', 'uma_wiki_lookup', 'uma_workspace_search',
]
ok(toolviewKeys.every(k => r.source.includes(k)), 'all 13 frozen toolview keys kept')
ok(r.source.includes('uma-resource-activity') && r.source.includes('uma-design-preview'), 'frozen activity kind / preview kind kept')

console.log(`design-cards: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
