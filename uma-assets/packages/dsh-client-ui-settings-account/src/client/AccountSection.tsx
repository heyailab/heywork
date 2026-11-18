/** Account settings renders safe Host state and explicit login actions. */
import { Big } from 'big.js'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Button, IconRightUpOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { AccountDetails, AccountLedgerEntry, AccountLedgerPage, AccountView, PlatformPage, SignInAttemptId } from '@deepseek-ai/dsh-deepseek-account/types'
import type { PropsRuntime, PropsLocale, InjectFace, HostObservable } from '@deepseek-ai/dsh-client-ui-slots'
import type { ThemeSnapshot } from '@deepseek-ai/dsh-client-ui-theme/client'
import type { PlatformPages } from './platform-pages.ts'
import { formatBalance, formatCharge } from './formatBalance.ts'
import type { AccountKey } from './locales.ts'
import { BetaVeteranBadge, UmaAccountAvatar } from './UmaAccountAppearance.tsx'
import { RemoteSignOutStatus } from './RemoteSignOutStatus.tsx'
import type { AccountAvatarSnapshot } from './account-avatar.ts'
import { authorizeUrlWithTheme } from './authorize-url.ts'
import type { BonusNotice } from './bonus-notices.ts'
import css from './AccountSection.module.css'

/** Safe account snapshot shared by the settings page and launcher. */
export interface AccountSnapshot {
  /** Server-authored notices in front-to-back order, absent when none are available. */
  notices?: readonly BonusNotice[]

  /** Latest Host state, absent until the stream responds. */
  view: AccountView | undefined
  /** Sanitized profile and balance query outcomes, absent while loading. */
  details: Partial<AccountDetails> | undefined
  /** Shared picture load; absent until a profile supplies a picture or after sign-out. */
  avatar: AccountAvatarSnapshot | undefined
  /** Whether the state stream failed. */
  failed: boolean
  /** Explicitly opened account dialog outside onboarding. */
  loginVisible?: boolean
  /** Latest explicit start request failed before a Host state was available. */
  loginFailed?: boolean
  /** Model credential onboarding owns the login dialog and delays bonus notices while mounted. */
  onboarding?: boolean
  /** Desktop introduction covers the workspace during loading, saving, and exit animation.
   * True on Desktop until shell.overlay reports visibility, false in browsers; Desktop layouts must render that slot.
   */
  desktopOnboardingVisible?: boolean
}

/** Host operations injected into the Cordis-free account component. */
export interface AccountSectionInjected {
  /** @param snapshot - picture attempt whose rendered image failed; superseded attempts are ignored. */
  avatarFailed: (snapshot: AccountAvatarSnapshot) => void
  /** Subscribe to live credential-expiry notifications.
   * @param listener - callback after the current credential is removed.
   * @returns listener cleanup.
   */
  subscribeSessionExpired?: (listener: () => void) => () => void
  /** Subscribe to live model sign-in guidance; the returned function removes the listener.
   * @param listener - callback for one rejected account-model request.
   * @returns listener cleanup.
   */
  subscribeModelSignInRequired?: (listener: () => void) => () => void
  /** Desktop-only: show one page in the account feature's shared native host; absent in ordinary browsers. */
  openPlatformPage?: PlatformPages['open']
  /** Load one page of the account's CNY ledger, newest first; absent when the deployment has no ledger. */
  loadLedger?: (before?: string) => Promise<AccountLedgerPage | null>

  /** Account stream owned by the Host and theme snapshots published by the renderer, observed through framework hooks. */
  hooks: {
    account: HostObservable<AccountSnapshot>
    /** Palette the Platform login pages follow. */
    theme: HostObservable<ThemeSnapshot>
  }
  /**
   * Retry a failed avatar and read the profile, balance, bonus wallets and unnotified bonus once. The Settings launcher
   * calls it on each entry, and a page opener on return from top-up.
   * @returns after the account queries settle; image loading completes independently.
   */
  refreshAccount: () => Promise<void>
  /** Refresh the authoritative wallet while a UMA balance surface is open. */
  refreshBalance?: () => Promise<void>
  /** Open the external support questionnaire with the account, build and environment sampled by this click. */
  contactUs: () => void
  /** Open or dismiss the login dialog. */
  showLogin: (visible: boolean) => void
  /** Claim dialog ownership for the onboarding step. */
  setOnboarding: (active: boolean) => void
  /** @param orderId - notice whose card finished a presented frame while visible. */
  bonusNoticeShown: (orderId: BonusNotice['orderId']) => void
  /** @param orderId - notice the user closed. */
  bonusNoticeDismissed: (orderId: BonusNotice['orderId']) => void
  /** @returns after the login attempt is created. */
  start: () => Promise<void>
  /** @param id - attempt to cancel. @returns after cancellation or an already-admitted commit. */
  cancel: (id: SignInAttemptId) => Promise<void>
  /** @returns whether a running task currently uses the account token. */
  hasRunningAccountTasks: () => Promise<boolean>
  /** @returns after local account credentials are removed. */
  signOut: () => Promise<void>
  /** @returns after old-session revocation retry is accepted; the account stream reports confirmation. */
  retrySignOut: () => Promise<void>
}
/** Composed account section props. */
export type AccountSectionProps =
  PropsRuntime<'settings.section'> & PropsLocale<'settings.account'> & InjectFace<AccountSectionInjected>
