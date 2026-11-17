/**
 * 【逆向还原】由 `lib/automatic.js` 的 `//#region lib/types/route.js` 反推，
 * 非 DeepSeek 原始源码。
 *
 * 还原依据：esbuild bundle 保留的 region 边界 + 逐行等价的控制流。
 * zod 在 bundle 中被重命名为 `z$1`（schemastery 占用了 `z`），这里保留该别名以便对照。
 * 类型注解 / interface 从用法反推；逻辑、字符串、正则与 lib 逐字一致。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */
import { z as z$1 } from 'zod'

/** Recoverable UI task routing from admitted human requests, with semantic activation by the Agent. */
/** Supported design surface modes. */
export const DESIGN_MODES = [
  'operate',
  'persuade',
  'read',
  'experience',
] as const

/** Design task phases supported by automatic and semantic routing. */
export const DESIGN_PHASES = [
  'create',
  'refine',
  'review',
  'implement',
] as const

type DesignMode = typeof DESIGN_MODES[number]
type DesignPhase = typeof DESIGN_PHASES[number]
type DesignOrigin = 'none' | 'human' | 'agent'

/** 可恢复的路由状态。 */
export interface DesignRouteState {
  active: boolean
  origin: DesignOrigin
  mode: DesignMode
  phase: DesignPhase
  project: string | null
  brief: string
}

/** 消息块的最小形状；非 text 块不参与文本拼接。 */
interface MessageBlock {
  type: string
  text?: string
}

/** 进入路由的消息。 */
export interface DesignMessage {
  source: { kind: string }
  content: MessageBlock[]
}

/** tool/call 事件的实参为 JSON 字符串。 */
interface ToolCallData {
  name?: string
  arguments: string
}

/** tool/ptc-dispatch 事件的实参已是已解析对象。 */
interface PtcDispatchData {
  name?: string
  isError?: boolean
  arguments: Record<string, unknown>
}

/** fold 消费的事件联合类型。 */
type DesignEvent =
  | { type: 'user/message'; data: DesignMessage; surfaceOp?: unknown }
  | { type: 'tool/call'; data: ToolCallData }
  | { type: 'tool/ptc-dispatch'; data: PtcDispatchData }

/** Bounded task state; preparation effects are never replayed by this fold. */
const designRouteSchema = z$1.object({
  active: z$1.boolean(),
  origin: z$1.enum([
    'none',
    'human',
    'agent',
  ]),
  mode: z$1.enum(DESIGN_MODES),
  phase: z$1.enum(DESIGN_PHASES),
  project: z$1.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u).nullable(),
  brief: z$1.string().max(4e3),
})

/** Empty routing state before a UI request. */
export const EMPTY_DESIGN_ROUTE: DesignRouteState = {
  active: false,
  origin: 'none',
  mode: 'operate',
  phase: 'create',
  project: null,
  brief: '',
}

function anyPattern(patterns: RegExp[]): RegExp {
  return new RegExp(patterns.map((pattern) => pattern.source).join('|'), 'iu')
}

const SURFACE = anyPattern([/界面|页面|前端|网页|网站|官网|落地页|仪表盘|看板|后台|控制台|小程序|应用|客户端|侧栏|菜单|按钮|对话框|输入框|排版|配色|字体|设计稿/, /\bhtml\b|\b(?:ui|ux|frontend|front-end|website|landing page|dashboard|app|interface|screen|sidebar|modal|button|form)\b(?![./\\])/])
const ACTION = anyPattern([/设计|做一|做个|做套|帮我做|实现|开发|搭建|改|优化|美化|重做|调整|生成|制作|修复|帮我写|写一个/, /\b(?:build|create|make|write|implement|redesign|restyle|polish|improve|fix|review|audit)\b/])
const BACKEND_ONLY = /数据库|后端|接口|算法|数据结构|\b(?:database|backend|api|algorithm|schema)\b/iu
const STOP = /(?:不要|不用|停止|退出|取消)[^，,。;；!?！？\n]{0,8}(?:设计|ui|界面)|\b(?:stop|disable|exit|cancel)\s+(?:the\s+)?(?:design|ui)\b/iu
const DISCUSSION = anyPattern([
  /(?:是什么|是什么意思|介绍一下|区别|原理|如何实现|是不是|为什么).{0,12}(?:设计系统|设计模式)/,
  /(?:设计系统|设计模式).{0,12}(?:是什么|原理|区别)/,
  /\b(?:what is|explain|difference between)\b/,
])
const FOLLOWUP = anyPattern([/^(?:再|然后|还是|这[个里套张]|第[一二三四五六七八九十\d]+[套张个]|用第|换成|改成|调成|放大|缩小|加上|增加|删掉|去掉|去除|保留|继续|就用|不好看|太丑)/, /\b(?:make it|use option|keep the|change it|continue|smaller|larger)\b/])

