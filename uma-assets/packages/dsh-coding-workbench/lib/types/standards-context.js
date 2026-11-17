import { selectCodingStandards } from '@deepseek-ai/dsh-util-uma-delivery';
import z from '@deepseek-ai/schemastery';
import { readSource } from "./source.js";
/** Scoped standards preparation plugin. */
export const name = 'coding-standards-context';
/** Source reads use the current execution world's filesystem and working directory. */
export const inject = ['fs', 'workingDirectory', 'systemPrompt'];
/** Validate resource limits without limiting user source edits or model transport bodies. */
export const Config = z.object({
    guideLanguage: z.union(['en', 'zh']).default('en'),
    fileBytes: z.number().step(1).min(1).default(65536),
    contextBytes: z.number().step(1).min(1024).default(32768),
});
const MANIFESTS = {
    'package.json': ['javascript'], 'tsconfig.json': ['typescript'], 'jsconfig.json': ['javascript'],
    'go.mod': ['go'], 'pyproject.toml': ['python'], 'requirements.txt': ['python'],
    'pom.xml': ['java'], 'build.gradle': ['java'], 'build.gradle.kts': ['jvm'],
    'Cargo.toml': ['rust'], 'composer.json': ['php'], 'Gemfile': ['ruby'],
};
/**
 * Read only known project manifests and select sourced, explicitly unverified guidance.
 * @param ctx - execution-world filesystem.
 * @param cwd - current authorized working directory, including an isolated task checkout.
 * @param config - complete metadata and context limits.
 * @param signal - request and plugin lifetime.
 * @returns standards with manifest hashes, or an actionable unavailable state on read failure.
 */
export async function prepareStandards(ctx, cwd, config, signal) {
    const languages = new Set();
    const observed = [];
    try {
        for (const [path, tags] of Object.entries(MANIFESTS)) {
            const source = await readSource(ctx, cwd, path, config.fileBytes, signal);
            if (source === undefined)
                continue;
            observed.push({ path, sha256: source.hash });
            for (const language of tags)
                languages.add(language);
            if (path === 'package.json') {
                const parsed = JSON.parse(new TextDecoder().decode(source.bytes));
                if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))
                    throw new Error('invalid-project-manifest');
                const manifest = parsed;
                for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
                    const value = manifest[key];
                    if (value === undefined)
                        continue;
                    if (typeof value !== 'object' || value === null || Array.isArray(value))
                        throw new Error('invalid-project-manifest');
                    const names = Object.keys(value);
                    if (names.includes('typescript'))
                        languages.add('typescript');
                    if (names.some(item => ['pg', 'postgres'].includes(item)))
                        languages.add('postgresql');
                    if (names.some(item => ['react', 'vue', 'svelte', '@angular/core', 'next', 'nuxt'].includes(item)))
                        languages.add('frontend');
                    if (names.some(item => ['express', 'fastify', '@nestjs/core', 'koa', 'hono'].includes(item)))
                        languages.add('backend');
                }
            }
        }
        const selected = selectCodingStandards([...languages]);
        const text = 'Project coding guidance, not verification. Existing project instructions and user requirements take precedence over incompatible external style preferences. '
            + 'Read the applicable project instructions and current source. Match selected rules to actual project checks through coding_inspect; '
            + 'record executable acceptance and independent review evidence. Root manifests are evidence of possible technologies, not proof that every package uses them. '
            + 'For monorepos, inspect the target package and refine selection using coding_inspect standards. No project scripts were executed.\n'
            + JSON.stringify({ state: 'selected', verification: 'not-run', manifests: observed,
                catalogVersion: selected.catalogVersion, languages: selected.languages, rules: selected.rules,
                sources: selected.sources, guides: selected.guides.map(guide => ({ id: guide.id, version: guide.version,
                    title: guide.title[config.guideLanguage], content: guide.body[config.guideLanguage], sourceIds: guide.sourceIds,
                })), policy: selected.policy });
        if (Buffer.byteLength(text) > config.contextBytes)
            return 'Project coding guidance is unavailable because the complete selected references exceed the configured contextBytes. Inspect project conventions and select narrower standards explicitly; do not claim automatic preparation succeeded.';
        return text;
    }
    catch (error) {
        signal.throwIfAborted();
        ctx.logger.warn('Project standards preparation failed.', error);
        return 'Project coding guidance could not be prepared from the current manifests. Inspect the project files and select standards explicitly. Do not claim the project stack or applicable standards have been verified.';
    }
}
/**
 * Refresh standards from the actual project before each model request and log through runtime context.
 * @param ctx - scoped Agent services.
 * @param config - validated metadata and complete context limits.
 */
export function apply(ctx, config) {
    const lifetime = new AbortController();
    const pending = new Set();
    const prepared = new WeakMap();
    ctx.effect(() => async () => { lifetime.abort(); await Promise.allSettled([...pending]); });
    ctx.systemPrompt.context({ name: 'hey:project-standards', order: 135, interpolate: false,
        text: ({ agent }) => agent === undefined ? '' : prepared.get(agent) ?? '' });
    ctx.on('agent/pre-step', async ({ agent, signal }, next) => {
        const owned = AbortSignal.any([signal, lifetime.signal]);
        const operation = (async () => {
            const cwd = await ctx.workingDirectory.ensure(agent, owned);
            return prepareStandards(ctx, cwd, config, owned);
        })();
        pending.add(operation);
        try {
            const text = await operation;
            owned.throwIfAborted();
            prepared.set(agent, text);
        }
        finally {
            pending.delete(operation);
        }
        return next();
    });
}
//# sourceMappingURL=standards-context.js.map