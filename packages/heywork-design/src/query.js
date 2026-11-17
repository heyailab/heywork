/**
 * @heywork/design — query-class design tools.
 *
 * Rewritten from specs/tool-uma-design-core.md §3.x, not copied from
 * uma-assets/packages/dsh-tool-uma-design/src (nor its bundled lib).
 *
 * Every behavior below is traceable to §3.1 / §3.3 / §3.5 / §3.6 of that spec.
 * All frozen strings (tool names, `uma-*` container paths, the system prompt,
 * `tool-hey-design:` prefixes) are kept verbatim. Nothing is imported from
 * `@deepseek-ai/*` or `yaml`; capabilities arrive exclusively through `deps`.
 */

import { createHash } from 'node:crypto'
import { isAbsolute, join, resolve as pathResolve, sep as pathSep } from 'node:path'
import { assertDeps, DEFAULTS, IDENTITY } from './deps.js'

// ---------------------------------------------------------------------------
// Frozen constants (spec §1 / §2.2 / §3)
// ---------------------------------------------------------------------------

/** §2.3 / I:331 — byte-level fixed system prompt. */
const SYSTEM_PROMPT = {
  name: 'native-design-workflow',
  order: 112,
  text: '## Native UI design workflow\nFor UI work, call design_context before changing visuals; pass the actual monorepo target and selected design project when known. Use its project files and declared stack, then inspect existing components and rendered behavior. Missing DESIGN.md does not imply a new product. User-approved branding, existing project tokens and component libraries take precedence over bundled inspiration. Use design_asset_list/get only to fill a missing foundation; never replace a known brand or framework merely to fit a template. Bundled design and knowledge references are virtual resource identifiers, not filesystem paths. Read them through the design tools; do not locate installed source files with shell or filesystem tools. Describe the chosen style and decisions without quoting internal resource identifiers or installation locations. Author project-specific design documents and components; never copy complete internal reference files into user workspaces. User-owned project files remain ordinary deliverables. Use design_rule_search for concrete UX, typography, color, chart, motion and stack rules; rule hits are references, not visual acceptance. Classify the surface as persuade, operate, read or experience and load the matching hey-design-craft/taste guidance. When the user requests variants, produce the requested number with materially different layout, hierarchy and interaction while preserving approved brand constraints; implement only the selected direction. Implement production UI in the existing stack; single-file HTML is for explicitly requested prototypes. For new UI and redesign, apply the selected layout and component patterns; identify where they appear in the rendered page. Report visual acceptance separately from functional checks. Verify actual rendered UI and primary interactions at target sizes, including keyboard/focus, loading/empty/error, light/dark where supported and reduced motion. Static lint and model ratings do not prove visual acceptance. Record the target, design-context fingerprint, implementation revision, screenshots, tested flows and unresolved issues in the project REVIEW.md; changed source requires rechecking. Report unavailable visual checks explicitly. Do not start another agent runtime or copy third-party logos to satisfy a reference.',
}

const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u

// §3.1 — design_context inputs / frameworks
const CONTEXT_INPUTS = [
  'PRODUCT.md',
  'DESIGN.md',
  'DESIGN.json',
  'tokens.css',
  'components.json',
  'package.json',
  'design-system/MASTER.md',
]
const PROJECT_INPUTS = [
  'PROJECT.md',
  'DESIGN.md',
  'tokens.css',
  'manifest.json',
  'REVIEW.md',
]
const FRAMEWORKS = [
  'react', 'vue', 'next', 'nuxt', 'svelte', '@angular/core', 'electron',
  '@tauri-apps/api', 'react-native', 'tailwindcss', '@radix-ui/react-dialog',
  '@mui/material', 'antd',
]

