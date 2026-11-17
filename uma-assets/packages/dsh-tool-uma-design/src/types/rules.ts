/**
 * 【逆向还原】由 `lib/rules-B-6_mXU8.js` 的 `//#region lib/types/rules.js` 反推，
 * 非 DeepSeek 原始源码。hash 命名模块与原名的映射见 src/README.md。
 *
 * 还原依据：esbuild bundle 保留的 region 边界 + 逐行等价的控制流。
 * 类型注解 / interface 从用法反推；逻辑、字符串、错误文本与 lib 逐字一致。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */
import Papa from 'papaparse'
import { listResourceDirectory, readResourceFile } from '@deepseek-ai/dsh-skill-uma/resources'
import { join } from 'node:path'

/** design_rule_search 的入参（limit 在调用方已解析）。 */
interface RuleRequest {
  domain: string
  stack?: string
  query: string
  limit: number
}

/** 一条 CSV 记录的全部字段。 */
interface RuleFields {
  [key: string]: string
}

/** 返回给调用方的完整规则记录。 */
interface RuleRecord {
  source: string
  row: number
  fields: RuleFields
  score: number
}

/** Native retrieval of complete design-rule records from the bundled CSV corpus. */
/** Bundled rule domains; stack records additionally require an explicit stack id. */
export const RULE_DOMAINS = [
  'ux',
  'web',
  'react',
  'style',
  'color',
  'typography',
  'chart',
  'motion',
  'product',
  'layout',
  'reasoning',
  'icons',
  'stack',
]

const FILES: Record<string, string> = {
  ux: 'ux-guidelines.csv',
  web: 'app-interface.csv',
  react: 'react-performance.csv',
  style: 'styles.csv',
  color: 'colors.csv',
  typography: 'typography.csv',
  chart: 'charts.csv',
  motion: 'motion.csv',
  product: 'products.csv',
  layout: 'landing.csv',
  reasoning: 'ui-reasoning.csv',
  icons: 'icons.csv',
}

const SUBJECT_FIELDS: Record<string, string> = {
  layout: 'Pattern Name',
  reasoning: 'UI_Category',
}

const TERMS: Record<string, string[]> = {
  '键盘': ['keyboard'],
  '焦点': ['focus'],
  '对比度': ['contrast'],
  '无障碍': ['accessibility'],
  '桌面': ['desktop'],
  '导航': ['navigation'],
  '侧栏': ['sidebar'],
  '表单': ['form'],
  '加载': ['loading'],
  '空状态': ['empty'],
  '错误': ['error'],
  '配色': ['color'],
  '字体': ['typography', 'font'],
  '动效': ['motion', 'animation'],
  '响应式': ['responsive'],
  '仪表盘': ['dashboard'],
  '后台': ['admin', 'dashboard'],
  '企业': ['enterprise'],
  '开发者': ['developer'],
  '数据': ['data'],
  '控制台': ['console'],
  '小程序': ['mobile'],
  '官网': ['marketing', 'landing'],
  '玻璃': ['glass'],
  '图表': ['chart'],
  '组件': ['component'],
  '性能': ['performance'],
  '作品集': ['portfolio'],
  '个人网站': ['portfolio'],
  '输入法': ['ime', 'composition'],
  '图标': ['icon'],
}

function words(text: string): string[] {
  return text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []
}

/**
 * Search local design rules with lexical BM25 ranking and Chinese query expansion.
 * @param root - Trusted installed directory containing the UI/UX CSV data.
 * @param request - Domain, explicit stack when needed, query and resolved result limit.
 * @returns Complete matched CSV records with source rows; no generated advice or compliance verdict.
 */
export function searchDesignRules(root: string, request: RuleRequest): RuleRecord[] {
  let file: string
  if (request.domain === 'stack') {
    const stacks = listResourceDirectory(join(root, 'stacks'), { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.csv')).map((entry) => entry.name.slice(0, -4))
    if (request.stack === void 0 || !stacks.includes(request.stack)) throw new Error(`design_rule_search: choose an available stack: ${stacks.join(', ')}`)
    file = `stacks/${request.stack}.csv`
  }
  else {
    if (request.stack !== void 0) throw new Error('design_rule_search: stack is accepted only for the stack domain')
    file = FILES[request.domain]
  }
  const parsed = Papa.parse<RuleFields>(readResourceFile(join(root, file), 'utf8'), {
    header: true,
    skipEmptyLines: 'greedy',
  })
  if (parsed.errors.length > 0) throw new Error(`design_rule_search: invalid CSV at ${file}: ${parsed.errors[0]?.message}`)
  const records = parsed.data.map((fields, index) => ({
    fields,
    row: index + 2,
    terms: words(Object.values(fields).join(' ')),
  })).filter((record) => record.fields['Status'] !== 'deprecated')
  const query = words(request.query)
  for (const [chinese, expansions] of Object.entries(TERMS)) if (request.query.includes(chinese)) query.push(...expansions)
  if (query.length === 0) throw new Error('design_rule_search: query must contain searchable words')
  const terms = [...new Set(query)]
  const subjectField = SUBJECT_FIELDS[request.domain]
  const averageLength = records.reduce((sum, record) => sum + record.terms.length, 0) / Math.max(records.length, 1)
  const frequencies = new Map<string, number>(terms.map((term) => [term, records.filter((record) => record.terms.includes(term)).length]))
  return records.map((record) => {
    let score = 0
    const subject = subjectField === void 0 ? [] : words(record.fields[subjectField] ?? '')
    for (const term of terms) {
      const count = record.terms.filter((word) => word === term).length
      if (count === 0) continue
      const frequency = frequencies.get(term) ?? 0
      const inverse = Math.log(1 + (records.length - frequency + .5) / (frequency + .5))
      score += inverse * (subject.includes(term) ? 2 : 1) * count * 2.2 / (count + 1.2 * (.25 + .75 * record.terms.length / Math.max(averageLength, 1)))
    }
    return {
      source: `uma-design-system/data/${file}`,
      row: record.row,
      fields: record.fields,
      score,
    }
  }).filter((record) => record.score > 0).sort((a, b) => b.score - a.score || a.row - b.row).slice(0, request.limit)
}
