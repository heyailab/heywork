/**
 * Self-test for packages/heywork-budget/src/index.js.
 * Run: node packages/heywork-budget/test-budget.mjs
 *
 * All host capabilities are injected with in-memory fakes. No network, no
 * @deepseek-ai/* imports. Verifies: frozen descriptor fields, read states,
 * update cap/spent/reserved + three-state transitions, reason codes,
 * LlmError codes, lineage guards and config bounds.
 */
import assert from 'node:assert/strict'

import {
  name, inject, IDENTITY, DEFAULTS, decimal, REASONS, REMOTE, LLM_ERRORS,
  apply, createService, RemoteError, LlmError,
} from './src/index.js'

const INSTALLATION_ID = 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d'
const BUDGET_ID = '11111111-2222-4333-8444-555555555555'
const ORIGIN = 'https://api.example.com'
const TOKEN = 'tok-1'
const sig = () => new AbortController().signal

function freshBudget(overrides = {}) {
  return {
    id: BUDGET_ID,
    purpose: 'HeyWork session',
    cap: null,
    spent: '0',
    reserved: '0',
    state: 'active',
    operatorPaused: false,
    operatorReason: '',
    version: 1,
    expiresAt: '2030-01-01T00:00:00+00:00',
    ...overrides,
  }
}

function ok(obj, issuer = ORIGIN, status = 200) {
  return { status, issuer, text: JSON.stringify(obj) }
}

function defaultTransport(state) {
  return async ({ method, path, body }) => {
    if (method === 'POST' && path === '/v1/session-budgets') {
      return ok({ budget: { ...state.budget } })
    }
    if (method === 'PATCH') {
      if (body.expected_version !== state.budget.version) {
        return ok({ budget: { ...state.budget } }, ORIGIN, 409)
      }
      // spent/reserved are server-authoritative — the patched view keeps them.
      state.budget = {
        ...state.budget,
        cap: body.cap,
        state: body.state,
        version: state.budget.version + 1,
      }
      return ok({ budget: { ...state.budget } })
    }
    throw new Error(`unexpected transport call: ${method} ${path}`)
  }
}

function makeHarness({ transportFactory = defaultTransport } = {}) {
  const state = {
    budget: freshBudget(),
    account: { origin: ORIGIN, token: TOKEN },
    sessions: {}, // id -> { origin, parentSession }
  }
  const ctx = {
    deepseekAccount: { getPlatformSession: () => ({ origin: state.account.origin }) },
    resolveToken: () => state.account.token,
    transport: transportFactory(state),
    sessionQuery: { getSession: (id) => state.sessions[id] ?? { origin: 'root' } },
  }
  const service = apply(ctx, { installationId: INSTALLATION_ID })
  return { state, ctx, service }
}

async function expectReason(fn, reason) {
  await assert.rejects(fn, (error) => {
    assert.ok(error instanceof RemoteError)
    assert.equal(error.code, REMOTE.code)
    assert.equal(error.message, REMOTE.message)
    assert.equal(error.details?.reason, reason)
    return true
  })
}

async function expectLlm(fn, code, message, status) {
  await assert.rejects(fn, (error) => {
    assert.ok(error instanceof LlmError)
    assert.equal(error.code, code)
    assert.equal(error.message, message)
    if (status !== undefined) assert.equal(error.status, status)
    return true
  })
}

