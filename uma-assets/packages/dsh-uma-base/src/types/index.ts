/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/index.js` 反推，非 DeepSeek 原始源码。
 *
 * 还原依据：esbuild bundle 用 //#region 标出原始模块边界，本文件对应 lib/types/index.js。
 * 逻辑与 lib 逐行等价（控制流、字符串、错误文本一律未改）；类型注解由用法反推，可与原始不同名。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */

/** 会话头：只有 subagent 来源且带 parentSession / cwd 的会话会被采纳。 */
interface SessionHeader {
  origin: string
  parentSession?: string
  cwd?: string
}

interface Agent {
  id: string
  session: { header: SessionHeader }
}

interface Workspace {
  id: string
  sessionIds: string[]
  attachSession(id: string): Promise<void>
  insertSessionBefore(id: string): Promise<void>
  detachSession(id: string): Promise<void>
}

interface WorkspaceRegistry {
  list(): Workspace[]
  resolveByPath(path: string): Promise<Workspace | undefined>
}

/** apply 所需的 ctx 最小形状（推断：cordis Context + workspaceRegistry 扩展）。 */
interface SubagentWorkspaceContext {
  effect(callback: () => unknown, label?: string): void
  on(event: 'agent/created', handler: (payload: { agent: Agent; signal?: AbortSignal }) => unknown): unknown
  workspaceRegistry: WorkspaceRegistry
}

/** UMA-owned lifecycle consumer; the kernel Agent and workspace contracts remain unchanged. */
export const name = 'uma-subagent-workspaces'

/** Attachment must finish after both lifecycle and durable membership owners are available. */
export const inject = ['agents', 'workspaceRegistry']

/**
 * Attach true delegated children before Agent creation releases queued model work. A child must
 * resolve to the same imported canonical directory as its already accounted parent. No ordinary
 * Session or unimported directory is adopted. Newly attached children are appended so existing
 * ordinary-session order and workspace defaults remain stable.
 * @param ctx - UMA Host composition owning this consumer and its creation listeners.
 */
export function apply(ctx: SubagentWorkspaceContext): void {
  const lifetime = new AbortController()
  const pending = new Set<Promise<unknown>>()
  ctx.effect(() => async () => {
    lifetime.abort()
    await Promise.allSettled([...pending])
  }, 'uma-subagent-workspaces: pending membership')
  ctx.on('agent/created', ({ agent, signal }) => {
    const operation = (async () => {
      const header = agent.session.header
      if (header.origin !== 'subagent' || header.parentSession === void 0 || header.cwd === void 0) return
      const parentSession = header.parentSession
      const owned = signal === void 0 ? lifetime.signal : AbortSignal.any([lifetime.signal, signal])
      owned.throwIfAborted()
      const parent = ctx.workspaceRegistry.list().find(workspace => workspace.sessionIds.includes(parentSession))
      if (parent === void 0) return
      const workspace = await ctx.workspaceRegistry.resolveByPath(header.cwd)
      owned.throwIfAborted()
      if (workspace === void 0 || workspace.id !== parent.id || !workspace.sessionIds.includes(parentSession)) return
      if (workspace.sessionIds.includes(agent.id)) return
      try {
        await workspace.attachSession(agent.id)
        owned.throwIfAborted()
        await workspace.insertSessionBefore(agent.id)
        owned.throwIfAborted()
        if (!ctx.workspaceRegistry.list().some(current => current.id === workspace.id && current.sessionIds.includes(parentSession))) throw new Error('The delegated Session parent is no longer in the imported workspace')
      }
      catch (error) {
        if (workspace.sessionIds.includes(agent.id)) try {
          await workspace.detachSession(agent.id)
        }
        catch (cleanup) {
          throw new AggregateError([error, cleanup], 'Delegated workspace attachment did not settle cleanly')
        }
        throw error
      }
    })()
    pending.add(operation)
    const settled = () => {
      pending.delete(operation)
    }
    operation.then(settled, settled)
    return operation
  })
}
