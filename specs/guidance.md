# spec: dsh-uma-guidance（HEY 任务指引工具）

> 重写目标：行为等价的 `dsh-uma-guidance` 包。
> 证据：`uma-assets/packages/dsh-uma-guidance/src/types/index.ts`（下称 **I**，349 行）、
> `src/types/client.ts`（下称 **C**，276 行）、`src/index.ts`（下称 **E**，10 行）。
> 这些是逆向还原的可读 TS，不是原始源码；行号仅供校对，不作为抄写依据。
> 范围：1 个工具 `uma_guidance` + 模块导出面（`name`/`inject`/`Config`/`apply`）+ 远端客户端（`GuidanceClient`）/origin 校验/密钥派生规则。
> 状态：**待横向评审**（写完后需验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了行为全废）

这些不是"行为"，是**字节级字符串常量与内部标识**。重写时逐字保留，不汉化、不替换同义 id。
本包分两类：**内部标识**保持源码原样；**对外身份**一律用 HEY 品牌。二者严格区分。

### 1.1 内部标识（源码逐字，保持原样）

| 项 | 值 | 证据 |
|---|---|---|
| 工具名（defineTool 的实际 `name`） | `uma_guidance` | I:269 |
| 插件 `name` 导出字面值 | `uma-guidance`（**源码实际值**；对外品牌见 §1.2） | I:89 |
| `inject` 注入注册表/服务键（逐字、顺序固定） | `tools`、`deepseekAccount`、`umaTaskBudgets`、`codingWorkbench`、`workspaceRegistry` | I:91-97 |
| 生命周期 effect 标签 | `uma-guidance: owned requests` | I:112 |
| 环境变量 | 源码未读取任何环境变量（无 `process.env` / `import.meta.env` 读取） | I、C、E 全文 |
| 容器虚拟路径（`uma-*`） | **无**：本包不读取本地容器，指引数据经远端 HTTPS 服务获取；不含 design 包那类 `uma-*` 虚拟路径 | C:239,252,264,274 |
| 密钥串（派生串） | **无**：本包不派生本地加解密密钥；身份凭据来自平台 Session 的 `token` | C:22-26,196 |
| idempotency-key 生成式 | `brandString(SHA256(\`${sessionId}\0${operationId}\`).hex)`（字节级变换规则） | C:140-143 |
| 操作 id 正则（key 派生前强制） | `/^[A-Za-z0-9_-]{8,64}$/u` | C:141 |

### 1.2 对外 HEY 身份（品牌/显示，源码逐字）

| 项 | 值 | 证据 |
|---|---|---|
| 用户可见品牌 | `HEY`（工具描述与全部 message 中一律 HEY，不出现 uma） | I:195,270 等 |
| 工具描述首句 | `Request task-specific engineering, design or review guidance from HEY.`（全文见 §三·1） | I:270 |
| provider 白名单（逐字） | `hey-messages`、`hey-chat-completions`、`hey-responses`、`hey-gemini`、`deepseek-account` | I:212-216 |
| protocol 取值（逐字） | `messages`、`chat_completions`、`responses`、`gemini` | C:58-63 |
| billing 字面量 | `selected_managed_model`；`additional_requests` = `1` | C:94-95 |
| presentCall 卡片标题 | `HEY guidance`（`card:'generic'`、`kind:'other'`、`rawInput:args`） | I:342-347 |
| 传输错误消息前缀 | `` HEY guidance ${code} `` | C:111 |
| 远端服务路径（逐字） | `/v1/private-guidance`、`/v1/private-guidance/capabilities`、`/v1/private-guidance/by-key`、`/v1/private-guidance/${id}/cancel` | C:239,252,264,274 |

### 1.3 命名边界

- 工具名 `uma_guidance`、插件 id `uma-guidance`、服务键 `umaTaskBudgets` 属**内部/契约标识**，按任务要求"按源码实际名逐字"保留，不改为 hey 形式。
- 一切面向用户/模型的品牌、描述、状态消息、provider/protocol、卡片标题属**对外身份**，用 HEY。
- 说明：插件 id 在 design 包已定稿为对外 `tool-hey-design`；本包按本任务"按源码逐字"要求保留 `uma-guidance`，如需与 design 包口径统一由评审另行定稿（本 spec 不擅自改名）。

