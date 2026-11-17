# spec: dsh-uma-task-budget（1 个 typert 远程服务：`uma_session_budgets`）

> 重写目标：行为等价的 `heywork-uma-task-budget` 实现。
> 证据：`uma-assets/packages/dsh-uma-task-budget/src/types/index.ts`（下称 **I**，430 行）、
> `src/typert.host.ts`（下称 **H**）、`src/typert.remote-client.ts`（下称 **RC**）、
> `src/types/types.ts`（下称 **T**）、`src/index.ts`（下称 **X**）、`README.md`（下称 **README**）。
> 这些是逆向还原的可读 TS，不是原始源码；行号仅供校对，不作为抄写依据。
> 范围：1 个 typert 远程服务，对外暴露 `read` / `update` 两个 invocation（**不是 `defineTool`**，
> 没有 `name`/`description`/`parameters`/`output`/`execute`/`render`/`presentCall`）。
> 状态：**待横向评审**（写完后需验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了行为全废）

### 1.1 内部标识（逐字保留）

| 项 | 值 | 证据 |
|---|---|---|
| 包名 | `@deepseek-ai/dsh-uma-task-budget` | H:72,144；RC:73 |
| 导出类 | `UmaTaskBudgets`，并 `UmaTaskBudgets as default`（X:10；I:409-410） |
| 服务注册名（typert / cordis） | `umaTaskBudgets`（super 第二参数；H:75,108 的 `service`） | I:181；H:75 |
| typert namespace | `hey-budget`（RemoteError code 亦用此前缀） | I:181,154 |
| 存储域 | `defineDomain({ name: 'uma_session_budgets', version: 1 })`；global schema `{ installationId: z.uuid().nullable() }`，initial `{ installationId: null }`，`tables: {}` | I:143-150 |
| invocation id（2 个，逐字） | `hey-budget/read`、`hey-budget/update` | H:74,107；RC:75,108 |
| 方法装饰器 | `@Remote('read')`、`@Remote('update')`（不是 defineTool） | I:324,341 |
| result typeSymbol | `@deepseek-ai/dsh-uma-task-budget/types#SessionBudgetView`（read 与 update 共用） | H:100,133；RC:101,134 |
| request typeSymbol | `@deepseek-ai/dsh-uma-task-budget#hey-budget/read:request`、`...#hey-budget/update:request` | H:85,118；RC:86,119 |
| 生成源位置（逐字） | `{"file":"packages/credentials/hey-task-budget/src/index.ts","line":187,"column":9}`（read）、`line:203`（update） | H:105,138 |
| HTTP 端点 | `POST /v1/session-budgets`（read/view）、`PATCH /v1/session-budgets/<budget.id>`（update） | I:281,351 |
| 请求体固定字段 | read：`client_ref`、`session_ref`、`purpose: 'HeyWork session'`、`cap: null`；update：`cap`、`state`、`expected_version` | I:282-283,352-353 |
| 传输头 | `authorization: 'Bearer <token>'`、`accept: 'application/json'`、`content-type: 'application/json'` | I:232 |
| 对外 Transport 头（README） | `X-HEY-Task-ID`（传输元数据，不进模型上下文） | README:55 |
| 协议标记 | `prepare()` 返回 `{ taskId: <budget.id>, protocol: '1' }`；`taskId` 须匹配 `^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$` | I:153,403,405 |
| 金额正则 `decimal`（逐字） | `^(0|[1-9][0-9]{0,9})(\.[0-9]{1,6})?$` | I:152 |
| 金额/类型 | CNY 十进制字符串（整数部分 0 或 1–10 位非 0 开头，可选 1–6 位小数）；`cap` 可为 `null` | I:152,157；README:28 |
| 状态枚举（逐字） | `active`、`paused`、`closed` | I:20,158；H:27 |
| 错误码前缀 | `hey-budget/failed`（`RemoteError` code）；message 恒为 `The session budget operation could not be completed`；`details.reason` 见 §五 | I:154 |
| 数值边界 | `timeoutMs` 默认 `10_000`、`cacheMs` 默认 `15_000`；合法：`timeoutMs` 安全整数 100–60000，`cacheMs` 安全整数 0–60000 | I:165,182-186 |
| 响应上限 / 溯源深度 | 单次响应 65536 字节；`rootOf` 最多 64 层 | I:252,211 |
| 缓存上限 | `remember` 在 `cache.size >= 1024` 且新 key 时清空 | I:311 |

