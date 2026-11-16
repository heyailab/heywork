import z from "@deepseek-ai/schemastery";
//#region lib/types/config.js
/** Public knowledge-library options shared by the Host and Client. @module */
/** Validate Host options and their public browser payload. */
const Config = z.object({
	showBuiltinStandards: z.boolean().default(false),
	refreshMs: z.number().min(1e3).step(1).default(2e3)
});
/** Bootstrap key for the public knowledge-library options. */
const KNOWLEDGE_UI_CONFIG_GLOBAL = "__UMA_KNOWLEDGE_UI__";
//#endregion
//#region lib/types/index.js
/**
* Publish the knowledge-library options before browser plugins activate.
* @param ctx - Host context collecting page initialization data.
* @param config - Validated knowledge-library options.
*/
function apply(ctx, config) {
	ctx.on("webserver/index-inject", (table) => {
		table.push({
			kind: "global",
			name: KNOWLEDGE_UI_CONFIG_GLOBAL,
			value: config
		});
	});
}
//#endregion
export { Config, apply };
