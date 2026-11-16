import { sourcePathSchema, isWikiSecret, WIKI_ROOT } from '@deepseek-ai/dsh-util-repo-wiki';
import { WikiError } from "./errors.js";
import { wikiGit } from "./git.js";
import { isWikiCandidate, wikiHash } from "./indexer.js";
/**
 * Compare current potentially changed source files with an indexed working tree.
 * @param ctx - execution-world subprocess capability.
 * @param cwd - canonical subprocess workspace path.
 * @param index - previous complete source snapshot, including pre-existing uncommitted paths.
 * @param config - Git and per-lookup resource bounds.
 * @param read - confined UTF-8 reader; null means absent.
 * @param signal - lookup cancellation.
 * @returns updated source fingerprints suitable for dependency-impact analysis.
 * @throws when Git inspection fails or the verification budget cannot establish freshness.
 */
export async function wikiFreshIndex(ctx, cwd, index, config, read, signal) {
    if ([...index.files.map(file => file.path), ...index.dirtyPaths].some(path => isWikiSecret(path) || path.startsWith(`${WIKI_ROOT}/`))) {
        throw new WikiError('wiki/invalid-data', 'Source freshness metadata contains prohibited paths');
    }
    const paths = new Set(index.revision.git ? index.dirtyPaths : index.files.map(file => file.path));
    if (index.revision.git) {
        const requests = [
            index.revision.commit === null
                ? ['diff', '--name-only', '--no-ext-diff', '--no-textconv', '--relative', '-z', '--', '.']
                : [
                    'diff',
                    '--name-only',
                    '--no-ext-diff',
                    '--no-textconv',
                    '--relative',
                    '-z',
                    index.revision.commit,
                    '--',
                    '.',
                ],
            ['ls-files', '--others', '--exclude-standard', '-z', '--', '.'],
            ...(index.revision.commit === null
                ? [['diff', '--cached', '--name-only', '--no-ext-diff', '--no-textconv', '--relative', '-z', '--', '.']]
                : []),
        ];
        for (const args of requests) {
            const result = await wikiGit(ctx, config, cwd, args, signal);
            if (result.exitCode !== 0)
                throw new WikiError('wiki/git-failed', 'Cannot verify Wiki source freshness; inspect current source instead');
            for (const path of result.text.split('\0')) {
                if (sourcePathSchema.safeParse(path).success && isWikiCandidate(path, config))
                    paths.add(path);
            }
        }
    }
    if (paths.size > config.maxFreshnessFiles) {
        throw new WikiError('wiki/limit', 'Changed source count exceeds the Wiki freshness budget; update the edition or inspect current code');
    }
    const files = new Map(index.files.map(file => [file.path, file]));
    for (const path of paths) {
        signal.throwIfAborted();
        const text = await read(path);
        if (text === null) {
            files.delete(path);
            continue;
        }
        const previous = files.get(path);
        const current = {
            path,
            hash: wikiHash(text),
            bytes: Buffer.byteLength(text),
            lines: text.split('\n').length,
            imports: previous?.imports ?? [],
        };
        files.set(path, current);
    }
    return { ...index, files: [...files.values()].sort((a, b) => a.path.localeCompare(b.path)) };
}
//# sourceMappingURL=freshness.js.map