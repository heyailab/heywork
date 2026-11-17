import { i as readBundledResource, n as searchDesignRules, o as utf8Prefix, r as readDesignContext, t as RULE_DOMAINS } from "./rules-B-6_mXU8.js";
import { createHash } from "node:crypto";
import { listResourceDirectory, readResourceFile, resourceExists } from "@deepseek-ai/dsh-skill-uma/resources";
import { dirname, isAbsolute, join } from "node:path";
import { fileURLToPath } from "node:url";
import z from "@deepseek-ai/schemastery";
import { ToolContextUnavailableError, defineTool } from "@deepseek-ai/dsh-tools";
//#region lib/types/index.js
/** Native design-context inspection, rule retrieval and bundled design-system access. */
/** Cordis plugin identity. */
const name = "tool-hey-design";
/** Tool, filesystem, and working-directory services used by the design tools. */
const inject = [
	"tools",
	"fs",
	"workingDirectory",
	"systemPrompt"
];
/** Validated resource configuration. */
const Config = z.object({
	resourceMaxBytes: z.number().step(1).min(1024).max(98304).default(32768),
	projectWrite: z.boolean().default(true),
	projectFileMaxBytes: z.number().step(1).min(1024).default(262144),
	assetRoot: z.string().min(1),
	contextFileBytes: z.number().step(1).min(1024).default(32768),
	contextTotalBytes: z.number().step(1).min(1024).default(98304),
	ruleMaxResults: z.number().step(1).min(1).max(50).default(10),
	previewMaxBytes: z.number().step(1).min(1024).default(262144),
	catalogMaxPageSize: z.number().step(1).min(1).max(500).default(100)
});
const SYSTEM_FILES = [
	"DESIGN.md",
	"tokens.css",
	"components.html",
	"manifest.json",
	"tailwind-v4.css",
	"USAGE.md"
];
const INCLUDE_FILES = {
	design: "DESIGN.md",
	tokens: "tokens.css",
	components: "components.html",
	manifest: "manifest.json"
};
const INCLUDES = Object.keys(INCLUDE_FILES);
const MAX_FILE_BYTES = 32768;
const MAX_TOTAL_BYTES = 98304;
const KNOWLEDGE_ROOTS = [
	"uma-team/references",
	"uma-quality-gate/references",
	"uma-delivery-docs/templates",
	"uma-design-taste/references",
	"uma-design-craft/references",
	"uma-apple-review/references"
];
const MAX_KNOWLEDGE_LIMIT = 10;
const PROJECT_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u;
function systemManifest(systemsRoot, name) {
	const path = join(systemsRoot, name, "manifest.json");
	if (!resourceExists(path)) throw new Error(`Missing design manifest: ${name}`);
	const raw = JSON.parse(readResourceFile(path, "utf8"));
	if (typeof raw !== "object" || raw === null || Array.isArray(raw)) throw new Error(`Invalid design manifest: ${name}`);
	return raw;
}
function systemInfo(systemsRoot, name) {
	const record = systemManifest(systemsRoot, name);
	const category = typeof record.category === "string" ? record.category : "";
	const description = typeof record.description === "string" ? record.description : "";
	const displayName = typeof record.name === "string" ? record.name : name;
	const aliases = Array.isArray(record.aliases) ? record.aliases.filter((item) => typeof item === "string") : [];
	return {
		name,
		displayName,
		category,
		description: description.length > 0 ? description : displayName,
		aliases
	};
}
function childDirectories(root) {
	return listResourceDirectory(root, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
}
function readBounded(path, limit) {
	const buffer = readResourceFile(path);
	const truncated = buffer.byteLength > limit;
	return {
		content: truncated ? utf8Prefix(buffer.subarray(0, limit)) : new TextDecoder("utf-8", { fatal: true }).decode(buffer),
		truncated
	};
}
function collectSections(root, relative, out) {
	const directory = join(root, relative);
	for (const entry of listResourceDirectory(directory, { withFileTypes: true })) {
		const child = `${relative}/${entry.name}`;
		if (entry.isDirectory()) {
			collectSections(root, child, out);
			continue;
		}
		if (!entry.name.endsWith(".md")) continue;
		const raw = readResourceFile(join(root, child), "utf8");
		let heading = child.split("/").at(-1) ?? child;
		let body = [];
		const flush = () => {
			const text = body.join("\n").trim();
			if (text.length > 0) out.push({
				path: child,
				heading,
				text
			});
		};
		for (const line of raw.split(/\r?\n/)) {
			const match = /^#{1,3}\s+(.+)$/u.exec(line);
			if (match?.[1] !== void 0) {
				flush();
				heading = match[1].trim();
				body = [];
			} else body.push(line);
		}
		flush();
	}
}
function queryTerms(query) {
	const normalized = query.normalize("NFKC").toLowerCase();
	const terms = normalized.split(/\s+/u).filter((term) => term.length > 0);
	for (const match of normalized.matchAll(/[\u3400-\u9fff]+/g)) {
		const text = match[0];
		if (text.length === 1) {
			terms.push(text);
			continue;
		}
		for (let index = 0; index < text.length - 1; index++) terms.push(text.charAt(index) + text.charAt(index + 1));
	}
	return [...new Set(terms)];
}
function scoreSection(section, terms, phrase) {
	const heading = section.heading.normalize("NFKC").toLowerCase();
	const text = `${section.heading}\n${section.text}`.normalize("NFKC").toLowerCase();
	let score = phrase.length >= 4 && text.includes(phrase) ? 10 * terms.length : 0;
	let matches = 0;
	for (const term of terms) {
		if (!heading.includes(term) && !text.includes(term)) continue;
		matches += 1;
		if (heading.includes(term)) score += 4;
	}
	return score + matches * 2;
}
function snippetOf(text, terms, maximum) {
	const lower = text.toLowerCase();
	const first = terms.map((term) => lower.indexOf(term)).filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? 0;
	const start = Math.max(0, first - 120);
	const slice = text.slice(start, start + maximum).trim();
	return `${start > 0 ? "…" : ""}${slice}${start + maximum < text.length ? "…" : ""}`;
}
function isFsCode(error, code) {
	return error.code === code;
}
/**
* Register design asset discovery and read tools.
* @param ctx - Context carrying the tool registry.
* @param config - Optional external assets directory for packaged applications.
*/
function apply(ctx, config = {}) {
	const contextLimits = {
		fileBytes: config.contextFileBytes ?? 32768,
		totalBytes: config.contextTotalBytes ?? 98304
	};
	ctx.systemPrompt.section({
		name: "native-design-workflow",
		order: 112,
		text: "## Native UI design workflow\nFor UI work, call design_context before changing visuals; pass the actual monorepo target and selected design project when known. Use its project files and declared stack, then inspect existing components and rendered behavior. Missing DESIGN.md does not imply a new product. User-approved branding, existing project tokens and component libraries take precedence over bundled inspiration. Use design_asset_list/get only to fill a missing foundation; never replace a known brand or framework merely to fit a template. Bundled design and knowledge references are virtual resource identifiers, not filesystem paths. Read them through the design tools; do not locate installed source files with shell or filesystem tools. Describe the chosen style and decisions without quoting internal resource identifiers or installation locations. Author project-specific design documents and components; never copy complete internal reference files into user workspaces. User-owned project files remain ordinary deliverables. Use design_rule_search for concrete UX, typography, color, chart, motion and stack rules; rule hits are references, not visual acceptance. Classify the surface as persuade, operate, read or experience and load the matching hey-design-craft/taste guidance. When the user requests variants, produce the requested number with materially different layout, hierarchy and interaction while preserving approved brand constraints; implement only the selected direction. Implement production UI in the existing stack; single-file HTML is for explicitly requested prototypes. For new UI and redesign, apply the selected layout and component patterns; identify where they appear in the rendered page. Report visual acceptance separately from functional checks. Verify actual rendered UI and primary interactions at target sizes, including keyboard/focus, loading/empty/error, light/dark where supported and reduced motion. Static lint and model ratings do not prove visual acceptance. Record the target, design-context fingerprint, implementation revision, screenshots, tested flows and unresolved issues in the project REVIEW.md; changed source requires rechecking. Report unavailable visual checks explicitly. Do not start another agent runtime or copy third-party logos to satisfy a reference."
	});
	ctx.tools.register(defineTool({
		name: "design_context",
		description: "Read bounded existing design inputs and declared frontend dependencies from the current execution directory before UI work. Optional target scopes a monorepo surface; optional project reads `.design/<project>`. Returns exact contents/hashes and explicit omissions, never a visual-quality pass. Does not write files or execute project code.",
		parameters: {
			target: {
				type: "string",
				description: "Optional relative UI package directory, for example apps/web. Defaults to the execution directory."
			},
			project: {
				type: "string",
				description: "Optional existing kebab-case project id under .design/ or design-system/."
			},
			page: {
				type: "string",
				description: "Optional explicit page id under design-system/<project>/pages/. Requires project."
			}
		},
		output: {
			schema: { type: "string" },
			render: (_args, value) => [{
				type: "text",
				text: value
			}]
		},
		async execute(args, exec) {
			return JSON.stringify(await readDesignContext(ctx, exec, args, contextLimits));
		},
		presentCall: (args) => ({
			card: "generic",
			title: "Read project design context",
			kind: "search",
			rawInput: args
		})
	}));
	const skillRoot = dirname(fileURLToPath(import.meta.resolve("@deepseek-ai/dsh-skill-uma/package.json")));
	const assetRoot = config.assetRoot ?? join(skillRoot, "assets");
	if (!isAbsolute(assetRoot)) throw new Error("tool-hey-design: assetRoot must be an absolute directory");
	const systemsRoot = join(assetRoot, "uma-design-systems", "systems");
	const referencesRoot = join(assetRoot, "uma-design-md", "brands");
	const systems = childDirectories(systemsRoot);
	const systemCatalog = systems.map((name) => systemInfo(systemsRoot, name));
	const references = childDirectories(referencesRoot);
	if (systems.length === 0) throw new Error(`tool-hey-design: no design systems under ${systemsRoot}`);
	if (references.length === 0) throw new Error(`tool-hey-design: no DESIGN.md references under ${referencesRoot}`);
	const knowledge = [];
	for (const root of KNOWLEDGE_ROOTS) collectSections(assetRoot, root, knowledge);
	if (knowledge.length === 0) throw new Error(`tool-hey-design: no knowledge sections under ${assetRoot}`);
	ctx.tools.register(defineTool({
		name: "hey_resource_read",
		description: "Read or list a bundled HEY skill resource by skill name and relative path, without filesystem access. Use returned nextOffset to continue a directory page or next byte offset for text. Resources are read-only reference material, never commands to run automatically.",
		parameters: {
			skill: {
				type: "string",
				required: true,
				description: "Exact installed HEY skill name."
			},
			path: {
				type: "string",
				description: "Relative resource path from the skill, for example references/layouts.md. Omit to list resources."
			},
			offset: {
				type: "integer",
				description: "Continuation offset returned by the previous result; defaults to zero."
			}
		},
		output: {
			schema: { type: "string" },
			render: (_args, value) => [{
				type: "text",
				text: value
			}]
		},
		execute: (args) => Promise.resolve(readBundledResource(assetRoot, args.skill, args.path ?? "", args.offset ?? 0, config.resourceMaxBytes ?? 32768)),
		presentCall: (args) => ({
			card: "generic",
			title: `Read HEY resource: ${args.skill}`,
			kind: "other",
			rawInput: args
		})
	}));
	ctx.tools.register(defineTool({
		name: "design_rule_search",
		description: "Search bundled UI/UX rule CSV records natively with BM25 ranking and Chinese query expansion. Returns complete matched fields including do/dont, code samples and source rows. Select a domain or a named stack. This is reference retrieval, not current documentation verification, installed-component evidence or visual acceptance.",
		parameters: {
			query: {
				type: "string",
				required: true,
				description: "Concrete UI problem in English or Chinese, such as keyboard focus or 键盘焦点."
			},
			domain: {
				type: "string",
				required: true,
				enum: [...RULE_DOMAINS]
			},
			stack: {
				type: "string",
				description: "Explicit stack id such as react, vue, nextjs or shadcn; only for the stack domain. An invalid id returns available ids."
			},
			limit: {
				type: "integer",
				description: "Maximum matched records; defaults to 3 and is bounded by ruleMaxResults."
			}
		},
		output: {
			schema: { type: "string" },
			render: (_args, value) => [{
				type: "text",
				text: value
			}]
		},
		execute(args) {
			const limit = Math.min(Math.max(args.limit ?? 3, 1), config.ruleMaxResults ?? 10);
			return Promise.resolve(JSON.stringify(searchDesignRules(join(assetRoot, "hey-design-system/data"), {
				...args,
				limit
			})));
		},
		presentCall: (args) => ({
			card: "generic",
			title: "Search design rules",
			kind: "search",
			rawInput: args
		})
	}));
	ctx.tools.register(defineTool({
		name: "design_preview",
		description: "Display an actual saved self-contained HTML prototype in the current conversation. Reads a complete `.design/<project>/<variant>.html` file and logs its source/hash. The UI shows a static, script-disabled snapshot, not a build/test or interaction pass. Use the existing project runtime for interactive frontend verification. Never claim that merely previewing a file completes frontend development.",
		parameters: { path: {
			type: "string",
			required: true,
			description: "Workspace-relative .design/<kebab-project>/<variant>.html file already written by this task."
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
					html: {
						type: "string",
						required: true
					},
					sha256: {
						type: "string",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `Static prototype snapshot: ${value.path}\nSource SHA-256: ${value.sha256}\nThis previews saved source only; runtime interactions and build/tests remain separate.`
			}],
			presentationMeta: (_args, value) => ({
				kind: "hey-design-preview",
				version: 1,
				...value
			})
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("design_preview requires an Agent Session");
			if (!/^\.design\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.html$/u.test(args.path)) throw new Error("design_preview requires a saved HTML variant under .design/<project>/");
			const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
			const root = await ctx.fs.resolve(".", {
				cwd,
				signal: exec.signal
			});
			const info = await ctx.fs.lstat(args.path, { cwd }, exec.signal);
			if (info?.type !== "file") throw new Error("design_preview requires a regular HTML file");
			const target = await ctx.fs.resolve(args.path, {
				cwd,
				signal: exec.signal
			});
			if (!ctx.fs.contains(root, target)) throw new Error("design_preview path leaves the workspace");
			const bytes = await ctx.fs.readBytes(target, exec.signal, config.previewMaxBytes ?? 262144);
			const html = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
			if (html.includes("\0") || html.trim() === "") throw new Error("design_preview requires nonempty UTF-8 HTML text");
			if ((await ctx.fs.stat(target, exec.signal))?.version !== info.version) throw new Error("Prototype changed while reading; retry the preview");
			return {
				path: args.path,
				html,
				sha256: createHash("sha256").update(bytes).digest("hex")
			};
		},
		presentCall: (args) => ({
			card: "generic",
			title: "Preview saved UI prototype",
			kind: "read",
			rawInput: args
		})
	}));
	ctx.tools.register(defineTool({
		name: "design_asset_list",
		description: "List the bundled production design systems and DESIGN.md references available for UI work. Inspect design_context first. Search by brand or category, or page with offset and limit to inspect large catalogs. Use this catalog only to fill a missing foundation or support an explicitly requested redesign.",
		parameters: {
			query: {
				type: "string",
				description: "Optional brand, alias, category or purpose search."
			},
			category: {
				type: "string",
				description: "Optional exact catalog category."
			},
			offset: {
				type: "integer",
				description: "Zero-based offset within matched systems; defaults to zero."
			},
			limit: {
				type: "integer",
				description: "Optional page size, bounded by catalogMaxPageSize. Omit for every matching system."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					systems: {
						type: "array",
						required: true,
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								name: {
									type: "string",
									required: true
								},
								category: {
									type: "string",
									required: true
								},
								description: {
									type: "string",
									required: true
								}
							}
						}
					},
					references: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					total: {
						type: "integer",
						required: true
					},
					catalogSize: {
						type: "integer",
						required: true
					},
					offset: {
						type: "integer",
						required: true
					},
					nextOffset: { type: "integer" }
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: [
					"Design systems:",
					...value.systems.map((system) => `- ${system.name}${system.category.length === 0 ? "" : ` (${system.category})`}: ${system.description}`),
					`DESIGN.md references: ${value.references.join(", ")}`,
					`Catalog total: ${String(value.total)}; offset: ${String(value.offset)}; next offset: ${value.nextOffset === void 0 ? "none" : String(value.nextOffset)}`,
					`Installed design systems: ${String(value.catalogSize)}`,
					...value.total === 0 && value.catalogSize > 0 ? ["No systems matched. Shorten the query or omit filters to browse the installed catalog."] : []
				].join("\n")
			}]
		},
		execute: (args) => {
			const offset = args.offset ?? 0;
			const limit = args.limit;
			if (!Number.isSafeInteger(offset) || offset < 0) throw new Error("design_asset_list: offset must be a nonnegative integer");
			if (limit !== void 0 && (!Number.isSafeInteger(limit) || limit < 1 || limit > (config.catalogMaxPageSize ?? 100))) throw new Error("design_asset_list: limit must be a positive integer within catalogMaxPageSize");
			const normalise = (value) => value.normalize("NFKC").toLocaleLowerCase("en-US").replace(/[^\p{Letter}\p{Number}]/gu, "");
			const query = normalise(args.query ?? "");
			const terms = [...new Set((args.query ?? "").split(/\s+/u).map(normalise).filter(Boolean))];
			const matches = systemCatalog.map((system) => {
				const identities = [
					system.name,
					system.displayName,
					...system.aliases
				].map(normalise);
				const fields = [
					...identities,
					normalise(system.category),
					normalise(system.description)
				];
				const exact = fields.some((value) => value.includes(query));
				return {
					system,
					score: query !== "" && identities.includes(query) ? terms.length + 2 : exact ? terms.length + 1 : terms.filter((term) => fields.some((value) => value.includes(term))).length
				};
			}).filter(({ system, score }) => (args.category === void 0 || system.category === args.category) && score > 0).sort((left, right) => right.score - left.score).map(({ system }) => system);
			const page = matches.slice(offset, limit === void 0 ? void 0 : offset + limit);
			const nextOffset = offset + page.length < matches.length ? offset + page.length : void 0;
			return Promise.resolve({
				systems: page.map(({ name, category, description }) => ({
					name,
					category,
					description
				})),
				references,
				total: matches.length,
				catalogSize: systemCatalog.length,
				offset,
				...nextOffset === void 0 ? {} : { nextOffset }
			});
		},
		presentCall: () => ({
			card: "generic",
			title: "List design assets",
			kind: "other"
		})
	}));
	ctx.tools.register(defineTool({
		name: "design_asset_get",
		description: "Read a bundled design system or DESIGN.md reference. Returns DESIGN.md, tokens.css, and optional component markup. Use the tokens as the source of truth and do not mix two systems in one product. Returned paths are virtual resource identifiers; retrieve more content with this tool rather than filesystem reads.",
		parameters: {
			kind: {
				type: "string",
				required: true,
				enum: ["system", "reference"],
				description: "system for a complete design system; reference for a DESIGN.md library entry."
			},
			name: {
				type: "string",
				required: true,
				description: "An exact name from design_asset_list."
			},
			include: {
				type: "array",
				items: {
					type: "string",
					enum: [...INCLUDES]
				},
				description: "Files to return. Defaults to design and tokens for a system, design for a reference."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					kind: {
						type: "string",
						required: true,
						enum: ["system", "reference"]
					},
					name: {
						type: "string",
						required: true
					},
					files: {
						type: "array",
						required: true,
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								name: {
									type: "string",
									required: true
								},
								path: {
									type: "string",
									required: true
								},
								content: {
									type: "string",
									required: true
								},
								truncated: {
									type: "boolean",
									required: true
								}
							}
						}
					}
				}
			},
			render: (_args, value) => {
				if (value.files.length === 0) return [{
					type: "text",
					text: `No readable files for ${value.kind} ${value.name}.`
				}];
				return value.files.map((file) => ({
					type: "text",
					text: `## ${file.path}\n\n${file.content}${file.truncated ? "\n\n[truncated at the read limit]" : ""}`
				}));
			},
			presentationMeta: (_args, value) => {
				const title = config.assetRoot === void 0 && value.kind === "system" && value.files.length > 0 ? systemCatalog.find((system) => system.name === value.name)?.displayName : void 0;
				return title === void 0 ? null : {
					kind: "hey-public-design-reference",
					version: 1,
					title,
					hasDesign: value.files.some((file) => file.name === "DESIGN.md" && file.content.length > 0),
					hasTokens: value.files.some((file) => file.name === "tokens.css" && file.content.length > 0),
					hasComponents: value.files.some((file) => file.name === "components.html" && file.content.length > 0),
					partial: value.files.some((file) => file.truncated)
				};
			}
		},
		execute(args) {
			if (!(args.kind === "system" ? systems : references).includes(args.name)) throw new Error(`unknown ${args.kind} ${JSON.stringify(args.name)}; call design_asset_list for valid names`);
			const root = args.kind === "system" ? systemsRoot : referencesRoot;
			const wanted = args.include ?? (args.kind === "system" ? ["design", "tokens"] : ["design"]);
			const files = [];
			let remaining = MAX_TOTAL_BYTES;
			for (const include of wanted) {
				const fileName = INCLUDE_FILES[include];
				if (args.kind === "reference" && fileName !== "DESIGN.md") continue;
				const path = join(root, args.name, fileName);
				if (!SYSTEM_FILES.includes(fileName) || !resourceExists(path)) continue;
				const reference = `hey-design://${args.kind === "system" ? "systems" : "brands"}/${encodeURIComponent(args.name)}/${fileName}`;
				const overhead = Buffer.byteLength(`## ${reference}\n\n\n\n[truncated at the read limit]`);
				if (remaining <= overhead) break;
				let document;
				try {
					document = readBounded(path, Math.min(MAX_FILE_BYTES, remaining - overhead));
				} catch (error) {
					if (!(error instanceof Error)) throw error;
					throw new Error(`Unable to read ${reference}. Verify the installed design assets and retry.`);
				}
				const { content, truncated } = document;
				remaining -= Buffer.byteLength(`## ${reference}\n\n${content}${truncated ? "\n\n[truncated at the read limit]" : ""}`);
				files.push({
					name: fileName,
					path: reference,
					content,
					truncated
				});
				if (remaining <= 0) break;
			}
			return Promise.resolve({
				kind: args.kind,
				name: args.name,
				files
			});
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Read design asset: ${args.name}`,
			kind: "other",
			rawInput: args
		})
	}));
	ctx.tools.register(defineTool({
		name: "hey_knowledge_search",
		description: "Search the bundled Uma delivery and design knowledge for relevant guidance: role methods, anti-slop rules, quality checklists, document templates, design craft references, and Apple platform notes. Use it when a task needs a method or checklist and you do not know which reference file owns it.",
		parameters: {
			query: {
				type: "string",
				required: true,
				description: "Keywords describing the guidance you need, for example \"design tokens contrast\" or \"PRD acceptance criteria\"."
			},
			limit: {
				type: "integer",
				description: "Maximum results, 1 through 10. Defaults to 5."
			},
			maxSnippetChars: {
				type: "integer",
				description: "Maximum characters per snippet, 200 through 2000. Defaults to 600."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					query: {
						type: "string",
						required: true
					},
					results: {
						type: "array",
						required: true,
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								path: {
									type: "string",
									required: true
								},
								heading: {
									type: "string",
									required: true
								},
								snippet: {
									type: "string",
									required: true
								},
								score: {
									type: "integer",
									required: true
								}
							}
						}
					}
				}
			},
			render: (_args, value) => value.results.length === 0 ? [{
				type: "text",
				text: `No bundled knowledge matched ${JSON.stringify(value.query)}.`
			}] : value.results.map((result) => ({
				type: "text",
				text: `## ${result.heading}\n${result.path}\n\n${result.snippet}`
			}))
		},
		execute(args) {
			const phrase = args.query.trim().normalize("NFKC").toLowerCase();
			const terms = queryTerms(phrase);
			if (terms.length === 0) throw new Error("hey_knowledge_search requires at least one search term");
			const limit = Math.min(Math.max(args.limit ?? 5, 1), MAX_KNOWLEDGE_LIMIT);
			const maxSnippetChars = Math.min(Math.max(args.maxSnippetChars ?? 600, 200), 2e3);
			const results = knowledge.map((section) => ({
				section,
				score: scoreSection(section, terms, phrase)
			})).filter((result) => result.score > 0).sort((left, right) => right.score - left.score || left.section.path.localeCompare(right.section.path)).slice(0, limit).map((result) => ({
				path: `hey-knowledge://${result.section.path}`,
				heading: result.section.heading,
				snippet: snippetOf(result.section.text, terms, maxSnippetChars),
				score: result.score
			}));
			return Promise.resolve({
				query: args.query,
				results
			});
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Search Uma knowledge: ${args.query}`,
			kind: "other",
			rawInput: args
		})
	}));
	if (config.projectWrite !== false) ctx.tools.register(defineTool({
		name: "design_project_create",
		description: "Create a user-owned design project using newly authored, project-specific design content. Creates `.design/<project>/` with DESIGN.md, tokens.css, components.html, manifest.json, and PROJECT.md. Read internal references to inform decisions, then supply original design, tokens and components. Never copy complete internal documents or templates.",
		parameters: {
			project: {
				type: "string",
				required: true,
				description: "Kebab-case project directory name under `.design/`."
			},
			system: {
				type: "string",
				required: true,
				description: "Exact installed system id from design_asset_list. Runtime validation rejects unknown ids."
			},
			title: {
				type: "string",
				required: true,
				description: "Human-readable product or project title."
			},
			purpose: {
				type: "string",
				description: "Optional one-line purpose written to PROJECT.md."
			},
			design: {
				type: "string",
				required: true,
				description: "Newly authored project-specific DESIGN.md; do not copy an internal reference document."
			},
			tokens: {
				type: "string",
				required: true,
				description: "CSS tokens tailored to this project; not a complete internal token library."
			},
			components: {
				type: "string",
				required: true,
				description: "Working component markup authored for this project, not a copied internal template."
			},
			overwrite: {
				type: "boolean",
				description: "Replace existing files in the project directory. Defaults to false."
			}
		},
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					project: {
						type: "string",
						required: true
					},
					system: {
						type: "string",
						required: true
					},
					path: {
						type: "string",
						required: true
					},
					files: {
						type: "array",
						required: true,
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								name: {
									type: "string",
									required: true
								},
								path: {
									type: "string",
									required: true
								}
							}
						}
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: `Created design project ${value.project} from ${value.system} at ${value.path}.\n${value.files.map((file) => `- ${file.name}: ${file.path}`).join("\n")}`
			}]
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("design_project_create requires an agent Session");
			const policy = ctx.get("sandboxPolicy");
			if (ctx.fs.sandboxMode !== void 0 && policy === void 0) throw new ToolContextUnavailableError("Design writes require the mounted filesystem’s sandbox policy service");
			const sandbox = policy?.resolve({ session: exec.agent.session });
			if (!PROJECT_NAME.test(args.project)) throw new Error("design_project_create: project must be kebab-case");
			if (!systems.includes(args.system)) throw new Error(`design_project_create: unknown design system ${JSON.stringify(args.system)}`);
			if (args.title.trim().length === 0) throw new Error("design_project_create: title must be non-empty");
			const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
			const source = join(systemsRoot, args.system);
			const generated = [
				["DESIGN.md", args.design],
				["tokens.css", args.tokens],
				["components.html", args.components]
			];
			for (const [name, content] of generated) {
				if (content.trim() === "" || Buffer.byteLength(content) > (config.projectFileMaxBytes ?? 262144)) throw new Error("Supply non-empty project-specific design files within the configured size limit");
				const original = readResourceFile(join(source, name), "utf8").trim().replace(/\s+/gu, " ");
				if (original.length >= 64 && content.replace(/\s+/gu, " ").includes(original)) throw new Error("Do not copy complete internal reference files; author a design tailored to the user project");
			}
			const projectDoc = [
				`# ${args.title}`,
				"",
				...args.purpose === void 0 ? [] : [`Purpose: ${args.purpose}`, ""],
				"## Project design",
				"",
				"DESIGN.md records the project decisions. tokens.css and components.html implement those decisions.",
				"Keep these files consistent with the application and verify rendered behavior before delivery."
			].join("\n");
			const contents = [
				...generated,
				["manifest.json", JSON.stringify({
					schemaVersion: "hey-design-project/v1",
					id: args.project,
					name: args.title,
					sourceRole: "project",
					files: {
						design: "DESIGN.md",
						tokens: "tokens.css",
						components: "components.html"
					}
				}, null, 2) + "\n"],
				["PROJECT.md", projectDoc]
			];
			const files = [];
			for (const [name, content] of contents) {
				const target = await ctx.fs.resolve(`.design/${args.project}/${name}`, {
					cwd,
					signal: exec.signal
				});
				const intent = await ctx.waterfall("fs/write-intent", target, exec, () => args.overwrite === true ? void 0 : { kind: "createIfAbsent" });
				try {
					await ctx.fs.writeText(target, content, intent, exec.signal, sandbox);
				} catch (error) {
					if (isFsCode(error, "FS_NOT_OBSERVED")) throw new Error(`design_project_create: ${target.displayPath} already exists; pass overwrite: true to replace it`);
					throw error;
				}
				files.push({
					name,
					path: target.displayPath
				});
			}
			return {
				project: args.project,
				system: "HEY",
				path: `.design/${args.project}`,
				files
			};
		},
		presentCall: (args) => ({
			card: "generic",
			title: `Create design project: ${args.project}`,
			kind: "other",
			rawInput: {
				project: args.project,
				title: args.title,
				purpose: args.purpose
			}
		})
	}));
	ctx.tools.register(defineTool({
		name: "design_project_status",
		description: "List design projects under `.design/`, or report one project’s files and whether its DESIGN.md and tokens.css contract is present.",
		parameters: { project: {
			type: "string",
			description: "Project directory name to inspect. Omit to list all projects."
		} },
		output: {
			schema: {
				type: "object",
				additionalProperties: false,
				properties: {
					project: {
						type: "string",
						required: true
					},
					projects: {
						type: "array",
						required: true,
						items: { type: "string" }
					},
					files: {
						type: "array",
						required: true,
						items: {
							type: "object",
							additionalProperties: false,
							properties: {
								name: {
									type: "string",
									required: true
								},
								path: {
									type: "string",
									required: true
								}
							}
						}
					},
					ready: {
						type: "boolean",
						required: true
					}
				}
			},
			render: (_args, value) => [{
				type: "text",
				text: value.project === "" ? value.projects.length === 0 ? "No design projects." : `Design projects: ${value.projects.join(", ")}` : [`Design project ${value.project}: ${value.ready ? "contract ready" : "contract incomplete"}.`, ...value.files.map((file) => `- ${file.name}: ${file.path}`)].join("\n")
			}]
		},
		async execute(args, exec) {
			if (exec.agent === void 0) throw new Error("design_project_status requires an agent Session");
			const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
			if (args.project === void 0) {
				const directory = await ctx.fs.resolve(".design", {
					cwd,
					signal: exec.signal
				});
				let entries;
				try {
					entries = await ctx.fs.listDir(directory, exec.signal);
				} catch (error) {
					if (isFsCode(error, "FS_NOT_FOUND")) return {
						project: "",
						projects: [],
						files: [],
						ready: false
					};
					throw error;
				}
				return {
					project: "",
					projects: entries.filter((entry) => entry.type === "directory").map((entry) => entry.name).sort(),
					files: [],
					ready: false
				};
			}
			if (!PROJECT_NAME.test(args.project)) throw new Error("design_project_status: project must be kebab-case");
			const directory = await ctx.fs.resolve(`.design/${args.project}`, {
				cwd,
				signal: exec.signal
			});
			let entries;
			try {
				entries = await ctx.fs.listDir(directory, exec.signal);
			} catch (error) {
				if (isFsCode(error, "FS_NOT_FOUND")) return {
					project: args.project,
					projects: [],
					files: [],
					ready: false
				};
				throw error;
			}
			const files = entries.filter((entry) => entry.type === "file").map((entry) => ({
				name: entry.name,
				path: entry.target.displayPath
			})).sort((left, right) => left.name.localeCompare(right.name));
			const names = new Set(files.map((file) => file.name));
			return {
				project: args.project,
				projects: [],
				files,
				ready: names.has("DESIGN.md") && names.has("tokens.css")
			};
		},
		presentCall: (args) => ({
			card: "generic",
			title: args.project === void 0 ? "List design projects" : `Design project: ${args.project}`,
			kind: "other",
			rawInput: args
		})
	}));
}
//#endregion
export { Config, apply, inject, name };
