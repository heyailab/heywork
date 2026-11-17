/**
 * @heywork/budget — `dsh-uma-task-budget` budget tool family.
 *
 * WRITTEN FROM THE SPEC, NOT COPIED FROM SOURCE.
 * Every frozen value below is transcribed from specs/budget.md (278 lines),
 * which is the frozen contract. The reverse-engineered TS under
 * uma-assets/packages/dsh-uma-task-budget/src/ was used only to confirm field
 * placement; no implementation logic was copied from it.
 *
 * This is a typert REMOTE service, not a defineTool: there is no
 * name/description/parameters/output/execute/render/presentCall surface.
 * Host capabilities (account, transport, lineage, registration, schema
 * factory) are injected via ctx/config — nothing is imported from
 * @deepseek-ai/*.
 */

import { createHash } from 'node:crypto'

// ---------------------------------------------------------------------------
// Frozen identity & protocol constants (spec §1.1 / §二 / §三) — verbatim.
// ---------------------------------------------------------------------------

export const IDENTITY = Object.freeze({
  packageName: '@deepseek-ai/dsh-uma-task-budget',
  exportClass: 'UmaTaskBudgets',
  service: 'umaTaskBudgets',
  namespace: 'hey-budget',
  domain: { name: 'uma_session_budgets', version: 1 },
  invocation: Object.freeze({ read: 'hey-budget/read', update: 'hey-budget/update' }),
  typeSymbol: Object.freeze({
    request: {
      read: '@deepseek-ai/dsh-uma-task-budget#hey-budget/read:request',
      update: '@deepseek-ai/dsh-uma-task-budget#hey-budget/update:request',
    },
    result: '@deepseek-ai/dsh-uma-task-budget/types#SessionBudgetView',
  }),
})

/** Plugin-level `name`/`inject` exports (spec §二: static inject). */
export const name = 'heywork-uma-task-budget'
export const inject = ['typert', 'storageDomain', 'sessionQuery']

/** Default config values (spec §1.1 numeric bounds / §二 Config). */
export const DEFAULTS = Object.freeze({
  timeoutMs: 10_000,
  cacheMs: 15_000,
  maxResponseBytes: 65_536,
  maxLineageDepth: 64,
  maxCacheEntries: 1024,
  maxOperatorReason: 500,
  protocol: '1',
})

// Frozen regular expressions (spec §1.1) — verbatim.
export const decimal = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,6})?$/
const UUID_RE = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/
const STATES = Object.freeze(['active', 'paused', 'closed'])

// RemoteError codes / messages (spec §五) — verbatim.
export const REMOTE = Object.freeze({
  code: 'hey-budget/failed',
  message: 'The session budget operation could not be completed',
})

/** All RemoteError `details.reason` codes (spec §5.1 §5.2) — verbatim. */
export const REASONS = Object.freeze({
  accountRequired: 'account-required',
  accountChanged: 'account-changed',
  invalidIssuer: 'invalid-issuer',
  invalidResponse: 'invalid-response',
  responseTooLarge: 'response-too-large',
  requestFailed: 'request-failed',
  versionConflict: 'version-conflict',
  budgetCommitted: 'budget-committed',
  serverUpgradeRequired: 'server-upgrade-required',
  cyclicSessionLineage: 'cyclic-session-lineage',
  sessionLineageLimit: 'session-lineage-limit',
  invalidBudget: 'invalid-budget',
})

/** Host-only `prepare` LlmError codes/messages (spec §六) — verbatim. */
export const LLM_ERRORS = Object.freeze({
  unavailable: 'HEY_TASK_BUDGET_UNAVAILABLE',
  accountChanged: 'HEY_TASK_BUDGET_ACCOUNT_CHANGED',
  tokenInvalid: 'ACCOUNT_TOKEN_INVALID',
  paused: 'HEY_TASK_BUDGET_PAUSED',
  messages: Object.freeze({
    realSessionRequired: 'A real session is required for a HEY task budget',
    changedBeforeAdmission: 'The HeyWork account changed before budget admission',
    signInAgain: 'Sign in to HeyWork again to read the session budget',
    couldNotRead: 'The HEY session budget could not be read. The model request has not been dispatched.',
    changedBeforeDispatch: 'The HeyWork account changed before dispatch',
    operatorPaused: 'Operations paused this session budget. Open Budget in the session header for the recorded reason.',
    notActive: 'This session budget is paused or closed. Use Budget in the session header to resume it.',
    invalidTaskBudget: 'HeyWork returned an invalid task budget',
  }),
})

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

