import z from "@deepseek-ai/schemastery";
//#region lib/types/config.js
/** Public presentation options shared by the Host and Client. */
/** Validate Host options and their public browser payload. */
const Config = z.object({ conversationCard: z.boolean().default(false) });
/** Bootstrap key for the validated presentation options. */
const TEAM_UI_CONFIG_GLOBAL = "__DSH_TEAM_UI__";
//#endregion
//#region lib/types/index.js
/**
* Send the presentation options when rendering the page.
* @param ctx - Host context with the index injection event.
* @param config - Validated presentation options.
*/
function apply(ctx, config) {
	ctx.on("webserver/index-inject", (table) => {
		table.push({
			kind: "global",
			name: TEAM_UI_CONFIG_GLOBAL,
			value: config
		});
	});
}
//#endregion
export { Config, apply };
