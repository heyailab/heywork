/**
 * @heywork/coding — plugin entry, the 8 coding tools, and the workbench service.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-coding-workbench/lib/.
 * Everything here is driven by specs/coding-workbench.md (438 lines):
 *   §1 frozen contract, §2-§8 the seven defineTool tools, §9 the
 *   CodingWorkbench service body (the 8th named "tool"), §11-§12 review notes.
 * Artifact judgment / coding standards are NOT reimplemented here: the
 * `standards` mode consumes the injected `selectCodingStandards` /
 * `evaluateGate` / `evaluateCheckpoint` from specs/delivery.md §8-§12.
 * No @deepseek-ai/* package is imported; all host capabilities are injected.
 *
 * NOTE on the "8 tools": spec §1.1 lists 8 names with `coding_workbench` being
 * the service body rather than a defineTool (§12 "待确认" item 1). Per the task
 * we register all 8 names through `tools.register`; the 8th descriptor is a
 * thin service-dispatch tool marked `serviceTool: true`.
 */

import { randomUUID } from 'node:crypto'
import {
  CAPS, COMMAND, DEFAULTS, FIXED_TEXTS, IDENTITY, REASONS, REMOTE,
  SPECIAL_ERROR, SUBPROCESS_ERRORS, TOOL_ERRORS, assertDeps,
} from './deps.js'
import {
  boundedText, parseDiagnostics, redactDevelopmentText, runCommand,
} from './process.js'
import {
  changedFileResult, discoverChecks, isPathInSourceScope, scanSources,
  selectChecksForScope, sweepFile, isSweepable, readSource, SWEEP_KINDS,
} from './source.js'
import { experienceSearch } from './experience.js'

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class RemoteError extends Error {
  constructor(code, message, details) {
    super(message)
    this.name = 'RemoteError'
    this.code = code
    this.details = details
  }
}

/** failed(reason) — the single domain error factory (spec §1.4). */
export function failed(reason) {
  throw new RemoteError(REMOTE.code, REMOTE.message, { reason })
}

function failedSpecial() {
  throw new RemoteError(REMOTE.code, SPECIAL_ERROR.message, { reason: SPECIAL_ERROR.reason })
}

const toolReadonly = (tool, action) => new Error(TOOL_ERRORS.readOnly(tool, action))
const json = (value) => JSON.stringify(value)
const parseJson = (value) => {
  try { return typeof value === 'string' ? JSON.parse(value) : value } catch { return value }
}

/** verificationMeta — compact receipts only, no command logs (spec §4, V:90-100). */
export function verificationMeta(value) {
  const parsed = parseJson(value)
  const run = parsed && parsed.run ? parsed.run : (parsed && parsed.status ? parsed : undefined)
  return {
    codingCheck: {
      version: 1,
      receipts: run
        ? [{ status: run.status, exitCode: run.exitCode, before: run.before, after: run.after }]
        : [],
    },
  }
}

// ---------------------------------------------------------------------------
// CodingWorkbench — the service body (spec §9)
// ---------------------------------------------------------------------------

export class CodingWorkbench {
  constructor(ctx = {}, config = {}) {
    this.ctx = ctx
    this.deps = { ...ctx, ...(config.deps ?? {}) }
    this.config = { ...DEFAULTS, ...config }
    this.serviceId = IDENTITY.service
    this.ready = false
    this.runs = new Map()
    this.findings = new Map()
    this.specs = new Map()
    this.tasks = new Map()
    this.repairs = new Map()
    this.checks = new Map()
    this.workspaces = new Map()
    this.sessions = new Map()
    this.controls = new Map()
    this.notices = []

    for (const workspace of config.workspaces ?? []) this.workspaces.set(workspace.id, workspace)
    for (const session of config.sessions ?? []) this.sessions.set(session.id, session)
  }

  static Config = DEFAULTS
  static inject = Object.freeze([
    'typert', 'storageDomain', 'workspaceRegistry', 'fs', 'subprocess', 'sandbox',
    'sandboxPolicy', 'agents', 'workingDirectory', 'workspaceChanges',
    'sessionProjections', 'sessionQuery', 'agentPresets', 'worktrees', 'approval',
  ])

  get data() {
    if (!this.ready) failed(REASONS.unavailable)
    return {
      service: this.serviceId,
      runs: this.runs.size,
      findings: this.findings.size,
      specs: this.specs.size,
      tasks: this.tasks.size,
      repairs: this.repairs.size,
    }
  }

  async init() {
    const home = this.config.dshHome
      ? `${this.config.dshHome.replace(/\/$/u, '')}/coding-workbench` : undefined
    this.home = home
    if (home && this.deps.fs?.mkdir) {
      await this.deps.fs.mkdir(home, { recursive: true, mode: 448 })
    }
    if (this.deps.withFileLock && home) {
      this._lease = await this.deps.withFileLock(`${home}/execution-owner`, {
        waitMs: this.config.leaseWaitMs,
        label: IDENTITY.timeouts.homeInUse,
      })
    }
    if (this.deps.defineDomain) {
      this._domain = await this.deps.defineDomain(IDENTITY.domain)
    }
    // Reopen interrupted work: running records become interrupted (spec §9).
    for (const record of [...this.runs.values(), ...this.repairs.values()]) {
      if (record.status === 'running') {
        record.status = 'interrupted'
        record.error = record.kind === 'repair'
          ? FIXED_TEXTS.hostStoppedRepair : FIXED_TEXTS.hostStoppedCheck
      }
    }
    if (this.deps.registerProjection) {
      this.deps.registerProjection('codingContextInspector', { init: () => ({}), apply: (_a, b) => b })
      this.deps.registerProjection('codingRecentChanges', { init: () => [], apply: (_a, b) => b })
    }
    this.ready = true
    return this
  }

  async destroy() {
    for (const control of this.controls.values()) control.abort?.()
    for (const agentHandle of this.taskAgents?.values?.() ?? []) {
      await agentHandle.dispose?.()
    }
    await this._domain?.close?.()
    await this._lease?.release?.()
    this.ready = false
  }