// ---------------------------------------------------------------------------
// 1) Descriptor fields match the spec verbatim (typert, not defineTool).
// ---------------------------------------------------------------------------
{
  const { service, ctx } = makeHarness()
  const d = service.descriptors
  assert.equal(name, 'heywork-uma-task-budget')
  assert.deepEqual(inject, ['typert', 'storageDomain', 'sessionQuery'])
  assert.deepEqual(Object.keys(d), ['hey-budget/read', 'hey-budget/update'])

  const r = d['hey-budget/read']
  const u = d['hey-budget/update']

  // invocation id + identity
  assert.equal(r.id, 'hey-budget/read')
  assert.equal(u.id, 'hey-budget/update')
  assert.equal(r.service, 'umaTaskBudgets')
  assert.equal(u.service, 'umaTaskBudgets')
  assert.deepEqual(r.invocation, { kind: 'direct' })
  assert.deepEqual(u.invocation, { kind: 'direct' })

  // descriptions (verbatim)
  assert.equal(r.description, 'Read the root allowance for a real local session under the current HEY account.')
  assert.equal(u.description, 'Replace the reviewed root cap/state; accepted calls keep their reservations and can settle.')
  assert.equal(r.parameters[0].description, 'local session; delegated sessions resolve to their recorded root.')
  assert.equal(u.parameters[0].description, 'current session, observed version, explicit CNY cap or no extra cap, and next state.')

  // parameter + codec/strictCodec
  assert.equal(r.parameters[0].name, 'request')
  assert.equal(r.parameters[0].source, 'json')
  assert.equal(r.parameters[0].codec.mode, 'strict')
  assert.equal(r.parameters[0].strictCodec.mode, 'strict')
  assert.equal(
    r.parameters[0].codec.typeSymbol,
    '@deepseek-ai/dsh-uma-task-budget#hey-budget/read:request',
  )
  assert.equal(
    r.parameters[0].strictCodec.typeSymbol,
    '@deepseek-ai/dsh-uma-task-budget#hey-budget/read:request',
  )
  assert.equal(
    u.parameters[0].codec.typeSymbol,
    '@deepseek-ai/dsh-uma-task-budget#hey-budget/update:request',
  )

  // the codec-vs-strictCodec difference: additionalProperties true vs false
  assert.equal(r.parameters[0].codec.jsonSchema.additionalProperties, true)
  assert.equal(r.parameters[0].strictCodec.jsonSchema.additionalProperties, false)
  assert.equal(u.parameters[0].codec.jsonSchema.additionalProperties, true)
  assert.equal(u.parameters[0].strictCodec.jsonSchema.additionalProperties, false)
  assert.deepEqual(r.parameters[0].codec.jsonSchema.required, ['sessionId'])
  assert.deepEqual(u.parameters[0].codec.jsonSchema.required, [
    'sessionId', 'expectedVersion', 'cap', 'state',
  ])
  assert.deepEqual(u.parameters[0].codec.jsonSchema.properties.state.enum, [
    'active', 'paused', 'closed',
  ])
  assert.deepEqual(u.parameters[0].codec.jsonSchema.properties.cap.oneOf, [
    { type: 'null', const: null }, { type: 'string' },
  ])

  // cancellation + result
  assert.equal(r.cancellation.parameter, 'signal')
  assert.equal(u.cancellation.parameter, 'signal')
  assert.equal(r.result.mode, 'strict')
  assert.equal(r.result.typeSymbol, '@deepseek-ai/dsh-uma-task-budget/types#SessionBudgetView')
  assert.equal(u.result.typeSymbol, r.result.typeSymbol)
  assert.equal(r.result.description, 'a credential-free current allowance and root identity.')
  assert.equal(u.result.description, 'the committed allowance, or an explicit conflict requiring a fresh read.')

  // sourceLocation (verbatim line numbers)
  assert.deepEqual(r.sourceLocation, {
    file: 'packages/credentials/hey-task-budget/src/index.ts', line: 187, column: 9,
  })
  assert.deepEqual(u.sourceLocation, {
    file: 'packages/credentials/hey-task-budget/src/index.ts', line: 203, column: 9,
  })

  // non-defineTool: no output/render/presentCall/execute surface
  for (const key of ['output', 'render', 'presentCall', 'execute']) {
    assert.ok(!(key in r), `${key} must not appear on a typert descriptor`)
    assert.ok(!(key in u), `${key} must not appear on a typert descriptor`)
  }
  assert.equal(typeof r.implementation, 'function')
  assert.equal(typeof u.implementation, 'function')

  // registration is observable via injectable registerTypert
  assert.equal(ctx.__registered.length, 2)
  assert.equal(service.registered.length, 2)

  // frozen constants
  assert.equal(IDENTITY.namespace, 'hey-budget')
  assert.equal(DEFAULTS.timeoutMs, 10_000)
  assert.equal(DEFAULTS.cacheMs, 15_000)
  assert.equal(decimal.test('12.50'), true)
  assert.equal(decimal.test('0'), true)
  assert.equal(decimal.test('01'), false)
  assert.equal(decimal.test('1.1234567'), false)
}

