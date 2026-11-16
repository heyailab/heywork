/** Platform PKCE account provider; browser approval never bypasses local cancellation. */
import { randomBytes, randomUUID, createHash, timingSafeEqual } from 'node:crypto'
import type { ServerResponse } from 'node:http'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { arch, platform, release } from 'node:os'
import { promises as streamPromises } from 'node:stream'
import { Context, Service } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { z } from 'zod'
import { DeepSeekAccount, UMA_PLATFORM_PATHS, installAccountTaskCancellation, mergePlatformCookies, platformClientHeaders, platformWireLocale, type AccountBonusBatch, type AccountBonusOrderId, type AccountClientMetadata, type AccountDetails, type AccountUserId, type AccountView, type PlatformSession, type SignInAttemptId, type SignInAttemptView } from '@deepseek-ai/dsh-deepseek-account'
import type { AccountLedgerPage } from '@deepseek-ai/dsh-deepseek-account/types'
import { credentialKey, type CredentialKey, type CredentialRecord } from '@deepseek-ai/dsh-credentials'
import type { AuthorizationSession } from '@deepseek-ai/dsh-authorization'
import { profile, readAccountDetail, readUnnotifiedBonuses, sendBonusNotified, readLedger } from './details.ts'
import { revokeAccount, type LogoutRetryPolicy } from './logout.ts'
import { LogoutJournal, type LogoutEntry } from './logout-journal.ts'
import { AccountUnauthorizedError, PlatformAuthError, platformHeaders, platformOrigin, browserUrl, requestPlatform, refreshAccount, initialization, exchange, loginOrigin } from './protocol.ts'

const renewal = z.object({
  id: z.uuid(), token: z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/),
  attempt: z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/),
  refreshAfter: z.number().int().positive(), expiresAt: z.number().int().positive(),
}).refine(value => value.refreshAfter <= value.expiresAt)
const grant = z.object({ version: z.literal(1), token: z.string().min(1), issuer: z.url(), renewal: renewal.optional() })
type Grant = z.infer<typeof grant>
const device = z.object({ id: z.uuid() })

function renewableGrant(issuer: string, access: string, refresh: string, expiresIn: number, id: string = randomUUID()): Grant {
  const expiresAt = Date.now() + expiresIn * 1000
  return { version: 1, token: access, issuer, renewal: {
    id, token: refresh, attempt: randomBytes(24).toString('base64url'),
    expiresAt, refreshAfter: expiresAt - (expiresIn > 60 ? 60_000 : 0),
  } }
}

function profileBinding(stored: Grant): string {
  return stored.renewal?.id ?? stored.token
}

/** Deployment-specific platform and request deadlines. */
export interface Config {
  /** Product identity announced to clients for the selected account issuer. */
  product?: 'uma'
  /** Model routes that use this account grant. */
  modelProviders?: string[]
  /** Prefix for this deployment's account and device credential IDs. Omit to keep the default IDs. */
  credentialIdPrefix?: string
  /** Platform origin serving auth-api and browser pages. */
  platformOrigin?: string
  /** Native desktop identity for Host API and embedded Platform requests; null identifies the client as web. */
  desktopPlatform?: 'darwin' | 'win32' | null
  /** Optional frontend deployment selector for embedded Usage and Top-up pages. */
  embeddedPageDist?: string
  /** Exact HTTP(S) origin allowed to receive account tokens for inference and files. */
  inferenceOrigin?: string
  /** Allow HTTP only on loopback for the development Mock. */
  allowLoopbackHttp?: boolean
  /** Map authorization and completion pages to platformOrigin for private development proxies. */
  rewriteBrowserOrigin?: boolean
  /** Host-only headers sent exclusively to platformOrigin; account authorization cannot be overridden. */
  requestHeaders?: Record<string, string>
  /** Overrides for profile, balance and embedded Platform requests; Cookie pairs merge by name. Logout retains requestHeaders. */
  accountRequestHeaders?: Record<string, string>
  /** Deadline for each platform HTTP request. */
  requestTimeoutMs?: number
  /** Deadline for recharge-wallet queries; timeout returns a failed balance outcome. */
  balanceTimeoutMs?: number
  /** Additional logout attempts after the first request fails, at most five. */
  logoutMaxRetries?: number
  /** Delay before the first logout retry; each later delay doubles. */
  logoutRetryDelayMs?: number
  /** Upper bound for the entire local attempt, even if the server advertises a longer TTL. */
  attemptTimeoutMs?: number
}
/** Validated deployment choices. */
const platformConfig = Schema.object({
  product: Schema.const('uma'),
  modelProviders: Schema.array(Schema.string().min(1)).min(1).default(['deepseek-account']),
  credentialIdPrefix: Schema.string(),
  platformOrigin: Schema.string().default('https://platform.deepseek.com'),
  desktopPlatform: Schema.union([Schema.const('darwin'), Schema.const('win32'), Schema.const(null)]).default(null),
  embeddedPageDist: Schema.string().default(''),
  inferenceOrigin: Schema.string().default('https://api.deepseek.com'),
  allowLoopbackHttp: Schema.boolean().default(false),
  rewriteBrowserOrigin: Schema.boolean().default(false),
  requestHeaders: Schema.dict(Schema.string().role('secret')).default({}),
  accountRequestHeaders: Schema.dict(Schema.string().role('secret')).default({}),
  requestTimeoutMs: Schema.number().min(1).max(120_000).default(30_000),
  balanceTimeoutMs: Schema.number().min(1).max(120_000).default(30_000),
  logoutMaxRetries: Schema.number().min(0).max(5).step(1).default(5),
  logoutRetryDelayMs: Schema.number().min(1).max(60_000).default(1_000),
  attemptTimeoutMs: Schema.number().min(1).max(3_600_000).default(600_000),
})

interface Attempt {
  locale: 'en_US' | 'zh_CN'
  clientHeaders: Record<string, string>
  view: SignInAttemptView
  controller: AbortController
  done: Promise<void>
  running: Promise<void>
  origin: string
  loginSource: 'web' | 'desktop'
  disposeCallback?: () => Promise<void>
  callback?: ServerResponse
  initialProfile?: { token: string; value: AccountDetails['profile'] }
  completionUrl?: string
}