/** Settled CNY charges; internal wallet movements are omitted and empty filtered pages are advanced automatically. */
function LedgerCard({ loadLedger, t }: { loadLedger: NonNullable<AccountSectionProps['loadLedger']>; t: (key: AccountKey) => string }) {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')
  const [entries, setEntries] = useState<readonly AccountLedgerEntry[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const pending = useRef<object | undefined>(undefined)
  useEffect(() => () => { pending.current = undefined }, [])
  const load = (before?: string): void => {
    if (pending.current !== undefined) return
    const operation = {}
    pending.current = operation
    setPhase('loading')
    void (async () => {
      let next = before
      const visited = new Set<string>()
      if (next !== undefined) visited.add(next)
      for (;;) {
        const page = await loadLedger(next)
        if (pending.current !== operation) return
        if (page === null) { setPhase('failed'); return }
        if (page.nextCursor !== null && visited.has(page.nextCursor)) throw new Error('Account history cursor repeated')
        const charges = page.entries.filter(entry => entry.kind === 'settle' && new Big(entry.spentDelta).gt(0))
        if (charges.length > 0 || page.nextCursor === null) {
          setEntries(previous => before === undefined ? charges : [...previous, ...charges])
          setCursor(page.nextCursor)
          setPhase('ready')
          return
        }
        next = page.nextCursor
        visited.add(next)
      }
    })().catch((_error: unknown) => {
      if (pending.current === operation) setPhase('failed')
    }).finally(() => { if (pending.current === operation) pending.current = undefined })
  }
  return <div className={css.balanceCard} aria-busy={phase === 'loading'}>
    <div className={css.row}>
      <span className={css.name}>{t('usageRecent')}</span>
      {(phase === 'idle' || phase === 'loading' || phase === 'failed' || cursor !== null) && <Button variant="outline" disabled={phase === 'loading'}
        onClick={() => { load(cursor ?? undefined) }}>
        {t(phase === 'loading' ? 'usageLoading' : phase === 'failed' ? 'platformRetry' : phase === 'idle' ? 'usageView' : 'usageMore')}
      </Button>}
    </div>
    {entries.map(entry => <div key={entry.id} className={css.row}>
      <span className={css.secondary}>{t('usageSettle')} · {entry.at.slice(0, 10)}</span>
      <span className={css.amount}>{formatCharge(entry.spentDelta)}</span>
    </div>)}
    {phase === 'ready' && entries.length === 0 && <div className={css.row}><span className={css.unavailable}>{t('usageEmpty')}</span></div>}
    {phase === 'failed' && <div className={css.row} role="alert"><span className={css.unavailable}>{t('usageFailed')}</span></div>}
  </div>
}

/** @param props - localized actions, account subscription, and the shared Platform page channel. @returns account settings UI. */
export function AccountSection({
  t, useAccount, useTheme, start, cancel, retrySignOut, openPlatformPage, avatarFailed, loadLedger,
}: AccountSectionProps) {
  const { view: state, details, avatar, failed: streamFailed } = useAccount(value => value)
  const colorScheme = useTheme(snapshot => snapshot.active.colorScheme)
  // The shared host owns the native view; this page holds only its own request,
  // and only while it is the latest owner.
  const releasePage = useRef<(() => void) | undefined>(undefined)
  const [failed, setFailed] = useState(false)
  const [busy, setBusy] = useState(false)
  const profile = details?.profile?.status === 'ready' ? details.profile.value : undefined
  const wallets = details?.balance?.status === 'ready' ? details.balance.value : undefined
  const usesUmaCredits = wallets?.some(wallet => wallet.currency === 'UMA') === true
  const bonusWallets = details?.balance?.status === 'ready'
    ? details.balance.bonusWallets.filter(wallet => new Big(wallet.balance).gt(0)) : []
  const showBonusRow = details?.balance?.status !== 'ready' || bonusWallets.length > 0
  const attempt = state?.attempt
  const active = attempt !== null && attempt !== undefined
    && ['initializing', 'waiting-browser', 'exchanging', 'committing'].includes(attempt.phase)
  const signedIn = state?.status === 'credential-stored'
  const managed = state?.product === 'uma'
  const veteran = signedIn && managed && profile?.umaBadge === 'beta-veteran'
  const avatarUrl = managed && state.links.securityUrl !== undefined
    ? new URL('#avatar-editor', state.links.securityUrl).href : undefined
  useEffect(() => () => { releasePage.current?.(); releasePage.current = undefined }, [])
  useEffect(() => {
    if (signedIn) return
    releasePage.current?.()
    releasePage.current = undefined
  }, [signedIn])
  const showPage = (open: PlatformPages['open'], page: PlatformPage) => {
    releasePage.current?.()
    releasePage.current = open(page, () => { releasePage.current = undefined })
  }
  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setFailed(false)
    try { await action() } catch { setFailed(true) } finally { setBusy(false) }
  }
  /**
   * @param event - click on a Platform destination link.
   * @param page - fixed destination for the embedded view.
   */
  const openPage = (event: MouseEvent<HTMLAnchorElement>, page: PlatformPage): void => {
    if (openPlatformPage !== undefined && signedIn) { event.preventDefault(); showPage(openPlatformPage, page) }
  }
  /**
   * The Platform entry the balance rows share with the Usage action: an embedded page on
   * Desktop, a new tab elsewhere. A wallet read that failed still reaches the same
   * destination, so the user can inspect the balance the Harness could not load; the
   * destination comes from the account links, not from the wallet response.
   * @param label - localized link copy.
   * @param className - link treatment for the row that renders it, absent when the sheet has no such rule.
   * @returns the Platform anchor.
   */
  const platformLink = (label: string, className: string | undefined) => (
    <a className={className} href={state?.links.usageUrl} aria-disabled={state === undefined}
      target="_blank" rel="noreferrer" onClick={(event) => { openPage(event, 'usage') }}>{label}</a>
  )
  const status = failed || streamFailed || attempt?.phase === 'failed' ? t('failed')
    : attempt?.phase === 'expired' ? t('expired')
      : active ? t(attempt.phase === 'initializing' ? 'initializing' : attempt.phase === 'waiting-browser' ? 'waiting' : 'completing')
        : signedIn ? profile?.contact ?? t(details?.profile === undefined ? 'loading' : 'profileUnavailable') : t(managed ? 'umaSignInDescription' : 'signInDescription')
  const identityLabel = signedIn ? profile?.name ?? t(managed ? 'umaSignedIn' : 'signedIn') : t('signedOut')
  if (state === undefined) return (
    <section className={css.signedOut} aria-label={t('nav')} aria-busy={!streamFailed}>
      <div className={css.signedOutContent} role="status">{t(streamFailed ? 'failed' : 'loading')}</div>
    </section>
  )
  const recovery = state.remoteSignOut === undefined ? null : <div className={`${css.balanceCard} ${css.recovery}`}>
    <span className={css.name}>{t('remoteSignOutMenu')}</span>
    <RemoteSignOutStatus state={state.remoteSignOut} currentSignedIn={signedIn} retry={retrySignOut} t={t} />
  </div>
  if (!signedIn && !active) return (
    <section className={state.remoteSignOut === undefined ? css.signedOut : css.section} aria-label={t('nav')}>
      {recovery}
      <div className={css.signedOutContent}>
        <div className={css.signedOutCopy}>
          <span className={css.signedOutTitle}>{t(managed ? 'signedOut' : 'settingsSignedOutTitle')}</span>
          <span className={css.signedOutDescription} role="status">
            {failed || streamFailed ? t('failed') : t(managed ? 'umaSignInDescription' : 'settingsSignedOutDescription')}
          </span>
        </div>
        <Button variant="primary" className={css.signInButton} disabled={busy || state.remoteSignOut?.count === null}
          onClick={() => { void run(start) }}>{t('signIn')}</Button>
      </div>
    </section>
  )
  return (
    <section className={css.section} aria-label={t('nav')}>
      {recovery}
      <div className={css.card}>
        <div className={css.identity}>
          <span className={css.avatar} data-avatar-status={signedIn ? avatar?.status : undefined} data-veteran={veteran || undefined}>
            <UmaAccountAvatar avatar={signedIn ? avatar : undefined} avatarFailed={avatarFailed} veteran={veteran} />
          </span>
          <div className={css.identityCopy}>
            <div className={css.identityTitle}>
              <span className={css.name}>{identityLabel}</span>
              {veteran && <BetaVeteranBadge label={t('betaVeteranBadge')} />}
            </div>
            {status !== identityLabel && <span className={css.status} role="status">{status}</span>}
          </div>
        </div>
        {signedIn && avatarUrl !== undefined && <a className={css.linkButton} href={avatarUrl} target="_blank" rel="noreferrer"
          onClick={(event) => { openPage(event, 'avatar') }}>{t('changeAvatar')}</a>}
        {signedIn && !managed && !usesUmaCredits && <a className={css.accountInfo} href={new URL('/', state.links.usageUrl).href} target="_blank" rel="noopener noreferrer">
          {t('accountInfo')}<IconRightUpOutlineRegular size={12} />
        </a>}
      </div>
      {active && <div className={css.actions}>
        {attempt.authorizeUrl && <a className={css.linkButton} href={authorizeUrlWithTheme(attempt.authorizeUrl, colorScheme)}
          target="_blank" rel="noreferrer">
          {t('open')}
        </a>}
        <Button variant="outline" disabled={busy || attempt.phase === 'committing'}
          onClick={() => { void run(() => cancel(attempt.id)) }}>{t('cancel')}</Button>
      </div>}
      <div className={css.balanceCard}>
        <div className={css.row}>
          <span>{t(usesUmaCredits ? 'umaCredits' : 'balance')}</span>
          {signedIn && wallets !== undefined && wallets.length > 0
            ? <span className={css.amount}>{wallets.map(wallet => <span key={wallet.currency}>
              {wallet.currency === 'UMA' ? wallet.balance : formatBalance(wallet.balance, wallet.currency === 'CNY' ? '¥' : '$')}
            </span>)}</span>
            : !signedIn || details?.balance === undefined
              ? <span className={css.unavailable}>{t(!signedIn ? 'balanceSignedOut' : 'loading')}</span>
              : platformLink(t('balanceUnavailable'), css.unavailableLink)}
        </div>
        {signedIn && showBonusRow && <>
          <div className={css.divider} />
          <div className={css.row}>
            <span>{t('bonusBalance')}</span>
            <span className={css.bonusValue}>
              {bonusWallets.length > 0
                ? <span className={css.amount}>{bonusWallets.map(wallet => <span key={wallet.currency}>
                  {wallet.currency === 'UMA' ? wallet.balance : formatBalance(wallet.balance, wallet.currency === 'CNY' ? '¥' : '$')}
                </span>)}</span>
                : details?.balance === undefined
                  ? <span className={css.unavailable}>{t('loading')}</span>
                  : platformLink(t('balanceUnavailable'), css.unavailableLink)}
            </span>
          </div>
        </>}
        {(managed ? signedIn : !usesUmaCredits) && <>
          <div className={css.divider} />
          <div className={css.row}>
            <span className={css.secondary}>{t('more')}</span>
            <div className={css.links}>
              {platformLink(t('usage'), css.linkButton)}
              <a className={`${css.linkButton} ${css.primary}`} href={state.links.topUpUrl}
                target="_blank" rel="noreferrer"
                onClick={(event) => { openPage(event, 'top-up') }}>{t('topUp')}</a>
            </div>
          </div>
        </>}
      </div>
      {signedIn && managed && loadLedger !== undefined && profile?.id != null
        && <LedgerCard key={profile.id} loadLedger={loadLedger} t={t} />}
      {signedIn && managed && state.links.securityUrl !== undefined
        && <div className={css.balanceCard}>
          <div className={css.row}>
            <span>{t('accountSecurity')}</span>
            <a className={css.linkButton} href={state.links.securityUrl} target="_blank" rel="noreferrer"
              onClick={(event) => { openPage(event, 'security') }}>{t('manageAccountSecurity')}</a>
          </div>
        </div>}
    </section>
  )
}
