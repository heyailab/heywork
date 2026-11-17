var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Financial-session ownership and authenticated budget operations for HEY. */
import { createHash, randomUUID } from 'node:crypto';
import { Service } from '@deepseek-ai/cordis';
import configSchema from '@deepseek-ai/schemastery';
import { z } from 'zod';
import { defineDomain } from '@deepseek-ai/dsh-storage-domain';
import { Remote, RemoteError, remoteErrorOf, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { SessionId } from '@deepseek-ai/dsh-session';
import { LlmError } from '@deepseek-ai/dsh-llm';
const storage = defineDomain({
    name: 'uma_session_budgets', version: 1,
    global: {
        schema: z.object({ installationId: z.uuid().nullable() }),
        initial: { installationId: null },
    },
    tables: {},
});
const decimal = /^(0|[1-9][0-9]{0,9})(\.[0-9]{1,6})?$/u;
const uuid = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu;
const remoteFailure = (reason) => new RemoteError('hey-budget/failed', 'The session budget operation could not be completed', { reason });
const wireBudget = z.object({ id: z.uuid(), account_id: z.uuid(), purpose: z.string().max(160),
    cap: z.string().regex(decimal).nullable(), spent: z.string().regex(decimal), reserved: z.string().regex(decimal),
    state: z.enum(['active', 'paused', 'closed']), operator_paused: z.boolean().default(false), operator_reason: z.string().max(500).default(''),
    version: z.number().int().positive(), expires_at: z.iso.datetime({ offset: true }) });
/** Owns opaque local bindings, issuer requests and root-session resolution. */
let UmaTaskBudgets = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _read_decorators;
    let _update_decorators;
    return class UmaTaskBudgets extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _read_decorators = [Remote('read')];
            _update_decorators = [Remote('update')];
            __esDecorate(this, null, _read_decorators, { kind: "method", name: "read", static: false, private: false, access: { has: obj => "read" in obj, get: obj => obj.read }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static inject = ['typert', 'storageDomain', 'sessionQuery'];
        static Config = configSchema.object({ timeoutMs: configSchema.number().default(10_000), cacheMs: configSchema.number().default(15_000) });
        lifetime = (__runInitializers(this, _instanceExtraInitializers), new AbortController());
        domain;
        cache = new Map();
        pending = new Map();
        installationId = '';
        timeoutMs;
        cacheMs;
        /**
         * Mount budget metadata without persisting any credential or financial balance locally.
         * @param ctx - same Host session, storage and optional account capabilities.
         * @param config - request and cache bounds.
         */
        constructor(ctx, config = {}) {
            super(ctx, 'umaTaskBudgets', { namespace: 'hey-budget' });
            this.timeoutMs = config.timeoutMs ?? 10_000;
            this.cacheMs = config.cacheMs ?? 15_000;
            if (!Number.isSafeInteger(this.timeoutMs) || this.timeoutMs < 100 || this.timeoutMs > 60_000
                || !Number.isSafeInteger(this.cacheMs) || this.cacheMs < 0 || this.cacheMs > 60_000)
                throw new Error('HEY budget resource limits are invalid');
            ctx.effect(() => async () => {
                this.lifetime.abort();
                this.cache.clear();
                await Promise.allSettled(this.pending.values());
                await this.domain?.close();
            });
            ctx.on('deepseek-account/signed-out', () => { this.cache.clear(); });
            ctx.on('deepseek-account/access-blocked', () => { this.cache.clear(); });
        }
        async [Service.init]() {
            const domain = await this.ctx.storageDomain.open(storage);
            if (this.lifetime.signal.aborted) {
                await domain.close();
                this.lifetime.signal.throwIfAborted();
            }
            this.domain = domain;
            this.installationId = this.domain.global.get().installationId ?? randomUUID();
            if (this.domain.global.get().installationId === null)
                await this.domain.global.set({ installationId: this.installationId });
        }
        async rootOf(id, signal) {
            const seen = new Set();
            for (let depth = 0; depth < 64; depth++) {
                const env_1 = { stack: [], error: void 0, hasError: false };
                try {
                    signal.throwIfAborted();
                    if (seen.has(id))
                        throw remoteFailure('cyclic-session-lineage');
                    seen.add(id);
                    const observation = __addDisposableResource(env_1, await this.ctx.sessionQuery.observeSession(id, { signal, projectionMode: 'none' }), false);
                    if (observation.header.origin !== 'subagent' || observation.header.parentSession === undefined)
                        return id;
                    id = observation.header.parentSession;
                }
                catch (e_1) {
                    env_1.error = e_1;
                    env_1.hasError = true;
                }
                finally {
                    __disposeResources(env_1);
                }
            }
            throw remoteFailure('session-lineage-limit');
        }
        async api(origin, token, path, method, body, signal) {
            const destination = new URL(origin);
            if (destination.origin !== origin || destination.username !== '' || destination.password !== ''
                || destination.protocol !== 'https:' && !(destination.protocol === 'http:' && destination.hostname === '127.0.0.1')) {
                throw remoteFailure('invalid-issuer');
            }
            const response = await fetch(new URL(path, origin), { method, redirect: 'error', cache: 'no-store',
                headers: { authorization: `Bearer ${token}`, accept: 'application/json', 'content-type': 'application/json' },
                ...body === undefined ? {} : { body: JSON.stringify(body) },
                signal: AbortSignal.any([this.lifetime.signal, signal, AbortSignal.timeout(this.timeoutMs)]) });
            if (!response.ok) {
                await response.body?.cancel();
                throw remoteFailure(response.status === 401 ? 'account-required' : response.status === 409 ? 'version-conflict'
                    : response.status === 402 ? 'budget-committed' : response.status === 404 ? 'server-upgrade-required' : 'request-failed');
            }
            const reader = response.body?.getReader();
            if (reader === undefined)
                throw remoteFailure('invalid-response');
            let bytes = 0, text = '';
            const decoder = new TextDecoder();
            try {
                for (;;) {
                    const part = await reader.read();
                    if (part.done)
                        break;
                    bytes += part.value.byteLength;
                    if (bytes > 65_536)
                        throw remoteFailure('response-too-large');
                    text += decoder.decode(part.value, { stream: true });
                }
            }
            finally {
                await reader.cancel();
            }
            let value;
            try {
                value = JSON.parse(text + decoder.decode());
            }
            catch {
                throw remoteFailure('invalid-response');
            }
            const parsed = wireBudget.safeParse(value);
            if (!parsed.success)
                throw remoteFailure('invalid-response');
            return { id: parsed.data.id, purpose: parsed.data.purpose, cap: parsed.data.cap, spent: parsed.data.spent,
                reserved: parsed.data.reserved, state: parsed.data.state,
                operatorPaused: parsed.data.operator_paused, operatorReason: parsed.data.operator_reason,
                version: parsed.data.version, expiresAt: parsed.data.expires_at };
        }
        async view(id, origin, token, signal) {
            const root = await this.rootOf(id, signal);
            const reference = createHash('sha256').update(this.installationId).update('\0').update(String(root)).digest('hex');
            const budget = await this.api(origin, token, '/v1/session-budgets', 'POST', {
                client_ref: this.installationId, session_ref: reference, purpose: 'HeyWork session', cap: null,
            }, signal);
            return { sessionId: id, rootSessionId: root, shared: id !== root, budget };
        }
        async account(signal) {
            signal.throwIfAborted();
            const account = this.ctx.get('deepseekAccount');
            const previous = await account?.getPlatformSession();
            if (account === undefined || previous === null || previous === undefined)
                throw remoteFailure('account-required');
            const token = await account.resolveToken(previous.origin);
            signal.throwIfAborted();
            if (token === undefined)
                throw remoteFailure('account-required');
            return { origin: previous.origin, token };
        }
        async stillCurrent(origin, token) {
            const current = await this.ctx.get('deepseekAccount')?.getPlatformSession();
            return current !== null && current !== undefined && current.origin === origin && current.token === token;
        }
        // A delayed metadata response must not replace a newer observed configuration.
        remember(key, view) {
            const previous = this.cache.get(key);
            if (previous !== undefined && previous.value.budget.id === view.budget.id && previous.value.budget.version > view.budget.version) {
                return previous;
            }
            if (this.cache.size >= 1024 && !this.cache.has(key))
                this.cache.clear();
            const value = { expires: Date.now() + this.cacheMs, value: view };
            this.cache.set(key, value);
            return value;
        }
        /**
         * Read the root allowance for a real local session under the current HEY account.
         * @param request - local session; delegated sessions resolve to their recorded root.
         * @param signal - view lifetime.
         * @returns a credential-free current allowance and root identity.
         */
        async read(request, signal) {
            const owned = AbortSignal.any([signal, this.lifetime.signal]);
            const identity = await this.account(owned);
            const view = await this.view(request.sessionId, identity.origin, identity.token, owned);
            if (!await this.stillCurrent(identity.origin, identity.token))
                throw remoteFailure('account-changed');
            const latest = this.remember(`${identity.origin}\0${identity.token}\0${view.rootSessionId}`, view);
            return { ...view, budget: latest.value.budget };
        }
        /**
         * Replace the reviewed root cap/state; accepted calls keep their reservations and can settle.
         * @param request - current session, observed version, explicit CNY cap or no extra cap, and next state.
         * @param signal - operation lifetime.
         * @returns the committed allowance, or an explicit conflict requiring a fresh read.
         */
        async update(request, signal) {
            if (!Number.isSafeInteger(request.expectedVersion) || request.expectedVersion < 1
                || request.cap !== null && !decimal.test(request.cap))
                throw remoteFailure('invalid-budget');
            const owned = AbortSignal.any([signal, this.lifetime.signal]);
            const identity = await this.account(owned);
            const view = await this.view(request.sessionId, identity.origin, identity.token, owned);
            if (!await this.stillCurrent(identity.origin, identity.token))
                throw remoteFailure('account-changed');
            const budget = await this.api(identity.origin, identity.token, `/v1/session-budgets/${view.budget.id}`, 'PATCH', {
                cap: request.cap, state: request.state, expected_version: request.expectedVersion,
            }, owned);
            if (!await this.stillCurrent(identity.origin, identity.token))
                throw remoteFailure('account-changed');
            const latest = this.remember(`${identity.origin}\0${identity.token}\0${view.rootSessionId}`, { ...view, budget });
            return { ...view, budget: latest.value.budget };
        }
        /**
         * Prepare Host-only headers for one model request without ever replaying inference.
         * @param request - issuer/credential captured by the model transport and its actual session.
         * @param signal - model request lifetime.
         * @returns the owned task id and protocol marker enforced at native API admission.
         */
        async prepare(request, signal) {
            if (typeof request.sessionId !== 'string' || request.sessionId.length === 0 || request.sessionId.length > 256)
                throw LlmError.fromFailure({ message: 'A real session is required for a HEY task budget', code: 'HEY_TASK_BUDGET_UNAVAILABLE' });
            const owned = AbortSignal.any([signal, this.lifetime.signal]);
            if (request.kind === 'device' && !await this.stillCurrent(request.origin, request.token))
                throw LlmError.fromFailure({ message: 'The HeyWork account changed before budget admission', code: 'HEY_TASK_BUDGET_ACCOUNT_CHANGED' });
            const root = await this.rootOf(SessionId(request.sessionId), owned);
            const key = `${request.origin}\0${request.token}\0${root}`;
            let value = this.cache.get(key);
            if (value === undefined || value.expires <= Date.now()) {
                let pending = this.pending.get(key);
                if (pending === undefined) {
                    pending = this.view(root, request.origin, request.token, this.lifetime.signal);
                    this.pending.set(key, pending);
                    void pending.finally(() => { if (this.pending.get(key) === pending)
                        this.pending.delete(key); }).catch(() => { });
                }
                let view;
                try {
                    view = await waitForBudget(pending, owned);
                }
                catch (error) {
                    owned.throwIfAborted();
                    const failure = remoteErrorOf(error);
                    if (failure?.code === 'hey-budget/failed' && failure.details.reason === 'account-required')
                        throw new LlmError('Sign in to HeyWork again to read the session budget', 'ACCOUNT_TOKEN_INVALID', { status: 401 });
                    throw LlmError.fromFailure({ message: 'The HEY session budget could not be read. The model request has not been dispatched.', code: 'HEY_TASK_BUDGET_UNAVAILABLE' }, { cause: error });
                }
                owned.throwIfAborted();
                value = this.remember(key, view);
            }
            if (request.kind === 'device' && !await this.stillCurrent(request.origin, request.token))
                throw LlmError.fromFailure({ message: 'The HeyWork account changed before dispatch', code: 'HEY_TASK_BUDGET_ACCOUNT_CHANGED' });
            if (value.value.budget.operatorPaused)
                throw LlmError.fromFailure({ message: 'Operations paused this session budget. Open Budget in the session header for the recorded reason.', code: 'HEY_TASK_BUDGET_PAUSED' });
            if (value.value.budget.state !== 'active')
                throw LlmError.fromFailure({ message: 'This session budget is paused or closed. Use Budget in the session header to resume it.', code: 'HEY_TASK_BUDGET_PAUSED' });
            if (!uuid.test(value.value.budget.id))
                throw LlmError.fromFailure({ message: 'HeyWork returned an invalid task budget', code: 'HEY_TASK_BUDGET_UNAVAILABLE' });
            return { taskId: value.value.budget.id, protocol: '1' };
        }
    };
})();
export { UmaTaskBudgets };
export default UmaTaskBudgets;
async function waitForBudget(value, signal) {
    signal.throwIfAborted();
    let abort;
    try {
        return await Promise.race([value, new Promise((_resolve, reject) => {
                abort = () => {
                    const reason = signal.reason;
                    reject(reason instanceof Error ? reason : new DOMException('The budget operation was aborted', 'AbortError'));
                };
                signal.addEventListener('abort', abort, { once: true });
                if (signal.aborted)
                    abort();
            })]);
    }
    finally {
        if (abort !== undefined)
            signal.removeEventListener('abort', abort);
    }
}
//# sourceMappingURL=index.js.map