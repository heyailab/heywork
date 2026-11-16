/** Replayable mutation inputs and verification receipts shared by tools and the edit policy. */
import { z } from 'zod';
import { fingerprintSchema, runSchema } from "./schema.js";
const MUTATION_TOOLS = new Set(['write', 'edit', 'apply_patch']);
const receiptSchema = z.object({
    status: z.string(), exitCode: z.number().int().nullable(),
    before: fingerprintSchema, after: fingerprintSchema.nullable(),
});
const evidenceSchema = z.object({ version: z.literal(1), receipts: z.array(receiptSchema).min(1) });
/**
 * Identify native mutation operations tracked by the edit policy.
 * @param name - tool name.
 * @returns whether the tool can create verification obligations.
 */
export function isMutationTool(name) { return MUTATION_TOOLS.has(name); }
/**
 * Extract the workspace-relative or absolute paths one tool call mutates.
 * @param toolName - native tool name.
 * @param args - parsed arguments or malformed raw input.
 * @returns mutated paths; empty for other tools or malformed input.
 */
export function extractEditedPaths(toolName, args) {
    if (!isMutationTool(toolName) || args === null || typeof args !== 'object')
        return [];
    const record = args;
    if (toolName === 'apply_patch') {
        if (typeof record.input !== 'string')
            return [];
        const paths = [];
        for (const line of record.input.split(/\r?\n/u)) {
            const match = /^\*{3} (?:Add|Update|Delete) File: (.+)$/u.exec(line) ?? /^\*{3} Move to: (.+)$/u.exec(line);
            if (match !== null && match[1] !== undefined)
                paths.push(match[1].trim());
        }
        return paths;
    }
    return typeof record.file_path === 'string' && record.file_path.trim() !== '' ? [record.file_path] : [];
}
/**
 * Parse logged argument JSON without allowing malformed calls to certify verification.
 * @param input - raw model arguments.
 * @returns parsed JSON or undefined for malformed input.
 */
export function parseToolArguments(input) {
    try {
        return JSON.parse(input);
    }
    catch (_error) {
        return undefined; /* Malformed durable arguments cannot establish an operation. */
    }
}
function runsIn(value) {
    const parsed = parseToolArguments(value);
    if (parsed === null || typeof parsed !== 'object')
        return [];
    const record = parsed;
    const values = Array.isArray(record.runs) ? record.scope === 'changed' ? record.runs : [] : [record];
    const runs = z.array(runSchema).safeParse(values);
    return runs.success ? runs.data : [];
}
function passed(receipts) {
    return receipts.length > 0 && receipts.every(run => run.status === 'passed' && run.exitCode === 0
        && run.before.complete && run.after?.complete === true && run.before.digest === run.after.digest);
}
function repairable(receipts) {
    const first = receipts[0];
    return first !== undefined && receipts.some(run => run.status === 'failed')
        && receipts.every(run => ((run.status === 'failed' && run.exitCode !== null && run.exitCode !== 0)
            || (run.status === 'passed' && run.exitCode === 0))
            && run.before.complete && run.after?.complete === true && run.before.digest === run.after.digest
            && run.before.digest === first.before.digest);
}
/**
 * Decide whether a newly executed verification has complete, unchanged passing source observations.
 * @param result - coding_check outcome.
 * @param args - parsed coding_check arguments.
 * @returns false for historical reads, cancellation, empty selections, and incomplete evidence.
 */
export function checkSettlesDebt(result, args) {
    if (args === null || typeof args !== 'object' || !('action' in args) || args.action !== 'run')
        return false;
    return !result.isError && typeof result.value === 'string' && passed(runsIn(result.value));
}
/**
 * Retain compact receipt fields when rendered check output is moved to a spill file.
 * @param value - canonical coding_check result JSON.
 * @returns replayable source observations and exit facts, excluding command logs.
 */
export function verificationMeta(value) {
    return { codingCheck: { version: 1, receipts: runsIn(value).map(run => ({
                status: run.status, exitCode: run.exitCode, before: { ...run.before },
                after: run.after === null ? null : { ...run.after },
            })) } };
}
/** Read tool-owned receipt facts, preserving fail-closed metadata precedence over rendered output. */
function committedReceipts(content, isError, meta) {
    if (isError)
        return [];
    if (meta !== null && typeof meta === 'object' && 'codingCheck' in meta) {
        const evidence = evidenceSchema.safeParse(meta.codingCheck);
        return evidence.success ? evidence.data.receipts : [];
    }
    const text = content.map(block => block.type === 'text' ? block.text : '').join('');
    return runsIn(text);
}
/**
 * Evaluate committed result evidence without consulting a live run or external storage.
 * @param content - persisted model-facing result blocks.
 * @param isError - durable invocation failure state.
 * @param meta - optional tool-owned compact receipt metadata; absent in older logs.
 * @returns whether the committed result proves a nonempty set of unchanged passing checks.
 */
export function committedCheckPassed(content, isError, meta) {
    return passed(committedReceipts(content, isError, meta));
}
/**
 * Permit another bounded repair edit after a real completed failed check on stable source.
 * This never certifies acceptance or clears verification obligations. Partial scans, changed
 * inputs, invocation errors, cancellation and timeout outcomes cannot authorize repair.
 * @param content - persisted model-facing result blocks.
 * @param isError - durable invocation failure state.
 * @param meta - optional tool-owned compact receipt metadata.
 * @returns whether every receipt is settled on the same complete unchanged source and at least one failed.
 */
export function committedCheckAllowsRepair(content, isError, meta) {
    return repairable(committedReceipts(content, isError, meta));
}
//# sourceMappingURL=verification.js.map