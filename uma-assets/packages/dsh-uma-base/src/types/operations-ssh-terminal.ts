/**
 * 【逆向还原】由 `lib/operations-ssh.js` 的 `//#region lib/types/operations-ssh-terminal.js` 反推，非 DeepSeek 原始源码。
 *
 * 原本被 esbuild 内联进 bundle，本文件按 //#region 边界拆成独立模块；跨模块引用的
 * handleOperationsFiles / isOperationsFileAction / mountOperationsDesktop 改为 import。
 * 逻辑与 lib 逐行等价（控制流、字符串、限额常数一律未改）；外部库（ssh2 / Node net / ws）
 * 形状无 .d.ts 可校验处用 any 并加注释。运行时仍以 lib/*.js 为准，改动本文件后需手动同步回 lib，
 * 无构建链，详见 src/README.md。
 */
import { createHash, randomUUID } from 'node:crypto'
import { Socket } from 'node:net'
import { Client } from 'ssh2'
import { parseUmaSshTarget, umaSshUri } from '@deepseek-ai/dsh-util-uma-delivery'
import {
  handleOperationsFiles,
  isOperationsFileAction,
  isOperationsInspection,
  operationsInspections,
  operationsManagementCommand
} from './operations-files.ts'
import { mountOperationsDesktop } from './operations-desktop.ts'

interface SshTarget {
  user: string
  host: string
  port: number
}

interface SshConnectConfig {
  username: string
  host: string
  port: number
  password?: string
  privateKey?: string
  passphrase?: string
  agent?: string
  readyTimeout: number
  keepaliveInterval: number
  agentForward: boolean
  hostVerifier: (key: Buffer) => boolean
}

interface SshRequestBody {
  destination?: unknown
  fingerprint?: unknown
  password?: unknown
  privateKey?: unknown
  passphrase?: unknown
  auth?: unknown
  kind?: unknown
  action?: unknown
  name?: unknown
  data?: unknown
  cols?: unknown
  rows?: unknown
  [key: string]: unknown
}

interface TerminalShell {
  writableLength: number
  write(data: string): boolean
  setWindow(rows: number, cols: number, width: number, height: number): void
  pipe<T>(dest: T): T
  unpipe(dest: unknown): void
  pause(): void
  on(event: string, cb: (...args: any[]) => void): unknown
  once(event: string, cb: (...args: any[]) => void): unknown
}

interface TerminalResponse {
  destroyed: boolean
  writableEnded: boolean
  headersSent: boolean
  writeHead(status: number, headers?: Record<string, string | number>): void
  flushHeaders(): void
  end(body?: string): void
  once(event: string, cb: (...args: any[]) => void): unknown
  off(event: string, cb: (...args: any[]) => void): unknown
  destroy(): void
}

interface TerminalRequest {
  method: string
  url?: string
  socket: { remoteAddress?: string }
  [Symbol.asyncIterator](): AsyncIterator<unknown>
}

/** 已建立的终端连接（字段来自建立流程中的赋值，见 terminal 对象字面量）。 */
interface TerminalConnection {
  owner: string
  client: Client
  shell: TerminalShell
  target: SshTarget
  signal: AbortSignal
  stream?: TerminalResponse
  credentialLookahead: number
  redactCredential(output: string): string
  onFirstAttach(): void
  close(): void
}

type TerminalAdmission = { rejection: number } | {
  peer: {
    principal: { kind: string }
    signal: AbortSignal
    id: string | number
  }
}

interface TerminalScope {
  effect(callback: () => (() => Promise<void>) | Promise<void>, label?: string): void
  connection: { admit(request: TerminalRequest): TerminalAdmission }
  webServer: {
    protocol: string
    register(options: {
      kind: string
      path: string
      handler(request: TerminalRequest, response: TerminalResponse): Promise<void>
    }): () => void
  }
}

interface TerminalContext {
  inject(services: string[], callback: (scope: TerminalScope) => void): void
}

/** Authenticated SSH connections used by the embedded terminal and the delegated command tool. */
const path = '/hey/operations/ssh'
const maxBody = 128 * 1024
const maxConnections = 8
const handshakeMs = 15e3
const terminalLifetimeMs = 3600 * 1e3

function reply(response: TerminalResponse, status: number, body: unknown = {}): void {
  if (response.headersSent || response.destroyed) return
  response.writeHead(status, {
    'content-type': 'application/json',
    'cache-control': 'no-store'
  })
  response.end(JSON.stringify(body))
}

async function readBody(request: TerminalRequest): Promise<SshRequestBody> {
  const chunks: Buffer[] = []
  let bytes = 0
  for await (const chunk of request) {
    const data = Buffer.from(chunk as Uint8Array)
    bytes += data.byteLength
    if (bytes > maxBody) throw new Error('Request too large')
    chunks.push(data)
  }
  const value: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid SSH request')
  return value as SshRequestBody
}

