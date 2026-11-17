# spec: dsh-uma-base（非 SSH 部分：4 工具 + 服务插件）

> 重写目标：行为等价的 `heywork-uma-base` 非 SSH 部分实现。
> 证据：`uma-assets/packages/dsh-uma-base/src/types/experience-capture.ts`（下称 **E**）、
> `src/types/project-memory.ts`（下称 **M**）、`src/types/weknora.ts`（下称 **W**）、
> `src/types/feedback.ts`（下称 **F**）、`src/types/profiles.ts`（下称 **P**）、
> `src/types/index.ts`（下称 **S**），以及 `src/*.ts` 入口与 `cordis.patch.yml`（下称 **PATCH**）。
> 这些是逆向还原的可读 TS，不是原始源码；行号仅供校对，不作为抄写依据。
> 范围：4 个工具（`hey_workspace_search`、`hey_experience_record`、`hey_project_memory`、
> `hey_weknora_search`）+ 服务插件（`hey-subagent-workspaces`、`hey-experience-capture`、
> `hey-project-memory`、`hey-weknora`、`uma-feedback`）+ `profiles` 纯函数 + 装配环境变量。
> **SSH 相关（`operations-ssh` / `hey_ssh_servers` / `hey_ssh_run`）本期不做，不在 spec 范围。**
> 状态：**待横向评审**（写完后需验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了行为全废）

这些不是"行为"，是**字节级字符串常量与内部标识**。重写时逐字保留，不要汉化、不要替换成同义 id。

### 1.1 内部标识（逐字保留）

| 项 | 值 | 证据 |
|---|---|---|
| 工具名（4 个，源码均为 `hey_` 前缀，无 `uma_` 工具名） | `hey_workspace_search`、`hey_experience_record`、`hey_project_memory`、`hey_weknora_search` | E:148,210；M:243；W:89 |
| 服务插件 id（源码 `name` 导出，混用 hey/uma，逐字） | `hey-subagent-workspaces`、`hey-experience-capture`、`hey-project-memory`、`hey-weknora`、`uma-feedback` | S:42；E:103；M:52；W:41；F:60 |
| 人类命令 id | `hey/project-memory`（工具侧命令）；`@deepseek-ai/dsh-command-feedback`（替换被禁用的内核 feedback 命令） | M:177；F:172 |
| 本地存储目录 / 文件名（Harness home 下） | `dshHomePath('hey-project-memory')` → 目录 `hey-project-memory`，库文件 `notes.sqlite`（mode `448` = `0700`） | PATCH:69；M:129,133 |
| 其他 Harness home 路径 | `session-search.sqlite`、`workspace-changes`、`dshHomePath('workspace-changes')` | PATCH:43,110 |
| worktree 名称前缀 | `hey-` | PATCH:88 |
| profile 层常量名与成员 | `UMA_PROFILE_BUNDLES`（键 `hey-web`/`desktop`/`hey-headless`/`hey-sdk`），包名 `@deepseek-ai/dsh-base`、`@deepseek-ai/dsh-web-app`、`@deepseek-ai/dsh-uma-base`、`@deepseek-ai/dsh-uma-web`、`@deepseek-ai/dsh-headless`、`@deepseek-ai/dsh-hey-automation`、`@deepseek-ai/dsh-sdk-app` | P:9-40 |
| 凭据串引用 | `credentialRef(config.apiKeyRef)`；请求头 `x-api-key`；知识库凭据环境变量 `HEY_KNOWLEDGE_EMBEDDING_KEY_REF` | W:77,118；PATCH:83 |
| feedback 幂等串 | `createHash('sha256').update(\`${invocation.sessionId}\0${invocation.commandId}\`).digest('hex')`，作为 `idempotency-key` 头 | F:127 |
| feedback 默认平台源 | `https://studio.umayun.com`（`origin` 默认值）；工单链接 `${origin}/account/support/${receipt.id}` | F:67,117,153 |
| feedback 请求体固定字段 | `category: 'feedback'`；`subject` 取首行前 80 字；成功回执 `category: 'product-interaction'` | F:94-96,184 |
| 经验条目标记串 | `verification: 'operator-reviewed-historical-reference'`；`sourceKey` 形如 `authored/<agent.id>/<sha256>`、`check/failure/<runId>`、`check/recovery/<a>/<b>`、`tool/<sessionId>/<code>` | E:179,256,286,309,385 |
| 工具失败成因码表键 | `IMAGE_UNSUPPORTED_MODEL`、`TEAM_TASK_INVALID_TRANSITION`、`TEAM_TASK_NOT_FOUND`（命中 `session/event` 的 `event.data.error.code`） | E:119-135,380-383 |
| check 失败状态集 | `failed`、`timed-out`、`error` | E:113-117 |