/** RemoteError: every read/update failure carries the frozen code + message. */
export class RemoteError extends Error {
  constructor(reason) {
    super(REMOTE.message)
    this.name = 'RemoteError'
    this.code = REMOTE.code
    this.details = { reason }
  }
}

const fail = (reason) => { throw new RemoteError(reason) }

/** LlmError used only by the host-only `prepare` admission path. */
export class LlmError extends Error {
  constructor(code, message, status = undefined) {
    super(message)
    this.name = 'LlmError'
    this.code = code
    if (status !== undefined) this.status = status
  }
}

const llmFail = (code, message, status) => { throw new LlmError(code, message, status) }

function assertDeps(deps, required) {
  for (const key of required) {
    if (deps[key] === undefined || deps[key] === null) {
      throw new Error(`@heywork/budget: missing injected dependency: ${key}`)
    }
  }
}

// ---------------------------------------------------------------------------
// Frozen jsonSchema literals (spec §三 table / host descriptor).
// codec = additionalProperties:true, strictCodec = additionalProperties:false.
// ---------------------------------------------------------------------------

const READ_REQUEST_JSON = {
  type: 'object',
  properties: { sessionId: { type: 'string' } },
  required: ['sessionId'],
  additionalProperties: true,
}
const READ_REQUEST_STRICT_JSON = { ...READ_REQUEST_JSON, additionalProperties: false }

const UPDATE_REQUEST_JSON = {
  type: 'object',
  properties: {
    sessionId: { type: 'string' },
    expectedVersion: { type: 'number' },
    cap: { oneOf: [{ type: 'null', const: null }, { type: 'string' }] },
    state: { type: 'string', enum: ['active', 'paused', 'closed'] },
  },
  required: ['sessionId', 'expectedVersion', 'cap', 'state'],
  additionalProperties: true,
}
const UPDATE_REQUEST_STRICT_JSON = { ...UPDATE_REQUEST_JSON, additionalProperties: false }

const RESULT_JSON_SCHEMA = {
  type: 'object',
  properties: {
    sessionId: { type: 'string' },
    rootSessionId: { type: 'string' },
    shared: { type: 'boolean' },
    budget: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        purpose: { type: 'string' },
        cap: { oneOf: [{ type: 'null', const: null }, { type: 'string' }] },
        spent: { type: 'string' },
        reserved: { type: 'string' },
        state: { type: 'string', enum: ['active', 'paused', 'closed'] },
        operatorPaused: { type: 'boolean' },
        operatorReason: { type: 'string' },
        version: { type: 'number' },
        expiresAt: { type: 'string' },
      },
      required: [
        'id', 'purpose', 'cap', 'spent', 'reserved', 'state',
        'operatorPaused', 'operatorReason', 'version', 'expiresAt',
      ],
      additionalProperties: true,
    },
  },
  required: ['sessionId', 'rootSessionId', 'shared', 'budget'],
  additionalProperties: true,
}

const READ_SOURCE_LOCATION = { file: 'packages/credentials/hey-task-budget/src/index.ts', line: 187, column: 9 }
const UPDATE_SOURCE_LOCATION = { file: 'packages/credentials/hey-task-budget/src/index.ts', line: 203, column: 9 }

/**
 * Build the two invocation descriptors (spec §三). Keys are the verbatim
 * invocation ids; an `id` field is mirrored on each descriptor for observable
 * identity. `implementation` binds the callable handler for registerTypert.
 * NOTE: no output/render/presentCall — this is not a defineTool surface.
 */
