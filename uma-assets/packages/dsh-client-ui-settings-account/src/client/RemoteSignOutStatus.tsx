/** Persistent recovery for old remote sessions without changing a later local login. */
import { useEffect, useRef, useState } from 'react'
import { Button } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AccountView } from '@deepseek-ai/dsh-deepseek-account/types'
import type { AccountKey } from './locales.ts'
import css from './AccountSection.module.css'

/** Safe summary of previously removed credentials that the Host still needs to revoke. */
export type RemoteSignOutState = NonNullable<AccountView['remoteSignOut']>

const messageKeys = {
  pending: 'remoteSignOutPending', failed: 'remoteSignOutFailed', storage: 'remoteSignOutStorage', unknown: 'remoteSignOutUnknown',
} satisfies Record<RemoteSignOutState['status'] | 'storage' | 'unknown', AccountKey>

/** @param state - Host-owned recovery status. @returns the localized explanation key. */
export function remoteSignOutMessage(state: RemoteSignOutState): AccountKey {
  return messageKeys[state.count === null ? 'unknown' : state.errorCode === 'storage' ? 'storage' : state.status]
}

/** @param props - old-session state, current login presence, and explicit recovery action. @returns persistent recovery details. */
export function RemoteSignOutStatus({ state, currentSignedIn, retry, t }: {
  state: RemoteSignOutState
  currentSignedIn: boolean
  retry: () => Promise<void>
  t: (key: AccountKey) => string
}) {
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState(false)
  const summaryGeneration = useRef(0)
  // A fresh Host summary supersedes an action whose reply could not be confirmed.
  useEffect(() => {
    summaryGeneration.current++
    setFailed(false)
    return () => { summaryGeneration.current++ }
  }, [state])
  const retryRemote = async () => {
    const generation = summaryGeneration.current
    setBusy(true)
    setFailed(false)
    try { await retry() }
    catch (_error) { if (generation === summaryGeneration.current) setFailed(true) }
    finally { setBusy(false) }
  }
  return <div className={css.recovery} role={state.status === 'failed' ? 'alert' : 'status'}>
    <span>{t(remoteSignOutMessage(state))}</span>
    {state.count !== null && <span className={css.secondary}>{t('remoteSignOutCount')}{state.count}</span>}
    {currentSignedIn && state.count !== null && <span className={css.secondary}>{t('remoteSignOutCurrent')}</span>}
    {failed && state.status === 'failed' && <span role="alert">{t('remoteSignOutRetryFailed')}</span>}
    {state.status === 'failed' && <div className={css.actions}>
      <Button variant="outline" disabled={busy} onClick={() => { void retryRemote() }}>
        {t('remoteSignOutRetry')}
      </Button>
    </div>}
  </div>
}