/** The platform implementation owns login state and its opaque stored grant. */
export class PlatformAccount extends DeepSeekAccount {
  static inject = ['credentials', 'authorization']
  static Config = platformConfig
  private readonly accountKey: CredentialKey
  private readonly deviceKey: CredentialKey
  private readonly logoutKey: CredentialKey
  private readonly logoutJournal: LogoutJournal
  private readonly origin: string
  private readonly product: Config['product']
  private readonly embeddedPageDist: string
  private readonly inferenceOrigin: string
  private readonly rewriteBrowserOrigin: boolean
  private readonly platform: 'darwin' | 'win32' | null
  private readonly requestHeaders: Record<string, string>
  private readonly accountRequestHeaders: Record<string, string>
  private readonly requestTimeout: number
  private readonly balanceTimeout: number
  private readonly attemptTimeout: number
  private readonly logoutPolicy: LogoutRetryPolicy
  private readonly logoutLifetime = new AbortController()
  private readonly revocations = new Map<LogoutEntry['id'], Promise<void>>()
  private readonly cancellations = new Set<Promise<void>>()
  private revocationStorageFailed = false
  private accessBlocked = false
  private attempt: Attempt | undefined
  private readonly listeners = new Set<(identityOnly: boolean) => void>()
  /**
   * Latest ready profile read and the grant token it was read with. Binding the token keeps a
   * cached identity from answering for a credential that has since changed.
   */
  private lastProfile: { readonly binding: string; readonly profile: Extract<AccountDetails['profile'], { status: 'ready' }> } | undefined
  private detailsLifetime = new AbortController()
  private refreshTimer: ReturnType<typeof setTimeout> | undefined
  private refreshing: { readonly id: string; readonly controller: AbortController; readonly result: Promise<Grant | null> } | undefined
  private closed = false
  private removing: Promise<AccountView> | undefined
  private retrying: Promise<AccountView> | undefined

  /** @param ctx - Host with authorization and credentials services. @param config - deployment options. */
  constructor(ctx: Context, config: Config = {}) {
    const resolved = platformConfig(config)
    super(ctx, resolved.modelProviders)
    installAccountTaskCancellation(ctx, this.modelProviders)
    this.product = config.product
    const prefix = config.credentialIdPrefix
    this.accountKey = credentialKey('deepseek-account-platform', prefix === undefined ? 'default' : `${prefix}-account`)
    this.deviceKey = credentialKey('deepseek-account-platform', prefix === undefined ? 'device' : `${prefix}-device`)
    this.logoutKey = credentialKey('deepseek-account-platform', prefix === undefined ? 'default-logout' : `${prefix}-logout`)
    const label = prefix === undefined ? 'DeepSeek' : 'UMA Studio'
    this.embeddedPageDist = resolved.embeddedPageDist
    this.origin = platformOrigin(resolved.platformOrigin, resolved.allowLoopbackHttp)
    this.logoutJournal = new LogoutJournal(ctx.credentials, this.logoutKey, this.origin, () => { this.blockAccess() })
    const inference = new URL(resolved.inferenceOrigin)
    if (!['http:', 'https:'].includes(inference.protocol) || inference.username || inference.password
      || inference.pathname !== '/' || inference.search || inference.hash) {
      throw new Error('account: inferenceOrigin must be an HTTP(S) origin without credentials, path, query or fragment')
    }
    this.inferenceOrigin = inference.origin
    this.rewriteBrowserOrigin = resolved.rewriteBrowserOrigin
    this.platform = resolved.desktopPlatform
    this.requestHeaders = platformHeaders(resolved.requestHeaders)
    const accountHeaders = platformHeaders(resolved.accountRequestHeaders)
    this.accountRequestHeaders = { ...this.requestHeaders, ...accountHeaders }
    if (accountHeaders.cookie !== undefined) {
      this.accountRequestHeaders.cookie = mergePlatformCookies(this.requestHeaders.cookie ?? '', accountHeaders.cookie)
    }
    this.requestTimeout = resolved.requestTimeoutMs
    this.balanceTimeout = resolved.balanceTimeoutMs
    this.attemptTimeout = resolved.attemptTimeoutMs
    this.logoutPolicy = {
      maxRetries: resolved.logoutMaxRetries, delayMs: resolved.logoutRetryDelayMs, requestTimeoutMs: this.requestTimeout,
    }
    ctx.authorization.registerFlow({
      key: this.accountKey, label, methods: [{ id: 'browser', label }],
      run: (session) => {
        const attempt = this.attempt
        if (attempt === undefined) return Promise.reject(new PlatformAuthError('protocol'))
        attempt.running = this.run(session, attempt)
        return attempt.running
      },
    })
    ctx.on('credentials/record-updated', (key) => {
      if (key === this.logoutKey) {
        this.changed()
        void this.resumeRevocations().catch(() => { this.revocationStorageFailure() })
        return
      }
      if (key !== this.accountKey) return
      clearTimeout(this.refreshTimer)
      this.invalidateDetails(false)
      this.changed()
    })
    ctx.effect(() => async () => {
      this.closed = true
      clearTimeout(this.refreshTimer)
      this.logoutLifetime.abort()
      this.invalidateDetails()
      const active = this.attempt
      if (active !== undefined) {
        if (active.view.phase !== 'committing') active.controller.abort()
        await active.done
      }
      await Promise.allSettled([this.removing, this.retrying, this.refreshing?.result,
        ...this.revocations.values(), ...this.cancellations])
      this.changed()
    }, 'account: active attempt lifetime')
  }