### 1.2 环境变量（源码读取，按逐字键名）

| 环境变量 | 读取方 | 用途 / 默认 | 证据 |
|---|---|---|---|
| `HEY_KNOWLEDGE_EMBEDDING_URL` | `knowledge` 插件配置 | 混合检索向量端点；未设置则本地集合不选混合模式 | PATCH:81；README:47 |
| `HEY_KNOWLEDGE_EMBEDDING_MODEL` | `knowledge` 插件配置 | 向量模型名 | PATCH:82 |
| `HEY_KNOWLEDGE_EMBEDDING_KEY_REF` | `knowledge` 插件配置 | 端点需要凭据时的 credential ref | PATCH:83 |
| `HEY_STUDIO_API_ORIGIN` | `uma-guidance` 插件配置 | 默认 `https://studio.umayun.com` | PATCH:98 |
| `HEY_STUDIO_ALLOW_LOOPBACK_HTTP` | `uma-guidance` 插件配置 | 值为 `'1'` 时开启 loopback HTTP | PATCH:99 |
| `SSH_AUTH_SOCK` | SSH 插件（`process.env`） | **本期不做，不在 spec 范围** | operations-ssh-terminal.ts:249 |

> 源码中**没有** `UMA_*` 前缀的环境变量读取；`UMA_PROFILE_BUNDLES` 是常量名而非环境变量。

### 1.3 对外 hey 身份口径

对外身份（品牌 `HeyWork`、项目 `heywork`、工具/命令的 `hey_` 前缀、`HEY_*` 环境变量前缀）按
`HEYWORK.md` §2 改名；**但上表内部标识、容器/目录字节串、密钥串按源码逐字保留**，不属于改名范围。
`uma-feedback`、`uma_session_budgets` 这类开关 id / typert id 属冻结内部标识（见 `HEYWORK.md` §2）。

---

## 二、包导出面与装配表

### 2.1 入口重导出（逐字）

| 入口文件 | 导出 |
|---|---|
| `src/index.ts` | `apply`、`inject`、`name`（来自 `types/index.ts`） |
| `src/experience-capture.ts` | `apply`、`inject`、`name` |
| `src/project-memory.ts` | `Config`、`apply`、`inject`、`name` |
| `src/weknora.ts` | `Config`、`apply`、`inject`、`name` |
| `src/feedback.ts` | `Config`、`apply`、`inject`、`name`、`submitUmaFeedback` |
| `src/profiles.ts` | `UMA_PROFILE_BUNDLES`、`isUmaProfileName`、`migrateUmaProfileBundles` |

### 2.2 装配表（PATCH 的 `insert` 行，逐字）

| id | name | 配置 / 状态 |
|---|---|---|
| `hey-subagent-workspaces` | `@deepseek-ai/dsh-uma-base` | 默认启用 |
| `hey-experience-capture` | `@deepseek-ai/dsh-uma-base/experience-capture` | 默认启用 |
| `hey-project-memory` | `@deepseek-ai/dsh-uma-base/project-memory` | `directory: dshHomePath('hey-project-memory')` |
| `hey-weknora` | `@deepseek-ai/dsh-uma-base/weknora` | **`disabled: true`**（需手动启用并配 `url`/`accountOrigin`/`accountId`/`workspaceId`/`apiKeyRef`/`knowledgeBaseIds`） |
| `knowledge` | `@deepseek-ai/dsh-knowledge` | 读 §1.2 三个 `HEY_KNOWLEDGE_EMBEDDING_*` |
| `hey-task-budgets` | `@deepseek-ai/dsh-uma-task-budget` | 见 `budget.md` |
| `uma-guidance` | `@deepseek-ai/dsh-uma-guidance` | **`disabled: true`**，读 `HEY_STUDIO_API_ORIGIN`/`HEY_STUDIO_ALLOW_LOOPBACK_HTTP` |
| `agent-team`（defaults 段） | `@deepseek-ai/dsh-agent-team` | `maxTasks: 256`、`defaultEnabled: true` |
| `system-prompt` | — | `identityText: 'You are Uma, the AI agent in HeyWork.'`；persona 含工具选择指引 |

