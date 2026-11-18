/** Browser conversation preferences. */
import type {} from '@deepseek-ai/dsh-settings'
import type {} from '@deepseek-ai/dsh-host-webserver'

import type { Volatile, Context } from '@deepseek-ai/cordis'
import type { BusyEnterBehavior } from './submission-settings.ts'
import z from '@deepseek-ai/schemastery'
import { BUSY_ENTER_FIELD } from './submission-settings.ts'

import { ConversationSettingsFields } from './submission-settings.ts'
import { WORKSPACE_PICKER_ON_INPUT } from './workspace-picker-bootstrap.ts'
import { FIRST_LEVEL_MODEL_PICKER } from './model-picker-bootstrap.ts'

export {
  BUSY_ENTER_BEHAVIORS, BUSY_ENTER_FIELD, CONVERSATION_SETTINGS_NAMESPACE,
  DEFAULT_BUSY_ENTER_BEHAVIOR, type BusyEnterBehavior, type ConversationSettings,
} from './submission-settings.ts'

/** Runtime preferences projected to the browser. */
export interface Config {
  /** Enter key behavior while a turn is running. */
  busyEnter: Volatile<BusyEnterBehavior>
  /** Allow the empty composer to open the Workspace picker. */
  workspacePickerOnInput?: boolean
  /** Open the model list directly and expose current-model effort in its detail card. */
  firstLevelModelPicker?: boolean
}

/** Live preferences projected to the browser. */
export const Config = z.object({
  busyEnter: ConversationSettingsFields[BUSY_ENTER_FIELD].volatile(),
  workspacePickerOnInput: z.boolean(),
  firstLevelModelPicker: z.boolean(),
})

/** Register browser conversation preferences.
 * @param ctx - Host context used for settings and page bootstrap.
 * @param config - Loaded Conversation options.
 */
export function apply(ctx: Context, config?: Config): void {
  ctx.inject(['settings'], (child) => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)) })
  if (config?.workspacePickerOnInput === false || config?.firstLevelModelPicker === true) {
    ctx.on('webserver/index-inject', (table) => {
      if (config.workspacePickerOnInput === false) table.push({ kind: 'global', name: WORKSPACE_PICKER_ON_INPUT, value: false })
      if (config.firstLevelModelPicker === true) table.push({ kind: 'global', name: FIRST_LEVEL_MODEL_PICKER, value: true })
    })
  }
}