export function buildDescriptors(implementation = {}, createSchema = undefined) {
  const create = (shape) => (createSchema ? createSchema(shape) : ((value) => value))

  const read = {
    id: IDENTITY.invocation.read,
    service: IDENTITY.service,
    description: 'Read the root allowance for a real local session under the current HEY account.',
    invocation: { kind: 'direct' },
    parameters: [{
      name: 'request',
      description: 'local session; delegated sessions resolve to their recorded root.',
      source: 'json',
      codec: {
        mode: 'strict',
        typeSymbol: IDENTITY.typeSymbol.request.read,
        create: create(READ_REQUEST_JSON),
        jsonSchema: READ_REQUEST_JSON,
      },
      strictCodec: {
        mode: 'strict',
        typeSymbol: IDENTITY.typeSymbol.request.read,
        create: create(READ_REQUEST_STRICT_JSON),
        jsonSchema: READ_REQUEST_STRICT_JSON,
      },
    }],
    cancellation: { parameter: 'signal' },
    result: {
      mode: 'strict',
      typeSymbol: IDENTITY.typeSymbol.result,
      create: create(RESULT_JSON_SCHEMA),
      description: 'a credential-free current allowance and root identity.',
      jsonSchema: RESULT_JSON_SCHEMA,
    },
    sourceLocation: { ...READ_SOURCE_LOCATION },
  }

  const update = {
    id: IDENTITY.invocation.update,
    service: IDENTITY.service,
    description: 'Replace the reviewed root cap/state; accepted calls keep their reservations and can settle.',
    invocation: { kind: 'direct' },
    parameters: [{
      name: 'request',
      description: 'current session, observed version, explicit CNY cap or no extra cap, and next state.',
      source: 'json',
      codec: {
        mode: 'strict',
        typeSymbol: IDENTITY.typeSymbol.request.update,
        create: create(UPDATE_REQUEST_JSON),
        jsonSchema: UPDATE_REQUEST_JSON,
      },
      strictCodec: {
        mode: 'strict',
        typeSymbol: IDENTITY.typeSymbol.request.update,
        create: create(UPDATE_REQUEST_STRICT_JSON),
        jsonSchema: UPDATE_REQUEST_STRICT_JSON,
      },
    }],
    cancellation: { parameter: 'signal' },
    result: {
      mode: 'strict',
      typeSymbol: IDENTITY.typeSymbol.result,
      create: create(RESULT_JSON_SCHEMA),
      description: 'the committed allowance, or an explicit conflict requiring a fresh read.',
      jsonSchema: RESULT_JSON_SCHEMA,
    },
    sourceLocation: { ...UPDATE_SOURCE_LOCATION },
  }

  if (implementation.read) read.implementation = implementation.read
  if (implementation.update) update.implementation = implementation.update

  return Object.freeze({
    [IDENTITY.invocation.read]: read,
    [IDENTITY.invocation.update]: update,
  })
}

// ---------------------------------------------------------------------------
// Service construction: read/update/prepare + cache + lineage.
// ---------------------------------------------------------------------------

function combineSignals(signals) {
  const list = signals.filter(Boolean)
  if (list.length === 0) return undefined
  if (typeof AbortSignal.any === 'function') return AbortSignal.any(list)
  const controller = new AbortController()
  for (const signal of list) {
    if (signal.aborted) controller.abort(signal.reason)
    else signal.addEventListener('abort', () => controller.abort(signal.reason), { once: true })
  }
  return controller.signal
}

function browserSafeIssuer(issuer) {
  if (typeof issuer !== 'string') return false
  let url
  try { url = new URL(issuer) } catch { return false }
  if (url.username || url.password) return false // userinfo not allowed
  if (url.protocol === 'https:') return true
  if (url.protocol === 'http:' && (url.hostname === '127.0.0.1' || url.hostname === 'localhost')) return true
  return false
}

/** Session lineage: follow only subagent sessions with a parentSession. */
function rootOf(sessionId, sessionQuery) {
  let current = sessionId
  const seen = new Set()
  for (let depth = 0; ; depth += 1) {
    if (depth > DEFAULTS.maxLineageDepth) fail(REASONS.sessionLineageLimit)
    const entry = sessionQuery?.getSession?.(current)
    if (!entry || entry.origin !== 'subagent' || !entry.parentSession) return current
    if (seen.has(current)) fail(REASONS.cyclicSessionLineage)
    seen.add(current)
    current = entry.parentSession
  }
}

/** Minimal cache with stale-version protection and the 1024-entry clear. */
function createCache(cfg) {
  const map = new Map()
  return {
    get(key) {
      const hit = map.get(key)
      if (!hit) return undefined
      if (hit.expires <= Date.now()) { map.delete(key); return undefined }
      return hit.view
    },
    remember(key, view) {
      const version = view?.budget?.version ?? 0
      const prior = map.get(key)
      if (prior && version < (prior.version ?? 0)) return view // stale: do not overwrite
      if (!prior && map.size >= cfg.maxCacheEntries) map.clear()
      map.set(key, { view, version, expires: Date.now() + cfg.cacheMs })
      return view
    },
    clear() { map.clear() },
    get size() { return map.size },
  }
}

/**
 * Parse/validate a transport response. The injected transport must return
 * `{ status, issuer, text }` (text = raw response body).
 */