> `feedback` 行由 HEY Web / Desktop 选 `./feedback` provider 提供（README:35），其配置默认值见 §1.1。

---

## 三、工具行为规格

> 通用约定（适用于本节 4 个工具）：
> - 每个工具经 `defineTool` 注册，具有 `name`/`description`/`parameters`/`output`/`execute`，除
>   `hey_workspace_search` 外均带 `presentCall`。
> - `output.schema` 均为 `{ type: 'string' }`；`render` 均为 `(_args, text) => [{ type: 'text', text }]`
>   （把字符串原样作为文本块）。
> - 4 个工具对本地项目文件**只读**：不写、不删、不创建项目文件，不执行项目代码；唯一的本地写
>   来自 `hey_experience_record` 经知识服务登记候选经验（写候选，不写项目文件），以及
>   `hey_project_memory` 启动期建本地 SQLite（见 §四）。

### 3.1 `hey_workspace_search`

**1) 签名**

- 工具名：`hey_workspace_search`（E:148）
- description（逐字）：`Find relevant documents in the project knowledge library or reviewed development experience. Use when a project decision needs this evidence.`
- 执行：`execute({ kind, query }, exec) => Promise<string>`（E:170）
- 输出：`schema { type: 'string' }`；`render: (_args, text) => [{ type: 'text', text }]`（E:163-169）
- **无 `presentCall`**（与其他三个工具不同）

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `kind` | string enum `['knowledge','experience']` | 是 | — | 检索哪一类库：`knowledge` 项目知识库，`experience` 已审开发经验 |
| `query` | string | 是 | — | 聚焦的需求、文件名、症状或技术术语 |

**3) 返回**

返回 `string`。`phrase = query.trim()`。按 `kind` 得到记录数组 `records`：
- `kind === 'experience'`：经 `experiencesForWorkspace(workspace?.id, phrase, exec.signal)` 取得条目，逐条映射为
  `{ id, revision, verification: 'operator-reviewed-historical-reference', title, symptom, cause, solution, applicability, exclusions, references }`。
- `kind === 'knowledge'`：`workspace === undefined` 时 `records = []`；否则经 `forWorkspace(workspace.id, phrase, exec.signal).hits` 映射为
  `{ title, heading, text, page, source: hit.textPath, startLine, endLine }`。

再把每条记录 `line = redactDevelopmentText(JSON.stringify(record))`，其大小按 `Buffer.byteLength(line) + 1` 计；
起始字节为 `prefix` 的长度，`prefix = 'Reference material for the current task. Verify applicability against current sources.\n'`。
`bytes + size > ctx.knowledge.config.contextMaxBytes` 的条目被跳过（不报错）。最终：
- 至少一条记录 → `prefix + output.join('\n')`
- 无记录 → `'No matching library evidence for this query.'`

**4) 错误文本**（逐字，`Error`）

- `Enter a library query of 1 through 2000 characters`：`phrase === ''` 或 `phrase.length > 2e3`
- `Library lookup requires a conversation`：`exec.agent === undefined`
- 底层 knowledge 调用抛出的原生错误（不包装）

**5) 副作用**

- 只读检索：不写项目文件、不发模型请求。
- `workspace` 由 `exec.agent.session.header.cwd` 经 `workspaceRegistry.resolveByPath(cwd)` 解析；`cwd` 缺省时为 `undefined`。
- `exec.signal` 透传给 knowledge 调用。

**6) 边界条件**

- 空：`query` 全空白 → trim 后 `''` → 长度错误。
- 超长：`phrase` 超过 2000 字符 → 长度错误。
- 越权/不存在：`exec.agent` 不存在 → 对话错误；`kind='knowledge'` 且 cwd 解析不到工作区 → 返回空结果文案（不报错）；`kind='experience'` 传 `undefined` id。
- 预算：`contextMaxBytes` 不足时按条目整条跳过，不截断、不报错；每条额外占 1 字节换行。
- 编码/脱敏：每条记录都经 `redactDevelopmentText` 脱敏。

**7) 证据出处**：E:147-208。

---

### 3.2 `hey_experience_record`

**1) 签名**

