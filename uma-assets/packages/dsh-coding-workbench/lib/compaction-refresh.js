import { t as boundedText } from "./context-CjvSlQT_.js";
import { z } from "zod";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
//#region lib/types/compaction-refresh.js
/** Plugin identity. */
const name = "compaction-state-refresh";
/** Required state owners; todo recovery remains in the todo plugin. */
const inject = [
	"codingWorkbench",
	"workspaceRegistry",
	"todoState",
	"sessionProjections"
];
/**
* Render the re-orientation message from the todos projection and the
* workbench overview. Pure; tests pin the ordering and the empty states.
* @param todos - the agent's current todo list, or null when none.
* @param ready - whether the workbench acceptance is ready, or null when no spec exists.
* @param openFindings - count of open review findings.
* @returns the re-orientation text, or null when there is nothing to re-orient on.
*/
function formatRefresh(todos, ready, openFindings) {
	const rows = [];
	if (todos !== null && todos.some((todo) => todo.status !== "completed")) {
		rows.push("Todos:");
		for (const todo of todos) {
			const mark = todo.status === "completed" ? "[x]" : todo.status === "in_progress" ? "[~]" : "[ ]";
			rows.push(`${mark} ${todo.content}`);
		}
	}
	if (ready !== null) rows.push(`Acceptance: ${ready ? "ready — report completion with the quality numbers" : "not ready — continue working and verify"}.`);
	if (openFindings > 0) rows.push(`Open review findings: ${openFindings} (they block readiness).`);
	if (rows.length === 0) return null;
	return "The conversation was just compacted. Re-orient on this state and continue:\n" + rows.join("\n");
}
/**
* Append a freshly assessed state notice to the first request after compaction.
* Pending notices recover from events and clear only after model admission.
* @param ctx - plugin context owning the projection and request listener.
* @returns when recovery registration and the request listener are ready.
*/
async function apply(ctx) {
	const pending = await ctx.sessionProjections.register({
		key: "codingCompactionRefresh",
		stateVersion: 1,
		stateSchema: z.boolean(),
		init: () => false,
		apply: (state, event) => {
			if (event.type === "compaction/end" && event.data.error === void 0) return true;
			if (event.type === "user/message" && event.data.source.kind === "compaction-refresh") return false;
			return state;
		}
	});
	ctx.on("agent/pre-step", async ({ agent, signal }, next) => {
		const decision = await next();
		if (decision.kind !== "enter" || !pending.stateOf(agent.session)) return decision;
		const workspace = ctx.workspaceRegistry.list().find((value) => value.sessionIds.includes(agent.id));
		let ready = null;
		let openFindings = 0;
		if (workspace !== void 0) {
			const request = { workspaceId: workspace.id };
			const assessment = await ctx.codingWorkbench.assess(request, signal);
			const overview = ctx.codingWorkbench.overview(request, signal);
			ready = overview.spec === null ? null : assessment.ready;
			openFindings = overview.findings.filter((finding) => finding.state === "open").length;
		}
		signal.throwIfAborted();
		const text = formatRefresh(ctx.todoState.read(agent.session), ready, openFindings) ?? "The conversation was just compacted. No active todo list or coding acceptance criteria are recorded.";
		return {
			...decision,
			messages: [...decision.messages, createUserMessage({
				content: [{
					type: "text",
					text: boundedText(text, ctx.codingWorkbench.config.contextBytes)
				}],
				source: {
					kind: "compaction-refresh",
					form: "notice",
					summary: "post-compaction task state"
				}
			})]
		};
	});
}
//#endregion
export { apply, formatRefresh, inject, name };
