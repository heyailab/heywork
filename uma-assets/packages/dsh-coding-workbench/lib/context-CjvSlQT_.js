import { z } from "zod";
//#region lib/types/context.js
/** Pure bounded projection of the latest runtime context that actually entered a model request. */
const MAX_CAPTURE_BYTES = 128 * 1024;
const MAX_SECTIONS = 128;
/** Current request evidence, with explicit display truncation. */
const contextSchema = z.object({
	seq: z.number().int(),
	sections: z.array(z.object({
		name: z.string(),
		text: z.string(),
		bytes: z.number().int().nonnegative(),
		truncated: z.boolean()
	})).max(MAX_SECTIONS),
	totalBytes: z.number().int().nonnegative(),
	capturedAt: z.number()
});
/** Empty inspector state before any runtime snapshot was admitted. */
const emptyContext = {
	seq: -1,
	sections: [],
	totalBytes: 0,
	capturedAt: 0
};
/**
* Bound displayed UTF-8 without splitting a code point.
* @param text - complete source text.
* @param maxBytes - display allowance.
* @returns complete or code-point-aligned text.
*/
function boundedText(text, maxBytes) {
	const bytes = Buffer.from(text);
	if (bytes.length <= maxBytes) return text;
	let end = Math.max(0, maxBytes);
	while (end > 0 && ((bytes[end] ?? 0) & 192) === 128) end--;
	return bytes.subarray(0, end).toString("utf8");
}
/**
* Recover the latest admitted runtime snapshot without rereading full Session history.
* @param state - previous inspector frame.
* @param event - next committed event.
* @returns unchanged state for unrelated events, otherwise a bounded actual snapshot.
*/
function foldContext(state, event) {
	if (event.type !== "user/message" || event.data.source.kind !== "runtime-context") return state;
	const source = event.data.source;
	const sections = source.form === "snapshot" ? source.sections : [];
	let remaining = MAX_CAPTURE_BYTES;
	const captured = sections.slice(0, MAX_SECTIONS).map((section) => {
		const bytes = Buffer.byteLength(section.text);
		const text = boundedText(section.text, remaining);
		remaining -= Buffer.byteLength(text);
		return {
			name: section.name,
			text,
			bytes,
			truncated: Buffer.byteLength(text) < bytes
		};
	});
	return {
		seq: event.seq,
		sections: captured,
		totalBytes: sections.reduce((sum, section) => sum + Buffer.byteLength(section.text), 0),
		capturedAt: event.time
	};
}
/** Bounded recent-change index; complete history remains in the Conversation log. */
const changeIndexSchema = z.array(z.object({
	seq: z.number().int().nonnegative(),
	turn: z.number().int().positive()
})).max(64);
/**
* Retain the latest announcement for each of the latest 64 turns.
* @param state - previous bounded index.
* @param event - next committed Session event.
* @returns updated index only for a workspace change announcement.
*/
function foldChangeIndex(state, event) {
	return event.type !== "workspace/changes" ? state : [...state.filter((value) => value.turn !== event.data.turn), {
		seq: event.seq,
		turn: event.data.turn
	}].slice(-64);
}
//#endregion
export { foldChangeIndex as a, emptyContext as i, changeIndexSchema as n, foldContext as o, contextSchema as r, boundedText as t };
