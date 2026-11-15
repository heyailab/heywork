//#region lib/types/index.js
/** UMA-owned lifecycle consumer; the kernel Agent and workspace contracts remain unchanged. */
const name = "uma-subagent-workspaces";
/** Attachment must finish after both lifecycle and durable membership owners are available. */
const inject = ["agents", "workspaceRegistry"];
/**
* Attach true delegated children before Agent creation releases queued model work. A child must
* resolve to the same imported canonical directory as its already accounted parent. No ordinary
* Session or unimported directory is adopted. Newly attached children are appended so existing
* ordinary-session order and workspace defaults remain stable.
* @param ctx - UMA Host composition owning this consumer and its creation listeners.
*/
function apply(ctx) {
	const lifetime = new AbortController();
	const pending = /* @__PURE__ */ new Set();
	ctx.effect(() => async () => {
		lifetime.abort();
		await Promise.allSettled([...pending]);
	}, "uma-subagent-workspaces: pending membership");
	ctx.on("agent/created", ({ agent, signal }) => {
		const operation = (async () => {
			const header = agent.session.header;
			if (header.origin !== "subagent" || header.parentSession === void 0 || header.cwd === void 0) return;
			const parentSession = header.parentSession;
			const owned = signal === void 0 ? lifetime.signal : AbortSignal.any([lifetime.signal, signal]);
			owned.throwIfAborted();
			const parent = ctx.workspaceRegistry.list().find((workspace) => workspace.sessionIds.includes(parentSession));
			if (parent === void 0) return;
			const workspace = await ctx.workspaceRegistry.resolveByPath(header.cwd);
			owned.throwIfAborted();
			if (workspace === void 0 || workspace.id !== parent.id || !workspace.sessionIds.includes(parentSession)) return;
			if (workspace.sessionIds.includes(agent.id)) return;
			try {
				await workspace.attachSession(agent.id);
				owned.throwIfAborted();
				await workspace.insertSessionBefore(agent.id);
				owned.throwIfAborted();
				if (!ctx.workspaceRegistry.list().some((current) => current.id === workspace.id && current.sessionIds.includes(parentSession))) throw new Error("The delegated Session parent is no longer in the imported workspace");
			} catch (error) {
				if (workspace.sessionIds.includes(agent.id)) try {
					await workspace.detachSession(agent.id);
				} catch (cleanup) {
					throw new AggregateError([error, cleanup], "Delegated workspace attachment did not settle cleanly");
				}
				throw error;
			}
		})();
		pending.add(operation);
		const settled = () => {
			pending.delete(operation);
		};
		operation.then(settled, settled);
		return operation;
	});
}
//#endregion
export { apply, inject, name };
