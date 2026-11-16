import { z } from "zod";
//#region lib/types/index.js
/** Portable repository Wiki records and source-reference validation. @module */
/** Supported independently stored Wiki languages. */
const WIKI_LANGUAGES = ["zh", "en"];
/** One repository-relative Wiki storage root. */
const WIKI_ROOT = ".uma/wiki";
/** Portable-record ceiling; deployments can choose a lower generation budget. */
const MAX_WIKI_PAGES = 1e3;
/** Portable-record ceiling for evidence-bearing knowledge cards. */
const MAX_WIKI_CARDS = 3e3;
/** A repository-relative path without traversal, absolute roots, or control characters. */
const sourcePathSchema = z.string().min(1).max(1024).refine((value) => !/^[\\/]|^[a-z]:|[\\\u0000-\u001f]/iu.test(value) && value.split("/").every((part) => part !== "" && part !== "." && part !== ".."), "Expected a repository-relative path");
/** Persisted page identifiers are validated before branding. */
const pageIdSchema = z.string().regex(/^[a-z][a-z0-9-]{0,63}$/u).transform((value) => value);
const hashSchema = z.string().regex(/^[a-f0-9]{64}$/u);
/** One indexed source file; contents remain in the repository. */
const sourceFileSchema = z.object({
	path: sourcePathSchema,
	hash: hashSchema,
	bytes: z.number().int().nonnegative(),
	lines: z.number().int().positive(),
	imports: z.array(sourcePathSchema)
}).strict();
/** Git identity and content fingerprint of the analyzed working tree. */
const revisionSchema = z.object({
	branch: z.string().min(1).max(256),
	commit: z.string().regex(/^[a-f0-9]{40,64}$/u).nullable(),
	fingerprint: hashSchema,
	scannedAt: z.iso.datetime(),
	fileCount: z.number().int().nonnegative(),
	dirty: z.boolean(),
	git: z.boolean()
}).strict();
/** An immutable indexed working-tree snapshot. */
const wikiIndexSchema = z.object({
	version: z.literal(1),
	revision: revisionSchema,
	files: z.array(sourceFileSchema),
	dirtyPaths: z.array(sourcePathSchema).default([]),
	skipped: z.array(z.object({
		path: sourcePathSchema,
		reason: z.enum([
			"excluded",
			"too-large",
			"not-text",
			"symlink"
		])
	}).strict())
}).strict();
/** A source range verified against the exact indexed file. */
const sourceReferenceSchema = z.object({
	path: sourcePathSchema,
	start: z.number().int().positive(),
	end: z.number().int().positive(),
	hash: hashSchema
}).strict().refine((value) => value.end >= value.start, "Source range must be ordered");
/** A planned article and its published, content-addressed revision. */
const wikiPageSchema = z.object({
	id: pageIdSchema,
	title: z.string().trim().min(1).max(180),
	goal: z.string().trim().min(1).max(1200),
	parent: pageIdSchema.nullable(),
	sources: z.array(sourceReferenceSchema).max(100),
	dependencies: z.array(sourcePathSchema).max(500),
	state: z.enum([
		"pending",
		"ready",
		"stale"
	]),
	contentPath: sourcePathSchema.nullable(),
	contentHash: hashSchema.nullable(),
	summary: z.string().max(2e3),
	updatedAt: z.iso.datetime().nullable()
}).strict().superRefine((page, issue) => {
	if (page.state === "ready" && (page.contentPath === null || page.contentHash === null || page.sources.length === 0)) issue.addIssue({
		code: "custom",
		message: "Ready Wiki pages require published content and source references"
	});
});
/** One compact, independently retrievable unit of project knowledge. */
const knowledgeCardSchema = z.object({
	page: pageIdSchema,
	title: z.string().min(1).max(180),
	content: z.string().min(1).max(4e3),
	sources: z.array(sourceReferenceSchema).min(1).max(20)
}).strict();
/** Durable generation checkpoint, scoped to a Git branch and language. */
const wikiManifestSchema = z.object({
	version: z.literal(1),
	language: z.enum(WIKI_LANGUAGES),
	template: z.enum(["architecture", "product_requirement"]),
	revision: revisionSchema,
	indexPath: sourcePathSchema,
	generationSession: z.string().min(1).transform((value) => value),
	phase: z.enum(["writing", "ready"]),
	citation: z.boolean(),
	autoUpdate: z.boolean(),
	notes: z.string().max(8e3),
	pages: z.array(wikiPageSchema).min(1).max(MAX_WIKI_PAGES),
	cards: z.array(knowledgeCardSchema).max(MAX_WIKI_CARDS),
	updatedAt: z.iso.datetime()
}).strict().superRefine((manifest, issue) => {
	for (const card of manifest.cards) if (!manifest.pages.some((page) => page.id === card.page)) issue.addIssue({
		code: "custom",
		message: "Wiki card has no article"
	});
	if (manifest.phase === "ready" && manifest.pages.some((page) => page.state !== "ready" || !manifest.cards.some((card) => card.page === page.id))) issue.addIssue({
		code: "custom",
		message: "Ready editions require all planned articles and their knowledge cards"
	});
});
/** Portable index of branch/language editions within a repository. */
const wikiCatalogSchema = z.object({
	version: z.literal(1),
	editions: z.array(z.object({
		branch: z.string().min(1),
		language: z.enum(WIKI_LANGUAGES),
		manifestPath: sourcePathSchema,
		updatedAt: z.iso.datetime()
	}).strict()).max(500)
}).strict();
/**
* Exclude credential material before any source read or publication.
* @param path - repository-relative file path.
* @returns whether the source is prohibited regardless of scanner configuration.
*/
function isWikiSecret(path) {
	return path.split("/").some((segment) => /^(?:\.env(?:\..*)?|\.credentials(?:\..*)?|credentials(?:\..*)?|id_(?:rsa|ed25519)|\.npmrc|\.pypirc|\.netrc)$/iu.test(segment)) || /\.(?:pem|p12|pfx|key|keystore)$/iu.test(path);
}
/**
* Validate the parent graph and page identities before publishing a plan.
* @param pages - the complete planned article tree.
* @throws when identities repeat, a parent is absent, or the graph has a cycle.
*/
function validateWikiTree(pages) {
	const byId = new Map(pages.map((page) => [page.id, page]));
	if (byId.size !== pages.length) throw new Error("Wiki page identifiers must be unique");
	for (const page of pages) {
		const visited = /* @__PURE__ */ new Set();
		let cursor = page;
		while (true) {
			if (visited.has(cursor.id)) throw new Error("Wiki parent graph contains a cycle");
			visited.add(cursor.id);
			if (cursor.parent === null) break;
			const parent = byId.get(cursor.parent);
			if (parent === void 0) throw new Error(`Wiki parent is absent: ${cursor.parent}`);
			cursor = parent;
		}
	}
}
/**
* Find source changes and affected pages, including transitive import dependents.
* @param previous - source snapshot that produced the existing edition.
* @param current - current source snapshot.
* @param pages - existing articles and their source dependencies.
* @returns changed source paths and article ids requiring regeneration.
*/
function wikiImpact(previous, current, pages) {
	const before = new Map(previous.files.map((file) => [file.path, file.hash]));
	const after = new Map(current.files.map((file) => [file.path, file.hash]));
	const changed = new Set([...before.keys(), ...after.keys()].filter((path) => before.get(path) !== after.get(path)));
	const impacted = new Set(changed);
	const importers = /* @__PURE__ */ new Map();
	for (const file of [...previous.files, ...current.files]) for (const dependency of file.imports) {
		const paths = importers.get(dependency) ?? /* @__PURE__ */ new Set();
		paths.add(file.path);
		importers.set(dependency, paths);
	}
	const pending = [...changed];
	for (const dependency of pending) for (const path of importers.get(dependency) ?? []) {
		if (impacted.has(path)) continue;
		impacted.add(path);
		pending.push(path);
	}
	const structural = [...changed].some((path) => !before.has(path) || !after.has(path));
	const affected = pages.filter((page) => page.state !== "ready" || page.dependencies.some((path) => impacted.has(path)) || page.sources.some((source) => impacted.has(source.path)) || structural && page.parent === null).map((page) => page.id);
	return {
		changed: [...changed].sort(),
		affected
	};
}
/**
* Reject a reference whose source was not indexed or whose range is outside it.
* @param reference - exact citation supplied by the author.
* @param files - indexed source metadata.
* @throws when the path, hash, or line range cannot substantiate the citation.
*/
function validateWikiReference(reference, files) {
	const file = files.find((item) => item.path === reference.path);
	if (file === void 0 || reference.hash !== file.hash || reference.end > file.lines) throw new Error(`Unverified Wiki source reference: ${reference.path}:${reference.start}-${reference.end}`);
}
/**
* Segment natural-language questions and source identifiers for lexical retrieval.
* @param query - current task or explicit knowledge search.
* @returns deduplicated lowercase English, Chinese and source-name tokens.
*/
function wikiSearchTokens(query) {
	const words = new Intl.Segmenter("zh", { granularity: "word" }).segment(query.toLowerCase());
	return [...new Set([...words].filter((word) => word.isWordLike && word.segment.length >= 2).map((word) => word.segment))];
}
/** Explicit user-owned generation controls carried in the logged task prompt. */
const wikiGenerationOptionsSchema = z.object({
	language: z.enum(WIKI_LANGUAGES),
	template: z.enum(["architecture", "product_requirement"]),
	notes: z.string().max(8e3),
	citation: z.boolean(),
	autoUpdate: z.boolean()
}).strict();
/** Local automatic-generation consent; shared Wiki metadata alone does not grant it. */
const wikiAutoUpdatePreferencesSchema = z.record(z.string(), z.boolean());
/** Portable export contains generated knowledge and source metadata, never source text. */
const wikiExportSchema = z.object({
	version: z.literal(1),
	manifest: wikiManifestSchema,
	index: wikiIndexSchema,
	documents: z.record(z.string(), z.string())
}).strict();
//#endregion
export { MAX_WIKI_CARDS, MAX_WIKI_PAGES, WIKI_LANGUAGES, WIKI_ROOT, isWikiSecret, knowledgeCardSchema, pageIdSchema, revisionSchema, sourceFileSchema, sourcePathSchema, sourceReferenceSchema, validateWikiReference, validateWikiTree, wikiAutoUpdatePreferencesSchema, wikiCatalogSchema, wikiExportSchema, wikiGenerationOptionsSchema, wikiImpact, wikiIndexSchema, wikiManifestSchema, wikiPageSchema, wikiSearchTokens };
