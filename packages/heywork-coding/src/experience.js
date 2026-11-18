/**
 * @heywork/coding — experience ledger search.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-coding-workbench/lib/.
 * Behavior and frozen values from specs/coding-workbench.md §3 (E:5-7, 53-225,
 * 372-398): ledger path `.hey/experience.md`, three read states, entry format,
 * query term normalization, scoring/sort/dedupe, and redaction of every
 * model-visible string. The ledger is read only through the injected `deps.fs`.
 */

import { CAPS } from './deps.js'
import { redactDevelopmentText } from './process.js'
import { readSource } from './source.js'

const LEDGER_PATH = '.hey/experience.md'
const HEADER_RE = /^##\s+(\d{4}-\d{2}-\d{2})\s+[—–-]\s+(.+)$/u
const FIELD_RE = /^-\s+([A-Za-z ]+):\s*(.*)$/u
const FIELDS = Object.freeze({
  Symptom: 'symptom',
  'Root cause': 'rootCause',
  Fix: 'fix',
  Verification: 'verification',
  Source: 'source',
})

// The spec references a Chinese stopword table without quoting it (待确认).
// This minimal set covers the most common function words; it is not guessed to
// be the exact upstream table.
const CHINESE_STOPWORDS = new Set([
  '我们', '这个', '那个', '一个', '可以', '通过', '以及', '并且', '但是', '因为',
  '所以', '如果', '然后', '已经', '没有', '进行', '使用', '问题', '错误',
])
const isCjk = (ch) => /[\u3400-\u9fff]/u.test(ch)

/** Parse the ledger body into entries; malformed sections are silently skipped. */
export function parseLedger(text) {
  const entries = []
  let current = null
  for (const line of String(text ?? '').split(/\r?\n/u)) {
    const header = HEADER_RE.exec(line)
    if (header) {
      if (current) entries.push(current)
      current = { date: header[1], title: header[2], fields: {} }
      continue
    }
    if (!current) continue
    const field = FIELD_RE.exec(line)
    if (field) current.fields[field[1].trim()] = (field[2] ?? '').trim()
  }
  if (current) entries.push(current)
  return entries
    .filter((entry) => entry.title && entry.title.trim() !== '')
    .map((entry) => ({
      date: entry.date,
      title: redactDevelopmentText(entry.title),
      symptom: redactDevelopmentText(entry.fields.Symptom ?? '').slice(0, CAPS.SYMPTOM_LIMIT),
      rootCause: redactDevelopmentText(entry.fields['Root cause'] ?? ''),
      fix: redactDevelopmentText(entry.fields.Fix ?? ''),
      verification: redactDevelopmentText(entry.fields.Verification ?? ''),
      source: redactDevelopmentText(entry.fields.Source ?? ''),
    }))
}

/** Normalize query + changed-file basenames into bounded, de-duplicated terms. */
export function queryTerms(query, changedFiles = []) {
  const q = String(query ?? '').slice(0, CAPS.QUERY_MAX_CHARS)
  const raw = []
  // Non-Chinese runs keep their punctuation.
  for (const word of q.match(/[^\u3400-\u9fff\s]+/gu) ?? []) {
    if (word.trim()) raw.push(word.trim())
  }
  // Chinese word segmentation, dropping single characters and stopwords.
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter('zh', { granularity: 'word' })
    for (const { segment, isWordLike } of segmenter.segment(q)) {
      if (!isWordLike) continue
      if ([...segment].length === 1 && isCjk(segment)) continue
      if (CHINESE_STOPWORDS.has(segment)) continue
      raw.push(segment)
    }
  }
  // Basename words from the changed-file set.
  for (const file of changedFiles) {
    const base = String(file).split(/[\\/]/u).pop() ?? ''
    const stem = base.replace(/\.[^.]+$/u, '')
    if (stem.length >= 3) raw.push(stem)
  }
  const normalized = [...new Set(raw.map((term) => term.toLowerCase().replace(/\s+/gu, '')))]
    .filter((term) => term.length > 0)
  return normalized.slice(0, CAPS.TERM_LIMIT)
}

