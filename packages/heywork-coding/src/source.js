/**
 * @heywork/coding — source discovery, fingerprinting and tree-change scanning.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-coding-workbench/lib/.
 * Behavior and frozen values from specs/coding-workbench.md:
 *   §1.2 fingerprint / check schema, §1.3 limits, §1.6 command whitelist,
 *   §3 discoverChecks (S:199-253), sweep finding kinds (S + I), §4
 *   selectChecksForScope (S:354-383) and changedFiles (S:286-345).
 * The file-system is only touched through the injected `deps.fs`.
 */

import { createHash } from 'node:crypto'
import { COMMAND, DEFAULTS, SUBPROCESS_ERRORS } from './deps.js'

const SHA = (bytes) => createHash('sha256').update(bytes).digest('hex')

/** Path guard from spec §2 / §5 — a leading '-' or '..'/'.git'/'.env*' segment. */
export function isPathInSourceScope(relative) {
  if (typeof relative !== 'string' || relative === '') return false
  if (relative.startsWith('-')) return false
  const segments = relative.split(/[\\/]/u)
  return !segments.some((seg) => (
    seg === '..' || seg === '.git' || seg.toLowerCase().startsWith('.env')
  ))
}

/**
 * readSource — bounded read with scope / regular-file / size / change checks.
 * Returns { path, bytes, hash }. Throws native errors from the spec:
 * path-outside-source-scope, source-not-a-regular-file, source-file-too-large,
 * source-changed-during-read.
 */
export async function readSource(deps, config, request) {
  const { fs } = deps
  const { relative, cwd, signal, expectedHash } = request
  if (!isPathInSourceScope(relative)) throw new Error(SUBPROCESS_ERRORS.pathOutsideSourceScope)

  const target = fs.resolve(relative, { cwd, signal })
  if (fs.stat) {
    const stat = await fs.stat(target, signal)
    if (stat && stat.isDirectory === true) throw new Error(SUBPROCESS_ERRORS.sourceNotRegularFile)
    if (stat && typeof stat.size === 'number' && stat.size > config.maxFileBytes) {
      throw new Error(SUBPROCESS_ERRORS.sourceFileTooLarge)
    }
  }
  const bytes = await fs.readBytes(target, signal)
  if (bytes.length > config.maxFileBytes) throw new Error(SUBPROCESS_ERRORS.sourceFileTooLarge)
  const hash = SHA(bytes)
  if (expectedHash !== undefined && expectedHash !== null && hash !== expectedHash) {
    throw new Error(SUBPROCESS_ERRORS.sourceChangedDuringRead)
  }
  return { path: relative, displayPath: target.displayPath ?? relative, bytes, hash }
}

function shouldSkip(name, excluded) {
  return excluded.includes(name) || name === '.git'
}

/**
 * scanSources — walk the work tree and produce the frozen fingerprint shape
 * { digest, files, bytes, complete, reason }. No dependency install, no scripts.
 */
export async function scanSources(deps, config, request) {
  const { fs } = deps
  const { cwd, signal } = request
  const excluded = config.excludedDirectories ?? DEFAULTS.excludedDirectories
  const entries = []
  let complete = true
  let reason = null

  async function walk(dir, depth) {
    if (depth > 64) { complete = false; reason = 'walk-depth-exceeded'; return }
    let listing
    try {
      listing = await fs.listDir({ path: dir, displayPath: dir }, signal)
    } catch (error) {
      complete = false
      reason = 'directory-unreadable'
      return
    }
    for (const entry of listing) {
      if (entries.length >= config.maxFiles) { complete = false; reason = 'too-many-files'; return }
      if (shouldSkip(entry.name, excluded)) continue
      if (entry.type === 'directory') {
        await walk(entry.target.path, depth + 1)
        if (!complete && reason === 'too-many-files') return
        continue
      }
      if (entry.type !== 'file') continue
      try {
        const bytes = await fs.readBytes(entry.target, signal)
        if (bytes.length > config.maxFileBytes) { complete = false; reason = 'file-too-large'; continue }
        entries.push({ path: entry.target.displayPath ?? entry.name, size: bytes.length, hash: SHA(bytes) })
      } catch {
        complete = false
        reason = 'file-unreadable'
      }
    }
  }

  await walk(cwd, 0)
  entries.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))
  const totalBytes = entries.reduce((sum, e) => sum + e.size, 0)
  if (totalBytes > config.maxSourceBytes) { complete = false; reason = 'source-bytes-exceeded' }
  const digestInput = entries.map((e) => `${e.path}\0${e.hash}\0${e.size}`).join('\n')
  return { digest: SHA(digestInput), files: entries.length, bytes: totalBytes, complete, reason }
}