function decodeEnvelope(response) {
  const text = typeof response.text === 'string' ? response.text : JSON.stringify(response.text ?? '')
  if (Buffer.byteLength(text, 'utf8') > DEFAULTS.maxResponseBytes) fail(REASONS.responseTooLarge)
  if (!browserSafeIssuer(response.issuer)) fail(REASONS.invalidIssuer)

  const status = response.status ?? 200
  if (status === 401) fail(REASONS.accountRequired)
  if (status === 402) fail(REASONS.budgetCommitted)
  if (status === 404) fail(REASONS.serverUpgradeRequired)
  if (status === 409) fail(REASONS.versionConflict)
  if (status < 200 || status >= 300) fail(REASONS.requestFailed)

  let envelope
  try { envelope = JSON.parse(text) } catch { fail(REASONS.invalidResponse) }
  if (!envelope || typeof envelope !== 'object' || !isBudget(envelope.budget)) fail(REASONS.invalidResponse)
  return envelope
}

function isBudget(budget) {
  if (!budget || typeof budget !== 'object') return false
  return typeof budget.id === 'string'
    && typeof budget.purpose === 'string'
    && (budget.cap === null || typeof budget.cap === 'string')
    && typeof budget.spent === 'string'
    && typeof budget.reserved === 'string'
    && STATES.includes(budget.state)
    && typeof budget.operatorPaused === 'boolean'
    && typeof budget.operatorReason === 'string'
    && Number.isSafeInteger(budget.version)
    && typeof budget.expiresAt === 'string'
}

/**
 * Create the service bound to injected deps.
 *
 * Required injection (per spec §二 + §五):
 *  - deepseekAccount.getPlatformSession(): { origin }  (account origin)
 *  - resolveToken(): string                            (Bearer token)
 *  - transport(req): { status, issuer, text }          (HTTP POST/PATCH)
 *  - sessionQuery.getSession(id): { origin, parentSession }  (lineage)
 *  - config.installationId: string (uuid)              (local install id)
 * Optional:
 *  - registerTypert(descriptor)                        (typert registration)
 *  - createSchema(jsonSchema)                          (zod schema factory)
 *  - lifetimeSignal: AbortSignal                       (service abort)
 */
