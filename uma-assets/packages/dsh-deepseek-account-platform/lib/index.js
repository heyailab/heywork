import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { arch, platform, release } from "node:os";
import { promises } from "node:stream";
import { Service } from "@deepseek-ai/cordis";
import Schema from "@deepseek-ai/schemastery";
import { z } from "zod";
import { DeepSeekAccount, HEY_PLATFORM_PATHS, installAccountTaskCancellation, mergePlatformCookies, platformClientHeaders, platformWireLocale } from "@deepseek-ai/dsh-deepseek-account";
import { credentialKey } from "@deepseek-ai/dsh-credentials";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
//#region lib/types/protocol.js
/** Validated platform HTTP messages and restricted browser destinations. */
/** Protocol errors expose a stable code, never a response body or authorization URL. */
var PlatformAuthError = class extends Error {
	code;
	/** @param code - safe error classification. */
	constructor(code) {
		super(`account: ${code}`);
		this.code = code;
	}
};
/** An authenticated Platform request was rejected with HTTP 401 or code 40003. */
var AccountUnauthorizedError = class extends PlatformAuthError {
	constructor() {
		super("expired");
	}
};
/**
* Accept HTTPS platform endpoints, or explicitly configured loopback development HTTP.
* @param value - configured origin.
* @param allowLoopbackHttp - development-only opt-in.
* @returns normalized origin.
*/
function platformOrigin(value, allowLoopbackHttp) {
	const url = new URL(value);
	const loopback = [
		"localhost",
		"127.0.0.1",
		"[::1]"
	].includes(url.hostname);
	if (url.username || url.password || url.pathname !== "/" || url.search || url.hash || !(url.protocol === "https:" || allowLoopbackHttp && loopback && url.protocol === "http:")) throw new Error("account: platformOrigin must be an HTTPS origin or explicitly enabled loopback HTTP origin");
	return url.origin;
}
/**
* Validate platform-owned browser destinations without forwarding arbitrary URLs.
* @param value - returned browser URL.
* @param origin - configured platform origin.
* @param path - fixed authorize or completion path.
* @param rewriteOrigin - map validated browser pages to the configured development origin.
* @returns normalized URL on the configured origin.
*/
function browserUrl(value, origin, path, rewriteOrigin = false) {
	let url;
	try {
		url = new URL(value);
	} catch {
		console.error("[deepseek-account] browser URL rejected", {
			path,
			reason: "invalid-url"
		});
		throw new PlatformAuthError("protocol");
	}
	const allowedOrigin = url.origin === origin || rewriteOrigin && url.protocol === "https:";
	if (!allowedOrigin || url.pathname !== path || url.username || url.password || url.hash) {
		console.error("[deepseek-account] browser URL rejected", {
			path,
			originMismatch: !allowedOrigin,
			pathMismatch: url.pathname !== path,
			hasCredentials: Boolean(url.username || url.password),
			hasFragment: Boolean(url.hash)
		});
		throw new PlatformAuthError("protocol");
	}
	return rewriteOrigin ? `${origin}${url.pathname}${url.search}` : url.href;
}
/**
* Validate Host-only deployment headers without exposing their values in diagnostics.
* @param values - configured headers for the Platform origin.
* @returns normalized headers; authorization, routing and framing remain provider-owned.
*/
function platformHeaders(values) {
	const headers = new Headers();
	const names = /* @__PURE__ */ new Set();
	for (const [name, value] of Object.entries(values)) {
		const key = name.toLowerCase();
		if ([
			"authorization",
			"x-dsh-auth-token",
			"x-hey-token-mode",
			"host",
			"content-length",
			"transfer-encoding",
			"connection",
			"content-type"
		].includes(key) || names.has(key)) throw new Error("account: requestHeaders contains a reserved or duplicate header");
		names.add(key);
		try {
			headers.set(name, value);
		} catch {
			throw new Error("account: requestHeaders contains an invalid header");
		}
	}
	return Object.fromEntries(headers);
}
const envelope = z.object({
	code: z.literal(0),
	data: z.object({
		biz_code: z.number().int(),
		biz_data: z.unknown()
	})
});
/** Successful initialization response. */
const initialization = z.object({
	authorize_url: z.url(),
	authorize_id: z.string().min(1),
	expires_in: z.number().positive()
});
const opaque = z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/);
const lifetime = z.number().int().min(1).max(900);
/** Successful code exchange response. Renewal fields must arrive together. */
const exchange = z.object({
	token: z.string().regex(/^[\x21-\x7e]+$/),
	authorized_url: z.url(),
	user: z.unknown().optional(),
	refresh_token: opaque.optional(),
	expires_in: lifetime.optional()
}).refine((value) => value.refresh_token === void 0 === (value.expires_in === void 0));
const rotated = z.object({
	access_token: opaque,
	refresh_token: opaque,
	expires_in: lifetime,
	token_type: z.literal("Bearer")
});
/**
* Rotate one HEY device credential. The same attempt can recover a lost response.
* @param origin - validated HEY issuer.
* @param token - current refresh credential.
* @param attempt - independently generated nonce stored with the credential.
* @param signal - request deadline and service lifetime.
* @param headers - validated deployment headers for this origin.
* @returns new access and refresh credentials with the remaining access lifetime.
*/
async function refreshAccount(origin, token, attempt, signal, headers) {
	const data = await requestPlatform(origin, "auth_refresh", { attempt_id: attempt }, signal, accountHeaders(headers, token), "hey");
	const result = rotated.safeParse(data);
	if (!result.success) throw new PlatformAuthError("protocol");
	return result.data;
}
/**
* Read one bounded platform response; non-cancellation failures emit non-secret diagnostics to stderr.
* @param origin - validated platform origin.
* @param method - platform endpoint suffix.
* @param body - protocol request, never logged.
* @param signal - attempt cancellation and timeout.
* @param headers - validated deployment headers for this origin.
* @param product - owner of the authentication routes; HEY uses its branded API prefix.
* @returns successful business payload, validated by its caller.
*/
async function requestPlatform(origin, method, body, signal, headers, product = "dsh") {
	return platformRequest(`${origin}/auth-api/v0/${product}/${method}`, {
		method: "POST",
		headers: {
			...headers,
			"content-type": "application/json"
		},
		body: JSON.stringify(body)
	}, signal, "compatibility");
}
/**
* Fetch a fixed Platform account endpoint with the grant kept in Host request headers.
* @param origin - configured and grant-matched origin.
* @param path - account endpoint.
* @param token - account grant.
* @param signal - credential lifetime and request timeout.
* @param headers - validated deployment headers for this origin.
* @returns successful business payload.
*/
function requestAccount(origin, path, token, signal, headers) {
	return platformRequest(`${origin}${path}`, {
		method: "GET",
		headers: accountHeaders(headers, token)
	}, signal, "compatibility");
}
/**
* Fetch a native HEY JSON endpoint with the same bounded account transport.
* @param origin - configured and grant-matched origin.
* @param path - native account endpoint.
* @param token - captured account grant.
* @param signal - credential lifetime and request timeout.
* @param headers - deployment and client identity headers for this origin.
* @returns parsed native JSON, validated by the owning account query.
*/
function requestNativeAccount(origin, path, token, signal, headers) {
	return platformRequest(`${origin}${path}`, {
		method: "GET",
		headers: accountHeaders(headers, token)
	}, signal, "native");
}
/**
* Read the granted bonuses Platform has not yet recorded as displayed.
* @param origin - configured origin matching the grant issuer.
* @param token - stored account grant.
* @param signal - credential lifetime and request timeout.
* @param headers - deployment and client identity headers for this origin.
* @returns successful business payload holding the unnotified bonus list.
*/
function requestUnnotifiedBonuses(origin, token, signal, headers) {
	return platformRequest(`${origin}/api/v0/users/get_unnotified_bonuses`, {
		method: "GET",
		headers: accountHeaders(headers, token)
	}, signal, "compatibility");
}
/**
* Acknowledge an actually displayed bonus to Platform.
* @param origin - configured origin matching the grant issuer.
* @param token - stored account grant.
* @param orderId - granted bonus order the user saw.
* @param signal - credential lifetime and request timeout.
* @param headers - deployment and client identity headers for this origin.
* @returns successful business payload, which carries no data.
*/
function requestBonusNotified(origin, token, orderId, signal, headers) {
	return platformRequest(`${origin}/api/v0/users/ack_bonus_notified`, {
		method: "POST",
		headers: {
			...accountHeaders(headers, token),
			"content-type": "application/json"
		},
		body: JSON.stringify({ order_id: orderId })
	}, signal, "compatibility");
}
function accountHeaders(headers, token) {
	return {
		...headers,
		"x-dsh-auth-token": token
	};
}
/**
* End the Platform session using its existing logout endpoint.
* @param origin - configured origin matching the grant issuer.
* @param token - stored account token.
* @param signal - logout request deadline.
* @param headers - validated deployment headers for this origin.
* @returns after Platform confirms logout.
*/
async function logoutAccount(origin, token, signal, headers) {
	await platformRequest(`${origin}/auth-api/v0/users/logout`, {
		method: "POST",
		headers: {
			...headers,
			"x-dsh-auth-token": token
		}
	}, signal, "compatibility");
}
/** Caller cancellation stays silent; standard TimeoutError aborts remain failures. */
function callerCancelled(signal) {
	const reason = signal.reason;
	return signal.aborted && !(reason instanceof Error && reason.name === "TimeoutError");
}
async function platformRequest(url, init, signal, responseFormat) {
	const path = new URL(url).pathname;
	let response;
	try {
		response = await fetch(url, {
			...init,
			redirect: "error",
			signal
		});
	} catch {
		if (!callerCancelled(signal)) console.error("[deepseek-account] request failed", {
			path,
			errorCode: "no-response",
			aborted: signal.aborted
		});
		throw new PlatformAuthError("no-response");
	}
	if (response.status === 401 && new Headers(init.headers).has("x-dsh-auth-token")) {
		if (!callerCancelled(signal)) console.error("[deepseek-account] request failed", {
			path,
			status: response.status,
			errorCode: "expired"
		});
		await response.body?.cancel();
		throw new AccountUnauthorizedError();
	}
	if (!response.ok || response.body === null) {
		if (!callerCancelled(signal)) console.error("[deepseek-account] request failed", {
			path,
			status: response.status,
			errorCode: "network"
		});
		await response.body?.cancel();
		throw new PlatformAuthError("network");
	}
	const reader = response.body.getReader();
	const chunks = [];
	let size = 0;
	let stage = "read-body";
	let codes;
	let validationError;
	try {
		while (true) {
			const next = await reader.read();
			if (next.done) break;
			size += next.value.byteLength;
			if (size > 65536) {
				stage = "body-limit";
				throw new PlatformAuthError("protocol");
			}
			chunks.push(next.value);
		}
		stage = "parse-json";
		const payload = JSON.parse(Buffer.concat(chunks).toString("utf8"));
		if (responseFormat === "native") return payload;
		const responseCodes = z.object({
			code: z.number().int(),
			data: z.object({ biz_code: z.number().int() }).optional()
		}).safeParse(payload);
		if (responseCodes.success) codes = responseCodes.data;
		if (z.object({ code: z.literal(40003) }).safeParse(payload).success && new Headers(init.headers).has("x-dsh-auth-token")) throw new AccountUnauthorizedError();
		stage = "envelope";
		const parsed = envelope.safeParse(payload);
		if (!parsed.success) {
			validationError = parsed.error;
			throw new PlatformAuthError("protocol");
		}
		stage = "business-code";
		if (parsed.data.data.biz_code !== 0) throw new PlatformAuthError("protocol");
		return parsed.data.data.biz_data;
	} catch (error) {
		if (!callerCancelled(signal)) console.error("[deepseek-account] response rejected", {
			path,
			status: response.status,
			stage,
			code: codes?.code,
			bizCode: codes?.data?.biz_code,
			issues: validationError?.issues.map((issue) => ({
				path: issue.path,
				code: issue.code
			})),
			errorCode: error instanceof PlatformAuthError ? error.code : "protocol"
		});
		if (error instanceof PlatformAuthError) throw error;
		throw new PlatformAuthError("protocol");
	} finally {
		await reader.cancel().catch(() => void 0);
		reader.releaseLock();
	}
}
/**
* Accept a browser-accessible loopback HTTP origin for local or SSH-forwarded login.
* @param value - loopback HTTP origin with an explicit port supplied by the authenticated initiating client.
* @returns normalized origin; remote domains and path-based proxies are unsupported.
*/
function loginOrigin(value) {
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new PlatformAuthError("protocol");
	}
	const explicitPort = /^http:\/\/(?:localhost|127\.0\.0\.1|\[::1\]):([0-9]+)\/?$/i.exec(value)?.[1];
	if (explicitPort === void 0 || Number(explicitPort) === 0 || url.protocol !== "http:" || ![
		"localhost",
		"127.0.0.1",
		"[::1]"
	].includes(url.hostname) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new PlatformAuthError("protocol");
	return `${url.protocol}//${url.hostname}:${Number(explicitPort)}`;
}
//#endregion
//#region lib/types/details.js
/** Platform Web profile and wallet queries projected for account UI consumers. */
const user = z.object({
	id: z.string().nullish(),
	email: z.string(),
	mobile: z.string().optional(),
	mobile_number: z.string().optional(),
	id_profile: z.object({
		name: z.string().nullable(),
		picture: z.string().nullish(),
		hey_badge: z.literal("beta-veteran").optional().catch(void 0)
	}).nullish()
});
const decimal = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;
const wallet = z.object({
	currency: z.enum([
		"CNY",
		"USD",
		"HEY"
	]),
	balance: z.string().regex(decimal)
});
const summary = z.object({
	normal_wallets: z.array(wallet),
	bonus_wallets: z.array(wallet)
});
const bonusMetadata = z.custom().optional();
const bonus = z.object({
	campaign: bonusMetadata,
	amount: bonusMetadata,
	currency: bonusMetadata,
	granted_at: bonusMetadata,
	order_id: z.string(),
	title: z.string().nullish().transform((value) => value ?? void 0),
	expires_at: z.string().nullish().transform((value) => value ?? ""),
	msg: z.string()
});
const unnotified = z.array(bonus);
/** Project Platform user data without retaining credentials or unneeded fields.
* @param value - current or exchange user response.
* @returns UI account profile.
*/
function profile(value) {
	const parsed = user.safeParse(value);
	if (!parsed.success) throw new PlatformAuthError("protocol");
	return projectProfile(parsed.data);
}
function projectProfile(value) {
	const { email, mobile, mobile_number: mobileNumber, id_profile: identity } = value;
	return {
		id: value.id == null ? null : value.id,
		avatarUrl: identity?.picture || null,
		...identity?.hey_badge === void 0 ? {} : { umaBadge: identity.hey_badge },
		name: identity?.name || null,
		contact: mobile || mobileNumber || email || null
	};
}
function accountPayload(schema, value, field) {
	const parsed = schema.safeParse(value);
	if (!parsed.success) {
		console.error(`[deepseek-account] ${field} schema rejected`, { issues: parsed.error.issues.map((issue) => ({
			path: issue.path,
			code: issue.code
		})) });
		throw new PlatformAuthError("protocol");
	}
	return parsed.data;
}
const queries = {
	profile: {
		path: "/auth-api/v0/users/current",
		parse: (value) => ({
			status: "ready",
			value: projectProfile(accountPayload(user, value, "profile"))
		})
	},
	balance: {
		path: "/api/v0/users/get_user_summary",
		parse: (value) => {
			const parsed = accountPayload(summary, value, "balance");
			return {
				status: "ready",
				value: parsed.normal_wallets,
				bonusWallets: parsed.bonus_wallets
			};
		}
	}
};
/**
* Read one Platform account field without waiting for the other query.
* @param field - profile or recharge and bonus wallet balances.
* @param origin - configured origin matching the stored grant issuer.
* @param token - stored authorization token; response tokens are discarded.
* @param signal - request and credential lifetime.
* @param headers - validated deployment headers for the configured origin.
* @returns sanitized query outcome; failure never becomes a zero balance.
* @throws AccountUnauthorizedError when Platform rejects the stored token with HTTP 401 or response code 40003.
*/
async function readAccountDetail(field, origin, token, signal, headers) {
	const query = queries[field];
	try {
		return query.parse(await requestAccount(origin, query.path, token, signal, headers));
	} catch (error) {
		if (error instanceof AccountUnauthorizedError) throw error;
		return { status: "failed" };
	}
}
/**
* Read the unnotified bonus list for one captured credential.
* @param origin - configured origin matching the stored grant issuer.
* @param token - captured account grant; the caller has already bound it to the account.
* @param signal - credential lifetime and request timeout.
* @param headers - deployment and client identity headers for the configured origin.
* @returns notifications in Platform order; a malformed payload is a protocol failure.
*/
async function readUnnotifiedBonuses(origin, token, signal, headers) {
	return accountPayload(unnotified, await requestUnnotifiedBonuses(origin, token, signal, headers), "bonus").map((row) => ({
		...row.campaign === void 0 ? {} : { campaign: row.campaign },
		...row.amount === void 0 ? {} : { amount: row.amount },
		...row.currency === void 0 ? {} : { currency: row.currency },
		...row.granted_at === void 0 ? {} : { grantedAt: row.granted_at },
		orderId: row.order_id,
		expiresAt: row.expires_at,
		message: row.msg,
		...row.title === void 0 ? {} : { title: row.title }
	}));
}
/**
* Record one displayed bonus as notified with the credential it was read under.
* @param origin - configured origin matching the stored grant issuer.
* @param token - captured account grant; the caller has already bound it to the account.
* @param orderId - granted bonus order the user saw.
* @param signal - credential lifetime and request timeout.
* @param headers - deployment and client identity headers for the configured origin.
* @returns after Platform records the acknowledgement; HTTP and business failures throw.
*/
async function sendBonusNotified(origin, token, orderId, signal, headers) {
	await requestBonusNotified(origin, token, orderId, signal, headers);
}
const ledgerEntry = z.object({
	id: z.string(),
	kind: z.string(),
	created_at: z.string(),
	available_delta: z.string().regex(decimal),
	spent_delta: z.string().regex(decimal),
	issued_delta: z.string().regex(decimal),
	request_id: z.string().nullish()
});
const ledgerPage = z.object({
	entries: z.array(ledgerEntry),
	next_cursor: z.string(),
	currency: z.literal("CNY")
});
/**
* Read one page of the account's CNY ledger, newest first.
* @param origin - configured origin matching the stored grant issuer.
* @param token - captured account grant; the caller has already bound it to the account.
* @param before - platform cursor for the next older page; omit for the newest page.
* @param signal - request and credential lifetime.
* @param headers - deployment and client identity headers for the configured origin.
* @returns the projected page with decimal deltas preserved as strings.
*/
async function readLedger(origin, token, before, signal, headers) {
	const parsed = accountPayload(ledgerPage, await requestNativeAccount(origin, before === void 0 ? "/v1/me/ledger" : `/v1/me/ledger?before=${encodeURIComponent(before)}`, token, signal, headers), "ledger");
	return {
		currency: "CNY",
		nextCursor: parsed.next_cursor === "" ? null : parsed.next_cursor,
		entries: parsed.entries.map((row) => ({
			id: row.id,
			kind: row.kind,
			at: row.created_at,
			availableDelta: row.available_delta,
			spentDelta: row.spent_delta,
			issuedDelta: row.issued_delta,
			requestId: row.request_id ?? null
		}))
	};
}
//#endregion
//#region lib/types/logout.js
/** Bounded revocation attempts for a grant owned by the durable logout journal. */
function cancelled(signal) {
	return signal.aborted;
}
/**
* Revoke one captured grant without changing local account state.
* @param origin - Issuer verified before local grant removal.
* @param token - Removed grant, never replaced with a later login's token.
* @param policy - Request deadline and exponential retry limits.
* @param signal - Provider lifetime; shutdown aborts requests and delays.
* @param headers - Validated issuer-only deployment headers.
* @returns Whether the captured credential was revoked, remained unconfirmed, or was interrupted.
*/
async function revokeAccount(origin, token, policy, signal, headers) {
	for (let attempt = 0; attempt <= policy.maxRetries; attempt++) {
		if (cancelled(signal)) return "cancelled";
		if (attempt > 0) try {
			await setTimeout$1(policy.delayMs * 2 ** (attempt - 1), void 0, {
				signal,
				ref: false
			});
		} catch {
			return "cancelled";
		}
		try {
			await logoutAccount(origin, token, AbortSignal.any([signal, AbortSignal.timeout(policy.requestTimeoutMs)]), headers);
			return "confirmed";
		} catch (_error) {
			if (cancelled(signal)) return "cancelled";
		}
	}
	return "failed";
}
//#endregion
//#region lib/types/logout-journal.js
/** Credential-owned intents for remote revocation after local account removal. */
const entry = z.object({
	id: z.uuid().transform((value) => value),
	token: z.string().min(1),
	binding: z.string().min(1),
	client: z.object({
		version: z.string(),
		locale: z.string(),
		timezoneOffsetSeconds: z.number()
	}).strict(),
	status: z.enum([
		"prepared",
		"pending",
		"failed"
	])
}).strict();
const journal = z.object({
	version: z.literal(1),
	issuer: z.url(),
	entries: z.array(entry)
}).strict().refine((value) => new Set(value.entries.map((item) => item.id)).size === value.entries.length && new Set(value.entries.map((item) => item.binding)).size === value.entries.length);
async function stored(operation) {
	try {
		return await operation();
	} catch (error) {
		if (error instanceof PlatformAuthError) throw error;
		throw new PlatformAuthError("storage");
	}
}
/** Serialized credential mutations preserve concurrent additions and exact revocation identities. */
var LogoutJournal = class {
	credentials;
	key;
	origin;
	block;
	/**
	* @param credentials - secret record owner.
	* @param key - deployment-scoped journal address.
	* @param origin - validated issuer.
	* @param block - stop credential use when the stored journal cannot be interpreted.
	*/
	constructor(credentials, key, origin, block) {
		this.credentials = credentials;
		this.key = key;
		this.origin = origin;
		this.block = block;
	}
	unreadable(code) {
		this.block();
		throw new PlatformAuthError(code);
	}
	parse(record) {
		if (record === void 0) return [];
		if (record.kind !== "grant") return this.unreadable("storage");
		const parsed = journal.safeParse(record.payload);
		if (!parsed.success) return this.unreadable("storage");
		if (parsed.data.issuer !== this.origin) return this.unreadable("protocol");
		return parsed.data.entries;
	}
	modify(mutation) {
		return stored(() => this.credentials.modifyRecord(this.key, (current) => Promise.resolve(mutation(current))));
	}
	/**
	* Read the issuer-bound revocation journal.
	* @returns captured revocations, refusing malformed, future-version and foreign-issuer records.
	*/
	async read() {
		try {
			return this.parse(await stored(() => this.credentials.readRecord(this.key)));
		} catch (error) {
			this.block();
			throw error;
		}
	}
	/**
	* Persist one captured revocation intent.
	* @param value - captured grant and caller metadata.
	* @returns after the intent is durable; duplicate bindings retain the original intent.
	*/
	async append(value) {
		await this.modify((current) => {
			const entries = this.parse(current);
			if (entries.some((item) => item.binding === value.binding)) return void 0;
			return {
				kind: "grant",
				payload: {
					version: 1,
					issuer: this.origin,
					entries: [...entries, value]
				}
			};
		});
	}
	/**
	* Admit an intent after its matching local grant has been removed.
	* @param id - intent whose matching local grant was removed.
	* @returns after persisting admission; missing or already admitted intents remain unchanged.
	*/
	async ready(id) {
		await this.modify((current) => {
			const entries = this.parse(current);
			if (!entries.some((item) => item.id === id && item.status === "prepared")) return void 0;
			return {
				kind: "grant",
				payload: {
					version: 1,
					issuer: this.origin,
					entries: entries.map((item) => item.id === id ? {
						...item,
						status: "pending"
					} : item)
				}
			};
		});
	}
	/**
	* Persist the exhausted retry outcome for one captured intent.
	* @param id - captured intent.
	* @returns after its exhausted retry outcome is durable, without changing other intents.
	*/
	async fail(id) {
		await this.modify((current) => {
			const entries = this.parse(current);
			if (!entries.some((item) => item.id === id)) return void 0;
			return {
				kind: "grant",
				payload: {
					version: 1,
					issuer: this.origin,
					entries: entries.map((item) => item.id === id ? {
						...item,
						status: "failed"
					} : item)
				}
			};
		});
	}
	/**
	* Admit a new bounded retry run after the caller completes matching local removals.
	* @param client - identity of the UI requesting another retry.
	* @returns intents admitted to the new retry run.
	*/
	async retry(client) {
		const result = await this.modify((current) => {
			const entries = this.parse(current);
			if (entries.length === 0) return void 0;
			return {
				kind: "grant",
				payload: {
					version: 1,
					issuer: this.origin,
					entries: entries.map((item) => ({
						...item,
						client,
						status: "pending"
					}))
				}
			};
		});
		return this.parse(result);
	}
	/**
	* Remove one acknowledged intent while preserving concurrent additions.
	* @param id - successfully revoked intent.
	* @returns after removing only that intent and an unchanged empty journal.
	*/
	async remove(id) {
		const result = await this.modify((current) => {
			const entries = this.parse(current);
			if (!entries.some((item) => item.id === id)) return void 0;
			return {
				kind: "grant",
				payload: {
					version: 1,
					issuer: this.origin,
					entries: entries.filter((item) => item.id !== id)
				}
			};
		});
		if (result === void 0 || this.parse(result).length !== 0) return;
		await stored(() => this.credentials.deleteRecord(this.key, (current) => this.parse(current).length === 0));
	}
};
//#endregion
//#region lib/types/index.js
/** Platform PKCE account provider; browser approval never bypasses local cancellation. */
const renewal = z.object({
	id: z.uuid(),
	token: z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/),
	attempt: z.string().regex(/^[A-Za-z0-9._~-]{32,128}$/),
	refreshAfter: z.number().int().positive(),
	expiresAt: z.number().int().positive()
}).refine((value) => value.refreshAfter <= value.expiresAt);
const grant = z.object({
	version: z.literal(1),
	token: z.string().min(1),
	issuer: z.url(),
	renewal: renewal.optional()
});
const device = z.object({ id: z.uuid() });
function renewableGrant(issuer, access, refresh, expiresIn, id = randomUUID()) {
	const expiresAt = Date.now() + expiresIn * 1e3;
	return {
		version: 1,
		token: access,
		issuer,
		renewal: {
			id,
			token: refresh,
			attempt: randomBytes(24).toString("base64url"),
			expiresAt,
			refreshAfter: expiresAt - (expiresIn > 60 ? 6e4 : 0)
		}
	};
}
function profileBinding(stored) {
	return stored.renewal?.id ?? stored.token;
}
/** Validated deployment choices. */
const platformConfig = Schema.object({
	product: Schema.const("hey"),
	modelProviders: Schema.array(Schema.string().min(1)).min(1).default(["deepseek-account"]),
	credentialIdPrefix: Schema.string(),
	platformOrigin: Schema.string().default("https://platform.deepseek.com"),
	desktopPlatform: Schema.union([
		Schema.const("darwin"),
		Schema.const("win32"),
		Schema.const(null)
	]).default(null),
	embeddedPageDist: Schema.string().default(""),
	inferenceOrigin: Schema.string().default("https://api.deepseek.com"),
	allowLoopbackHttp: Schema.boolean().default(false),
	rewriteBrowserOrigin: Schema.boolean().default(false),
	requestHeaders: Schema.dict(Schema.string().role("secret")).default({}),
	accountRequestHeaders: Schema.dict(Schema.string().role("secret")).default({}),
	requestTimeoutMs: Schema.number().min(1).max(12e4).default(3e4),
	balanceTimeoutMs: Schema.number().min(1).max(12e4).default(3e4),
	logoutMaxRetries: Schema.number().min(0).max(5).step(1).default(5),
	logoutRetryDelayMs: Schema.number().min(1).max(6e4).default(1e3),
	attemptTimeoutMs: Schema.number().min(1).max(36e5).default(6e5)
});
/** The platform implementation owns login state and its opaque stored grant. */
var PlatformAccount = class extends DeepSeekAccount {
	static inject = ["credentials", "authorization"];
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
	revocations = /* @__PURE__ */ new Map();
	cancellations = /* @__PURE__ */ new Set();
	revocationStorageFailed = false;
	accessBlocked = false;
	attempt;
	listeners = /* @__PURE__ */ new Set();
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
		this.accountKey = credentialKey("deepseek-account-platform", prefix === void 0 ? "default" : `${prefix}-account`);
		this.deviceKey = credentialKey("deepseek-account-platform", prefix === void 0 ? "device" : `${prefix}-device`);
		this.logoutKey = credentialKey("deepseek-account-platform", prefix === void 0 ? "default-logout" : `${prefix}-logout`);
		const label = prefix === void 0 ? "DeepSeek" : "HeyWork";
		this.embeddedPageDist = resolved.embeddedPageDist;
		this.origin = platformOrigin(resolved.platformOrigin, resolved.allowLoopbackHttp);
		this.logoutJournal = new LogoutJournal(ctx.credentials, this.logoutKey, this.origin, () => {
			this.blockAccess();
		});
		const inference = new URL(resolved.inferenceOrigin);
		if (!["http:", "https:"].includes(inference.protocol) || inference.username || inference.password || inference.pathname !== "/" || inference.search || inference.hash) throw new Error("account: inferenceOrigin must be an HTTP(S) origin without credentials, path, query or fragment");
		this.inferenceOrigin = inference.origin;
		this.rewriteBrowserOrigin = resolved.rewriteBrowserOrigin;
		this.platform = resolved.desktopPlatform;
		this.requestHeaders = platformHeaders(resolved.requestHeaders);
		const accountHeaders = platformHeaders(resolved.accountRequestHeaders);
		this.accountRequestHeaders = {
			...this.requestHeaders,
			...accountHeaders
		};
		if (accountHeaders.cookie !== void 0) this.accountRequestHeaders.cookie = mergePlatformCookies(this.requestHeaders.cookie ?? "", accountHeaders.cookie);
		this.requestTimeout = resolved.requestTimeoutMs;
		this.balanceTimeout = resolved.balanceTimeoutMs;
		this.attemptTimeout = resolved.attemptTimeoutMs;
		this.logoutPolicy = {
			maxRetries: resolved.logoutMaxRetries,
			delayMs: resolved.logoutRetryDelayMs,
			requestTimeoutMs: this.requestTimeout
		};
		ctx.authorization.registerFlow({
			key: this.accountKey,
			label,
			methods: [{
				id: "browser",
				label
			}],
			run: (session) => {
				const attempt = this.attempt;
				if (attempt === void 0) return Promise.reject(new PlatformAuthError("protocol"));
				attempt.running = this.run(session, attempt);
				return attempt.running;
			}
		});
		ctx.on("credentials/record-updated", (key) => {
			if (key === this.logoutKey) {
				this.changed();
				this.resumeRevocations().catch(() => {
					this.revocationStorageFailure();
				});
				return;
			}
			if (key !== this.accountKey) return;
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
			if (active !== void 0) {
				if (active.view.phase !== "committing") active.controller.abort();
				await active.done;
			}
			await Promise.allSettled([
				this.removing,
				this.retrying,
				this.refreshing?.result,
				...this.revocations.values(),
				...this.cancellations
			]);
			this.changed();
		}, "account: active attempt lifetime");
	}
	async [Service.init]() {
		let pending;
		try {
			pending = await this.readLogoutJournal();
		} catch {
			this.revocationStorageFailure();
			return;
		}
		const record = await this.ctx.credentials.readRecord(this.accountKey);
		if (record !== void 0) {
			if (record.kind !== "grant") throw new PlatformAuthError("storage");
			const parsed = grant.safeParse(record.payload);
			if (!parsed.success) throw new PlatformAuthError("storage");
			if (parsed.data.issuer !== this.origin) await this.ctx.credentials.deleteRecord(this.accountKey, (current) => current.kind === "grant" && grant.safeParse(current.payload).data?.issuer === parsed.data.issuer);
		}
		for (const entry of pending) try {
			await this.removeRecordedGrant(entry);
			if (entry.status === "prepared") await this.logoutJournal.ready(entry.id);
			this.revoke(entry);
		} catch {
			this.revocationStorageFailure();
		}
	}
	async getState() {
		let pending;
		try {
			pending = await this.readLogoutJournal();
		} catch {
			pending = null;
		}
		const record = pending === null ? void 0 : await this.ctx.credentials.readRecord(this.accountKey);
		if (record !== void 0 && (record.kind !== "grant" || !grant.safeParse(record.payload).success)) throw new PlatformAuthError("storage");
		const stored = record?.kind === "grant" ? grant.parse(record.payload) : void 0;
		const locallyRemoved = stored === void 0 || pending?.some((entry) => entry.binding === profileBinding(stored)) === true;
		const failed = this.revocationStorageFailed || pending?.every((entry) => entry.status === "failed" && !this.revocations.has(entry.id)) === true;
		const attempt = this.attempt?.view ?? null;
		return {
			status: locallyRemoved ? "signed-out" : "credential-stored",
			...this.product === void 0 ? {} : { product: this.product },
			attempt: locallyRemoved && attempt?.phase === "succeeded" ? null : attempt,
			...pending === null ? { remoteSignOut: {
				status: "failed",
				count: null,
				errorCode: "storage"
			} } : pending.length === 0 ? {} : { remoteSignOut: {
				status: failed ? "failed" : "pending",
				count: pending.length,
				...failed ? { errorCode: this.revocationStorageFailed ? "storage" : "network" } : {}
			} },
			links: {
				usageUrl: new URL(this.product === "hey" ? HEY_PLATFORM_PATHS.usage : "/usage", this.origin).href,
				topUpUrl: new URL(HEY_PLATFORM_PATHS["top-up"], this.origin).href,
				...this.product === "hey" ? {
					securityUrl: new URL(HEY_PLATFORM_PATHS.security, this.origin).href,
					sdkKeysUrl: new URL(HEY_PLATFORM_PATHS["sdk-keys"], this.origin).href
				} : {}
			}
		};
	}
	async getProfile(client) {
		const active = await this.activeGrant();
		if (active === null) return null;
		const { lifetime, stored } = active;
		const result = await this.getDetail("profile", this.detailHeaders(client), {
			lifetime,
			stored
		});
		if (this.detailsLifetime !== lifetime) return null;
		if (result !== null) this.cacheProfile(profileBinding(stored), result);
		if (result?.status !== "failed") return result;
		return (this.lastProfile?.binding === profileBinding(stored) ? this.lastProfile.profile : void 0) ?? result;
	}
	getBalance(client) {
		return this.getDetail("balance", this.detailHeaders(client));
	}
	async getLedger(client, before) {
		const headers = this.detailHeaders(client);
		const active = await this.activeGrant();
		if (active === null) return null;
		const { lifetime, stored } = active;
		try {
			const page = await readLedger(this.origin, stored.token, before, AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers);
			return this.detailsLifetime === lifetime ? page : null;
		} catch (error) {
			if (this.detailsLifetime !== lifetime) return null;
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
		if (active === null) return null;
		const { lifetime, stored } = active;
		const accountId = await this.currentAccountId(lifetime, stored, headers);
		if (accountId === null) return null;
		try {
			return {
				accountId,
				bonuses: await readUnnotifiedBonuses(this.origin, stored.token, AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers)
			};
		} catch (error) {
			if (error instanceof AccountUnauthorizedError) {
				if (this.detailsLifetime === lifetime) await this.expireCredential(stored.token, lifetime);
				return null;
			}
			throw error;
		}
	}
	async ackBonusNotified(accountId, orderId, client) {
		const headers = this.detailHeaders(client);
		const active = await this.activeGrant();
		if (active === null) return false;
		const { lifetime, stored } = active;
		const current = await this.currentAccountId(lifetime, stored, headers);
		if (current === null || current !== accountId) return false;
		try {
			await sendBonusNotified(this.origin, stored.token, orderId, AbortSignal.any([lifetime.signal, AbortSignal.timeout(this.requestTimeout)]), headers);
			return true;
		} catch (error) {
			if (error instanceof AccountUnauthorizedError) {
				if (this.detailsLifetime === lifetime) await this.expireCredential(stored.token, lifetime);
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
		const binding = profileBinding(stored);
		if (this.lastProfile?.binding === binding) return this.identityOf(this.lastProfile.profile);
		const details = await this.getDetail("profile", headers, {
			lifetime,
			stored
		});
		if (details === null) return null;
		if (details.status === "failed") throw new PlatformAuthError("network");
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
		if (profile.status !== "ready") return;
		const previous = this.lastProfile?.profile.value.id || null;
		this.lastProfile = {
			binding,
			profile
		};
		if (previous !== (profile.value.id || null)) this.changed(true);
	}
	/**
	* @param profile - ready profile projected for the UI.
	* @returns the account identity it names.
	* @throws PlatformAuthError when the profile carries no stable Platform id, which cannot isolate notices.
	*/
	identityOf(profile) {
		if (profile.value.id === null) throw new PlatformAuthError("protocol");
		return profile.value.id;
	}
	async getDetail(field, headers, captured) {
		const active = captured ?? await this.activeGrant();
		if (active === null || active.lifetime.signal.aborted) return null;
		const { lifetime, stored } = active;
		if (field === "profile" && this.attempt?.initialProfile?.token === stored.token) {
			const initial = this.attempt.initialProfile.value;
			delete this.attempt.initialProfile;
			return initial;
		}
		try {
			const details = await readAccountDetail(field, this.origin, stored.token, AbortSignal.any([lifetime.signal, AbortSignal.timeout(field === "balance" ? this.balanceTimeout : this.requestTimeout)]), headers);
			return this.detailsLifetime !== lifetime ? null : details;
		} catch (_unauthorized) {
			if (this.detailsLifetime === lifetime) await this.expireCredential(stored.token, lifetime);
			return null;
		}
	}
	/** Deployment account headers plus the client identity headers derived from one call's metadata. */
	detailHeaders(client) {
		return {
			...this.accountRequestHeaders,
			...platformClientHeaders(this.platform, client)
		};
	}
	async rejectToken(token) {
		const lifetime = this.detailsLifetime;
		if ((await this.readCurrentGrant(lifetime))?.token !== token || this.detailsLifetime !== lifetime) return;
		await this.expireCredential(token, lifetime);
	}
	async expireCredential(token, lifetime) {
		this.removing ??= (async () => {
			if (this.attempt !== void 0) await this.cancelSignIn(this.attempt.view.id);
			const record = await this.ctx.credentials.readRecord(this.accountKey);
			if (this.closed || this.detailsLifetime !== lifetime || record?.kind !== "grant") return this.getState();
			const current = grant.parse(record.payload);
			if (current.token !== token || current.issuer !== this.origin) return this.getState();
			const deletion = { removed: false };
			await this.ctx.credentials.deleteRecord(this.accountKey, (record) => {
				const latest = record.kind === "grant" ? grant.safeParse(record.payload) : void 0;
				deletion.removed = latest?.success === true && latest.data.token === token && latest.data.issuer === this.origin;
				return deletion.removed;
			});
			if (!deletion.removed) return this.getState();
			this.lastProfile = void 0;
			this.ctx.emit("deepseek-account/session-expired");
			this.attempt = void 0;
			this.ctx.emit("deepseek-account/signed-out");
			this.changed();
			return this.getState();
		})().finally(() => {
			this.removing = void 0;
		});
		await this.removing;
	}
	async getDeviceIdentity() {
		const [record, session] = await Promise.all([this.ctx.credentials.readRecord(this.deviceKey), this.getPlatformSession()]);
		const parsed = record?.kind === "grant" ? device.safeParse(record.payload) : void 0;
		return {
			...parsed?.success ? { deviceId: parsed.data.id } : {},
			...session?.userId == null ? {} : { userId: session.userId },
			osVersion: deviceOsVersion()
		};
	}
	async getPlatformSession() {
		const lifetime = this.detailsLifetime;
		let stored = await this.readCurrentGrant(lifetime);
		if (stored === null || lifetime.signal.aborted || this.isUnavailable()) return null;
		const state = stored.renewal;
		if (this.product === "hey" && state !== void 0 && state.expiresAt <= Date.now()) {
			const expired = stored;
			try {
				stored = await this.refreshGrant(expired, state);
			} catch {
				if (this.detailsLifetime === lifetime) this.scheduleRefresh(expired, 15e3);
				return null;
			}
			if (stored === null || this.isUnavailable()) return null;
		}
		this.scheduleRefresh(stored);
		const requestHeaders = { ...this.accountRequestHeaders };
		return {
			origin: this.origin,
			token: stored.token,
			userId: this.lastProfile?.binding === profileBinding(stored) ? this.lastProfile.profile.value.id || null : null,
			...stored.renewal === void 0 ? {} : { sessionId: stored.renewal.id },
			...this.embeddedPageDist ? { embeddedPageDist: this.embeddedPageDist } : {},
			...this.product === "hey" ? { authenticatePage: true } : {},
			requestHeaders
		};
	}
	async readCurrentGrant(lifetime) {
		if (this.closed) return null;
		const record = await this.ctx.credentials.readRecord(this.accountKey);
		if (record === void 0 || lifetime.signal.aborted) return null;
		if (record.kind !== "grant") throw new PlatformAuthError("storage");
		const parsed = grant.safeParse(record.payload);
		if (!parsed.success) throw new PlatformAuthError("storage");
		if (parsed.data.issuer !== this.origin) throw new PlatformAuthError("protocol");
		if ((await this.readLogoutJournal()).some((entry) => entry.binding === profileBinding(parsed.data))) return null;
		return parsed.data;
	}
	async activeGrant() {
		const lifetime = this.detailsLifetime;
		const stored = await this.readCurrentGrant(lifetime);
		if (stored === null || this.isUnavailable()) return null;
		if (this.product !== "hey" || stored.renewal === void 0 || stored.renewal.refreshAfter > Date.now()) return {
			lifetime,
			stored
		};
		const fresh = await this.refreshGrant(stored, stored.renewal);
		if (fresh === null || this.isUnavailable()) return null;
		return {
			lifetime: this.detailsLifetime,
			stored: fresh
		};
	}
	refreshGrant(stored, state) {
		const pending = this.refreshing;
		if (pending !== void 0) {
			if (pending.id === state.id) return pending.result;
			return pending.result.catch(() => null).then(() => this.isUnavailable() ? null : this.refreshGrant(stored, state));
		}
		const controller = new AbortController();
		const result = this.rotateGrant(stored, state, controller.signal).finally(() => {
			if (this.refreshing?.result === result) this.refreshing = void 0;
		});
		this.refreshing = {
			id: state.id,
			controller,
			result
		};
		return result;
	}
	async rotateGrant(stored, state, cancellation) {
		let rejectedToken;
		const record = await this.ctx.credentials.modifyRecord(this.accountKey, async (current) => {
			if (this.isUnavailable() || current?.kind !== "grant") return void 0;
			const latest = grant.safeParse(current.payload);
			if (!latest.success) throw new PlatformAuthError("storage");
			const active = latest.data.renewal;
			if (latest.data.issuer !== this.origin || active?.id !== state.id || active.attempt !== state.attempt || active.refreshAfter > Date.now()) return void 0;
			const signal = AbortSignal.any([
				cancellation,
				this.logoutLifetime.signal,
				AbortSignal.timeout(Math.min(1e4, this.requestTimeout))
			]);
			try {
				const next = await refreshAccount(this.origin, active.token, active.attempt, signal, this.requestHeaders);
				return {
					kind: "grant",
					payload: renewableGrant(this.origin, next.access_token, next.refresh_token, next.expires_in, active.id)
				};
			} catch (error) {
				if (!(error instanceof AccountUnauthorizedError)) throw error;
				rejectedToken = latest.data.token;
				return;
			}
		});
		if (rejectedToken !== void 0) {
			if (this.removing === void 0) await this.expireCredential(rejectedToken, this.detailsLifetime);
			return null;
		}
		if (record?.kind !== "grant") return null;
		const latest = grant.safeParse(record.payload);
		if (!latest.success) throw new PlatformAuthError("storage");
		return latest.data.issuer === stored.issuer && latest.data.renewal?.id === state.id ? latest.data : null;
	}
	scheduleRefresh(stored, retryDelay = 0) {
		const state = stored.renewal;
		if (this.product !== "hey" || state === void 0 || this.isUnavailable()) return;
		clearTimeout(this.refreshTimer);
		const lifetime = this.detailsLifetime;
		this.refreshTimer = setTimeout(() => {
			this.refreshGrant(stored, state).catch(() => {
				if (!lifetime.signal.aborted) this.scheduleRefresh(stored, 15e3);
			});
		}, Math.max(retryDelay, state.refreshAfter - Date.now()));
		this.refreshTimer.unref();
	}
	async resolveToken(url) {
		if (this.isUnavailable()) return void 0;
		const destination = new URL(url);
		if (destination.origin !== this.inferenceOrigin || destination.username || destination.password) return void 0;
		const record = await this.ctx.credentials.readRecord(this.accountKey);
		if (record === void 0) return void 0;
		if (record.kind !== "grant") throw new PlatformAuthError("storage");
		const parsed = grant.safeParse(record.payload);
		if (!parsed.success) throw new PlatformAuthError("storage");
		const stored = parsed.data;
		if ((await this.readLogoutJournal()).some((entry) => entry.binding === profileBinding(stored))) return void 0;
		const issuer = new URL(stored.issuer);
		if (stored.token.startsWith("dsh_mock_")) return void 0;
		if (this.inferenceOrigin === "https://api.deepseek.com") {
			if ([
				"localhost",
				"127.0.0.1",
				"[::1]"
			].includes(issuer.hostname)) return void 0;
		} else if (issuer.origin !== this.origin) return void 0;
		if (this.product === "hey" && stored.renewal !== void 0 && stored.renewal.refreshAfter <= Date.now()) {
			const fresh = await this.refreshGrant(stored, stored.renewal);
			return this.isUnavailable() ? void 0 : fresh?.token;
		}
		return this.isUnavailable() ? void 0 : stored.token;
	}
	isUnavailable() {
		return this.closed || this.removing !== void 0;
	}
	async startSignIn(client, callbackOrigin, loginSource) {
		if (this.removing !== void 0) await this.removing;
		await this.readLogoutJournal();
		const origin = loginOrigin(callbackOrigin);
		if (this.closed) throw new PlatformAuthError("protocol");
		if (this.attempt !== void 0 && [
			"initializing",
			"waiting-browser",
			"exchanging",
			"committing"
		].includes(this.attempt.view.phase)) return this.getState();
		const previous = this.attempt;
		if (previous !== void 0) {
			await previous.done;
			if (this.closed) throw new PlatformAuthError("protocol");
			if (this.attempt !== previous) return this.getState();
		}
		const attempt = {
			origin,
			loginSource,
			locale: platformWireLocale(client.locale),
			clientHeaders: platformClientHeaders(this.platform, client),
			view: {
				id: randomUUID(),
				phase: "initializing"
			},
			controller: new AbortController(),
			done: Promise.resolve(),
			running: Promise.resolve()
		};
		this.attempt = attempt;
		attempt.done = this.ctx.authorization.begin({
			key: this.accountKey,
			signal: attempt.controller.signal,
			interaction: {
				notify: () => void 0,
				prompt: () => Promise.reject(new PlatformAuthError("protocol"))
			}
		}).then((outcome) => {
			this.update(attempt, { phase: outcome.status === "authorized" ? "succeeded" : "cancelled" });
			if (outcome.status === "authorized" && attempt.completionUrl !== void 0) attempt.callback?.writeHead(302, {
				location: attempt.completionUrl,
				"cache-control": "no-store"
			}).end();
			else attempt.callback?.writeHead(204, { "cache-control": "no-store" }).end();
		}).catch((error) => {
			const code = error instanceof PlatformAuthError ? error.code : "protocol";
			console.error("[deepseek-account] sign-in failed", { errorCode: code });
			this.update(attempt, {
				phase: code === "expired" ? "expired" : "failed",
				errorCode: code
			});
			this.finishFailedCallback(attempt);
		}).then(async () => {
			await attempt.running.catch(() => void 0);
			if (attempt.callback !== void 0) await promises.finished(attempt.callback, { cleanup: true }).catch(() => void 0);
			await attempt.disposeCallback?.();
		});
		this.changed();
		return this.getState();
	}
	async cancelSignIn(id) {
		const attempt = this.attempt;
		if (attempt?.view.id === id) {
			if (attempt.view.phase !== "committing") {
				attempt.controller.abort();
				this.ctx.authorization.cancel(this.accountKey);
			}
			await attempt.done;
		}
		return this.getState();
	}
	signOut(client) {
		this.removing ??= (async () => {
			if (this.closed) throw new PlatformAuthError("protocol");
			this.refreshing?.controller.abort();
			if (this.attempt !== void 0) {
				await this.cancelSignIn(this.attempt.view.id);
				this.attempt = void 0;
			}
			const record = await this.ctx.credentials.readRecord(this.accountKey);
			if (record !== void 0) {
				if (record.kind !== "grant") throw new PlatformAuthError("storage");
				const parsed = grant.safeParse(record.payload);
				if (!parsed.success) throw new PlatformAuthError("storage");
				if (parsed.data.issuer !== this.origin) throw new PlatformAuthError("protocol");
				const entry = {
					id: randomUUID(),
					token: parsed.data.renewal?.token ?? parsed.data.token,
					binding: profileBinding(parsed.data),
					client,
					status: "prepared"
				};
				await this.logoutJournal.append(entry);
				await this.removeRecordedGrant(entry);
				try {
					await this.logoutJournal.ready(entry.id);
				} catch {
					this.revocationStorageFailure();
					throw new PlatformAuthError("storage");
				}
				for (const pending of await this.readLogoutJournal()) if (pending.status === "pending") this.revoke(pending);
			}
			const state = await this.getState();
			this.changed();
			return state;
		})().finally(() => {
			this.removing = void 0;
		});
		return this.removing;
	}
	retrySignOut(client) {
		this.retrying ??= (async () => {
			if (this.closed) throw new PlatformAuthError("protocol");
			try {
				if (this.revocations.size > 0) return await this.getState();
				for (const entry of await this.readLogoutJournal()) await this.removeRecordedGrant(entry);
				const pending = await this.logoutJournal.retry(client);
				this.revocationStorageFailed = false;
				for (const entry of pending) this.revoke(entry);
				this.changed();
				return await this.getState();
			} catch (error) {
				this.revocationStorageFailure();
				throw error;
			}
		})().finally(() => {
			this.retrying = void 0;
		});
		return this.retrying;
	}
	async *watch(signal, includeIdentityChanges = false) {
		let dirty = true;
		let wake;
		const wakeUp = () => {
			dirty = true;
			wake?.();
		};
		const changed = (identityOnly) => {
			if (!identityOnly || includeIdentityChanges) wakeUp();
		};
		this.listeners.add(changed);
		signal.addEventListener("abort", wakeUp, { once: true });
		try {
			while (!this.closed && !signal.aborted) {
				if (dirty) {
					dirty = false;
					yield await this.getState();
					continue;
				}
				await new Promise((resolve) => {
					wake = resolve;
				});
			}
		} finally {
			this.listeners.delete(changed);
			signal.removeEventListener("abort", wakeUp);
		}
	}
	async resumeRevocations() {
		if (this.closed) return;
		for (const entry of await this.readLogoutJournal()) if (entry.status === "pending") this.revoke(entry);
	}
	async readLogoutJournal() {
		const entries = await this.logoutJournal.read();
		this.accessBlocked = false;
		return entries;
	}
	blockAccess() {
		if (this.closed || this.accessBlocked) return;
		this.accessBlocked = true;
		this.invalidateDetails();
		this.ctx.emit("deepseek-account/access-blocked");
	}
	async removeRecordedGrant(entry) {
		const deletion = { removed: false };
		try {
			await this.ctx.credentials.deleteRecord(this.accountKey, (current) => {
				if (current.kind !== "grant") throw new PlatformAuthError("storage");
				const parsed = grant.safeParse(current.payload);
				if (!parsed.success) throw new PlatformAuthError("storage");
				deletion.removed = parsed.data.issuer === this.origin && profileBinding(parsed.data) === entry.binding;
				return deletion.removed;
			});
		} catch {
			this.revocationStorageFailure();
			await this.blockUnconfirmedLocalRemoval(entry);
			throw new PlatformAuthError("storage");
		}
		if (!deletion.removed) return;
		let current;
		try {
			current = await this.ctx.credentials.readRecord(this.accountKey);
		} catch (_unreadable) {
			this.revocationStorageFailure();
			this.blockAccess();
			throw new PlatformAuthError("storage");
		}
		const replacement = current?.kind === "grant" ? grant.safeParse(current.payload) : void 0;
		if (replacement?.success && replacement.data.issuer === this.origin && profileBinding(replacement.data) !== entry.binding) return;
		if (this.lastProfile?.binding === entry.binding) this.lastProfile = void 0;
		this.ctx.emit("deepseek-account/signed-out");
		this.changed();
	}
	async blockUnconfirmedLocalRemoval(entry) {
		let current;
		try {
			current = await this.ctx.credentials.readRecord(this.accountKey);
		} catch (_unreadable) {
			this.blockAccess();
			return;
		}
		const parsed = current?.kind === "grant" ? grant.safeParse(current.payload) : void 0;
		if (parsed?.success && parsed.data.issuer === this.origin && profileBinding(parsed.data) !== entry.binding) return;
		this.blockAccess();
	}
	revocationStorageFailure() {
		if (this.closed) return;
		this.revocationStorageFailed = true;
		console.error("[deepseek-account] remote logout unconfirmed", { errorCode: "storage" });
		this.changed();
	}
	revoke(entry) {
		if (this.closed || this.revocations.has(entry.id)) return;
		const revocation = (async () => {
			const outcome = await revokeAccount(this.origin, entry.token, this.logoutPolicy, this.logoutLifetime.signal, {
				...this.requestHeaders,
				...platformClientHeaders(this.platform, entry.client)
			});
			if (outcome === "cancelled") return;
			if (outcome === "confirmed") {
				await this.removeRecordedGrant(entry);
				await this.logoutJournal.remove(entry.id);
				if ((await this.readLogoutJournal()).length === 0) this.revocationStorageFailed = false;
			} else await this.logoutJournal.fail(entry.id);
		})().catch(() => {
			this.revocationStorageFailure();
		}).finally(() => {
			this.revocations.delete(entry.id);
			this.changed();
		});
		this.revocations.set(entry.id, revocation);
	}
	invalidateDetails(clearProfile = true) {
		if (clearProfile) this.lastProfile = void 0;
		this.detailsLifetime.abort();
		this.detailsLifetime = new AbortController();
	}
	changed(identityOnly = false) {
		for (const listener of this.listeners) listener(identityOnly);
	}
	update(attempt, value) {
		const { authorizeUrl: _url, ...rest } = attempt.view;
		attempt.view = {
			...rest,
			...value
		};
		this.changed();
	}
	async run(session, attempt) {
		const webServer = this.ctx.get("webServer");
		if (webServer === void 0) throw new PlatformAuthError("protocol");
		const verifier = randomBytes(32).toString("base64url");
		const state = randomBytes(32).toString("base64url");
		const challenge = createHash("sha256").update(verifier).digest("base64url");
		let authorizeId;
		const code = Promise.withResolvers();
		code.promise.catch(() => void 0);
		const deadline = new AbortController();
		let expiresAt = Date.now() + this.attemptTimeout;
		const signal = AbortSignal.any([session.signal, deadline.signal]);
		let timer = setTimeout(() => {
			deadline.abort();
		}, this.attemptTimeout);
		const abort = () => {
			code.reject(new PlatformAuthError("expired"));
		};
		signal.addEventListener("abort", abort, { once: true });
		try {
			attempt.disposeCallback = this.ctx.effect(() => webServer.register({
				kind: "exact",
				path: "/oauth/callback",
				handler: (req, res) => {
					let url;
					try {
						url = new URL(req.url ?? "/", "http://127.0.0.1");
					} catch {
						res.writeHead(400, { "cache-control": "no-store" }).end();
						return;
					}
					const receivedCode = url.searchParams.get("code");
					const receivedState = url.searchParams.get("state") ?? "";
					const validState = Buffer.byteLength(receivedState) === Buffer.byteLength(state) && timingSafeEqual(Buffer.from(receivedState), Buffer.from(state));
					if (req.method !== "GET" || url.pathname !== "/oauth/callback" || !validState || !receivedCode || url.searchParams.getAll("state").length !== 1 || url.searchParams.getAll("code").length !== 1) {
						res.writeHead(400, { "cache-control": "no-store" }).end();
						return;
					}
					if (signal.aborted || attempt.callback !== void 0 || attempt.view.phase !== "waiting-browser") {
						res.writeHead(410, { "cache-control": "no-store" }).end();
						return;
					}
					attempt.callback = res;
					code.resolve(receivedCode);
				}
			}), "account: browser callback");
			signal.throwIfAborted();
			const redirectUri = `${attempt.origin}/oauth/callback`;
			const init = initialization.safeParse(await this.request("auth_init", {
				code_challenge: challenge,
				code_challenge_method: "S256",
				state,
				redirect_uri: redirectUri,
				locale: attempt.locale,
				login_source: attempt.loginSource
			}, signal, attempt.clientHeaders), { reportInput: true });
			if (!init.success) this.rejectPayload("auth_init", init.error);
			const authorizeUrl = browserUrl(init.data.authorize_url, this.origin, this.product === "hey" ? "/hey/authorize" : "/dsh/authorize", this.rewriteBrowserOrigin);
			authorizeId = init.data.authorize_id;
			signal.throwIfAborted();
			const now = Date.now();
			expiresAt = Math.min(expiresAt, now + init.data.expires_in * 1e3);
			const remaining = expiresAt - now;
			if (remaining <= 0) {
				deadline.abort();
				signal.throwIfAborted();
			}
			clearTimeout(timer);
			timer = setTimeout(() => {
				deadline.abort();
			}, remaining);
			this.update(attempt, {
				phase: "waiting-browser",
				authorizeUrl,
				expiresAt
			});
			const receivedCode = await code.promise;
			signal.throwIfAborted();
			this.update(attempt, { phase: "exchanging" });
			const deviceRecord = await this.ctx.credentials.modifyRecord(this.deviceKey, (current) => Promise.resolve(current === void 0 ? {
				kind: "grant",
				payload: { id: randomUUID() }
			} : void 0));
			if (deviceRecord?.kind !== "grant") throw new PlatformAuthError("storage");
			const identity = device.parse(deviceRecord.payload);
			const result = exchange.safeParse(await this.request("auth_exchange", {
				code: receivedCode,
				code_verifier: verifier,
				redirect_uri: redirectUri,
				device_id: identity.id,
				device_model: `${platform()}-${arch()}`,
				os_version: deviceOsVersion()
			}, signal, {
				...attempt.clientHeaders,
				...this.product === "hey" ? { "x-hey-token-mode": "rotate-v1" } : {}
			}), { reportInput: true });
			if (!result.success) this.rejectPayload("auth_exchange", result.error);
			const completionUrl = new URL(browserUrl(result.data.authorized_url, this.origin, this.product === "hey" ? "/hey/authorized" : "/dsh/authorized", this.rewriteBrowserOrigin));
			completionUrl.searchParams.set("login_source", attempt.loginSource);
			attempt.completionUrl = completionUrl.href;
			if (Date.now() >= expiresAt) deadline.abort();
			signal.throwIfAborted();
			if (result.data.user != null) try {
				attempt.initialProfile = {
					token: result.data.token,
					value: {
						status: "ready",
						value: profile(result.data.user)
					}
				};
			} catch {}
			this.update(attempt, { phase: "committing" });
			clearTimeout(timer);
			await this.readLogoutJournal();
			const payload = this.product === "hey" && result.data.refresh_token !== void 0 && result.data.expires_in !== void 0 ? renewableGrant(this.origin, result.data.token, result.data.refresh_token, result.data.expires_in) : {
				version: 1,
				token: result.data.token,
				issuer: this.origin
			};
			try {
				await session.commit({
					kind: "grant",
					payload
				});
			} catch {
				throw new PlatformAuthError("storage");
			}
		} catch (error) {
			if (deadline.signal.aborted) throw new PlatformAuthError("expired");
			throw error;
		} finally {
			if (signal.aborted && authorizeId !== void 0) this.cancelRequest(authorizeId, verifier, attempt.clientHeaders);
			clearTimeout(timer);
			signal.removeEventListener("abort", abort);
		}
	}
	rejectPayload(stage, error) {
		console.error("[deepseek-account] payload rejected", {
			stage,
			issues: error.issues.map((issue) => ({
				path: issue.path,
				code: issue.code,
				receivedType: issue.input === null ? "null" : Array.isArray(issue.input) ? "array" : typeof issue.input
			}))
		});
		throw new PlatformAuthError("protocol");
	}
	cancelRequest(authorizeId, verifier, headers) {
		if (this.closed) return;
		const cancellation = this.request("auth_cancel", {
			authorize_id: authorizeId,
			code_verifier: verifier
		}, this.logoutLifetime.signal, headers).then(() => void 0, () => {}).finally(() => {
			this.cancellations.delete(cancellation);
		});
		this.cancellations.add(cancellation);
	}
	request(method, body, signal, headers) {
		return requestPlatform(this.origin, method, body, AbortSignal.any([signal, AbortSignal.timeout(this.requestTimeout)]), {
			...this.requestHeaders,
			...headers
		}, this.product === "hey" ? "hey" : "dsh");
	}
	finishFailedCallback(attempt) {
		if (attempt.loginSource === "web") {
			const nonce = randomBytes(16).toString("base64url");
			const message = attempt.locale === "zh_CN" ? "登录失败，请关闭此标签页并在原页面重试。" : "Sign-in failed. Close this tab and try again in the original tab.";
			attempt.callback?.writeHead(200, {
				"content-type": "text/html; charset=utf-8",
				"cache-control": "no-store",
				"content-security-policy": `default-src 'none'; script-src 'nonce-${nonce}'; frame-ancestors 'none'`,
				"referrer-policy": "no-referrer"
			}).end(`<!doctype html><html lang="${attempt.locale === "zh_CN" ? "zh-CN" : "en"}"><meta charset="utf-8"><title>${message}</title><body><p>${message}</p><script nonce="${nonce}">window.close()<\/script></body></html>`);
		} else attempt.callback?.writeHead(204, { "cache-control": "no-store" }).end();
	}
};
/** OS identification shared by login and credential-free identity reads. */
function deviceOsVersion() {
	return `${platform()} ${release()}`;
}
//#endregion
export { PlatformAccount, PlatformAccount as default };
