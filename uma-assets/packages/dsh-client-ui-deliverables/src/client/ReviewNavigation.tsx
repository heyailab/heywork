/** Apply a workspace review navigation only after its exact Session sidebar has mounted. */
import { useEffect } from 'react'
import type { ObservableSnapshot, SnapshotStore } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { ChangesReviewCoordinates } from '../changes.ts'

/** One latest-click navigation intent, owned by the plugin rather than the requesting page. */
export interface ReviewNavigationIntent { readonly coordinates: ChangesReviewCoordinates; readonly index: number }
/** Mounted-sidebar observation and the one pending navigation. */
export interface ReviewNavigationInjected {
  hooks: { pendingReview: SnapshotStore<ReviewNavigationIntent | null>; mountedReviewSession: ObservableSnapshot<SessionId | undefined> }
  open: (intent: ReviewNavigationIntent) => void
}
/**
 * Fulfil navigation after the real sidebar adoption, without timer-based scheduling.
 * @param props - frame overlay hook seats and the narrow navigation action.
 * @returns no visual overlay.
 */
export function ReviewNavigation(props: PropsRuntime<'shell.overlay'> & InjectFace<ReviewNavigationInjected>) {
  const pending = props.usePendingReview(value => value)
  const mounted = props.useMountedReviewSession(value => value)
  useEffect(() => {
    if (pending !== null && mounted === pending.coordinates.sessionId) props.open(pending)
  }, [pending, mounted, props.open])
  return null
}
