/**
 * 【逆向还原】由 `lib/types/index.js`（tsc 直出）反推，非 DeepSeek 原始源码。
 *
 * tsc 直出保留了 JSDoc、变量名、函数签名与源码排版；`lib/index.js` 的
 * `//#region lib/types/index.js` bundle 与此处逻辑逐行等价（仅数字字面量写法
 * 10_000/1e4、15_000/15e3 不同，值相同）。控制流、错误文本、协议字段均未改。
 * 所有 interface 由调用点与 `typert.host.js` 的描述符合并推断，名字可能与原始定义不同。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */
import { createHash, randomUUID } from 'node:crypto'
import { Service } from '@deepseek-ai/cordis'
import configSchema from '@deepseek-ai/schemastery'
import { z } from 'zod'
import { defineDomain } from '@deepseek-ai/dsh-storage-domain'
import { Remote, RemoteError, remoteErrorOf, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { SessionId } from '@deepseek-ai/dsh-session'
import { LlmError } from '@deepseek-ai/dsh-llm'

/** 会话预算的三个合法状态；与 wire / 描述符保持一致。 */
type BudgetState = 'active' | 'paused' | 'closed'

/** issuer 返回、经 wireBudget 归一化后的预算记录（无凭据字段）。 */
interface SessionBudget {
  id: string
  purpose: string
  cap: string | null
  spent: string
  reserved: string
  state: BudgetState
  operatorPaused: boolean
  operatorReason: string
  version: number
  expiresAt: string
}

/** read / update 的返回值；sessionId 为 root 会话时 shared 为 false。 */
interface SessionBudgetView {
  sessionId: string
  rootSessionId: string
  shared: boolean
  budget: SessionBudget
}

/** 从 wireBudget.safeParse 取出的 issuer 原始记录（snake_case）。 */
interface WireBudget {
  id: string
  account_id: string
  purpose: string
  cap: string | null
  spent: string
  reserved: string
  state: BudgetState
  operator_paused: boolean
  operator_reason: string
  version: number
  expires_at: string
}

interface ReadRequest {
  sessionId: string
}

interface UpdateRequest {
  sessionId: string
  expectedVersion: number
  cap: string | null
  state: BudgetState
}

/** prepare 的入参：模型传输层捕获的 issuer/凭据及其真实会话。 */
interface BudgetRequest {
  readonly origin: string
  readonly token: string
  readonly sessionId: string
  readonly kind: 'device' | 'api-key'
}

interface PrepareResult {
  taskId: string
  protocol: '1'
}

interface IssuerIdentity {
  origin: string
  token: string
}

/** account.getPlatformSession() 的运行期形状（token/origin 必填）。 */
interface PlatformSession {
  origin: string
  token: string
}

/** deepseekAccount 能力的最小形状；由 account()/stillCurrent() 的调用点推断。 */
interface DeepSeekAccountCapability {
  getPlatformSession(): Promise<PlatformSession | null | undefined>
  resolveToken(origin: string): Promise<string | undefined>
}

/** sessionQuery.observeSession 返回的可释放观察对象（header 字段从用法推断）。 */
interface SessionObservation {
  [Symbol.dispose](): void
  header: {
    origin: string
    parentSession?: string
  }
}

/** defineDomain(storage).open() 的最小形状。 */
interface BudgetDomain {
  global: {
    get(): { installationId: string | null }
    set(value: { installationId: string }): Promise<void>
  }
  close(): Promise<void>
}

/** apply 所需的 ctx 最小形状（cordis Context + storageDomain / sessionQuery / deepseekAccount 能力）。 */
interface BudgetContext {
  effect: (factory: () => () => unknown) => void
  on: (event: string, listener: () => void) => void
  get: <T = unknown>(name: string) => T | undefined
  storageDomain: {
    open: (descriptor: typeof storage) => Promise<BudgetDomain>
  }
  sessionQuery: {
    observeSession: (id: string, options: { signal: AbortSignal; projectionMode: 'none' }) => Promise<SessionObservation>
  }
}

/** 插件配置形状（Config 校验器的运行期推断结果）。 */
interface BudgetConfig {
  timeoutMs?: number
  cacheMs?: number
}

/** 缓存项：expires 过期时间戳 + 视图值。 */
interface CachedView {
  expires: number
  value: SessionBudgetView
}

const storage = defineDomain({
  name: 'uma_session_budgets', version: 1,
  global: {
    schema: z.object({ installationId: z.uuid().nullable() }),
    initial: { installationId: null },
  },
  tables: {},
})

const decimal = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,6})?$/u
const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu
const remoteFailure = (reason: string) => new RemoteError('hey-budget/failed', 'The session budget operation could not be completed', { reason })
const wireBudget = z.object({
  id: z.uuid(), account_id: z.uuid(), purpose: z.string().max(160),
  cap: z.string().regex(decimal).nullable(), spent: z.string().regex(decimal), reserved: z.string().regex(decimal),
  state: z.enum(['active', 'paused', 'closed']), operator_paused: z.boolean().default(false), operator_reason: z.string().max(500).default(''),
  version: z.number().int().positive(), expires_at: z.iso.datetime({ offset: true })
})

