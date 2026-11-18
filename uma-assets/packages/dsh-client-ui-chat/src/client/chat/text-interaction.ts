/** Area-local text gestures, action ownership, dismissal, and content-relative placement. */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { readTextSelection, selectedText } from './text-selection.ts'
import type { TextSelection } from './text-selection.ts'

import type {
  TextInteractionGesture, TextInteractionSurface, TextInteractionTrigger,
} from '@deepseek-ai/dsh-client-ui-conversation/client'

/** Current area-owned surface and its actions. */
export interface TextInteractionBinding extends Omit<TextInteractionSurface, 'trigger'> {
  readonly active: { readonly id: string; readonly trigger: TextInteractionTrigger } | null
}

interface Target {
  readonly source: HTMLElement
  readonly selection: TextSelection | null
  readonly text: string | null
  readonly point: { readonly x: number; readonly y: number } | null
}

interface Bounds { left: number; top: number; right: number; bottom: number }

const SELECTION_EDGE = 28

function rectBounds(rect: DOMRect): Bounds {
  return { left: rect.left, top: rect.top, right: rect.left + rect.width, bottom: rect.top + rect.height }
}

function intersects(a: Bounds, b: Bounds): boolean {
  return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
}

function sameRange(a: Range | null, b: Range | null): boolean {
  return a === b || (a !== null && b !== null && a.startContainer === b.startContainer
    && a.startOffset === b.startOffset && a.endContainer === b.endContainer && a.endOffset === b.endOffset)
}

function available(root: HTMLElement, target: Target): boolean {
  if (!root.isConnected || !root.contains(target.source) || !target.source.hasAttribute('data-text-interaction-source')) return false
  const view = root.ownerDocument.defaultView
  /* v8 ignore if -- Mounted browser content always has an owner window. */
  if (view === null) return false
  for (let node: HTMLElement | null = target.source; node !== null; node = node.parentElement) {
    const style = view.getComputedStyle(node)
    if (node.hidden || node.inert || node.hasAttribute('data-text-interaction-exclude')
      || style.display === 'none' || style.visibility === 'hidden') return false
  }
  return target.selection === null || (target.source.contains(target.selection.range.startContainer)
    && target.source.contains(target.selection.range.endContainer) && selectedText(target.selection) === target.text)
}

function composerSeat(root: HTMLElement): HTMLElement | null {
  return root.closest('[data-conversation-scroll]')?.querySelector<HTMLElement>('[data-composer-seat]') ?? null
}

function visibleBounds(root: HTMLElement, source: HTMLElement, view: Window): Bounds {
  const rootRect = rectBounds(root.getBoundingClientRect())
  const bounds: Bounds = {
    left: Math.max(0, rootRect.left), right: Math.min(view.innerWidth, rootRect.right), top: 0, bottom: view.innerHeight,
  }
  for (let node: HTMLElement | null = source; node !== null; node = node.parentElement) {
    const style = view.getComputedStyle(node)
    const rect = rectBounds(node.getBoundingClientRect())
    if (/(auto|scroll|hidden|clip)/u.test(style.overflowX)) {
      bounds.left = Math.max(bounds.left, rect.left)
      bounds.right = Math.min(bounds.right, rect.right)
    }
    if (/(auto|scroll|hidden|clip)/u.test(style.overflowY)) {
      bounds.top = Math.max(bounds.top, rect.top)
      bounds.bottom = Math.min(bounds.bottom, rect.bottom)
    }
  }
  const composer = composerSeat(root)?.getBoundingClientRect()
  if (composer !== undefined && composer.height > 0
    && composer.right > bounds.left && composer.left < bounds.right) {
    bounds.bottom = Math.min(bounds.bottom, composer.top)
  }
  return bounds
}

/**
 * Own text interactions for one positioned content area and its local surface.
 * @param rootRef - existing content element with position: relative.
 * @param surfaceRef - absolute surface inside that element; only the selected Slot consumer is mounted.
 * @param dispatchInteraction - framework-injected plugin gesture dispatch.
 * @param registeredIds - live registered owners used to dismiss removed plugins.
 * @returns current owner and area-local selection actions.
 */
