/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/index.js` 反推，非 DeepSeek 原始源码。
 *
 * Config / name / inject / apply 为包级导出面；ctx、Session、agent 等 interface 由调用点推断。
 * 分级状态机（capabilities / request / status / cancel）、换号与来源变更判定、取消与恢复分支、
 * 所有错误文本与 lib 逐行一致，未作"修正"。运行时仍以 lib/*.js 为准，详见 src/README.md。
 */
import { createHash } from 'node:crypto'
import { brandString } from '@deepseek-ai/dsh-brand'
import z from '@deepseek-ai/schemastery'
import { ToolContextUnavailableError, defineTool } from '@deepseek-ai/dsh-tools'
import { assertNever } from '@deepseek-ai/dsh-util-values'
import {
  GuidanceClient,
  GuidanceTransportError,
  guidanceOperationKey,
  type GuidanceConfig,
  type GuidanceIdentity,
  type Receipt,
} from './client.ts'

/** 平台 Session 的最小形状（实际定义属于 dsh-deepseek-account，原始 .d.ts 不存在）。 */
export interface GuidanceSession {
  token: string
  origin: string
  authenticatePage: boolean
  requestHeaders?: HeadersInit
}

/** 调用方 Context 中各服务的形状（从 apply 的用法反推）。 */
export interface GuidanceContext {
  effect(factory: () => () => Promise<void>, label: string): unknown
  deepseekAccount: {
    getPlatformSession(): Promise<GuidanceSession | null>
    resolveToken(origin: string): Promise<string>
  }
  workspaceRegistry: {
    list(): { id: string; sessionIds: string[] }[]
  }
  codingWorkbench: {
    doctor(request: { workspaceId: string; sessionId: string }, signal: AbortSignal): Promise<{ fingerprint: { complete: boolean; digest: string } }>
  }
  umaTaskBudgets: {
    prepare(request: { origin: string; token: string; sessionId: string; kind: string }, signal: AbortSignal): Promise<{ taskId: string }>
  }
  tools: {
    register(tool: unknown): void
  }
}

/** 运行时从 defineTool 传入的调用上下文。 */
export interface GuidanceExec {
  agent?: {
    id: string
    model: {
      current(): { provider: string; model: string; reasoningEffort?: string } | undefined
    }
    session: unknown
  }
  signal: AbortSignal
}

/** uma_guidance 的工具参数。 */
export interface GuidanceArgs {
  action: 'capabilities' | 'request' | 'status' | 'cancel'
  operation_id?: string
  capability?: string
  task?: string
  mode?: string
}

/** 工具输出的最小形状。 */
export interface GuidanceResult {
  status: string
  message: string
  operation_id?: string
  details?: string
}

/** Validated origin and deadlines; deployment choices remain configurable. */
export const Config = z.object({
  origin: z.string().min(1),
  allowLoopbackHttp: z.boolean().default(false),
  requestTimeoutMs: z.number().step(1).min(1e3).max(6e5).default(33e4),
  recoveryTimeoutMs: z.number().step(1).min(1e3).max(3e4).default(1e4),
  maxResponseBytes: z.number().step(1).min(1024).max(2097152).default(1048576)
});
/** Cordis plugin identity. */
export const name = "uma-guidance";
/** Account, budget and source owners must outlive this consumer's active operations. */
export const inject = [
  "tools",
  "deepseekAccount",
  "umaTaskBudgets",
  "codingWorkbench",
  "workspaceRegistry"
];

/**
* Register a public guidance tool without exposing or installing the private corpus locally.
* @param ctx - Scoped Host services.
* @param config - Validated HEY origin and resource bounds.
*/
export function apply(ctx: GuidanceContext, config: GuidanceConfig): void {
  const client = new GuidanceClient(config);
  const origin = config.origin;
  const lifetime = new AbortController();
  const pending: Set<Promise<GuidanceResult>> = /* @__PURE__ */ new Set();
  ctx.effect(() => async () => {
    lifetime.abort();
    await Promise.allSettled([...pending]);
  }, "uma-guidance: owned requests");
  async function run(args: GuidanceArgs, exec: GuidanceExec): Promise<GuidanceResult> {
    const agent = exec.agent;
    if (agent === void 0) throw new ToolContextUnavailableError("HEY guidance requires a calling Session");
    const signal = AbortSignal.any([exec.signal, lifetime.signal]);
    const account = ctx.deepseekAccount;
    let session: GuidanceSession | null;
    try {
      session = await account.getPlatformSession();
    }
    catch (_unavailable) {
      return {
        status: "failed",
        message: "The HEY account is unavailable; no guidance request was submitted."
      };
    }
    if (session === null || session.origin !== origin || session.authenticatePage !== true) return {
      status: "failed",
      message: "Sign in to the configured HEY account before requesting managed guidance."
    };
    const identity: GuidanceIdentity = {
      token: session.token,
      ...session.requestHeaders === void 0 ? {} : { headers: session.requestHeaders },
      current: async () => await account.resolveToken(origin) === session.token
    };
    const failure = (status: string, message: string): GuidanceResult => ({
      status,
      message,
      ...args.operation_id === void 0 ? {} : { operation_id: args.operation_id }
    });
    const workspace = ctx.workspaceRegistry.list().find((value) => value.sessionIds.includes(agent.id));
    const source = async (): Promise<string> => {
      if (workspace === void 0) throw new ToolContextUnavailableError("Import the current workspace before requesting guidance");
      const observed = await ctx.codingWorkbench.doctor({
        workspaceId: workspace.id,
        sessionId: agent.id
      }, signal);
      if (!observed.fingerprint.complete) throw new ToolContextUnavailableError("Source inspection is incomplete; guidance cannot be bound to the current source");
      return createHash("sha256").update(`${workspace.id}\0${observed.fingerprint.digest}`).digest("hex");
    };
    const present = async (receipt: Receipt): Promise<GuidanceResult> => {
      switch (receipt.status) {
        case "completed": {
          const observed = await source();
          if (!await identity.current()) throw new GuidanceTransportError("account-changed");
          if (observed !== receipt.source_digest) return {
            ...failure("stale", "The source changed. This result is stale and has been withheld; inspect the current source before a new request."),
            details: JSON.stringify({
              id: receipt.id,
              request_id: receipt.request_id,
              model_id: receipt.model_id,
              protocol: receipt.protocol,
              task_id: receipt.task_id,
              source_digest: receipt.source_digest
            })
          };
          return {
            status: "completed",
            message: "Task-specific guidance received. It is a recommendation, not executed work or permission to write files.",
            ...args.operation_id === void 0 ? {} : { operation_id: args.operation_id },
            details: JSON.stringify(receipt)
          };
        }
        case "queued":
        case "running": return {
          status: "pending",
          message: "The original operation is still running. Use status with the same operation_id; do not start another request.",
          ...args.operation_id === void 0 ? {} : { operation_id: args.operation_id }
        };
        case "failed": return failure("failed", "Guidance could not be delivered. Check HEY usage for any accepted charge before retrying; no result should be treated as validated work.");
        case "unknown": return failure("unknown", "The execution outcome is unconfirmed. Check HEY usage and recover this operation; do not automatically resubmit it.");
        case "cancelled": return {
          status: "cancelled",
          message: "The operation is cancelled. Consult HEY usage for its accounting state.",
          ...args.operation_id === void 0 ? {} : { operation_id: args.operation_id }
        };
        default: return assertNever(receipt.status);
      }
    };
    try {
      switch (args.action) {
        case "capabilities": return {
          status: "available",
          message: "Managed guidance makes one additional inference request at the selected HEY model rate and uses this Session’s task budget. Custom-model traffic is not rerouted.",
          details: JSON.stringify(await client.availability(identity, signal))
        };
        case "request":
        case "status":
        case "cancel": break;
        default: return assertNever(args.action);
      }
      if (args.operation_id === void 0) return failure("failed", "Supply a stable operation_id for request, status or cancel.");
      const key = guidanceOperationKey(agent.id, args.operation_id);
      if (args.action === "status") return await present(await client.lookup(key, identity, signal));
      if (args.action === "cancel") {
        const receipt = await client.lookup(key, identity, signal);
        return await present(await client.cancel(receipt.id, identity, signal));
      }
      const model = agent.model.current();
      if (args.mode !== "managed" || model === void 0 || ![
        "hey-messages",
        "hey-chat-completions",
        "hey-responses",
        "hey-gemini",
        "deepseek-account"
      ].includes(model.provider)) return failure("failed", "Managed guidance requires mode=managed and an already selected HEY account model. Keep BYOK work local or let the user choose a managed model; do not silently switch.");
      if (args.capability === void 0 || args.task === void 0 || args.task.trim() === "" || Buffer.byteLength(args.task) > 65536) return failure("failed", "Supply a capability and 1–65536 UTF-8 bytes of task text. Do not include credentials or unrelated workspace files.");
      if (!(await client.availability(identity, signal)).data.some((value) => value.id === args.capability && value.available)) return failure("failed", "The requested guidance capability is unavailable. Do not claim its references were used.");
      const digest = await source();
      const budget = await ctx.umaTaskBudgets.prepare({
        origin,
        token: session.token,
        sessionId: agent.id,
        kind: "device"
      }, signal);
      try {
        return await present(await client.submit({
          private_execution: true,
          capability: args.capability,
          model_id: model.model,
          ...model.reasoningEffort === void 0 ? {} : { reasoning_effort: model.reasoningEffort },
          protocol: model.provider === "hey-responses" ? "responses" : model.provider === "hey-gemini" ? "gemini" : model.provider === "hey-chat-completions" ? "chat_completions" : "messages",
          task_id: brandString(budget.taskId),
          source_digest: digest,
          input: args.task
        }, key, identity, signal));
      }
      catch (error) {
        if (signal.aborted) {
          const cleanup = AbortSignal.timeout(config.recoveryTimeoutMs);
          const cancelKnown = async () => {
            const receipt = await client.lookup(key, identity, cleanup);
            await client.cancel(receipt.id, identity, cleanup);
          };
          try {
            await cancelKnown();
          }
          catch (_unconfirmed) {}
          signal.throwIfAborted();
        }
        if (error instanceof GuidanceTransportError && (error.code === "outcome-unknown" || error.code === "invalid-response")) try {
          return await present(await client.lookup(key, identity, signal));
        }
        catch (_unconfirmed) {
          return failure("unknown", "Submission could not be confirmed. Recover using status and the same operation_id; do not automatically repeat request.");
        }
        throw error;
      }
    }
    catch (error) {
      signal.throwIfAborted();
      if (error instanceof GuidanceTransportError && error.code === "account-changed") return failure("failed", "The HEY account changed or its grant was refreshed. Results from the previous grant are withheld; check the active account and use status with the same operation_id.");
      if (error instanceof GuidanceTransportError && error.code === "not-found") return args.action === "status" || args.action === "cancel" ? failure("unknown", "No owned receipt is currently available. This does not prove an interrupted submission was never accepted.") : failure("failed", "The HEY server does not provide the requested guidance operation. No new guidance result is available; ordinary local development remains available.");
      return failure("failed", "HEY guidance is unavailable. Check the account, workspace and task budget; ordinary local development remains available.");
    }
  }
  ctx.tools.register(defineTool({
    name: "uma_guidance",
    description: "Request task-specific engineering, design or review guidance from HEY. First inspect capabilities and pricing. Request adds one billed call using the already selected HEY model and this Session’s budget; mode=managed is required. Send only task-relevant user-owned text. Give each new intent a unique 8–64 character operation_id (letters, digits, _ or -). Recover uncertain requests with status and the same operation_id, never automatic resubmission. Returned files are proposals requiring ordinary local permission and review. This tool does not expose internal resources or run project checks.",
    timeoutMs: config.requestTimeoutMs + 3 * config.recoveryTimeoutMs,
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: [
          "capabilities",
          "request",
          "status",
          "cancel"
        ]
      },
      operation_id: {
        type: "string",
        description: "Stable name for this intent, scoped to the calling Session."
      },
      capability: {
        type: "string",
        enum: [
          "engineering",
          "design",
          "review"
        ]
      },
      task: {
        type: "string",
        description: "Task and relevant excerpts, without credentials or unrelated files."
      },
      mode: {
        type: "string",
        enum: ["managed"],
        description: "Explicitly use the current HEY model and task budget."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          status: {
            type: "string",
            required: true,
            enum: [
              "available",
              "completed",
              "pending",
              "failed",
              "unknown",
              "stale",
              "cancelled"
            ]
          },
          message: {
            type: "string",
            required: true
          },
          operation_id: { type: "string" },
          details: { type: "string" }
        }
      },
      render: (_args: GuidanceArgs, value: GuidanceResult) => [{
        type: "text",
        text: `${value.message}${value.details === void 0 ? "" : `\n${value.details}`}`
      }]
    },
    execute(args: GuidanceArgs, exec: GuidanceExec) {
      const operation = run(args, exec);
      pending.add(operation);
      operation.then(() => pending.delete(operation), () => pending.delete(operation));
      return operation;
    },
    presentCall: (args: GuidanceArgs) => ({
      card: "generic",
      title: "HEY guidance",
      kind: "other",
      rawInput: args
    })
  }));
}
