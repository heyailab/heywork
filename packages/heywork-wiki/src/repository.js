/**
 * @heywork/wiki — filesystem repository with CAS, immutable revisions, catalog
 * merging and revision scanning.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-tool-repo-wiki/lib/
 * repository-C9lB9byj.js or config-DdfZjILQ.js. Implements only the externally
 * observable behavior in specs/wiki.md §2.1–§2.2, §2.4 and §3. All upstream
 * capabilities (fs, workingDirectory, get, waterfall, subprocess, agents) are
 * injected; this module imports no @deepseek-ai/* package.
 */

import { isAbsolute, relative } from 'node:path'
import { DEFAULTS, ERROR_TEXT, WIKI, wikiError } from './deps.js'
import {
  CATALOG_PATH, USER_PLAN_PATH, WIKI_ROOT, isWikiSecret, parseRecord,
  parseSourcePath, parseUserPlan, sha256, validateCatalog, validateIndex,
  validateManifest, wikiImpact,
} from './util-wiki.js'

const isInside = (parent, child) => {
  const rel = relative(parent, child)
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel))
}

const firstSegment = (path) => path.split('/')[0]

/** Repository Wiki requires an Agent Session (plain Error, spec §2.1). */
export async function createRepository(env, exec) {
  if (exec?.agent === undefined || exec?.agent === null) {
    throw new Error(ERROR_TEXT.agentSession)
  }

  const {
    fs, workingDirectory, get = () => undefined, waterfall,
    subprocess, agents, config = {},
  } = env
  const cfg = { ...DEFAULTS, ...config }
  const signal = exec.signal
  const agent = exec.agent
  const cwd = await workingDirectory.ensure(agent, signal)
  const root = fs.resolve('.', { cwd, signal })

  const sessionId = (() => {
    const raw = agent.session?.id ?? agent.id ?? 'session'
    const numeric = Number.parseInt(String(raw).replace(/\D/g, ''), 10)
    return Number.isInteger(numeric) && numeric >= 1 ? numeric : 1
  })()

  const session = () => {
    if (agent === undefined) throw wikiError('wiki/invalid-data', ERROR_TEXT.sessionRequired)
    return sessionId
  }
  const isSessionRunning = (id) => agents?.isRunning?.(id) === true

  const resolveSource = (path) => {
    parseSourcePath(path)
    const target = fs.resolve(path, { cwd, signal })
    if (!isInside(root.path, target.path)) {
      throw wikiError('wiki/outside-workspace', ERROR_TEXT.outsideWorkspace)
    }
    return target
  }

  const resolveWiki = (path) => {
    if (!isStringPath(path) || !path.startsWith(`${WIKI_ROOT}/`)) {
      throw wikiError('wiki/outside-workspace', ERROR_TEXT.expectedWikiPath)
    }
    const target = fs.resolve(path, { cwd, signal })
    const wikiRoot = fs.resolve(WIKI_ROOT, { cwd, signal })
    if (wikiRoot.path === root.path || !isInside(root.path, wikiRoot.path)
        || !isInside(wikiRoot.path, target.path)) {
      throw wikiError('wiki/outside-workspace', ERROR_TEXT.outsideWiki)
    }
    return target
  }
  const isStringPath = (value) => typeof value === 'string'

  const stat = async (target) => (await fs.stat(target, signal)) ?? null

  /** Ensure `.hey` and `.hey/wiki` are real directories, never symlinks/files. */
  const ensureWikiDirs = async () => {
    if (typeof fs.mkdir === 'function') {
      await fs.mkdir(fs.resolve('.hey', { cwd, signal }), { recursive: true, signal })
      await fs.mkdir(fs.resolve(WIKI_ROOT, { cwd, signal }), { recursive: true, signal })
    }
    for (const name of ['.hey', WIKI_ROOT]) {
      const entry = await stat(fs.resolve(name, { cwd, signal }))
      if (!entry || entry.type !== 'directory' || entry.symlink === true) {
        throw wikiError('wiki/outside-workspace', ERROR_TEXT.storageDirs)
      }
    }
  }

  const readRecord = async (path) => {
    const target = resolveWiki(path)
    const entry = await stat(target)
    if (!entry) return null
    if (entry.type !== 'file') {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.expectedRegularFile(path))
    }
    const text = await fs.readText(target, signal)
    if (text.includes('\u0000')) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.binaryFile(path))
    }
    if (text.includes('\uFFFD')) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.expectedUtf8(path))
    }
    return { text, version: entry.version ?? null }
  }

  const readRecordJSON = async (path, validator, options) => {
    const record = await readRecord(path)
    return parseRecord(record?.text ?? null, validator, options)
  }

  /** Read a repository source file (not a .hey/wiki record) with the same guards. */
  const readSourceRecord = async (path) => {
    const target = resolveSource(path)
    const entry = await stat(target)
    if (!entry) return null
    if (entry.type !== 'file') {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.expectedRegularFile(path))
    }
    const text = await fs.readText(target, signal)
    if (text.includes('\u0000')) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.binaryFile(path))
    }
    if (text.includes('\uFFFD')) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.expectedUtf8(path))
    }
    return { text, version: entry.version ?? null }
  }

  const readCatalog = () => readRecordJSON(CATALOG_PATH, validateCatalog)

  const readManifest = async (path) => {
    if (!isStringPath(path) || !path.startsWith(`${WIKI_ROOT}/`)) {
      throw wikiError('wiki/outside-workspace', ERROR_TEXT.expectedWikiPath)
    }
    return readRecordJSON(path, validateManifest)
  }

  const readIndex = async (path) => {
    if (!isStringPath(path) || !path.startsWith(`${WIKI_ROOT}/`)) {
      throw wikiError('wiki/outside-workspace', ERROR_TEXT.expectedWikiPath)
    }
    const index = await readRecordJSON(path, validateIndex)
    if (!index) throw wikiError('wiki/not-found', ERROR_TEXT.noIndex)
    for (const file of index.files) {
      const absolute = fs.resolve(file.path, { cwd, signal }).path
      if (isWikiSecret(file.path) || !isInside(root.path, absolute)) {
        throw wikiError('wiki/invalid-data', ERROR_TEXT.indexProhibited)
      }
    }
    return index
  }

  const readUserPlan = async () => {
    const record = await readRecord(USER_PLAN_PATH)
    return parseUserPlan(record?.text ?? null)
  }

  const readContent = async (path, expectedHash) => {
    const record = await readRecord(path)
    if (!record) throw wikiError('wiki/not-found', ERROR_TEXT.articleNotGenerated)
    if (Buffer.byteLength(record.text, 'utf8') > cfg.maxPageBytes) {
      throw wikiError('wiki/limit', ERROR_TEXT.articleTooLarge)
    }
    if (expectedHash !== null && sha256(record.text) !== expectedHash) {
      throw wikiError('wiki/conflict', ERROR_TEXT.articleDigest)
    }
    return record.text
  }

  const writeGuard = (path) => {
    if (exec.rootCallId === undefined || exec.rootCallId === null) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.readOnlyPublish)
    }
    if (!isStringPath(path) || !path.startsWith(`${WIKI_ROOT}/`)) {
      throw wikiError('wiki/outside-workspace', ERROR_TEXT.writesConfined)
    }
  }

  const policySandbox = () => {
    const policy = get('sandboxPolicy')
    if (fs.sandboxMode !== undefined && policy === undefined) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.policyMissing)
    }
    return policy?.resolve?.({ session: agent.session }) ?? undefined
  }

  const writeRaw = async (target, text, { expectVersion, immutable, sandbox }) => {
    try {
      await fs.writeText(target, text, { signal, expectVersion, immutable, sandbox })
    } catch (error) {
      if (error?.code === 'CAS_CONFLICT') {
        throw wikiError('wiki/conflict', immutable ? ERROR_TEXT.immutableChanged : ERROR_TEXT.casConflict)
      }
      throw error
    }
    return stat(target)
  }

  /** Mutable CAS write; `mode` is create (createIfAbsent) or replace (replaceIfVersion). */
  const writeMutable = async (path, text, { observedVersion = null, mode = 'replace' } = {}) => {
    writeGuard(path)
    await ensureWikiDirs()
    const target = resolveWiki(path)
    const current = await stat(target)
    if (mode === 'create') {
      if (current) {
        const existing = await readRecord(path)
        if (existing?.text === text) return { version: current.version, idempotent: true }
        throw wikiError('wiki/conflict', ERROR_TEXT.casConflict)
      }
    } else if (!current || (observedVersion !== null && current.version !== observedVersion)) {
      throw wikiError('wiki/conflict', ERROR_TEXT.casConflict)
    }
    const sandbox = policySandbox()
    const after = await writeRaw(target, text, {
      expectVersion: current?.version ?? null, immutable: false, sandbox,
    })
    return { version: after?.version ?? null }
  }

  /** Immutable revision: same content is an idempotent success, different content conflicts. */
  const writeImmutable = async (path, text) => {
    writeGuard(path)
    await ensureWikiDirs()
    const target = resolveWiki(path)
    const current = await stat(target)
    if (current) {
      const existing = await readRecord(path)
      if (existing?.text === text) return { version: current.version, idempotent: true }
      throw wikiError('wiki/conflict', ERROR_TEXT.immutableChanged)
    }
    const sandbox = policySandbox()
    const after = await writeRaw(target, text, {
      expectVersion: null, immutable: true, sandbox,
    })
    return { version: after?.version ?? null }
  }

  /** CAS-update the catalog; on exhaustion report the already-committed manifest path. */
  const updateCatalog = async (committedPath, mutate) => {
    writeGuard(CATALOG_PATH)
    await ensureWikiDirs()
    const retries = Math.max(1, cfg.catalogRetries)
    for (let attempt = 0; attempt < retries; attempt += 1) {
      const record = await readRecord(CATALOG_PATH)
      const version = record?.version ?? null
      const base = record
        ? parseRecord(record.text, validateCatalog)
        : { version: 1, editions: [] }
      const next = mutate(structuredClone(base))
      try {
        await writeMutable(CATALOG_PATH, JSON.stringify(next), {
          observedVersion: version, mode: version === null ? 'create' : 'replace',
        })
        return next
      } catch (error) {
        if (error?.code !== 'wiki/conflict') throw error
      }
    }
    throw wikiError('wiki/catalog-busy', ERROR_TEXT.catalogBusy(committedPath))
  }

  // --- source scanning / revision -----------------------------------------
  const exclude = new Set(cfg.excludeDirectories)
  const excludedDir = (name) => exclude.has(name) || name.startsWith('.')

  const parseImports = (text) => {
    const found = new Set()
    for (const match of text.matchAll(/(?:from\s+|require\()\s*['"]([^'"]+)['"]/g)) {
      const specifier = match[1]
      if (specifier.startsWith('.') || !specifier.includes('/') || specifier.startsWith('@')) {
        found.add(specifier)
      }
    }
    return [...found].sort((a, b) => a.localeCompare(b))
  }

  const detectRevisionInfo = async () => {
    if (!subprocess || typeof subprocess.run !== 'function') {
      return { branch: 'workspace', commit: null, git: false }
    }
    try {
      const branchOutcome = await subprocess.run(cfg.gitExecutable, ['rev-parse', '--abbrev-ref', 'HEAD'], {
        cwd, signal, timeout: cfg.gitTimeoutMs,
      })
      const branchOut = branchOutcome?.stdout ?? ''
      if (Buffer.byteLength(branchOut, 'utf8') > cfg.gitOutputMaxBytes) {
        throw wikiError('wiki/limit', ERROR_TEXT.gitOutputLimit)
      }
      const branch = branchOut.trim()
      const commitOutcome = await subprocess.run(cfg.gitExecutable, ['rev-parse', 'HEAD'], {
        cwd, signal, timeout: cfg.gitTimeoutMs,
      })
      const commit = (commitOutcome?.stdout ?? '').trim() || null
      if (branch === 'HEAD') {
        return { branch: commit ? `detached-${commit.slice(0, 12)}` : 'detached-unborn', commit, git: true }
      }
      return { branch: branch || 'workspace', commit, git: true }
    } catch (error) {
      if (error instanceof Error && error.code === 'wiki/limit') throw error
      if (/not a git repository/i.test(String(error?.message ?? error))) {
        return { branch: 'workspace', commit: null, git: false }
      }
      throw wikiError('wiki/git-failed', ERROR_TEXT.gitInspectFailed)
    }
  }

  let scanCache = null
  const scan = async () => {
    if (scanCache) return scanCache
    await ensureWikiDirs()
    const files = []
    const skipped = []
    let totalBytes = 0

    const walk = async (directory) => {
      const target = fs.resolve(directory, { cwd, signal })
      let entries
      try {
        entries = await fs.listDir(target, signal)
      } catch (error) {
        if (error?.code === 'FS_NOT_FOUND' || error?.code === 'ENOENT') return
        throw error
      }
      if (entries.length > cfg.maxFiles) {
        throw wikiError('wiki/limit', ERROR_TEXT.scanEntryLimit)
      }
      for (const entry of entries) {
        const path = directory === '.' ? entry.name : `${directory}/${entry.name}`
        if (entry.type === 'directory') {
          if (excludedDir(entry.name)) {
            skipped.push({ path, reason: 'excluded' })
          } else {
            await walk(path)
          }
          continue
        }
        if (entry.type === 'symlink') {
          skipped.push({ path, reason: 'symlink' })
          continue
        }
        if (entry.type !== 'file') continue
        // Secret paths and the Wiki storage itself are never indexed.
        if (isWikiSecret(path) || path.startsWith(`${WIKI_ROOT}/`) || excludedDir(firstSegment(path))) continue
        const fileTarget = entry.target ?? fs.resolve(path, { cwd, signal })
        const statEntry = await stat(fileTarget)
        if (!statEntry) continue
        const bytes = statEntry.bytes ?? 0
        if (bytes > cfg.maxFileBytes) {
          skipped.push({ path, reason: 'too-large' })
          continue
        }
        let text
        try {
          text = await fs.readText(fileTarget, signal)
        } catch {
          skipped.push({ path, reason: 'not-text' })
          continue
        }
        if (text.includes('\u0000') || text.includes('\uFFFD')) {
          skipped.push({ path, reason: 'not-text' })
          continue
        }
        const hash = sha256(text)
        files.push({
          path, hash, bytes: Buffer.byteLength(text, 'utf8'),
          lines: text.split('\n').length, imports: parseImports(text),
        })
        totalBytes += bytes
        if (files.length > cfg.maxFiles) {
          throw wikiError('wiki/limit', ERROR_TEXT.sourceCountMaxFiles)
        }
        if (totalBytes > cfg.maxScanBytes) {
          throw wikiError('wiki/limit', ERROR_TEXT.scanBytesLimit(cfg.maxScanBytes))
        }
      }
    }
    await walk('.')
    files.sort((a, b) => a.path.localeCompare(b.path))
    const info = await detectRevisionInfo()
    const revision = {
      branch: info.branch,
      commit: info.commit,
      fingerprint: sha256(JSON.stringify(files.map((file) => [file.path, file.hash]))),
      scannedAt: new Date().toISOString(),
      fileCount: files.length,
      dirty: false,
      git: info.git,
    }
    scanCache = { files, skipped, revision }
    return scanCache
  }

  const computeChanges = async (scanResult) => {
    const catalog = await readCatalog()
    const changes = []
    for (const edition of catalog?.editions ?? []) {
      const manifest = await readRecordJSON(edition.manifestPath, validateManifest)
      if (!manifest) throw wikiError('wiki/invalid-data', ERROR_TEXT.catalogAbsent)
      if (manifest.revision.branch !== scanResult.revision.branch) continue
      const index = await readIndex(manifest.indexPath)
      const impact = wikiImpact(index, { files: scanResult.files }, manifest.pages)
      changes.push({ language: manifest.language, changed: impact.changed, affected: impact.affected })
    }
    return changes
  }

  /** Source freshness check for search / finish; returns stale page ids. */
  const freshness = async (manifest) => {
    const current = await scan()
    if (current.files.some((file) => isWikiSecret(file.path))) {
      throw wikiError('wiki/invalid-data', ERROR_TEXT.freshnessProhibited)
    }
    if (current.revision.git === false && subprocess !== undefined) {
      throw wikiError('wiki/git-failed', ERROR_TEXT.freshnessGitFailed)
    }
    const currentHashes = new Map(current.files.map((file) => [file.path, file.hash]))
    const index = await readIndex(manifest.indexPath)
    let changedCount = 0
    const stalePaths = new Set()
    for (const file of index.files) {
      if (currentHashes.get(file.path) !== file.hash) {
        changedCount += 1
        stalePaths.add(file.path)
      }
    }
    if (changedCount > cfg.maxFreshnessFiles) {
      throw wikiError('wiki/limit', ERROR_TEXT.freshnessBudget)
    }
    const stalePages = new Set()
    for (const page of manifest.pages) {
      if (page.state !== 'ready' || (page.sources ?? []).some((path) => stalePaths.has(path))) {
        stalePages.add(page.id)
      }
    }
    return { revision: current.revision, stalePages, stalePaths, changedCount }
  }

  return {
    exec, agent, cfg, cwd, root, sessionId, fs, waterfall,
    session, isSessionRunning, resolveSource, resolveWiki, stat,
    ensureWikiDirs, readRecord, readRecordJSON, readSourceRecord, readCatalog,
    readManifest, readIndex, readUserPlan, readContent, writeGuard, writeMutable,
    writeImmutable, updateCatalog, scan, computeChanges, freshness,
    indexPathFor: (index) => `${WIKI_ROOT}/indexes/${sha256(JSON.stringify(index))}.json`,
    isInside,
  }
}
