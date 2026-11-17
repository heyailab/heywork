/**
 * 【逆向还原】由 `lib/operations-ssh.js` 的 `//#region lib/types/operations-desktop.js` 反推，非 DeepSeek 原始源码。
 *
 * 原本被 esbuild 内联进 bundle，本文件按 //#region 边界拆成独立模块。
 * esbuild 为避与终端模块同名而加的 `$1` 后缀已去掉：path$1→path、handshakeMs$1→handshakeMs（仅标识符名，逻辑不变）。
 * 逻辑与 lib 逐行等价（控制流、字符串、状态码一律未改）；外部库（ws / Node 流）形状无 .d.ts 可校验处用 any。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */
import { WebSocketServer, createWebSocketStream } from 'ws'

interface DesktopSocket {
  destroyed: boolean
  remoteAddress?: string
  end(data: string): void
  destroy(): void
  on(event: string, cb: (...args: any[]) => void): unknown
  off(event: string, cb: (...args: any[]) => void): unknown
  once(event: string, cb: (...args: any[]) => void): unknown
}

interface DesktopChannel {
  destroy(): void
  on(event: string, cb: (...args: any[]) => void): unknown
  off(event: string, cb: (...args: any[]) => void): unknown
  once(event: string, cb: (...args: any[]) => void): unknown
  pipe<T>(dest: T): T
}

interface DesktopConnection {
  signal: AbortSignal
  client: {
    forwardOut(
      srcAddr: string, srcPort: number, dstAddr: string, dstPort: number,
      cb: (error: any, channel: DesktopChannel) => void
    ): void
  }
}

interface DesktopAdmission {
  peer: {
    principal: { kind: string }
    signal: AbortSignal
    id: string | number
  }
}

type Admission = { rejection: number } | DesktopAdmission

interface DesktopRequest {
  url?: string
  socket: DesktopSocket
}

interface DesktopContext {
  effect(callback: () => (() => Promise<void>) | Promise<void>, label?: string): void
  webServer: {
    protocol: string
    registerUpgrade(options: {
      path: string
      handler(request: DesktopRequest, socket: DesktopSocket, head: Buffer): void
    }): () => void
  }
  connection: { admit(request: DesktopRequest): Admission }
}

const path = '/hey/operations/desktop'
const handshakeMs = 1e4

function reject(socket: DesktopSocket, status: string): void {
  socket.end(`HTTP/1.1 ${status}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
}

function relay(websocket: any, channel: DesktopChannel, signal: AbortSignal): void {
  const stream = createWebSocketStream(websocket, { highWaterMark: 64 * 1024 })
  const close = () => {
    signal.removeEventListener('abort', close)
    channel.destroy()
    stream.destroy()
  }
  stream.on('error', close)
  channel.on('error', close)
  stream.once('close', close)
  channel.once('close', close)
  signal.addEventListener('abort', close, { once: true })
  if (signal.aborted) close()
  else channel.pipe(stream).pipe(channel)
}

function forward(connection: DesktopConnection, port: number, request: DesktopRequest, socket: DesktopSocket, head: Buffer, server: WebSocketServer): void {
  const stopped = new AbortController()
  const stop = () => {
    stopped.abort()
  }
  const signal = AbortSignal.any([
    connection.signal,
    stopped.signal,
    AbortSignal.timeout(handshakeMs)
  ])
  const cancel = () => {
    socket.off('close', stop)
    reject(socket, '502 Bad Gateway')
  }
  socket.once('close', stop)
  signal.addEventListener('abort', cancel, { once: true })
  connection.client.forwardOut('127.0.0.1', 0, '127.0.0.1', port, (error, channel) => {
    socket.off('close', stop)
    signal.removeEventListener('abort', cancel)
    if (signal.aborted || socket.destroyed) {
      if (!error) channel.destroy()
      return
    }
    if (error) {
      reject(socket, '502 Bad Gateway')
      return
    }
    const closePendingChannel = () => {
      channel.destroy()
    }
    const closeSocket = () => {
      socket.destroy()
    }
    socket.once('close', closePendingChannel)
    channel.on('error', closeSocket)
    server.handleUpgrade(request, socket, head, (websocket) => {
      socket.off('close', closePendingChannel)
      channel.off('error', closeSocket)
      relay(websocket, channel, connection.signal)
    })
  })
}

/**
 * Mount the binary VNC transport on the product Host.
 * @param ctx - Scope that owns the web listener.
 * @param lookup - Find a live SSH connection owned by the authenticated peer.
 */
export function mountOperationsDesktop(ctx: DesktopContext, lookup: (id: string, owner: string) => DesktopConnection | undefined): void {
  ctx.effect(() => {
    const server = new WebSocketServer({
      noServer: true,
      maxPayload: 64 * 1024,
      perMessageDeflate: false
    })
    const active = new Map<string, DesktopSocket>()
    const unregister = ctx.webServer.registerUpgrade({
      path,
      handler(request, socket, head) {
        const admission = ctx.connection.admit(request)
        if ('rejection' in admission) {
          reject(socket, admission.rejection === 401 ? '401 Unauthorized' : '403 Forbidden')
          return
        }
        if (!Object.is(admission.peer.principal.kind, 'owner') || admission.peer.signal.aborted) {
          reject(socket, '403 Forbidden')
          return
        }
        const address = request.socket.remoteAddress
        if (ctx.webServer.protocol !== 'https:' && address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') {
          reject(socket, '403 Forbidden')
          return
        }
        const query = new URL(request.url ?? '/', 'http://localhost').searchParams
        const id = query.get('ssh') ?? ''
        const rawPort = query.get('port') ?? ''
        const port = Number(rawPort)
        if (!/^\d{1,5}$/u.test(rawPort) || port < 1 || port > 65535) {
          reject(socket, '404 Not Found')
          return
        }
        const connection = lookup(id, String(admission.peer.id))
        if (connection === void 0 || connection.signal.aborted) {
          reject(socket, '404 Not Found')
          return
        }
        const previous = active.get(id)
        active.set(id, socket)
        socket.once('close', () => {
          if (active.get(id) === socket) active.delete(id)
        })
        previous?.destroy()
        forward(connection, port, request, socket, head, server)
      }
    })
    return async () => {
      unregister()
      const closing = [...active.values()].map(socket => new Promise((resolve) => {
        socket.once('close', resolve)
        socket.destroy()
      }))
      await Promise.all([new Promise((resolve) => {
        server.close(() => {
          resolve()
        })
      }), ...closing])
    }
  }, 'HEY Operations: remote desktop transport')
}
