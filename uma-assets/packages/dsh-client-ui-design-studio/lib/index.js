import z from "@deepseek-ai/schemastery";
//#region lib/types/index.js
/** Host configuration for design and delivery presentation. */
/** Plugin identity. */
const name = "ui-design-studio";
/** No Host service dependencies. */
const inject = [];
/** Raw reference documents are disabled in ordinary profiles. */
const Config = z.object({ showInternalLibrary: z.boolean().default(false) });
/** Client-owned presentation; no Host side effects. */
function apply() {}
//#endregion
export { Config, apply, inject, name };