---

## 二、模块导出面与插件配置

### 2.1 导出清单

| 导出 | 类型 | 说明 |
|---|---|---|
| `name` | string | 插件 id，字面值 `'uma-guidance'`（I:89，见 §1.3） |
| `inject` | `string[]` | 恒为 `['tools','deepseekAccount','umaTaskBudgets','codingWorkbench','workspaceRegistry']`（I:91-97） |
| `Config` | schemastery schema（`z.object`） | 配置校验器，字段见 §2.2 |
| `apply` | `(ctx, config) => void` | 插件入口，见 §2.4 |

入口 `src/index.ts` 的导出面与 lib 逐字一致：仅重导出上述 4 个符号（E:10），`client.ts` 被内联、不出现在包导出面。

### 2.2 `Config`（I:81-87）

| 字段 | 类型 | 约束 | 默认值 |
|---|---|---|---|
| `origin` | string | `min(1)`；**无默认值（必填）** | — |
| `allowLoopbackHttp` | boolean | — | `false`（**默认禁用** HTTP 回环来源，见下） |
| `requestTimeoutMs` | number | integer(`step(1)`)，`1000`–`600000`（`1e3`–`6e5`） | `330000`（`33e4`） |
| `recoveryTimeoutMs` | number | integer(`step(1)`)，`1000`–`30000`（`1e3`–`3e4`） | `10000`（`1e4`） |
| `maxResponseBytes` | number | integer(`step(1)`)，`1024`–`2097152` | `1048576` |

- **`origin` 只做 `min(1)`**：schema 层不校验 URL 合法性、协议、是否规范 origin；规范化全部交给 `guidanceOrigin()`（§2.3）。
- **默认 disabled 状态**：本包唯一的"默认禁用"配置是 `allowLoopbackHttp = false`——即默认拒绝 `http://127.0.0.1`，只有显式开启才允许该回环来源。
- 所有 `min`/`max`/`step` 由 schemastery 在配置校验阶段强制；非法配置在插件加载时失败，不属于任何工具调用的错误。

### 2.3 `guidanceOrigin(config)` — origin 校验规则（C:122-132）

- **签名**：`(config: GuidanceConfig) => string`，返回**规范化后的** `url.origin`。
- **调用点**：`GuidanceClient` 构造函数（C:190）；返回值存为 `client.origin`，供所有远端请求拼接 URL 使用。注意 `apply` 中传给预算与账户服务的 `origin` 用的是**原始 `config.origin`**（I:106,222），未经此规范化。
- **规则（任一命中即抛）**：
  - `new URL(config.origin)` 构造失败 → `throw new Error("HEY guidance requires a canonical platform origin")`（C:128）。
  - `url.origin !== config.origin`（传入值必须已是规范形式，不能带尾斜杠、路径、query、fragment、userinfo）→ 抛（见下行错误）。
  - `url.username !== ""` 或 `url.password !== ""` → 抛（见下行错误）。
  - `url.protocol !== "https:"` 且不满足（`allowLoopbackHttp === true` 且 `url.protocol === "http:"` 且 `url.hostname === "127.0.0.1"`）→ 抛。
  - 上述三个条件任一为真时，抛 `new Error("HEY guidance requires canonical HTTPS or an explicitly enabled IPv4 loopback origin")`（C:130）。
- **允许的来源**：规范 HTTPS origin；或显式开启 `allowLoopbackHttp` 后的 `http://127.0.0.1`（仅 IPv4 回环，`localhost` / `::1` 不接受）。
- **证据**：C:122-132,188-191；I:106,222。

### 2.4 `apply(ctx, config): void`（I:104-349）