- 工具名：`hey_experience_record`（E:210）
- description（逐字）：`Save a reusable development pitfall to the local global experience library as a reviewable candidate. Use after an observed failure, workaround, or verified fix. Generalize project-specific details. Omit secrets, raw logs and private paths. Leave unknown fields empty.`
- 执行：`execute(args, exec)`，同步构造后返回 `Promise.resolve(<string>)`（E:243-267）
- 输出：`schema { type: 'string' }`；`render` 同上
- `presentCall: () => ({ card: 'generic', title: 'Record development experience', rawInput: {} })`（E:269-273）

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `title` | string | 是 | — | 简短可复用问题标题 |
| `symptom` | string | 是 | — | 观察到的失败及相关 check / 复现 |
| `cause` | string | 否 | —（→ `null`） | 已确认的成因（已知时） |
| `solution` | string | 否 | —（→ `''`） | 已验证的修复/规避及验证方式 |
| `applicability` | string | 否 | —（→ `''`） | 适用技术与条件 |

字段归一化（`sanitize(value) = redactDevelopmentText(value.trim().slice(0, 2e3))`）：
`title = sanitize(title).slice(0, 160)`；`symptom = sanitize(symptom)`；`cause = cause === undefined ? null : sanitize(cause)`；
`solution = sanitize(solution ?? '')`；`applicability = sanitize(applicability ?? '')`。
去重键 `hash = sha256(JSON.stringify(facts)).hex`，`sourceKey = \`authored/${exec.agent.id}/${hash}\``。

**3) 返回**

- `captureGlobalExperience(...)` 返回 `true` → `'Saved a global experience candidate for review.'`
- 返回 `false` → `'This conversation already recorded the same candidate.'`

写入内容：`{ ...facts, exclusions: '', technologies: [], references: [{ kind: 'session', id: exec.agent.id }] }`。

**4) 错误文本**（逐字，`Error`）

- `Experience recording requires an active conversation`：`exec.agent === undefined`
- `Enter a title and an observed symptom`：归一化后 `facts.title === '' || facts.symptom === ''`

**5) 副作用**

- 经 `ctx.knowledge.captureGlobalExperience` 写入**本地全局经验库的一个待审候选**（不写项目文件、不发模型请求）。
- 同一会话对同一归一化内容重复调用不会新增（返回去重文案）。
- `exec.signal` 透传。

**6) 边界条件**

- 空：`title`/`symptom` 归一化后为空 → 错误；缺省的 `solution`/`applicability` 视为空串；缺省的 `cause` 视为 `null`，显式空串 `cause` 仍为 `''`。
- 超长：`title` 截 160 字符；其余字段按 `sanitize` 归一化（取 `trim()` 后前 2000 字符并脱敏）。
- 越权/不存在：`exec.agent` 不存在 → 对话错误。
- 脱敏：所有字段经 `redactDevelopmentText`；脱敏导致标题或症状为空 → 错误。
- 去重：同一 `agent.id` + 归一化内容 → 同一 `sourceKey`。

**7) 证据出处**：E:209-274。

---

### 3.3 `hey_project_memory`

**1) 签名**

- 工具名：`hey_project_memory`（M:243）
- description（逐字）：`Recall user-saved decisions or preferences for the signed-in account and current workspace. Use when the user refers to prior decisions or asks what was remembered.`
- 执行：`execute({ query }, exec) => Promise<string>`（M:256）
- 输出：`schema { type: 'string' }`；`render` 同上
- `presentCall: () => ({ card: 'generic', title: 'Recall project memory', rawInput: {} })`（M:265-269）

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `query` | string | 否 | `''` | 可选的笔记名或聚焦检索短语 |

`phrase = normalize(query?.trim() ?? '')`，`normalize` = NFKC + 小写化。

**3) 返回**

- `rankNotes(notesFor(scope), phrase)` 为空 → `'No matching saved project memory.'`
- 否则 → `'Saved project reference data. Check that it still applies to the current task.\n' + JSON.stringify(notes.slice(0, config.maxRecall))`，元素为 `{ title, content }`。

`rankNotes` 的对外可见排序口径（不是实现步骤）：`phrase` 为空时按存储顺序（见 `notesFor` 的 `ORDER BY updated DESC, title`）返回全部；否则标题精确等于 `phrase` 者最优先；其余按命中计分——标题含 `phrase` 权重高于内容含 `phrase`，标题命中词项权重高于内容命中词项；仅得分 `> 0` 者返回，同分保持存储顺序。中英文按 `Intl.Segmenter('zh', { granularity: 'word' })` 切词，忽略停用词集合（逐字）：`的`、`了`、`吗`、`和`、`我们`、`之前`、`请`、`记得`、`决定`、`a`、`the`、`and`、`we`、`what`、`did`、`decide`、`about`。

**4) 错误文本**（逐字）