/** Run a separate command channel on the same authenticated SSH connection.
 * @param connection - Established SSH connection.
 * @param command - Command for the remote shell.
 * @param signal - Channel cancellation.
 * @param maxBytes - Maximum retained bytes per output stream.
 * @returns Bounded output and the server-reported exit status.
 */
export async function runConnectedSsh(connection: TerminalConnection, command: string, signal: AbortSignal, maxBytes: number): Promise<{
  exitCode: number
  stdout: string
  stderr: string
  truncated: boolean
}> {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const captureBytes = maxBytes + connection.credentialLookahead
    const sanitize = (bytes: Buffer) => Buffer.from(connection.redactCredential(bytes.toString('utf8'))).subarray(0, maxBytes).toString('utf8')
    let channel: any
    let exitCode: number | undefined
    let stdout = Buffer.alloc(0)
    let stderr = Buffer.alloc(0)
    let truncated = false
    const finish = () => {
      signal.removeEventListener('abort', abort)
    }
    const abort = () => {
      channel?.close()
      finish()
      const reason = signal.reason
      reject(reason instanceof Error ? reason : new Error('SSH operation was cancelled', { cause: reason }))
    }
    signal.addEventListener('abort', abort, { once: true })
    const executed = (error: any, stream: any) => {
      if (error) {
        finish()
        reject(error)
        return
      }
      channel = stream
      stream.on('error', (error: unknown) => {
        finish()
        reject(error)
      })
      if (signal.aborted) {
        abort()
        return
      }
      const append = (previous: Buffer, chunk: Buffer) => {
        const remaining = captureBytes - previous.byteLength
        if (previous.byteLength + chunk.byteLength > maxBytes) truncated = true
        return remaining === 0 ? previous : Buffer.concat([previous, chunk.subarray(0, remaining)])
      }
      stream.on('data', (chunk: Buffer) => {
        stdout = append(stdout, chunk)
      })
      stream.stderr.on('data', (chunk: Buffer) => {
        stderr = append(stderr, chunk)
      })
      stream.on('exit', (code: number) => {
        exitCode = code
      })
      stream.once('close', () => {
        finish()
        if (exitCode === void 0) reject(new Error('SSH command channel closed without an exit status'))
        else resolve({
          exitCode,
          stdout: sanitize(stdout),
          stderr: sanitize(stderr),
          truncated
        })
      })
      stream.end()
    }
    try {
      connection.client.exec(command, executed)
    }
    catch (error) {
      finish()
      reject(error instanceof Error ? error : new Error('Unable to start SSH command', { cause: error }))
    }
  })
}

function options(body: SshRequestBody, fingerprint: (value: string) => void): { target: SshTarget; config: SshConnectConfig } | undefined {
  if (typeof body.destination !== 'string') return void 0
  const target = parseUmaSshTarget(body.destination)
  const expected = typeof body.fingerprint === 'string' ? body.fingerprint.trim() : ''
  if (target === void 0 || expected !== '' && !/^SHA256:[A-Za-z0-9+/]{43}$/u.test(expected)) return void 0
  const password = typeof body.password === 'string' && body.password.length <= 4096 ? body.password : void 0
  const privateKey = typeof body.privateKey === 'string' && body.privateKey.length <= 64 * 1024 ? body.privateKey : void 0
  const passphrase = typeof body.passphrase === 'string' && body.passphrase.length <= 4096 ? body.passphrase : void 0
  const agent = process.env.SSH_AUTH_SOCK
  let authentication: Partial<SshConnectConfig>
  switch (body.auth) {
    case 'password':
      if (password === void 0 || password === '') return void 0
      authentication = { password }
      break
    case 'key':
      if (privateKey === void 0 || privateKey === '') return void 0
      authentication = {
        privateKey,
        ...passphrase === void 0 ? {} : { passphrase }
      }
      break
    case 'agent':
      if (!agent) return void 0
      authentication = { agent }
      break
    default: return
  }
  return {
    target,
    config: {
      username: target.user,
      host: target.host,
      port: target.port,
      ...authentication,
      readyTimeout: handshakeMs,
      keepaliveInterval: 15e3,
      agentForward: false,
      hostVerifier: (key) => {
        const actual = 'SHA256:' + createHash('sha256').update(key).digest('base64').replace(/=+$/u, '')
        if (actual === expected) return true
        fingerprint(actual)
        return false
      }
    }
  }
}

/** Publish a local authenticated terminal transport and connection lookup.
 * @param ctx - Host browser transport owner.
 * @param transferBytes - Maximum bytes for each file transfer.
 * @returns Lookup for authenticated connections owned by the local browser.
 */
