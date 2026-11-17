/**
 * @heywork/skill — bundled skill registration.
 *
 * Rewritten from specs/skill-uma.md §3. Depends on official services injected
 * via ctx, plus two small upstream utilities passed in at apply() config time
 * so this module can be tested without a full pnpm install.
 */

import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { listResourceDirectory, readResourceFile } from './resources.js'

// --- frozen identity (spec §3 / HEYWORK.md §2) ------------------------------
const PLUGIN_NAME = 'skill-uma'          // internal plugin id, frozen
const PROVIDER_NAME = 'dsh-uma'          // internal provider name, frozen
const INJECT = ['skills']
const RESOURCE_DESCRIPTION = (name) =>
  `HEY-managed resources. Use hey_resource_read with skill "${name}" and the relative path named below; omit path to browse. These are references, not local file paths. Use the native design tools instead of installed Python scripts.`

/** Minimal strict-boolean parse (spec §3: undefined passthrough, non-boolean throws). */
function strictBoolean(value, field, path) {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  throw new Error(`skill-uma: ${path} has a non-boolean ${field}`)
}

/** Parse a SKILL.md: YAML front matter + trimmed body (spec §3). */
function parseSkill(raw, path, parseYaml, isSkillName) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (match?.[1] === undefined) throw new Error(`skill-uma: ${path} has no YAML frontmatter`)
  const meta = parseYaml(match[1])
  if (typeof meta !== 'object' || meta === null) throw new Error(`skill-uma: ${path} has no metadata object`)

  const name = meta.name
  const description = meta.description
  if (typeof name !== 'string' || !isSkillName(name)) throw new Error(`skill-uma: ${path} has an invalid skill name`)
  if (typeof description !== 'string' || description.length === 0) throw new Error(`skill-uma: ${path} has no description`)

  const whenToUse = typeof meta.whenToUse === 'string' && meta.whenToUse.length > 0 ? meta.whenToUse : undefined
  const modelInvocable = strictBoolean(meta['disable-model-invocation'], 'disable-model-invocation', path) !== true
  const userInvocable = strictBoolean(meta['user-invocable'], 'user-invocable', path) !== false
  // spec §3: userInvocable is parsed but the candidate always reports false.
  void userInvocable

  return {
    frontmatter: {
      name,
      description,
      ...(whenToUse === undefined ? {} : { whenToUse }),
      modelInvocable,
      userInvocable,
    },
    body: raw.slice(match[0].length).trim(),
  }
}

/** Build a registry candidate from parsed front matter (spec §3 field table). */
function candidateOf(directory, frontmatter, rank) {
  return {
    name: frontmatter.name,
    description: frontmatter.description,
    ...(frontmatter.whenToUse === undefined ? {} : { whenToUse: frontmatter.whenToUse }),
    invocation: { modelInvocable: frontmatter.modelInvocable, userInvocable: false },
    provider: PROVIDER_NAME,
    source: 'bundled',
    rank,
    resourceBase: { kind: 'opaque', description: RESOURCE_DESCRIPTION(frontmatter.name) },
    locator: join(directory, 'SKILL.md'),
  }
}

/**
 * Plugin entry. `config` carries the two upstream utilities as injected deps:
 *   parseYaml(text) -> object        (from the yaml package)
 *   isSkillName(s) -> boolean        (from @deepseek-ai/dsh-skill)
 *   bundledRank                      (BUNDLED_SKILL_RANK)
 * This keeps the module runnable without node_modules while preserving the
 * exact external behavior described in the spec.
 */
export function apply(ctx, config = {}) {
  const { parseYaml, isSkillName, bundledRank = 0 } = config
  if (typeof parseYaml !== 'function' || typeof isSkillName !== 'function') {
    throw new Error('skill-uma: apply requires parseYaml and isSkillName')
  }

  const assetRoot = config.assetRoot ?? fileURLToPath(new URL('../assets/', import.meta.url))
  const candidates = listResourceDirectory(assetRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map((dirName) => {
      const dir = join(assetRoot, dirName)
      const locator = join(dir, 'SKILL.md')
      const parsed = parseSkill(readResourceFile(locator, 'utf8'), locator, parseYaml, isSkillName)
      return candidateOf(dir, parsed.frontmatter, bundledRank)
    })

  const provider = {
    name: PROVIDER_NAME,
    list: () => Promise.resolve(candidates),
    get: (candidate, options) => Promise.resolve().then(() => {
      options.signal?.throwIfAborted()
      const { rank: _rank, locator, ...summary } = candidate
      const { body } = parseSkill(readResourceFile(locator, 'utf8'), locator, parseYaml, isSkillName)
      return { ...summary, content: body }
    }),
  }

  ctx.skills.registerProvider(() => provider)
}

export const name = PLUGIN_NAME
export const inject = INJECT

/** Config validator shape — a schema factory can be injected by the host. */
export function createConfig(schema) {
  return schema.object({ assetRoot: schema.string().min(1) })
}
