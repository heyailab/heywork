/**
 * Self-test for @heywork/knowledge.
 *
 * FROM SPEC — asserts external behavior from specs/knowledge.md §一–§八.
 * Uses injected mocks (temp home + real node:sqlite) — no @deepseek-ai/*.
 * Run: node --experimental-sqlite packages/heywork-knowledge/test-knowledge.mjs
 */

import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

import {
  apply, name, inject, IDENTITY, DEFAULTS, STRINGS, REASONS, REMOTE_IDS,
  RemoteError, validateConfig, KnowledgeEmbeddings, KnowledgeService,
} from './src/index.js'
import { KNOWLEDGE_SCHEMA_VERSION } from './src/deps.js'

const checks = []
function check(label, fn) {
  try {
    const result = fn()
    if (result && typeof result.then === 'function') {
      return result.then((value) => { checks.push([label, true]); return value })
        .catch((error) => { checks.push([label, false, error]); throw error })
    }
    checks.push([label, true])
    return result
  } catch (error) {
    checks.push([label, false, error])
    throw error
  }
}
const ok = (condition, message) => assert.ok(condition, message)
const eq = (actual, expected, message) => assert.equal(actual, expected, message)

// --- injected mocks --------------------------------------------------------
const { DatabaseSync } = await import('node:sqlite')
const home = mkdtempSync(join(tmpdir(), 'heywork-knowledge-'))
const registered = []
const ctx = {
  services: {},
  logger: { warn() {} },
  workspaceRegistry: { has: () => true },
}
const config = {
  dshHome: home,
  resolveDshHome: (value) => value,
  sqlite: { DatabaseSync },
  registerRemote: (descriptor) => registered.push(descriptor),
  isWorkspaceRegistered: () => true,
  // NO embedding config => profile null (fulltext-only), no network.
}

// helper: assert the frozen RemoteError code + message + reason verbatim
async function assertReasonAsync(fn, reason, label) {
  try {
    await fn()
    throw new Error(`${label}: expected throw`)
  } catch (error) {
    ok(error instanceof RemoteError, `${label}: expected RemoteError, got ${error?.name}`)
    eq(error.code, 'knowledge/failed', `${label}: frozen code`)
    eq(error.message, 'The knowledge operation could not be completed', `${label}: frozen message`)
    eq(error.details.reason, reason, `${label}: frozen reason`)
  }
}

// ===== 1. plugin exports & service registration ============================
await check('exports: name/inject frozen', () => {
  eq(name, 'heywork-knowledge')
  eq(JSON.stringify(inject), JSON.stringify(['typert', 'workspaceRegistry', 'officeKit', 'credentials']))
  eq(IDENTITY.service, 'knowledge')
  eq(IDENTITY.errorCode, 'knowledge/failed')
  eq(IDENTITY.errorMessage, 'The knowledge operation could not be completed')
})

const service = await check('apply registers service + Remote', async () => {
  const s = apply(ctx, config)
  await s.ready
  eq(s.name, 'knowledge')
  ok(s === ctx.services.knowledge, 'service registered on ctx.services.knowledge')
  eq(registered.length, 25, 'exactly 25 Remote methods')
  return s
})

await check('Remote descriptors shape (§五)', () => {
  eq(REMOTE_IDS.length, 25)
  for (const id of REMOTE_IDS) ok(id.startsWith('knowledge/'), `${id} prefix`)
  const catalog = registered.find((d) => d.id === 'knowledge/catalog')
  ok(catalog, 'catalog descriptor exists')
  eq(catalog.parameters.length, 0, 'catalog has no request parameter')
  eq(catalog.invocation.kind, 'direct')
  eq(catalog.cancellation.parameter, 'signal')
  for (const d of registered) {
    eq(d.service, 'knowledge', `${d.id} service`)
    eq(d.cancellation.parameter, 'signal', `${d.id} signal`)
    if (d.id !== 'knowledge/catalog') eq(d.parameters[0].source, 'json', `${d.id} json source`)
  }
})

