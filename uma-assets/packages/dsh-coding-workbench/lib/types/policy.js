/**
 * Post-edit verification policy for the coding workbench. Mutation tools accumulate
 * recoverable verification obligations per Session; the policy reminds (advise) or denies further mutations
 * (enforce) until a complete stable coding_check reports feedback. Failed checks permit
 * another repair edit, while only passing checks clear verification debt. Chain semantics live in the
 * package README. @module @deepseek-ai/dsh-coding-workbench/policy
 */
import z from '@deepseek-ai/schemastery';
import { createUserMessage } from '@deepseek-ai/dsh-llm';
import { TOOL_ABORTED_BEFORE_DISPATCH } from '@deepseek-ai/dsh-tools';
import { editVerificationDefinition, EDIT_CHECK_REQUIRED, uncheckedFiles, unverifiedFiles } from "./policy-state.js";
import { extractEditedPaths, isMutationTool } from "./verification.js";
export { checkSettlesDebt, extractEditedPaths } from "./verification.js";
/** Plugin identity. */
export const name = 'coding-edit-policy';
/** Durable verification obligations require the shared Session projection registry. */
export const inject = ['sessionProjections'];
export const Config = z.object({
    mode: z.union(['off', 'advise', 'enforce']).default('off'),
});
/** The `{kind:'coding-edit-policy'}` producer source stamped on every reminder. */
const REMINDER_SOURCE = { kind: 'coding-edit-policy' };
/** The reminder attached to an edit result while verification is outstanding. */
function reminderText(outstanding) {
    return `${outstanding} file${outstanding === 1 ? '' : 's'} modified since the last passing coding_check. `
        + 'Run coding_check (scope "changed" after several edits) before reporting engineering completion. '
        + 'Before verifying, sweep your own diff for the AI pathologies: new imports verified against the manifest, every conditional branch tested, no duplicated logic.';
}
/** The denial reason for a mutation attempted while verification is outstanding. */
function denialReason(outstanding) {
    return `edit-check-policy: ${outstanding} file${outstanding === 1 ? '' : 's'} modified since the last passing coding_check. `
        + 'Run a fresh coding_check first (discovery and reads stay allowed). A complete unchanged failed check permits repair; only a pass clears verification debt.';
}
/**
 * Install the policy listeners. Listeners are scoped to this plugin and disposed with it.
 * @param ctx - plugin context.
 * @param config - validated {@link Config}.
 * @returns after the projection is registered and the policy listeners are installed.
 */
export async function apply(ctx, config) {
    const mode = config.mode;
    const obligations = await ctx.sessionProjections.register(editVerificationDefinition);
    ctx.fiber.assertActive();
    ctx.on('tools/post-execute', async (exec, result, next) => {
        const downstream = await next();
        if (!exec.agent)
            return downstream;
        const paths = extractEditedPaths(exec.name, exec.arguments);
        if (paths.length === 0 || mode === 'off')
            return downstream;
        if (result.isError && (result.error.info?.code === TOOL_ABORTED_BEFORE_DISPATCH || result.error.info?.code === EDIT_CHECK_REQUIRED)) {
            return downstream;
        }
        const outstanding = unverifiedFiles(obligations.stateOf(exec.agent.session));
        if (outstanding === 0)
            return downstream;
        const reminder = createUserMessage({
            content: [{ type: 'text', text: reminderText(outstanding) }],
            source: { ...REMINDER_SOURCE, form: 'notice', summary: `${outstanding} unverified edit${outstanding === 1 ? '' : 's'}` },
        });
        if (downstream.kind === 'block') {
            return { kind: 'block', feedback: downstream.feedback, additionalContexts: [reminder, ...downstream.additionalContexts ?? []] };
        }
        return { ...downstream, additionalContexts: [reminder, ...downstream.additionalContexts ?? []] };
    });
    ctx.on('tools/pre-execute', async (exec, next) => {
        const agent = exec.agent;
        if (mode !== 'enforce' || agent === undefined || !isMutationTool(exec.name))
            return next();
        const state = obligations.stateOf(agent.session);
        const started = state.pending.some(call => call.kind === 'edit' && call.id === exec.callId);
        const outstanding = uncheckedFiles(state, exec.callId);
        if (started && outstanding === 0)
            return next();
        return { kind: 'deny', info: { name: 'CodingVerificationRequired', code: EDIT_CHECK_REQUIRED },
            reason: started ? denialReason(outstanding) : 'edit-check-policy: Mutation requires a durable Session tool call before dispatch.' };
    });
}
//# sourceMappingURL=policy.js.map