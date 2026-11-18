/** Shared provider groups for the composer and command model pickers. */

import type { ModelProviderGroup, ModelSelection } from '@deepseek-ai/dsh-api-remotes/client'

const UMA_MODEL_PROVIDERS = ['uma-messages', 'deepseek-account', 'uma-chat-completions', 'uma-responses', 'uma-gemini']

function umaPreference(group: ModelProviderGroup): number {
  if (group.name !== 'UMA Studio' && !group.name.startsWith('UMA Studio · ')) return -1
  return UMA_MODEL_PROVIDERS.indexOf(group.id)
}

/**
 * Present each hosted UMA model once, preferring native Messages and retaining an active Session's route.
 * @param groups - Provider groups in catalog order.
 * @param current - The current selection, or null before selection.
 * @returns Provider groups in display order without duplicate UMA Messages models.
 */
export function orderModelProviders(groups: readonly ModelProviderGroup[], current: ModelSelection | null): ModelProviderGroup[] {
  const managed = groups.filter(group => umaPreference(group) >= 0)
    .toSorted((left, right) => umaPreference(left) - umaPreference(right))
  const preferredProviders = new Map<string, string>()
  for (const group of managed) {
    for (const model of group.models) {
      if (!preferredProviders.has(model.id) || (current?.provider === group.id && current.model === model.id)) {
        preferredProviders.set(model.id, group.id)
      }
    }
  }
  const distinctManaged = managed.map(group => ({
    ...group,
    name: 'UMA Studio',
    models: group.models.filter(model => preferredProviders.get(model.id) === group.id),
  })).filter(group => group.models.length > 0)
  const otherProviders = groups.filter(group => umaPreference(group) < 0 && group.models.length > 0)
  return [...distinctManaged, ...otherProviders.toSorted((left, right) =>
    (left.id === 'deepseek-account' ? 0 : left.id === 'deepseek-official' ? 1 : 2)
      - (right.id === 'deepseek-account' ? 0 : right.id === 'deepseek-official' ? 1 : 2))]
}

/**
 * Identify the legacy DeepSeek provider whose label comes from the current locale.
 * @param group - Provider whose label will be rendered.
 * @returns Whether to localize the generic DeepSeek account name.
 */
export function usesDeepSeekAccountLabel(group: Pick<ModelProviderGroup, 'id' | 'name'>): boolean {
  return group.id === 'deepseek-account' && group.name !== 'UMA Studio'
}
