/** Durable Wiki editions with validated evidence and commit-last publication. @module */
import { z } from 'zod';
import { FsError } from '@deepseek-ai/dsh-fs';
import { WIKI_ROOT, MAX_WIKI_PAGES, wikiExportSchema, isWikiSecret, wikiSearchTokens, knowledgeCardSchema, pageIdSchema, sourceReferenceSchema, validateWikiReference, validateWikiTree, wikiCatalogSchema, wikiImpact, wikiIndexSchema, wikiManifestSchema, } from '@deepseek-ai/dsh-util-repo-wiki';
import { WikiError } from "./errors.js";
import { indexWiki, wikiHash } from "./indexer.js";
import { wikiFreshIndex } from "./freshness.js";
import { parseWikiUserPlan } from "./plan.js";
/** Model-authored document plan, validated before any article publication. */
export const documentPlanSchema = z
    .array(z
    .object({
    id: pageIdSchema,
    title: z.string().min(1).max(180),
    goal: z.string().min(1).max(1200),
    parent: pageIdSchema.nullable().default(null),
    sources: z.array(z.string()).min(1).max(100),
})
    .strict())
    .min(1)
    .max(MAX_WIKI_PAGES);
/** Generated article evidence, summary, and knowledge cards. */
export const pageWriteSchema = z
    .object({
    id: pageIdSchema,
    content: z.string().trim().min(1),
    summary: z.string().min(1).max(2000),
    sources: z.array(sourceReferenceSchema).min(1).max(100),
    cards: z
        .array(z
        .object({
        title: z.string().min(1).max(180),
        content: z.string().min(1).max(4000),
    })
        .strict())
        .min(1)
        .max(5),
})
    .strict();
export { wikiExportSchema } from '@deepseek-ai/dsh-util-repo-wiki';
function parse(schema, text) {
    try {
        return schema.parse(JSON.parse(text));
    }
    catch (error) {
        throw new WikiError('wiki/invalid-data', 'The Wiki record is invalid; restore a valid export or start a new edition', { cause: error });
    }
}
/**
 * Locate a branch/language checkpoint without embedding a branch name in a path.
 * @param branch - exact Git branch identity, or workspace for a non-Git directory.
 * @param language - independently generated edition language.
 * @returns deterministic path confined to the Wiki root.
 */
