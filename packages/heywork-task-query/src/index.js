/**
 * @heywork/task-query — `taskQuery` task-query projection service.
 *
 * WRITTEN FROM THE SPEC, NOT COPIED FROM SOURCE.
 * Every frozen value below is transcribed from specs/task-query.md (159 lines),
 * which is the frozen contract. The reverse-engineered tsc `lib` was NOT read;
 * no implementation logic was copied from it.
 *
 * This is a SERVICE, not a defineTool: there is no name/description/parameters/
 * output/execute/render/presentCall tool surface. The service exposes exactly
 * one public method, `current(session, claimed)`, which is a read-only preview
 * of a bounded "current task retrieval query".
 *
 * Injection mode: no `@deepseek-ai/*` package is imported. The only upstream
 * capability, `sessionProjections`, is injected through ctx/config.
 */

// ---------------------------------------------------------------------------
// Frozen identity & projection constants (spec §1.1 / §二) — verbatim.
// ---------------------------------------------------------------------------

/** Service registration name: super(ctx, 'taskQuery') (L:67). */
export const SERVICE_NAME = 'taskQuery'
/** Projection key: 'workspaceRetrievalQuery' (L:71). */
export const PROJECTION_KEY = 'workspaceRetrievalQuery'
/** Projection stateVersion: 3 (L:72). */
export const STATE_VERSION = 3
/** Character-window cap (L:5). */
export const WINDOW = 4000

/** Plugin-level exports (spec §二: static inject / cordis plugin shape). */
export const name = 'heywork-task-query'
export const inject = Object.freeze(['sessionProjections'])

/** Projection initial state `{ task:'', latest:'', freshTurn:true }` (L:11-15). */
export const EMPTY = Object.freeze({ task: '', latest: '', freshTurn: true })

/** New-task sources (L:16). */
export const NEW_TASK_SOURCES = new Set(['user', 'schedule'])

/** Admissible sources (L:17-22). */
export const TASK_SOURCES = new Set([
  'user', 'schedule', 'agent-message', 'team-message',
])

/** The single error text of this service (L:85). */
export const NOT_READY_MESSAGE = 'Task query projection is not ready'

/**
 * Minimal zod-compatible state schema (spec §1.2, L:6-10):
 * z.object({ task: z.string().max(WINDOW), latest: z.string().max(WINDOW),
 * freshTurn: z.boolean() }). `safeParse` exists so injected projection owners
 * can validate states; it is not otherwise used by this service.
 */
function safeParseState(value) {
  if (value === null || typeof value !== 'object') return { success: false }
  const { task, latest, freshTurn } = value
  if (typeof task !== 'string' || task.length > WINDOW) return { success: false }
  if (typeof latest !== 'string' || latest.length > WINDOW) return { success: false }
  if (typeof freshTurn !== 'boolean') return { success: false }
  return { success: true, data: { task, latest, freshTurn } }
}

export const stateSchema = Object.freeze({
  type: 'object',
  shape: Object.freeze({
    task: Object.freeze({ type: 'string', max: WINDOW }),
    latest: Object.freeze({ type: 'string', max: WINDOW }),
    freshTurn: Object.freeze({ type: 'boolean' }),
  }),
  safeParse: safeParseState,
})

// ---------------------------------------------------------------------------
// Limited Service base (injection stand-in for cordis `Service`).
// Only what is needed for `super(ctx, 'taskQuery')` and `[Service.init]`.
// ---------------------------------------------------------------------------

/** Symbol used as the `[Service.init]` method key. */
export const ServiceInit = Symbol('Service.init')

class Service {
  static init = ServiceInit

  constructor(ctx, serviceName) {
    this.ctx = ctx
    this.service = serviceName
  }
}

// ---------------------------------------------------------------------------
// Projection semantics (spec §三) — external behavior, transcribed from spec.
// ---------------------------------------------------------------------------

const isLowSurrogate = (unit) => unit >= 0xDC00 && unit <= 0xDFFF

/**
 * bounded(text) (spec §3.3, verbatim semantics):
 *   length <= 4000 -> unchanged.
 *   head = 2000, tail = length - 1999; avoid cutting a UTF-16 surrogate pair;
 *   return `${slice(0, head)}\n${slice(tail)}`.
 */
