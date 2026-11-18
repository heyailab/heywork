/**
 * @heywork/coding — shared frozen contracts.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-coding-workbench/lib/.
 * Every value below is transcribed verbatim from specs/coding-workbench.md §1
 * (the frozen contract). Upstream @deepseek-ai/* capabilities are injected at
 * apply() time; this module imports none of them.
 */

/** Default config values — spec §1.3 (frozen). */
export const DEFAULTS = Object.freeze({
  leaseWaitMs: 2000,
  maxFiles: 20000,
  maxFileBytes: 2 * 1024 * 1024, // 2 MiB
  maxSourceBytes: 64 * 1024 * 1024, // 64 MiB
  maxOutputBytes: 128 * 1024, // 128 KiB
  checkTimeoutMs: 120000, // 120 s
  graceMs: 2000,
  maxRecords: 1000,
  duplicateWindowLines: 6,
  experienceQueryLimit: 5,
  resultLimit: 100,
  concurrency: 2,
  repairTimeoutMs: 300000, // 300 s
  repairAttempts: 3,
  excludedDirectories: Object.freeze([
    'node_modules', 'dist', 'build', 'coverage', '.venv', 'venv',
    '__pycache__', 'target', '.next',
  ]),
  exportMaxBytes: 8 * 1024 * 1024, // 8 MiB
  contextBytes: 32768, // 32 KiB
})

/** Other frozen caps — spec §1.3 tail. */
export const CAPS = Object.freeze({
  MAX_CAPTURE_BYTES: 128 * 1024,
  MAX_SECTIONS: 128,
  RECENT_CHANGE_INDEX_LIMIT: 64,
  TERM_LIMIT: 64,
  SYMPTOM_LIMIT: 4096,
  QUERY_MAX_CHARS: 2000,
})

/** Frozen plugin identity — spec §1.1 / §1.5 (byte-level, do not rename). */
export const IDENTITY = Object.freeze({
  packageName: '@deepseek-ai/dsh-coding-workbench',
  version: '0.2.2-rc.3',
  pluginName: 'coding-workbench-tools',
  inject: Object.freeze(['tools', 'codingWorkbench', 'workspaceRegistry', 'systemPrompt']),
  service: 'codingWorkbench',
  domain: Object.freeze({ name: 'coding_workbench', version: 1, layout: 'per-record' }),
  tables: Object.freeze({
    runs: 'runSchema',
    findings: 'findingSchema',
    specs: 'specSchema',
    tasks: 'taskSchema',
    repairs: 'repairSchema',
  }),
  toolNames: Object.freeze([
    'coding_task',
    'coding_inspect',
    'coding_check',
    'coding_repair',
    'coding_review',
    'coding_acceptance',
    'coding_restore',
    'coding_workbench',
  ]),
  evidenceFormat: 'hey-coding-evidence',
  evidenceFileName: 'hey-coding-evidence.json',
  repairPromptFirstLine: 'Use hey-debug to fix the root cause of this failed check in the current workspace.',
  systemPrompt: Object.freeze({ name: 'native-coding-evidence', order: 110 }),
  systemPromptBrand: 'Use the full Uma team workflow only when the request warrants a complete product workflow.',
  timeouts: Object.freeze({
    check: 'CODING_CHECK_TIMEOUT',
    repair: 'CODING_REPAIR_TIMEOUT',
    homeInUse: 'CODING_HOME_IN_USE',
  }),
  editRequired: 'CODING_CHECK_REQUIRED',
  verificationTools: Object.freeze(['write', 'edit', 'apply_patch']),
})

/** The single domain error shape — spec §1.4. */
export const REMOTE = Object.freeze({
  code: 'coding/failed',
  message: 'The coding operation could not be completed',
})

/** detail.reason set — spec §1.4, all 39 + the one special-message reason. */
export const REASONS = Object.freeze({
  unavailable: 'unavailable',
  workspaceUnavailable: 'workspace-unavailable',
  openWorkspaceSessionFirst: 'open-workspace-session-first',
  sessionWorkspaceMismatch: 'session-workspace-mismatch',
  workingDirectoryOutsideWorkspace: 'working-directory-outside-workspace',
  checkConcurrencyLimit: 'check-concurrency-limit',
  recordLimit: 'record-limit',
  checkCommandChanged: 'check-command-changed',
  repairCheckChanged: 'repair-check-changed',
  executionSequenceExhausted: 'execution-sequence-exhausted',
  checkNotFound: 'check-not-found',
  evidenceChanging: 'evidence-changing',
  sourceNotFound: 'source-not-found',
  findingNotFound: 'finding-not-found',
  specVersionConflict: 'spec-version-conflict',
  duplicateImplementer: 'duplicate-implementer',
  duplicateCriterion: 'duplicate-criterion',
  taskNotFound: 'task-not-found',
  taskPathMismatch: 'task-path-mismatch',
  taskRemoved: 'task-removed',
  gitInspectionFailed: 'git-inspection-failed',
  taskSessionRequired: 'task-session-required',
  sourceChanged: 'source-changed',
  pathOutsideSourceScope: 'path-outside-source-scope',
  commitNotConfirmedInspectTask: 'commit-not-confirmed-inspect-task',
  sourceCheckoutSessionRequired: 'source-checkout-session-required',
  taskNotCleanOrRevisionChanged: 'task-not-clean-or-revision-changed',
  sourceCheckoutNotClean: 'source-checkout-not-clean',
  mergeNotConfirmedInspectSource: 'merge-not-confirmed-inspect-source',
  mergeRevisionNotConfirmed: 'merge-revision-not-confirmed',
  taskHasUncommittedOrIgnoredFiles: 'task-has-uncommitted-or-ignored-files',
  cleanupNotConfirmedInspectTask: 'cleanup-not-confirmed-inspect-task',
  taskNotRemoved: 'task-not-removed',
  modelNotConfigured: 'model-not-configured',
  failedCheckRequired: 'failed-check-required',
  repairAlreadyRunning: 'repair-already-running',
  repairCommandRedacted: 'repair-command-redacted',
  repairSourceChanged: 'repair-source-changed',
  repairNotFound: 'repair-not-found',
  exportTooLarge: 'export-too-large',
  // The one reason paired with a different message (spec §1.4 tail).
  implementationSessionWorkspaceMismatch: 'implementation-session-workspace-mismatch',
})

