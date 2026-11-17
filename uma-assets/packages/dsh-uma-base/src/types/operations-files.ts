/**
 * 【逆向还原】由 `lib/operations-ssh.js` 的 `//#region lib/types/operations-files.js` 反推，非 DeepSeek 原始源码。
 *
 * 原本被 esbuild 内联进 bundle，本文件按 //#region 边界拆成独立模块；跨模块引用的内部函数改为导出。
 * 逻辑与 lib 逐行等价（控制流、字符串、shell 命令、状态码一律未改）；类型注解由用法反推，
 * 外部库（ssh2 / Node 流）形状无 .d.ts 可校验处用 any 并加注释。运行时仍以 lib/*.js 为准，
 * 改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */
import { randomUUID } from 'node:crypto'
import { posix } from 'node:path'
import { Readable, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import ssh2 from 'ssh2'

/** SFTP 属性（ssh2 的 Stats 形状，无 .d.ts 可校验，按用法推断）。 */
interface SftpAttrs {
  isDirectory(): boolean
  isFile(): boolean
  isSymbolicLink(): boolean
  size: number
}

/** SFTP 通道（ssh2 ConnectConfig.sftp 返回的通道，方法签名按调用点推断）。 */
interface SftpChannel {
  lstat(path: string, cb: (error: any, attrs: SftpAttrs) => void): void
  realpath(path: string, cb: (error: any, resolved: string) => void): void
  opendir(path: string, cb: (error: any, handle: any) => void): void
  readdir(handle: any, cb: (error: any, rows: { filename: string; attrs: SftpAttrs }[]) => void): void
  close(handle: any, cb: (error?: any) => void): void
  createWriteStream(path: string, options: { flags: string; mode: number }): any
  rename(from: string, to: string, cb: (error?: any) => void): void
  unlink(path: string, cb: (error?: any) => void): void
  mkdir(path: string, cb: (error?: any) => void): void
  rmdir(path: string, cb: (error?: any) => void): void
  open(path: string, mode: string, cb: (error: any, handle: any) => void): void
  fstat(handle: any, cb: (error: any, attrs: SftpAttrs) => void): void
  createReadStream(path: string, options: { handle: any; autoClose: boolean; end: number }): any
  end(): void
}

/** 已认证的 SSH 连接（只需 sftp 开启与生命周期信号）。 */
interface FileConnection {
  client: { sftp(cb: (error: any, channel: SftpChannel) => void): void }
  signal: AbortSignal
}

interface FileRequest {
  method: string
  headers: Record<string, string | string[] | undefined>
  iterator(options?: { destroyOnReturn?: boolean }): AsyncIterable<Uint8Array>
}

interface FileResponse {
  destroyed: boolean
  headersSent: boolean
  writeHead(status: number, headers?: Record<string, string | number>): void
  setHeader(name: string, value: string): void
  end(body?: string): void
  once(event: string, cb: (...args: any[]) => void): unknown
  off(event: string, cb: (...args: any[]) => void): unknown
  destroy(): void
}

interface ListedEntry {
  name: string
  kind: string
  size: number
}

interface DirectoryListing {
  path: string
  entries: ListedEntry[]
  truncated: boolean
}

/** Bounded file operations through the credentials and lifetime of a live SSH connection. */
/** File requests share the SSH connection owner check before any SFTP channel opens. */
const operationsFileActions = [
  'files',
  'download',
  'upload',
  'mkdir',
  'rename',
  'remove'
]

/** @param action - Optional route segment.
 * @returns Whether it identifies a supported SFTP operation.
 */
export function isOperationsFileAction(action: unknown): boolean {
  return operationsFileActions.some(candidate => candidate === action)
}

function respond(response: FileResponse, status: number, payload: unknown = {}): void {
  if (response.destroyed || response.headersSent) return
  response.writeHead(status, {
    'cache-control': 'no-store',
    'content-type': 'application/json'
  })
  response.end(JSON.stringify(payload))
}

/** esbuild 的 `var X = class extends Error {}` 还原为等价 class 声明。 */
class TransferTooLarge extends Error {}
class DestinationExists extends Error {}

async function requireFreeDestination(sftp: SftpChannel, path: string, signal: AbortSignal): Promise<void> {
  try {
    await call(signal, (done) => {
      sftp.lstat(path, done)
    })
  }
  catch (error) {
    if (error instanceof Error && 'code' in error && error.code === ssh2.utils.sftp.STATUS_CODE.NO_SUCH_FILE) return
    throw error
  }
  throw new DestinationExists()
}

function rejectOversize(response: FileResponse): void {
  if (response.destroyed || response.headersSent) return
  response.setHeader('connection', 'close')
  respond(response, 413)
}

function safePath(value: string | null): string | undefined {
  if (value === null || value.length === 0 || value.length > 4096 || /[\u0000-\u001f\u007f]/u.test(value)) return
  return value
}

function filename(value: string): boolean {
  return safePath(value) !== void 0 && value !== '.' && value !== '..' && !value.includes('/')
}

function details(attrs: SftpAttrs): string {
  if (attrs.isDirectory()) return 'directory'
  if (attrs.isFile()) return 'file'
  if (attrs.isSymbolicLink()) return 'link'
  return 'other'
}

/** 把回调式 SFTP 调用包装成受 AbortSignal 控制的 Promise。 */
function call<T>(signal: AbortSignal, begin: (done: (error: any, result: T) => void) => void): Promise<T> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const abort = () => {
      const reason = signal.reason
      reject(reason instanceof Error ? reason : new Error('SFTP operation was cancelled', { cause: reason }))
    }
    signal.addEventListener('abort', abort, { once: true })
    const finish = () => {
      signal.removeEventListener('abort', abort)
    }
    try {
      begin((error, result) => {
        finish()
        if (error) reject(error)
        else resolve(result)
      })
    }
    catch (error) {
      finish()
      reject(error instanceof Error ? error : new Error('Unable to start SFTP operation', { cause: error }))
    }
  })
}