const searchableOf = (entry) => [
  entry.title, entry.symptom, entry.rootCause, entry.fix, entry.verification, entry.source,
].join('\n')

/**
 * Score, sort and dedupe ledger entries. Full-text hit +2; basename (len>=3)
 * hit +1. Sort by score desc, date desc, append order; dedupe by the JSON of
 * [searchable text, source]; truncate to `limit`.
 */
export function matchEntries(entries, terms, limit) {
  const scored = []
  for (const [index, entry] of entries.entries()) {
    const searchable = searchableOf(entry)
    const lower = searchable.toLowerCase()
    const basename = String(entry.source ?? '').split(/[\\/]/u).pop()?.toLowerCase() ?? ''
    let score = 0
    for (const term of terms) {
      if (lower.includes(term)) score += 2
      if (basename.length >= 3 && basename.includes(term)) score += 1
    }
    if (score > 0) scored.push({ entry, score, index, searchable })
  }
  scored.sort((a, b) => (
    b.score - a.score
    || (a.entry.date < b.entry.date ? 1 : a.entry.date > b.entry.date ? -1 : 0)
    || a.index - b.index
  ))
  const seen = new Set()
  const matches = []
  for (const item of scored) {
    const key = JSON.stringify([item.searchable, item.entry.source])
    if (seen.has(key)) continue
    seen.add(key)
    matches.push(item.entry)
    if (matches.length >= limit) break
  }
  return matches
}

/** History sessions from the injected query service (never the requester). */
async function searchHistory(deps, request) {
  const query = deps.sessionQuery
  if (!query || typeof query.searchSessions !== 'function') return []
  const sessions = await query.searchSessions({
    cwd: request.cwd,
    eventTypes: ['assistant/message', 'tool/result'],
    excludeSessionId: request.sessionId,
    limit: request.historyLimit,
  })
  const list = Array.isArray(sessions) ? sessions : (sessions?.sessions ?? [])
  return list.map((session) => ({
    id: session.id ?? session.sessionId ?? '',
    snippet: redactDevelopmentText(session.snippet ?? session.text ?? ''),
  }))
}

/**
 * experienceSearch — full pipeline returning the spec §3 return shape:
 * { history, ledgerFound, ledgerState, notices, total, terms, matches, repairMatches }.
 */
export async function experienceSearch(deps, config, request) {
  const notices = []
  let ledgerState = 'missing'
  let entries = []
  let ledgerFound = false

  try {
    const read = await readSource(deps, config, {
      relative: LEDGER_PATH,
      cwd: request.cwd,
      signal: request.signal,
    })
    ledgerFound = true
    ledgerState = 'available'
    entries = parseLedger(Buffer.from(read.bytes).toString('utf8'))
  } catch (error) {
    if (request.signal?.aborted) throw error // cancellation is always fatal
    if (error?.code === 'ENOENT' || error?.code === 'FS_NOT_FOUND') {
      ledgerState = 'missing'
      notices.push('experience-ledger-unavailable') // not found still noted per E
    } else {
      ledgerState = 'unavailable'
      notices.push('experience-ledger-unavailable') // read failure: debug only, no data
    }
  }

  if (request.changeListIncomplete) notices.push('experience-change-list-incomplete')

  const terms = queryTerms(request.query, request.changedFiles ?? [])
  const matches = matchEntries(entries, terms, config.resultLimit)
  const repairMatches = request.repairQuery
    ? matchEntries(entries, queryTerms(request.repairQuery, request.changedFiles), config.resultLimit)
    : []

  const history = await searchHistory(deps, {
    cwd: request.cwd,
    sessionId: request.sessionId,
    historyLimit: config.experienceQueryLimit,
  })

  return {
    history,
    ledgerFound,
    ledgerState,
    notices,
    total: entries.length,
    terms,
    matches,
    repairMatches,
  }
}
