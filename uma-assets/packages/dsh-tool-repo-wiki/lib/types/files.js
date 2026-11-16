import { sourcePathSchema, WIKI_ROOT } from '@deepseek-ai/dsh-util-repo-wiki';
import { WikiError } from "./errors.js";
/** Filesystem access confined to the selected Agent's workspace. */
export class WikiFiles {
    ctx;
    cwd;
    root;
    exec;
    constructor(ctx, cwd, root, exec) {
        this.ctx = ctx;
        this.cwd = cwd;
        this.root = root;
        this.exec = exec;
    }
    /**
     * Resolve an indexed source or Wiki path and reject canonical escape.
     * @param path - validated repository-relative path.
     * @returns a target confined to the workspace and, for Wiki records, to the physical Wiki directory.
     */
    async target(path) {
        sourcePathSchema.parse(path);
        const { fs } = this.ctx;
        const { signal } = this.exec;
        const target = await fs.resolve(path, { cwd: this.cwd, signal });
        if (!fs.contains(this.root, target))
            throw new WikiError('wiki/outside-workspace', 'The path leaves the selected workspace');
        if (path.startsWith(`${WIKI_ROOT}/`)) {
            for (const directory of ['.uma', WIKI_ROOT]) {
                const info = await fs.lstat(directory, { cwd: this.cwd }, signal);
                if (info !== undefined && info.type !== 'directory')
                    throw new WikiError('wiki/outside-workspace', 'Wiki storage requires real directories');
            }
            const wikiRoot = await fs.resolve(WIKI_ROOT, { cwd: this.cwd, signal });
            if (wikiRoot.targetKey === this.root.targetKey || !fs.contains(this.root, wikiRoot) || !fs.contains(wikiRoot, target))
                throw new WikiError('wiki/outside-workspace', 'The path leaves the Wiki directory');
        }
        return target;
    }
    /**
     * Read a regular non-symlink UTF-8 file under a strict byte cap.
     * @param path - repository-relative path.
     * @param maxBytes - inclusive transfer limit.
     * @returns exact text/version, or null only when absent.
     */
    async read(path, maxBytes) {
        const info = await this.ctx.fs.lstat(path, { cwd: this.cwd }, this.exec.signal);
        if (info === undefined)
            return null;
        if (info.type !== 'file')
            throw new WikiError('wiki/invalid-data', `Expected a regular file: ${path}`);
        const target = await this.target(path);
        const bytes = await this.ctx.fs.readBytes(target, this.exec.signal, maxBytes);
        let text;
        try {
            text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        }
        catch (error) {
            throw new WikiError('wiki/invalid-data', `Expected UTF-8 text: ${path}`, { cause: error });
        }
        if (text.includes('\0'))
            throw new WikiError('wiki/invalid-data', `Binary file is not a Wiki source: ${path}`);
        const after = await this.ctx.fs.stat(target, this.exec.signal);
        if (after?.version !== info.version)
            throw new WikiError('wiki/source-changed', `File changed while reading: ${path}; scan again`);
        return { text, version: info.version };
    }
    /**
     * Atomically create or replace one Wiki-owned file at its observed version.
     * @param path - path under the dedicated Wiki root.
     * @param text - complete text to publish.
     * @param before - exact prior observation; null means exclusive creation.
     * @returns completion after the filesystem provider commits the write.
     */
    async write(path, text, before) {
        const exec = this.exec;
        if (!('rootCallId' in exec))
            throw new WikiError('wiki/invalid-data', 'A read-only Wiki observation cannot publish files');
        if (!path.startsWith(`${WIKI_ROOT}/`))
            throw new WikiError('wiki/outside-workspace', 'Wiki writes are confined to .uma/wiki');
        const target = await this.target(path);
        this.ctx.emit('fs/observed', target, before === null ? { kind: 'absent' } : { kind: 'present', version: before.version }, exec);
        const policy = await this.ctx.waterfall('fs/write-intent', target, exec, () => undefined);
        const intent = before === null
            ? { kind: 'createIfAbsent' }
            : { kind: 'replaceIfVersion', version: before.version };
        // The provider CAS remains authoritative even when another recorder supplied a stale observation.
        if (policy !== undefined && policy.kind === 'replaceIfVersion' && before?.version !== policy.version) {
            throw new WikiError('wiki/conflict', 'The Wiki changed concurrently; reload its checkpoint before retrying');
        }
        const sandbox = this.ctx.get('sandboxPolicy');
        if (this.ctx.fs.sandboxMode !== undefined && sandbox === undefined) {
            throw new WikiError('wiki/invalid-data', 'A sandboxed filesystem requires its policy service');
        }
        const executionPolicy = sandbox?.resolve({
            ...(this.exec.agent === undefined ? {} : { session: this.exec.agent.session }),
        });
        await this.ctx.fs.writeText(target, text, intent, this.exec.signal, executionPolicy);
    }
}
//# sourceMappingURL=files.js.map