function effect(signal: AbortSignal, action: (done: (error?: any) => void) => void): Promise<void> {
  return call(signal, (done) => {
    action((error) => {
      done(error, void 0)
    })
  })
}

async function openSftp(connection: FileConnection, signal: AbortSignal): Promise<SftpChannel> {
  return call(signal, (done) => {
    connection.client.sftp((error, channel) => {
      if (error !== void 0) {
        done(error, channel)
        return
      }
      if (signal.aborted) {
        channel.end()
        return
      }
      done(void 0, channel)
    })
  })
}

async function listDirectory(sftp: SftpChannel, remote: string, signal: AbortSignal): Promise<DirectoryListing> {
  const path = await call(signal, (done) => {
    sftp.realpath(remote, done)
  })
  const handle = await call(signal, (done) => {
    sftp.opendir(path, done)
  })
  const entries: ListedEntry[] = []
  const limit = 500
  let truncated = false
  try {
    while (entries.length <= limit) {
      const batch = await call(signal, (done) => {
        sftp.readdir(handle, (error, rows) => {
          if (error !== void 0 && 'code' in error && error.code === ssh2.utils.sftp.STATUS_CODE.EOF) done(void 0, [])
          else done(error, rows)
        })
      })
      if (batch.length === 0) break
      for (const row of batch) if (filename(row.filename)) entries.push({
        name: row.filename,
        kind: details(row.attrs),
        size: row.attrs.size
      })
    }
    truncated = entries.length > limit
  }
  finally {
    if (!signal.aborted) await effect(signal, (done) => {
      sftp.close(handle, done)
    })
  }
  return {
    path,
    entries: entries.slice(0, limit),
    truncated
  }
}

