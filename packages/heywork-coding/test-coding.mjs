/**
 * Self-test for packages/heywork-coding (specs/coding-workbench.md, 438 lines).
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-coding-workbench/lib/.
 * Minimal injected deps only: node:fs over a temp directory plus mock
 * subprocess/sandbox. No command is ever really executed and no
 * @deepseek-ai/* package is imported.
 *
 * Run: node packages/heywork-coding/test-coding.mjs
 */

import assert from 'node:assert/strict'
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, rmSync, statSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

import * as coding from './src/index.js'
import {
  gitEnvironment, parseDiagnostics, redactDevelopmentText, runCommand,
} from './src/process.js'
import { IDENTITY, REASONS, REMOTE, SPECIAL_ERROR, DEFAULTS } from './src/deps.js'

const { apply, name, inject } = coding
let checks = 0
const ok = (condition, label) => {
  assert.ok(condition, label)
  checks += 1
}
const eq = (actual, expected, label) => {
  assert.deepEqual(actual, expected, label)
  checks += 1
}
const cleanups = []

// ---------------------------------------------------------------------------
// Harness — minimal injected deps
// ---------------------------------------------------------------------------
function makeHarness(options = {}) {
  const root = mkdtempSync(join(tmpdir(), 'heywork-coding-'))
  cleanups.push(() => rmSync(root, { recursive: true, force: true }))
  const registered = []
  const spawnCalls = []
  const confineCalls = []
  const resolveCalls = []
  const promptSections = []

  const state = {
    exitCode: 0,
    stdout: '',
    stderr: '',
    lossy: false,
    policy: { mode: 'danger-full-access' },
    checkRunner: undefined,
    gitResult: { head: 'abc123\n', currentBranch: 'main\n', status: '', diff: '' },
    capture: undefined,
  }

  const fs = {
    mkdir(target, opts) { mkdirSync(target.path, { recursive: opts?.recursive !== false, mode: opts?.mode }) },
    resolve(relative, { cwd }) {
      return { path: join(cwd, relative), displayPath: relative }
    },
    readText(target) {
      return readFileSync(target.path, 'utf8')
    },
    readBytes(target) {
      try { return new Uint8Array(readFileSync(target.path)) } catch (error) {
        if (error.code === 'ENOENT') { const e = new Error('missing'); e.code = 'ENOENT'; throw e }
        throw error
      }
    },
    writeText(target, content) {
      mkdirSync(dirname(target.path), { recursive: true })
      writeFileSync(target.path, content, 'utf8')
    },
    delete(target) { rmSync(target.path, { force: true }) },
    stat(target) {
      try {
        const s = statSync(target.path)
        return { size: s.size, isDirectory: s.isDirectory() }
      } catch (error) {
        if (error.code === 'ENOENT') { const e = new Error('missing'); e.code = 'ENOENT'; throw e }
        throw error
      }
    },
    listDir(target) {
      let entries
      try { entries = readdirSync(target.path, { withFileTypes: true }) } catch (error) {
        if (error.code === 'ENOENT') { const e = new Error('missing'); e.code = 'ENOENT'; throw e }
        throw error
      }
      return entries.map((entry) => ({
        name: entry.name,
        type: entry.isDirectory() ? 'directory' : entry.isFile() ? 'file' : 'other',
        target: { path: join(target.path, entry.name), displayPath: entry.name },
      }))
    },
  }

  const subprocess = {
    async resolveExecutable(executable) {
      resolveCalls.push(executable)
      return `/resolved/${executable}`
    },
    spawn(request) {
      spawnCalls.push(request)
      let terminated = 0
      return {
        exitCode: state.exitCode,
        collected: {
          stdout: { readFrom: () => state.stdout, lossy: state.lossy },
          stderr: { readFrom: () => state.stderr, lossy: false },
        },
        done: Promise.resolve(),
        terminate() { terminated += 1 },
        waitForExit() { return Promise.resolve() },
        get terminated() { return terminated },
      }
    },
  }

  const sandbox = {
    async confine(argv, policy) {
      confineCalls.push({ argv, policy })
      return { argv: ['/sandbox', ...argv] }
    },
  }

  const deps = {
    defineTool: (descriptor) => descriptor,
    tools: { register: (tool) => registered.push(tool) },
    fs,
    subprocess,
    sandbox,
    get: (key) => (key === 'sandboxPolicy' ? state.policy : undefined),
    systemPrompt: { section: (s) => promptSections.push(s) },
    worktrees: {
      async create({ name }) {
        return { path: join(root, `wt-${name ?? 'task'}`), branch: `task/${name ?? 'task'}`, baseCommit: 'base' }
      },
    },
    gitInspect: ({ baseCommit }) => ({ ...state.gitResult, baseCommit }),
    checkRunner: (request) => (
      state.checkRunner ? state.checkRunner(request) : {
        exitCode: state.exitCode,
        stdout: state.stdout === '' ? 'ok\n' : state.stdout,
        stderr: state.stderr,
        truncated: state.lossy,
        timedOut: false,
        cancelled: false,
      }
    ),
    workspaceChanges: {
      async summary(sessionId, seq) { return state.capture },
      async contents(sessionId, seq, index) { return state.capture?.contents },
    },
    selectCodingStandards: (languages) => ({
      catalogVersion: '2026.11.12.1',
      languages: [...languages].sort(),
      rules: [],
      guides: [{ id: 'typescript-and-frontend', title: { en: 'TS', zh: 'TS' }, body: { en: 'en body', zh: 'zh body' } }],
      sources: [],
      policy: { selectedRulesAreNotVerified: true },
    }),
  }

  const config = {
    dshHome: join(root, '.dsh'),
    model: 'test-model',
    workspacePath: root,
    workspaces: [{ id: 'ws-1', path: root, readOnly: false }],
    sessions: [{ id: 's-1', workspaceId: 'ws-1' }],
    ...options.config,
  }
  const service = apply(deps, config)
  const tools = Object.fromEntries(registered.map((tool) => [tool.name, tool]))

  const exec = (sessionId = 's-1', workspaceId = 'ws-1') => ({
    agent: {
      session: { id: sessionId },
      workspaceId,
      workspacePath: root,
      cwd: root,
    },
    signal: undefined,
  })
  const run = async (name, args, sessionId) => {
    const result = await tools[name].execute(args, exec(sessionId))
    return JSON.parse(result)
  }

  return {
    root, deps, config, service, state, registered, tools,
    spawnCalls, confineCalls, resolveCalls, promptSections,
    exec, run,
  }
}