function assertCheck(check, seen) {
  if (!check || typeof check.name !== 'string' || check.name === '') return
  if (seen.has(check.name)) throw new Error(SUBPROCESS_ERRORS.duplicateCheckName)
  seen.add(check.name)
}

/**
 * discoverChecks — derive checks only from manifest files; never installs or
 * runs scripts. Whitelist and fixed commands are verbatim from spec §1.6.
 */
export async function discoverChecks(deps, config, request) {
  const { fs } = deps
  const { cwd, signal } = request
  const checks = []
  const seen = new Set()
  const readJson = async (relative) => {
    try {
      return JSON.parse(await fs.readText(fs.resolve(relative, { cwd, signal }), signal))
    } catch {
      return undefined
    }
  }
  const exists = async (relative) => {
    try {
      await fs.stat(fs.resolve(relative, { cwd, signal }), signal)
      return true
    } catch {
      return false
    }
  }

  // 1. .hey/coding.json manifest (strict shape { version: 1, checks: [...] }).
  const manifest = await readJson('.hey/coding.json')
  if (manifest && manifest.version === 1 && Array.isArray(manifest.checks)) {
    for (const check of manifest.checks) {
      assertCheck(check, seen)
      checks.push({
        name: check.name,
        argv: Array.isArray(check.argv) ? check.argv : [],
        kind: check.kind ?? 'custom',
        origin: check.origin ?? '.hey/coding.json',
        ...(check.coverage ? { coverage: check.coverage } : {}),
      })
    }
  }

  // 2. package.json scripts + packageManager whitelist.
  const pkg = await readJson('package.json')
  if (pkg) {
    const rawManager = typeof pkg.packageManager === 'string'
      ? pkg.packageManager.split('@')[0] : COMMAND.defaultPackageManager
    const manager = rawManager || COMMAND.defaultPackageManager
    if (!COMMAND.packageManagers.includes(manager)) {
      throw new Error(SUBPROCESS_ERRORS.unsupportedPackageManager)
    }
    const scripts = pkg.scripts && typeof pkg.scripts === 'object' ? pkg.scripts : {}
    for (const name of Object.keys(scripts)) {
      if (!COMMAND.scriptPrefixRe.test(name)) continue
      const check = {
        name,
        argv: [manager, 'run', name],
        kind: name.startsWith('test') ? 'test'
          : name.startsWith('build') ? 'build'
            : name.startsWith('lint') ? 'lint' : 'typecheck',
        origin: 'package.json',
      }
      assertCheck(check, seen)
      checks.push(check)
    }
  }

  // 3. fixed suggestions from other manifests.
  if (await exists('pyproject.toml')) {
    const check = { name: 'pytest', argv: [...COMMAND.pyprojectPytest], kind: 'test', origin: 'pyproject.toml' }
    assertCheck(check, seen)
    checks.push(check)
  }
  if (await exists('pom.xml')) {
    const check = { name: 'maven-test', argv: [...COMMAND.pomMavenTest], kind: 'test', origin: 'pom.xml' }
    assertCheck(check, seen)
    checks.push(check)
  }

  return checks
}

/**
 * selectChecksForScope — spec §4 (S:354-383). Returns the included checks and
 * the skipped decision list; incomplete change sets conservatively run all.
 */
