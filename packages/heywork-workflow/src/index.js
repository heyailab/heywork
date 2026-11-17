/**
 * @heywork/workflow — plugin entry and the three delivery-workflow tools.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-tool-uma-workflow/src/.
 * Every frozen value, error string, file template, render line and return shape
 * below is traceable to specs/workflow.md §1–§5; the gate helpers follow
 * specs/delivery.md §1.4, §9, §11, §13 as referenced by workflow.md §5.2.
 * Upstream @deepseek-ai/* utilities are injected through `deps`; this module
 * imports none of them.
 */

import { DEFAULTS, IDENTITY, assertDeps } from './deps.js'

// --- frozen values (spec §1 / §5.2) ----------------------------------------
const ARTIFACTS = Object.freeze([
  'research', 'prd', 'architecture', 'uiux', 'spec', 'preview', 'qa', 'delivery',
])
// `preview` is legal for enumeration/sorting but never required (delivery.md §1.2).
const REQUIRED_ARTIFACTS = Object.freeze([
  'research', 'prd', 'architecture', 'uiux', 'spec', 'qa', 'delivery',
])
const STATUSES = Object.freeze(['draft', 'approved'])
const DEPTHS = Object.freeze(['patch', 'feature', 'product'])
const PHASES = Object.freeze(['documents', 'delivery'])

// section patterns: key order is ARTIFACTS order; pattern.source is frozen output
// (specs/delivery.md §1.4).
const REQUIRED_SECTIONS = Object.freeze({
  research: ['finding|发现', 'open question|待定|未决'].map((s) => new RegExp(s, 'i')),
  prd: ['goal|目标', 'acceptance|验收'].map((s) => new RegExp(s, 'i')),
  architecture: ['component|组件|模块', 'data|数据', 'api|接口'].map((s) => new RegExp(s, 'i')),
  uiux: ['token|令牌|变量', 'state|状态', 'responsive|响应'].map((s) => new RegExp(s, 'i')),
  spec: ['task|任务', 'acceptance|验收'].map((s) => new RegExp(s, 'i')),
  preview: ['preview|预览'].map((s) => new RegExp(s, 'i')),
  qa: ['gate|门禁|result|结果'].map((s) => new RegExp(s, 'i')),
  delivery: ['deliver|交付'].map((s) => new RegExp(s, 'i')),
})

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u
const STATUS_RE = /^status:\s*(draft|approved)\s*$/mu
const OWNER_RE = /^owner:\s*(\S+)\s*$/mu
const UPDATED_RE = /^updated:\s*(\S+)\s*$/mu
const PLACEHOLDER_RE = /\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum/giu
const MD_SUFFIX_RE = /\.md$/u

// --- local helpers (behavior stated by the spec; no upstream imports) ------
const isFsCode = (error, code) => Boolean(error) && error.code === code

function splitFrontmatter(content) {
  const match = FRONTMATTER_RE.exec(content)
  if (match === null) return { frontmatter: '', body: content }
  return { frontmatter: match[1] ?? '', body: content.slice(match[0].length) }
}

function placeholdersIn(body) {
  return [...new Set([...body.matchAll(PLACEHOLDER_RE)].map((m) => m[0].toUpperCase()))]
}

/** Delivery spec §9 — evaluates a full artifact text (with or without frontmatter). */
function evaluateArtifact(artifact, content) {
  const { frontmatter, body } = splitFrontmatter(content)
  const status = STATUS_RE.exec(frontmatter)?.[1] ?? 'unknown'
  const owner = OWNER_RE.exec(frontmatter)?.[1] ?? null
  const updated = UPDATED_RE.exec(frontmatter)?.[1] ?? null
  // Unknown artifact: REQUIRED_SECTIONS[artifact] is undefined and .filter throws
  // a native TypeError, as specified — do not wrap.
  const missingSections = REQUIRED_SECTIONS[artifact]
    .filter((pattern) => !pattern.test(body))
    .map((pattern) => pattern.source)
  const placeholders = placeholdersIn(body)
  return {
    status, owner, updated, body, missingSections, placeholders,
    ready: missingSections.length === 0 && placeholders.length === 0,
  }
}

/** Delivery spec §13 — required artifacts for a (depth, phase) checkpoint. */
function requiredArtifacts(depth, phase) {
  if (depth === 'patch') return []
  if (depth === 'feature') {
    return phase === 'documents' ? ['spec'] : ['spec', 'qa', 'delivery']
  }
  return phase === 'documents'
    ? ['research', 'prd', 'architecture', 'uiux']
    : [...REQUIRED_ARTIFACTS]
}

/** Delivery spec §11 — non-required (incl. preview) artifacts never block. */
function evaluateCheckpoint(artifacts, depth, phase) {
  const required = requiredArtifacts(depth, phase)
  const relevant = artifacts.filter((entry) => required.includes(entry.artifact))
  const missing = required.filter((name) => !relevant.some((entry) => entry.artifact === name))
  const blocked = [...missing, ...relevant.filter((entry) => !entry.ready).map((entry) => entry.artifact)]
  return { ready: blocked.length === 0, missing, blocked }
}