/** Owns opaque local bindings, issuer requests and root-session resolution. */
class UmaTaskBudgets extends TypertRemoteService {
  static inject = ['typert', 'storageDomain', 'sessionQuery']
  static Config = configSchema.object({ timeoutMs: configSchema.number().default(10_000), cacheMs: configSchema.number().default(15_000) })

  lifetime = new AbortController()
  domain?: BudgetDomain
  cache = new Map<string, CachedView>()
  pending = new Map<string, Promise<SessionBudgetView>>()
  installationId = ''
  timeoutMs: number
  cacheMs: number

  /**
   * Mount budget metadata without persisting any credential or financial balance locally.
   * @param ctx - same Host session, storage and optional account capabilities.
   * @param config - request and cache bounds.
   */
  constructor(ctx: BudgetContext, config: BudgetConfig = {}) {
    super(ctx, 'umaTaskBudgets', { namespace: 'hey-budget' })
    this.timeoutMs = config.timeoutMs ?? 10_000
    this.cacheMs = config.cacheMs ?? 15_000
    if (!Number.isSafeInteger(this.timeoutMs) || this.timeoutMs < 100 || this.timeoutMs > 60_000
      || !Number.isSafeInteger(this.cacheMs) || this.cacheMs < 0 || this.cacheMs > 60_000)
      throw new Error('HEY budget resource limits are invalid')
    ctx.effect(() => async () => {
      this.lifetime.abort()
      this.cache.clear()
      await Promise.allSettled(this.pending.values())
      await this.domain?.close()
    })
    ctx.on('deepseek-account/signed-out', () => { this.cache.clear() })
    ctx.on('deepseek-account/access-blocked', () => { this.cache.clear() })
  }

  async [Service.init]() {
    const domain = await this.ctx.storageDomain.open(storage)
    if (this.lifetime.signal.aborted) {
      await domain.close()
      this.lifetime.signal.throwIfAborted()
    }
    this.domain = domain
    this.installationId = this.domain.global.get().installationId ?? randomUUID()
    if (this.domain.global.get().installationId === null)
      await this.domain.global.set({ installationId: this.installationId })
  }

  async rootOf(id: string, signal: AbortSignal): Promise<string> {
    const seen = new Set<string>()
    for (let depth = 0; depth < 64; depth++) {
      signal.throwIfAborted()
      if (seen.has(id))
        throw remoteFailure('cyclic-session-lineage')
      seen.add(id)
      using observation = await this.ctx.sessionQuery.observeSession(id, { signal, projectionMode: 'none' })
      if (observation.header.origin !== 'subagent' || observation.header.parentSession === undefined)
        return id
      id = observation.header.parentSession
    }
    throw remoteFailure('session-lineage-limit')
  }

  async api(origin: string, token: string, path: string, method: string, body: Record<string, unknown> | undefined, signal: AbortSignal): Promise<SessionBudget> {
    const destination = new URL(origin)
    if (destination.origin !== origin || destination.username !== '' || destination.password !== ''
      || destination.protocol !== 'https:' && !(destination.protocol === 'http:' && destination.hostname === '127.0.0.1')) {
      throw remoteFailure('invalid-issuer')
    }
    const response = await fetch(new URL(path, origin), {
      method, redirect: 'error', cache: 'no-store',
      headers: { authorization: `Bearer ${token}`, accept: 'application/json', 'content-type': 'application/json' },
      ...body === undefined ? {} : { body: JSON.stringify(body) },
      signal: AbortSignal.any([this.lifetime.signal, signal, AbortSignal.timeout(this.timeoutMs)])
    })
    if (!response.ok) {
      await response.body?.cancel()
      throw remoteFailure(response.status === 401 ? 'account-required' : response.status === 409 ? 'version-conflict'
        : response.status === 402 ? 'budget-committed' : response.status === 404 ? 'server-upgrade-required' : 'request-failed')
    }
    const reader = response.body?.getReader()
    if (reader === undefined)
      throw remoteFailure('invalid-response')
    let bytes = 0, text = ''
    const decoder = new TextDecoder()
    try {
      for (;;) {
        const part = await reader.read()
        if (part.done)
          break
        bytes += part.value.byteLength
        if (bytes > 65_536)
          throw remoteFailure('response-too-large')
        text += decoder.decode(part.value, { stream: true })
      }
    }
    finally {
      await reader.cancel()
    }
    let value: unknown
    try {
      value = JSON.parse(text + decoder.decode())
    }
    catch {
      throw remoteFailure('invalid-response')
    }
    const parsed = wireBudget.safeParse(value)
    if (!parsed.success)
      throw remoteFailure('invalid-response')
    return {
      id: parsed.data.id, purpose: parsed.data.purpose, cap: parsed.data.cap, spent: parsed.data.spent,
      reserved: parsed.data.reserved, state: parsed.data.state,
      operatorPaused: parsed.data.operator_paused, operatorReason: parsed.data.operator_reason,
      version: parsed.data.version, expiresAt: parsed.data.expires_at
    }
  }