// §3.3 — design_rule_search domains / file map / subject weighting / expansion
const RULE_DOMAINS = [
  'ux', 'web', 'react', 'style', 'color', 'typography', 'chart', 'motion',
  'product', 'layout', 'reasoning', 'icons', 'stack',
]
const RULE_FILES = {
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
const SUBJECT_FIELDS = { layout: 'Pattern Name', reasoning: 'UI_Category' }
const ZH_TERMS = {
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

// §3.6 — design_asset_get file sets / budgets
const SYSTEM_FILES = [
  'DESIGN.md', 'tokens.css', 'components.html', 'manifest.json',
  'tailwind-v4.css', 'USAGE.md',
]
const INCLUDE_FILES = {
  design: 'DESIGN.md',
  tokens: 'tokens.css',
  components: 'components.html',
  manifest: 'manifest.json',
}
const INCLUDES = Object.keys(INCLUDE_FILES)
const MAX_FILE_BYTES = 32768
const MAX_TOTAL_BYTES = 98304

// ---------------------------------------------------------------------------
// Small shared helpers
// ---------------------------------------------------------------------------

/** §3.1 — '.' normalises to ''; every other form must be a clean relative dir. */
function relativeDirectory(value) {
  if (value === '.') return ''
  if (
    value.length === 0 || value.includes('\\') || value.includes('\0')
    || value.startsWith('/') || value.includes(':')
    || value.split('/').some((part) => part === '.' || part === '..' || part === '')
  ) {
    throw new Error('design_context: target must be a relative directory without parent segments')
  }
  return value
}

/** §3.1 — declared stack from a read package.json. */
function stackFrom(text) {
  const parsed = JSON.parse(text)
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error('design_context: package.json must contain an object')
  }
  const names = new Set()
  for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
    const deps = parsed[key]
    if (deps === undefined) continue
    if (typeof deps !== 'object' || deps === null || Array.isArray(deps)) {
      throw new Error(`design_context: package.json ${key} must contain an object`)
    }
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version !== 'string') {
        throw new Error(`design_context: package.json dependency ${name} must have a string version`)
      }
      names.add(name)
    }
  }
  return FRAMEWORKS.filter((name) => names.has(name))
}

/**
 * Normalise the injected fs into one internal interface.
 * Production injects the dsh-fs handle API (resolve/lstat/contains/readBytes/stat);
 * lightweight hosts may inject plain node:fs, which is adapted here. External
 * design_context behavior is identical for both.
 */
function makeFsOps(fs) {
  if (
    fs && typeof fs.resolve === 'function' && typeof fs.lstat === 'function'
    && typeof fs.contains === 'function' && typeof fs.readBytes === 'function'
  ) {
    return {
      resolve: (p, cwd, signal) => fs.resolve(p, { cwd, signal }),
      lstat: (p, cwd, signal) => fs.lstat(p, { cwd }, signal),
      contains: (root, target) => fs.contains(root, target),
      readBytes: (handle, signal, max) => fs.readBytes(handle, signal, max),
      stat: (handle, signal) => fs.stat(handle, signal),
    }
  }
  const io = (fs && fs.promises) || fs
  return {
    resolve: async (p, cwd) => pathResolve(cwd, p),
    lstat: async (p, cwd) => {
      let st
      try {
        st = await io.lstat(pathResolve(cwd, p))
      } catch (err) {
        if (err?.code === 'ENOENT' || err?.code === 'ENOTDIR') return undefined
        throw err
      }
      return {
        type: st.isFile() ? 'file' : st.isDirectory() ? 'directory' : 'other',
        size: st.size,
        version: st.mtimeMs,
      }
    },
    contains: (root, target) => target === root || target.startsWith(root + pathSep),
    readBytes: async (target, signal, max) => {
      signal?.throwIfAborted?.()
      const buf = await io.readFile(target)
      return buf.subarray(0, max)
    },
    stat: async (target) => ({ version: (await io.stat(target)).mtimeMs }),
  }
}

