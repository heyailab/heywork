/** Bounded local source indexing and dependency extraction. @module */
import { createHash } from 'node:crypto';
import { posix } from 'node:path';
import { FsError } from '@deepseek-ai/dsh-fs';
import { sourcePathSchema, isWikiSecret } from '@deepseek-ai/dsh-util-repo-wiki';
import { wikiGit, wikiGitWorkTree } from "./git.js";
import { WikiError } from "./errors.js";
const SOURCE_EXTENSION = new RegExp('\\.(?:[cm]?[jt]sx?|py|rs|go|java|kt|kts|dart|scala|swift|c|cpp|cc|h|hpp|cs|rb|php'
    + '|vue|svelte|html|css|scss|json|ya?ml|toml|md|mdx|sql|sh|ps1|txt|ini|cfg|lua|r|jl|clj|proto|graphql|xml|gradle|ex)$', 'iu');
/**
 * Compute a deterministic content identity without timestamps or filesystem paths.
 * @param text - complete UTF-8 text.
 * @returns lowercase SHA-256 digest.
 */
export function wikiHash(text) {
    return createHash('sha256').update(text).digest('hex');
}
/**
 * Decide whether one relative path is eligible for source indexing.
 * @param path - repository-relative path.
 * @param config - configured directory exclusions.
 * @returns eligibility before any contents are read.
 */