export const SPECIAL_ERROR = Object.freeze({
  message: 'Use existing implementation Session IDs from this workspace; completed members are allowed.',
  reason: REASONS.implementationSessionWorkspaceMismatch,
})

/** Tool-layer native Error messages — spec §1.4 (verbatim, incl. interpolation). */
export const TOOL_ERRORS = Object.freeze({
  workspaceSessionRequired: 'This coding operation requires a workspace Session',
  importWorkspaceFirst: 'Import the current local folder as a workspace before using coding evidence tools',
  readOnly: (tool, action) => `${tool} ${action} is unavailable in a source read-only role`,
  tooManyLanguages: 'Select at most 16 technical language names',
  guideNotApplicable: 'The guide is not applicable to the selected project languages',
  checkOrScope: 'Select either check or scope, not both',
  checkNotInWorkspace: 'Check execution is not in the current workspace',
  repairNotInWorkspace: 'Repair is not in the current workspace',
  findingNotInWorkspace: 'Finding is not in the current workspace',
})

/** Fixed texts written into records (not thrown) — spec §1.4. */
export const FIXED_TEXTS = Object.freeze({
  checkCouldNotRun: (msg) => `The check could not run: ${msg}`,
  hostStoppedCheck: 'The Host stopped before a trusted completion was recorded.',
  checkCancelled: 'The check was cancelled.',
  hostStoppedRepair: 'The Host stopped before repair completion was recorded.',
  repairCancelled: 'Repair cancelled.',
  repairCheckChanged: 'The check definition changed during repair. Review it and run the check again.',
  repairNoSuccess: 'Repair stopped without verified success. Inspect its Session and check evidence.',
  repairSessionNotClean: 'The repair Session did not close cleanly. Inspect it before retrying.',
})

/** Subprocess / source native error reasons — spec §1.4. */
export const SUBPROCESS_ERRORS = Object.freeze({
  emptyCommand: 'empty-command',
  pathOutsideSourceScope: 'path-outside-source-scope',
  sourceNotRegularFile: 'source-not-a-regular-file',
  sourceFileTooLarge: 'source-file-too-large',
  sourceChangedDuringRead: 'source-changed-during-read',
  unsupportedPackageManager: 'unsupported-package-manager',
  duplicateCheckName: 'duplicate-check-name',
})

/** Command whitelist & sources — spec §1.6 (verbatim). */
export const COMMAND = Object.freeze({
  packageManagers: Object.freeze(['npm', 'pnpm', 'yarn', 'bun']),
  defaultPackageManager: 'npm',
  scriptPrefixRe: /^(test|build|lint|typecheck)(?:$|:)/u,
  scriptPrefixes: Object.freeze(['test', 'build', 'lint', 'typecheck']),
  pyprojectPytest: Object.freeze(['python', '-m', 'pytest']),
  pomMavenTest: Object.freeze(['mvn', 'test']),
  checkManifests: Object.freeze(['.hey/coding.json', 'package.json', 'pyproject.toml', 'pom.xml']),
  nodeBuiltins: Object.freeze([
    'assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns',
    'events', 'fs', 'http', 'http2', 'https', 'inspector', 'module', 'net',
    'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring',
    'readline', 'repl', 'stream', 'string_decoder', 'timers', 'tls',
    'trace_events', 'tty', 'url', 'util', 'v8', 'vm', 'worker_threads', 'zlib',
  ]),
  gitEnvUnset: Object.freeze([
    'GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE',
    'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG',
    'GIT_CONFIG_PARAMETERS', 'GIT_CONFIG_COUNT', 'GIT_REPLACE_REF_BASE',
    'GIT_ATTR_SOURCE',
  ]),
  gitEnvSet: Object.freeze({
    GIT_CONFIG_COUNT: '0',
    GIT_TERMINAL_PROMPT: '0',
    GIT_OPTIONAL_LOCKS: '0',
    GIT_NO_LAZY_FETCH: '1',
  }),
})

/** Tokens that make a tool descriptor valid regardless of internal impl. */
export function assertDeps(deps, required) {
  for (const key of required) {
    if (deps[key] === undefined || deps[key] === null) {
      throw new Error(`@heywork/coding: missing injected dependency: ${key}`)
    }
  }
}
