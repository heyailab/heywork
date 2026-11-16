import z from '@deepseek-ai/schemastery';
import { defineTool } from '@deepseek-ai/dsh-tools';
import { brandString } from '@deepseek-ai/dsh-brand';
import { SessionId } from '@deepseek-ai/dsh-session';
import { verificationMeta } from "./verification.js";
import { selectCodingStandards } from '@deepseek-ai/dsh-util-uma-delivery';
/** Plugin identity. */
export const name = 'coding-workbench-tools';
/** Scoped tool registry and installation-owned coding operations. */
export const inject = ['tools', 'codingWorkbench', 'workspaceRegistry', 'systemPrompt'];
/** Role-owned capability selection, validated before the tool consumer activates. */
export const Config = z.object({ mode: z.union(['full', 'coordinate', 'read-only']).default('full') });
const jsonOutput = { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] };
/**
 * Register evidence-producing tools without duplicating the execution or validation implementation.
 * @param ctx - calling Agent tool scope and shared workbench service.
 * @param config - role-owned source capability selection; omission preserves full implementation tools.
 */
export function apply(ctx, config = {}) {
    const mode = config.mode ?? 'full';
    const readOnly = mode !== 'full';
    const definesAcceptance = mode !== 'read-only';
    const requireAction = (tool, action, allowed) => {
        if (readOnly && !allowed.includes(action))
            throw new Error(`${tool} ${action} is unavailable in a source read-only role`);
    };
    ctx.systemPrompt.section({
        name: 'native-coding-evidence',
        order: 110,
        text: readOnly ? '## Native development evidence\n'
            + 'This role may inspect workspace evidence, read acceptance criteria and check or repair history, and inspect isolated tasks. '
            + (definesAcceptance ? 'The coordinator may define versioned acceptance criteria as metadata, using the current revision and discovered checks. '
                : 'Acceptance criteria are read-only for this role. ')
            + 'It must not execute project checks, start or cancel repairs, create or merge or remove tasks, or restore source files. '
            + 'Record reproducible source-linked findings with coding_review; findings are review metadata, not source changes or proof that verification passed. '
            + 'Delegate implementation and executable verification to an implementation role and assess its retained evidence.'
            : '## Native development evidence\n'
                + 'For coding tasks in an imported local workspace, inspect existing code and relevant Wiki/knowledge first. '
                + 'Keep small fixes small; do not create full product documents for a patch. '
                + 'For nontrivial implementation or review, read the project instructions and existing formatter/linter configuration first. '
                + 'Use coding_inspect standards with the actual project languages to select source-backed guidance; project conventions take precedence. '
                + 'Selected guidance is not a verified result: link applicable machine checks to coding_acceptance, run them, and review the remaining rules. '
                + 'Do not impose Java layers on every language, replace an existing naming style, install tools without task authorization, or claim a missing check passed. '
                + 'Before verifying a change, discover real commands with coding_inspect environment and read the current coding_acceptance. '
                + 'Define or revise concrete acceptance criteria linked to the discovered checks. '
                + 'Use coding_check for those commands and coding_inspect acceptance before reporting engineering completion. '
                + 'For an unchanged failed check, coding_repair can start a bounded repair and retain its independent verification history; read or cancel it by the returned repair id. '
                + 'After editing several files, prefer coding_check with scope "changed" so only the affected checks run; '
                + 'declare coverage globs per check in .uma/coding.json to make that selection precise. '
                + 'A shell transcript, document checkbox, model-authored approval flag or older pass is not current acceptance evidence. '
                + 'Report failed, missing, stale or interrupted checks and open findings. Human approval and deployment need their own evidence. '
                + 'Use the full Uma team workflow only when the request warrants a complete product workflow.',
    });
    const scope = async (exec) => {
        if (exec.agent?.session.header.cwd === undefined)
            throw new Error('This coding operation requires a workspace Session');
        const workspace = await ctx.workspaceRegistry.resolveByPath(exec.agent.session.header.cwd);
        if (workspace === undefined)
            throw new Error('Import the current local folder as a workspace before using coding evidence tools');
        return { workspaceId: workspace.id, sessionId: exec.agent.id };
    };
    ctx.tools.register(defineTool({
        name: 'coding_inspect',
        description: 'Inspect the current workspace environment, available verification commands, retained check results, source-linked review findings, and quality metrics. Discovery never installs packages or runs project scripts. Standards mode selects source-backed guidance for the actual project languages; provide guideId and contentLanguage to read one selected guide in full; project conventions take precedence and selected rules are not verified checks. Use impact mode for literal source/test matches; these are not semantic call edges. Quality mode aggregates settled runs, pass rate, repair loops, and open findings for the delivery report. Sweep mode mechanically scans the working-tree change set for hallucinated imports, placeholder markers, and leaked secrets — run it before reporting completion. Experience mode searches authored lessons, retained check transitions and session history matching the query (file paths or error fragments); historical evidence needs rechecking before reuse.',
        parameters: {
            mode: { type: 'string', required: true, enum: ['environment', 'status', 'acceptance', 'impact', 'context', 'quality', 'sweep', 'experience', 'standards'] },
            query: { type: 'string', description: 'Literal query required for impact mode; topic/error terms for experience mode.' },
            guideId: { type: 'string', description: 'In standards mode, read this exact guide id from the selected catalog; keep the actual project languages.' },
            contentLanguage: { type: 'string', enum: ['en', 'zh'], description: 'Language for a requested standards guide; English when omitted.' },
            languages: { type: 'array', description: 'Actual technical languages for standards selection, such as typescript, javascript, java, go, python, or csharp. Omit for common guidance; do not guess the project stack.', items: { type: 'string' } },
        },
        output: jsonOutput,
        async execute(args, exec) {
            const request = await scope(exec);
            switch (args.mode) {
                case 'environment': return JSON.stringify(await ctx.codingWorkbench.doctor(request, exec.signal));
                case 'status': return JSON.stringify(ctx.codingWorkbench.overview(request, exec.signal));
                case 'acceptance': {
                    const assessment = await ctx.codingWorkbench.assess(request, exec.signal);
                    const team = ctx.get('agentTeams');
                    if (team === undefined || exec.agent === undefined || exec.agent.session.header.origin === 'subagent'
                        || !team.isEnabled(exec.agent)) {
                        return JSON.stringify(assessment);
                    }
                    const pending = team.listTasks(exec.agent).filter(task => task.status !== 'completed');
                    return JSON.stringify({ ...assessment, codingReady: assessment.ready,
                        ready: assessment.ready && pending.length === 0,
                        team: { ready: pending.length === 0, openTasks: pending.map(task => ({
                                id: task.id, revision: task.revision, subject: task.subject, status: task.status, blockedBy: task.blockedBy,
                            })) },
                    });
                }
                case 'impact': return JSON.stringify(await ctx.codingWorkbench.impact({ ...request, query: args.query ?? '' }, exec.signal));
                case 'context': return JSON.stringify(await ctx.codingWorkbench.context(request, exec.signal));
                case 'quality': return JSON.stringify(ctx.codingWorkbench.qualityReport(request, exec.signal));
                case 'sweep': return JSON.stringify(await ctx.codingWorkbench.sweep(request, exec.signal));
                case 'experience': return JSON.stringify(await ctx.codingWorkbench.experienceSearch({ ...request, query: args.query ?? '' }, exec.signal));
                case 'standards': {
                    const languages = args.languages ?? [];
                    if (languages.length > 16 || languages.some(value => value.length > 40))
                        throw new Error('Select at most 16 technical language names');
                    const selected = selectCodingStandards(languages);
                    const guide = args.guideId === undefined ? undefined : selected.guides.find(item => item.id === args.guideId);
                    if (args.guideId !== undefined && guide === undefined)
                        throw new Error('The guide is not applicable to the selected project languages');
                    const project = await ctx.codingWorkbench.doctor(request, exec.signal);
                    return JSON.stringify({ ...selected,
                        ...(guide === undefined ? {} : { guide: { id: guide.id, version: guide.version,
                                content: guide.body[args.contentLanguage ?? 'en'], sourceIds: guide.sourceIds } }),
                        guides: selected.guides.map(({ id, version, title, languages: tags, sourceIds }) => ({
                            id, version, title, languages: tags, sourceIds,
                        })),
                        projectChecks: project.checks,
                        verification: 'not-run',
                        next: 'Match applicable guidance to the project configuration and real checks. Link checks to acceptance and execute coding_check; review-only rules need their own source-linked review evidence.',
                    });
                }
            }
        },
        presentCall: args => ({ card: 'generic', title: `Coding: ${args.mode}`, kind: 'search', rawInput: args }),
    }));
    ctx.tools.register(defineTool({
        name: 'coding_acceptance',
        description: 'Define or read versioned acceptance criteria for the imported workspace. Each criterion must reference at least one real check name discovered by coding_inspect environment. Define criteria before verification; replacing a specification invalidates its older check evidence. This records engineering criteria, never human approval or deployment.',
        parameters: {
            action: { type: 'string', required: true, enum: definesAcceptance ? ['read', 'define'] : ['read'] },
            expectedRevision: { type: 'integer', description: 'Current revision from read; omit only when no specification exists.' },
            goal: { type: 'string', description: 'Concrete development objective.' },
            independentVerificationOf: { type: 'array', items: { type: 'string' }, description: 'Implementation Session IDs from the real team roster. When set, acceptance requires fresh checks from another Session. Include every implementation owner. Omission retains the existing selection; an empty list clears it. This is execution independence, not a code-review verdict.' },
            criteria: { type: 'array', description: 'Concrete acceptance criteria linked to discovered executable checks.', items: {
                    type: 'object', additionalProperties: false, properties: {
                        id: { type: 'string', required: true }, text: { type: 'string', required: true },
                        checks: { type: 'array', required: true, items: { type: 'string' } },
                    },
                } },
        },
        output: jsonOutput,
        async execute(args, exec) {
            requireAction('coding_acceptance', args.action, definesAcceptance ? ['read', 'define'] : ['read']);
            const request = await scope(exec);
            if (args.action === 'read')
                return JSON.stringify(ctx.codingWorkbench.overview(request, exec.signal).spec);
            return JSON.stringify(await ctx.codingWorkbench.saveSpec({
                ...request, expectedRevision: args.expectedRevision ?? null,
                goal: args.goal ?? '', criteria: args.criteria ?? [],
                ...(args.independentVerificationOf === undefined ? {}
                    : { independentVerificationOf: args.independentVerificationOf.map(SessionId) }),
            }, exec.signal));
        },
        presentCall: args => ({ card: 'generic', title: `Acceptance: ${args.action}`, rawInput: args }),
    }));
    ctx.tools.register(defineTool({
        name: 'coding_check',
        description: 'Run an explicitly selected verification command discovered by coding_inspect, or run every check affected by the current working-tree changes with scope "changed". Stores actual argv, directory, source fingerprints, exit status, bounded logs and diagnostics. A passed command is not fresh acceptance if source changed or the scan was incomplete. Affected selection needs coverage globs declared per check in .uma/coding.json; checks without declared coverage always run, and an incomplete change list runs everything. Reading and cancelling refer to a previously returned execution id.',
        parameters: { action: { type: 'string', required: true, enum: readOnly ? ['read'] : ['run', 'read', 'cancel'] }, check: { type: 'string', description: 'Discovered check name for run.' }, scope: { type: 'string', enum: ['changed'], description: 'Run every affected check for the working-tree change set instead of one named check.' }, id: { type: 'string', description: 'Returned verification execution id for read/cancel.' } },
        output: { ...jsonOutput, presentationMeta: (_args, value) => verificationMeta(value) },
        async execute(args, exec) {
            requireAction('coding_check', args.action, ['read']);
            const request = await scope(exec);
            const runOne = async (name) => {
                const run = await ctx.codingWorkbench.startCheck({ ...request, name }, exec.signal);
                const stop = () => {
                    void ctx.codingWorkbench.cancelCheck({ id: run.id }, new AbortController().signal).catch((error) => {
                        ctx.logger.warn('Could not cancel a coding check.', error);
                    });
                };
                exec.signal.addEventListener('abort', stop, { once: true });
                try {
                    return await ctx.codingWorkbench.waitForCheck(run.id, exec.signal);
                }
                finally {
                    exec.signal.removeEventListener('abort', stop);
                }
            };
            if (args.action === 'run') {
                if (args.scope !== undefined && args.check !== undefined)
                    throw new Error('Select either check or scope, not both');
                if (args.scope === 'changed') {
                    const plan = await ctx.codingWorkbench.planChecks(request, exec.signal);
                    const runs = [];
                    for (const decision of plan.decisions.filter(value => value.included)) {
                        exec.signal.throwIfAborted();
                        runs.push(await runOne(decision.name));
                    }
                    return JSON.stringify({ scope: 'changed', changedFiles: plan.changedFiles, complete: plan.complete, reason: plan.reason, runs, skipped: plan.decisions.filter(value => !value.included) });
                }
                return JSON.stringify(await runOne(args.check ?? ''));
            }
            const id = brandString(args.id ?? '');
            const owned = ctx.codingWorkbench.overview(request, exec.signal).runs.some(run => run.id === id);
            if (!owned)
                throw new Error('Check execution is not in the current workspace');
            return JSON.stringify(args.action === 'cancel' ? await ctx.codingWorkbench.cancelCheck({ id }, exec.signal) : await ctx.codingWorkbench.waitForCheck(id, exec.signal));
        },
        presentCall: args => ({ card: 'generic', title: `Check: ${args.scope ?? args.check ?? args.id ?? args.action}`, rawInput: args }),
    }));
    ctx.tools.register(defineTool({
        name: 'coding_repair',
        description: 'Start a bounded implementation-session repair of an unchanged failed check, or read/cancel a retained repair in the current workspace. Each attempt reruns the original check independently. Starting uses this Agent as the policy owner; it does not inherit broader permissions from the failed check author. Repair never implies deployment or user approval.',
        parameters: {
            action: { type: 'string', required: true, enum: readOnly ? ['read'] : ['start', 'read', 'cancel'] },
            runId: { type: 'string', description: 'Failed check execution id from the current workspace; required for start.' },
            id: { type: 'string', description: 'Repair id returned by start; required for read/cancel.' },
            maxAttempts: { type: 'integer', description: 'Explicit bounded attempt limit for start; defaults to one and cannot exceed the deployment limit.' },
        },
        output: jsonOutput,
        async execute(args, exec) {
            requireAction('coding_repair', args.action, ['read']);
            const request = await scope(exec);
            const overview = ctx.codingWorkbench.overview(request, exec.signal);
            if (args.action === 'start') {
                const id = brandString(args.runId ?? '');
                if (!overview.runs.some(run => run.id === id))
                    throw new Error('Check execution is not in the current workspace');
                return JSON.stringify(await ctx.codingWorkbench.startRepair({
                    id, maxAttempts: args.maxAttempts ?? 1, actorSessionId: request.sessionId,
                }, exec.signal));
            }
            const id = brandString(args.id ?? '');
            const repair = overview.repairs.find(value => value.id === id);
            if (repair === undefined)
                throw new Error('Repair is not in the current workspace');
            return JSON.stringify(args.action === 'cancel' ? await ctx.codingWorkbench.cancelRepair({ id }, exec.signal) : repair);
        },
        presentCall: args => ({ card: 'generic', title: `Repair: ${args.action}`, rawInput: args }),
    }));
    ctx.tools.register(defineTool({
        name: 'coding_review',
        description: 'Persist a reproducible review finding tied to inspected source bytes, or explicitly update a finding state. Include its concrete trigger, consequence and reproduction evidence. Finding state is an authored review decision, not proof that tests passed.',
        parameters: { action: { type: 'string', required: true, enum: ['add', 'update'] }, path: { type: 'string' }, line: { type: 'integer' }, severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] }, title: { type: 'string' }, evidence: { type: 'string' }, id: { type: 'string' }, state: { type: 'string', enum: ['open', 'resolved', 'dismissed'] } },
        output: jsonOutput,
        async execute(args, exec) {
            const request = await scope(exec);
            if (args.action === 'add')
                return JSON.stringify(await ctx.codingWorkbench.addFinding({ ...request, path: args.path ?? '', line: args.line ?? 0, severity: args.severity ?? 'medium', title: args.title ?? '', evidence: args.evidence ?? '' }, exec.signal));
            const id = brandString(args.id ?? '');
            if (!ctx.codingWorkbench.overview(request, exec.signal).findings.some(value => value.id === id))
                throw new Error('Finding is not in the current workspace');
            return JSON.stringify(await ctx.codingWorkbench.updateFinding({ id, state: args.state ?? 'open' }, exec.signal));
        },
        presentCall: args => ({ card: 'generic', title: 'Code review finding', rawInput: args }),
    }));
    ctx.tools.register(defineTool({
        name: 'coding_task',
        description: 'Manage isolated coding tasks: each task checks out a dedicated worktree so an implementation runs without touching the shared checkout. create makes the checkout; inspect reports repository facts (head, branch, status, diff); merge fast-forwards the reviewed branch into the source checkout (requires a clean source and the reviewed commit); remove archives the task session and deletes the worktree (requires no uncommitted files). The task session\'s checks carry the isolated cwd, so acceptance treats them as isolated-checkout evidence.',
        parameters: {
            action: { type: 'string', required: true, enum: readOnly ? ['inspect'] : ['create', 'inspect', 'merge', 'remove'] },
            id: { type: 'string', description: 'Task id returned by create; required for inspect, merge, and remove.' },
            name: { type: 'string', description: 'Task name for create.' },
            expectedCommit: { type: 'string', description: 'HEAD commit from the last inspect; required for merge.' },
        },
        output: jsonOutput,
        async execute(args, exec) {
            requireAction('coding_task', args.action, ['inspect']);
            const request = await scope(exec);
            switch (args.action) {
                case 'create': return JSON.stringify(await ctx.codingWorkbench.createTask({ ...request, ...(args.name === undefined ? {} : { name: args.name }) }, exec.signal));
                case 'inspect': return JSON.stringify(await ctx.codingWorkbench.inspectTask({ ...request, id: brandString(args.id ?? '') }, exec.signal));
                case 'merge': return JSON.stringify(await ctx.codingWorkbench.mergeTask({ ...request, id: brandString(args.id ?? ''), sessionId: request.sessionId, expectedCommit: args.expectedCommit ?? '' }, exec.signal));
                case 'remove': return JSON.stringify(await ctx.codingWorkbench.removeTask({ ...request, id: brandString(args.id ?? '') }, exec.signal));
            }
        },
        presentCall: args => ({ card: 'generic', title: `Coding task: ${args.action}`, rawInput: args }),
    }));
    ctx.tools.register(defineTool({
        name: 'coding_restore',
        description: 'Restore one captured text file to its before-state only when the current file still equals the captured after-state. Requires an explicit user request to restore this file. Returns conflict instead of overwriting later user edits. Does not undo database, external service or process effects.',
        parameters: { seq: { type: 'integer', required: true, description: 'workspace/changes event sequence in this Session.' }, index: { type: 'integer', required: true, description: 'File position in that event summary.' } },
        output: jsonOutput,
        async execute(args, exec) {
            requireAction('coding_restore', 'restore', []);
            const { sessionId } = await scope(exec);
            return JSON.stringify(await ctx.codingWorkbench.restoreFile({ sessionId, actorSessionId: sessionId, seq: args.seq, index: args.index }, exec.signal));
        },
        presentCall: args => ({ card: 'generic', title: 'Restore captured file', rawInput: args }),
    }), { when: () => !readOnly });
}
//# sourceMappingURL=tools.js.map