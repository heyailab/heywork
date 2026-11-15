import { createHash } from "node:crypto";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { redactDevelopmentText } from "@deepseek-ai/dsh-util-uma-delivery";
//#region lib/types/experience-capture.js
/** Local experience candidates derived from coding receipts and structured tool failures. */
/** Shared UMA consumer; it does not write project files or issue model requests. */
const name = "uma-experience-capture";
/** Fact and content owners must be ready before the consumer subscribes. */
const inject = [
	"codingWorkbench",
	"knowledge",
	"workspaceRegistry",
	"tools"
];
const checkFailures = new Set([
	"failed",
	"timed-out",
	"error"
]);
const toolPitfalls = new Map([
	["IMAGE_UNSUPPORTED_MODEL", {
		symptom: "The active model rejected image input during verification.",
		solution: "Use an image-capable model for pixel inspection. Verify DOM, layout and interactions when only text is available.",
		applicability: "Screenshot verification with a model that has no image input."
	}],
	["TEAM_TASK_INVALID_TRANSITION", {
		symptom: "A shared task update was rejected because its current state did not allow the action.",
		solution: "Read current status and revision. Claim pending tasks before completing them, using the revision returned by claim.",
		applicability: "Shared task completion, including reconciliation of work delivered earlier."
	}],
	["TEAM_TASK_NOT_FOUND", {
		symptom: "Team coordination referenced a task ID absent from the task board.",
		solution: "List the current team tasks and use the ID returned for the prerequisite.",
		applicability: "Shared task dependencies and task lookups."
	}]
]);
/**
* Capture local experience and opted-in project copies from settled evidence.
* @param ctx - shared UMA service scope; withdrawing it removes the listener.
*/
function apply(ctx) {
	const lifetime = new AbortController();
	ctx.effect(() => () => {
		lifetime.abort();
	});
	ctx.knowledge.ensureGlobalExperience(lifetime.signal);
	ctx.tools.register(defineTool({
		name: "uma_workspace_search",
		description: "Find relevant documents in the project knowledge library or reviewed development experience. Use when a project decision needs this evidence.",
		parameters: {
			kind: {
				type: "string",
				enum: ["knowledge", "experience"],
				required: true,
				description: "Which library to search."
			},
			query: {
				type: "string",
				required: true,
				description: "Focused requirements, file names, symptoms or technology terms."
			}
		},
		output: {
			schema: { type: "string" },
			render: (_args, text) => [{
				type: "text",
				text
			}]
		},
		async execute({ kind, query }, exec) {
			const phrase = query.trim();
			if (phrase === "" || phrase.length > 2e3) throw new Error("Enter a library query of 1 through 2000 characters");
			if (exec.agent === void 0) throw new Error("Library lookup requires a conversation");
			const cwd = exec.agent.session.header.cwd;
			const workspace = cwd === void 0 ? void 0 : await ctx.workspaceRegistry.resolveByPath(cwd);
			const records = kind === "experience" ? ctx.knowledge.experiencesForWorkspace(workspace?.id, phrase, exec.signal).map((item) => ({
				id: item.id,
				revision: item.revision,
				verification: "operator-reviewed-historical-reference",
				title: item.title,
				symptom: item.symptom,
				cause: item.cause,
				solution: item.solution,
				applicability: item.applicability,
				exclusions: item.exclusions,
				references: item.references
			})) : workspace === void 0 ? [] : (await ctx.knowledge.forWorkspace(workspace.id, phrase, exec.signal)).hits.map((hit) => ({
				title: hit.title,
				heading: hit.heading,
				text: hit.text,
				page: hit.page,
				source: hit.textPath,
				startLine: hit.startLine,
				endLine: hit.endLine
			}));
			const prefix = "Reference material for the current task. Verify applicability against current sources.\n";
			const output = [];
			let bytes = Buffer.byteLength(prefix);
			for (const record of records) {
				const line = redactDevelopmentText(JSON.stringify(record));
				const size = Buffer.byteLength(line) + 1;
				if (bytes + size > ctx.knowledge.config.contextMaxBytes) continue;
				output.push(line);
				bytes += size;
			}
			return output.length > 0 ? prefix + output.join("\n") : "No matching library evidence for this query.";
		}
	}));
	ctx.tools.register(defineTool({
		name: "uma_experience_record",
		description: "Save a reusable development pitfall to the local global experience library as a reviewable candidate. Use after an observed failure, workaround, or verified fix. Generalize project-specific details. Omit secrets, raw logs and private paths. Leave unknown fields empty.",
		parameters: {
			title: {
				type: "string",
				required: true,
				description: "Short reusable issue title."
			},
			symptom: {
				type: "string",
				required: true,
				description: "Observed failure and the relevant check or reproduction."
			},
			cause: {
				type: "string",
				description: "Confirmed cause, when known."
			},
			solution: {
				type: "string",
				description: "Verified fix or workaround and how it was checked."
			},
			applicability: {
				type: "string",
				description: "Technology and conditions in which the lesson applies."
			}
		},
		output: {
			schema: { type: "string" },
			render: (_args, text) => [{
				type: "text",
				text
			}]
		},
		execute(args, exec) {
			if (exec.agent === void 0) throw new Error("Experience recording requires an active conversation");
			const sanitize = (value) => redactDevelopmentText(value.trim().slice(0, 2e3));
			const facts = {
				title: sanitize(args.title).slice(0, 160),
				symptom: sanitize(args.symptom),
				cause: args.cause === void 0 ? null : sanitize(args.cause),
				solution: sanitize(args.solution ?? ""),
				applicability: sanitize(args.applicability ?? "")
			};
			if (facts.title === "" || facts.symptom === "") throw new Error("Enter a title and an observed symptom");
			const hash = createHash("sha256").update(JSON.stringify(facts)).digest("hex");
			const added = ctx.knowledge.captureGlobalExperience({
				sourceKey: `authored/${exec.agent.id}/${hash}`,
				content: {
					...facts,
					exclusions: "",
					technologies: [],
					references: [{
						kind: "session",
						id: exec.agent.id
					}]
				}
			}, exec.signal);
			return Promise.resolve(added ? "Saved a global experience candidate for review." : "This conversation already recorded the same candidate.");
		},
		presentCall: () => ({
			card: "generic",
			title: "Record development experience",
			rawInput: {}
		})
	}));
	const save = (request) => {
		try {
			ctx.knowledge.captureGlobalExperience(request, lifetime.signal);
		} catch (error) {
			if (!lifetime.signal.aborted) ctx.logger.warn("Could not record a development experience candidate. Source evidence is retained.", error);
		}
	};
	const failure = (run) => {
		if (!checkFailures.has(run.status) || run.finishedAt === null) return;
		save({
			sourceKey: `check/failure/${run.id}`,
			content: {
				title: "Development check failed",
				symptom: `A project check reported ${run.status}.`,
				cause: null,
				solution: "",
				applicability: "",
				exclusions: "",
				technologies: [],
				references: [{
					kind: "check",
					id: run.id
				}, {
					kind: "session",
					id: run.sessionId
				}]
			}
		});
	};
	const capture = (workspaceId) => {
		const projectCapture = ctx.knowledge.catalog(lifetime.signal).bases.some((base) => base.kind === "project" && base.enabled && !base.archived && base.workspaceIds.includes(workspaceId) && ctx.knowledge.experienceCapture({ baseId: base.id }, lifetime.signal));
		for (const fact of ctx.codingWorkbench.checkExperiences(workspaceId, lifetime.signal)) {
			save({
				sourceKey: `check/recovery/${fact.initialRunId}/${fact.finalRunId}`,
				content: {
					title: "Development check passed after a failure",
					symptom: "A previously failing project check passed on a later run.",
					cause: null,
					solution: "",
					applicability: "",
					exclusions: "",
					technologies: [],
					references: [
						{
							kind: "check",
							id: fact.initialRunId
						},
						{
							kind: "check",
							id: fact.finalRunId
						},
						{
							kind: "session",
							id: fact.initialSessionId
						},
						{
							kind: "session",
							id: fact.verificationSessionId
						}
					]
				}
			});
			if (projectCapture) ctx.knowledge.captureExperience({
				workspaceId,
				sourceKey: `${fact.initialRunId}/${fact.finalRunId}`,
				content: {
					title: fact.check,
					symptom: fact.symptom,
					cause: null,
					solution: "",
					applicability: "",
					exclusions: "",
					technologies: [],
					references: [
						{
							kind: "check",
							id: fact.initialRunId
						},
						{
							kind: "check",
							id: fact.finalRunId
						},
						{
							kind: "session",
							id: fact.initialSessionId
						},
						{
							kind: "session",
							id: fact.verificationSessionId
						}
					]
				}
			}, lifetime.signal);
		}
	};
	ctx.on("knowledge/experience-capture-enabled", capture);
	ctx.on("coding/check-settled", (run) => {
		if (run.status === "passed") capture(run.workspaceId);
		else failure(run);
	});
	ctx.on("coding/repair-settled", (repair) => {
		if (repair.status === "passed") capture(repair.workspaceId);
	});
	ctx.on("session/event", (session, event) => {
		if (event.type !== "tool/result" || event.data.error === void 0) return;
		const code = event.data.error.code;
		const pitfall = toolPitfalls.get(code);
		if (pitfall === void 0) return;
		save({
			sourceKey: `tool/${session.id}/${code}`,
			content: {
				title: code,
				...pitfall,
				cause: null,
				exclusions: "",
				technologies: [],
				references: [{
					kind: "session",
					id: session.id
				}]
			}
		});
	});
	for (const workspace of ctx.workspaceRegistry.list()) try {
		for (const run of ctx.codingWorkbench.overview({ workspaceId: workspace.id }, lifetime.signal).runs) failure(run);
		capture(workspace.id);
	} catch (error) {
		ctx.logger.warn("Historical experience capture is incomplete. Repair facts remain in the coding workbench; inspect knowledge storage before retrying.", error);
	}
}
//#endregion
export { apply, inject, name };
