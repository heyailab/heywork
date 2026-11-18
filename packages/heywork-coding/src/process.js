/**
 * @heywork/coding — process execution, diagnostics and display redaction.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-coding-workbench/lib/.
 * - parseDiagnostics: specs/coding-workbench.md §3 (S:260-276), both regexes
 *   and field normalization verbatim.
 * - runCommand: specs/coding-workbench.md §4 step 1-7 (P:91-161) — the six
 *   construction steps, both sandbox branches, git env cleanup, redaction and
 *   terminate semantics. Commands are only ever issued through the injected
 *   `ctx.subprocess` / `ctx.sandbox`; nothing is imported or spawned directly.
 * - redactDevelopmentText: specs/delivery.md §14 / §1.3 four rules verbatim.
 */

import { CAPS, COMMAND, DEFAULTS, IDENTITY, SUBPROCESS_ERRORS } from './deps.js'

/** TS-style then GCC-style, verbatim (spec §3). */
const DIAGNOSTIC_TS_RE = /^(.+?)\((\d+),(\d+)\):\s*(error|warning)\s*([^:]+):\s*(.+)$/u
const DIAGNOSTIC_GCC_RE = /^(.+?):(\d+):(\d+):?\s*(error|warning)\s*([^:]*)[: ]\s*(.+)$/u

/**
 * Parse an already-redacted stdout+"\n"+stderr string into diagnostics.
 * Matches TS style first, then GCC style; skips non-matching lines; stops at
 * `limit`. Field normalization is verbatim per spec §3.
 */
export function parseDiagnostics(output, limit = DEFAULTS.resultLimit) {
  const diagnostics = []
  for (const line of String(output ?? '').split(/\r?\n/u)) {
    if (diagnostics.length >= limit) break
    const match = DIAGNOSTIC_TS_RE.exec(line) ?? DIAGNOSTIC_GCC_RE.exec(line)
    if (!match) continue
    diagnostics.push({
      path: match[1] ?? '',
      line: Math.max(1, Number(match[2])),
      column: Math.max(1, Number(match[3])),
      severity: match[4] === 'warning' ? 'warning' : 'error',
      code: match[5]?.trim() || null,
      message: (match[6] ?? '').slice(0, 8000),
    })
  }
  return diagnostics
}

