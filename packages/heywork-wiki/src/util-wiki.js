/**
 * @heywork/wiki — portable dsh-util-repo-wiki surface, implemented locally.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-util-repo-wiki/lib/.
 * Constants, regexes, validators and helpers implement the external behavior
 * described in specs/wiki.md §4. No @deepseek-ai/* package is imported;
 * `node:crypto` supplies SHA-256 and `Intl.Segmenter` supplies CJK tokenization.
 * Zod is not available in this workspace, so schema checks are implemented
 * locally with the same constraints and plain Error messages (spec §2.4
 * notes zod's own text is version-dependent and not frozen).
 */

import { createHash } from 'node:crypto'
import { CONTROL, ERROR_TEXT, WIKI, wikiError } from './deps.js'

export const WIKI_LANGUAGES = WIKI.LANGUAGES
export const WIKI_ROOT = WIKI.ROOT
export const MAX_WIKI_PAGES = WIKI.MAX_PAGES
export const MAX_WIKI_CARDS = WIKI.MAX_CARDS

/** SHA-256 hex, lowercase (spec §1 content hash). */
export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex')
}

const isString = (v) => typeof v === 'string'
const isInt = (v) => Number.isInteger(v)
const fail = (message) => { throw new Error(message) }

// --- §4.2 sourcePathSchema -------------------------------------------------
/** Repository-relative path: 1–1024 chars, no absolute/drive/control/empty/dot segments. */
export function parseSourcePath(path) {
  if (!isString(path) || path.length < 1 || path.length > 1024
      || path.startsWith('/') || path.startsWith('\\')
      || /^[A-Za-z]:/.test(path) || /[\x00-\x1f\x7f]/.test(path)
      || path.split(/[\\/]/).some((segment) => segment === '' || segment === '.' || segment === '..')) {
    fail(ERROR_TEXT.repositoryRelativePath)
  }
  return path
}

export function isPageId(value) {
  return isString(value) && WIKI.PAGE_ID_RE.test(value)
}

export function isHash(value) {
  return isString(value) && WIKI.HASH_RE.test(value)
}

// --- §4.3 isWikiSecret -----------------------------------------------------
const SECRET_SEGMENT_RE = /^(?:\.env(?:\..*)?|\.credentials(?:\..*)?|credentials(?:\..*)?|id_(?:rsa|ed25519)|\.npmrc|\.pypirc|\.netrc)$/i
const SECRET_SUFFIX_RE = /\.(?:pem|p12|pfx|key|keystore)$/i

export function isWikiSecret(path) {
  if (!isString(path)) return false
  if (SECRET_SUFFIX_RE.test(path)) return true
  return path.split(/[\\/]/).some((segment) => SECRET_SEGMENT_RE.test(segment))
}

// --- §4.3 validateWikiTree -------------------------------------------------
export function validateWikiTree(pages) {
  const seen = new Set()
  for (const page of pages ?? []) {
    if (seen.has(page.id)) fail(ERROR_TEXT.treeDuplicateId)
    seen.add(page.id)
  }
  for (const page of pages ?? []) {
    let cursor = page
    const chain = new Set([cursor.id])
    while (cursor?.parent != null) {
      if (chain.has(cursor.parent)) fail(ERROR_TEXT.treeCycle)
      const parent = (pages ?? []).find((candidate) => candidate.id === cursor.parent)
      if (!parent) fail(ERROR_TEXT.treeAbsentParent(cursor.parent))
      chain.add(parent.id)
      cursor = parent
    }
  }
}

// --- §4.3 wikiImpact -------------------------------------------------------
/** Compare file hashes; propagate along import dependencies to affected pages. */
export function wikiImpact(previous, current, pages) {
  const before = new Map((previous?.files ?? []).map((file) => [file.path, file.hash]))
  const after = new Map((current?.files ?? []).map((file) => [file.path, file.hash]))
  const changedSet = new Set()
  for (const [path, hash] of after) {
    if (!before.has(path) || before.get(path) !== hash) changedSet.add(path)
  }
  for (const [path, hash] of before) {
    if (!after.has(path) || after.get(path) !== hash) changedSet.add(path)
  }
  const changed = [...changedSet].sort((a, b) => a.localeCompare(b))

  const importsOf = (path) => (after.get(path) === undefined
    ? (previous?.files ?? []).find((f) => f.path === path)?.imports ?? []
    : (current.files ?? []).find((f) => f.path === path)?.imports ?? [])
  const affectedSet = new Set()
  for (const page of pages ?? []) {
    if (page.state !== 'ready') {
      affectedSet.add(page.id)
      continue
    }
    const sources = page.sources ?? []
    if (sources.some((path) => changedSet.has(path))) {
      affectedSet.add(page.id)
      continue
    }
    // Structural change (added/removed file) reaches every root page.
    const structural = changed.some((path) => !before.has(path) || !after.has(path))
    if (structural && page.parent == null) {
      affectedSet.add(page.id)
      continue
    }
    const deps = new Set(page.dependencies ?? [])
    for (const source of sources) {
      for (const imported of importsOf(source)) deps.add(imported)
    }
    if ([...deps].some((path) => changedSet.has(path))) affectedSet.add(page.id)
  }
  return { changed, affected: [...affectedSet].sort((a, b) => a.localeCompare(b)) }
}

