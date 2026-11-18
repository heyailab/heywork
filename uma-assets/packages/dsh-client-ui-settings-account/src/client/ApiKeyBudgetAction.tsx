/** Account-owned recovery links for managed request failures. */
import { useEffect, useRef, type MouseEvent } from 'react'
import type { AccountView } from '@deepseek-ai/dsh-deepseek-account/types'
import type { HostObservable, InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-chat/client'
import type { AccountSnapshot } from './AccountSection.tsx'
import type { PlatformPages } from './platform-pages.ts'
import css from './AccountSection.module.css'

/** Account projection and existing native page channel used by the recovery action. */
export interface ApiKeyBudgetActionInjected {
  openPlatformPage?: PlatformPages['open']
  hooks: { account: HostObservable<AccountSnapshot> }
}

function managementUrl(view: AccountView | undefined): string | undefined {
  if (view?.product !== 'uma' || view.links.sdkKeysUrl === undefined) return undefined
  try {
    const destination = new URL(view.links.sdkKeysUrl)
    const issuer = new URL(view.links.usageUrl)
    const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(destination.hostname)
    if (destination.origin !== issuer.origin || destination.pathname !== '/account/api-keys'
      || destination.username || destination.password || destination.search || destination.hash
      || (destination.protocol !== 'https:' && !(destination.protocol === 'http:' && loopback))) return undefined
    return destination.href
  } catch (_invalidHostLinks) { return undefined }
}

/** @param props - failure category and trusted account navigation. @returns the key-management action when available. */
export function ApiKeyBudgetAction({ code, useAccount, openPlatformPage, t }:
  PropsRuntime<'conversation.chat.turn-error.actions'> & PropsLocale<'settings.account'> & InjectFace<ApiKeyBudgetActionInjected>) {
  const view = useAccount(snapshot => snapshot.view)
  const release = useRef<(() => void) | undefined>(undefined)
  useEffect(() => () => { release.current?.() }, [])
  useEffect(() => {
    if (view?.status === 'credential-stored') return
    release.current?.()
    release.current = undefined
  }, [view?.status])
  const href = managementUrl(view)
  if (code !== 'UMA_SDK_KEY_BUDGET_EXCEEDED' || href === undefined) return null
  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (openPlatformPage === undefined || view?.status !== 'credential-stored') return
    event.preventDefault()
    release.current?.()
    release.current = openPlatformPage('sdk-keys', () => { release.current = undefined })
  }
  return <div className={css.errorRecovery}>
    <a className={css.linkButton} href={href} target="_blank" rel="noopener noreferrer" onClick={open}>
      {t('keyBudgetManage')}
    </a>
  </div>
}

/** @param props - managed failure reference and trusted account links. @returns the request or usage link when available. */
export function InterruptedRequestUsageAction({ code, requestId, useAccount, t }:
  PropsRuntime<'conversation.chat.turn-error.actions'> & PropsLocale<'settings.account'>
  & InjectFace<Pick<ApiKeyBudgetActionInjected, 'hooks'>>) {
  const view = useAccount(snapshot => snapshot.view)
  if (view?.product !== 'uma' || !['UMA_REQUEST_INTERRUPTED', 'UMA_REQUEST_INTERRUPTED_CHARGED',
    'UMA_REQUEST_INTERRUPTED_UNCHARGED'].some(interrupted => code === interrupted)) return null
  let destination: URL
  try {
    destination = new URL(view.links.usageUrl)
  } catch (_invalidUsageLink) { return null }
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(destination.hostname)
  if (destination.pathname !== '/account/usage' || destination.username || destination.password
    || destination.search || destination.hash
    || (destination.protocol !== 'https:' && !(destination.protocol === 'http:' && loopback))) return null
  const exactRequest = requestId !== undefined && /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(requestId)
  if (exactRequest) destination.pathname += '/' + requestId
  return <a className={css.linkButton} href={destination.href} target="_blank" rel="noopener noreferrer">
    {t(exactRequest ? 'interruptedRequestUsage' : 'interruptedUsage')}
  </a>
}