- **签名**：`(ctx: GuidanceContext, config: GuidanceConfig) => void`（`config` 为已校验配置，无可选默认值）。
- **返回**：void；通过 `ctx.tools.register(...)` 注册 `uma_guidance` 工具（I:268）。
- **副作用**：
  - 构造 `new GuidanceClient(config)`（内部执行 §2.3 的 origin 校验；非法 origin 在插件加载期抛错，先于任何工具调用）；
  - 创建 `AbortController` 作为生命周期信号，创建 `pending: Set<Promise<GuidanceResult>>` 跟踪在途请求（I:107-108）；
  - 通过 `ctx.effect(factory, "uma-guidance: owned requests")` 注册清理钩子：插件卸载时 `lifetime.abort()` 并 `await Promise.allSettled([...pending])`（吞掉全部成功/失败结果）（I:109-112）；
  - 每次 `execute` 把 `run()` 的 promise 加入 `pending`，settled 后从集合删除（I:336-341）。
- **边界**：`origin` 非法在加载期抛 §2.3 的错误；`config` 各数值超界由 schema 在加载期拒绝。

---

## 三、工具行为规格 `uma_guidance`

### 1) 签名

- 工具名：`uma_guidance`（I:269，冻结）。
- 工具描述（逐字，I:270）：
  `Request task-specific engineering, design or review guidance from HEY. First inspect capabilities and pricing. Request adds one billed call using the already selected HEY model and this Session’s budget; mode=managed is required. Send only task-relevant user-owned text. Give each new intent a unique 8–64 character operation_id (letters, digits, _ or -). Recover uncertain requests with status and the same operation_id, never automatic resubmission. Returned files are proposals requiring ordinary local permission and review. This tool does not expose internal resources or run project checks.`
- 参数 schema（I:272-304）：`action`（string，**必填**，enum）、`operation_id`（string）、`capability`（string，enum）、`task`（string）、`mode`（string，enum）。除 `action` 外均非 schema 必填。
- `timeoutMs` = `config.requestTimeoutMs + 3 * config.recoveryTimeoutMs`（默认 `360000`）（I:271）。
- 执行：`execute(args, exec)` → `Promise<GuidanceResult>`（I:336-341）。
- 输出 schema（I:305-330）：object，`additionalProperties:false`；`status`（string，必填，enum）、`message`（string，必填）、`operation_id`（string，可选）、`details`（string，可选）。
- `render`（I:331-334）：单条文本块 `text = message`，当 `details` 非 `undefined` 时在其后追加 `\n` + `details`，即 `message + (details===undefined ? "" : "\n"+details)`。

### 2) 参数表

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `action` | string（enum） | 是 | — | `capabilities` / `request` / `status` / `cancel`（schema 层必填） |
| `operation_id` | string | 否 | — | 本次意图的稳定名，作用域为调用方 Session；`request`/`status`/`cancel` 在工具层强制要求（见错误文本），且须匹配 `/^[A-Za-z0-9_-]{8,64}$/u` |
| `capability` | string（enum） | 否 | — | `engineering` / `design` / `review`；`request` 时必填且须可用 |
| `task` | string | 否 | — | 任务文本及相关摘录，不得含凭据或无关文件；`request` 时须为 1–65536 UTF-8 字节且 `trim()` 非空 |
| `mode` | string（enum） | 否 | — | 仅可取 `managed`；`request` 时须显式为 `managed` |

### 3) 返回

`execute` 返回 `GuidanceResult`（I:73-78）。`status` 取值：`available`、`completed`、`pending`、`failed`、`unknown`、`stale`、`cancelled`。各分支返回：

| 触发分支 | status | message（逐字） | 附加字段 |
|---|---|---|---|
| `action=capabilities` | `available` | `Managed guidance makes one additional inference request at the selected HEY model rate and uses this Session’s task budget. Custom-model traffic is not rerouted.` | `details = JSON.stringify(Capabilities)`（见下） |
| 回执 `status=completed` 且源摘要一致 | `completed` | `Task-specific guidance received. It is a recommendation, not executed work or permission to write files.` | `details = JSON.stringify(receipt)`（整个回执） |
| 回执 `status=completed` 但源摘要不一致 | `stale` | `The source changed. This result is stale and has been withheld; inspect the current source before a new request.` | `details = JSON.stringify({id,request_id,model_id,protocol,task_id,source_digest})`（取自回执对应字段） |
| 回执 `status=queued`/`running` | `pending` | `The original operation is still running. Use status with the same operation_id; do not start another request.` | — |
| 回执 `status=cancelled` | `cancelled` | `The operation is cancelled. Consult HEY usage for its accounting state.` | — |
| 回执 `status=failed` | `failed` | `Guidance could not be delivered. Check HEY usage for any accepted charge before retrying; no result should be treated as validated work.` | — |
| 回执 `status=unknown` | `unknown` | `The execution outcome is unconfirmed. Check HEY usage and recover this operation; do not automatically resubmit it.` | — |

