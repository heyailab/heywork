import z from "@deepseek-ai/schemastery";
//#region lib/types/config.js
/** Product-owned suppression of internal skill traces. */
/** Validate explicit product prefixes; the generic client hides none by default. */
const Config = z.object({ hiddenNamePrefixes: z.array(z.string().min(1)) });
//#endregion
//#region lib/types/index.js
/**
* Skill reference plugin, node half. Pure UI plugin: the empty apply
* exists so the plugin appears in the host cordis.yml / Loader; the browser
* half ships via exports["./client"], discovered through the package.json
* dsh.client declaration.
*/
/** Host plugin body — no host-side behavior for this source plugin. */
function apply() {}
//#endregion
export { Config, apply };