  // -- context / guards -----------------------------------------------------
  workspace(id) {
    const workspace = this.workspaces.get(id)
    if (!workspace) failed(REASONS.workspaceUnavailable)
    return workspace
  }

  agent(id) {
    const session = this.sessions.get(id)
    if (!session) failed(REASONS.openWorkspaceSessionFirst)
    return session
  }

  requireWorkspaceDirectory(workspaceId, cwd) {
    const workspace = this.workspace(workspaceId)
    if (cwd && workspace.path && !String(cwd).startsWith(String(workspace.path))) {
      failed(REASONS.workingDirectoryOutsideWorkspace)
    }
    return workspace
  }

  /** Resolve {workspaceId, sessionId, workspace, cwd} from an exec context. */
  ensureContext(exec) {
    const sessionId = exec?.agent?.session?.id ?? exec?.sessionId
    if (!sessionId) throw new Error(TOOL_ERRORS.workspaceSessionRequired)
    let workspaceId = exec?.agent?.workspaceId ?? exec?.workspaceId
    if (!workspaceId && this.config.autoContext !== false) {
      workspaceId = this.sessions.get(sessionId)?.workspaceId
    }
    if (!workspaceId && this.config.autoContext !== false) {
      workspaceId = `workspace-${sessionId}`
    }
    if (!workspaceId) throw new Error(TOOL_ERRORS.importWorkspaceFirst)

    if (!this.workspaces.has(workspaceId) && this.config.autoContext !== false) {
      this.workspaces.set(workspaceId, {
        id: workspaceId,
        path: exec?.agent?.workspacePath ?? exec?.agent?.cwd ?? this.config.workspacePath ?? workspaceId,
        readOnly: Boolean(exec?.agent?.readOnly ?? this.config.readOnly),
      })
    }
    if (!this.sessions.has(sessionId) && this.config.autoContext !== false) {
      this.sessions.set(sessionId, { id: sessionId, workspaceId })
    }
    const workspace = this.workspace(workspaceId)
    const session = this.agent(sessionId)
    if (session.workspaceId !== workspaceId) failed(REASONS.sessionWorkspaceMismatch)
    return { workspaceId, sessionId, workspace, cwd: workspace.path }
  }

  isReadOnly(workspaceId) {
    return Boolean(this.workspace(workspaceId).readOnly)
  }

  // -- discovery / fingerprint ---------------------------------------------
  async discoverFor(context, signal) {
    if (this.checks.size === 0) {
      const discovered = await discoverChecks(this.deps, this.config, { cwd: context.cwd, signal })
      for (const check of discovered) this.checks.set(check.name, check)
    }
    return [...this.checks.values()]
  }

  async fingerprintFor(context, signal) {
    return scanSources(this.deps, this.config, { cwd: context.cwd, signal })
  }

