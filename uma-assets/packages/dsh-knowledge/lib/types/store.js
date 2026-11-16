import { mkdir, open } from 'node:fs/promises';
import { join, dirname, basename, parse } from 'node:path';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { brandString } from '@deepseek-ai/dsh-brand';
import { writeFileAtomic } from '@deepseek-ai/dsh-atomic-write';
import { storedBaseSchema, baseIdSchema, documentIdSchema, sourceIdSchema, teamIdSchema } from "./schema.js";
import { readKnowledgeFile } from "./files.js";
import { knowledgeHash, knowledgeTerms } from "./text.js";
/** Knowledge SQLite generation; existing generations are never reset implicitly. */
export const KNOWLEDGE_SCHEMA_VERSION = 2;
const bool = z.union([z.literal(0), z.literal(1)]).transform(value => value === 1);
const documentRow = z.object({
    id: documentIdSchema,
    base_id: baseIdSchema,
    name: z.string(),
    title: z.string(),
    source_path: z.string().nullable(),
    source_id: sourceIdSchema.nullable(),
    state: z.enum(['queued', 'processing', 'ready', 'error', 'missing']),
    enabled: bool,
    archived: bool,
    error: z.string().nullable(),
    active_revision: z.string().nullable(),
    pending_hash: z.string(),
    pending_path: z.string(),
    bytes: z.number(),
    source_version: z.string().nullable(),
    generation: z.number().int().positive(),
    updated_at: z.string(),
    chunk_count: z.number(),
});
const sourceRow = z.object({
    id: sourceIdSchema,
    base_id: baseIdSchema,
    path: z.string(),
    kind: z.enum(['file', 'folder']),
    watch: bool,
    last_scan: z.string().nullable(),
    error: z.string().nullable(),
});
const revisionRow = z.object({
    id: z.string(),
    document_id: documentIdSchema,
    source_hash: z.string(),
    text_path: z.string(),
    original_path: z.string(),
    created_at: z.string(),
    chunk_count: z.number(),
    profile: z.string().nullable(),
});
const chunkRow = z.object({
    id: z.string(),
    document_id: documentIdSchema,
    base_id: baseIdSchema,
    revision: z.string(),
    parent_id: z.string(),
    heading: z.string(),
    text: z.string(),
    parent_text: z.string(),
    page: z.number().nullable(),
    start_line: z.number(),
    end_line: z.number(),
    vector: z.string().nullable(),
    profile: z.string().nullable(),
});
/** One installation's catalog. A second live Host cannot consume the same parsing queue. */
export class KnowledgeStore {
    root;
    config;
    /** SQLite connection; the owning service joins outstanding work before closing it. */
    db;
    lease = randomUUID();
    closed = false;
    trusted = true;
    objectTail = Promise.resolve();
    constructor(root, config, database) {
        this.root = root;
        this.config = config;
        this.db = database;
        try {
            this.db.exec(`PRAGMA busy_timeout=${config.busyTimeoutMs}; PRAGMA foreign_keys=ON; PRAGMA synchronous=FULL;`);
            const version = z
                .object({ user_version: z.number() })
                .parse(this.db.prepare('PRAGMA user_version').get()).user_version;
            if (version !== 0 && version !== 1 && version !== KNOWLEDGE_SCHEMA_VERSION)
                throw new Error('unsupported-knowledge-schema');
            const existing = z
                .object({ total: z.number() })
                .parse(this.db.prepare("SELECT count(*) total FROM sqlite_schema WHERE name NOT LIKE 'sqlite_%'").get());
            if (version === 0 && existing.total !== 0)
                throw new Error('unsupported-knowledge-schema');
            this.db.exec(`
        CREATE TABLE IF NOT EXISTS objects (path TEXT PRIMARY KEY, bytes INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS lease (id INTEGER PRIMARY KEY CHECK(id=1), pid INTEGER NOT NULL, token TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS teams (id TEXT PRIMARY KEY, name TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS bases (id TEXT PRIMARY KEY, record TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS bindings (base_id TEXT NOT NULL REFERENCES bases(id), workspace_id TEXT NOT NULL,
          PRIMARY KEY(base_id,workspace_id));
        CREATE TABLE IF NOT EXISTS sources (id TEXT PRIMARY KEY, base_id TEXT NOT NULL REFERENCES bases(id), path TEXT NOT NULL,
          kind TEXT NOT NULL, watch INTEGER NOT NULL, last_scan TEXT, error TEXT, UNIQUE(base_id,path));
        CREATE TABLE IF NOT EXISTS documents (id TEXT PRIMARY KEY, base_id TEXT NOT NULL REFERENCES bases(id), name TEXT NOT NULL, source_key TEXT NOT NULL,
          title TEXT NOT NULL, source_path TEXT, source_id TEXT REFERENCES sources(id), state TEXT NOT NULL,
          enabled INTEGER NOT NULL, archived INTEGER NOT NULL, error TEXT, active_revision TEXT,
          pending_hash TEXT NOT NULL, pending_path TEXT NOT NULL, bytes INTEGER NOT NULL, updated_at TEXT NOT NULL,
          chunk_count INTEGER NOT NULL DEFAULT 0, source_version TEXT, generation INTEGER NOT NULL DEFAULT 1, UNIQUE(base_id,source_key));
        CREATE INDEX IF NOT EXISTS documents_base ON documents(base_id,state,archived);
        CREATE TABLE IF NOT EXISTS revisions (id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES documents(id),
          source_hash TEXT NOT NULL, text_path TEXT NOT NULL, original_path TEXT NOT NULL, created_at TEXT NOT NULL,
          chunk_count INTEGER NOT NULL, profile TEXT);
        CREATE TABLE IF NOT EXISTS chunks (id TEXT PRIMARY KEY, document_id TEXT NOT NULL REFERENCES documents(id), base_id TEXT NOT NULL,
          revision TEXT NOT NULL REFERENCES revisions(id), parent_id TEXT NOT NULL, heading TEXT NOT NULL, text TEXT NOT NULL,
          parent_text TEXT NOT NULL, page INTEGER, start_line INTEGER NOT NULL, end_line INTEGER NOT NULL, vector TEXT, profile TEXT);
        CREATE INDEX IF NOT EXISTS chunks_revision ON chunks(document_id,revision);
        CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(chunk_id UNINDEXED, document_id UNINDEXED, text);
      `);
            const pages = Math.floor(config.maxIndexBytes / 4096);
            this.db.exec(`PRAGMA max_page_count=${pages}`);
            this.transaction(() => {
                const previous = this.db.prepare('SELECT pid FROM lease WHERE id=1').get();
                if (previous !== undefined) {
                    const pid = z.object({ pid: z.number().int().positive() }).parse(previous).pid;
                    try {
                        process.kill(pid, 0);
                        throw new Error('knowledge-home-in-use');
                    }
                    catch (error) {
                        if (!(error instanceof Error && 'code' in error && error.code === 'ESRCH'))
                            throw error;
                    }
                }
                this.db.prepare('INSERT OR REPLACE INTO lease VALUES(1,?,?)').run(process.pid, this.lease);
                this.db.exec(`
        CREATE TABLE IF NOT EXISTS experiences (id TEXT PRIMARY KEY,base_id TEXT NOT NULL REFERENCES bases(id),state TEXT NOT NULL,updated_at TEXT NOT NULL,record TEXT NOT NULL);
        CREATE INDEX IF NOT EXISTS experiences_base ON experiences(base_id,state);
        CREATE TABLE IF NOT EXISTS experience_capture_targets (base_id TEXT PRIMARY KEY REFERENCES bases(id),enabled INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS experience_captures (base_id TEXT NOT NULL REFERENCES bases(id),source_key TEXT NOT NULL,experience_id TEXT NOT NULL,PRIMARY KEY(base_id,source_key));
        CREATE TABLE IF NOT EXISTS experience_versions (experience_id TEXT NOT NULL,revision INTEGER NOT NULL,record TEXT NOT NULL,PRIMARY KEY(experience_id,revision));
        CREATE VIRTUAL TABLE IF NOT EXISTS experience_fts USING fts5(experience_id UNINDEXED,text);
        PRAGMA user_version=${KNOWLEDGE_SCHEMA_VERSION};
        `);
                this.db.exec("UPDATE documents SET state='queued' WHERE state='processing'");
            });
        }
        catch (error) {
            this.db.close();
            throw error;
        }
    }
    /**
     * Open a private catalog and recover interrupted jobs.
     * @param root - absolute knowledge directory below the resolved Harness home.
     * @param config - resource bounds.
     * @returns an exclusive live Host owner.
     */
    static async open(root, config) {
        await mkdir(root, { recursive: true, mode: 0o700 });
        const { DatabaseSync } = await import('node:sqlite');
        return new KnowledgeStore(root, config, new DatabaseSync(join(root, 'knowledge.sqlite')));
    }
    /** Release the queue lease only after the service has joined all readers and parsing jobs. */
    close() {
        if (this.closed)
            return;
        try {
            if (this.trusted)
                this.db.prepare('DELETE FROM lease WHERE token=?').run(this.lease);
        }
        finally {
            this.closed = true;
            this.db.close();
        }
    }
    /**
     * Commit one synchronous mutation or restore its complete previous state.
     * @param action - SQL mutations, without awaits.
     * @returns the mutation result after commit.
     */
    transaction(action) {
        if (!this.trusted)
            throw new Error('knowledge-storage-untrusted');
        this.db.exec('BEGIN IMMEDIATE');
        try {
            const value = action();
            this.db.exec('COMMIT');
            return value;
        }
        catch (error) {
            try {
                this.db.exec('ROLLBACK');
            }
            catch (rollbackError) {
                this.trusted = false;
                throw new AggregateError([error, rollbackError], 'knowledge-storage-untrusted');
            }
            throw error;
        }
    }
    /** Whether new reads/writes still have a known storage outcome. */
    get healthy() {
        return this.trusted && !this.closed;
    }
    /**
     * Retain content under its digest before any index points to it.
     * @param bytes - original or parsed file bytes.
     * @param extension - supported normalized extension, never a filename.
     * @returns the absolute immutable file path.
     */
    object(bytes, extension) {
        const operation = this.objectTail.then(() => this.putObject(bytes, extension));
        this.objectTail = operation.then(() => undefined, () => undefined);
        return operation;
    }
    /**
     * Retain a human-readable immutable citation without changing older source paths.
     * @param bytes - complete extracted Markdown.
     * @param name - original display filename, sanitized into one path segment.
     * @returns the exact parsed Markdown path used by answer citations.
     */
    citation(bytes, name) {
        const title = parse(basename(name))
            .name.replace(/[^\p{L}\p{N}_. -]/gu, '')
            .slice(0, 100) || 'document';
        const path = join(this.root, 'citations', knowledgeHash(bytes), `${title}.md`);
        const operation = this.objectTail.then(() => this.putStored(bytes, path));
        this.objectTail = operation.then(() => undefined, () => undefined);
        return operation;
    }
    async putObject(bytes, extension) {
        if (!/^[a-z0-9]{1,8}$/u.test(extension))
            throw new Error('invalid-object-extension');
        const digest = knowledgeHash(bytes);
        const path = join(this.root, 'objects', `${digest}.${extension}`);
        return this.putStored(bytes, path);
    }
    async putStored(bytes, path) {
        const digest = knowledgeHash(bytes);
        this.transaction(() => {
            if (this.db.prepare('SELECT path FROM objects WHERE path=?').get(path) !== undefined)
                return;
            const total = z
                .object({ bytes: z.number() })
                .parse(this.db.prepare('SELECT coalesce(sum(bytes),0) bytes FROM objects').get()).bytes;
            if (total + bytes.byteLength > this.config.maxStoredBytes)
                throw new Error('knowledge-storage-full');
            this.db.prepare('INSERT INTO objects VALUES(?,?)').run(path, bytes.byteLength);
        });
        try {
            const current = await readKnowledgeFile(path, Math.max(this.config.maxFileBytes, this.config.maxTextBytes), new AbortController().signal);
            if (knowledgeHash(current) !== digest)
                throw new Error('knowledge-object-modified');
            return path;
        }
        catch (error) {
            if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT'))
                throw error;
        }
        await writeFileAtomic(path, bytes, { mode: 0o600, dirMode: 0o700 });
        const handle = await open(path, 'r');
        try {
            await handle.sync();
        }
        finally {
            await handle.close();
        }
        if (process.platform !== 'win32') {
            const parent = await open(dirname(path), 'r');
            try {
                await parent.sync();
            }
            finally {
                await parent.close();
            }
        }
        return path;
    }
    /**
     * Read local organizational groups.
     * @returns the groups in display-name order.
     */
    teams() {
        return this.db
            .prepare('SELECT * FROM teams ORDER BY name')
            .all()
            .map((value) => {
            const row = z.object({ id: teamIdSchema, name: z.string(), created_at: z.string() }).parse(value);
            return { id: row.id, name: row.name, createdAt: row.created_at };
        });
    }
    /**
     * Read collection settings and current indexing counts.
     * @returns validated collections and document counts.
     */
    bases() {
        return this.db
            .prepare('SELECT record FROM bases ORDER BY id')
            .all()
            .map((value) => {
            const base = storedBaseSchema.parse(JSON.parse(z.object({ record: z.string() }).parse(value).record));
            const counts = z
                .object({ total: z.number(), ready: z.number() })
                .parse(this.db
                .prepare("SELECT count(*) total, coalesce(sum(state='ready' AND enabled=1),0) ready FROM documents WHERE base_id=? AND archived=0")
                .get(base.id));
            return { ...base, documentCount: counts.total, readyCount: counts.ready };
        });
    }
    /**
     * Create or replace collection metadata and retrieval bindings atomically.
     * @param id - server-minted or existing collection identity.
     * @param input - validated complete fields.
     * @returns the current collection.
     */
    saveBase(id, input) {
        const previous = this.bases().find(base => base.id === id);
        const now = new Date().toISOString();
        const record = {
            ...input,
            id,
            archived: previous?.archived ?? false,
            createdAt: previous?.createdAt ?? now,
            updatedAt: now,
        };
        this.transaction(() => {
            this.db
                .prepare('INSERT INTO bases(id,record) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET record=excluded.record')
                .run(id, JSON.stringify(record));
            this.db.prepare('DELETE FROM bindings WHERE base_id=?').run(id);
            for (const workspace of input.workspaceIds)
                this.db.prepare('INSERT INTO bindings VALUES(?,?)').run(id, workspace);
            if (previous !== undefined && previous.mode !== input.mode)
                this.db
                    .prepare("UPDATE documents SET state='queued', error=NULL,generation=generation+1 WHERE base_id=? AND archived=0")
                    .run(id);
        });
        return {
            ...record,
            documentCount: previous?.documentCount ?? 0,
            readyCount: previous === undefined || previous.mode !== input.mode ? 0 : previous.readyCount,
        };
    }
    /**
     * Return one document's current state.
     * @param id - validated document identity.
     * @returns its current row, or undefined if absent.
     */
    job(id) {
        const value = this.db.prepare('SELECT * FROM documents WHERE id=?').get(id);
        return value === undefined ? undefined : documentRow.parse(value);
    }
    /**
     * List documents, including archived rows only when requested.
     * @param baseId - owning collection.
     * @param archived - whether archived rows are included.
     * @returns document metadata, newest first.
     */
    documents(baseId, archived = false) {
        return this.db
            .prepare(`SELECT * FROM documents WHERE base_id=? ${archived ? '' : 'AND archived=0'} ORDER BY name`)
            .all(baseId)
            .map(value => this.viewDocument(documentRow.parse(value)));
    }
    /**
     * Read source jobs without rebuilding their display metadata for every file.
     * @param sourceId - explicitly imported local source.
     * @returns all current source jobs, including archived documents.
     */
    sourceJobs(sourceId) {
        return this.db
            .prepare('SELECT * FROM documents WHERE source_id=?')
            .all(sourceId)
            .map(value => documentRow.parse(value));
    }
    /**
     * Project a database row without exposing pending object paths.
     * @param row - validated document row.
     * @returns browser-safe document metadata.
     */
    viewDocument(row) {
        return {
            id: row.id,
            baseId: row.base_id,
            name: row.name,
            title: row.title,
            sourcePath: row.source_path,
            sourceId: row.source_id,
            state: row.state,
            enabled: row.enabled,
            archived: row.archived,
            error: row.error,
            revision: row.active_revision,
            chunkCount: row.chunk_count,
            bytes: row.bytes,
            updatedAt: row.updated_at,
        };
    }
    /**
     * Admit a new document or a replacement revision, preserving historical publications.
     * @param input - validated source identity and already-retained original bytes.
     * @returns the stable document id and whether indexing is required.
     */
    admit(input) {
        return input.ifAbsent === true ? this.transaction(() => this.admitDocument(input)) : this.admitDocument(input);
    }
    admitDocument(input) {
        const sourceKey = `${input.sourceId ?? 'upload'}/${input.name}`;
        const found = input.ifAbsent === true
            ? this.db.prepare('SELECT * FROM documents WHERE base_id=? AND name=? LIMIT 1').get(input.baseId, input.name)
            : this.db.prepare('SELECT * FROM documents WHERE base_id=? AND source_key=?').get(input.baseId, sourceKey);
        const previous = found === undefined ? undefined : documentRow.parse(found);
        if (input.ifAbsent === true && previous !== undefined)
            return { id: previous.id, changed: false };
        if (previous?.pending_hash === input.hash &&
            ['ready', 'queued', 'processing'].includes(previous.state) &&
            !previous.archived) {
            this.db.prepare('UPDATE documents SET source_version=? WHERE id=?').run(input.sourceVersion, previous.id);
            return { id: previous.id, changed: false };
        }
        if (previous === undefined && this.documents(input.baseId, true).length >= this.config.maxDocuments)
            throw new Error('too-many-documents');
        if (previous?.archived === true)
            throw new Error('document-archived');
        const id = previous?.id ?? brandString(randomUUID());
        this.db
            .prepare(`INSERT INTO documents(id,base_id,name,source_key,title,source_path,source_id,state,enabled,archived,error,
      active_revision,pending_hash,pending_path,bytes,updated_at,chunk_count,source_version) VALUES(?,?,?,?,?,?,?,'queued',1,0,NULL,NULL,?,?,?,?,0,?)
      ON CONFLICT(id) DO UPDATE SET source_path=excluded.source_path,source_id=excluded.source_id,state='queued',
      error=NULL,pending_hash=excluded.pending_hash,pending_path=excluded.pending_path,bytes=excluded.bytes,updated_at=excluded.updated_at,source_version=excluded.source_version,generation=generation+1`)
            .run(id, input.baseId, input.name, sourceKey, input.name, input.sourcePath, input.sourceId, input.hash, input.path, input.bytes, new Date().toISOString(), input.sourceVersion);
        return { id, changed: true };
    }
    /**
     * Claim one queued document. Only one Host owns this store.
     * @param excluded - document jobs still releasing their previous parsing resources.
     * @returns the admitted job, or undefined when no job remains.
     */
    nextJob(excluded) {
        return this.transaction(() => {
            const row = this.db
                .prepare(`SELECT d.* FROM documents d JOIN bases b ON b.id=d.base_id WHERE d.state='queued' AND d.archived=0
        AND json_extract(b.record,'$.archived')=0
        ${excluded.length === 0 ? '' : `AND d.id NOT IN (${excluded.map(() => '?').join(',')})`} ORDER BY d.updated_at LIMIT 1`)
                .get(...excluded);
            if (row === undefined)
                return undefined;
            const value = documentRow.parse(row);
            this.db.prepare("UPDATE documents SET state='processing' WHERE id=?").run(value.id);
            return value;
        });
    }
    /**
     * Atomically publish a complete parsed revision and its search index.
     * @param job - claimed source version; a superseded job cannot publish.
     * @param revision - immutable file identities.
     * @param chunks - complete parsed windows.
     * @param vectors - matching provider vectors, or null for lexical indexing.
     * @param profile - embedding profile fingerprint, or null.
     * @returns whether this job was still current and was published.
     */
    publish(job, revision, chunks, vectors, profile) {
        return this.transaction(() => {
            const current = this.job(job.id);
            if (current?.generation !== job.generation ||
                current.pending_hash !== job.pending_hash ||
                current.state !== 'processing' ||
                current.archived)
                return false;
            this.db
                .prepare('INSERT OR IGNORE INTO revisions VALUES(?,?,?,?,?,?,?,?)')
                .run(revision.id, job.id, job.pending_hash, revision.textPath, revision.originalPath, revision.createdAt, chunks.length, profile);
            this.db.prepare('DELETE FROM knowledge_fts WHERE document_id=?').run(job.id);
            const putChunk = this.db.prepare('INSERT OR REPLACE INTO chunks VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)');
            const putSearch = this.db.prepare('INSERT INTO knowledge_fts VALUES(?,?,?)');
            for (const [index, chunk] of chunks.entries()) {
                const id = `${revision.id}/${chunk.id}`;
                putChunk.run(id, job.id, job.base_id, revision.id, chunk.parentId, chunk.heading, chunk.text, chunk.parentText, chunk.page, chunk.startLine, chunk.endLine, vectors === null ? null : JSON.stringify(vectors[index]), profile);
                putSearch.run(id, job.id, knowledgeTerms(`${job.title}\n${chunk.heading}\n${chunk.text}`).join(' '));
            }
            this.db
                .prepare("UPDATE documents SET state='ready',error=NULL,active_revision=?,chunk_count=?,updated_at=? WHERE id=?")
                .run(revision.id, chunks.length, new Date().toISOString(), job.id);
            return true;
        });
    }
    /**
     * List local synchronization sources for one collection or all watched sources.
     * @param baseId - optional collection filter.
     * @returns validated source records.
     */
    sources(baseId) {
        const rows = baseId === undefined
            ? this.db.prepare('SELECT * FROM sources WHERE watch=1').all()
            : this.db.prepare('SELECT * FROM sources WHERE base_id=?').all(baseId);
        return rows.map((value) => {
            const row = sourceRow.parse(value);
            return {
                id: row.id,
                baseId: row.base_id,
                path: row.path,
                kind: row.kind,
                watch: row.watch,
                lastScan: row.last_scan,
                error: row.error,
            };
        });
    }
    /**
     * Read retained revisions, newest first.
     * @param documentId - owning document.
     * @returns at most the latest fifty revision records.
     */
    revisions(documentId) {
        return this.db
            .prepare('SELECT * FROM revisions WHERE document_id=? ORDER BY created_at DESC LIMIT ?')
            .all(documentId, this.config.revisionListLimit)
            .map((value) => {
            const row = revisionRow.parse(value);
            return {
                id: row.id,
                documentId: row.document_id,
                sourceHash: row.source_hash,
                textPath: row.text_path,
                originalPath: row.original_path,
                createdAt: row.created_at,
                chunkCount: row.chunk_count,
            };
        });
    }
    /**
     * Decode indexed child rows at the durable-data read point.
     * @param values - SQLite rows selected by the caller's authorized query.
     * @returns validated vectors and passage text.
     */
    chunks(values) {
        return values.map((value) => {
            const row = chunkRow.parse(value);
            return {
                id: row.id,
                documentId: row.document_id,
                baseId: row.base_id,
                revision: row.revision,
                parentId: row.parent_id,
                heading: row.heading,
                text: row.text,
                parentText: row.parent_text,
                page: row.page,
                startLine: row.start_line,
                endLine: row.end_line,
                vector: row.vector === null ? null : z.array(z.number()).min(1).parse(JSON.parse(row.vector)),
                profile: row.profile,
            };
        });
    }
}
//# sourceMappingURL=store.js.map