// ===== 2. Config validation (spec §1.3) ====================================
await check('Config defaults frozen', () => {
  eq(DEFAULTS.maxBases, 100)
  eq(DEFAULTS.maxStoredBytes, 2147483648)
  eq(DEFAULTS.maxFileBytes, 20971520)
  eq(DEFAULTS.maxTextBytes, 4194304)
  eq(DEFAULTS.overlapChars, 80)
  eq(DEFAULTS.childChars, 500)
  eq(DEFAULTS.parentChars, 1800)
  eq(DEFAULTS.minVectorSimilarity, 0.4)
  eq(JSON.stringify(DEFAULTS.excludeDirectories),
    JSON.stringify(['.git', '.hey', 'node_modules', 'vendor', 'dist', 'lib', 'build', '.cache']))
  eq(DEFAULTS.queryPrefix, '')
  eq(DEFAULTS.documentPrefix, '')
  const cfg = validateConfig({ dshHome: home, resolveDshHome: (v) => v, sqlite: { DatabaseSync } })
  eq(cfg.maxBases, 100)
  eq(cfg.searchLimit, 8)
})

await check('Config: sizes native error (verbatim)', () => {
  assert.throws(
    () => validateConfig({ overlapChars: 500, childChars: 500 }),
    (e) => e instanceof Error && !(e instanceof RemoteError) && e.message === STRINGS.sizes,
  )
  assert.throws(
    () => validateConfig({ childChars: 2000, parentChars: 1800 }),
    (e) => e.message === 'Knowledge passage sizes require overlap < child <= parent',
  )
})

await check('Config: embedding constructor native errors (verbatim)', () => {
  assert.throws(
    () => new KnowledgeEmbeddings({ embeddingUrl: 'http://example.com' }, {}),
    (e) => e.message === 'incomplete-embedding-configuration',
  )
  assert.throws(
    () => new KnowledgeEmbeddings({ embeddingUrl: 'ftp://example.com', embeddingModel: 'm', embeddingKeyRef: 'k' }, {}),
    (e) => e.message === 'invalid-embedding-url',
  )
  assert.throws(
    () => new KnowledgeEmbeddings({ embeddingUrl: 'http://u:p@example.com', embeddingModel: 'm', embeddingKeyRef: 'k' }, {}),
    (e) => e.message === 'invalid-embedding-url',
  )
  const disabled = new KnowledgeEmbeddings({ embeddingUrl: undefined, embeddingModel: undefined, embeddingKeyRef: undefined }, {})
  eq(disabled.profile, null)
})

