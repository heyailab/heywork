/** Model identity and advisory rates in the composer's row hover card. */
import { useEffect, useState } from 'react'
import type { ModelCatalogModel } from '@deepseek-ai/dsh-api-session-controller/types'
import { IconCheckOutlineRegular, IconCopyOutlineRegular, IconSparkleRegular, Tag, useClipboardCopy } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type { ModelSelectInjected } from './slots.ts'
import deepseek from './assets/deepseek.svg'
import kimi from './assets/kimi.svg'
import css from './ModelSelect.module.css'

/**
 * Render a known model's mark or the shared model icon.
 * @param props - the provider's model ID.
 * @returns a decorative icon with a consistent 16-pixel box.
 */
export function ModelIcon({ model }: { model: string }) {
  if (/^kimi(?:\b|[-_])/iu.test(model)) {
    return <img className={`${css.modelIcon} ${css.monochromeIcon}`} src={kimi} width={16} height={16} alt="" />
  }
  return /^deepseek(?:\b|[-_])/iu.test(model)
    ? <img className={css.modelIcon} src={deepseek} width={16} height={16} alt="" />
    : <IconSparkleRegular className={css.modelIcon} size={16} aria-hidden="true" />
}

type Translate = PropsLocale<'model'>['t']
type TokenRate = Extract<NonNullable<ModelCatalogModel['billing']>, { kind: 'tokens' }>
type LlmModelTokenRates = TokenRate['rates']
type LlmModelTimeOfUse = NonNullable<TokenRate['timeOfUse']>

function displayAmount(value: string): string {
  return value.includes('.') ? value.replace(/0+$/u, '').replace(/\.$/u, '') : value
}

function activeBand(schedule: LlmModelTimeOfUse | undefined, now: number): 'peak' | 'off_peak' | undefined {
  if (schedule === undefined) return undefined
  return schedule.nextChangeAt === undefined || Date.parse(schedule.nextChangeAt) > now ? schedule.currentBand : undefined
}

function rateRows(base: LlmModelTokenRates, offPeak: LlmModelTokenRates | undefined, t: Translate) {
  const rows = [
    { key: 'input', label: t('billing.input') },
    { key: 'cacheRead', label: t('billing.cacheRead') },
    { key: 'output', label: t('billing.output') },
  ] as const
  return Number(base.cacheWrite) > 0 || (offPeak !== undefined && Number(offPeak.cacheWrite) > 0)
    ? [...rows.slice(0, 2), { key: 'cacheWrite' as const, label: t('billing.cacheWrite') }, rows[2]]
    : rows
}

function rateClipboard(modelName: string, billing: NonNullable<ModelCatalogModel['billing']>, t: Translate): string {
  if (billing.kind === 'request') {
    return [modelName, t('billing.perRequest', { amount: displayAmount(billing.amount) })].join('\n')
  }
  const { rates, timeOfUse } = billing
  const offPeak = timeOfUse?.offPeak
  const rows = rateRows(rates, offPeak, t)
  const lines = [modelName, t('billing.perMillion')]
  if (offPeak !== undefined) lines.push([t('billing.type'), t('billing.offPeak'), t('billing.peak')].join('\t'))
  for (const { key, label } of rows) {
    lines.push([label, ...offPeak === undefined ? [] : ['¥' + displayAmount(offPeak[key])], '¥' + displayAmount(rates[key])].join('\t'))
  }
  if (billing.minimum !== undefined && timeOfUse === undefined) {
    lines.push(t('billing.minimum', { amount: displayAmount(billing.minimum) }))
  }
  if (timeOfUse !== undefined) {
    lines.push(t(timeOfUse.schedule === 'volcengine_cn' ? 'billing.volcengineDetails' : 'billing.scheduleDetails'))
    if (timeOfUse.promotion !== undefined) lines.push(t('billing.volcenginePromotion'))
  }
  return lines.join('\n')
}

