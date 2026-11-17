/**
 * 【逆向还原】由 `lib/types/types.js`（仅一行 `export {};` + sourceMappingURL 注释）反推，
 * 非 DeepSeek 原始源码。该文件在运行时被完全擦除，类型声明取自
 * `lib/typert.host.js` 的 `TYPERT.model.services[].types[].declaration` 内嵌原文，
 * 并按 TS 语法补齐 unique symbol 声明。BRAND 的具体声明位置无法从 lib 确认，见 README 可疑点。
 * 运行时仍以 lib/*.js 为准；改动本文件后需手动同步回 lib，详见 src/README.md。
 */

declare const BRAND: unique symbol

export type Branded<B extends string> = string & { readonly [BRAND]: B }

export interface BudgetRequest {
  readonly origin: string
  readonly token: string
  readonly sessionId: string
  readonly kind: 'device' | 'api-key'
}

export interface SessionBudget {
  readonly id: string
  readonly purpose: string
  readonly cap: string | null
  readonly spent: string
  readonly reserved: string
  readonly state: 'active' | 'paused' | 'closed'
  readonly operatorPaused: boolean
  readonly operatorReason: string
  readonly version: number
  readonly expiresAt: string
}

export interface SessionBudgetView {
  readonly sessionId: SessionId
  readonly rootSessionId: SessionId
  readonly shared: boolean
  readonly budget: SessionBudget
}

export type SessionId = Branded<'SessionId'>