// ===== 3. SQLite schema (spec §3.1) ========================================
await check('SQLite schema: tables / indexes / user_version', () => {
  const db = service.store.db
  eq(db.prepare('PRAGMA user_version').get().user_version, KNOWLEDGE_SCHEMA_VERSION)
  const names = new Set(db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table'`).all().map((r) => r.name))
  const expected = [
    'objects', 'lease', 'teams', 'bases', 'bindings', 'sources', 'documents',
    'revisions', 'chunks', 'experiences', 'experience_capture_targets',
    'experience_captures', 'experience_versions',
  ]
  for (const table of expected) ok(names.has(table), `missing table ${table}`)
  const virtual = new Set(db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' AND sql LIKE '%VIRTUAL%'`).all().map((r) => r.name))
  ok(virtual.has('knowledge_fts') || names.has('knowledge_fts'), 'knowledge_fts exists')
  ok(virtual.has('experience_fts') || names.has('experience_fts'), 'experience_fts exists')
  const indexes = new Set(db.prepare(`SELECT name FROM sqlite_master WHERE type = 'index'`).all().map((r) => r.name))
  for (const idx of ['documents_base', 'chunks_revision', 'experiences_base']) {
    ok(indexes.has(idx), `missing index ${idx}`)
  }
  const cols = db.prepare('PRAGMA table_info(documents)').all().map((r) => r.name)
  for (const col of ['generation', 'active_revision', 'pending_hash', 'chunk_count', 'source_version']) {
    ok(cols.includes(col), `documents.${col}`)
  }
  eq(db.prepare('SELECT sql FROM sqlite_master WHERE name = ?').get('lease')?.sql.includes('CHECK(id = 1)'), true)
})

// ===== 4. collections: createTeam / createBase / catalog / detail =========
const team = await check('createTeam idempotent', async () => {
  const t = await service.createTeam({ name: 'Alpha' }, undefined)
  ok(t.id && t.name === 'Alpha' && t.createdAt)
  const again = await service.createTeam({ name: 'Alpha' }, undefined)
  eq(again.id, t.id, 'same-name returns existing team')
  return t
})

const base = await check('createBase + catalog + detail', async () => {
  const b = await service.createBase({
    name: 'Docs', description: '', kind: 'project', teamId: null,
    workspaceIds: ['ws-1'], mode: 'fulltext', enabled: true,
  }, undefined)
  ok(b.id && b.documentCount === 0 && b.readyCount === 0 && b.archived === false)
  const cat = await service.catalog(undefined)
  eq(cat.bases.length, 1)
  eq(cat.embeddingsConfigured, false)
  eq(cat.storedBytes, 0)
  eq(cat.maxFileBytes, DEFAULTS.maxFileBytes)
  ok(!('globalExperience' in cat), 'no global experience yet')
  const detail = await service.detail({ id: b.id }, undefined)
  eq(detail.documents.length, 0)
  eq(detail.sources.length, 0)
  return b
})

await check('createBase: project needs exactly one workspace (zod verbatim)', async () => {
  assert.throws(
    () => service.validateBaseInput({
      name: 'Bad', kind: 'project', teamId: null, workspaceIds: [], mode: 'fulltext',
    }),
    (e) => e.message === 'A project collection requires exactly one imported workspace',
  )
  assert.throws(
    () => service.validateBaseInput({
      name: 'Bad', kind: 'team', teamId: null, workspaceIds: [], mode: 'fulltext',
    }),
    (e) => e.message === 'A team collection requires a team grouping',
  )
  assert.throws(
    () => service.validateBaseInput({
      name: 'Bad', kind: 'project', teamId: null, workspaceIds: ['ws', 'ws'], mode: 'fulltext',
    }),
    (e) => e.message === 'Workspace bindings must be unique',
  )
})

// ===== 5. import (note) + queue + citation + search ========================
await check('note -> parse queue -> ready document', async () => {
  const receipt = await service.note({
    baseId: base.id, name: 'guide', text: '# Guide\n\nHello retrieval world.\n',
  }, undefined)
  eq(receipt.queued, 1)
  eq(receipt.unchanged, 0)
  await service.waitForIdle()
  const detail = await service.detail({ id: base.id }, undefined)
  eq(detail.documents.length, 1)
  eq(detail.documents[0].state, 'ready')
  ok(detail.documents[0].revision, 'has active revision')
  return detail.documents[0]
})

const doc = await check('document: passages + citations source format', async () => {
  const detail = await service.detail({ id: base.id }, undefined)
  const result = await service.document({ id: detail.documents[0].id, offset: 0 }, undefined)
  eq(result.hasMore, false)
  eq(result.nextOffset, DEFAULTS.previewPassages)
  ok(result.revisions.length >= 1)
  ok(result.passages.length >= 1, 'at least one passage')
  const passage = result.passages[0]
  ok(passage.textPath.includes('/citations/'), 'citation textPath under citations/')
  ok(passage.textPath.endsWith('.md'), 'citation is markdown')
  ok(result.passages.every((p) => p.id.includes('/p') && p.id.includes('-c')), 'chunk id = <revision>/<parent>-c<n>')
  return result
})

await check('search: fulltext hits with source #L marker', async () => {
  const result = await service.search({ query: 'retrieval', baseIds: [], workspaceId: undefined }, undefined)
  eq(result.mode, 'fulltext')
  ok(result.hits.length >= 1, 'hit found')
  ok(/#L\d+$/.test(result.hits[0].source), 'source ends with #L<line>')
  ok(result.hits[0].source.includes('citations%2F') || result.hits[0].source.includes('citations'),
    'source URL-encodes citation path')
  const noCandidate = await service.search({ query: 'retrieval', baseIds: [randomUUID()] }, undefined)
  eq(noCandidate.mode, 'fulltext')
  eq(noCandidate.hits.length, 0)
})

await check('empty query -> zod native error', async () => {
  await assert.rejects(() => service.search({ query: '   ' }, undefined),
    (e) => !(e instanceof RemoteError) && typeof e.message === 'string')
})

// ===== 6. error texts verbatim (>= 5) ======================================
await check('errors: RemoteError reason codes verbatim', async () => {
  const unknown = randomUUID()
  await assertReasonAsync(() => service.base(unknown), 'base-not-found', 'base-not-found')
  await assertReasonAsync(() => service.documentRow(unknown), 'document-not-found', 'document-not-found')
  await assertReasonAsync(() => service.watchSource({ id: unknown, watch: true }, undefined), 'source-not-found', 'source-not-found')
  await assertReasonAsync(() => service.syncSource({ id: unknown }, undefined), 'source-not-found', 'source-not-found')
  await assertReasonAsync(() => service.archiveBase({ id: unknown, archived: true }, undefined), 'base-not-found', 'archive missing base')
  await assertReasonAsync(() => service.updateDocument({ id: unknown, enabled: true, archived: false, title: 'x' }, undefined),
    'document-not-found', 'document-not-found')
  await assertReasonAsync(() => service.retryDocument({ id: unknown }, undefined), 'document-not-found', 'document-not-found')
  await assertReasonAsync(() => service.experienceCapture({ baseId: unknown }, undefined), 'base-not-found', 'base-not-found')
})

await check('errors: import / restore reasons verbatim', async () => {
  await assertReasonAsync(
    () => service.upload({ baseId: base.id, name: 'bad.exe', base64: '' }, undefined),
    'unsupported-format', 'unsupported-format',
  )
  await assertReasonAsync(
    () => service.importLocal({ baseId: base.id, path: 'relative/file.md', kind: 'auto', watch: false }, undefined),
    'absolute-source-required', 'absolute-source-required',
  )
  const detail = await service.detail({ id: base.id }, undefined)
  const id = detail.documents[0].id
  await assertReasonAsync(
    () => service.restoreRevision({ id, revision: 'missing' }, undefined),
    'revision-not-found', 'revision-not-found',
  )
  await assertReasonAsync(
    () => service.original({ id, revision: 'missing' }, undefined),
    'revision-not-found', 'revision-not-found',
  )
})

await check('errors: validateBaseInput zod messages verbatim', async () => {
  await assertReasonAsync(
    () => service.createBase({
      name: 'Hybrid', kind: 'project', teamId: null, workspaceIds: ['ws-x'],
      mode: 'hybrid', enabled: true,
    }, undefined),
    'embedding-not-configured', 'embedding-not-configured',
  )
})

// ===== 7. experiences core path ============================================
await check('global experience ensure + save + transition + list + delete', async () => {
  service.ensureGlobalExperience(undefined)
  const cat = await service.catalog(undefined)
  ok(cat.globalExperience, 'global experience created')
  eq(cat.globalExperience.description, STRINGS.globalBaseSummary)

  const content = {
    title: 'Use SQLite WAL', symptom: 'writes slow', cause: 'locking', solution: 'enable WAL',
    applicability: 'local indexes', exclusions: [], technologies: ['sqlite'], references: [{ kind: 'source', id: 'r1' }],
  }
  const saved = await service.saveExperience({
    baseId: IDENTITY.globalExperienceId, id: null, expectedRevision: null, content,
  }, undefined)
  eq(saved.state, 'candidate')
  eq(saved.revision, 1)

  await assertReasonAsync(
    () => service.transitionExperience({
      id: saved.id, expectedRevision: 1, state: 'reviewed', review: '', supersededBy: null,
    }, undefined),
    'experience-review-incomplete', 'experience-review-incomplete',
  )
  const reviewed = await service.transitionExperience({
    id: saved.id, expectedRevision: 1, state: 'reviewed', review: 'approved', supersededBy: null,
  }, undefined)
  eq(reviewed.state, 'reviewed')
  eq(reviewed.revision, 2)

  const listed = await service.listExperiences({
    baseId: IDENTITY.globalExperienceId, query: 'SQLite', state: 'reviewed', offset: 0, limit: 10,
  }, undefined)
  ok(listed.total >= 1)

  const history = await service.experienceHistory({ id: saved.id, offset: 0, limit: 10 }, undefined)
  eq(history.total, 2)

  const deleted = await service.deleteExperience({ id: saved.id, expectedRevision: 2 }, undefined)
  eq(deleted, true)
})

await check('activeForWorkspace / forWorkspace', async () => {
  eq(service.activeForWorkspace('ws-1'), true)
  eq(service.activeForWorkspace('ws-unknown'), false)
  const result = await service.forWorkspace('ws-1', 'retrieval', undefined)
  eq(result.mode, 'fulltext')
})

// ===== summary =============================================================
service.close()
rmSync(home, { recursive: true, force: true })

const failed = checks.filter(([, passed]) => !passed)
console.log(`\n[knowledge self-test] ${checks.length - failed.length}/${checks.length} checks passed`)
for (const label of checks) console.log(`  ${label[1] ? 'PASS' : 'FAIL'}  ${label[0]}`)
if (failed.length) {
  for (const [, , error] of failed) console.error(error)
  process.exit(1)
}
console.log('ALL CHECKS PASSED (exit 0)')
