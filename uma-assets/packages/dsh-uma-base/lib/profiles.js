//#region lib/types/profiles.js
/** Ordered HEY profile layers shared by source preparation and the Desktop runtime. */
const BASE = "@deepseek-ai/dsh-base";
const HEY_BASE = "@deepseek-ai/dsh-uma-base";
/** HEY-owned compositions; ordinary kernel profile templates remain independent. */
const UMA_PROFILE_BUNDLES = {
	"hey-web": [
		BASE,
		"@deepseek-ai/dsh-web-app",
		HEY_BASE,
		"@deepseek-ai/dsh-uma-web"
	],
	desktop: [
		BASE,
		"@deepseek-ai/dsh-web-app",
		HEY_BASE,
		"@deepseek-ai/dsh-uma-web"
	],
	"hey-headless": [
		BASE,
		"@deepseek-ai/dsh-headless",
		HEY_BASE,
		"@deepseek-ai/dsh-hey-automation"
	],
	"hey-sdk": [
		BASE,
		"@deepseek-ai/dsh-sdk-app",
		HEY_BASE,
		"@deepseek-ai/dsh-hey-automation"
	]
};
/**
* Recognize a profile identity accepted by the HEY composition owner.
* @param name - Requested profile name.
* @returns Whether the name has a managed HEY bundle tuple.
*/
function isUmaProfileName(name) {
	return Object.hasOwn(UMA_PROFILE_BUNDLES, name);
}
/**
* Insert missing HEY layers after a recognized legacy kernel pair, preserving all existing third-party order.
* Current HEY tuples remain unchanged. Partial, duplicated or reordered owned layers reject without mutation.
* @param name - HEY profile whose ordered layers are required.
* @param current - Parsed ordered bundle names from an existing profile.
* @returns The existing list or a new migrated list; the input is never modified.
*/
function migrateUmaProfileBundles(name, current) {
	const expected = UMA_PROFILE_BUNDLES[name];
	const owned = new Set(Object.values(UMA_PROFILE_BUNDLES).flat());
	const present = current.filter((bundle) => owned.has(bundle));
	if (present.length === expected.length && present.every((bundle, index) => bundle === expected[index])) return current;
	if (present.length !== 2 || present[0] !== expected[0] || present[1] !== expected[1]) throw new Error(`HEY profile ${name}: unrecognized owned bundle order; review the profile before preparing it`);
	const insertion = current.indexOf(expected[1]) + 1;
	return [
		...current.slice(0, insertion),
		...expected.slice(2),
		...current.slice(insertion)
	];
}
//#endregion
export { UMA_PROFILE_BUNDLES, isUmaProfileName, migrateUmaProfileBundles };