export function useTextInteraction(
  rootRef: RefObject<HTMLElement>, surfaceRef: RefObject<HTMLElement>,
  dispatchInteraction: (gesture: TextInteractionGesture) => string | null,
  registeredIds: readonly string[],
): TextInteractionBinding {
  const target = useRef<Target | null>(null)
  const [active, setActive] = useState<TextInteractionBinding['active']>(null)
  const dismiss = useCallback(() => {
    target.current = null
    if (surfaceRef.current !== null) surfaceRef.current.style.visibility = 'hidden'
    setActive(null)
  }, [surfaceRef])
  useEffect(dismiss, [registeredIds, dispatchInteraction, dismiss])
  const readText = useCallback(() => {
    const root = rootRef.current
    const current = target.current
    if (root === null || current === null || !available(root, current)) return null
    return current.selection === null ? null : selectedText(current.selection)
  }, [rootRef])
  const clearSelection = useCallback(() => { rootRef.current?.ownerDocument.getSelection()?.removeAllRanges() }, [rootRef])

  const place = useCallback(() => {
    const root = rootRef.current
    const surface = surfaceRef.current
    const current = target.current
    if (root === null || surface === null || current === null) return
    if (!available(root, current)) { dismiss(); return }
    const view = root.ownerDocument.defaultView
    /* v8 ignore if -- Mounted browser content always has an owner window. */
    if (view === null) return
    const visible = visibleBounds(root, current.source, view)
    const selectionRects = current.selection === null ? [] : [...current.selection.range.getClientRects()]
    const fallback = current.selection?.range.getBoundingClientRect() ?? current.source.getBoundingClientRect()
    const rects = selectionRects.length === 0 ? [fallback] : selectionRects
    const sourceRect = current.source.getBoundingClientRect()
    const pointX = current.point === null ? 0 : sourceRect.left + current.point.x - current.source.scrollLeft
    const pointY = current.point === null ? 0 : sourceRect.top + current.point.y - current.source.scrollTop
    const anchor = current.point === null
      ? rects.map(rectBounds).find(rect => intersects(rect, visible))
      : { left: pointX, right: pointX + 1, top: pointY, bottom: pointY + 1 }
    if (anchor === undefined || !intersects(anchor, visible) || visible.right <= visible.left || visible.bottom <= visible.top) {
      surface.style.visibility = 'hidden'
      return
    }
    const gap = 8
    surface.style.maxWidth = `${visible.right - visible.left}px`
    surface.style.maxHeight = `${visible.bottom - visible.top}px`
    const size = surface.getBoundingClientRect()
    const x = current.point === null
      ? (Math.max(anchor.left, visible.left) + Math.min(anchor.right, visible.right) - size.width) / 2
      : anchor.left
    const above = anchor.top - gap - size.height
    const below = anchor.bottom + gap
    const preferredY = current.point === null && above >= visible.top ? above : below
    const left = Math.max(visible.left, Math.min(x, visible.right - size.width))
    const top = Math.max(visible.top, Math.min(preferredY, visible.bottom - size.height))
    const rootRect = root.getBoundingClientRect()
    const scaleX = root.offsetWidth === 0 ? 1 : rootRect.width / root.offsetWidth
    const scaleY = root.offsetHeight === 0 ? 1 : rootRect.height / root.offsetHeight
    surface.style.left = `${(left - rootRect.left) / scaleX - root.clientLeft + root.scrollLeft}px`
    surface.style.top = `${(top - rootRect.top) / scaleY - root.clientTop + root.scrollTop}px`
    surface.style.visibility = 'visible'
  }, [dismiss, rootRef, surfaceRef])

  // The surface's measured dimensions are needed after its Slot owner renders, before paint.
  useLayoutEffect(place, [active, place])
  useEffect(() => {
    const root = rootRef.current
    const surface = surfaceRef.current
    if (root === null || surface === null) return
    const document = root.ownerDocument
    const view = document.defaultView
    /* v8 ignore if -- Mounted browser content always has an owner window. */
    if (view === null) return
    let pointerSelecting = false
    let keyboardSelecting = false
    let selectionChangedDuringGesture = false
    let previousRange: Range | null = null
    let frame: number | undefined
    const scrollport = root.closest<HTMLElement>('[data-conversation-scroll]') ?? root.parentElement
    const composer = composerSeat(root)
    let selectionDrag: { id: number; x: number; y: number } | null = null
    let selectionFrame: number | undefined
    const stopSelectionScroll = (): void => {
      selectionDrag = null
      if (selectionFrame !== undefined) view.cancelAnimationFrame(selectionFrame)
      selectionFrame = undefined
    }
    const scrollSelection = (): void => {
      selectionFrame = undefined
      const drag = selectionDrag
      const selection = document.getSelection()
      if (drag === null || scrollport === null || !root.isConnected || selection === null || selection.isCollapsed
        || !root.contains(selection.anchorNode)) return
      const viewport = scrollport.getBoundingClientRect()
      const column = root.getBoundingClientRect()
      const composerRect = composer?.getBoundingClientRect()
      const top = Math.max(viewport.top, 0)
      const bottom = Math.min(viewport.bottom, view.innerHeight,
        composerRect !== undefined && composerRect.height > 0 ? composerRect.top : Infinity)
      if (drag.x < column.left || drag.x >= column.right || bottom <= top) return
      const edge = Math.min(SELECTION_EDGE, (bottom - top) / 2)
      const distance = drag.y < top + edge ? drag.y - top - edge : Math.max(0, drag.y - bottom + edge)
      if (distance === 0) return
      const previousTop = scrollport.scrollTop
      scrollport.scrollTop += Math.sign(distance) * Math.max(2, Math.min(24, Math.abs(distance) / 2))
      if (scrollport.scrollTop === previousTop) return

      // A stationary pointer over the sticky composer stops receiving native
      // transcript hit tests. Extend the live selection at the exposed edge.
      const y = Math.max(top + 1, Math.min(drag.y, bottom - 1))
      const caret = document.caretPositionFromPoint?.(drag.x, y)
      const range = caret == null ? document.caretRangeFromPoint?.(drag.x, y) : null
      const focus = caret?.offsetNode ?? range?.startContainer
      const offset = caret?.offset ?? range?.startOffset
      if (focus !== undefined && offset !== undefined && root.contains(focus)) selection.extend(focus, offset)
      selectionFrame = view.requestAnimationFrame(scrollSelection)
    }
    const schedulePlacement = (): void => {
      if (target.current === null || frame !== undefined) return
      frame = view.requestAnimationFrame(() => { frame = undefined; place() })
    }
    const dispatch = (trigger: TextInteractionTrigger, next: Target, event: Event): void => {
      if (!available(root, next)) return
      const id = dispatchInteraction({
        trigger, hasSelection: next.selection !== null,
        readText: () => next.text,
        preventDefault: () => { event.preventDefault() },
      })
      if (id === null) return
      target.current = next
      setActive({ id, trigger })
    }
    const updateSelection = (event: Event): void => {
      if (pointerSelecting || keyboardSelecting) { selectionChangedDuringGesture = true; return }
      if (target.current !== null && target.current.point !== null) return
      if (target.current !== null && surface.contains(document.activeElement)) return
      const selection = readTextSelection(root, document.getSelection())
      const range = selection?.range ?? null
      if (!selectionChangedDuringGesture && sameRange(previousRange, range)) return
      selectionChangedDuringGesture = false
      previousRange = range?.cloneRange() ?? null
      dismiss()
      if (selection === null) return
      const text = selectedText(selection)
      if (text === null) return
      dispatch('selection', { source: selection.source, selection: { ...selection, range: selection.range.cloneRange() }, text, point: null }, event)
    }
    const insideSurface = (event: Event): boolean => event.composedPath().includes(surface)
    const pointerDown = (event: PointerEvent): void => {
      if (insideSurface(event)) return
      const selection = document.getSelection()
      previousRange = selection?.rangeCount === 1 ? selection.getRangeAt(0).cloneRange() : null
      dismiss()
      selectionChangedDuringGesture = false
      stopSelectionScroll()
      pointerSelecting = event.button === 0 && event.target instanceof Node && root.contains(event.target)
      if (pointerSelecting && event.pointerType === 'mouse' && event.target instanceof Element
        && event.target.closest('[data-text-interaction-source]') !== null
        && event.target.closest('[data-text-interaction-exclude], button, input, textarea, [contenteditable="true"]') === null) {
        selectionDrag = { id: event.pointerId, x: event.clientX, y: event.clientY }
      }
    }
    const pointerMove = (event: PointerEvent): void => {
      if (selectionDrag?.id !== event.pointerId) return
      if ((event.buttons & 1) === 0) { stopSelectionScroll(); return }
      selectionDrag.x = event.clientX
      selectionDrag.y = event.clientY
      selectionFrame ??= view.requestAnimationFrame(scrollSelection)
    }
    const pointerUp = (event: PointerEvent): void => {
      stopSelectionScroll()
      if (!pointerSelecting) return
      pointerSelecting = false
      updateSelection(event)
    }
    const cancel = (): void => { stopSelectionScroll(); pointerSelecting = false; keyboardSelecting = false; dismiss() }
    const keyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') { cancel(); return }
      if (insideSurface(event) || !(event.target instanceof Node) || !root.contains(event.target)) return
      if (event.key === 'Shift' || event.shiftKey) { keyboardSelecting = true; dismiss() }
    }
    const keyUp = (event: KeyboardEvent): void => {
      if (!keyboardSelecting || (event.key !== 'Shift' && event.shiftKey)) return
      keyboardSelecting = false
      updateSelection(event)
    }
    const contextMenu = (event: MouseEvent): void => {
      if (insideSurface(event)) return
      const element = event.target instanceof Element ? event.target : null
      const source = element?.closest<HTMLElement>('[data-text-interaction-source]')
      if (source === undefined || source === null || !root.contains(source)
        || element?.closest('[data-text-interaction-exclude], button, input, textarea, [contenteditable="true"]')) return
      stopSelectionScroll()
      pointerSelecting = false
      dismiss()
      const selected = readTextSelection(root, document.getSelection())
      const keyboard = event.clientX === 0 && event.clientY === 0
      const inSelection = selected?.source === source && (keyboard || [...selected.range.getClientRects()].some(rect =>
        event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom))
      const selection = inSelection ? selected : null
      const bounds = source.getBoundingClientRect()
      dispatch('contextmenu', {
        source, selection: selection === null ? null : { ...selection, range: selection.range.cloneRange() },
        text: selection === null ? null : selectedText(selection),
        point: {
          x: (keyboard ? 0 : event.clientX - bounds.left) + source.scrollLeft,
          y: (keyboard ? 0 : event.clientY - bounds.top) + source.scrollTop,
        },
      }, event)
    }
    document.addEventListener('selectionchange', updateSelection)
    document.addEventListener('pointerdown', pointerDown, true)
    document.addEventListener('pointermove', pointerMove, { capture: true, passive: true })
    document.addEventListener('pointerup', pointerUp, true)
    document.addEventListener('pointercancel', cancel)
    document.addEventListener('keydown', keyDown)
    document.addEventListener('keyup', keyUp)
    document.addEventListener('scroll', schedulePlacement, true)
    root.addEventListener('contextmenu', contextMenu)
    view.addEventListener('resize', schedulePlacement)
    view.addEventListener('blur', cancel)
    return () => {
      document.removeEventListener('selectionchange', updateSelection)
      document.removeEventListener('pointerdown', pointerDown, true)
      document.removeEventListener('pointermove', pointerMove, true)
      document.removeEventListener('pointerup', pointerUp, true)
      document.removeEventListener('pointercancel', cancel)
      document.removeEventListener('keydown', keyDown)
      document.removeEventListener('keyup', keyUp)
      document.removeEventListener('scroll', schedulePlacement, true)
      root.removeEventListener('contextmenu', contextMenu)
      view.removeEventListener('resize', schedulePlacement)
      view.removeEventListener('blur', cancel)
      if (frame !== undefined) view.cancelAnimationFrame(frame)
      stopSelectionScroll()
    }
  }, [dismiss, place, rootRef, surfaceRef, dispatchInteraction])
  useEffect(() => {
    const root = rootRef.current
    const surface = surfaceRef.current
    if (active === null || root === null || surface === null) return
    const view = root.ownerDocument.defaultView
    /* v8 ignore if -- Mounted browser content always has an owner window. */
    if (view === null) return
    let frame: number | undefined
    const schedule = (): void => {
      if (frame !== undefined) return
      frame = view.requestAnimationFrame(() => { frame = undefined; place() })
    }
    const resize = new ResizeObserver(schedule)
    resize.observe(root)
    resize.observe(surface)
    const composer = composerSeat(root)
    if (composer !== null) resize.observe(composer)
    const mutations = new MutationObserver((records) => {
      if (records.some(record => !surface.contains(record.target))) schedule()
    })
    mutations.observe(root, { childList: true, subtree: true, characterData: true, attributes: true })
    return () => {
      resize.disconnect()
      mutations.disconnect()
      if (frame !== undefined) view.cancelAnimationFrame(frame)
    }
  }, [active, place, rootRef, surfaceRef])
  return { active, dismiss, readText, clearSelection }
}
