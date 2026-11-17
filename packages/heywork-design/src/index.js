/**
 * @heywork/design — plugin entry.
 *
 * Rewritten from specs/tool-uma-design-core.md §2 + tool-uma-design-project.md.
 * Assembles the three tool groups through injected dependencies; no upstream
 * @deepseek-ai/* imports, so it runs without node_modules.
 */

import { isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  IDENTITY, DEFAULTS, assertDeps,
} from './deps.js'
import { registerQueryTools } from './query.js'
import { registerGenerateTools } from './generate.js'
import { registerProjectTools } from './project.js'

export const name = IDENTITY.pluginName
export const inject = IDENTITY.inject

/** Config shape. The host supplies the schema factory (schemastery). */
export function createConfig(schema) {
  return schema.object({
    resourceMaxBytes: schema.number().step(1).min(1024).max(98304).default(DEFAULTS.resourceMaxBytes),
    projectWrite: schema.boolean().default(DEFAULTS.projectWrite),
    projectFileMaxBytes: schema.number().step(1).min(1024).default(DEFAULTS.projectFileMaxBytes),
    assetRoot: schema.string().min(1),
    contextFileBytes: schema.number().step(1).min(1024).default(DEFAULTS.contextFileBytes),
    contextTotalBytes: schema.number().step(1).min(1024).default(DEFAULTS.contextTotalBytes),
    ruleMaxResults: schema.number().step(1).min(1).max(50).default(DEFAULTS.ruleMaxResults),
    previewMaxBytes: schema.number().step(1).min(1024).default(DEFAULTS.previewMaxBytes),
    catalogMaxPageSize: schema.number().step(1).min(1).max(500).default(DEFAULTS.catalogMaxPageSize),
  })
}

/**
 * Register all 11 tools.
 *
 * deps must carry: defineTool, tools, fs, resources, parseYaml, isSkillName,
 * systemPrompt, workingDirectory, get, waterfall (as needed by the groups).
 * config.assetRoot is required by spec — a relative path is rejected verbatim.
 */
export function apply(ctx, config = {}) {
  assertDeps(ctx, ['tools'])

  const assetRoot = config.assetRoot ?? fileURLToPath(new URL('../../uma-assets/packages/dsh-skill-uma/assets/', import.meta.url))
  if (!isAbsolute(assetRoot)) throw new Error('tool-hey-design: assetRoot must be an absolute directory')

  const roots = {
    assetRoot,
    systemsRoot: join(assetRoot, IDENTITY.assetSubdirs.systems),
    referencesRoot: join(assetRoot, IDENTITY.assetSubdirs.brands),
    systems: [],
    references: [],
    knowledge: [],
  }

  const deps = { ...ctx, ...(config.deps ?? {}) }
  const cfg = { ...DEFAULTS, ...config }

  registerQueryTools(deps, cfg, roots)
  registerGenerateTools(deps, cfg, roots)
  registerProjectTools(deps, cfg, roots)
}