function bounded(text: string): string {
  if (text.length <= 4e3) return text
  let head = 2e3
  let tail = text.length - 1999
  if (text.charCodeAt(head) >= 56320 && text.charCodeAt(head) <= 57343) head--
  if (text.charCodeAt(tail) >= 56320 && text.charCodeAt(tail) <= 57343) tail++
  return `${text.slice(0, head)}\n${text.slice(tail)}`
}

function modeFor(text: string, previous: DesignRouteState): DesignMode {
  if (/官网|落地页|营销|\b(?:landing|marketing|website)\b/iu.test(text)) return 'persuade'
  if (/文档站|阅读|博客|\b(?:documentation|article|blog)\b/iu.test(text)) return 'read'
  if (/作品集|画廊|\b(?:portfolio|gallery)\b/iu.test(text)) return 'experience'
  return previous.active ? previous.mode : 'operate'
}

/**
 * Preview a human request without changing persisted state or executing a workflow.
 * @param state - Last recovered UI task.
 * @param message - Claimed or committed message; only direct human input can route automatically.
 * @returns Updated task, or the original state for unrelated reference/tool messages.
 */
export function routeDesignMessage(state: DesignRouteState, message: DesignMessage): DesignRouteState {
  if (message.source.kind !== 'user') return state
  const text = message.content.flatMap((block) => block.type === 'text' ? [block.text] : []).join('\n').trim()
  if (text === '') return state
  if (STOP.test(text)) return { ...EMPTY_DESIGN_ROUTE }
  const surface = SURFACE.test(text)
  const designVerb = /^(?:please\s+)?design\b|\bdesign\s+(?:me\s+)?(?:an?|the|our|this)\b/iu.test(text)
  if (!DISCUSSION.test(text) && (ACTION.test(text) || designVerb) && (surface || /设计(?:一个|一套|个|套)/u.test(text) && !BACKEND_ONLY.test(text))) return {
    active: true,
    origin: state.active && state.origin === 'agent' ? 'agent' : 'human',
    mode: modeFor(text, state),
    project: /\.design\/([a-z0-9]+(?:-[a-z0-9]+)*)\//u.exec(text)?.[1] ?? state.project,
    phase: /项目前端|落地.{0,12}前端|\bimplement.{0,40}frontend|frontend.{0,40}approved\b/iu.test(text) ? 'implement' : /检查|审查|走查|验收|\b(?:review|audit)\b/iu.test(text) ? 'review' : /改|优化|美化|重做|调整|\b(?:fix|redesign|restyle|polish|improve)\b/iu.test(text) ? 'refine' : 'create',
    brief: bounded(text),
  }
  if (state.active && FOLLOWUP.test(text) && !BACKEND_ONLY.test(text)) return {
    ...state,
    phase: 'refine',
    brief: bounded(`${state.brief}\nLatest request: ${text}`),
  }
  const newTopic = /换个话题|另外一件事|新任务|天气|翻译|\b(?:weather|translate|new task|instead)\b/iu.test(text)
  if (state.active && (BACKEND_ONLY.test(text) || ACTION.test(text) || newTopic)) return { ...EMPTY_DESIGN_ROUTE }
  return state.active ? {
    ...state,
    brief: bounded(`${state.brief}\nUser answer: ${text}`),
  } : state
}

const beginSchema = z$1.object({
  brief: z$1.string().trim().min(1).max(4e3),
  mode: z$1.enum(DESIGN_MODES),
  phase: z$1.enum(DESIGN_PHASES).optional(),
  project: z$1.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u).optional(),
})

function fold(state: DesignRouteState, event: DesignEvent): DesignRouteState {
  if (event.type === 'user/message') {
    if (event.data.source.kind !== 'user') return state
    return routeDesignMessage(typeof event.surfaceOp === 'object' ? EMPTY_DESIGN_ROUTE : state, event.data)
  }
  if (event.type !== 'tool/call' && event.type !== 'tool/ptc-dispatch') return state
  if (event.type === 'tool/ptc-dispatch' && event.data.isError) return state
  if (event.data.name === 'design_stop') return { ...EMPTY_DESIGN_ROUTE }
  const selectingProject = state.active && state.project === null && (event.data.name === 'design_project_create' || event.data.name === 'design_context')
  if (event.data.name !== 'design_begin' && !selectingProject) return state
  let args: unknown
  if (event.type === 'tool/ptc-dispatch') args = event.data.arguments
  else try {
    args = JSON.parse(event.data.arguments)
  }
  catch (error) {
    return state
  }
  if (selectingProject) {
    const selected = z$1.object({ project: z$1.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u) }).safeParse(args)
    return selected.success ? {
      ...state,
      project: selected.data.project,
    } : state
  }
  const parsed = beginSchema.safeParse(args)
  return parsed.success ? {
    active: true,
    origin: 'agent',
    ...parsed.data,
    phase: parsed.data.phase ?? 'create',
    project: parsed.data.project ?? null,
  } : state
}

/** Host-only routing projection; resume restores intent without rerunning preparation. */
export const designTaskProjection = {
  key: 'umaDesignTask',
  stateVersion: 6,
  stateSchema: designRouteSchema,
  init: () => EMPTY_DESIGN_ROUTE,
  apply: fold,
}
