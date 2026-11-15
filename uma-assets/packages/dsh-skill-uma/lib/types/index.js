/** Bundled Uma design and delivery skills mounted by the default web agent preset. */
import { readResourceFile as readFileSync, listResourceDirectory as readdirSync } from "./resources.js";
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import z from '@deepseek-ai/schemastery';
import { BUNDLED_SKILL_RANK, isSkillName } from '@deepseek-ai/dsh-skill';
import { parse as parseYaml } from 'yaml';
/** Validated resource configuration. */
export const Config = z.object({
    assetRoot: z.string().min(1),
});
/** Cordis plugin identity. */
export const name = 'skill-uma';
/** Registry used by the bundled provider. */
export const inject = ['skills'];
function strictBoolean(value, field, path) {
    if (value === undefined)
        return undefined;
    if (typeof value === 'boolean')
        return value;
    throw new Error(`skill-uma: ${path} has a non-boolean ${field}`);
}
function parseFrontmatter(raw, path) {
    const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw);
    if (match?.[1] === undefined)
        throw new Error(`skill-uma: ${path} has no YAML frontmatter`);
    const metadata = parseYaml(match[1]);
    if (typeof metadata !== 'object' || metadata === null)
        throw new Error(`skill-uma: ${path} has no metadata object`);
    const record = metadata;
    const skillName = record.name;
    const description = record.description;
    if (typeof skillName !== 'string' || !isSkillName(skillName)) {
        throw new Error(`skill-uma: ${path} has an invalid skill name`);
    }
    if (typeof description !== 'string' || description.length === 0) {
        throw new Error(`skill-uma: ${path} has no description`);
    }
    const whenToUse = typeof record.whenToUse === 'string' && record.whenToUse.length > 0 ? record.whenToUse : undefined;
    const modelInvocable = strictBoolean(record['disable-model-invocation'], 'disable-model-invocation', path) !== true;
    const userInvocable = strictBoolean(record['user-invocable'], 'user-invocable', path) !== false;
    return {
        frontmatter: { name: skillName, description, ...(whenToUse === undefined ? {} : { whenToUse }), modelInvocable, userInvocable },
        body: raw.slice(match[0].length).trim(),
    };
}
function candidateOf(directory, frontmatter) {
    return {
        name: frontmatter.name,
        description: frontmatter.description,
        ...(frontmatter.whenToUse === undefined ? {} : { whenToUse: frontmatter.whenToUse }),
        invocation: { modelInvocable: frontmatter.modelInvocable, userInvocable: false },
        provider: 'dsh-uma',
        source: 'bundled',
        rank: BUNDLED_SKILL_RANK,
        resourceBase: { kind: 'opaque', description: `UMA-managed resources. Use uma_resource_read with skill "${frontmatter.name}" and the relative path named below; omit path to browse. These are references, not local file paths. Use the native design tools instead of installed Python scripts.` },
        locator: join(directory, 'SKILL.md'),
    };
}
/**
 * Register the bundled Uma skills with resources readable by the agent.
 * @param ctx - Context carrying the skill registry.
 * @param config - Optional external assets directory for packaged applications.
 */
export function apply(ctx, config = {}) {
    const assetRoot = config.assetRoot ?? fileURLToPath(new URL('../assets/', import.meta.url));
    const candidates = readdirSync(assetRoot, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .sort()
        .map((directoryName) => {
        const directory = join(assetRoot, directoryName);
        return candidateOf(directory, parseFrontmatter(readFileSync(join(directory, 'SKILL.md'), 'utf8'), join(directory, 'SKILL.md')).frontmatter);
    });
    const provider = {
        name: 'dsh-uma',
        list: () => Promise.resolve(candidates),
        get: (candidate, options) => Promise.resolve().then(() => {
            options.signal?.throwIfAborted();
            const { rank: _rank, locator, ...summary } = candidate;
            const { body } = parseFrontmatter(readFileSync(locator, 'utf8'), locator);
            return { ...summary, content: body };
        }),
    };
    ctx.skills.registerProvider(() => provider);
}
//# sourceMappingURL=index.js.map