/** Explicit continuation of a managed request whose reply was interrupted. */
import { isUmaRequestInterruption } from './interrupted-request.ts'
import type { SessionSeq } from '@deepseek-ai/dsh-session/types'
import type { ComposerBlock } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { Button } from '@deepseek-ai/dsh-client-ui-primitives'
import css from './MessageItem.module.css'

type ContinueActionProps = PropsRuntime<'conversation.chat.turn-error.actions'> & PropsLocale<'chat'>
  & InjectFace<{
    retry: (failureSeq: SessionSeq) => void
    hooks: { composerBlock: HostObservable<ComposerBlock | undefined> }
  }>

/** @param props - failed turn and its Session's continuation controls. @returns the explicit action for the current interrupted reply. */
export function InterruptedContinueAction(props: ContinueActionProps) {
  return isUmaRequestInterruption(props.code) ? <ContinueLatestFailure {...props} /> : null
}

function ContinueLatestFailure({
  failureSeq, retry, t, useAccess, useComposerBlock, useInput, useProjection, useSession,
}: ContinueActionProps) {
  const eligible = useProjection('conversationContinuation')
  const canPrompt = useAccess('session/prompt')
  const idle = useSession(s => !s.running && !s.removed && s.openState === 'open' && s.subagent === null
    && s.pendingSubmissions.length === 0)
  const inputFree = useInput(s => s.phase === 'plain' && s.draft.trim() === '' && s.attachmentIds.length === 0
    && s.queue.length === 0)
  const pendingInput = useProjection('inbox', inbox => (inbox?.['next-turn'].length ?? 0) > 0
    || (inbox?.['next-step'].some(message =>
      typeof message === 'object' && message !== null && 'source' in message
      && typeof message.source === 'object' && message.source !== null && 'kind' in message.source
      && message.source.kind === 'user') ?? false))
  const blocked = useComposerBlock(value => value !== undefined)
  if (eligible == null || eligible !== failureSeq || !canPrompt || !idle || !inputFree || pendingInput || blocked) return null
  return <>
    <Button variant="outline" onClick={() =>{  retry(eligible) }}>{t('message.failure.continueTask')}</Button>
    <span className={css.turnErrorMessage}>{t('message.failure.continueCharge')}</span>
  </>
}