  async [Service.init](): Promise<void> {
    let pending: LogoutEntry[]
    try { pending = await this.readLogoutJournal() }
    catch { this.revocationStorageFailure(); return }
    const record = await this.ctx.credentials.readRecord(this.accountKey)
    if (record !== undefined) {
      if (record.kind !== 'grant') throw new PlatformAuthError('storage')
      const parsed = grant.safeParse(record.payload)
      if (!parsed.success) throw new PlatformAuthError('storage')
      if (parsed.data.issuer !== this.origin) {
        await this.ctx.credentials.deleteRecord(this.accountKey, current => current.kind === 'grant'
          && grant.safeParse(current.payload).data?.issuer === parsed.data.issuer)
      }
    }
    for (const entry of pending) {
      try {
        await this.removeRecordedGrant(entry)
        if (entry.status === 'prepared') await this.logoutJournal.ready(entry.id)
        this.revoke(entry)
      } catch { this.revocationStorageFailure() }
    }
  }

  override async getState(): Promise<AccountView> {
    let pending: LogoutEntry[] | null
    try { pending = await this.readLogoutJournal() }
    catch { pending = null }
    const record = pending === null ? undefined : await this.ctx.credentials.readRecord(this.accountKey)
    if (record !== undefined && (record.kind !== 'grant' || !grant.safeParse(record.payload).success)) {
      throw new PlatformAuthError('storage')
    }
    const stored = record?.kind === 'grant' ? grant.parse(record.payload) : undefined
    const locallyRemoved = stored === undefined || pending?.some(entry => entry.binding === profileBinding(stored)) === true
    const failed = this.revocationStorageFailed || pending?.every(entry => entry.status === 'failed' && !this.revocations.has(entry.id)) === true
    const attempt = this.attempt?.view ?? null
    return {
      status: locallyRemoved ? 'signed-out' : 'credential-stored',
      ...(this.product === undefined ? {} : { product: this.product }),
      // Credential removal can notify watchers before sign-out finishes clearing the attempt.
      attempt: locallyRemoved && attempt?.phase === 'succeeded' ? null : attempt,
      ...pending === null ? { remoteSignOut: { status: 'failed' as const, count: null, errorCode: 'storage' as const } }
        : pending.length === 0 ? {} : { remoteSignOut: {
          status: failed ? 'failed' as const : 'pending' as const, count: pending.length,
          ...failed ? { errorCode: this.revocationStorageFailed ? 'storage' as const : 'network' as const } : {},
        } },
      links: {
        usageUrl: new URL(this.product === 'uma' ? UMA_PLATFORM_PATHS.usage : '/usage', this.origin).href,
        topUpUrl: new URL(UMA_PLATFORM_PATHS['top-up'], this.origin).href,
        ...(this.product === 'uma' ? {
          securityUrl: new URL(UMA_PLATFORM_PATHS.security, this.origin).href,
          sdkKeysUrl: new URL(UMA_PLATFORM_PATHS['sdk-keys'], this.origin).href,
        } : {}),
      },
    }
  }

  override async getProfile(client: AccountClientMetadata): Promise<AccountDetails['profile'] | null> {
    const active = await this.activeGrant()
    if (active === null) return null
    const { lifetime, stored } = active
    const result = await this.getDetail('profile', this.detailHeaders(client), { lifetime, stored })
    if (this.detailsLifetime !== lifetime) return null
    if (result !== null) this.cacheProfile(profileBinding(stored), result)
    if (result?.status !== 'failed') return result
    // Only this same grant's last ready read may stand in for a failed refresh.
    const cached = this.lastProfile?.binding === profileBinding(stored) ? this.lastProfile.profile : undefined
    return cached ?? result
  }

  override getBalance(client: AccountClientMetadata): Promise<AccountDetails['balance'] | null> {
    return this.getDetail('balance', this.detailHeaders(client))
  }

  override async getLedger(client: AccountClientMetadata, before?: string): Promise<AccountLedgerPage | null> {
    const headers = this.detailHeaders(client)
    const active = await this.activeGrant()
    if (active === null) return null
    const { lifetime, stored } = active
    try {
      const page = await readLedger(this.origin, stored.token, before,
        AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers)
      return this.detailsLifetime === lifetime ? page : null
    } catch (error) {
      if (this.detailsLifetime !== lifetime) return null
      if (error instanceof AccountUnauthorizedError) {
        await this.expireCredential(stored.token, lifetime)
        return null
      }
      throw error
    }
  }

  override async getUnnotifiedBonuses(client: AccountClientMetadata): Promise<AccountBonusBatch | null> {
    const headers = this.detailHeaders(client)
    const active = await this.activeGrant()
    if (active === null) return null
    const { lifetime, stored } = active
    const accountId = await this.currentAccountId(lifetime, stored, headers)
    if (accountId === null) return null
    try {
      const bonuses = await readUnnotifiedBonuses(this.origin, stored.token,
        AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers)
      return { accountId, bonuses }
    } catch (error) {
      if (error instanceof AccountUnauthorizedError) {
        if (this.detailsLifetime === lifetime) await this.expireCredential(stored.token, lifetime)
        return null
      }
      throw error
    }
  }

  override async ackBonusNotified(accountId: AccountUserId, orderId: AccountBonusOrderId, client: AccountClientMetadata): Promise<boolean> {
    const headers = this.detailHeaders(client)
    const active = await this.activeGrant()
    if (active === null) return false
    const { lifetime, stored } = active
    const current = await this.currentAccountId(lifetime, stored, headers)
    if (current === null || current !== accountId) return false
    try {
      await sendBonusNotified(this.origin, stored.token, orderId,
        AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers)
      return true
    } catch (error) {
      if (error instanceof AccountUnauthorizedError) {
        if (this.detailsLifetime === lifetime) await this.expireCredential(stored.token, lifetime)
        return false
      }
      throw error
    }
  }