export function wikiManifestPath(branch, language) {
    return `${WIKI_ROOT}/branches/${wikiHash(branch).slice(0, 16)}/${language}/manifest.json`;
}
/** One tool operation's workspace, limits, and cancellation owner. */
export class WikiRepository {
    files;
    config;
    constructor(files, config) {
        this.files = files;
        this.config = config;
    }
    /**
     * Read a validated branch/language catalog.
     * @returns catalog and exact file observation; an absent catalog is empty.
     */
    async catalog() {
        const file = await this.files.read(`${WIKI_ROOT}/catalog.json`, this.config.maxRecordBytes);
        return {
            value: file === null
                ? { version: 1, editions: [] }
                : parse(wikiCatalogSchema, file.text),
            file,
        };
    }
    /**
     * Read a checkpoint and validate every generated-file path and tree edge.
     * @param path - catalog-listed branch/language manifest path.
     * @returns parsed edition and file observation, or null when absent.
     */
    async manifest(path) {
        this.owned(path);
        const file = await this.files.read(path, this.config.maxRecordBytes);
        if (file === null)
            return null;
        const value = parse(wikiManifestSchema, file.text);
        validateWikiTree(value.pages);
        for (const source of [
            ...value.pages.flatMap(page => page.sources),
            ...value.cards.flatMap(card => card.sources),
        ]) {
            if (isWikiSecret(source.path))
                throw new WikiError('wiki/invalid-data', 'The Wiki contains prohibited source references');
        }
        if (path !== wikiManifestPath(value.revision.branch, value.language))
            throw new WikiError('wiki/invalid-data', 'Wiki edition identity does not match its path');
        this.owned(value.indexPath);
        for (const page of value.pages)
            if (page.contentPath !== null)
                this.owned(page.contentPath);
        return { value, file };
    }
    /**
     * Index eligible current sources and retain an immutable resumable snapshot.
     * @returns index, durable path, and affected existing articles for each language.
     */
    async scan() {
        const planFile = await this.files.read(`${WIKI_ROOT}/wiki_plan.yaml`, this.config.maxPlanBytes);
        const userPlan = planFile === null ? null : parseWikiUserPlan(planFile.text);
        const index = await indexWiki(this.files.ctx, this.files, this.config);
        const path = `${WIKI_ROOT}/indexes/${wikiHash(JSON.stringify(index))}.json`;
        await this.immutable(path, JSON.stringify(index));
        const changes = [];
        const catalog = await this.catalog();
        for (const edition of catalog.value.editions.filter(item => item.branch === index.revision.branch)) {
            const manifest = await this.manifest(edition.manifestPath);
            if (manifest === null)
                throw new WikiError('wiki/invalid-data', 'The Wiki catalog points to an absent edition');
            const previous = await this.index(manifest.value.indexPath);
            changes.push({
                language: edition.language,
                ...wikiImpact(previous, index, manifest.value.pages),
            });
        }
        return { index, indexPath: path, changes, userPlan };
    }
    /**
     * Read an immutable source snapshot.
     * @param path - Wiki-owned index path.
     * @returns validated metadata for the indexed source files.
     */
    async index(path) {
        this.owned(path);
        const record = await this.files.read(path, this.config.maxRecordBytes);
        if (record === null)
            throw new WikiError('wiki/not-found', 'The source index is absent; run wiki_inventory first');
        const index = parse(wikiIndexSchema, record.text);
        if (index.files.some(file => isWikiSecret(file.path) || file.path.startsWith(`${WIKI_ROOT}/`))) {
            throw new WikiError('wiki/invalid-data', 'The source index contains prohibited paths');
        }
        return index;
    }
    /**
     * Create or update a plan while preserving unaffected, published articles.
     * @param input - indexed snapshot, language, audience notes, and optional replacement document tree.
     * @returns checkpoint and exact pending article ids.
     */
    async plan(input) {
        const index = await this.index(input.indexPath);
        const path = wikiManifestPath(index.revision.branch, input.language);
        const before = await this.manifest(path);
        const session = this.session();
        if (before?.value.phase === 'writing' &&
            before.value.generationSession !== session &&
            (!input.takeover ||
                this.files.ctx.agents.get(before.value.generationSession)?.status ===
                    'running')) {
            throw new WikiError('wiki/conflict', `Resume the existing generation Session ${before.value.generationSession} before starting another writer`);
        }
        if (before !== null)
            await this.archive(before.value);
        const oldIndex = before === null ? null : await this.index(before.value.indexPath);
        const affected = oldIndex === null || before === null
            ? []
            : wikiImpact(oldIndex, index, before.value.pages).affected;
        let pages;
        if (input.documents !== undefined) {
            if (input.documents.length > this.config.maxPages)
                throw new WikiError('wiki/limit', 'The plan exceeds maxPages');
            const known = new Map(index.files.map(file => [file.path, file]));
            pages = input.documents.map((document) => {
                for (const source of document.sources)
                    if (!known.has(source))
                        throw new WikiError('wiki/invalid-data', `Unindexed planned source: ${source}`);
                const previous = before?.value.pages.find(page => page.id === document.id);
                const reusable = !input.regenerate &&
                    previous?.state === 'ready' &&
                    !affected.includes(document.id) &&
                    previous.goal === document.goal &&
                    previous.title === document.title &&
                    JSON.stringify(previous.dependencies.toSorted()) ===
                        JSON.stringify(document.sources.toSorted());
                return reusable
                    ? { ...previous, parent: document.parent }
                    : {
                        id: document.id,
                        title: document.title,
                        goal: document.goal,
                        parent: document.parent,
                        dependencies: document.sources,
                        sources: previous?.sources ?? [],
                        state: previous?.contentPath == null ? 'pending' : 'stale',
                        contentPath: previous?.contentPath ?? null,
                        contentHash: previous?.contentHash ?? null,
                        summary: previous?.summary ?? '',
                        updatedAt: previous?.updatedAt ?? null,
                    };
            });
        }
        else {
            if (before === null)
                throw new WikiError('wiki/invalid-data', 'Initial generation requires a documentation plan');
            pages = before.value.pages.map(page => input.regenerate || affected.includes(page.id)
                ? {
                    ...page,
                    state: page.contentPath === null
                        ? 'pending'
                        : 'stale',
                }
                : page);
        }
        validateWikiTree(pages);
        const now = new Date().toISOString();
        const manifest = wikiManifestSchema.parse({
            version: 1,
            language: input.language,
            template: input.template,
            notes: input.notes,
            citation: input.citation,
            autoUpdate: input.autoUpdate,
            revision: index.revision,
            indexPath: input.indexPath,
            generationSession: session,
            phase: 'writing',
            pages,
            cards: before?.value.cards.filter(card => pages.some(page => page.id === card.page && page.state === 'ready')) ?? [],
            updatedAt: now,
        });
        await this.publish(path, manifest, before?.file ?? null);
        return {
            path,
            manifest,
            pending: manifest.pages
                .filter(page => page.state !== 'ready')
                .map(page => page.id),
        };
    }
    /**
     * Read a source range only from the selected immutable index.
     * @param indexPath - scanner-produced source index.
     * @param path - indexed source path.
     * @param start - first one-based line.
     * @param limit - number of source lines, bounded by the caller.
     * @returns text and verified reference for citation reuse.
     */
    async source(indexPath, path, start, limit) {
        const index = await this.index(indexPath);
        const file = index.files.find(item => item.path === path);
        if (file === undefined || isWikiSecret(path))
            throw new WikiError('wiki/not-found', 'The requested source is not in the eligible index');
        const current = await this.files.read(path, this.config.maxFileBytes);
        if (current === null || wikiHash(current.text) !== file.hash)
            throw new WikiError('wiki/source-changed', 'Source changed after indexing; run wiki_inventory again');
        const lines = current.text.split('\n');
        if (!Number.isInteger(start) ||
            start < 1 ||
            start > lines.length ||
            !Number.isInteger(limit) ||
            limit < 1 ||
            limit > 500) {
            throw new WikiError('wiki/invalid-data', 'Expected an existing start line and a limit from 1 to 500');
        }
        const end = Math.min(start + limit - 1, lines.length);
        const text = lines
            .slice(start - 1, end)
            .map((line, offset) => `${start + offset}: ${line}`)
            .join('\n');
        if (Buffer.byteLength(text) > this.config.sourceWindowMaxBytes) {
            throw new WikiError('wiki/limit', 'Source window exceeds sourceWindowMaxBytes; request fewer lines or use a non-minified source');
        }
        return { source: { path, start, end, hash: file.hash }, text };
    }
    /**
     * Publish an article revision after validating its evidence against current source bytes.
     * @param path - target edition checkpoint.
     * @param input - article content, source ranges, summary, and knowledge cards.
     * @returns the committed checkpoint; orphan immutable content is harmless on CAS failure.
     */
    async writePage(path, input) {
        const before = await this.required(path);
        this.writer(before.value);
        if (before.value.phase === 'ready')
            await this.archive(before.value);
        const page = before.value.pages.find(item => item.id === input.id);
        if (page === undefined)
            throw new WikiError('wiki/not-found', 'The page is not in the approved generation plan');
        if (Buffer.byteLength(input.content) > this.config.maxPageBytes)
            throw new WikiError('wiki/limit', 'Article exceeds maxPageBytes');
        const index = await this.index(before.value.indexPath);
        for (const source of input.sources) {
            validateWikiReference(source, index.files);
            const current = await this.files.read(source.path, this.config.maxFileBytes);
            if (current === null || wikiHash(current.text) !== source.hash)
                throw new WikiError('wiki/source-changed', `Citation changed: ${source.path}; index again`);
        }
        if (page.contentPath !== null)
            await this.article(before.value, page.id);
        const text = `${input.content.trim()}\n`;
        const hash = wikiHash(text);
        const contentPath = `${WIKI_ROOT}/content/${before.value.language}/${page.id}-${hash.slice(0, 20)}.md`;
        await this.immutable(contentPath, text);
        const now = new Date().toISOString();
        const updated = {
            ...page,
            state: 'ready',
            contentPath,
            contentHash: hash,
            summary: input.summary,
            sources: input.sources,
            updatedAt: now,
        };
        const cards = input.cards.map(card => knowledgeCardSchema.parse({
            ...card,
            page: page.id,
            sources: input.sources.slice(0, 20),
        }));
        const value = {
            ...before.value,
            phase: 'writing',
            updatedAt: now,
            pages: before.value.pages.map(item => item.id === page.id ? updated : item),
            cards: [
                ...before.value.cards.filter(card => card.page !== page.id),
                ...cards,
            ],
        };
        await this.publish(path, value, before.file);
        return value;
    }
    /**
     * Read a published page without silently accepting manual edits to its content-addressed file.
     * @param manifest - edition containing the page.
     * @param id - validated article identifier.
     * @returns article text and metadata.
     */
    async article(manifest, id) {
        const page = manifest.pages.find(item => item.id === id);
        if (page?.contentPath == null)
            throw new WikiError('wiki/not-found', 'This article has not been generated yet');
        const file = await this.files.read(page.contentPath, this.config.maxPageBytes);
        if (file === null || wikiHash(file.text) !== page.contentHash)
            throw new WikiError('wiki/conflict', 'Article contents differ from the checkpoint; import manual changes before regeneration');
        return { page, text: file.text };
    }
    /**
     * Finish only when all pages and current source content match the checkpoint.
     * @param path - target manifest.
     * @returns committed ready edition.
     */
    async finish(path) {
        const before = await this.required(path);
        this.writer(before.value);
        if (before.value.pages.some(page => page.state !== 'ready' ||
            page.sources.length === 0 ||
            !before.value.cards.some(card => card.page === page.id))) {
            throw new WikiError('wiki/incomplete', 'Some Wiki pages are pending or lack verified source references');
        }
        for (const page of before.value.pages)
            await this.article(before.value, page.id);
        const current = await indexWiki(this.files.ctx, this.files, this.config);
        if (current.revision.branch !== before.value.revision.branch ||
            current.revision.fingerprint !== before.value.revision.fingerprint) {
            throw new WikiError('wiki/source-changed', 'The working tree changed during generation; update the affected pages before finishing');
        }
        const value = {
            ...before.value,
            phase: 'ready',
            updatedAt: new Date().toISOString(),
        };
        await this.publish(path, value, before.file);
        return value;
    }
    /**
     * Search verified cards and page summaries within one edition.
     * @param path - branch/language manifest.
     * @param query - user task or source/module terms.
     * @returns bounded relevance-ranked knowledge with explicit freshness facts.
     */
    async search(path, query) {
        const { value } = await this.required(path);
        if (!value.citation)
            return { enabled: false, results: [] };
        const tokens = wikiSearchTokens(query);
        const indexed = await this.index(value.indexPath);
        const current = await wikiFreshIndex(this.files.ctx, this.files.ctx.fs.processPath(this.files.root), indexed, this.config, async (path) => (await this.files.read(path, this.config.maxFileBytes))?.text ?? null, this.files.exec.signal);
        const affected = new Set(wikiImpact(indexed, current, value.pages).affected);
        const score = (text) => tokens.reduce((sum, token) => sum + (text.toLowerCase().includes(token) ? 1 : 0), 0);
        const candidates = value.cards.map(card => ({
            id: card.page,
            title: card.title,
            text: card.content,
            sources: card.sources,
            score: score(`${card.title} ${card.content} ${card.sources.map(source => source.path).join(' ')}`),
        }));
        for (const page of value.pages.filter(page => page.contentPath !== null)) {
            const article = await this.article(value, page.id);
            const corpus = `${page.title} ${page.summary} ${article.text}`;
            const relevance = score(corpus);
            if (relevance === 0)
                continue;
            const lower = article.text.toLowerCase();
            const first = Math.max(0, Math.min(...tokens
                .map(token => lower.indexOf(token))
                .filter(offset => offset >= 0)));
            const start = Number.isFinite(first) ? Math.max(0, first - 200) : 0;
            candidates.push({
                id: page.id,
                title: page.title,
                text: article.text.slice(start, start + this.config.maxSnippetChars),
                sources: page.sources,
                score: relevance,
            });
        }
        const ranked = candidates
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, this.config.searchLimit);
        const results = [];
        for (const item of ranked) {
            let stale = affected.has(item.id);
            for (const source of item.sources) {
                validateWikiReference(source, indexed.files);
                const current = await this.files.read(source.path, this.config.maxFileBytes);
                if (current === null || wikiHash(current.text) !== source.hash)
                    stale = true;
            }
            results.push({ ...item, stale });
        }
        return { enabled: true, revision: value.revision, results };
    }
    /**
     * Export complete knowledge as a portable JSON bundle and Markdown index.
     * @param path - edition manifest.
     * @returns the exclusive export path; existing exports are never overwritten.
     */
    async export(path) {
        const { value } = await this.required(path);
        const documents = {};
        for (const page of value.pages.filter(page => page.contentPath !== null))
            documents[page.id] = (await this.article(value, page.id)).text;
        const index = await this.index(value.indexPath);
        const bundle = JSON.stringify({
            version: 1,
            manifest: value,
            index,
            documents,
        });
        if (Buffer.byteLength(bundle) > this.config.maxRecordBytes)
            throw new WikiError('wiki/limit', 'Export exceeds maxRecordBytes');
        const target = `${WIKI_ROOT}/exports/${value.language}-${wikiHash(bundle).slice(0, 20)}.json`;
        await this.immutable(target, bundle);
        return { path: target, pages: Object.keys(documents).length };
    }
    /**
     * Import a portable bundle after validating its branch, source references, and all page bodies.
     * @param path - Wiki-owned import/export JSON file.
     * @returns the imported edition; changed source pages remain visibly stale.
     */
    async import(path) {
        this.owned(path);
        const file = await this.files.read(path, this.config.maxRecordBytes);
        if (file === null)
            throw new WikiError('wiki/not-found', 'The import file is absent');
        const bundle = parse(wikiExportSchema, file.text);
        validateWikiTree(bundle.manifest.pages);
        if (bundle.index.files.some(file => isWikiSecret(file.path) || file.path.startsWith(`${WIKI_ROOT}/`))) {
            throw new WikiError('wiki/invalid-data', 'Imported source metadata contains prohibited paths');
        }
        for (const card of bundle.manifest.cards) {
            if (!bundle.manifest.pages.some(page => page.id === card.page))
                throw new WikiError('wiki/invalid-data', 'Imported card has no article');
            for (const source of card.sources)
                validateWikiReference(source, bundle.index.files);
        }
        const current = await indexWiki(this.files.ctx, this.files, this.config);
        if (bundle.manifest.revision.branch !== current.revision.branch)
            throw new WikiError('wiki/conflict', 'The imported edition belongs to another branch');
        const manifestPath = wikiManifestPath(current.revision.branch, bundle.manifest.language);
        const before = await this.manifest(manifestPath);
        if (before?.value.phase === 'writing' &&
            before.value.generationSession !== this.session())
            throw new WikiError('wiki/conflict', 'Another generation owns this edition');
        if (before !== null)
            await this.archive(before.value);
        const affected = new Set(wikiImpact(bundle.index, current, bundle.manifest.pages).affected);
        const pages = [];
        for (const page of bundle.manifest.pages) {
            if (page.contentPath === null) {
                pages.push({ ...page, state: 'pending' });
                continue;
            }
            const text = bundle.documents[page.id];
            if (text === undefined ||
                Buffer.byteLength(text) > this.config.maxPageBytes ||
                wikiHash(text) !== page.contentHash) {
                throw new WikiError('wiki/invalid-data', 'Imported page content is missing, too large, or has an incorrect digest');
            }
            for (const source of page.sources)
                validateWikiReference(source, bundle.index.files);
            const stale = affected.has(page.id) ||
                page.sources.some(source => current.files.find(item => item.path === source.path)?.hash !==
                    source.hash);
            const contentPath = `${WIKI_ROOT}/content/${bundle.manifest.language}/${page.id}-${wikiHash(text).slice(0, 20)}.md`;
            await this.immutable(contentPath, text);
            pages.push({ ...page, contentPath, state: stale ? 'stale' : page.state });
        }
        const indexPath = `${WIKI_ROOT}/indexes/${wikiHash(JSON.stringify(bundle.index))}.json`;
        await this.immutable(indexPath, JSON.stringify(bundle.index));
        const value = {
            ...bundle.manifest,
            indexPath,
            generationSession: this.session(),
            pages,
            phase: pages.every(page => page.state === 'ready')
                ? 'ready'
                : 'writing',
            updatedAt: new Date().toISOString(),
        };
        await this.publish(manifestPath, value, before?.file ?? null);
        return { path: manifestPath, manifest: value };
    }
    /**
     * Read an existing edition or report the required generation step.
     * @param path - catalog-listed checkpoint path.
     * @returns edition and its CAS observation.
     */
    async required(path) {
        const record = await this.manifest(path);
        if (record === null)
            throw new WikiError('wiki/not-found', 'No Wiki edition exists; generate it first');
        return record;
    }
    session() {
        if (this.files.exec.agent === undefined)
            throw new WikiError('wiki/invalid-data', 'Wiki operations require an Agent Session');
        return this.files.exec.agent.session.id;
    }
    writer(manifest) {
        if (manifest.generationSession !== this.session())
            throw new WikiError('wiki/conflict', `Resume generation in Session ${manifest.generationSession}`);
    }
    owned(path) {
        if (!path.startsWith(`${WIKI_ROOT}/`))
            throw new WikiError('wiki/outside-workspace', 'Expected a .uma/wiki path');
    }
    async immutable(path, text) {
        const before = await this.files.read(path, this.config.maxRecordBytes);
        if (before !== null) {
            if (before.text !== text)
                throw new WikiError('wiki/conflict', 'An immutable Wiki revision was modified; preserve it and import the edit');
            return;
        }
        try {
            await this.files.write(path, text, null);
        }
        catch (error) {
            if (!(error instanceof Error) ||
                !('code' in error) ||
                error.code !== 'FS_NOT_OBSERVED')
                throw error;
            const current = await this.files.read(path, this.config.maxRecordBytes);
            if (current?.text !== text)
                throw error;
        }
    }
    async archive(manifest) {
        const text = JSON.stringify(manifest);
        await this.immutable(`${WIKI_ROOT}/history/${wikiHash(text)}.json`, text);
    }
    async publish(path, manifest, before) {
        const text = JSON.stringify(manifest);
        if (Buffer.byteLength(text) > this.config.maxRecordBytes)
            throw new WikiError('wiki/limit', 'Checkpoint exceeds maxRecordBytes');
        await this.files.write(path, text, before);
        const edition = {
            branch: manifest.revision.branch,
            language: manifest.language,
            manifestPath: path,
            updatedAt: manifest.updatedAt,
        };
        for (let attempt = 0; attempt < this.config.catalogRetries; attempt++) {
            const catalog = await this.catalog();
            const value = {
                version: 1,
                editions: [
                    ...catalog.value.editions.filter(item => item.branch !== edition.branch ||
                        item.language !== edition.language),
                    edition,
                ],
            };
            try {
                await this.files.write(`${WIKI_ROOT}/catalog.json`, JSON.stringify(value), catalog.file);
                return;
            }
            catch (error) {
                const concurrent = error instanceof FsError &&
                    (error.code === 'FS_STALE_VERSION' ||
                        error.code === 'FS_NOT_OBSERVED');
                if (!concurrent &&
                    !(error instanceof WikiError && error.code === 'wiki/conflict'))
                    throw error;
            }
        }
        throw new WikiError('wiki/catalog-busy', `Edition checkpoint committed at ${path}, but its catalog could not be merged; resume the same task to retry`);
    }
}
//# sourceMappingURL=repository.js.map