### 1.2 "对外 hey 身份"口径

`uma_session_budgets`、`umaTaskBudgets`、`hey-budget/*`、`hey-budget/failed` 是内部/协议标识，
按源码逐字保留（`HEYWORK.md` §2）；对外品牌为 `HeyWork`。`hey-budget` 前缀本身已是 hey，不改。
`prepare` 返回的 `X-HEY-Task-ID` 属传输元数据，不进模型上下文。

---

## 二、服务装配与生命周期

- `class UmaTaskBudgets extends TypertRemoteService`（I:163）。
  - `static inject = ['typert', 'storageDomain', 'sessionQuery']`（I:164）。
  - `static Config = configSchema.object({ timeoutMs: default(10_000), cacheMs: default(15_000) })`（I:165）。
  - 构造：`super(ctx, 'umaTaskBudgets', { namespace: 'hey-budget' })`（I:181）。
  - 非法数值边界 → 抛 `HEY budget resource limits are invalid`（I:186）。
  - `ctx.effect` 退出：abort `lifetime`、清 `cache`、`Promise.allSettled(pending)`、`domain?.close()`（I:187-192）。
  - 监听 `deepseek-account/signed-out` 与 `deepseek-account/access-blocked` → 清 `cache`（I:193-194）。
- `[Service.init]`（I:197-207）：`storageDomain.open(storage)`；若期间 abort 则 close 后 `throwIfAborted`；
  `installationId = global.get().installationId ?? randomUUID()`；若为 `null` 则 `global.set({ installationId })`。
  **本地只存一个安装 UUID；不存 token、额度、用量或余额。**
- `TYPERT`（H:143，host face）与 `TYPERT_REMOTE`（RC:72，`export default`）：`package` 相同，
  face 为 `host`；`invocations` 由 `$remote.descriptors` 暴露两个方法；`TYPERT.model` 内嵌服务与类型声明。

---

## 三、typert 协议字段（体现"非 defineTool"差异）

两个 invocation 的描述符字段逐字如下（host / remote 两份内容一致）：

| 字段 | `hey-budget/read` | `hey-budget/update` |
|---|---|---|
| `service` | `umaTaskBudgets` | `umaTaskBudgets` |
| `description` | `Read the root allowance for a real local session under the current HEY account.` | `Replace the reviewed root cap/state; accepted calls keep their reservations and can settle.` |
| `invocation.kind` | `direct` | `direct` |
| `parameters[0].name` | `request` | `request` |
| `parameters[0].description` | `local session; delegated sessions resolve to their recorded root.` | `current session, observed version, explicit CNY cap or no extra cap, and next state.` |
| `parameters[0].source` | `json` | `json` |
| `codec.mode` / `strictCodec.mode` | `strict` / `strict` | `strict` / `strict` |
| `codec.typeSymbol` | `@deepseek-ai/dsh-uma-task-budget#hey-budget/read:request` | `@deepseek-ai/dsh-uma-task-budget#hey-budget/update:request` |
| `codec.jsonSchema` | `{sessionId:string}`, required `[sessionId]`, `additionalProperties: true` | `{sessionId, expectedVersion:number, cap:null\|string, state:enum}`, required 全四项, `additionalProperties: true` |
| `strictCodec.jsonSchema` | 同上但 `additionalProperties: false` | 同上但 `additionalProperties: false` |
| `cancellation.parameter` | `signal` | `signal` |
| `result.mode` / `typeSymbol` | `strict` / `@deepseek-ai/dsh-uma-task-budget/types#SessionBudgetView` | 同左 |
| `result.description` | `a credential-free current allowance and root identity.` | `the committed allowance, or an explicit conflict requiring a fresh read.` |
| `sourceLocation` | 见 §1.1（line 187） | 见 §1.1（line 203） |

- model 面声明（`TYPERT.model.services`，H:150-203）：service `key: 'umaTaskBudgets'`、`exportName: 'UmaTaskBudgets'`，
  `summary`/`description` 均为 `Owns opaque local bindings, issuer requests and root-session resolution.`；
  `members` 含 `read`、`update`、`prepare` 三个 method（含完整 signature 文本与 JSDoc）。
