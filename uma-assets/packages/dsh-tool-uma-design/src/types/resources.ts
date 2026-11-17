/**
 * 【逆向还原】由 `lib/rules-B-6_mXU8.js` 的 `//#region lib/types/resources.js` 反推，
 * 非 DeepSeek 原始源码。hash 命名模块与原名的映射见 src/README.md。
 *
 * 还原依据：esbuild bundle 保留的 region 边界 + 逐行等价的控制流。
 * 类型注解 / interface 从用法反推；逻辑、字符串、错误文本与 lib 逐字一致。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */
import {
  isBundledPath,
  listResourceDirectory,
  readResourceFile,
  resourceExists,
  resourceIsDirectory,
} from '@deepseek-ai/dsh-skill-uma/resources'
import {
  closeSync,
  fstatSync,
  openSync,
  readSync,
  readdirSync,
  realpathSync,
  statSync,
} from 'node:fs'
import { join, sep } from 'node:path'

/** readBundledText 返回的一页文本结果。 */
interface BundledTextPage {
  content: string
  nextOffset: number
  totalBytes: number
}

/** readBundledResource 的目录条目。 */
interface BundledEntry {
  name: string
  kind: 'directory' | 'file'
}

/** Dirent 兼容对象的最小形状（容器分支与 readdirSync 分支共用）。 */
interface ResourceDirEntry {
  name: string
  isDirectory(): boolean
  isFile(): boolean
  isSymbolicLink(): boolean
}

/** Read-only, virtual references to installed UMA skill resources. */
/**
 * Keep a valid UTF-8 prefix without retaining an incomplete final code point.
 * @param bytes - Complete or bounded UTF-8 bytes.
 * @returns Decoded prefix; invalid complete byte sequences are rejected.
 */
export function utf8Prefix(bytes: Uint8Array): string {
  return new TextDecoder('utf-8', {
    fatal: true,
    ignoreBOM: true,
  }).decode(bytes, { stream: true })
}

/** 校验 skill/path 标识并解析为真实文件路径，容器分支与开发态分支分流。 */
function resourcePath(root: string, skill: string, path: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(skill) || path.length > 512 || path.includes('\\') || path.includes(':') || /[\u0000-\u001f\u007f]/u.test(path) || path !== '' && path.split('/').some((part) => part === '' || part === '.' || part === '..')) throw new Error('Invalid UMA resource identifier')
  if (isBundledPath(root)) {
    if (!resourceExists(join(root, skill, 'SKILL.md'))) throw new Error('Unknown UMA skill')
    const target = join(root, skill, path)
    if (!resourceExists(target)) throw new Error('Unknown UMA resource')
    return target
  }
  const assets = realpathSync(root)
  const base = realpathSync(join(assets, skill))
  if (!base.startsWith(assets + sep)) throw new Error('UMA skill leaves the asset root')
  if (!statSync(join(base, 'SKILL.md')).isFile()) throw new Error('Unknown UMA skill')
  const result = realpathSync(join(base, path))
  if (result !== base && !result.startsWith(base + sep)) throw new Error('UMA resource leaves its skill')
  return result
}

/**
 * Read a bounded text page while keeping filesystem locations private.
 * @param root - Trusted configured asset root.
 * @param skill - Installed skill directory name.
 * @param path - Relative file within that skill.
 * @param offset - Byte offset returned by the previous page, or zero.
 * @param bytes - Maximum UTF-8 bytes in this page.
 * @returns Text and the next byte offset; no absolute path.
 */
export function readBundledText(root: string, skill: string, path: string, offset: number, bytes: number): BundledTextPage {
  try {
    if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(bytes) || bytes < 4) throw new Error('Invalid page')
    const target = resourcePath(root, skill, path)
    if (isBundledPath(target)) {
      const buffer = readResourceFile(target)
      if (offset > buffer.length) throw new Error('Invalid page offset')
      const slice = buffer.subarray(offset, offset + bytes)
      const content = utf8Prefix(slice)
      const consumed = Buffer.byteLength(content)
      if (slice.length > 0 && consumed === 0 || content.includes('\0') || offset + slice.length === buffer.length && consumed !== slice.length) throw new Error('Invalid UTF-8 resource')
      return {
        content,
        nextOffset: offset + consumed,
        totalBytes: buffer.length,
      }
    }
    const file = openSync(target, 'r')
    try {
      const info = fstatSync(file)
      if (!info.isFile() || offset > info.size) throw new Error('Not a readable resource')
      const buffer = Buffer.alloc(Math.min(bytes, info.size - offset))
      const count = readSync(file, buffer, 0, buffer.length, offset)
      const content = utf8Prefix(buffer.subarray(0, count))
      const consumed = Buffer.byteLength(content)
      if (count > 0 && consumed === 0 || offset + count === info.size && consumed !== count) throw new Error('Incomplete UTF-8 resource')
      if (content.includes('\0')) throw new Error('Not a text resource')
      return {
        content,
        nextOffset: offset + Buffer.byteLength(content),
        totalBytes: info.size,
      }
    }
    finally {
      closeSync(file)
    }
  }
  catch {
    throw new Error('UMA resource is unavailable or is not valid UTF-8 text; check its skill, relative path and page offset')
  }
}

/**
 * Resolve a text resource or page its directory without revealing installation paths.
 * @param root - Trusted configured asset root.
 * @param skill - Installed skill name.
 * @param path - Relative resource path; empty lists the skill root.
 * @param offset - Previous nextOffset, initially zero.
 * @param maximum - Complete rendered result byte budget.
 * @returns Bounded resource content or directory entries and a continuation offset.
 */
export function readBundledResource(root: string, skill: string, path: string, offset: number, maximum: number): string {
  const reference = `uma-resource://${skill}/${path}`
  try {
    if (!Number.isSafeInteger(offset) || offset < 0) throw new Error('Invalid offset')
    const target = resourcePath(root, skill, path)
    if (isBundledPath(target) ? resourceIsDirectory(target) : statSync(target).isDirectory()) {
      const all: BundledEntry[] = (isBundledPath(target) ? listResourceDirectory(target, { withFileTypes: true }) : readdirSync(target, { withFileTypes: true })).filter((entry: ResourceDirEntry) => !entry.isSymbolicLink()).map((entry: ResourceDirEntry) => ({
        name: entry.name,
        kind: entry.isDirectory() ? 'directory' : 'file',
      })).sort((a, b) => a.name.localeCompare(b.name))
      const entries = all.slice(offset, offset + 100)
      let output = ''
      do {
        output = JSON.stringify({
          reference,
          kind: 'directory',
          entries,
          nextOffset: offset + entries.length < all.length ? offset + entries.length : null,
        })
        if (Buffer.byteLength(output) <= maximum) return output
        entries.pop()
      } while (entries.length > 0)
      throw new Error('Resource page exceeds its limit')
    }
    const header = `Resource: ${reference}\n`
    const page = readBundledText(root, skill, path, offset, maximum - Buffer.byteLength(header) - 128)
    return `${header}Next byte offset: ${page.nextOffset < page.totalBytes ? String(page.nextOffset) : 'complete'}\n\n${page.content}`
  }
  catch {
    throw new Error('UMA resource could not be read; use the installed skill name and its relative resource path')
  }
}
