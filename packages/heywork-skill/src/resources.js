/**
 * @heywork/skill — bundled skill resource layer.
 *
 * Rewritten from specs/skill-uma.md (behavior spec), not copied from the UMA lib.
 * Every behavior here is traceable to a section of that spec; the frozen byte-level
 * constants are in spec §1 and must never drift.
 */

import {
  createCipheriv, createDecipheriv, createHash, randomBytes,
} from 'node:crypto'
import {
  existsSync, readFileSync, readdirSync, statSync,
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { brotliCompressSync, brotliDecompressSync, constants } from 'node:zlib'

// --- frozen constants (spec §1) --------------------------------------------
const CONTAINER_FILE = 'resources.umadb'
const VIRTUAL_ROOT = 'assets'
const KEY = createHash('sha256').update('UMA Studio local resource container v1').digest()
const MAX_ENTRY_BYTES = 2 * 1024 * 1024
const NONCE_BYTES = 12
const TABLE_DDL = 'PRAGMA user_version=1; CREATE TABLE resources(id TEXT PRIMARY KEY,kind INTEGER NOT NULL,nonce BLOB NOT NULL,value BLOB NOT NULL,tag BLOB NOT NULL); BEGIN'
const INSERT_SQL = 'INSERT INTO resources VALUES(?,?,?,?,?)'
const SELECT_SQL = 'SELECT kind,nonce,value,tag FROM resources WHERE id=?'

const hashId = (virtualPath) => createHash('sha256').update(virtualPath).digest('hex')
/** Container keys are always POSIX, regardless of host separator (spec §1). */
const toVirtual = (path) => path.split(sep).join('/')

/**
 * Find the nearest ancestor owning a virtual `assets/` namespace (spec §2, locate).
 * Returns the physical store path and the POSIX-relative key, or undefined.
 */
function findStore(path) {
  const absolute = resolve(path)
  let ancestor = absolute
  while (dirname(ancestor) !== ancestor) {
    const candidate = join(ancestor, CONTAINER_FILE)
    // When running from inside app.asar the real database sits next to it, unpacked.
    const unpacked = candidate.replace(`${sep}app.asar${sep}`, `${sep}app.asar.unpacked${sep}`)
    const store = existsSync(unpacked) ? unpacked : candidate
    const assetRoot = join(ancestor, VIRTUAL_ROOT)
    const inside = absolute === assetRoot || absolute.startsWith(assetRoot + sep)
    if (inside && existsSync(store)) {
      return { store, key: toVirtual(relative(assetRoot, absolute)) }
    }
    ancestor = dirname(ancestor)
  }
  return undefined
}

/**
 * Decrypt + inflate one container row (spec §2, lookup).
 * Returns undefined for non-container paths; throws on corrupt records.
 */
function decode(path) {
  const location = findStore(path)
  if (location === undefined) return undefined
  const db = new DatabaseSync(location.store, { readOnly: true })
  try {
    const row = db.prepare(SELECT_SQL).get(hashId(location.key))
    if (row === undefined) throw new Error('Unknown internal resource')
    if (typeof row.kind !== 'number'
      || !(row.nonce instanceof Uint8Array)
      || !(row.value instanceof Uint8Array)
      || !(row.tag instanceof Uint8Array)) {
      throw new Error('Invalid internal resource record')
    }
    const decipher = createDecipheriv('aes-256-gcm', KEY, row.nonce)
    decipher.setAAD(Buffer.from(`${row.kind}:${location.key}`))
    decipher.setAuthTag(row.tag)
    const packed = Buffer.concat([decipher.update(row.value), decipher.final()])
    return { kind: row.kind, bytes: brotliDecompressSync(packed, { maxOutputLength: MAX_ENTRY_BYTES }) }
  } finally {
    db.close()
  }
}

// --- exported API -----------------------------------------------------------

/** spec §2.1 */
export function isBundledPath(path) {
  return findStore(path) !== undefined
}

/** spec §2.2 — any lookup failure means "not there", never propagate. */
export function resourceExists(path) {
  if (findStore(path) === undefined) return existsSync(path)
  try {
    decode(path)
    return true
  } catch {
    return false
  }
}

/** spec §2.3 */
export function resourceIsDirectory(path) {
  const row = decode(path)
  return row === undefined ? statSync(path).isDirectory() : row.kind === 1
}

/** spec §2.4 — encoding presence (not value) selects strict UTF-8 decode. */
export function readResourceFile(path, encoding) {
  const row = decode(path)
  if (row?.kind === 1) throw new Error('Resource is a directory')
  const bytes = row?.bytes ?? readFileSync(path)
  return encoding === undefined
    ? bytes
    : new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

/** spec §2.5 */
export function listResourceDirectory(path, options) {
  const row = decode(path)
  if (row === undefined) return readdirSync(path, options)
  if (row.kind !== 1) throw new Error('Resource is not a directory')

  const parsed = JSON.parse(row.bytes.toString('utf8'))
  if (!Array.isArray(parsed)) throw new Error('Invalid resource directory')

  return parsed.map((entry) => {
    const valid = entry !== null
      && typeof entry === 'object'
      && typeof entry.name === 'string'
      && typeof entry.directory === 'boolean'
      && entry.name !== ''
      && entry.name !== '.'
      && entry.name !== '..'
      && !/[/\\\0]/u.test(entry.name)
    if (!valid) throw new Error('Invalid resource entry')
    const { name, directory } = entry
    return {
      name,
      isDirectory: () => directory,
      isFile: () => !directory,
      isSymbolicLink: () => false,
    }
  })
}

/** spec §2.6 — build a container from a source tree. Returns file count. */
export function buildResourceStore(root, output) {
  const rootAbs = resolve(root)
  if (existsSync(output) || resolve(output).startsWith(rootAbs + sep)) {
    throw new Error('Resource output must be new and outside assets')
  }

  const db = new DatabaseSync(output)
  let fileCount = 0
  try {
    db.exec(TABLE_DDL)
    const insert = db.prepare(INSERT_SQL)

    /** Seal one row; `kind` 0=file, 1=directory (spec §1). */
    const seal = (virtualPath, kind, bytes) => {
      if (bytes.length > MAX_ENTRY_BYTES) throw new Error('Resource exceeds container limit')
      const nonce = randomBytes(NONCE_BYTES)
      const cipher = createCipheriv('aes-256-gcm', KEY, nonce)
      cipher.setAAD(Buffer.from(`${kind}:${virtualPath}`))
      const packed = brotliCompressSync(bytes, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
      })
      const sealed = Buffer.concat([cipher.update(packed), cipher.final()])
      insert.run(hashId(virtualPath), kind, nonce, sealed, cipher.getAuthTag())
    }

    /** Walk one directory; emit a directory row after its children. */
    const walk = (dir) => {
      const children = []
      const entries = readdirSync(dir, { withFileTypes: true })
        .sort((a, b) => a.name.localeCompare(b.name))
      for (const entry of entries) {
        if (entry.isSymbolicLink()) throw new Error('Resource symlinks are not allowed')
        const full = join(dir, entry.name)
        const isDir = entry.isDirectory()
        children.push({ name: entry.name, directory: isDir })
        if (isDir) {
          walk(full)
        } else {
          seal(toVirtual(relative(rootAbs, full)), 0, readFileSync(full))
          fileCount++
        }
      }
      seal(toVirtual(relative(rootAbs, dir)), 1, Buffer.from(JSON.stringify(children)))
    }

    walk(rootAbs)
    db.exec('COMMIT; VACUUM')
    return fileCount
  } finally {
    db.close()
  }
}
