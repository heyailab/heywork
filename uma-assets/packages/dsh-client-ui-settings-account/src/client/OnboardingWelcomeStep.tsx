/** UMA workspace introduction and the entry into setup. */
import type { RefObject } from 'react'
import {
  Button, IconCodeOutlineRegular, IconDeliverDocRegular, IconSparkleRegular,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { DesktopOnboardingProps } from './onboarding-contract.ts'
import css from './DesktopOnboarding.module.css'

/** @param props - localized content, focus target and navigation. @returns the welcome step. */
export function OnboardingWelcomeStep({ t, heading, busy, onStart }: Pick<DesktopOnboardingProps, 't'> & {
  heading: RefObject<HTMLHeadingElement>
  busy: boolean
  onStart: () => void
}) {
  return <div className={`${css.content} ${css.welcome}`}>
    <div className={css.copy}>
      <h1 id="desktop-onboarding-title" ref={heading} tabIndex={-1}>{t('onboardingWelcome')} <em className={css.brand}>{t('onboardingBrand')}</em></h1>
      <p className={css.heroDescription}>{t('onboardingIntroduction')}</p>
      <Button variant="primary" className={`${css.action} ${css.start}`} disabled={busy} onClick={onStart}>{t('onboardingStart')}</Button>
    </div>
    <div className={css.workflow} aria-hidden="true">
      <div className={css.flowHeading}><span /><span /><span /></div>
      <div className={css.flowStep}><IconSparkleRegular size={22} /><span>{t('onboardingFlowDesign')}</span></div>
      <div className={css.flowStep}><IconCodeOutlineRegular size={22} /><span>{t('onboardingFlowBuild')}</span></div>
      <div className={css.flowStep}><IconDeliverDocRegular size={22} /><span>{t('onboardingFlowDeliver')}</span></div>
    </div>
  </div>
}