function CopyRate({ text, t }: { text: string; t: Translate }) {
  const { copied, onCopy } = useClipboardCopy(text)
  return (
    <button type="button" className={css.copyRate} data-copy-model-rate onClick={onCopy}>
      {copied ? <IconCheckOutlineRegular size={14} aria-hidden /> : <IconCopyOutlineRegular size={14} aria-hidden />}
      <span aria-live="polite">{t(copied ? 'billing.copied' : 'billing.copy')}</span>
    </button>
  )
}

function TokenBilling({ billing, t }: { billing: TokenRate; t: Translate }) {
  const { rates, timeOfUse } = billing
  const [now, setNow] = useState(Date.now)
  const next = timeOfUse?.nextChangeAt
  useEffect(() => {
    if (next === undefined) return
    const until = Date.parse(next) - Date.now()
    if (until <= 0) return
    const timer = setTimeout(() => { setNow(Date.now()) }, until)
    return () => { clearTimeout(timer) }
  }, [next])
  const band = activeBand(timeOfUse, Math.max(now, Date.now()))
  const rows = rateRows(rates, timeOfUse?.offPeak, t)
  if (timeOfUse === undefined) return (
    <div className={css.billing}>
      <p className={css.billingCaption}>{t('billing.perMillion')}</p>
      <dl className={css.billingList}>
        {rows.map(({ key, label }) => <div key={key}><dt>{label}</dt><dd>¥{displayAmount(rates[key])}</dd></div>)}
      </dl>
      {billing.minimum !== undefined && <p className={css.billingCaption}>{t('billing.minimum', { amount: displayAmount(billing.minimum) })}</p>}
    </div>
  )
  const volcengine = timeOfUse.schedule === 'volcengine_cn'
  const promotion = timeOfUse.promotion
  const showRate = (value: string, original: string | undefined) => (
    <>
      {original !== undefined && Number(original) !== Number(value) && <del className={css.originalRate}>¥{displayAmount(original)}</del>}
      <span>¥{displayAmount(value)}</span>
    </>
  )
  return (
    <div className={css.billing}>
      <div className={css.billingStatus}>
        <Tag tone="info">{t(volcengine ? 'billing.volcengineSchedule' : 'billing.deepseekSchedule')}</Tag>
        {band === 'off_peak' && <Tag tone={volcengine ? 'neutral' : 'success'}>{t(volcengine ? 'billing.offPeak' : 'billing.offPeakDiscount')}</Tag>}
        {band === 'peak' && <Tag tone="neutral">{t('billing.peak')}</Tag>}
      </div>
      <table className={css.billingTable}>
        <caption>{t('billing.perMillion')}</caption>
        <thead><tr>
          <th scope="col">{t('billing.type')}</th>
          <th scope="col" data-current={band === 'off_peak' || undefined}>{t('billing.offPeak')}</th>
          <th scope="col" data-current={band === 'peak' || undefined}>{t('billing.peak')}</th>
        </tr></thead>
        <tbody>{rows.map(({ key, label }) => (
          <tr key={key}>
            <th scope="row">{label}</th>
            <td data-current={band === 'off_peak' || undefined}>{showRate(timeOfUse.offPeak[key], promotion?.standardOffPeak[key])}</td>
            <td data-current={band === 'peak' || undefined}>{showRate(rates[key], promotion?.standardPeak[key])}</td>
          </tr>
        ))}</tbody>
      </table>
      {next !== undefined && band !== undefined && <p className={css.billingCaption}>{t('billing.nextBand', {
        time: new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Shanghai', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
        }).format(Date.parse(next)),
      })}</p>}
      {promotion !== undefined && <p className={css.billingCaption}>{t('billing.volcenginePromotion')}</p>}
      <p className={css.billingCaption}>{t(volcengine ? 'billing.volcengineDetails' : 'billing.scheduleDetails')}</p>
    </div>
  )
}

/**
 * Show the model's catalog rate, capabilities and published label.
 * @param props - the selected row's catalog data and localized copy.
 * @returns the model information and available controls.
 */
