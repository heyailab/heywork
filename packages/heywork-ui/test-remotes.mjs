/**
 * remotes 模块挂载契约测试（从 specs/ui-remotes.md 逐项断言）。
 * 用法：node packages/heywork-ui/test-remotes.mjs
 */
import { runModule } from './harness/loader.js'

// remote 用显式 mock：recorder 返回的是可 thenable 的代理，await 它永远挂起；
// 这里顺带记录 $mount 的贡献与顺序，作为"3 个贡献注册"的观测点。
const mounts = []
const r = await runModule('./packages/heywork-ui/src/remotes.client.js', {
  ctxOverrides: {
    remote: {
      $mount: contribution => { mounts.push(contribution); return () => {} },
    },
  },
})

let pass = 0, fail = 0
const ok = (cond, msg) => { if (cond) { pass++ } else { fail++; console.error('FAIL:', msg) } }
const has = s => r.source.includes(s)

// 1. 模块 id
ok(r.id === '@heywork/dsh-client-uma-remotes', 'module id')

// 2. 导出面（spec §2.4：仅 apply / inject，无 Config）
ok(r.exports.join(',') === 'apply,inject', `export surface = ${r.exports.join(',')}`)

// 3. 浏览器 inject 仅 1 项（spec §4.1）
ok(has("const inject = ['remote']"), "browser inject = ['remote']")

// 4. immediately:true 语义（spec §1.3：stage-one 预取/工厂注册，非创建 Host 服务/挂载 Remote）
ok(has('const IMMEDIATELY = true'), 'immediately:true constant')
ok(
  has('Stage-one prefetch mark: load the script for factory registration during module-face boot.'),
  'immediately semantics: stage-one prefetch / factory registration in source',
)
ok(has("const HOST_SERVICES_OWNER = 'hey-base'"), 'Host services provided by hey-base (not created here)')

// 5. 无 slot、无组件（spec §5.1 / §5.2）
ok(r.calls.slots.length === 0, `0 slot registrations (${r.calls.slots.length})`)
ok(!has('ctx.slots.inject') && !has('ctx.slots.register'), 'no ctx.slots.* in source')

// 6. 3 个贡献注册，按顺序挂载（spec §6.1）
ok(mounts.length === 3, `ctx.remote.$mount called 3 times (${mounts.length})`)
ok(
  mounts.map(m => m?.package).join('|')
    === '@deepseek-ai/dsh-knowledge|@deepseek-ai/dsh-coding-workbench|@deepseek-ai/dsh-tool-repo-wiki',
  `mount order = $2 -> $1 -> base (${mounts.map(m => m?.package).join('|')})`,
)
ok(
  mounts.every(m => m?.invocation?.kind === 'direct' && m?.cancellation?.parameter === 'signal'),
  'all contributions: invocation.kind=direct, cancellation.parameter=signal',
)

// 7. 3 个冻结贡献常量名（spec §4.3）
for (const c of ['TYPERT_REMOTE$2', 'TYPERT_REMOTE$1', 'TYPERT_REMOTE']) {
  ok(has(c), `frozen contribution constant in source: ${c}`)
}

// 8. 3 个 package / service（spec §5.3）
for (const s of [
  '@deepseek-ai/dsh-knowledge', 'knowledge',
  '@deepseek-ai/dsh-coding-workbench', 'codingWorkbench',
  '@deepseek-ai/dsh-tool-repo-wiki', 'projectWiki',
]) ok(has(s), 'package/service in source: ' + s)

// 9. 57 个端点（25 + 27 + 5），从源码中的方法名字面量计数
const endpoints = r.source.match(/'(?:knowledge|codingWorkbench|projectWiki)\/[A-Za-z]+'/g) || []
ok(endpoints.length === 57, `57 endpoints in source (${endpoints.length})`)
for (const [prefix, n] of [['knowledge', 25], ['codingWorkbench', 27], ['projectWiki', 5]]) {
  const count = endpoints.filter(e => e.startsWith(`'${prefix}/`)).length
  ok(count === n, `${prefix} endpoint count = ${n} (${count})`)
}

// 10. 两条 AggregateError 文本 + 逆序回滚（spec §2.4 / §6.2 / §6.3）
ok(has('HEY Remote activation and cleanup failed'), 'AggregateError text: activation and cleanup failed')
ok(has('HEY Remote cleanup failed'), 'AggregateError text: cleanup failed')
ok(has('disposers.splice(0).reverse()'), 'reverse-order release (rollback) in source')

// 11. typert 运行时类名（spec §5.2）
for (const cls of ['RemoteInfo', 'NamedInput', 'ResultValue']) {
  ok(has(`class ${cls}`), `typert runtime class in source: ${cls}`)
}

console.log(`remotes: ${pass} passed, ${fail} failed`)
process.exitCode = fail === 0 ? 0 : 1
