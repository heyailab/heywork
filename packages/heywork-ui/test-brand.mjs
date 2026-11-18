/**
 * brand 模块挂载契约测试（从 specs/ui-brand.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-brand.mjs
 */
import { runModule } from './harness/loader.js'

const r = await runModule('./packages/heywork-ui/src/brand.client.js', { config: { name: 'UMA Studio' } })
let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }

ok(r.id === '@heywork/dsh-client-ui-brand', 'module id')
ok(r.exports.join(',') === 'Config,apply,inject', `export surface = ${r.exports.join(',')}`)
ok(r.Config?.name === 'UMA Studio', 'Config.name default')

const slots = r.calls.slots
const injectNames = [...new Set(slots.filter(s => s.op === 'inject').map(s => s.name))]
const expectedInject = [
  'sidebar.brand.identity', 'sidebar.brand.mark', 'sidebar.brand.name',
  'conversation.hero.brand.mark', 'conversation.chat.running-indicator',
]
for (const s of expectedInject) ok(injectNames.includes(s), `slot inject: ${s}`)
ok(slots.some(s => s.op === 'registerFactory' && s.name === 'conversation.chat.assistant.brand'), 'registerFactory assistant brand')
ok(slots.find(s => s.op === 'registerFactory')?.scope === 'root', 'registerFactory scope=root')
ok(r.calls.locale.some(l => l.op === 'register' && l.ns === 'uma-running'), 'locale register uma-running')
ok(r.calls.services.some(s => s.includes('overrideStylesheet')), 'theme.overrideStylesheet called')

console.log(`brand: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