  async view(id: string, origin: string, token: string, signal: AbortSignal): Promise<SessionBudgetView> {
    const root = await this.rootOf(id, signal)
    const reference = createHash('sha256').update(this.installationId).update('\0').update(String(root)).digest('hex')
    const budget = await this.api(origin, token, '/v1/session-budgets', 'POST', {
      client_ref: this.installationId, session_ref: reference, purpose: 'HeyWork session', cap: null,
    }, signal)
    return { sessionId: id, rootSessionId: root, shared: id !== root, budget }
  }

  async account(signal: AbortSignal): Promise<IssuerIdentity> {
    signal.throwIfAborted()
    const account = this.ctx.get<DeepSeekAccountCapability>('deepseekAccount')
    const previous = await account?.getPlatformSession()
    if (account === undefined || previous === null || previous === undefined)
      throw remoteFailure('account-required')
    const token = await account.resolveToken(previous.origin)
    signal.throwIfAborted()
    if (token === undefined)
      throw remoteFailure('account-required')
    return { origin: previous.origin, token }
  }

  async stillCurrent(origin: string, token: string): Promise<boolean> {
    const current = await this.ctx.get<DeepSeekAccountCapability>('deepseekAccount')?.getPlatformSession()
    return current !== null && current !== undefined && current.origin === origin && current.token === token
  }

  // A delayed metadata response must not replace a newer observed configuration.
  remember(key: string, view: SessionBudgetView): CachedView {
    const previous = this.cache.get(key)
    if (previous !== undefined && previous.value.budget.id === view.budget.id && previous.value.budget.version > view.budget.version) {
      return previous
    }
    if (this.cache.size >= 1024 && !this.cache.has(key))
      this.cache.clear()
    const value: CachedView = { expires: Date.now() + this.cacheMs, value: view }
    this.cache.set(key, value)
    return value
  }

  /**
   * Read the root allowance for a real local session under the current HEY account.
   * @param request - local session; delegated sessions resolve to their recorded root.
   * @param signal - view lifetime.
   * @returns a credential-free current allowance and root identity.
   */
  @Remote('read')
  async read(request: ReadRequest, signal: AbortSignal): Promise<SessionBudgetView> {
    const owned = AbortSignal.any([signal, this.lifetime.signal])
    const identity = await this.account(owned)
    const view = await this.view(request.sessionId, identity.origin, identity.token, owned)
    if (!await this.stillCurrent(identity.origin, identity.token))
      throw remoteFailure('account-changed')
    const latest = this.remember(`${identity.origin}\0${identity.token}\0${view.rootSessionId}`, view)
    return { ...view, budget: latest.value.budget }
  }

  /**
   * Replace the reviewed root cap/state; accepted calls keep their reservations and can settle.
   * @param request - current session, observed version, explicit CNY cap or no extra cap, and next state.
   * @param signal - operation lifetime.
   * @returns the committed allowance, or an explicit conflict requiring a fresh read.
   */
  @Remote('update')
  async update(request: UpdateRequest, signal: AbortSignal): Promise<SessionBudgetView> {
    if (!Number.isSafeInteger(request.expectedVersion) || request.expectedVersion < 1
      || request.cap !== null && !decimal.test(request.cap))
      throw remoteFailure('invalid-budget')
    const owned = AbortSignal.any([signal, this.lifetime.signal])
    const identity = await this.account(owned)
    const view = await this.view(request.sessionId, identity.origin, identity.token, owned)
    if (!await this.stillCurrent(identity.origin, identity.token))
      throw remoteFailure('account-changed')
    const budget = await this.api(identity.origin, identity.token, `/v1/session-budgets/${view.budget.id}`, 'PATCH', {
      cap: request.cap, state: request.state, expected_version: request.expectedVersion,
    }, owned)
    if (!await this.stillCurrent(identity.origin, identity.token))
      throw remoteFailure('account-changed')
    const latest = this.remember(`${identity.origin}\0${identity.token}\0${view.rootSessionId}`, { ...view, budget })
    return { ...view, budget: latest.value.budget }
  }