async function upload(sftp: SftpChannel, request: FileRequest, path: string, signal: AbortSignal, maxBytes: number): Promise<void> {
  const temporary = posix.join(posix.dirname(path), '.uma-upload-' + randomUUID())
  let bytes = 0
  const limit = new Transform({ transform(chunk, _encoding, next) {
    bytes += chunk.byteLength
    next(bytes > maxBytes ? new TransferTooLarge() : null, chunk)
  } })
  try {
    await pipeline(Readable.from(request.iterator({ destroyOnReturn: false }), { objectMode: false }), limit, sftp.createWriteStream(temporary, {
      flags: 'wx',
      mode: 384
    }), { signal })
    await effect(signal, (done) => {
      sftp.rename(temporary, path, done)
    })
  }
  catch (error) {
    const cleanup = AbortSignal.timeout(1500)
    try {
      await effect(cleanup, (done) => {
        sftp.unlink(temporary, done)
      })
    }
    catch (_cleanupError) {}
    throw error
  }
}

/**
 * Serve a file operation for an already authenticated SSH owner.
 * @param action - File operation selected by the narrow route.
 * @param request - Browser request, whose upload body is streamed.
 * @param response - Browser response, with no upstream exception details.
 * @param url - Parsed request URL containing remote path fields.
 * @param connection - Authenticated peer-owned connection.
 * @param maxBytes - Configured maximum bytes per uploaded or downloaded file.
 */
export async function handleOperationsFiles(action: string, request: FileRequest, response: FileResponse, url: URL, connection: FileConnection, maxBytes: number): Promise<void> {
  const remote = safePath(url.searchParams.get('path'))
  const next = safePath(url.searchParams.get('to'))
  if (remote === void 0 || action === 'rename' && next === void 0 || action !== 'files' && (remote === '/' || !filename(posix.basename(remote)))) {
    respond(response, 400)
    return
  }
  const read = action === 'files' || action === 'download'
  if (request.method !== (read ? 'GET' : 'POST')) {
    respond(response, 405)
    return
  }
  const length = Number(request.headers['content-length'])
  if (action === 'upload' && Number.isFinite(length) && length > maxBytes) {
    rejectOversize(response)
    return
  }
  const owner = new AbortController()
  const cancel = () => {
    owner.abort()
  }
  response.once('close', cancel)
  const signal = AbortSignal.any([
    owner.signal,
    connection.signal,
    AbortSignal.timeout(read && action !== 'download' ? 15e3 : 12e4)
  ])
  let sftp: SftpChannel | undefined
  try {
    sftp = await openSftp(connection, signal)
    const channel = sftp
    if (action === 'files') respond(response, 200, await listDirectory(channel, remote, signal))
    else if (action === 'download') {
      if (!(await call(signal, (done) => {
        channel.lstat(remote, done)
      })).isFile()) {
        respond(response, 400)
        return
      }
      const handle = await call(signal, (done) => {
        channel.open(remote, 'r', done)
      })
      try {
        const opened = await call(signal, (done) => {
          channel.fstat(handle, done)
        })
        const size = opened.size
        if (!opened.isFile() || !Number.isSafeInteger(size) || size < 0) {
          respond(response, 400)
          return
        }
        if (size > maxBytes) {
          respond(response, 413)
          return
        }
        response.writeHead(200, {
          'content-type': 'application/octet-stream',
          'content-length': size,
          'cache-control': 'no-store, no-transform',
          'x-content-type-options': 'nosniff'
        })
        if (size === 0) response.end()
        else await pipeline(channel.createReadStream(remote, {
          handle,
          autoClose: false,
          end: size - 1
        }), response, { signal })
      }
      finally {
        if (!signal.aborted) await effect(signal, (done) => {
          channel.close(handle, done)
        })
      }
    }
    else {
      switch (action) {
        case 'upload':
          await requireFreeDestination(channel, remote, signal)
          await upload(channel, request, remote, signal, maxBytes)
          break
        case 'mkdir':
          await requireFreeDestination(channel, remote, signal)
          await effect(signal, (done) => {
            channel.mkdir(remote, done)
          })
          break
        case 'rename':
          if (next === void 0 || next === '/' || !filename(posix.basename(next))) {
            respond(response, 400)
            return
          }
          await requireFreeDestination(channel, next, signal)
          await effect(signal, (done) => {
            channel.rename(remote, next, done)
          })
          break
        case 'remove': {
          const attrs = await call(signal, (done) => {
            channel.lstat(remote, done)
          })
          await effect(signal, (done) => {
            if (attrs.isDirectory()) channel.rmdir(remote, done)
            else channel.unlink(remote, done)
          })
          break
        }
      }
      respond(response, 200)
    }
  }
  catch (error) {
    if (response.headersSent) response.destroy()
    else if (error instanceof TransferTooLarge) rejectOversize(response)
    else if (error instanceof DestinationExists) {
      if (action === 'upload' && !response.destroyed) response.setHeader('connection', 'close')
      respond(response, 409)
    }
    else respond(response, 502)
  }
  finally {
    response.off('close', cancel)
    sftp?.end()
  }
}