export function isWikiCandidate(path, config) {
    if (isWikiSecret(path) || path.split('/').some(segment => config.excludeDirectories.includes(segment)))
        return false;
    return (SOURCE_EXTENSION.test(path) || /(?:^|\/)(?:Dockerfile|Makefile|CMakeLists.txt|Gemfile|go.mod|go.sum)$/u.test(path));
}
function importSpecifiers(text) {
    const found = new Set();
    for (const pattern of [/(?:from\s*|import\s*\(|require\s*\()\s*['"]([^'"]+)['"]/gu, /import\s*['"]([^'"]+)['"]/gu]) {
        for (const match of text.matchAll(pattern))
            if (match[1] !== undefined)
                found.add(match[1]);
    }
    return [...found];
}
function packageName(text) {
    let value;
    try {
        value = JSON.parse(text);
    }
    catch (error) {
        // An incomplete package manifest remains source text; no aliases are inferred from it.
        if (error instanceof SyntaxError)
            return null;
        throw error;
    }
    return typeof value === 'object' && value !== null && 'name' in value && typeof value.name === 'string'
        ? value.name
        : null;
}
function resolveImports(path, specifiers, known, packages) {
    const found = new Set();
    for (const specifier of specifiers) {
        const name = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
        const root = name === undefined ? undefined : packages.get(name);
        const subpath = name === undefined ? '' : specifier.slice(name.length).replace(/^\//u, '');
        const bases = specifier.startsWith('.')
            ? [posix.normalize(posix.join(posix.dirname(path), specifier))]
            : root === undefined
                ? []
                : [posix.join(root, 'src', subpath || 'index'), posix.join(root, subpath || 'index')];
        let target;
        for (const base of bases) {
            target = [
                base,
                base.replace(/\.js$/u, '.ts'),
                `${base}.ts`,
                `${base}.tsx`,
                `${base}.js`,
                `${base}.py`,
                `${base}/index.ts`,
                `${base}/index.js`,
            ].find(candidate => known.has(candidate));
            if (target !== undefined)
                break;
        }
        const fallback = root === undefined ? undefined : posix.join(root, 'src/index.ts');
        if (target !== undefined)
            found.add(target);
        else if (fallback !== undefined && known.has(fallback))
            found.add(fallback);
    }
    return [...found].sort();
}
async function walk(files, config) {
    const paths = [];
    const pending = [''];
    let visited = 0;
    for (const path of pending) {
        files.exec.signal.throwIfAborted();
        const target = path === '' ? files.root : await files.target(path);
        const entries = await files.ctx.fs.listDir(target, files.exec.signal);
        for (const entry of entries) {
            if (++visited > config.maxFiles * 4)
                throw new WikiError('wiki/limit', 'Directory scan exceeded its entry limit; narrow the workspace');
            if (entry.name.startsWith('.') && entry.type === 'directory')
                continue;
            if (config.excludeDirectories.includes(entry.name))
                continue;
            const relative = path === '' ? entry.name : `${path}/${entry.name}`;
            const info = await files.ctx.fs.lstat(relative, { cwd: files.cwd }, files.exec.signal);
            if (info?.type === 'directory')
                pending.push(relative);
            else if (info?.type === 'file' && isWikiCandidate(relative, config))
                paths.push(relative);
            if (paths.length > config.maxFiles)
                throw new WikiError('wiki/limit', 'Source count exceeds maxFiles; increase the limit or narrow the workspace');
        }
    }
    return paths;
}
/**
 * Index current source text, Git identity, and direct relative imports.
 * @param ctx - composed capabilities.
 * @param files - confined access and caller cancellation.
 * @param config - deployment resource limits.
 * @returns a complete snapshot of eligible files; skipped oversized/binary files are explicit.
 */
export async function indexWiki(ctx, files, config) {
    const cwd = ctx.fs.processPath(files.root);
    const git = await wikiGitWorkTree(ctx, config, cwd, files.exec.signal);
    let branch = 'workspace';
    let commit = null;
    let dirty = false;
    let dirtyPaths = [];
    let paths;
    if (git) {
        const listed = await wikiGit(ctx, config, cwd, ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '.'], files.exec.signal);
        if (listed.exitCode !== 0)
            throw new WikiError('wiki/git-failed', 'Git source enumeration failed');
        paths = [
            ...new Set(listed.text
                .split('\0')
                .filter(path => path !== '' && sourcePathSchema.safeParse(path).success && isWikiCandidate(path, config))),
        ].sort();
        const revision = await wikiGit(ctx, config, cwd, ['rev-parse', '--verify', 'HEAD'], files.exec.signal);
        if (revision.exitCode === 0)
            commit = revision.text.trim();
        const named = await wikiGit(ctx, config, cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD'], files.exec.signal);
        branch = named.exitCode === 0 ? named.text.trim() : `detached-${commit?.slice(0, 12) ?? 'unborn'}`;
        const status = await wikiGit(ctx, config, cwd, ['status', '--porcelain', '-z', '--untracked-files=all', '--', '.'], files.exec.signal);
        if (status.exitCode !== 0)
            throw new WikiError('wiki/git-failed', 'Git working-tree inspection failed');
        dirtyPaths = status.text
            .split('\0')
            .filter(entry => entry.length > 3)
            .map(entry => entry.slice(3))
            .filter(path => sourcePathSchema.safeParse(path).success && isWikiCandidate(path, config));
        dirty = dirtyPaths.length > 0;
    }
    else {
        paths = (await walk(files, config)).sort();
    }
    if (paths.length > config.maxFiles)
        throw new WikiError('wiki/limit', `Source count exceeds maxFiles (${config.maxFiles})`);
    const specifiers = new Map();
    const packages = new Map();
    const indexed = [];
    const skipped = [];
    let bytes = 0;
    for (const path of paths) {
        files.exec.signal.throwIfAborted();
        const info = await ctx.fs.lstat(path, { cwd: files.cwd }, files.exec.signal);
        if (info === undefined)
            continue;
        if (info.type !== 'file') {
            skipped.push({ path, reason: 'symlink' });
            continue;
        }
        if ((info.size ?? 0) > config.maxFileBytes) {
            skipped.push({ path, reason: 'too-large' });
            continue;
        }
        let source;
        try {
            source = await files.read(path, config.maxFileBytes);
        }
        catch (error) {
            if (error instanceof WikiError && error.code === 'wiki/invalid-data') {
                skipped.push({ path, reason: 'not-text' });
                continue;
            }
            if (error instanceof FsError && error.code === 'FS_TOO_LARGE') {
                skipped.push({ path, reason: 'too-large' });
                continue;
            }
            throw error;
        }
        if (source === null)
            continue;
        const size = Buffer.byteLength(source.text);
        bytes += size;
        if (bytes > config.maxScanBytes)
            throw new WikiError('wiki/limit', `Source bytes exceed maxScanBytes (${config.maxScanBytes}); scan was not published`);
        specifiers.set(path, importSpecifiers(source.text));
        if (posix.basename(path) === 'package.json') {
            const name = packageName(source.text);
            if (name !== null)
                packages.set(name, posix.dirname(path));
        }
        indexed.push({
            path,
            hash: wikiHash(source.text),
            bytes: size,
            lines: source.text.split('\n').length,
            imports: [],
        });
    }
    const known = new Set(indexed.map(file => file.path));
    for (const file of indexed)
        file.imports = resolveImports(file.path, specifiers.get(file.path) ?? [], known, packages);
    const fingerprint = wikiHash(JSON.stringify(indexed.map(file => [file.path, file.hash])));
    return {
        version: 1,
        revision: {
            branch,
            commit,
            fingerprint,
            scannedAt: new Date().toISOString(),
            fileCount: indexed.length,
            dirty,
            git,
        },
        files: indexed,
        dirtyPaths,
        skipped,
    };
}
//# sourceMappingURL=indexer.js.map