/** §3.1 — read bounded design inputs from the execution directory (read-only). */
async function readDesignContext(ctx, exec, request, limits) {
  if (exec.agent === undefined) throw new Error('design_context requires an agent Session')
  const target = relativeDirectory(request.target ?? '.')
  if (request.project !== undefined && !KEBAB.test(request.project)) {
    throw new Error('design_context: project must be kebab-case')
  }
  if (request.page !== undefined && (request.project === undefined || !KEBAB.test(request.page))) {
    throw new Error('design_context: page requires an explicit project and a kebab-case page id')
  }

  const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal)
  const root = await ctx.fsOps.resolve('.', cwd, exec.signal)
  const paths = [...CONTEXT_INPUTS]
  if (target !== '') paths.push(...CONTEXT_INPUTS.map((name) => `${target}/${name}`))
  if (request.project !== undefined) {
    paths.push(...PROJECT_INPUTS.map((name) => `.design/${request.project}/${name}`))
    paths.push(`design-system/${request.project}/MASTER.md`)
    if (request.page !== undefined) {
      paths.push(`design-system/${request.project}/pages/${request.page}.md`)
    }
  }

  const files = []
  let remaining = limits.totalBytes
  for (const path of paths) {
    exec.signal.throwIfAborted()
    const parents = path.split('/').slice(0, -1)
    for (let depth = 1; depth <= parents.length; depth++) {
      const parentPath = parents.slice(0, depth).join('/')
      const parent = await ctx.fsOps.lstat(parentPath, cwd, exec.signal)
      if (parent !== undefined && parent.type !== 'directory') {
        throw new Error(`design_context: expected a regular directory at ${parentPath}`)
      }
    }
    const info = await ctx.fsOps.lstat(path, cwd, exec.signal)
    const base = { path, content: '', sha256: '' }
    if (info === undefined) {
      files.push({ ...base, state: 'missing' })
      continue
    }
    if (info.type !== 'file') {
      files.push({ ...base, state: 'non-file' })
      continue
    }
    if (info.size !== undefined && info.size > limits.fileBytes) {
      files.push({ ...base, state: 'oversized' })
      continue
    }
    if (remaining === 0 || (info.size !== undefined && info.size > remaining)) {
      files.push({ ...base, state: 'budget-exceeded' })
      continue
    }
    const resolved = await ctx.fsOps.resolve(path, cwd, exec.signal)
    if (!ctx.fsOps.contains(root, resolved)) {
      throw new Error(`design_context: path leaves the execution directory: ${path}`)
    }
    const bytes = await ctx.fsOps.readBytes(resolved, exec.signal, Math.min(limits.fileBytes, remaining))
    const content = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    if (content.includes('\0')) throw new Error(`design_context: expected UTF-8 text at ${path}`)
    if ((await ctx.fsOps.stat(resolved, exec.signal))?.version !== info.version) {
      throw new Error(`design_context: ${path} changed while reading; inspect again`)
    }
    remaining -= bytes.byteLength
    files.push({
      path,
      state: 'read',
      content,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    })
  }

  const declaredStack = [...new Set(files
    .filter((file) => file.path.endsWith('package.json') && file.state === 'read')
    .flatMap((file) => stackFrom(file.content)))]
  return {
    target: target || '.',
    project: request.project ?? '',
    files,
    declaredStack,
    hasDesign: files.some((file) => /(?:^|\/)(?:DESIGN|MASTER)\.md$/u.test(file.path)
      && file.state === 'read' && file.content.trim().length > 0),
    complete: files.every((file) => file.state === 'read' || file.state === 'missing'),
    fingerprint: createHash('sha256').update(JSON.stringify(files.map((file) => [
      file.path, file.state, file.sha256,
    ]))).digest('hex'),
  }
}

/** §3.6 — keep a valid UTF-8 prefix when a read is cut mid-code-point. */
function utf8Prefix(bytes) {
  return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes, { stream: true })
}

/** Minimal RFC-4180 CSV reader: header objects + first-error reporting. */
function parseCsv(text) {
  const errors = []
  const rows = []
  let row = []
  let field = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++ } else quoted = false
      } else field += ch
      continue
    }
    if (ch === '"') quoted = true
    else if (ch === ',') { row.push(field); field = '' }
    else if (ch === '\n') { row.push(field); rows.push(row); row = []; field = '' }
    else if (ch === '\r') {
      if (text[i + 1] === '\n') i++
      row.push(field); rows.push(row); row = []; field = ''
    } else field += ch
  }
  if (quoted) errors.push({ message: 'Quoted field unterminated' })
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row) }
  const kept = rows.filter((cells) => cells.some((cell) => cell.trim() !== ''))
  if (kept.length === 0) return { data: [], errors }
  const header = kept[0]
  const data = kept.slice(1).map((cells) => {
    const record = {}
    header.forEach((key, index) => { record[key] = cells[index] ?? '' })
    return record
  })
  return { data, errors }
}