export function ModelHoverDetails({ id, model, providerName, t, resolveText, effortControl, contextControl }: {
  id: string
  model: ModelCatalogModel
  providerName: string
  t: Translate
  resolveText: ModelSelectInjected['resolveText']
  effortControl?: { value: string | undefined; busy: boolean; onChange: (effort: string | undefined) => void } | undefined
  contextControl?: { value: number | undefined; busy: boolean; onChange: (tokens: number | undefined) => void } | undefined
}) {
  const { billing } = model
  const labels = model.badges ?? []
  return (
    <div id={id} className={css.modelHover} data-model-hover-card>
      <div className={css.modelHoverIdentity}>
        <ModelIcon model={model.id} />
        <div className={css.modelHoverText}>
          <div className={css.modelHoverName}>{model.name}</div>
          <div className={css.billingCaption}>{providerName}</div>
        </div>
        {billing !== undefined && <CopyRate text={rateClipboard(model.name, billing, t)} t={t} />}
      </div>
      {(model.badge !== undefined || labels.length > 0 || model.imageInput === true) && (
        <div className={css.billingStatus}>
          {labels.map((badge, index) => <Tag key={index} tone={badge.tone}>{resolveText(badge.text)}</Tag>)}
          {model.badge !== undefined && <Tag tone={model.badge.tone}>{resolveText(model.badge.text)}</Tag>}
          {model.imageInput === true && <Tag>{t('menu.imageInput')}</Tag>}
        </div>
      )}
      {labels.map((badge, index) => badge.reference === undefined ? null
        : <p key={index} className={css.billingCaption}>{t('billing.reference', { model: badge.reference })}</p>)}
      {model.description !== undefined && <p className={css.billingCaption}>{model.description}</p>}
      {(model.reasoning !== undefined || model.contextWindow !== undefined) && (
        <div className={css.modelDetails}>
          {model.reasoning !== undefined && (effortControl === undefined ? (
            <div className={css.modelDetailRow}>
              <span>{t('menu.effort')}</span>
              <span>{model.reasoning.efforts.map(level => level.name).join(' · ')}</span>
            </div>
          ) : (
            <label className={css.modelDetailRow}>
              <span>{t('menu.effort')}</span>
              <select className={css.effortControl} data-model-effort-control value={effortControl.value ?? ''}
                disabled={effortControl.busy} onChange={(event) => {
                  const selected = event.currentTarget.value
                  event.currentTarget.closest<HTMLElement>('[data-side-hover-card]')?.focus()
                  effortControl.onChange(selected === '' ? undefined : selected)
                }}>
                {model.reasoning.defaultEffort === undefined && <option value="">{t('effort.providerDefault')}</option>}
                {model.reasoning.efforts.map(level => <option key={level.id} value={level.id}>{level.name}</option>)}
              </select>
            </label>
          ))}
          {model.contextWindow !== undefined && (contextControl === undefined ? (
            <div className={css.modelDetailRow}>
              <span>{t('menu.contextWindow')}</span>
              <span>{t('menu.contextTokens', { count: new Intl.NumberFormat().format(model.contextWindow) })}</span>
            </div>
          ) : (
            <label className={css.modelDetailRow}>
              <span>{t('menu.contextWindow')}</span>
              <select className={css.effortControl} aria-label={t('menu.contextWindow')} value={contextControl.value ?? ''}
                disabled={contextControl.busy} onChange={(event) => {
                  const value = event.currentTarget.value
                  event.currentTarget.closest<HTMLElement>('[data-side-hover-card]')?.focus()
                  contextControl.onChange(value === '' ? undefined : Number(value))
                }}>
                <option value="">{t('menu.contextTokens', { count: new Intl.NumberFormat().format(model.contextWindow) })}</option>
                {[131072, 262144, 524288].filter(tokens => tokens < (model.contextWindow ?? 0)).map(tokens => (
                  <option key={tokens} value={tokens}>{t('menu.contextTokens', { count: new Intl.NumberFormat().format(tokens) })}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      {billing?.kind === 'tokens' ? <TokenBilling billing={billing} t={t} /> : (
        <p className={css.billing}>{billing?.kind === 'request'
          ? t('billing.perRequest', { amount: displayAmount(billing.amount) })
          : t('billing.unavailable')}</p>
      )}
    </div>
  )
}
