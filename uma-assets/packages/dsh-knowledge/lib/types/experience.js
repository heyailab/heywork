/** Versioned development experience; authored review is distinct from executable verification. */
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { brandString } from '@deepseek-ai/dsh-brand';
import { baseIdSchema } from "./schema.js";
import { knowledgeFtsQuery, knowledgeTerms } from "./text.js";
/** Validate an experience identity received through management APIs. */
export const experienceIdSchema = z.uuid().transform(value => brandString(value));
/** Validate authored content; referenced IDs are claims until their owning service checks them. */
export const experienceInputSchema = z.object({
    title: z.string().trim().min(1).max(160),
    symptom: z.string().trim().min(1),
    cause: z.string().trim().nullable(),
    solution: z.string().trim(),
    applicability: z.string().trim(),
    exclusions: z.string().trim(),
    technologies: z.array(z.string().trim().min(1).max(80)).max(64),
    references: z.array(z.object({ kind: z.enum(['session', 'check', 'review', 'source']), id: z.string().trim().min(1).max(2048) }).strict()).max(128),
}).strict();
const recordSchema = experienceInputSchema.extend({
    id: experienceIdSchema, baseId: baseIdSchema, revision: z.number().int().positive(),
    state: z.enum(['candidate', 'reviewed', 'withdrawn', 'superseded']),
    review: z.string(), supersededBy: experienceIdSchema.nullable(),
    createdAt: z.iso.datetime(), updatedAt: z.iso.datetime(),
});
/**
 * Add or revise one experience with optimistic concurrency and immutable prior revisions.
 * Editing reviewed content always resets it to candidate; no authored text certifies a code check.
 * @param store - healthy installation-owned knowledge catalog.
 * @param request - selected collection, expected version and complete authored content.
 * @returns committed current revision.
 */
export function saveExperience(store, request) {
    const baseId = baseIdSchema.parse(request.baseId);
    const content = experienceInputSchema.parse(request.content);
    checkSize(store, content);
    return store.transaction(() => {
        const base = store.bases().find(value => value.id === baseId);
        if (base === undefined || base.archived)
            throw new Error('experience-base-unavailable');
        const previous = request.id === null ? undefined : readExperience(store, request.id);
        if (request.id !== null && (previous === undefined || previous.baseId !== baseId))
            throw new Error('experience-not-found');
        if ((previous?.revision ?? null) !== request.expectedRevision)
            throw new Error('experience-version-conflict');
        if (previous === undefined) {
            const count = store.db.prepare('SELECT count(*) count FROM experiences WHERE base_id=?').get(baseId);
            if (z.object({ count: z.number() }).parse(count).count >= store.config.maxDocuments)
                throw new Error('too-many-documents');
        }
        const now = new Date().toISOString();
        const record = { ...content, id: previous?.id ?? brandString(randomUUID()),
            baseId, revision: (previous?.revision ?? 0) + 1, state: 'candidate', review: '', supersededBy: null,
            createdAt: previous?.createdAt ?? now, updatedAt: now };
        persist(store, record);
        return record;
    });
}
/**
 * Read a current experience without guessing whether a missing record was deleted.
 * @param store - healthy knowledge catalog.
 * @param id - explicit record identity.
 * @returns current content, or undefined when absent.
 */
export function readExperience(store, id) {
    const row = store.db.prepare('SELECT record FROM experiences WHERE id=?').get(experienceIdSchema.parse(id));
    return row === undefined ? undefined : recordSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(row).record));
}
/**
 * Change lifecycle state only against the revision the operator actually reviewed.
 * @param store - healthy knowledge catalog.
 * @param request - expected revision, next state, review explanation and optional replacement.
 * @returns committed state revision; review is human judgment, not executable verification.
 */
export function transitionExperience(store, request) {
    const input = z.object({ id: experienceIdSchema, expectedRevision: z.number().int().positive(),
        state: z.enum(['candidate', 'reviewed', 'withdrawn', 'superseded']), review: z.string().trim(), supersededBy: experienceIdSchema.nullable() }).strict().parse(request);
    checkSize(store, input);
    return store.transaction(() => {
        const previous = readExperience(store, input.id);
        if (previous === undefined)
            throw new Error('experience-not-found');
        if (previous.revision !== input.expectedRevision)
            throw new Error('experience-version-conflict');
        if (!store.bases().some(base => base.id === previous.baseId && !base.archived))
            throw new Error('experience-base-unavailable');
        if (input.state === 'reviewed' && (input.review === '' || previous.solution === '' || previous.applicability === '' || previous.references.length === 0))
            throw new Error('experience-review-incomplete');
        if (input.state === 'superseded') {
            const replacement = input.supersededBy === null ? undefined : readExperience(store, input.supersededBy);
            if (replacement === undefined || replacement.id === previous.id || replacement.baseId !== previous.baseId || replacement.state !== 'reviewed')
                throw new Error('experience-replacement-invalid');
        }
        else if (input.supersededBy !== null)
            throw new Error('experience-replacement-invalid');
        const record = { ...previous, revision: previous.revision + 1, state: input.state,
            review: input.state === 'candidate' ? '' : input.review, supersededBy: input.supersededBy, updatedAt: new Date().toISOString() };
        persist(store, record);
        return record;
    });
}
/**
 * List current records in one collection with explicit paging and optional text/state filters.
 * @param store - healthy knowledge catalog.
 * @param request - scope and validated query controls.
 * @returns matching current records and total, excluding other collections.
 */