const words = (text) => text.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []

/** §3.3 — lexical BM25 search with Chinese expansion (read-only). */
function searchDesignRules(resources, root, request) {
  let file
  if (request.domain === 'stack') {
    const stacks = resources.listResourceDirectory(join(root, 'stacks'), { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.endsWith('.csv'))
      .map((entry) => entry.name.slice(0, -4))
    if (request.stack === undefined || !stacks.includes(request.stack)) {
      throw new Error(`design_rule_search: choose an available stack: ${stacks.join(', ')}`)
    }
    file = `stacks/${request.stack}.csv`
  } else {
    if (request.stack !== undefined) throw new Error('design_rule_search: stack is accepted only for the stack domain')
    file = RULE_FILES[request.domain]
  }

  const parsed = parseCsv(resources.readResourceFile(join(root, file), 'utf8'))
  if (parsed.errors.length > 0) {
    throw new Error(`design_rule_search: invalid CSV at ${file}: ${parsed.errors[0]?.message}`)
  }
  const records = parsed.data.map((fields, index) => ({
    fields,
    row: index + 2,
    terms: words(Object.values(fields).join(' ')),
  })).filter((record) => record.fields['Status'] !== 'deprecated')

  const query = words(request.query)
  for (const [chinese, expansions] of Object.entries(ZH_TERMS)) {
    if (request.query.includes(chinese)) query.push(...expansions)
  }
  if (query.length === 0) throw new Error('design_rule_search: query must contain searchable words')
  const terms = [...new Set(query)]
  const subjectField = SUBJECT_FIELDS[request.domain]
  const averageLength = records.reduce((sum, record) => sum + record.terms.length, 0) / Math.max(records.length, 1)
  const frequencies = new Map(terms.map((term) => [
    term, records.filter((record) => record.terms.includes(term)).length,
  ]))

  return records.map((record) => {
    let score = 0
    const subject = subjectField === undefined ? [] : words(record.fields[subjectField] ?? '')
    for (const term of terms) {
      const count = record.terms.filter((word) => word === term).length
      if (count === 0) continue
      const frequency = frequencies.get(term) ?? 0
      const inverse = Math.log(1 + (records.length - frequency + 0.5) / (frequency + 0.5))
      score += inverse * (subject.includes(term) ? 2 : 1) * count * 2.2
        / (count + 1.2 * (0.25 + 0.75 * record.terms.length / Math.max(averageLength, 1)))
    }
    return {
      source: `uma-design-system/data/${file}`,
      row: record.row,
      fields: record.fields,
      score,
    }
  }).filter((record) => record.score > 0)
    .sort((a, b) => b.score - a.score || a.row - b.row)
    .slice(0, request.limit)
}

/** §2.3 / §3.5 — build the read-only manifest summary of each system. */
function buildSystemCatalog(resources, systemsRoot, systems) {
  return systems.map((name) => {
    const path = join(systemsRoot, name, 'manifest.json')
    if (!resources.resourceExists(path)) throw new Error(`Missing design manifest: ${name}`)
    const raw = JSON.parse(resources.readResourceFile(path, 'utf8'))
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      throw new Error(`Invalid design manifest: ${name}`)
    }
    const category = typeof raw.category === 'string' ? raw.category : ''
    const description = typeof raw.description === 'string' ? raw.description : ''
    const displayName = typeof raw.name === 'string' ? raw.name : name
    const aliases = Array.isArray(raw.aliases) ? raw.aliases.filter((item) => typeof item === 'string') : []
    return {
      name,
      displayName,
      category,
      description: description.length > 0 ? description : displayName,
      aliases,
    }
  })
}

