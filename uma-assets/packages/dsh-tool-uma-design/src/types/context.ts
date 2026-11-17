/**
 * 【逆向还原】由 `lib/rules-B-6_mXU8.js` 的 `//#region lib/types/context.js` 反推，
 * 非 DeepSeek 原始源码。hash 命名模块与原名的映射见 src/README.md。
 *
 * 还原依据：esbuild bundle 保留的 region 边界 + 逐行等价的控制流。
 * 类型注解 / interface 从用法反推；逻辑、字符串、错误文本与 lib 逐字一致。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */
import { createHash } from 'node:crypto'

/** ctx.fs.resolve 返回的路径句柄；原始类型来自 dsh-fs，这里只列出被读取到的成员。 */
interface ResolvedPath {
  displayPath: string
}

/** ctx.fs.lstat / ctx.fs.stat 返回的文件信息最小形状。 */
interface FsInfo {
  type?: string
  size?: number
  version?: number
}

/** readDesignContext 依赖的 ctx 最小形状（cordis Context + dsh-fs 扩展，原始定义不可得）。 */
export interface DesignContextHost {
  workingDirectory: {
    ensure(agent: unknown, signal: AbortSignal): Promise<string>
  }
  fs: {
    resolve(path: string, options: { cwd: string; signal: AbortSignal }): Promise<ResolvedPath>
    lstat(path: string, options: { cwd: string }, signal: AbortSignal): Promise<FsInfo | undefined>
    contains(root: ResolvedPath, target: ResolvedPath): boolean
    readBytes(target: ResolvedPath, signal: AbortSignal, max: number): Promise<Uint8Array>
    stat(target: ResolvedPath, signal: AbortSignal): Promise<FsInfo | undefined>
  }
}

/** 工具执行上下文的最小形状。 */
interface DesignExec {
  agent?: unknown
  signal: AbortSignal
}

/** design_context 的入参形状。 */
interface DesignContextRequest {
  target?: string
  project?: string
  page?: string
}

/** 每文件 / 总结果的传输预算。 */
interface DesignContextLimits {
  fileBytes: number
  totalBytes: number
}

/** 单个输入文件的读取状态。 */
type DesignFileState = 'missing' | 'non-file' | 'oversized' | 'budget-exceeded' | 'read'

interface DesignFile {
  path: string
  content: string
  sha256: string
  state: DesignFileState
}

/** readDesignContext 的返回体。 */
export interface DesignContextResult {
  target: string
  project: string
  files: DesignFile[]
  declaredStack: string[]
  hasDesign: boolean
  complete: boolean
  fingerprint: string
}

/** Bounded design inputs from the selected execution directory; reads never create or replace a design. */
const INPUTS: string[] = [
  'PRODUCT.md',
  'DESIGN.md',
  'DESIGN.json',
  'tokens.css',
  'components.json',
  'package.json',
  'design-system/MASTER.md',
]
const PROJECT_INPUTS: string[] = [
  'PROJECT.md',
  'DESIGN.md',
  'tokens.css',
  'manifest.json',
  'REVIEW.md',
]
const FRAMEWORKS: string[] = [
  'react',
  'vue',
  'next',
  'nuxt',
  'svelte',
  '@angular/core',
  'electron',
  '@tauri-apps/api',
  'react-native',
  'tailwindcss',
  '@radix-ui/react-dialog',
  '@mui/material',
  'antd',
]

function relativeDirectory(value: string): string {
  if (value === '.') return ''
  if (value.length === 0 || value.includes('\\') || value.includes('\0') || value.startsWith('/') || value.includes(':') || value.split('/').some((part) => part === '.' || part === '..' || part === '')) throw new Error('design_context: target must be a relative directory without parent segments')
  return value
}

function stackFrom(text: string): string[] {
  const parsed: unknown = JSON.parse(text)
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('design_context: package.json must contain an object')
  const record = parsed as Record<string, unknown>
  const names = new Set<string>()
  for (const key of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ]) {
    const dependencies = record[key]
    if (dependencies === void 0) continue
    if (typeof dependencies !== 'object' || dependencies === null || Array.isArray(dependencies)) throw new Error(`design_context: package.json ${key} must contain an object`)
    for (const [name, version] of Object.entries(dependencies)) {
      if (typeof version !== 'string') throw new Error(`design_context: package.json dependency ${name} must have a string version`)
      names.add(name)
    }
  }
  return FRAMEWORKS.filter((name) => names.has(name))
}

