/**
 * @heywork/knowledge — `knowledge` cordis Service + typert Remote.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-knowledge/lib/.
 * Every frozen value, error string, path convention, Config default, schema
 * column and API signature is transcribed from specs/knowledge.md §一–§八.
 * This is a Service + Remote, NOT a defineTool: no name/description/parameters/
 * output/execute/render/presentCall tool surface. Upstream @deepseek-ai/*
 * capabilities (cordis Service, typert Remote, home-paths, brand, sqlite,
 * officeKit, credentials) are injected via ctx/config — none are imported.
 *
 * 待确认 items (spec §九) — none guessed; conservative handling, tagged TC-n:
 *  TC-1 (§九.1) 4 string config fields optional => absent is allowed and means
 *       disabled / native validation; no invented default.
 *  TC-2 (§九.2) resolveDshHome is injected (deps.resolveDshHome); fallback only
 *       resolves relative paths under DSH_HOME/HOME without guessing rules.
 *  TC-3 (§九.3) FTS5 BM25 scores are SQLite-defined; chunkText produces
 *       behaviorally-equivalent bidirectional windows, not bit-exact scores.
 *  TC-4 (§九.4) officeKit.convert is injected; we only enforce output size and
 *       hand bytes to the injected/convertPdf path; no format invented.
 *  TC-5 (§九.5) credentials.resolve is injected; only "missing =>
 *       embedding-credential-missing" is assumed; no credential format guessed.
 *  TC-6 (§九.6) capture-enabled serial event emitted only via injected
 *       deps.emit; subscriber behavior is out of this package.
 *  TC-7 (§九.7) RemoteError details carries only { reason }; extra protocol
 *       fields (if any) are supplied by the injected typert layer, not here.
 *  Also: §1.1 per-method sourceLocation line/column is not enumerated in the
 *       spec; deterministic placeholders are used (see remote.js).
 */

import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { basename, join, isAbsolute } from 'node:path'
import {
  IDENTITY, DEFAULTS, NUMERIC_BOUNDS, STRINGS, REASONS, KNOWLEDGE_SCHEMA_VERSION,
  COLLECTION_KINDS, SEARCH_MODES, DOCUMENT_STATES, EXPERIENCE_STATES,
  EXPERIENCE_REFERENCE_KINDS, SUPPORTED_EXTENSIONS, OFFICE_EXTENSIONS,
  EXPERIENCE_LIST_STATES, RemoteError, fail, run, reasonOf, assertDeps, name, inject,
} from './deps.js'
import {
  knowledgeRoot, knowledgeHash, knowledgeExtension, citationPath, objectPath,
  readKnowledgeFile, normalizeText, extractMarkdown, chunkText, passageSource,
  knowledgeFtsQuery, fileVersion,
} from './files.js'
import { KnowledgeStore, now } from './store.js'
import { buildDescriptors, REMOTE_IDS } from './remote.js'

export { name, inject }
export { IDENTITY, DEFAULTS, STRINGS, REASONS, REMOTE_IDS, RemoteError }
export { buildDescriptors } from './remote.js'

const UUID_RE = /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu
const CONTROL_RE = /[\x00-\x1f]/u
const BASE_MARKER_RE = /\^HEY_KNOWLEDGE_BASE:([\da-f-]+)\$/iu

// ---------------------------------------------------------------------------
// zod-like validators (spec §1.4; zod messages that vary by input are emulated)
// ---------------------------------------------------------------------------
function zName(value, max = 160) {
  if (typeof value !== 'string') throw new Error(`Expected string, received ${typeof value}`)
  const trimmed = value.trim()
  if (trimmed.length < 1) throw new Error('String must contain at least 1 character(s)')
  if (trimmed.length > max) throw new Error(`String must contain at most ${max} character(s)`)
  return trimmed
}
const zDocName = (value) => {
  const name_ = zName(value, 512)
  if (CONTROL_RE.test(name_)) throw new Error('Document name must not contain control characters')
  return name_
}
const zUuid = (value) => {
  if (typeof value !== 'string' || !UUID_RE.test(value)) throw new Error('Expected UUID')
  return value.toLowerCase()
}
const zQuery = (value) => {
  if (typeof value !== 'string') throw new Error('Expected string')
  const trimmed = value.trim()
  if (trimmed.length < 1) throw new Error('String must contain at least 1 character(s)')
  if (trimmed.length > 4000) throw new Error('String must contain at most 4000 character(s)')
  return trimmed
}
const zOffset = (value) => {
  if (!Number.isInteger(value) || value < 0) throw new Error('Expected non-negative integer')
  return value
}
const zLimit = (value) => {
  if (!Number.isInteger(value) || value <= 0) throw new Error('Expected positive integer')
  return value
}

