/**
 * Document icon sprite: one hidden `<svg>` whose `<symbol>` children carry
 * every product icon, so ui-primitives icons render through `<use>` and
 * inherit `currentColor` and CSS variables at each use site.
 */
import type { Context } from '@deepseek-ai/cordis'
import { createIconSprite, ICON_SYMBOLS, type IconReplacements, type IconSymbolId } from '@deepseek-ai/dsh-client-ui-primitives'

export type { IconReplacements } from '@deepseek-ai/dsh-client-ui-primitives'

/**
 * Mount the sprite and keep each symbol on the active theme's replacement or
 * the ui-primitives default. Plugin disposal removes the sprite.
 * @param ctx - owning plugin context. Theme snapshots drive updates.
 * @param icons - replacements of the theme active at install time.
 */
export function installIconSprite(ctx: Context, icons: IconReplacements | undefined): void {
  if (typeof document === 'undefined') return
  const { sprite, apply } = createIconSprite(Object.keys(ICON_SYMBOLS) as IconSymbolId[], icons)
  ctx.effect(() => {
    document.body.prepend(sprite)
    return () => { sprite.remove() }
  }, 'ui-theme: icon sprite')
  ctx.on('theme/change', (snapshot) => { apply(snapshot.active.icons) })
}
