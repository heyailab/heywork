/** In-memory pin choices for the global panel launchers. */
import { createSnapshotStore, type ObservableSnapshot } from '@deepseek-ai/dsh-client-store'

/**
 * Determine whether a built-in panel stays in the sidebar.
 * @param id - Registered panel id.
 * @returns True for the built-in Plugins launcher and the UMA Knowledge and Design launchers when registered.
 */
export function isFixedPanel(id: string): boolean {
  return id === 'plugins' || id === 'knowledge' || id === 'design'
}

const NO_PANELS: readonly string[] = []

/** Unpinned panel ids and their only mutation. */
export interface PanelPins {
  /** Unpinned panel ids; ids of panels that are not registered stay listed. */
  readonly unpinned: ObservableSnapshot<readonly string[]>
  /**
   * Pin or unpin one panel launcher; fixed panels are ignored.
   * @param id - Panel id.
   * @param pinned - Whether the launcher is manually pinned.
   */
  readonly setPinned: (id: string, pinned: boolean) => void
}

/**
 * Create the in-memory panel pin list; the snapshot keeps its reference until the list changes.
 * @param initialUnpinned - Panel ids initially placed in More.
 * @returns Unpinned panel ids and the pin mutation.
 */
export function createPanelPins(initialUnpinned: readonly string[] = NO_PANELS): PanelPins {
  const store = createSnapshotStore<{ readonly unpinned: readonly string[] }>({
    unpinned: [...new Set(initialUnpinned)].filter(id => !isFixedPanel(id)),
  })
  return {
    unpinned: { getSnapshot: () => store.getSnapshot().unpinned, subscribe: listener => store.subscribe(listener) },
    setPinned: (id, pinned) => {
      const current = store.getSnapshot().unpinned
      if (isFixedPanel(id) || pinned !== current.includes(id)) return
      store.set({ unpinned: pinned ? current.filter(entry => entry !== id) : [...current, id] })
    },
  }
}