  /**
   * Resolve the profile identity bound to one captured grant, within that grant's credential lifetime.
   * @param lifetime - credential lifetime the grant was captured under; a change discards the result.
   * @param stored - captured grant; the identity query never re-reads a newer credential.
   * @param headers - client identity headers of the calling operation.
   * @returns the account identity, or null while signed out or after the credential changed.
   */
  private async currentAccountId(lifetime: AbortController, stored: Grant,
    headers: Record<string, string>): Promise<AccountUserId | null> {
    // A profile already read for this same captured grant names the account, so a bonus read or
    // acknowledgement reuses it instead of issuing another current query.
    const binding = profileBinding(stored)
    if (this.lastProfile?.binding === binding) return this.identityOf(this.lastProfile.profile)
    const details = await this.getDetail('profile', headers, { lifetime, stored })
    if (details === null) return null
    if (details.status === 'failed') {
      // The query named no identity, and the cache is empty or belongs to another grant.
      throw new PlatformAuthError('network')
    }
    this.cacheProfile(binding, details)
    return this.identityOf(details)
  }

  /**
   * Cache one ready profile against the grant token it was read with, so identity reuse cannot cross
   * a credential change. A stable ID that first appears or changes notifies identity-enabled watch consumers, so
   * identity consumers re-read getPlatformSession; repeated IDs stay silent.
   * @param binding - login identity the profile was read with.
   * @param profile - profile outcome to record when it carries account data.
   */
  private cacheProfile(binding: string, profile: AccountDetails['profile']): void {
    if (profile.status !== 'ready') return
    // Identity publishers re-read the session snapshot; wake them only when the stable ID changes.
    const previous = this.lastProfile?.profile.value.id || null
    this.lastProfile = { binding, profile }
    if (previous !== (profile.value.id || null)) this.changed(true)
  }

  /**
   * @param profile - ready profile projected for the UI.
   * @returns the account identity it names.
   * @throws PlatformAuthError when the profile carries no stable Platform id, which cannot isolate notices.
   */
  private identityOf(profile: Extract<AccountDetails['profile'], { status: 'ready' }>): AccountUserId {
    if (profile.value.id === null) throw new PlatformAuthError('protocol')
    return profile.value.id
  }

  private async getDetail<K extends keyof AccountDetails>(field: K, headers: Record<string, string>,
    captured?: { lifetime: AbortController; stored: Grant }): Promise<AccountDetails[K] | null> {
    const active = captured ?? await this.activeGrant()
    if (active === null || active.lifetime.signal.aborted) return null
    const { lifetime, stored } = active
    if (field === 'profile' && this.attempt?.initialProfile?.token === stored.token) {
      const initial = this.attempt.initialProfile.value
      delete this.attempt.initialProfile
      return initial as AccountDetails[K]
    }
    try {
      const details = await readAccountDetail(field, this.origin, stored.token,
        AbortSignal.any([lifetime.signal, AbortSignal.timeout(field === 'balance' ? this.balanceTimeout : this.requestTimeout)]), headers)
      return this.detailsLifetime !== lifetime ? null : details
    } catch (_unauthorized) {
      // readAccountDetail exposes only authenticated credential rejection failures.
      if (this.detailsLifetime === lifetime) await this.expireCredential(stored.token, lifetime)
      return null
    }
  }

  /** Deployment account headers plus the client identity headers derived from one call's metadata. */
  private detailHeaders(client: AccountClientMetadata): Record<string, string> {
    return { ...this.accountRequestHeaders, ...platformClientHeaders(this.platform, client) }
  }

  override async rejectToken(token: string): Promise<void> {
    const lifetime = this.detailsLifetime
    const stored = await this.readCurrentGrant(lifetime)
    if (stored?.token !== token || this.detailsLifetime !== lifetime) return
    await this.expireCredential(token, lifetime)
  }

  private async expireCredential(token: string, lifetime: AbortController): Promise<void> {
    this.removing ??= (async () => {
      if (this.attempt !== undefined) await this.cancelSignIn(this.attempt.view.id)
      const record = await this.ctx.credentials.readRecord(this.accountKey)
      if (this.closed || this.detailsLifetime !== lifetime || record?.kind !== 'grant') return this.getState()
      const current = grant.parse(record.payload)
      if (current.token !== token || current.issuer !== this.origin) return this.getState()
      const deletion = { removed: false }
      await this.ctx.credentials.deleteRecord(this.accountKey, (record) => {
        const latest = record.kind === 'grant' ? grant.safeParse(record.payload) : undefined
        deletion.removed = latest?.success === true && latest.data.token === token && latest.data.issuer === this.origin
        return deletion.removed
      })
      if (!deletion.removed) return this.getState()
      this.lastProfile = undefined
      this.ctx.emit('deepseek-account/session-expired')
      this.attempt = undefined
      this.ctx.emit('deepseek-account/signed-out')
      this.changed()
      return this.getState()
    })().finally(() => { this.removing = undefined })
    await this.removing
  }

  override async getDeviceIdentity(): Promise<{ deviceId?: string; userId?: AccountUserId; osVersion: string }> {
    const [record, session] = await Promise.all([
      this.ctx.credentials.readRecord(this.deviceKey),
      this.getPlatformSession(),
    ])
    const parsed = record?.kind === 'grant' ? device.safeParse(record.payload) : undefined
    return {
      ...parsed?.success ? { deviceId: parsed.data.id } : {},
      ...session?.userId == null ? {} : { userId: session.userId },
      osVersion: deviceOsVersion(),
    }
  }

  override async getPlatformSession(): Promise<PlatformSession | null> {
    const lifetime = this.detailsLifetime
    let stored = await this.readCurrentGrant(lifetime)
    if (stored === null || lifetime.signal.aborted || this.isUnavailable()) return null
    const state = stored.renewal
    if (this.product === 'uma' && state !== undefined && state.expiresAt <= Date.now()) {
      const expired = stored
      try {
        stored = await this.refreshGrant(expired, state)
      } catch {
        if (this.detailsLifetime === lifetime) this.scheduleRefresh(expired, 15_000)
        return null
      }
      if (stored === null || this.isUnavailable()) return null
    }
    this.scheduleRefresh(stored)
    // Deployment headers only; the consuming client adds the identity of its own UI.
    const requestHeaders = { ...this.accountRequestHeaders }
    // Identity comes from the profile read for this same grant; an unknown ID requires disposable
    // browser storage. A replaced credential never publishes the account its predecessor named.
    return { origin: this.origin, token: stored.token,
      userId: this.lastProfile?.binding === profileBinding(stored) ? this.lastProfile.profile.value.id || null : null,
      ...(stored.renewal === undefined ? {} : { sessionId: stored.renewal.id as NonNullable<PlatformSession['sessionId']> }),
      ...(this.embeddedPageDist ? { embeddedPageDist: this.embeddedPageDist } : {}),
      ...(this.product === 'uma' ? { authenticatePage: true } : {}),
      requestHeaders }
  }