  /**
   * Prepare Host-only headers for one model request without ever replaying inference.
   * @param request - issuer/credential captured by the model transport and its actual session.
   * @param signal - model request lifetime.
   * @returns the owned task id and protocol marker enforced at native API admission.
   */
  async prepare(request: BudgetRequest, signal: AbortSignal): Promise<PrepareResult> {
    if (typeof request.sessionId !== 'string' || request.sessionId.length === 0 || request.sessionId.length > 256)
      throw LlmError.fromFailure({ message: 'A real session is required for a HEY task budget', code: 'HEY_TASK_BUDGET_UNAVAILABLE' })
    const owned = AbortSignal.any([signal, this.lifetime.signal])
    if (request.kind === 'device' && !await this.stillCurrent(request.origin, request.token))
      throw LlmError.fromFailure({ message: 'The HeyWork account changed before budget admission', code: 'HEY_TASK_BUDGET_ACCOUNT_CHANGED' })
    const root = await this.rootOf(SessionId(request.sessionId), owned)
    const key = `${request.origin}\0${request.token}\0${root}`
    let value = this.cache.get(key)
    if (value === undefined || value.expires <= Date.now()) {
      let pending = this.pending.get(key)
      if (pending === undefined) {
        pending = this.view(root, request.origin, request.token, this.lifetime.signal)
        this.pending.set(key, pending)
        void pending.finally(() => { if (this.pending.get(key) === pending)
          this.pending.delete(key); }).catch(() => { })
      }
      let view: SessionBudgetView
      try {
        view = await waitForBudget(pending, owned)
      }
      catch (error) {
        owned.throwIfAborted()
        const failure = remoteErrorOf(error)
        if (failure?.code === 'hey-budget/failed' && failure.details.reason === 'account-required')
          throw new LlmError('Sign in to HeyWork again to read the session budget', 'ACCOUNT_TOKEN_INVALID', { status: 401 })
        throw LlmError.fromFailure({ message: 'The HEY session budget could not be read. The model request has not been dispatched.', code: 'HEY_TASK_BUDGET_UNAVAILABLE' }, { cause: error })
      }
      owned.throwIfAborted()
      value = this.remember(key, view)
    }
    if (request.kind === 'device' && !await this.stillCurrent(request.origin, request.token))
      throw LlmError.fromFailure({ message: 'The HeyWork account changed before dispatch', code: 'HEY_TASK_BUDGET_ACCOUNT_CHANGED' })
    if (value.value.budget.operatorPaused)
      throw LlmError.fromFailure({ message: 'Operations paused this session budget. Open Budget in the session header for the recorded reason.', code: 'HEY_TASK_BUDGET_PAUSED' })
    if (value.value.budget.state !== 'active')
      throw LlmError.fromFailure({ message: 'This session budget is paused or closed. Use Budget in the session header to resume it.', code: 'HEY_TASK_BUDGET_PAUSED' })
    if (!uuid.test(value.value.budget.id))
      throw LlmError.fromFailure({ message: 'HeyWork returned an invalid task budget', code: 'HEY_TASK_BUDGET_UNAVAILABLE' })
    return { taskId: value.value.budget.id, protocol: '1' }
  }
}

export { UmaTaskBudgets }
export default UmaTaskBudgets

async function waitForBudget(value: Promise<SessionBudgetView>, signal: AbortSignal): Promise<SessionBudgetView> {
  signal.throwIfAborted()
  let abort: (() => void) | undefined
  try {
    return await Promise.race([value, new Promise<never>((_resolve, reject) => {
      abort = () => {
        const reason = signal.reason
        reject(reason instanceof Error ? reason : new DOMException('The budget operation was aborted', 'AbortError'))
      }
      signal.addEventListener('abort', abort, { once: true })
      if (signal.aborted)
        abort()
    })])
  }
  finally {
    if (abort !== undefined)
      signal.removeEventListener('abort', abort)
  }
}
