/**
 * @heywork/knowledge — durable SQLite store.
 *
 * FROM SPEC, NOT COPIED. Implements specs/knowledge.md §3.1 (full table schema,
 * indexes, pragmas, version/snapshot semantics) and the storage half of §二 /
 * §四. All schema/columns/constraints are verbatim from the spec. node:sqlite
 * is injected via deps.sqlite (fallback to node:sqlite built-in via require).
 */

import { createRequire } from 'node:module'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  KNOWLEDGE_SCHEMA_VERSION, COMPATIBLE_SCHEMA_VERSIONS, SQLITE_FILE,
  STRINGS, IDENTITY, REASONS, fail,
} from './deps.js'

const localRequire = createRequire(import.meta.url)
function sqliteModule(deps) {
  return deps?.sqlite ?? localRequire('node:sqlite')
}

/**
 * Full schema (ST:93-141). Every table/column/constraint verbatim per spec §3.1.
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS objects (
  path TEXT PRIMARY KEY,
  bytes INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS lease (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  pid INTEGER NOT NULL,
  token TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bases (
  id TEXT PRIMARY KEY,
  record TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bindings (
  base_id TEXT REFERENCES bases(id),
  workspace_id TEXT,
  PRIMARY KEY (base_id, workspace_id)
);
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  base_id REFERENCES bases(id),
  path TEXT,
  kind TEXT,
  watch INTEGER,
  last_scan TEXT,
  error TEXT,
  UNIQUE (base_id, path)
);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  base_id TEXT,
  name TEXT,
  source_key TEXT,
  title TEXT,
  source_path TEXT,
  source_id TEXT,
  state TEXT,
  enabled INTEGER,
  archived INTEGER,
  error TEXT,
  active_revision TEXT,
  pending_hash TEXT,
  pending_path TEXT,
  bytes INTEGER,
  updated_at TEXT,
  chunk_count INTEGER DEFAULT 0,
  source_version TEXT,
  generation INTEGER DEFAULT 1
);
CREATE UNIQUE INDEX IF NOT EXISTS documents_base_key ON documents(base_id, source_key);
CREATE TABLE IF NOT EXISTS revisions (
  id TEXT PRIMARY KEY,
  document_id TEXT REFERENCES documents(id),
  source_hash TEXT,
  text_path TEXT,
  original_path TEXT,
  created_at TEXT,
  chunk_count INTEGER,
  profile TEXT
);
CREATE TABLE IF NOT EXISTS chunks (
  id TEXT PRIMARY KEY,
  document_id TEXT,
  base_id TEXT,
  revision TEXT REFERENCES revisions(id),
  parent_id TEXT,
  heading TEXT,
  text TEXT,
  parent_text TEXT,
  page INTEGER,
  start_line INTEGER,
  end_line INTEGER,
  vector TEXT,
  profile TEXT
);
CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(chunk_id UNINDEXED, document_id UNINDEXED, text);
CREATE TABLE IF NOT EXISTS experiences (
  id TEXT PRIMARY KEY,
  base_id TEXT REFERENCES bases(id),
  state TEXT,
  updated_at TEXT,
  record TEXT
);
CREATE TABLE IF NOT EXISTS experience_capture_targets (
  base_id TEXT PRIMARY KEY REFERENCES bases(id),
  enabled INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS experience_captures (
  base_id TEXT,
  source_key TEXT,
  experience_id TEXT,
  PRIMARY KEY (base_id, source_key)
);
CREATE TABLE IF NOT EXISTS experience_versions (
  experience_id TEXT,
  revision INTEGER,
  record TEXT,
  PRIMARY KEY (experience_id, revision)
);
CREATE VIRTUAL TABLE IF NOT EXISTS experience_fts USING fts5(experience_id UNINDEXED, text);
CREATE INDEX IF NOT EXISTS documents_base ON documents(base_id, state, archived);
CREATE INDEX IF NOT EXISTS chunks_revision ON chunks(document_id, revision);
CREATE INDEX IF NOT EXISTS experiences_base ON experiences(base_id, state);
`

const now = () => new Date().toISOString()

function isPidAlive(pid, deps = {}) {
  if (!Number.isInteger(pid) || pid <= 0) return false
  if (typeof deps.isPidAlive === 'function') return deps.isPidAlive(pid)
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    return error?.code === 'EPERM'
  }
}

// --- row mappers -----------------------------------------------------------
const parseRecord = (row) => (row ? JSON.parse(row.record) : null)
const toBase = (row) => parseRecord(row)
function toDocument(row) {
  if (!row) return null
  return {
    id: row.id,
    baseId: row.base_id,
    name: row.name,
    title: row.title,
    sourcePath: row.source_path,
    sourceId: row.source_id,
    state: row.state,
    enabled: !!row.enabled,
    archived: !!row.archived,
    error: row.error ?? null,
    revision: row.active_revision ?? null,
    chunkCount: row.chunk_count ?? 0,
    bytes: row.bytes ?? 0,
    updatedAt: row.updated_at,
  }
}
function toSource(row) {
  if (!row) return null
  return {
    id: row.id,
    baseId: row.base_id,
    path: row.path,
    kind: row.kind,
    watch: !!row.watch,
    lastScan: row.last_scan ?? null,
    error: row.error ?? null,
  }
}
const toExperience = (row) => (row ? JSON.parse(row.record) : null)

export class KnowledgeStore {
  constructor(db, root, config, deps, trusted, leaseToken) {
    this.db = db
    this.root = root
    this.config = config
    this.deps = deps
    this.trusted = trusted
    this.leaseToken = leaseToken
    this.healthy = true
  }

  /** Open (or create) a store at <root> (S:153; ST:140-159). */
  static open(root, config, deps = {}) {
    const { DatabaseSync } = sqliteModule(deps)
    const fs = localRequire('node:fs')
    fs.mkdirSync(root, { recursive: true, mode: 0o700 })

    const db = new DatabaseSync(join(root, SQLITE_FILE))
    db.exec(`PRAGMA busy_timeout = ${Math.trunc(config.busyTimeoutMs)};`)
    db.exec('PRAGMA foreign_keys = ON;')
    db.exec('PRAGMA synchronous = FULL;')
    db.exec(`PRAGMA max_page_count = ${Math.floor(config.maxIndexBytes / 4096)};`)

    let version = db.prepare('PRAGMA user_version').get()?.user_version ?? 0
    if (!COMPATIBLE_SCHEMA_VERSIONS.includes(version)) {
      db.close()
      throw new Error(STRINGS.unsupportedSchema)
    }
    db.exec(SCHEMA_SQL)
    if (version !== KNOWLEDGE_SCHEMA_VERSION) {
      db.exec(`PRAGMA user_version = ${KNOWLEDGE_SCHEMA_VERSION};`)
    }

    // Lease (ST:119-132): one writer per home.
    const token = randomUUID()
    let trusted = true
    const existing = db.prepare('SELECT id, pid, token FROM lease WHERE id = 1').get()
    if (existing) {
      if (existing.pid !== process.pid && isPidAlive(existing.pid, deps)) {
        db.close()
        throw new Error(STRINGS.homeInUse)
      }
      db.prepare('DELETE FROM lease WHERE id = 1').run()
    }
    db.prepare('INSERT INTO lease(id, pid, token) VALUES (1, ?, ?)').run(process.pid, token)

    return new KnowledgeStore(db, root, config, deps, trusted, token)
  }

  close() {
    if (!this.healthy) return
    this.healthy = false
    if (this.trusted) {
      try {
        this.db.prepare('DELETE FROM lease WHERE id = 1 AND token = ?').run(this.leaseToken)
      } catch { /* best-effort */ }
    }
    this.db.close()
  }

  // --- teams ---------------------------------------------------------------
  teams() {
    return this.db.prepare('SELECT id, name, created_at FROM teams ORDER BY name').all()
      .map((r) => ({ id: r.id, name: r.name, createdAt: r.created_at }))
  }

  teamByName(name) {
    const row = this.db.prepare('SELECT id, name, created_at FROM teams WHERE name = ?').get(name)
    return row ? { id: row.id, name: row.name, createdAt: row.created_at } : null
  }

  team(id) {
    const row = this.db.prepare('SELECT id, name, created_at FROM teams WHERE id = ?').get(id)
    return row ? { id: row.id, name: row.name, createdAt: row.created_at } : null
  }

  insertTeam(id, name, createdAt) {
    this.db.prepare('INSERT INTO teams(id, name, created_at) VALUES (?, ?, ?)').run(id, name, createdAt)
  }

  teamCount() {
    return this.db.prepare('SELECT COUNT(*) AS n FROM teams').get().n
  }

  // --- bases ---------------------------------------------------------------
  base(id) {
    return parseRecord(this.db.prepare('SELECT record FROM bases WHERE id = ?').get(id))
  }

  bases(includeGlobal = false) {
    const rows = this.db.prepare('SELECT record FROM bases').all()
    return rows.map(parseRecord)
      .filter((b) => includeGlobal || b.id !== IDENTITY.globalExperienceId)
  }

  baseCount() {
    return this.db.prepare(`SELECT COUNT(*) AS n FROM bases WHERE id != ?`)
      .get(IDENTITY.globalExperienceId).n
  }

  insertBase(record) {
    this.db.prepare('INSERT INTO bases(id, record) VALUES (?, ?)')
      .run(record.id, JSON.stringify(record))
  }

  updateBase(id, record) {
    this.db.prepare('UPDATE bases SET record = ? WHERE id = ?')
      .run(JSON.stringify(record), id)
  }

  // --- bindings ------------------------------------------------------------
  bindingsForBase(baseId) {
    return this.db.prepare('SELECT workspace_id FROM bindings WHERE base_id = ? ORDER BY workspace_id')
      .all(baseId).map((r) => r.workspace_id)
  }

  setBindings(baseId, workspaceIds) {
    this.db.prepare('DELETE FROM bindings WHERE base_id = ?').run(baseId)
    const insert = this.db.prepare('INSERT INTO bindings(base_id, workspace_id) VALUES (?, ?)')
    for (const id of workspaceIds) insert.run(baseId, id)
  }

  baseIdsForWorkspace(workspaceId) {
    return this.db.prepare('SELECT base_id FROM bindings WHERE workspace_id = ?')
      .all(workspaceId).map((r) => r.base_id)
  }

  // --- sources -------------------------------------------------------------
  sources(baseId = null) {
    const rows = baseId
      ? this.db.prepare('SELECT * FROM sources WHERE base_id = ? ORDER BY id').all(baseId)
      : this.db.prepare('SELECT * FROM sources ORDER BY id').all()
    return rows.map(toSource)
  }

  source(id) { return toSource(this.db.prepare('SELECT * FROM sources WHERE id = ?').get(id)) }

  sourceByPath(baseId, path) {
    return toSource(this.db.prepare('SELECT * FROM sources WHERE base_id = ? AND path = ?').get(baseId, path))
  }

  insertSource(row) {
    this.db.prepare(`INSERT INTO sources(id, base_id, path, kind, watch, last_scan, error)
      VALUES (?, ?, ?, ?, ?, ?, ?)`)
      .run(row.id, row.baseId, row.path, row.kind, row.watch ? 1 : 0, row.lastScan ?? null, row.error ?? null)
  }

  updateSource(id, patch) {
    const fields = []
    const values = []
    for (const [column, value] of Object.entries(patch)) {
      fields.push(`${column} = ?`)
      values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value)
    }
    if (fields.length === 0) return
    values.push(id)
    this.db.prepare(`UPDATE sources SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  }

  setWatch(id, watch) {
    const result = this.db.prepare('UPDATE sources SET watch = ? WHERE id = ?').run(watch ? 1 : 0, id)
    return result.changes > 0
  }

  deleteSource(id) {
    this.db.prepare('DELETE FROM sources WHERE id = ?').run(id)
  }

  // --- documents -----------------------------------------------------------
  document(id) { return toDocument(this.db.prepare('SELECT * FROM documents WHERE id = ?').get(id)) }

  documentByKey(baseId, sourceKey) {
    return toDocument(this.db.prepare('SELECT * FROM documents WHERE base_id = ? AND source_key = ?')
      .get(baseId, sourceKey))
  }

  documents(baseId, includeArchived = false) {
    const sql = includeArchived
      ? 'SELECT * FROM documents WHERE base_id = ? ORDER BY name'
      : 'SELECT * FROM documents WHERE base_id = ? AND archived = 0 ORDER BY name'
    return this.db.prepare(sql).all(baseId).map(toDocument)
  }

  documentCount() { return this.db.prepare('SELECT COUNT(*) AS n FROM documents').get().n }

  insertDocument(row) {
    this.db.prepare(`INSERT INTO documents
      (id, base_id, name, source_key, title, source_path, source_id, state, enabled,
       archived, error, active_revision, pending_hash, pending_path, bytes, updated_at,
       chunk_count, source_version, generation)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(
        row.id, row.baseId, row.name, row.sourceKey, row.title, row.sourcePath ?? null,
        row.sourceId ?? null, row.state, row.enabled ? 1 : 0, row.archived ? 1 : 0,
        row.error ?? null, row.activeRevision ?? null, row.pendingHash ?? null,
        row.pendingPath ?? null, row.bytes ?? 0, row.updatedAt ?? now(),
        row.chunkCount ?? 0, row.sourceVersion ?? null, row.generation ?? 1,
      )
  }

  updateDocument(id, patch) {
    const columns = {
      name: 'name', sourceKey: 'source_key', title: 'title', sourcePath: 'source_path',
      sourceId: 'source_id', state: 'state', enabled: 'enabled', archived: 'archived',
      error: 'error', activeRevision: 'active_revision', pendingHash: 'pending_hash',
      pendingPath: 'pending_path', bytes: 'bytes', updatedAt: 'updated_at',
      chunkCount: 'chunk_count', sourceVersion: 'source_version', generation: 'generation',
    }
    const fields = []
    const values = []
    for (const [key, value] of Object.entries(patch)) {
      const col = columns[key]
      if (!col) continue
      fields.push(`${col} = ?`)
      values.push(typeof value === 'boolean' ? (value ? 1 : 0) : (value ?? null))
    }
    if (fields.length === 0) return
    values.push(id)
    this.db.prepare(`UPDATE documents SET ${fields.join(', ')} WHERE id = ?`).run(...values)
  }

  /** nextJob (ST:437-450): oldest queued, unarchived, base-unarchived job. */
  nextJob(excluded = [], archivedBaseIds = []) {
    const rows = this.db.prepare(`SELECT d.*, b.record AS base_record FROM documents d
      JOIN bases b ON b.id = d.base_id
      WHERE d.state = 'queued' AND d.archived = 0
      ORDER BY d.updated_at ASC`).all()
    for (const row of rows) {
      if (excluded.includes(row.id)) continue
      if (archivedBaseIds.includes(row.base_id)) continue
      try {
        if (parseRecord({ record: row.base_record })?.archived) continue
      } catch { /* a malformed base is not a reason to stall the queue */ }
      const result = this.db.prepare(`UPDATE documents SET state = 'processing' WHERE id = ? AND state = 'queued'`).run(row.id)
      if (result.changes > 0) return toDocument(row)
    }
    return null
  }

  /** publish (ST:460-483): atomic generation/hash/state guard. */
  publish(documentId, generation, pendingHash, revision) {
    const result = this.db.prepare(`UPDATE documents
      SET active_revision = ?, state = 'ready', error = NULL, chunk_count = ?
      WHERE id = ? AND generation = ? AND pending_hash = ? AND state = 'processing' AND archived = 0`)
      .run(revision.id, revision.chunkCount ?? 0, documentId, generation, pendingHash)
    return result.changes > 0
  }

  /** Cancel jobs of a base: processing -> queued, generation+1 (S:811-820). */
  cancelBaseJobs(baseId) {
    this.db.prepare(`UPDATE documents
      SET state = 'queued', generation = generation + 1, error = NULL
      WHERE base_id = ? AND state = 'processing'`).run(baseId)
  }

  /** Mode change / retry / admit: requeue document with generation+1. */
  requeueDocument(documentId, clearError = true) {
    this.db.prepare(`UPDATE documents SET state = 'queued', generation = generation + 1,
      error = ${clearError ? 'NULL' : 'error'} WHERE id = ?`).run(documentId)
  }

  // --- revisions & chunks --------------------------------------------------
  insertRevision(row) {
    this.db.prepare(`INSERT INTO revisions
      (id, document_id, source_hash, text_path, original_path, created_at, chunk_count, profile)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(row.id, row.documentId, row.sourceHash, row.textPath, row.originalPath,
        row.createdAt, row.chunkCount, row.profile ?? null)
  }

  revision(documentId, id) {
    const row = this.db.prepare('SELECT * FROM revisions WHERE document_id = ? AND id = ?').get(documentId, id)
    return row || null
  }

  revisions(documentId, limit) {
    return this.db.prepare(`SELECT * FROM revisions WHERE document_id = ?
      ORDER BY created_at DESC LIMIT ?`).all(documentId, limit)
  }

  insertChunk(row) {
    this.db.prepare(`INSERT INTO chunks
      (id, document_id, base_id, revision, parent_id, heading, text, parent_text,
       page, start_line, end_line, vector, profile)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(row.id, row.documentId, row.baseId, row.revision, row.parentId, row.heading,
        row.text, row.parentText, row.page ?? null, row.startLine, row.endLine,
        row.vector ?? null, row.profile ?? null)
  }

  /** One parent channel per GROUP BY parent_id (ST:475). */
  passages(documentId, revisionId, limit, offset = 0) {
    return this.db.prepare(`SELECT * FROM chunks
      WHERE document_id = ? AND revision = ?
      GROUP BY parent_id ORDER BY start_line ASC, id ASC LIMIT ? OFFSET ?`)
      .all(documentId, revisionId, limit, offset)
  }

  /** For a given revision, group child vectors by parent (used by retrieval). */
  chunksForRevision(revisionId) {
    return this.db.prepare('SELECT * FROM chunks WHERE revision = ? ORDER BY parent_id, start_line, id')
      .all(revisionId)
  }

  rebuildFts() {
    this.db.exec('DELETE FROM knowledge_fts;')
    const rows = this.db.prepare('SELECT id, document_id, text FROM chunks WHERE text IS NOT NULL').all()
    const insert = this.db.prepare('INSERT INTO knowledge_fts(chunk_id, document_id, text) VALUES (?, ?, ?)')
    for (const row of rows) insert.run(row.id, row.document_id, row.text)
  }

  ftsSearch(query, limit) {
    try {
      return this.db.prepare(`SELECT chunk_id FROM knowledge_fts
        WHERE knowledge_fts MATCH ? ORDER BY bm25(knowledge_fts) LIMIT ?`).all(query, limit)
    } catch {
      return []
    }
  }

  deleteDocumentChunks(documentId) {
    this.db.prepare('DELETE FROM chunks WHERE document_id = ?').run(documentId)
    this.rebuildFts()
  }

  // --- objects -------------------------------------------------------------
  trackObject(path, bytes) {
    this.db.prepare(`INSERT INTO objects(path, bytes) VALUES (?, ?)
      ON CONFLICT(path) DO UPDATE SET bytes = excluded.bytes`).run(path, bytes)
  }

  storedBytes() { return this.db.prepare('SELECT COALESCE(SUM(bytes), 0) AS n FROM objects').get().n }

  // --- experiences ---------------------------------------------------------
  experience(id) { return toExperience(this.db.prepare('SELECT record FROM experiences WHERE id = ?').get(id)) }

  insertExperience(record) {
    this.db.prepare(`INSERT INTO experiences(id, base_id, state, updated_at, record)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET base_id=excluded.base_id, state=excluded.state,
        updated_at=excluded.updated_at, record=excluded.record`)
      .run(record.id, record.baseId, record.state, record.updatedAt, JSON.stringify(record))
  }

  deleteExperience(id) {
    this.db.prepare('DELETE FROM experiences WHERE id = ?').run(id)
    this.db.prepare('DELETE FROM experience_versions WHERE experience_id = ?').run(id)
    this.rebuildExperienceFts()
  }

  experiences(baseId, state, ftsQuery, limit, offset) {
    let rows
    if (ftsQuery) {
      rows = this.db.prepare(`SELECT e.record FROM experiences e
        JOIN experience_fts f ON f.experience_id = e.id
        WHERE e.base_id = ? AND (? = 'all' OR e.state = ?) AND experience_fts MATCH ?
        ORDER BY e.updated_at DESC, e.id LIMIT ? OFFSET ?`)
        .all(baseId, state, state, ftsQuery, limit, offset)
    } else {
      rows = this.db.prepare(`SELECT record FROM experiences
        WHERE base_id = ? AND (? = 'all' OR state = ?)
        ORDER BY updated_at DESC, id LIMIT ? OFFSET ?`)
        .all(baseId, state, state, limit, offset)
    }
    return rows.map(toExperience)
  }

  experienceCount(baseId, state, ftsQuery) {
    if (ftsQuery) {
      return this.db.prepare(`SELECT COUNT(*) AS n FROM experiences e
        JOIN experience_fts f ON f.experience_id = e.id
        WHERE e.base_id = ? AND (? = 'all' OR e.state = ?) AND experience_fts MATCH ?`)
        .get(baseId, state, state, ftsQuery).n
    }
    return this.db.prepare(`SELECT COUNT(*) AS n FROM experiences
      WHERE base_id = ? AND (? = 'all' OR state = ?)`).get(baseId, state, state).n
  }

  insertExperienceVersion(experienceId, revision, record) {
    this.db.prepare(`INSERT OR REPLACE INTO experience_versions(experience_id, revision, record)
      VALUES (?, ?, ?)`).run(experienceId, revision, JSON.stringify(record))
  }

  experienceVersion(experienceId, revision) {
    const row = this.db.prepare(`SELECT record FROM experience_versions
      WHERE experience_id = ? AND revision = ?`).get(experienceId, revision)
    return row ? JSON.parse(row.record) : null
  }

  experienceVersions(experienceId, limit, offset) {
    return this.db.prepare(`SELECT record FROM experience_versions
      WHERE experience_id = ? ORDER BY revision DESC LIMIT ? OFFSET ?`)
      .all(experienceId, limit, offset).map((r) => JSON.parse(r.record))
  }

  experienceVersionCount(experienceId) {
    return this.db.prepare('SELECT COUNT(*) AS n FROM experience_versions WHERE experience_id = ?')
      .get(experienceId).n
  }

  rebuildExperienceFts() {
    this.db.exec('DELETE FROM experience_fts;')
    const rows = this.db.prepare('SELECT id, record FROM experiences').all()
    const insert = this.db.prepare('INSERT INTO experience_fts(experience_id, text) VALUES (?, ?)')
    for (const row of rows) {
      const rec = JSON.parse(row.record)
      const text = [rec.title, rec.symptom, rec.cause, rec.solution, rec.applicability,
        rec.exclusions, ...(rec.technologies ?? [])].filter((v) => typeof v === 'string').join('\n')
      insert.run(row.id, text)
    }
  }

  experienceFtsSearch(query, limit) {
    try {
      return this.db.prepare(`SELECT experience_id FROM experience_fts
        WHERE experience_fts MATCH ? ORDER BY bm25(experience_fts) LIMIT ?`).all(query, limit)
    } catch {
      return []
    }
  }

  // --- capture targets / dedup --------------------------------------------
  captureEnabled(baseId) {
    const row = this.db.prepare('SELECT enabled FROM experience_capture_targets WHERE base_id = ?').get(baseId)
    return row ? !!row.enabled : false
  }

  setCaptureEnabled(baseId, enabled) {
    this.db.prepare(`INSERT INTO experience_capture_targets(base_id, enabled) VALUES (?, ?)
      ON CONFLICT(base_id) DO UPDATE SET enabled = excluded.enabled`)
      .run(baseId, enabled ? 1 : 0)
  }

  hasCapture(baseId, sourceKey) {
    return !!this.db.prepare('SELECT 1 FROM experience_captures WHERE base_id = ? AND source_key = ?')
      .get(baseId, sourceKey)
  }

  addCapture(baseId, sourceKey, experienceId) {
    this.db.prepare(`INSERT OR IGNORE INTO experience_captures(base_id, source_key, experience_id)
      VALUES (?, ?, ?)`).run(baseId, sourceKey, experienceId)
  }

  /** total candidate/reviewed experiences across all bases (global + collections). */
  allReviewableExperienceCount() {
    return this.db.prepare(`SELECT COUNT(*) AS n FROM experiences WHERE state = 'reviewed'`).get().n
  }
}

export { now }
