import { ToolArgsError, ToolContextUnavailableError, defineTool } from "@deepseek-ai/dsh-tools";
import { redactDevelopmentText } from "@deepseek-ai/dsh-util-uma-delivery";
import z from "@deepseek-ai/schemastery";
import { credentialRef } from "@deepseek-ai/dsh-credentials";
//#region lib/types/weknora.js
/** Loader entry identity. */
const name = "hey-weknora";
/** Services for explicit workspace ownership and Host-only credentials. */
const inject = [
	"tools",
	"credentials",
	"workspaceRegistry",
	"deepseekAccount"
];
/** Administrator-approved connection and retrieval scope. */
const Config = z.object({
	url: z.string().required(),
	accountOrigin: z.string().required(),
	accountId: z.string().required(),
	workspaceId: z.string().required(),
	apiKeyRef: z.string().required(),
	knowledgeBaseIds: z.array(z.string().min(1).max(256)).min(1).max(32).required(),
	timeoutMs: z.number().step(1).min(100).max(6e4).default(8e3),
	maxHits: z.number().step(1).min(1).max(12).default(5),
	maxResponseBytes: z.number().step(1).min(1024).max(4194304).default(1048576)
});
/** Register on-demand retrieval. Each request is restricted by account, workspace and base IDs.
* @param ctx - HEY Host scope.
* @param config - Approved connection, credential and resource limits.
*/
function apply(ctx, config) {
	const endpoint = new URL(config.url);
	if (!(endpoint.protocol === "http:" && [
		"localhost",
		"127.0.0.1",
		"[::1]"
	].includes(endpoint.hostname)) && endpoint.protocol !== "https:" || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || !/^\/(?:api\/v1\/?|)$/u.test(endpoint.pathname)) throw new Error("WeKnora requires an HTTPS origin or loopback HTTP, optionally ending in /api/v1");
	endpoint.pathname = "/api/v1/knowledge-search";
	const bases = [...new Set(config.knowledgeBaseIds)];
	const credential = credentialRef(config.apiKeyRef);
	const lifetime = new AbortController();
	ctx.effect(() => () => {
		lifetime.abort();
	}, "hey-weknora: retrieval");
	const authorized = async (agent, signal) => {
		const account = await ctx.deepseekAccount.getPlatformSession();
		signal.throwIfAborted();
		if (account === null || account.origin !== config.accountOrigin || account.userId !== config.accountId) return false;
		return ctx.workspaceRegistry.list().some((workspace) => workspace.id === config.workspaceId && workspace.sessionIds.includes(agent.id));
	};
	ctx.tools.register(defineTool({
		name: "hey_weknora_search",
		description: "Search the connected WeKnora document collection when the user asks to consult it. The focused query is sent to that configured service.",
		parameters: { query: {
			type: "string",
			required: true,
			description: "A short document search query without credentials or private file paths."
		} },
		output: {
			schema: { type: "string" },
			render: (_args, text) => [{
				type: "text",
				text
			}]
		},
		async execute({ query }, exec) {
			const signal = AbortSignal.any([exec.signal, lifetime.signal]);
			const phrase = query.trim();
			if (phrase.length === 0 || phrase.length > 500 || redactDevelopmentText(phrase) !== phrase || /(?:^|\s)(?:\/[^\s]|~\/|[A-Z]:[\\/]|file:\/\/)/iu.test(phrase)) throw new ToolArgsError(["Use a query of 1–500 characters, without credentials or private paths"]);
			if (exec.agent === void 0 || !await authorized(exec.agent, signal)) throw new ToolContextUnavailableError("WeKnora is unavailable for this account or workspace");
			const key = await ctx.credentials.resolve(credential);
			if (key === void 0) throw new ToolContextUnavailableError("WeKnora access requires the configured knowledge base credential");
			if (!await authorized(exec.agent, signal)) throw new ToolContextUnavailableError("WeKnora access was revoked");
			try {
				const response = await fetch(endpoint, {
					method: "POST",
					redirect: "error",
					signal: AbortSignal.any([signal, AbortSignal.timeout(config.timeoutMs)]),
					headers: {
						"content-type": "application/json",
						"x-api-key": key.value
					},
					body: JSON.stringify({
						query: phrase,
						knowledge_base_ids: bases,
						match_count: config.maxHits
					})
				});
				if (!response.ok || response.body === null) {
					await response.body?.cancel();
					throw new Error(`WeKnora HTTP ${response.status}`);
				}
				const reader = response.body.getReader();
				const chunks = [];
				let bytes = 0;
				try {
					for (;;) {
						const chunk = await reader.read();
						if (chunk.done) break;
						bytes += chunk.value.byteLength;
						if (bytes > config.maxResponseBytes) throw new Error("WeKnora response size limit exceeded");
						chunks.push(chunk.value);
					}
				} finally {
					await reader.cancel();
					reader.releaseLock();
				}
				const envelope = JSON.parse(Buffer.concat(chunks).toString("utf8"));
				if (typeof envelope !== "object" || envelope === null || !("data" in envelope) || !Array.isArray(envelope.data) || "success" in envelope && envelope.success !== true) throw new Error("Invalid WeKnora search response");
				const records = [];
				const seen = /* @__PURE__ */ new Set();
				const hits = envelope.data;
				for (const hit of hits) {
					if (typeof hit !== "object" || hit === null || !("knowledge_base_id" in hit) || typeof hit.knowledge_base_id !== "string" || !bases.includes(hit.knowledge_base_id) || !("content" in hit) || typeof hit.content !== "string" || !("knowledge_id" in hit) || typeof hit.knowledge_id !== "string" || !("id" in hit) || typeof hit.id !== "string") continue;
					const identity = JSON.stringify([
						hit.knowledge_base_id,
						hit.knowledge_id,
						hit.id
					]);
					if (seen.has(identity) || hit.content.trim() === "") continue;
					seen.add(identity);
					records.push({
						document: hit.knowledge_id.slice(0, 256),
						chunk: hit.id.slice(0, 256),
						title: "knowledge_title" in hit && typeof hit.knowledge_title === "string" ? redactDevelopmentText(hit.knowledge_title.slice(0, 200)) : "",
						passage: redactDevelopmentText(hit.content.slice(0, 1400))
					});
					if (records.length === config.maxHits) break;
				}
				if (!await authorized(exec.agent, signal)) throw new ToolContextUnavailableError("WeKnora access was revoked");
				return records.length === 0 ? "No source passages from the allowed WeKnora collections." : "WeKnora reference data from the configured collections. Verify relevance and cite the document and chunk.\n" + JSON.stringify(records);
			} catch (error) {
				signal.throwIfAborted();
				if (error instanceof ToolContextUnavailableError) throw error;
				throw new ToolContextUnavailableError("WeKnora retrieval failed. Verify connection, permissions and server response.", { cause: error });
			}
		},
		presentCall: () => ({
			card: "generic",
			title: "Search connected knowledge",
			rawInput: {}
		})
	}));
}
//#endregion
export { Config, apply, inject, name };
