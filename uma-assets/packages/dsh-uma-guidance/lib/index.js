import { createHash } from "node:crypto";
import { brandString } from "@deepseek-ai/dsh-brand";
import z from "@deepseek-ai/schemastery";
import { ToolContextUnavailableError, defineTool } from "@deepseek-ai/dsh-tools";
import { assertNever } from "@deepseek-ai/dsh-util-values";
import { z as z$1 } from "zod";
import { ProviderRequestId } from "@deepseek-ai/dsh-llm";
//#region lib/types/client.js
/** Bounded, issuer-bound transport for public UMA guidance receipts. No private library document is accepted. */
const capability = z$1.enum([
	"engineering",
	"design",
	"review"
]);
const file = z$1.object({
	path: z$1.string().min(1).max(240).refine((value) => !value.startsWith("/") && !/[\\:\0\r\n]/u.test(value) && value.split("/").every((part) => part !== "" && part !== "." && part !== ".." && part !== ".git")),
	content: z$1.string().max(131072)
}).strict();
const result = z$1.object({
	summary: z$1.string().min(1).max(8192),
	recommendations: z$1.array(z$1.string().min(1).max(8192)).max(32),
	files: z$1.array(file).max(16)
}).strict();
const receipt = z$1.object({
	id: z$1.uuid().transform((value) => brandString(value)),
	source_digest: z$1.string().regex(/^[a-f0-9]{64}$/u),
	model_id: z$1.string().min(1).max(128),
	protocol: z$1.enum([
		"messages",
		"chat_completions",
		"responses",
		"gemini"
	]).optional(),
	reasoning_effort: z$1.enum([
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"max"
	]).optional(),
	task_id: z$1.uuid().transform((value) => brandString(value)),
	request_id: z$1.uuid().transform(ProviderRequestId).optional(),
	status: z$1.enum([
		"queued",
		"running",
		"completed",
		"failed",
		"unknown",
		"cancelled"
	]),
	result: result.optional(),
	failure_code: z$1.string().regex(/^[A-Z0-9_]{1,80}$/u).optional(),
	created_at: z$1.iso.datetime({ offset: true })
}).strict().refine((value) => value.status === "completed" === (value.result !== void 0));
const capabilities = z$1.object({
	data: z$1.array(z$1.object({
		id: capability,
		revision: z$1.number().int().positive(),
		available: z$1.boolean(),
		max_output_tokens: z$1.number().int().min(256).max(16384)
	}).strict()).max(3),
	billing: z$1.literal("selected_managed_model"),
	additional_requests: z$1.literal(1)
}).strict().refine((value) => new Set(value.data.map((item) => item.id)).size === value.data.length);
/** Safe failure classification without response bodies or credentials. */
var GuidanceTransportError = class extends Error {
	code;
	status;
	/**
	* @param code - Safe failure category.
	* @param status - Optional HTTP status without response content.
	*/
	constructor(code, status) {
		super(`UMA guidance ${code}`);
		this.code = code;
		this.status = status;
	}
};
/**
* Admit one canonical UMA destination at plugin load.
* @param config - Deployment origin and explicit loopback allowance.
* @returns the exact canonical origin.
*/
function guidanceOrigin(config) {
	let url;
	try {
		url = new URL(config.origin);
	} catch {
		throw new Error("UMA guidance requires a canonical platform origin");
	}
	if (url.origin !== config.origin || url.username !== "" || url.password !== "" || url.protocol !== "https:" && !(config.allowLoopbackHttp && url.protocol === "http:" && url.hostname === "127.0.0.1")) throw new Error("UMA guidance requires canonical HTTPS or an explicitly enabled IPv4 loopback origin");
	return url.origin;
}
/**
* Bind a recoverable operation name to its owning Session.
* @param sessionId - Actual calling Session, never a model argument.
* @param operationId - Model-visible name retained in the tool call even after cancellation.
* @returns stable issuer idempotency key with no raw local identifiers.
*/
function guidanceOperationKey(sessionId, operationId) {
	if (!/^[A-Za-z0-9_-]{8,64}$/u.test(operationId)) throw new Error("Use an operation_id containing 8–64 letters, digits, underscores or hyphens");
	return brandString(createHash("sha256").update(`${sessionId}\0${operationId}`).digest("hex"));
}
/**
* Read bounded JSON without exposing parse errors that might contain private server output.
* @param response - Owned response.
* @param maximum - Complete byte cap.
* @returns decoded untrusted JSON.
*/
async function readJson(response, maximum) {
	if (response.headers.get("content-type")?.split(";", 1)[0]?.trim() !== "application/json") {
		await response.body?.cancel();
		throw new GuidanceTransportError("invalid-response");
	}
	const reader = response.body?.getReader();
	if (reader === void 0) throw new GuidanceTransportError("invalid-response");
	const chunks = [];
	let bytes = 0;
	try {
		while (true) {
			const next = await reader.read();
			if (next.done) break;
			bytes += next.value.byteLength;
			if (bytes > maximum) {
				await reader.cancel();
				throw new GuidanceTransportError("invalid-response");
			}
			chunks.push(next.value);
		}
	} finally {
		reader.releaseLock();
	}
	try {
		return JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch {
		throw new GuidanceTransportError("invalid-response");
	}
}
/** One origin-bound client. POST submission is never automatically replayed. */
var GuidanceClient = class {
	config;
	origin;
	/** @param config - Validated deployment limits and canonical issuer. */
	constructor(config) {
		this.config = config;
		this.origin = guidanceOrigin(config);
	}
	async call(path, method, identity, signal, key, body, recovery = false) {
		signal.throwIfAborted();
		if (!await identity.current()) throw new GuidanceTransportError("account-changed");
		const headers = new Headers(identity.headers);
		headers.set("authorization", `Bearer ${identity.token}`);
		headers.set("content-type", "application/json");
		if (key !== void 0) headers.set("idempotency-key", key);
		let response;
		try {
			response = await fetch(this.origin + path, {
				method,
				redirect: "error",
				headers,
				signal: AbortSignal.any([signal, AbortSignal.timeout(recovery ? this.config.recoveryTimeoutMs : this.config.requestTimeoutMs)]),
				...body === void 0 ? {} : { body: JSON.stringify(body) }
			});
		} catch {
			throw new GuidanceTransportError("outcome-unknown");
		}
		if (!response.ok) {
			await response.body?.cancel();
			throw new GuidanceTransportError(response.status === 401 || response.status === 403 ? "unauthorized" : response.status === 404 ? "not-found" : response.status < 500 ? "rejected" : "outcome-unknown", response.status);
		}
		let value;
		try {
			value = await readJson(response, this.config.maxResponseBytes);
		} catch (error) {
			if (error instanceof GuidanceTransportError) throw error;
			throw new GuidanceTransportError("outcome-unknown");
		}
		if (!await identity.current()) throw new GuidanceTransportError("account-changed");
		return value;
	}
	parseReceipt(value) {
		const parsed = receipt.safeParse(value);
		if (!parsed.success) throw new GuidanceTransportError("invalid-response");
		return parsed.data;
	}
	/**
	* Read public specialist availability without a model request.
	* @param identity - Captured account.
	* @param signal - Caller lifetime.
	* @returns public capability and billing metadata.
	*/
	async availability(identity, signal) {
		const parsed = capabilities.safeParse(await this.call("/v1/private-guidance/capabilities", "GET", identity, signal, void 0, void 0, true));
		if (!parsed.success) throw new GuidanceTransportError("invalid-response");
		return parsed.data;
	}
	/**
	* Submit one explicitly authorized managed-model request without retry.
	* @param input - User task and captured source version.
	* @param key - Session-owned operation key.
	* @param identity - Captured grant.
	* @param signal - Caller lifetime.
	* @returns validated public receipt.
	*/
	async submit(input, key, identity, signal) {
		const value = this.parseReceipt(await this.call("/v1/private-guidance", "POST", identity, signal, key, input));
		if (value.reasoning_effort !== input.reasoning_effort || value.protocol !== input.protocol || value.source_digest !== input.source_digest || value.model_id !== input.model_id || value.task_id !== input.task_id) throw new GuidanceTransportError("invalid-response");
		return value;
	}
	/**
	* Recover only an existing operation; never creates or bills work.
	* @param key - Current Session's operation key.
	* @param identity - Captured account.
	* @param signal - Read lifetime.
	* @returns an existing public receipt.
	*/
	async lookup(key, identity, signal) {
		return this.parseReceipt(await this.call("/v1/private-guidance/by-key", "GET", identity, signal, key, void 0, true));
	}
	/**
	* Request cancellation without claiming that upstream execution or billing has stopped.
	* @param id - Run obtained from an owned lookup.
	* @param identity - Captured account.
	* @param signal - Bounded cancellation lifetime.
	* @returns current server state, which may still be running or unknown.
	*/
	async cancel(id, identity, signal) {
		return this.parseReceipt(await this.call(`/v1/private-guidance/${id}/cancel`, "POST", identity, signal, void 0, void 0, true));
	}
};
//#endregion
//#region lib/types/index.js
/** Session-owned UMA specialist requests with source freshness and independent local write permissions. */
/** Validated origin and deadlines; deployment choices remain configurable. */
const Config = z.object({
	origin: z.string().min(1),
	allowLoopbackHttp: z.boolean().default(false),
	requestTimeoutMs: z.number().step(1).min(1e3).max(6e5).default(33e4),
	recoveryTimeoutMs: z.number().step(1).min(1e3).max(3e4).default(1e4),
	maxResponseBytes: z.number().step(1).min(1024).max(2097152).default(1048576)
});
/** Cordis plugin identity. */
const name = "uma-guidance";
/** Account, budget and source owners must outlive this consumer's active operations. */
const inject = [
	"tools",
	"deepseekAccount",
	"umaTaskBudgets",
	"codingWorkbench",
	"workspaceRegistry"
];
/**
* Register a public guidance tool without exposing or installing the private corpus locally.
* @param ctx - Scoped Host services.
* @param config - Validated UMA origin and resource bounds.
*/
function apply(ctx, config) {
	const client = new GuidanceClient(config);
	const origin = config.origin;
	const lifetime = new AbortController();
	const pending = /* @__PURE__ */ new Set();
	ctx.effect(() => async () => {
		lifetime.abort();
		await Promise.allSettled([...pending]);
	}, "uma-guidance: owned requests");
	async function run(args, exec) {
		const agent = exec.agent;
		if (agent === void 0) throw new ToolContextUnavailableError("UMA guidance requires a calling Session");
		const signal = AbortSignal.any([exec.signal, lifetime.signal]);
		const account = ctx.deepseekAccount;
		let session;
		try {
			session = await account.getPlatformSession();
		} catch (_unavailable) {
			return {
				status: "failed",
				message: "The UMA account is unavailable; no guidance request was submitted."
			};
		}
		if (session === null || session.origin !== origin || session.authenticatePage !== true) return {
			status: "failed",
			message: "Sign in to the configured UMA account before requesting managed guidance."
		};
		const identity = {
			token: session.token,
			...session.requestHeaders === void 0 ? {} : { headers: session.requestHeaders },
			current: async () => await account.resolveToken(origin) === session.token
		};
		const failure = (status, message) => ({
			status,
			message,
			...args.operation_id === void 0 ? {} : { operation_id: args.operation_id }
		});
		const workspace = ctx.workspaceRegistry.list().find((value) => value.sessionIds.includes(agent.id));
		const source = async () => {
			if (workspace === void 0) throw new ToolContextUnavailableError("Import the current workspace before requesting guidance");
			const observed = await ctx.codingWorkbench.doctor({
				workspaceId: workspace.id,
				sessionId: agent.id
			}, signal);
			if (!observed.fingerprint.complete) throw new ToolContextUnavailableError("Source inspection is incomplete; guidance cannot be bound to the current source");
			return createHash("sha256").update(`${workspace.id}\0${observed.fingerprint.digest}`).digest("hex");
		};
		const present = async (receipt) => {
			switch (receipt.status) {
				case "completed": {
					const observed = await source();
					if (!await identity.current()) throw new GuidanceTransportError("account-changed");
					if (observed !== receipt.source_digest) return {
						...failure("stale", "The source changed. This result is stale and has been withheld; inspect the current source before a new request."),
						details: JSON.stringify({
							id: receipt.id,
							request_id: receipt.request_id,
							model_id: receipt.model_id,
							protocol: receipt.protocol,
							task_id: receipt.task_id,
							source_digest: receipt.source_digest
						})
					};
					return {
						status: "completed",
						message: "Task-specific guidance received. It is a recommendation, not executed work or permission to write files.",
						...args.operation_id === void 0 ? {} : { operation_id: args.operation_id },
						details: JSON.stringify(receipt)
					};
				}
				case "queued":
				case "running": return {
					status: "pending",
					message: "The original operation is still running. Use status with the same operation_id; do not start another request.",
					...args.operation_id === void 0 ? {} : { operation_id: args.operation_id }
				};
				case "failed": return failure("failed", "Guidance could not be delivered. Check UMA usage for any accepted charge before retrying; no result should be treated as validated work.");
				case "unknown": return failure("unknown", "The execution outcome is unconfirmed. Check UMA usage and recover this operation; do not automatically resubmit it.");
				case "cancelled": return {
					status: "cancelled",
					message: "The operation is cancelled. Consult UMA usage for its accounting state.",
					...args.operation_id === void 0 ? {} : { operation_id: args.operation_id }
				};
				default: return assertNever(receipt.status);
			}
		};
		try {
			switch (args.action) {
				case "capabilities": return {
					status: "available",
					message: "Managed guidance makes one additional inference request at the selected UMA model rate and uses this Session’s task budget. Custom-model traffic is not rerouted.",
					details: JSON.stringify(await client.availability(identity, signal))
				};
				case "request":
				case "status":
				case "cancel": break;
				default: return assertNever(args.action);
			}
			if (args.operation_id === void 0) return failure("failed", "Supply a stable operation_id for request, status or cancel.");
			const key = guidanceOperationKey(agent.id, args.operation_id);
			if (args.action === "status") return await present(await client.lookup(key, identity, signal));
			if (args.action === "cancel") {
				const receipt = await client.lookup(key, identity, signal);
				return await present(await client.cancel(receipt.id, identity, signal));
			}
			const model = agent.model.current();
			if (args.mode !== "managed" || model === void 0 || ![
				"uma-messages",
				"uma-chat-completions",
				"uma-responses",
				"uma-gemini",
				"deepseek-account"
			].includes(model.provider)) return failure("failed", "Managed guidance requires mode=managed and an already selected UMA account model. Keep BYOK work local or let the user choose a managed model; do not silently switch.");
			if (args.capability === void 0 || args.task === void 0 || args.task.trim() === "" || Buffer.byteLength(args.task) > 65536) return failure("failed", "Supply a capability and 1–65536 UTF-8 bytes of task text. Do not include credentials or unrelated workspace files.");
			if (!(await client.availability(identity, signal)).data.some((value) => value.id === args.capability && value.available)) return failure("failed", "The requested guidance capability is unavailable. Do not claim its references were used.");
			const digest = await source();
			const budget = await ctx.umaTaskBudgets.prepare({
				origin,
				token: session.token,
				sessionId: agent.id,
				kind: "device"
			}, signal);
			try {
				return await present(await client.submit({
					private_execution: true,
					capability: args.capability,
					model_id: model.model,
					...model.reasoningEffort === void 0 ? {} : { reasoning_effort: model.reasoningEffort },
					protocol: model.provider === "uma-responses" ? "responses" : model.provider === "uma-gemini" ? "gemini" : model.provider === "uma-chat-completions" ? "chat_completions" : "messages",
					task_id: brandString(budget.taskId),
					source_digest: digest,
					input: args.task
				}, key, identity, signal));
			} catch (error) {
				if (signal.aborted) {
					const cleanup = AbortSignal.timeout(config.recoveryTimeoutMs);
					const cancelKnown = async () => {
						const receipt = await client.lookup(key, identity, cleanup);
						await client.cancel(receipt.id, identity, cleanup);
					};
					try {
						await cancelKnown();
					} catch (_unconfirmed) {}
					signal.throwIfAborted();
				}
				if (error instanceof GuidanceTransportError && (error.code === "outcome-unknown" || error.code === "invalid-response")) try {
					return await present(await client.lookup(key, identity, signal));
				} catch (_unconfirmed) {
					return failure("unknown", "Submission could not be confirmed. Recover using status and the same operation_id; do not automatically repeat request.");
				}
				throw error;
			}
		} catch (error) {
			signal.throwIfAborted();
			if (error instanceof GuidanceTransportError && error.code === "account-changed") return failure("failed", "The UMA account changed or its grant was refreshed. Results from the previous grant are withheld; check the active account and use status with the same operation_id.");
			if (error instanceof GuidanceTransportError && error.code === "not-found") return args.action === "status" || args.action === "cancel" ? failure("unknown", "No owned receipt is currently available. This does not prove an interrupted submission was never accepted.") : failure("failed", "The UMA server does not provide the requested guidance operation. No new guidance result is available; ordinary local development remains available.");
			return failure("failed", "UMA guidance is unavailable. Check the account, workspace and task budget; ordinary local development remains available.");
		}
	}
	ctx.tools.register(defineTool({
		name: "uma_guidance",
		description: "Request task-specific engineering, design or review guidance from UMA. First inspect capabilities and pricing. Request adds one billed call using the already selected UMA model and this Session’s budget; mode=managed is required. Send only task-relevant user-owned text. Give each new intent a unique 8–64 character operation_id (letters, digits, _ or -). Recover uncertain requests with status and the same operation_id, never automatic resubmission. Returned files are proposals requiring ordinary local permission and review. This tool does not expose internal resources or run project checks.",
		timeoutMs: config.requestTimeoutMs + 3 * config.recoveryTimeoutMs,
		parameters: {
			action: {
				type: "string",
				required: true,
				enum: [
					"capabilities",
					"request",
					"status",
					"cancel"
				]
			},
			operation_id: {
				type: "string",
				description: "Stable name for this intent, scoped to the calling Session."
			},
			capability: {
				type: "string",
				enum: [
					"engineering",
					"design",
					"review"
				]
			},
			task: {
				type: "string",
				description: "Task and relevant excerpts, without credentials or unrelated files."
			},
			mode: {
				type: "string",
				enum: ["managed"],
				description: "Explicitly use the current UMA model and task budget."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					status: {
						type: "string",
						required: true,
						enum: [
							"available",
							"completed",
							"pending",
							"failed",
							"unknown",
							"stale",
							"cancelled"
						]
					},
					message: {
						type: "string",
						required: true
					},
					operation_id: { type: "string" },
					details: { type: "string" }
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `${value.message}${value.details === void 0 ? "" : `\n${value.details}`}`
			}]
		},
		execute(args, exec) {
			const operation = run(args, exec);
			pending.add(operation);
			operation.then(() => pending.delete(operation), () => pending.delete(operation));
			return operation;
		},
		presentCall: (args) => ({
			card: "generic",
			title: "UMA guidance",
			kind: "other",
			rawInput: args
		})
	}));
}
//#endregion
export { Config, apply, inject, name };