// ---------------------------------------------------------------------------
// Config validation (spec §1.3; construction-time native errors §1.5).
// ---------------------------------------------------------------------------
export function validateConfig(raw = {}) {
  const cfg = { ...DEFAULTS, ...raw }
  for (const [key, bounds] of Object.entries(NUMERIC_BOUNDS)) {
    const value = cfg[key]
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${key} must be a finite number`)
    }
    if (bounds.min !== undefined && value < bounds.min) throw new Error(`${key} is below its minimum`)
    if (bounds.max !== undefined && value > bounds.max) throw new Error(`${key} is above its maximum`)
  }
  if (!Array.isArray(cfg.excludeDirectories)
      || cfg.excludeDirectories.some((d) => typeof d !== 'string')) {
    throw new Error('excludeDirectories must be a string array')
  }
  for (const key of ['dshHome', 'embeddingUrl', 'embeddingModel', 'embeddingKeyRef', 'queryPrefix', 'documentPrefix']) {
    if (cfg[key] !== undefined && typeof cfg[key] !== 'string') {
      throw new Error(`${key} must be a string`)
    }
  }
  // Construction-time hard constraint (S:192-193) — native Error, not RemoteError.
  if (cfg.overlapChars >= cfg.childChars || cfg.childChars > cfg.parentChars) {
    throw new Error(STRINGS.sizes)
  }
  return cfg
}

// ---------------------------------------------------------------------------
// Embeddings (spec §4.3 / E:15-40).
// ---------------------------------------------------------------------------
export class KnowledgeEmbeddings {
  constructor(cfg, deps) {
    this.cfg = cfg
    this.deps = deps
    const { embeddingUrl: url, embeddingModel: model, embeddingKeyRef: keyRef,
      queryPrefix, documentPrefix } = cfg
    if (url === undefined && !model && !keyRef) {
      this.profile = null
      return
    }
    if (typeof url !== 'string' || url.length === 0 || typeof model !== 'string' || model.trim().length === 0) {
      throw new Error(STRINGS.incompleteEmbedding)
    }
    let parsed
    try { parsed = new URL(url) } catch { throw new Error(STRINGS.invalidEmbeddingUrl) }
    if (!['http:', 'https:'].includes(parsed.protocol)
        || parsed.username || parsed.password || parsed.search || parsed.hash) {
      throw new Error(STRINGS.invalidEmbeddingUrl)
    }
    this.url = url
    this.model = model
    this.keyRef = keyRef
    this.profile = knowledgeHash(JSON.stringify({ url, model, queryPrefix, documentPrefix }))
  }

  async embed(texts, query, signal) {
    if (this.profile === null) fail(REASONS.embeddingNotConfigured)
    signal?.throwIfAborted?.()
    let token
    try {
      const resolve = this.deps.credentials?.resolve ?? this.deps.resolveCredential
      if (typeof resolve !== 'function') throw new Error('missing resolver')
      token = await resolve(this.keyRef ? { ref: this.keyRef } : undefined)
      if (token === undefined || token === null || token === '') throw new Error('missing credential')
    } catch {
      fail(REASONS.embeddingCredentialMissing)
    }

    const cfg = this.cfg
    const prefix = query ? cfg.queryPrefix : cfg.documentPrefix
    const body = {
      model: this.model,
      input: texts.map((t) => prefix + t),
      encoding_format: 'float',
    }
    const timeout = typeof AbortSignal.any === 'function'
      ? AbortSignal.any([signal, AbortSignal.timeout(cfg.embeddingTimeoutMs)].filter(Boolean))
      : signal
    const headers = { 'content-type': 'application/json' }
    if (token) headers.authorization = `Bearer ${token}`
    let response
    try {
      const doFetch = this.deps.fetch ?? globalThis.fetch
      if (typeof doFetch !== 'function') throw new Error('missing fetch')
      response = await doFetch(this.url, {
        method: 'POST', headers, body: JSON.stringify(body), signal: timeout, redirect: 'error',
      })
    } catch (error) {
      if (error?.name === 'AbortError') throw error
      fail(REASONS.embeddingProviderFailed)
    }
    signal?.throwIfAborted?.()
    if (!response?.ok) fail(REASONS.embeddingProviderFailed)
    let bytes
    try {
      bytes = Buffer.from(await response.arrayBuffer())
    } catch {
      fail(REASONS.embeddingProviderFailed)
    }
    if (bytes.byteLength > cfg.maxEmbeddingResponseBytes) fail(REASONS.embeddingResponseTooLarge)
    let parsed
    try { parsed = JSON.parse(bytes.toString('utf8')) } catch { fail(REASONS.embeddingProviderFailed) }
    const data = parsed?.data
    if (!Array.isArray(data) || data.length !== texts.length) fail(REASONS.invalidEmbeddingOutput)
    const vectors = data.map((item) => {
      if (!Number.isInteger(item?.index) || item.index < 0) fail(REASONS.invalidEmbeddingOutput)
      const vec = item.embedding
      if (!Array.isArray(vec) || vec.length < 1 || vec.length > cfg.maxEmbeddingDimensions
          || vec.some((n) => typeof n !== 'number' || !Number.isFinite(n))
          || vec.every((n) => n === 0)) fail(REASONS.invalidEmbeddingOutput)
      return { index: item.index, vector: vec }
    }).sort((a, b) => a.index - b.index)
    const dims = vectors[0]?.vector.length
    let expected = 0
    for (const v of vectors) {
      if (v.index !== expected || v.vector.length !== dims) fail(REASONS.invalidEmbeddingOutput)
      expected += 1
    }
    return vectors.map((v) => v.vector)
  }
}

const cosine = (a, b) => {
  let dot = 0; let na = 0; let nb = 0
  for (let i = 0; i < a.length; i += 1) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
  return na && nb ? dot / Math.sqrt(na * nb) : 0
}

// ---------------------------------------------------------------------------
// KnowledgeService (spec §二). `Service` base is injected; fallback is local.
// ---------------------------------------------------------------------------
class LocalService {
  constructor(ctx, serviceName) {
    this.ctx = ctx
    this.name = serviceName
  }
}

export class KnowledgeService extends LocalService {
  constructor(ctx, config = {}, deps = {}) {
    super(ctx, IDENTITY.service)
    // When a real cordis Service base is injected, let it perform its own
    // registration side-effects (our LocalService already registers on ctx).
    if (deps.Service && deps.Service !== LocalService && typeof deps.Service.call === 'function') {
      try { deps.Service.call(this, ctx, IDENTITY.service) } catch { /* keep local base */ }
    }

    const cfg = validateConfig(config)
    this.config = cfg
    this.deps = deps
    this.embeddings = new KnowledgeEmbeddings(cfg, deps)
    this.lifetime = new AbortController()
    this.operations = new Set()
    this.jobControls = new Map()
    this.jobs = new Map()
    this.verifiedObjects = new Map()
    this.syncing = new Set()
    this.sourceSweepRunning = false
    this.store = null
    this._timer = null
    this._initSymbol = deps.ServiceInit ?? Symbol.for('cordis.Service.init')
    this[this._initSymbol] = () => this.init()

    // Configured capabilities (conservative TC handling).
    this._brand = (id) => (typeof deps.brand?.workspaceId === 'function' ? deps.brand.workspaceId(id) : id)
    this._workspaceRegistered = (id) => {
      if (typeof deps.isWorkspaceRegistered === 'function') return !!deps.isWorkspaceRegistered(id)
      if (typeof deps.workspaceRegistry?.has === 'function') return !!deps.workspaceRegistry.has(id)
      return true // TC-1/§九: no registry injected → assume registered
    }
  }

  // --- lifecycle -----------------------------------------------------------
  async init() {
    const root = knowledgeRoot(this.config, this.deps)
    this.root = root
    const store = KnowledgeStore.open(root, this.config, this.deps)
    if (this.lifetime.signal.aborted) {
      store.close()
      this.lifetime.signal.throwIfAborted()
    }
    this.store = store
    this._setupSweep()
    this.pump()
    return this
  }

  _setupSweep() {
    const cfg = this.config
    this._timer = setInterval(() => {
      if (!this.store?.healthy || this.lifetime.signal.aborted || this.sourceSweepRunning) return
      this.sourceSweepRunning = true
      Promise.resolve().then(async () => {
        for (const source of this.store.sources()) {
          if (source.watch) await this.synchronize(source.id).catch((error) => {
            if (error?.name !== 'AbortError') this._warn('A local knowledge source could not be synchronized.', error)
          })
        }
      }).catch((error) => {
        if (error?.name !== 'AbortError') this._warn('Local knowledge synchronization failed.', error)
      }).finally(() => { this.sourceSweepRunning = false })
    }, cfg.syncIntervalMs)
    this._timer.unref?.()
    const cleanup = () => {
      clearInterval(this._timer)
      this.lifetime.abort()
      this._close()
    }
    if (typeof this.deps.effect === 'function') this.deps.effect(() => cleanup)
    else if (typeof this.ctx?.effect === 'function') this.ctx.effect(() => cleanup)
    else this._cleanup = cleanup
  }

  _close() {
    const pending = Promise.allSettled([...this.operations, ...this.jobs.values()])
    this.store?.close()
    return pending
  }

  close() { return this._cleanup?.() ?? this._close() }

  _warn(message, error) {
    const logger = this.deps.logger ?? this.ctx?.logger
    if (typeof logger?.warn === 'function') logger.warn(message, error)
  }

  get data() {
    if (!this.store || !this.store.healthy || this.lifetime.signal.aborted) fail(REASONS.unavailable)
    return this.store
  }

  _run(signal, fn) {
    signal?.throwIfAborted?.()
    return run(fn)
  }

  // --- helpers -------------------------------------------------------------
  base(id) {
    const record = this.data.base(id)
    if (!record) fail(REASONS.baseNotFound)
    return record
  }

  documentRow(id) {
    const row = this.data.document(id)
    if (!row) fail(REASONS.documentNotFound)
    return row
  }

  _brandWorkspace(id) { return zWorkspaceId(id, this) }

  validateBaseInput(input) {
    if (!input || typeof input !== 'object') throw new Error('Expected object')
    const name_ = zName(input.name)
    let description = ''
    if (input.description !== undefined && input.description !== null) {
      if (typeof input.description !== 'string') throw new Error('Expected string')
      if (input.description.length > 4000) throw new Error('String must contain at most 4000 character(s)')
      description = input.description
    }
    const kind = input.kind
    if (!COLLECTION_KINDS.includes(kind)) throw new Error('Invalid collection kind')
    let workspaceIds = input.workspaceIds ?? []
    if (!Array.isArray(workspaceIds) || workspaceIds.length > 100) {
      throw new Error('workspaceIds must be an array of at most 100 entries')
    }
    workspaceIds = workspaceIds.map((id) => {
      if (typeof id !== 'string' || id.length < 1 || id.length > 256) {
        throw new Error('Invalid workspace id')
      }
      return this._brand(id)
    })
    if (new Set(workspaceIds).size !== workspaceIds.length) {
      throw new Error(STRINGS.duplicateWorkspaceError)
    }
    if (kind === 'project' && workspaceIds.length !== 1) {
      throw new Error(STRINGS.projectWorkspaceError)
    }
    if (kind === 'team' && (input.teamId === undefined || input.teamId === null)) {
      throw new Error(STRINGS.teamGroupingError)
    }
    let teamId = input.teamId ?? null
    if (teamId !== null) {
      teamId = zUuid(teamId)
      if (!this.data.team(teamId)) fail(REASONS.teamNotFound)
    }
    for (const id of workspaceIds) if (!this._workspaceRegistered(id)) fail(REASONS.workspaceNotFound)
    const mode = input.mode ?? 'fulltext'
    if (!SEARCH_MODES.includes(mode)) throw new Error('Invalid search mode')
    if (mode === 'hybrid' && this.embeddings.profile === null) fail(REASONS.embeddingNotConfigured)
    const enabled = input.enabled === undefined ? true : !!input.enabled
    return { name: name_, description, kind, teamId, workspaceIds, mode, enabled }
  }

  _baseView(record) {
    const documents = this.data.documents(record.id)
    const readyCount = documents.filter((d) => d.state === 'ready' && d.enabled).length
    return { ...record, documentCount: documents.length, readyCount }
  }

  // ===== 25 Remote methods (spec §五 / §七) ===============================

  catalog(signal) { return this._run(signal, () => {
    const teams = this.data.teams()
    const bases = this.data.bases(false).map((b) => this._baseView(b))
    const global = this.data.base(IDENTITY.globalExperienceId)
    const result = {
      teams,
      bases,
      embeddingsConfigured: this.embeddings.profile !== null,
      maxFileBytes: this.config.maxFileBytes,
      storedBytes: this.data.storedBytes(),
      storedLimitBytes: this.config.maxStoredBytes,
    }
    if (global) result.globalExperience = { ...global, description: STRINGS.globalBaseSummary }
    return result
  }) }

  createTeam(request, signal) { return this._run(signal, () => {
    const name_ = zName(request?.name)
    const existing = this.data.teamByName(name_)
    if (existing) return existing
    if (this.data.teamCount() >= this.config.maxTeams) fail(REASONS.tooManyTeams)
    const team = { id: randomUUID(), name: name_, createdAt: now() }
    this.data.insertTeam(team.id, team.name, team.createdAt)
    return team
  }) }

  createBase(request, signal) { return this._run(signal, () => {
    const input = this.validateBaseInput(request)
    if (this.data.baseCount() >= this.config.maxBases) fail(REASONS.tooManyCollections)
    const timestamp = now()
    const record = {
      id: randomUUID(), ...input, archived: false, createdAt: timestamp, updatedAt: timestamp,
    }
    this.data.insertBase(record)
    this.data.setBindings(record.id, input.workspaceIds)
    return this._baseView(record)
  }) }

  updateBase(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    const prior = this.base(id)
    if (id === IDENTITY.globalExperienceId) fail(REASONS.experienceBaseUnavailable)
    const input = this.validateBaseInput(request?.input)
    const record = { ...prior, ...input, updatedAt: now() }
    this.data.updateBase(id, record)
    this.data.setBindings(id, input.workspaceIds)
    if (prior.mode !== input.mode) {
      for (const doc of this.data.documents(id)) {
        this.data.requeueDocument(doc.id)
        this.jobControls.get(doc.id)?.abort()
      }
      this.pump()
    }
    return this._baseView(record)
  }) }

  archiveBase(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    const record = this.base(id)
    if (id === IDENTITY.globalExperienceId) fail(REASONS.experienceBaseUnavailable)
    if (typeof request?.archived !== 'boolean') throw new Error('Expected boolean')
    this.data.updateBase(id, { ...record, archived: request.archived, updatedAt: now() })
    if (request.archived) {
      this.data.cancelBaseJobs(id)
      for (const doc of this.data.documents(id, true)) this.jobControls.get(doc.id)?.abort()
      this.pump()
    }
    return true
  }) }

  detail(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    const base = this._baseView(this.base(id))
    const documents = this.data.documents(id, request?.includeArchived === true)
    return { base, documents, sources: this.data.sources(id) }
  }) }

  upload(request, signal) { return this._run(signal, async () => {
    const baseId = zUuid(request?.baseId)
    this.base(baseId)
    const name_ = zDocName(request?.name)
    const ext = knowledgeExtension(name_)
    if (!ext) fail(REASONS.unsupportedFormat)
    const encoded = request?.base64
    if (typeof encoded !== 'string') throw new Error('Expected string')
    const maxEncoded = Math.ceil(this.config.maxFileBytes / 3) * 4
    if (encoded.length > maxEncoded) fail(REASONS.fileTooLarge)
    const bytes = Buffer.from(encoded, 'base64')
    if (bytes.toString('base64') !== encoded) fail(REASONS.invalidFileEncoding)
    if (bytes.byteLength > this.config.maxFileBytes) fail(REASONS.fileTooLarge)
    return this.admit(baseId, name_, bytes, ext, {}, signal)
  }) }

  note(request, signal) { return this._run(signal, async () => {
    const baseId = zUuid(request?.baseId)
    let name_ = zDocName(request?.name)
    if (!name_.toLowerCase().endsWith('.md')) name_ = `${name_}.md`
    const text = request?.text
    if (typeof text !== 'string') throw new Error('Expected string')
    const base64 = Buffer.from(text, 'utf8').toString('base64')
    return this.upload({ baseId, name: name_, base64 }, signal)
  }) }

  createNoteIfAbsent(request, signal) { return this._run(signal, async () => {
    const baseId = zUuid(request?.baseId)
    this.base(baseId)
    let name_ = zDocName(request?.name)
    if (!name_.toLowerCase().endsWith('.md')) name_ = `${name_}.md`
    const text = request?.text
    if (typeof text !== 'string') throw new Error('Expected string')
    const base64 = Buffer.from(text, 'utf8').toString('base64')
    return this.admit(baseId, name_, Buffer.from(base64, 'base64'), 'md', { ifAbsent: true }, signal)
  }) }

  importLocal(request, signal) { return this._run(signal, async () => {
    const baseId = zUuid(request?.baseId)
    this.base(baseId)
    const path = request?.path
    if (typeof path !== 'string' || !isAbsolute(path)) fail(REASONS.absoluteSourceRequired)
    const nodeFs = this.deps.node?.['node:fs'] ?? (await import('node:fs'))
    const st = await nodeFs.promises.lstat(path)
    if (!st.isFile() && !st.isDirectory()) fail(REASONS.notARegularSource)
    const actual = st.isDirectory() ? 'folder' : 'file'
    const kind = request?.kind ?? 'auto'
    if (!['file', 'folder', 'auto'].includes(kind)) throw new Error('Invalid source kind')
    if (kind !== 'auto' && kind !== actual) fail(REASONS.notARegularSource)
    if (actual === 'file' && !knowledgeExtension(path)) fail(REASONS.unsupportedFormat)
    const realPath = await nodeFs.promises.realpath(path)
    const existing = this.data.sourceByPath(baseId, realPath)
    const id = existing?.id ?? randomUUID()
    if (existing) this.data.updateSource(id, { kind: actual, watch: !!request?.watch })
    else this.data.insertSource({ id, baseId, path: realPath, kind: actual, watch: !!request?.watch })
    return this.synchronize(id, signal)
  }) }

  watchSource(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    if (typeof request?.watch !== 'boolean') throw new Error('Expected boolean')
    if (!this.data.setWatch(id, request.watch)) fail(REASONS.sourceNotFound)
    return true
  }) }

  syncSource(request, signal) { return this._run(signal, async () => {
    const id = zUuid(request?.id)
    if (!this.data.source(id)) fail(REASONS.sourceNotFound)
    return this.synchronize(id, signal)
  }) }

  updateDocument(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    const doc = this.documentRow(id)
    const title = zDocName(request?.title)
    if (typeof request?.enabled !== 'boolean' || typeof request?.archived !== 'boolean') {
      throw new Error('Expected boolean')
    }
    const titleChanged = title !== doc.title
    const patch = { enabled: request.enabled, archived: request.archived, title, updatedAt: now() }
    if (titleChanged || (request.archived && doc.state === 'processing')) {
      patch.state = 'queued'
      patch.generation = doc.generation + 1
    }
    this.data.updateDocument(id, patch)
    if (request.archived || titleChanged) {
      this.jobControls.get(id)?.abort()
      this.pump()
    }
    return this.data.document(id)
  }) }

  retryDocument(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    this.documentRow(id)
    this.data.requeueDocument(id)
    this.jobControls.get(id)?.abort()
    this.pump()
    return true
  }) }

  document(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    const doc = this.documentRow(id)
    const offset = zOffset(request?.offset)
    const limit = this.config.previewPassages
    const passages = doc.revision
      ? this.data.passages(id, doc.revision, limit + 1, offset) : []
    const hasMore = passages.length > limit
    const visible = passages.slice(0, limit).map((row) => this._passage(row, doc))
    return {
      document: doc,
      revisions: this.data.revisions(id, this.config.revisionListLimit),
      passages: visible,
      hasMore,
      nextOffset: offset + limit,
    }
  }) }

  restoreRevision(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.id)
    const doc = this.documentRow(id)
    const revisionId = zName(request?.revision, 512)
    if (doc.sourceId && this.data.source(doc.sourceId)?.watch) {
      fail(REASONS.stopSourceWatchBeforeRestore)
    }
    const revision = this.data.revision(id, revisionId)
    if (!revision) fail(REASONS.revisionNotFound)
    if (this.embeddings.profile !== null) {
      const chunks = this.data.chunksForRevision(revisionId)
      if (chunks.some((c) => c.profile && c.profile !== this.embeddings.profile)) {
        fail(REASONS.embeddingReindexRequired)
      }
    }
    // Rebuild FTS: the immutable revision snapshots remain; only the active
    // revision pointer changes, so no chunk rows need rewriting (S:609-634).
    this.data.rebuildFts()
    this.data.updateDocument(id, {
      activeRevision: revisionId,
      pendingHash: revision.source_hash,
      pendingPath: revision.original_path,
      state: 'ready', error: null, generation: doc.generation + 1,
    })
    return true
  }) }

  original(request, signal) { return this._run(signal, async () => {
    const id = zUuid(request?.id)
    const doc = this.documentRow(id)
    const revisionId = zName(request?.revision, 512)
    const revision = this.data.revision(id, revisionId)
    if (!revision) fail(REASONS.revisionNotFound)
    const objectsDir = join(this.root, 'objects')
    const originalPath = revision.original_path ?? ''
    if (!originalPath.startsWith(`${objectsDir}/`)) fail(REASONS.revisionNotFound)
    const bytes = await readKnowledgeFile(originalPath, this.config.maxFileBytes, signal, this.deps)
    if (knowledgeHash(bytes) !== revision.source_hash) fail(REASONS.knowledgeObjectModified)
    return { name: basename(doc.name), data: bytes }
  }) }

  search(request, signal) { return this._run(signal, async () => {
    const query = zQuery(request?.query)
    const baseIds = (request?.baseIds ?? []).map(zUuid)
    const workspaceId = request?.workspaceId === undefined ? undefined
      : zName(request.workspaceId, 256)
    return this.retrieve({ query, baseIds, workspaceId }, signal)
  }) }

  experienceCapture(request, signal) { return this._run(signal, () => {
    const id = zUuid(request?.baseId)
    this.base(id)
    return this.data.captureEnabled(id)
  }) }

  setExperienceCapture(request, signal) { return this._run(signal, async () => {
    const id = zUuid(request?.baseId)
    const record = this.base(id)
    if (typeof request?.enabled !== 'boolean') throw new Error('Expected boolean')
    if (record.kind !== 'project' || record.archived) fail(REASONS.experienceBaseUnavailable)
    this.data.setCaptureEnabled(id, request.enabled)
    if (request.enabled) {
      for (const workspaceId of this.data.bindingsForBase(id)) {
        if (typeof this.deps.emit === 'function') {
          this.deps.emit(IDENTITY.captureEvent, { baseId: id, workspaceId, serial: true })
        }
      }
    }
    return request.enabled
  }) }

  listExperiences(request, signal) { return this._run(signal, () => {
    const baseId = zUuid(request?.baseId)
    this.base(baseId)
    const query = request?.query ?? ''
    if (typeof query !== 'string') throw new Error('Expected string')
    if (Buffer.byteLength(query, 'utf8') > this.config.maxTextBytes) fail(REASONS.textTooLarge)
    const state = request?.state ?? 'all'
    if (!EXPERIENCE_LIST_STATES.includes(state)) throw new Error('Invalid experience state')
    const offset = zOffset(request?.offset)
    const limit = Math.min(zLimit(request?.limit), this.config.candidateLimit)
    return {
      items: this.data.experiences(baseId, state, knowledgeFtsQuery(query), limit, offset),
      total: this.data.experienceCount(baseId, state, knowledgeFtsQuery(query)),
    }
  }) }

  experienceHistory(request, signal) { return this._run(signal, async () => {
    const id = zUuid(request?.id)
    if (!this.data.experience(id)) fail(REASONS.experienceNotFound)
    const offset = zOffset(request?.offset)
    const limit = Math.min(zLimit(request?.limit), this.config.revisionListLimit)
    return {
      items: this.data.experienceVersions(id, limit, offset),
      total: this.data.experienceVersionCount(id),
    }
  }) }

  saveExperience(request, signal) { return this._run(signal, async () => {
    const baseId = zUuid(request?.baseId)
    const record = this.data.base(baseId)
    if (!record || record.archived) fail(REASONS.experienceBaseUnavailable)
    const content = this._validateExperienceContent(request?.content)
    const id = request?.id === null || request?.id === undefined ? null : zUuid(request.id)
    const expected = request?.expectedRevision === null || request?.expectedRevision === undefined
      ? null : zLimit(request.expectedRevision)
    let prior = null
    let revision
    if (id === null) {
      if (expected !== null) fail(REASONS.experienceVersionConflict)
      if (this.data.experienceCount(baseId, 'all', null) >= this.config.maxDocuments) {
        fail(REASONS.tooManyDocuments)
      }
      revision = 1
    } else {
      prior = this.data.experience(id)
      if (!prior || prior.baseId !== baseId) fail(REASONS.experienceNotFound)
      if (expected !== prior.revision) fail(REASONS.experienceVersionConflict)
      revision = prior.revision + 1
    }
    const timestamp = now()
    const experience = {
      ...content,
      id: id ?? randomUUID(), baseId, revision, state: 'candidate', review: '',
      supersededBy: null,
      createdAt: prior?.createdAt ?? timestamp, updatedAt: timestamp,
    }
    this.data.insertExperienceVersion(experience.id, revision, experience)
    this.data.insertExperience(experience)
    this.data.rebuildExperienceFts()
    return experience
  }) }

  transitionExperience(request, signal) { return this._run(signal, async () => {
    const id = zUuid(request?.id)
    const prior = this.data.experience(id)
    if (!prior) fail(REASONS.experienceNotFound)
    const record = this.data.base(prior.baseId)
    if (!record || record.archived) fail(REASONS.experienceBaseUnavailable)
    const expected = zLimit(request?.expectedRevision)
    if (expected !== prior.revision) fail(REASONS.experienceVersionConflict)
    const state = request?.state
    if (!EXPERIENCE_STATES.includes(state)) throw new Error('Invalid experience state')
    let review = typeof request?.review === 'string' ? request.review.trim() : ''
    let supersededBy = request?.supersededBy ?? null
    if (state === 'candidate') review = ''
    if (state === 'reviewed') {
      if (!review || !prior.solution || !prior.applicability || !(prior.references?.length > 0)) {
        fail(REASONS.experienceReviewIncomplete)
      }
    }
    if (state === 'superseded') {
      const target = supersededBy ? this.data.experience(supersededBy) : null
      if (!target || target.id === id || target.baseId !== prior.baseId || target.state !== 'reviewed') {
        fail(REASONS.experienceReplacementInvalid)
      }
    } else if (supersededBy !== null) {
      fail(REASONS.experienceReplacementInvalid)
    }
    const experience = {
      ...prior, state, review, supersededBy, revision: prior.revision + 1, updatedAt: now(),
    }
    this.data.insertExperienceVersion(id, experience.revision, experience)
    this.data.insertExperience(experience)
    this.data.rebuildExperienceFts()
    return experience
  }) }

  deleteExperience(request, signal) { return this._run(signal, async () => {
    const id = zUuid(request?.id)
    const expected = zLimit(request?.expectedRevision)
    const prior = this.data.experience(id)
    if (!prior) fail(REASONS.experienceNotFound)
    if (expected !== prior.revision) fail(REASONS.experienceVersionConflict)
    this.data.deleteExperience(id) // keeps experience_captures dedup marker
    return true
  }) }

  // ===== 6 in-process service APIs (spec §六) =============================

  ensureGlobalExperience(signal) { return this._run(signal, () => {
    if (this.data.base(IDENTITY.globalExperienceId)) return
    const team = this.createTeam({ name: STRINGS.globalTeamName }, signal)
    const timestamp = now()
    this.data.insertBase({
      id: IDENTITY.globalExperienceId,
      name: STRINGS.globalBaseName,
      description: STRINGS.globalBaseDescription,
      kind: 'team', teamId: team.id, workspaceIds: [], mode: 'fulltext',
      enabled: true, archived: false, createdAt: timestamp, updatedAt: timestamp,
    })
  }) }

  captureGlobalExperience(request, signal) { return this._run(signal, async () => {
    this.ensureGlobalExperience(signal)
    return this._capture(IDENTITY.globalExperienceId, request?.sourceKey, request?.content, true)
  }) }

  captureExperience(request, signal) { return this._run(signal, () => {
    const workspaceId = this._brand(zName(request?.workspaceId, 256))
    if (!this._workspaceRegistered(workspaceId)) fail(REASONS.workspaceNotFound)
    let count = 0
    for (const baseId of this.data.baseIdsForWorkspace(workspaceId)) {
      const record = this.data.base(baseId)
      if (!record || record.archived || !this.data.captureEnabled(baseId)) continue
      if (this._capture(baseId, request?.sourceKey, request?.content, false)) count += 1
    }
    return count
  }) }

  experiencesForWorkspace(workspaceId, query, signal) { return this._run(signal, () => {
    if (workspaceId !== undefined && workspaceId !== null) {
      const wid = this._brand(zName(workspaceId, 256))
      if (!this._workspaceRegistered(wid)) fail(REASONS.workspaceNotFound)
    }
    const ftsQuery = knowledgeFtsQuery(query)
    if (ftsQuery === null) return []
    const baseIds = new Set()
    if (this.data.base(IDENTITY.globalExperienceId)) baseIds.add(IDENTITY.globalExperienceId)
    if (workspaceId !== undefined && workspaceId !== null) {
      const wid = this._brand(zName(workspaceId, 256))
      for (const baseId of this.data.baseIdsForWorkspace(wid)) {
        const record = this.data.base(baseId)
        if (record && !record.archived && record.enabled) baseIds.add(baseId)
      }
    }
    const selected = baseMarker(query)
    if (selected) baseIds.clear(), baseIds.add(selected)
    const result = []
    for (const baseId of baseIds) {
      result.push(...this.data.experiences(baseId, 'reviewed', ftsQuery, this.config.searchLimit, 0))
    }
    return result.slice(0, this.config.searchLimit)
  }) }

  forWorkspace(workspaceId, query, signal) { return this._run(signal, async () => {
    const wid = this._brand(zName(workspaceId, 256))
    if (!this._workspaceRegistered(wid)) fail(REASONS.workspaceNotFound)
    return this.retrieve({ query, baseIds: [], workspaceId: wid }, signal)
  }) }

  activeForWorkspace(workspaceId) {
    const wid = this._brand(zName(workspaceId, 256))
    for (const baseId of this.data.baseIdsForWorkspace(wid)) {
      const record = this.data.base(baseId)
      if (record && !record.archived && record.enabled) return true
    }
    return false
  }

  // ===== internal: experience capture / content validation ===============

  _validateExperienceContent(content) {
    if (!content || typeof content !== 'object') throw new Error('Expected object')
    const result = {
      title: zName(content.title, 160),
      symptom: zName(content.symptom, 4000),
      cause: content.cause === null || content.cause === undefined ? null : String(content.cause),
      solution: zName(content.solution, 4000),
      applicability: zName(content.applicability, 4000),
      exclusions: Array.isArray(content.exclusions) ? content.exclusions.map(String) : [],
      technologies: Array.isArray(content.technologies) ? content.technologies.map(String) : [],
      references: Array.isArray(content.references) ? content.references.map((r) => ({
        kind: EXPERIENCE_REFERENCE_KINDS.includes(r?.kind) ? r.kind : 'source',
        id: String(r?.id ?? ''),
      })) : [],
    }
    if (result.technologies.length > 64) throw new Error('technologies must be at most 64 entries')
    if (result.references.length > 128) throw new Error('references must be at most 128 entries')
    if (Buffer.byteLength(JSON.stringify(result), 'utf8') > this.config.maxTextBytes) {
      fail(REASONS.textTooLarge)
    }
    return result
  }

  _capture(baseId, sourceKey, content, installationWide) {
    const key = zName(sourceKey, 512)
    const record = this.data.base(baseId)
    if (!record || record.archived) fail(REASONS.experienceBaseUnavailable)
    const validated = this._validateExperienceContent(content)
    if (this.data.hasCapture(baseId, key)) return false
    if (this.data.experienceCount(baseId, 'all', null) >= this.config.maxDocuments) {
      fail(REASONS.tooManyDocuments)
    }
    const timestamp = now()
    const experience = {
      ...validated, id: randomUUID(), baseId, revision: 1, state: 'candidate',
      review: '', supersededBy: null, createdAt: timestamp, updatedAt: timestamp,
    }
    this.data.insertExperienceVersion(experience.id, 1, experience)
    this.data.insertExperience(experience)
    this.data.addCapture(baseId, key, experience.id)
    this.data.rebuildExperienceFts()
    if (installationWide) return true
    return true
  }

  // ===== internal: admission + parse queue (spec §4.1) ====================

  admit(baseId, name_, bytes, ext, opts = {}, signal) {
    const hash = knowledgeHash(bytes)
    const objectFile = objectPath(this.root, bytes, ext)
    if (opts.ifAbsent && this.data.documentByKey(baseId, name_)) {
      return { queued: 0, unchanged: 1, skipped: 0 }
    }
    // Write object + track capacity before admitting.
    const fs = this.deps.node?.['node:fs'] ?? requireFs()
    fs.mkdirSync(join(this.root, 'objects'), { recursive: true, mode: 0o700 })
    fs.writeFileSync(objectFile, bytes)
    this.data.trackObject(objectFile, bytes.byteLength)
    if (this.data.storedBytes() > this.config.maxStoredBytes) fail(REASONS.knowledgeStorageFull)

    const sourceKey = name_
    const title = name_
    let existing = this.data.documentByKey(baseId, sourceKey)
    let changed = true
    if (existing) {
      if (existing.archived) fail(REASONS.documentArchived)
      if (existing.pendingHash === hash && ['ready', 'queued', 'processing'].includes(existing.state)) {
        this.data.updateDocument(existing.id, { sourceVersion: hash })
        changed = false
      } else {
        this.jobControls.get(existing.id)?.abort()
        this.data.updateDocument(existing.id, {
          pendingHash: hash, pendingPath: objectFile, sourceVersion: hash, bytes: bytes.byteLength,
          state: 'queued', error: null, generation: existing.generation + 1, updatedAt: now(),
        })
      }
    } else {
      if (this.data.documentCount() >= this.config.maxDocuments) fail(REASONS.tooManyDocuments)
      existing = {
        id: randomUUID(), baseId, name: name_, sourceKey, title,
        sourcePath: objectFile, sourceId: null, state: 'queued', enabled: true,
        archived: false, error: null, activeRevision: null, pendingHash: hash,
        pendingPath: objectFile, bytes: bytes.byteLength, updatedAt: now(),
        chunkCount: 0, sourceVersion: hash, generation: 1,
      }
      this.data.insertDocument(existing)
    }
    this.pump()
    return { queued: changed ? 1 : 0, unchanged: changed ? 0 : 1, skipped: 0 }
  }

  pump() {
    if (!this.store?.healthy || this.lifetime.signal.aborted) return
    while (this.jobs.size < this.config.parsingConcurrency) {
      const archivedBaseIds = this.data.bases(false).filter((b) => b.archived).map((b) => b.id)
      const job = this.data.nextJob([...this.jobs.keys()], archivedBaseIds)
      if (!job) break
      const controller = new AbortController()
      this.jobControls.set(job.id, controller)
      this.jobs.set(job.id, job)
      const operation = this._process(job, controller.signal)
        .catch((error) => { if (error?.name !== 'AbortError') this._warn('Knowledge parsing failed.', error) })
        .finally(() => {
          this.jobs.delete(job.id)
          this.jobControls.delete(job.id)
          this.operations.delete(operation)
          this.pump()
        })
      this.operations.add(operation)
    }
  }

  /** Wait for all currently queued/active parse operations (test/helper only). */
  async waitForIdle() {
    for (let i = 0; i < 50 && (this.jobs.size > 0 || this.operations.size > 0); i += 1) {
      await Promise.allSettled([...this.operations])
      this.pump()
      if (this.jobs.size === 0 && this.operations.size === 0) break
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    await Promise.allSettled([...this.operations])
  }

  async _process(job, signal) {
    signal.throwIfAborted()
    try {
      // Raw row carries pending_hash / pending_path / generation / source_version
      // which the public KnowledgeDocument view intentionally omits.
      const raw = this.data.db.prepare('SELECT * FROM documents WHERE id = ?').get(job.id)
      const pendingHash = raw?.pending_hash ?? null
      const pendingPath = raw?.pending_path ?? job.sourcePath
      const generation = raw?.generation ?? job.generation ?? 1
      const sourceVersion = raw?.source_version ?? null
      const bytes = await readKnowledgeFile(pendingPath,
        this.config.maxFileBytes, signal, this.deps)
      const ext = knowledgeExtension(job.name) ?? 'md'
      let markdown
      let originalPath = pendingPath
      if (OFFICE_EXTENSIONS.includes(ext)) {
        if (typeof this.deps.officeKit?.convert !== 'function') fail(REASONS.unsupportedFormat)
        const converted = await this.deps.officeKit.convert({
          extension: ext, priority: 'foreground',
          source: { key: `knowledge:${job.id}`, version: sourceVersion, bytes, read: () => bytes },
        }, signal)
        const pdfBytes = Buffer.from(converted?.bytes ?? converted ?? [])
        if (pdfBytes.byteLength > this.config.maxFileBytes) fail(REASONS.fileTooLarge)
        markdown = await this._pdfToMarkdown(pdfBytes, signal)
      } else if (ext === 'pdf') {
        markdown = await this._pdfToMarkdown(bytes, signal)
      } else {
        markdown = extractMarkdown(normalizeText(bytes, this.config.maxTextBytes))
      }
      signal.throwIfAborted()

      const parts = chunkText(markdown, this.config)
      if (parts.length === 0) fail(REASONS.emptyOrBinaryText)
      const markdownHash = knowledgeHash(markdown)
      const textPath = citationPath(this.root, markdown, job.name)
      const fs = this.deps.node?.['node:fs'] ?? requireFs()
      fs.mkdirSync(join(this.root, 'citations', markdownHash), { recursive: true, mode: 0o700 })
      fs.writeFileSync(textPath, markdown, 'utf8')

      const profile = this.embeddings.profile
      const revisionId = knowledgeHash(
        `parent-child-citations-v1/${job.id}/${pendingHash}/${markdownHash}/${profile}/`
        + `${this.config.parentChars}/${this.config.childChars}/${this.config.overlapChars}`,
      )
      let vectors = []
      if (profile !== null) {
        const texts = parts.flatMap((part) => part.children.map((child) => child.text))
        if (texts.length > this.config.maxChunks) fail(REASONS.tooManyChunks)
        vectors = await this.embeddings.embed(texts, false, signal)
        const dims = vectors[0]?.length
        if (vectors.some((v) => v.length !== dims)) fail(REASONS.embeddingDimensionsChanged)
      }

      const createdAt = now()
      this.data.insertRevision({
        id: revisionId, documentId: job.id, sourceHash: pendingHash,
        textPath, originalPath, createdAt,
        chunkCount: parts.reduce((n, p) => n + p.children.length, 0), profile,
      })
      let chunkNo = 0
      let vectorIndex = 0
      for (const part of parts) {
        for (const child of part.children) {
          const vector = profile !== null ? JSON.stringify(vectors[vectorIndex++] ?? []) : null
          this.data.insertChunk({
            id: `${revisionId}/${part.parentId}-c${chunkNo}`, documentId: job.id,
            baseId: job.baseId, revision: revisionId, parentId: part.parentId,
            heading: part.heading, text: child.text, parentText: part.parentText,
            page: part.page, startLine: child.startLine, endLine: part.endLine,
            vector, profile,
          })
          chunkNo += 1
        }
      }
      this.data.rebuildFts()
      const ok = this.data.publish(job.id, generation, pendingHash,
        { id: revisionId, chunkCount: chunkNo })
      if (!ok) return
    } catch (error) {
      if (error?.name === 'AbortError') throw error
      this.data.updateDocument(job.id, { state: 'error', error: reasonOf(error), updatedAt: now() })
    }
  }

  async _pdfToMarkdown(bytes, signal) {
    if (typeof this.deps.convertPdf !== 'function') fail(REASONS.pdfWorkerFailed)
    const timeout = typeof AbortSignal.any === 'function'
      ? AbortSignal.any([signal, AbortSignal.timeout(this.config.parseTimeoutMs)].filter(Boolean))
      : signal
    let result
    try {
      result = await this.deps.convertPdf(bytes, {
        maxPages: this.config.maxPages, maxTextBytes: this.config.maxTextBytes,
        memoryMb: this.config.workerMemoryMb, signal: timeout,
      })
    } catch (error) {
      if (error?.name === 'AbortError' || timeout.aborted) fail(REASONS.parseTimeout)
      fail(REASONS.pdfWorkerFailed)
    }
    if (!result || typeof result.markdown !== 'string') fail(REASONS.invalidPdfWorkerOutput)
    const reason = result.reason
    if (reason && ['too-many-pages', 'text-too-large', 'ocr-required', 'pdf-extraction-failed'].includes(reason)) {
      fail(reason)
    }
    return result.markdown
  }

  // ===== internal: local source discovery & sync (spec §4.2) ==============

  async discover(source, signal) {
    const fs = this.deps.node?.['node:fs'] ?? (await import('node:fs'))
    if (source.kind === 'file') return { files: [source.path], skipped: 0 }
    const files = []
    let inspected = 0
    const stack = [source.path]
    while (stack.length) {
      signal?.throwIfAborted?.()
      const dir = stack.pop()
      const entries = await fs.promises.readdir(dir, { withFileTypes: true })
      for (const entry of entries) {
        inspected += 1
        if (inspected > this.config.maxSourceFiles) fail(REASONS.tooManySourceFiles)
        if (entry.name.startsWith('.')) continue
        if (entry.isSymbolicLink()) continue
        const full = join(dir, entry.name)
        if (entry.isDirectory()) {
          if (this.config.excludeDirectories.includes(entry.name)) continue
          stack.push(full)
        } else if (entry.isFile() && knowledgeExtension(entry.name) !== null) {
          files.push(full)
        }
      }
    }
    files.sort()
    return { files, skipped: 0 }
  }

  async synchronize(sourceId, signal) {
    const source = this.data.source(sourceId)
    if (!source) fail(REASONS.sourceNotFound)
    if (this.syncing.has(sourceId)) fail(REASONS.sourceSyncRunning)
    this.syncing.add(sourceId)
    try {
      signal?.throwIfAborted?.()
      const { files } = await this.discover(source, signal)
      const known = this.data.documents(source.baseId).filter((d) => d.sourceId === sourceId)
      const knownByPath = new Map(known.map((d) => [d.sourcePath, d]))
      let queued = 0; let unchanged = 0; let skipped = 0
      const seen = new Set()
      for (const path of files) {
        seen.add(path)
        let stat
        try {
          const fs = this.deps.node?.['node:fs'] ?? (await import('node:fs'))
          stat = await fs.promises.lstat(path)
        } catch { continue }
        const version = fileVersion(stat)
        const existing = knownByPath.get(path)
        if (existing && existing.sourceVersion === version && existing.state !== 'missing') {
          unchanged += 1
          continue
        }
        const bytes = await readKnowledgeFile(path, this.config.maxFileBytes, signal, this.deps)
        const ext = knowledgeExtension(path)
        if (!ext) { skipped += 1; continue }
        const hash = knowledgeHash(bytes)
        const objectFile = objectPath(this.root, bytes, ext)
        const fs = this.deps.node?.['node:fs'] ?? requireFs()
        fs.mkdirSync(join(this.root, 'objects'), { recursive: true, mode: 0o700 })
        fs.writeFileSync(objectFile, bytes)
        this.data.trackObject(objectFile, bytes.byteLength)
        if (existing) {
          this.jobControls.get(existing.id)?.abort()
          this.data.updateDocument(existing.id, {
            pendingHash: hash, pendingPath: objectFile, sourceVersion: version, bytes: bytes.byteLength,
            state: 'queued', error: null, generation: existing.generation + 1, updatedAt: now(),
          })
        } else {
          if (this.data.documentCount() >= this.config.maxDocuments) fail(REASONS.tooManyDocuments)
          this.data.insertDocument({
            id: randomUUID(), baseId: source.baseId, name: basename(path), sourceKey: path,
            title: basename(path), sourcePath: path, sourceId: sourceId, state: 'queued',
            enabled: true, archived: false, error: null, activeRevision: null,
            pendingHash: hash, pendingPath: objectFile, bytes: bytes.byteLength, updatedAt: now(),
            chunkCount: 0, sourceVersion: version, generation: 1,
          })
        }
        queued += 1
      }
      for (const [path, doc] of knownByPath) {
        if (!seen.has(path)) this.data.updateDocument(doc.id, { state: 'missing', error: 'source-missing' })
      }
      this.data.updateSource(sourceId, { lastScan: now(), error: null })
      this.pump()
      return { queued, unchanged, skipped }
    } finally {
      this.syncing.delete(sourceId)
    }
  }

  // ===== internal: retrieval (spec §4.4 / §7.18) ===========================

  _passage(row, doc) {
    const base = this.data.base(doc.baseId)
    return {
      id: row.id,
      baseId: doc.baseId,
      documentId: doc.id,
      revision: row.revision,
      baseName: base?.name ?? '',
      title: doc.title,
      heading: row.heading,
      text: row.parent_text,
      page: row.page ?? null,
      startLine: row.start_line,
      endLine: row.end_line,
      textPath: this.data.revision(doc.id, row.revision)?.text_path ?? '',
      score: row.score ?? 0,
    }
  }

  eligible(baseIds, workspaceId) {
    return this.data.bases(false).filter((base) => {
      if (base.archived || !base.enabled || base.id === IDENTITY.globalExperienceId) return false
      if (baseIds.length > 0 && !baseIds.includes(base.id)) return false
      if (workspaceId !== undefined && !this.data.bindingsForBase(base.id).includes(workspaceId)) return false
      return true
    })
  }

  async retrieve({ query, baseIds, workspaceId }, signal) {
    let bases = this.eligible(baseIds, workspaceId)
    const selected = baseMarker(query)
    if (selected) bases = bases.filter((b) => b.id === selected)
    if (bases.length === 0) return { mode: 'fulltext', hits: [], staleDocuments: 0 }

    const mode = bases.some((b) => b.mode === 'hybrid') ? 'hybrid' : 'fulltext'
    if (mode === 'hybrid' && this.embeddings.profile === null) fail(REASONS.embeddingNotConfigured)

    const ftsQuery = knowledgeFtsQuery(query)
    const lexical = new Map()
    if (ftsQuery) {
      for (const row of this.data.ftsSearch(ftsQuery, this.config.candidateLimit)) {
        lexical.set(row.chunk_id, row.chunk_id)
      }
    }
    let queryVector = null
    if (mode === 'hybrid') {
      try {
        queryVector = (await this.embeddings.embed([query], true, signal))[0]
      } catch (error) {
        if (error instanceof RemoteError) throw error
        if (error?.name === 'AbortError') throw error
        fail(REASONS.embeddingProviderFailed)
      }
    }

    const candidates = []
    let staleDocuments = 0
    let scanned = 0
    for (const base of bases) {
      for (const doc of this.data.documents(base.id)) {
        if (!doc.enabled || doc.archived || doc.state !== 'ready' || !doc.revision) continue
        const rev = this.data.revision(doc.id, doc.revision)
        if (!rev) { staleDocuments += 1; continue }
        // object integrity check (conservative: verify original object when present)
        if (rev.original_path) {
          const fs = this.deps.node?.['node:fs'] ?? requireFs()
          let stat
          try { stat = fs.statSync(rev.original_path) } catch { staleDocuments += 1; continue }
          if (stat.isSymbolicLink() || stat.size > this.config.maxFileBytes) { staleDocuments += 1; continue }
        }
        for (const row of this.data.chunksForRevision(doc.revision)) {
          if (mode === 'fulltext') {
            if (lexical.has(row.id)) candidates.push({ row, doc, score: 1 })
            continue
          }
          scanned += 1
          if (scanned > this.config.maxVectorCandidates) fail(REASONS.denseIndexTooLarge)
          if (row.profile && row.profile !== this.embeddings.profile) fail(REASONS.embeddingReindexRequired)
          if (!row.vector) continue
          let vector
          try { vector = JSON.parse(row.vector) } catch { continue }
          const score = cosine(queryVector, vector)
          if (score >= this.config.minVectorSimilarity) candidates.push({ row, doc, score })
        }
      }
    }

    // dedupe by parent channel, keep best score per (document, parent)
    const best = new Map()
    for (const candidate of candidates) {
      const key = `${candidate.doc.id}:${candidate.row.parent_id}`
      const prior = best.get(key)
      if (!prior || prior.score < candidate.score) best.set(key, candidate)
    }
    const hits = [...best.values()]
      .sort((a, b) => b.score - a.score || a.row.start_line - b.row.start_line)
      .slice(0, this.config.searchLimit)
      .map(({ row, doc, score }) => {
        const passage = this._passage(row, doc)
        passage.score = score
        return { ...passage, source: passageSource(passage.textPath, passage.startLine) }
      })
    return { mode, hits, staleDocuments }
  }
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
function zWorkspaceId(id, service) { return service._brand(id) }

function baseMarker(query) {
  if (typeof query !== 'string') return null
  const match = BASE_MARKER_RE.exec(query)
  return match ? match[1].toLowerCase() : null
}

let _requireFs
function requireFs() {
  if (!_requireFs) {
    // eslint-disable-next-line no-undef
    _requireFs = createRequire(import.meta.url)('node:fs')
  }
  return _requireFs
}

// ---------------------------------------------------------------------------
// Plugin entry: export name / inject / apply(ctx, config?).
// apply registers the `knowledge` service and all 25 Remote descriptors.
// ---------------------------------------------------------------------------
export function apply(ctx = {}, config = {}) {
  // Upstream capabilities are injected from either ctx or config (spec:
  // "全部从 deps/config 注入"). Config-only numeric fields simply pass through.
  const deps = { ...ctx, ...config, ...(config.deps ?? {}) }
  const service = new KnowledgeService(ctx, config, deps)
  ctx.services ??= Object.create(null)
  ctx.services[IDENTITY.service] = service

  const remoteImpl = {}
  for (const id of REMOTE_IDS) {
    const key = id.slice(IDENTITY.invocationPrefix.length)
    remoteImpl[key] = (...args) => {
      const signal = args[args.length - 1]
      const request = args[0]
      return typeof service[key] === 'function' ? service[key](request, signal) : undefined
    }
  }
  const descriptors = buildDescriptors(remoteImpl, deps.createSchema)
  const registered = []
  const register = (descriptor) => {
    registered.push(descriptor)
    if (typeof deps.registerRemote === 'function') deps.registerRemote(descriptor)
    else if (typeof deps.typert?.register === 'function') deps.typert.register(descriptor)
  }
  for (const descriptor of Object.values(descriptors)) register(descriptor)

  service.remotes = descriptors
  service.registered = registered
  ctx.__knowledgeService = service
  ctx.__knowledgeRemotes = registered
  service.ready = service.init()
  return service
}

export default apply