- `prepare` **不是** Remote 调用、不是模型可见工具：它接收 Host-only 的 `BudgetRequest`，用于模型请求准入，
  不在本节两个 invocation 内（见 §六说明）。

---

## 四、数据契约：预算三态与 cap/spent/reserved

`SessionBudget`（I:23-34；T:20-31）字段与语义：

| 字段 | 类型 | 语义 |
|---|---|---|
| `id` | string（UUID） | 预算记录 id，update 的 PATCH 路径与 prepare 的 `taskId` |
| `purpose` | string | 用途（read 创建时传 `HeyWork session`） |
| `cap` | string \| null | CNY 上限字符串；`null` 表示**不增加会话支出上限**（账号资金与 API key 额度仍生效） |
| `spent` | string | 已支出 CNY 金额（服务端权威） |
| `reserved` | string | 已预留 / 在途 CNY 金额（服务端权威；暂停时保留，可继续结算） |
| `state` | `'active' \| 'paused' \| 'closed'` | 预算三态，见下 |
| `operatorPaused` | boolean | 运营方独立暂停标志（与 `state` 平行，由服务端强制） |
| `operatorReason` | string | 运营方暂停原因（wire 上限 500 字） |
| `version` | number（正整数） | 乐观并发版本；update 须带 `expectedVersion` |
| `expiresAt` | string（ISO 8601，带 offset） | 到期时间 |

`SessionBudgetView`（I:37-42；T:33-38）：`{ sessionId, rootSessionId, shared, budget }`；
`shared = sessionId !== rootSessionId`（root 会话为 `false`）。

**三态语义**：
- `active`：可准入。
- `paused`：暂停；已接受的预留保留，可继续结算；`prepare` 拒绝（见 §六）。
- `closed`：关闭；`prepare` 拒绝。
- `operatorPaused === true` 时不论 `state` 为何，`prepare` 一律拒绝，并提示打开会话头的 Budget 查看原因。

**权威归属**：服务端负责预留、支出、版本冲突与暂停；本地缓存从不替代服务端预留检查（README:35,39）。
`read`/`update` 只传预算元数据，不传凭据到模型上下文。

---

## 五、调用行为规格（typert Remote）

> 通用约定：`read`/`update` 都是 `RemoteError('hey-budget/failed', 'The session budget operation could not be completed', { reason })`，
> 其中 `reason` 逐字取值见各节。本地不持久化额度/余额；一切网络请求 `redirect: 'error'`、`cache: 'no-store'`，
> 并与 `lifetime.signal`、调用方 signal、`AbortSignal.timeout(timeoutMs)` 合并。

### 5.1 `hey-budget/read`（`UmaTaskBudgets.read`）

**1) 签名**

- invocation id：`hey-budget/read`；装饰器 `@Remote('read')`（I:324）。
- 方法签名：`async read(request: ReadRequest, signal: AbortSignal): Promise<SessionBudgetView>`（H:162）。
- 调用方式：generated `remote['hey-budget'].read(...)` facade（README:28），**非 `defineTool`**。

**2) 参数表**

| 字段 | 类型 | 必填 | 含义 |
|---|---|---|---|
| `request.sessionId` | string（descriptor；signature 记为 `SessionId` 品牌类型） | 是 | 本地会话；子会话解析到其记录中的 root |
| `signal` | AbortSignal | 是（cancellation 参数） | 视图生命周期 |

**3) 返回**

`SessionBudgetView`（§四字段表），`description: 'a credential-free current allowance and root identity.'`。
`root = rootOf(sessionId)`；`reference = sha256(installationId + '\0' + String(root)).hex`；
POST `/v1/session-budgets` 体 `{ client_ref: installationId, session_ref: reference, purpose: 'HeyWork session', cap: null }`。
`shared = sessionId !== root`。

**4) 错误文本**（逐字）

统一 `RemoteError`：code `hey-budget/failed`，message `The session budget operation could not be completed`，
按 `details.reason` 区分：`account-required`（账号缺失/401）、`invalid-issuer`、`invalid-response`、
`response-too-large`、`request-failed`（其余非 2xx）、`version-conflict`（409，read 正常不会触发）、
`budget-committed`（402）、`server-upgrade-required`（404）、`cyclic-session-lineage`、`session-lineage-limit`、
`account-changed`（元数据完成后账号变更）。
底层 fs/网络错误若非 RemoteError 原样上抛（不包装）。