export function listExperiences(store, request) {
    const input = z.object({ baseId: baseIdSchema, query: z.string(), state: z.enum(['all', 'candidate', 'reviewed', 'withdrawn', 'superseded']),
        offset: z.number().int().nonnegative(), limit: z.number().int().positive() }).strict().parse(request);
    checkSize(store, input.query);
    const query = knowledgeFtsQuery(input.query);
    const where = 'base_id=?' + (input.state === 'all' ? '' : ' AND state=?')
        + (query === null ? '' : ' AND id IN (SELECT experience_id FROM experience_fts WHERE experience_fts MATCH ?)');
    const params = [input.baseId, ...input.state === 'all' ? [] : [input.state], ...query === null ? [] : [query]];
    const total = z.object({ total: z.number() }).parse(store.db.prepare(`SELECT count(*) total FROM experiences WHERE ${where}`).get(...params)).total;
    const items = store.db.prepare(`SELECT record FROM experiences WHERE ${where} ORDER BY updated_at DESC,id LIMIT ? OFFSET ?`)
        .all(...params, Math.min(input.limit, store.config.candidateLimit), input.offset)
        .map(row => recordSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(row).record)));
    return { items, total };
}
/**
 * Delete experience content and its index only after an exact-version check.
 * Committed Session citations are independently retained by their Session owner.
 * @param store - healthy knowledge catalog.
 * @param id - selected experience.
 * @param expectedRevision - last observed content revision.
 */
export function deleteExperience(store, id, expectedRevision) {
    z.number().int().positive().parse(expectedRevision);
    store.transaction(() => {
        const previous = readExperience(store, id);
        if (previous === undefined)
            throw new Error('experience-not-found');
        if (previous.revision !== expectedRevision)
            throw new Error('experience-version-conflict');
        store.db.prepare('DELETE FROM experience_fts WHERE experience_id=?').run(id);
        store.db.prepare('DELETE FROM experience_versions WHERE experience_id=?').run(id);
        store.db.prepare('DELETE FROM experiences WHERE id=?').run(id);
    });
}
function checkSize(store, value) {
    if (Buffer.byteLength(JSON.stringify(value)) > store.config.maxTextBytes)
        throw new Error('text-too-large');
}
function persist(store, record) {
    const text = JSON.stringify(recordSchema.parse(record));
    checkSize(store, record);
    store.db.prepare('INSERT INTO experience_versions(experience_id,revision,record) VALUES(?,?,?)').run(record.id, record.revision, text);
    store.db.prepare(`INSERT INTO experiences(id,base_id,state,updated_at,record) VALUES(?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET state=excluded.state,updated_at=excluded.updated_at,record=excluded.record`)
        .run(record.id, record.baseId, record.state, record.updatedAt, text);
    store.db.prepare('DELETE FROM experience_fts WHERE experience_id=?').run(record.id);
    store.db.prepare('INSERT INTO experience_fts(experience_id,text) VALUES(?,?)')
        .run(record.id, knowledgeTerms([record.title, record.symptom, record.cause, record.solution, record.applicability, record.exclusions, ...record.technologies].join('\n')).join(' '));
}
/**
 * Capture one source-backed candidate at most once, including after its content is deleted.
 * @param store - healthy knowledge catalog.
 * @param baseId - explicitly enabled project capture target.
 * @param sourceKey - stable identity of the retained repair evidence.
 * @param content - redacted historical facts; cause and solution remain unknown until authored.
 * @param options - Installation-owned capture bypasses per-project opt-in.
 * @returns newly captured record, or null when already captured or capture is disabled.
 */
export function captureExperience(store, baseId, sourceKey, content, options) {
    baseIdSchema.parse(baseId);
    z.string().min(1).max(512).parse(sourceKey);
    const parsed = experienceInputSchema.parse(content);
    checkSize(store, parsed);
    return store.transaction(() => {
        const enabled = store.db.prepare('SELECT enabled FROM experience_capture_targets WHERE base_id=?').get(baseId);
        const base = store.bases().find(item => item.id === baseId);
        if (base === undefined || base.archived || !base.enabled)
            return null;
        if (options?.installationWide !== true && (enabled?.enabled !== 1 || base.kind !== 'project'))
            return null;
        if (store.db.prepare('SELECT 1 FROM experience_captures WHERE base_id=? AND source_key=?').get(baseId, sourceKey) !== undefined)
            return null;
        const count = z.object({ count: z.number() }).parse(store.db.prepare('SELECT count(*) count FROM experiences WHERE base_id=?').get(baseId)).count;
        if (count >= store.config.maxDocuments)
            throw new Error('too-many-documents');
        const now = new Date().toISOString();
        const record = { ...parsed, id: brandString(randomUUID()), baseId,
            revision: 1, state: 'candidate', review: '', supersededBy: null, createdAt: now, updatedAt: now };
        persist(store, record);
        store.db.prepare('INSERT INTO experience_captures VALUES(?,?,?)').run(baseId, sourceKey, record.id);
        return record;
    });
}
/**
 * Read retained content revisions without replacing their immutable records.
 * @param store - healthy knowledge catalog.
 * @param request - existing experience and page window.
 * @returns newest-first revisions and total count.
 */
export function experienceHistory(store, request) {
    const input = z.object({ id: experienceIdSchema, offset: z.number().int().nonnegative(),
        limit: z.number().int().positive() }).strict().parse(request);
    if (readExperience(store, input.id) === undefined)
        throw new Error('experience-not-found');
    const total = z.object({ total: z.number() }).parse(store.db.prepare('SELECT count(*) total FROM experience_versions WHERE experience_id=?').get(input.id)).total;
    const items = store.db.prepare('SELECT record FROM experience_versions WHERE experience_id=? ORDER BY revision DESC LIMIT ? OFFSET ?')
        .all(input.id, Math.min(input.limit, store.config.revisionListLimit), input.offset)
        .map(row => recordSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(row).record)));
    return { items, total };
}
//# sourceMappingURL=experience.js.map