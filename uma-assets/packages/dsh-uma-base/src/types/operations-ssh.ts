/**
 * 【逆向还原】由 `lib/operations-ssh.js` 的 `//#region lib/types/operations-ssh.js` 反推，非 DeepSeek 原始源码。
 *
 * 原本被 esbuild 内联进 bundle，本文件按 //#region 边界拆成独立模块；apply 用到的
 * installOperationsTerminal / runConnectedSsh 改为 import。逻辑与 lib 逐行等价（控制流、字符串、
 * 错误文本、时限常数一律未改）；类型注解由用法反推，外部库形状无 .d.ts 可校验处用 any。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */
import { randomUUID } from 'node:crypto'
import { ToolArgsError, ToolContextUnavailableError, defineTool } from '@deepseek-ai/dsh-tools'
import { redactDevelopmentText, umaSshUri } from '@deepseek-ai/dsh-util-uma-delivery'
import { CommandDefinitionId } from '@deepseek-ai/dsh-commands/brand'
import z from '@deepseek-ai/schemastery'
import { installOperationsTerminal, runConnectedSsh } from './operations-ssh-terminal.ts'
import type { TerminalConnection } from './operations-ssh-terminal.ts'

interface SshConfig {
  grantMs: number
  timeoutMs: number
  transferBytes: number
  outputBytes: number
}

interface SshAgent {
  id: string
}

interface SshGrant {
  connection: TerminalConnection
  modelId: string
  signal: AbortSignal
  revoke(): void
}

interface CommandResult {
  kind: 'error' | 'success'
  text: string
}

interface SshCommandInvocation {
  agent: SshAgent
  rawInput: string
  signal: AbortSignal
}

interface SshExec {
  agent?: SshAgent
  signal: AbortSignal
  name: string
  callId: string
}

interface ApprovalService {
  request(options: {
    agent: SshAgent
    toolName: string
    callId: string
    signal: AbortSignal
    reason: string
    displayReason: { en: string; zh: string }
  }): Promise<string>
}

interface SshContext {
  effect(callback: () => unknown, label?: string): void
  on(event: 'agent/disposed', handler: (payload: { agent: SshAgent }) => void): void
  get(service: 'approval'): ApprovalService | undefined
  workspaceRegistry: {
    list(): { id: string; sessionIds: string[] }[]
    get(id: string): { sessionIds: string[] } | undefined
  }
  commands: { register(command: unknown): unknown }
  tools: { register(tool: unknown, options?: unknown): unknown }
}

/** UMA Host plugin identity. */
export const name = 'uma-operations-ssh'

/** The command registry is the human-only grant entry point. */
export const inject = [
  'commands',
  'tools',
  'workspaceRegistry'
]

/** Deployment bounds for unattended commands. */
export const Config = z.object({
  grantMs: z.number().step(1).min(1e3).max(864e5).default(36e5),
  timeoutMs: z.number().step(1).min(1e3).max(6e5).default(6e4),
  transferBytes: z.number().step(1).min(1024).max(134217728).default(33554432),
  outputBytes: z.number().step(1).min(256).max(32768).default(8192)
})

/** Register explicit, temporary SSH access with per-command approval.
 * @param ctx - UMA Host scope.
 * @param config - SSH grant and execution bounds.
 */
