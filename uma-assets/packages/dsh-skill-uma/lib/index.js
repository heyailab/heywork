import { createDecipheriv, createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { brotliDecompressSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import z from "@deepseek-ai/schemastery";
import { BUNDLED_SKILL_RANK, isSkillName } from "@deepseek-ai/dsh-skill";
import { parse } from "yaml";
//#region lib/types/resources.js
/** Application-local resource packaging; concealment from casual browsing, not protection from the device owner. */
const key = createHash("sha256").update("UMA Studio local resource container v1").digest();
const maximum = 2 * 1024 * 1024;
const digest = (path) => createHash("sha256").update(path).digest("hex");
function locate(path) {
	const absolute = resolve(path);
	let parent = absolute;
	while (dirname(parent) !== parent) {
		const virtualStore = join(parent, "resources.umadb");
		const physicalStore = virtualStore.replace(`${sep}app.asar${sep}`, `${sep}app.asar.unpacked${sep}`);
		const store = existsSync(physicalStore) ? physicalStore : virtualStore;
		const assets = join(parent, "assets");
		if ((absolute === assets || absolute.startsWith(assets + sep)) && existsSync(store)) return {
			store,
			name: relative(assets, absolute).split(sep).join("/")
		};
		parent = dirname(parent);
	}
}
function lookup(path) {
	const location = locate(path);
	if (location === void 0) return void 0;
	const db = new DatabaseSync(location.store, { readOnly: true });
	try {
		const row = db.prepare("SELECT kind,nonce,value,tag FROM resources WHERE id=?").get(digest(location.name));
		if (!row) throw new Error("Unknown internal resource");
		if (typeof row.kind !== "number" || !(row.nonce instanceof Uint8Array) || !(row.value instanceof Uint8Array) || !(row.tag instanceof Uint8Array)) throw new Error("Invalid internal resource record");
		const decipher = createDecipheriv("aes-256-gcm", key, row.nonce);
		decipher.setAAD(Buffer.from(`${row.kind}:${location.name}`));
		decipher.setAuthTag(row.tag);
		const packed = Buffer.concat([decipher.update(row.value), decipher.final()]);
		return {
			kind: row.kind,
			bytes: brotliDecompressSync(packed, { maxOutputLength: maximum })
		};
	} finally {
		db.close();
	}
}
function readResourceFile(path, encoding) {
	const row = lookup(path);
	if (row?.kind === 1) throw new Error("Resource is a directory");
	const bytes = row?.bytes ?? readFileSync(path);
	return encoding === void 0 ? bytes : new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}
/** List a virtual resource directory.
* @param path - Directory path.
* @param options - Dirent-compatible result selector.
* @returns direct children.
*/
function listResourceDirectory(path, options) {
	const row = lookup(path);
	if (row === void 0) return readdirSync(path, options);
	if (row.kind !== 1) throw new Error("Resource is not a directory");
	const values = JSON.parse(row.bytes.toString("utf8"));
	if (!Array.isArray(values)) throw new Error("Invalid resource directory");
	return values.map((value) => {
		if (value === null || typeof value !== "object" || !("name" in value) || typeof value.name !== "string" || !("directory" in value) || typeof value.directory !== "boolean" || value.name === "" || value.name === "." || value.name === ".." || /[/\\\0]/u.test(value.name)) throw new Error("Invalid resource entry");
		const { name, directory } = value;
		return {
			name,
			isDirectory: () => directory,
			isFile: () => !directory,
			isSymbolicLink: () => false
		};
	});
}
//#endregion
//#region lib/types/index.js
/** Bundled Uma design and delivery skills mounted by the default web agent preset. */
/** Validated resource configuration. */
const Config = z.object({ assetRoot: z.string().min(1) });
/** Cordis plugin identity. */
const name = "skill-hey";
/** Registry used by the bundled provider. */
const inject = ["skills"];
function strictBoolean(value, field, path) {
	if (value === void 0) return void 0;
	if (typeof value === "boolean") return value;
	throw new Error(`skill-hey: ${path} has a non-boolean ${field}`);
}
function parseFrontmatter(raw, path) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw);
	if (match?.[1] === void 0) throw new Error(`skill-hey: ${path} has no YAML frontmatter`);
	const metadata = parse(match[1]);
	if (typeof metadata !== "object" || metadata === null) throw new Error(`skill-hey: ${path} has no metadata object`);
	const record = metadata;
	const skillName = record.name;
	const description = record.description;
	if (typeof skillName !== "string" || !isSkillName(skillName)) throw new Error(`skill-hey: ${path} has an invalid skill name`);
	if (typeof description !== "string" || description.length === 0) throw new Error(`skill-hey: ${path} has no description`);
	const whenToUse = typeof record.whenToUse === "string" && record.whenToUse.length > 0 ? record.whenToUse : void 0;
	const modelInvocable = strictBoolean(record["disable-model-invocation"], "disable-model-invocation", path) !== true;
	const userInvocable = strictBoolean(record["user-invocable"], "user-invocable", path) !== false;
	return {
		frontmatter: {
			name: skillName,
			description,
			...whenToUse === void 0 ? {} : { whenToUse },
			modelInvocable,
			userInvocable
		},
		body: raw.slice(match[0].length).trim()
	};
}
function candidateOf(directory, frontmatter) {
	return {
		name: frontmatter.name,
		description: frontmatter.description,
		...frontmatter.whenToUse === void 0 ? {} : { whenToUse: frontmatter.whenToUse },
		invocation: {
			modelInvocable: frontmatter.modelInvocable,
			userInvocable: false
		},
		provider: "dsh-hey",
		source: "bundled",
		rank: BUNDLED_SKILL_RANK,
		resourceBase: {
			kind: "opaque",
			description: `HEY-managed resources. Use hey_resource_read with skill "${frontmatter.name}" and the relative path named below; omit path to browse. These are references, not local file paths. Use the native design tools instead of installed Python scripts.`
		},
		locator: join(directory, "SKILL.md")
	};
}
/**
* Register the bundled Uma skills with resources readable by the agent.
* @param ctx - Context carrying the skill registry.
* @param config - Optional external assets directory for packaged applications.
*/
function apply(ctx, config = {}) {
	const assetRoot = config.assetRoot ?? fileURLToPath(new URL("../assets/", import.meta.url));
	const candidates = listResourceDirectory(assetRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort().map((directoryName) => {
		const directory = join(assetRoot, directoryName);
		return candidateOf(directory, parseFrontmatter(readResourceFile(join(directory, "SKILL.md"), "utf8"), join(directory, "SKILL.md")).frontmatter);
	});
	const provider = {
		name: "dsh-hey",
		list: () => Promise.resolve(candidates),
		get: (candidate, options) => Promise.resolve().then(() => {
			options.signal?.throwIfAborted();
			const { rank: _rank, locator, ...summary } = candidate;
			const { body } = parseFrontmatter(readResourceFile(locator, "utf8"), locator);
			return {
				...summary,
				content: body
			};
		})
	};
	ctx.skills.registerProvider(() => provider);
}
//#endregion
export { Config, apply, inject, name };
