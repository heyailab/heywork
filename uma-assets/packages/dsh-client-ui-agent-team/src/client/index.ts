/** Browser entry for shared tasks and the optional conversation card. */

import type { Context as ClientContext } from '@deepseek-ai/cordis'
import { Config, TEAM_UI_CONFIG_GLOBAL } from '../config.ts'
import { registerAgentTeamUi } from './mount.ts'

export { inject } from './mount.ts'
export type { TeamBoardProps } from './TeamBoard.tsx'
export type { TeamKey } from './locales.ts'

/**
 * Register shared-task presentation on the Client Context.
 * @param ctx - Client Context with the declared `inject` services available.
 */
export function apply(ctx: ClientContext): void {
  const page = globalThis as Partial<Record<typeof TEAM_UI_CONFIG_GLOBAL, unknown>>
  const config = Config(page[TEAM_UI_CONFIG_GLOBAL] ?? {})
  registerAgentTeamUi(ctx, config.conversationCard)
}