- `Project memory requires an active conversation`（`ToolContextUnavailableError`）：`exec.agent === undefined`
- `Keep the project memory query within 200 characters`（`ToolArgsError`）：`phrase.length > 200`
- `Sign in and open an imported workspace to recall project memory`（`ToolContextUnavailableError`）：`scopeFor` 返回 `null`
- `Invalid HEY project memory record`（底层）：`notesFor` 读到的行 `title`/`content` 非字符串

**5) 副作用**

- 只读召回：不写、不删笔记（写入只来自人类命令，见 §四.3）。
- `scopeFor` 依赖 `deepseekAccount` 服务与 `workspaceRegistry`：账号 `userId` 非空且 agent 属于某工作区才生成 `[JSON.stringify([origin, userId]), workspace.id]`；否则 `null`。
- 读取的 SQLite 在 `apply` 阶段已打开（见 §四.3）。

**6) 边界条件**

- 空：`query` 省略/全空白 → `phrase = ''` → 返回全部笔记（受 `maxRecall` 截断）。
- 超长：`phrase` 超过 200 字符 → `ToolArgsError`。
- 越权/不存在：未登录、无 `deepseekAccount` 服务、agent 不在任何工作区 → `scope = null` → 对话错误；无笔记 → 空结果文案。
- 截断：返回最多 `maxRecall` 条（schema 1–10，默认 4）；存储层最多 `maxNotes` 条（1–1000，默认 100）。
- 编码：`normalize` 为 NFKC + 小写，中英文分词匹配。
- `exec.signal` 与插件 `lifetime.signal` 都参与 scope 解析的中止检查。

**7) 证据出处**：M:242-270；排序与分词 M:70-121；`notesFor` M:167-175；`scopeFor` M:158-166。

---

### 3.4 `hey_weknora_search`

**1) 签名**

- 工具名：`hey_weknora_search`（W:89）
- description（逐字）：`Search the connected WeKnora document collection when the user asks to consult it. The focused query is sent to that configured service.`
- 执行：`execute({ query }, exec) => Promise<string>`（W:103）
- 输出：`schema { type: 'string' }`；`render` 同上
- `presentCall: () => ({ card: 'generic', title: 'Search connected knowledge', rawInput: {} })`（W:177-181）
- **启动期配置校验**（发生在注册工具前，失败阻止插件加载，逐字）：
  `WeKnora requires an HTTPS origin or loopback HTTP, optionally ending in /api/v1`——当 URL 非 HTTPS 且非回环 HTTP（`localhost`/`127.0.0.1`/`[::1]`）、或带 username/password/search/hash、或 pathname 不匹配 `^\/(?:api\/v1\/?|)$` 时抛（W:69-75）。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `query` | string | 是 | — | 简短文档检索词，不含凭据或私有路径 |

插件配置（schemastery，W:52-62）：`url`、`accountOrigin`、`accountId`、`workspaceId`、`apiKeyRef`、`knowledgeBaseIds`（字符串数组，每项 1–256，数量 1–32）、`timeoutMs`（100–60000，默认 8000）、`maxHits`（1–12，默认 5）、`maxResponseBytes`（1024–4194304，默认 1048576）。

**3) 返回**

POST 到 `new URL('/api/v1/knowledge-search', config.url)`，头 `content-type: application/json`、`x-api-key: <解析出的 key.value>`，体 `{ query: phrase, knowledge_base_ids: bases, match_count: config.maxHits }`。
`bases = [...new Set(config.knowledgeBaseIds)]`。响应流式读取，限制 `maxResponseBytes`；解析为 envelope，须为对象、含 `data` 数组，且 `success !== false`。
逐条命中须含字符串 `knowledge_base_id`（且属于 `bases`）、`content`、`knowledge_id`、`id`；同一 `(knowledge_base_id, knowledge_id, id)` 只计一次，`content.trim() === ''` 跳过；最多 `maxHits` 条。每条映射为：
`{ document: knowledge_id.slice(0,256), chunk: id.slice(0,256), title: knowledge_title 为字符串 ? redactDevelopmentText(slice 0,200) : '', passage: redactDevelopmentText(content.slice(0,1400)) }`。

- 无记录 → `'No source passages from the allowed WeKnora collections.'`
- 有记录 → `'WeKnora reference data from the configured collections. Verify relevance and cite the document and chunk.\n' + JSON.stringify(records)`

**4) 错误文本**（逐字）

