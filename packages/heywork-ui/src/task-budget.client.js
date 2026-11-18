/**
 * @heywork/ui — UMA task-budget browser presentation module.
 * Rewritten from specs/ui-task-budget.md, not translated from bundle.
 * Exposes the dsh browser contract:
 *   window.__ModuleLoader__.load({ id, factory: require => ({ apply, inject }) })
 * Mount targets, locale namespace and frozen identifiers follow the spec exactly;
 * component internals are simple stand-ins (pixel fidelity is out of scope).
 */
window.__ModuleLoader__.load({
  id: '@heywork/dsh-client-ui-uma-task-budget',
  factory: require => {
    const module = { exports: {} }
    const exports = module.exports
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    const jsx = require('react/jsx-runtime')
    const h = jsx.jsx || jsx.createElement

    // --- Frozen identifiers (spec §4.4) — kept verbatim ---
    const NS = 'umaTaskBudget'
    const TYPERT_REMOTE_PACKAGE = '@deepseek-ai/dsh-uma-task-budget'
    const TYPERT_REMOTE_SERVICE = 'umaTaskBudgets'
    const BUDGET_READ = 'uma-budget/read'
    const BUDGET_UPDATE = 'uma-budget/update'
    const TURN_ERROR_SLOT = 'conversation.chat.turn-error.actions'
    const ACTION_ID = 'uma-task-budget'
    const SUB_INJECT = 'remote.uma-budget'
    const ACCESS_WATCH = 'account/watch'
    const ACCESS_READ = 'uma-budget/read'
    const REMOTE_FAILURE_MESSAGE = 'UMA budget operation failed'
    const STREAM_ENDED_MESSAGE = 'account stream ended'
    const MAX_CNY_DECIMALS = 6
    const STATES = ['active', 'paused', 'closed']
    const ERROR_CODES = [
      'UMA_TASK_BUDGET_ACCOUNT_CHANGED',
      'UMA_TASK_BUDGET_EXCEEDED',
      'UMA_TASK_BUDGET_PAUSED',
      'UMA_TASK_BUDGET_UNAVAILABLE',
      'uma-budget/failed',
    ]
    const RECOVERABLE_CODES = [
      'UMA_TASK_BUDGET_EXCEEDED',
      'UMA_TASK_BUDGET_PAUSED',
      'UMA_TASK_BUDGET_UNAVAILABLE',
    ]

    // --- browser ctx-service inject (spec §4.1, 5 items) ---
    const inject = ['slots', 'locale', 'remote', 'remote.account', 'remoteAccess']

    // --- typert metadata (spec §5.3) — frozen class/constant names ---
    class RemoteInfo {}
    class NamedInput {}
    class ResultValue {}
    const TYPERT_REMOTE = {
      package: TYPERT_REMOTE_PACKAGE,
      service: TYPERT_REMOTE_SERVICE,
      methods: [BUDGET_READ, BUDGET_UPDATE],
    }

    // --- 8-language dictionaries (spec §3.2): en/zh full, 6 aliases -> en ---
    const en = {
      view: 'View task budget',
      title: 'Task budget',
      description: 'The current conversation and its delegated agents share a server-enforced budget.',
      close: 'Close',
      loading: 'Loading current budget…',
      refresh: 'Refresh',
      save: 'Save budget',
      saving: 'Saving…',
      cancel: 'Cancel',
      cap: 'Spending cap (CNY)',
      unlimited: 'Do not additionally limit task amount',
      spent: 'Settled spending',
      reserved: 'Reserved for accepted calls',
      root: 'Shared root conversation',
      shared: 'This sub-conversation shares the task budget with its parent.',
      active: 'Active',
      paused: 'Paused',
      closed: 'Closed',
      state: 'Task state',
      operator: 'Paused by operator',
      reason: 'Operator reason',
      pauseNote: 'While paused, no new calls are accepted; accepted requests keep their reservation and continue to settle.',
      closedNote: 'Once closed, this task stops accepting new calls; existing requests may still settle.',
      invalid: 'Enter a non-negative CNY amount with at most six decimal places.',
      failed: 'The budget could not be read or saved. Check the connection and retry.',
      conflict: 'The budget was changed elsewhere. The latest server version is shown below; your input was preserved — review and save again.',
      committed: 'The cap is below the spent plus reserved amount. Raise the cap or refresh after requests settle.',
      account: 'Sign in with the UMA account that owns this conversation.',
      upgrade: 'The server must be upgraded before task budgets can be used.',
      accountChanged: 'The current account changed. Reopen this panel to read the new account budget.',
      saved: 'Budget saved.',
      version: 'Version',
      retry: 'Retry',
      revert: 'Use current server configuration',
      expired: 'Valid until',
      remainingNote: 'Amounts are CNY decimal strings returned by the server; account and API-key limits apply together.',
    }
    const zh = {
      view: '查看任务预算',
      title: '任务预算',
      description: '当前会话与其委派的智能体共用一个由服务端执行的预算。',
      close: '关闭',
      loading: '正在读取当前预算…',
      refresh: '刷新',
      save: '保存预算',
      saving: '正在保存…',
      cancel: '取消',
      cap: '消费上限（CNY）',
      unlimited: '不额外限制任务金额',
      spent: '已结算消费',
      reserved: '已受理调用预留',
      root: '共享根会话',
      shared: '此子会话与父会话共用任务预算。',
      active: '可用',
      paused: '已暂停',
      closed: '已关闭',
      state: '任务状态',
      operator: '运营已暂停',
      reason: '运营原因',
      pauseNote: '暂停后不再受理新的调用，已受理的请求保留预留金额并继续结算。',
      closedNote: '关闭后本任务停止受理新的调用，已有请求仍可能结算。',
      invalid: '请输入非负 CNY 金额，最多保留六位小数。',
      failed: '暂时无法读取或保存预算，请检查连接后重试。',
      conflict: '预算已在其他地方修改。下方已刷新最新版本，你的输入已保留，请核对后重新保存。',
      committed: '上限低于已消费及预留金额，请提高上限或等待请求结算后刷新。',
      account: '请登录拥有当前会话的 UMA 账号。',
      upgrade: '服务端需要升级后才能使用任务预算。',
      accountChanged: '当前账号已变更，请重新打开面板读取新账号预算。',
      saved: '预算已保存。',
      version: '版本',
      retry: '重试',
      revert: '使用当前服务端配置',
      expired: '有效期至',
      remainingNote: '金额采用服务端返回的 CNY 十进制字符串，账号与 API 密钥限额同时生效。',
    }
    const dictionaries = { en, zh, ja: en, es: en, fr: en, de: en, ru: en, pt: en }

    // --- account snapshot store (spec §6.1): publish(active) bumps revision ---
    function createSnapshotStore(initial) {
      let snapshot = { ...initial }
      const listeners = new Set()
      return {
        get: () => snapshot,
        subscribe: fn => { listeners.add(fn); return () => listeners.delete(fn) },
        publish(patch) {
          snapshot = { ...snapshot, ...patch, revision: (snapshot.revision || 0) + 1 }
          for (const fn of listeners) fn(snapshot)
        },
      }
    }

    // --- remote result unwrapping (spec §5.2) ---
    class BudgetFailure extends Error {
      constructor(reason) {
        super(REMOTE_FAILURE_MESSAGE)
        this.reason = reason
      }
    }
    function unwrap(result) {
      if (!result || result.ok !== true) {
        const reason = result && result.error && result.error.code === 'uma-budget/failed'
          ? result.error.details && result.error.details.reason
          : 'request-failed'
        throw new BudgetFailure(reason)
      }
      return result.value
    }

    // --- React components (spec §5.3) — simple stand-ins ---
    const TaskBudgetDialog = props => {
      const injected = props?.inject ?? {}
      const t = props?.t ?? (key => key)
      const view = injected.view ?? {}
      return h('div', {
        class: 'uma-task-budget-dialog',
        'data-slot': TURN_ERROR_SLOT,
        'data-state': view.budget?.state ?? 'active',
      },
        h('span', { class: 'uma-task-budget-title' }, t('title')),
        h('div', { class: 'uma-task-budget-amounts' },
          h('span', null, `${t('spent')}: ${view.budget?.spent ?? '0'}`),
          h('span', null, `${t('reserved')}: ${view.budget?.reserved ?? '0'}`),
        ),
      )
    }
    const TaskBudgetErrorAction = props => {
      const injected = props?.inject ?? {}
      const t = props?.t ?? (key => key)
      const code = props?.error?.code
      const account = injected.hooks?.account?.get?.() ?? { active: false }
      if (code === 'UMA_TASK_BUDGET_ACCOUNT_CHANGED') {
        return h('span', { class: 'uma-task-budget-account-changed' }, t('accountChanged'))
      }
      const allowed = RECOVERABLE_CODES.includes(code)
        && (props?.useAccess?.(ACCESS_READ) ?? false)
        && account.active === true
      if (!allowed) return null
      return h('button', {
        class: 'uma-task-budget-action',
        'data-id': ACTION_ID,
        onClick: () => props?.onOpen?.(),
      }, t('view'))
    }

    // --- browser entry (spec §2.4) ---
    async function apply(ctx) {
      // 1. mount the budget Remote; disposer returned for unload.
      const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)

      // 2. register 8-language dictionary (no effect label).
      ctx.effect(() => ctx.locale.register(NS, dictionaries))

      // 3. account state snapshot store.
      const account = createSnapshotStore({ revision: 0, active: false })

      // 4 / §6.2 — subscribe to account credential changes.
      ctx.remoteAccess.whenAccess(ACCESS_WATCH, async function* (grant) {
        const stream = ctx.remote.$stream({
          name: 'account',
          open: signal => ctx.remote.account.watch(signal),
          ended: () => new Error(STREAM_ENDED_MESSAGE),
        })
        yield () => {
          grant.ended = true
          account.publish(false)
          return stream.dispose()
        }
        try {
          for await (const frame of stream) {
            if (grant.ended) return
            account.publish(
              frame?.value?.product === 'uma' && frame?.value?.status === 'credential-stored',
            )
            frame.accept()
          }
        } catch (error) {
          if (!grant.ended) account.publish(false)
        }
      })

      // 5 / §4.3 / §5.2 — sub-scope recovery action; main scope stays clean.
      ctx.inject([SUB_INJECT], scope => {
        const read = (args, signal) => unwrap(scope.remote['uma-budget'].read(args, signal))
        const update = (args, signal) => unwrap(scope.remote['uma-budget'].update(args, signal))
        const injected = { hooks: { account }, read, update }
        scope.slots.inject(TURN_ERROR_SLOT, () =>
          scope.slots.register(
            { name: ACTION_ID, locale: NS, inject: () => injected },
            TaskBudgetErrorAction,
          ))
      })

      // 6. return the unmount hook.
      return disposeRemote
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