  private async readCurrentGrant(lifetime: AbortController): Promise<Grant | null> {
    if (this.closed) return null
    const record = await this.ctx.credentials.readRecord(this.accountKey)
    if (record === undefined || lifetime.signal.aborted) return null
    if (record.kind !== 'grant') throw new PlatformAuthError('storage')
    const parsed = grant.safeParse(record.payload)
    if (!parsed.success) throw new PlatformAuthError('storage')
    // A private origin override must never forward a grant issued by another environment.
    if (parsed.data.issuer !== this.origin) throw new PlatformAuthError('protocol')
    if ((await this.readLogoutJournal()).some(entry => entry.binding === profileBinding(parsed.data))) return null
    return parsed.data
  }

  private async activeGrant(): Promise<{ lifetime: AbortController; stored: Grant } | null> {
    const lifetime = this.detailsLifetime
    const stored = await this.readCurrentGrant(lifetime)
    if (stored === null || this.isUnavailable()) return null
    if (this.product !== 'uma' || stored.renewal === undefined || stored.renewal.refreshAfter > Date.now()) {
      return { lifetime, stored }
    }
    const fresh = await this.refreshGrant(stored, stored.renewal)
    if (fresh === null || this.isUnavailable()) return null
    return { lifetime: this.detailsLifetime, stored: fresh }
  }

  private refreshGrant(stored: Grant, state: z.infer<typeof renewal>): Promise<Grant | null> {
    const pending = this.refreshing
    if (pending !== undefined) {
      if (pending.id === state.id) return pending.result
      return pending.result.catch(() => null).then(() =>
        this.isUnavailable() ? null : this.refreshGrant(stored, state))
    }
    const controller = new AbortController()
    const result = this.rotateGrant(stored, state, controller.signal).finally(() => {
      if (this.refreshing?.result === result) this.refreshing = undefined
    })
    this.refreshing = { id: state.id, controller, result }
    return result
  }

  private async rotateGrant(stored: Grant, state: z.infer<typeof renewal>, cancellation: AbortSignal): Promise<Grant | null> {
    let rejectedToken: string | undefined
    const record = await this.ctx.credentials.modifyRecord(this.accountKey, async (current) => {
      if (this.isUnavailable() || current?.kind !== 'grant') return undefined
      const latest = grant.safeParse(current.payload)
      if (!latest.success) throw new PlatformAuthError('storage')
      const active = latest.data.renewal
      if (latest.data.issuer !== this.origin || active?.id !== state.id || active.attempt !== state.attempt
        || active.refreshAfter > Date.now()) return undefined
      const signal = AbortSignal.any([cancellation, this.logoutLifetime.signal, AbortSignal.timeout(Math.min(10_000, this.requestTimeout))])
      try {
        const next = await refreshAccount(this.origin, active.token, active.attempt, signal, this.requestHeaders)
        return { kind: 'grant', payload: renewableGrant(this.origin, next.access_token, next.refresh_token, next.expires_in, active.id) }
      } catch (error) {
        if (!(error instanceof AccountUnauthorizedError)) throw error
        rejectedToken = latest.data.token
        return undefined
      }
    })
    if (rejectedToken !== undefined) {
      if (this.removing === undefined) await this.expireCredential(rejectedToken, this.detailsLifetime)
      return null
    }
    if (record?.kind !== 'grant') return null
    const latest = grant.safeParse(record.payload)
    if (!latest.success) throw new PlatformAuthError('storage')
    return latest.data.issuer === stored.issuer && latest.data.renewal?.id === state.id ? latest.data : null
  }

  private scheduleRefresh(stored: Grant, retryDelay = 0): void {
    const state = stored.renewal
    if (this.product !== 'uma' || state === undefined || this.isUnavailable()) return
    clearTimeout(this.refreshTimer)
    const lifetime = this.detailsLifetime
    this.refreshTimer = setTimeout(() => {
      void this.refreshGrant(stored, state).catch(() => {
        if (!lifetime.signal.aborted) this.scheduleRefresh(stored, 15_000)
      })
    }, Math.max(retryDelay, state.refreshAfter - Date.now()))
    this.refreshTimer.unref()
  }

  override async resolveToken(url: string): Promise<string | undefined> {
    if (this.isUnavailable()) return undefined
    const destination = new URL(url)
    if (destination.origin !== this.inferenceOrigin || destination.username || destination.password) return undefined
    const record = await this.ctx.credentials.readRecord(this.accountKey)
    if (record === undefined) return undefined
    if (record.kind !== 'grant') throw new PlatformAuthError('storage')
    const parsed = grant.safeParse(record.payload)
    if (!parsed.success) throw new PlatformAuthError('storage')
    const stored = parsed.data
    if ((await this.readLogoutJournal()).some(entry => entry.binding === profileBinding(stored))) return undefined
    // Development grants cannot authenticate production model or file requests.
    const issuer = new URL(stored.issuer)
    if (stored.token.startsWith('dsh_mock_')) return undefined
    if (this.inferenceOrigin === 'https://api.deepseek.com') {
      if (['localhost', '127.0.0.1', '[::1]'].includes(issuer.hostname)) return undefined
    } else if (issuer.origin !== this.origin) return undefined
    if (this.product === 'uma' && stored.renewal !== undefined && stored.renewal.refreshAfter <= Date.now()) {
      const fresh = await this.refreshGrant(stored, stored.renewal)
      return this.isUnavailable() ? undefined : fresh?.token
    }
    return this.isUnavailable() ? undefined : stored.token
  }

