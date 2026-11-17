import { createHash } from "node:crypto";
import { isBundledPath, listResourceDirectory, readResourceFile, resourceExists, resourceIsDirectory } from "@deepseek-ai/dsh-skill-uma/resources";
import { join, sep } from "node:path";
import { closeSync, fstatSync, openSync, readSync, readdirSync, realpathSync, statSync } from "node:fs";
import Papa from "papaparse";
//#region lib/types/resources.js
/** Read-only, virtual references to installed HEY skill resources. */
/** Keep a valid UTF-8 prefix without retaining an incomplete final code point.
* @param bytes - Complete or bounded UTF-8 bytes.
* @returns Decoded prefix; invalid complete byte sequences are rejected.
*/
function utf8Prefix(bytes) {
	return new TextDecoder("utf-8", {
		fatal: true,
		ignoreBOM: true
	}).decode(bytes, { stream: true });
}
function resourcePath(root, skill, path) {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(skill) || path.length > 512 || path.includes("\\") || path.includes(":") || /[\u0000-\u001f\u007f]/u.test(path) || path !== "" && path.split("/").some((part) => part === "" || part === "." || part === "..")) throw new Error("Invalid HEY resource identifier");
	if (isBundledPath(root)) {
		if (!resourceExists(join(root, skill, "SKILL.md"))) throw new Error("Unknown HEY skill");
		const target = join(root, skill, path);
		if (!resourceExists(target)) throw new Error("Unknown HEY resource");
		return target;
	}
	const assets = realpathSync(root);
	const base = realpathSync(join(assets, skill));
	if (!base.startsWith(assets + sep)) throw new Error("HEY skill leaves the asset root");
	if (!statSync(join(base, "SKILL.md")).isFile()) throw new Error("Unknown HEY skill");
	const result = realpathSync(join(base, path));
	if (result !== base && !result.startsWith(base + sep)) throw new Error("HEY resource leaves its skill");
	return result;
}
/** Read a bounded text page while keeping filesystem locations private.
* @param root - Trusted configured asset root.
* @param skill - Installed skill directory name.
* @param path - Relative file within that skill.
* @param offset - Byte offset returned by the previous page, or zero.
* @param bytes - Maximum UTF-8 bytes in this page.
* @returns Text and the next byte offset; no absolute path.
*/
function readBundledText(root, skill, path, offset, bytes) {
	try {
		if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(bytes) || bytes < 4) throw new Error("Invalid page");
		const target = resourcePath(root, skill, path);
		if (isBundledPath(target)) {
			const buffer = readResourceFile(target);
			if (offset > buffer.length) throw new Error("Invalid page offset");
			const slice = buffer.subarray(offset, offset + bytes);
			const content = utf8Prefix(slice);
			const consumed = Buffer.byteLength(content);
			if (slice.length > 0 && consumed === 0 || content.includes("\0") || offset + slice.length === buffer.length && consumed !== slice.length) throw new Error("Invalid UTF-8 resource");
			return {
				content,
				nextOffset: offset + consumed,
				totalBytes: buffer.length
			};
		}
		const file = openSync(target, "r");
		try {
			const info = fstatSync(file);
			if (!info.isFile() || offset > info.size) throw new Error("Not a readable resource");
			const buffer = Buffer.alloc(Math.min(bytes, info.size - offset));
			const count = readSync(file, buffer, 0, buffer.length, offset);
			const content = utf8Prefix(buffer.subarray(0, count));
			const consumed = Buffer.byteLength(content);
			if (count > 0 && consumed === 0 || offset + count === info.size && consumed !== count) throw new Error("Incomplete UTF-8 resource");
			if (content.includes("\0")) throw new Error("Not a text resource");
			return {
				content,
				nextOffset: offset + Buffer.byteLength(content),
				totalBytes: info.size
			};
		} finally {
			closeSync(file);
		}
	} catch {
		throw new Error("HEY resource is unavailable or is not valid UTF-8 text; check its skill, relative path and page offset");
	}
}
/** Resolve a text resource or page its directory without revealing installation paths.
* @param root - Trusted configured asset root.
* @param skill - Installed skill name.
* @param path - Relative resource path; empty lists the skill root.
* @param offset - Previous nextOffset, initially zero.
* @param maximum - Complete rendered result byte budget.
* @returns Bounded resource content or directory entries and a continuation offset.
*/
function readBundledResource(root, skill, path, offset, maximum) {
	const reference = `hey-resource://${skill}/${path}`;
	try {
		if (!Number.isSafeInteger(offset) || offset < 0) throw new Error("Invalid offset");
		const target = resourcePath(root, skill, path);
		if (isBundledPath(target) ? resourceIsDirectory(target) : statSync(target).isDirectory()) {
			const all = (isBundledPath(target) ? listResourceDirectory(target, { withFileTypes: true }) : readdirSync(target, { withFileTypes: true })).filter((entry) => !entry.isSymbolicLink()).map((entry) => ({
				name: entry.name,
				kind: entry.isDirectory() ? "directory" : "file"
			})).sort((a, b) => a.name.localeCompare(b.name));
			const entries = all.slice(offset, offset + 100);
			let output = "";
			do {
				output = JSON.stringify({
					reference,
					kind: "directory",
					entries,
					nextOffset: offset + entries.length < all.length ? offset + entries.length : null
				});
				if (Buffer.byteLength(output) <= maximum) return output;
				entries.pop();
			} while (entries.length > 0);
			throw new Error("Resource page exceeds its limit");
		}
		const header = `Resource: ${reference}\n`;
		const page = readBundledText(root, skill, path, offset, maximum - Buffer.byteLength(header) - 128);
		return `${header}Next byte offset: ${page.nextOffset < page.totalBytes ? String(page.nextOffset) : "complete"}\n\n${page.content}`;
	} catch {
		throw new Error("HEY resource could not be read; use the installed skill name and its relative resource path");
	}
}
//#endregion
//#region lib/types/context.js
/** Bounded design inputs from the selected execution directory; reads never create or replace a design. */
const INPUTS = [
	"PRODUCT.md",
	"DESIGN.md",
	"DESIGN.json",
	"tokens.css",
	"components.json",
	"package.json",
	"design-system/MASTER.md"
];
const PROJECT_INPUTS = [
	"PROJECT.md",
	"DESIGN.md",
	"tokens.css",
	"manifest.json",
	"REVIEW.md"
];
const FRAMEWORKS = [
	"react",
	"vue",
	"next",
	"nuxt",
	"svelte",
	"@angular/core",
	"electron",
	"@tauri-apps/api",
	"react-native",
	"tailwindcss",
	"@radix-ui/react-dialog",
	"@mui/material",
	"antd"
];
function relativeDirectory(value) {
	if (value === ".") return "";
	if (value.length === 0 || value.includes("\\") || value.includes("\0") || value.startsWith("/") || value.includes(":") || value.split("/").some((part) => part === "." || part === ".." || part === "")) throw new Error("design_context: target must be a relative directory without parent segments");
	return value;
}
function stackFrom(text) {
	const parsed = JSON.parse(text);
	if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("design_context: package.json must contain an object");
	const record = parsed;
	const names = /* @__PURE__ */ new Set();
	for (const key of [
		"dependencies",
		"devDependencies",
		"peerDependencies"
	]) {
		const dependencies = record[key];
		if (dependencies === void 0) continue;
		if (typeof dependencies !== "object" || dependencies === null || Array.isArray(dependencies)) throw new Error(`design_context: package.json ${key} must contain an object`);
		for (const [name, version] of Object.entries(dependencies)) {
			if (typeof version !== "string") throw new Error(`design_context: package.json dependency ${name} must have a string version`);
			names.add(name);
		}
	}
	return FRAMEWORKS.filter((name) => names.has(name));
}
/**
* Read existing design evidence before selecting a bundled system or changing UI.
* @param ctx - Filesystem and current working-directory services.
* @param exec - Actual tool execution, including cancellation and Session identity.
* @param request - Optional monorepo target and explicitly selected design project.
* @param limits - Per-file and per-result transfer budgets.
* @returns Exact text and hashes, explicit omissions and declared framework names; no visual quality verdict.
*/
async function readDesignContext(ctx, exec, request, limits) {
	if (exec.agent === void 0) throw new Error("design_context requires an agent Session");
	const target = relativeDirectory(request.target ?? ".");
	if (request.project !== void 0 && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(request.project)) throw new Error("design_context: project must be kebab-case");
	if (request.page !== void 0 && (request.project === void 0 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(request.page))) throw new Error("design_context: page requires an explicit project and a kebab-case page id");
	const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
	const root = await ctx.fs.resolve(".", {
		cwd,
		signal: exec.signal
	});
	const paths = [...INPUTS];
	if (target !== "") paths.push(...INPUTS.map((name) => `${target}/${name}`));
	if (request.project !== void 0) {
		paths.push(...PROJECT_INPUTS.map((name) => `.design/${request.project}/${name}`));
		paths.push(`design-system/${request.project}/MASTER.md`);
		if (request.page !== void 0) paths.push(`design-system/${request.project}/pages/${request.page}.md`);
	}
	const files = [];
	let remaining = limits.totalBytes;
	for (const path of paths) {
		exec.signal.throwIfAborted();
		const parents = path.split("/").slice(0, -1);
		for (let depth = 1; depth <= parents.length; depth++) {
			const parent = await ctx.fs.lstat(parents.slice(0, depth).join("/"), { cwd }, exec.signal);
			if (parent !== void 0 && parent.type !== "directory") throw new Error(`design_context: expected a regular directory at ${parents.slice(0, depth).join("/")}`);
		}
		const info = await ctx.fs.lstat(path, { cwd }, exec.signal);
		const file = {
			path,
			content: "",
			sha256: ""
		};
		if (info === void 0) {
			files.push({
				...file,
				state: "missing"
			});
			continue;
		}
		if (info.type !== "file") {
			files.push({
				...file,
				state: "non-file"
			});
			continue;
		}
		if (info.size !== void 0 && info.size > limits.fileBytes) {
			files.push({
				...file,
				state: "oversized"
			});
			continue;
		}
		if (remaining === 0 || info.size !== void 0 && info.size > remaining) {
			files.push({
				...file,
				state: "budget-exceeded"
			});
			continue;
		}
		const resolved = await ctx.fs.resolve(path, {
			cwd,
			signal: exec.signal
		});
		if (!ctx.fs.contains(root, resolved)) throw new Error(`design_context: path leaves the execution directory: ${path}`);
		const bytes = await ctx.fs.readBytes(resolved, exec.signal, Math.min(limits.fileBytes, remaining));
		const content = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
		if (content.includes("\0")) throw new Error(`design_context: expected UTF-8 text at ${path}`);
		if ((await ctx.fs.stat(resolved, exec.signal))?.version !== info.version) throw new Error(`design_context: ${path} changed while reading; inspect again`);
		remaining -= bytes.byteLength;
		files.push({
			path,
			state: "read",
			content,
			sha256: createHash("sha256").update(bytes).digest("hex")
		});
	}
	const declaredStack = [...new Set(files.filter((file) => file.path.endsWith("package.json") && file.state === "read").flatMap((file) => stackFrom(file.content)))];
	return {
		target: target || ".",
		project: request.project ?? "",
		files,
		declaredStack,
		hasDesign: files.some((file) => /(?:^|\/)(?:DESIGN|MASTER)\.md$/u.test(file.path) && file.state === "read" && file.content.trim().length > 0),
		complete: files.every((file) => file.state === "read" || file.state === "missing"),
		fingerprint: createHash("sha256").update(JSON.stringify(files.map((file) => [
			file.path,
			file.state,
			file.sha256
		]))).digest("hex")
	};
}
//#endregion
//#region lib/types/rules.js
/** Native retrieval of complete design-rule records from the bundled CSV corpus. */
/** Bundled rule domains; stack records additionally require an explicit stack id. */
const RULE_DOMAINS = [
	"ux",
	"web",
	"react",
	"style",
	"color",
	"typography",
	"chart",
	"motion",
	"product",
	"layout",
	"reasoning",
	"icons",
	"stack"
];
const FILES = {
	ux: "ux-guidelines.csv",
	web: "app-interface.csv",
	react: "react-performance.csv",
	style: "styles.csv",
	color: "colors.csv",
	typography: "typography.csv",
	chart: "charts.csv",
	motion: "motion.csv",
	product: "products.csv",
	layout: "landing.csv",
	reasoning: "ui-reasoning.csv",
	icons: "icons.csv"
};
const SUBJECT_FIELDS = {
	layout: "Pattern Name",
	reasoning: "UI_Category"
};
const TERMS = {
	"键盘": ["keyboard"],
	"焦点": ["focus"],
	"对比度": ["contrast"],
	"无障碍": ["accessibility"],
	"桌面": ["desktop"],
	"导航": ["navigation"],
	"侧栏": ["sidebar"],
	"表单": ["form"],
	"加载": ["loading"],
	"空状态": ["empty"],
	"错误": ["error"],
	"配色": ["color"],
	"字体": ["typography", "font"],
	"动效": ["motion", "animation"],
	"响应式": ["responsive"],
	"仪表盘": ["dashboard"],
	"后台": ["admin", "dashboard"],
	"企业": ["enterprise"],
	"开发者": ["developer"],
	"数据": ["data"],
	"控制台": ["console"],
	"小程序": ["mobile"],
	"官网": ["marketing", "landing"],
	"玻璃": ["glass"],
	"图表": ["chart"],
	"组件": ["component"],
	"性能": ["performance"],
	"作品集": ["portfolio"],
	"个人网站": ["portfolio"],
	"输入法": ["ime", "composition"],
	"图标": ["icon"]
};
function words(text) {
	return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];
}
/**
* Search local design rules with lexical BM25 ranking and Chinese query expansion.
* @param root - Trusted installed directory containing the UI/UX CSV data.
* @param request - Domain, explicit stack when needed, query and resolved result limit.
* @returns Complete matched CSV records with source rows; no generated advice or compliance verdict.
*/
function searchDesignRules(root, request) {
	let file;
	if (request.domain === "stack") {
		const stacks = listResourceDirectory(join(root, "stacks"), { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith(".csv")).map((entry) => entry.name.slice(0, -4));
		if (request.stack === void 0 || !stacks.includes(request.stack)) throw new Error(`design_rule_search: choose an available stack: ${stacks.join(", ")}`);
		file = `stacks/${request.stack}.csv`;
	} else {
		if (request.stack !== void 0) throw new Error("design_rule_search: stack is accepted only for the stack domain");
		file = FILES[request.domain];
	}
	const parsed = Papa.parse(readResourceFile(join(root, file), "utf8"), {
		header: true,
		skipEmptyLines: "greedy"
	});
	if (parsed.errors.length > 0) throw new Error(`design_rule_search: invalid CSV at ${file}: ${parsed.errors[0]?.message}`);
	const records = parsed.data.map((fields, index) => ({
		fields,
		row: index + 2,
		terms: words(Object.values(fields).join(" "))
	})).filter((record) => record.fields["Status"] !== "deprecated");
	const query = words(request.query);
	for (const [chinese, expansions] of Object.entries(TERMS)) if (request.query.includes(chinese)) query.push(...expansions);
	if (query.length === 0) throw new Error("design_rule_search: query must contain searchable words");
	const terms = [...new Set(query)];
	const subjectField = SUBJECT_FIELDS[request.domain];
	const averageLength = records.reduce((sum, record) => sum + record.terms.length, 0) / Math.max(records.length, 1);
	const frequencies = new Map(terms.map((term) => [term, records.filter((record) => record.terms.includes(term)).length]));
	return records.map((record) => {
		let score = 0;
		const subject = subjectField === void 0 ? [] : words(record.fields[subjectField] ?? "");
		for (const term of terms) {
			const count = record.terms.filter((word) => word === term).length;
			if (count === 0) continue;
			const frequency = frequencies.get(term) ?? 0;
			const inverse = Math.log(1 + (records.length - frequency + .5) / (frequency + .5));
			score += inverse * (subject.includes(term) ? 2 : 1) * count * 2.2 / (count + 1.2 * (.25 + .75 * record.terms.length / Math.max(averageLength, 1)));
		}
		return {
			source: `hey-design-system/data/${file}`,
			row: record.row,
			fields: record.fields,
			score
		};
	}).filter((record) => record.score > 0).sort((a, b) => b.score - a.score || a.row - b.row).slice(0, request.limit);
}
//#endregion
export { readBundledText as a, readBundledResource as i, searchDesignRules as n, utf8Prefix as o, readDesignContext as r, RULE_DOMAINS as t };
