/**
 * @heywork/knowledge — path / hash / file / text helpers.
 *
 * FROM SPEC, NOT COPIED. Implements specs/knowledge.md §1.2 (paths), §3.3
 * (citation format), §4.2 (readKnowledgeFile, extensions, text normalize).
 * node: built-ins are resolved via `deps.node` when injected, else a local
 * createRequire fallback; nothing from @deepseek-ai/* is imported.
 */

import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { join, basename, extname, isAbsolute, resolve } from 'node:path'
import { STRINGS, SUPPORTED_EXTENSIONS, OBJECT_EXT_RE, PAGE_MARKER_RE,
  REASONS, fail } from './deps.js'

const localRequire = createRequire(import.meta.url)
function nodeMod(deps, id) {
  return deps?.node?.[id] ?? localRequire(id)
}

/** TC-2: resolveDshHome is defined in dsh-home-paths, outside this package.
 * Conservative fallback: absolute paths pass through; relative paths resolve
 * under DSH_HOME (or HOME) with `.` as the final segment. */
export function resolveDshHome(dshHome, deps = {}) {
  if (typeof deps.resolveDshHome === 'function') return deps.resolveDshHome(dshHome)
  const base = process.env.DSH_HOME || process.env.HOME || '.'
  if (typeof dshHome !== 'string' || dshHome.length === 0) return resolve(base)
  return isAbsolute(dshHome) ? resolve(dshHome) : resolve(base, dshHome)
}

/** `<root>` = join(resolveDshHome(config.dshHome), 'knowledge', 'v1'). */
export function knowledgeRoot(config, deps = {}) {
  return join(resolveDshHome(config?.dshHome, deps), 'knowledge', 'v1')
}

export const knowledgeHash = (data) => createHash('sha256').update(data).digest('hex')

/** Supported extension (lowercase, no dot) or null (X:13-34). */
export function knowledgeExtension(name) {
  if (typeof name !== 'string') return null
  const ext = extname(name).slice(1).toLowerCase()
  return SUPPORTED_EXTENSIONS.includes(ext) ? ext : null
}

/** citation title: parse(basename(name)).name, strip [^\p{L}\p{N}_. -],
 * slice(0,100), empty => 'document' (ST:220-228). */
export function parseCitationTitle(name) {
  let stem
  try {
    const base = basename(String(name))
    const dot = base.lastIndexOf('.')
    stem = dot > 0 ? base.slice(0, dot) : base
  } catch {
    stem = ''
  }
  const cleaned = stem.replace(/[^\p{L}\p{N}_. -]/gu, '').slice(0, 100)
  return cleaned.length > 0 ? cleaned : 'document'
}

/** `<root>/citations/<sha256(markdown)>/<title>.md` (ST:220-228). */
export function citationPath(root, markdown, name) {
  return join(root, 'citations', knowledgeHash(markdown), `${parseCitationTitle(name)}.md`)
}

/** `<root>/objects/<sha256hex(bytes)>.<ext>` (ST:229-235). */
export function objectPath(root, bytes, ext) {
  if (!OBJECT_EXT_RE.test(ext || '')) throw new Error(STRINGS.invalidObjectExtension)
  return join(root, 'objects', `${knowledgeHash(bytes)}.${ext}`)
}

export const fileVersion = (st) => `${st.dev}:${st.ino}:${st.size}:${st.mtimeMs}:${st.ctimeMs}`

function statGuard(before, after, path) {
  if (!after?.isFile?.() || after?.isSymbolicLink?.()) throw new Error(STRINGS.notRegularFile)
  if (after.size !== before.size || after.mtimeMs !== before.mtimeMs
      || after.ctimeMs !== before.ctimeMs || after.ino !== before.ino || after.dev !== before.dev) {
    throw new Error(STRINGS.sourceChanged)
  }
}

/**
 * Read exact bytes with integrity guards (F:11-55).
 * lstat not a regular file / symlink => 'not-a-regular-file';
 * size > maxBytes => 'file-too-large'; size/mtime/ctime/ino/dev changed during
 * read => 'source-changed'. Throws native Errors (run() wraps known reasons).
 */
