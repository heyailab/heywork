let electron = require("electron");
//#region lib/types/platform-ipc.js
/** Shared names for the desktop Platform bridge. */
/** Private desktop channels; the Platform renderer receives bootstrap and locale updates. */
const PLATFORM_IPC = {
	bootstrap: "dsh-platform:bootstrap",
	localeChanged: "dsh-platform:locale-changed",
	open: "dsh-platform:open",
	bounds: "dsh-platform:bounds",
	close: "dsh-platform:close"
};
//#endregion
//#region lib/types/preload-platform-account.js
/** Platform locale initialization and legacy document authentication. */
const originArgument = "--dsh-platform-origin=";
const allowedOrigin = process.argv.find((argument) => argument.startsWith(originArgument))?.slice(22);
if (process.isMainFrame && location.origin === allowedOrigin) {
	const headerAuthenticated = process.argv.includes("--dsh-platform-header-auth");
	let token;
	let locale;
	const localeListeners = /* @__PURE__ */ new Set();
	electron.ipcRenderer.on(PLATFORM_IPC.localeChanged, (_event, value) => {
		if (value !== "en_US" && value !== "zh_CN") return;
		locale = value;
		for (const listener of localeListeners) try {
			listener(value);
		} catch (error) {
			console.error("Platform locale listener failed", error);
		}
	});
	try {
		const value = electron.ipcRenderer.sendSync(PLATFORM_IPC.bootstrap);
		if (typeof value === "object" && value !== null && "origin" in value && value.origin === location.origin && "locale" in value && (value.locale === "en_US" || value.locale === "zh_CN")) {
			locale = value.locale;
			if (!headerAuthenticated && "token" in value && typeof value.token === "string" && value.token.length > 0) token = value.token;
		}
	} catch {}
	electron.contextBridge.exposeInMainWorld("dsh", {
		protocolVersion: 1,
		displayMode: "embedded",
		getLocale: () => {
			if (locale === void 0) throw new Error("Platform locale initialization failed");
			return locale;
		},
		onLocaleChange: (listener) => {
			localeListeners.add(listener);
			return () => {
				localeListeners.delete(listener);
			};
		},
		...headerAuthenticated ? {} : { getAuthToken: () => {
			if (token === void 0) throw new Error("Platform initialization failed");
			return token;
		} }
	});
}
//#endregion
