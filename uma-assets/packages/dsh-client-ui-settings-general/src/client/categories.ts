/** Settings navigation categories backed only by registered feature controls. */
import type { SettingsSectionRow } from './shell-contract.ts'

/** Stable categories of existing General contributions. */
export const GENERAL_CATEGORIES = [
  { id: 'appearance', items: ['appearance', 'font-size'] },
  { id: 'shortcuts', items: ['shortcuts'] },
  { id: 'conversation', items: ['transcript-view', 'composer-enter', 'performance-usage'] },
  { id: 'security', items: ['permission'] },
  { id: 'about', items: ['desktop-update-channel', 'current-version', 'developer-tools'] },
] as const

/** Project existing controls into discoverable sections without duplicating their state.
 * @param rows - Registered settings sections.
 * @param items - Registered General controls in display order.
 * @param label - Localized category-label resolver.
 * @returns Navigation rows retaining every unclassified General item and every feature section.
 */
export function settingsCategories(
  rows: readonly SettingsSectionRow[], items: readonly string[], label: (id: typeof GENERAL_CATEGORIES[number]['id']) => string,
): SettingsSectionRow[] {
  if (!rows.some(row => row.id === 'general')) return [...rows]
  const categories = GENERAL_CATEGORIES.filter(category => !rows.some(row => row.id === category.id))
    .map((category, index) => ({ id: category.id, label: label(category.id), order: index + 1,
      sectionId: 'general', generalItems: items.filter(id => category.items.some(item => item === id)) }))
    .filter(row => row.generalItems.length > 0)
  const assigned = new Set(categories.flatMap(row => row.generalItems))
  return rows.flatMap(row => row.id === 'general'
    ? [{ ...row, generalItems: items.filter(id => !assigned.has(id)) }, ...categories]
    : [row]).toSorted((left, right) => left.order - right.order)
}
