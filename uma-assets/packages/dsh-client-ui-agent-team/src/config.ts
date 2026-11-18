/** Public presentation options shared by the Host and Client. */
import z from '@deepseek-ai/schemastery'

/** Team UI options after validation. */
export interface Config {
  /** Show the team card above the root conversation composer. */
  readonly conversationCard: boolean
}

/** Validate Host options and their public browser payload. */
export const Config: z<Partial<Config>, Config> = z.object({
  conversationCard: z.boolean().default(false),
})

/** Bootstrap key for the validated presentation options. */
export const TEAM_UI_CONFIG_GLOBAL = '__DSH_TEAM_UI__'