**5) 副作用**

- 发起一次服务端 POST 元数据请求（不传用户 token 到模型上下文，仅作 `Bearer` 头）。
- 写本地缓存 `remember(key, view)`，key = `${origin}\0${token}\0${rootSessionId}`；延迟到达的旧版本不覆盖新版本；缓存条目 `expires = Date.now() + cacheMs`；超限清空。
- 不写 token / 额度 / 用量到本地存储；`deepseek-account/signed-out`、`access-blocked` 时清缓存。

**6) 边界条件**

- 空/不存在：`sessionId` 为非空字符串由 descriptor 保证；root 会话解析不到父则以其自身为 root。
- 越权：账号 origin/token 取自 `deepseekAccount.getPlatformSession()` 与 `resolveToken`，缺失 → `account-required`；账号在请求前后变化 → `account-changed`。
- 溯源：`rootOf` 只跟随 `origin === 'subagent'` 且带 `parentSession` 的会话；遇环 → `cyclic-session-lineage`，超过 64 层 → `session-lineage-limit`。
- 响应：非法 issuer（非 HTTPS 且非 `127.0.0.1` HTTP，或带 userinfo）→ `invalid-issuer`；> 65536 字节 → `response-too-large`；JSON / 形状非法 → `invalid-response`；`redirect: 'error'`。
- 并发：同一 key 的历史版本不会覆盖较新缓存值。
- 中止：与 `lifetime.signal` 合并；abort 直接上抛中止错误。

**7) 证据出处**：I:324-333, 209-222, 224-285, 287-303, 306-316；H:74-106。

---

### 5.2 `hey-budget/update`（`UmaTaskBudgets.update`）

**1) 签名**

- invocation id：`hey-budget/update`；装饰器 `@Remote('update')`（I:341）。
- 方法签名：`async update(request: UpdateRequest, signal: AbortSignal): Promise<SessionBudgetView>`（H:169）。
- 调用方式：generated facade，**非 `defineTool`**。

**2) 参数表**

| 字段 | 类型 | 必填 | 含义 |
|---|---|---|---|
| `request.sessionId` | string | 是 | 当前会话；解析到 root 后作用于 root 预算 |
| `request.expectedVersion` | number | 是 | 观察到的版本号，须为安全整数且 ≥ 1 |
| `request.cap` | string \| null | 是 | 显式 CNY 上限字符串（符合 `decimal`）或 `null`（不增加上限） |
| `request.state` | `'active' \| 'paused' \| 'closed'` | 是 | 目标状态 |
| `signal` | AbortSignal | 是（cancellation 参数） | 操作生命周期 |

**3) 返回**

`SessionBudgetView`（含提交后的 `budget`），`description: 'the committed allowance, or an explicit conflict requiring a fresh read.'`。
对解析出的 root 预算发起 `PATCH /v1/session-budgets/<budget.id>`，
体 `{ cap: request.cap, state: request.state, expected_version: request.expectedVersion }`；
`expectedVersion` 须等于当前预算版本（`version`）。成功返回的预算保留原有 `reserved`/`spent`（服务端权威）。

**4) 错误文本**（逐字）

- 本地校验：`!Number.isSafeInteger(expectedVersion) || expectedVersion < 1 || (cap !== null && !decimal.test(cap))` →
  `reason: 'invalid-budget'`。
- 其余与 `read` 共用 `hey-budget/failed` + `reason`：`account-required`、`account-changed`、`invalid-issuer`、
  `invalid-response`、`response-too-large`、`request-failed`、`version-conflict`、`budget-committed`、
  `server-upgrade-required`、`cyclic-session-lineage`、`session-lineage-limit`。
- 语义：`version-conflict`（409）表示版本过期，需重新 `read`；`budget-committed`（402）表示预算已提交不可改。

**5) 副作用**

- 发起一次 PATCH 到 root 预算（经服务端权威处理预留/支出/暂停）。
- 成功后 `remember(key, { ...view, budget })` 更新缓存；`key` 同 `read`。
- 不改本地 `spent`/`reserved`（仅服务端改），不写 token/额度到存储。

