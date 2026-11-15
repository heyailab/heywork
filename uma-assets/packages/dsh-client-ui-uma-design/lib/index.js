//#region lib/types/index.js
/**
* Uma design-system cards, node half. Pure UI plugin: the empty apply exists
* so the plugin appears in the host composition; the browser half ships via
* exports["./client"], discovered through the package.json dsh.client declaration.
*/
/** Host plugin body — no host-side behavior for this client presentation. */
function apply() {}
//#endregion
export { apply };
