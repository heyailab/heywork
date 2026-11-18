/** The General section: one column rendering feature-owned item contributions. */
import type { PropsRenderSlots, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import { SurfaceCard } from '@deepseek-ai/dsh-client-ui-primitives'
import css from './GeneralSection.module.css'

/** Full component props: section owner share plus item render share. */
export type GeneralSectionComponentProps =
  PropsRuntime<'settings.section'> & PropsRenderSlots<'settings.general.item'>

/**
 * Render the General section content column.
 * @param props - composed slot props (contract/slots.ts).
 * @returns the section element tree.
 */
export function GeneralSection({ renderSlot, generalItems, title }: GeneralSectionComponentProps) {
  return (
    <div className={css.section}>
      {title !== undefined && <h2 className={css.title}>{title}</h2>}
      {generalItems === undefined ? renderSlot('settings.general.item', {}) : generalItems.map(id =>
        <SurfaceCard key={id} className={css.card}>{renderSlot('settings.general.item', {}, { only: id })}</SurfaceCard>)}
    </div>
  )
}
