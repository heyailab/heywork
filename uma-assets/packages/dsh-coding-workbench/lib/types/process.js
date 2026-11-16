var __addDisposableResource = (this && this.__addDisposableResource) || function (env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        if (async) {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            if (async) inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
        env.stack.push({ value: value, dispose: dispose, async: async });
    }
    else if (async) {
        env.stack.push({ async: true });
    }
    return value;
};
var __disposeResources = (this && this.__disposeResources) || (function (SuppressedError) {
    return function (env) {
        function fail(e) {
            env.error = env.hasError ? new SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while (r = env.stack.pop()) {
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                    }
                    else s |= 1;
                }
                catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    };
})(typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
});
/** Literal-argv check execution through the same sandbox and subprocess providers as development tools. */
import { redactDevelopmentText as redactOutput } from '@deepseek-ai/dsh-util-uma-delivery';
import { deadline, timeoutOf } from '@deepseek-ai/dsh-timeout';
/**
 * Build a task commit that selects literal file paths and preserves other staged changes.
 * @param paths - validated task-relative file paths, including tracked deletions.
 * @param message - validated commit message.
 * @returns literal process arguments for the task checkout.
 */
export function commitArgv(paths, message) {
    return ['git', '--literal-pathspecs', 'commit', '--only', '-m', message, '--', ...paths];
}
/**
 * Execute an explicit argv and join process termination before returning.
 * @param ctx - execution-world capabilities.
 * @param config - deadline, grace and output bounds.
 * @param policy - unchanged Session file/network policy, or an explicitly narrower read policy.
 * @param cwd - registered workspace or retained checkout.
 * @param argv - executable and literal arguments.
 * @param signal - caller and owner lifetime cancellation.
 * @returns bounded, settled execution evidence.
 */
export async function runCommand(ctx, config, policy, cwd, argv, signal) {
    const env_1 = { stack: [], error: void 0, hasError: false };
    try {
        const executable = argv[0];
        if (executable === undefined || executable.trim() === '')
            throw new Error('empty-command');
        const timeout = __addDisposableResource(env_1, deadline(signal, config.checkTimeoutMs, 'CODING_CHECK_TIMEOUT'), false);
        const program = await ctx.subprocess.resolveExecutable(executable, undefined, timeout.signal);
        const command = [program, ...argv.slice(1)];
        const confined = policy.mode === 'danger-full-access' ? command : (await ctx.sandbox.confine(command, { ...policy, mode: policy.mode }, timeout.signal)).argv;
        timeout.signal.throwIfAborted();
        const env = Object.fromEntries(['GIT_DIR', 'GIT_WORK_TREE', 'GIT_COMMON_DIR', 'GIT_INDEX_FILE', 'GIT_OBJECT_DIRECTORY', 'GIT_ALTERNATE_OBJECT_DIRECTORIES', 'GIT_CONFIG', 'GIT_CONFIG_PARAMETERS', 'GIT_CONFIG_COUNT', 'GIT_REPLACE_REF_BASE', 'GIT_ATTR_SOURCE'].map(key => [key, undefined]));
        const child = ctx.subprocess.spawn({ argv: confined, cwd, env: { ...env, GIT_CONFIG_COUNT: '0', GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0', GIT_NO_LAZY_FETCH: '1' }, signal: timeout.signal, graceMs: config.graceMs, stdio: { stdin: 'ignore', stdout: { maxBytes: config.maxOutputBytes }, stderr: { maxBytes: config.maxOutputBytes } } });
        try {
            const outcome = await child.done;
            const stdout = child.collected.stdout?.readFrom(0);
            const stderr = child.collected.stderr?.readFrom(0);
            const timedOut = timeoutOf(timeout.signal, 'CODING_CHECK_TIMEOUT') !== undefined;
            return { exitCode: outcome.exitCode, stdout: redactOutput(stdout?.text ?? ''), stderr: redactOutput(stderr?.text ?? ''), truncated: stdout?.lossy === true || stderr?.lossy === true, timedOut, cancelled: timeout.signal.aborted && !timedOut };
        }
        finally {
            child.terminate();
            await child.waitForExit();
        }
    }
    catch (e_1) {
        env_1.error = e_1;
        env_1.hasError = true;
    }
    finally {
        __disposeResources(env_1);
    }
}
/**
 * Remove common credential forms from retained command output and local exports.
 * @param text - bounded process output.
 * @returns redacted text; arbitrary proprietary data still requires operator review before sharing.
 */
export { redactDevelopmentText as redactOutput } from '@deepseek-ai/dsh-util-uma-delivery';
/**
 * Retain inspectable command structure without copying credential option values into model-visible receipts.
 * @param argv - literal arguments used by the private execution operation.
 * @returns a detached, commonly redacted argument list.
 */
export function redactArgv(argv) {
    let secretValue = false;
    return argv.map((argument) => {
        if (secretValue) {
            secretValue = false;
            return '[redacted]';
        }
        if (/^--?(?:token|api[-_]?key|access[-_]?token|password|secret)$/iu.test(argument)) {
            secretValue = true;
            return argument;
        }
        return redactOutput(argument).replace(/^(--?(?:token|api[-_]?key|access[-_]?token|password|secret)=).*$/iu, '$1[redacted]');
    });
}
//# sourceMappingURL=process.js.map