/** workflow.md §3 — frontmatter four fields, in frozen order, then trimmed body + \n. */
function compose(artifact, status, owner, content) {
  return [
    '---',
    `artifact: ${artifact}`,
    `status: ${status}`,
    `owner: ${owner}`,
    `updated: ${new Date().toISOString()}`,
    '---',
    '',
    `${content.trim()}\n`,
  ].join('\n')
}

function artifactRelativePath(artifact) {
  return `${IDENTITY.artifactDir}/${artifact}.md`
}

function sortByArtifactOrder(artifacts) {
  return [...artifacts].sort((a, b) => ARTIFACTS.indexOf(a.artifact) - ARTIFACTS.indexOf(b.artifact))
}

// --- tool registration -----------------------------------------------------
function registerWorkflowTools(deps) {
  const { defineTool, tools, fs, workingDirectory } = deps
  const waterfall = deps.waterfall ?? (async (_event, _target, _exec, fallback) => fallback())
  const get = deps.get ?? (() => undefined)
  const ToolContextUnavailableError = deps.ToolContextUnavailableError
    ?? class ToolContextUnavailableError extends Error {}

  const artifactParam = {
    type: 'string', required: true, enum: [...ARTIFACTS],
    description: 'Artifact kind: one of research, prd, architecture, uiux, spec, preview, qa, delivery.',
  }
  const execFor = (exec, message) => {
    if (exec?.agent === undefined) throw new Error(message)
  }
  const resolveTarget = async (relative, exec) => {
    const cwd = await workingDirectory.ensure(exec.agent, exec.signal)
    return fs.resolve(relative, { cwd, signal: exec.signal })
  }

  // §3 — hey_artifact_write -------------------------------------------------
  tools.register(defineTool({
    name: IDENTITY.toolNames.write,
    description: 'Write a delivery artifact under `.hey/` with artifact/status/owner/updated frontmatter. Rejects empty content and reports section and placeholder checks against the raw body.',
    parameters: {
      artifact: artifactParam,
      content: { type: 'string', required: true, description: 'Markdown body without frontmatter; must be non-empty after trimming.' },
      status: { type: 'string', enum: [...STATUSES], description: 'Draft or approved. Defaults to draft.' },
      owner: { type: 'string', description: 'Artifact owner. Defaults to hey-team.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          artifact: { type: 'string', required: true, enum: [...ARTIFACTS] },
          status: { type: 'string', required: true, enum: [...STATUSES] },
          bytes: { type: 'integer', required: true },
          missingSections: { type: 'array', required: true, items: { type: 'string' } },
          placeholders: { type: 'array', required: true, items: { type: 'string' } },
          ready: { type: 'boolean', required: true },
        },
      },
      render: (_args, value) => [{
        type: 'text',
        text: [
          `Wrote ${value.path} (${value.bytes} bytes, ${value.status}).`,
          value.missingSections.length === 0
            ? 'Required sections present.'
            : `Missing section checks: ${value.missingSections.join(', ')}.`,
          value.placeholders.length === 0
            ? 'No placeholder markers.'
            : `Placeholders to resolve: ${value.placeholders.join(', ')}.`,
        ].join('\n'),
      }],
    },
    async execute(args, exec) {
      execFor(exec, 'hey_artifact_write requires an agent Session')
      if (args.content.trim().length === 0) {
        throw new Error('hey_artifact_write requires non-empty content')
      }
      const policy = get('sandboxPolicy')
      if (fs.sandboxMode !== undefined && policy === undefined) {
        throw new ToolContextUnavailableError('Artifact writes require the mounted filesystem’s sandbox policy service')
      }
      const sandbox = policy?.resolve?.({ session: exec.agent.session })

      const status = args.status ?? DEFAULTS.status
      const owner = args.owner ?? DEFAULTS.owner
      const target = await resolveTarget(artifactRelativePath(args.artifact), exec)
      const intent = await waterfall('fs/write-intent', target, exec, () => void 0)
      const composed = compose(args.artifact, status, owner, args.content)
      // Native errors from ensure / resolve / waterfall / writeText propagate.
      await fs.writeText(target, composed, intent, exec.signal, sandbox)

      const evaluation = evaluateArtifact(args.artifact, args.content)
      return {
        path: target.displayPath,
        artifact: args.artifact,
        status,
        bytes: Buffer.byteLength(composed, 'utf8'),
        missingSections: evaluation.missingSections,
        placeholders: evaluation.placeholders,
        ready: evaluation.ready,
      }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: `Write ${artifactRelativePath(args.artifact)}`,
      kind: 'other',
      rawInput: args,
    }),
  }))

  // §4 — hey_artifact_read --------------------------------------------------
  tools.register(defineTool({
    name: IDENTITY.toolNames.read,
    description: 'Read a delivery artifact from `.hey/<artifact>.md` and return its full text, including frontmatter, unchanged.',
    parameters: { artifact: artifactParam },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', required: true },
          artifact: { type: 'string', required: true, enum: [...ARTIFACTS] },
          content: { type: 'string', required: true },
        },
      },
      render: (_args, value) => [{ type: 'text', text: value.content }],
    },
    async execute(args, exec) {
      execFor(exec, 'hey_artifact_read requires an agent Session')
      const target = await resolveTarget(artifactRelativePath(args.artifact), exec)
      const content = await fs.readText(target, exec.signal)
      return { path: target.displayPath, artifact: args.artifact, content }
    },
    presentCall: (args) => ({
      card: 'generic',
      title: `Read ${artifactRelativePath(args.artifact)}`,
      kind: 'other',
      rawInput: args,
    }),
  }))

  // §5 — hey_gate_status ----------------------------------------------------
  tools.register(defineTool({
    name: IDENTITY.toolNames.gate,
    description: 'Check the `.hey/` delivery artifacts against a depth/phase checkpoint. Document checks only; this result does not prove tests, human approval or deployment.',
    parameters: {
      depth: { type: 'string', enum: [...DEPTHS], description: 'patch, feature or product. Defaults to product.' },
      phase: { type: 'string', enum: [...PHASES], description: 'documents or delivery. Defaults to delivery.' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          exists: { type: 'boolean', required: true },
          ready: { type: 'boolean', required: true },
          missing: { type: 'array', required: true, items: { type: 'string' } },
          blocked: { type: 'array', required: true, items: { type: 'string' } },
          artifacts: {
            type: 'array',
            required: true,
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                artifact: { type: 'string', required: true, enum: [...ARTIFACTS] },
                status: { type: 'string', required: true },
                ready: { type: 'boolean', required: true },
                missingSections: { type: 'array', required: true, items: { type: 'string' } },
                placeholders: { type: 'array', required: true, items: { type: 'string' } },
              },
            },
          },
        },
      },
      render: (_args, value) => {
        const lines = [
          value.exists ? 'Uma delivery state:' : 'No .hey directory exists.',
          'Document checks only; this result does not prove tests, human approval or deployment.',
          value.ready
            ? 'Ready: every required artifact is present and clean.'
            : `Blocked: ${value.blocked.join(', ')}.`,
        ]
        if (value.missing.length !== 0) {
          lines.push(`Missing required artifacts: ${value.missing.join(', ')}.`)
        }
        for (const artifact of value.artifacts) {
          lines.push(`- ${artifact.artifact} (${artifact.status}, ${artifact.ready ? 'ready' : 'not ready'})`)
          if (artifact.missingSections.length !== 0) {
            lines.push(`  missing sections: ${artifact.missingSections.join(', ')}`)
          }
          if (artifact.placeholders.length !== 0) {
            lines.push(`  placeholders: ${artifact.placeholders.join(', ')}`)
          }
        }
        return [{ type: 'text', text: lines.join('\n') }]
      },
    },
    async execute(args, exec) {
      execFor(exec, 'hey_gate_status requires an agent Session')
      const depth = args.depth ?? DEFAULTS.depth
      const phase = args.phase ?? DEFAULTS.phase
      const directory = await resolveTarget(IDENTITY.artifactDir, exec)

      let entries
      try {
        entries = await fs.listDir(directory, exec.signal)
      } catch (error) {
        if (isFsCode(error, 'FS_NOT_FOUND')) {
          const missing = requiredArtifacts(depth, phase)
          return { exists: false, ready: missing.length === 0, missing, blocked: missing, artifacts: [] }
        }
        throw error
      }

      const artifacts = []
      for (const entry of entries) {
        if (entry.type !== 'file') continue
        const artifact = entry.name.replace(MD_SUFFIX_RE, '')
        if (!ARTIFACTS.includes(artifact)) continue
        const content = await fs.readText(entry.target, exec.signal)
        const evaluation = evaluateArtifact(artifact, content)
        artifacts.push({
          artifact,
          status: evaluation.status,
          ready: evaluation.ready,
          missingSections: evaluation.missingSections,
          placeholders: evaluation.placeholders,
        })
      }
      const checkpoint = evaluateCheckpoint(artifacts, depth, phase)
      return {
        exists: true,
        ready: checkpoint.ready,
        missing: checkpoint.missing,
        blocked: checkpoint.blocked,
        artifacts: sortByArtifactOrder(artifacts),
      }
    },
    presentCall: () => ({
      card: 'generic',
      title: 'Check Uma delivery gates',
      kind: 'other',
    }),
  }))
}

// --- package exports (spec §2: only name, inject, apply) --------------------
export const name = IDENTITY.pluginName
export const inject = IDENTITY.inject

/** Register the three tools in frozen order: write → read → gate. */
export function apply(ctx, config = {}) {
  assertDeps(ctx, ['tools'])
  const deps = { ...ctx, ...(config.deps ?? {}) }
  registerWorkflowTools(deps)
}
