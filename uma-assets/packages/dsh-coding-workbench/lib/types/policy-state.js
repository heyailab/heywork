/** Host-only edit verification obligations folded from native and PTC Session tool records. */
import { z } from 'zod';
import { ToolCallId } from '@deepseek-ai/dsh-llm';
import { SessionSeq } from '@deepseek-ai/dsh-session';
import { TOOL_ABORTED_BEFORE_DISPATCH } from '@deepseek-ai/dsh-tools';
import { committedCheckAllowsRepair, committedCheckPassed, extractEditedPaths, parseToolArguments } from "./verification.js";
/** A policy denial never invokes the mutation body. */
export const EDIT_CHECK_REQUIRED = 'CODING_CHECK_REQUIRED';
const sequence = z.number().int().nonnegative().transform(SessionSeq);
const callId = z.string().transform(ToolCallId);
const pendingSchema = z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('edit'), id: callId, paths: z.array(z.string()) }),
    z.object({ kind: z.literal('check'), id: callId, started: sequence }),
]);
/** Outstanding files, current-step calls and bounded monotonic verification fences. */
export const editVerificationSchema = z.object({
    edits: z.array(z.object({ path: z.string(), settled: sequence })),
    pending: z.array(pendingSchema),
    checkFence: sequence.nullable(),
    checkedThrough: sequence.nullable(),
});
function start(state, id, name, args, seq) {
    const paths = extractEditedPaths(name, args);
    if (paths.length > 0)
        return { ...state, pending: [...state.pending, { kind: 'edit', id, paths: [...paths] }] };
    if (name === 'coding_check' && args !== null && typeof args === 'object' && 'action' in args && args.action === 'run') {
        return { ...state, checkFence: seq, checkedThrough: null, pending: [...state.pending, { kind: 'check', id, started: seq }] };
    }
    return state;
}
function edited(state, paths, seq) {
    const added = new Set(paths);
    return [...state.edits.filter(edit => !added.has(edit.path)), ...[...added].map(path => ({ path, settled: seq }))];
}
function settle(state, id, seq, result) {
    const call = state.pending.find(value => value.id === id);
    if (call === undefined)
        return state;
    const pending = state.pending.filter(value => value !== call);
    if (call.kind === 'edit') {
        const unstarted = result.code === TOOL_ABORTED_BEFORE_DISPATCH || result.code === EDIT_CHECK_REQUIRED;
        return { ...state, pending, edits: unstarted ? state.edits : edited(state, call.paths, seq) };
    }
    const passed = state.checkFence === call.started && committedCheckPassed(result.content, result.isError, result.meta);
    const checkedThrough = state.checkFence === call.started
        && (passed || committedCheckAllowsRepair(result.content, result.isError, result.meta))
        ? call.started : state.checkedThrough;
    return { ...state, pending, checkedThrough,
        edits: passed ? state.edits.filter(edit => edit.settled >= call.started) : state.edits };
}
/**
 * Recover native and nested tool effects; unresolved edits remain owed after interrupted steps.
 * @param state - prior obligations at the previous committed cursor.
 * @param event - next durable Session event.
 * @returns unchanged state for unrelated events, otherwise the complete current obligations.
 */
export function foldEditVerification(state, event) {
    switch (event.type) {
        case 'tool/call': return start(state, event.data.callId, event.data.name, parseToolArguments(event.data.arguments), event.seq);
        case 'tool/ptc-dispatch-start': return start(state, event.data.subCallId, event.data.name, event.data.arguments, event.seq);
        case 'tool/result': return settle(state, event.data.message.toolCallId, event.seq, {
            content: event.data.message.content, isError: event.data.message.isError === true,
            meta: event.data.meta, ...event.data.error === undefined ? {} : { code: event.data.error.code },
        });
        case 'tool/ptc-dispatch': {
            const current = state.pending.some(call => call.id === event.data.subCallId) ? state
                : extractEditedPaths(event.data.name, event.data.arguments).length === 0 ? state
                    : start(state, event.data.subCallId, event.data.name, event.data.arguments, event.seq);
            return settle(current, event.data.subCallId, event.seq, {
                content: event.data.content, isError: event.data.isError, meta: event.data.meta,
                ...event.data.error === undefined ? {} : { code: event.data.error.code },
            });
        }
        case 'step/end':
        case 'turn/end': {
            if (state.pending.length === 0)
                return state;
            return { ...state, pending: [], edits: edited(state, state.pending.flatMap(call => call.kind === 'edit' ? call.paths : []), event.seq) };
        }
        // Session event declarations are merge-extensible; other domains leave these obligations unchanged.
        default: return state;
    }
}
/** Internal registration shared by each scoped policy instance, with no client view. */
export const editVerificationDefinition = {
    key: 'codingEditVerification', stateVersion: 2, stateSchema: editVerificationSchema,
    init: () => ({ edits: [], pending: [], checkFence: null, checkedThrough: null }), apply: foldEditVerification,
};
function countFiles(state, edits, entering) {
    return new Set([...edits.map(edit => edit.path), ...state.pending.flatMap(call => call.kind === 'edit' && call.id !== entering ? call.paths : [])]).size;
}
/**
 * Count distinct owed files, optionally excluding the mutation currently entering its own pre-hook.
 * @param state - current projected obligations.
 * @param entering - current mutation identity; omitted includes every unresolved mutation.
 * @returns distinct file count, including interrupted or still-running mutations.
 */
export function unverifiedFiles(state, entering) {
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
export function uncheckedFiles(state, entering) {
    return countFiles(state, state.edits.filter(edit => state.checkedThrough === null || edit.settled >= state.checkedThrough), entering);
}
//# sourceMappingURL=policy-state.js.map