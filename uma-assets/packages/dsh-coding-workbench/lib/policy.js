import { a as isMutationTool, i as extractEditedPaths, n as committedCheckAllowsRepair, o as parseToolArguments, r as committedCheckPassed, t as checkSettlesDebt } from "./verification-2nCn2WCk.js";
import z from "@deepseek-ai/schemastery";
import { z as z$1 } from "zod";
import { SessionSeq } from "@deepseek-ai/dsh-session";
import { ToolCallId, createUserMessage } from "@deepseek-ai/dsh-llm";
import { TOOL_ABORTED_BEFORE_DISPATCH } from "@deepseek-ai/dsh-tools";
//#region lib/types/policy-state.js
/** Host-only edit verification obligations folded from native and PTC Session tool records. */
/** A policy denial never invokes the mutation body. */
const EDIT_CHECK_REQUIRED = "CODING_CHECK_REQUIRED";
const sequence = z$1.number().int().nonnegative().transform(SessionSeq);
const callId = z$1.string().transform(ToolCallId);
const pendingSchema = z$1.discriminatedUnion("kind", [z$1.object({
	kind: z$1.literal("edit"),
	id: callId,
	paths: z$1.array(z$1.string())
}), z$1.object({
	kind: z$1.literal("check"),
	id: callId,
	started: sequence
})]);
/** Outstanding files, current-step calls and bounded monotonic verification fences. */
const editVerificationSchema = z$1.object({
	edits: z$1.array(z$1.object({
		path: z$1.string(),
		settled: sequence
	})),
	pending: z$1.array(pendingSchema),
	checkFence: sequence.nullable(),
	checkedThrough: sequence.nullable()
});
function start(state, id, name, args, seq) {
	const paths = extractEditedPaths(name, args);
	if (paths.length > 0) return {
		...state,
		pending: [...state.pending, {
			kind: "edit",
			id,
			paths: [...paths]
		}]
	};
	if (name === "coding_check" && args !== null && typeof args === "object" && "action" in args && args.action === "run") return {
		...state,
		checkFence: seq,
		checkedThrough: null,
		pending: [...state.pending, {
			kind: "check",
			id,
			started: seq
		}]
	};
	return state;
}
function edited(state, paths, seq) {
	const added = new Set(paths);
	return [...state.edits.filter((edit) => !added.has(edit.path)), ...[...added].map((path) => ({
		path,
		settled: seq
	}))];
}
function settle(state, id, seq, result) {
	const call = state.pending.find((value) => value.id === id);
	if (call === void 0) return state;
	const pending = state.pending.filter((value) => value !== call);
	if (call.kind === "edit") {
		const unstarted = result.code === TOOL_ABORTED_BEFORE_DISPATCH || result.code === "CODING_CHECK_REQUIRED";
		return {
			...state,
			pending,
			edits: unstarted ? state.edits : edited(state, call.paths, seq)
		};
	}
	const passed = state.checkFence === call.started && committedCheckPassed(result.content, result.isError, result.meta);
	const checkedThrough = state.checkFence === call.started && (passed || committedCheckAllowsRepair(result.content, result.isError, result.meta)) ? call.started : state.checkedThrough;
	return {
		...state,
		pending,
		checkedThrough,
		edits: passed ? state.edits.filter((edit) => edit.settled >= call.started) : state.edits
	};
}
/**
* Recover native and nested tool effects; unresolved edits remain owed after interrupted steps.
* @param state - prior obligations at the previous committed cursor.
* @param event - next durable Session event.
* @returns unchanged state for unrelated events, otherwise the complete current obligations.
*/
function foldEditVerification(state, event) {
	switch (event.type) {
		case "tool/call": return start(state, event.data.callId, event.data.name, parseToolArguments(event.data.arguments), event.seq);
		case "tool/ptc-dispatch-start": return start(state, event.data.subCallId, event.data.name, event.data.arguments, event.seq);
		case "tool/result": return settle(state, event.data.message.toolCallId, event.seq, {
			content: event.data.message.content,
			isError: event.data.message.isError === true,
			meta: event.data.meta,
			...event.data.error === void 0 ? {} : { code: event.data.error.code }
		});
		case "tool/ptc-dispatch": return settle(state.pending.some((call) => call.id === event.data.subCallId) ? state : extractEditedPaths(event.data.name, event.data.arguments).length === 0 ? state : start(state, event.data.subCallId, event.data.name, event.data.arguments, event.seq), event.data.subCallId, event.seq, {
			content: event.data.content,
			isError: event.data.isError,
			meta: event.data.meta,
			...event.data.error === void 0 ? {} : { code: event.data.error.code }
		});
		case "step/end":
		case "turn/end":
			if (state.pending.length === 0) return state;
			return {
				...state,
				pending: [],
				edits: edited(state, state.pending.flatMap((call) => call.kind === "edit" ? call.paths : []), event.seq)
			};
		default: return state;
	}
}
/** Internal registration shared by each scoped policy instance, with no client view. */
const editVerificationDefinition = {
	key: "codingEditVerification",
	stateVersion: 2,
	stateSchema: editVerificationSchema,
	init: () => ({
		edits: [],
		pending: [],
		checkFence: null,
		checkedThrough: null
	}),
	apply: foldEditVerification
};
function countFiles(state, edits, entering) {
	return new Set([...edits.map((edit) => edit.path), ...state.pending.flatMap((call) => call.kind === "edit" && call.id !== entering ? call.paths : [])]).size;
}
/**
* Count distinct owed files, optionally excluding the mutation currently entering its own pre-hook.
* @param state - current projected obligations.
* @param entering - current mutation identity; omitted includes every unresolved mutation.
* @returns distinct file count, including interrupted or still-running mutations.
*/
function unverifiedFiles(state, entering) {
	return countFiles(state, state.edits, entering);
}
/**
* Count edits that still need feedback before another mutation can begin. A complete stable
* failed execution permits repair of older edits but does not remove them from verification debt.
* Newer edits and pending mutations cannot borrow that execution's repair permission.
* @param state - replayed verification obligations and latest check fence.
* @param entering - mutation currently entering its pre-hook, excluded from pending paths.
* @returns distinct files requiring a new qualifying execution before further mutation.
*/
function uncheckedFiles(state, entering) {
	return countFiles(state, state.edits.filter((edit) => state.checkedThrough === null || edit.settled >= state.checkedThrough), entering);
}
//#endregion
//#region lib/types/policy.js
/**
* Post-edit verification policy for the coding workbench. Mutation tools accumulate
* recoverable verification obligations per Session; the policy reminds (advise) or denies further mutations
* (enforce) until a complete stable coding_check reports feedback. Failed checks permit
* another repair edit, while only passing checks clear verification debt. Chain semantics live in the
* package README. @module @deepseek-ai/dsh-coding-workbench/policy
*/
/** Plugin identity. */
const name = "coding-edit-policy";
/** Durable verification obligations require the shared Session projection registry. */
const inject = ["sessionProjections"];
const Config = z.object({ mode: z.union([
	"off",
	"advise",
	"enforce"
]).default("off") });
/** The `{kind:'coding-edit-policy'}` producer source stamped on every reminder. */
const REMINDER_SOURCE = { kind: "coding-edit-policy" };
/** The reminder attached to an edit result while verification is outstanding. */
function reminderText(outstanding) {
	return `${outstanding} file${outstanding === 1 ? "" : "s"} modified since the last passing coding_check. Run coding_check (scope "changed" after several edits) before reporting engineering completion. Before verifying, sweep your own diff for the AI pathologies: new imports verified against the manifest, every conditional branch tested, no duplicated logic.`;
}
/** The denial reason for a mutation attempted while verification is outstanding. */
function denialReason(outstanding) {
	return `edit-check-policy: ${outstanding} file${outstanding === 1 ? "" : "s"} modified since the last passing coding_check. Run a fresh coding_check first (discovery and reads stay allowed). A complete unchanged failed check permits repair; only a pass clears verification debt.`;
}
/**
* Install the policy listeners. Listeners are scoped to this plugin and disposed with it.
* @param ctx - plugin context.
* @param config - validated {@link Config}.
* @returns after the projection is registered and the policy listeners are installed.
*/
async function apply(ctx, config) {
	const mode = config.mode;
	const obligations = await ctx.sessionProjections.register(editVerificationDefinition);
	ctx.fiber.assertActive();
	ctx.on("tools/post-execute", async (exec, result, next) => {
		const downstream = await next();
		if (!exec.agent) return downstream;
		if (extractEditedPaths(exec.name, exec.arguments).length === 0 || mode === "off") return downstream;
		if (result.isError && (result.error.info?.code === TOOL_ABORTED_BEFORE_DISPATCH || result.error.info?.code === "CODING_CHECK_REQUIRED")) return downstream;
		const outstanding = unverifiedFiles(obligations.stateOf(exec.agent.session));
		if (outstanding === 0) return downstream;
		const reminder = createUserMessage({
			content: [{
				type: "text",
				text: reminderText(outstanding)
			}],
			source: {
				...REMINDER_SOURCE,
				form: "notice",
				summary: `${outstanding} unverified edit${outstanding === 1 ? "" : "s"}`
			}
		});
		if (downstream.kind === "block") return {
			kind: "block",
			feedback: downstream.feedback,
			additionalContexts: [reminder, ...downstream.additionalContexts ?? []]
		};
		return {
			...downstream,
			additionalContexts: [reminder, ...downstream.additionalContexts ?? []]
		};
	});
	ctx.on("tools/pre-execute", async (exec, next) => {
		const agent = exec.agent;
		if (mode !== "enforce" || agent === void 0 || !isMutationTool(exec.name)) return next();
		const state = obligations.stateOf(agent.session);
		const started = state.pending.some((call) => call.kind === "edit" && call.id === exec.callId);
		const outstanding = uncheckedFiles(state, exec.callId);
		if (started && outstanding === 0) return next();
		return {
			kind: "deny",
			info: {
				name: "CodingVerificationRequired",
				code: EDIT_CHECK_REQUIRED
			},
			reason: started ? denialReason(outstanding) : "edit-check-policy: Mutation requires a durable Session tool call before dispatch."
		};
	});
}
//#endregion
export { Config, apply, checkSettlesDebt, extractEditedPaths, inject, name };
