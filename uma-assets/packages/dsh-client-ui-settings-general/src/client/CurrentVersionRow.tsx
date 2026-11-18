/** Installed release version in General Settings for Web and Desktop. */
import type { PropsLocale, PropsRuntime, InjectFace, HostObservable } from '@deepseek-ai/dsh-client-ui-slots'
import css from './CurrentVersionRow.module.css'
import type { DesktopUpdateView }from '../types.ts'

/** The existing Desktop update observation owns installed shell facts. */
export interface CurrentVersionInjected { hooks:{ desktopUpdate:HostObservable<DesktopUpdateView> } }

/**
 * Render the installed Desktop version, or the Web/legacy build version; unknown shell metadata stays hidden.
 * @param props - runtime share and localized copy.
 * @returns the current release label, or nothing when build metadata is absent.
 */
export function CurrentVersionRow({ t,useDesktopUpdate }: PropsRuntime<'settings.general.item'> & PropsLocale<'settings'> & InjectFace<CurrentVersionInjected>) {
  const installed=useDesktopUpdate(value=>value.currentVersion)
  const version = installed===undefined?process.env.DSH_CLIENT_VERSION:installed
  if (version === undefined||version===null) return null
  return <div className={css.row}>{t('general.currentVersion', { version })}</div>
}