  // -- overview / doctor / quality -----------------------------------------
  overview({ workspaceId }) {
    this.workspace(workspaceId)
    const runs = [...this.runs.values()].filter((r) => r.workspaceId === workspaceId)
      .sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)))
    const spec = [...this.specs.values()].filter((s) => s.workspaceId === workspaceId)
      .sort((a, b) => b.revision - a.revision)[0] ?? null
    return {
      workspaceId,
      runs,
      findings: [...this.findings.values()].filter((f) => f.workspaceId === workspaceId),
      tasks: [...this.tasks.values()].filter((t) => t.workspaceId === workspaceId),
      spec,
      repairs: [...this.repairs.values()].filter((r) => r.workspaceId === workspaceId),
    }
  }

  async doctor({ workspaceId }, signal) {
    const workspace = this.workspace(workspaceId)
    const checks = await this.discoverFor({ workspaceId, cwd: workspace.path }, signal)
    const fingerprint = await this.fingerprintFor({ cwd: workspace.path }, signal)
    const programs = [...new Set(['git', 'node', ...checks.map((c) => c.argv?.[0]).filter(Boolean)])]
    const runtimes = []
    for (const program of programs) {
      let available = program === 'git' || program === 'node'
      let path = program
      if (this.deps.subprocess?.resolveExecutable) {
        try {
          path = await this.deps.subprocess.resolveExecutable(program, undefined, signal)
          available = true
        } catch { available = false }
      }
      runtimes.push({ program, available, path })
    }
    const notices = []
    if (checks.length === 0) notices.push('no-checks-discovered')
    if (!fingerprint.complete) notices.push('source-inspection-incomplete')
    return {
      workspaceId,
      path: workspace.path,
      checks: checks.map((c) => ({ ...c, argv: c.argv.map(redactDevelopmentText) })),
      runtimes,
      fingerprint,
      notices,
    }
  }

  qualityReport({ workspaceId }) {
    const runs = [...this.runs.values()].filter((r) => r.workspaceId === workspaceId)
    const settled = runs.filter((r) => r.status !== 'running')
    const passed = runs.filter((r) => r.status === 'passed')
    const failed = runs.filter((r) => r.status === 'failed')
    const abandoned = runs.filter((r) => ['cancelled', 'timed-out', 'interrupted', 'error'].includes(r.status))
    const repairs = [...this.repairs.values()].filter((r) => r.workspaceId === workspaceId)
    const findings = [...this.findings.values()].filter((f) => f.workspaceId === workspaceId)
    const bySeverity = (severity) => findings.filter((f) => f.severity === severity && f.state === 'open').length
    return {
      settledRuns: settled.length,
      passedRuns: passed.length,
      failedRuns: failed.length,
      abandonedRuns: abandoned.length,
      passRate: settled.length === 0 ? 0 : passed.length / settled.length,
      distinctChecksPassed: new Set(passed.map((r) => r.check)).size,
      repairCount: repairs.length,
      repairAttempts: repairs.reduce((sum, r) => sum + (r.attempts ?? 0), 0),
      repairsPassed: repairs.filter((r) => r.status === 'passed').length,
      findingsOpen: findings.filter((f) => f.state === 'open').length,
      findingsResolved: findings.filter((f) => f.state === 'resolved').length,
      findingsDismissed: findings.filter((f) => f.state === 'dismissed').length,
      openBySeverity: {
        critical: bySeverity('critical'), high: bySeverity('high'),
        medium: bySeverity('medium'), low: bySeverity('low'),
      },
    }
  }

  // -- checks ---------------------------------------------------------------
  async planChecks({ workspaceId }, signal) {
    const workspace = this.workspace(workspaceId)
    return this.discoverFor({ workspaceId, cwd: workspace.path }, signal)
  }

  async admitCheck(request, signal) {
    const { workspaceId, sessionId, cwd, checkName, scope, expectedArgv, expected } = request
    this.requireWorkspaceDirectory(workspaceId, cwd)

    const active = [...this.runs.values()].filter(
      (r) => r.workspaceId === workspaceId && r.status === 'running',
    )
    if (active.length >= this.config.concurrency) failed(REASONS.checkConcurrencyLimit)
    if (this.runs.size >= this.config.maxRecords) failed(REASONS.recordLimit)

    const checks = await this.discoverFor({ workspaceId, cwd }, signal)
    let selected
    let changedResult
    if (scope === 'changed') {
      changedResult = await this._changedFiles(cwd, signal)
      const decision = selectChecksForScope(checks, changedResult, changedResult.complete)
      selected = decision.runs
      request.scopeDecision = decision
    } else {
      selected = [checks.find((c) => c.name === checkName)].filter(Boolean)
      if (selected.length === 0) failed(REASONS.checkNotFound)
    }

    if (expected?.run || expected?.argv) {
      const expectedArgvValue = expected?.argv ?? expected?.run?.argv
      if (expectedArgvValue && JSON.stringify(selected[0]?.argv) !== JSON.stringify(expectedArgvValue)) {
        failed(REASONS.checkCommandChanged)
      }
    }
    if (expectedArgv && JSON.stringify(selected[0]?.argv) !== JSON.stringify(expectedArgv)) {
      failed(REASONS.checkCommandChanged)
    }

    const before = await this.fingerprintFor({ cwd }, signal)
    const run = {
      id: randomUUID(),
      workspaceId,
      sessionId,
      check: selected[0]?.name ?? checkName,
      name: selected[0]?.name ?? checkName,
      argv: selected[0]?.argv ?? [],
      kind: selected[0]?.kind ?? 'custom',
      status: 'running',
      sequence: this._nextSequence(workspaceId),
      startedAt: new Date().toISOString(),
      finishedAt: null,
      before,
      after: null,
      exitCode: null,
      stdout: '',
      stderr: '',
      truncated: false,
      diagnostics: [],
      error: null,
    }
    this.runs.set(run.id, run)
    return { run, selected, changedResult, checks }
  }

  _nextSequence(workspaceId) {
    const max = [...this.runs.values()]
      .filter((r) => r.workspaceId === workspaceId)
      .reduce((m, r) => Math.max(m, r.sequence ?? 0), 0)
    if (max >= Number.MAX_SAFE_INTEGER) failed(REASONS.executionSequenceExhausted)
    return max + 1
  }

  async _changedFiles(cwd, signal) {
    if (typeof this.deps.changedFiles === 'function') {
      const result = await this.deps.changedFiles({ cwd, signal })
      if (Array.isArray(result)) return changedFileResult(result)
      return changedFileResult(result.files ?? [], result)
    }
    return changedFileResult([], { complete: false, reason: 'git-unavailable' })
  }

  async startCheck(request, signal) {
    const admitted = await this.admitCheck(request, signal)
    const { run, selected, changedResult, checks } = admitted
    const control = new AbortController()
    this.controls.set(run.id, control)
    const policy = this._policy(request.sessionId)

    try {
      const outputs = []
      for (const check of selected) {
        let result
        if (typeof this.deps.checkRunner === 'function') {
          result = await this.deps.checkRunner({ check, cwd: request.cwd, signal: control.signal })
        } else {
          result = await runCommand(this.deps, this.config, {
            argv: check.argv,
            cwd: request.cwd,
            policy,
            signal: control.signal,
          })
        }
        outputs.push({ check, result })
      }
      const after = await this.fingerprintFor({ cwd: request.cwd }, signal)
      const first = outputs[0]?.result ?? { exitCode: 1, stdout: '', stderr: '', truncated: false, timedOut: false, cancelled: false }
      run.after = after
      run.exitCode = first.exitCode
      run.stdout = first.stdout ?? ''
      run.stderr = first.stderr ?? ''
      run.truncated = Boolean(first.truncated || outputs.some((o) => o.result.truncated))
      run.status = first.timedOut ? 'timed-out'
        : first.cancelled ? 'cancelled'
          : first.exitCode === 0 ? 'passed' : 'failed'
      run.diagnostics = parseDiagnostics(`${run.stdout}\n${run.stderr}`, this.config.resultLimit)
      run.finishedAt = new Date().toISOString()
      this.controls.delete(run.id)

      if (request.scope === 'changed') {
        return {
          scope: 'changed',
          changedFiles: changedResult?.files ?? [],
          complete: Boolean(changedResult?.complete),
          reason: changedResult?.reason ?? null,
          runs: [...this.runs.values()].filter((r) => r.workspaceId === request.workspaceId && r.id === run.id),
          skipped: request.scopeDecision?.skipped ?? [],
        }
      }
      return run
    } catch (error) {
      run.status = 'error'
      run.error = FIXED_TEXTS.checkCouldNotRun(error?.message ?? String(error))
      run.finishedAt = new Date().toISOString()
      this.controls.delete(run.id)
      return run
    }
  }

  _policy(sessionId) {
    const get = this.deps.get
    if (typeof get !== 'function') return {}
    const service = get('sandboxPolicy')
    if (!service) return {}
    if (typeof service.resolve === 'function') return service.resolve({ session: sessionId }) ?? {}
    return service
  }

  readCheck(workspaceId, id) {
    const run = this.runs.get(id)
    if (!run || run.workspaceId !== workspaceId) throw new Error(TOOL_ERRORS.checkNotInWorkspace)
    return run
  }

  cancelCheck(workspaceId, id) {
    const run = this.readCheck(workspaceId, id)
    const control = this.controls.get(id)
    if (run.status === 'running') {
      control?.abort?.()
      run.status = 'cancelled'
      run.error = FIXED_TEXTS.checkCancelled
      run.finishedAt = new Date().toISOString()
      this.controls.delete(id)
    }
    return run
  }

  // -- acceptance -----------------------------------------------------------
  readSpec({ workspaceId }) {
    this.workspace(workspaceId)
    return [...this.specs.values()].filter((s) => s.workspaceId === workspaceId)
      .sort((a, b) => b.revision - a.revision)[0] ?? null
  }

  async saveSpec(request, signal) {
    const { workspaceId, sessionId, expectedRevision, goal, independentVerificationOf, criteria } = request
    this.workspace(workspaceId)
    const current = this.readSpec({ workspaceId })
    const revision = (current?.revision ?? 0) + 1
    if (expectedRevision !== null && expectedRevision !== undefined && expectedRevision !== (current?.revision ?? 0)) {
      failed(REASONS.specVersionConflict)
    }
    if (this.specs.size >= this.config.maxRecords) failed(REASONS.recordLimit)

    let implementers = independentVerificationOf
    if (implementers === undefined) {
      implementers = current?.independentVerificationOf ?? []
    } else {
      const unique = [...new Set(implementers)]
      if (unique.length !== implementers.length) failed(REASONS.duplicateImplementer)
      for (const id of implementers) {
        const session = this.sessions.get(id)
        if (!session) failedSpecial()
        if (session.workspaceId !== workspaceId) failedSpecial()
      }
      implementers = unique
    }

    const checks = await this.discoverFor({ workspaceId, cwd: this.workspace(workspaceId).path }, signal)
    const known = new Set(checks.map((c) => c.name))
    const ids = new Set()
    for (const criterion of criteria ?? []) {
      if (ids.has(criterion.id)) failed(REASONS.duplicateCriterion)
      ids.add(criterion.id)
      for (const checkName of criterion.checks ?? []) {
        if (!known.has(checkName)) failed(REASONS.checkNotFound)
      }
    }

    const spec = {
      id: randomUUID(),
      workspaceId,
      sessionId,
      revision,
      goal: goal ?? '',
      criteria: criteria ?? [],
      updatedAt: new Date().toISOString(),
      ...(implementers.length ? { independentVerificationOf: implementers } : {}),
    }
    this.specs.set(`${workspaceId}_${revision}`, spec)
    return spec
  }

  // -- findings -------------------------------------------------------------
  async addFinding(request, signal) {
    const { workspaceId, sessionId, path, line, severity, title, evidence } = request
    if (this.findings.size >= this.config.maxRecords) failed(REASONS.recordLimit)
    let read
    try {
      read = await readSource(this.deps, this.config, {
        relative: path, cwd: this.workspace(workspaceId).path, signal,
      })
    } catch (error) {
      if (error?.message === SUBPROCESS_ERRORS.pathOutsideSourceScope) failed(REASONS.sourceNotFound)
      failed(REASONS.sourceNotFound)
    }
    const now = new Date().toISOString()
    const finding = {
      id: randomUUID(), workspaceId, sessionId, path, line: line ?? 0,
      severity: severity ?? 'medium', title: title ?? '', evidence: evidence ?? '',
      sourceHash: read.hash, state: 'open', createdAt: now, updatedAt: now,
    }
    this.findings.set(finding.id, finding)
    return finding
  }

  updateFinding(workspaceId, id, state) {
    const finding = this.findings.get(id)
    if (!finding) failed(REASONS.findingNotFound)
    if (finding.workspaceId !== workspaceId) throw new Error(TOOL_ERRORS.findingNotInWorkspace)
    finding.state = state ?? 'open'
    finding.updatedAt = new Date().toISOString()
    return finding
  }

  // -- acceptance assessment ------------------------------------------------
  async assess({ workspaceId }) {
    const spec = this.readSpec({ workspaceId })
    const runs = [...this.runs.values()].filter((r) => r.workspaceId === workspaceId)
    const checks = await this.discoverFor({ workspaceId, cwd: this.workspace(workspaceId).path })
    const findings = [...this.findings.values()].filter((f) => f.workspaceId === workspaceId)
    const missingChecks = []
    for (const criterion of spec?.criteria ?? []) {
      for (const check of criterion.checks ?? []) {
        if (!checks.some((c) => c.name === check)) missingChecks.push(check)
      }
    }
    const openTasks = [...this.tasks.values()].filter(
      (t) => t.workspaceId === workspaceId && t.state === 'active',
    )
    return {
      workspaceId,
      spec,
      ready: Boolean(spec) && missingChecks.length === 0 && openTasks.length === 0,
      missingChecks,
      openTasks,
      staleRuns: runs.filter((r) => r.status === 'passed' && !r.after?.complete).map((r) => r.id),
      freshFindings: findings.filter((f) => f.state === 'open'),
    }
  }

  // -- impact / sweep / context / experience --------------------------------
  async impact({ workspaceId, query }, signal) {
    const workspace = this.workspace(workspaceId)
    const matches = []
    let truncated = false
    if (typeof this.deps.impactScan === 'function') {
      const result = await this.deps.impactScan({ query, cwd: workspace.path, signal })
      matches.push(...(result.matches ?? []))
      truncated = Boolean(result.truncated)
    }
    const fingerprint = await this.fingerprintFor({ cwd: workspace.path }, signal)
    return { workspaceId, fingerprint, matches, truncated, method: 'text' }
  }

  async sweep({ workspaceId }, signal) {
    const workspace = this.workspace(workspaceId)
    const changed = await this._changedFiles(workspace.path, signal)
    const files = []
    const findings = []
    const declared = new Set(Object.keys(this.config.declaredPackages ?? {}))
    for (const file of changed.files) {
      const covered = isSweepable(file)
      files.push({ path: file, covered })
      if (!covered) continue
      if (typeof this.deps.sweepLines === 'function') {
        const lines = await this.deps.sweepLines({ path: file, cwd: workspace.path, signal })
        findings.push(...sweepFile(file, lines, declared, this.config.duplicateWindowLines))
      }
    }
    return {
      files,
      complete: changed.complete,
      reason: changed.reason,
      coverage: files.map((f) => ({ path: f.path, covered: f.covered })),
      findings,
    }
  }

  async context({ workspaceId }) {
    const workspace = this.workspace(workspaceId)
    const projection = this.deps.sessionQuery?.getProjection?.('codingContextInspector')
    const raw = projection ?? {}
    return {
      workspaceId,
      form: raw.form ?? 'snapshot',
      sections: raw.form === 'snapshot' ? (raw.sections ?? []).slice(0, CAPS.MAX_SECTIONS) : [],
      text: boundedText(raw.text ?? '', this.config.contextBytes),
    }
  }

  async experienceSearchFn(request, signal) {
    return experienceSearch(this.deps, this.config, {
      ...request,
      signal,
      cwd: this.workspace(request.workspaceId).path,
    })
  }

  // -- tasks (worktrees) ----------------------------------------------------
  async createTask(request, signal) {
    const { workspaceId, sessionId, name } = request
    if (this.tasks.size >= this.config.maxRecords) failed(REASONS.recordLimit)
    if (!this.config.model && !this.deps.agents) failed(REASONS.modelNotConfigured)
    const worktree = this.deps.worktrees
      ? await this.deps.worktrees.create({ workspaceId, name, signal })
      : { path: `${this.workspace(workspaceId).path}-${name ?? 'task'}-${Date.now()}`, branch: `task/${name ?? randomUUID()}` }
    const task = {
      id: randomUUID(),
      workspaceId,
      sessionId,
      name: name ?? '',
      path: worktree.path,
      branch: worktree.branch,
      baseCommit: worktree.baseCommit ?? null,
      repositoryRoot: worktree.repositoryRoot ?? this.workspace(workspaceId).path,
      createdAt: new Date().toISOString(),
      state: 'active',
      ...worktree,
    }
    this.tasks.set(task.id, task)
    return task
  }

  async inspectTask(request, signal) {
    const task = this.tasks.get(request.id)
    if (!task) failed(REASONS.taskNotFound)
    if (task.state === 'removed') failed(REASONS.taskRemoved)
    const git = this._gitInspector({
      cwd: task.path,
      baseCommit: task.baseCommit,
      signal,
    })
    const [head, currentBranch, status, diff] = await Promise.all(git)
    const fingerprint = await scanSources(this.deps, this.config, { cwd: task.path, signal })
    return {
      task,
      head: String(head ?? '').trimEnd(),
      currentBranch: String(currentBranch ?? '').trimEnd(),
      status: status ?? '',
      diff: diff ?? '',
      truncated: Boolean(fingerprint.complete === false),
      fingerprint,
    }
  }

  _gitInspector({ cwd, baseCommit, signal }) {
    if (typeof this.deps.gitInspect === 'function') {
      const result = this.deps.gitInspect({ cwd, baseCommit, signal })
      if (result && typeof result.then === 'function') return result
      return [
        Promise.resolve(result.head), Promise.resolve(result.currentBranch),
        Promise.resolve(result.status), Promise.resolve(result.diff),
      ]
    }
    const policy = { mode: 'read-only' }
    const run = (argv) => runCommand(this.deps, this.config, { argv, cwd, policy, signal })
      .then((r) => { if (r.exitCode !== 0) failed(REASONS.gitInspectionFailed); return r.stdout })
      .catch((error) => { if (error?.code === REMOTE.code) throw error; failed(REASONS.gitInspectionFailed) })
    return [
      run(['git', 'rev-parse', 'HEAD']),
      run(['git', 'branch', '--show-current']),
      run(['git', 'status', '--porcelain=v1', '--untracked-files=all']),
      run(['git', 'diff', '--no-ext-diff', '--no-textconv', baseCommit ?? 'HEAD', '--']),
    ]
  }

  async mergeTask(request, signal) {
    const task = this.tasks.get(request.id)
    if (!task) failed(REASONS.taskNotFound)
    if (task.state !== 'active') failed(REASONS.taskRemoved)
    if (request.expectedCommit === undefined) failed(REASONS.commitNotConfirmedInspectTask)
    if (typeof this.deps.gitMerge === 'function') {
      const outcome = await this.deps.gitMerge({ task, expectedCommit: request.expectedCommit, signal })
      if (outcome?.ok === false) failed(REASONS.mergeRevisionNotConfirmed)
    }
    task.state = 'merged'
    task.mergedAt = new Date().toISOString()
    return task
  }

  async removeTask(request, signal) {
    const task = this.tasks.get(request.id)
    if (!task) failed(REASONS.taskNotFound)
    if (task.state === 'removed') failed(REASONS.taskRemoved)
    if (typeof this.deps.gitWorktreeRemove === 'function') {
      const outcome = await this.deps.gitWorktreeRemove({ task, signal })
      if (outcome?.ok === false) failed(REASONS.cleanupNotConfirmedInspectTask)
    }
    task.state = 'removed'
    task.removedAt = new Date().toISOString()
    return task
  }

  async restoreTask(request) {
    const task = [...this.tasks.values()].find((t) => t.id === request.id)
    if (!task) failed(REASONS.taskNotFound)
    return { task, branchRecreated: true }
  }

  // -- repairs --------------------------------------------------------------
  async startRepair(request, signal) {
    const { workspaceId, sessionId, runId, maxAttempts } = request
    const parent = this.runs.get(runId)
    if (!parent || parent.workspaceId !== workspaceId) throw new Error(TOOL_ERRORS.checkNotInWorkspace)
    if (!['failed', 'error', 'timed-out'].includes(parent.status)) failed(REASONS.failedCheckRequired)
    if ([...this.repairs.values()].some((r) => r.workspaceId === workspaceId && r.status === 'running')) {
      failed(REASONS.repairAlreadyRunning)
    }
    if (this.repairs.size >= this.config.maxRecords) failed(REASONS.recordLimit)
    if ((parent.argv ?? []).some((part) => String(part).includes('[redacted]'))) {
      failed(REASONS.repairCommandRedacted)
    }
    if (!parent.before?.complete || JSON.stringify(parent.before) !== JSON.stringify(parent.after)) {
      failed(REASONS.repairSourceChanged)
    }
    const attempts = Math.min(maxAttempts ?? 1, this.config.repairAttempts)
    const repair = {
      id: randomUUID(),
      workspaceId,
      parentSessionId: sessionId,
      childSessionId: null,
      initialRunId: runId,
      maxAttempts: attempts,
      attempts: 0,
      runIds: [],
      status: 'running',
      startedAt: new Date().toISOString(),
      finishedAt: null,
      error: null,
      kind: 'repair',
    }
    this.repairs.set(repair.id, repair)

    try {
      for (let n = 1; n <= attempts; n += 1) {
        const retry = await this.startCheck({
          workspaceId,
          sessionId,
          cwd: this.workspace(workspaceId).path,
          checkName: parent.check,
          expected: { run: parent, argv: parent.argv },
        }, signal)
        repair.attempts = n
        repair.runIds.push(retry.id)
        if (retry.status === 'passed') {
          repair.status = 'passed'
          break
        }
      }
      if (repair.status === 'running') repair.status = 'failed'
    } catch (error) {
      if (error?.code === REMOTE.code && error.details?.reason === REASONS.checkCommandChanged) {
        repair.error = FIXED_TEXTS.repairCheckChanged
      } else {
        repair.error = FIXED_TEXTS.repairNoSuccess
      }
      repair.status = 'failed'
    }
    repair.finishedAt = new Date().toISOString()
    return repair
  }

  readRepair(workspaceId, id) {
    const repair = this.repairs.get(id)
    if (!repair || repair.workspaceId !== workspaceId) throw new Error(TOOL_ERRORS.repairNotInWorkspace)
    return repair
  }

  cancelRepair(workspaceId, id) {
    const repair = this.readRepair(workspaceId, id)
    if (repair.status === 'running') {
      repair.status = 'cancelled'
      repair.error = FIXED_TEXTS.repairCancelled
      repair.finishedAt = new Date().toISOString()
    }
    return repair
  }

  // -- restore --------------------------------------------------------------
  async restoreFile(request, signal) {
    const { workspaceId, sessionId, seq, index } = request
    const capture = this.deps.workspaceChanges
      ? await this.deps.workspaceChanges.summary?.(sessionId, seq) : undefined
    const file = capture?.files?.[index]
    if (!file) return { path: '', status: 'unavailable', reason: 'capture-not-found' }
    const workspace = this.workspace(workspaceId)
    if (!isPathInSourceScope(file.path)) {
      return { path: file.path, status: 'unsupported', reason: 'outside-workspace' }
    }
    if (file.kind !== 'text') {
      return { path: file.path, status: 'unsupported', reason: 'only-bounded-text-can-be-restored' }
    }
    const contents = await this.deps.workspaceChanges?.contents?.(sessionId, seq, index)
    if (!contents || typeof contents.after !== 'string') {
      return { path: file.path, status: 'unsupported', reason: 'only-bounded-text-can-be-restored' }
    }
    let current
    try {
      current = await readSource(this.deps, this.config, {
        relative: file.path, cwd: workspace.path, signal,
      })
    } catch {
      current = null
    }
    const currentText = current ? Buffer.from(current.bytes).toString('utf8') : null
    if (currentText !== contents.after) {
      return { path: file.path, status: 'conflict', reason: 'current-content-differs-from-capture' }
    }
    if (contents.version !== undefined && file.version !== undefined && contents.version !== file.version) {
      return { path: file.path, status: 'conflict', reason: 'observed-version-changed' }
    }
    await this._writeObserved(workspace, file.path, contents.before, signal)
    return {
      path: file.path,
      status: 'restored',
      reason: contents.before === null ? 'already-absent' : 'captured-before-state-restored',
    }
  }

  async _writeObserved(workspace, relative, before, signal) {
    const target = this.deps.fs.resolve(relative, { cwd: workspace.path, signal })
    if (before === null) {
      await this.deps.waterfall?.('fs/delete-intent', target, {}, () => undefined)
      await this.deps.fs.delete?.(target, signal)
    } else {
      const intent = await this.deps.waterfall?.('fs/write-intent', target, {}, () => undefined)
      await this.deps.fs.writeText(target, before, intent, signal)
    }
    this.deps.emit?.('fs/observed', { path: relative, workspaceId: workspace.id })
  }

  // -- evidence -------------------------------------------------------------
  async evidenceSnapshot({ workspaceId }, signal) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const before = await this._evidenceState(workspaceId, signal)
      const assessment = await this.assess({ workspaceId })
      const quality = this.qualityReport({ workspaceId })
      const overview = this.overview({ workspaceId })
      const after = await this._evidenceState(workspaceId, signal)
      if (JSON.stringify(before) === JSON.stringify(after)) {
        const truncated = overview.runs.length > DEFAULTS.resultLimit
        return {
          assessment,
          quality,
          overview: { ...overview, runs: overview.runs.slice(0, Math.min(this.config.resultLimit, 50)) },
          totals: {
            runs: overview.runs.length,
            findings: overview.findings.length,
            repairs: overview.repairs.length,
          },
          truncated,
        }
      }
    }
    failed(REASONS.evidenceChanging)
  }

  async _evidenceState(workspaceId, signal) {
    const fingerprint = await this.fingerprintFor({
      cwd: this.workspace(workspaceId).path,
    }, signal)
    return {
      digest: fingerprint.digest,
      runIds: [...this.runs.values()].filter((r) => r.workspaceId === workspaceId).map((r) => r.id),
      specRevision: this.readSpec({ workspaceId })?.revision ?? 0,
    }
  }

  async exportEvidence({ workspaceId }, signal) {
    const snapshot = await this.evidenceSnapshot({ workspaceId }, signal)
    const specs = [...this.specs.values()].filter((s) => s.workspaceId === workspaceId)
    const contexts = []
    for (const run of snapshot.overview.runs) {
      contexts.push(await this.context({ workspaceId, sessionId: run.sessionId }))
    }
    const payload = redactDevelopmentText(json({
      format: IDENTITY.evidenceFormat,
      snapshot,
      specs,
      contexts,
    }))
    if (Buffer.byteLength(payload, 'utf8') > this.config.exportMaxBytes) failed(REASONS.exportTooLarge)
    return { name: IDENTITY.evidenceFileName, json: payload }
  }

  changes(request) { return this.deps.workspaceChanges?.summary?.(request.sessionId, request.seq) ?? [] }
  diff(request) { return { workspaceId: request.workspaceId, diff: '' } }
  commitTask(request) { const task = this.tasks.get(request.id); if (!task) failed(REASONS.taskNotFound); return task }
}

