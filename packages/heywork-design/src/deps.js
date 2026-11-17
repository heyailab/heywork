/**
 * @heywork/design — shared dependency-injection contracts.
 *
 * Upstream deps are injected at apply() time instead of imported, so this
 * package runs without node_modules. Each tool module receives a `Deps` object
 * with exactly the capabilities declared in its spec.
 *
 * No behavior lives here — only the contracts and small shared helpers whose
 * behavior is itself specified (e.g. tool descriptor shape).
 */

/**
 * @typedef {object} Deps
 * @property {object} tools          - ctx.tools: { register(descriptor) }
 * @property {object} [fs]           - ctx.fs: resolve/lstat/stat/contains/readBytes/writeText/listDir/sandboxMode
 * @property {object} [workingDirectory] - ctx.workingDirectory: { ensure(agent, signal) }
 * @property {object} [systemPrompt] - ctx.systemPrompt: { section({name, order, text}) }
 * @property {function} [get]        - ctx.get(name)
 * @property {function} [waterfall]  - ctx.waterfall(event, target, exec, fallback)
 * @property {function} defineTool   - from @deepseek-ai/dsh-tools
 * @property {function} parseYaml    - from yaml
 * @property {function} isSkillName  - from @deepseek-ai/dsh-skill (for resource_read)
 * @property {object} resources      - rewritten @heywork/skill resource layer
 * @property {function} [readDesignContext] - context reader (injected or built here)
 * @property {function} [searchDesignRules] - rule searcher
 */

/** Default config values frozen from spec §2.2. */
export const DEFAULTS = Object.freeze({
  resourceMaxBytes: 32768,
  projectWrite: true,
  projectFileMaxBytes: 262144,
  contextFileBytes: 32768,
  contextTotalBytes: 98304,
  ruleMaxResults: 10,
  previewMaxBytes: 262144,
  catalogMaxPageSize: 100,
})

/** Frozen plugin identity (spec §1 / HEYWORK.md §2). */
export const IDENTITY = Object.freeze({
  pluginName: 'tool-hey-design',
  inject: ['tools', 'fs', 'workingDirectory', 'systemPrompt'],
  assetSubdirs: {
    systems: 'uma-design-systems/systems',
    brands: 'uma-design-md/brands',
  },
  knowledgeRoots: [
    'uma-team/references',
    'uma-quality-gate/references',
    'uma-delivery-docs/templates',
    'uma-design-taste/references',
    'uma-design-craft/references',
    'uma-apple-review/references',
  ],
})

/** Tokens that make a tool descriptor valid regardless of internal impl. */
export function assertDeps(deps, required) {
  for (const key of required) {
    if (deps[key] === undefined || deps[key] === null) {
      throw new Error(`@heywork/design: missing injected dependency: ${key}`)
    }
  }
}