/** §3.6 — bounded, UTF-8-safe asset text read. */
function readBounded(resources, path, limit) {
  const buffer = resources.readResourceFile(path)
  const truncated = buffer.byteLength > limit
  return {
    content: truncated
      ? utf8Prefix(buffer.subarray(0, limit))
      : new TextDecoder('utf-8', { fatal: true }).decode(buffer),
    truncated,
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

/**
 * Register the four query-class design tools (spec §3.1 / §3.3 / §3.5 / §3.6).
 *
 * @param {object} deps   injected services: defineTool, tools, fs, workingDirectory,
 *                        resources, systemPrompt (see deps.js @typedef).
 * @param {object} config validated config subset (defaults from deps.js DEFAULTS).
 * @param {object} roots  apply-computed read-only directories:
 *                        { assetRoot, systemsRoot, referencesRoot, systems,
 *                          references, knowledge }.
 */
export function registerQueryTools(deps, config = {}, roots = {}) {
  assertDeps(deps, ['defineTool', 'tools', 'resources'])

  // Frozen §2.3 startup error prefix, preserved verbatim (apply normally owns
  // this check; roots.assetRoot is the already-resolved value it would have used).
  const { assetRoot, systemsRoot, referencesRoot, systems = [], references = [] } = roots
  if (assetRoot !== undefined && !isAbsolute(assetRoot)) {
    throw new Error('tool-hey-design: assetRoot must be an absolute directory')
  }

  const { defineTool, tools, resources } = deps
  const catalog = buildSystemCatalog(resources, systemsRoot, systems)
  const catalogMaxPageSize = config.catalogMaxPageSize ?? DEFAULTS.catalogMaxPageSize
  const ruleMaxResults = config.ruleMaxResults ?? DEFAULTS.ruleMaxResults
  const contextLimits = {
    fileBytes: config.contextFileBytes ?? DEFAULTS.contextFileBytes,
    totalBytes: config.contextTotalBytes ?? DEFAULTS.contextTotalBytes,
  }
  const fsOps = deps.fs ? makeFsOps(deps.fs) : undefined

  if (deps.systemPrompt?.section) deps.systemPrompt.section({ ...SYSTEM_PROMPT })

  // ---- §3.1 design_context -------------------------------------------------
  tools.register(defineTool({
    name: 'design_context',
    description: 'Read bounded existing design inputs and declared frontend dependencies from the current execution directory before UI work. Optional target scopes a monorepo surface; optional project reads `.design/<project>`. Returns exact contents/hashes and explicit omissions, never a visual-quality pass. Does not write files or execute project code.',
    parameters: {
      target: {
        type: 'string',
        description: 'Optional relative UI package directory, for example apps/web. Defaults to the execution directory.',
      },
      project: {
        type: 'string',
        description: 'Optional existing kebab-case project id under .design/ or design-system/.',
      },
      page: {
        type: 'string',
        description: 'Optional explicit page id under design-system/<project>/pages/. Requires project.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      return JSON.stringify(await readDesignContext({
        fsOps,
        workingDirectory: deps.workingDirectory,
      }, exec, args, contextLimits))
    },
    presentCall: (args) => ({
      card: 'generic',
      title: 'Read project design context',
      kind: 'search',
      rawInput: args,
    }),
  }))

  // ---- §3.3 design_rule_search ---------------------------------------------
  const rulesRoot = join(assetRoot, 'uma-design-system/data')
  tools.register(defineTool({
    name: 'design_rule_search',
    description: 'Search bundled UI/UX rule CSV records natively with BM25 ranking and Chinese query expansion. Returns complete matched fields including do/dont, code samples and source rows. Select a domain or a named stack. This is reference retrieval, not current documentation verification, installed-component evidence or visual acceptance.',
    parameters: {
      query: {
        type: 'string',
        required: true,
        description: 'Concrete UI problem in English or Chinese, such as keyboard focus or 键盘焦点.',
      },
      domain: { type: 'string', required: true, enum: [...RULE_DOMAINS] },
      stack: {
        type: 'string',
        description: 'Explicit stack id such as react, vue, nextjs or shadcn; only for the stack domain. An invalid id returns available ids.',
      },
      limit: {
        type: 'integer',
        description: 'Maximum matched records; defaults to 3 and is bounded by ruleMaxResults.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    execute(args) {
      const limit = Math.min(Math.max(args.limit ?? 3, 1), ruleMaxResults)
      return Promise.resolve(JSON.stringify(searchDesignRules(resources, rulesRoot, { ...args, limit })))
    },
    presentCall: (args) => ({
      card: 'generic',
      title: 'Search design rules',
      kind: 'search',
      rawInput: args,
    }),
  }))

  // ---- §3.5 design_asset_list ----------------------------------------------
  tools.register(defineTool({
    name: 'design_asset_list',
    description: 'List the bundled production design systems and DESIGN.md references available for UI work. Inspect design_context first. Search by brand or category, or page with offset and limit to inspect large catalogs. Use this catalog only to fill a missing foundation or support an explicitly requested redesign.',
    parameters: {
      query: { type: 'string', description: 'Optional brand, alias, category or purpose search.' },
      category: { type: 'string', description: 'Optional exact catalog category.' },
      offset: {
        type: 'integer',
        description: 'Zero-based offset within matched systems; defaults to zero.',
      },
      limit: {
        type: 'integer',
        description: 'Optional page size, bounded by catalogMaxPageSize. Omit for every matching system.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          systems: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                name: { type: 'string', required: true },
                category: { type: 'string', required: true },
                description: { type: 'string', required: true },
              },
            },
          },
          references: { type: 'array', required: true, items: { type: 'string' } },
          total: { type: 'integer', required: true },
          catalogSize: { type: 'integer', required: true },
          offset: { type: 'integer', required: true },
          nextOffset: { type: 'integer' },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: [
          'Design systems:',
          ...value.systems.map((system) => `- ${system.name}${system.category.length === 0 ? '' : ` (${system.category})`}: ${system.description}`),
          `DESIGN.md references: ${value.references.join(', ')}`,
          `Catalog total: ${String(value.total)}; offset: ${String(value.offset)}; next offset: ${value.nextOffset === undefined ? 'none' : String(value.nextOffset)}`,
          `Installed design systems: ${String(value.catalogSize)}`,
          ...(value.total === 0 && value.catalogSize > 0
            ? ['No systems matched. Shorten the query or omit filters to browse the installed catalog.']
            : []),
        ].join('\n'),
      }],
    },
    execute(args) {
      const offset = args.offset ?? 0
      const limit = args.limit
      if (!Number.isSafeInteger(offset) || offset < 0) {
        throw new Error('design_asset_list: offset must be a nonnegative integer')
      }
      if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1 || limit > catalogMaxPageSize)) {
        throw new Error('design_asset_list: limit must be a positive integer within catalogMaxPageSize')
      }
      const normalise = (value) => value.normalize('NFKC').toLocaleLowerCase('en-US').replace(/[^\p{Letter}\p{Number}]/gu, '')
      const query = normalise(args.query ?? '')
      const terms = [...new Set((args.query ?? '').split(/\s+/u).map(normalise).filter(Boolean))]
      const matches = catalog.map((system) => {
        const identities = [system.name, system.displayName, ...system.aliases].map(normalise)
        const fields = [...identities, normalise(system.category), normalise(system.description)]
        const exact = fields.some((value) => value.includes(query))
        return {
          system,
          score: query !== '' && identities.includes(query)
            ? terms.length + 2
            : exact ? terms.length + 1
              : terms.filter((term) => fields.some((value) => value.includes(term))).length,
        }
      }).filter(({ system, score }) => (args.category === undefined || system.category === args.category) && score > 0)
        .sort((left, right) => right.score - left.score)
        .map(({ system }) => system)

      const page = matches.slice(offset, limit === undefined ? undefined : offset + limit)
      const nextOffset = offset + page.length < matches.length ? offset + page.length : undefined
      return Promise.resolve({
        systems: page.map(({ name, category, description }) => ({ name, category, description })),
        references,
        total: matches.length,
        catalogSize: catalog.length,
        offset,
        ...(nextOffset === undefined ? {} : { nextOffset }),
      })
    },
    presentCall: () => ({
      card: 'generic',
      title: 'List design assets',
      kind: 'other',
    }),
  }))

  // ---- §3.6 design_asset_get -----------------------------------------------
  tools.register(defineTool({
    name: 'design_asset_get',
    description: 'Read a bundled design system or DESIGN.md reference. Returns DESIGN.md, tokens.css, and optional component markup. Use the tokens as the source of truth and do not mix two systems in one product. Returned paths are virtual resource identifiers; retrieve more content with this tool rather than filesystem reads.',
    parameters: {
      kind: {
        type: 'string',
        required: true,
        enum: ['system', 'reference'],
        description: 'system for a complete design system; reference for a DESIGN.md library entry.',
      },
      name: { type: 'string', required: true, description: 'An exact name from design_asset_list.' },
      include: {
        type: 'array',
        items: { type: 'string', enum: [...INCLUDES] },
        description: 'Files to return. Defaults to design and tokens for a system, design for a reference.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          kind: { type: 'string', required: true, enum: ['system', 'reference'] },
          name: { type: 'string', required: true },
          files: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                name: { type: 'string', required: true },
                path: { type: 'string', required: true },
                content: { type: 'string', required: true },
                truncated: { type: 'boolean', required: true },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        if (value.files.length === 0) {
          return [{ type: 'text', text: `No readable files for ${value.kind} ${value.name}.` }]
        }
        return value.files.map((file) => ({
          type: 'text',
          text: `## ${file.path}\n\n${file.content}${file.truncated ? '\n\n[truncated at the read limit]' : ''}`,
        }))
      },
      presentationMeta: (_args, value) => {
        const title = config.assetRoot === undefined && value.kind === 'system' && value.files.length > 0
          ? catalog.find((system) => system.name === value.name)?.displayName
          : undefined
        return title === undefined ? null : {
          kind: 'hey-public-design-reference',
          version: 1,
          title,
          hasDesign: value.files.some((file) => file.name === 'DESIGN.md' && file.content.length > 0),
          hasTokens: value.files.some((file) => file.name === 'tokens.css' && file.content.length > 0),
          hasComponents: value.files.some((file) => file.name === 'components.html' && file.content.length > 0),
          partial: value.files.some((file) => file.truncated),
        }
      },
    },
    execute(args) {
      const list = args.kind === 'system' ? systems : references
      if (!list.includes(args.name)) {
        throw new Error(`unknown ${args.kind} ${JSON.stringify(args.name)}; call design_asset_list for valid names`)
      }
      const root = args.kind === 'system' ? systemsRoot : referencesRoot
      const wanted = args.include ?? (args.kind === 'system' ? ['design', 'tokens'] : ['design'])
      const files = []
      let remaining = MAX_TOTAL_BYTES
      for (const include of wanted) {
        const fileName = INCLUDE_FILES[include]
        if (args.kind === 'reference' && fileName !== 'DESIGN.md') continue
        const path = join(root, args.name, fileName)
        if (!SYSTEM_FILES.includes(fileName) || !resources.resourceExists(path)) continue
        const reference = `hey-design://${args.kind === 'system' ? 'systems' : 'brands'}/${encodeURIComponent(args.name)}/${fileName}`
        const overhead = Buffer.byteLength(`## ${reference}\n\n\n\n[truncated at the read limit]`)
        if (remaining <= overhead) break
        let document
        try {
          document = readBounded(resources, path, Math.min(MAX_FILE_BYTES, remaining - overhead))
        } catch (error) {
          if (!(error instanceof Error)) throw error
          throw new Error(`Unable to read ${reference}. Verify the installed design assets and retry.`)
        }
        const { content, truncated } = document
        remaining -= Buffer.byteLength(`## ${reference}\n\n${content}${truncated ? '\n\n[truncated at the read limit]' : ''}`)
        files.push({ name: fileName, path: reference, content, truncated })
        if (remaining <= 0) break
      }
      return Promise.resolve({ kind: args.kind, name: args.name, files })
    },
    presentCall: (args) => ({
      card: 'generic',
      title: `Read design asset: ${args.name}`,
      kind: 'other',
      rawInput: args,
    }),
  }))

  return { name: IDENTITY.pluginName, registered: ['design_context', 'design_rule_search', 'design_asset_list', 'design_asset_get'] }
}