export function installOperationsTerminal(ctx: TerminalContext, transferBytes: number): (id: string) => TerminalConnection | undefined {
  let currentConnections: Map<string, TerminalConnection> | undefined
  ctx.inject(['webServer', 'connection'], (scope) => {
    const connections = new Map<string, TerminalConnection>()
    mountOperationsDesktop(scope as any, (id, owner) => {
      const connection = connections.get(id)
      return connection?.owner === owner ? connection : void 0
    })
    scope.effect(() => {
      const stopping = new AbortController()
      const opening = new Set<Socket>()
      const sockets = new Map<Socket, Promise<void>>()
      const requests = new Map<TerminalResponse, Promise<void>>()
      const access = scope.connection
      const webServer = scope.webServer
      const handle = async (request: TerminalRequest, response: TerminalResponse): Promise<void> => {
        const admission = access.admit(request)
        if ('rejection' in admission) {
          reply(response, admission.rejection)
          return
        }
        const peer = admission.peer
        if (!Object.is(peer.principal.kind, 'owner')) {
          reply(response, 403)
          return
        }
        const address = request.socket.remoteAddress
        if (webServer.protocol !== 'https:' && address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') {
          reply(response, 403)
          return
        }
        const owner = String(peer.id)
        const url = new URL(request.url ?? '/', 'http://local.invalid')
        const pathname = url.pathname
        const admissionStatus = () => stopping.signal.aborted ? 503 : peer.signal.aborted ? 401 : void 0
        try {
          const blocked = admissionStatus()
          if (blocked !== void 0) {
            reply(response, blocked)
            return
          }
          if (pathname === path && request.method === 'POST') {
            if (connections.size + opening.size >= maxConnections) {
              reply(response, 429)
              return
            }
            const body = await readBody(request)
            const blockedAfterRead = admissionStatus()
            if (blockedAfterRead !== void 0) {
              reply(response, blockedAfterRead)
              return
            }
            if (connections.size + opening.size >= maxConnections) {
              reply(response, 429)
              return
            }
            let hostFingerprint: string | undefined
            const input = options(body, (value) => {
              hostFingerprint = value
            })
            if (input === void 0) {
              reply(response, 400)
              return
            }
            const client = new Client()
            const socket = new Socket()
            const controller = new AbortController()
            const disconnectBeforeReady = () => {
              socket.destroy()
            }
            const openingDeadline = setTimeout(disconnectBeforeReady, handshakeMs)
            openingDeadline.unref()
            opening.add(socket)
            sockets.set(socket, new Promise((resolve) => {
              socket.once('close', () => {
                sockets.delete(socket)
                resolve()
              })
            }))
            socket.on('error', () => {})
            peer.signal.addEventListener('abort', disconnectBeforeReady, { once: true })
            let terminal: TerminalConnection | undefined
            response.once('close', disconnectBeforeReady)
            const dispose = () => {
              clearTimeout(openingDeadline)
              peer.signal.removeEventListener('abort', disconnectBeforeReady)
              opening.delete(socket)
              if (!response.writableEnded && !response.destroyed) reply(response, 502)
              if (!controller.signal.aborted) terminal?.close()
            }
            socket.once('close', dispose)
            client.on('error', () => {
              if (!response.writableEnded && !response.destroyed) reply(response, hostFingerprint === void 0 ? 502 : 409, hostFingerprint === void 0 ? {} : { fingerprint: hostFingerprint })
              dispose()
              socket.destroy()
            })
            client.once('ready', () => {
              client.shell({
                term: 'xterm-256color',
                cols: 90,
                rows: 26
              }, (error, shell) => {
                if (error) {
                  if (!response.destroyed && !response.writableEnded) reply(response, 502)
                  socket.destroy()
                  return
                }
                if (response.destroyed || response.writableEnded || stopping.signal.aborted) {
                  socket.destroy()
                  return
                }
                const id = randomUUID()
                const attachDeadline = setTimeout(() => {
                  terminal?.close()
                }, handshakeMs)
                const expires = setTimeout(() => {
                  terminal?.close()
                }, terminalLifetimeMs)
                attachDeadline.unref()
                expires.unref()
                const secrets = [input.config.password, input.config.passphrase].filter((value): value is string => typeof value === 'string' && value !== '').sort((a, b) => b.length - a.length)
                terminal = {
                  owner,
                  client,
                  shell,
                  target: input.target,
                  signal: controller.signal,
                  stream: void 0,
                  credentialLookahead: Math.max(0, ...secrets.map(value => Buffer.byteLength(value) - 1)),
                  redactCredential: (output) => secrets.reduce((text, value) => text.replaceAll(value, '[redacted]'), output),
                  onFirstAttach: () => {
                    clearTimeout(attachDeadline)
                  },
                  close: () => {
                    if (controller.signal.aborted) return
                    connections.delete(id)
                    controller.abort()
                    clearTimeout(attachDeadline)
                    clearTimeout(expires)
                    socket.destroy()
                  }
                }
                shell.on('error', terminal.close)
                shell.once('close', terminal.close)
                clearTimeout(openingDeadline)
                opening.delete(socket)
                connections.set(id, terminal)
                response.off('close', disconnectBeforeReady)
                reply(response, 201, {
                  id,
                  destination: umaSshUri(input.target)
                })
              })
            })
            try {
              socket.connect(input.target.port, input.target.host)
              client.connect({
                ...input.config,
                sock: socket
              })
            }
            catch (_error) {
              clearTimeout(openingDeadline)
              opening.delete(socket)
              response.off('close', disconnectBeforeReady)
              socket.destroy()
              reply(response, 400)
            }
            return
          }
          const route = /^\/hey\/operations\/ssh\/([a-f0-9-]+)\/([a-z]+)$/u.exec(pathname)
          const connection = route?.[1] === void 0 ? void 0 : connections.get(route[1])
          if (route === null || connection === void 0 || connection.owner !== owner) {
            reply(response, 404)
            return
          }
          const action = route[2]
          if (isOperationsFileAction(action)) {
            await handleOperationsFiles(action, request, response as any, url, connection as any, transferBytes)
            return
          }
          if (action === 'output' && request.method === 'GET') {
            const previous = connection.stream
            if (previous !== void 0 && !previous.destroyed && !previous.writableEnded) {
              reply(response, 409)
              return
            }
            connection.stream = response
            connection.onFirstAttach()
            response.writeHead(200, {
              'content-type': 'application/octet-stream',
              'cache-control': 'no-store, no-transform',
              'x-content-type-options': 'nosniff'
            })
            response.flushHeaders()
            const end = () => {
              response.end()
            }
            connection.signal.addEventListener('abort', end, { once: true })
            response.once('close', () => {
              connection.signal.removeEventListener('abort', end)
              if (connection.stream !== response) return
              connection.shell.unpipe(response)
              connection.shell.pause()
              connection.stream = void 0
            })
            connection.shell.pipe(response)
            return
          }
          if (request.method !== 'POST') {
            reply(response, 405)
            return
          }
          if (action === 'close') {
            connection.close()
            reply(response, 200)
            return
          }
          const body = await readBody(request)
          connection.signal.throwIfAborted()
          if (action === 'inspect' || action === 'manage') {
            const command = action === 'inspect' ? isOperationsInspection(body.kind) ? operationsInspections[body.kind as string] : void 0 : operationsManagementCommand(body.kind, body.action, body.name)
            if (command === void 0) {
              reply(response, 400)
              return
            }
            const cancelled = new AbortController()
            const abort = () => {
              cancelled.abort()
            }
            response.once('close', abort)
            try {
              const result = await runConnectedSsh(connection, command, AbortSignal.any([
                connection.signal,
                cancelled.signal,
                AbortSignal.timeout(action === 'inspect' ? 1e4 : 6e4)
              ]), 16384)
              if (!response.destroyed) reply(response, 200, result)
            }
            catch (_error) {
              if (!response.destroyed) reply(response, 502)
            }
            finally {
              response.off('close', abort)
            }
            return
          }
          if (action === 'input' && typeof body.data === 'string' && body.data.length <= 8192 && connection.shell.writableLength <= maxBody) connection.shell.write(body.data)
          else if (action === 'resize' && typeof body.cols === 'number' && typeof body.rows === 'number' && Number.isInteger(body.cols) && Number.isInteger(body.rows) && body.cols >= 2 && body.cols <= 400 && body.rows >= 2 && body.rows <= 200) connection.shell.setWindow(body.rows, body.cols, 0, 0)
          else {
            reply(response, 400)
            return
          }
          reply(response, 200)
        }
        catch (_error) {
          if (!response.writableEnded && !response.destroyed) reply(response, 400)
        }
      }
      const unregister = webServer.register({
        kind: 'prefix',
        path,
        async handler(request, response) {
          const pending = handle(request, response)
          requests.set(response, pending)
          try {
            await pending
          }
          finally {
            requests.delete(response)
          }
        }
      })
      currentConnections = connections
      return async () => {
        if (currentConnections === connections) currentConnections = void 0
        stopping.abort()
        unregister()
        for (const response of requests.keys()) response.destroy()
        await Promise.allSettled(requests.values())
        for (const connection of connections.values()) connection.close()
        for (const socket of opening) socket.destroy()
        await Promise.allSettled(sockets.values())
      }
    }, 'HEY SSH: authenticated terminal route')
  })
  return (id) => {
    const connection = currentConnections?.get(id)
    return connection?.stream === void 0 ? void 0 : connection
  }
}
