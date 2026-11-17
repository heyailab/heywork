/**
 * 【逆向还原】由 `lib/types/index.js` 反推，非 DeepSeek 原始源码。
 *
 * 还原依据：tsc 直出保留了 JSDoc、变量名与函数签名；类型（interface / 泛型）
 * 全部从调用点推断，可能与原始定义不同名。逻辑与 lib 逐行等价。
 * 运行时仍以 lib/*.js 为准，详见 src/README.md。
 */
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import z from '@deepseek-ai/schemastery'
import { BUNDLED_SKILL_RANK, isSkillName } from '@deepseek-ai/dsh-skill'
import { parse as parseYaml } from 'yaml'
import { readResourceFile as readFileSync, listResourceDirectory as readdirSync } from './resources.ts'

/** 默认 web agent preset 挂载的 UMA 设计与交付技能。 */

/** 校验过的资源配置。 */
export const Config = z.object({
  assetRoot: z.string().min(1),
})

/** cordis 插件标识。 */
export const name = 'skill-uma'

/** 内建 provider 使用的注册表名。 */
export const inject = ['skills']

/** SKILL.md front matter 解析结果（类型从 parseFrontmatter 的返回结构推断）。 */
interface SkillFrontmatter {
  name: string
  description: string
  whenToUse?: string
  modelInvocable: boolean
  userInvocable: boolean
}

/** SKILL.md 全文拆分结果。 */
interface ParsedSkill {
  frontmatter: SkillFrontmatter
  body: string
}

/** 注册给 skills 注册表的候选条目。 */
interface SkillCandidate {
  name: string
  description: string
  whenToUse?: string
  invocation: { modelInvocable: boolean; userInvocable: boolean }
  provider: string
  source: string
  rank: typeof BUNDLED_SKILL_RANK
  resourceBase: { kind: string; description: string }
  locator: string
}

/** provider 的 get 返回体。 */
interface LoadedSkill extends Omit<SkillCandidate, 'rank' | 'locator'> {
  content: string
}

interface SkillProvider {
  name: string
  list: () => Promise<SkillCandidate[]>
  get: (candidate: SkillCandidate, options: { signal?: AbortSignal }) => Promise<LoadedSkill>
}

/** apply 所需的 ctx 最小形状（原始定义可能取自 cordis Context + dsh-skill 扩展）。 */
interface SkillContext {
  skills: {
    registerProvider: (factory: () => SkillProvider) => void
  }
}

/** 插件配置形状（Config 校验器的运行期推断结果）。 */
interface SkillConfig {
  assetRoot?: string
}

function strictBoolean(value: unknown, field: string, path: string): boolean | undefined {
  if (value === undefined) return undefined
  if (typeof value === 'boolean') return value
  throw new Error(`skill-uma: ${path} has a non-boolean ${field}`)
}

/** 解析 SKILL.md 的 YAML front matter；缺 name/description 直接拒绝。 */
function parseFrontmatter(raw: string, path: string): ParsedSkill {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (match?.[1] === undefined) throw new Error(`skill-uma: ${path} has no YAML frontmatter`)
  const metadata: unknown = parseYaml(match[1])
  if (typeof metadata !== 'object' || metadata === null) throw new Error(`skill-uma: ${path} has no metadata object`)
  const record = metadata as Record<string, unknown>
  const skillName = record.name
  const description = record.description
  if (typeof skillName !== 'string' || !isSkillName(skillName)) {
    throw new Error(`skill-uma: ${path} has an invalid skill name`)
  }
  if (typeof description !== 'string' || description.length === 0) {
    throw new Error(`skill-uma: ${path} has no description`)
  }
  const whenToUse = typeof record.whenToUse === 'string' && record.whenToUse.length > 0 ? record.whenToUse : undefined
  const modelInvocable = strictBoolean(record['disable-model-invocation'], 'disable-model-invocation', path) !== true
  const userInvocable = strictBoolean(record['user-invocable'], 'user-invocable', path) !== false
  return {
    frontmatter: { name: skillName, description, ...(whenToUse === undefined ? {} : { whenToUse }), modelInvocable, userInvocable },
    body: raw.slice(match[0].length).trim(),
  }
}

function candidateOf(directory: string, frontmatter: SkillFrontmatter): SkillCandidate {
  return {
    name: frontmatter.name,
    description: frontmatter.description,
    ...(frontmatter.whenToUse === undefined ? {} : { whenToUse: frontmatter.whenToUse }),
    invocation: { modelInvocable: frontmatter.modelInvocable, userInvocable: false },
    provider: 'dsh-uma',
    source: 'bundled',
    rank: BUNDLED_SKILL_RANK,
    resourceBase: {
      kind: 'opaque',
      description: `UMA-managed resources. Use uma_resource_read with skill "${frontmatter.name}" and the relative path named below; omit path to browse. These are references, not local file paths. Use the native design tools instead of installed Python scripts.`,
    },
    locator: join(directory, 'SKILL.md'),
  }
}

/**
 * 把 UMA 内置技能注册到 skill registry，资源通过容器读取而非磁盘路径。
 * @param ctx - 带 skill registry 的 Context。
 * @param config - 打包应用可选的外部 assets 目录。
 */
export function apply(ctx: SkillContext, config: SkillConfig = {}): void {
  const assetRoot = config.assetRoot ?? fileURLToPath(new URL('../assets/', import.meta.url))
  const candidates = readdirSync(assetRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort()
    .map((directoryName) => {
      const directory = join(assetRoot, directoryName)
      const locator = join(directory, 'SKILL.md')
      return candidateOf(directory, parseFrontmatter(readFileSync(locator, 'utf8'), locator).frontmatter)
    })
  const provider: SkillProvider = {
    name: 'dsh-uma',
    list: () => Promise.resolve(candidates),
    get: (candidate, options) => Promise.resolve().then(() => {
      options.signal?.throwIfAborted()
      const { rank: _rank, locator, ...summary } = candidate
      const { body } = parseFrontmatter(readFileSync(locator, 'utf8'), locator)
      return { ...summary, content: body }
    }),
  }
  ctx.skills.registerProvider(() => provider)
}
