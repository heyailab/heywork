/**
 * Self-test for packages/heywork-task-query/src/index.js.
 * Run: node packages/heywork-task-query/test-task-query.mjs
 *
 * All upstream capabilities are injected with in-memory fakes. No network, no
 * @deepseek-ai/* imports. Verifies: service registration (key/version/schema/
 * init/apply), current ready/unready, the three constants + WINDOW, projection
 * fold/admit/bounded semantics, readonly preview and the verbatim error text.
 */
import assert from 'node:assert/strict'

import {
  name, inject, SERVICE_NAME, PROJECTION_KEY, STATE_VERSION, WINDOW,
  EMPTY, NEW_TASK_SOURCES, TASK_SOURCES, NOT_READY_MESSAGE, stateSchema,
  ServiceInit, TaskQuery, bounded, messageText, admit, fold, apply,
} from './src/index.js'

const sessionKey = (s) => (typeof s === 'string' ? s : (s?.id ?? JSON.stringify(s)))

/** In-memory stand-in for the injected sessionProjections service. */
function makeProjectionHost() {
  const descriptors = []
  const states = new Map()
  return {
    descriptors,
    states,
    async register(descriptor) {
      descriptors.push(descriptor)
      return {
        descriptor,
        stateOf(session) {
          const key = sessionKey(session)
          if (!states.has(key)) states.set(key, descriptor.init())
          return states.get(key)
        },
      }
    },
  }
}

const msg = (kind, text, extra = {}) => ({
  type: 'user/message',
  source: { kind },
  content: [{ type: 'text', text }],
  ...extra,
})

function hasBrokenSurrogate(s) {
  for (let i = 0; i < s.length; i += 1) {
    const c = s.charCodeAt(i)
    if (c >= 0xD800 && c <= 0xDBFF) {
      const n = s.charCodeAt(i + 1)
      if (!(n >= 0xDC00 && n <= 0xDFFF)) return true
    } else if (c >= 0xDC00 && c <= 0xDFFF) {
      const p = s.charCodeAt(i - 1)
      if (!(p >= 0xD800 && p <= 0xDBFF)) return true
    }
  }
  return false
}

// ---------------------------------------------------------------------------
// 1) Identity, constants and service registration (spec §1.1 / §二).
// ---------------------------------------------------------------------------
{
  const host = makeProjectionHost()
  const svc = await apply({ sessionProjections: host })

  assert.equal(name, 'heywork-task-query')
  assert.deepEqual(inject, ['sessionProjections'])
  assert.equal(Object.isFrozen(inject), true)
  assert.equal(SERVICE_NAME, 'taskQuery')
  assert.equal(svc.service, 'taskQuery')
  assert.deepEqual(TaskQuery.inject, ['sessionProjections'])
  assert.equal(typeof svc[ServiceInit], 'function')

  // three constants + WINDOW
  assert.equal(WINDOW, 4000)
  assert.deepEqual(EMPTY, { task: '', latest: '', freshTurn: true })
  assert.equal(Object.isFrozen(EMPTY), true)
  assert.deepEqual([...NEW_TASK_SOURCES], ['user', 'schedule'])
  assert.deepEqual([...TASK_SOURCES], ['user', 'schedule', 'agent-message', 'team-message'])

  // projection registration is verbatim
  assert.equal(host.descriptors.length, 1)
  const d = host.descriptors[0]
  assert.equal(d.key, 'workspaceRetrievalQuery')
  assert.equal(PROJECTION_KEY, 'workspaceRetrievalQuery')
  assert.equal(d.stateVersion, 3)
  assert.equal(STATE_VERSION, 3)
  assert.equal(d.apply, fold)
  assert.deepEqual(d.init(), EMPTY)
  assert.strictEqual(d.init(), EMPTY)

  // zod-like state schema (spec §1.2)
  assert.equal(stateSchema.shape.task.max, 4000)
  assert.equal(stateSchema.shape.latest.max, 4000)
  assert.equal(stateSchema.shape.freshTurn.type, 'boolean')
  assert.equal(stateSchema.safeParse({ task: 'x', latest: '', freshTurn: false }).success, true)
  assert.equal(stateSchema.safeParse({ task: 'x'.repeat(4001), latest: '', freshTurn: false }).success, false)
  assert.equal(stateSchema.safeParse({ task: 'x', latest: 'y'.repeat(4001), freshTurn: false }).success, false)
  assert.equal(stateSchema.safeParse({ task: 'x', latest: '', freshTurn: 'no' }).success, false)

  // config injection path
  const host2 = makeProjectionHost()
  await apply({}, { sessionProjections: host2 })
  assert.equal(host2.descriptors.length, 1)
}

