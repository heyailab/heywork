/** Publish root conversation shortcuts to the optional native menu. */
import type { Context } from '@deepseek-ai/cordis'
import type { ISessions } from '@deepseek-ai/dsh-api-session-controller/client'
import type { IWorkspaces } from '@deepseek-ai/dsh-api-workspace-controller/client'
import type { UiWorkspace } from './navigation.ts'

interface DesktopTrayBridge {
  publish?(items: readonly { id: string; title: string; running: boolean; roles: readonly string[] }[]): Promise<void>
  subscribe(listener: (id: string) => void): () => void
}

/**
 * Connect the native menu to the same visible conversation catalog and navigation as the sidebar.
 * @param ctx - owner of the subscriptions.
 * @param sessions - current conversation catalog.
 * @param workspaces - current workspace and archive catalog.
 * @param navigation - workspace navigation operations.
 */
export function installDesktopTray(ctx: Context, sessions: ISessions, workspaces: IWorkspaces, navigation: UiWorkspace): void {
  const tray = (globalThis as { dshDesktop?: { tray?: DesktopTrayBridge } }).dshDesktop?.tray
  if (tray === undefined) return
  ctx.inject(['uiSession'], (scope) => {
    const stopMenu = tray.subscribe((id) => {
      const sessionId = sessions.list.getSnapshot().ids.find(candidate => candidate === id)
      if (sessionId !== undefined && !workspaces.list.getSnapshot().archivedSessionIds.includes(sessionId)) {
        navigation.openSession(sessionId)
      }
    })
    const publishMenu = tray.publish
    if (publishMenu === undefined) return stopMenu
    const status = scope.uiSession.sessionStatus
    let previous = ''
    const publish = (): void => {
      const catalog = sessions.list.getSnapshot()
      const archives = new Set(workspaces.list.getSnapshot().archivedSessionIds)
      const liveStatus = status.getSnapshot()
      const running = new Set(Object.values(catalog.byId).filter(row => liveStatus.get(row.id)?.running ?? row.running).map(row => row.id))
      const activeRoles = new Map<string, Set<string>>()
      for (const id of [...running]) {
        let childId = id
        let parent = catalog.byId[id]?.parentId
        const seen = new Set([id])
        const roles = new Set<string>()
        while (parent !== undefined && !seen.has(parent)) {
          seen.add(parent)
          const member = catalog.projectionsBySession[parent]?.values.subagentCatalog?.find(entry => entry.id === childId)
          if (member !== undefined && 'name' in member && typeof member.name === 'string') {
            roles.add(member.name.replace(/[-_]?\d+$/u, ''))
          }
          running.add(parent)
          const parentRoles = activeRoles.get(parent) ?? new Set<string>()
          for (const role of roles) parentRoles.add(role)
          activeRoles.set(parent, parentRoles)
          childId = parent
          parent = catalog.byId[parent]?.parentId
        }
      }
      const items = catalog.ids
        .filter(id => !archives.has(id))
        .flatMap((id) => {
          const row = catalog.byId[id]
          if (row === undefined || row.origin === 'subagent' || row.blank) return []
          return [{ id, title: row.displayTitle === id ? '' : row.displayTitle.slice(0, 72),
            running: running.has(id), updatedAt: row.updatedAt, roles: [...activeRoles.get(id) ?? []].slice(0, 12) }]
        })
        .sort((left, right) => Number(right.running) - Number(left.running) || right.updatedAt - left.updatedAt)
        .slice(0, 30)
        .map(({ id, title, running, roles }) => ({ id, title, running, roles }))
      const next = JSON.stringify(items)
      if (next === previous) return
      previous = next
      void publishMenu(items).catch((error: unknown) => {
        if (previous === next) previous = ''
        ctx.logger.warn('Could not refresh the desktop conversation menu', error)
      })
    }
    const stopSessions = sessions.list.subscribe(publish)
    const stopStatus = status.subscribe(publish)
    const stopWorkspaces = workspaces.list.subscribe(publish)
    publish()
    return () => { stopMenu(); stopWorkspaces(); stopStatus(); stopSessions() }
  })
}
