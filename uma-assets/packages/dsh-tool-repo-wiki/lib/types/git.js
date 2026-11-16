import { WikiError } from "./errors.js";
/**
 * Run a fixed argument vector without a shell and await subprocess shutdown.
 * @param ctx - composed execution-world subprocess capability.
 * @param config - executable and resource limits.
 * @param cwd - canonical execution-world workspace path.
 * @param args - read-only Git arguments.
 * @param signal - operation cancellation.
 * @returns complete stdout and exit facts; truncation and timeout fail.
 */
export async function wikiGit(ctx, config, cwd, args, signal) {
    const deadline = AbortSignal.timeout(config.gitTimeoutMs);
    const combined = AbortSignal.any([signal, deadline]);
    const handle = ctx.subprocess.spawn({
        argv: [config.gitExecutable, '-c', 'core.fsmonitor=false', '--no-pager', ...args],
        cwd,
        signal: combined,
        graceMs: 2000,
        env: { GIT_CONFIG_COUNT: '0', GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0', LC_ALL: 'C' },
        stdio: { stdin: 'ignore', stdout: { maxBytes: config.gitOutputMaxBytes }, stderr: { maxBytes: 16384 } },
    });
    const outcome = await handle.done;
    combined.throwIfAborted();
    const output = handle.collected.stdout?.readFrom(0);
    if (output === undefined || output.lossy)
        throw new WikiError('wiki/limit', 'Git file listing exceeded the configured output limit');
    return { exitCode: outcome.exitCode, text: output.text, stderr: handle.collected.stderr?.readFrom(0).text ?? '' };
}
/**
 * Determine whether Git supplies the workspace's source list.
 * @param ctx - composed execution-world subprocess capability.
 * @param config - executable and resource limits.
 * @param cwd - canonical execution-world workspace path.
 * @param signal - operation cancellation.
 * @returns whether Git reports a working tree.
 */
export async function wikiGitWorkTree(ctx, config, cwd, signal) {
    const head = await wikiGit(ctx, config, cwd, ['rev-parse', '--is-inside-work-tree'], signal);
    if (head.exitCode === 0 && head.text.trim() === 'true')
        return true;
    if (head.exitCode === 128)
        return false;
    throw new WikiError('wiki/git-failed', 'Unable to inspect the repository; check the configured Git executable');
}
//# sourceMappingURL=git.js.map