  private isUnavailable(): boolean {
    return this.closed || this.removing !== undefined
  }

  override async startSignIn(client: AccountClientMetadata, callbackOrigin: string, loginSource: 'web' | 'desktop'): Promise<AccountView> {
    if (this.removing !== undefined) await this.removing
    await this.readLogoutJournal()
    const origin = loginOrigin(callbackOrigin)
    if (this.closed) throw new PlatformAuthError('protocol')
    if (this.attempt !== undefined && ['initializing', 'waiting-browser', 'exchanging', 'committing'].includes(this.attempt.view.phase)) {
      return this.getState()
    }
    const previous = this.attempt
    if (previous !== undefined) {
      await previous.done
      // Disposal can close the provider while the previous attempt settles.
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (this.closed) throw new PlatformAuthError('protocol')
      if (this.attempt !== previous) return this.getState()
    }
    const attempt: Attempt = {
      origin, loginSource,
      locale: platformWireLocale(client.locale),
      clientHeaders: platformClientHeaders(this.platform, client),
      view: { id: randomUUID() as SignInAttemptId, phase: 'initializing' },
      controller: new AbortController(), done: Promise.resolve(), running: Promise.resolve(),
    }
    this.attempt = attempt
    attempt.done = this.ctx.authorization.begin({
      key: this.accountKey, signal: attempt.controller.signal,
      interaction: { notify: () => undefined, prompt: () => Promise.reject(new PlatformAuthError('protocol')) },
    }).then((outcome) => {
      this.update(attempt, { phase: outcome.status === 'authorized' ? 'succeeded' : 'cancelled' })
      if (outcome.status === 'authorized' && attempt.completionUrl !== undefined) {
        attempt.callback?.writeHead(302, { location: attempt.completionUrl, 'cache-control': 'no-store' }).end()
      } else attempt.callback?.writeHead(204, { 'cache-control': 'no-store' }).end()
    }).catch((error: unknown) => {
      const code = error instanceof PlatformAuthError ? error.code : 'protocol'
      console.error('[deepseek-account] sign-in failed', { errorCode: code })
      this.update(attempt, { phase: code === 'expired' ? 'expired' : 'failed', errorCode: code })
      this.finishFailedCallback(attempt)
    }).then(async () => {
      // begin() may report cancellation before the HTTP work observes its signal.
      await attempt.running.catch(() => undefined)
      if (attempt.callback !== undefined) {
        await streamPromises.finished(attempt.callback, { cleanup: true }).catch(() => undefined)
      }
      await attempt.disposeCallback?.()
    })
    this.changed()
    return this.getState()
  }

  override async cancelSignIn(id: SignInAttemptId): Promise<AccountView> {
    const attempt = this.attempt
    if (attempt?.view.id === id) {
      if (attempt.view.phase !== 'committing') {
        attempt.controller.abort()
        this.ctx.authorization.cancel(this.accountKey)
      }
      await attempt.done
    }
    return this.getState()
  }

  override signOut(client: AccountClientMetadata): Promise<AccountView> {
    this.removing ??= (async () => {
      if (this.closed) throw new PlatformAuthError('protocol')
      this.refreshing?.controller.abort()
      if (this.attempt !== undefined) {
        await this.cancelSignIn(this.attempt.view.id)
        this.attempt = undefined
      }
      const record = await this.ctx.credentials.readRecord(this.accountKey)
      if (record !== undefined) {
        if (record.kind !== 'grant') throw new PlatformAuthError('storage')
        const parsed = grant.safeParse(record.payload)
        if (!parsed.success) throw new PlatformAuthError('storage')
        if (parsed.data.issuer !== this.origin) throw new PlatformAuthError('protocol')
        const entry: LogoutEntry = { id: randomUUID() as LogoutEntry['id'], token: parsed.data.renewal?.token ?? parsed.data.token,
          binding: profileBinding(parsed.data), client, status: 'prepared' }
        await this.logoutJournal.append(entry)
        await this.removeRecordedGrant(entry)
        try { await this.logoutJournal.ready(entry.id) }
        catch {
          this.revocationStorageFailure()
          throw new PlatformAuthError('storage')
        }
        for (const pending of await this.readLogoutJournal()) if (pending.status === 'pending') this.revoke(pending)
      }
      const state = await this.getState()
      this.changed()
      return state
    })().finally(() => { this.removing = undefined })
    return this.removing
  }

  override retrySignOut(client: AccountClientMetadata): Promise<AccountView> {
    this.retrying ??= (async () => {
      if (this.closed) throw new PlatformAuthError('protocol')
      try {
        if (this.revocations.size > 0) return await this.getState()
        for (const entry of await this.readLogoutJournal()) await this.removeRecordedGrant(entry)
        const pending = await this.logoutJournal.retry(client)
        this.revocationStorageFailed = false
        for (const entry of pending) this.revoke(entry)
        this.changed()
        return await this.getState()
      } catch (error) {
        this.revocationStorageFailure()
        throw error
      }
    })().finally(() => { this.retrying = undefined })
    return this.retrying
  }

  override async *watch(signal: AbortSignal, includeIdentityChanges = false): AsyncIterable<AccountView> {
    let dirty = true
    let wake: (() => void) | undefined
    const wakeUp = (): void => { dirty = true; wake?.() }
    const changed = (identityOnly: boolean): void => { if (!identityOnly || includeIdentityChanges) wakeUp() }
    this.listeners.add(changed)
    signal.addEventListener('abort', wakeUp, { once: true })
    try {
      while (!this.closed && !signal.aborted) {
        if (dirty) { dirty = false; yield await this.getState(); continue }
        await new Promise<void>((resolve) => { wake = resolve })
      }
    } finally {
      this.listeners.delete(changed)
      signal.removeEventListener('abort', wakeUp)
    }
  }

  private async resumeRevocations(): Promise<void> {
    if (this.closed) return
    for (const entry of await this.readLogoutJournal()) if (entry.status === 'pending') this.revoke(entry)
  }

