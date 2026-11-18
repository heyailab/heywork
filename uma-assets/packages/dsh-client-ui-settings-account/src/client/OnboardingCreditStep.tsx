/** Account balance and model billing setup. */
import type { RefObject } from 'react'
import { Button, IconCheckCircleOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import type { DesktopOnboardingProps } from './onboarding-contract.ts'
import { formatBalance } from './formatBalance.ts'
import css from './DesktopOnboarding.module.css'

/** @param props - balance details, localized content and recharge/navigation actions. @returns the balance step. */
export function OnboardingCreditStep({ t, heading, busy, funded, balance, canRecharge, onContinue, onRecharge, onLater }:
  Pick<DesktopOnboardingProps, 't'> & {
    heading: RefObject<HTMLHeadingElement>
    busy: boolean
    funded: boolean
    balance: NonNullable<DesktopOnboardingProps['account']['details']>['balance']
    canRecharge: boolean
    onContinue: () => void
    onRecharge: () => void
    onLater: () => void
  }) {
  const wallets = balance?.status === 'ready' ? balance.value : []
  return <div className={`${css.content} ${css.credit}`}>
    <div className={css.copy}>
      <h1 id="desktop-onboarding-title" ref={heading} tabIndex={-1}>{t('onboardingCredit')}</h1>
      <p className={css.heroDescription}>{t('onboardingCreditDescription')}</p>
      <div className={css.creditActions}>
        <Button className={css.action} variant="primary" disabled={busy || (!funded && !canRecharge)} onClick={funded ? onContinue : onRecharge}>{t(funded ? 'onboardingContinue' : 'onboardingTopUp')}</Button>
        <Button variant="outline" className={css.action} disabled={busy || (funded && !canRecharge)} onClick={funded ? onRecharge : onLater}>{t(funded ? 'onboardingFundedTopUp' : 'onboardingLater')}</Button>
      </div>
    </div>
    <div className={css.balancePreview}>
      <div className={css.balanceCaption}>{t('onboardingBalance')}</div>
      <div className={css.balanceValue}>
        {wallets.length === 0 ? <span className={css.balancePending}>{t(balance === undefined ? 'loading' : 'onboardingBalanceUnavailable')}</span>
          : wallets.map(wallet => <span key={wallet.currency}>
            {wallet.currency === 'UMA' ? wallet.balance : formatBalance(wallet.balance, wallet.currency === 'CNY' ? '¥' : '$')}
          </span>)}
      </div>
      <div className={css.balanceNote}><IconCheckCircleOutlineRegular size={17} />{t('onboardingBalanceNote')}</div>
    </div>
  </div>
}
