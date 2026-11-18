/**
 * task-budget 模块挂载契约测试（从 specs/ui-task-budget.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-task-budget.mjs
 */
import { runModule, makeCtx } from './harness/loader.js'

const src = './packages/heywork-ui/src/task-budget.client.js'
// ctx.inject 把回调交给子作用域；用独立 makeCtx 记录子作用域里的 slot 注册。
// remote 用显式 mock（recorder 返回的是可 thenable 的代理，await 它永远挂起），
// 同时在这里记录 $mount 的贡献，作为"挂载 Remote ×1"的观测点。
const { ctx: scopeCtx, calls: scopeCalls } = makeCtx()
const mounts = []
let injectedNames = null
const r = await runModule(src, {
  ctxOverrides: {
    remote: {
      $mount: contribution => { mounts.push(contribution); return () => {} },
      account: { watch: () => {} },
      $stream: () => ({ dispose: () => {} }),
    },
    inject: (names, callback) => { injectedNames = names; return callback(scopeCtx) },
  },
})

let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }
const has = s => r.source.includes(s)

// 1. 模块 id
ok(r.id === '@heywork/dsh-client-ui-uma-task-budget', 'module id')

// 2. 导出面（spec §2.4.7：仅 apply / inject，无 Config）
ok(r.exports.join(',') === 'apply,inject', `export surface = ${r.exports.join(',')}`)

// 3. 关键常量（spec §4.4 冻结标识逐字出现在源码）
for (const c of [
  'umaTaskBudget',                       // NS
  '@deepseek-ai/dsh-uma-task-budget',    // TYPERT_REMOTE.package
  'umaTaskBudgets',                      // service
  'uma-budget/read', 'uma-budget/update',
  'conversation.chat.turn-error.actions', // slot
  'uma-task-budget',                     // action id
  'remote.uma-budget',                   // 子注入
  'account/watch',                       // 访问门
]) ok(has(c), `frozen constant in source: ${c}`)

// 4. 5 个冻结错误码（spec §4.4）
for (const code of [
  'UMA_TASK_BUDGET_ACCOUNT_CHANGED',
  'UMA_TASK_BUDGET_EXCEEDED',
  'UMA_TASK_BUDGET_PAUSED',
  'UMA_TASK_BUDGET_UNAVAILABLE',
  'uma-budget/failed',
]) ok(has(code), `frozen error code in source: ${code}`)

// 5. 浏览器 inject 5 项（spec §4.1）
ok(
  has("const inject = ['slots', 'locale', 'remote', 'remote.account', 'remoteAccess']"),
  'browser inject array (5 items)',
)

// 6. slot：唯一挂载位 turn-error.actions，且 id = uma-task-budget
ok(
  scopeCalls.slots.some(s => s.op === 'inject' && s.name === 'conversation.chat.turn-error.actions'),
  'slot inject: conversation.chat.turn-error.actions',
)
const registered = scopeCalls.slots.find(s => s.op === 'register')
ok(registered?.name === 'uma-task-budget', 'slot registration id = uma-task-budget')
ok(registered?.locale === 'umaTaskBudget' || has("locale: NS"), 'slot registration locale = NS')

// 7. 关键 ctx 服务
ok(mounts.length === 1, `ctx.remote.$mount called once (${mounts.length})`)
ok(mounts[0]?.package === '@deepseek-ai/dsh-uma-task-budget'
  && mounts[0]?.service === 'umaTaskBudgets', 'mounted contribution = budget Remote')
ok(r.calls.services.includes('remoteAccess.whenAccess()'), 'ctx.remoteAccess.whenAccess called')
ok(r.calls.locale.some(l => l.op === 'register' && l.ns === 'umaTaskBudget'), 'ctx.locale.register(NS, …) called')
ok(Array.isArray(injectedNames) && injectedNames.length === 1 && injectedNames[0] === 'remote.uma-budget',
  `ctx.inject(['remote.uma-budget'], …) called (${JSON.stringify(injectedNames)})`)

// 8. 深层 ctx 链 / 流结束错误 / 解包失败文本（出现在源码）
for (const s of [
  "ctx.remote.$stream({",
  "ctx.remote.account.watch(signal)",
  "scope.remote['uma-budget'].read(args, signal)",
  "scope.remote['uma-budget'].update(args, signal)",
  'account stream ended',
  'UMA budget operation failed',
  "product === 'uma' && frame?.value?.status === 'credential-stored'",
]) ok(has(s), `deep chain / frozen text in source: ${s}`)

// 9. 账号判定逐字（product==='uma' && status==='credential-stored'）
ok(has("=== 'uma'") && has("=== 'credential-stored'"), 'account predicate values in source')

console.log(`task-budget: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
