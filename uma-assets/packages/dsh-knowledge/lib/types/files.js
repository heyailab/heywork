/** Bounded native reads for operator-selected sources and private immutable objects. @module */
import { constants } from 'node:fs';
import { open, lstat } from 'node:fs/promises';
/**
 * Read a regular file without following a final symlink or exceeding its allowance.
 * @param path - authorized absolute host path.
 * @param maxBytes - complete byte limit.
 * @param signal - caller or service lifetime.
 * @returns exact bytes after stable file identity and version checks.
 */
export async function readKnowledgeFile(path, maxBytes, signal) {
    signal.throwIfAborted();
    const initial = await lstat(path);
    if (!initial.isFile() || initial.isSymbolicLink())
        throw new Error('not-a-regular-file');
    const handle = await open(path, constants.O_RDONLY | (process.platform === 'win32' ? 0 : constants.O_NOFOLLOW));
    try {
        const before = await handle.stat();
        if (!before.isFile() || before.size > maxBytes)
            throw new Error('file-too-large');
        const chunks = [];
        let total = 0;
        while (total <= maxBytes) {
            signal.throwIfAborted();
            const next = new Uint8Array(Math.min(65536, maxBytes + 1 - total));
            const { bytesRead } = await handle.read(next, 0, next.length, total);
            if (bytesRead === 0)
                break;
            total += bytesRead;
            chunks.push(next.subarray(0, bytesRead));
        }
        if (total > maxBytes)
            throw new Error('file-too-large');
        const after = await handle.stat();
        const current = await lstat(path);
        if (before.size !== after.size ||
            before.mtimeMs !== after.mtimeMs ||
            before.ctimeMs !== after.ctimeMs ||
            current.ino !== before.ino ||
            current.dev !== before.dev ||
            current.isSymbolicLink())
            throw new Error('source-changed');
        signal.throwIfAborted();
        const result = new Uint8Array(total);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }
        return result;
    }
    finally {
        await handle.close();
    }
}
//# sourceMappingURL=files.js.map