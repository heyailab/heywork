/** Platform PKCE account provider; browser approval never bypasses local cancellation. */
import { randomBytes, randomUUID, createHash, timingSafeEqual } from 'node:crypto';
import { arch, platform, release } from 'node:os';
import { promises as streamPromises } from 'node:stream';
import { Service } from '@deepseek-ai/cordis';
import Schema from '@deepseek-ai/schemastery';
import { z } from 'zod';
import { DeepSeekAccount, UMA_PLATFORM_PATHS, installAccountTaskCancellation, mergePlatformCookies, platformClientHeaders, platformWireLocale } from '@deepseek-ai/dsh-deepseek-account';
import { credentialKey } from '@deepseek-ai/dsh-credentials';
import { profile, readAccountDetail, readUnnotifiedBonuses, sendBonusNotified, readLedger } from "./details.js";
import { revokeAccount } from "./logout.js";
import { LogoutJournal } from "./logout-journal.js";
import { AccountUnauthorizedError, PlatformAuthError, platformHeaders, platformOrigin, browserUrl, requestPlatform, refreshAccount, initialization, exchange, loginOrigin } from "./protocol.js";
const renewal = z.object({
    id: z.uuid(), token: z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/),
    attempt: z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/),
    refreshAfter: z.number().int().positive(), expiresAt: z.number().int().positive(),
}).refine(value => value.refreshAfter <= value.expiresAt);
const grant = z.object({ version: z.literal(1), token: z.string().min(1), issuer: z.url(), renewal: renewal.optional() });
const device = z.object({ id: z.uuid() });
function renewableGrant(issuer, access, refresh, expiresIn, id = randomUUID()) {
    const expiresAt = Date.now() + expiresIn * 1000;
    return { version: 1, token: access, issuer, renewal: {
            id, token: refresh, attempt: randomBytes(24).toString('base64url'),
            expiresAt, refreshAfter: expiresAt - (expiresIn > 60 ? 60_000 : 0),
        } };
}
function profileBinding(stored) {
    return stored.renewal?.id ?? stored.token;
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
});
/** The platform implementation owns login state and its opaque stored grant. */
export class PlatformAccount extends DeepSeekAccount {
    static inject = ['credentials', 'authorization'];
    static Config = platformConfig;
    accountKey;
    deviceKey;
    logoutKey;
    logoutJournal;
    origin;
    product;
    embeddedPageDist;
    inferenceOrigin;
    rewriteBrowserOrigin;
    platform;
    requestHeaders;
    accountRequestHeaders;
    requestTimeout;
    balanceTimeout;
    attemptTimeout;
    logoutPolicy;
    logoutLifetime = new AbortController();
    revocations = new Map();
    cancellations = new Set();
    revocationStorageFailed = false;
    accessBlocked = false;
    attempt;
    listeners = new Set();
    /**
     * Latest ready profile read and the grant token it was read with. Binding the token keeps a
     * cached identity from answering for a credential that has since changed.
     */
    lastProfile;
    detailsLifetime = new AbortController();
    refreshTimer;
    refreshing;
    closed = false;
    removing;
    retrying;
    /** @param ctx - Host with authorization and credentials services. @param config - deployment options. */
    constructor(ctx, config = {}) {
        const resolved = platformConfig(config);
        super(ctx, resolved.modelProviders);
        installAccountTaskCancellation(ctx, this.modelProviders);
        this.product = config.product;
        const prefix = config.credentialIdPrefix;
        this.accountKey = credentialKey('deepseek-account-platform', prefix === undefined ? 'default' : `${prefix}-account`);
        this.deviceKey = credentialKey('deepseek-account-platform', prefix === undefined ? 'device' : `${prefix}-device`);
        this.logoutKey = credentialKey('deepseek-account-platform', prefix === undefined ? 'default-logout' : `${prefix}-logout`);
        const label = prefix === undefined ? 'DeepSeek' : 'UMA Studio';
        this.embeddedPageDist = resolved.embeddedPageDist;
        this.origin = platformOrigin(resolved.platformOrigin, resolved.allowLoopbackHttp);
        this.logoutJournal = new LogoutJournal(ctx.credentials, this.logoutKey, this.origin, () => { this.blockAccess(); });
        const inference = new URL(resolved.inferenceOrigin);
        if (!['http:', 'https:'].includes(inference.protocol) || inference.username || inference.password
            || inference.pathname !== '/' || inference.search || inference.hash) {
            throw new Error('account: inferenceOrigin must be an HTTP(S) origin without credentials, path, query or fragment');
        }
        this.inferenceOrigin = inference.origin;
        this.rewriteBrowserOrigin = resolved.rewriteBrowserOrigin;
        this.platform = resolved.desktopPlatform;
        this.requestHeaders = platformHeaders(resolved.requestHeaders);
        const accountHeaders = platformHeaders(resolved.accountRequestHeaders);
        this.accountRequestHeaders = { ...this.requestHeaders, ...accountHeaders };
        if (accountHeaders.cookie !== undefined) {
            this.accountRequestHeaders.cookie = mergePlatformCookies(this.requestHeaders.cookie ?? '', accountHeaders.cookie);
        }
        this.requestTimeout = resolved.requestTimeoutMs;
        this.balanceTimeout = resolved.balanceTimeoutMs;
        this.attemptTimeout = resolved.attemptTimeoutMs;
        this.logoutPolicy = {
            maxRetries: resolved.logoutMaxRetries, delayMs: resolved.logoutRetryDelayMs, requestTimeoutMs: this.requestTimeout,
        };
        ctx.authorization.registerFlow({
            key: this.accountKey, label, methods: [{ id: 'browser', label }],
            run: (session) => {
                const attempt = this.attempt;
                if (attempt === undefined)
                    return Promise.reject(new PlatformAuthError('protocol'));
                attempt.running = this.run(session, attempt);
                return attempt.running;
            },
        });
        ctx.on('credentials/record-updated', (key) => {
            if (key === this.logoutKey) {
                this.changed();
                void this.resumeRevocations().catch(() => { this.revocationStorageFailure(); });
                return;
            }
            if (key !== this.accountKey)
                return;
            clearTimeout(this.refreshTimer);
            this.invalidateDetails(false);
            this.changed();
        });
        ctx.effect(() => async () => {
            this.closed = true;
            clearTimeout(this.refreshTimer);
            this.logoutLifetime.abort();
            this.invalidateDetails();
            const active = this.attempt;
            if (active !== undefined) {
                if (active.view.phase !== 'committing')
                    active.controller.abort();
                await active.done;
            }
            await Promise.allSettled([this.removing, this.retrying, this.refreshing?.result,
                ...this.revocations.values(), ...this.cancellations]);
            this.changed();
        }, 'account: active attempt lifetime');
    }
    async [Service.init]() {
        let pending;
        try {
            pending = await this.readLogoutJournal();
        }
        catch {
            this.revocationStorageFailure();
            return;
        }
        const record = await this.ctx.credentials.readRecord(this.accountKey);
        if (record !== undefined) {
            if (record.kind !== 'grant')
                throw new PlatformAuthError('storage');
            const parsed = grant.safeParse(record.payload);
            if (!parsed.success)
                throw new PlatformAuthError('storage');
            if (parsed.data.issuer !== this.origin) {
                await this.ctx.credentials.deleteRecord(this.accountKey, current => current.kind === 'grant'
                    && grant.safeParse(current.payload).data?.issuer === parsed.data.issuer);
            }
        }
        for (const entry of pending) {
            try {
                await this.removeRecordedGrant(entry);
                if (entry.status === 'prepared')
                    await this.logoutJournal.ready(entry.id);
                this.revoke(entry);
            }
            catch {
                this.revocationStorageFailure();
            }
        }
    }
    async getState() {
        let pending;
        try {
            pending = await this.readLogoutJournal();
        }
        catch {
            pending = null;
        }
        const record = pending === null ? undefined : await this.ctx.credentials.readRecord(this.accountKey);
        if (record !== undefined && (record.kind !== 'grant' || !grant.safeParse(record.payload).success)) {
            throw new PlatformAuthError('storage');
        }
        const stored = record?.kind === 'grant' ? grant.parse(record.payload) : undefined;
        const locallyRemoved = stored === undefined || pending?.some(entry => entry.binding === profileBinding(stored)) === true;
        const failed = this.revocationStorageFailed || pending?.every(entry => entry.status === 'failed' && !this.revocations.has(entry.id)) === true;
        const attempt = this.attempt?.view ?? null;
        return {
            status: locallyRemoved ? 'signed-out' : 'credential-stored',
            ...(this.product === undefined ? {} : { product: this.product }),
            // Credential removal can notify watchers before sign-out finishes clearing the attempt.
            attempt: locallyRemoved && attempt?.phase === 'succeeded' ? null : attempt,
            ...pending === null ? { remoteSignOut: { status: 'failed', count: null, errorCode: 'storage' } }
                : pending.length === 0 ? {} : { remoteSignOut: {
                        status: failed ? 'failed' : 'pending', count: pending.length,
                        ...failed ? { errorCode: this.revocationStorageFailed ? 'storage' : 'network' } : {},
                    } },
            links: {
                usageUrl: new URL(this.product === 'uma' ? UMA_PLATFORM_PATHS.usage : '/usage', this.origin).href,
                topUpUrl: new URL(UMA_PLATFORM_PATHS['top-up'], this.origin).href,
                ...(this.product === 'uma' ? {
                    securityUrl: new URL(UMA_PLATFORM_PATHS.security, this.origin).href,
                    sdkKeysUrl: new URL(UMA_PLATFORM_PATHS['sdk-keys'], this.origin).href,
                } : {}),
            },
        };
    }
    async getProfile(client) {
        const active = await this.activeGrant();
        if (active === null)
            return null;
        const { lifetime, stored } = active;
        const result = await this.getDetail('profile', this.detailHeaders(client), { lifetime, stored });
        if (this.detailsLifetime !== lifetime)
            return null;
        if (result !== null)
            this.cacheProfile(profileBinding(stored), result);
        if (result?.status !== 'failed')
            return result;
        // Only this same grant's last ready read may stand in for a failed refresh.
        const cached = this.lastProfile?.binding === profileBinding(stored) ? this.lastProfile.profile : undefined;
        return cached ?? result;
    }
    getBalance(client) {
        return this.getDetail('balance', this.detailHeaders(client));
    }
    async getLedger(client, before) {
        const headers = this.detailHeaders(client);
        const active = await this.activeGrant();
        if (active === null)
            return null;
        const { lifetime, stored } = active;
        try {
            const page = await readLedger(this.origin, stored.token, before, AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers);
            return this.detailsLifetime === lifetime ? page : null;
        }
        catch (error) {
            if (this.detailsLifetime !== lifetime)
                return null;
            if (error instanceof AccountUnauthorizedError) {
                await this.expireCredential(stored.token, lifetime);
                return null;
            }
            throw error;
        }
    }
    async getUnnotifiedBonuses(client) {
        const headers = this.detailHeaders(client);
        const active = await this.activeGrant();
        if (active === null)
            return null;
        const { lifetime, stored } = active;
        const accountId = await this.currentAccountId(lifetime, stored, headers);
        if (accountId === null)
            return null;
        try {
            const bonuses = await readUnnotifiedBonuses(this.origin, stored.token, AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers);
            return { accountId, bonuses };
        }
        catch (error) {
            if (error instanceof AccountUnauthorizedError) {
                if (this.detailsLifetime === lifetime)
                    await this.expireCredential(stored.token, lifetime);
                return null;
            }
            throw error;
        }
    }
    async ackBonusNotified(accountId, orderId, client) {
        const headers = this.detailHeaders(client);
        const active = await this.activeGrant();
        if (active === null)
            return false;
        const { lifetime, stored } = active;
        const current = await this.currentAccountId(lifetime, stored, headers);
        if (current === null || current !== accountId)
            return false;
        try {
            await sendBonusNotified(this.origin, stored.token, orderId, AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers);
            return true;
        }
        catch (error) {
            if (error instanceof AccountUnauthorizedError) {
                if (this.detailsLifetime === lifetime)
                    await this.expireCredential(stored.token, lifetime);
                return false;
            }
            throw error;
        }
    }
    /**
     * Resolve the profile identity bound to one captured grant, within that grant's credential lifetime.
     * @param lifetime - credential lifetime the grant was captured under; a change discards the result.
     * @param stored - captured grant; the identity query never re-reads a newer credential.
     * @param headers - client identity headers of the calling operation.
     * @returns the account identity, or null while signed out or after the credential changed.
     */
    async currentAccountId(lifetime, stored, headers) {
        // A profile already read for this same captured grant names the account, so a bonus read or
        // acknowledgement reuses it instead of issuing another current query.
        const binding = profileBinding(stored);
        if (this.lastProfile?.binding === binding)
            return this.identityOf(this.lastProfile.profile);
        const details = await this.getDetail('profile', headers, { lifetime, stored });
        if (details === null)
            return null;
        if (details.status === 'failed') {
            // The query named no identity, and the cache is empty or belongs to another grant.
            throw new PlatformAuthError('network');
        }
        this.cacheProfile(binding, details);
        return this.identityOf(details);
    }
    /**
     * Cache one ready profile against the grant token it was read with, so identity reuse cannot cross
     * a credential change. A stable ID that first appears or changes notifies identity-enabled watch consumers, so
     * identity consumers re-read getPlatformSession; repeated IDs stay silent.
     * @param binding - login identity the profile was read with.
     * @param profile - profile outcome to record when it carries account data.
     */
    cacheProfile(binding, profile) {
        if (profile.status !== 'ready')
            return;
        // Identity publishers re-read the session snapshot; wake them only when the stable ID changes.
        const previous = this.lastProfile?.profile.value.id || null;
        this.lastProfile = { binding, profile };
        if (previous !== (profile.value.id || null))
            this.changed(true);
    }
    /**
     * @param profile - ready profile projected for the UI.
     * @returns the account identity it names.
     * @throws PlatformAuthError when the profile carries no stable Platform id, which cannot isolate notices.
     */
    identityOf(profile) {
        if (profile.value.id === null)
            throw new PlatformAuthError('protocol');
        return profile.value.id;
    }
    async getDetail(field, headers, captured) {
        const active = captured ?? await this.activeGrant();
        if (active === null || active.lifetime.signal.aborted)
            return null;
        const { lifetime, stored } = active;
        if (field === 'profile' && this.attempt?.initialProfile?.token === stored.token) {
            const initial = this.attempt.initialProfile.value;
            delete this.attempt.initialProfile;
            return initial;
        }
        try {
            const details = await readAccountDetail(field, this.origin, stored.token, AbortSignal.any([lifetime.signal, AbortSignal.timeout(field === 'balance' ? this.balanceTimeout : this.requestTimeout)]), headers);
            return this.detailsLifetime !== lifetime ? null : details;
        }
        catch (_unauthorized) {
            // readAccountDetail exposes only authenticated credential rejection failures.
            if (this.detailsLifetime === lifetime)
                await this.expireCredential(stored.token, lifetime);
            return null;
        }
    }
    /** Deployment account headers plus the client identity headers derived from one call's metadata. */
    detailHeaders(client) {
        return { ...this.accountRequestHeaders, ...platformClientHeaders(this.platform, client) };
    }
    async rejectToken(token) {
        const lifetime = this.detailsLifetime;
        const stored = await this.readCurrentGrant(lifetime);
        if (stored?.token !== token || this.detailsLifetime !== lifetime)
            return;
        await this.expireCredential(token, lifetime);
    }
    async expireCredential(token, lifetime) {
        this.removing ??= (async () => {
            if (this.attempt !== undefined)
                await this.cancelSignIn(this.attempt.view.id);
            const record = await this.ctx.credentials.readRecord(this.accountKey);
            if (this.closed || this.detailsLifetime !== lifetime || record?.kind !== 'grant')
                return this.getState();
            const current = grant.parse(record.payload);
            if (current.token !== token || current.issuer !== this.origin)
                return this.getState();
            const deletion = { removed: false };
            await this.ctx.credentials.deleteRecord(this.accountKey, (record) => {
                const latest = record.kind === 'grant' ? grant.safeParse(record.payload) : undefined;
                deletion.removed = latest?.success === true && latest.data.token === token && latest.data.issuer === this.origin;
                return deletion.removed;
            });
            if (!deletion.removed)
                return this.getState();
            this.lastProfile = undefined;
            this.ctx.emit('deepseek-account/session-expired');
            this.attempt = undefined;
            this.ctx.emit('deepseek-account/signed-out');
            this.changed();
            return this.getState();
        })().finally(() => { this.removing = undefined; });
        await this.removing;
    }
    async getDeviceIdentity() {
        const [record, session] = await Promise.all([
            this.ctx.credentials.readRecord(this.deviceKey),
            this.getPlatformSession(),
        ]);
        const parsed = record?.kind === 'grant' ? device.safeParse(record.payload) : undefined;
        return {
            ...parsed?.success ? { deviceId: parsed.data.id } : {},
            ...session?.userId == null ? {} : { userId: session.userId },
            osVersion: deviceOsVersion(),
        };
    }
    async getPlatformSession() {
        const lifetime = this.detailsLifetime;
        let stored = await this.readCurrentGrant(lifetime);
        if (stored === null || lifetime.signal.aborted || this.isUnavailable())
            return null;
        const state = stored.renewal;
        if (this.product === 'uma' && state !== undefined && state.expiresAt <= Date.now()) {
            const expired = stored;
            try {
                stored = await this.refreshGrant(expired, state);
            }
            catch {
                if (this.detailsLifetime === lifetime)
                    this.scheduleRefresh(expired, 15_000);
                return null;
            }
            if (stored === null || this.isUnavailable())
                return null;
        }
        this.scheduleRefresh(stored);
        // Deployment headers only; the consuming client adds the identity of its own UI.
        const requestHeaders = { ...this.accountRequestHeaders };
        // Identity comes from the profile read for this same grant; an unknown ID requires disposable
        // browser storage. A replaced credential never publishes the account its predecessor named.
        return { origin: this.origin, token: stored.token,
            userId: this.lastProfile?.binding === profileBinding(stored) ? this.lastProfile.profile.value.id || null : null,
            ...(stored.renewal === undefined ? {} : { sessionId: stored.renewal.id }),
            ...(this.embeddedPageDist ? { embeddedPageDist: this.embeddedPageDist } : {}),
            ...(this.product === 'uma' ? { authenticatePage: true } : {}),
            requestHeaders };
    }
    async readCurrentGrant(lifetime) {
        if (this.closed)
            return null;
        const record = await this.ctx.credentials.readRecord(this.accountKey);
        if (record === undefined || lifetime.signal.aborted)
            return null;
        if (record.kind !== 'grant')
            throw new PlatformAuthError('storage');
        const parsed = grant.safeParse(record.payload);
        if (!parsed.success)
            throw new PlatformAuthError('storage');
        // A private origin override must never forward a grant issued by another environment.
        if (parsed.data.issuer !== this.origin)
            throw new PlatformAuthError('protocol');
        if ((await this.readLogoutJournal()).some(entry => entry.binding === profileBinding(parsed.data)))
            return null;
        return parsed.data;
    }
    async activeGrant() {
        const lifetime = this.detailsLifetime;
        const stored = await this.readCurrentGrant(lifetime);
        if (stored === null || this.isUnavailable())
            return null;
        if (this.product !== 'uma' || stored.renewal === undefined || stored.renewal.refreshAfter > Date.now()) {
            return { lifetime, stored };
        }
        const fresh = await this.refreshGrant(stored, stored.renewal);
        if (fresh === null || this.isUnavailable())
            return null;
        return { lifetime: this.detailsLifetime, stored: fresh };
    }
    refreshGrant(stored, state) {
        const pending = this.refreshing;
        if (pending !== undefined) {
            if (pending.id === state.id)
                return pending.result;
            return pending.result.catch(() => null).then(() => this.isUnavailable() ? null : this.refreshGrant(stored, state));
        }
        const controller = new AbortController();
        const result = this.rotateGrant(stored, state, controller.signal).finally(() => {
            if (this.refreshing?.result === result)
                this.refreshing = undefined;
        });
        this.refreshing = { id: state.id, controller, result };
        return result;
    }
    async rotateGrant(stored, state, cancellation) {
        let rejectedToken;
        const record = await this.ctx.credentials.modifyRecord(this.accountKey, async (current) => {
            if (this.isUnavailable() || current?.kind !== 'grant')
                return undefined;
            const latest = grant.safeParse(current.payload);
            if (!latest.success)
                throw new PlatformAuthError('storage');
            const active = latest.data.renewal;
            if (latest.data.issuer !== this.origin || active?.id !== state.id || active.attempt !== state.attempt
                || active.refreshAfter > Date.now())
                return undefined;
            const signal = AbortSignal.any([cancellation, this.logoutLifetime.signal, AbortSignal.timeout(Math.min(10_000, this.requestTimeout))]);
            try {
                const next = await refreshAccount(this.origin, active.token, active.attempt, signal, this.requestHeaders);
                return { kind: 'grant', payload: renewableGrant(this.origin, next.access_token, next.refresh_token, next.expires_in, active.id) };
            }
            catch (error) {
                if (!(error instanceof AccountUnauthorizedError))
                    throw error;
                rejectedToken = latest.data.token;
                return undefined;
            }
        });
        if (rejectedToken !== undefined) {
            if (this.removing === undefined)
                await this.expireCredential(rejectedToken, this.detailsLifetime);
            return null;
        }
        if (record?.kind !== 'grant')
            return null;
        const latest = grant.safeParse(record.payload);
        if (!latest.success)
            throw new PlatformAuthError('storage');
        return latest.data.issuer === stored.issuer && latest.data.renewal?.id === state.id ? latest.data : null;
    }
    scheduleRefresh(stored, retryDelay = 0) {
        const state = stored.renewal;
        if (this.product !== 'uma' || state === undefined || this.isUnavailable())
            return;
        clearTimeout(this.refreshTimer);
        const lifetime = this.detailsLifetime;
        this.refreshTimer = setTimeout(() => {
            void this.refreshGrant(stored, state).catch(() => {
                if (!lifetime.signal.aborted)
                    this.scheduleRefresh(stored, 15_000);
            });
        }, Math.max(retryDelay, state.refreshAfter - Date.now()));
        this.refreshTimer.unref();
    }
    async resolveToken(url) {
        if (this.isUnavailable())
            return undefined;
        const destination = new URL(url);
        if (destination.origin !== this.inferenceOrigin || destination.username || destination.password)
            return undefined;
        const record = await this.ctx.credentials.readRecord(this.accountKey);
        if (record === undefined)
            return undefined;
        if (record.kind !== 'grant')
            throw new PlatformAuthError('storage');
        const parsed = grant.safeParse(record.payload);
        if (!parsed.success)
            throw new PlatformAuthError('storage');
        const stored = parsed.data;
        if ((await this.readLogoutJournal()).some(entry => entry.binding === profileBinding(stored)))
            return undefined;
        // Development grants cannot authenticate production model or file requests.
        const issuer = new URL(stored.issuer);
        if (stored.token.startsWith('dsh_mock_'))
            return undefined;
        if (this.inferenceOrigin === 'https://api.deepseek.com') {
            if (['localhost', '127.0.0.1', '[::1]'].includes(issuer.hostname))
                return undefined;
        }
        else if (issuer.origin !== this.origin)
            return undefined;
        if (this.product === 'uma' && stored.renewal !== undefined && stored.renewal.refreshAfter <= Date.now()) {
            const fresh = await this.refreshGrant(stored, stored.renewal);
            return this.isUnavailable() ? undefined : fresh?.token;
        }
        return this.isUnavailable() ? undefined : stored.token;
    }
    isUnavailable() {
        return this.closed || this.removing !== undefined;
    }
    async startSignIn(client, callbackOrigin, loginSource) {
        if (this.removing !== undefined)
            await this.removing;
        await this.readLogoutJournal();
        const origin = loginOrigin(callbackOrigin);
        if (this.closed)
            throw new PlatformAuthError('protocol');
        if (this.attempt !== undefined && ['initializing', 'waiting-browser', 'exchanging', 'committing'].includes(this.attempt.view.phase)) {
            return this.getState();
        }
        const previous = this.attempt;
        if (previous !== undefined) {
            await previous.done;
            // Disposal can close the provider while the previous attempt settles.
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (this.closed)
                throw new PlatformAuthError('protocol');
            if (this.attempt !== previous)
                return this.getState();
        }
        const attempt = {
            origin, loginSource,
            locale: platformWireLocale(client.locale),
            clientHeaders: platformClientHeaders(this.platform, client),
            view: { id: randomUUID(), phase: 'initializing' },
            controller: new AbortController(), done: Promise.resolve(), running: Promise.resolve(),
        };
        this.attempt = attempt;
        attempt.done = this.ctx.authorization.begin({
            key: this.accountKey, signal: attempt.controller.signal,
            interaction: { notify: () => undefined, prompt: () => Promise.reject(new PlatformAuthError('protocol')) },
        }).then((outcome) => {
            this.update(attempt, { phase: outcome.status === 'authorized' ? 'succeeded' : 'cancelled' });
            if (outcome.status === 'authorized' && attempt.completionUrl !== undefined) {
                attempt.callback?.writeHead(302, { location: attempt.completionUrl, 'cache-control': 'no-store' }).end();
            }
            else
                attempt.callback?.writeHead(204, { 'cache-control': 'no-store' }).end();
        }).catch((error) => {
            const code = error instanceof PlatformAuthError ? error.code : 'protocol';
            console.error('[deepseek-account] sign-in failed', { errorCode: code });
            this.update(attempt, { phase: code === 'expired' ? 'expired' : 'failed', errorCode: code });
            this.finishFailedCallback(attempt);
        }).then(async () => {
            // begin() may report cancellation before the HTTP work observes its signal.
            await attempt.running.catch(() => undefined);
            if (attempt.callback !== undefined) {
                await streamPromises.finished(attempt.callback, { cleanup: true }).catch(() => undefined);
            }
            await attempt.disposeCallback?.();
        });
        this.changed();
        return this.getState();
    }
    async cancelSignIn(id) {
        const attempt = this.attempt;
        if (attempt?.view.id === id) {
            if (attempt.view.phase !== 'committing') {
                attempt.controller.abort();
                this.ctx.authorization.cancel(this.accountKey);
            }
            await attempt.done;
        }
        return this.getState();
    }
    signOut(client) {
        this.removing ??= (async () => {
            if (this.closed)
                throw new PlatformAuthError('protocol');
            this.refreshing?.controller.abort();
            if (this.attempt !== undefined) {
                await this.cancelSignIn(this.attempt.view.id);
                this.attempt = undefined;
            }
            const record = await this.ctx.credentials.readRecord(this.accountKey);
            if (record !== undefined) {
                if (record.kind !== 'grant')
                    throw new PlatformAuthError('storage');
                const parsed = grant.safeParse(record.payload);
                if (!parsed.success)
                    throw new PlatformAuthError('storage');
                if (parsed.data.issuer !== this.origin)
                    throw new PlatformAuthError('protocol');
                const entry = { id: randomUUID(), token: parsed.data.renewal?.token ?? parsed.data.token,
                    binding: profileBinding(parsed.data), client, status: 'prepared' };
                await this.logoutJournal.append(entry);
                await this.removeRecordedGrant(entry);
                try {
                    await this.logoutJournal.ready(entry.id);
                }
                catch {
                    this.revocationStorageFailure();
                    throw new PlatformAuthError('storage');
                }
                for (const pending of await this.readLogoutJournal())
                    if (pending.status === 'pending')
                        this.revoke(pending);
            }
            const state = await this.getState();
            this.changed();
            return state;
        })().finally(() => { this.removing = undefined; });
        return this.removing;
    }
    retrySignOut(client) {
        this.retrying ??= (async () => {
            if (this.closed)
                throw new PlatformAuthError('protocol');
            try {
                if (this.revocations.size > 0)
                    return await this.getState();
                for (const entry of await this.readLogoutJournal())
                    await this.removeRecordedGrant(entry);
                const pending = await this.logoutJournal.retry(client);
                this.revocationStorageFailed = false;
                for (const entry of pending)
                    this.revoke(entry);
                this.changed();
                return await this.getState();
            }
            catch (error) {
                this.revocationStorageFailure();
                throw error;
            }
        })().finally(() => { this.retrying = undefined; });
        return this.retrying;
    }
    async *watch(signal, includeIdentityChanges = false) {
        let dirty = true;
        let wake;
        const wakeUp = () => { dirty = true; wake?.(); };
        const changed = (identityOnly) => { if (!identityOnly || includeIdentityChanges)
            wakeUp(); };
        this.listeners.add(changed);
        signal.addEventListener('abort', wakeUp, { once: true });
        try {
            while (!this.closed && !signal.aborted) {
                if (dirty) {
                    dirty = false;
                    yield await this.getState();
                    continue;
                }
                await new Promise((resolve) => { wake = resolve; });
            }
        }
        finally {
            this.listeners.delete(changed);
            signal.removeEventListener('abort', wakeUp);
        }
    }
    async resumeRevocations() {
        if (this.closed)
            return;
        for (const entry of await this.readLogoutJournal())
            if (entry.status === 'pending')
                this.revoke(entry);
    }
    async readLogoutJournal() {
        const entries = await this.logoutJournal.read();
        this.accessBlocked = false;
        return entries;
    }
    blockAccess() {
        if (this.closed || this.accessBlocked)
            return;
        this.accessBlocked = true;
        this.invalidateDetails();
        this.ctx.emit('deepseek-account/access-blocked');
    }
    async removeRecordedGrant(entry) {
        const deletion = { removed: false };
        try {
            await this.ctx.credentials.deleteRecord(this.accountKey, (current) => {
                if (current.kind !== 'grant')
                    throw new PlatformAuthError('storage');
                const parsed = grant.safeParse(current.payload);
                if (!parsed.success)
                    throw new PlatformAuthError('storage');
                deletion.removed = parsed.data.issuer === this.origin && profileBinding(parsed.data) === entry.binding;
                return deletion.removed;
            });
        }
        catch {
            this.revocationStorageFailure();
            await this.blockUnconfirmedLocalRemoval(entry);
            throw new PlatformAuthError('storage');
        }
        if (!deletion.removed)
            return;
        let current;
        try {
            current = await this.ctx.credentials.readRecord(this.accountKey);
        }
        catch (_unreadable) {
            this.revocationStorageFailure();
            this.blockAccess();
            throw new PlatformAuthError('storage');
        }
        const replacement = current?.kind === 'grant' ? grant.safeParse(current.payload) : undefined;
        if (replacement?.success && replacement.data.issuer === this.origin && profileBinding(replacement.data) !== entry.binding)
            return;
        if (this.lastProfile?.binding === entry.binding)
            this.lastProfile = undefined;
        this.ctx.emit('deepseek-account/signed-out');
        this.changed();
    }
    async blockUnconfirmedLocalRemoval(entry) {
        let current;
        try {
            current = await this.ctx.credentials.readRecord(this.accountKey);
        }
        catch (_unreadable) {
            this.blockAccess();
            return;
        }
        const parsed = current?.kind === 'grant' ? grant.safeParse(current.payload) : undefined;
        if (parsed?.success && parsed.data.issuer === this.origin && profileBinding(parsed.data) !== entry.binding)
            return;
        this.blockAccess();
    }
    revocationStorageFailure() {
        if (this.closed)
            return;
        this.revocationStorageFailed = true;
        console.error('[deepseek-account] remote logout unconfirmed', { errorCode: 'storage' });
        this.changed();
    }
    revoke(entry) {
        if (this.closed || this.revocations.has(entry.id))
            return;
        const revocation = (async () => {
            const outcome = await revokeAccount(this.origin, entry.token, this.logoutPolicy, this.logoutLifetime.signal, { ...this.requestHeaders, ...platformClientHeaders(this.platform, entry.client) });
            if (outcome === 'cancelled')
                return;
            if (outcome === 'confirmed') {
                await this.removeRecordedGrant(entry);
                await this.logoutJournal.remove(entry.id);
                if ((await this.readLogoutJournal()).length === 0)
                    this.revocationStorageFailed = false;
            }
            else
                await this.logoutJournal.fail(entry.id);
        })().catch(() => { this.revocationStorageFailure(); }).finally(() => {
            this.revocations.delete(entry.id);
            this.changed();
        });
        this.revocations.set(entry.id, revocation);
    }
    invalidateDetails(clearProfile = true) {
        if (clearProfile)
            this.lastProfile = undefined;
        this.detailsLifetime.abort();
        this.detailsLifetime = new AbortController();
    }
    changed(identityOnly = false) { for (const listener of this.listeners)
        listener(identityOnly); }
    update(attempt, value) {
        const { authorizeUrl: _url, ...rest } = attempt.view;
        attempt.view = { ...rest, ...value };
        this.changed();
    }
    async run(session, attempt) {
        const webServer = this.ctx.get('webServer');
        if (webServer === undefined)
            throw new PlatformAuthError('protocol');
        const verifier = randomBytes(32).toString('base64url');
        const state = randomBytes(32).toString('base64url');
        const challenge = createHash('sha256').update(verifier).digest('base64url');
        let authorizeId;
        const code = Promise.withResolvers();
        // Callback requests may precede initialization settlement; the rejection is observed immediately.
        void code.promise.catch(() => undefined);
        const deadline = new AbortController();
        let expiresAt = Date.now() + this.attemptTimeout;
        const signal = AbortSignal.any([session.signal, deadline.signal]);
        let timer = setTimeout(() => { deadline.abort(); }, this.attemptTimeout);
        const abort = () => { code.reject(new PlatformAuthError('expired')); };
        signal.addEventListener('abort', abort, { once: true });
        try {
            attempt.disposeCallback = this.ctx.effect(() => webServer.register({
                kind: 'exact', path: '/oauth/callback', handler: (req, res) => {
                    let url;
                    try {
                        url = new URL(req.url ?? '/', 'http://127.0.0.1');
                    }
                    catch {
                        res.writeHead(400, { 'cache-control': 'no-store' }).end();
                        return;
                    }
                    const receivedCode = url.searchParams.get('code');
                    const receivedState = url.searchParams.get('state') ?? '';
                    const validState = Buffer.byteLength(receivedState) === Buffer.byteLength(state)
                        && timingSafeEqual(Buffer.from(receivedState), Buffer.from(state));
                    if (req.method !== 'GET' || url.pathname !== '/oauth/callback' || !validState || !receivedCode
                        || url.searchParams.getAll('state').length !== 1 || url.searchParams.getAll('code').length !== 1) {
                        res.writeHead(400, { 'cache-control': 'no-store' }).end();
                        return;
                    }
                    if (signal.aborted || attempt.callback !== undefined || attempt.view.phase !== 'waiting-browser') {
                        res.writeHead(410, { 'cache-control': 'no-store' }).end();
                        return;
                    }
                    attempt.callback = res;
                    code.resolve(receivedCode);
                },
            }), 'account: browser callback');
            signal.throwIfAborted();
            const redirectUri = `${attempt.origin}/oauth/callback`;
            const init = initialization.safeParse(await this.request('auth_init', {
                code_challenge: challenge, code_challenge_method: 'S256', state, redirect_uri: redirectUri, locale: attempt.locale,
                login_source: attempt.loginSource,
            }, signal, attempt.clientHeaders), { reportInput: true });
            if (!init.success)
                this.rejectPayload('auth_init', init.error);
            const authorizeUrl = browserUrl(init.data.authorize_url, this.origin, this.product === 'uma' ? '/uma/authorize' : '/dsh/authorize', this.rewriteBrowserOrigin);
            authorizeId = init.data.authorize_id;
            signal.throwIfAborted();
            const now = Date.now();
            expiresAt = Math.min(expiresAt, now + init.data.expires_in * 1000);
            const remaining = expiresAt - now;
            if (remaining <= 0) {
                deadline.abort();
                signal.throwIfAborted();
            }
            clearTimeout(timer);
            timer = setTimeout(() => { deadline.abort(); }, remaining);
            this.update(attempt, { phase: 'waiting-browser', authorizeUrl, expiresAt });
            const receivedCode = await code.promise;
            signal.throwIfAborted();
            this.update(attempt, { phase: 'exchanging' });
            const deviceRecord = await this.ctx.credentials.modifyRecord(this.deviceKey, current => Promise.resolve(current === undefined
                ? { kind: 'grant', payload: { id: randomUUID() } } : undefined));
            if (deviceRecord?.kind !== 'grant')
                throw new PlatformAuthError('storage');
            const identity = device.parse(deviceRecord.payload);
            const result = exchange.safeParse(await this.request('auth_exchange', {
                code: receivedCode, code_verifier: verifier, redirect_uri: redirectUri,
                device_id: identity.id, device_model: `${platform()}-${arch()}`, os_version: deviceOsVersion(),
            }, signal, { ...attempt.clientHeaders, ...this.product === 'uma' ? { 'x-uma-token-mode': 'rotate-v1' } : {} }), { reportInput: true });
            if (!result.success)
                this.rejectPayload('auth_exchange', result.error);
            const completionUrl = new URL(browserUrl(result.data.authorized_url, this.origin, this.product === 'uma' ? '/uma/authorized' : '/dsh/authorized', this.rewriteBrowserOrigin));
            completionUrl.searchParams.set('login_source', attempt.loginSource);
            attempt.completionUrl = completionUrl.href;
            if (Date.now() >= expiresAt)
                deadline.abort();
            signal.throwIfAborted();
            if (result.data.user != null) {
                try {
                    attempt.initialProfile = { token: result.data.token, value: { status: 'ready', value: profile(result.data.user) } };
                }
                catch {
                    // Invalid optional user data falls back to current without discarding a valid authorization.
                }
            }
            this.update(attempt, { phase: 'committing' });
            clearTimeout(timer);
            await this.readLogoutJournal();
            const payload = this.product === 'uma' && result.data.refresh_token !== undefined && result.data.expires_in !== undefined
                ? renewableGrant(this.origin, result.data.token, result.data.refresh_token, result.data.expires_in)
                : { version: 1, token: result.data.token, issuer: this.origin };
            try {
                await session.commit({ kind: 'grant', payload });
            }
            catch {
                throw new PlatformAuthError('storage');
            }
        }
        catch (error) {
            if (deadline.signal.aborted)
                throw new PlatformAuthError('expired');
            throw error;
        }
        finally {
            if (signal.aborted && authorizeId !== undefined)
                this.cancelRequest(authorizeId, verifier, attempt.clientHeaders);
            clearTimeout(timer);
            signal.removeEventListener('abort', abort);
            // begin() settles the browser response and removes only this attempt’s route.
        }
    }
    rejectPayload(stage, error) {
        console.error('[deepseek-account] payload rejected', {
            stage, issues: error.issues.map(issue => ({
                path: issue.path, code: issue.code,
                receivedType: issue.input === null ? 'null' : Array.isArray(issue.input) ? 'array' : typeof issue.input,
            })),
        });
        throw new PlatformAuthError('protocol');
    }
    cancelRequest(authorizeId, verifier, headers) {
        if (this.closed)
            return;
        const cancellation = this.request('auth_cancel', { authorize_id: authorizeId, code_verifier: verifier }, this.logoutLifetime.signal, headers).then(() => undefined, () => {
            // Remote cancellation failures never reverse local cancellation or expose verifier diagnostics.
        }).finally(() => { this.cancellations.delete(cancellation); });
        this.cancellations.add(cancellation);
    }
    request(method, body, signal, headers) {
        return requestPlatform(this.origin, method, body, AbortSignal.any([signal, AbortSignal.timeout(this.requestTimeout)]), { ...this.requestHeaders, ...headers }, this.product === 'uma' ? 'uma' : 'dsh');
    }
    finishFailedCallback(attempt) {
        if (attempt.loginSource === 'web') {
            const nonce = randomBytes(16).toString('base64url');
            const message = attempt.locale === 'zh_CN' ? '登录失败，请关闭此标签页并在原页面重试。'
                : 'Sign-in failed. Close this tab and try again in the original tab.';
            attempt.callback?.writeHead(200, {
                'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store',
                'content-security-policy': `default-src 'none'; script-src 'nonce-${nonce}'; frame-ancestors 'none'`,
                'referrer-policy': 'no-referrer',
            }).end(`<!doctype html><html lang="${attempt.locale === 'zh_CN' ? 'zh-CN' : 'en'}"><meta charset="utf-8"><title>${message}</title>`
                + `<body><p>${message}</p><script nonce="${nonce}">window.close()</script></body></html>`);
        }
        else {
            // Native account subscribers focus the login window; retain the browser’s Platform document.
            attempt.callback?.writeHead(204, { 'cache-control': 'no-store' }).end();
        }
    }
}
export default PlatformAccount;
/** OS identification shared by login and credential-free identity reads. */
function deviceOsVersion() {
    return `${platform()} ${release()}`;
}
//# sourceMappingURL=index.js.map