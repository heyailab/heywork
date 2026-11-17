import { z } from 'zod';
import { wikiGenerationOptionsSchema, } from '@deepseek-ai/dsh-util-repo-wiki';
import { WikiError } from "./errors.js";
/** Bounded latest user-authored generation controls for checkpoint recovery. */
export const wikiTaskStateSchema = z.object({
    record: z.string().max(16384).nullable(),
});
/**
 * Retain only the latest explicit user control record; unrelated events preserve state identity.
 * @param state - latest logged controls.
 * @param event - newly committed event.
 * @returns recoverable latest control record.
 */
export function foldWikiTaskSettings(state, event) {
    if (event.type !== 'user/message' || event.data.source.kind !== 'user')
        return state;
    const text = event.data.content
        .flatMap(part => (part.type === 'text' ? [part.text] : []))
        .join('\n');
    const record = /^HEY_WIKI_SETTINGS_JSON:(\{[^\r\n]*\})$/mu.exec(text)?.[1];
    return record === undefined
        ? state
        : { record: record.length > 16384 ? 'INVALID_OVERSIZED_SETTINGS' : record };
}
/**
 * Read the most recent generation-control line authored by the client/user, never by tools or model output.
 * @param record - latest user-authored control record from the Session projection.
 * @returns explicit controls, or null for ordinary manually requested tool workflows.
 * @throws when an explicitly supplied control record is invalid.
 */
export function wikiTaskSettings(record) {
    if (record === null)
        return null;
    try {
        return wikiGenerationOptionsSchema.parse(JSON.parse(record));
    }
    catch (error) {
        throw new WikiError('wiki/invalid-data', 'The user generation controls are invalid; correct the task settings', { cause: error });
    }
}
//# sourceMappingURL=task-settings.js.map