// ---------------------------------------------------------------------------
// 2) current: unready error text (verbatim) and ready default (spec §4.1).
// ---------------------------------------------------------------------------
{
  const host = makeProjectionHost()
  const unready = new TaskQuery({ sessionProjections: host })
  assert.equal(unready.handle, undefined)
  assert.throws(
    () => unready.current('s', []),
    (error) => {
      assert.ok(error instanceof Error)
      assert.equal(error.message, 'Task query projection is not ready')
      assert.equal(NOT_READY_MESSAGE, 'Task query projection is not ready')
      return true
    },
  )

  const svc = await apply({ sessionProjections: host })
  assert.notEqual(svc.handle, undefined)
  assert.equal(svc.current('s', []), '') // empty state -> ''
}

// ---------------------------------------------------------------------------
// 3) current: admit through the public API, read-only preview (spec §3.1/§4.1).
// ---------------------------------------------------------------------------
{
  const host = makeProjectionHost()
  const svc = await apply({ sessionProjections: host })

  // freshTurn=true (EMPTY) -> first user message becomes the task
  host.states.set('s1', { ...EMPTY })
  assert.equal(svc.current('s1', [msg('user', 'hello')]), 'hello')
  assert.deepEqual(host.states.get('s1'), { task: '', latest: '', freshTurn: true }) // unchanged

  // steering with non-empty task -> latest, joined via bounded(task + '\n' + latest)
  host.states.set('s1', { task: 'hello', latest: '', freshTurn: false })
  assert.equal(svc.current('s1', [msg('team-message', 'steer')]), 'hello\nsteer')
  assert.deepEqual(host.states.get('s1'), { task: 'hello', latest: '', freshTurn: false })

  // non-admissible source / blank text are ignored
  host.states.set('s1', { task: 'keep', latest: '', freshTurn: false })
  assert.equal(svc.current('s1', [msg('other', 'x'), msg('user', '   ')]), 'keep')

  // freshTurn=true makes even a steering source a new task
  host.states.set('s1', { task: 'old', latest: 'ld', freshTurn: true })
  assert.equal(svc.current('s1', [msg('agent-message', 'fresh')]), 'fresh')

  // reduce folds multiple claimed items in order
  host.states.set('s1', { ...EMPTY })
  assert.equal(svc.current('s1', [msg('user', 'A'), msg('agent-message', 'B')]), 'A\nB')
}

