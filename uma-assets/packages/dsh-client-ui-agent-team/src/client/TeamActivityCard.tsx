/** Root conversation disclosure for persisted team tasks and actual teammates. */
import type { ReactNode } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import {
  IconChevronDownOutlineRegular, IconChecklistOutlineRegular,
  IconUserOutlineRegular,
  StateDot, type StateDotState,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { TeamBoard } from './TeamBoard.tsx'
import { NS } from './locales.ts'
import { teamRole } from './team-role.ts'
import css from './TeamActivityCard.module.css'

/** Composer dock data and navigation callback for the team card. */
export type TeamActivityCardProps = PropsRuntime<'conversation.input.dock'> & PropsLocale<typeof NS> & {
  readonly openMember: Context['uiWorkspace']['openSession']
}

/** Display Team mode and the work actually recorded in the root conversation. */
export function TeamActivityCard({ session, useProjection, useSessions, useSessionStatus, t, openMember }: TeamActivityCardProps) {
  const team = useProjection('agentTeam')
  const members = useProjection('subagentCatalog')
  const summaries = useSessions(state => state.byId)
  const statuses = useSessionStatus(state => state)
  const taskCount = team?.tasks.filter(task => task.status !== 'deleted').length ?? 0
  const memberCount = members?.length ?? 0
  const rootRunning = statuses.get(session.sessionId)?.running ?? summaries[session.sessionId]?.running ?? false
  const memberRunning = members?.some(member => statuses.get(member.id)?.running ?? summaries[member.id]?.running ?? false) ?? false
  const empty = taskCount === 0 && memberCount === 0 && team?.failure === undefined
  if (session.subagent !== null || !team?.enabled || empty || !(rootRunning || memberRunning)) return null

  return (
    <details className={css.card} data-team-activity>
      <summary className={css.summary}>
        <IconChecklistOutlineRegular size={16} aria-hidden />
        <span className={css.title}>{t('activity.title')}</span>
        <span className={css.count}>
          {memberCount > 0 && t('activity.members', { count: memberCount })}
          {memberCount > 0 && taskCount > 0 && ' · '}
          {taskCount > 0 && t('activity.tasks', { count: taskCount })}
        </span>
        <IconChevronDownOutlineRegular size={14} className={css.chevron} aria-hidden />
      </summary>
      <div className={css.body}>
        {memberCount > 0 && <ul className={css.members} aria-label={t('activity.title')}>
          {members?.map((member) => {
            const handle = 'name' in member ? member.name : undefined
            const role = teamRole(handle)
            const name = role === undefined
              ? handle || member.label || summaries[member.id]?.title || t('role.member')
              : t(role.label)
            const summary = summaries[member.id]
            const running = statuses.get(member.id)?.running ?? summary?.running
            const tasks = team.tasks.filter(task => task.ownerId === member.id)
            const active = tasks.find(task => task.status === 'in_progress')
            const pending = tasks.find(task => task.status === 'pending')
            const completed = tasks.findLast(task => task.status === 'completed')
            const work = active ?? (running ? pending : pending ?? completed)
            const done = completed !== undefined || summary?.projectionValues?.subagentTiming?.lastTurnCompleted === true
            const status = running ? 'command.running' : active ? 'status.paused'
              : pending ? 'status.pending' : done ? 'status.completed' : 'activity.idle'
            const dot: StateDotState = running ? 'ongoing' : done && !active && !pending ? 'done' : 'idle'
            const Avatar = role?.icon ?? IconUserOutlineRegular
            const content = (
              <>
                <span className={css.avatar} aria-hidden><Avatar size={17} /></span>
                <span className={css.memberText}>
                  <span className={css.memberName}>{name}</span>
                  {(work?.subject ?? member.label) && <span className={css.memberTask}>{work?.subject ?? member.label}</span>}
                </span>
                <span className={css.activity}><StateDot state={dot} />{t(status)}</span>
              </>
            )
            return (
              <li key={member.id}>
                {member.mode === 'external'
                  ? <span className={css.member}>{content}</span>
                  : <button type="button" className={css.member} onClick={() => {
                    openMember({ parentSessionId: session.sessionId, childSessionId: member.id, mode: member.mode })
                  }}>{content}</button>}
              </li>
            )
          })}
        </ul>}
        <TeamBoard sessionId={session.sessionId} useProjection={useProjection}
          useSessions={useSessions} useSessionStatus={useSessionStatus} t={t} />
      </div>
    </details>
  )
}

/** Keep the shared team board as the only live task panel without deleting the personal plan. */
export function TeamTodoVisibility({ useProjection, useSession, children }: PropsRuntime<'conversation.input.todo'> & { children: ReactNode }) {
  const team = useProjection('agentTeam')
  const root = useSession(session => session.subagent === null)
  return root && team?.enabled && team.tasks.some(task => task.status !== 'deleted') ? null : children
}