- `Use a query of 1–500 characters, without credentials or private paths`（`ToolArgsError`）：`phrase.length === 0 || > 500`，或 `redactDevelopmentText(phrase) !== phrase`，或命中私有路径正则 `/(?:^|\s)(?:\/[^\s]|~\/|[A-Z]:[\\/]|file:\/\/)/iu`
- `WeKnora is unavailable for this account or workspace`（`ToolContextUnavailableError`）：`exec.agent === undefined` 或首次 `authorized` 为 false
- `WeKnora access requires the configured knowledge base credential`（`ToolContextUnavailableError`）：`credentials.resolve(credential)` 返回 `undefined`
- `WeKnora access was revoked`（`ToolContextUnavailableError`）：凭据解析后或返回前的 `authorized` 复检为 false
- `WeKnora HTTP ${response.status}`：`!response.ok || response.body === null`（逐字模板，`${response.status}` 为实际状态码）
- `WeKnora response size limit exceeded`：累计字节 `> maxResponseBytes`
- `Invalid WeKnora search response`：envelope 形状非法或 JSON.parse 失败
- `WeKnora retrieval failed. Verify connection, permissions and server response.`（`ToolContextUnavailableError`，带 `{ cause: error }`）：其余异常；若信号已中止则改抛中止错误，若已是 `ToolContextUnavailableError` 则原样上抛

**5) 副作用**

- 只读远程检索：不写本地项目文件；向配置服务发一次 POST（含脱敏后的查询词与允许的知识库 id）。
- 凭据经 `credentialRef(config.apiKeyRef)` → `credentials.resolve` 取得，仅置于 `x-api-key` 头。
- `authorized`：账号 `origin === config.accountOrigin && userId === config.accountId`，且 agent 属于 `workspace.id === config.workspaceId` 的工作区；在调用前、凭据解析后、返回前共检查三次。
- `fetch`：`redirect: 'error'`、`cache` 未指定、超时 `AbortSignal.timeout(timeoutMs)`，并与 `exec.signal`、`lifetime.signal` 合并。

**6) 边界条件**

- 空：`query` 全空白 → `ToolArgsError`；无命中 → 空结果文案。
- 超长：`phrase` > 500 字符 → `ToolArgsError`；响应体 > `maxResponseBytes` → 大小错误。
- 越权/不存在：账号或工作区不匹配 → unavailable；凭据缺失 → 凭据错误；中途权限被撤 → revoked；命中知识库不在允许列表 → 跳过。
- 编码/注入：含私有路径样式（`/`、`~/`、盘符、`file://`）或脱敏后改变 → `ToolArgsError`；`document`/`chunk`/`title`/`passage` 均截断并脱敏。
- 去重：重复来源片段只计一次；`maxHits` 上限生效。
- 中止：外层 catch 先 `signal.throwIfAborted()`；`redirect: 'error'` 拒绝跳转。

**7) 证据出处**：W:68-183；配置/校验 W:52-62,69-87；响应解析 W:111-169。

---

## 四、服务插件 apply 配置与副作用（简明小节）

### 4.1 `hey-subagent-workspaces`（S）

- `name = 'hey-subagent-workspaces'`、`inject = ['agents','workspaceRegistry']`（S:42,45）；无 `Config`。
- 监听 `agent/created`：`header.origin === 'subagent'` 且带 `parentSession` 与 `cwd` 才处理；从 `workspaceRegistry.list()` 找含 `parentSession` 的父工作区，再 `resolveByPath(cwd)`，要求 `workspace.id === parent.id` 且仍含 `parentSession`。
- 副作用：对真实子会话调用 `attachSession(agent.id)` 再 `insertSessionBefore(agent.id)`；随后复检父会话仍在导入工作区，否则抛 `The delegated Session parent is no longer in the imported workspace`。
- 失败回滚：若已 `attachSession` 则 `detachSession`；清理也失败时抛 `Delegated workspace attachment did not settle cleanly`（`AggregateError`）。
- 生命周期：`ctx.effect` 注册 `hey-subagent-workspaces: pending membership`，退出时 abort 并 `Promise.allSettled` 等待所有 pending。
- 错误：无匹配父/路径不匹配/已附着的 agent 静默返回（不报错）。

### 4.2 `hey-experience-capture`（E）