export function bounded(text) {
  if (text.length <= WINDOW) return text
  let head = 2000
  let tail = text.length - 1999
  if (isLowSurrogate(text.charCodeAt(head))) head -= 1
  if (isLowSurrogate(text.charCodeAt(tail))) tail += 1
  return `${text.slice(0, head)}\n${text.slice(tail)}`
}

/**
 * Concatenate only `type === 'text'` parts of `message.content` with `\n`,
 * then bound the result (spec §3.3). Non-array content yields `''`.
 */
export function messageText(message) {
  const content = message?.content
  const parts = []
  if (Array.isArray(content)) {
    for (const part of content) {
      if (part && part.type === 'text') parts.push(part.text)
    }
  }
  return bounded(parts.join('\n'))
}

/**
 * admit(state, message) (spec §3.1): source admission + steering/new-task
 * branches. Returns a NEW state; never mutates the input (readonly preview).
 *
 * The "new task" branch (new-task source OR freshTurn OR empty task) is
 * checked before the "steering" branch so that the freshTurn reset condition
 * in row 4 has effect; steering is the remaining case (agent/team message
 * with a non-empty task and freshTurn false).
 */
export function admit(state, message) {
  const kind = message?.source?.kind
  if (!TASK_SOURCES.has(kind)) return state

  const text = messageText(message)
  if (text.trim() === '') return state

  const startsNewTask = NEW_TASK_SOURCES.has(kind)
    || state.freshTurn === true
    || state.task === ''

  if (startsNewTask) {
    return { task: text, latest: '', freshTurn: false }
  }
  // remaining admissible sources: agent-message / team-message steering
  return { task: state.task, latest: text, freshTurn: false }
}

/**
 * fold(state, event) (spec §3.2): the projection `apply` function, named
 * `fold` per L:75. External state-transition rules:
 *   turn/start         -> freshTurn true unless already true.
 *   user/message       -> admit; object surfaceOp resets to EMPTY first.
 *   other / bad source -> unchanged.
 */
export function fold(state, event) {
  const type = event?.type
  if (type === 'turn/start') {
    if (state.freshTurn === true) return state
    return { ...state, freshTurn: true }
  }
  if (type === 'user/message') {
    if (!TASK_SOURCES.has(event?.source?.kind)) return state
    // `typeof null === 'object'` — matches the verbatim spec predicate.
    const base = typeof event.surfaceOp === 'object' ? EMPTY : state
    return admit(base, event)
  }
  return state
}

// ---------------------------------------------------------------------------
// Service (spec §二 + §4.1 / §4.2).
// ---------------------------------------------------------------------------

export class TaskQuery extends Service {
  static inject = inject

  constructor(ctx) {
    super(ctx, SERVICE_NAME)
    // Projection handle: undefined until [Service.init] registers it (L:61).
    this.handle = undefined
  }

  /**
   * async [Service.init]() (L:69-77). Registers the projection and assigns the
   * returned handle to `this.handle`. Errors from `register` propagate as-is.
   */
  async [ServiceInit]() {
    const handle = await this.ctx.sessionProjections.register({
      key: PROJECTION_KEY,
      stateVersion: STATE_VERSION,
      stateSchema,
      init: () => EMPTY,
      apply: fold,
    })
    this.handle = handle
    return this
  }

  /**
   * current(session, claimed) (L:84-88) — the ONLY public method.
   * Synchronous, read-only preview: folds `claimed` onto the projection state
   * without writing it back. Returns the bounded query string.
   */
  current(session, claimed) {
    if (this.handle === undefined) throw new Error(NOT_READY_MESSAGE)

    const state = claimed.reduce(admit, this.handle.stateOf(session))
    if (state.latest === '') return state.task
    return bounded(`${state.task}\n${state.latest}`)
  }
}

/**
 * Plugin entry (injection mode). Resolves the injected `sessionProjections`
 * from ctx (or config/config.deps overrides), constructs the service and runs
 * its async [Service.init] registration. No @deepseek-ai/* imports.
 */
export async function apply(ctx = {}, config = {}) {
  const resolvedCtx = {
    ...ctx,
    ...(config.deps ?? {}),
    ...(config.sessionProjections ? { sessionProjections: config.sessionProjections } : {}),
  }
  const service = new TaskQuery(resolvedCtx)
  await service[ServiceInit]()
  return service
}

export default apply
