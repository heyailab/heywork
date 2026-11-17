/**
 * 【逆向还原】由 `lib/types/resources.js` 反推，非 DeepSeek 原始源码。
 *
 * 还原依据：lib 是 tsc 直出（保留 JSDoc、变量名、函数签名），类型注解从用法推断。
 * 逻辑与 lib 逐行等价，但没有 sourcemap / .d.ts，原始类型别名与泛型参数无法恢复。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { existsSync as exists, readFileSync as readFile, readdirSync as readDir, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { brotliCompressSync, brotliDecompressSync, constants } from 'node:zlib'

/** 容器条目的 kind：0 = 文件，1 = 目录。 */
type ResourceKind = 0 | 1

interface ResourceLocation {
  store: string
  name: string
}

interface DecodedResource {
  kind: number
  bytes: Buffer
}

/** listResourceDirectory 返回的 Dirent 兼容对象（容器分支）。 */
interface ResourceEntry {
  name: string
  isDirectory(): boolean
  isFile(): boolean
  isSymbolicLink(): boolean
}

/** readdirSync 的 options 形参形状。 */
interface ReadDirOptions {
  withFileTypes?: boolean
}

/** 应用本地资源容器；防的是随手翻看，不是防设备所有者。 */
const key = createHash('sha256').update('UMA Studio local resource container v1').digest()
const maximum = 2 * 1024 * 1024
const digest = (path: string): string => createHash('sha256').update(path).digest('hex')

/** 从虚拟 `assets/` 路径向上找到同级容器，返回容器路径与 POSIX 相对名。 */
function locate(path: string): ResourceLocation | undefined {
  const absolute = resolve(path)
  let parent = absolute
  while (dirname(parent) !== parent) {
    const virtualStore = join(parent, 'resources.umadb')
    const physicalStore = virtualStore.replace(`${sep}app.asar${sep}`, `${sep}app.asar.unpacked${sep}`)
    const store = exists(physicalStore) ? physicalStore : virtualStore
    const assets = join(parent, 'assets')
    if ((absolute === assets || absolute.startsWith(assets + sep)) && exists(store)) {
      return { store, name: relative(assets, absolute).split(sep).join('/') }
    }
    parent = dirname(parent)
  }
  return undefined
}

/** 解密并解压一条容器记录；AAD 绑定 kind 与路径，搬走文件即失效。 */
function lookup(path: string): DecodedResource | undefined {
  const location = locate(path)
  if (location === undefined) return undefined
  const db: DatabaseSync = new DatabaseSync(location.store, { readOnly: true })
  try {
    const row = db.prepare('SELECT kind,nonce,value,tag FROM resources WHERE id=?').get(digest(location.name)) as
      | { kind: number; nonce: Uint8Array; value: Uint8Array; tag: Uint8Array }
      | undefined
    if (!row) throw new Error('Unknown internal resource')
    if (typeof row.kind !== 'number' || !(row.nonce instanceof Uint8Array) || !(row.value instanceof Uint8Array)
      || !(row.tag instanceof Uint8Array))
      throw new Error('Invalid internal resource record')
    const decipher = createDecipheriv('aes-256-gcm', key, row.nonce)
    decipher.setAAD(Buffer.from(`${row.kind}:${location.name}`))
    decipher.setAuthTag(row.tag)
    const packed = Buffer.concat([decipher.update(row.value), decipher.final()])
    return { kind: row.kind, bytes: brotliDecompressSync(packed, { maxOutputLength: maximum }) }
  }
  finally {
    db.close()
  }
}

/**
 * 判断路径是否属于某个容器。
 * @param path - 虚拟资源路径。
 */
export function isBundledPath(path: string): boolean {
  return locate(path) !== undefined
}

/**
 * 测试虚拟或开发态资源路径。
 * @param path - 资源路径。
 */
export function resourceExists(path: string): boolean {
  if (locate(path) === undefined) return exists(path)
  try {
    lookup(path)
    return true
  }
  catch {
    return false
  }
}

