/** Chat-only row visibility; durable events and trajectory inspection remain intact. */
import type { ChatNode } from './chat-nodes.ts'

const INTERNAL_CONTEXT_SOURCES = new Set(['user-approval', 'runtime-context', 'experience-recall', 'skill-catalog', 'time-context', 'coding-edit-policy'])

/**
 * Exclude routine runtime context, system prompts, permission commands, and normal Team toggle receipts.
 * Failed Team toggles remain visible.
 * @param node - projected Chat node.
 * @returns whether the node contributes a visible Chat row.
 */
export function isVisibleChatNode(node: ChatNode): boolean {
  if (node.kind === 'context') {
    const source = node.data.source
    if (typeof source === 'object' && source !== null && 'kind' in source
      && typeof source.kind === 'string' && INTERNAL_CONTEXT_SOURCES.has(source.kind)) return false
  }
  if (node.kind === 'command') {
    if (node.data.name === 'permission') return false
    if (node.data.name === 'team' && node.data.outcome?.kind !== 'error') {
      const selection = node.data.args?.trim()
      if (selection === 'on' || selection === 'off') return false
    }
  }
  return node.visibility === 'visible'
    && node.kind !== 'system-prompt'
}
