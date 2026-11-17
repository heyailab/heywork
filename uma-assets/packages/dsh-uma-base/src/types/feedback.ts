/**
 * 【逆向还原】由 `lib/feedback.js` 的 `//#region lib/types/feedback.js` 反推，非 DeepSeek 原始源码。
 *
 * imports 取自 lib bundle 顶部并按需分配；逻辑与 lib 逐行等价（控制流、字符串、错误文本一律未改）。
 * 类型注解由用法反推。运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，无构建链，详见 src/README.md。
 */
import { createHash } from 'node:crypto'
import { CommandDefinitionId } from '@deepseek-ai/dsh-commands/brand'
import { recordFeedback } from '@deepseek-ai/dsh-command-feedback'
import z from '@deepseek-ai/schemastery'

/** 提交结果：成功返回工单链接，失败返回可见错误文案。 */
interface FeedbackResult {
  kind: 'error' | 'success'
  text: string
}

interface FeedbackConfig {
  origin: string
  allowLoopbackHttp: boolean
  requestTimeoutMs: number
}

interface PlatformSession {
  origin: string
  authenticatePage: boolean
  requestHeaders: Record<string, string>
  token: string
}

interface FeedbackAccount {
  getPlatformSession(): Promise<PlatformSession | null>
}

interface FeedbackInvocation {
  rawInput: string
  signal: AbortSignal
  sessionId: string
  commandId: string
  agent: { id: string; session: unknown }
}

interface FeedbackCommand {
  definitionId: string
  name: string
  description: string
  input: { hint: string }
  recordInput: boolean
  handler(invocation: FeedbackInvocation): Promise<FeedbackResult>
}

interface FeedbackContext {
  effect(callback: () => unknown, label?: string): void
  commands: { register(command: FeedbackCommand): unknown }
  deepseekAccount: FeedbackAccount
}

/** Deliver explicit text feedback to the signed-in HEY account's support service. */
/** HEY-owned feedback command provider. */
export const name = 'uma-feedback'

/** Command dispatch and the Host-only signed-in account grant. */
export const inject = ['commands', 'deepseekAccount']

/** Validate deployment choices before registering the command. */
export const Config = z.object({
  origin: z.string().default('https://studio.umayun.com'),
  allowLoopbackHttp: z.boolean().default(false),
  requestTimeoutMs: z.number().step(1).min(1e3).max(6e4).default(15e3)
})

function platformOrigin(config: FeedbackConfig): string {
  const origin = new URL(config.origin)
  const loopback = config.allowLoopbackHttp && origin.protocol === 'http:' && origin.hostname === '127.0.0.1'
  if (origin.origin !== config.origin || origin.protocol !== 'https:' && !loopback || /(?:^|\.)deepseek\.com\.?$/iu.test(origin.hostname)) throw new Error('HEY feedback requires its own canonical HTTPS platform origin or an enabled loopback test origin')
  return origin.origin
}

/**
 * Submit only the user's text; no history, attachments, device metadata or filesystem paths are added.
 * @param account - Host account operations; credentials remain inside this function.
 * @param invocation - One explicit feedback command, with its durable pairing ID and cancellation.
 * @param config - Validated destination and request budget.
 * @returns A confirmed HEY ticket link or a visible error; network failures report an unknown outcome.
 */
export async function submitUmaFeedback(account: FeedbackAccount, invocation: FeedbackInvocation, config: FeedbackConfig): Promise<FeedbackResult> {
  const origin = platformOrigin(config)
  const text = invocation.rawInput.trim()
  if (text === '' || Array.from(text).length > 8e3) return {
    kind: 'error',
    text: '请输入 1–8000 字的反馈内容。'
  }
  const payload = JSON.stringify({
    subject: Array.from(text.split(/\r?\n/u, 1).join('')).slice(0, 80).join(''),
    category: 'feedback',
    body: text
  })
  if (Buffer.byteLength(payload) > 32768) return {
    kind: 'error',
    text: '反馈内容过长，请缩短后提交。'
  }
  invocation.signal.throwIfAborted()
  let session: PlatformSession | null
  try {
    session = await account.getPlatformSession()
  }
  catch (_error) {
    return {
      kind: 'error',
      text: '无法读取 HEY 登录状态，反馈尚未发送，请检查账号状态后重试。'
    }
  }
  if (session === null || session.origin !== origin || session.authenticatePage !== true) return {
    kind: 'error',
    text: '请先登录对应的 HeyWork 账号，再提交反馈。'
  }
  const support = `${origin}/account/support`
  try {
    const response = await fetch(`${origin}/v1/me/support`, {
      method: 'POST',
      redirect: 'error',
      signal: AbortSignal.any([invocation.signal, AbortSignal.timeout(config.requestTimeoutMs)]),
      headers: {
        ...session.requestHeaders,
        'content-type': 'application/json',
        authorization: `Bearer ${session.token}`,
        'idempotency-key': createHash('sha256').update(`${invocation.sessionId}\0${invocation.commandId}`).digest('hex')
      },
      body: payload
    })
    if (response.status === 401 || response.status === 403) {
      await response.body?.cancel()
      return {
        kind: 'error',
        text: 'HEY 反馈提交未获授权，请重新登录或在帮助与工单中核对账号状态。'
      }
    }
    if (response.status >= 400 && response.status < 500) {
      await response.body?.cancel()
      return {
        kind: 'error',
        text: `HEY 反馈未被接受（HTTP ${String(response.status)}），请检查内容后重试。`
      }
    }
    if (!response.ok) {
      await response.body?.cancel()
      throw new Error('submission outcome unknown')
    }
    const receipt = await response.json()
    if (typeof receipt !== 'object' || receipt === null || !('id' in receipt) || typeof receipt.id !== 'string' || !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/iu.test(receipt.id)) throw new Error('submission receipt unavailable')
    return {
      kind: 'success',
      text: `反馈已提交至 HeyWork。\n工单：${support}/${receipt.id}\n仅提交了你输入的文字，未附带会话日志。`
    }
  }
  catch (_error) {
    return {
      kind: 'error',
      text: `暂时无法确认反馈是否提交成功，请先到 HEY 帮助与工单核对，避免重复提交：${support}`
    }
  }
}

/**
 * Replace the disabled kernel feedback command with the HEY support submission.
 * @param ctx - Scoped HEY composition context.
 * @param config - Validated HEY deployment choices.
 */
export function apply(ctx: FeedbackContext, config: FeedbackConfig): void {
  platformOrigin(config)
  ctx.effect(() => ctx.commands.register({
    definitionId: CommandDefinitionId('@deepseek-ai/dsh-command-feedback'),
    name: 'feedback',
    description: 'Submit text feedback to HeyWork support',
    input: { hint: '<text>' },
    recordInput: false,
    async handler(invocation) {
      const result = await submitUmaFeedback(ctx.deepseekAccount, {
        ...invocation,
        sessionId: invocation.agent.id
      }, config)
      if (result.kind === 'success') recordFeedback(invocation.agent.session, {
        text: invocation.rawInput,
        category: 'product-interaction'
      })
      return result
    }
  }), 'uma-feedback: owned command')
}
