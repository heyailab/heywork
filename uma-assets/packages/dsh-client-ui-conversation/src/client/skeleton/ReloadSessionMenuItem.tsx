/** Explicit history refresh for the currently displayed conversation. */
import { IconRefreshOutlineRegular, MenuItemButton } from '@deepseek-ai/dsh-client-ui-primitives'
import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'

/**
 * Reopen the current history stream after dismissing the header menu.
 * @param props - the menu dismissal, locale, and owning session's reload.
 * @returns a menu item for refreshing the conversation.
 */
export function ReloadSessionMenuItem({ onDismiss, reload, t }:
PropsRuntime<'conversation.session.header.menu'> & PropsLocale<'conversation'> & { reload: () => Promise<void> }) {
  return <MenuItemButton icon={<IconRefreshOutlineRegular />} onSelect={() => { onDismiss(); void reload() }}>
    {t('session.reloadHistory')}
  </MenuItemButton>
}