- `name = 'hey-experience-capture'`、`inject = ['codingWorkbench','knowledge','workspaceRegistry','tools']`（E:103,106-111）；无 `Config`。
- 启动：`ensureGlobalExperience(lifetime.signal)`；注册 §3.1、§3.2 两个工具。
- 监听：`knowledge/experience-capture-enabled`、`coding/check-settled`（`passed` → 恢复捕获，否则失败捕获）、`coding/repair-settled`（`passed` → 捕获）、`session/event`（仅 `tool/result` 且带 `error.code`，命中三张成因码表时保存）。
- 失败捕获：`status ∈ {failed, timed-out, error}` 且 `finishedAt !== null`，写全局候选（标题 `Development check failed`）。
- 恢复捕获：对每条 check 事实写全局候选（标题 `Development check passed after a failure`）；若存在启用且未归档、绑定该工作区的 `kind='project'` 知识库且 `experienceCapture` 成功，则额外写一份项目经验副本（`captureExperience`）。
- 启动期历史回填：对每个已登记工作区（`workspaceRegistry.list()`）检查其 `overview().runs` 做失败捕获并捕获恢复；失败仅 `logger.warn`（文案 `Historical experience capture is incomplete. Repair facts remain in the coding workbench; inspect knowledge storage before retrying.`）。
- 写入失败（非 abort）仅 `logger.warn`（文案 `Could not record a development experience candidate. Source evidence is retained.`）。

### 4.3 `hey-project-memory`（M）

- `name = 'hey-project-memory'`、`inject = ['commands','tools','workspaceRegistry']`（M:52,55-59）。
- `Config`（z.object，M:62-66）：`directory` string min 1 **必填**；`maxNotes` integer 1–1000 默认 100；`maxRecall` integer 1–10 默认 4。
- 启动建库：`mkdirSync(directory, { recursive: true, mode: 448 })`；打开 `join(directory, 'notes.sqlite')`；`PRAGMA busy_timeout=5000; BEGIN IMMEDIATE`。
  - `user_version === 0` → 建表 `notes(account TEXT NOT NULL, workspace TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL, updated INTEGER NOT NULL, PRIMARY KEY (account, workspace, title)) STRICT` 并置 `user_version=1`。
  - `user_version !== 1` → 抛 `Unsupported HEY project memory database version`；异常时 `db.close()` 后上抛。
- 注册人类命令 `memory`（`CommandDefinitionId('hey/project-memory')`，`recordInput: false`），输入正则 `^\s*(list|save|show|delete)(?:\s+(\S+))?(?:\s+([\s\S]+?))?\s*$`；用法串 `'/memory list | save <name> <note> | show <name> | delete <name>'`。
  - 非法参数 → `{ kind:'error', text: <usage> }`；未登录/无工作区 → `'请先登录 HEY 并打开已导入的工作区。'`
  - `list` → 无笔记 `'这个工作区还没有记忆。'`，否则标题以 `, ` 连接；
  - `show` → 命中返回 content，否则 `'找不到这条工作区记忆。'`；
  - `save` → 键名正则 `^[\p{L}\p{N}_-]{1,40}$`；content 非空且 `redactDevelopmentText(value) === value` 且字节 ≤ 4096；成功 `'已保存工作区记忆「<title>」。'`，满额 `'工作区记忆已满，请先删除不再需要的条目。'`，含凭据 `'请输入非空内容，并移除凭据。'`；同名覆盖；
  - `delete` → 成功 `'已删除工作区记忆「<title>」，后续检索将不再返回它。'`，未找到 `'找不到这条工作区记忆。'`
- 生命周期 `hey-project-memory: database` 退出时 abort 并 `database.close()`。

### 4.4 `hey-weknora`（W）

见 §3.4（配置、启动期 URL 校验、注册 1 个工具）。装配中默认 `disabled: true`（PATCH:71-73）。

### 4.5 `uma-feedback`（F）