// --- §4.3 validateWikiReference --------------------------------------------
export function validateWikiReference(reference, files) {
  const file = (files ?? []).find((entry) => entry.path === reference.path)
  if (!file || file.hash !== reference.hash
      || !isInt(reference.start) || !isInt(reference.end)
      || reference.start < 1 || reference.end < reference.start
      || reference.end > file.lines) {
    fail(ERROR_TEXT.unverifiedReference(reference))
  }
}

// --- §4.3 wikiSearchTokens -------------------------------------------------
export function wikiSearchTokens(query) {
  if (!isString(query) || query.length === 0) return []
  const lower = query.toLowerCase()
  const Segmenter = globalThis.Intl?.Segmenter
  let pieces
  if (Segmenter) {
    const segmenter = new Segmenter('zh', { granularity: 'word' })
    pieces = [...segmenter.segment(lower)].filter((s) => s.isWordLike).map((s) => s.segment)
  } else {
    pieces = lower.split(/[\s\p{P}\p{S}]+/u).filter(Boolean)
  }
  return [...new Set(pieces.filter((token) => token.length >= 2))]
}

// --- frozen path shapes (spec §1) ------------------------------------------
export function manifestPathFor(branch, language) {
  return `${WIKI_ROOT}/branches/${sha256(branch).slice(0, 16)}/${language}/manifest.json`
}
export function indexPathFor(index) {
  return `${WIKI_ROOT}/indexes/${sha256(JSON.stringify(index))}.json`
}
export function contentPathFor(language, id, text) {
  return `${WIKI_ROOT}/content/${language}/${id}-${sha256(text).slice(0, 20)}.md`
}
export function exportPathFor(language, bundle) {
  return `${WIKI_ROOT}/exports/${language}-${sha256(JSON.stringify(bundle)).slice(0, 20)}.json`
}
export function historyPathFor(manifest) {
  return `${WIKI_ROOT}/history/${sha256(JSON.stringify(manifest))}.json`
}
export const CATALOG_PATH = `${WIKI_ROOT}/catalog.json`
export const USER_PLAN_PATH = `${WIKI_ROOT}/wiki_plan.yaml`