/** Commands available from the inspection UI. Values never include user input. */
export const operationsInspections: Record<string, string> = {
  overview: [
    "export LC_ALL=C",
    "printf \"host=%s\\n\" \"$(hostname)\"",
    "printf \"system=%s\\n\" \"$(uname -sr)\"",
    "df -Pk / | awk 'NR==2 { sub(/%$/, \"\", $5); print \"rootUsed=\" $5 }'",
    "if [ \"$(uname -s)\" = Linux ]; then",
    "  awk '{ print \"load=\" $1 }' /proc/loadavg",
    "  awk '/^MemTotal:/ { print \"memoryTotalKiB=\" $2 } /^MemAvailable:/ { print \"memoryAvailableKiB=\" $2 } /^SwapTotal:/ { print \"swapTotalKiB=\" $2 } /^SwapFree:/ { print \"swapFreeKiB=\" $2 }' /proc/meminfo",
    "  read_drops() { awk -F \":\" 'NR>2 { name=$1; gsub(/ /,\"\",name); if (name!=\"lo\") { fields=$2; sub(/^ +/,\"\",fields); split(fields,v,/ +/); rx+=v[4]; tx+=v[12] } } END { print rx+tx }' /proc/net/dev; }",
    "  before=$(read_drops)",
    "  if command -v vmstat >/dev/null 2>&1; then",
    "    vmstat 1 2 | tail -n 1 | awk '$1 ~ /^[0-9]+$/ { print \"runQueue=\" $1; print \"ioWait=\" $16; print \"cpuUsed=\" (100-$15) }'",
    "  else sleep 1; fi",
    "  after=$(read_drops)",
    "  [ \"$after\" -ge \"$before\" ] && printf \"networkDrops=%s\\n\" \"$((after-before))\"",
    "fi",
    "exit 0"
  ].join('\n'),
  disk: "LC_ALL=C df -h",
  processes: "LC_ALL=C ps -eo pid,ppid,user,%cpu,%mem,comm | head -n 80",
  services: "LC_ALL=C systemctl list-units --type=service --all --no-pager --no-legend --plain --full",
  logs: "LC_ALL=C journalctl --no-pager -n 80",
  containers: "if command -v docker >/dev/null; then engine=docker; else engine=podman; fi; $engine ps -a --format '{{.Names}}|{{.Status}}|{{.Image}}'"
}

/** @param value - Requested inspection name from the renderer.
 * @returns Whether the request names a built-in read-only inspection.
 */
export function isOperationsInspection(value: unknown): boolean {
  return typeof value === 'string' && Object.hasOwn(operationsInspections, value)
}

/**
 * Construct a single, shell-safe operation after a human selects a known row and action.
 * @param kind - Management surface.
 * @param action - Requested service or container action.
 * @param name - The selected remote unit or container name.
 * @returns A fixed command, or undefined for any unsupported input.
 */
export function operationsManagementCommand(kind: unknown, action: unknown, name: unknown): string | undefined {
  if (action !== 'start' && action !== 'stop' && action !== 'restart') return
  if (typeof name !== 'string') return
  if (kind === 'services' && /^[A-Za-z0-9_][A-Za-z0-9_.@:-]{0,220}[.]service$/u.test(name)) return 'systemctl --no-pager -- ' + action + ' ' + name
  if (kind === 'containers' && /^[A-Za-z0-9][A-Za-z0-9_.-]{0,220}$/u.test(name)) return 'if command -v docker >/dev/null; then engine=docker; else engine=podman; fi; $engine ' + action + ' -- ' + name
}