export function createService(deps = {}, config = {}) {
  const cfg = {
    ...DEFAULTS,
    ...config,
  }
  // Numeric bounds (spec §1.1): safe integers, timeout 100–60000, cache 0–60000.
  if (!Number.isSafeInteger(cfg.timeoutMs) || cfg.timeoutMs < 100 || cfg.timeoutMs > 60000
      || !Number.isSafeInteger(cfg.cacheMs) || cfg.cacheMs < 0 || cfg.cacheMs > 60000) {
    throw new Error('HEY budget resource limits are invalid')
  }

  const cache = createCache(cfg)
  const installationId = cfg.installationId ?? deps.installationId ?? null
  const transport = deps.transport

  function accountSnapshot() {
    const platform = deps.deepseekAccount?.getPlatformSession?.()
    return {
      origin: platform?.origin ?? null,
      token: deps.resolveToken ? deps.resolveToken() : (platform?.token ?? null),
    }
  }

  function requireAccount() {
    const account = accountSnapshot()
    if (!account.origin || !account.token) fail(REASONS.accountRequired)
    return account
  }

  function stillCurrent(before) {
    const now = accountSnapshot()
    return now.origin === before.origin && now.token === before.token
  }

  function request(endpoint) {
    if (typeof transport !== 'function') {
      throw new Error('@heywork/budget: missing injected dependency: transport')
    }
    const signal = combineSignals([endpoint.signal, deps.lifetimeSignal, AbortSignal.timeout?.(cfg.timeoutMs)])
    return transport({ ...endpoint, signal })
  }

  function makeView(sessionId, root, budget) {
    return {
      sessionId,
      rootSessionId: root,
      shared: sessionId !== root,
      budget,
    }
  }

  async function read(request_, signal) {
    const sessionId = request_?.sessionId
    if (typeof sessionId !== 'string' || sessionId.length === 0) fail(REASONS.invalidResponse)

    const before = requireAccount()
    const root = rootOf(sessionId, deps.sessionQuery)
    if (!stillCurrent(before)) fail(REASONS.accountChanged)

    const reference = createHash('sha256').update(`${installationId}\0${String(root)}`).digest('hex')
    const key = `${before.origin}\0${before.token}\0${root}`
    const envelope = decodeEnvelope(await request({
      method: 'POST',
      path: '/v1/session-budgets',
      body: {
        client_ref: installationId,
        session_ref: reference,
        purpose: 'HeyWork session',
        cap: null,
      },
      origin: before.origin,
      token: before.token,
      signal,
    }))
    if (!stillCurrent(before)) fail(REASONS.accountChanged)

    const view = makeView(sessionId, root, envelope.budget)
    cache.remember(key, view)
    return view
  }

  async function update(request_, signal) {
    const { sessionId, expectedVersion, cap, state } = request_ ?? {}
    // Local validation (spec §5.2): invalid-budget.
    if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1
        || (cap !== null && !decimal.test(cap)) || !STATES.includes(state)) {
      fail(REASONS.invalidBudget)
    }

    const before = requireAccount()
    const root = rootOf(sessionId, deps.sessionQuery)
    const key = `${before.origin}\0${before.token}\0${root}`

    // The PATCH path needs the root budget id; prime from cache, else read.
    let prior = cache.get(key)
    if (!prior) prior = await read({ sessionId }, signal)
    const budgetId = prior.budget.id

    if (!stillCurrent(before)) fail(REASONS.accountChanged)

    const envelope = decodeEnvelope(await request({
      method: 'PATCH',
      path: `/v1/session-budgets/${budgetId}`,
      body: { cap, state, expected_version: expectedVersion },
      origin: before.origin,
      token: before.token,
      signal,
    }))
    if (!stillCurrent(before)) fail(REASONS.accountChanged)

    const view = makeView(sessionId, root, envelope.budget)
    cache.remember(key, view)
    return view
  }

  /** Host-only admission. Not a typert Remote and not model-visible. */
  async function prepare(request_, signal) {
    const sessionId = request_?.sessionId
    if (typeof sessionId !== 'string' || sessionId.length === 0 || sessionId.length > 256) {
      llmFail(LLM_ERRORS.unavailable, LLM_ERRORS.messages.realSessionRequired)
    }

    const accountBefore = accountSnapshot()
    const sameAccount = () => {
      const now = accountSnapshot()
      return now.origin === accountBefore.origin && now.token === accountBefore.token
    }

    if (request_?.kind === 'device' && !sameAccount()) {
      llmFail(LLM_ERRORS.accountChanged, LLM_ERRORS.messages.changedBeforeAdmission)
    }

    let view
    try {
      view = await read({ sessionId }, signal)
    } catch (error) {
      if (error instanceof RemoteError && error.details?.reason === REASONS.accountRequired) {
        llmFail(LLM_ERRORS.tokenInvalid, LLM_ERRORS.messages.signInAgain, 401)
      }
      llmFail(LLM_ERRORS.unavailable, LLM_ERRORS.messages.couldNotRead)
    }

    if (request_?.kind === 'device' && !sameAccount()) {
      llmFail(LLM_ERRORS.accountChanged, LLM_ERRORS.messages.changedBeforeDispatch)
    }
    if (view.budget.operatorPaused === true) {
      llmFail(LLM_ERRORS.paused, LLM_ERRORS.messages.operatorPaused)
    }
    if (view.budget.state !== 'active') {
      llmFail(LLM_ERRORS.paused, LLM_ERRORS.messages.notActive)
    }
    if (!UUID_RE.test(view.budget.id)) {
      llmFail(LLM_ERRORS.unavailable, LLM_ERRORS.messages.invalidTaskBudget)
    }
    return { taskId: view.budget.id, protocol: DEFAULTS.protocol }
  }

  const service = {
    read,
    update,
    prepare,
    cache,
    config: cfg,
    descriptors: buildDescriptors({ read, update }, deps.createSchema),
  }

  // Lifecycle cleanup (spec §二): abort + clear cache.
  if (typeof deps.effect === 'function') {
    deps.effect(() => () => cache.clear())
  }
  // Account events clear cache (spec §二) when an event bus is injected.
  for (const event of ['deepseek-account/signed-out', 'deepseek-account/access-blocked']) {
    if (typeof deps.on === 'function') deps.on(event, () => cache.clear())
  }

  return service
}

/**
 * Plugin entry. Registers the two typert descriptors via an injectable
 * `registerTypert(descriptor)` on ctx/config.deps.
 *
 * The spec does not name a concrete typert registration API, so the
 * observable behavior is: every descriptor is handed to `registerTypert`.
 * When absent, a local collector is used and exposed on
 * `service.registered` so registration remains observable/testable.
 */
export function apply(ctx = {}, config = {}) {
  const deps = { ...ctx, ...(config.deps ?? {}) }
  const cfg = { ...config }

  const service = createService(deps, cfg)

  const registered = []
  const external = deps.registerTypert ?? ctx.registerTypert ?? ctx.typert?.register
  const registerTypert = (descriptor) => {
    registered.push(descriptor)
    if (typeof external === 'function') external(descriptor)
  }
  for (const descriptor of Object.values(service.descriptors)) registerTypert(descriptor)

  service.registered = registered
  ctx.__registered = registered
  return service
}

export default apply