// --- local schema validators (zod unavailable in this workspace) -----------
function expectObject(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`)
  return value
}

export function validateRevision(revision) {
  const r = expectObject(revision, 'Revision')
  if (!isString(r.branch) || r.branch.length < 1 || r.branch.length > 256) fail('Invalid revision branch')
  if (r.commit !== null && !(isString(r.commit) && WIKI.COMMIT_RE.test(r.commit))) fail('Invalid revision commit')
  if (!isHash(r.fingerprint)) fail('Invalid revision fingerprint')
  if (!isString(r.scannedAt) || Number.isNaN(Date.parse(r.scannedAt))) fail('Invalid revision scannedAt')
  if (!isInt(r.fileCount) || r.fileCount < 0) fail('Invalid revision fileCount')
  if (typeof r.dirty !== 'boolean' || typeof r.git !== 'boolean') fail('Invalid revision flags')
  return r
}

export function validateIndex(index) {
  const i = expectObject(index, 'Wiki index')
  if (i.version !== 1) fail('Invalid Wiki index version')
  validateRevision(i.revision)
  if (!Array.isArray(i.files)) fail('Invalid Wiki index files')
  for (const file of i.files) {
    expectObject(file, 'Index file')
    parseSourcePath(file.path)
    if (!isHash(file.hash) || !isInt(file.bytes) || file.bytes < 0
        || !isInt(file.lines) || file.lines < 1 || !Array.isArray(file.imports)
        || file.imports.some((entry) => !isString(entry))) {
      fail('Invalid Wiki index entry')
    }
    if (isWikiSecret(file.path)) fail(ERROR_TEXT.indexProhibited)
  }
  if (i.dirtyPaths !== undefined && (!Array.isArray(i.dirtyPaths) || i.dirtyPaths.some((p) => !isString(p)))) {
    fail('Invalid Wiki index dirtyPaths')
  }
  if (!Array.isArray(i.skipped)) fail('Invalid Wiki index skipped')
  for (const entry of i.skipped) {
    expectObject(entry, 'Skipped entry')
    if (!isString(entry.path) || !WIKI.SKIP_REASONS.includes(entry.reason)) fail('Invalid skipped entry')
  }
  return i
}

export function validateCatalog(catalog) {
  const c = expectObject(catalog, 'Wiki catalog')
  if (c.version !== 1 || !Array.isArray(c.editions) || c.editions.length > 500) fail('Invalid Wiki catalog')
  for (const edition of c.editions) {
    expectObject(edition, 'Catalog edition')
    if (!isString(edition.branch) || edition.branch.length < 1
        || !WIKI.LANGUAGES.includes(edition.language)
        || !isString(edition.manifestPath) || !isString(edition.updatedAt)) {
      fail('Invalid catalog edition')
    }
  }
  return c
}

export function validateManifest(manifest) {
  const m = expectObject(manifest, 'Wiki manifest')
  if (m.version !== 1 || !WIKI.LANGUAGES.includes(m.language)
      || !WIKI.TEMPLATES.includes(m.template)) fail('Invalid Wiki manifest')
  validateRevision(m.revision)
  if (!isString(m.indexPath) || !isInt(m.generationSession) || m.generationSession < 1
      || !WIKI.PHASES.includes(m.phase)
      || typeof m.citation !== 'boolean' || typeof m.autoUpdate !== 'boolean'
      || !isString(m.notes) || m.notes.length > 8000
      || !isString(m.updatedAt) || Number.isNaN(Date.parse(m.updatedAt))) {
    fail('Invalid Wiki manifest')
  }
  if (!Array.isArray(m.pages) || m.pages.length < 1 || m.pages.length > MAX_WIKI_PAGES) fail('Invalid Wiki pages')
  const ids = new Set()
  for (const page of m.pages) {
    expectObject(page, 'Wiki page')
    if (!isPageId(page.id) || ids.has(page.id)) fail('Invalid Wiki page')
    ids.add(page.id)
    if (!isString(page.title) || page.title.length < 1 || page.title.length > 180
        || !isString(page.goal) || page.goal.length < 1 || page.goal.length > 1200
        || (page.parent !== null && !isPageId(page.parent))
        || !Array.isArray(page.sources) || page.sources.length > 100
        || page.sources.some((p) => !isString(p) || isWikiSecret(p))
        || !Array.isArray(page.dependencies) || page.dependencies.length > 500
        || page.dependencies.some((p) => !isString(p))
        || !WIKI.STATES.includes(page.state)
        || (page.contentPath !== null && !isString(page.contentPath))
        || (page.contentHash !== null && !isHash(page.contentHash))
        || !isString(page.summary) || page.summary.length > 2000
        || (page.updatedAt !== null && !isString(page.updatedAt))) {
      fail('Invalid Wiki page')
    }
    if (page.state === 'ready' && (!page.contentPath || !page.contentHash || page.sources.length === 0)) {
      fail(ERROR_TEXT.readyPageNeedsContent)
    }
  }
  if (!Array.isArray(m.cards) || m.cards.length > MAX_WIKI_CARDS) fail('Invalid Wiki cards')
  for (const card of m.cards) {
    expectObject(card, 'Wiki card')
    if (!isPageId(card.page) || !ids.has(card.page)) fail(ERROR_TEXT.cardNoArticle)
    if (!isString(card.title) || card.title.length < 1 || card.title.length > 180
        || !isString(card.content) || card.content.length < 1 || card.content.length > 4000
        || !Array.isArray(card.sources) || card.sources.length < 1 || card.sources.length > 20
        || card.sources.some((source) => {
          expectObject(source, 'Card source')
          return !(isString(source.path) && isInt(source.start) && source.start > 0
            && isInt(source.end) && source.end >= source.start && isHash(source.hash))
        })) {
      fail('Invalid Wiki card')
    }
  }
  if (m.phase === 'ready') {
    for (const page of m.pages) {
      if (page.state !== 'ready' || !m.cards.some((card) => card.page === page.id)) {
        fail(ERROR_TEXT.readyEditionNeedsPages)
      }
    }
  }
  return m
}

export function validateExport(bundle) {
  const b = expectObject(bundle, 'Wiki export')
  if (b.version !== 1) fail('Invalid Wiki export version')
  validateManifest(b.manifest)
  validateIndex(b.index)
  expectObject(b.documents, 'Export documents')
  for (const value of Object.values(b.documents)) {
    if (!isString(value)) fail('Invalid export document')
  }
  return b
}

/** JSON.parse + validate a persisted record; failures are wrapped per spec §2.4. */
export function parseRecord(text, validator, { required = false } = {}) {
  if (text === null || text === undefined) {
    if (required) throw wikiError('wiki/invalid-data', ERROR_TEXT.invalidRecord)
    return null
  }
  try {
    return validator(JSON.parse(text))
  } catch {
    throw wikiError('wiki/invalid-data', ERROR_TEXT.invalidRecord)
  }
}

// --- tool-input validators (plain Errors; zod text not frozen, spec §2.4) --
export function validateGenerationOptions(options) {
  const o = expectObject(options, 'Generation controls')
  if (!WIKI.LANGUAGES.includes(o.language) || !WIKI.TEMPLATES.includes(o.template)
      || !isString(o.notes) || o.notes.length > 8000
      || typeof o.citation !== 'boolean' || typeof o.autoUpdate !== 'boolean') {
    fail(ERROR_TEXT.invalidControls)
  }
  return o
}

export function validateDocumentPlan(documents, config) {
  if (!Array.isArray(documents) || documents.length < 1 || documents.length > MAX_WIKI_PAGES) {
    fail('documents must be an array of 1 to 1000 entries')
  }
  for (const doc of documents) {
    expectObject(doc, 'Document plan entry')
    if (!isPageId(doc.id) || !isString(doc.title) || doc.title.length < 1 || doc.title.length > 180
        || !isString(doc.goal) || doc.goal.length < 1 || doc.goal.length > 1200
        || (doc.parent !== undefined && doc.parent !== null && !isPageId(doc.parent))
        || !Array.isArray(doc.sources) || doc.sources.length < 1 || doc.sources.length > 100
        || doc.sources.some((source) => !isString(source) || isWikiSecret(source))) {
      fail('Invalid document plan entry')
    }
  }
  if (documents.length > config.maxPages) throw wikiError('wiki/limit', ERROR_TEXT.planTooLarge)
  return documents
}

export function validatePageWrite(args, config) {
  const content = isString(args.content) ? args.content.trim() : ''
  if (content.length === 0) fail('content must be non-empty after trimming')
  if (Buffer.byteLength(`${content}\n`, 'utf8') > config.maxPageBytes) {
    throw wikiError('wiki/limit', ERROR_TEXT.articleTooLarge)
  }
  if (!isString(args.summary) || args.summary.length < 1 || args.summary.length > 2000) fail('summary must be 1-2000 chars')
  if (!Array.isArray(args.sources) || args.sources.length < 1 || args.sources.length > 100) fail('sources must be 1-100 references')
  for (const reference of args.sources) {
    expectObject(reference, 'Source reference')
    if (!isString(reference.path) || !isInt(reference.start) || reference.start < 1
        || !isInt(reference.end) || !isHash(reference.hash) || isWikiSecret(reference.path)) {
      fail('Invalid source reference')
    }
    if (reference.end < reference.start) fail(ERROR_TEXT.sourceRangeOrder)
  }
  if (!Array.isArray(args.cards) || args.cards.length < 1 || args.cards.length > 5) fail('cards must be 1-5 entries')
  for (const card of args.cards) {
    expectObject(card, 'Card')
    if (!isString(card.title) || card.title.length < 1 || card.title.length > 180
        || !isString(card.content) || card.content.length < 1 || card.content.length > 4000) {
      fail('Invalid card')
    }
  }
  return { content, text: `${content}\n` }
}

// --- minimal YAML fold for .hey/wiki/wiki_plan.yaml ------------------------
/** Parse the small `key: value` plan format; malformed lines raise a WikiError. */
export function parseUserPlan(text) {
  if (text === null || text === undefined) return null
  const result = {}
  for (const line of text.split(/\r?\n/)) {
    if (line.trim() === '' || line.trimStart().startsWith('#')) continue
    const match = /^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/.exec(line)
    if (!match) throw wikiError('wiki/invalid-data', ERROR_TEXT.invalidPlanYaml)
    const value = match[2].trim()
    result[match[1]] = value === '' ? null : value.replace(/^["']|["']$/g, '')
  }
  return result
}

/** Fold user/message text parts into the latest HEY_WIKI_SETTINGS_JSON record. */
export function foldTaskSettings(event, state) {
  if (event?.type !== 'user/message' || event?.data?.source?.kind !== 'user') return state
  const parts = Array.isArray(event.data.content) ? event.data.content : []
  const text = parts.filter((part) => part?.type === 'text').map((part) => part.text ?? '').join('\n')
  CONTROL.LINE_RE.lastIndex = 0
  const match = CONTROL.LINE_RE.exec(text)
  if (!match) return state
  const record = match[1]
  return { record: record.length > CONTROL.MAX_RECORD_CHARS ? CONTROL.OVERSIZED : record }
}

export { CONTROL }
