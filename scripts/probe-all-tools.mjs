/**
 * 全量集成验证：用统一 mock 跑所有自研包的 apply()，统计能注册的工具。
 *
 * 这是 P3 完成标志的一部分——证明各包能共存、工具名无冲突。
 * 不依赖 pnpm / @deepseek-ai/*，只用注入式 mock。
 *
 * Usage: node --experimental-sqlite scripts/probe-all-tools.mjs
 */
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const R = await import(new URL('../packages/heywork-skill/src/resources.js', import.meta.url).href)

const parseYaml = (s) => Object.fromEntries(
  s.split('\n').filter(l => l.includes(':')).map(l => {
    const i = l.indexOf(':')
    return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
  }),
)
const isSkillName = (s) => /^[a-z][a-z0-9-]*$/u.test(s)

const PACKAGES = ['heywork-design', 'heywork-workflow', 'heywork-coding', 'heywork-wiki']
let all = []

for (const p of PACKAGES) {
  const M = await import(new URL(`../packages/${p}/src/index.js`, import.meta.url).href)
  const tools = []
  const deps = {
    defineTool: d => d,
    tools: { register: d => tools.push(d) },
    resources: R,
    fs: null,
    get: () => undefined,
    workingDirectory: { ensure: async () => {} },
    systemPrompt: { section: () => {} },
    waterfall: (_e, _t, exec) => exec(),
    parseYaml,
    isSkillName,
  }
  M.apply(deps, {
    assetRoot: resolve(ROOT, 'uma-assets/packages/dsh-skill-uma/assets'),
    deps,
  })
  console.log(`${p.padEnd(22)} ${String(tools.length).padStart(2)} 工具  ${tools.map(t => t.name).slice(0, 3).join(', ')}...`)
  all.push(...tools.map(t => t.name))
}

const unique = new Set(all)
console.log(`\ndefineTool 工具: ${all.length}，唯一: ${unique.size}`)
if (all.length !== unique.size) {
  console.error('有重名工具！')
  process.exit(1)
}
if (all.length !== 32) {
  console.error(`期望 32 个 defineTool 工具，实际 ${all.length}`)
  process.exit(1)
}
console.log('probe-all-tools: OK — 4 包共存，32 个工具无冲突')
