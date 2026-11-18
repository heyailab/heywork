/** Durable team dialogue, independent of the live composer card. */
import { useMemo } from 'react'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type { PropsLocale, PropsRuntime, PropsRenderFactories } from '@deepseek-ai/dsh-client-ui-slots'
import { IconUserOutlineRegular, IconChevronDownOutlineRegular, MarkdownText, StateDot, extractMarkdownPlainText } from '@deepseek-ai/dsh-client-ui-primitives'
import { teamRole } from './team-role.ts'
import { NS } from './locales.ts'
import css from './TeamConversation.module.css'

type MessageProps = PropsRuntime<'conversation.chat.context'> & PropsLocale<typeof NS>
  & PropsRenderFactories

/** Recorded sender and message category, without inferred completion. */
export interface TeamMessageIdentity {
  readonly sender: string
  readonly name?: string
  readonly kind: 'agent-message' | 'team-message' | 'subagent-settled'
  readonly reason?: string
}

/** Resolve only attributed team sources. @param source - Durable source. @returns Sender attribution or no match. */
export function teamMessageIdentity(source: unknown): TeamMessageIdentity | null {
  if (typeof source !== 'object' || source === null) return null
  const record = source as Record<string, unknown>
  const kind = record.kind
  if (kind !== 'agent-message' && kind !== 'team-message' && kind !== 'subagent-settled') return null
  const sender = record.senderSessionId ?? record.senderId
  if (typeof sender !== 'string' || sender.length === 0) return null
  return { sender, kind,
    ...(typeof record.senderName === 'string' ? { name: record.senderName } : {}),
    ...(typeof record.stopReason === 'string' ? { reason: record.stopReason } : {}),
  }
}

/**
 * Extract authored text without crediting runtime wrappers to the member.
 * @param message - Recorded message.
 * @param identity - Validated source.
 * @returns Authored text, or empty when no reply was delivered.
 */
export function teamMessageText(message: MessageProps['message'], identity: TeamMessageIdentity): string {
  const blocks = message.content
  if (identity.kind === 'subagent-settled') {
    const marker = blocks.findIndex(block => block.type === 'text' && block.text === 'Its closing message:')
    if (marker < 0) return ''
    const closing = blocks.slice(marker + 1)
    const structured = closing.findIndex(block => block.type === 'text' && block.text.startsWith('Structured result: '))
    return (structured < 0 ? closing : closing.slice(0, structured)).flatMap(block => block.type === 'text' ? [block.text] : []).join('\n\n')
  }
  const first = blocks[0]
  const start = identity.kind === 'agent-message' && first?.type === 'text'
    && /^Agent .+ sent a message: $/u.test(first.text) ? 1 : 0
  return blocks.slice(start).flatMap(block => block.type === 'text' ? [block.text] : []).join('\n\n')
}

/**
 * Read the name from the producer-owned wrapper when an inherited transcript has no member catalog.
 * @param message - Recorded message.
 * @param identity - Validated source.
 * @returns Recorded handle when present.
 */
export function recordedTeamHandle(message: MessageProps['message'], identity: TeamMessageIdentity): string | undefined {
  if (identity.name !== undefined) return identity.name
  const first = message.content[0]
  if (first?.type !== 'text') return undefined
  if (identity.kind === 'agent-message') return /^Agent (.+) sent a message: $/u.exec(first.text)?.[1]
  if (identity.kind === 'subagent-settled') return /^Background subagent (\S+) (?:finished|was stopped|ran out|declined|failed|ended)/u.exec(first.text)?.[1]
  return undefined
}

/** Show actual member messages after the live activity has stopped. */
export function TeamConversation({
  message, labels, matched, useProjection, useSession, useSessions, renderFactorySlot, t,
}: MessageProps & { matched: TeamMessageIdentity }) {
  const members = useProjection('subagentCatalog')
  const parentId = useSession(session => session.subagent?.address.parentSessionId)
  const parent = useSessions(state => parentId === undefined ? undefined : state.projectionsBySession[parentId])
  const catalog = parent?.state === 'ready' ? parent.values.subagentCatalog : members
  const member = catalog?.find(item => item.id === matched.sender)
  const handle = member !== undefined && 'name' in member ? member.name : recordedTeamHandle(message, matched)
  const role = teamRole(handle)
  const Avatar = role?.icon ?? IconUserOutlineRegular
  const text = useMemo(() => teamMessageText(message, matched), [message, matched])
  const preview = useMemo(() => extractMarkdownPlainText(text, { mode: 'first-line' }), [text])
  const status = matched.kind !== 'subagent-settled' ? 'dialogue.message'
    : matched.reason === 'completed' ? 'command.done'
      : matched.reason === 'error' ? 'command.failed' : 'dialogue.stopped'
  return <details className={css.message} data-team-dialogue>
    <summary className={css.summary}>
      <span className={css.avatar} aria-hidden>{matched.sender === parentId
        ? renderFactorySlot('conversation.chat.assistant.brand', { size: 28 }) : <Avatar size={18} />}</span>
      <span className={css.identity}>
        <span className={css.nameLine}>
          <span className={css.name}>{role ? t(role.label) : handle || member?.label || t(matched.sender === parentId ? 'role.director' : 'role.member')}</span>
          {handle && role && <span className={css.meta}>{handle}</span>}
        </span>
        <span className={css.preview}>{preview || t(status)}</span>
      </span>
      <span className={css.status}>
        <StateDot state={matched.reason === 'completed' ? 'done' : matched.reason === 'error' ? 'error' : 'idle'} />
        {t(status)}
      </span>
      <IconChevronDownOutlineRegular size={14} className={css.chevron} aria-hidden />
    </summary>
    <div className={css.body}>
      {text && <MarkdownText text={text} labels={labels} />}
      <div className={css.metadata}>
        <span>{t(status)}</span>
        <time dateTime={new Date(message.time).toISOString()}>{new Date(message.time).toLocaleTimeString()}</time>
      </div>
    </div>
  </details>
}

/** Attribute root replies when a real team catalog exists, including completed history. */
export function TeamReplyIdentity({ useProjection, useSession, useSessions, sessionId, renderFactorySlot, t }: PropsRuntime<'conversation.chat.assistant.identity'> & PropsLocale<typeof NS> & PropsRenderFactories) {
  const members = useProjection('subagentCatalog')
  const parentId = useSession(session => session.subagent?.address.parentSessionId)
  const parent = useSessions(state => parentId === undefined ? undefined : state.projectionsBySession[parentId])
  const member = parent?.state === 'ready' ? parent.values.subagentCatalog?.find(item => item.id === sessionId) : undefined
  const handle = member !== undefined && 'name' in member ? member.name : undefined
  const role = teamRole(handle)
  const Avatar = role?.icon ?? IconUserOutlineRegular
  const team = useProjection('agentTeam')
  if (parentId === undefined && !members?.length && team?.enabled !== true) return null
  return <header className={`${css.header} ${css.replyHeader}`} data-team-reply-identity>
    <span className={parentId === undefined ? css.brandAvatar : css.avatar} aria-hidden>{parentId === undefined
      ? renderFactorySlot('conversation.chat.assistant.brand', { size: 20 }) : <Avatar size={14} />}</span>
    <span className={css.name}>{role ? t(role.label) : parentId === undefined ? t('role.director') : handle || member?.label || t('role.member')}</span>
  </header>
}
