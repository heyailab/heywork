var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
/** Desktop knowledge management, durable ingestion, retrieval and development-time evidence. @module */
import { Service } from '@deepseek-ai/cordis';
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths';
import { brandString } from '@deepseek-ai/dsh-brand';
import { randomUUID } from 'node:crypto';
import { lstat, realpath, readdir } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, sep } from 'node:path';
import { z } from 'zod';
import { Config } from "./config.js";
import { saveExperience, listExperiences, transitionExperience, deleteExperience, captureExperience, experienceHistory } from "./experience.js";
import { KnowledgeStore } from "./store.js";
import { KnowledgeEmbeddings } from "./embedding.js";
import { extractKnowledge, knowledgeExtension } from "./extract.js";
import { readKnowledgeFile } from "./files.js";
import { knowledgeChunks, knowledgeCosine, knowledgeFtsQuery, knowledgeFusion, knowledgeHash, knowledgeTerms, } from "./text.js";
import { baseIdSchema, baseInputSchema, documentNameSchema, nameSchema } from "./schema.js";
function fail(reason) {
    return new RemoteError('knowledge/failed', 'The knowledge operation could not be completed', { reason });
}
const ERROR_REASONS = new Set([
    'experience-base-unavailable', 'experience-not-found', 'experience-version-conflict',
    'experience-review-incomplete', 'experience-replacement-invalid',
    'file-too-large',
    'source-changed',
    'unsupported-format',
    'text-too-large',
    'too-many-pages',
    'ocr-required',
    'empty-or-binary-text',
    'pdf-extraction-failed',
    'pdf-worker-failed',
    'parse-timeout',
    'too-many-chunks',
    'embedding-provider-failed',
    'embedding-credential-missing',
    'embedding-not-configured',
    'embedding-response-too-large',
    'embedding-dimensions-changed',
    'knowledge-object-modified',
    'knowledge-storage-full',
    'not-a-regular-file',
    'document-archived',
    'too-many-documents',
]);
function reasonOf(error) {
    return error instanceof Error && ERROR_REASONS.has(error.message) ? error.message : 'processing-failed';
}
function fileVersion(value) {
    return `${value.dev}:${value.ino}:${value.size}:${value.mtimeMs}:${value.ctimeMs}`;
}
const globalExperienceId = brandString('8c6e4d00-5c74-482b-bbf0-0c93576e046e');
/** Source ingestion and retrieval share one durable installation-owned catalog. */
let KnowledgeService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _catalog_decorators;
    let _createTeam_decorators;
    let _createBase_decorators;
    let _updateBase_decorators;
    let _archiveBase_decorators;
    let _detail_decorators;
    let _upload_decorators;
    let _note_decorators;
    let _createNoteIfAbsent_decorators;
    let _importLocal_decorators;
    let _watchSource_decorators;
    let _syncSource_decorators;
    let _updateDocument_decorators;
    let _retryDocument_decorators;
    let _document_decorators;
    let _restoreRevision_decorators;
    let _original_decorators;
    let _search_decorators;
    let _experienceCapture_decorators;
    let _setExperienceCapture_decorators;
    let _listExperiences_decorators;
    let _experienceHistory_decorators;
    let _saveExperience_decorators;
    let _transitionExperience_decorators;
    let _deleteExperience_decorators;
    return class KnowledgeService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _catalog_decorators = [Remote('catalog')];
            _createTeam_decorators = [Remote('createTeam')];
            _createBase_decorators = [Remote('createBase')];
            _updateBase_decorators = [Remote('updateBase')];
            _archiveBase_decorators = [Remote('archiveBase')];
            _detail_decorators = [Remote('detail')];
            _upload_decorators = [Remote('upload')];
            _note_decorators = [Remote('note')];
            _createNoteIfAbsent_decorators = [Remote('createNoteIfAbsent')];
            _importLocal_decorators = [Remote('importLocal')];
            _watchSource_decorators = [Remote('watchSource')];
            _syncSource_decorators = [Remote('syncSource')];
            _updateDocument_decorators = [Remote('updateDocument')];
            _retryDocument_decorators = [Remote('retryDocument')];
            _document_decorators = [Remote('document')];
            _restoreRevision_decorators = [Remote('restoreRevision')];
            _original_decorators = [Remote('original')];
            _search_decorators = [Remote('search')];
            _experienceCapture_decorators = [Remote('experienceCapture')];
            _setExperienceCapture_decorators = [Remote('setExperienceCapture')];
            _listExperiences_decorators = [Remote('listExperiences')];
            _experienceHistory_decorators = [Remote('experienceHistory')];
            _saveExperience_decorators = [Remote('saveExperience')];
            _transitionExperience_decorators = [Remote('transitionExperience')];
            _deleteExperience_decorators = [Remote('deleteExperience')];
            __esDecorate(this, null, _catalog_decorators, { kind: "method", name: "catalog", static: false, private: false, access: { has: obj => "catalog" in obj, get: obj => obj.catalog }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createTeam_decorators, { kind: "method", name: "createTeam", static: false, private: false, access: { has: obj => "createTeam" in obj, get: obj => obj.createTeam }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createBase_decorators, { kind: "method", name: "createBase", static: false, private: false, access: { has: obj => "createBase" in obj, get: obj => obj.createBase }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateBase_decorators, { kind: "method", name: "updateBase", static: false, private: false, access: { has: obj => "updateBase" in obj, get: obj => obj.updateBase }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _archiveBase_decorators, { kind: "method", name: "archiveBase", static: false, private: false, access: { has: obj => "archiveBase" in obj, get: obj => obj.archiveBase }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _detail_decorators, { kind: "method", name: "detail", static: false, private: false, access: { has: obj => "detail" in obj, get: obj => obj.detail }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _upload_decorators, { kind: "method", name: "upload", static: false, private: false, access: { has: obj => "upload" in obj, get: obj => obj.upload }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _note_decorators, { kind: "method", name: "note", static: false, private: false, access: { has: obj => "note" in obj, get: obj => obj.note }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _createNoteIfAbsent_decorators, { kind: "method", name: "createNoteIfAbsent", static: false, private: false, access: { has: obj => "createNoteIfAbsent" in obj, get: obj => obj.createNoteIfAbsent }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _importLocal_decorators, { kind: "method", name: "importLocal", static: false, private: false, access: { has: obj => "importLocal" in obj, get: obj => obj.importLocal }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _watchSource_decorators, { kind: "method", name: "watchSource", static: false, private: false, access: { has: obj => "watchSource" in obj, get: obj => obj.watchSource }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _syncSource_decorators, { kind: "method", name: "syncSource", static: false, private: false, access: { has: obj => "syncSource" in obj, get: obj => obj.syncSource }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _updateDocument_decorators, { kind: "method", name: "updateDocument", static: false, private: false, access: { has: obj => "updateDocument" in obj, get: obj => obj.updateDocument }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _retryDocument_decorators, { kind: "method", name: "retryDocument", static: false, private: false, access: { has: obj => "retryDocument" in obj, get: obj => obj.retryDocument }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _document_decorators, { kind: "method", name: "document", static: false, private: false, access: { has: obj => "document" in obj, get: obj => obj.document }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _restoreRevision_decorators, { kind: "method", name: "restoreRevision", static: false, private: false, access: { has: obj => "restoreRevision" in obj, get: obj => obj.restoreRevision }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _original_decorators, { kind: "method", name: "original", static: false, private: false, access: { has: obj => "original" in obj, get: obj => obj.original }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _search_decorators, { kind: "method", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _experienceCapture_decorators, { kind: "method", name: "experienceCapture", static: false, private: false, access: { has: obj => "experienceCapture" in obj, get: obj => obj.experienceCapture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _setExperienceCapture_decorators, { kind: "method", name: "setExperienceCapture", static: false, private: false, access: { has: obj => "setExperienceCapture" in obj, get: obj => obj.setExperienceCapture }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _listExperiences_decorators, { kind: "method", name: "listExperiences", static: false, private: false, access: { has: obj => "listExperiences" in obj, get: obj => obj.listExperiences }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _experienceHistory_decorators, { kind: "method", name: "experienceHistory", static: false, private: false, access: { has: obj => "experienceHistory" in obj, get: obj => obj.experienceHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _saveExperience_decorators, { kind: "method", name: "saveExperience", static: false, private: false, access: { has: obj => "saveExperience" in obj, get: obj => obj.saveExperience }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _transitionExperience_decorators, { kind: "method", name: "transitionExperience", static: false, private: false, access: { has: obj => "transitionExperience" in obj, get: obj => obj.transitionExperience }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _deleteExperience_decorators, { kind: "method", name: "deleteExperience", static: false, private: false, access: { has: obj => "deleteExperience" in obj, get: obj => obj.deleteExperience }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static inject = ['typert', 'workspaceRegistry', 'officeKit', 'credentials'];
        static Config = Config;
        /** Resolved resource bounds and embedding configuration. */
        config = __runInitializers(this, _instanceExtraInitializers);
        store;
        lifetime = new AbortController();
        operations = new Set();
        jobControls = new Map();
        jobs = new Map();
        verifiedObjects = new Map();
        sourceSweepRunning = false;
        syncing = new Set();
        embeddings;
        /**
         * Own the queue, timer, provider requests and storage through this service's fiber.
         * @param ctx - Host conversion, workspace, credential and Remote capabilities.
         * @param config - validated resource and optional semantic retrieval settings.
         */
        constructor(ctx, config) {
            super(ctx, 'knowledge');
            this.config = Config(config);
            if (this.config.overlapChars >= this.config.childChars || this.config.childChars > this.config.parentChars)
                throw new Error('Knowledge passage sizes require overlap < child <= parent');
            this.embeddings = new KnowledgeEmbeddings(ctx, this.config);
            ctx.effect(() => {
                const timer = setInterval(() => {
                    if (this.store === undefined || this.lifetime.signal.aborted || !this.store.healthy || this.sourceSweepRunning)
                        return;
                    this.sourceSweepRunning = true;
                    void this.run(this.lifetime.signal, async (signal) => {
                        for (const source of this.data.sources()) {
                            if (this.base(source.baseId).archived || this.syncing.has(source.id))
                                continue;
                            try {
                                await this.synchronize(source, signal);
                            }
                            catch (error) {
                                if (signal.aborted)
                                    throw error;
                                ctx.logger.warn('A local knowledge source could not be synchronized.', error);
                            }
                        }
                    })
                        .catch((error) => {
                        if (!this.lifetime.signal.aborted)
                            ctx.logger.warn('Local knowledge synchronization failed.', error);
                    })
                        .finally(() => {
                        this.sourceSweepRunning = false;
                    });
                }, this.config.syncIntervalMs);
                return async () => {
                    clearInterval(timer);
                    this.lifetime.abort();
                    await Promise.allSettled([...this.operations, ...this.jobs.values()]);
                    this.store?.close();
                };
            }, 'knowledge: queue, source supervision and storage');
        }
        async [Service.init]() {
            const store = await KnowledgeStore.open(join(resolveDshHome(this.config.dshHome), 'knowledge', 'v1'), this.config);
            if (this.lifetime.signal.aborted) {
                store.close();
                this.lifetime.signal.throwIfAborted();
            }
            this.store = store;
            this.pump();
        }
        get data() {
            if (this.store === undefined || this.lifetime.signal.aborted || !this.store.healthy)
                throw fail('unavailable');
            return this.store;
        }
        async run(signal, action) {
            this.lifetime.signal.throwIfAborted();
            signal.throwIfAborted();
            const operation = action(AbortSignal.any([signal, this.lifetime.signal]));
            this.operations.add(operation);
            try {
                return await operation;
            }
            catch (error) {
                if (error instanceof Error && ERROR_REASONS.has(error.message))
                    throw fail(error.message);
                throw error;
            }
            finally {
                this.operations.delete(operation);
            }
        }
        base(id) {
            const base = this.data.bases().find(item => item.id === id);
            if (base === undefined)
                throw fail('base-not-found');
            return base;
        }
        documentRow(id) {
            const row = this.data.job(id);
            if (row === undefined)
                throw fail('document-not-found');
            return row;
        }
        validateBase(input) {
            const value = baseInputSchema.parse(input);
            if (value.mode === 'hybrid' && this.embeddings.profile === null)
                throw fail('embedding-not-configured');
            if (value.teamId !== null && !this.data.teams().some(team => team.id === value.teamId))
                throw fail('team-not-found');
            if (value.workspaceIds.some(id => this.ctx.workspaceRegistry.get(id) === undefined))
                throw fail('workspace-not-found');
            return value;
        }
        /**
         * Read local collection metadata.
         * @param signal - caller lifetime.
         * @returns local team groupings, collections and semantic provider readiness.
         */
        catalog(signal) {
            signal.throwIfAborted();
            const bases = this.data.bases();
            const globalExperience = bases.find(base => base.id === globalExperienceId);
            return {
                teams: this.data.teams(),
                bases: bases.filter(base => base.id !== globalExperienceId),
                ...globalExperience === undefined ? {} : { globalExperience },
                embeddingsConfigured: this.embeddings.profile !== null,
                maxFileBytes: this.config.maxFileBytes,
                storedBytes: z
                    .object({ bytes: z.number() })
                    .parse(this.data.db.prepare('SELECT coalesce(sum(bytes),0) bytes FROM objects').get()).bytes,
                storedLimitBytes: this.config.maxStoredBytes,
            };
        }
        /**
         * Provision the installation-wide development experience collection on UMA startup.
         * @param signal - Consumer lifetime.
         */
        ensureGlobalExperience(signal) {
            signal.throwIfAborted();
            if (this.data.bases().some(base => base.id === globalExperienceId))
                return;
            const team = this.createTeam({ name: 'UMA Studio' }, signal);
            this.data.saveBase(globalExperienceId, {
                name: 'Development experience', description: '', kind: 'team', teamId: team.id,
                workspaceIds: [], mode: 'fulltext', enabled: true,
            });
        }
        /**
         * Save one deduplicated, redacted candidate for the local installation.
         * @param request - Durable evidence identity and sanitized reusable content.
         * @param signal - Consumer lifetime.
         * @returns Whether a new candidate was saved.
         */
        captureGlobalExperience(request, signal) {
            signal.throwIfAborted();
            return captureExperience(this.data, globalExperienceId, request.sourceKey, request.content, { installationWide: true }) !== null;
        }
        /**
         * Create or reuse a local organizational group.
         * @param request - operator-chosen group name.
         * @param signal - caller lifetime.
         * @returns the durable group; this does not invite employees or publish data.
         */
        createTeam(request, signal) {
            signal.throwIfAborted();
            const name = nameSchema.parse(request.name);
            const previous = this.data.teams().find(team => team.name === name);
            if (previous !== undefined)
                return previous;
            if (this.data.teams().length >= this.config.maxTeams)
                throw fail('too-many-teams');
            const id = brandString(randomUUID());
            const now = new Date().toISOString();
            this.data.db.prepare('INSERT INTO teams VALUES(?,?,?)').run(id, name, now);
            return { id, name, createdAt: now };
        }
        /**
         * Create a team or project knowledge collection and its explicit workspace bindings.
         * @param request - complete collection settings.
         * @param signal - caller lifetime.
         * @returns the durable collection, initially without documents.
         */
        createBase(request, signal) {
            signal.throwIfAborted();
            if (this.data.bases().filter(base => base.id !== globalExperienceId).length >= this.config.maxBases)
                throw fail('too-many-collections');
            return this.data.saveBase(brandString(randomUUID()), this.validateBase(request));
        }
        /**
         * Update retrieval scope; changes apply to the next development request.
         * @param request - existing collection id and complete new settings.
         * @param signal - caller lifetime.
         * @returns updated collection metadata.
         */
        updateBase(request, signal) {
            signal.throwIfAborted();
            this.base(baseIdSchema.parse(request.id));
            if (request.id === globalExperienceId)
                throw fail('experience-base-unavailable');
            const previousMode = this.base(request.id).mode;
            const updated = this.data.saveBase(request.id, this.validateBase(request.input));
            if (previousMode !== updated.mode)
                this.cancelBaseJobs(request.id);
            this.pump();
            return updated;
        }
        /**
         * Archive or restore a collection without deleting its documents and historical citations.
         * @param request - collection and desired archive state.
         * @param signal - caller lifetime.
         * @returns whether the requested state is stored.
         */
        archiveBase(request, signal) {
            signal.throwIfAborted();
            if (request.id === globalExperienceId)
                throw fail('experience-base-unavailable');
            const { documentCount: _documents, readyCount: _ready, ...record } = this.base(request.id);
            this.data.db
                .prepare('UPDATE bases SET record=? WHERE id=?')
                .run(JSON.stringify({ ...record, archived: request.archived, updatedAt: new Date().toISOString() }), request.id);
            if (request.archived)
                this.cancelBaseJobs(request.id);
            this.pump();
            return true;
        }
        /**
         * Read collection progress without loading source text.
         * @param request - existing collection; optional archived-document view.
         * @param signal - caller lifetime.
         * @returns metadata, document states and local synchronization sources.
         */
        detail(request, signal) {
            signal.throwIfAborted();
            return {
                base: this.base(request.id),
                documents: this.data.documents(request.id, request.includeArchived ?? false),
                sources: this.data.sources(request.id),
            };
        }
        /**
         * Import selected bytes as a durable snapshot; a matching filename creates a new revision.
         * @param request - collection, display filename and complete original bytes.
         * @param signal - caller lifetime.
         * @returns an admission receipt; actual parsing continues in the durable queue.
         */
        upload(request, signal) {
            return this.admitUpload(request, signal);
        }
        admitUpload(request, signal, ifAbsent = false) {
            return this.run(signal, async (owned) => {
                this.base(request.baseId);
                const name = documentNameSchema.parse(request.name);
                const extension = knowledgeExtension(name);
                if (extension === null)
                    throw fail('unsupported-format');
                if (request.base64.length > Math.ceil(this.config.maxFileBytes / 3) * 4)
                    throw fail('file-too-large');
                const bytes = Buffer.from(request.base64, 'base64');
                if (bytes.toString('base64') !== request.base64)
                    throw fail('invalid-file-encoding');
                if (bytes.byteLength > this.config.maxFileBytes)
                    throw fail('file-too-large');
                const path = await this.data.object(bytes, extension);
                owned.throwIfAborted();
                const admitted = this.data.admit({
                    baseId: request.baseId,
                    name,
                    hash: knowledgeHash(bytes),
                    path,
                    bytes: bytes.byteLength,
                    sourcePath: null,
                    sourceId: null,
                    sourceVersion: null,
                    ifAbsent,
                });
                if (admitted.changed)
                    this.jobControls.get(admitted.id)?.abort();
                this.pump();
                return { queued: Number(admitted.changed), unchanged: Number(!admitted.changed), skipped: 0 };
            });
        }
        /**
         * Save operator-authored Markdown through the same revision/index pipeline.
         * @param request - title-like filename and complete Markdown text.
         * @param signal - caller lifetime.
         * @returns durable queue admission, without any model request.
         */
        note(request, signal) {
            const name = documentNameSchema.parse(request.name);
            return this.upload({
                baseId: request.baseId,
                name: name.endsWith('.md') ? name : `${name}.md`,
                base64: Buffer.from(request.text, 'utf8').toString('base64'),
            }, signal);
        }
        /**
         * Import a version-named reference without replacing any existing user document.
         * The storage owner checks absence atomically; older Hosts lack this endpoint and cannot silently overwrite.
         * @param request - explicit target collection, stable filename and reference text.
         * @param signal - admission cancellation; already admitted jobs remain visible.
         * @returns queued for one new document, unchanged when any document already owns that name.
         */
        createNoteIfAbsent(request, signal) {
            const name = documentNameSchema.parse(request.name);
            return this.admitUpload({ baseId: request.baseId, name: name.endsWith('.md') ? name : `${name}.md`,
                base64: Buffer.from(request.text, 'utf8').toString('base64') }, signal, true);
        }
        /**
         * Import a desktop-selected local file/folder, optionally following future changes.
         * @param request - absolute native source path and explicit synchronization choice.
         * @param signal - caller lifetime; cancellation stops scanning and preserves admitted jobs.
         * @returns queued, unchanged and unsupported/ignored file counts.
         */
        importLocal(request, signal) {
            return this.run(signal, async (owned) => {
                this.base(request.baseId);
                if (!isAbsolute(request.path))
                    throw fail('absolute-source-required');
                const original = await lstat(request.path);
                const kind = original.isDirectory() ? 'folder' : original.isFile() ? 'file' : null;
                if (original.isSymbolicLink() || kind === null || (request.kind !== 'auto' && request.kind !== kind))
                    throw fail('not-a-regular-source');
                if (kind === 'file' && knowledgeExtension(basename(request.path)) === null)
                    throw fail('unsupported-format');
                const path = await realpath(request.path);
                const previous = this.data.sources(request.baseId).find(source => source.path === path);
                const id = previous?.id ?? brandString(randomUUID());
                this.data.db
                    .prepare(`INSERT INTO sources(id,base_id,path,kind,watch) VALUES(?,?,?,?,?)
        ON CONFLICT(id) DO UPDATE SET watch=excluded.watch,kind=excluded.kind`)
                    .run(id, request.baseId, path, kind, Number(request.watch));
                const source = {
                    id,
                    baseId: request.baseId,
                    path,
                    kind,
                    watch: request.watch,
                    lastScan: previous?.lastScan ?? null,
                    error: previous?.error ?? null,
                };
                return this.synchronize(source, owned);
            });
        }
        /**
         * Enable or stop local source supervision; existing indexed snapshots remain available.
         * @param request - source id and explicit watch choice.
         * @param signal - caller lifetime.
         * @returns whether the source was found and updated.
         */
        watchSource(request, signal) {
            signal.throwIfAborted();
            const result = this.data.db.prepare('UPDATE sources SET watch=? WHERE id=?').run(Number(request.watch), request.id);
            if (result.changes === 0)
                throw fail('source-not-found');
            return true;
        }
        /**
         * Explicitly refresh one imported source.
         * @param request - source identity.
         * @param signal - caller lifetime.
         * @returns the complete scan's admission counts.
         */
        syncSource(request, signal) {
            return this.run(signal, async (owned) => {
                const source = this.data
                    .bases()
                    .flatMap(base => this.data.sources(base.id))
                    .find(item => item.id === request.id);
                if (source === undefined)
                    throw fail('source-not-found');
                return this.synchronize(source, owned);
            });
        }
        /**
         * Change a document's participation and display title without deleting history.
         * @param request - exact document and complete operator-controlled flags/title.
         * @param signal - caller lifetime.
         * @returns the updated document metadata.
         */
        updateDocument(request, signal) {
            signal.throwIfAborted();
            const current = this.documentRow(request.id);
            const title = documentNameSchema.parse(request.title);
            this.data.db
                .prepare(`UPDATE documents SET enabled=?,archived=?,title=?,updated_at=?,
      state=CASE WHEN title<>? OR (?=1 AND state='processing') THEN 'queued' ELSE state END,
      generation=generation+CASE WHEN title<>? THEN 1 ELSE 0 END WHERE id=?`)
                .run(Number(request.enabled), Number(request.archived), title, new Date().toISOString(), title, Number(request.archived), title, current.id);
            if (request.archived || title !== current.title)
                this.jobControls.get(request.id)?.abort();
            this.pump();
            return this.data.viewDocument(this.documentRow(request.id));
        }
        /**
         * Retry a failed/missing job explicitly; unchanged source errors are not retried on every timer tick.
         * @param request - existing document.
         * @param signal - caller lifetime.
         * @returns whether reprocessing was queued.
         */
        retryDocument(request, signal) {
            signal.throwIfAborted();
            this.documentRow(request.id);
            this.data.db
                .prepare("UPDATE documents SET state='queued',error=NULL,generation=generation+1 WHERE id=?")
                .run(request.id);
            this.jobControls.get(request.id)?.abort();
            this.pump();
            return true;
        }
        /**
         * Read a bounded page of parent passages plus the latest retained revisions.
         * @param request - document and zero-based passage offset.
         * @param signal - caller lifetime.
         * @returns source-backed preview and revision metadata.
         */
        document(request, signal) {
            signal.throwIfAborted();
            const row = this.documentRow(request.id);
            const offset = z.number().int().min(0).parse(request.offset);
            const chunks = row.active_revision === null
                ? []
                : this.data.chunks(this.data.db
                    .prepare('SELECT * FROM chunks WHERE document_id=? AND revision=? GROUP BY parent_id ORDER BY start_line,id LIMIT ? OFFSET ?')
                    .all(row.id, row.active_revision, this.config.previewPassages + 1, offset));
            return {
                document: this.data.viewDocument(row),
                revisions: this.data.revisions(row.id),
                passages: chunks.slice(0, this.config.previewPassages).map(chunk => this.passage(chunk, 0)),
                hasMore: chunks.length > this.config.previewPassages,
                nextOffset: offset + this.config.previewPassages,
            };
        }
        /**
         * Restore an immutable revision after stopping synchronization of its original source.
         * @param request - document and one retained revision identity.
         * @param signal - caller lifetime.
         * @returns whether the selected snapshot became active.
         */
        restoreRevision(request, signal) {
            signal.throwIfAborted();
            const document = this.documentRow(request.id);
            const source = this.data.sources(document.base_id).find(item => item.id === document.source_id);
            if (source?.watch === true)
                throw fail('stop-source-watch-before-restore');
            const revision = this.data.revisions(document.id).find(item => item.id === request.revision);
            if (revision === undefined)
                throw fail('revision-not-found');
            const chunks = this.data.chunks(this.data.db.prepare('SELECT * FROM chunks WHERE revision=?').all(revision.id));
            if (this.base(document.base_id).mode === 'hybrid' &&
                chunks.some(chunk => chunk.profile !== this.embeddings.profile))
                throw fail('embedding-reindex-required');
            this.data.transaction(() => {
                this.data.db.prepare('DELETE FROM knowledge_fts WHERE document_id=?').run(document.id);
                for (const chunk of chunks)
                    this.data.db
                        .prepare('INSERT INTO knowledge_fts VALUES(?,?,?)')
                        .run(chunk.id, document.id, knowledgeTerms(`${document.title}\n${chunk.heading}\n${chunk.text}`).join(' '));
                this.data.db
                    .prepare(`UPDATE documents SET active_revision=?,pending_hash=?,pending_path=?,state='ready',error=NULL,
        chunk_count=?,updated_at=?,generation=generation+1 WHERE id=?`)
                    .run(revision.id, revision.sourceHash, revision.originalPath, revision.chunkCount, new Date().toISOString(), document.id);
            });
            return true;
        }
        /**
         * Download a retained original after checking its owned path and source digest.
         * @param request - document and retained revision.
         * @param signal - caller lifetime.
         * @returns original filename and verified bytes.
         */
        original(request, signal) {
            return this.run(signal, async (owned) => {
                const document = this.documentRow(request.id);
                const revision = this.data.revisions(request.id).find(item => item.id === request.revision);
                if (revision === undefined || dirname(revision.originalPath) !== join(this.data.root, 'objects'))
                    throw fail('revision-not-found');
                const bytes = await readKnowledgeFile(revision.originalPath, this.config.maxFileBytes, owned);
                if (knowledgeHash(bytes) !== revision.sourceHash)
                    throw fail('knowledge-object-modified');
                return { name: basename(document.name), data: bytes };
            });
        }
        /**
         * Retrieve authorized collection passages before an answer is requested.
         * @param request - query and explicit management/Workspace scope.
         * @param signal - caller lifetime.
         * @returns fused, deduplicated evidence and stale-source diagnostics.
         */
        search(request, signal) {
            return this.run(signal, owned => this.retrieve(request, owned));
        }
        /**
         * Read whether this collection explicitly accepts automatic project repair candidates.
         * @param request - existing collection.
         * @param signal - caller lifetime.
         * @returns opt-in state; absent configuration is disabled.
         */
        experienceCapture(request, signal) {
            signal.throwIfAborted();
            this.base(request.baseId);
            return this.data.db.prepare('SELECT enabled FROM experience_capture_targets WHERE base_id=?').get(request.baseId)?.enabled === 1;
        }
        /**
         * Enable automatic capture only for one explicitly selected project collection.
         * @param request - collection and desired state; team-wide automatic sharing is rejected.
         * @param signal - caller lifetime.
         * @returns committed configuration.
         */
        setExperienceCapture(request, signal) {
            return this.run(signal, async (owned) => {
                z.boolean().parse(request.enabled);
                const base = this.base(request.baseId);
                if (base.kind !== 'project' || base.archived)
                    throw fail('experience-base-unavailable');
                this.data.transaction(() => {
                    this.data.db.prepare('INSERT INTO experience_capture_targets VALUES(?,?) ON CONFLICT(base_id) DO UPDATE SET enabled=excluded.enabled').run(base.id, Number(request.enabled));
                });
                if (request.enabled) {
                    for (const workspaceId of base.workspaceIds) {
                        owned.throwIfAborted();
                        await this.ctx.serial('knowledge/experience-capture-enabled', workspaceId);
                    }
                }
                return request.enabled;
            });
        }
        /**
         * Save historical repair candidates in opted-in collections for their actual workspace.
         * @param request - scoped evidence identity and redacted facts from the coding owner.
         * @param signal - consumer lifetime.
         * @returns number of newly recorded candidates; no model request or project file write occurs.
         */
        captureExperience(request, signal) {
            signal.throwIfAborted();
            if (this.ctx.workspaceRegistry.get(request.workspaceId) === undefined)
                throw fail('workspace-not-found');
            let captured = 0;
            for (const base of this.data.bases()) {
                if (!base.workspaceIds.includes(request.workspaceId))
                    continue;
                if (captureExperience(this.data, base.id, request.sourceKey, request.content) !== null)
                    captured++;
            }
            return captured;
        }
        /**
         * List development experience within an explicitly selected collection.
         * @param request - collection, text/state filters and page window.
         * @param signal - caller lifetime.
         * @returns current records and matching total, including non-retrievable states for management.
         */
        listExperiences(request, signal) {
            signal.throwIfAborted();
            this.base(request.baseId);
            return listExperiences(this.data, request);
        }
        /**
         * Read immutable prior experience versions for comparison or explicit restoration as a new candidate.
         * @param request - selected experience and page window.
         * @param signal - caller lifetime.
         * @returns historical revisions; reading never changes the active record.
         */
        experienceHistory(request, signal) {
            return this.run(signal, () => Promise.resolve(experienceHistory(this.data, request)));
        }
        /**
         * Save a candidate revision without inheriting an earlier review.
         * @param request - collection, expected revision and complete authored content.
         * @param signal - caller lifetime.
         * @returns committed content; a conflict leaves stored content unchanged.
         */
        saveExperience(request, signal) {
            return this.run(signal, () => Promise.resolve(saveExperience(this.data, request)));
        }
        /**
         * Record operator review, withdrawal or replacement against an exact revision.
         * @param request - transition and its explanation; reviewed is not executable acceptance.
         * @param signal - caller lifetime.
         * @returns committed revision, preserving historical content.
         */
        transitionExperience(request, signal) {
            return this.run(signal, () => Promise.resolve(transitionExperience(this.data, request)));
        }
        /**
         * Delete one exact experience revision and its retained content/index.
         * @param request - selected record and expected revision.
         * @param signal - caller lifetime.
         * @returns true after commit; existing Session citations are not rewritten.
         */
        deleteExperience(request, signal) {
            return this.run(signal, () => { deleteExperience(this.data, request.id, request.expectedRevision); return Promise.resolve(true); });
        }
        /**
         * Retrieve reviewed experience from the local library and active workspace collections.
         * @param workspaceId - actual imported workspace identity, if any.
         * @param query - current task text.
         * @param signal - caller lifetime.
         * @returns historical references requiring current-source verification, never candidate or withdrawn records.
         */
        experiencesForWorkspace(workspaceId, query, signal) {
            signal.throwIfAborted();
            if (workspaceId !== undefined && this.ctx.workspaceRegistry.get(workspaceId) === undefined)
                throw fail('workspace-not-found');
            if (knowledgeFtsQuery(query) === null)
                return [];
            const selected = /^UMA_KNOWLEDGE_BASE:([^\r\n]*)$/mu.exec(query)?.[1];
            const selectedBase = selected === undefined ? undefined : baseIdSchema.parse(selected);
            const matches = [];
            const bases = this.data.bases();
            const global = bases.find(base => base.id === globalExperienceId);
            for (const base of [...global === undefined ? [] : [global], ...bases.filter(base => base.id !== globalExperienceId)]) {
                if (!base.enabled || base.archived
                    || (base.id !== globalExperienceId && (workspaceId === undefined || !base.workspaceIds.includes(workspaceId)))
                    || selectedBase !== undefined && base.id !== selectedBase)
                    continue;
                matches.push(...listExperiences(this.data, { baseId: base.id, query, state: 'reviewed', offset: 0, limit: this.config.searchLimit }).items);
                if (matches.length >= this.config.searchLimit)
                    break;
            }
            return matches.slice(0, this.config.searchLimit);
        }
        /**
         * Retrieve only collections explicitly bound to the actual development Workspace.
         * @param workspaceId - registry identity derived by the Agent context contributor.
         * @param query - actual current user task.
         * @param signal - step lifetime.
         * @returns current project/team evidence, without unrelated Workspace knowledge.
         */
        forWorkspace(workspaceId, query, signal) {
            const selected = /^UMA_KNOWLEDGE_BASE:([^\r\n]*)$/mu.exec(query)?.[1];
            return this.run(signal, owned => this.retrieve({ workspaceId, query, baseIds: selected === undefined ? [] : [baseIdSchema.parse(selected)] }, owned));
        }
        /**
         * Report whether current tasks have any explicitly associated active collection.
         * @param workspaceId - actual Session workspace identity.
         * @returns whether a retrieval miss should be reported as missing evidence.
         */
        activeForWorkspace(workspaceId) {
            return this.data.bases().some(base => !base.archived && base.enabled && base.workspaceIds.includes(workspaceId));
        }
        cancelBaseJobs(id) {
            for (const [documentId, controller] of this.jobControls) {
                if (this.data.job(documentId)?.base_id !== id)
                    continue;
                this.data.db
                    .prepare("UPDATE documents SET state='queued',generation=generation+1 WHERE id=? AND state='processing'")
                    .run(documentId);
                controller.abort();
            }
        }
        pump() {
            if (this.store === undefined || this.lifetime.signal.aborted || !this.store.healthy)
                return;
            while (this.jobs.size < this.config.parsingConcurrency) {
                const job = this.data.nextJob([...this.jobs.keys()]);
                if (job === undefined)
                    break;
                const controller = new AbortController();
                this.jobControls.set(job.id, controller);
                const operation = this.process(job, AbortSignal.any([this.lifetime.signal, controller.signal]))
                    .catch((error) => {
                    if (!this.lifetime.signal.aborted)
                        this.ctx.logger.warn('Knowledge parsing could not publish its result.', error);
                })
                    .finally(() => {
                    this.jobs.delete(job.id);
                    this.jobControls.delete(job.id);
                    this.pump();
                });
                this.jobs.set(job.id, operation);
            }
        }
        async process(job, signal) {
            try {
                const base = this.base(job.base_id);
                const parsed = await extractKnowledge(this.ctx, job, this.config, signal);
                const chunks = knowledgeChunks(parsed, this.config);
                if (chunks.length === 0)
                    throw new Error('empty-or-binary-text');
                let vectors = null;
                if (base.mode === 'hybrid') {
                    vectors = [];
                    for (let offset = 0; offset < chunks.length; offset += this.config.embeddingBatchSize) {
                        vectors.push(...(await this.embeddings.embed(chunks
                            .slice(offset, offset + this.config.embeddingBatchSize)
                            .map(chunk => `${job.title}\n${chunk.heading}\n${chunk.text}`), false, signal)));
                        if (vectors.some(vector => vector.length !== vectors?.[0]?.length))
                            throw new Error('embedding-dimensions-changed');
                    }
                }
                signal.throwIfAborted();
                const textPath = await this.data.citation(new TextEncoder().encode(parsed.markdown), job.name);
                signal.throwIfAborted();
                const profile = base.mode === 'hybrid' ? this.embeddings.profile : null;
                const revision = {
                    id: knowledgeHash(`parent-child-citations-v1/${job.id}/${job.pending_hash}/${knowledgeHash(parsed.markdown)}/${profile}/${this.config.parentChars}/${this.config.childChars}/${this.config.overlapChars}`),
                    documentId: job.id,
                    sourceHash: job.pending_hash,
                    originalPath: job.pending_path,
                    textPath,
                    createdAt: new Date().toISOString(),
                    chunkCount: chunks.length,
                };
                signal.throwIfAborted();
                this.data.publish(job, revision, chunks, vectors, profile);
            }
            catch (error) {
                if (signal.aborted)
                    return;
                this.data.db
                    .prepare("UPDATE documents SET state='error',error=?,updated_at=? WHERE id=? AND generation=? AND state='processing'")
                    .run(reasonOf(error), new Date().toISOString(), job.id, job.generation);
            }
        }
        async discover(source, signal) {
            if (source.kind === 'file')
                return { files: [source.path], skipped: 0 };
            const files = [];
            let skipped = 0;
            let inspected = 0;
            const walk = async (path) => {
                signal.throwIfAborted();
                for (const entry of await readdir(path, { withFileTypes: true })) {
                    if (++inspected > this.config.maxSourceFiles)
                        throw fail('too-many-source-files');
                    if (entry.isSymbolicLink() ||
                        entry.name.startsWith('.') ||
                        this.config.excludeDirectories.includes(entry.name)) {
                        skipped++;
                        continue;
                    }
                    const next = join(path, entry.name);
                    if (entry.isDirectory())
                        await walk(next);
                    else if (entry.isFile() && knowledgeExtension(entry.name) !== null)
                        files.push(next);
                    else
                        skipped++;
                }
            };
            await walk(source.path);
            return { files: files.sort(), skipped };
        }
        async synchronize(source, signal) {
            if (this.syncing.has(source.id))
                throw fail('source-sync-running');
            this.syncing.add(source.id);
            try {
                const found = await this.discover(source, signal);
                let queued = 0;
                let unchanged = 0;
                const seen = new Set();
                const previousDocuments = new Map(this.data.sourceJobs(source.id).map(document => [document.name, document]));
                for (const path of found.files) {
                    signal.throwIfAborted();
                    const name = documentNameSchema.parse(source.kind === 'file' ? basename(path) : relative(source.path, path).split(sep).join('/'));
                    seen.add(path);
                    const meta = await lstat(path);
                    const version = fileVersion(meta);
                    const previousRow = previousDocuments.get(name);
                    if (previousRow?.archived === true) {
                        unchanged++;
                        continue;
                    }
                    if (previousRow !== undefined &&
                        previousRow.source_version === version &&
                        previousRow.state !== 'missing') {
                        unchanged++;
                        continue;
                    }
                    const bytes = await readKnowledgeFile(path, this.config.maxFileBytes, signal);
                    const extension = knowledgeExtension(name);
                    if (extension === null) {
                        found.skipped++;
                        continue;
                    }
                    const snapshot = await this.data.object(bytes, extension);
                    signal.throwIfAborted();
                    const admitted = this.data.admit({
                        baseId: source.baseId,
                        name,
                        hash: knowledgeHash(bytes),
                        path: snapshot,
                        bytes: bytes.byteLength,
                        sourcePath: path,
                        sourceId: source.id,
                        sourceVersion: version,
                    });
                    if (admitted.changed) {
                        this.jobControls.get(admitted.id)?.abort();
                        queued++;
                    }
                    else
                        unchanged++;
                }
                for (const document of this.data.documents(source.baseId)) {
                    if (document.sourceId === source.id && document.sourcePath !== null && !seen.has(document.sourcePath))
                        this.data.db
                            .prepare("UPDATE documents SET state='missing',error='source-missing',generation=generation+1 WHERE id=?")
                            .run(document.id);
                }
                this.data.db
                    .prepare('UPDATE sources SET last_scan=?,error=NULL WHERE id=?')
                    .run(new Date().toISOString(), source.id);
                this.pump();
                return { queued, unchanged, skipped: found.skipped };
            }
            catch (error) {
                if (!this.lifetime.signal.aborted) {
                    const missing = error instanceof Error && 'code' in error && error.code === 'ENOENT';
                    this.data.db
                        .prepare('UPDATE sources SET error=? WHERE id=?')
                        .run(missing ? 'source-missing' : reasonOf(error), source.id);
                    if (missing)
                        this.data.db
                            .prepare("UPDATE documents SET state='missing',error='source-missing',generation=generation+1 WHERE source_id=?")
                            .run(source.id);
                }
                throw error;
            }
            finally {
                this.syncing.delete(source.id);
                this.pump();
            }
        }
        async validObject(path, hash, maxBytes, signal) {
            const object = dirname(path) === join(this.data.root, 'objects') && /^[a-f0-9]{64}\.[a-z0-9]{1,8}$/u.test(basename(path));
            const citation = dirname(dirname(path)) === join(this.data.root, 'citations') &&
                basename(dirname(path)) === hash &&
                path.endsWith('.md');
            if (!/^[a-f0-9]{64}$/u.test(hash) || (!object && !citation))
                return false;
            const meta = await lstat(path);
            if (!meta.isFile() || meta.isSymbolicLink() || meta.size > maxBytes)
                return false;
            const stamp = `${fileVersion(meta)}/${hash}`;
            if (this.verifiedObjects.get(path) === stamp)
                return true;
            const bytes = await readKnowledgeFile(path, maxBytes, signal);
            if (knowledgeHash(bytes) !== hash)
                return false;
            this.verifiedObjects.delete(path);
            this.verifiedObjects.set(path, stamp);
            for (const oldest of this.verifiedObjects.keys()) {
                if (this.verifiedObjects.size <= this.config.integrityCacheEntries)
                    break;
                this.verifiedObjects.delete(oldest);
            }
            return true;
        }
        async fresh(document, signal) {
            try {
                const revision = this.data.revisions(document.id).find(item => item.id === document.active_revision);
                if (revision === undefined ||
                    !(await this.validObject(revision.originalPath, revision.sourceHash, this.config.maxFileBytes, signal)) ||
                    !(await this.validObject(revision.textPath, dirname(revision.textPath) === join(this.data.root, 'objects')
                        ? basename(revision.textPath).slice(0, 64)
                        : basename(dirname(revision.textPath)), this.config.maxTextBytes, signal)))
                    return false;
                if (document.source_id === null || document.source_path === null)
                    return true;
                const source = this.data.sources(document.base_id).find(item => item.id === document.source_id);
                if (source?.watch !== true)
                    return true;
                const meta = await lstat(document.source_path);
                if (!meta.isFile() || meta.isSymbolicLink())
                    return false;
                if (fileVersion(meta) === document.source_version)
                    return true;
                const bytes = await readKnowledgeFile(document.source_path, this.config.maxFileBytes, signal);
                return knowledgeHash(bytes) === document.pending_hash;
            }
            catch (error) {
                if (signal.aborted)
                    throw error;
                return false;
            }
        }
        passage(chunk, score) {
            const document = this.documentRow(chunk.documentId);
            const revision = this.data.revisions(chunk.documentId).find(item => item.id === chunk.revision);
            if (revision === undefined)
                throw fail('revision-not-found');
            return {
                id: chunk.id,
                baseId: chunk.baseId,
                documentId: chunk.documentId,
                revision: chunk.revision,
                baseName: this.base(chunk.baseId).name,
                title: document.title,
                heading: chunk.heading,
                text: chunk.parentText,
                page: chunk.page,
                startLine: chunk.startLine,
                endLine: chunk.endLine,
                textPath: revision.textPath,
                score,
            };
        }
        async retrieve(request, signal) {
            const query = z.string().trim().min(1).max(4000).parse(request.query);
            const explicit = request.baseIds.map(id => baseIdSchema.parse(id));
            const eligible = () => this.data
                .bases()
                .filter(base => !base.archived &&
                base.enabled &&
                base.id !== globalExperienceId &&
                (explicit.length === 0 || explicit.includes(base.id)) &&
                (request.workspaceId === undefined || base.workspaceIds.includes(request.workspaceId)));
            const bases = eligible();
            if (bases.length === 0)
                return { mode: 'fulltext', hits: [], staleDocuments: 0 };
            const allowed = bases.map(base => base.id);
            const placeholders = allowed.map(() => '?').join(',');
            const where = `d.state='ready' AND d.enabled=1 AND d.archived=0 AND c.revision=d.active_revision AND c.base_id IN (${placeholders})`;
            const fts = knowledgeFtsQuery(query);
            const lexical = fts === null
                ? []
                : this.data.db
                    .prepare(`SELECT c.id FROM knowledge_fts f JOIN chunks c ON c.id=f.chunk_id
      JOIN documents d ON d.id=c.document_id WHERE knowledge_fts MATCH ? AND ${where}
      ORDER BY bm25(knowledge_fts),c.id LIMIT ?`)
                    .all(fts, ...allowed, this.config.candidateLimit)
                    .map(value => z.object({ id: z.string() }).parse(value).id);
            const vectorBases = bases.filter(base => base.mode === 'hybrid').map(base => base.id);
            const hybrid = vectorBases.length > 0;
            let dense = [];
            if (hybrid) {
                const [queryVector] = await this.embeddings.embed([query], true, signal);
                if (queryVector === undefined)
                    throw fail('invalid-embedding-output');
                const scores = [];
                for (const raw of this.data.db
                    .prepare(`SELECT c.id,c.vector,c.profile FROM chunks c JOIN documents d ON d.id=c.document_id
        WHERE ${where} AND c.base_id IN (${vectorBases.map(() => '?').join(',')}) AND c.vector IS NOT NULL`)
                    .iterate(...allowed, ...vectorBases)) {
                    if (scores.length >= this.config.maxVectorCandidates)
                        throw fail('dense-index-too-large');
                    const row = z.object({ id: z.string(), vector: z.string(), profile: z.string().nullable() }).parse(raw);
                    if (row.profile !== this.embeddings.profile)
                        throw fail('embedding-reindex-required');
                    scores.push({
                        id: row.id,
                        score: knowledgeCosine(queryVector, z.array(z.number()).parse(JSON.parse(row.vector))),
                    });
                }
                dense = scores
                    .filter(item => item.score >= this.config.minVectorSimilarity)
                    .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id))
                    .slice(0, this.config.candidateLimit)
                    .map(item => item.id);
            }
            signal.throwIfAborted();
            const currentBases = new Map(eligible().map(base => [base.id, base.mode]));
            const lexicalMatches = new Set(lexical);
            const seen = new Set();
            const hits = [];
            let staleDocuments = 0;
            const checked = new Map();
            for (const item of knowledgeFusion(hybrid ? [lexical, dense] : [lexical])) {
                const chunks = this.data.chunks(this.data.db.prepare('SELECT * FROM chunks WHERE id=?').all(item.id));
                const chunk = chunks[0];
                if (chunk === undefined || !currentBases.has(chunk.baseId)
                    || (currentBases.get(chunk.baseId) !== 'hybrid' && !lexicalMatches.has(item.id)))
                    continue;
                const document = this.documentRow(chunk.documentId);
                if (document.active_revision !== chunk.revision ||
                    document.state !== 'ready' ||
                    !document.enabled ||
                    document.archived)
                    continue;
                let isFresh = checked.get(document.id);
                if (isFresh === undefined) {
                    isFresh = await this.fresh(document, signal);
                    checked.set(document.id, isFresh);
                    if (!isFresh)
                        staleDocuments++;
                }
                if (!isFresh)
                    continue;
                // Recheck revocation after asynchronous native source reads.
                const latest = this.documentRow(document.id);
                const currentBase = eligible().find(base => base.id === chunk.baseId);
                if (currentBase === undefined ||
                    (currentBase.mode !== 'hybrid' && !lexicalMatches.has(item.id)) ||
                    !latest.enabled ||
                    latest.archived ||
                    latest.state !== 'ready' ||
                    latest.active_revision !== chunk.revision)
                    continue;
                const parent = `${chunk.revision}/${chunk.parentId}`;
                if (seen.has(parent))
                    continue;
                seen.add(parent);
                hits.push(this.passage(chunk, item.score));
                if (hits.length >= this.config.searchLimit)
                    break;
            }
            return { mode: hybrid ? 'hybrid' : 'fulltext', hits, staleDocuments };
        }
    };
})();
export { KnowledgeService };
export default KnowledgeService;
//# sourceMappingURL=index.js.map