export function selectChecksForScope(checks, changed, complete) {
  const changedFiles = changed?.files ?? []
  if (!complete) {
    return {
      changedFiles,
      complete,
      reason: changed.reason ?? 'changed-list-incomplete',
      runs: [...checks],
      skipped: [],
    }
  }
  if (changedFiles.length === 0) {
    return {
      changedFiles,
      complete,
      reason: 'no-changes',
      runs: [],
      skipped: checks.map((c) => ({ name: c.name, included: false, reason: 'no-changes' })),
    }
  }
  const runs = []
  const skipped = []
  for (const check of checks) {
    if (!Array.isArray(check.coverage) || check.coverage.length === 0) {
      runs.push(check)
      skipped.push({ name: check.name, included: true, reason: 'no-coverage-declared' })
      continue
    }
    const hit = changedFiles.some((file) => check.coverage.some((glob) => globMatch(glob, file)))
    if (hit) {
      runs.push(check)
      skipped.push({ name: check.name, included: true, reason: 'coverage-match' })
    } else {
      skipped.push({ name: check.name, included: false, reason: 'coverage-exclude' })
    }
  }
  return { changedFiles, complete, reason: changedFiles.length ? undefined : 'no-changes', runs, skipped }
}

/** Minimal picomatch-like `dot:true` glob: '*' any run, '**' across dirs, '?' one. */
function globMatch(glob, file) {
  if (glob === file) return true
  const escape = (s) => s.replace(/[.+^${}()|[\]\\]/gu, '\\$&')
  const pattern = escape(glob)
    .replace(/\*\*/gu, '\u0000')
    .replace(/\*/gu, '[^/]*')
    .replace(/\u0000/gu, '.*')
    .replace(/\?/gu, '[^/]')
  try { return new RegExp(`^${pattern}$`, 'u').test(file) } catch { return false }
}

/** changed-files list from git diff + untracked (the caller injects the data). */
export function changedFileResult(files, { complete = true, reason = null } = {}) {
  return { files, complete, reason }
}

/** The four sweep finding kinds are frozen labels from spec §3. */
export const SWEEP_KINDS = Object.freeze({
  unverifiedImport: 'unverified-import',
  placeholder: 'placeholder',
  secret: 'secret',
  duplicatedCode: 'duplicated-code',
})

const PLACEHOLDER_RE = /\b(?:TODO|FIXME|XXX)\b|lorem ipsum/u
const SECRET_RES = Object.freeze([
  /sk-[A-Za-z0-9]{20,}/u,
  /AKIA[0-9A-Z]{16}/u,
  /ghp_[A-Za-z0-9]{36}/u,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/u,
])
const SWEEP_SUFFIXES = Object.freeze(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts'])
export const isSweepable = (path) => SWEEP_SUFFIXES.some((suffix) => path.endsWith(suffix))

/**
 * sweepFile — mechanical scan of one added-line set. Exact detail prose is a
 * spec "待确认" item (referenced as I:114-128 but not quoted), so titles are
 * the frozen kind labels and evidence is the matched line itself.
 */
export function sweepFile(path, newLines, declaredPackages, windowLines) {
  const findings = []
  const lines = newLines.map((text, i) => ({ text, line: i + 1 }))
  for (const { text, line } of lines) {
    const placeholder = PLACEHOLDER_RE.test(text)
    if (placeholder) findings.push(makeFinding(path, line, SWEEP_KINDS.placeholder, text))

    for (const re of SECRET_RES) {
      if (re.test(text)) findings.push(makeFinding(path, line, SWEEP_KINDS.secret, text))
    }

    const importMatch = /^\s*(?:import|from)\s+.*?['"]([^'"./][^'"]*)['"]/u.exec(text)
      ?? /^\s*(?:const|let|var).*?require\(\s*['"]([^'"./][^'"]*)['"]\s*\)/u.exec(text)
    if (importMatch) {
      const pkg = importMatch[1].split('/')[0]
      if (!declaredPackages.has(pkg)) {
        findings.push(makeFinding(path, line, SWEEP_KINDS.unverifiedImport, text))
      }
    }
  }

  // duplicated-code: repeated identical structural windows of `windowLines`.
  const seen = new Map()
  for (let i = 0; i + windowLines <= lines.length; i += 1) {
    const window = lines.slice(i, i + windowLines).map((l) => l.text.trim()).join('\n')
    if (seen.has(window)) {
      findings.push(makeFinding(path, lines[i].line, SWEEP_KINDS.duplicatedCode, window))
    } else {
      seen.set(window, lines[i].line)
    }
  }
  return findings
}

function makeFinding(path, line, kind, evidence) {
  return {
    path,
    line,
    kind,
    title: kind,
    evidence: String(evidence).slice(0, 16000),
    state: 'open',
  }
}
