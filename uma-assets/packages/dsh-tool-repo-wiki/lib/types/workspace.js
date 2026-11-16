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
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { WIKI_ROOT, sourcePathSchema, sourceReferenceSchema } from '@deepseek-ai/dsh-util-repo-wiki';
import { Config } from "./config.js";
import { WikiFiles } from "./files.js";
import { indexWiki, isWikiCandidate, wikiHash } from "./indexer.js";
import { WikiRepository } from "./repository.js";
import { WikiError } from "./errors.js";
import { wikiGit, wikiGitWorkTree } from "./git.js";
let ProjectWikiWorkspace = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _catalog_decorators;
    let _summary_decorators;
    let _readOwned_decorators;
    let _readSource_decorators;
    let _observe_decorators;
    return class ProjectWikiWorkspace extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _catalog_decorators = [Remote('catalog')];
            _summary_decorators = [Remote('summary')];
            _readOwned_decorators = [Remote('readOwned')];
            _readSource_decorators = [Remote('readSource')];
            _observe_decorators = [Remote('observe')];
            __esDecorate(this, null, _catalog_decorators, { kind: "method", name: "catalog", static: false, private: false, access: { has: obj => "catalog" in obj, get: obj => obj.catalog }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _summary_decorators, { kind: "method", name: "summary", static: false, private: false, access: { has: obj => "summary" in obj, get: obj => obj.summary }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _readOwned_decorators, { kind: "method", name: "readOwned", static: false, private: false, access: { has: obj => "readOwned" in obj, get: obj => obj.readOwned }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _readSource_decorators, { kind: "method", name: "readSource", static: false, private: false, access: { has: obj => "readSource" in obj, get: obj => obj.readSource }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _observe_decorators, { kind: "method", name: "observe", static: false, private: false, access: { has: obj => "observe" in obj, get: obj => obj.observe }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        config = __runInitializers(this, _instanceExtraInitializers);
        static inject = ['typert', 'workspaceRegistry', 'fs', 'subprocess'];
        static Config = Config;
        lifetime = new AbortController();
        operations = new Set();
        /**
         * Retain filesystem/process resources until every observation has stopped.
         * @param ctx - Same-world workspace, filesystem and subprocess providers.
         * @param config - Shared Wiki indexing and record limits.
         */
        constructor(ctx, config) {
            super(ctx, 'projectWiki');
            this.config = config;
            ctx.effect(() => async () => {
                this.lifetime.abort();
                await Promise.allSettled([...this.operations]);
            }, 'project-wiki: workspace observations');
        }
        /**
         * Read stored edition counts for an imported workspace without a conversation or model request.
         * @param request - Imported workspace identity.
         * @param signal - Caller lifetime.
         * @returns The retained branch/language catalog, or an empty catalog.
         */
        catalog(request, signal) {
            return this.read(request.workspaceId, signal, async (files) => (await new WikiRepository(files, this.config).catalog()).value);
        }
        /**
         * Read persisted counts for the actual branch without indexing source or requiring a Session.
         * @param request - Imported workspace and independently stored language.
         * @param signal - Caller lifetime.
         * @returns Exact ready/planned document and card counts, or a missing-edition summary.
         */
        summary(request, signal) {
            return this.read(request.workspaceId, signal, async (files) => {
                const repository = new WikiRepository(files, this.config);
                const catalog = (await repository.catalog()).value;
                const cwd = this.ctx.fs.processPath(files.root);
                const named = await wikiGit(this.ctx, this.config, cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD'], files.exec.signal);
                let branch = named.exitCode === 0 ? named.text.trim() : 'workspace';
                if (named.exitCode === 1) {
                    const commit = await wikiGit(this.ctx, this.config, cwd, ['rev-parse', '--verify', 'HEAD'], files.exec.signal);
                    branch = `detached-${commit.exitCode === 0 ? commit.text.trim().slice(0, 12) : 'unborn'}`;
                }
                const edition = catalog.editions.find(value => value.language === request.language && value.branch === branch);
                const manifest = edition === undefined ? null : (await repository.manifest(edition.manifestPath))?.value ?? null;
                return {
                    workspaceId: request.workspaceId, branch, catalog, phase: manifest?.phase ?? 'missing',
                    documents: manifest?.pages.filter(value => value.state === 'ready').length ?? 0,
                    totalDocuments: manifest?.pages.length ?? 0, cards: manifest?.cards.length ?? 0,
                    updatedAt: manifest?.updatedAt ?? null,
                };
            });
        }
        /**
         * Read a Wiki-owned record or article without borrowing another task's directory.
         * @param request - Workspace, confined Wiki path and transfer class.
         * @param signal - Caller lifetime.
         * @returns Exact UTF-8 content, or null when absent.
         */
        readOwned(request, signal) {
            return this.read(request.workspaceId, signal, async (files) => {
                sourcePathSchema.parse(request.path);
                if (!request.path.startsWith(`${WIKI_ROOT}/`))
                    throw new WikiError('wiki/outside-workspace', 'The record is outside the Wiki directory');
                return (await files.read(request.path, request.kind === 'article' ? this.config.maxPageBytes : this.config.maxRecordBytes))?.text ?? null;
            });
        }
        /**
         * Read a published article's exact citation from an eligible source.
         * @param request - Workspace, catalog edition, article and exact source citation.
         * @param signal - Caller lifetime.
         * @returns Numbered source lines, or an empty stale result when the cited revision is unavailable.
         */
        readSource(request, signal) {
            return this.read(request.workspaceId, signal, async (files) => {
                const source = sourceReferenceSchema.parse(request.source);
                if (!isWikiCandidate(source.path, this.config))
                    throw new WikiError('wiki/outside-workspace', 'This file is not a Wiki source');
                if (source.end - source.start >= 500)
                    throw new WikiError('wiki/limit', 'The citation exceeds the preview line limit');
                const repository = new WikiRepository(files, this.config);
                const { value: catalog } = await repository.catalog();
                const edition = catalog.editions.find(item => item.manifestPath === request.manifestPath);
                if (edition === undefined)
                    throw new WikiError('wiki/not-found', 'The Wiki edition is not in the catalog');
                const manifest = (await repository.manifest(edition.manifestPath))?.value;
                const page = manifest?.pages.find(item => item.id === request.pageId);
                if (manifest === undefined || page?.contentPath == null || page.state === 'pending' ||
                    !page.sources.some(item => item.path === source.path && item.start === source.start && item.end === source.end && item.hash === source.hash)) {
                    throw new WikiError('wiki/not-found', 'The citation is not published on this Wiki page');
                }
                await repository.article(manifest, page.id);
                const index = await repository.index(manifest.indexPath);
                const indexed = index.files.find(item => item.path === source.path);
                if (indexed?.hash !== source.hash)
                    return { text: '', stale: true };
                if (source.end > indexed.lines)
                    throw new WikiError('wiki/invalid-data', 'The citation exceeds its indexed line range');
                const cwd = this.ctx.fs.processPath(files.root);
                if (await wikiGitWorkTree(this.ctx, this.config, cwd, files.exec.signal)) {
                    const listed = await wikiGit(this.ctx, this.config, cwd, ['--literal-pathspecs', 'ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', source.path], files.exec.signal);
                    if (listed.exitCode !== 0)
                        throw new WikiError('wiki/git-failed', 'Could not check whether the cited source is still eligible');
                    if (!listed.text.split('\0').includes(source.path))
                        return { text: '', stale: true };
                }
                else if (index.revision.git) {
                    return { text: '', stale: true };
                }
                const file = await files.read(source.path, this.config.maxFileBytes);
                if (file === null || wikiHash(file.text) !== source.hash)
                    return { text: '', stale: true };
                const text = file.text.split(/\r?\n/u).slice(source.start - 1, source.end)
                    .map((line, index) => `${source.start + index}: ${line}`).join('\n');
                if (Buffer.byteLength(text) > this.config.sourceWindowMaxBytes)
                    throw new WikiError('wiki/limit', 'The source window exceeds the preview limit');
                return { text, stale: false };
            });
        }
        read(workspaceId, signal, action) {
            const owned = AbortSignal.any([signal, this.lifetime.signal]);
            owned.throwIfAborted();
            const operation = (async () => {
                const workspace = this.ctx.workspaceRegistry.get(workspaceId);
                if (workspace === undefined)
                    throw new RemoteError('project-wiki/failed', 'The imported workspace is unavailable', { reason: 'workspace-unavailable' });
                const root = await this.ctx.fs.resolve(workspace.path, { signal: owned });
                return action(new WikiFiles(this.ctx, workspace.path, root, { signal: owned }));
            })().catch((error) => {
                owned.throwIfAborted();
                if (error instanceof RemoteError)
                    throw error;
                throw new RemoteError('project-wiki/failed', 'Could not read project knowledge', { reason: error instanceof WikiError ? error.code : 'read-failed' });
            });
            this.operations.add(operation);
            return operation.finally(() => { this.operations.delete(operation); });
        }
        /**
         * Inspect current source bytes and the edition for the actual branch and language.
         * @param request - Imported workspace identity and desired language.
         * @param signal - Caller lifetime; cancellation never submits model work.
         * @returns The source fingerprint, eligible count, catalog and matching checkpoint.
         */
        observe(request, signal) {
            const owned = AbortSignal.any([signal, this.lifetime.signal]);
            owned.throwIfAborted();
            const operation = this.inspect(request, owned);
            this.operations.add(operation);
            return operation.finally(() => { this.operations.delete(operation); });
        }
        async inspect(request, signal) {
            const workspace = this.ctx.workspaceRegistry.get(request.workspaceId);
            if (workspace === undefined)
                throw new RemoteError('project-wiki/failed', 'The imported workspace is unavailable', { reason: 'workspace-unavailable' });
            try {
                const root = await this.ctx.fs.resolve(workspace.path, { signal });
                const files = new WikiFiles(this.ctx, workspace.path, root, { signal });
                const repository = new WikiRepository(files, this.config);
                const index = await indexWiki(this.ctx, files, this.config);
                const catalog = (await repository.catalog()).value;
                const edition = catalog.editions.find(value => value.language === request.language && value.branch === index.revision.branch);
                const manifest = edition === undefined ? null : (await repository.manifest(edition.manifestPath))?.value ?? null;
                return {
                    workspaceId: workspace.id, revision: index.revision, sourceCount: index.files.length,
                    skippedCount: index.skipped.length, catalog, manifest,
                };
            }
            catch (error) {
                signal.throwIfAborted();
                if (!(error instanceof WikiError))
                    this.ctx.logger.warn('Could not observe project Wiki sources.', error);
                throw new RemoteError('project-wiki/failed', 'Could not inspect the workspace Wiki', { reason: error instanceof WikiError ? error.code : 'observation-failed' });
            }
        }
    };
})();
/** Observe dirty Git trees and non-Git folders without creating a model task or a reader Session. */
export default ProjectWikiWorkspace;
//# sourceMappingURL=workspace.js.map