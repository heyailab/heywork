/** Application-local resource packaging; concealment from casual browsing, not protection from the device owner. */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { existsSync as exists, readFileSync as readFile, readdirSync as readDir, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { brotliCompressSync, brotliDecompressSync, constants } from 'node:zlib';
const key = createHash('sha256').update('UMA Studio local resource container v1').digest();
const maximum = 2 * 1024 * 1024;
const digest = (path) => createHash('sha256').update(path).digest('hex');
function locate(path) {
    const absolute = resolve(path);
    let parent = absolute;
    while (dirname(parent) !== parent) {
        const virtualStore = join(parent, 'resources.umadb');
        const physicalStore = virtualStore.replace(`${sep}app.asar${sep}`, `${sep}app.asar.unpacked${sep}`);
        const store = exists(physicalStore) ? physicalStore : virtualStore;
        const assets = join(parent, 'assets');
        if ((absolute === assets || absolute.startsWith(assets + sep)) && exists(store)) {
            return { store, name: relative(assets, absolute).split(sep).join('/') };
        }
        parent = dirname(parent);
    }
    return undefined;
}
function lookup(path) {
    const location = locate(path);
    if (location === undefined)
        return undefined;
    const db = new DatabaseSync(location.store, { readOnly: true });
    try {
        const row = db.prepare('SELECT kind,nonce,value,tag FROM resources WHERE id=?').get(digest(location.name));
        if (!row)
            throw new Error('Unknown internal resource');
        if (typeof row.kind !== 'number' || !(row.nonce instanceof Uint8Array) || !(row.value instanceof Uint8Array)
            || !(row.tag instanceof Uint8Array))
            throw new Error('Invalid internal resource record');
        const decipher = createDecipheriv('aes-256-gcm', key, row.nonce);
        decipher.setAAD(Buffer.from(`${row.kind}:${location.name}`));
        decipher.setAuthTag(row.tag);
        const packed = Buffer.concat([decipher.update(row.value), decipher.final()]);
        return { kind: row.kind, bytes: brotliDecompressSync(packed, { maxOutputLength: maximum }) };
    }
    finally {
        db.close();
    }
}
/** Check whether a path belongs to an application resource container.
 * @param path - Virtual asset path.
 * @returns whether a container owns it.
 */
export function isBundledPath(path) { return locate(path) !== undefined; }
/** Test a virtual or development resource path.
 * @param path - Resource path.
 * @returns whether the resource exists.
 */
export function resourceExists(path) {
    if (locate(path) === undefined)
        return exists(path);
    try {
        lookup(path);
        return true;
    }
    catch {
        return false;
    }
}
/** Test the resource kind.
 * @param path - Virtual or development path.
 * @returns whether it is a directory.
 */
export function resourceIsDirectory(path) {
    const row = lookup(path);
    return row === undefined ? statSync(path).isDirectory() : row.kind === 1;
}
export function readResourceFile(path, encoding) {
    const row = lookup(path);
    if (row?.kind === 1)
        throw new Error('Resource is a directory');
    const bytes = row?.bytes ?? readFile(path);
    return encoding === undefined ? bytes : new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}
/** List a virtual resource directory.
 * @param path - Directory path.
 * @param options - Dirent-compatible result selector.
 * @returns direct children.
 */
export function listResourceDirectory(path, options) {
    const row = lookup(path);
    if (row === undefined)
        return readDir(path, options);
    if (row.kind !== 1)
        throw new Error('Resource is not a directory');
    const values = JSON.parse(row.bytes.toString('utf8'));
    if (!Array.isArray(values))
        throw new Error('Invalid resource directory');
    return values.map((value) => {
        if (value === null || typeof value !== 'object' || !('name' in value) || typeof value.name !== 'string'
            || !('directory' in value) || typeof value.directory !== 'boolean'
            || value.name === '' || value.name === '.' || value.name === '..' || /[/\\\0]/u.test(value.name))
            throw new Error('Invalid resource entry');
        const { name, directory } = value;
        return { name, isDirectory: () => directory, isFile: () => !directory, isSymbolicLink: () => false };
    });
}
/** Build an application resource container.
 * @param root - Source assets directory.
 * @param output - New database outside the assets directory.
 * @returns stored file count.
 */
export function buildResourceStore(root, output) {
    if (exists(output) || resolve(output).startsWith(resolve(root) + sep)) {
        throw new Error('Resource output must be new and outside assets');
    }
    const db = new DatabaseSync(output);
    let count = 0;
    try {
        db.exec('PRAGMA user_version=1; CREATE TABLE resources(id TEXT PRIMARY KEY,kind INTEGER NOT NULL,nonce BLOB NOT NULL,value BLOB NOT NULL,tag BLOB NOT NULL); BEGIN');
        const insert = db.prepare('INSERT INTO resources VALUES(?,?,?,?,?)');
        const put = (path, kind, bytes) => {
            if (bytes.length > maximum)
                throw new Error('Resource exceeds container limit');
            const nonce = randomBytes(12);
            const cipher = createCipheriv('aes-256-gcm', key, nonce);
            cipher.setAAD(Buffer.from(`${kind}:${path}`));
            const packed = brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } });
            const sealed = Buffer.concat([cipher.update(packed), cipher.final()]);
            insert.run(digest(path), kind, nonce, sealed, cipher.getAuthTag());
        };
        const scan = (directory) => {
            const entries = [];
            for (const entry of readDir(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
                if (entry.isSymbolicLink())
                    throw new Error('Resource symlinks are not allowed');
                const path = join(directory, entry.name);
                entries.push({ name: entry.name, directory: entry.isDirectory() });
                if (entry.isDirectory())
                    scan(path);
                else {
                    put(relative(root, path).split(sep).join('/'), 0, readFile(path));
                    count++;
                }
            }
            put(relative(root, directory).split(sep).join('/'), 1, Buffer.from(JSON.stringify(entries)));
        };
        scan(root);
        db.exec('COMMIT; VACUUM');
        return count;
    }
    finally {
        db.close();
    }
}
//# sourceMappingURL=resources.js.map