// ---------------------------------------------------------------------------
// 4) fold semantics through the registered projection apply (spec §3.2).
// ---------------------------------------------------------------------------
{
  const host = makeProjectionHost()
  await apply({ sessionProjections: host })
  const d = host.descriptors[0]

  // turn/start on EMPTY (freshTurn true) -> unchanged
  const s0 = d.init()
  assert.strictEqual(d.apply(s0, { type: 'turn/start' }), s0)

  // user message -> new task (freshTurn consumed)
  const s1 = d.apply(s0, msg('user', 'task-A'))
  assert.deepEqual(s1, { task: 'task-A', latest: '', freshTurn: false })

  // steering (freshTurn false, task non-empty) -> latest, task preserved
  const sSteer = d.apply(s1, msg('team-message', 'steer-B'))
  assert.deepEqual(sSteer, { task: 'task-A', latest: 'steer-B', freshTurn: false })

  // turn/start -> freshTurn true, other fields preserved
  const s2 = d.apply(sSteer, { type: 'turn/start' })
  assert.deepEqual(s2, { task: 'task-A', latest: 'steer-B', freshTurn: true })

  // with freshTurn true, the next admissible message (even steering) is a new task
  const sFresh = d.apply(s2, msg('agent-message', 'fresh-D'))
  assert.deepEqual(sFresh, { task: 'fresh-D', latest: '', freshTurn: false })

  // turn/start on an already-fresh state -> unchanged (identity)
  assert.strictEqual(d.apply(s2, { type: 'turn/start' }), s2)

  // object surfaceOp -> EMPTY base, so steering becomes a new task
  const s4 = d.apply(s2, msg('agent-message', 'new-C', { surfaceOp: {} }))
  assert.deepEqual(s4, { task: 'new-C', latest: '', freshTurn: false })

  // other event / non-admissible source -> unchanged (identity)
  assert.strictEqual(d.apply(s4, { ...msg('user', 'zzz'), type: 'noop' }), s4)
  assert.strictEqual(d.apply(s4, msg('other', 'zzz')), s4)

  // agent/team with empty task -> new task
  assert.deepEqual(
    d.apply(EMPTY, msg('agent-message', 'from-empty')),
    { task: 'from-empty', latest: '', freshTurn: false },
  )

  // only type==='text' parts, joined with '\n'
  assert.deepEqual(
    d.apply(EMPTY, {
      type: 'user/message',
      source: { kind: 'user' },
      content: [
        { type: 'image', text: 'NO' },
        { type: 'text', text: 'yes' },
        { type: 'text', text: '2' },
      ],
    }),
    { task: 'yes\n2', latest: '', freshTurn: false },
  )
  assert.equal(messageText({ content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] }), 'a\nb')
  assert.equal(messageText({ content: 'not-an-array' }), '')

  // admit helper directly: identity for bad source / blank text
  assert.strictEqual(admit(s4, msg('other', 'x')), s4)
  assert.strictEqual(admit(s4, msg('user', '  \n ')), s4)
}

// ---------------------------------------------------------------------------
// 5) bounded: 4000 cap, head 2000 + '\n' + tail 1999, surrogate-safe (§3.3).
// ---------------------------------------------------------------------------
{
  assert.equal(bounded('abc'), 'abc')
  assert.equal(bounded('a'.repeat(4000)).length, 4000)

  const b = bounded('a'.repeat(5000))
  assert.equal(b.length, 4000)
  assert.equal(b.slice(0, 2000), 'a'.repeat(2000))
  assert.equal(b[2000], '\n')
  assert.equal(b.slice(2001), 'a'.repeat(1999))

  // low surrogate at head index -> head-- cuts before the pair
  const headSurrogate = 'a'.repeat(1999) + '\uD83D\uDE00' + 'b'.repeat(3000)
  const outHead = bounded(headSurrogate)
  assert.equal(hasBrokenSurrogate(outHead), false)
  assert.ok(!outHead.includes('\uDE00'))

  // low surrogate at tail index -> tail++ starts after the pair
  const tailSurrogate = 'a'.repeat(2000) + '\uD83D\uDE00' + 'b'.repeat(500) + '\uD83D\uDE00' + 'c'.repeat(1998)
  const outTail = bounded(tailSurrogate)
  assert.equal(hasBrokenSurrogate(outTail), false)

  // current re-bounds task + '\n' + latest when latest is non-empty
  const host = makeProjectionHost()
  const svc = await apply({ sessionProjections: host })
  host.states.set('s', { task: 'x'.repeat(3000), latest: 'y'.repeat(3000), freshTurn: false })
  const joined = svc.current('s', [])
  assert.equal(joined.length, 4000)
  assert.equal(joined.slice(0, 2000), 'x'.repeat(2000))
  assert.equal(joined[2000], '\n')
  assert.equal(joined.slice(2001), 'y'.repeat(1999))
}

console.log('task-query self-test: ALL PASS')