  private async readLogoutJournal(): Promise<LogoutEntry[]> {
    const entries = await this.logoutJournal.read()
    this.accessBlocked = false
    return entries
  }

  private blockAccess(): void {
    if (this.closed || this.accessBlocked) return
    this.accessBlocked = true
    this.invalidateDetails()
    this.ctx.emit('deepseek-account/access-blocked')
  }

  private async removeRecordedGrant(entry: LogoutEntry): Promise<void> {
    const deletion = { removed: false }
    try {
      await this.ctx.credentials.deleteRecord(this.accountKey, (current) => {
        if (current.kind !== 'grant') throw new PlatformAuthError('storage')
        const parsed = grant.safeParse(current.payload)
        if (!parsed.success) throw new PlatformAuthError('storage')
        deletion.removed = parsed.data.issuer === this.origin && profileBinding(parsed.data) === entry.binding
        return deletion.removed
      })
    } catch {
      this.revocationStorageFailure()
      await this.blockUnconfirmedLocalRemoval(entry)
      throw new PlatformAuthError('storage')
    }
    if (!deletion.removed) return
    let current: CredentialRecord | undefined
    try { current = await this.ctx.credentials.readRecord(this.accountKey) }
    catch (_unreadable) { this.revocationStorageFailure(); this.blockAccess(); throw new PlatformAuthError('storage') }
    const replacement = current?.kind === 'grant' ? grant.safeParse(current.payload) : undefined
    if (replacement?.success && replacement.data.issuer === this.origin && profileBinding(replacement.data) !== entry.binding) return
    if (this.lastProfile?.binding === entry.binding) this.lastProfile = undefined
    this.ctx.emit('deepseek-account/signed-out')
    this.changed()
  }

  private async blockUnconfirmedLocalRemoval(entry: LogoutEntry): Promise<void> {
    let current: CredentialRecord | undefined
    try { current = await this.ctx.credentials.readRecord(this.accountKey) }
    catch (_unreadable) { this.blockAccess(); return }
    const parsed = current?.kind === 'grant' ? grant.safeParse(current.payload) : undefined
    if (parsed?.success && parsed.data.issuer === this.origin && profileBinding(parsed.data) !== entry.binding) return
    this.blockAccess()
  }

  private revocationStorageFailure(): void {
    if (this.closed) return
    this.revocationStorageFailed = true
    console.error('[deepseek-account] remote logout unconfirmed', { errorCode: 'storage' })
    this.changed()
  }

  private revoke(entry: LogoutEntry): void {
    if (this.closed || this.revocations.has(entry.id)) return
    const revocation = (async () => {
      const outcome = await revokeAccount(this.origin, entry.token, this.logoutPolicy,
        this.logoutLifetime.signal, { ...this.requestHeaders, ...platformClientHeaders(this.platform, entry.client) })
      if (outcome === 'cancelled') return
      if (outcome === 'confirmed') {
        await this.removeRecordedGrant(entry)
        await this.logoutJournal.remove(entry.id)
        if ((await this.readLogoutJournal()).length === 0) this.revocationStorageFailed = false
      } else await this.logoutJournal.fail(entry.id)
    })().catch(() => { this.revocationStorageFailure() }).finally(() => {
      this.revocations.delete(entry.id)
      this.changed()
    })
    this.revocations.set(entry.id, revocation)
  }

  private invalidateDetails(clearProfile = true): void {
    if (clearProfile) this.lastProfile = undefined
    this.detailsLifetime.abort()
    this.detailsLifetime = new AbortController()
  }

  private changed(identityOnly = false): void { for (const listener of this.listeners) listener(identityOnly) }

  private update(attempt: Attempt, value: Partial<SignInAttemptView>): void {
    const { authorizeUrl: _url, ...rest } = attempt.view
    attempt.view = { ...rest, ...value }
    this.changed()
  }