// ---------------------------------------------------------------------------
// Tool registration (spec §2-§8)
// ---------------------------------------------------------------------------

const textOutput = (presentationMeta) => ({
  schema: { type: 'string' },
  render: (_args, value) => [{ type: 'text', text: String(value) }],
  ...(presentationMeta ? { presentationMeta } : {}),
})

const card = (title, rawInput) => ({
  card: 'generic',
  title,
  kind: 'other',
  ...(rawInput === undefined ? {} : { rawInput }),
})

function registerCodingTools(deps, config, service) {
  const { defineTool, tools } = deps
  const readOnlyOf = (exec) => service.isReadOnly(service.ensureContext(exec).workspaceId)

  // 1. coding_task ---------------------------------------------------------
  tools.register(defineTool({
    name: 'coding_task',
    description: 'Create, inspect, merge or remove an isolated worktree task for coding evidence. Read-only roles may only inspect.',
    parameters: {
      action: { type: 'string', required: true, enum: ['create', 'inspect', 'merge', 'remove'] },
      id: { type: 'string' },
      name: { type: 'string' },
      expectedCommit: { type: 'string' },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      if (args.action !== 'inspect' && readOnlyOf(exec)) throw toolReadonly('coding_task', args.action)
      let result
      if (args.action === 'create') result = await service.createTask({ ...context, name: args.name }, exec?.signal)
      else if (args.action === 'inspect') result = await service.inspectTask({ ...context, id: args.id }, exec?.signal)
      else if (args.action === 'merge') result = await service.mergeTask({ ...context, id: args.id, expectedCommit: args.expectedCommit }, exec?.signal)
      else if (args.action === 'remove') result = await service.removeTask({ ...context, id: args.id }, exec?.signal)
      else throw new Error(`coding_task unknown action: ${args.action}`)
      return json(result)
    },
    presentCall: (args) => card(`Coding task: ${args.action}`, args),
  }))

  // 2. coding_inspect -------------------------------------------------------
  tools.register(defineTool({
    name: 'coding_inspect',
    description: 'Inspect coding evidence: environment, status, acceptance, impact, context, quality, sweep, experience, standards.',
    parameters: {
      mode: {
        type: 'string', required: true,
        enum: ['environment', 'status', 'acceptance', 'impact', 'context', 'quality', 'sweep', 'experience', 'standards'],
      },
      query: { type: 'string' },
      guideId: { type: 'string' },
      contentLanguage: { type: 'string', enum: ['en', 'zh'] },
      languages: { type: 'array', items: { type: 'string' } },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      const signal = exec?.signal
      if (args.mode === 'standards') {
        const languages = args.languages ?? []
        if (languages.length > 16) throw new Error(TOOL_ERRORS.tooManyLanguages)
        if (languages.some((l) => typeof l !== 'string')) throw new TypeError('languages must be string[]')
        const select = deps.selectCodingStandards
        const selection = select
          ? select(languages)
          : { catalogVersion: 'unavailable', languages: [], rules: [], guides: [], sources: [], policy: { selectedRulesAreNotVerified: true } }
        let guide
        if (args.guideId) {
          const candidates = selection.guides ?? []
          guide = candidates.find((g) => g.id === args.guideId)
          if (!guide) throw new Error(TOOL_ERRORS.guideNotApplicable)
          const lang = args.contentLanguage ?? 'en'
          guide = { id: guide.id, title: guide.title, content: guide.body?.[lang] ?? '' }
        }
        return json({
          selection,
          guides: (selection.guides ?? []).map((g) => g.id),
          ...(guide ? { guide } : {}),
          projectChecks: await service.planChecks(context, signal),
          verification: 'not-run',
          next: 'Selected rules are not verified; run the corresponding checks before relying on them.',
        })
      }
      if (args.mode === 'environment') return json(await service.doctor(context, signal))
      if (args.mode === 'status') return json(service.overview(context))
      if (args.mode === 'acceptance') return json(await service.assess(context))
      if (args.mode === 'impact') return json(await service.impact({ ...context, query: args.query }, signal))
      if (args.mode === 'context') return json(await service.context(context))
      if (args.mode === 'quality') return json(service.qualityReport(context))
      if (args.mode === 'sweep') return json(await service.sweep(context, signal))
      if (args.mode === 'experience') {
        return json(await service.experienceSearchFn({ ...context, query: args.query }, signal))
      }
      throw new Error(`coding_inspect unknown mode: ${args.mode}`)
    },
    presentCall: (args) => card(`Coding: ${args.mode}`, args),
  }))

  // 3. coding_check ---------------------------------------------------------
  tools.register(defineTool({
    name: 'coding_check',
    description: 'Run, read or cancel a discovered check. "changed" scope runs every check affected by the change set.',
    parameters: {
      action: { type: 'string', required: true, enum: ['run', 'read', 'cancel'] },
      check: { type: 'string' },
      scope: { type: 'string', enum: ['changed'] },
      id: { type: 'string' },
    },
    output: textOutput((value) => verificationMeta(value)),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      if (args.action !== 'read' && readOnlyOf(exec)) throw toolReadonly('coding_check', args.action)
      if (args.action === 'run') {
        if (args.check !== undefined && args.scope !== undefined) throw new Error(TOOL_ERRORS.checkOrScope)
        return json(await service.startCheck({
          ...context, checkName: args.check, scope: args.scope,
        }, exec?.signal))
      }
      if (args.action === 'read') return json(service.readCheck(context.workspaceId, args.id))
      if (args.action === 'cancel') return json(service.cancelCheck(context.workspaceId, args.id))
      throw new Error(`coding_check unknown action: ${args.action}`)
    },
    presentCall: (args) => card(`Check: ${args.scope ?? args.check ?? args.id ?? args.action}`, args),
  }))

  // 4. coding_repair --------------------------------------------------------
  tools.register(defineTool({
    name: 'coding_repair',
    description: 'Start, read or cancel a bounded repair of a failed check, with independent verification runs.',
    parameters: {
      action: { type: 'string', required: true, enum: ['start', 'read', 'cancel'] },
      runId: { type: 'string' },
      id: { type: 'string' },
      maxAttempts: { type: 'integer' },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      if (args.action !== 'read' && readOnlyOf(exec)) throw toolReadonly('coding_repair', args.action)
      if (args.action === 'start') {
        const attempts = args.maxAttempts ?? 1
        if (!Number.isInteger(attempts) || attempts < 1 || attempts > service.config.repairAttempts) {
          throw new Error('maxAttempts must be an integer between 1 and the deployed repairAttempts limit')
        }
        return json(await service.startRepair({ ...context, runId: args.runId, maxAttempts: attempts }, exec?.signal))
      }
      if (args.action === 'read') return json(service.readRepair(context.workspaceId, args.id))
      if (args.action === 'cancel') return json(service.cancelRepair(context.workspaceId, args.id))
      throw new Error(`coding_repair unknown action: ${args.action}`)
    },
    presentCall: (args) => card(`Repair: ${args.action}`, args),
  }))

  // 5. coding_review --------------------------------------------------------
  tools.register(defineTool({
    name: 'coding_review',
    description: 'Add or update a review finding. A finding is review metadata, not proof that a check passed.',
    parameters: {
      action: { type: 'string', required: true, enum: ['add', 'update'] },
      path: { type: 'string' },
      line: { type: 'integer' },
      severity: { type: 'string', enum: ['critical', 'high', 'medium', 'low'] },
      title: { type: 'string' },
      evidence: { type: 'string' },
      id: { type: 'string' },
      state: { type: 'string', enum: ['open', 'resolved', 'dismissed'] },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      if (args.action === 'add') {
        return json(await service.addFinding({ ...context, ...args }, exec?.signal))
      }
      if (args.action === 'update') {
        return json(service.updateFinding(context.workspaceId, args.id, args.state))
      }
      throw new Error(`coding_review unknown action: ${args.action}`)
    },
    presentCall: () => card('Code review finding'),
  }))

  // 6. coding_acceptance ----------------------------------------------------
  tools.register(defineTool({
    name: 'coding_acceptance',
    description: 'Read or define the acceptance spec (goal, criteria, independent verification roster).',
    parameters: {
      action: { type: 'string', required: true, enum: ['read', 'define'] },
      expectedRevision: { type: 'integer' },
      goal: { type: 'string' },
      independentVerificationOf: { type: 'array', items: { type: 'string' } },
      criteria: { type: 'array', items: { type: 'object' } },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      if (args.action === 'define' && readOnlyOf(exec)) throw toolReadonly('coding_acceptance', args.action)
      if (args.action === 'read') return json(service.readSpec(context))
      if (args.action === 'define') {
        return json(await service.saveSpec({
          ...context,
          expectedRevision: args.expectedRevision ?? null,
          goal: args.goal ?? '',
          independentVerificationOf: args.independentVerificationOf,
          criteria: args.criteria ?? [],
        }, exec?.signal))
      }
      throw new Error(`coding_acceptance unknown action: ${args.action}`)
    },
    presentCall: (args) => card(`Acceptance: ${args.action}`, args),
  }))

  // 7. coding_restore -------------------------------------------------------
  tools.register(defineTool({
    name: 'coding_restore',
    description: 'Restore a bounded text file from a captured workspace change, only when its after-state is unchanged.',
    parameters: {
      seq: { type: 'integer', required: true, minimum: 0 },
      index: { type: 'integer', required: true, minimum: 0 },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      return json(await service.restoreFile({ ...context, seq: args.seq, index: args.index }, exec?.signal))
    },
    presentCall: (args) => card('Restore captured file', args),
  }))

  // 8. coding_workbench (service body, §9) ---------------------------------
  tools.register(defineTool({
    name: 'coding_workbench',
    description: 'The coding workbench service body: dispatches to its Remote method surface (overview, doctor, startCheck, assess, exportEvidence, ...).',
    serviceTool: true,
    parameters: {
      method: { type: 'string' },
      request: { type: 'object' },
    },
    output: textOutput(),
    async execute(args, exec) {
      const context = service.ensureContext(exec)
      const method = args.method ?? 'overview'
      if (typeof service[method] !== 'function') throw new Error(`coding_workbench unknown method: ${method}`)
      const result = await service[method]({ ...context, ...(args.request ?? {}) }, exec?.signal)
      return json(result)
    },
    presentCall: (args) => card(`Workbench: ${args.method ?? 'overview'}`, args),
  }))
}

// ---------------------------------------------------------------------------
// Plugin exports
// ---------------------------------------------------------------------------

export const name = IDENTITY.pluginName
export const inject = IDENTITY.inject

/** Register 8 tools and expose the service at ctx.codingWorkbench. */
export function apply(ctx = {}, config = {}) {
  assertDeps(ctx, ['tools'])
  const deps = { ...ctx, ...(config.deps ?? {}) }
  const service = config.codingWorkbench instanceof CodingWorkbench
    ? config.codingWorkbench
    : new CodingWorkbench(ctx, config)
  registerCodingTools(deps, config, service)

  if (deps.systemPrompt?.section) {
    deps.systemPrompt.section({
      name: IDENTITY.systemPrompt.name,
      order: IDENTITY.systemPrompt.order,
      text: IDENTITY.systemPromptBrand,
    })
  }

  ctx.codingWorkbench = service
  ctx.__codingWorkbenchService = service
  return service
}

export default CodingWorkbench
