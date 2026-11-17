/**
 * @heywork/workflow — shared dependency-injection contracts.
 *
 * FROM SPEC, NOT COPIED from uma-assets/packages/dsh-tool-uma-workflow/src/.
 * Frozen values are transcribed from specs/workflow.md §1; the contract shape
 * mirrors packages/heywork-design/src/deps.js (DEFAULTS / IDENTITY / assertDeps).
 * Upstream @deepseek-ai/* capabilities are injected at apply() time, never imported.
 */

/**
 * @typedef {object} Deps
 * @property {object} tools           - ctx.tools: { register(descriptor) }
 * @property {object} fs              - ctx.fs: resolve/listDir/readText/writeText/sandboxMode ...
 * @property {object} workingDirectory - ctx.workingDirectory: { ensure(agent, signal) }
 * @property {function} [get]         - ctx.get(name) — sandboxPolicy service
 * @property {function} [waterfall]   - ctx.waterfall(event, target, exec, fallback)
 * @property {function} defineTool    - from @deepseek-ai/dsh-tools
 * @property {function} [ToolContextUnavailableError] - error class, injected
 */

/** Default config values from spec §1 / §5.2 (frozen). */
export const DEFAULTS = Object.freeze({
  status: 'draft',
  owner: 'hey-team',
  depth: 'product',
  phase: 'delivery',
})

/** Frozen plugin identity (spec §1 / §2) — byte-level, do not rename to uma. */
export const IDENTITY = Object.freeze({
  pluginName: 'tool-hey-workflow',
  inject: ['tools', 'fs', 'workingDirectory'],
  toolNames: Object.freeze({
    write: 'hey_artifact_write',
    read: 'hey_artifact_read',
    gate: 'hey_gate_status',
  }),
  artifactDir: '.hey',
})

/** Tokens that make a tool descriptor valid regardless of internal impl. */
export function assertDeps(deps, required) {
  for (const key of required) {
    if (deps[key] === undefined || deps[key] === null) {
      throw new Error(`@heywork/workflow: missing injected dependency: ${key}`)
    }
  }
}