/** Best-effort display filter — specs/delivery.md §14, four rules verbatim. */
export function redactDevelopmentText(text) {
  return String(text ?? '')
    .replace(/(Bearer\s+)[a-z0-9._~+/=-]+/giu, '$1[redacted]')
    .replace(/([?&](?:token|api[_-]?key|access[_-]?token|secret)=)[^\s&#"']+/giu, '$1[redacted]')
    .replace(/((?:password|api[_-]?key|access[_-]?token|token|secret)\s*[:=]\s*)[^\s,;]+/giu, '$1[redacted]')
    .replace(/\bsk-[A-Za-z0-9_-]{16,}\b/gu, '[redacted]')
}

/**
 * A deadline wrapping an optional caller signal. The abort reason carries the
 * frozen label so `timeoutOf` can distinguish a timeout from a caller cancel.
 */
export function deadline(parentSignal, ms, label) {
  const controller = new AbortController()
  const reason = Object.freeze({ label, kind: 'timeout' })
  let timer
  const fire = () => {
    if (!controller.signal.aborted) controller.abort(reason)
  }
  timer = setTimeout(fire, ms)
  const onAbort = () => {
    if (!controller.signal.aborted) controller.abort(parentSignal.reason)
  }
  if (parentSignal) {
    if (parentSignal.aborted) onAbort()
    else parentSignal.addEventListener('abort', onAbort, { once: true })
  }
  return {
    signal: controller.signal,
    dispose() {
      clearTimeout(timer)
      if (parentSignal) parentSignal.removeEventListener?.('abort', onAbort)
    },
  }
}

/** Returns the timeout reason object only when `signal` was aborted by `label`. */
export function timeoutOf(signal, label) {
  const reason = signal?.reason
  if (reason && typeof reason === 'object' && reason.label === label && reason.kind === 'timeout') {
    return reason
  }
  return undefined
}

/** Build the child environment with the frozen git variable cleanup (spec §1.6). */
export function gitEnvironment(extra = {}) {
  const env = { ...process.env, ...extra }
  for (const key of COMMAND.gitEnvUnset) env[key] = undefined
  Object.assign(env, COMMAND.gitEnvSet)
  return env
}

/**
 * runCommand — specs/coding-workbench.md §4 (six construction steps + finally).
 *
 * `request`: { argv, cwd, policy, env?, signal? }
 * `policy`: resolved sandbox policy; `mode === "danger-full-access"` takes the
 * direct branch, every other mode goes through `sandbox.confine`.
 *
 * All process capabilities come from `deps.subprocess` / `deps.sandbox`.
 */
export async function runCommand(deps, config, request) {
  const { subprocess, sandbox } = deps
  const argv = Array.isArray(request.argv) ? request.argv : []
  const callerSignal = request.signal
  const policy = request.policy ?? {}

  // 1. executable + empty-command guard.
  const executable = argv[0]
  if (executable === undefined || executable === null || executable === '') {
    throw new Error(SUBPROCESS_ERRORS.emptyCommand)
  }

  // 2. deadline.
  const timeout = deadline(callerSignal, config.checkTimeoutMs, IDENTITY.timeouts.check)

  try {
    // 3. resolve the first argument to a real executable; the rest stay literal.
    const command = [
      await subprocess.resolveExecutable(executable, undefined, timeout.signal),
      ...argv.slice(1),
    ]

    // 4. sandbox two-branch policy.
    let confined
    if (policy.mode === 'danger-full-access') {
      confined = command
    } else {
      confined = (await sandbox.confine(command, { ...policy, mode: policy.mode }, timeout.signal)).argv
    }
    timeout.signal.throwIfAborted()

    // 5. spawn with the frozen git env and stdio caps.
    const child = subprocess.spawn({
      argv: confined,
      cwd: request.cwd,
      env: gitEnvironment(request.env ?? {}),
      signal: timeout.signal,
      graceMs: config.graceMs,
      stdio: {
        stdin: 'ignore',
        stdout: { maxBytes: config.maxOutputBytes },
        stderr: { maxBytes: config.maxOutputBytes },
      },
    })

    try {
      // 6. wait, read, project. A caller/timeout abort may surface as a done
      // rejection; when the deadline signal is aborted we still project a
      // result (the spec maps it to timed-out/cancelled).
      try {
        await child.done
      } catch (error) {
        if (!timeout.signal.aborted) throw error
      }
      const stdout = child.collected.stdout.readFrom(0)
      const stderr = child.collected.stderr.readFrom(0)
      const timedOut = timeoutOf(timeout.signal, IDENTITY.timeouts.check) !== undefined
      const aborted = timeout.signal.aborted
      return {
        exitCode: child.exitCode,
        stdout: redactDevelopmentText(stdout),
        stderr: redactDevelopmentText(stderr),
        truncated: Boolean(child.collected.stdout.lossy || child.collected.stderr.lossy),
        timedOut,
        cancelled: Boolean(aborted) && !timedOut,
      }
    } finally {
      // 7. always terminate and reap.
      child.terminate()
      await child.waitForExit()
    }
  } finally {
    timeout.dispose()
  }
}

/** Bounded UTF-8 text projection used by evidence snapshots (spec §9, C:31-37). */
export function boundedText(text, maxBytes = CAPS.MAX_CAPTURE_BYTES) {
  const buf = Buffer.from(String(text ?? ''), 'utf8')
  if (buf.length <= maxBytes) return buf.toString('utf8')
  return buf.subarray(0, maxBytes).toString('utf8')
}
