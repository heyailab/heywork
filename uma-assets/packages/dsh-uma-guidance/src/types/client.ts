/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/client.js` 反推，非 DeepSeek 原始源码。
 *
 * bundle 中为 zod 的 `z` 加了别名 `z$1`（与 schemastery 的 `z` 区分）；这里沿用同一别名以便与 lib 逐行对照。
 * 类型由 z$1.infer 与调用点推断，运行时仍以 lib/*.js 为准，详见 src/README.md。
 */
import { createHash } from 'node:crypto'
import { brandString } from '@deepseek-ai/dsh-brand'
import { ProviderRequestId } from '@deepseek-ai/dsh-llm'
import { z as z$1 } from 'zod'

/** 来自 `Config` 校验输出、传给客户端的部署参数。 */
export interface GuidanceConfig {
  origin: string
  allowLoopbackHttp: boolean
  requestTimeoutMs: number
  recoveryTimeoutMs: number
  maxResponseBytes: number
}

/** 客户端读取的账户凭据；headers 可选，current 用于检测换号。 */
export interface GuidanceIdentity {
  token: string
  headers?: HeadersInit
  current: () => Promise<boolean>
}

/** submit 的入参形状，字段对应 receipt 中的可校验字段。 */
export interface SubmitInput {
  private_execution: boolean
  capability: string
  model_id: string
  reasoning_effort?: string
  protocol: string
  task_id: string
  source_digest: string
  input: string
}

const capability = z$1.enum([
  "engineering",
  "design",
  "review"
]);
const file = z$1.object({
  path: z$1.string().min(1).max(240).refine((value) => !value.startsWith("/") && !/[\\:\0\r\n]/u.test(value) && value.split("/").every((part) => part !== "" && part !== "." && part !== ".." && part !== ".git")),
  content: z$1.string().max(131072)
}).strict();
const result = z$1.object({
  summary: z$1.string().min(1).max(8192),
  recommendations: z$1.array(z$1.string().min(1).max(8192)).max(32),
  files: z$1.array(file).max(16)
}).strict();
const receipt = z$1.object({
  id: z$1.uuid().transform((value) => brandString(value)),
  source_digest: z$1.string().regex(/^[a-f0-9]{64}$/u),
  model_id: z$1.string().min(1).max(128),
  protocol: z$1.enum([
    "messages",
    "chat_completions",
    "responses",
    "gemini"
  ]).optional(),
  reasoning_effort: z$1.enum([
    "off",
    "minimal",
    "low",
    "medium",
    "high",
    "xhigh",
    "max"
  ]).optional(),
  task_id: z$1.uuid().transform((value) => brandString(value)),
  request_id: z$1.uuid().transform(ProviderRequestId).optional(),
  status: z$1.enum([
    "queued",
    "running",
    "completed",
    "failed",
    "unknown",
    "cancelled"
  ]),
  result: result.optional(),
  failure_code: z$1.string().regex(/^[A-Z0-9_]{1,80}$/u).optional(),
  created_at: z$1.iso.datetime({ offset: true })
}).strict().refine((value) => value.status === "completed" === (value.result !== void 0));
const capabilities = z$1.object({
  data: z$1.array(z$1.object({
    id: capability,
    revision: z$1.number().int().positive(),
    available: z$1.boolean(),
    max_output_tokens: z$1.number().int().min(256).max(16384)
  }).strict()).max(3),
  billing: z$1.literal("selected_managed_model"),
  additional_requests: z$1.literal(1)
}).strict().refine((value) => new Set(value.data.map((item) => item.id)).size === value.data.length);

/** 从 receipt / capabilities 的 schema 推断（原始 .d.ts 不存在，故用 z$1.infer 反推）。 */
export type Receipt = z$1.infer<typeof receipt>
export type Capabilities = z$1.infer<typeof capabilities>

/** Safe failure classification without response bodies or credentials. */
export class GuidanceTransportError extends Error {
  code: string
  status?: number
  /**
  * @param code - Safe failure category.
  * @param status - Optional HTTP status without response content.
  */
  constructor(code: string, status?: number) {
    super(`UMA guidance ${code}`);
    this.code = code;
    this.status = status;
  }
}

/**
* Admit one canonical UMA destination at plugin load.
* @param config - Deployment origin and explicit loopback allowance.
* @returns the exact canonical origin.
*/
export function guidanceOrigin(config: GuidanceConfig): string {
  let url: URL;
  try {
    url = new URL(config.origin);
  }
  catch {
    throw new Error("UMA guidance requires a canonical platform origin");
  }
  if (url.origin !== config.origin || url.username !== "" || url.password !== "" || url.protocol !== "https:" && !(config.allowLoopbackHttp && url.protocol === "http:" && url.hostname === "127.0.0.1")) throw new Error("UMA guidance requires canonical HTTPS or an explicitly enabled IPv4 loopback origin");
  return url.origin;
}

/**
* Bind a recoverable operation name to its owning Session.
* @param sessionId - Actual calling Session, never a model argument.
* @param operationId - Model-visible name retained in the tool call even after cancellation.
* @returns stable issuer idempotency key with no raw local identifiers.
*/
export function guidanceOperationKey(sessionId: string, operationId: string): string {
  if (!/^[A-Za-z0-9_-]{8,64}$/u.test(operationId)) throw new Error("Use an operation_id containing 8–64 letters, digits, underscores or hyphens");
  return brandString(createHash("sha256").update(`${sessionId}\0${operationId}`).digest("hex"));
}

/**
* Read bounded JSON without exposing parse errors that might contain private server output.
* @param response - Owned response.
* @param maximum - Complete byte cap.
* @returns decoded untrusted JSON.
*/
export async function readJson(response: Response, maximum: number): Promise<unknown> {
  if (response.headers.get("content-type")?.split(";", 1)[0]?.trim() !== "application/json") {
    await response.body?.cancel();
    throw new GuidanceTransportError("invalid-response");
  }
  const reader = response.body?.getReader();
  if (reader === void 0) throw new GuidanceTransportError("invalid-response");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > maximum) {
        await reader.cancel();
        throw new GuidanceTransportError("invalid-response");
      }
      chunks.push(next.value);
    }
  }
  finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  }
  catch {
    throw new GuidanceTransportError("invalid-response");
  }
}

/** One origin-bound client. POST submission is never automatically replayed. */
export class GuidanceClient {
  config: GuidanceConfig
  origin: string
  /** @param config - Validated deployment limits and canonical issuer. */
  constructor(config: GuidanceConfig) {
    this.config = config;
    this.origin = guidanceOrigin(config);
  }
  async call(path: string, method: string, identity: GuidanceIdentity, signal: AbortSignal, key: string | undefined, body: unknown, recovery = false): Promise<unknown> {
    signal.throwIfAborted();
    if (!await identity.current()) throw new GuidanceTransportError("account-changed");
    const headers = new Headers(identity.headers);
    headers.set("authorization", `Bearer ${identity.token}`);
    headers.set("content-type", "application/json");
    if (key !== void 0) headers.set("idempotency-key", key);
    let response: Response;
    try {
      response = await fetch(this.origin + path, {
        method,
        redirect: "error",
        headers,
        signal: AbortSignal.any([signal, AbortSignal.timeout(recovery ? this.config.recoveryTimeoutMs : this.config.requestTimeoutMs)]),
        ...body === void 0 ? {} : { body: JSON.stringify(body) }
      });
    }
    catch {
      throw new GuidanceTransportError("outcome-unknown");
    }
    if (!response.ok) {
      await response.body?.cancel();
      throw new GuidanceTransportError(response.status === 401 || response.status === 403 ? "unauthorized" : response.status === 404 ? "not-found" : response.status < 500 ? "rejected" : "outcome-unknown", response.status);
    }
    let value: unknown;
    try {
      value = await readJson(response, this.config.maxResponseBytes);
    }
    catch (error) {
      if (error instanceof GuidanceTransportError) throw error;
      throw new GuidanceTransportError("outcome-unknown");
    }
    if (!await identity.current()) throw new GuidanceTransportError("account-changed");
    return value;
  }
  parseReceipt(value: unknown): Receipt {
    const parsed = receipt.safeParse(value);
    if (!parsed.success) throw new GuidanceTransportError("invalid-response");
    return parsed.data;
  }
  /**
  * Read public specialist availability without a model request.
  * @param identity - Captured account.
  * @param signal - Caller lifetime.
  * @returns public capability and billing metadata.
  */
  async availability(identity: GuidanceIdentity, signal: AbortSignal): Promise<Capabilities> {
    const parsed = capabilities.safeParse(await this.call("/v1/private-guidance/capabilities", "GET", identity, signal, void 0, void 0, true));
    if (!parsed.success) throw new GuidanceTransportError("invalid-response");
    return parsed.data;
  }
  /**
  * Submit one explicitly authorized managed-model request without retry.
  * @param input - User task and captured source version.
  * @param key - Session-owned operation key.
  * @param identity - Captured grant.
  * @param signal - Caller lifetime.
  * @returns validated public receipt.
  */
  async submit(input: SubmitInput, key: string, identity: GuidanceIdentity, signal: AbortSignal): Promise<Receipt> {
    const value = this.parseReceipt(await this.call("/v1/private-guidance", "POST", identity, signal, key, input));
    if (value.reasoning_effort !== input.reasoning_effort || value.protocol !== input.protocol || value.source_digest !== input.source_digest || value.model_id !== input.model_id || value.task_id !== input.task_id) throw new GuidanceTransportError("invalid-response");
    return value;
  }
  /**
  * Recover only an existing operation; never creates or bills work.
  * @param key - Current Session's operation key.
  * @param identity - Captured account.
  * @param signal - Read lifetime.
  * @returns an existing public receipt.
  */
  async lookup(key: string, identity: GuidanceIdentity, signal: AbortSignal): Promise<Receipt> {
    return this.parseReceipt(await this.call("/v1/private-guidance/by-key", "GET", identity, signal, key, void 0, true));
  }
  /**
  * Request cancellation without claiming that upstream execution or billing has stopped.
  * @param id - Run obtained from an owned lookup.
  * @param identity - Captured account.
  * @param signal - Bounded cancellation lifetime.
  * @returns current server state, which may still be running or unknown.
  */
  async cancel(id: string, identity: GuidanceIdentity, signal: AbortSignal): Promise<Receipt> {
    return this.parseReceipt(await this.call(`/v1/private-guidance/${id}/cancel`, "POST", identity, signal, void 0, void 0, true));
  }
}
