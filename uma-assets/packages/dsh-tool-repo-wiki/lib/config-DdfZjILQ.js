import { MAX_WIKI_PAGES, WIKI_ROOT, isWikiSecret, sourcePathSchema } from "@deepseek-ai/dsh-util-repo-wiki";
import { FsError } from "@deepseek-ai/dsh-fs";
import { createHash } from "node:crypto";
import { posix } from "node:path";
import z from "@deepseek-ai/schemastery";
//#region lib/types/errors.js
/** A failed operation preserves the last committed Wiki checkpoint. */
var WikiError = class extends Error {
	code;
	constructor(code, message, options) {
		super(`${code}: ${message}`, options);
		this.code = code;
		this.name = "WikiError";
	}
};
//#endregion
//#region lib/types/git.js
/**
* Run a fixed argument vector without a shell and await subprocess shutdown.
* @param ctx - composed execution-world subprocess capability.
* @param config - executable and resource limits.
* @param cwd - canonical execution-world workspace path.
* @param args - read-only Git arguments.
* @param signal - operation cancellation.
* @returns complete stdout and exit facts; truncation and timeout fail.
*/
async function wikiGit(ctx, config, cwd, args, signal) {
	const deadline = AbortSignal.timeout(config.gitTimeoutMs);
	const combined = AbortSignal.any([signal, deadline]);
	const handle = ctx.subprocess.spawn({
		argv: [
			config.gitExecutable,
			"-c",
			"core.fsmonitor=false",
			"--no-pager",
			...args
		],
		cwd,
		signal: combined,
		graceMs: 2e3,
		env: {
			GIT_CONFIG_COUNT: "0",
			GIT_TERMINAL_PROMPT: "0",
			GIT_OPTIONAL_LOCKS: "0",
			LC_ALL: "C"
		},
		stdio: {
			stdin: "ignore",
			stdout: { maxBytes: config.gitOutputMaxBytes },
			stderr: { maxBytes: 16384 }
		}
	});
	const outcome = await handle.done;
	combined.throwIfAborted();
	const output = handle.collected.stdout?.readFrom(0);
	if (output === void 0 || output.lossy) throw new WikiError("wiki/limit", "Git file listing exceeded the configured output limit");
	return {
		exitCode: outcome.exitCode,
		text: output.text,
		stderr: handle.collected.stderr?.readFrom(0).text ?? ""
	};
}
/**
* Determine whether Git supplies the workspace's source list.
* @param ctx - composed execution-world subprocess capability.
* @param config - executable and resource limits.
* @param cwd - canonical execution-world workspace path.
* @param signal - operation cancellation.
* @returns whether Git reports a working tree.
*/
async function wikiGitWorkTree(ctx, config, cwd, signal) {
	const head = await wikiGit(ctx, config, cwd, ["rev-parse", "--is-inside-work-tree"], signal);
	if (head.exitCode === 0 && head.text.trim() === "true") return true;
	if (head.exitCode === 128) return false;
	throw new WikiError("wiki/git-failed", "Unable to inspect the repository; check the configured Git executable");
}
//#endregion
//#region lib/types/indexer.js
/** Bounded local source indexing and dependency extraction. @module */
const SOURCE_EXTENSION = /* @__PURE__ */ new RegExp("\\.(?:[cm]?[jt]sx?|py|rs|go|java|kt|kts|dart|scala|swift|c|cpp|cc|h|hpp|cs|rb|php|vue|svelte|html|css|scss|json|ya?ml|toml|md|mdx|sql|sh|ps1|txt|ini|cfg|lua|r|jl|clj|proto|graphql|xml|gradle|ex)$", "iu");
/**
* Compute a deterministic content identity without timestamps or filesystem paths.
* @param text - complete UTF-8 text.
* @returns lowercase SHA-256 digest.
*/
function wikiHash(text) {
	return createHash("sha256").update(text).digest("hex");
}
/**
* Decide whether one relative path is eligible for source indexing.
* @param path - repository-relative path.
* @param config - configured directory exclusions.
* @returns eligibility before any contents are read.
*/
function isWikiCandidate(path, config) {
	if (isWikiSecret(path) || path.split("/").some((segment) => config.excludeDirectories.includes(segment))) return false;
	return SOURCE_EXTENSION.test(path) || /(?:^|\/)(?:Dockerfile|Makefile|CMakeLists.txt|Gemfile|go.mod|go.sum)$/u.test(path);
}
function importSpecifiers(text) {
	const found = /* @__PURE__ */ new Set();
	for (const pattern of [/(?:from\s*|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/gu, /import\s*['"]([^'"]+)['"]/gu]) for (const match of text.matchAll(pattern)) if (match[1] !== void 0) found.add(match[1]);
	return [...found];
}
function packageName(text) {
	let value;
	try {
		value = JSON.parse(text);
	} catch (error) {
		if (error instanceof SyntaxError) return null;
		throw error;
	}
	return typeof value === "object" && value !== null && "name" in value && typeof value.name === "string" ? value.name : null;
}
function resolveImports(path, specifiers, known, packages) {
	const found = /* @__PURE__ */ new Set();
	for (const specifier of specifiers) {
		const name = specifier.startsWith("@") ? specifier.split("/").slice(0, 2).join("/") : specifier.split("/")[0];
		const root = name === void 0 ? void 0 : packages.get(name);
		const subpath = name === void 0 ? "" : specifier.slice(name.length).replace(/^\//u, "");
		const bases = specifier.startsWith(".") ? [posix.normalize(posix.join(posix.dirname(path), specifier))] : root === void 0 ? [] : [posix.join(root, "src", subpath || "index"), posix.join(root, subpath || "index")];
		let target;
		for (const base of bases) {
			target = [
				base,
				base.replace(/\.js$/u, ".ts"),
				`${base}.ts`,
				`${base}.tsx`,
				`${base}.js`,
				`${base}.py`,
				`${base}/index.ts`,
				`${base}/index.js`
			].find((candidate) => known.has(candidate));
			if (target !== void 0) break;
		}
		const fallback = root === void 0 ? void 0 : posix.join(root, "src/index.ts");
		if (target !== void 0) found.add(target);
		else if (fallback !== void 0 && known.has(fallback)) found.add(fallback);
	}
	return [...found].sort();
}
async function walk(files, config) {
	const paths = [];
	const pending = [""];
	let visited = 0;
	for (const path of pending) {
		files.exec.signal.throwIfAborted();
		const target = path === "" ? files.root : await files.target(path);
		const entries = await files.ctx.fs.listDir(target, files.exec.signal);
		for (const entry of entries) {
			if (++visited > config.maxFiles * 4) throw new WikiError("wiki/limit", "Directory scan exceeded its entry limit; narrow the workspace");
			if (entry.name.startsWith(".") && entry.type === "directory") continue;
			if (config.excludeDirectories.includes(entry.name)) continue;
			const relative = path === "" ? entry.name : `${path}/${entry.name}`;
			const info = await files.ctx.fs.lstat(relative, { cwd: files.cwd }, files.exec.signal);
			if (info?.type === "directory") pending.push(relative);
			else if (info?.type === "file" && isWikiCandidate(relative, config)) paths.push(relative);
			if (paths.length > config.maxFiles) throw new WikiError("wiki/limit", "Source count exceeds maxFiles; increase the limit or narrow the workspace");
		}
	}
	return paths;
}
/**
* Index current source text, Git identity, and direct relative imports.
* @param ctx - composed capabilities.
* @param files - confined access and caller cancellation.
* @param config - deployment resource limits.
* @returns a complete snapshot of eligible files; skipped oversized/binary files are explicit.
*/
async function indexWiki(ctx, files, config) {
	const cwd = ctx.fs.processPath(files.root);
	const git = await wikiGitWorkTree(ctx, config, cwd, files.exec.signal);
	let branch = "workspace";
	let commit = null;
	let dirty = false;
	let dirtyPaths = [];
	let paths;
	if (git) {
		const listed = await wikiGit(ctx, config, cwd, [
			"ls-files",
			"--cached",
			"--others",
			"--exclude-standard",
			"-z",
			"--",
			"."
		], files.exec.signal);
		if (listed.exitCode !== 0) throw new WikiError("wiki/git-failed", "Git source enumeration failed");
		paths = [...new Set(listed.text.split("\0").filter((path) => path !== "" && sourcePathSchema.safeParse(path).success && isWikiCandidate(path, config)))].sort();
		const revision = await wikiGit(ctx, config, cwd, [
			"rev-parse",
			"--verify",
			"HEAD"
		], files.exec.signal);
		if (revision.exitCode === 0) commit = revision.text.trim();
		const named = await wikiGit(ctx, config, cwd, [
			"symbolic-ref",
			"--quiet",
			"--short",
			"HEAD"
		], files.exec.signal);
		branch = named.exitCode === 0 ? named.text.trim() : `detached-${commit?.slice(0, 12) ?? "unborn"}`;
		const status = await wikiGit(ctx, config, cwd, [
			"status",
			"--porcelain",
			"-z",
			"--untracked-files=all",
			"--",
			"."
		], files.exec.signal);
		if (status.exitCode !== 0) throw new WikiError("wiki/git-failed", "Git working-tree inspection failed");
		dirtyPaths = status.text.split("\0").filter((entry) => entry.length > 3).map((entry) => entry.slice(3)).filter((path) => sourcePathSchema.safeParse(path).success && isWikiCandidate(path, config));
		dirty = dirtyPaths.length > 0;
	} else paths = (await walk(files, config)).sort();
	if (paths.length > config.maxFiles) throw new WikiError("wiki/limit", `Source count exceeds maxFiles (${config.maxFiles})`);
	const specifiers = /* @__PURE__ */ new Map();
	const packages = /* @__PURE__ */ new Map();
	const indexed = [];
	const skipped = [];
	let bytes = 0;
	for (const path of paths) {
		files.exec.signal.throwIfAborted();
		const info = await ctx.fs.lstat(path, { cwd: files.cwd }, files.exec.signal);
		if (info === void 0) continue;
		if (info.type !== "file") {
			skipped.push({
				path,
				reason: "symlink"
			});
			continue;
		}
		if ((info.size ?? 0) > config.maxFileBytes) {
			skipped.push({
				path,
				reason: "too-large"
			});
			continue;
		}
		let source;
		try {
			source = await files.read(path, config.maxFileBytes);
		} catch (error) {
			if (error instanceof WikiError && error.code === "wiki/invalid-data") {
				skipped.push({
					path,
					reason: "not-text"
				});
				continue;
			}
			if (error instanceof FsError && error.code === "FS_TOO_LARGE") {
				skipped.push({
					path,
					reason: "too-large"
				});
				continue;
			}
			throw error;
		}
		if (source === null) continue;
		const size = Buffer.byteLength(source.text);
		bytes += size;
		if (bytes > config.maxScanBytes) throw new WikiError("wiki/limit", `Source bytes exceed maxScanBytes (${config.maxScanBytes}); scan was not published`);
		specifiers.set(path, importSpecifiers(source.text));
		if (posix.basename(path) === "package.json") {
			const name = packageName(source.text);
			if (name !== null) packages.set(name, posix.dirname(path));
		}
		indexed.push({
			path,
			hash: wikiHash(source.text),
			bytes: size,
			lines: source.text.split("\n").length,
			imports: []
		});
	}
	const known = new Set(indexed.map((file) => file.path));
	for (const file of indexed) file.imports = resolveImports(file.path, specifiers.get(file.path) ?? [], known, packages);
	const fingerprint = wikiHash(JSON.stringify(indexed.map((file) => [file.path, file.hash])));
	return {
		version: 1,
		revision: {
			branch,
			commit,
			fingerprint,
			scannedAt: (/* @__PURE__ */ new Date()).toISOString(),
			fileCount: indexed.length,
			dirty,
			git
		},
		files: indexed,
		dirtyPaths,
		skipped
	};
}
//#endregion
//#region lib/types/freshness.js
/**
* Compare current potentially changed source files with an indexed working tree.
* @param ctx - execution-world subprocess capability.
* @param cwd - canonical subprocess workspace path.
* @param index - previous complete source snapshot, including pre-existing uncommitted paths.
* @param config - Git and per-lookup resource bounds.
* @param read - confined UTF-8 reader; null means absent.
* @param signal - lookup cancellation.
* @returns updated source fingerprints suitable for dependency-impact analysis.
* @throws when Git inspection fails or the verification budget cannot establish freshness.
*/
async function wikiFreshIndex(ctx, cwd, index, config, read, signal) {
	if ([...index.files.map((file) => file.path), ...index.dirtyPaths].some((path) => isWikiSecret(path) || path.startsWith(`${WIKI_ROOT}/`))) throw new WikiError("wiki/invalid-data", "Source freshness metadata contains prohibited paths");
	const paths = new Set(index.revision.git ? index.dirtyPaths : index.files.map((file) => file.path));
	if (index.revision.git) {
		const requests = [
			index.revision.commit === null ? [
				"diff",
				"--name-only",
				"--no-ext-diff",
				"--no-textconv",
				"--relative",
				"-z",
				"--",
				"."
			] : [
				"diff",
				"--name-only",
				"--no-ext-diff",
				"--no-textconv",
				"--relative",
				"-z",
				index.revision.commit,
				"--",
				"."
			],
			[
				"ls-files",
				"--others",
				"--exclude-standard",
				"-z",
				"--",
				"."
			],
			...index.revision.commit === null ? [[
				"diff",
				"--cached",
				"--name-only",
				"--no-ext-diff",
				"--no-textconv",
				"--relative",
				"-z",
				"--",
				"."
			]] : []
		];
		for (const args of requests) {
			const result = await wikiGit(ctx, config, cwd, args, signal);
			if (result.exitCode !== 0) throw new WikiError("wiki/git-failed", "Cannot verify Wiki source freshness; inspect current source instead");
			for (const path of result.text.split("\0")) if (sourcePathSchema.safeParse(path).success && isWikiCandidate(path, config)) paths.add(path);
		}
	}
	if (paths.size > config.maxFreshnessFiles) throw new WikiError("wiki/limit", "Changed source count exceeds the Wiki freshness budget; update the edition or inspect current code");
	const files = new Map(index.files.map((file) => [file.path, file]));
	for (const path of paths) {
		signal.throwIfAborted();
		const text = await read(path);
		if (text === null) {
			files.delete(path);
			continue;
		}
		const previous = files.get(path);
		const current = {
			path,
			hash: wikiHash(text),
			bytes: Buffer.byteLength(text),
			lines: text.split("\n").length,
			imports: previous?.imports ?? []
		};
		files.set(path, current);
	}
	return {
		...index,
		files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path))
	};
}
//#endregion
//#region lib/types/config.js
/** Deployment bounds for repository Wiki indexing and generation. @module */
/** Parse all deployment-varying scanner and publication limits. */
const Config = z.object({
	automaticContext: z.boolean().default(true),
	maxFiles: z.number().step(1).min(1).default(5e4),
	maxFileBytes: z.number().step(1).min(1024).default(524288),
	maxScanBytes: z.number().step(1).min(1024).default(134217728),
	maxPageBytes: z.number().step(1).min(1024).default(131072),
	maxRecordBytes: z.number().step(1).min(1024).default(33554432),
	maxPages: z.number().step(1).min(1).max(MAX_WIKI_PAGES).default(200),
	gitTimeoutMs: z.number().step(1).min(1e3).default(3e4),
	gitOutputMaxBytes: z.number().step(1).min(1024).default(8388608),
	allowUncitedPageReads: z.boolean().default(false),
	contextMaxBytes: z.number().step(1).min(1024).default(16384),
	maxFreshnessFiles: z.number().step(1).min(1).default(256),
	searchLimit: z.number().step(1).min(1).max(50).default(8),
	maxSnippetChars: z.number().step(1).min(100).default(2e3),
	maxPlanBytes: z.number().step(1).min(1024).default(32768),
	sourceWindowMaxBytes: z.number().step(1).min(1024).default(32768),
	catalogRetries: z.number().step(1).min(1).max(20).default(5),
	gitExecutable: z.string().default("git"),
	excludeDirectories: z.array(z.string()).default([
		"node_modules",
		"vendor",
		"dist",
		"lib",
		"build",
		"coverage",
		".git",
		".uma",
		".next",
		".cache",
		".playwright-mcp"
	])
});
//#endregion
export { wikiHash as a, WikiError as c, isWikiCandidate as i, wikiFreshIndex as n, wikiGit as o, indexWiki as r, wikiGitWorkTree as s, Config as t };