export function apply(ctx: SshContext, config: SshConfig): void {
  const lifetime = new AbortController()
  const terminal = installOperationsTerminal(ctx as any, config.transferBytes)
  const grants = new WeakMap<SshAgent, Map<string, SshGrant>>()
  const active = (agent?: SshAgent): SshGrant[] => {
    return [...(agent === void 0 ? void 0 : grants.get(agent)) ?? []].filter(([, grant]) => !grant.signal.aborted)
  }
  const revokeAll = (agent: SshAgent) => {
    for (const grant of grants.get(agent)?.values() ?? []) grant.revoke()
    grants.delete(agent)
  }
  ctx.effect(() => () => {
    lifetime.abort()
  }, 'uma-operations-ssh: revoke all')
  ctx.on('agent/disposed', ({ agent }) => {
    revokeAll(agent)
  })
  ctx.effect(() => ctx.commands.register({
    name: 'ops-ssh',
    definitionId: CommandDefinitionId('uma/operations-ssh'),
    description: 'Delegate an SSH connection to this conversation, inspect it, or revoke it',
    input: { hint: 'status | disconnect' },
    recordInput: false,
    handler({ agent, rawInput, signal }: SshCommandInvocation): CommandResult {
      signal.throwIfAborted()
      const line = rawInput.trim()
      if (line === 'disconnect') {
        revokeAll(agent)
        return {
          kind: 'success',
          text: 'SSH access revoked for this conversation.'
        }
      }
      if (line === 'status') {
        const targets = active(agent).map(([, grant]) => umaSshUri(grant.connection.target))
        return {
          kind: 'success',
          text: targets.length === 0 ? 'No active SSH access for this conversation.' : targets.join('\n')
        }
      }
      const revoked = /^revoke ([a-f0-9-]{36})$/u.exec(line)?.[1]
      if (revoked !== void 0) {
        grants.get(agent)?.get(revoked)?.revoke()
        return {
          kind: 'success',
          text: 'SSH access to this server was revoked.'
        }
      }
      const connectionId = /^terminal ([a-f0-9-]{36})$/u.exec(line)?.[1]
      const connection = connectionId === void 0 ? void 0 : terminal(connectionId)
      if (connectionId === void 0 || connection === void 0) return {
        kind: 'error',
        text: 'Connect and grant access from the UMA Operations panel.'
      }
      if (!ctx.workspaceRegistry.list().some(workspace => workspace.sessionIds.includes(agent.id))) return {
        kind: 'error',
        text: 'Open a workspace conversation before delegating an SSH connection.'
      }
      const records = grants.get(agent) ?? new Map<string, SshGrant>()
      grants.set(agent, records)
      records.get(connectionId)?.revoke()
      const owner = new AbortController()
      const access = AbortSignal.any([
        lifetime.signal,
        owner.signal,
        AbortSignal.timeout(config.grantMs),
        connection.signal
      ])
      const grant: SshGrant = {
        connection,
        modelId: randomUUID(),
        signal: access,
        revoke: () => {
          owner.abort()
        }
      }
      records.set(connectionId, grant)
      access.addEventListener('abort', () => {
        if (records.get(connectionId) === grant) records.delete(connectionId)
      }, { once: true })
      return {
        kind: 'success',
        text: `SSH access delegated for this conversation: ${umaSshUri(connection.target)}. Each command requires approval.`
      }
    }
  }), 'uma-operations-ssh: human commands')
  ctx.tools.register(defineTool({
    name: 'uma_ssh_servers',
    description: 'List live SSH servers explicitly delegated to this conversation. Use the returned connection ID when choosing a server.',
    parameters: {},
    output: {
      schema: { type: 'string' },
      render: (_args, text) => [{
        type: 'text',
        text
      }]
    },
    execute(_args, exec) {
      return Promise.resolve(JSON.stringify(active(exec.agent).map(([, grant]) => ({
        connection_id: grant.modelId,
        destination: umaSshUri(grant.connection.target)
      }))))
    },
    presentCall: () => ({
      card: 'generic',
      title: 'List delegated SSH servers',
      rawInput: {}
    })
  }), { when: ({ agent }: { agent: SshAgent }) => active(agent).length > 0 })
  ctx.tools.register(defineTool({
    name: 'uma_ssh_run',
    description: 'Run a command on the SSH server explicitly delegated to this conversation. Ask for approval for the exact command. Use this tool for remote work and inspect its exit code.',
    parameters: {
      command: {
        type: 'string',
        required: true,
        description: 'Shell command to run on the delegated remote server.'
      },
      connection_id: {
        type: 'string',
        description: 'Connection ID from uma_ssh_servers. Required when multiple servers are delegated.'
      }
    },
    output: {
      schema: { type: 'string' },
      render: (_args, text) => [{
        type: 'text',
        text
      }]
    },
    async execute({ command, connection_id: selected }, exec: SshExec) {
      const agent = exec.agent
      const delegated = active(agent)
      if (selected === void 0 && delegated.length > 1) throw new ToolArgsError(['Choose one connection_id from uma_ssh_servers'])
      const grant = selected === void 0 ? delegated[0]?.[1] : delegated.find(([, entry]) => entry.modelId === selected)?.[1]
      if (agent === void 0 || grant === void 0 || grant.signal.aborted) throw new ToolContextUnavailableError('Delegate an SSH connection from UMA Operations before executing a command')
      const workspace = ctx.workspaceRegistry.list().find(item => item.sessionIds.includes(agent.id))
      const approval = ctx.get('approval')
      if (workspace === void 0 || approval === void 0) throw new ToolContextUnavailableError('SSH execution requires a workspace and an approval channel')
      if (command.trim() === '' || Buffer.byteLength(command) > 4096 || command.includes('\0')) throw new ToolArgsError(['Enter an SSH command of up to 4096 bytes'])
      const signal = AbortSignal.any([exec.signal, grant.signal])
      const target = umaSshUri(grant.connection.target)
      const outcome = await approval.request({
        agent,
        toolName: exec.name,
        callId: exec.callId,
        signal,
        reason: `Run on ${target}:\n${command}`,
        displayReason: {
          en: `Run on ${target}:\n${command}`,
          zh: `在 ${target} 执行：\n${command}`
        }
      })
      signal.throwIfAborted()
      if (outcome !== 'allowed-once') throw new ToolContextUnavailableError('The SSH command was not approved')
      if (!ctx.workspaceRegistry.get(workspace.id)?.sessionIds.includes(agent.id)) throw new ToolContextUnavailableError('The SSH conversation is no longer in its original workspace')
      const processSignal = AbortSignal.any([signal, AbortSignal.timeout(config.timeoutMs)])
      try {
        const result = await runConnectedSsh(grant.connection, command, processSignal, config.outputBytes)
        return JSON.stringify({
          ...result,
          target,
          stdout: redactDevelopmentText(result.stdout),
          stderr: redactDevelopmentText(result.stderr)
        })
      }
      catch (error) {
        signal.throwIfAborted()
        if (error instanceof ToolContextUnavailableError) throw error
        throw new ToolContextUnavailableError('SSH execution failed. Verify the remote state before repeating the command.', { cause: error })
      }
    },
    presentCall: () => ({
      card: 'generic',
      title: 'Run a command over SSH',
      rawInput: {}
    })
  }), { when: ({ agent }: { agent: SshAgent }) => active(agent).length > 0 })
}