- 上表中凡 `operation_id` 入参提供时，返回对象都附带 `operation_id` 原值（I:137-141）；缺失时不带该字段。
- 回执状态 → 工具状态映射：`completed→completed`（或 `stale`）、`queued/running→pending`、`failed→failed`、`unknown→unknown`、`cancelled→cancelled`；未知回执状态触发 `assertNever`（I:188，不可达）。
- `details` 均为 JSON 字符串（非对象），由 render 拼入文本块。

`Capabilities`（`JSON.stringify` 的序列化对象，C:87-96）：
```
{ data: [{ id: "engineering"|"design"|"review", revision: <正整数>,
           available: <boolean>, max_output_tokens: <整数 256–16384> }],   // 最多 3 条，id 不重复
  billing: "selected_managed_model", additional_requests: 1 }
```

`Receipt`（`details` 的回执结构，C:54-86）：`strict` 对象；字段
```
id: uuid(转 brandString)；source_digest: /^[a-f0-9]{64}$/；
model_id: string(1–128)；protocol?: messages|chat_completions|responses|gemini；
reasoning_effort?: off|minimal|low|medium|high|xhigh|max；
task_id: uuid(转 brandString)；request_id?: uuid(转 ProviderRequestId)；
status: queued|running|completed|failed|unknown|cancelled；
result?: { summary: string(1–8192),
           recommendations: string(1–8192)[](最多 32),
           files: { path: string(≤240 且校验), content: string(≤131072) }[](最多 16) }；
failure_code?: /^[A-Z0-9_]{1,80}$/；created_at: ISO datetime(带 offset)
```
- **回执校验的链式相等约束（照抄为行为，C:86）**：`status === "completed"` 的真值与"`result` 字段存在（非 `undefined`）"的真值必须**相同**——即 `status` 为 `completed` 时 `result` 必须存在，`status` 为其他值时 `result` 必须不存在。源码为逐字的 `.refine((value) => value.status === "completed" === (value.result !== void 0))`（左结合链式 `===`），重写按上述真值等价行为保留，不改写为 if/else 分支之外的语义。
- `file.path` 校验（C:46）：`min(1).max(240)`，且不以 `/` 开头、不含 `\`/`:`/NUL/CR/LF、按 `/` 分段均非空且不为 `.`/`..`/`.git`。

`presentCall`（I:342-347）：`{ card:'generic', title:'HEY guidance', kind:'other', rawInput: args }`。

### 4) 错误文本（逐字，含插值模板）

#### A. 直接抛出的错误（不可被工具层吞掉）

| 字符串（逐字） | 类型 | 触发条件 | 证据 |
|---|---|---|---|
| `HEY guidance requires a calling Session` | `ToolContextUnavailableError` | `exec.agent === undefined`（在 `try` 之前） | I:115 |
| `HEY guidance requires a canonical platform origin` | `Error` | `new URL(config.origin)` 失败（加载期） | C:128 |
| `HEY guidance requires canonical HTTPS or an explicitly enabled IPv4 loopback origin` | `Error` | origin 非规范、含 userinfo、非 HTTPS 且非显式放行的 IPv4 回环（加载期） | C:130 |
| `Use an operation_id containing 8–64 letters, digits, underscores or hyphens` | `Error` | `operation_id` 不匹配 `/^[A-Za-z0-9_-]{8,64}$/u`（`guidanceOperationKey` 内） | C:141 |

> **已知行为（如实保留）**：上表第 4 条与下列 B 类中由 `source()` 抛出的两条 `ToolContextUnavailableError`（"Import…"/"Source inspection…"）、以及 `present()` 的 `account-changed`，均在 `try` 块内抛出，会被最外层 `catch`（I:261-266）按 §B 的兜底转成 `HEY guidance is unavailable...`（`account-changed` 另有专门分支）。即：**非法格式的 `operation_id`、未导入 workspace、源检查不完整，对工具调用者并不暴露上表原文，而是收到通用失败消息**。只有第 1 条（无 agent）在 `try` 外，原文直达调用者。

#### B. 工具层返回的失败/状态消息（经 `failure(status,message)`，带 `operation_id` 若提供）

| status | message（逐字） | 触发条件 | 证据 |
|---|---|---|---|
| `failed` | `The HEY account is unavailable; no guidance request was submitted.` | `getPlatformSession()` 抛错 | I:123-126 |
| `failed` | `Sign in to the configured HEY account before requesting managed guidance.` | `session===null` 或 `session.origin!==origin` 或 `session.authenticatePage!==true` | I:128-131 |
| `failed` | `Supply a stable operation_id for request, status or cancel.` | `action` 为 `request`/`status`/`cancel` 但 `operation_id===undefined` | I:203 |
| `failed` | `Managed guidance requires mode=managed and an already selected HEY account model. Keep BYOK work local or let the user choose a managed model; do not silently switch.` | `mode!=="managed"` 或 `model===undefined` 或 `model.provider` 不在 §1.2 白名单 | I:211-217 |
| `failed` | `Supply a capability and 1–65536 UTF-8 bytes of task text. Do not include credentials or unrelated workspace files.` | `capability===undefined` 或 `task===undefined` 或 `task.trim()===""` 或 `Buffer.byteLength(task)>65536` | I:218 |
| `failed` | `The requested guidance capability is unavailable. Do not claim its references were used.` | `availability().data` 中不存在 `{id===capability && available}` | I:219 |
| `unknown` | `Submission could not be confirmed. Recover using status and the same operation_id; do not automatically repeat request.` | `submit()` 抛 `outcome-unknown`/`invalid-response` 后，`lookup()` 恢复也失败 | I:252-257 |
| `failed` | `The HEY account changed or its grant was refreshed. Results from the previous grant are withheld; check the active account and use status with the same operation_id.` | 捕获到 `GuidanceTransportError` 且 `code==="account-changed"` | I:263 |
| `unknown` | `No owned receipt is currently available. This does not prove an interrupted submission was never accepted.` | `code==="not-found"` 且 `action` 为 `status`/`cancel` | I:264 |
| `failed` | `The HEY server does not provide the requested guidance operation. No new guidance result is available; ordinary local development remains available.` | `code==="not-found"` 且 `action` 为其他 | I:264 |
| `failed` | `HEY guidance is unavailable. Check the account, workspace and task budget; ordinary local development remains available.` | 最外层 `catch` 兜底：其余一切错误（含 `source()` 的两条 `ToolContextUnavailableError`、非法 `operation_id` 的 `Error`、其他 `GuidanceTransportError`） | I:261-266 |

#### C. 传输错误分类（内部 `GuidanceTransportError`，message = `` HEY guidance ${code} ``，C:103-115）

| code | 触发条件 | 证据 |
|---|---|---|
| `invalid-response` | 响应 `content-type` 非 `application/json`、无 body、读取超 `maxResponseBytes`、`JSON.parse` 失败、schema 校验失败、`submit()` 字段比对失败、`availability`/`parseReceipt` 校验失败 | C:152-181,229,239-240,252-254 |
| `outcome-unknown` | `fetch` 抛错、响应 `status>=500`、`call()` 中 `readJson` 的非传输异常 | C:209-211,214,220-223 |
| `unauthorized` | HTTP `401`/`403` | C:214 |
| `not-found` | HTTP `404` | C:214 |
| `rejected` | 其他 `400`–`499`（非 401/403/404） | C:214 |
| `account-changed` | `identity.current()` 为 `false`（请求前与响应后各校验一次） | C:194,224 |

> 这些 code **不直接暴露给工具调用者**：它们被 `run()` 的 `catch` 映射为 §B 的失败/状态消息（唯一例外：`submit` 的 `catch` 在 `signal.aborted` 时进入取消清理，见 §5 与 §6）。

### 5) 副作用

#### 5.1 本地

- 注册工具 `uma_guidance`（I:268）与生命周期 effect（I:109-112）；维护 `pending` 集合跟踪在途请求。
- **不写任何本地文件、不执行项目代码**（工具描述明确声明 "does not expose internal resources or run project checks"）。
- 获取源摘要时只读元数据：调用 `ctx.workspaceRegistry.list()`、`ctx.codingWorkbench.doctor({workspaceId,sessionId}, signal)`，取 `fingerprint.digest`；摘要值 = `SHA256(\`${workspace.id}\0${digest}\`).hex`（I:142-151）。
- 账户服务：`ctx.deepseekAccount.getPlatformSession()`、`ctx.deepseekAccount.resolveToken(origin)`（后者用于 `identity.current()` 判断换号；比较结果等于 `session.token` 时为 true）（I:120,135）。

#### 5.2 预算（有状态的远端副作用）

- `request` 分支在全部前置校验通过后，调用 `ctx.umaTaskBudgets.prepare({ origin, token: session.token, sessionId: agent.id, kind: "device" }, signal)` 取得 `taskId`，并以其 `brandString` 作为 `submit` 的 `task_id`（I:221-226）。这是本工具唯一"占用资源"类副作用（准备设备类任务预算）。

#### 5.3 远端 HTTP 请求（`GuidanceClient.call`，C:192-226）

统一头部（C:195-198）：`authorization: Bearer <token>`、`content-type: application/json`；`identity.headers`（若提供）作为基础头；`key` 提供时加 `idempotency-key: <key>`。`redirect:'error'`（不跟随重定向）。超时：`recovery=true` 用 `recoveryTimeoutMs`，否则用 `requestTimeoutMs`（与 `signal` 取 `AbortSignal.any`）。

| 方法 | 路径（拼在规范化 `origin` 后） | key | recovery | body | 触发分支 |
|---|---|---|---|---|---|
| GET | `/v1/private-guidance/capabilities` | 无 | true | 无 | `capabilities`；`request` 前置检查 capability 可用性 |
| POST | `/v1/private-guidance` | 有 | false | `SubmitInput` JSON | `request` 提交 |
| GET | `/v1/private-guidance/by-key` | 有 | true | 无 | `status`、`cancel`、`request` 恢复路径 |
| POST | `/v1/private-guidance/${id}/cancel` | 无 | true | 无 | `cancel`；abort 清理路径 |

`SubmitInput`（C:29-38,228-237）：`{ private_execution: true, capability, model_id: model.model, reasoning_effort?: model.reasoningEffort, protocol, task_id: brandString(budget.taskId), source_digest: digest, input: args.task }`。
- `protocol` 映射（I:233）：`hey-responses→responses`、`hey-gemini→gemini`、`hey-chat-completions→chat_completions`、其余（`hey-messages`/`deepseek-account`）`→messages`。

#### 5.4 已知行为（如实记录，不修正）

- **`submit()` 不比对 `capability` / `input`**：回执返回后只比对 `reasoning_effort`、`protocol`、`source_digest`、`model_id`、`task_id` 五个字段是否等于提交值（C:252-254）；`capability` 与 `input`（任务文本）**不在比对之列**——即使回执里这两项与提交不符也不会因此判为 `invalid-response`。
- **abort 路径中 `cancelKnown()` 失败被静默吞掉**：`submit` 抛错后若 `signal.aborted`，用 `AbortSignal.timeout(recoveryTimeoutMs)` 尝试 `lookup`+`cancel`；该清理的 `catch(_unconfirmed){}` 为空——失败被吞，不向调用者暴露（I:240-251）。清理完成（无论成功失败）后 `signal.throwIfAborted()` 仍抛 `AbortError`。
- **POST 提交永不自动重放**（C:183）：`submit` 失败后只经 `lookup`/`status` 恢复，不重新 POST。
- **capabilities 为 recovery 读**（用较短 `recoveryTimeoutMs`）；`submit` 为单次 POST（用 `requestTimeoutMs`）；无缓存。

### 6) 边界条件

- **空**：
  - `action` 缺失 → schema 拒绝（必填枚举），不进入 `execute`。
  - `request`/`status`/`cancel` 缺 `operation_id` → 返回 `failed` "Supply a stable operation_id…"。
  - `task` 为空串或 `trim()` 后为空 → 返回 `failed` "Supply a capability and 1–65536…"。
  - `capability` 缺失（`request`）→ 同上 "Supply a capability…"。
  - `details` 缺省时 render 只输出 `message`（无尾随换行）。
- **超长**：
  - `task` > `65536` UTF-8 字节 → "Supply a capability and 1–65536…"；`operation_id` 须 8–64 字符（字母/数字/`_`/`-`），越界由 `guidanceOperationKey` 抛错但被兜底转 "HEY guidance is unavailable…"（见 §4·A 注）。
  - 响应体 > `maxResponseBytes`（默认 `1048576`，schema 上限 `2097152`）→ `invalid-response`。
  - 回执字段上限：`model_id` ≤128、`summary` ≤8192、`recommendations` ≤32 条且每条 ≤8192、`files` ≤16 且 `path` ≤240/`content` ≤131072、`failure_code` ≤80；`capabilities.data` ≤3。
- **越权 / 身份变更**：
  - `session.origin` 必须**严格字符串等于** `config.origin`；`authenticatePage` 必须 `===true`；否则 "Sign in to the configured HEY account…"。
  - `identity.current()`（`resolveToken(origin)===session.token`）在请求前与响应后各查一次；false → `account-changed` → "The HEY account changed…"。
  - HTTP `401`/`403` → `unauthorized`（被兜底转 "HEY guidance is unavailable…"）；origin 非规范 HTTPS/显式 IPv4 回环 → 加载期抛错。
  - 工作区未导入（无匹配 `workspace`）或 `fingerprint.complete===false` → `source()` 抛错 → 兜底 "HEY guidance is unavailable…"。
- **不存在**：
  - `agent` 缺失 → 直接抛 "HEY guidance requires a calling Session"。
  - `session===null` → "Sign in to the configured HEY account…"。
  - HTTP `404` → `not-found`；`status`/`cancel` → "No owned receipt is currently available…"，其他 → "The HEY server does not provide…"。
  - capability 在 `availability()` 中不可用 → "The requested guidance capability is unavailable…"。
- **中止（并发/生命周期）**：
  - `exec.signal` 或插件 `lifetime.signal` 中止 → `signal.throwIfAborted()` 抛 `AbortError`（原生）。
  - `submit` 期间中止 → 触发 `lookup`+`cancel` 清理（失败静默吞），随后抛 `AbortError`；不会自动重提交。
  - 插件卸载：等所有 `pending` settle（`Promise.allSettled`，吞掉结果）。
- **组合逻辑边界**：
  - `mode` 必须严格为 `managed`；`model` 必须已选且 provider 在白名单，否则 "Managed guidance requires mode=managed…"。
  - `capabilities` 分支不需要 `operation_id`/`mode`/`capability`/`task`；`request` 才需要全套校验。
  - `status`/`cancel` 只做 `lookup`（及 `cancel`），不校验 `mode`/`capability`/`task`、不准备预算、不提交。
  - `completed` 回执才校验源摘要并可能返回 `stale`；其他状态直接映射，不读源。
- **编码**：`task` 按 UTF-8 字节计数（`Buffer.byteLength`）；响应按 UTF-8 解码且仅接受 `application/json`；`source_digest` 为 64 位小写 hex。

### 7) 证据出处

I:81-97,104-349；C:29-38,54-96,103-115,122-143,151-181,183-276；E:10。

---

## 四、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `capabilities` / 正常返回 Capabilities | `available` + details 结构 + render 拼 details |
| `request` / 正常提交 completed | 全套校验、预算 prepare、submit 五字段比对、completed 消息 |
| `request` / 源摘要变化 → stale | details 六字段挑选 |
| `status` / queued、running → pending | 不校验 mode/task、只 lookup |
| `cancel` / cancelled + not-found | cancelled 消息、not-found 双分支 |
| 缺 agent / session 不可用 / 未登录 | 一条直达抛错 + 两条失败消息 |
| 缺 operation_id / 非法 operation_id 格式 | 缺失消息 + 兜底 "HEY guidance is unavailable…"（已知行为） |
| mode/provider 非法 / capability 不可用 / task 空或超 65536 字节 | 四条失败消息 |
| account-changed / outcome-unknown / invalid-response | 专门映射 + 恢复成功/失败两路径 |
| abort 期间 submit 失败 / cancelKnown 失败 | AbortError + 静默吞掉 + 不重放 |
| origin 校验 / 规范 HTTPS、userinfo、http 回环放行与拒绝 | 加载期两错误 + 回环开关 |

---

## 五、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数表/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字，无"报错"这类概括，含插值模板与弯引号/短横线
- [ ] 没有出现"先 X 再 Y"这类实现描述（哈希公式与字段比对为值/契约描述，非步骤）
- [ ] 冻结契约单独列出（§1 内部标识 vs 对外 HEY 身份），未混入行为描述
- [ ] 边界覆盖空/超长/越权/不存在/中止/编码
- [ ] 已知行为如实记录：submit 不比对 capability/input、cancelKnown 失败静默吞、receipt.refine 链式 `===`、非法 operation_id 被兜底
- [ ] 副作用具体到方法/路径/头部/body/预算服务
- [ ] 找一名没看过 src 的人读一遍，能复述出工具的参数、全部错误文本、副作用与边界

---

## 六、自查结果（写完后遮住 src 复述）

方法：遮住全部 `src/*.ts`，仅凭本 spec 复述 `uma_guidance` 的参数、错误文本、副作用、边界，再与源码逐条比对。

### 6.1 参数
复述出 5 个参数：`action`（必填枚举 4 值）、`operation_id`、`capability`（3 值）、`task`、`mode`（仅 `managed`）；记得 `request`/`status`/`cancel` 在工具层强制 `operation_id`，`request` 额外要 `mode=managed`+已选 HEY 模型+`capability` 可用+`task` 1–65536 字节。与 I:272-304、I:203-219 一致。

### 6.2 错误文本（逐字）
复述出 §4·A 的 4 条抛错、§4·B 的 11 条失败/状态消息、§4·C 的 6 个传输 code，含弯引号 `Session’s`、短横线 `1–65536`/`8–64`、`HEY guidance ${code}` 前缀，以及"非法 operation_id/未导入 workspace/源检查不完整被兜底成 HEY guidance is unavailable"的已知行为。与 I:115-266、C:103-141 一致。

### 6.3 副作用
复述出：注册工具+effect+`pending`；不写本地文件；`workspaceRegistry.list()`/`codingWorkbench.doctor()` 取摘要并算 SHA-256；`deepseekAccount` 取会话与换号判定；`umaTaskBudgets.prepare(kind:"device")` 占预算；四条 HTTP（GET capabilities / POST 提交带 idempotency-key / GET by-key / POST cancel）及统一头部、超时、redirect:error；submit 不比对 capability/input、cancelKnown 静默吞、POST 不重放、status/cancel 不准备预算。与 I:104-349、C:192-276 一致。

### 6.4 边界
复述出空（action/operation_id/task/capability）、超长（task 65536 字节、operation_id 8–64、响应 maxResponseBytes、回执各上限）、越权（origin 严格相等、authenticatePage、identity.current、401/403、workspace/fingerprint）、不存在（agent/session/404/capability 不可用）、中止（AbortError、abort 清理、卸载 allSettled）、组合逻辑（capabilities 不需全套、status/cancel 只读、completed 才校验源）。与源码逐条吻合。

### 6.5 结论
遮住源码后，仅凭本 spec 能完整复述 `uma_guidance` 的参数、全部错误文本（含插值与标点）、四类副作用、六类边界，并与源码逐条一致；"行为等价、实现独立"的合格标准达成。
**唯一提示项**：插件 id 按任务"按源码逐字"保留 `uma-guidance`（§1.3），若需与 design 包 `tool-hey-design` 对外口径统一，由评审定稿，本 spec 不擅改。