- `name = 'uma-feedback'`、`inject = ['commands','deepseekAccount']`（F:60,63）。
- `Config`（z.object，F:66-70）：`origin` 默认 `https://studio.umayun.com`；`allowLoopbackHttp` 默认 `false`；`requestTimeoutMs` integer 1000–60000 默认 15000。
- 启动期 `platformOrigin(config)` 校验：origin 须为规范 HTTPS 源，或 `allowLoopbackHttp && protocol==='http:' && hostname==='127.0.0.1'`；拒绝 `*.deepseek.com(.?)`。失败文案逐字：`HEY feedback requires its own canonical HTTPS platform origin or an enabled loopback test origin`。
- 注册 `feedback` 命令（definitionId `@deepseek-ai/dsh-command-feedback`，`recordInput: false`，hint `<text>`），成功时额外 `recordFeedback(..., { category: 'product-interaction' })`。
- `submitUmaFeedback` 只提交用户输入文字；`text = rawInput.trim()`，1–8000 字（按 `Array.from`），payload 字节 ≤ 32768；`subject` 取首行前 80 字。POST `${origin}/v1/me/support`，头含 `authorization: Bearer <token>`、`idempotency-key`（见 §1.1）、会话 `requestHeaders`；`redirect: 'error'`、超时 `requestTimeoutMs`。
- 逐字返回文案：
  - 字数/字节：`'请输入 1–8000 字的反馈内容。'`、`'反馈内容过长，请缩短后提交。'`
  - 登录态：`'无法读取 HEY 登录状态，反馈尚未发送，请检查账号状态后重试。'`、`'请先登录对应的 HeyWork 账号，再提交反馈。'`（要求 `session.origin === origin && session.authenticatePage === true`）
  - HTTP：`'HEY 反馈提交未获授权，请重新登录或在帮助与工单中核对账号状态。'`（401/403）、`` `HEY 反馈未被接受（HTTP ${String(response.status)}），请检查内容后重试。` ``（其余 4xx）、`'submission outcome unknown'`（其余非 2xx）
  - 成功：`` `反馈已提交至 HeyWork。\n工单：${support}/${receipt.id}\n仅提交了你输入的文字，未附带会话日志。` ``（`support = ${origin}/account/support`，`receipt.id` 须匹配 `^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$`）
  - 不确定：`` `暂时无法确认反馈是否提交成功，请先到 HEY 帮助与工单核对，避免重复提交：${support}` ``
- 不附加会话历史、附件、设备元数据或文件路径。

### 4.6 `profiles`（P，纯函数，无 apply）

- `UMA_PROFILE_BUNDLES`：见 §1.1；四个 profile 的有序层元组（`hey-web`/`desktop` 末层 `dsh-uma-web`；`hey-headless`/`hey-sdk` 末层 `dsh-hey-automation`）。
- `isUmaProfileName(name)`：仅当 `name` 是上述四个键之一时返回 `true`（`Object.hasOwn`）。
- `migrateUmaProfileBundles(name, current)`：
  - 当前 owned 层（四元组中出现过的包名）已与期望元组逐项相等 → 原样返回 `current`；
  - 否则当 `current` 中 owned 层恰好只有前两项且顺序一致 → 在第二项之后插入 `expected.slice(2)` 的层，保留其余第三方层顺序，返回新数组（不改入参）；
  - 其他情况（owned 层数量/顺序不符）→ 抛 `` `HEY profile ${name}: unrecognized owned bundle order; review the profile before preparing it` ``。

---

## 五、SSH 范围声明

`operations-ssh` 服务、`hey_ssh_servers`、`hey_ssh_run`、`SSH_AUTH_SOCK`、
`transferBytes`（32 MiB 默认）、服务器 grant（默认 1 小时）等 SSH 行为
**本期不做，不在 spec 范围**（证据：`src/types/operations-ssh.ts`、`operations-files.ts`、
`operations-desktop.ts`、`operations-ssh-terminal.ts`）。

---

## 六、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `hey_workspace_search` / knowledge、experience、空 query、超长 query、无 agent、cwd 缺省、预算跳过 | 三分支 + 边界 |
| `hey_experience_record` / 正常、去重、空标题、缺 agent、cause 缺省/空串、字段截断 | 六分支 |
| `hey_project_memory` / 空 query、超长 query、精确名优先、未登录、无工作区、无笔记、maxRecall 截断 | 七分支 |
| `hey_weknora_search` / 正常、空/超长 query、私有路径、账号不符、凭据缺失、权限撤销、HTTP 错误、超大响应、非法 envelope、去重 | 十分支 |
| `apply` / experience-capture 事件、project-memory 四种命令、feedback 各文案、weknora 启动 URL 校验、profiles 迁移 | 插件层 |

---

## 七、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数表/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字，含插值模板，无"报错"这类概括
- [ ] 没有出现"先 X 再 Y / 用 Map 缓存"这类实现描述
- [ ] 冻结契约单独列出，内部标识按源码逐字，与对外 hey 身份区分
- [ ] 边界覆盖空/超长/越权/不存在/截断/脱敏/去重
- [ ] SSH 明确标注"本期不做，不在 spec 范围"
- [ ] 找一名没看过 src 的人读一遍，能复述出至少 4 个工具的行为
