import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { z } from "zod";
import { parentPort, workerData } from "node:worker_threads";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
//#region lib/types/pdf-worker.js
/** Isolated PDF text extraction; no document JavaScript, forms, or network source URLs. @module */
async function run() {
	const request = z.object({
		bytes: z.instanceof(Uint8Array),
		maxPages: z.number().int().positive(),
		maxTextBytes: z.number().int().positive()
	}).parse(workerData);
	const root = dirname(createRequire(import.meta.url).resolve("pdfjs-dist/package.json"));
	const loading = getDocument({
		data: request.bytes,
		enableXfa: false,
		useSystemFonts: false,
		disableFontFace: true,
		useWorkerFetch: false,
		stopAtErrors: true,
		cMapUrl: join(root, "cmaps/"),
		cMapPacked: true,
		standardFontDataUrl: join(root, "standard_fonts/")
	});
	try {
		const document = await loading.promise;
		if (document.numPages > request.maxPages) throw new Error("too-many-pages");
		const pages = [];
		let total = 0;
		for (let index = 1; index <= document.numPages; index++) {
			const page = await document.getPage(index);
			const text = (await page.getTextContent()).items.map((item) => "str" in item ? item.str + (item.hasEOL ? "\n" : " ") : "").join("").trim();
			total += Buffer.byteLength(text);
			if (total > request.maxTextBytes) throw new Error("text-too-large");
			pages.push(text);
			page.cleanup();
		}
		if (pages.every((page) => page.trim() === "")) throw new Error("ocr-required");
		parentPort?.postMessage({
			ok: true,
			pages
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : "";
		parentPort?.postMessage({
			ok: false,
			reason: [
				"too-many-pages",
				"text-too-large",
				"ocr-required"
			].includes(message) ? message : "pdf-extraction-failed"
		});
	} finally {
		await loading.destroy();
	}
}
run().catch((_error) => {
	parentPort?.postMessage({
		ok: false,
		reason: "pdf-extraction-failed"
	});
});
//#endregion
export {};
