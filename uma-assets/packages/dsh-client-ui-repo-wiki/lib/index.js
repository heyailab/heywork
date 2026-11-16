import z from "@deepseek-ai/schemastery";
//#region lib/types/config.js
/** Browser Wiki refresh and automatic-update supervision limits. @module */
/** Validate browser background-work intervals. */
const Config = z.object({
	autoGenerateOnOpen: z.boolean().default(false),
	autoUpdateDefault: z.boolean().default(true),
	generationRefreshMs: z.number().step(1).min(1e3).default(3e3),
	autoUpdateIntervalMs: z.number().step(1).min(1e4).default(3e4),
	autoUpdateDebounceMs: z.number().step(1).min(100).default(1500)
});
//#endregion
//#region lib/types/index.js
/** Repository Wiki browser plugin; Node entry has no Host effects. @module */
/** Mount the browser-owned Wiki feature without adding Host services. */
function apply() {}
//#endregion
export { Config, apply };