/**
 * 判断资源种类。
 * @param path - 虚拟或开发态资源路径。
 */
export function resourceIsDirectory(path: string): boolean {
  const row = lookup(path)
  return row === undefined ? statSync(path).isDirectory() : row.kind === 1
}

/** 读取容器文件或开发态文件；指定 encoding 时按 UTF-8 严格解码。 */
export function readResourceFile(path: string): Buffer
export function readResourceFile(path: string, encoding: string): string
export function readResourceFile(path: string, encoding?: string): Buffer | string {
  const row = lookup(path)
  if (row?.kind === 1) throw new Error('Resource is a directory')
  const bytes = row?.bytes ?? readFile(path)
  return encoding === undefined ? bytes : new TextDecoder('utf-8', { fatal: true }).decode(bytes)
}

/**
 * 列出虚拟资源目录的直接子项。
 * @param path - 虚拟目录路径。
 * @param options - Dirent 兼容的结果选择器。
 */
export function listResourceDirectory(path: string, options?: ReadDirOptions): ResourceEntry[] {
  const row = lookup(path)
  if (row === undefined) return readDir(path, options) as unknown as ResourceEntry[]
  if (row.kind !== 1) throw new Error('Resource is not a directory')
  const values: unknown = JSON.parse(row.bytes.toString('utf8'))
  if (!Array.isArray(values)) throw new Error('Invalid resource directory')
  return values.map((value: unknown): ResourceEntry => {
    if (value === null || typeof value !== 'object' || !('name' in value) || typeof value.name !== 'string'
      || !('directory' in value) || typeof value.directory !== 'boolean'
      || value.name === '' || value.name === '.' || value.name === '..' || /[/\\\0]/u.test(value.name))
      throw new Error('Invalid resource entry')
    const { name, directory } = value as { name: string; directory: boolean }
    return { name, isDirectory: () => directory, isFile: () => !directory, isSymbolicLink: () => false }
  })
}

/**
 * 把源码目录构建成容器。
 * @param root - 源资源目录。
 * @param output - 容器输出路径，必须在资源目录之外。
 * @returns 写入的文件数。
 */
export function buildResourceStore(root: string, output: string): number {
  if (exists(output) || resolve(output).startsWith(resolve(root) + sep)) {
    throw new Error('Resource output must be new and outside assets')
  }
  const db: DatabaseSync = new DatabaseSync(output)
  let count = 0
  try {
    db.exec('PRAGMA user_version=1; CREATE TABLE resources(id TEXT PRIMARY KEY,kind INTEGER NOT NULL,nonce BLOB NOT NULL,value BLOB NOT NULL,tag BLOB NOT NULL); BEGIN')
    const insert = db.prepare('INSERT INTO resources VALUES(?,?,?,?,?)')
    const put = (path: string, kind: ResourceKind, bytes: Buffer): void => {
      if (bytes.length > maximum) throw new Error('Resource exceeds container limit')
      const nonce = randomBytes(12)
      const cipher = createCipheriv('aes-256-gcm', key, nonce)
      cipher.setAAD(Buffer.from(`${kind}:${path}`))
      const packed = brotliCompressSync(bytes, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } })
      const sealed = Buffer.concat([cipher.update(packed), cipher.final()])
      insert.run(digest(path), kind, nonce, sealed, cipher.getAuthTag())
    }
    const scan = (directory: string): void => {
      const entries: { name: string; directory: boolean }[] = []
      for (const entry of readDir(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        if (entry.isSymbolicLink()) throw new Error('Resource symlinks are not allowed')
        const path = join(directory, entry.name)
        entries.push({ name: entry.name, directory: entry.isDirectory() })
        if (entry.isDirectory()) scan(path)
        else {
          put(relative(root, path).split(sep).join('/'), 0, readFile(path))
          count++
        }
      }
      put(relative(root, directory).split(sep).join('/'), 1, Buffer.from(JSON.stringify(entries)))
    }
    scan(root)
    db.exec('COMMIT; VACUUM')
    return count
  }
  finally {
    db.close()
  }
}
