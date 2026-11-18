import { useState } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { PropsLocale, PropsRuntime, PropsRenderSlots } from '@deepseek-ai/dsh-client-ui-slots'
// The domain's client-namespace pure-type outlet: one import edge delivers
// the `todos` projection-key merge (single source, no consumer-side restated
// declare) and the payload type. Type-only by construction — the outlet is
// free of host value imports, so no host Context merge enters this program.
import type { TodoItem } from '@deepseek-ai/dsh-tool-todo/client'
import {
  IconChecklistOutlineRegular, IconChevronDownOutlineRegular, IconChevronUpOutlineRegular, StateDot,
  type StateDotState,
} from '@deepseek-ai/dsh-client-ui-primitives'
import { NS } from '../locales.ts'
import css from './TodoPanel.module.css'

export interface TodoPanelProps {
  /** The session's current plan (empty renders nothing) — selected by the dock adapter. */
  todos: readonly TodoItem[]
  /** The Session is open and idle while the plan retains unfinished work. */
  paused?: boolean
  /** The dock entry's locale seat, passed down as a plain prop. */
  t: TodoDockProps['t']
}

/** Local exhaustiveness helper — client packages do not depend on `dsh-llm`. */
/* v8 ignore next 3 -- closed-union backstop; only reached if status is forged */
function assertNever(value: never): never {
  throw new Error(`unreachable todo status: ${String(value)}`)
}

/** Map Todo lifecycle state onto the shared compact status language. */
function statusDotState(status: TodoItem['status']): StateDotState {
  switch (status) {
    case 'completed': return 'done'
    case 'in_progress': return 'ongoing'
    case 'pending': return 'idle'
    /* v8 ignore next -- closed TodoItem status union */
    default: return assertNever(status)
  }
}

/** Return the localized status announced beside one decorative marker. */
function statusLabel(status: TodoItem['status'], t: TodoPanelProps['t']): string {
  switch (status) {
    case 'completed': return t('todo.status.completed')
    case 'in_progress': return t('todo.status.inProgress')
    case 'pending': return t('todo.status.pending')
    /* v8 ignore next -- closed TodoItem status union */
    default: return assertNever(status)
  }
}

/** Header summary: "·"-joined per-status counts; zero-count segments are omitted as noise (a non-empty list keeps at least one). */
function progressLabel(todos: readonly TodoItem[], t: TodoPanelProps['t'], paused: boolean): string {
  const done = todos.filter(item => item.status === 'completed').length
  const active = todos.filter(item => item.status === 'in_progress').length
  const pending = todos.length - done - active
  // En spaces (U+2002): HTML collapses runs of ASCII spaces, so widening the
  // separator breathing room needs a literal wide space.
  return [
    ...done > 0 ? [t('todo.progress.done', { done })] : [],
    ...active > 0 ? [t(paused ? 'todo.progress.paused' : 'todo.progress.active', { active })] : [],
    ...pending > 0 ? [t('todo.progress.pending', { pending })] : [],
  ].join('\u2002·\u2002')
}

export function TodoPanel({ todos, t, paused = false }: TodoPanelProps) {
  const [collapsed, setCollapsed] = useState(true)
  if (todos.length === 0) return null

  return (
    <section className={css.root} data-testid="todo-panel" aria-label={t('todo.title')}>
      <div className={css.body}>
        <button
          type="button"
          className={css.header}
          aria-expanded={!collapsed}
          onClick={() => { setCollapsed(v => !v) }}
        >
          <span className={css.lead} aria-hidden><IconChecklistOutlineRegular /></span>
          <span className={css.title}>{t('todo.title')}</span>
          <span className={css.progress}>{progressLabel(todos, t, paused)}</span>
          <span className={css.chevron} aria-hidden>
            {collapsed ? <IconChevronUpOutlineRegular /> : <IconChevronDownOutlineRegular />}
          </span>
        </button>
        {!collapsed && (
          <ul className={css.list}>
            {todos.map((item) => {
              const waiting = paused && item.status === 'in_progress'
              return (
                <li key={item.content} className={css.item} data-status={waiting ? 'paused' : item.status}>
                  <span className={css.glyph} role="img" aria-label={waiting ? t('todo.status.paused') : statusLabel(item.status, t)}>
                    <StateDot state={waiting ? 'idle' : statusDotState(item.status)} />
                  </span>
                  <span className={css.content}>{item.content}</span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </section>
  )
}

/** Props for the projected todo dock. */
export interface TodoDockProps extends PropsLocale<'conversation'>, Pick<PropsRenderSlots<'conversation.input.todo'>, 'renderSlot'> {
  /** Only the lifecycle facts needed to distinguish active work from a paused plan. */
  readonly session: Pick<PropsRuntime<'conversation.input.dock'>['session'], 'openState' | 'running' | 'pendingSubmissions'>
  /** Subscribe to the host-owned Todo projection. */
  readonly useProjection: (key: 'todos') => readonly TodoItem[] | null | undefined
}

/** Renders the current todo projection, or nothing when it is absent. */
export function TodoDock({ session, useProjection, renderSlot, t }: TodoDockProps) {
  const todos = useProjection('todos')
  const paused = session.openState === 'open' && !session.running && session.pendingSubmissions.length === 0
  return renderSlot('conversation.input.todo', {}, { children: <TodoPanel todos={todos ?? []} t={t} paused={paused} /> })
}

/** Registers the projected todo dock. */
export const todoDockEntry = {
  name: 'conversation-todo-dock',
  inject: ['slots'],
  apply(ctx: Context): void {
    ctx.slots.inject('conversation.input.dock', () =>
      ctx.slots.register({ name: 'conversation.input.dock', id: 'todo', order: 0, locale: NS,
        children: { 'conversation.input.todo': { kind: 'hoc', scope: 'session' } },
      }, TodoDock))
  },
}
