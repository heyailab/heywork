import { ToolContextUnavailableError, defineTool } from "@deepseek-ai/dsh-tools";
import { ARTIFACTS, evaluateArtifact, evaluateCheckpoint, requiredArtifacts } from "@deepseek-ai/dsh-util-uma-delivery";
//#region lib/types/index.js
/** Model-facing write and read for the `.uma/` delivery artifacts, with section and placeholder checks. */
/** Cordis plugin identity. */
const name = "tool-uma-workflow";
/** Tool, filesystem, and working-directory services used by the artifact tools. */
const inject = [
	"tools",
	"fs",
	"workingDirectory"
];
function compose(artifact, status, owner, content) {
	return `---\nartifact: ${artifact}\nstatus: ${status}\nowner: ${owner}\nupdated: ${(/* @__PURE__ */ new Date()).toISOString()}\n---\n\n${content.trim()}\n`;
}
/**
* Register the `.uma/` artifact tools.
* @param ctx - Context carrying the tool, filesystem, and working-directory services.
*/
function apply(ctx) {
	ctx.tools.register(defineTool({
		name: "uma_artifact_write",
		description: "Write a controlling delivery artifact under `.uma/` in the current workspace: research, prd, architecture, uiux, spec, preview, qa, or delivery. Returns missing required sections and placeholder warnings so the artifact can be fixed before a confirmation gate.",
		parameters: {
			artifact: {
				type: "string",
				required: true,
				enum: [...ARTIFACTS],
				description: "Artifact kind; the file is `.uma/<artifact>.md`."
			},
			content: {
				type: "string",
				required: true,
				description: "Markdown body without frontmatter."
			},
			status: {
				type: "string",
				enum: ["draft", "approved"],
				description: "Review status written to the frontmatter. Defaults to draft."
			},
			owner: {
				type: "string",
				description: "Artifact owner written to the frontmatter. Defaults to uma-team."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					path: {
						type: "string",
						required: true
					},
					artifact: {
						type: "string",
						required: true,
						enum: [...ARTIFACTS]
					},
					status: {
						type: "string",
						required: true,
						enum: ["draft", "approved"]
					},
					bytes: {
						type: "integer",
						required: true
					},
					missingSections: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					placeholders: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					ready: {
						type: "boolean",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: [
					`Wrote ${value.path} (${value.bytes} bytes, ${value.status}).`,
					value.missingSections.length === 0 ? "Required sections present." : `Missing section checks: ${value.missingSections.join(", ")}.`,
					value.placeholders.length === 0 ? "No placeholder markers." : `Placeholders to resolve: ${value.placeholders.join(", ")}.`
				].join("\n")
			}]
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("uma_artifact_write requires an agent Session");
			if (args.content.trim().length === 0) throw new Error("uma_artifact_write requires non-empty content");
			const status = args.status ?? "draft";
			const owner = args.owner ?? "uma-team";
			const content = compose(args.artifact, status, owner, args.content);
			const policy = ctx.get("sandboxPolicy");
			if (ctx.fs.sandboxMode !== void 0 && policy === void 0) throw new ToolContextUnavailableError("Artifact writes require the mounted filesystem’s sandbox policy service");
			const sandbox = policy?.resolve({ session: exec.agent.session });
			const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
			const target = await ctx.fs.resolve(`.uma/${args.artifact}.md`, {
				cwd,
				signal: exec.signal
			});
			const intent = await ctx.waterfall("fs/write-intent", target, exec, () => void 0);
			await ctx.fs.writeText(target, content, intent, exec.signal, sandbox);
			const evaluated = evaluateArtifact(args.artifact, args.content);
			return {
				path: target.displayPath,
				artifact: args.artifact,
				status,
				bytes: Buffer.byteLength(content, "utf8"),
				missingSections: evaluated.missingSections,
				placeholders: evaluated.placeholders,
				ready: evaluated.ready
			};
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Write .uma/${args.artifact}.md`,
			kind: "other",
			rawInput: args
		})
	}));
	ctx.tools.register(defineTool({
		name: "uma_artifact_read",
		description: "Read a controlling delivery artifact from `.uma/<artifact>.md` in the current workspace.",
		parameters: { artifact: {
			type: "string",
			required: true,
			enum: [...ARTIFACTS],
			description: "Artifact kind to read."
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					path: {
						type: "string",
						required: true
					},
					artifact: {
						type: "string",
						required: true,
						enum: [...ARTIFACTS]
					},
					content: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: value.content
			}]
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("uma_artifact_read requires an agent Session");
			const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
			const target = await ctx.fs.resolve(`.uma/${args.artifact}.md`, {
				cwd,
				signal: exec.signal
			});
			const content = await ctx.fs.readText(target, exec.signal);
			return {
				path: target.displayPath,
				artifact: args.artifact,
				content
			};
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Read .uma/${args.artifact}.md`,
			kind: "other",
			rawInput: args
		})
	}));
	ctx.tools.register(defineTool({
		name: "uma_gate_status",
		description: "Report the delivery state of the `.uma/` artifacts: which controlling documents exist, their review status, missing sections, placeholder markers, and the exact artifacts that block delivery. Use before a confirmation gate, before reporting completion, or when resuming work.",
		parameters: {
			depth: {
				type: "string",
				enum: [
					"patch",
					"feature",
					"product"
				],
				description: "patch: no ceremonial documents; feature: spec, QA and handoff; product: full pipeline. Defaults to product."
			},
			phase: {
				type: "string",
				enum: ["documents", "delivery"],
				description: "documents checks only the pre-implementation documents; delivery checks handoff documents. Defaults to delivery."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					exists: {
						type: "boolean",
						required: true
					},
					ready: {
						type: "boolean",
						required: true
					},
					missing: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					blocked: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					artifacts: {
						type: "array",
						required: true,
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								artifact: {
									type: "string",
									required: true,
									enum: [...ARTIFACTS]
								},
								status: {
									type: "string",
									required: true
								},
								ready: {
									type: "boolean",
									required: true
								},
								missingSections: {
									type: "array",
									required: true,
									items: { type: "string" }
								},
								placeholders: {
									type: "array",
									required: true,
									items: { type: "string" }
								}
							}
						}
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: [
					value.exists ? "Uma delivery state:" : "No .uma directory exists.",
					"Document checks only; this result does not prove tests, human approval or deployment.",
					value.ready ? "Ready: every required artifact is present and clean." : `Blocked: ${value.blocked.join(", ")}.`,
					...value.missing.length === 0 ? [] : [`Missing required artifacts: ${value.missing.join(", ")}.`],
					...value.artifacts.map((artifact) => [
						`- ${artifact.artifact} (${artifact.status}, ${artifact.ready ? "ready" : "not ready"})`,
						...artifact.missingSections.length === 0 ? [] : [`  missing sections: ${artifact.missingSections.join(", ")}`],
						...artifact.placeholders.length === 0 ? [] : [`  placeholders: ${artifact.placeholders.join(", ")}`]
					].join("\n"))
				].join("\n")
			}]
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("uma_gate_status requires an agent Session");
			const depth = args.depth ?? "product";
			const phase = args.phase ?? "delivery";
			const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
			const directory = await ctx.fs.resolve(".uma", {
				cwd,
				signal: exec.signal
			});
			let entries;
			try {
				entries = await ctx.fs.listDir(directory, exec.signal);
			} catch (error) {
				if (error.code === "FS_NOT_FOUND") {
					const missing = [...requiredArtifacts(depth, phase)];
					return {
						exists: false,
						ready: missing.length === 0,
						missing,
						blocked: missing,
						artifacts: []
					};
				}
				throw error;
			}
			const artifacts = [];
			for (const entry of entries) {
				if (entry.type !== "file") continue;
				const name = entry.name.replace(/\.md$/u, "");
				if (!ARTIFACTS.includes(name)) continue;
				const artifact = name;
				const evaluated = evaluateArtifact(artifact, await ctx.fs.readText(entry.target, exec.signal));
				artifacts.push({
					artifact,
					status: evaluated.status,
					ready: evaluated.ready,
					missingSections: evaluated.missingSections,
					placeholders: evaluated.placeholders
				});
			}
			artifacts.sort((left, right) => ARTIFACTS.indexOf(left.artifact) - ARTIFACTS.indexOf(right.artifact));
			const gate = evaluateCheckpoint(artifacts, depth, phase);
			return {
				exists: true,
				ready: gate.ready,
				missing: gate.missing,
				blocked: gate.blocked,
				artifacts
			};
		},
		presentCall: () => ({
			card: "generic",
			title: "Check Uma delivery gates",
			kind: "other"
		})
	}));
}
//#endregion
export { apply, inject, name };