// ---------------------------------------------------------------------------
// 2) read action: returns a SessionBudgetView for each of the three states.
// ---------------------------------------------------------------------------
{
  const h = makeHarness()
  const sessionId = 'session-aaa'
  for (const state of ['active', 'paused', 'closed']) {
    h.state.budget.state = state
    const view = await h.service.read({ sessionId }, sig())
    assert.equal(view.sessionId, sessionId)
    assert.equal(view.rootSessionId, sessionId)
    assert.equal(view.shared, false)
    assert.equal(view.budget.state, state)
    assert.equal(view.budget.purpose, 'HeyWork session')
  }

  // delegated session resolves to its recorded root; shared=true
  h.state.sessions['sub-1'] = { origin: 'subagent', parentSession: 'root-1' }
  const shared = await h.service.read({ sessionId: 'sub-1' }, sig())
  assert.equal(shared.rootSessionId, 'root-1')
  assert.equal(shared.sessionId, 'sub-1')
  assert.equal(shared.shared, true)
}

// ---------------------------------------------------------------------------
// 3) update action: cap/spent/reserved changes and three-state transitions.
// ---------------------------------------------------------------------------
{
  const h = makeHarness()
  const sessionId = 'session-upd'
  let view = await h.service.read({ sessionId }, sig())
  assert.equal(view.budget.cap, null)
  assert.equal(view.budget.spent, '0')
  assert.equal(view.budget.reserved, '0')

  // cap string + active -> paused; spent/reserved preserved (server-authoritative)
  view = await h.service.update({
    sessionId, expectedVersion: view.budget.version, cap: '12.50', state: 'paused',
  }, sig())
  assert.equal(view.budget.cap, '12.50')
  assert.equal(view.budget.state, 'paused')
  assert.equal(view.budget.spent, '0')
  assert.equal(view.budget.reserved, '0')
  assert.equal(view.budget.version, 2)

  // cap=null (no extra cap) + paused -> active
  view = await h.service.update({
    sessionId, expectedVersion: view.budget.version, cap: null, state: 'active',
  }, sig())
  assert.equal(view.budget.cap, null)
  assert.equal(view.budget.state, 'active')
  assert.equal(view.budget.version, 3)

  // active -> closed
  view = await h.service.update({
    sessionId, expectedVersion: view.budget.version, cap: '3', state: 'closed',
  }, sig())
  assert.equal(view.budget.state, 'closed')
  assert.equal(view.budget.version, 4)

  // a fresh read observes the committed state
  const reread = await h.service.read({ sessionId }, sig())
  assert.equal(reread.budget.state, 'closed')
  assert.equal(reread.budget.cap, '3')
}

// ---------------------------------------------------------------------------
// 4) At least 3 reason codes match verbatim (here: all of them).
// ---------------------------------------------------------------------------
{
  // invalid-budget: non-decimal cap
  {
    const h = makeHarness()
    await expectReason(() => h.service.update({
      sessionId: 's', expectedVersion: 1, cap: 'not-a-decimal', state: 'active',
    }, sig()), REASONS.invalidBudget)
  }
  // invalid-budget: bad expectedVersion
  {
    const h = makeHarness()
    await expectReason(() => h.service.update({
      sessionId: 's', expectedVersion: 0, cap: null, state: 'active',
    }, sig()), REASONS.invalidBudget)
  }
  // version-conflict (409)
  {
    const h = makeHarness()
    await h.service.read({ sessionId: 's' }, sig())
    h.state.budget.version = 9
    await expectReason(() => h.service.update({
      sessionId: 's', expectedVersion: 1, cap: null, state: 'active',
    }, sig()), REASONS.versionConflict)
  }
  // account-required (missing token)
  {
    const h = makeHarness()
    h.state.account.token = null
    await expectReason(() => h.service.read({ sessionId: 's' }, sig()), REASONS.accountRequired)
  }
  // invalid-issuer (non-HTTPS, non-loopback)
  {
    const h = makeHarness({ transportFactory: () => async () => ok({ budget: freshBudget() }, 'http://example.com') })
    await expectReason(() => h.service.read({ sessionId: 's' }, sig()), REASONS.invalidIssuer)
  }
  // response-too-large
  {
    const h = makeHarness({ transportFactory: () => async () => ({
      status: 200, issuer: ORIGIN, text: 'x'.repeat(70000),
    }) })
    await expectReason(() => h.service.read({ sessionId: 's' }, sig()), REASONS.responseTooLarge)
  }
  // invalid-response (malformed JSON)
  {
    const h = makeHarness({ transportFactory: () => async () => ({
      status: 200, issuer: ORIGIN, text: '{not json',
    }) })
    await expectReason(() => h.service.read({ sessionId: 's' }, sig()), REASONS.invalidResponse)
  }
  // budget-committed (402) / server-upgrade-required (404) / request-failed (500)
  for (const [status, reason] of [[402, REASONS.budgetCommitted], [404, REASONS.serverUpgradeRequired], [500, REASONS.requestFailed]]) {
    const h = makeHarness({ transportFactory: () => async () => ok({}, ORIGIN, status) })
    await expectReason(() => h.service.read({ sessionId: 's' }, sig()), reason)
  }
  // cyclic-session-lineage
  {
    const h = makeHarness()
    h.state.sessions.a = { origin: 'subagent', parentSession: 'b' }
    h.state.sessions.b = { origin: 'subagent', parentSession: 'a' }
    await expectReason(() => h.service.read({ sessionId: 'a' }, sig()), REASONS.cyclicSessionLineage)
  }
  // session-lineage-limit (> 64)
  {
    const h = makeHarness()
    for (let i = 0; i < 100; i += 1) {
      h.state.sessions[`n${i}`] = { origin: 'subagent', parentSession: `n${i + 1}` }
    }
    h.state.sessions.n100 = { origin: 'root' }
    await expectReason(() => h.service.read({ sessionId: 'n0' }, sig()), REASONS.sessionLineageLimit)
  }
  // account-changed (token flips between snapshots)
  {
    const h = makeHarness()
    let flips = 0
    const realResolve = h.ctx.resolveToken
    h.ctx.resolveToken = () => {
      flips += 1
      return flips <= 1 ? TOKEN : 'tok-2'
    }
    // service was built at apply() time with the original closure; rebuild
    const ctx = {
      ...h.ctx,
      resolveToken: h.ctx.resolveToken,
    }
    const svc = apply(ctx, { installationId: INSTALLATION_ID })
    await expectReason(() => svc.read({ sessionId: 's' }, sig()), REASONS.accountChanged)
    assert.equal(realResolve(), TOKEN)
  }
}