export async function readKnowledgeFile(path, maxBytes, signal, deps = {}) {
  const fs = nodeMod(deps, 'node:fs')
  const fsp = fs.promises ?? nodeMod(deps, 'node:fs/promises')
  const before = await fsp.lstat(path)
  if (!before.isFile() || before.isSymbolicLink()) throw new Error(STRINGS.notRegularFile)
  if (before.size > maxBytes) throw new Error(STRINGS.fileTooLarge)
  signal?.throwIfAborted?.()
  let handle
  try {
    handle = await fsp.open(path, 'r')
    const bytes = await handle.readFile()
    const after = await fsp.stat(path)
    statGuard(before, after, path)
    signal?.throwIfAborted?.()
    return bytes
  } finally {
    await handle?.close?.()
  }
}

/**
 * Strict UTF-8 decode; normalize \r\n / \r to \n; \0 or all-whitespace =>
 * 'empty-or-binary-text'; byteLength > maxTextBytes => 'text-too-large' (X:123-130).
 */
export function normalizeText(bytes, maxTextBytes) {
  if (Buffer.byteLength(bytes) > maxTextBytes) fail(REASONS.textTooLarge)
  let text
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
  } catch {
    fail(REASONS.emptyOrBinaryText)
  }
  text = text.replace(/\r\n?/gu, '\n')
  if (text.includes('\0') || text.trim().length === 0) fail(REASONS.emptyOrBinaryText)
  return text
}

/** Markdown from normalized text; plain text has no page markers. */
export function extractMarkdown(text) {
  return text
}

/** Page number from the most recent `<!-- page:n -->` marker at or before a line. */
function pageAt(lines, index) {
  for (let i = index; i >= 0; i -= 1) {
    const m = PAGE_MARKER_RE.exec(lines[i])
    if (m) return Number(m[1])
  }
  return null
}

/** Nearest markdown heading at or before a line (S:1049-1069). */
function headingAt(lines, index) {
  for (let i = index; i >= 0; i -= 1) {
    if (/^#{1,6}\s/u.test(lines[i])) return lines[i].replace(/^#{1,6}\s+/u, '').trim()
  }
  return ''
}

export const passageSource = (textPath, startLine) =>
  `${encodeURI(textPath).replaceAll('#', '%23').replaceAll('?', '%3F')}#L${startLine}`

/**
 * Split normalized text into parent windows; each parent also yields child
 * windows. Returns parent records consumed by the queue/store layer:
 * { parentId, heading, page, startLine, endLine, parentText, children:[{text}] }.
 * Chunking only needs to be behaviorally equivalent (bidirectional windows
 * with overlap); exact BM25 scores are not reproducible (spec §九.3).
 */
export function chunkText(text, config) {
  const lines = text.split('\n')
  const parents = []
  const parentChars = config.parentChars
  const childChars = config.childChars
  const overlap = config.overlapChars

  let i = 0
  let parentNo = 0
  while (i < lines.length) {
    const window = []
    let used = 0
    const start = i
    while (i < lines.length && used + lines[i].length + 1 <= parentChars) {
      window.push(lines[i])
      used += lines[i].length + 1
      i += 1
    }
    if (window.length === 0) { window.push(lines[i] ?? ''); i += 1 }
    const parentId = `p${parentNo}`
    const parentText = window.join('\n')
    const children = []
    let c = 0
    while (c < window.length) {
      const childLines = []
      let childUsed = 0
      const cStart = c
      while (c < window.length && childUsed + window[c].length + 1 <= childChars) {
        childLines.push(window[c])
        childUsed += window[c].length + 1
        c += 1
      }
      if (childLines.length === 0) { childLines.push(window[c]); c += 1 }
      children.push({ text: childLines.join('\n'), startLine: start + cStart })
      if (overlap > 0 && c < window.length) {
        // step back by roughly `overlap` characters worth of lines
        let back = 0
        c -= 1
        while (c > cStart && back < overlap) { back += (window[c]?.length ?? 0) + 1; c -= 1 }
        c = Math.max(cStart + 1, c + 1)
      }
    }
    parents.push({
      parentId,
      heading: headingAt(lines, start),
      page: pageAt(lines, start),
      startLine: start + 1,
      endLine: i,
      parentText,
      children,
    })
    parentNo += 1
  }
  return parents
}

/** FTS5 MATCH query or null for pure punctuation (T:70-73). */
export function knowledgeFtsQuery(query) {
  if (typeof query !== 'string') return null
  const tokens = query.match(/[\p{L}\p{N}_]+/gu)
  if (!tokens || tokens.length === 0) return null
  return tokens.map((t) => `"${t.replaceAll('"', '""')}"`).join(' AND ')
}
