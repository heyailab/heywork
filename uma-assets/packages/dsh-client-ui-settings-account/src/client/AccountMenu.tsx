/** Sidebar account launcher and locally authoritative sign-out action. */
import { useEffect, useRef, useState } from 'react'
import {
  Toast, Menu, Modal, Button, IconLightOutlineMedium, IconInfoOutlineMedium, IconDataOutlineMedium,
  IconEllipsisOutlineMedium, IconPaperPlaneOutlineMedium, IconSettingsOutlineMedium, IconUserOutlineMedium,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { AccountSectionInjected } from './AccountSection.tsx'
import { SignOutDialog } from './SignOutDialog.tsx'
import { SignInDialog } from './SignInDialog.tsx'
import { LogoutIcon } from './LogoutIcon.tsx'
import { BetaVeteranBadge, UmaAccountAvatar } from './UmaAccountAppearance.tsx'
import { AccountNoticeStack } from './AccountNotice.tsx'
import { RemoteSignOutStatus, remoteSignOutMessage } from './RemoteSignOutStatus.tsx'
import type { AccountKey } from './locales.ts'
import { formatBalance } from './formatBalance.ts'
import type { PlatformPage } from '@deepseek-ai/dsh-deepseek-account/types'
import css from './AccountMenu.module.css'

/** Account launcher composed by the settings shell. */
export type AccountMenuProps = PropsRuntime<'settings.launcher'> & PropsLocale<'settings.account'> & InjectFace<AccountSectionInjected>

/** The signed-in label stays empty while the profile loads.
 * @param props - sidebar geometry, settings navigation and account operations.
 * @returns account menu launcher.
 */
export function AccountMenu({
  subscribeSessionExpired, subscribeModelSignInRequired, wide, settingsShortcut, openSettings, openOnboarding, settingsOpen,
  useAccount, useTheme, signOut, retrySignOut, hasRunningAccountTasks, refreshAccount, bonusNoticeShown, bonusNoticeDismissed,
  contactUs, showLogin, start, cancel, avatarFailed, openPlatformPage, refreshBalance, t,
}: AccountMenuProps) {
  const anchor = useRef<HTMLDivElement>(null)
  // The launcher outlives the panel, so a false-to-true edge is one Settings entry:
  // re-renders, section switches and tab switches inside one open must not read again.
  const settingsWasOpen = useRef(false)
  useEffect(() => {
    if (settingsOpen && !settingsWasOpen.current) void refreshAccount()
    settingsWasOpen.current = settingsOpen
  }, [refreshAccount, settingsOpen])
  const account = useAccount(state => state)
  const colorScheme = useTheme(snapshot => snapshot.active.colorScheme)
  const signedIn = account.view?.status === 'credential-stored'
  const signedOut = account.view?.status === 'signed-out'
  const remoteSignOut = account.view?.remoteSignOut
  const remoteMessage = remoteSignOut === undefined ? undefined : remoteSignOutMessage(remoteSignOut)
  const lastRemoteMessage = useRef<AccountKey | undefined>(undefined)
  const [remoteNotice, setRemoteNotice] = useState<AccountKey | undefined>(undefined)
  const [remoteOpen, setRemoteOpen] = useState(false)
  useEffect(() => {
    if (lastRemoteMessage.current !== remoteMessage) setRemoteNotice(remoteMessage)
    lastRemoteMessage.current = remoteMessage
    if (remoteMessage === undefined) setRemoteOpen(false)
  }, [remoteMessage])
  const [signInNotice, setSignInNotice] = useState(0)
  useEffect(() => subscribeModelSignInRequired?.(() => { setSignInNotice(value => value + 1) }), [subscribeModelSignInRequired])
  const [expiryNotice, setExpiryNotice] = useState(false)
  useEffect(() => subscribeSessionExpired?.(() => { setExpiryNotice(true) }), [subscribeSessionExpired])
  const profile = account.details?.profile
  const signedInLabel = t(account.view?.product === 'uma' ? 'umaSignedIn' : 'signedIn')
  const label = profile === undefined ? null : profile.status === 'ready'
    ? profile.value.name ?? profile.value.contact ?? signedInLabel : signedInLabel
  const identityCaption = profile?.status === 'ready' ? profile.value.contact ?? t('umaSignedIn') : t('umaSignedIn')
  const [open, setOpen] = useState(false)
  const managed = signedIn && account.view?.product === 'uma'
  const veteran = managed && profile?.status === 'ready' && profile.value.umaBadge === 'beta-veteran'
  const balance = account.details?.balance
  const releasePage = useRef<(() => void) | undefined>(undefined)
  useEffect(() => () => { releasePage.current?.() }, [])
  useEffect(() => {
    if (!signedIn) { releasePage.current?.(); releasePage.current = undefined; setOpen(false) }
  }, [signedIn])
  useEffect(() => {
    if (!open || !managed) return
    void refreshAccount()
    if (refreshBalance === undefined) return
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void refreshBalance()
    }, 2000)
    return () => { window.clearInterval(timer) }
  }, [open, managed, refreshAccount, refreshBalance])
  const visit = (page: PlatformPage, url: string) => {
    setOpen(false)
    if (openPlatformPage === undefined) { window.open(url, '_blank', 'noopener,noreferrer'); return }
    releasePage.current?.()
    releasePage.current = openPlatformPage(page, () => { releasePage.current = undefined })
  }
  const trigger = useRef<HTMLButtonElement>(null)
  const [busy, setBusy] = useState(false)
  const [signOutImpact, setSignOutImpact] = useState<boolean | 'unknown'>()
  const requestSignOut = async () => {
    setBusy(true)
    try { setSignOutImpact(await hasRunningAccountTasks()); setOpen(false) }
    catch (_error) { setSignOutImpact('unknown'); setOpen(false) }
    finally { setBusy(false) }
  }
  // The plugin's start publishes `loginFailed` before it rejects, so the dialog owns the report.
  const closeLogin = (): void => { showLogin(false); trigger.current?.focus() }
  const beginSignIn = (): void => {
    setOpen(false)
    setRemoteOpen(false)
    trigger.current?.focus()
    void start().catch(() => undefined)
  }
  return <div ref={anchor} className={css.root} data-inset={signedIn && wide}>
    {signInNotice > 0 && <Toast key={signInNotice} text={t('modelSignInRequired')} onDone={() => { setSignInNotice(0) }} />}
    {expiryNotice && <Toast text={t('sessionExpired')} onDone={() => { setExpiryNotice(false) }} />}
    {remoteNotice !== undefined && <Toast text={t(remoteNotice)} onDone={() => { setRemoteNotice(undefined) }} />}
    {signedIn && !account.desktopOnboardingVisible && !account.onboarding && account.notices && <AccountNoticeStack
      notices={account.notices}
      anchor={anchor} title={t('bonusNoticeTitle')} closeLabel={t('close')}
      onShown={bonusNoticeShown} onDismiss={bonusNoticeDismissed} />}
    <Menu open={open} side="top" portal autoFocus className={css.anchor} listClassName={managed ? css.accountMenu : signedIn ? undefined : css.signedOutMenu}
      anchor={<button ref={trigger} type="button" className={css.trigger} data-collapsed={!wide} data-signed-out={!signedIn} aria-label={t('menu')}
        data-veteran={veteran || undefined}
        aria-description={veteran ? t('betaVeteranBadge') : undefined}
        aria-haspopup="menu" aria-expanded={open} onClick={() => { setOpen(value => !value) }}>
        {signedIn
          ? <span className={css.avatar} data-avatar-status={account.avatar?.status} data-veteran={veteran || undefined}>
            <UmaAccountAvatar avatar={account.avatar} avatarFailed={avatarFailed} veteran={veteran} />
          </span>
          : <IconEllipsisOutlineMedium size={14} />}
        {wide && <span className={css.label}>{signedIn ? label : t('more')}</span>}
        {wide && veteran && <BetaVeteranBadge label={t('betaVeteranBadge')} compact />}
      </button>}
      items={managed ? [] : [
        { id: 'settings', label: t('settings'), icon: <IconSettingsOutlineMedium size={16} />,
          ...(settingsShortcut === undefined ? {} : { shortcut: settingsShortcut }) },
        ...account.view === undefined || account.view.product === 'uma' ? [] :
          [{ id: 'contact', label: t('contactUs'), icon: <IconPaperPlaneOutlineMedium size={16} /> }],
        ...remoteSignOut === undefined ? [] : [{ id: 'remoteSignOut', label: t('remoteSignOutMenu') }],
        ...(signedIn ? [{ id: 'signout', label: t('signOut'), icon: <LogoutIcon />, disabled: busy }]
          : signedOut ? [{ id: 'signin', label: t('signIn'), icon: <IconUserOutlineMedium size={16} />,
            disabled: remoteSignOut?.count === null }] : []),
      ]}
      onClose={() => { setOpen(false) }}
      onSelect={(id) => {
        if (id === 'settings') { setOpen(false); trigger.current?.focus(); openSettings() }
        else if (id === 'security' && account.view?.links.securityUrl !== undefined) visit('security', account.view.links.securityUrl)
        else if (id === 'appearance' || id === 'models' || id === 'about') { setOpen(false); trigger.current?.focus(); openSettings(id) }
        else if (id === 'contact') { setOpen(false); contactUs() }
        else if (id === 'remoteSignOut') { setOpen(false); trigger.current?.focus(); setRemoteOpen(true) }
        else if (id === 'signin') beginSignIn()
        else if (id === 'signout') void requestSignOut()
      }}
      footer={managed ? [
        ...account.view?.links.securityUrl === undefined ? [] : [{ id: 'security', label: t('accountSecurity'), icon: <IconUserOutlineMedium size={16} /> }],
        { id: 'settings', label: t('settings'), icon: <IconSettingsOutlineMedium size={16} />,
          ...(settingsShortcut === undefined ? {} : { shortcut: settingsShortcut }) },
        { id: 'appearance', label: t('menuAppearance'), icon: <IconLightOutlineMedium size={16} /> },
        { id: 'models', label: t('menuModels'), icon: <IconDataOutlineMedium size={16} /> },
        { id: 'about', label: t('menuUpdates'), icon: <IconInfoOutlineMedium size={16} /> },
        ...remoteSignOut === undefined ? [] : [{ id: 'remoteSignOut', label: t('remoteSignOutMenu') }],
        { type: 'separator', id: 'account-exit' },
        { id: 'signout', label: t('signOut'), icon: <LogoutIcon />, disabled: busy },
      ] : []}>
      {managed && <div className={css.summary}>
        <button type="button" role="menuitem" className={css.identity} onClick={() => {
          setOpen(false); trigger.current?.focus(); openSettings('account')
        }}>
          <span className={css.profileAvatar} data-veteran={veteran || undefined}>
            <UmaAccountAvatar avatar={account.avatar} avatarFailed={avatarFailed} veteran={veteran} />
          </span>
          <span className={css.identityCopy}>
            <span className={css.identityTitle}><span className={css.name}>{label ?? t('loading')}</span>
              {veteran && <BetaVeteranBadge label={t('betaVeteranBadge')} />}</span>
            {identityCaption !== label && <span className={css.caption}>{identityCaption}</span>}</span>
        </button>
        <div className={css.wallet} aria-live="polite">
          <span className={css.caption}>{t('menuBalance')}</span>
          <div className={css.amount}>{balance?.status === 'ready' && balance.value.length > 0
            ? balance.value.map(wallet => <span key={wallet.currency}>{wallet.currency === 'UMA' ? `${wallet.balance} ${t('umaCredits')}` : formatBalance(wallet.balance, wallet.currency === 'CNY' ? '¥' : '$')}</span>)
            : <span className={css.caption}>{t(balance === undefined && !account.failed ? 'loading' : 'menuBalanceFailed')}</span>}</div>
          <div className={css.walletActions}>
            <Button role="menuitem" onClick={() => { if (account.view) visit('usage', account.view.links.usageUrl) }}>{t('usage')}</Button>
            <Button role="menuitem" variant="primary" onClick={() => { if (account.view) visit('top-up', account.view.links.topUpUrl) }}>{t('topUp')}</Button>
          </div>
        </div>
      </div>}
    </Menu>
    {account.loginVisible && !account.onboarding && <SignInDialog account={account} colorScheme={colorScheme}
      start={start} cancel={cancel} t={t}
      close={closeLogin} useApiKey={() => { closeLogin(); openOnboarding('deepseek-official') }} />}
    {signedIn && signOutImpact !== undefined && <SignOutDialog running={signOutImpact} signOut={signOut}
      close={() => { setSignOutImpact(undefined) }} t={t} />}
    {remoteOpen && remoteSignOut !== undefined && !account.loginVisible && !account.onboarding && <Modal open title={t('remoteSignOutMenu')} closeLabel={t('close')}
      onClose={() => { setRemoteOpen(false) }}>
      <RemoteSignOutStatus state={remoteSignOut} currentSignedIn={signedIn} retry={retrySignOut} t={t} />
    </Modal>}
  </div>
}