**6) 边界条件**

- 空/不存在：`cap: null` 合法（不增加会话支出上限）；`cap` 缺省（undefined）会命中 `decimal.test` 失败 → `invalid-budget`（descriptor required）。
- 超长/非法：`cap` 非十进制串 → `invalid-budget`；`expectedVersion < 1` 或非安全整数 → `invalid-budget`。
- 越权：账号变更前后各检查一次 `stillCurrent` → `account-changed`；未登录 → `account-required`。
- 并发：版本冲突（409）→ `version-conflict`，调用方需重新 `read` 获取新 `version` 后重试；暂停时已接受的预留保留、可结算。
- 状态：`state` 只能是三态枚举之一；`operatorPaused` 由服务端独立强制，本调用不改它。
- 响应/中止：同 `read` 的 issuer、响应大小、JSON 形状、abort 规则。

**7) 证据出处**：I:341-358, 224-276, 306-316；H:107-139。

---

## 六、`prepare` 与错误 reason 汇总（对照，非 spec 主体）

`prepare(request: BudgetRequest, signal)`（I:366-406）是 Host-only 模型请求准入，**不是** typert Remote、
不是模型可见工具；本 spec 不把它列为工具，但列出其对外行为供实现对齐：

| 触发 | 错误（逐字 message / code） |
|---|---|
| `sessionId` 非 string、空、> 256 | `A real session is required for a HEY task budget` / `HEY_TASK_BUDGET_UNAVAILABLE` |
| `kind==='device'` 且账号在准入前变更 | `The HeyWork account changed before budget admission` / `HEY_TASK_BUDGET_ACCOUNT_CHANGED` |
| 元数据失败且 reason `account-required` | `Sign in to HeyWork again to read the session budget` / `ACCOUNT_TOKEN_INVALID`（status 401） |
| 其他元数据失败、预算不可读 | `The HEY session budget could not be read. The model request has not been dispatched.` / `HEY_TASK_BUDGET_UNAVAILABLE` |
| `kind==='device'` 账号在 dispatch 前变更 | `The HeyWork account changed before dispatch` / `HEY_TASK_BUDGET_ACCOUNT_CHANGED` |
| `operatorPaused === true` | `Operations paused this session budget. Open Budget in the session header for the recorded reason.` / `HEY_TASK_BUDGET_PAUSED` |
| `state !== 'active'` | `This session budget is paused or closed. Use Budget in the session header to resume it.` / `HEY_TASK_BUDGET_PAUSED` |
| `budget.id` 非 UUID | `HeyWork returned an invalid task budget` / `HEY_TASK_BUDGET_UNAVAILABLE` |

成功返回 `{ taskId: budget.id, protocol: '1' }`。并发子请求共享一个 pending 元数据请求；取消一个子请求
不影响其他子请求（README:35）。服务端 `spent`/`reserved`/暂停/版本冲突权威；本服务不重试推理、不退款。

---

## 七、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `hey-budget/read` / root 会话、子会话 shared、账号缺失、溯源环、溯源超深、非法 issuer、超大响应、非法 envelope、账号变更 | 九分支 |
| `hey-budget/update` / cap 合法串、cap=null、expectedVersion 非法、version-conflict、账号变更、暂停保留预留 | 六分支 |
| 缓存 / 旧版本不覆盖、signed-out 清缓存、1024 清空、并发 pending 去重 | 四分支 |
| `prepare` / sessionId 非法、账号变更、operatorPaused、state≠active、非法 taskId、成功 | 六分支 |

---

## 八、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数表/返回/错误文本/副作用/边界/证据）
- [ ] 体现 typert 而非 defineTool 的差异（无 output/render/presentCall，有 descriptor 字段）
- [ ] read / update 两种 action 齐全；三态与 cap/spent/reserved 语义清晰
- [ ] reason 码逐字；错误文本含插值模板
- [ ] 冻结契约单独列出；内部标识与对外 hey 身份区分
- [ ] 边界覆盖空/超长/越权/不存在/冲突/中止
- [ ] 没有出现实现步骤描述；副作用写清缓存与存储位置
- [ ] 找一名没看过 src 的人读一遍，能复述出 read / update 的行为