function writePackageJson(root, scripts = { test: 'echo ok' }) {
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'fixture', scripts }), 'utf8')
}
function writeLedger(root, body) {
  mkdirSync(join(root, '.hey'), { recursive: true })
  writeFileSync(join(root, '.hey/experience.md'), body, 'utf8')
}

// ---------------------------------------------------------------------------
try {
  // A. frozen identity, inject, and 8-tool registration (spec §1.1)
  {
    const h = makeHarness()
    eq(name, 'coding-workbench-tools', 'plugin name frozen')
    eq(inject, ['tools', 'codingWorkbench', 'workspaceRegistry', 'systemPrompt'], 'inject frozen')
    eq(Object.keys(h.registered).length, 8, '8 tools registered')
    eq(h.registered.map((t) => t.name), [
      'coding_task', 'coding_inspect', 'coding_check', 'coding_repair',
      'coding_review', 'coding_acceptance', 'coding_restore', 'coding_workbench',
    ], '8 tool names in frozen order')
    ok(h.tools.coding_workbench.serviceTool === true, 'coding_workbench flagged as service body')
    eq(h.promptSections[0], {
      name: 'native-coding-evidence',
      order: 110,
      text: 'Use the full Uma team workflow only when the request warrants a complete product workflow.',
    }, 'system prompt section frozen')
    ok(coding.default === coding.CodingWorkbench, 'default export is CodingWorkbench')
    eq(coding.CodingWorkbench.inject.length, 15, 'service static inject list length')
  }

  // B. parseDiagnostics — TS + GCC styles, warning, code empty, limit, long message
  {
    const ts = parseDiagnostics('f.ts(3,9): error TS2322: Type mismatch')
    eq(ts, [{
      path: 'f.ts', line: 3, column: 9, severity: 'error', code: 'TS2322', message: 'Type mismatch',
    }], 'TS-style diagnostic')

    const gcc = parseDiagnostics('f.c:3:9: error: bad thing')
    eq(gcc, [{
      path: 'f.c', line: 3, column: 9, severity: 'error', code: null, message: 'bad thing',
    }], 'GCC-style diagnostic (empty code -> null)')

    const warn = parseDiagnostics('f.ts(1,2): warning TS2300: Duplicate identifier')
    eq(warn[0].severity, 'warning', 'warning severity')
    eq(parseDiagnostics('no diagnostic here'), [], 'no matching line -> empty')
    eq(parseDiagnostics('f.ts(0,0): error TS1: x')[0].line, 1, 'line clamped to >= 1')
    eq(parseDiagnostics('f.ts(1,1): error TS1: ' + 'x'.repeat(9000))[0].message.length, 8000, 'message clamped to 8000')
    const two = parseDiagnostics('a(1,1): error TS1: a\nb(2,2): error TS2: b', 1)
    eq(two.length, 1, 'limit honored')
  }

  // C. redaction + git env (spec §1.6 / delivery.md §14)
  {
    eq(redactDevelopmentText('Bearer abc123 end'), 'Bearer [redacted] end', 'Bearer redacted')
    // Rule 3's value class includes '&', so it consumes the rest after rule 2.
    eq(redactDevelopmentText('url?token=secret123&x=1'), 'url?token=[redacted]', 'query token redacted')
    eq(redactDevelopmentText('sk-' + 'a'.repeat(20)), '[redacted]', 'sk- key redacted')
    const env = gitEnvironment({ MY_VAR: '1', GIT_DIR: '/keep' })
    eq(env.GIT_DIR, undefined, 'GIT_DIR cleaned')
    eq(env.GIT_CONFIG_COUNT, '0', 'GIT_CONFIG_COUNT set to 0')
    eq(env.GIT_TERMINAL_PROMPT, '0', 'GIT_TERMINAL_PROMPT set')
    eq(env.GIT_NO_LAZY_FETCH, '1', 'GIT_NO_LAZY_FETCH set')
    eq(env.MY_VAR, '1', 'extra env preserved')
  }

  // D. runCommand — six steps, both sandbox branches, spawn args, terminate, redaction
  {
    const h = makeHarness()
    h.state.stdout = 'Bearer token123 ok'
    const result = await runCommand(h.deps, h.service.config, {
      argv: ['node', '--version', 'x'], cwd: h.root, policy: { mode: 'danger-full-access' },
    })
    eq(result.stdout, 'Bearer [redacted] ok', 'stdout redacted')
    eq(h.resolveCalls, ['node'], 'resolveExecutable called for first arg only')
    eq(h.confineCalls.length, 0, 'danger-full-access skips sandbox.confine')
    const spawn = h.spawnCalls[0]
    eq(spawn.argv, ['/resolved/node', '--version', 'x'], 'spawn argv = resolved exe + literal args')
    eq(spawn.cwd, h.root, 'spawn cwd')
    eq(spawn.graceMs, DEFAULTS.graceMs, 'graceMs from config')
    eq(spawn.stdio, {
      stdin: 'ignore',
      stdout: { maxBytes: DEFAULTS.maxOutputBytes },
      stderr: { maxBytes: DEFAULTS.maxOutputBytes },
    }, 'stdio caps frozen')
    eq(spawn.env.GIT_DIR, undefined, 'spawn env git-cleaned')
    eq(result.truncated, false, 'truncated false without lossy')
    ok(spawn.signal !== undefined, 'spawn received a signal')

    const h2 = makeHarness()
    await runCommand(h2.deps, h2.service.config, {
      argv: ['npm', 'test'], cwd: h2.root, policy: { mode: 'workspace', foo: 'bar' },
    })
    eq(h2.confineCalls.length, 1, 'sandboxed branch calls confine')
    eq(h2.confineCalls[0].policy, { mode: 'workspace', foo: 'bar' }, 'policy passed to confine')
    eq(h2.spawnCalls[0].argv, ['/sandbox', '/resolved/npm', 'test'], 'confined argv used for spawn')

    const h3 = makeHarness()
    await assert.rejects(
      runCommand(h3.deps, h3.service.config, { argv: [], cwd: h3.root, policy: {} }),
      { message: 'empty-command' },
    ); checks += 1
  }

  // E. coding_check — run/read/cancel, diagnostics, scope, presentationMeta
  {
    const h = makeHarness()
    writePackageJson(h.root)
    const run = await h.run('coding_check', { action: 'run', check: 'test' })
    eq(run.status, 'passed', 'check passed with exit 0')
    eq(run.check, 'test', 'check name')
    eq(run.argv, ['npm', 'run', 'test'], 'check argv from package.json')
    eq(run.sequence, 1, 'sequence starts at 1')
    ok(run.before && run.after && typeof run.digest !== 'string', 'before/after fingerprints present')
    const meta = h.tools.coding_check.output.presentationMeta(JSON.stringify(run))
    eq(meta.codingCheck.version, 1, 'presentationMeta version')
    eq(meta.codingCheck.receipts[0].status, 'passed', 'presentationMeta receipt status')

    const read = await h.run('coding_check', { action: 'read', id: run.id })
    eq(read.id, run.id, 'check read returns run')

    const cancel = await h.run('coding_check', { action: 'cancel', id: run.id })
    eq(cancel.status, 'passed', 'cancel on settled run leaves it unchanged')

    // diagnostics through check output
    const h2 = makeHarness()
    writePackageJson(h2.root)
    h2.state.stdout = 'f.ts(3,9): error TS2322: bad\ng.c:2:1: warning: warn'
    h2.state.exitCode = 1
    const withDiag = await h2.run('coding_check', { action: 'run', check: 'test' })
    eq(withDiag.status, 'failed', 'nonzero exit -> failed')
    eq(withDiag.diagnostics.length, 2, 'two diagnostics parsed from check output')
    eq(withDiag.diagnostics[0].code, 'TS2322', 'diagnostic code')

    // scope=changed with injected changed files
    const h3 = makeHarness()
    writePackageJson(h3.root, { test: 'echo t', lint: 'echo l' })
    h3.service.deps.changedFiles = async () => ({ files: ['a.ts'], complete: true, reason: null })
    const scoped = await h3.run('coding_check', { action: 'run', scope: 'changed' })
    eq(scoped.scope, 'changed', 'scope changed result')
    eq(scoped.complete, true, 'scope complete')
    ok(scoped.skipped.length >= 2, 'scope skipped decisions present')
  }

  // F. check + scope mutual exclusion (tool-layer verbatim)
  {
    const h = makeHarness()
    await assert.rejects(
      h.run('coding_check', { action: 'run', check: 'test', scope: 'changed' }),
      { message: 'Select either check or scope, not both' },
    ); checks += 1
  }

  // G. coding_review — add with sourceHash, update
  {
    const h = makeHarness()
    writeFileSync(join(h.root, 'sample.js'), 'const x = 1\n', 'utf8')
    const finding = await h.run('coding_review', {
      action: 'add', path: 'sample.js', line: 1, severity: 'high', title: 'Issue', evidence: 'e',
    })
    eq(finding.state, 'open', 'new finding open')
    eq(finding.severity, 'high', 'finding severity')
    ok(/^[0-9a-f]{64}$/u.test(finding.sourceHash), 'sourceHash is sha256 hex')

    const updated = await h.run('coding_review', { action: 'update', id: finding.id, state: 'resolved' })
    eq(updated.state, 'resolved', 'finding updated to resolved')
    ok(new Date(updated.updatedAt).getTime() >= new Date(finding.updatedAt).getTime(), 'updatedAt refreshed')
  }

  // H. coding_acceptance — read null, define revision 1, criteria check validation
  {
    const h = makeHarness()
    writePackageJson(h.root)
    eq(await h.run('coding_acceptance', { action: 'read' }), null, 'no spec -> null')
    const spec = await h.run('coding_acceptance', {
      action: 'define', goal: 'Ship it', criteria: [{ id: 'c1', text: 'works', checks: ['test'] }],
      independentVerificationOf: [],
    })
    eq(spec.revision, 1, 'first spec revision 1')
    eq(spec.goal, 'Ship it', 'spec goal')
    ok(!('independentVerificationOf' in spec), 'empty implementers omitted')

    const spec2 = await h.run('coding_acceptance', {
      action: 'define', expectedRevision: 1, goal: 'Again', criteria: [],
    })
    eq(spec2.revision, 2, 'second spec revision 2')
    eq((await h.run('coding_acceptance', { action: 'read' })).revision, 2, 'read returns latest spec')
  }

  // I. coding_task — create/inspect/merge/remove
  {
    const h = makeHarness()
    const created = await h.run('coding_task', { action: 'create', name: 'feat' })
    eq(created.state, 'active', 'task active')
    eq(created.branch, 'task/feat', 'task branch from worktree')

    const inspected = await h.run('coding_task', { action: 'inspect', id: created.id })
    eq(inspected.head, 'abc123', 'inspect head trimmed')
    eq(inspected.currentBranch, 'main', 'inspect branch trimmed')
    ok('fingerprint' in inspected, 'inspect fingerprint present')

    const merged = await h.run('coding_task', {
      action: 'merge', id: created.id, expectedCommit: 'base',
    })
    eq(merged.state, 'merged', 'task merged')

    const removed = await h.run('coding_task', { action: 'remove', id: created.id })
    eq(removed.state, 'removed', 'task removed')
  }

  // J. experience ledger — missing + available + parse + match + redaction
  {
    const h = makeHarness()
    writePackageJson(h.root)
    const missing = await h.run('coding_inspect', { mode: 'experience', query: 'timeout' })
    eq(missing.ledgerState, 'missing', 'missing ledger state')
    eq(missing.ledgerFound, false, 'ledgerFound false when missing')
    ok(missing.notices.includes('experience-ledger-unavailable'), 'missing ledger notice')

    writeLedger(h.root, [
      '## 2026-01-02 — timeout fix',
      '- Symptom: Bearer abc123 timed out',
      '- Root cause: slow query',
      '- Fix: add index',
      '- Verification: pytest',
      '- Source: src/db.ts',
      '',
      '## 2026-01-01 — unrelated',
      '- Symptom: nothing',
      '- Fix: none',
      '- Source: src/other.ts',
    ].join('\n'))
    const found = await h.run('coding_inspect', { mode: 'experience', query: 'timeout' })
    eq(found.ledgerState, 'available', 'ledger available')
    eq(found.ledgerFound, true, 'ledgerFound true')
    eq(found.total, 2, 'two parsed entries')
    ok(found.terms.includes('timeout'), 'query term normalized')
    eq(found.matches.length, 1, 'only matching entry returned')
    eq(found.matches[0].title, 'timeout fix', 'matched entry title')
    ok(found.matches[0].symptom.includes('[redacted]'), 'ledger text redacted')
  }

  // K. coding_inspect other modes + standards guide
  {
    const h = makeHarness()
    writePackageJson(h.root)
    const env = await h.run('coding_inspect', { mode: 'environment' })
    eq(env.workspaceId, 'ws-1', 'environment workspaceId')
    ok(env.checks.some((c) => c.name === 'test'), 'environment discovers test check')
    ok(env.notices.includes('no-checks-discovered') === false, 'checks discovered notice absent')

    const status = await h.run('coding_inspect', { mode: 'status' })
    eq(status.workspaceId, 'ws-1', 'status workspaceId')

    const quality = await h.run('coding_inspect', { mode: 'quality' })
    eq(quality.settledRuns, 0, 'quality settledRuns 0 initially')

    const standards = await h.run('coding_inspect', {
      mode: 'standards', languages: ['ts'], guideId: 'typescript-and-frontend', contentLanguage: 'en',
    })
    eq(standards.verification, 'not-run', 'standards verification not-run')
    eq(standards.guide.content, 'en body', 'guide content from requested language')

    await assert.rejects(
      h.run('coding_inspect', { mode: 'standards', languages: 'not-an-array' }),
      TypeError,
    ); checks += 1
    await assert.rejects(
      h.run('coding_inspect', { mode: 'standards', languages: Array(17).fill('ts') }),
      { message: 'Select at most 16 technical language names' },
    ); checks += 1
    await assert.rejects(
      h.run('coding_inspect', { mode: 'standards', languages: ['ts'], guideId: 'nope' }),
      { message: 'The guide is not applicable to the selected project languages' },
    ); checks += 1
  }

  // L. coding_repair — start requires failed check + multi-attempt success
  {
    const h = makeHarness()
    writePackageJson(h.root)
    h.state.exitCode = 1
    const failedRun = await h.run('coding_check', { action: 'run', check: 'test' })
    // a passing run for failed-check-required
    h.state.exitCode = 0
    const passedRun = await h.run('coding_check', { action: 'run', check: 'test' })
    await assert.rejects(
      h.run('coding_repair', { action: 'start', runId: passedRun.id }),
      (error) => error.code === REMOTE.code && error.details.reason === REASONS.failedCheckRequired,
    ); checks += 1

    const repair = await h.run('coding_repair', { action: 'start', runId: failedRun.id, maxAttempts: 2 })
    eq(repair.status, 'passed', 'repair passed after source check passes')
    eq(repair.maxAttempts, 2, 'repair maxAttempts')
    ok(repair.runIds.length >= 1, 'repair recorded verification runs')
    eq((await h.run('coding_repair', { action: 'read', id: repair.id })).id, repair.id, 'repair read')
    eq((await h.run('coding_repair', { action: 'cancel', id: repair.id })).id, repair.id, 'repair cancel on settled')
  }

  // M. coding_restore — capture-not-found and successful restore
  {
    const h = makeHarness()
    writeFileSync(join(h.root, 'restore.txt'), 'AFTER\n', 'utf8')
    const notFound = await h.run('coding_restore', { seq: 0, index: 0 })
    eq(notFound, { path: '', status: 'unavailable', reason: 'capture-not-found' }, 'capture-not-found')

    h.state.capture = {
      files: [{ path: 'restore.txt', kind: 'text', version: 1 }],
      contents: { before: 'BEFORE\n', after: 'AFTER\n', version: 1 },
    }
    const restored = await h.run('coding_restore', { seq: 1, index: 0 })
    eq(restored, { path: 'restore.txt', status: 'restored', reason: 'captured-before-state-restored' }, 'restore success')
    eq(readFileSync(join(h.root, 'restore.txt'), 'utf8'), 'BEFORE\n', 'before-state written')

    h.state.capture.contents.after = 'DIFFERENT\n'
    const conflict = await h.run('coding_restore', { seq: 1, index: 0 })
    eq(conflict.reason, 'current-content-differs-from-capture', 'conflict on changed content')
  }

  // N. coding_workbench service body tool + evidence + export
  {
    const h = makeHarness()
    writePackageJson(h.root)
    await h.service.init()
    const overview = await h.run('coding_workbench', { method: 'overview', request: {} })
    eq(overview.workspaceId, 'ws-1', 'workbench dispatches overview')
    eq(h.service.data.service, 'codingWorkbench', 'service data service id')

    const snapshot = await h.service.evidenceSnapshot({ workspaceId: 'ws-1' })
    ok('assessment' in snapshot && 'quality' in snapshot && 'overview' in snapshot, 'evidenceSnapshot shape')
    eq(typeof snapshot.truncated, 'boolean', 'snapshot truncated flag')

    const exported = await h.service.exportEvidence({ workspaceId: 'ws-1' })
    eq(exported.name, 'hey-coding-evidence.json', 'export file name frozen')
    ok(JSON.parse(exported.json).format === 'hey-coding-evidence', 'export format frozen')
  }

  // O. error reasons — at least 5 verbatim matches
  {
    const h = makeHarness()
    writePackageJson(h.root)
    await assert.rejects(h.run('coding_check', { action: 'run', check: 'nope' }),
      (e) => assertReason(e, REASONS.checkNotFound)); checks += 1

    await assert.rejects(h.run('coding_review', { action: 'update', id: 'missing' }),
      (e) => assertReason(e, REASONS.findingNotFound)); checks += 1

    await assert.rejects(h.run('coding_acceptance', {
      action: 'define', expectedRevision: 99, goal: 'x', criteria: [],
    }), (e) => assertReason(e, REASONS.specVersionConflict)); checks += 1

    await assert.rejects(
      h.service.admitCheck({
        workspaceId: 'ws-1', sessionId: 's-1', cwd: h.root,
        checkName: 'test', expectedArgv: ['npm', 'run', 'other'],
      }),
      (e) => assertReason(e, REASONS.checkCommandChanged),
    ); checks += 1

    await assert.rejects(async () => h.service.workspace('missing'),
      (e) => assertReason(e, REASONS.workspaceUnavailable)); checks += 1
    await assert.rejects(async () => h.service.agent('missing'),
      (e) => assertReason(e, REASONS.openWorkspaceSessionFirst)); checks += 1

    // session-workspace-mismatch via explicitly seeded mismatched session
    h.service.sessions.set('s-x', { id: 's-x', workspaceId: 'ws-other' })
    await assert.rejects(
      async () => h.service.ensureContext(h.exec('s-x', 'ws-1')),
      (e) => assertReason(e, REASONS.sessionWorkspaceMismatch),
    ); checks += 1

    // record-limit
    const h2 = makeHarness({ config: { maxRecords: 0 } })
    writeFileSync(join(h2.root, 'f.js'), 'x', 'utf8')
    await assert.rejects(h2.run('coding_review', { action: 'add', path: 'f.js' }),
      (e) => assertReason(e, REASONS.recordLimit)); checks += 1

    // export-too-large
    h.service.config.exportMaxBytes = 10
    await assert.rejects(h.service.exportEvidence({ workspaceId: 'ws-1' }),
      (e) => assertReason(e, REASONS.exportTooLarge)); checks += 1

    // tool-layer verbatim errors
    await assert.rejects(
      h.tools.coding_task.execute({ action: 'create' }, { agent: undefined }),
      { message: 'This coding operation requires a workspace Session' },
    ); checks += 1
    h.service.workspaces.get('ws-1').readOnly = true
    await assert.rejects(
      h.tools.coding_repair.execute({ action: 'start' }, h.exec()),
      { message: 'coding_repair start is unavailable in a source read-only role' },
    ); checks += 1
    h.service.workspaces.get('ws-1').readOnly = false

    // the special-message domain error
    ok(SPECIAL_ERROR.message === 'Use existing implementation Session IDs from this workspace; completed members are allowed.', 'special message frozen')
    await assert.rejects(h.run('coding_acceptance', {
      action: 'define', goal: 'x', criteria: [], independentVerificationOf: ['ghost'],
    }), (e) => (
      e.code === REMOTE.code
      && e.message === SPECIAL_ERROR.message
      && e.details.reason === REASONS.implementationSessionWorkspaceMismatch
    )); checks += 1
  }
} finally {
  for (const cleanup of cleanups) cleanup()
}

function assertReason(error, reason) {
  assert.ok(error && error.code === REMOTE.code, `expected ${REMOTE.code}, got ${error?.code}`)
  assert.equal(error.message, 'The coding operation could not be completed')
  assert.equal(error.details.reason, reason)
  return true
}

console.log(`coding self-test passed: ${checks} checks`)