// ---------------------------------------------------------------------------
// 5) LlmError codes from the host-only prepare admission path.
// ---------------------------------------------------------------------------
{
  // success
  {
    const h = makeHarness()
    const result = await h.service.prepare({ sessionId: 's1', kind: 'device' }, sig())
    assert.deepEqual(result, { taskId: BUDGET_ID, protocol: '1' })
  }
  // invalid sessionId
  {
    const h = makeHarness()
    await expectLlm(
      () => h.service.prepare({ sessionId: '' }, sig()),
      LLM_ERRORS.unavailable, LLM_ERRORS.messages.realSessionRequired,
    )
  }
  // operatorPaused
  {
    const h = makeHarness()
    h.state.budget.operatorPaused = true
    await expectLlm(
      () => h.service.prepare({ sessionId: 's1' }, sig()),
      LLM_ERRORS.paused, LLM_ERRORS.messages.operatorPaused,
    )
  }
  // state !== active
  {
    const h = makeHarness()
    h.state.budget.state = 'paused'
    await expectLlm(
      () => h.service.prepare({ sessionId: 's1' }, sig()),
      LLM_ERRORS.paused, LLM_ERRORS.messages.notActive,
    )
  }
  // invalid taskId -> invalid budget
  {
    const h = makeHarness({ transportFactory: (state) => async () => {
      state.budget.id = 'not-a-uuid'
      return ok({ budget: { ...state.budget } })
    } })
    await expectLlm(
      () => h.service.prepare({ sessionId: 's1' }, sig()),
      LLM_ERRORS.unavailable, LLM_ERRORS.messages.invalidTaskBudget,
    )
  }
  // account-required in read -> ACCOUNT_TOKEN_INVALID (401)
  {
    const h = makeHarness()
    h.state.account.token = null
    await expectLlm(
      () => h.service.prepare({ sessionId: 's1' }, sig()),
      LLM_ERRORS.tokenInvalid, LLM_ERRORS.messages.signInAgain, 401,
    )
  }
}

// ---------------------------------------------------------------------------
// 6) Config bounds.
// ---------------------------------------------------------------------------
{
  assert.throws(
    () => createService({}, { timeoutMs: 50 }),
    (error) => error.message === 'HEY budget resource limits are invalid',
  )
  assert.throws(
    () => createService({}, { cacheMs: 60001 }),
    (error) => error.message === 'HEY budget resource limits are invalid',
  )
  const svc = createService({}, { timeoutMs: 100, cacheMs: 0, installationId: INSTALLATION_ID })
  assert.equal(svc.config.timeoutMs, 100)
  assert.equal(svc.config.cacheMs, 0)
}

console.log('budget self-test: ALL PASS')