/**
 * Read existing design evidence before selecting a bundled system or changing UI.
 * @param ctx - Filesystem and current working-directory services.
 * @param exec - Actual tool execution, including cancellation and Session identity.
 * @param request - Optional monorepo target and explicitly selected design project.
 * @param limits - Per-file and per-result transfer budgets.
 * @returns Exact text and hashes, explicit omissions and declared framework names; no visual quality verdict.
 */
export async function readDesignContext(ctx: DesignContextHost, exec: DesignExec, request: DesignContextRequest, limits: DesignContextLimits): Promise<DesignContextResult> {
  if (exec.agent === void 0) throw new Error('design_context requires an agent Session')
  const target = relativeDirectory(request.target ?? '.')
  if (request.project !== void 0 && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(request.project)) throw new Error('design_context: project must be kebab-case')
  if (request.page !== void 0 && (request.project === void 0 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(request.page))) throw new Error('design_context: page requires an explicit project and a kebab-case page id')
  const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal)
  const root = await ctx.fs.resolve('.', {
    cwd,
    signal: exec.signal,
  })
  const paths = [...INPUTS]
  if (target !== '') paths.push(...INPUTS.map((name) => `${target}/${name}`))
  if (request.project !== void 0) {
    paths.push(...PROJECT_INPUTS.map((name) => `.design/${request.project}/${name}`))
    paths.push(`design-system/${request.project}/MASTER.md`)
    if (request.page !== void 0) paths.push(`design-system/${request.project}/pages/${request.page}.md`)
  }
  const files: DesignFile[] = []
  let remaining = limits.totalBytes
  for (const path of paths) {
    exec.signal.throwIfAborted()
    const parents = path.split('/').slice(0, -1)
    for (let depth = 1; depth <= parents.length; depth++) {
      const parent = await ctx.fs.lstat(parents.slice(0, depth).join('/'), { cwd }, exec.signal)
      if (parent !== void 0 && parent.type !== 'directory') throw new Error(`design_context: expected a regular directory at ${parents.slice(0, depth).join('/')}`)
    }
    const info = await ctx.fs.lstat(path, { cwd }, exec.signal)
    const file = {
      path,
      content: '',
      sha256: '',
    }
    if (info === void 0) {
      files.push({
        ...file,
        state: 'missing',
      })
      continue
    }
    if (info.type !== 'file') {
      files.push({
        ...file,
        state: 'non-file',
      })
      continue
    }
    if (info.size !== void 0 && info.size > limits.fileBytes) {
      files.push({
        ...file,
        state: 'oversized',
      })
      continue
    }
    if (remaining === 0 || info.size !== void 0 && info.size > remaining) {
      files.push({
        ...file,
        state: 'budget-exceeded',
      })
      continue
    }
    const resolved = await ctx.fs.resolve(path, {
      cwd,
      signal: exec.signal,
    })
    if (!ctx.fs.contains(root, resolved)) throw new Error(`design_context: path leaves the execution directory: ${path}`)
    const bytes = await ctx.fs.readBytes(resolved, exec.signal, Math.min(limits.fileBytes, remaining))
    const content = new TextDecoder('utf-8', { fatal: true }).decode(bytes)
    if (content.includes('\0')) throw new Error(`design_context: expected UTF-8 text at ${path}`)
    if ((await ctx.fs.stat(resolved, exec.signal))?.version !== info.version) throw new Error(`design_context: ${path} changed while reading; inspect again`)
    remaining -= bytes.byteLength
    files.push({
      path,
      state: 'read',
      content,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    })
  }
  const declaredStack = [...new Set(files.filter((file) => file.path.endsWith('package.json') && file.state === 'read').flatMap((file) => stackFrom(file.content)))]
  return {
    target: target || '.',
    project: request.project ?? '',
    files,
    declaredStack,
    hasDesign: files.some((file) => /(?:^|\/)(?:DESIGN|MASTER)\.md$/u.test(file.path) && file.state === 'read' && file.content.trim().length > 0),
    complete: files.every((file) => file.state === 'read' || file.state === 'missing'),
    fingerprint: createHash('sha256').update(JSON.stringify(files.map((file) => [
      file.path,
      file.state,
      file.sha256,
    ]))).digest('hex'),
  }
}
