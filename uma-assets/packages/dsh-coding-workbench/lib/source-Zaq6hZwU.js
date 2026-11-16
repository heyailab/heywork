import { i as manifestSchema } from "./schema-CYOnGiGF.js";
import { i as runCommand } from "./process-UWH2go78.js";
import { createHash } from "node:crypto";
import picomatch from "picomatch";
import { z } from "zod";
//#region lib/types/source.js
/** Bounded same-world source observations, manifest discovery and compiler output parsing. */
const CHECK_MANIFESTS = [
	".uma/coding.json",
	"package.json",
	"pyproject.toml",
	"pom.xml"
];
/**
* Reject traversal and references outside a registered workspace, including symbolic links.
* @param ctx - filesystem provider.
* @param cwd - registered canonical root.
* @param path - workspace-relative source path.
* @param signal - cancellation.
* @returns the contained regular-file target, or undefined when absent.
*/
async function sourceTarget(ctx, cwd, path, signal) {
	const normalized = path.replaceAll("\\", "/");
	if (normalized.startsWith("/") || /^[A-Za-z]:/u.test(normalized) || normalized.split("/").some((part) => part === ".." || part === ".git" || /^\.env(?:\.|$)/u.test(part))) throw new Error("path-outside-source-scope");
	const info = await ctx.fs.lstat(normalized, { cwd }, signal);
	if (info === void 0) return void 0;
	if (info.type !== "file") throw new Error("source-not-a-regular-file");
	const [root, target] = await Promise.all([ctx.fs.resolve(cwd, { signal }), ctx.fs.resolve(normalized, {
		cwd,
		signal
	})]);
	if (!ctx.fs.contains(root, target)) throw new Error("path-outside-source-scope");
	return target;
}
/**
* Read a file without accepting a version that changed during the read.
* @param ctx - filesystem provider.
* @param cwd - canonical workspace root.
* @param path - relative file path.
* @param maxBytes - complete byte cap.
* @param signal - cancellation.
* @returns immutable observed bytes and their hash, or undefined for absence.
*/
async function readSource(ctx, cwd, path, maxBytes, signal) {
	const target = await sourceTarget(ctx, cwd, path, signal);
	if (target === void 0) return void 0;
	const before = await ctx.fs.stat(target, signal);
	if (before === void 0 || before.size !== void 0 && before.size > maxBytes) throw new Error("source-file-too-large");
	const bytes = await ctx.fs.readBytes(target, signal, maxBytes);
	if ((await ctx.fs.stat(target, signal))?.version !== before.version) throw new Error("source-changed-during-read");
	return {
		path,
		target,
		bytes,
		hash: createHash("sha256").update(bytes).digest("hex")
	};
}
/**
* Fingerprint tracked and untracked inputs, falling back to a bounded non-Git folder traversal.
* @param ctx - same-world providers.
* @param config - source inspection bounds.
* @param cwd - registered root or task checkout.
* @param signal - cancellation.
* @returns files and a completeness-aware fingerprint.
*/
async function scanSources(ctx, config, cwd, signal) {
	const paths = [];
	let complete = true;
	let reason = null;
	const excluded = new Set(config.excludedDirectories);
	const secrets = new Set([
		".ssh",
		".aws",
		".azure",
		".dsh-home",
		".dsh-storages",
		".credentials.yaml",
		".npmrc",
		".pypirc",
		".netrc",
		".git-credentials"
	]);
	const allowed = (path) => !path.replaceAll("\\", "/").split("/").some((part) => part === ".git" || part === ".uma" || secrets.has(part) || excluded.has(part) || /^\.env(?:\.|$)/u.test(part));
	let git = false;
	try {
		const result = await runCommand(ctx, config, {
			...ctx.sandboxPolicy.resolve(),
			workspaceRoot: cwd,
			mode: "read-only"
		}, cwd, [
			"git",
			"ls-files",
			"-z",
			"--cached",
			"--others",
			"--exclude-standard",
			"--",
			"."
		], signal);
		if (result.exitCode === 0 && !result.truncated && !result.cancelled && !result.timedOut) {
			paths.push(...new Set(result.stdout.split("\0").filter((path) => path !== "" && allowed(path))));
			git = true;
		} else if (result.truncated) {
			complete = false;
			reason = "source-list-truncated";
		}
	} catch (error) {
		signal.throwIfAborted();
		ctx.logger.debug("Coding source inspection uses filesystem traversal.", error);
	}
	if (!git && complete) {
		const walk = async (path) => {
			if (!complete) return;
			const target = await ctx.fs.resolve(path || ".", {
				cwd,
				signal
			});
			for (const entry of await ctx.fs.listDir(target, signal)) {
				const name = path === "" ? entry.name : `${path}/${entry.name}`;
				if (!allowed(name)) continue;
				const info = await ctx.fs.lstat(name, { cwd }, signal);
				if (info?.type === "directory") await walk(name);
				else if (info?.type === "file") paths.push(name);
				else if (info?.type === "symlink") {
					complete = false;
					reason = "source-symlink";
				}
				if (paths.length > config.maxFiles) {
					complete = false;
					reason = "source-file-limit";
					return;
				}
			}
		};
		await walk("");
	}
	for (const path of CHECK_MANIFESTS) if (!paths.includes(path) && await ctx.fs.lstat(path, { cwd }, signal) !== void 0) paths.push(path);
	const digest = createHash("sha256");
	const files = [];
	let bytes = 0;
	for (const path of paths.sort()) {
		signal.throwIfAborted();
		if (files.length >= config.maxFiles) {
			complete = false;
			reason = "source-file-limit";
			break;
		}
		try {
			const file = await readSource(ctx, cwd, path, Math.min(config.maxFileBytes, config.maxSourceBytes - bytes), signal);
			if (file === void 0) {
				if (!git) {
					complete = false;
					reason = "source-changed-during-scan";
				}
				continue;
			}
			bytes += file.bytes.byteLength;
			digest.update(`${path}\0${file.hash}\0`);
			files.push(file);
			if (bytes >= config.maxSourceBytes) {
				complete = false;
				reason = "source-byte-limit";
				break;
			}
		} catch (error) {
			signal.throwIfAborted();
			complete = false;
			reason = "source-incomplete";
			ctx.logger.debug("A source file could not be fingerprinted.", error);
		}
	}
	return {
		fingerprint: {
			digest: digest.digest("hex"),
			files: files.length,
			bytes,
			complete,
			reason
		},
		files
	};
}
/**
* Identify the observed files used to discover verification commands.
* @param files - sorted, complete source observation.
* @returns a comparison value that contains no manifest content.
*/
function checkDefinitions(files) {
	return files.filter((file) => CHECK_MANIFESTS.includes(file.path)).map((file) => `${file.path}:${file.hash}`).join("\n");
}
/**
* Discover commands without executing workspace-authored code.
* @param ctx - filesystem provider.
* @param cwd - canonical workspace root.
* @param config - resource bounds.
* @param signal - cancellation.
* @returns explicitly labelled literal commands.
*/
async function discoverChecks(ctx, cwd, config, signal) {
	const result = [];
	const manifest = await readSource(ctx, cwd, ".uma/coding.json", config.maxFileBytes, signal);
	if (manifest !== void 0) result.push(...manifestSchema.parse(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(manifest.bytes))).checks);
	const pkg = await readSource(ctx, cwd, "package.json", config.maxFileBytes, signal);
	if (pkg !== void 0) {
		const input = z.object({
			scripts: z.record(z.string(), z.string()).optional(),
			packageManager: z.string().optional()
		}).parse(JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(pkg.bytes)));
		const manager = input.packageManager?.split("@")[0] ?? "npm";
		if (![
			"npm",
			"pnpm",
			"yarn",
			"bun"
		].includes(manager)) throw new Error("unsupported-package-manager");
		for (const name of Object.keys(input.scripts ?? {}).sort()) {
			const kind = /^(test|build|lint|typecheck)(?:$|:)/u.exec(name)?.[1];
			if (kind === void 0) continue;
			result.push({
				name,
				argv: [
					manager,
					"run",
					name
				],
				kind: kind === "test" ? "test" : kind === "build" ? "build" : kind === "lint" ? "lint" : "typecheck",
				origin: "package.json"
			});
		}
	}
	if (await readSource(ctx, cwd, "pyproject.toml", config.maxFileBytes, signal) !== void 0) result.push({
		name: "pytest",
		argv: [
			"python",
			"-m",
			"pytest"
		],
		kind: "test",
		origin: "pyproject.toml (suggested)"
	});
	if (await readSource(ctx, cwd, "pom.xml", config.maxFileBytes, signal) !== void 0) result.push({
		name: "maven-test",
		argv: ["mvn", "test"],
		kind: "test",
		origin: "pom.xml (suggested)"
	});
	const names = /* @__PURE__ */ new Set();
	for (const check of result) {
		if (names.has(check.name)) throw new Error("duplicate-check-name");
		names.add(check.name);
	}
	return result;
}
/**
* Parse common compiler locations without treating arbitrary output as executable instructions.
* @param output - bounded real stdout and stderr.
* @param limit - complete result item cap.
* @returns location-bearing diagnostics.
*/
function parseDiagnostics(output, limit) {
	const diagnostics = [];
	for (const text of output.split(/\r?\n/u)) {
		const match = /^(.+?)\((\d+),(\d+)\):\s*(error|warning)\s*([^:]+):\s*(.+)$/u.exec(text) ?? /^(.+?):(\d+):(\d+):?\s*(error|warning)\s*([^:]*)[: ]\s*(.+)$/u.exec(text);
		if (match === null) continue;
		diagnostics.push({
			path: match[1] ?? "",
			line: Math.max(1, Number(match[2])),
			column: Math.max(1, Number(match[3])),
			severity: match[4] === "warning" ? "warning" : "error",
			code: match[5]?.trim() || null,
			message: (match[6] ?? "").slice(0, 8e3)
		});
		if (diagnostics.length === limit) break;
	}
	return diagnostics;
}
/**
* List uncommitted edits plus untracked files with Git. An incomplete result makes changed-scope
* selection conservative: callers run every discovered check instead of trusting a partial list.
* @param ctx - same-world providers.
* @param config - subprocess resource bounds.
* @param cwd - canonical workspace or task-checkout root.
* @param signal - cancellation.
* @returns workspace-relative changed paths, or the incompleteness reason.
*/
async function changedFiles(ctx, config, cwd, signal) {
	const options = {
		...ctx.sandboxPolicy.resolve(),
		workspaceRoot: cwd,
		mode: "read-only"
	};
	const collected = [];
	let untracked = [];
	for (const command of [[
		"diff",
		"--no-ext-diff",
		"--no-textconv",
		"--relative",
		"--name-only",
		"-z",
		"HEAD",
		"--",
		"."
	], [
		"ls-files",
		"-z",
		"--others",
		"--exclude-standard",
		"--",
		"."
	]]) try {
		const result = await runCommand(ctx, config, options, cwd, [
			"git",
			"-c",
			"core.fsmonitor=false",
			"-c",
			"core.hooksPath=/dev/null",
			...command
		], signal);
		if (result.exitCode !== 0 || result.truncated || result.cancelled || result.timedOut) return {
			files: collected,
			untracked,
			complete: false,
			reason: result.truncated ? "changed-list-truncated" : "changed-list-unavailable"
		};
		const names = result.stdout.split("\0").filter((path) => path !== "");
		if (command[0] === "ls-files") untracked = names;
		collected.push(...names);
	} catch (error) {
		signal.throwIfAborted();
		ctx.logger.debug("Coding change detection falls back to the full check set.", error);
		return {
			files: collected,
			untracked,
			complete: false,
			reason: "git-unavailable"
		};
	}
	return {
		files: [...new Set(collected)],
		untracked,
		complete: true,
		reason: null
	};
}
/**
* Decide which discovered checks a changed-scope verification runs: declared coverage intersects
* the change set; undeclared coverage stays included; an incomplete or empty change scan decides
* conservatively. Pure so tests can pin the selection contract without providers.
* @param checks - discovered checks.
* @param changed - working-tree change scan.
* @returns one decision per check, in discovery order.
*/
function selectChecksForScope(checks, changed) {
	if (!changed.complete) return checks.map((check) => ({
		name: check.name,
		included: true,
		reason: "changed-list-incomplete"
	}));
	if (changed.files.length === 0) return checks.map((check) => ({
		name: check.name,
		included: false,
		reason: "no-changes"
	}));
	return checks.map((check) => {
		const coverage = check.coverage ?? [];
		if (coverage.length === 0) return {
			name: check.name,
			included: true,
			reason: "no-coverage-declared"
		};
		const match = picomatch([...coverage], { dot: true });
		return changed.files.some((path) => match(path)) ? {
			name: check.name,
			included: true,
			reason: "coverage-match"
		} : {
			name: check.name,
			included: false,
			reason: "coverage-exclude"
		};
	});
}
//#endregion
export { readSource as a, parseDiagnostics as i, checkDefinitions as n, scanSources as o, discoverChecks as r, selectChecksForScope as s, changedFiles as t };
