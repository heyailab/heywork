/** Host configuration for the browser-discovered Agent Teams UI plugin. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import { TEAM_UI_CONFIG_GLOBAL, type Config } from './config.ts'

export { Config } from './config.ts'

/**
 * Send the presentation options when rendering the page.
 * @param ctx - Host context with the index injection event.
 * @param config - Validated presentation options.
 */
export function apply(ctx: Context, config: Config): void {
  ctx.on('webserver/index-inject', (table) => {
    table.push({ kind: 'global', name: TEAM_UI_CONFIG_GLOBAL, value: config })
  })
}
