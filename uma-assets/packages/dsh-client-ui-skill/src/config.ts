/** Product-owned suppression of internal skill traces. */
import z from '@deepseek-ai/schemastery'
/** Skill presentation configuration. */
export interface Config {
  /** Reserved internal name prefixes hidden from ordinary tool rows. */
  hiddenNamePrefixes?: string[]
}
/** Validate explicit product prefixes; the generic client hides none by default. */
export const Config: z<Config> = z.object({ hiddenNamePrefixes: z.array(z.string().min(1)) })
