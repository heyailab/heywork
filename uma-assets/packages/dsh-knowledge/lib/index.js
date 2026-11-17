import { Service } from "@deepseek-ai/cordis";
import { Remote, RemoteError, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { brandString } from "@deepseek-ai/dsh-brand";
import { createHash, randomUUID } from "node:crypto";
import { lstat, mkdir, open, readdir, realpath } from "node:fs/promises";
import { basename, dirname, extname, isAbsolute, join, parse, relative, sep } from "node:path";
import { z } from "zod";
import z$1 from "@deepseek-ai/schemastery";
import { writeFileAtomic } from "@deepseek-ai/dsh-atomic-write";
import { constants } from "node:fs";
import { Worker } from "node:worker_threads";
//#region lib/types/config.js
/** Resource bounds and optional semantic retrieval for the local knowledge service. @module */
/** Validated defaults for desktop-scale local indexing. */
const Config = z$1.object({
	dshHome: z$1.string(),
	maxBases: z$1.number().min(1).step(1).default(100),
	maxTeams: z$1.number().min(1).step(1).default(50),
	maxStoredBytes: z$1.number().min(1048576).step(1).default(2147483648),
	maxIndexBytes: z$1.number().min(1048576).step(1).default(2147483648),
	previewPassages: z$1.number().min(1).step(1).default(40),
	revisionListLimit: z$1.number().min(1).step(1).default(50),
	minVectorSimilarity: z$1.number().min(0).max(1).default(.4),
	integrityCacheEntries: z$1.number().min(1).step(1).default(256),
	maxFileBytes: z$1.number().min(1024).step(1).default(20971520),
	maxTextBytes: z$1.number().min(1024).step(1).default(4194304),
	maxPages: z$1.number().min(1).step(1).default(300),
	maxSourceFiles: z$1.number().min(1).step(1).default(1e3),
	maxDocuments: z$1.number().min(1).step(1).default(1e3),
	maxChunks: z$1.number().min(1).step(1).default(4e3),
	parentChars: z$1.number().min(200).step(1).default(1800),
	childChars: z$1.number().min(100).step(1).default(500),
	overlapChars: z$1.number().min(0).step(1).default(80),
	parsingConcurrency: z$1.number().min(1).step(1).default(2),
	parseTimeoutMs: z$1.number().min(1e3).step(1).default(6e4),
	workerMemoryMb: z$1.number().min(64).step(1).default(256),
	syncIntervalMs: z$1.number().min(1e3).step(1).default(15e3),
	searchLimit: z$1.number().min(1).step(1).default(8),
	candidateLimit: z$1.number().min(1).step(1).default(32),
	maxVectorCandidates: z$1.number().min(1).step(1).default(2e4),
	contextMaxBytes: z$1.number().min(1024).step(1).default(2e4),
	busyTimeoutMs: z$1.number().min(1).step(1).default(5e3),
	excludeDirectories: z$1.array(z$1.string()).default([
		".git",
		".hey",
		"node_modules",
		"vendor",
		"dist",
		"lib",
		"build",
		".cache"
	]),
	embeddingUrl: z$1.string(),
	embeddingModel: z$1.string(),
	embeddingKeyRef: z$1.string(),
	embeddingTimeoutMs: z$1.number().min(1e3).step(1).default(3e4),
	embeddingBatchSize: z$1.number().min(1).step(1).default(16),
	maxEmbeddingDimensions: z$1.number().min(1).step(1).default(4096),
	maxEmbeddingResponseBytes: z$1.number().min(1024).step(1).default(8388608),
	queryPrefix: z$1.string().default(""),
	documentPrefix: z$1.string().default("")
});
//#endregion
//#region lib/types/schema.js
/** Validation for operator requests and durable SQLite JSON records. @module */
/** Validated collection identity. */
const baseIdSchema = z.uuid().transform((value) => brandString(value));
/** Validated document identity. */
const documentIdSchema = z.uuid().transform((value) => brandString(value));
/** Validated source identity. */
const sourceIdSchema = z.uuid().transform((value) => brandString(value));
/** Validated team grouping identity. */
const teamIdSchema = z.uuid().transform((value) => brandString(value));
/** Workspace identities come from the registry, never from a filesystem slug. */
const workspaceIdSchema = z.string().min(1).max(256).transform((value) => brandString(value));
/** Names are display data; no name is interpolated into an object path or SQL. */
const nameSchema = z.string().trim().min(1).max(160);
/** Complete mutable collection fields. */
const baseInputSchema = z.object({
	name: nameSchema,
	description: z.string().max(4e3),
	kind: z.enum(["team", "project"]),
	teamId: teamIdSchema.nullable(),
	workspaceIds: z.array(workspaceIdSchema).max(100),
	mode: z.enum(["fulltext", "hybrid"]),
	enabled: z.boolean()
}).strict().superRefine((value, ctx) => {
	if (value.kind === "project" && value.workspaceIds.length !== 1) ctx.addIssue({
		code: "custom",
		message: "A project collection requires exactly one imported workspace"
	});
	if (value.kind === "team" && value.teamId === null) ctx.addIssue({
		code: "custom",
		message: "A team collection requires a team grouping"
	});
	if (new Set(value.workspaceIds).size !== value.workspaceIds.length) ctx.addIssue({
		code: "custom",
		message: "Workspace bindings must be unique"
	});
});
/** Stored collection fields; counts are computed from current documents. */
const storedBaseSchema = baseInputSchema.safeExtend({
	id: baseIdSchema,
	archived: z.boolean(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime()
});
/** Accepted filename, independent of its native source path. */
const documentNameSchema = z.string().trim().min(1).max(512).refine((value) => !/[\x00-\x1f]/u.test(value));
z.array(z.number()).min(1);
//#endregion
//#region lib/types/text.js
/** Source-preserving parent/child passages and Chinese-aware lexical queries. @module */
/**
* Fingerprint exact file bytes or model/index configuration.
* @param value - UTF-8 text or binary bytes.
* @returns lowercase SHA-256.
*/
function knowledgeHash(value) {
	return createHash("sha256").update(value).digest("hex");
}
const STOP_WORDS = new Set([
	"的",
	"了",
	"是",
	"在",
	"和",
	"与",
	"及",
	"或",
	"吗",
	"呢",
	"啊",
	"有",
	"这",
	"那",
	"我们",
	"你",
	"我",
	"一个",
	"什么",
	"怎么",
	"如何",
	"请",
	"请问",
	"哪些",
	"一下",
	"the",
	"a",
	"an",
	"is",
	"are",
	"to",
	"of",
	"and",
	"or",
	"for",
	"with",
	"in",
	"on",
	"please",
	"what",
	"how"
]);
/**
* Segment Chinese words and programming identifiers without sending text to a service.
* @param text - source passage or query.
* @returns unique normalized terms, excluding whitespace and punctuation.
*/
function knowledgeTerms(text) {
	const words = [...new Intl.Segmenter("zh", { granularity: "word" }).segment(text.normalize("NFKC").toLowerCase())].filter((item) => item.isWordLike).map((item) => item.segment);
	return [...new Set(words.filter((word) => !STOP_WORDS.has(word) && /[\p{L}\p{N}]/u.test(word)))];
}
/**
* Form an escaped FTS5 disjunction; query syntax never comes from user input.
* @param text - natural-language question.
* @returns a quoted query, or null for punctuation-only input.
*/
function knowledgeFtsQuery(text) {
	const terms = knowledgeTerms(text).slice(0, 32);
	return terms.length === 0 ? null : terms.map((term) => `"${term.replaceAll("\"", "\"\"")}"`).join(" OR ");
}
function textBoundary(text, offset) {
	const current = text.charCodeAt(offset);
	const previous = text.charCodeAt(offset - 1);
	return current >= 56320 && current <= 57343 && previous >= 55296 && previous <= 56319 ? offset - 1 : offset;
}
/**
* Split headings/pages into bounded parents and overlapping child windows.
* @param document - normalized text with original page identities.
* @param config - parent/child sizes and document passage cap.
* @returns search windows carrying their complete bounded parent context.
* @throws when the complete document exceeds the configured passage count.
*/
function knowledgeChunks(document, config) {
	const chunks = [];
	let parentNumber = 0;
	for (const page of document.pages) {
		const lines = page.text.split("\n");
		let heading = "";
		let buffer = [];
		let firstLine = page.startLine;
		const flush = () => {
			const parentText = buffer.join("\n").trimEnd();
			if (parentText.trim() === "") {
				buffer = [];
				return;
			}
			const parentId = `p${parentNumber++}`;
			const endLine = firstLine + buffer.length - 1;
			for (let offset = 0, number = 0; offset < parentText.length; number++) {
				const end = textBoundary(parentText, Math.min(offset + config.childChars, parentText.length));
				const text = parentText.slice(offset, end);
				chunks.push({
					id: `${parentId}-c${number}`,
					parentId,
					heading,
					text,
					parentText,
					page: page.page,
					startLine: firstLine,
					endLine
				});
				if (chunks.length > config.maxChunks) throw new Error("too-many-chunks");
				if (end === parentText.length) break;
				offset = textBoundary(parentText, end - config.overlapChars);
			}
			buffer = [];
		};
		for (const [lineNumber, line] of lines.entries()) {
			if (/^#{1,6}\s/u.test(line)) {
				flush();
				heading = line.replace(/^#{1,6}\s+/u, "").trim();
			}
			if (buffer.join("\n").length + line.length + 1 > config.parentChars) flush();
			if (buffer.length === 0) firstLine = page.startLine + lineNumber;
			if (line.length > config.parentChars) for (let start = 0; start < line.length;) {
				const end = textBoundary(line, Math.min(start + config.parentChars, line.length));
				buffer = [line.slice(start, end)];
				firstLine = page.startLine + lineNumber;
				flush();
				start = end;
			}
			else buffer.push(line);
		}
		flush();
	}
	return chunks;
}
/**
* Merge lexical and dense rankings by reciprocal rank, with deterministic tie order.
* @param rankings - strongest-first identifiers for each retrieval method.
* @returns identifiers with fused scores, strongest first.
*/
function knowledgeFusion(rankings) {
	const scores = /* @__PURE__ */ new Map();
	for (const ranking of rankings) for (const [rank, id] of ranking.entries()) scores.set(id, (scores.get(id) ?? 0) + 1 / (60 + rank + 1));
	return [...scores].map(([id, score]) => ({
		id,
		score
	})).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
/**
* Compare validated finite vectors of one embedding profile.
* @param left - query vector.
* @param right - passage vector.
* @returns cosine similarity, or zero for a zero-norm vector.
* @throws when vector dimensions differ.
*/
function knowledgeCosine(left, right) {
	if (left.length !== right.length) throw new Error("embedding-dimensions-changed");
	let leftScale = 0;
	let rightScale = 0;
	for (const value of left) leftScale = Math.max(leftScale, Math.abs(value));
	for (const value of right) rightScale = Math.max(rightScale, Math.abs(value));
	if (leftScale === 0 || rightScale === 0) return 0;
	let dot = 0;
	let a = 0;
	let b = 0;
	for (const [index, value] of left.entries()) {
		const normalized = value / leftScale;
		const other = right[index] / rightScale;
		dot += normalized * other;
		a += normalized * normalized;
		b += other * other;
	}
	return a === 0 || b === 0 ? 0 : dot / Math.sqrt(a * b);
}
//#endregion
//#region lib/types/experience.js
/** Versioned development experience; authored review is distinct from executable verification. */
/** Validate an experience identity received through management APIs. */
const experienceIdSchema = z.uuid().transform((value) => brandString(value));
/** Validate authored content; referenced IDs are claims until their owning service checks them. */
const experienceInputSchema = z.object({
	title: z.string().trim().min(1).max(160),
	symptom: z.string().trim().min(1),
	cause: z.string().trim().nullable(),
	solution: z.string().trim(),
	applicability: z.string().trim(),
	exclusions: z.string().trim(),
	technologies: z.array(z.string().trim().min(1).max(80)).max(64),
	references: z.array(z.object({
		kind: z.enum([
			"session",
			"check",
			"review",
			"source"
		]),
		id: z.string().trim().min(1).max(2048)
	}).strict()).max(128)
}).strict();
const recordSchema = experienceInputSchema.extend({
	id: experienceIdSchema,
	baseId: baseIdSchema,
	revision: z.number().int().positive(),
	state: z.enum([
		"candidate",
		"reviewed",
		"withdrawn",
		"superseded"
	]),
	review: z.string(),
	supersededBy: experienceIdSchema.nullable(),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime()
});
/**
* Add or revise one experience with optimistic concurrency and immutable prior revisions.
* Editing reviewed content always resets it to candidate; no authored text certifies a code check.
* @param store - healthy installation-owned knowledge catalog.
* @param request - selected collection, expected version and complete authored content.
* @returns committed current revision.
*/
function saveExperience(store, request) {
	const baseId = baseIdSchema.parse(request.baseId);
	const content = experienceInputSchema.parse(request.content);
	checkSize(store, content);
	return store.transaction(() => {
		const base = store.bases().find((value) => value.id === baseId);
		if (base === void 0 || base.archived) throw new Error("experience-base-unavailable");
		const previous = request.id === null ? void 0 : readExperience(store, request.id);
		if (request.id !== null && (previous === void 0 || previous.baseId !== baseId)) throw new Error("experience-not-found");
		if ((previous?.revision ?? null) !== request.expectedRevision) throw new Error("experience-version-conflict");
		if (previous === void 0) {
			const count = store.db.prepare("SELECT count(*) count FROM experiences WHERE base_id=?").get(baseId);
			if (z.object({ count: z.number() }).parse(count).count >= store.config.maxDocuments) throw new Error("too-many-documents");
		}
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...content,
			id: previous?.id ?? brandString(randomUUID()),
			baseId,
			revision: (previous?.revision ?? 0) + 1,
			state: "candidate",
			review: "",
			supersededBy: null,
			createdAt: previous?.createdAt ?? now,
			updatedAt: now
		};
		persist(store, record);
		return record;
	});
}
/**
* Read a current experience without guessing whether a missing record was deleted.
* @param store - healthy knowledge catalog.
* @param id - explicit record identity.
* @returns current content, or undefined when absent.
*/
function readExperience(store, id) {
	const row = store.db.prepare("SELECT record FROM experiences WHERE id=?").get(experienceIdSchema.parse(id));
	return row === void 0 ? void 0 : recordSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(row).record));
}
/**
* Change lifecycle state only against the revision the operator actually reviewed.
* @param store - healthy knowledge catalog.
* @param request - expected revision, next state, review explanation and optional replacement.
* @returns committed state revision; review is human judgment, not executable verification.
*/
function transitionExperience(store, request) {
	const input = z.object({
		id: experienceIdSchema,
		expectedRevision: z.number().int().positive(),
		state: z.enum([
			"candidate",
			"reviewed",
			"withdrawn",
			"superseded"
		]),
		review: z.string().trim(),
		supersededBy: experienceIdSchema.nullable()
	}).strict().parse(request);
	checkSize(store, input);
	return store.transaction(() => {
		const previous = readExperience(store, input.id);
		if (previous === void 0) throw new Error("experience-not-found");
		if (previous.revision !== input.expectedRevision) throw new Error("experience-version-conflict");
		if (!store.bases().some((base) => base.id === previous.baseId && !base.archived)) throw new Error("experience-base-unavailable");
		if (input.state === "reviewed" && (input.review === "" || previous.solution === "" || previous.applicability === "" || previous.references.length === 0)) throw new Error("experience-review-incomplete");
		if (input.state === "superseded") {
			const replacement = input.supersededBy === null ? void 0 : readExperience(store, input.supersededBy);
			if (replacement === void 0 || replacement.id === previous.id || replacement.baseId !== previous.baseId || replacement.state !== "reviewed") throw new Error("experience-replacement-invalid");
		} else if (input.supersededBy !== null) throw new Error("experience-replacement-invalid");
		const record = {
			...previous,
			revision: previous.revision + 1,
			state: input.state,
			review: input.state === "candidate" ? "" : input.review,
			supersededBy: input.supersededBy,
			updatedAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		persist(store, record);
		return record;
	});
}
/**
* List current records in one collection with explicit paging and optional text/state filters.
* @param store - healthy knowledge catalog.
* @param request - scope and validated query controls.
* @returns matching current records and total, excluding other collections.
*/
function listExperiences(store, request) {
	const input = z.object({
		baseId: baseIdSchema,
		query: z.string(),
		state: z.enum([
			"all",
			"candidate",
			"reviewed",
			"withdrawn",
			"superseded"
		]),
		offset: z.number().int().nonnegative(),
		limit: z.number().int().positive()
	}).strict().parse(request);
	checkSize(store, input.query);
	const query = knowledgeFtsQuery(input.query);
	const where = "base_id=?" + (input.state === "all" ? "" : " AND state=?") + (query === null ? "" : " AND id IN (SELECT experience_id FROM experience_fts WHERE experience_fts MATCH ?)");
	const params = [
		input.baseId,
		...input.state === "all" ? [] : [input.state],
		...query === null ? [] : [query]
	];
	const total = z.object({ total: z.number() }).parse(store.db.prepare(`SELECT count(*) total FROM experiences WHERE ${where}`).get(...params)).total;
	return {
		items: store.db.prepare(`SELECT record FROM experiences WHERE ${where} ORDER BY updated_at DESC,id LIMIT ? OFFSET ?`).all(...params, Math.min(input.limit, store.config.candidateLimit), input.offset).map((row) => recordSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(row).record))),
		total
	};
}
/**
* Delete experience content and its index only after an exact-version check.
* Committed Session citations are independently retained by their Session owner.
* @param store - healthy knowledge catalog.
* @param id - selected experience.
* @param expectedRevision - last observed content revision.
*/
function deleteExperience(store, id, expectedRevision) {
	z.number().int().positive().parse(expectedRevision);
	store.transaction(() => {
		const previous = readExperience(store, id);
		if (previous === void 0) throw new Error("experience-not-found");
		if (previous.revision !== expectedRevision) throw new Error("experience-version-conflict");
		store.db.prepare("DELETE FROM experience_fts WHERE experience_id=?").run(id);
		store.db.prepare("DELETE FROM experience_versions WHERE experience_id=?").run(id);
		store.db.prepare("DELETE FROM experiences WHERE id=?").run(id);
	});
}
function checkSize(store, value) {
	if (Buffer.byteLength(JSON.stringify(value)) > store.config.maxTextBytes) throw new Error("text-too-large");
}
function persist(store, record) {
	const text = JSON.stringify(recordSchema.parse(record));
	checkSize(store, record);
	store.db.prepare("INSERT INTO experience_versions(experience_id,revision,record) VALUES(?,?,?)").run(record.id, record.revision, text);
	store.db.prepare(`INSERT INTO experiences(id,base_id,state,updated_at,record) VALUES(?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET state=excluded.state,updated_at=excluded.updated_at,record=excluded.record`).run(record.id, record.baseId, record.state, record.updatedAt, text);
	store.db.prepare("DELETE FROM experience_fts WHERE experience_id=?").run(record.id);
	store.db.prepare("INSERT INTO experience_fts(experience_id,text) VALUES(?,?)").run(record.id, knowledgeTerms([
		record.title,
		record.symptom,
		record.cause,
		record.solution,
		record.applicability,
		record.exclusions,
		...record.technologies
	].join("\n")).join(" "));
}
/**
* Capture one source-backed candidate at most once, including after its content is deleted.
* @param store - healthy knowledge catalog.
* @param baseId - explicitly enabled project capture target.
* @param sourceKey - stable identity of the retained repair evidence.
* @param content - redacted historical facts; cause and solution remain unknown until authored.
* @param options - Installation-owned capture bypasses per-project opt-in.
* @returns newly captured record, or null when already captured or capture is disabled.
*/
function captureExperience(store, baseId, sourceKey, content, options) {
	baseIdSchema.parse(baseId);
	z.string().min(1).max(512).parse(sourceKey);
	const parsed = experienceInputSchema.parse(content);
	checkSize(store, parsed);
	return store.transaction(() => {
		const enabled = store.db.prepare("SELECT enabled FROM experience_capture_targets WHERE base_id=?").get(baseId);
		const base = store.bases().find((item) => item.id === baseId);
		if (base === void 0 || base.archived || !base.enabled) return null;
		if (options?.installationWide !== true && (enabled?.enabled !== 1 || base.kind !== "project")) return null;
		if (store.db.prepare("SELECT 1 FROM experience_captures WHERE base_id=? AND source_key=?").get(baseId, sourceKey) !== void 0) return null;
		if (z.object({ count: z.number() }).parse(store.db.prepare("SELECT count(*) count FROM experiences WHERE base_id=?").get(baseId)).count >= store.config.maxDocuments) throw new Error("too-many-documents");
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...parsed,
			id: brandString(randomUUID()),
			baseId,
			revision: 1,
			state: "candidate",
			review: "",
			supersededBy: null,
			createdAt: now,
			updatedAt: now
		};
		persist(store, record);
		store.db.prepare("INSERT INTO experience_captures VALUES(?,?,?)").run(baseId, sourceKey, record.id);
		return record;
	});
}
/**
* Read retained content revisions without replacing their immutable records.
* @param store - healthy knowledge catalog.
* @param request - existing experience and page window.
* @returns newest-first revisions and total count.
*/
function experienceHistory(store, request) {
	const input = z.object({
		id: experienceIdSchema,
		offset: z.number().int().nonnegative(),
		limit: z.number().int().positive()
	}).strict().parse(request);
	if (readExperience(store, input.id) === void 0) throw new Error("experience-not-found");
	const total = z.object({ total: z.number() }).parse(store.db.prepare("SELECT count(*) total FROM experience_versions WHERE experience_id=?").get(input.id)).total;
	return {
		items: store.db.prepare("SELECT record FROM experience_versions WHERE experience_id=? ORDER BY revision DESC LIMIT ? OFFSET ?").all(input.id, Math.min(input.limit, store.config.revisionListLimit), input.offset).map((row) => recordSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(row).record))),
		total
	};
}
//#endregion
//#region lib/types/files.js
/** Bounded native reads for operator-selected sources and private immutable objects. @module */
/**
* Read a regular file without following a final symlink or exceeding its allowance.
* @param path - authorized absolute host path.
* @param maxBytes - complete byte limit.
* @param signal - caller or service lifetime.
* @returns exact bytes after stable file identity and version checks.
*/
async function readKnowledgeFile(path, maxBytes, signal) {
	signal.throwIfAborted();
	const initial = await lstat(path);
	if (!initial.isFile() || initial.isSymbolicLink()) throw new Error("not-a-regular-file");
	const handle = await open(path, constants.O_RDONLY | (process.platform === "win32" ? 0 : constants.O_NOFOLLOW));
	try {
		const before = await handle.stat();
		if (!before.isFile() || before.size > maxBytes) throw new Error("file-too-large");
		const chunks = [];
		let total = 0;
		while (total <= maxBytes) {
			signal.throwIfAborted();
			const next = new Uint8Array(Math.min(65536, maxBytes + 1 - total));
			const { bytesRead } = await handle.read(next, 0, next.length, total);
			if (bytesRead === 0) break;
			total += bytesRead;
			chunks.push(next.subarray(0, bytesRead));
		}
		if (total > maxBytes) throw new Error("file-too-large");
		const after = await handle.stat();
		const current = await lstat(path);
		if (before.size !== after.size || before.mtimeMs !== after.mtimeMs || before.ctimeMs !== after.ctimeMs || current.ino !== before.ino || current.dev !== before.dev || current.isSymbolicLink()) throw new Error("source-changed");
		signal.throwIfAborted();
		const result = new Uint8Array(total);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}
		return result;
	} finally {
		await handle.close();
	}
}
const bool = z.union([z.literal(0), z.literal(1)]).transform((value) => value === 1);
const documentRow = z.object({
	id: documentIdSchema,
	base_id: baseIdSchema,
	name: z.string(),
	title: z.string(),
	source_path: z.string().nullable(),
	source_id: sourceIdSchema.nullable(),
	state: z.enum([
		"queued",
		"processing",
		"ready",
		"error",
		"missing"
	]),
	enabled: bool,
	archived: bool,
	error: z.string().nullable(),
	active_revision: z.string().nullable(),
	pending_hash: z.string(),
	pending_path: z.string(),
	bytes: z.number(),
	source_version: z.string().nullable(),
	generation: z.number().int().positive(),
	updated_at: z.string(),
	chunk_count: z.number()
});
const sourceRow = z.object({
	id: sourceIdSchema,
	base_id: baseIdSchema,
	path: z.string(),
	kind: z.enum(["file", "folder"]),
	watch: bool,
	last_scan: z.string().nullable(),
	error: z.string().nullable()
});
const revisionRow = z.object({
	id: z.string(),
	document_id: documentIdSchema,
	source_hash: z.string(),
	text_path: z.string(),
	original_path: z.string(),
	created_at: z.string(),
	chunk_count: z.number(),
	profile: z.string().nullable()
});
const chunkRow = z.object({
	id: z.string(),
	document_id: documentIdSchema,
	base_id: baseIdSchema,
	revision: z.string(),
	parent_id: z.string(),
	heading: z.string(),
	text: z.string(),
	parent_text: z.string(),
	page: z.number().nullable(),
	start_line: z.number(),
	end_line: z.number(),
	vector: z.string().nullable(),
	profile: z.string().nullable()
});
/** One installation's catalog. A second live Host cannot consume the same parsing queue. */
var KnowledgeStore = class KnowledgeStore {
	root;
	config;
	/** SQLite connection; the owning service joins outstanding work before closing it. */
	db;
	lease = randomUUID();
	closed = false;
	trusted = true;
	objectTail = Promise.resolve();
	constructor(root, config, database) {
		this.root = root;
		this.config = config;
		this.db = database;
		try {
			this.db.exec(`PRAGMA busy_timeout=${config.busyTimeoutMs}; PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL;`);
			const version = z.object({ user_version: z.number() }).parse(this.db.prepare("PRAGMA user_version").get()).user_version;
			if (version !== 0 && version !== 1 && version !== 2) throw new Error("unsupported-knowledge-schema");
			const existing = z.object({ total: z.number() }).parse(this.db.prepare("SELECT count(*) total FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'").get());
			if (version === 0 && existing.total !== 0) throw new Error("unsupported-knowledge-schema");
			this.db.exec(`
        CREATE TABLE IF NOT EXISTS objects (path TEXT PRIMARY KEY, bytes INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS lease (id INTEGER PRIMARY KEY CHECK(id=1), pid INTEGER NOT NULL, token TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS teams (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS bases (id TEXT PRIMARY KEY, record TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS bindings (base_id TEXT NOT NULL REFERENCES bases(id), workspace_id TEXT NOT NULL,
          PRIMARY KEY(base_id,workspace_id));
        CREATE TABLE IF NOT EXISTS sources (id TEXT PRIMARY KEY, base_id TEXT NOT NULL REFERENCES bases(id), path TEXT NOT NULL,
          kind TEXT NOT NULL, watch INTEGER NOT NULL, last_scan TEXT, error TEXT, UNIQUE(base_id,path));
        CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, base_id TEXT NOT NULL REFERENCES bases(id), name TEXT NOT NULL, source_key TEXT NOT NULL,
          title TEXT NOT NULL, source_path TEXT, source_id TEXT REFERENCES sources(id), state TEXT NOT NULL,
          enabled INTEGER NOT NULL, archived INTEGER NOT NULL, error TEXT, active_revision TEXT,
          pending_hash TEXT NOT NULL, pending_path TEXT NOT NULL, bytes INTEGER NOT NULL, updated_at TEXT NOT NULL,
          chunk_count INTEGER NOT NULL DEFAULT 0, source_version TEXT, generation INTEGER NOT NULL DEFAULT 1, UNIQUE(base_id,source_key));
        CREATE INDEX IF NOT EXISTS documents_base ON documents(base_id,state,archived);
        CREATE TABLE IF NOT EXISTS revisions (id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES documents(id),
          source_hash TEXT NOT NULL, text_path TEXT NOT NULL, original_path TEXT NOT NULL, created_at TEXT NOT NULL,
          chunk_count INTEGER NOT NULL, profile TEXT);
        CREATE TABLE IF NOT EXISTS chunks (id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES documents(id), base_id TEXT NOT NULL,
          revision TEXT NOT NULL REFERENCES revisions(id), parent_id TEXT NOT NULL, heading TEXT NOT NULL, text TEXT NOT NULL,
          parent_text TEXT NOT NULL, page INTEGER, start_line INTEGER NOT NULL, end_line INTEGER NOT NULL, vector TEXT, profile TEXT);
        CREATE INDEX IF NOT EXISTS chunks_revision ON chunks(document_id,revision);
        CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(chunk_id UNINDEXED, document_id UNINDEXED, text);
      `);
			const pages = Math.floor(config.maxIndexBytes / 4096);
			this.db.exec(`PRAGMA max_page_count=${pages}`);
			this.transaction(() => {
				const previous = this.db.prepare("SELECT pid FROM lease WHERE id=1").get();
				if (previous !== void 0) {
					const pid = z.object({ pid: z.number().int().positive() }).parse(previous).pid;
					try {
						process.kill(pid, 0);
						throw new Error("knowledge-home-in-use");
					} catch (error) {
						if (!(error instanceof Error && "code" in error && error.code === "ESRCH")) throw error;
					}
				}
				this.db.prepare("INSERT OR REPLACE INTO lease VALUES(1,?,?)").run(process.pid, this.lease);
				this.db.exec(`
        CREATE TABLE IF NOT EXISTS experiences (id TEXT PRIMARY KEY,base_id TEXT NOT NULL REFERENCES bases(id),state TEXT NOT NULL,updated_at TEXT NOT NULL,record TEXT NOT NULL);
        CREATE INDEX IF NOT EXISTS experiences_base ON experiences(base_id,state);
        CREATE TABLE IF NOT EXISTS experience_capture_targets (base_id TEXT PRIMARY KEY REFERENCES bases(id),enabled INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS experience_captures (base_id TEXT NOT NULL REFERENCES bases(id),source_key TEXT NOT NULL,experience_id TEXT NOT NULL,PRIMARY KEY(base_id,source_key));
        CREATE TABLE IF NOT EXISTS experience_versions (experience_id TEXT NOT NULL,revision INTEGER NOT NULL,record TEXT NOT NULL,PRIMARY KEY(experience_id,revision));
        CREATE VIRTUAL TABLE IF NOT EXISTS experience_fts USING fts5(experience_id UNINDEXED,text);
        PRAGMA user_version=2;
        `);
				this.db.exec("UPDATE documents SET state='queued' WHERE state='processing'");
			});
		} catch (error) {
			this.db.close();
			throw error;
		}
	}
	/**
	* Open a private catalog and recover interrupted jobs.
	* @param root - absolute knowledge directory below the resolved Harness home.
	* @param config - resource bounds.
	* @returns an exclusive live Host owner.
	*/
	static async open(root, config) {
		await mkdir(root, {
			recursive: true,
			mode: 448
		});
		const { DatabaseSync } = await import("node:sqlite");
		return new KnowledgeStore(root, config, new DatabaseSync(join(root, "knowledge.sqlite")));
	}
	/** Release the queue lease only after the service has joined all readers and parsing jobs. */
	close() {
		if (this.closed) return;
		try {
			if (this.trusted) this.db.prepare("DELETE FROM lease WHERE token=?").run(this.lease);
		} finally {
			this.closed = true;
			this.db.close();
		}
	}
	/**
	* Commit one synchronous mutation or restore its complete previous state.
	* @param action - SQL mutations, without awaits.
	* @returns the mutation result after commit.
	*/
	transaction(action) {
		if (!this.trusted) throw new Error("knowledge-storage-untrusted");
		this.db.exec("BEGIN IMMEDIATE");
		try {
			const value = action();
			this.db.exec("COMMIT");
			return value;
		} catch (error) {
			try {
				this.db.exec("ROLLBACK");
			} catch (rollbackError) {
				this.trusted = false;
				throw new AggregateError([error, rollbackError], "knowledge-storage-untrusted");
			}
			throw error;
		}
	}
	/** Whether new reads/writes still have a known storage outcome. */
	get healthy() {
		return this.trusted && !this.closed;
	}
	/**
	* Retain content under its digest before any index points to it.
	* @param bytes - original or parsed file bytes.
	* @param extension - supported normalized extension, never a filename.
	* @returns the absolute immutable file path.
	*/
	object(bytes, extension) {
		const operation = this.objectTail.then(() => this.putObject(bytes, extension));
		this.objectTail = operation.then(() => void 0, () => void 0);
		return operation;
	}
	/**
	* Retain a human-readable immutable citation without changing older source paths.
	* @param bytes - complete extracted Markdown.
	* @param name - original display filename, sanitized into one path segment.
	* @returns the exact parsed Markdown path used by answer citations.
	*/
	citation(bytes, name) {
		const title = parse(basename(name)).name.replace(/[^\p{L}\p{N}_. -]/gu, "").slice(0, 100) || "document";
		const path = join(this.root, "citations", knowledgeHash(bytes), `${title}.md`);
		const operation = this.objectTail.then(() => this.putStored(bytes, path));
		this.objectTail = operation.then(() => void 0, () => void 0);
		return operation;
	}
	async putObject(bytes, extension) {
		if (!/^[a-z0-9]{1,8}$/u.test(extension)) throw new Error("invalid-object-extension");
		const digest = knowledgeHash(bytes);
		const path = join(this.root, "objects", `${digest}.${extension}`);
		return this.putStored(bytes, path);
	}
	async putStored(bytes, path) {
		const digest = knowledgeHash(bytes);
		this.transaction(() => {
			if (this.db.prepare("SELECT path FROM objects WHERE path=?").get(path) !== void 0) return;
			if (z.object({ bytes: z.number() }).parse(this.db.prepare("SELECT coalesce(sum(bytes),0) bytes FROM objects").get()).bytes + bytes.byteLength > this.config.maxStoredBytes) throw new Error("knowledge-storage-full");
			this.db.prepare("INSERT INTO objects VALUES(?,?)").run(path, bytes.byteLength);
		});
		try {
			if (knowledgeHash(await readKnowledgeFile(path, Math.max(this.config.maxFileBytes, this.config.maxTextBytes), new AbortController().signal)) !== digest) throw new Error("knowledge-object-modified");
			return path;
		} catch (error) {
			if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
		}
		await writeFileAtomic(path, bytes, {
			mode: 384,
			dirMode: 448
		});
		const handle = await open(path, "r");
		try {
			await handle.sync();
		} finally {
			await handle.close();
		}
		if (process.platform !== "win32") {
			const parent = await open(dirname(path), "r");
			try {
				await parent.sync();
			} finally {
				await parent.close();
			}
		}
		return path;
	}
	/**
	* Read local organizational groups.
	* @returns the groups in display-name order.
	*/
	teams() {
		return this.db.prepare("SELECT * FROM teams ORDER BY name").all().map((value) => {
			const row = z.object({
				id: teamIdSchema,
				name: z.string(),
				created_at: z.string()
			}).parse(value);
			return {
				id: row.id,
				name: row.name,
				createdAt: row.created_at
			};
		});
	}
	/**
	* Read collection settings and current indexing counts.
	* @returns validated collections and document counts.
	*/
	bases() {
		return this.db.prepare("SELECT record FROM bases ORDER BY id").all().map((value) => {
			const base = storedBaseSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(value).record));
			const counts = z.object({
				total: z.number(),
				ready: z.number()
			}).parse(this.db.prepare("SELECT count(*) total, coalesce(sum(state='ready' AND enabled=1),0) ready FROM documents WHERE base_id=? AND archived=0").get(base.id));
			return {
				...base,
				documentCount: counts.total,
				readyCount: counts.ready
			};
		});
	}
	/**
	* Create or replace collection metadata and retrieval bindings atomically.
	* @param id - server-minted or existing collection identity.
	* @param input - validated complete fields.
	* @returns the current collection.
	*/
	saveBase(id, input) {
		const previous = this.bases().find((base) => base.id === id);
		const now = (/* @__PURE__ */ new Date()).toISOString();
		const record = {
			...input,
			id,
			archived: previous?.archived ?? false,
			createdAt: previous?.createdAt ?? now,
			updatedAt: now
		};
		this.transaction(() => {
			this.db.prepare("INSERT INTO bases(id,record) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET record=excluded.record").run(id, JSON.stringify(record));
			this.db.prepare("DELETE FROM bindings WHERE base_id=?").run(id);
			for (const workspace of input.workspaceIds) this.db.prepare("INSERT INTO bindings VALUES(?,?)").run(id, workspace);
			if (previous !== void 0 && previous.mode !== input.mode) this.db.prepare("UPDATE documents SET state='queued', error=NULL,generation=generation+1 WHERE base_id=? AND archived=0").run(id);
		});
		return {
			...record,
			documentCount: previous?.documentCount ?? 0,
			readyCount: previous === void 0 || previous.mode !== input.mode ? 0 : previous.readyCount
		};
	}
	/**
	* Return one document's current state.
	* @param id - validated document identity.
	* @returns its current row, or undefined if absent.
	*/
	job(id) {
		const value = this.db.prepare("SELECT * FROM documents WHERE id=?").get(id);
		return value === void 0 ? void 0 : documentRow.parse(value);
	}
	/**
	* List documents, including archived rows only when requested.
	* @param baseId - owning collection.
	* @param archived - whether archived rows are included.
	* @returns document metadata, newest first.
	*/
	documents(baseId, archived = false) {
		return this.db.prepare(`SELECT * FROM documents WHERE base_id=? ${archived ? "" : "AND archived=0"} ORDER BY name`).all(baseId).map((value) => this.viewDocument(documentRow.parse(value)));
	}
	/**
	* Read source jobs without rebuilding their display metadata for every file.
	* @param sourceId - explicitly imported local source.
	* @returns all current source jobs, including archived documents.
	*/
	sourceJobs(sourceId) {
		return this.db.prepare("SELECT * FROM documents WHERE source_id=?").all(sourceId).map((value) => documentRow.parse(value));
	}
	/**
	* Project a database row without exposing pending object paths.
	* @param row - validated document row.
	* @returns browser-safe document metadata.
	*/
	viewDocument(row) {
		return {
			id: row.id,
			baseId: row.base_id,
			name: row.name,
			title: row.title,
			sourcePath: row.source_path,
			sourceId: row.source_id,
			state: row.state,
			enabled: row.enabled,
			archived: row.archived,
			error: row.error,
			revision: row.active_revision,
			chunkCount: row.chunk_count,
			bytes: row.bytes,
			updatedAt: row.updated_at
		};
	}
	/**
	* Admit a new document or a replacement revision, preserving historical publications.
	* @param input - validated source identity and already-retained original bytes.
	* @returns the stable document id and whether indexing is required.
	*/
	admit(input) {
		return input.ifAbsent === true ? this.transaction(() => this.admitDocument(input)) : this.admitDocument(input);
	}
	admitDocument(input) {
		const sourceKey = `${input.sourceId ?? "upload"}/${input.name}`;
		const found = input.ifAbsent === true ? this.db.prepare("SELECT * FROM documents WHERE base_id=? AND name=? LIMIT 1").get(input.baseId, input.name) : this.db.prepare("SELECT * FROM documents WHERE base_id=? AND source_key=?").get(input.baseId, sourceKey);
		const previous = found === void 0 ? void 0 : documentRow.parse(found);
		if (input.ifAbsent === true && previous !== void 0) return {
			id: previous.id,
			changed: false
		};
		if (previous?.pending_hash === input.hash && [
			"ready",
			"queued",
			"processing"
		].includes(previous.state) && !previous.archived) {
			this.db.prepare("UPDATE documents SET source_version=? WHERE id=?").run(input.sourceVersion, previous.id);
			return {
				id: previous.id,
				changed: false
			};
		}
		if (previous === void 0 && this.documents(input.baseId, true).length >= this.config.maxDocuments) throw new Error("too-many-documents");
		if (previous?.archived === true) throw new Error("document-archived");
		const id = previous?.id ?? brandString(randomUUID());
		this.db.prepare(`INSERT INTO documents(id,base_id,name,source_key,title,source_path,source_id,state,enabled,archived,error,
      active_revision,pending_hash,pending_path,bytes,updated_at,chunk_count,source_version) VALUES(?,?,?,?,?,?,?,'queued',1,0,NULL,NULL,?,?,?,?,0,?)
      ON CONFLICT(id) DO UPDATE SET source_path=excluded.source_path,source_id=excluded.source_id,state='queued',
      error=NULL,pending_hash=excluded.pending_hash,pending_path=excluded.pending_path,bytes=excluded.bytes,updated_at=excluded.updated_at,source_version=excluded.source_version,generation=generation+1`).run(id, input.baseId, input.name, sourceKey, input.name, input.sourcePath, input.sourceId, input.hash, input.path, input.bytes, (/* @__PURE__ */ new Date()).toISOString(), input.sourceVersion);
		return {
			id,
			changed: true
		};
	}
	/**
	* Claim one queued document. Only one Host owns this store.
	* @param excluded - document jobs still releasing their previous parsing resources.
	* @returns the admitted job, or undefined when no job remains.
	*/
	nextJob(excluded) {
		return this.transaction(() => {
			const row = this.db.prepare(`SELECT d.* FROM documents d JOIN bases b ON b.id=d.base_id WHERE d.state='queued' AND d.archived=0
        AND json_extract(b.record,'$.archived')=0
        ${excluded.length === 0 ? "" : `AND d.id NOT IN (${excluded.map(() => "?").join(",")})`} ORDER BY d.updated_at LIMIT 1`).get(...excluded);
			if (row === void 0) return void 0;
			const value = documentRow.parse(row);
			this.db.prepare("UPDATE documents SET state='processing' WHERE id=?").run(value.id);
			return value;
		});
	}
	/**
	* Atomically publish a complete parsed revision and its search index.
	* @param job - claimed source version; a superseded job cannot publish.
	* @param revision - immutable file identities.
	* @param chunks - complete parsed windows.
	* @param vectors - matching provider vectors, or null for lexical indexing.
	* @param profile - embedding profile fingerprint, or null.
	* @returns whether this job was still current and was published.
	*/
	publish(job, revision, chunks, vectors, profile) {
		return this.transaction(() => {
			const current = this.job(job.id);
			if (current?.generation !== job.generation || current.pending_hash !== job.pending_hash || current.state !== "processing" || current.archived) return false;
			this.db.prepare("INSERT OR IGNORE INTO revisions VALUES(?,?,?,?,?,?,?,?)").run(revision.id, job.id, job.pending_hash, revision.textPath, revision.originalPath, revision.createdAt, chunks.length, profile);
			this.db.prepare("DELETE FROM knowledge_fts WHERE document_id=?").run(job.id);
			const putChunk = this.db.prepare("INSERT OR REPLACE INTO chunks VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)");
			const putSearch = this.db.prepare("INSERT INTO knowledge_fts VALUES(?,?,?)");
			for (const [index, chunk] of chunks.entries()) {
				const id = `${revision.id}/${chunk.id}`;
				putChunk.run(id, job.id, job.base_id, revision.id, chunk.parentId, chunk.heading, chunk.text, chunk.parentText, chunk.page, chunk.startLine, chunk.endLine, vectors === null ? null : JSON.stringify(vectors[index]), profile);
				putSearch.run(id, job.id, knowledgeTerms(`${job.title}\n${chunk.heading}\n${chunk.text}`).join(" "));
			}
			this.db.prepare("UPDATE documents SET state='ready',error=NULL,active_revision=?,chunk_count=?,updated_at=? WHERE id=?").run(revision.id, chunks.length, (/* @__PURE__ */ new Date()).toISOString(), job.id);
			return true;
		});
	}
	/**
	* List local synchronization sources for one collection or all watched sources.
	* @param baseId - optional collection filter.
	* @returns validated source records.
	*/
	sources(baseId) {
		return (baseId === void 0 ? this.db.prepare("SELECT * FROM sources WHERE watch=1").all() : this.db.prepare("SELECT * FROM sources WHERE base_id=?").all(baseId)).map((value) => {
			const row = sourceRow.parse(value);
			return {
				id: row.id,
				baseId: row.base_id,
				path: row.path,
				kind: row.kind,
				watch: row.watch,
				lastScan: row.last_scan,
				error: row.error
			};
		});
	}
	/**
	* Read retained revisions, newest first.
	* @param documentId - owning document.
	* @returns at most the latest fifty revision records.
	*/
	revisions(documentId) {
		return this.db.prepare("SELECT * FROM revisions WHERE document_id=? ORDER BY created_at DESC LIMIT ?").all(documentId, this.config.revisionListLimit).map((value) => {
			const row = revisionRow.parse(value);
			return {
				id: row.id,
				documentId: row.document_id,
				sourceHash: row.source_hash,
				textPath: row.text_path,
				originalPath: row.original_path,
				createdAt: row.created_at,
				chunkCount: row.chunk_count
			};
		});
	}
	/**
	* Decode indexed child rows at the durable-data read point.
	* @param values - SQLite rows selected by the caller's authorized query.
	* @returns validated vectors and passage text.
	*/
	chunks(values) {
		return values.map((value) => {
			const row = chunkRow.parse(value);
			return {
				id: row.id,
				documentId: row.document_id,
				baseId: row.base_id,
				revision: row.revision,
				parentId: row.parent_id,
				heading: row.heading,
				text: row.text,
				parentText: row.parent_text,
				page: row.page,
				startLine: row.start_line,
				endLine: row.end_line,
				vector: row.vector === null ? null : z.array(z.number()).min(1).parse(JSON.parse(row.vector)),
				profile: row.profile
			};
		});
	}
};
//#endregion
//#region ../../credentials/credentials/src/index.ts
const REF_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
/**
* Brand a raw string as a {@link CredentialRef}.
* @param value - candidate reference; a POSIX shell identifier such as `DEEPSEEK_API_KEY`.
* @returns the branded reference.
*/
function credentialRef(value) {
	if (!isCredentialRefName(value)) throw new TypeError(`credential ref "${value}" must match ${String(REF_PATTERN)}`);
	return brandString(value);
}
/**
* Whether a raw string could name a reference at all. Consumers that receive
* environment-variable names from somewhere else — a provider library's own
* ambient discovery, a hook payload — ask this before resolving, because a name
* outside the grammar has no reference to miss and should read as "not set"
* rather than as a thrown error.
* @param value - candidate reference.
* @returns true when {@link credentialRef} would accept it.
*/
function isCredentialRefName(value) {
	return REF_PATTERN.test(value);
}
//#endregion
//#region lib/types/embedding.js
/** Validated provider profile shared by ingestion and query embedding. */
var KnowledgeEmbeddings = class {
	ctx;
	config;
	/** Fingerprint of the configured model and prefixes, or null when disabled. */
	profile;
	/**
	* Reject partial configuration before any document is admitted.
	* @param ctx - per-operation credential resolution.
	* @param config - explicit endpoint, model, prefixes and bounds.
	*/
	constructor(ctx, config) {
		this.ctx = ctx;
		this.config = config;
		const enabled = config.embeddingUrl !== void 0 || config.embeddingModel !== void 0 || config.embeddingKeyRef !== void 0;
		if (enabled && (config.embeddingUrl === void 0 || config.embeddingModel?.trim() === "")) throw new Error("incomplete-embedding-configuration");
		if (enabled && config.embeddingModel === void 0) throw new Error("incomplete-embedding-configuration");
		if (config.embeddingUrl !== void 0) {
			const url = new URL(config.embeddingUrl);
			if (!["http:", "https:"].includes(url.protocol) || url.username !== "" || url.password !== "" || url.search !== "" || url.hash !== "") throw new Error("invalid-embedding-url");
		}
		this.profile = !enabled ? null : knowledgeHash(JSON.stringify({
			url: config.embeddingUrl,
			model: config.embeddingModel,
			queryPrefix: config.queryPrefix,
			documentPrefix: config.documentPrefix
		}));
	}
	/**
	* Embed one bounded batch through the explicitly configured provider.
	* @param texts - query or passage strings.
	* @param query - select the model-specific query prefix.
	* @param signal - caller and service cancellation.
	* @returns finite, dimension-consistent vectors in input order.
	*/
	async embed(texts, query, signal) {
		try {
			return await this.request(texts, query, signal);
		} catch (error) {
			if (signal.aborted) throw error;
			if (error instanceof Error && [
				"embedding-not-configured",
				"embedding-credential-missing",
				"embedding-response-too-large"
			].includes(error.message)) throw error;
			throw new Error("embedding-provider-failed");
		}
	}
	async request(texts, query, signal) {
		if (this.profile === null || this.config.embeddingUrl === void 0 || this.config.embeddingModel === void 0) throw new Error("embedding-not-configured");
		const credential = this.config.embeddingKeyRef === void 0 ? void 0 : await this.ctx.credentials.resolve(credentialRef(this.config.embeddingKeyRef));
		if (this.config.embeddingKeyRef !== void 0 && credential === void 0) throw new Error("embedding-credential-missing");
		const response = await fetch(this.config.embeddingUrl, {
			method: "POST",
			signal: AbortSignal.any([signal, AbortSignal.timeout(this.config.embeddingTimeoutMs)]),
			headers: {
				"content-type": "application/json",
				...credential === void 0 ? {} : { authorization: `Bearer ${credential.value}` }
			},
			body: JSON.stringify({
				model: this.config.embeddingModel,
				input: texts.map((text) => `${query ? this.config.queryPrefix : this.config.documentPrefix}${text}`),
				encoding_format: "float"
			})
		});
		if (!response.ok || response.body === null) {
			await response.body?.cancel();
			throw new Error("embedding-provider-failed");
		}
		const reader = response.body.getReader();
		let bytes = 0;
		const chunks = [];
		try {
			for (;;) {
				const next = await reader.read();
				if (next.done) break;
				bytes += next.value.byteLength;
				if (bytes > this.config.maxEmbeddingResponseBytes) throw new Error("embedding-response-too-large");
				chunks.push(next.value);
			}
		} finally {
			await reader.cancel();
			reader.releaseLock();
		}
		const ordered = z.object({ data: z.array(z.object({
			index: z.number().int().min(0),
			embedding: z.array(z.number()).min(1).max(this.config.maxEmbeddingDimensions).refine((vector) => vector.some((value) => value !== 0))
		})).length(texts.length) }).parse(JSON.parse(Buffer.concat(chunks).toString("utf8"))).data.toSorted((a, b) => a.index - b.index);
		if (ordered.some((item, index) => item.index !== index || item.embedding.length !== ordered[0]?.embedding.length)) throw new Error("invalid-embedding-output");
		return ordered.map((item) => item.embedding);
	}
};
//#endregion
//#region lib/types/extract.js
/** Document extraction through an isolated PDF worker and the existing Office converter. @module */
/**
* Classify one supported operator-selected source; unsupported types are never executed.
* @param name - display filename, independent of its native path.
* @returns normalized file extension, or null when unsupported.
*/
function knowledgeExtension(name) {
	const extension = extname(name).slice(1).toLowerCase();
	return [
		"md",
		"mdx",
		"txt",
		"csv",
		"tsv",
		"json",
		"yaml",
		"yml",
		"pdf",
		"doc",
		"docx",
		"xls",
		"xlsx",
		"ppt",
		"pptx"
	].includes(extension) ? extension : null;
}
async function pdfPages(bytes, config, signal) {
	signal.throwIfAborted();
	const sourceMode = import.meta.url.endsWith(".ts");
	const worker = new Worker(new URL(sourceMode ? "./pdf-worker.ts" : "./pdf-worker.js", import.meta.url), {
		workerData: {
			bytes,
			maxPages: config.maxPages,
			maxTextBytes: config.maxTextBytes
		},
		execArgv: sourceMode ? ["--import", "tsx/esm"] : [],
		resourceLimits: { maxOldGenerationSizeMb: config.workerMemoryMb }
	});
	const lifetime = AbortSignal.any([signal, AbortSignal.timeout(config.parseTimeoutMs)]);
	let stop;
	try {
		return await new Promise((resolve, reject) => {
			stop = () => {
				reject(/* @__PURE__ */ new Error(signal.aborted ? "cancelled" : "parse-timeout"));
			};
			lifetime.addEventListener("abort", stop, { once: true });
			if (lifetime.aborted) {
				stop();
				return;
			}
			worker.once("error", () => {
				reject(/* @__PURE__ */ new Error("pdf-worker-failed"));
			});
			worker.once("exit", (code) => {
				if (code !== 0) reject(/* @__PURE__ */ new Error("pdf-worker-failed"));
			});
			worker.once("message", (message) => {
				const result = z.discriminatedUnion("ok", [z.object({
					ok: z.literal(true),
					pages: z.array(z.string()).max(config.maxPages)
				}), z.object({
					ok: z.literal(false),
					reason: z.string().max(100)
				})]).safeParse(message);
				if (!result.success) {
					reject(/* @__PURE__ */ new Error("invalid-pdf-worker-output"));
					return;
				}
				if (!result.data.ok) {
					reject(new Error(result.data.reason));
					return;
				}
				resolve(result.data.pages);
			});
		});
	} finally {
		if (stop !== void 0) lifetime.removeEventListener("abort", stop);
		await worker.terminate();
	}
}
/**
* Extract exact source text; scanned PDFs fail explicitly instead of indexing empty content.
* @param ctx - existing Host Office conversion capability.
* @param job - claimed immutable source version.
* @param config - parsing limits.
* @param signal - service/operation lifetime.
* @returns normalized Markdown and page/line coordinates.
*/
async function extractKnowledge(ctx, job, config, signal) {
	const extension = knowledgeExtension(job.name);
	if (extension === null) throw new Error("unsupported-format");
	let bytes;
	const read = async (readSignal, maxBytes) => {
		const value = await readKnowledgeFile(job.pending_path, Math.min(maxBytes, config.maxFileBytes), readSignal);
		if (knowledgeHash(value) !== job.pending_hash) throw new Error("knowledge-object-modified");
		return {
			bytes: value,
			version: job.pending_hash
		};
	};
	if ([
		"doc",
		"docx",
		"xls",
		"xlsx",
		"ppt",
		"pptx"
	].includes(extension)) {
		const converted = await ctx.officeKit.convert({
			extension,
			priority: "foreground",
			source: {
				key: brandString(`knowledge:${job.id}`),
				version: job.pending_hash,
				bytes: job.bytes,
				read
			}
		}, signal);
		if (converted.pdf.byteLength > config.maxFileBytes) throw new Error("file-too-large");
		bytes = converted.pdf;
	} else bytes = (await read(signal, config.maxFileBytes)).bytes;
	if (extension !== "pdf" && ![
		"doc",
		"docx",
		"xls",
		"xlsx",
		"ppt",
		"pptx"
	].includes(extension)) {
		const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes).replaceAll("\r\n", "\n").replaceAll("\r", "\n");
		if (text.includes("\0") || text.trim() === "") throw new Error("empty-or-binary-text");
		if (Buffer.byteLength(text) > config.maxTextBytes) throw new Error("text-too-large");
		return {
			markdown: text,
			pages: [{
				page: null,
				text,
				startLine: 1
			}]
		};
	}
	const pages = await pdfPages(bytes, config, signal);
	let markdown = "";
	let line = 1;
	const indexed = pages.map((text, index) => {
		markdown += `<!-- page:${index + 1} -->\n`;
		line++;
		const result = {
			page: index + 1,
			text,
			startLine: line
		};
		markdown += `${text}\n\n`;
		line += text.split("\n").length + 1;
		return result;
	});
	return {
		markdown,
		pages: indexed
	};
}
//#endregion
//#region lib/types/index.js
/** Desktop knowledge management, durable ingestion, retrieval and development-time evidence. @module */
var __runInitializers = function(thisArg, initializers, value) {
	var useValue = arguments.length > 2;
	for (var i = 0; i < initializers.length; i++) value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
	return useValue ? value : void 0;
};
var __esDecorate = function(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
	function accept(f) {
		if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
		return f;
	}
	var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
	var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
	var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
	var _, done = false;
	for (var i = decorators.length - 1; i >= 0; i--) {
		var context = {};
		for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
		for (var p in contextIn.access) context.access[p] = contextIn.access[p];
		context.addInitializer = function(f) {
			if (done) throw new TypeError("Cannot add initializers after decoration has completed");
			extraInitializers.push(accept(f || null));
		};
		var result = (0, decorators[i])(kind === "accessor" ? {
			get: descriptor.get,
			set: descriptor.set
		} : descriptor[key], context);
		if (kind === "accessor") {
			if (result === void 0) continue;
			if (result === null || typeof result !== "object") throw new TypeError("Object expected");
			if (_ = accept(result.get)) descriptor.get = _;
			if (_ = accept(result.set)) descriptor.set = _;
			if (_ = accept(result.init)) initializers.unshift(_);
		} else if (_ = accept(result)) if (kind === "field") initializers.unshift(_);
		else descriptor[key] = _;
	}
	if (target) Object.defineProperty(target, contextIn.name, descriptor);
	done = true;
};
function fail(reason) {
	return new RemoteError("knowledge/failed", "The knowledge operation could not be completed", { reason });
}
const ERROR_REASONS = new Set([
	"experience-base-unavailable",
	"experience-not-found",
	"experience-version-conflict",
	"experience-review-incomplete",
	"experience-replacement-invalid",
	"file-too-large",
	"source-changed",
	"unsupported-format",
	"text-too-large",
	"too-many-pages",
	"ocr-required",
	"empty-or-binary-text",
	"pdf-extraction-failed",
	"pdf-worker-failed",
	"parse-timeout",
	"too-many-chunks",
	"embedding-provider-failed",
	"embedding-credential-missing",
	"embedding-not-configured",
	"embedding-response-too-large",
	"embedding-dimensions-changed",
	"knowledge-object-modified",
	"knowledge-storage-full",
	"not-a-regular-file",
	"document-archived",
	"too-many-documents"
]);
function reasonOf(error) {
	return error instanceof Error && ERROR_REASONS.has(error.message) ? error.message : "processing-failed";
}
function fileVersion(value) {
	return `${value.dev}:${value.ino}:${value.size}:${value.mtimeMs}:${value.ctimeMs}`;
}
const globalExperienceId = brandString("8c6e4d00-5c74-482b-bbf0-0c93576e046e");
/** Source ingestion and retrieval share one durable installation-owned catalog. */
let KnowledgeService = (() => {
	let _classSuper = TypertRemoteService;
	let _instanceExtraInitializers = [];
	let _catalog_decorators;
	let _createTeam_decorators;
	let _createBase_decorators;
	let _updateBase_decorators;
	let _archiveBase_decorators;
	let _detail_decorators;
	let _upload_decorators;
	let _note_decorators;
	let _createNoteIfAbsent_decorators;
	let _importLocal_decorators;
	let _watchSource_decorators;
	let _syncSource_decorators;
	let _updateDocument_decorators;
	let _retryDocument_decorators;
	let _document_decorators;
	let _restoreRevision_decorators;
	let _original_decorators;
	let _search_decorators;
	let _experienceCapture_decorators;
	let _setExperienceCapture_decorators;
	let _listExperiences_decorators;
	let _experienceHistory_decorators;
	let _saveExperience_decorators;
	let _transitionExperience_decorators;
	let _deleteExperience_decorators;
	return class KnowledgeService extends _classSuper {
		static {
			const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
			_catalog_decorators = [Remote("catalog")];
			_createTeam_decorators = [Remote("createTeam")];
			_createBase_decorators = [Remote("createBase")];
			_updateBase_decorators = [Remote("updateBase")];
			_archiveBase_decorators = [Remote("archiveBase")];
			_detail_decorators = [Remote("detail")];
			_upload_decorators = [Remote("upload")];
			_note_decorators = [Remote("note")];
			_createNoteIfAbsent_decorators = [Remote("createNoteIfAbsent")];
			_importLocal_decorators = [Remote("importLocal")];
			_watchSource_decorators = [Remote("watchSource")];
			_syncSource_decorators = [Remote("syncSource")];
			_updateDocument_decorators = [Remote("updateDocument")];
			_retryDocument_decorators = [Remote("retryDocument")];
			_document_decorators = [Remote("document")];
			_restoreRevision_decorators = [Remote("restoreRevision")];
			_original_decorators = [Remote("original")];
			_search_decorators = [Remote("search")];
			_experienceCapture_decorators = [Remote("experienceCapture")];
			_setExperienceCapture_decorators = [Remote("setExperienceCapture")];
			_listExperiences_decorators = [Remote("listExperiences")];
			_experienceHistory_decorators = [Remote("experienceHistory")];
			_saveExperience_decorators = [Remote("saveExperience")];
			_transitionExperience_decorators = [Remote("transitionExperience")];
			_deleteExperience_decorators = [Remote("deleteExperience")];
			__esDecorate(this, null, _catalog_decorators, {
				kind: "method",
				name: "catalog",
				static: false,
				private: false,
				access: {
					has: (obj) => "catalog" in obj,
					get: (obj) => obj.catalog
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _createTeam_decorators, {
				kind: "method",
				name: "createTeam",
				static: false,
				private: false,
				access: {
					has: (obj) => "createTeam" in obj,
					get: (obj) => obj.createTeam
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _createBase_decorators, {
				kind: "method",
				name: "createBase",
				static: false,
				private: false,
				access: {
					has: (obj) => "createBase" in obj,
					get: (obj) => obj.createBase
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _updateBase_decorators, {
				kind: "method",
				name: "updateBase",
				static: false,
				private: false,
				access: {
					has: (obj) => "updateBase" in obj,
					get: (obj) => obj.updateBase
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _archiveBase_decorators, {
				kind: "method",
				name: "archiveBase",
				static: false,
				private: false,
				access: {
					has: (obj) => "archiveBase" in obj,
					get: (obj) => obj.archiveBase
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _detail_decorators, {
				kind: "method",
				name: "detail",
				static: false,
				private: false,
				access: {
					has: (obj) => "detail" in obj,
					get: (obj) => obj.detail
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _upload_decorators, {
				kind: "method",
				name: "upload",
				static: false,
				private: false,
				access: {
					has: (obj) => "upload" in obj,
					get: (obj) => obj.upload
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _note_decorators, {
				kind: "method",
				name: "note",
				static: false,
				private: false,
				access: {
					has: (obj) => "note" in obj,
					get: (obj) => obj.note
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _createNoteIfAbsent_decorators, {
				kind: "method",
				name: "createNoteIfAbsent",
				static: false,
				private: false,
				access: {
					has: (obj) => "createNoteIfAbsent" in obj,
					get: (obj) => obj.createNoteIfAbsent
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _importLocal_decorators, {
				kind: "method",
				name: "importLocal",
				static: false,
				private: false,
				access: {
					has: (obj) => "importLocal" in obj,
					get: (obj) => obj.importLocal
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _watchSource_decorators, {
				kind: "method",
				name: "watchSource",
				static: false,
				private: false,
				access: {
					has: (obj) => "watchSource" in obj,
					get: (obj) => obj.watchSource
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _syncSource_decorators, {
				kind: "method",
				name: "syncSource",
				static: false,
				private: false,
				access: {
					has: (obj) => "syncSource" in obj,
					get: (obj) => obj.syncSource
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _updateDocument_decorators, {
				kind: "method",
				name: "updateDocument",
				static: false,
				private: false,
				access: {
					has: (obj) => "updateDocument" in obj,
					get: (obj) => obj.updateDocument
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _retryDocument_decorators, {
				kind: "method",
				name: "retryDocument",
				static: false,
				private: false,
				access: {
					has: (obj) => "retryDocument" in obj,
					get: (obj) => obj.retryDocument
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _document_decorators, {
				kind: "method",
				name: "document",
				static: false,
				private: false,
				access: {
					has: (obj) => "document" in obj,
					get: (obj) => obj.document
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _restoreRevision_decorators, {
				kind: "method",
				name: "restoreRevision",
				static: false,
				private: false,
				access: {
					has: (obj) => "restoreRevision" in obj,
					get: (obj) => obj.restoreRevision
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _original_decorators, {
				kind: "method",
				name: "original",
				static: false,
				private: false,
				access: {
					has: (obj) => "original" in obj,
					get: (obj) => obj.original
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _search_decorators, {
				kind: "method",
				name: "search",
				static: false,
				private: false,
				access: {
					has: (obj) => "search" in obj,
					get: (obj) => obj.search
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _experienceCapture_decorators, {
				kind: "method",
				name: "experienceCapture",
				static: false,
				private: false,
				access: {
					has: (obj) => "experienceCapture" in obj,
					get: (obj) => obj.experienceCapture
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _setExperienceCapture_decorators, {
				kind: "method",
				name: "setExperienceCapture",
				static: false,
				private: false,
				access: {
					has: (obj) => "setExperienceCapture" in obj,
					get: (obj) => obj.setExperienceCapture
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _listExperiences_decorators, {
				kind: "method",
				name: "listExperiences",
				static: false,
				private: false,
				access: {
					has: (obj) => "listExperiences" in obj,
					get: (obj) => obj.listExperiences
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _experienceHistory_decorators, {
				kind: "method",
				name: "experienceHistory",
				static: false,
				private: false,
				access: {
					has: (obj) => "experienceHistory" in obj,
					get: (obj) => obj.experienceHistory
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _saveExperience_decorators, {
				kind: "method",
				name: "saveExperience",
				static: false,
				private: false,
				access: {
					has: (obj) => "saveExperience" in obj,
					get: (obj) => obj.saveExperience
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _transitionExperience_decorators, {
				kind: "method",
				name: "transitionExperience",
				static: false,
				private: false,
				access: {
					has: (obj) => "transitionExperience" in obj,
					get: (obj) => obj.transitionExperience
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			__esDecorate(this, null, _deleteExperience_decorators, {
				kind: "method",
				name: "deleteExperience",
				static: false,
				private: false,
				access: {
					has: (obj) => "deleteExperience" in obj,
					get: (obj) => obj.deleteExperience
				},
				metadata: _metadata
			}, null, _instanceExtraInitializers);
			if (_metadata) Object.defineProperty(this, Symbol.metadata, {
				enumerable: true,
				configurable: true,
				writable: true,
				value: _metadata
			});
		}
		static inject = [
			"typert",
			"workspaceRegistry",
			"officeKit",
			"credentials"
		];
		static Config = Config;
		/** Resolved resource bounds and embedding configuration. */
		config = __runInitializers(this, _instanceExtraInitializers);
		store;
		lifetime = new AbortController();
		operations = /* @__PURE__ */ new Set();
		jobControls = /* @__PURE__ */ new Map();
		jobs = /* @__PURE__ */ new Map();
		verifiedObjects = /* @__PURE__ */ new Map();
		sourceSweepRunning = false;
		syncing = /* @__PURE__ */ new Set();
		embeddings;
		/**
		* Own the queue, timer, provider requests and storage through this service's fiber.
		* @param ctx - Host conversion, workspace, credential and Remote capabilities.
		* @param config - validated resource and optional semantic retrieval settings.
		*/
		constructor(ctx, config) {
			super(ctx, "knowledge");
			this.config = Config(config);
			if (this.config.overlapChars >= this.config.childChars || this.config.childChars > this.config.parentChars) throw new Error("Knowledge passage sizes require overlap < child <= parent");
			this.embeddings = new KnowledgeEmbeddings(ctx, this.config);
			ctx.effect(() => {
				const timer = setInterval(() => {
					if (this.store === void 0 || this.lifetime.signal.aborted || !this.store.healthy || this.sourceSweepRunning) return;
					this.sourceSweepRunning = true;
					this.run(this.lifetime.signal, async (signal) => {
						for (const source of this.data.sources()) {
							if (this.base(source.baseId).archived || this.syncing.has(source.id)) continue;
							try {
								await this.synchronize(source, signal);
							} catch (error) {
								if (signal.aborted) throw error;
								ctx.logger.warn("A local knowledge source could not be synchronized.", error);
							}
						}
					}).catch((error) => {
						if (!this.lifetime.signal.aborted) ctx.logger.warn("Local knowledge synchronization failed.", error);
					}).finally(() => {
						this.sourceSweepRunning = false;
					});
				}, this.config.syncIntervalMs);
				return async () => {
					clearInterval(timer);
					this.lifetime.abort();
					await Promise.allSettled([...this.operations, ...this.jobs.values()]);
					this.store?.close();
				};
			}, "knowledge: queue, source supervision and storage");
		}
		async [Service.init]() {
			const store = await KnowledgeStore.open(join(resolveDshHome(this.config.dshHome), "knowledge", "v1"), this.config);
			if (this.lifetime.signal.aborted) {
				store.close();
				this.lifetime.signal.throwIfAborted();
			}
			this.store = store;
			this.pump();
		}
		get data() {
			if (this.store === void 0 || this.lifetime.signal.aborted || !this.store.healthy) throw fail("unavailable");
			return this.store;
		}
		async run(signal, action) {
			this.lifetime.signal.throwIfAborted();
			signal.throwIfAborted();
			const operation = action(AbortSignal.any([signal, this.lifetime.signal]));
			this.operations.add(operation);
			try {
				return await operation;
			} catch (error) {
				if (error instanceof Error && ERROR_REASONS.has(error.message)) throw fail(error.message);
				throw error;
			} finally {
				this.operations.delete(operation);
			}
		}
		base(id) {
			const base = this.data.bases().find((item) => item.id === id);
			if (base === void 0) throw fail("base-not-found");
			return base;
		}
		documentRow(id) {
			const row = this.data.job(id);
			if (row === void 0) throw fail("document-not-found");
			return row;
		}
		validateBase(input) {
			const value = baseInputSchema.parse(input);
			if (value.mode === "hybrid" && this.embeddings.profile === null) throw fail("embedding-not-configured");
			if (value.teamId !== null && !this.data.teams().some((team) => team.id === value.teamId)) throw fail("team-not-found");
			if (value.workspaceIds.some((id) => this.ctx.workspaceRegistry.get(id) === void 0)) throw fail("workspace-not-found");
			return value;
		}
		/**
		* Read local collection metadata.
		* @param signal - caller lifetime.
		* @returns local team groupings, collections and semantic provider readiness.
		*/
		catalog(signal) {
			signal.throwIfAborted();
			const bases = this.data.bases();
			const globalExperience = bases.find((base) => base.id === globalExperienceId);
			return {
				teams: this.data.teams(),
				bases: bases.filter((base) => base.id !== globalExperienceId),
				...globalExperience === void 0 ? {} : { globalExperience },
				embeddingsConfigured: this.embeddings.profile !== null,
				maxFileBytes: this.config.maxFileBytes,
				storedBytes: z.object({ bytes: z.number() }).parse(this.data.db.prepare("SELECT coalesce(sum(bytes),0) bytes FROM objects").get()).bytes,
				storedLimitBytes: this.config.maxStoredBytes
			};
		}
		/**
		* Provision the installation-wide development experience collection on HEY startup.
		* @param signal - Consumer lifetime.
		*/
		ensureGlobalExperience(signal) {
			signal.throwIfAborted();
			if (this.data.bases().some((base) => base.id === globalExperienceId)) return;
			const team = this.createTeam({ name: "HeyWork" }, signal);
			this.data.saveBase(globalExperienceId, {
				name: "Development experience",
				description: "",
				kind: "team",
				teamId: team.id,
				workspaceIds: [],
				mode: "fulltext",
				enabled: true
			});
		}
		/**
		* Save one deduplicated, redacted candidate for the local installation.
		* @param request - Durable evidence identity and sanitized reusable content.
		* @param signal - Consumer lifetime.
		* @returns Whether a new candidate was saved.
		*/
		captureGlobalExperience(request, signal) {
			signal.throwIfAborted();
			return captureExperience(this.data, globalExperienceId, request.sourceKey, request.content, { installationWide: true }) !== null;
		}
		/**
		* Create or reuse a local organizational group.
		* @param request - operator-chosen group name.
		* @param signal - caller lifetime.
		* @returns the durable group; this does not invite employees or publish data.
		*/
		createTeam(request, signal) {
			signal.throwIfAborted();
			const name = nameSchema.parse(request.name);
			const previous = this.data.teams().find((team) => team.name === name);
			if (previous !== void 0) return previous;
			if (this.data.teams().length >= this.config.maxTeams) throw fail("too-many-teams");
			const id = brandString(randomUUID());
			const now = (/* @__PURE__ */ new Date()).toISOString();
			this.data.db.prepare("INSERT INTO teams VALUES(?,?,?)").run(id, name, now);
			return {
				id,
				name,
				createdAt: now
			};
		}
		/**
		* Create a team or project knowledge collection and its explicit workspace bindings.
		* @param request - complete collection settings.
		* @param signal - caller lifetime.
		* @returns the durable collection, initially without documents.
		*/
		createBase(request, signal) {
			signal.throwIfAborted();
			if (this.data.bases().filter((base) => base.id !== globalExperienceId).length >= this.config.maxBases) throw fail("too-many-collections");
			return this.data.saveBase(brandString(randomUUID()), this.validateBase(request));
		}
		/**
		* Update retrieval scope; changes apply to the next development request.
		* @param request - existing collection id and complete new settings.
		* @param signal - caller lifetime.
		* @returns updated collection metadata.
		*/
		updateBase(request, signal) {
			signal.throwIfAborted();
			this.base(baseIdSchema.parse(request.id));
			if (request.id === globalExperienceId) throw fail("experience-base-unavailable");
			const previousMode = this.base(request.id).mode;
			const updated = this.data.saveBase(request.id, this.validateBase(request.input));
			if (previousMode !== updated.mode) this.cancelBaseJobs(request.id);
			this.pump();
			return updated;
		}
		/**
		* Archive or restore a collection without deleting its documents and historical citations.
		* @param request - collection and desired archive state.
		* @param signal - caller lifetime.
		* @returns whether the requested state is stored.
		*/
		archiveBase(request, signal) {
			signal.throwIfAborted();
			if (request.id === globalExperienceId) throw fail("experience-base-unavailable");
			const { documentCount: _documents, readyCount: _ready, ...record } = this.base(request.id);
			this.data.db.prepare("UPDATE bases SET record=? WHERE id=?").run(JSON.stringify({
				...record,
				archived: request.archived,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			}), request.id);
			if (request.archived) this.cancelBaseJobs(request.id);
			this.pump();
			return true;
		}
		/**
		* Read collection progress without loading source text.
		* @param request - existing collection; optional archived-document view.
		* @param signal - caller lifetime.
		* @returns metadata, document states and local synchronization sources.
		*/
		detail(request, signal) {
			signal.throwIfAborted();
			return {
				base: this.base(request.id),
				documents: this.data.documents(request.id, request.includeArchived ?? false),
				sources: this.data.sources(request.id)
			};
		}
		/**
		* Import selected bytes as a durable snapshot; a matching filename creates a new revision.
		* @param request - collection, display filename and complete original bytes.
		* @param signal - caller lifetime.
		* @returns an admission receipt; actual parsing continues in the durable queue.
		*/
		upload(request, signal) {
			return this.admitUpload(request, signal);
		}
		admitUpload(request, signal, ifAbsent = false) {
			return this.run(signal, async (owned) => {
				this.base(request.baseId);
				const name = documentNameSchema.parse(request.name);
				const extension = knowledgeExtension(name);
				if (extension === null) throw fail("unsupported-format");
				if (request.base64.length > Math.ceil(this.config.maxFileBytes / 3) * 4) throw fail("file-too-large");
				const bytes = Buffer.from(request.base64, "base64");
				if (bytes.toString("base64") !== request.base64) throw fail("invalid-file-encoding");
				if (bytes.byteLength > this.config.maxFileBytes) throw fail("file-too-large");
				const path = await this.data.object(bytes, extension);
				owned.throwIfAborted();
				const admitted = this.data.admit({
					baseId: request.baseId,
					name,
					hash: knowledgeHash(bytes),
					path,
					bytes: bytes.byteLength,
					sourcePath: null,
					sourceId: null,
					sourceVersion: null,
					ifAbsent
				});
				if (admitted.changed) this.jobControls.get(admitted.id)?.abort();
				this.pump();
				return {
					queued: Number(admitted.changed),
					unchanged: Number(!admitted.changed),
					skipped: 0
				};
			});
		}
		/**
		* Save operator-authored Markdown through the same revision/index pipeline.
		* @param request - title-like filename and complete Markdown text.
		* @param signal - caller lifetime.
		* @returns durable queue admission, without any model request.
		*/
		note(request, signal) {
			const name = documentNameSchema.parse(request.name);
			return this.upload({
				baseId: request.baseId,
				name: name.endsWith(".md") ? name : `${name}.md`,
				base64: Buffer.from(request.text, "utf8").toString("base64")
			}, signal);
		}
		/**
		* Import a version-named reference without replacing any existing user document.
		* The storage owner checks absence atomically; older Hosts lack this endpoint and cannot silently overwrite.
		* @param request - explicit target collection, stable filename and reference text.
		* @param signal - admission cancellation; already admitted jobs remain visible.
		* @returns queued for one new document, unchanged when any document already owns that name.
		*/
		createNoteIfAbsent(request, signal) {
			const name = documentNameSchema.parse(request.name);
			return this.admitUpload({
				baseId: request.baseId,
				name: name.endsWith(".md") ? name : `${name}.md`,
				base64: Buffer.from(request.text, "utf8").toString("base64")
			}, signal, true);
		}
		/**
		* Import a desktop-selected local file/folder, optionally following future changes.
		* @param request - absolute native source path and explicit synchronization choice.
		* @param signal - caller lifetime; cancellation stops scanning and preserves admitted jobs.
		* @returns queued, unchanged and unsupported/ignored file counts.
		*/
		importLocal(request, signal) {
			return this.run(signal, async (owned) => {
				this.base(request.baseId);
				if (!isAbsolute(request.path)) throw fail("absolute-source-required");
				const original = await lstat(request.path);
				const kind = original.isDirectory() ? "folder" : original.isFile() ? "file" : null;
				if (original.isSymbolicLink() || kind === null || request.kind !== "auto" && request.kind !== kind) throw fail("not-a-regular-source");
				if (kind === "file" && knowledgeExtension(basename(request.path)) === null) throw fail("unsupported-format");
				const path = await realpath(request.path);
				const previous = this.data.sources(request.baseId).find((source) => source.path === path);
				const id = previous?.id ?? brandString(randomUUID());
				this.data.db.prepare(`INSERT INTO sources(id,base_id,path,kind,watch) VALUES(?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET watch=excluded.watch,kind=excluded.kind`).run(id, request.baseId, path, kind, Number(request.watch));
				const source = {
					id,
					baseId: request.baseId,
					path,
					kind,
					watch: request.watch,
					lastScan: previous?.lastScan ?? null,
					error: previous?.error ?? null
				};
				return this.synchronize(source, owned);
			});
		}
		/**
		* Enable or stop local source supervision; existing indexed snapshots remain available.
		* @param request - source id and explicit watch choice.
		* @param signal - caller lifetime.
		* @returns whether the source was found and updated.
		*/
		watchSource(request, signal) {
			signal.throwIfAborted();
			if (this.data.db.prepare("UPDATE sources SET watch=? WHERE id=?").run(Number(request.watch), request.id).changes === 0) throw fail("source-not-found");
			return true;
		}
		/**
		* Explicitly refresh one imported source.
		* @param request - source identity.
		* @param signal - caller lifetime.
		* @returns the complete scan's admission counts.
		*/
		syncSource(request, signal) {
			return this.run(signal, async (owned) => {
				const source = this.data.bases().flatMap((base) => this.data.sources(base.id)).find((item) => item.id === request.id);
				if (source === void 0) throw fail("source-not-found");
				return this.synchronize(source, owned);
			});
		}
		/**
		* Change a document's participation and display title without deleting history.
		* @param request - exact document and complete operator-controlled flags/title.
		* @param signal - caller lifetime.
		* @returns the updated document metadata.
		*/
		updateDocument(request, signal) {
			signal.throwIfAborted();
			const current = this.documentRow(request.id);
			const title = documentNameSchema.parse(request.title);
			this.data.db.prepare(`UPDATE documents SET enabled=?,archived=?,title=?,updated_at=?,
      state=CASE WHEN title<>? OR (?=1 AND state='processing') THEN 'queued' ELSE state END,
      generation=generation+CASE WHEN title<>? THEN 1 ELSE 0 END WHERE id=?`).run(Number(request.enabled), Number(request.archived), title, (/* @__PURE__ */ new Date()).toISOString(), title, Number(request.archived), title, current.id);
			if (request.archived || title !== current.title) this.jobControls.get(request.id)?.abort();
			this.pump();
			return this.data.viewDocument(this.documentRow(request.id));
		}
		/**
		* Retry a failed/missing job explicitly; unchanged source errors are not retried on every timer tick.
		* @param request - existing document.
		* @param signal - caller lifetime.
		* @returns whether reprocessing was queued.
		*/
		retryDocument(request, signal) {
			signal.throwIfAborted();
			this.documentRow(request.id);
			this.data.db.prepare("UPDATE documents SET state='queued',error=NULL,generation=generation+1 WHERE id=?").run(request.id);
			this.jobControls.get(request.id)?.abort();
			this.pump();
			return true;
		}
		/**
		* Read a bounded page of parent passages plus the latest retained revisions.
		* @param request - document and zero-based passage offset.
		* @param signal - caller lifetime.
		* @returns source-backed preview and revision metadata.
		*/
		document(request, signal) {
			signal.throwIfAborted();
			const row = this.documentRow(request.id);
			const offset = z.number().int().min(0).parse(request.offset);
			const chunks = row.active_revision === null ? [] : this.data.chunks(this.data.db.prepare("SELECT * FROM chunks WHERE document_id=? AND revision=? GROUP BY parent_id ORDER BY start_line,id LIMIT ? OFFSET ?").all(row.id, row.active_revision, this.config.previewPassages + 1, offset));
			return {
				document: this.data.viewDocument(row),
				revisions: this.data.revisions(row.id),
				passages: chunks.slice(0, this.config.previewPassages).map((chunk) => this.passage(chunk, 0)),
				hasMore: chunks.length > this.config.previewPassages,
				nextOffset: offset + this.config.previewPassages
			};
		}
		/**
		* Restore an immutable revision after stopping synchronization of its original source.
		* @param request - document and one retained revision identity.
		* @param signal - caller lifetime.
		* @returns whether the selected snapshot became active.
		*/
		restoreRevision(request, signal) {
			signal.throwIfAborted();
			const document = this.documentRow(request.id);
			if (this.data.sources(document.base_id).find((item) => item.id === document.source_id)?.watch === true) throw fail("stop-source-watch-before-restore");
			const revision = this.data.revisions(document.id).find((item) => item.id === request.revision);
			if (revision === void 0) throw fail("revision-not-found");
			const chunks = this.data.chunks(this.data.db.prepare("SELECT * FROM chunks WHERE revision=?").all(revision.id));
			if (this.base(document.base_id).mode === "hybrid" && chunks.some((chunk) => chunk.profile !== this.embeddings.profile)) throw fail("embedding-reindex-required");
			this.data.transaction(() => {
				this.data.db.prepare("DELETE FROM knowledge_fts WHERE document_id=?").run(document.id);
				for (const chunk of chunks) this.data.db.prepare("INSERT INTO knowledge_fts VALUES(?,?,?)").run(chunk.id, document.id, knowledgeTerms(`${document.title}\n${chunk.heading}\n${chunk.text}`).join(" "));
				this.data.db.prepare(`UPDATE documents SET active_revision=?,pending_hash=?,pending_path=?,state='ready',error=NULL,
        chunk_count=?,updated_at=?,generation=generation+1 WHERE id=?`).run(revision.id, revision.sourceHash, revision.originalPath, revision.chunkCount, (/* @__PURE__ */ new Date()).toISOString(), document.id);
			});
			return true;
		}
		/**
		* Download a retained original after checking its owned path and source digest.
		* @param request - document and retained revision.
		* @param signal - caller lifetime.
		* @returns original filename and verified bytes.
		*/
		original(request, signal) {
			return this.run(signal, async (owned) => {
				const document = this.documentRow(request.id);
				const revision = this.data.revisions(request.id).find((item) => item.id === request.revision);
				if (revision === void 0 || dirname(revision.originalPath) !== join(this.data.root, "objects")) throw fail("revision-not-found");
				const bytes = await readKnowledgeFile(revision.originalPath, this.config.maxFileBytes, owned);
				if (knowledgeHash(bytes) !== revision.sourceHash) throw fail("knowledge-object-modified");
				return {
					name: basename(document.name),
					data: bytes
				};
			});
		}
		/**
		* Retrieve authorized collection passages before an answer is requested.
		* @param request - query and explicit management/Workspace scope.
		* @param signal - caller lifetime.
		* @returns fused, deduplicated evidence and stale-source diagnostics.
		*/
		search(request, signal) {
			return this.run(signal, (owned) => this.retrieve(request, owned));
		}
		/**
		* Read whether this collection explicitly accepts automatic project repair candidates.
		* @param request - existing collection.
		* @param signal - caller lifetime.
		* @returns opt-in state; absent configuration is disabled.
		*/
		experienceCapture(request, signal) {
			signal.throwIfAborted();
			this.base(request.baseId);
			return this.data.db.prepare("SELECT enabled FROM experience_capture_targets WHERE base_id=?").get(request.baseId)?.enabled === 1;
		}
		/**
		* Enable automatic capture only for one explicitly selected project collection.
		* @param request - collection and desired state; team-wide automatic sharing is rejected.
		* @param signal - caller lifetime.
		* @returns committed configuration.
		*/
		setExperienceCapture(request, signal) {
			return this.run(signal, async (owned) => {
				z.boolean().parse(request.enabled);
				const base = this.base(request.baseId);
				if (base.kind !== "project" || base.archived) throw fail("experience-base-unavailable");
				this.data.transaction(() => {
					this.data.db.prepare("INSERT INTO experience_capture_targets VALUES(?,?) ON CONFLICT(base_id) DO UPDATE SET enabled=excluded.enabled").run(base.id, Number(request.enabled));
				});
				if (request.enabled) for (const workspaceId of base.workspaceIds) {
					owned.throwIfAborted();
					await this.ctx.serial("knowledge/experience-capture-enabled", workspaceId);
				}
				return request.enabled;
			});
		}
		/**
		* Save historical repair candidates in opted-in collections for their actual workspace.
		* @param request - scoped evidence identity and redacted facts from the coding owner.
		* @param signal - consumer lifetime.
		* @returns number of newly recorded candidates; no model request or project file write occurs.
		*/
		captureExperience(request, signal) {
			signal.throwIfAborted();
			if (this.ctx.workspaceRegistry.get(request.workspaceId) === void 0) throw fail("workspace-not-found");
			let captured = 0;
			for (const base of this.data.bases()) {
				if (!base.workspaceIds.includes(request.workspaceId)) continue;
				if (captureExperience(this.data, base.id, request.sourceKey, request.content) !== null) captured++;
			}
			return captured;
		}
		/**
		* List development experience within an explicitly selected collection.
		* @param request - collection, text/state filters and page window.
		* @param signal - caller lifetime.
		* @returns current records and matching total, including non-retrievable states for management.
		*/
		listExperiences(request, signal) {
			signal.throwIfAborted();
			this.base(request.baseId);
			return listExperiences(this.data, request);
		}
		/**
		* Read immutable prior experience versions for comparison or explicit restoration as a new candidate.
		* @param request - selected experience and page window.
		* @param signal - caller lifetime.
		* @returns historical revisions; reading never changes the active record.
		*/
		experienceHistory(request, signal) {
			return this.run(signal, () => Promise.resolve(experienceHistory(this.data, request)));
		}
		/**
		* Save a candidate revision without inheriting an earlier review.
		* @param request - collection, expected revision and complete authored content.
		* @param signal - caller lifetime.
		* @returns committed content; a conflict leaves stored content unchanged.
		*/
		saveExperience(request, signal) {
			return this.run(signal, () => Promise.resolve(saveExperience(this.data, request)));
		}
		/**
		* Record operator review, withdrawal or replacement against an exact revision.
		* @param request - transition and its explanation; reviewed is not executable acceptance.
		* @param signal - caller lifetime.
		* @returns committed revision, preserving historical content.
		*/
		transitionExperience(request, signal) {
			return this.run(signal, () => Promise.resolve(transitionExperience(this.data, request)));
		}
		/**
		* Delete one exact experience revision and its retained content/index.
		* @param request - selected record and expected revision.
		* @param signal - caller lifetime.
		* @returns true after commit; existing Session citations are not rewritten.
		*/
		deleteExperience(request, signal) {
			return this.run(signal, () => {
				deleteExperience(this.data, request.id, request.expectedRevision);
				return Promise.resolve(true);
			});
		}
		/**
		* Retrieve reviewed experience from the local library and active workspace collections.
		* @param workspaceId - actual imported workspace identity, if any.
		* @param query - current task text.
		* @param signal - caller lifetime.
		* @returns historical references requiring current-source verification, never candidate or withdrawn records.
		*/
		experiencesForWorkspace(workspaceId, query, signal) {
			signal.throwIfAborted();
			if (workspaceId !== void 0 && this.ctx.workspaceRegistry.get(workspaceId) === void 0) throw fail("workspace-not-found");
			if (knowledgeFtsQuery(query) === null) return [];
			const selected = /^HEY_KNOWLEDGE_BASE:([^\r\n]*)$/mu.exec(query)?.[1];
			const selectedBase = selected === void 0 ? void 0 : baseIdSchema.parse(selected);
			const matches = [];
			const bases = this.data.bases();
			const global = bases.find((base) => base.id === globalExperienceId);
			for (const base of [...global === void 0 ? [] : [global], ...bases.filter((base) => base.id !== globalExperienceId)]) {
				if (!base.enabled || base.archived || base.id !== globalExperienceId && (workspaceId === void 0 || !base.workspaceIds.includes(workspaceId)) || selectedBase !== void 0 && base.id !== selectedBase) continue;
				matches.push(...listExperiences(this.data, {
					baseId: base.id,
					query,
					state: "reviewed",
					offset: 0,
					limit: this.config.searchLimit
				}).items);
				if (matches.length >= this.config.searchLimit) break;
			}
			return matches.slice(0, this.config.searchLimit);
		}
		/**
		* Retrieve only collections explicitly bound to the actual development Workspace.
		* @param workspaceId - registry identity derived by the Agent context contributor.
		* @param query - actual current user task.
		* @param signal - step lifetime.
		* @returns current project/team evidence, without unrelated Workspace knowledge.
		*/
		forWorkspace(workspaceId, query, signal) {
			const selected = /^HEY_KNOWLEDGE_BASE:([^\r\n]*)$/mu.exec(query)?.[1];
			return this.run(signal, (owned) => this.retrieve({
				workspaceId,
				query,
				baseIds: selected === void 0 ? [] : [baseIdSchema.parse(selected)]
			}, owned));
		}
		/**
		* Report whether current tasks have any explicitly associated active collection.
		* @param workspaceId - actual Session workspace identity.
		* @returns whether a retrieval miss should be reported as missing evidence.
		*/
		activeForWorkspace(workspaceId) {
			return this.data.bases().some((base) => !base.archived && base.enabled && base.workspaceIds.includes(workspaceId));
		}
		cancelBaseJobs(id) {
			for (const [documentId, controller] of this.jobControls) {
				if (this.data.job(documentId)?.base_id !== id) continue;
				this.data.db.prepare("UPDATE documents SET state='queued',generation=generation+1 WHERE id=? AND state='processing'").run(documentId);
				controller.abort();
			}
		}
		pump() {
			if (this.store === void 0 || this.lifetime.signal.aborted || !this.store.healthy) return;
			while (this.jobs.size < this.config.parsingConcurrency) {
				const job = this.data.nextJob([...this.jobs.keys()]);
				if (job === void 0) break;
				const controller = new AbortController();
				this.jobControls.set(job.id, controller);
				const operation = this.process(job, AbortSignal.any([this.lifetime.signal, controller.signal])).catch((error) => {
					if (!this.lifetime.signal.aborted) this.ctx.logger.warn("Knowledge parsing could not publish its result.", error);
				}).finally(() => {
					this.jobs.delete(job.id);
					this.jobControls.delete(job.id);
					this.pump();
				});
				this.jobs.set(job.id, operation);
			}
		}
		async process(job, signal) {
			try {
				const base = this.base(job.base_id);
				const parsed = await extractKnowledge(this.ctx, job, this.config, signal);
				const chunks = knowledgeChunks(parsed, this.config);
				if (chunks.length === 0) throw new Error("empty-or-binary-text");
				let vectors = null;
				if (base.mode === "hybrid") {
					vectors = [];
					for (let offset = 0; offset < chunks.length; offset += this.config.embeddingBatchSize) {
						vectors.push(...await this.embeddings.embed(chunks.slice(offset, offset + this.config.embeddingBatchSize).map((chunk) => `${job.title}\n${chunk.heading}\n${chunk.text}`), false, signal));
						if (vectors.some((vector) => vector.length !== vectors?.[0]?.length)) throw new Error("embedding-dimensions-changed");
					}
				}
				signal.throwIfAborted();
				const textPath = await this.data.citation(new TextEncoder().encode(parsed.markdown), job.name);
				signal.throwIfAborted();
				const profile = base.mode === "hybrid" ? this.embeddings.profile : null;
				const revision = {
					id: knowledgeHash(`parent-child-citations-v1/${job.id}/${job.pending_hash}/${knowledgeHash(parsed.markdown)}/${profile}/${this.config.parentChars}/${this.config.childChars}/${this.config.overlapChars}`),
					documentId: job.id,
					sourceHash: job.pending_hash,
					originalPath: job.pending_path,
					textPath,
					createdAt: (/* @__PURE__ */ new Date()).toISOString(),
					chunkCount: chunks.length
				};
				signal.throwIfAborted();
				this.data.publish(job, revision, chunks, vectors, profile);
			} catch (error) {
				if (signal.aborted) return;
				this.data.db.prepare("UPDATE documents SET state='error',error=?,updated_at=? WHERE id=? AND generation=? AND state='processing'").run(reasonOf(error), (/* @__PURE__ */ new Date()).toISOString(), job.id, job.generation);
			}
		}
		async discover(source, signal) {
			if (source.kind === "file") return {
				files: [source.path],
				skipped: 0
			};
			const files = [];
			let skipped = 0;
			let inspected = 0;
			const walk = async (path) => {
				signal.throwIfAborted();
				for (const entry of await readdir(path, { withFileTypes: true })) {
					if (++inspected > this.config.maxSourceFiles) throw fail("too-many-source-files");
					if (entry.isSymbolicLink() || entry.name.startsWith(".") || this.config.excludeDirectories.includes(entry.name)) {
						skipped++;
						continue;
					}
					const next = join(path, entry.name);
					if (entry.isDirectory()) await walk(next);
					else if (entry.isFile() && knowledgeExtension(entry.name) !== null) files.push(next);
					else skipped++;
				}
			};
			await walk(source.path);
			return {
				files: files.sort(),
				skipped
			};
		}
		async synchronize(source, signal) {
			if (this.syncing.has(source.id)) throw fail("source-sync-running");
			this.syncing.add(source.id);
			try {
				const found = await this.discover(source, signal);
				let queued = 0;
				let unchanged = 0;
				const seen = /* @__PURE__ */ new Set();
				const previousDocuments = new Map(this.data.sourceJobs(source.id).map((document) => [document.name, document]));
				for (const path of found.files) {
					signal.throwIfAborted();
					const name = documentNameSchema.parse(source.kind === "file" ? basename(path) : relative(source.path, path).split(sep).join("/"));
					seen.add(path);
					const version = fileVersion(await lstat(path));
					const previousRow = previousDocuments.get(name);
					if (previousRow?.archived === true) {
						unchanged++;
						continue;
					}
					if (previousRow !== void 0 && previousRow.source_version === version && previousRow.state !== "missing") {
						unchanged++;
						continue;
					}
					const bytes = await readKnowledgeFile(path, this.config.maxFileBytes, signal);
					const extension = knowledgeExtension(name);
					if (extension === null) {
						found.skipped++;
						continue;
					}
					const snapshot = await this.data.object(bytes, extension);
					signal.throwIfAborted();
					const admitted = this.data.admit({
						baseId: source.baseId,
						name,
						hash: knowledgeHash(bytes),
						path: snapshot,
						bytes: bytes.byteLength,
						sourcePath: path,
						sourceId: source.id,
						sourceVersion: version
					});
					if (admitted.changed) {
						this.jobControls.get(admitted.id)?.abort();
						queued++;
					} else unchanged++;
				}
				for (const document of this.data.documents(source.baseId)) if (document.sourceId === source.id && document.sourcePath !== null && !seen.has(document.sourcePath)) this.data.db.prepare("UPDATE documents SET state='missing',error='source-missing',generation=generation+1 WHERE id=?").run(document.id);
				this.data.db.prepare("UPDATE sources SET last_scan=?,error=NULL WHERE id=?").run((/* @__PURE__ */ new Date()).toISOString(), source.id);
				this.pump();
				return {
					queued,
					unchanged,
					skipped: found.skipped
				};
			} catch (error) {
				if (!this.lifetime.signal.aborted) {
					const missing = error instanceof Error && "code" in error && error.code === "ENOENT";
					this.data.db.prepare("UPDATE sources SET error=? WHERE id=?").run(missing ? "source-missing" : reasonOf(error), source.id);
					if (missing) this.data.db.prepare("UPDATE documents SET state='missing',error='source-missing',generation=generation+1 WHERE source_id=?").run(source.id);
				}
				throw error;
			} finally {
				this.syncing.delete(source.id);
				this.pump();
			}
		}
		async validObject(path, hash, maxBytes, signal) {
			const object = dirname(path) === join(this.data.root, "objects") && /^[a-f0-9]{64}\.[a-z0-9]{1,8}$/u.test(basename(path));
			const citation = dirname(dirname(path)) === join(this.data.root, "citations") && basename(dirname(path)) === hash && path.endsWith(".md");
			if (!/^[a-f0-9]{64}$/u.test(hash) || !object && !citation) return false;
			const meta = await lstat(path);
			if (!meta.isFile() || meta.isSymbolicLink() || meta.size > maxBytes) return false;
			const stamp = `${fileVersion(meta)}/${hash}`;
			if (this.verifiedObjects.get(path) === stamp) return true;
			if (knowledgeHash(await readKnowledgeFile(path, maxBytes, signal)) !== hash) return false;
			this.verifiedObjects.delete(path);
			this.verifiedObjects.set(path, stamp);
			for (const oldest of this.verifiedObjects.keys()) {
				if (this.verifiedObjects.size <= this.config.integrityCacheEntries) break;
				this.verifiedObjects.delete(oldest);
			}
			return true;
		}
		async fresh(document, signal) {
			try {
				const revision = this.data.revisions(document.id).find((item) => item.id === document.active_revision);
				if (revision === void 0 || !await this.validObject(revision.originalPath, revision.sourceHash, this.config.maxFileBytes, signal) || !await this.validObject(revision.textPath, dirname(revision.textPath) === join(this.data.root, "objects") ? basename(revision.textPath).slice(0, 64) : basename(dirname(revision.textPath)), this.config.maxTextBytes, signal)) return false;
				if (document.source_id === null || document.source_path === null) return true;
				if (this.data.sources(document.base_id).find((item) => item.id === document.source_id)?.watch !== true) return true;
				const meta = await lstat(document.source_path);
				if (!meta.isFile() || meta.isSymbolicLink()) return false;
				if (fileVersion(meta) === document.source_version) return true;
				return knowledgeHash(await readKnowledgeFile(document.source_path, this.config.maxFileBytes, signal)) === document.pending_hash;
			} catch (error) {
				if (signal.aborted) throw error;
				return false;
			}
		}
		passage(chunk, score) {
			const document = this.documentRow(chunk.documentId);
			const revision = this.data.revisions(chunk.documentId).find((item) => item.id === chunk.revision);
			if (revision === void 0) throw fail("revision-not-found");
			return {
				id: chunk.id,
				baseId: chunk.baseId,
				documentId: chunk.documentId,
				revision: chunk.revision,
				baseName: this.base(chunk.baseId).name,
				title: document.title,
				heading: chunk.heading,
				text: chunk.parentText,
				page: chunk.page,
				startLine: chunk.startLine,
				endLine: chunk.endLine,
				textPath: revision.textPath,
				score
			};
		}
		async retrieve(request, signal) {
			const query = z.string().trim().min(1).max(4e3).parse(request.query);
			const explicit = request.baseIds.map((id) => baseIdSchema.parse(id));
			const eligible = () => this.data.bases().filter((base) => !base.archived && base.enabled && base.id !== globalExperienceId && (explicit.length === 0 || explicit.includes(base.id)) && (request.workspaceId === void 0 || base.workspaceIds.includes(request.workspaceId)));
			const bases = eligible();
			if (bases.length === 0) return {
				mode: "fulltext",
				hits: [],
				staleDocuments: 0
			};
			const allowed = bases.map((base) => base.id);
			const where = `d.state='ready' AND d.enabled=1 AND d.archived=0 AND c.revision=d.active_revision AND c.base_id IN (${allowed.map(() => "?").join(",")})`;
			const fts = knowledgeFtsQuery(query);
			const lexical = fts === null ? [] : this.data.db.prepare(`SELECT c.id FROM knowledge_fts f JOIN chunks c ON c.id=f.chunk_id
      JOIN documents d ON d.id=c.document_id WHERE knowledge_fts MATCH ? AND ${where}
      ORDER BY bm25(knowledge_fts),c.id LIMIT ?`).all(fts, ...allowed, this.config.candidateLimit).map((value) => z.object({ id: z.string() }).parse(value).id);
			const vectorBases = bases.filter((base) => base.mode === "hybrid").map((base) => base.id);
			const hybrid = vectorBases.length > 0;
			let dense = [];
			if (hybrid) {
				const [queryVector] = await this.embeddings.embed([query], true, signal);
				if (queryVector === void 0) throw fail("invalid-embedding-output");
				const scores = [];
				for (const raw of this.data.db.prepare(`SELECT c.id,c.vector,c.profile FROM chunks c JOIN documents d ON d.id=c.document_id
        WHERE ${where} AND c.base_id IN (${vectorBases.map(() => "?").join(",")}) AND c.vector IS NOT NULL`).iterate(...allowed, ...vectorBases)) {
					if (scores.length >= this.config.maxVectorCandidates) throw fail("dense-index-too-large");
					const row = z.object({
						id: z.string(),
						vector: z.string(),
						profile: z.string().nullable()
					}).parse(raw);
					if (row.profile !== this.embeddings.profile) throw fail("embedding-reindex-required");
					scores.push({
						id: row.id,
						score: knowledgeCosine(queryVector, z.array(z.number()).parse(JSON.parse(row.vector)))
					});
				}
				dense = scores.filter((item) => item.score >= this.config.minVectorSimilarity).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id)).slice(0, this.config.candidateLimit).map((item) => item.id);
			}
			signal.throwIfAborted();
			const currentBases = new Map(eligible().map((base) => [base.id, base.mode]));
			const lexicalMatches = new Set(lexical);
			const seen = /* @__PURE__ */ new Set();
			const hits = [];
			let staleDocuments = 0;
			const checked = /* @__PURE__ */ new Map();
			for (const item of knowledgeFusion(hybrid ? [lexical, dense] : [lexical])) {
				const chunk = this.data.chunks(this.data.db.prepare("SELECT * FROM chunks WHERE id=?").all(item.id))[0];
				if (chunk === void 0 || !currentBases.has(chunk.baseId) || currentBases.get(chunk.baseId) !== "hybrid" && !lexicalMatches.has(item.id)) continue;
				const document = this.documentRow(chunk.documentId);
				if (document.active_revision !== chunk.revision || document.state !== "ready" || !document.enabled || document.archived) continue;
				let isFresh = checked.get(document.id);
				if (isFresh === void 0) {
					isFresh = await this.fresh(document, signal);
					checked.set(document.id, isFresh);
					if (!isFresh) staleDocuments++;
				}
				if (!isFresh) continue;
				const latest = this.documentRow(document.id);
				const currentBase = eligible().find((base) => base.id === chunk.baseId);
				if (currentBase === void 0 || currentBase.mode !== "hybrid" && !lexicalMatches.has(item.id) || !latest.enabled || latest.archived || latest.state !== "ready" || latest.active_revision !== chunk.revision) continue;
				const parent = `${chunk.revision}/${chunk.parentId}`;
				if (seen.has(parent)) continue;
				seen.add(parent);
				hits.push(this.passage(chunk, item.score));
				if (hits.length >= this.config.searchLimit) break;
			}
			return {
				mode: hybrid ? "hybrid" : "fulltext",
				hits,
				staleDocuments
			};
		}
	};
})();
//#endregion
export { KnowledgeService, KnowledgeService as default };
