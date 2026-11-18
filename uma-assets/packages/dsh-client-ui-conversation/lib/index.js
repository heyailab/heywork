import z from "@deepseek-ai/schemastery";
//#region lib/types/submission-settings.js
/** Busy-Enter preference stored in the Host user-settings document. */
/** Settings namespace owned by the conversation plugin. */
const CONVERSATION_SETTINGS_NAMESPACE = "ui-conversation";
/** Field carrying the delivery mode for plain Enter while an agent is busy. */
const BUSY_ENTER_FIELD = "busyEnter";
/** Busy-Enter behaviors accepted at settings and input boundaries. */
const BUSY_ENTER_BEHAVIORS = ["queue", "steer"];
/** Default preserves Enter-as-Queue for running conversations. */
const DEFAULT_BUSY_ENTER_BEHAVIOR = "queue";
/** Durable conversation schema; also the wire envelope the browser scope validates against. */
const ConversationSettingsFields = { [BUSY_ENTER_FIELD]: z.union([...BUSY_ENTER_BEHAVIORS]).default(DEFAULT_BUSY_ENTER_BEHAVIOR) };
z.object(ConversationSettingsFields);
//#endregion
//#region lib/types/workspace-picker-bootstrap.js
/** Page-bootstrap key for the Host's empty composer interaction policy. */
const WORKSPACE_PICKER_ON_INPUT = "__DSH_WORKSPACE_PICKER_ON_INPUT__";
//#endregion
//#region lib/types/model-picker-bootstrap.js
/** Page-bootstrap key for the first-level composer model list. */
const FIRST_LEVEL_MODEL_PICKER = "__DSH_FIRST_LEVEL_MODEL_PICKER__";
//#endregion
//#region lib/types/index.js
/** Live preferences projected to the browser. */
const Config = z.object({
	busyEnter: ConversationSettingsFields[BUSY_ENTER_FIELD].volatile(),
	workspacePickerOnInput: z.boolean(),
	firstLevelModelPicker: z.boolean()
});
/** Register browser conversation preferences.
* @param ctx - Host context used for settings and page bootstrap.
* @param config - Loaded Conversation options.
*/
function apply(ctx, config) {
	ctx.inject(["settings"], (child) => {
		child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
	});
	if (config?.workspacePickerOnInput === false || config?.firstLevelModelPicker === true) ctx.on("webserver/index-inject", (table) => {
		if (config.workspacePickerOnInput === false) table.push({
			kind: "global",
			name: WORKSPACE_PICKER_ON_INPUT,
			value: false
		});
		if (config.firstLevelModelPicker === true) table.push({
			kind: "global",
			name: FIRST_LEVEL_MODEL_PICKER,
			value: true
		});
	});
}
//#endregion
export { BUSY_ENTER_BEHAVIORS, BUSY_ENTER_FIELD, CONVERSATION_SETTINGS_NAMESPACE, Config, DEFAULT_BUSY_ENTER_BEHAVIOR, apply };