  private async run(session: AuthorizationSession, attempt: Attempt): Promise<void> {
    const webServer = this.ctx.get('webServer')
    if (webServer === undefined) throw new PlatformAuthError('protocol')
    const verifier = randomBytes(32).toString('base64url')
    const state = randomBytes(32).toString('base64url')
    const challenge = createHash('sha256').update(verifier).digest('base64url')
    let authorizeId: string | undefined
    const code = Promise.withResolvers<string>()
    // Callback requests may precede initialization settlement; the rejection is observed immediately.
    void code.promise.catch(() => undefined)
    const deadline = new AbortController()
    let expiresAt = Date.now() + this.attemptTimeout
    const signal = AbortSignal.any([session.signal, deadline.signal])
    let timer = setTimeout(() =>{  deadline.abort() }, this.attemptTimeout)
    const abort = (): void => { code.reject(new PlatformAuthError('expired')) }
    signal.addEventListener('abort', abort, { once: true })
    try {
      attempt.disposeCallback = this.ctx.effect(() => webServer.register({
        kind: 'exact', path: '/oauth/callback', handler: (req, res) => {
          let url: URL
          try { url = new URL(req.url ?? '/', 'http://127.0.0.1') }
          catch { res.writeHead(400, { 'cache-control': 'no-store' }).end(); return }
          const receivedCode = url.searchParams.get('code')
          const receivedState = url.searchParams.get('state') ?? ''
          const validState = Buffer.byteLength(receivedState) === Buffer.byteLength(state)
            && timingSafeEqual(Buffer.from(receivedState), Buffer.from(state))
          if (req.method !== 'GET' || url.pathname !== '/oauth/callback' || !validState || !receivedCode
            || url.searchParams.getAll('state').length !== 1 || url.searchParams.getAll('code').length !== 1) {
            res.writeHead(400, { 'cache-control': 'no-store' }).end(); return
          }
          if (signal.aborted || attempt.callback !== undefined || attempt.view.phase !== 'waiting-browser') {
            res.writeHead(410, { 'cache-control': 'no-store' }).end(); return
          }
          attempt.callback = res
          code.resolve(receivedCode)
        },
      }), 'account: browser callback')
      signal.throwIfAborted()
      const redirectUri = `${attempt.origin}/oauth/callback`
      const init = initialization.safeParse(await this.request('auth_init', {
        code_challenge: challenge, code_challenge_method: 'S256', state, redirect_uri: redirectUri, locale: attempt.locale,
        login_source: attempt.loginSource,
      }, signal, attempt.clientHeaders), { reportInput: true })
      if (!init.success) this.rejectPayload('auth_init', init.error)
      const authorizeUrl = browserUrl(init.data.authorize_url, this.origin, this.product === 'uma' ? '/uma/authorize' : '/dsh/authorize', this.rewriteBrowserOrigin)
      authorizeId = init.data.authorize_id
      signal.throwIfAborted()
      const now = Date.now()
      expiresAt = Math.min(expiresAt, now + init.data.expires_in * 1000)
      const remaining = expiresAt - now
      if (remaining <= 0) { deadline.abort(); signal.throwIfAborted() }
      clearTimeout(timer)
      timer = setTimeout(() =>{  deadline.abort() }, remaining)
      this.update(attempt, { phase: 'waiting-browser', authorizeUrl, expiresAt })
      const receivedCode = await code.promise
      signal.throwIfAborted()
      this.update(attempt, { phase: 'exchanging' })
      const deviceRecord = await this.ctx.credentials.modifyRecord(this.deviceKey, current => Promise.resolve(current === undefined
        ? { kind: 'grant', payload: { id: randomUUID() } } : undefined))
      if (deviceRecord?.kind !== 'grant') throw new PlatformAuthError('storage')
      const identity = device.parse(deviceRecord.payload)
      const result = exchange.safeParse(await this.request('auth_exchange', {
        code: receivedCode, code_verifier: verifier, redirect_uri: redirectUri,
        device_id: identity.id, device_model: `${platform()}-${arch()}`, os_version: deviceOsVersion(),
      }, signal, { ...attempt.clientHeaders, ...this.product === 'uma' ? { 'x-uma-token-mode': 'rotate-v1' } : {} }), { reportInput: true })
      if (!result.success) this.rejectPayload('auth_exchange', result.error)
      const completionUrl = new URL(browserUrl(result.data.authorized_url, this.origin, this.product === 'uma' ? '/uma/authorized' : '/dsh/authorized', this.rewriteBrowserOrigin))
      completionUrl.searchParams.set('login_source', attempt.loginSource)
      attempt.completionUrl = completionUrl.href
      if (Date.now() >= expiresAt) deadline.abort()
      signal.throwIfAborted()
      if (result.data.user != null) {
        try { attempt.initialProfile = { token: result.data.token, value: { status: 'ready', value: profile(result.data.user) } } }
        catch {
          // Invalid optional user data falls back to current without discarding a valid authorization.
        }
      }
      this.update(attempt, { phase: 'committing' })
      clearTimeout(timer)
      await this.readLogoutJournal()
      const payload = this.product === 'uma' && result.data.refresh_token !== undefined && result.data.expires_in !== undefined
        ? renewableGrant(this.origin, result.data.token, result.data.refresh_token, result.data.expires_in)
        : { version: 1, token: result.data.token, issuer: this.origin }
      try { await session.commit({ kind: 'grant', payload }) }
      catch { throw new PlatformAuthError('storage') }
    } catch (error) {
      if (deadline.signal.aborted) throw new PlatformAuthError('expired')
      throw error
    } finally {
      if (signal.aborted && authorizeId !== undefined) this.cancelRequest(authorizeId, verifier, attempt.clientHeaders)
      clearTimeout(timer)
      signal.removeEventListener('abort', abort)
      // begin() settles the browser response and removes only this attempt’s route.
    }
  }

  private rejectPayload(stage: string, error: z.ZodError): never {
    console.error('[deepseek-account] payload rejected', {
      stage, issues: error.issues.map(issue => ({
        path: issue.path, code: issue.code,
        receivedType: issue.input === null ? 'null' : Array.isArray(issue.input) ? 'array' : typeof issue.input,
      })),
    })
    throw new PlatformAuthError('protocol')
  }

  private cancelRequest(authorizeId: string, verifier: string, headers: Record<string, string>): void {
    if (this.closed) return
    const cancellation = this.request('auth_cancel', { authorize_id: authorizeId, code_verifier: verifier },
      this.logoutLifetime.signal, headers).then(() => undefined, () => {
      // Remote cancellation failures never reverse local cancellation or expose verifier diagnostics.
    }).finally(() => { this.cancellations.delete(cancellation) })
    this.cancellations.add(cancellation)
  }

  private request(method: string, body: unknown, signal: AbortSignal, headers: Record<string, string>): Promise<unknown> {
    return requestPlatform(this.origin, method, body,
      AbortSignal.any([signal, AbortSignal.timeout(this.requestTimeout)]), { ...this.requestHeaders, ...headers }, this.product === 'uma' ? 'uma' : 'dsh')
  }

  private finishFailedCallback(attempt: Attempt): void {
    if (attempt.loginSource === 'web') {
      const nonce = randomBytes(16).toString('base64url')
      const message = attempt.locale === 'zh_CN' ? '登录失败，请关闭此标签页并在原页面重试。'
        : 'Sign-in failed. Close this tab and try again in the original tab.'
      attempt.callback?.writeHead(200, {
        'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store',
        'content-security-policy': `default-src 'none'; script-src 'nonce-${nonce}'; frame-ancestors 'none'`,
        'referrer-policy': 'no-referrer',
      }).end(`<!doctype html><html lang="${attempt.locale === 'zh_CN' ? 'zh-CN' : 'en'}"><meta charset="utf-8"><title>${message}</title>`
        + `<body><p>${message}</p><script nonce="${nonce}">window.close()</script></body></html>`)
    } else {
      // Native account subscribers focus the login window; retain the browser’s Platform document.
      attempt.callback?.writeHead(204, { 'cache-control': 'no-store' }).end()
    }
  }
}
export default PlatformAccount

/** OS identification shared by login and credential-free identity reads. */
function deviceOsVersion(): string {
  return `${platform()} ${release()}`
}
