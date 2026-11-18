import type { ModelsKey } from './locales.ts'
import styles from './ModelsSection.module.css'

/**
 * Choose the reasoning parameter format used by a Chat Completions endpoint.
 * @param props - adapter formats, current override and the draft update.
 * @returns an optional format override with an automatic default.
 */
export function ThinkingFormatField({ formats, value, automatic, disabled, t, onChange }: {
  formats: readonly string[]
  value: string
  automatic?: string | undefined
  disabled: boolean
  t: (key: ModelsKey) => string
  onChange: (value: string) => void
}) {
  if (formats.length === 0) return null
  const inherited = automatic === undefined ? t('customThinkingAutomatic') : t('customThinkingAutomatic') + ' · ' + automatic
  return (
    <label className={styles['field']}>
      <span className={styles['fieldLabel']}>{t('customThinkingFormat')}</span>
      <select className={`${styles['input']} ${styles['selectInput']}`} aria-label={t('customThinkingFormat')} value={value} disabled={disabled}
        onChange={(event) => { onChange(event.currentTarget.value) }}>
        <option value="">{inherited}</option>
        {formats.map(format => <option key={format} value={format}>{format}</option>)}
      </select>
    </label>
  )
}
