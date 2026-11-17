# spec: dsh-tool-uma-workflow（3 个工具）

> 重写目标：行为等价的 `heywork-tool-workflow` 包。
> 证据：`uma-assets/packages/dsh-tool-uma-workflow/src/types/index.ts`（下称 W）、
> `src/index.ts`（下称 E）。行号仅供校对，不作为抄写依据。
> 状态：**待横向评审**（写完后需找人验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了数据全废）

这些不是"行为"，是**字节级常量**。重写时逐字保留：

| 项 | 值 | 证据 |
|---|---|---|
| 插件 id（`name`） | `tool-hey-workflow`（**不是** uma 命名） | W:80 |
| 注入声明（`inject`） | `["tools", "fs", "workingDirectory"]` | W:82-86 |
| 工具名 1 | `hey_artifact_write` | W:98 |
| 工具名 2 | `hey_artifact_read` | W:205 |
| 工具名 3 | `hey_gate_status` | W:260 |
| 工件目录约定 | 当前工作区下的 `.hey/`；文件路径 `.hey/<artifact>.md`（**不是** `.uma/`） | W:99,105,180,206,241,356 |
| 八类工件（流水线顺序，即 `ARTIFACTS`） | `research` / `prd` / `architecture` / `uiux` / `spec` / `preview` / `qa` / `delivery` | W:13,104；D:34-43 |
| status 枚举 | `draft` / `approved`，缺省 `draft` | W:19,114,173 |
| owner 缺省 | `hey-team` | W:119,174 |
| frontmatter 字段顺序 | `artifact` → `status` → `owner` → `updated`（ISO 时间） | W:89 |
| gate 深度枚举 | `patch` / `feature` / `product`，缺省 `product` | W:30,263-271,353 |
| gate 阶段枚举 | `documents` / `delivery`，缺省 `delivery` | W:31,272-276,354 |
| 用户可见文案中的品牌串 | 文案里出现 `Uma delivery state:` / `Check Uma delivery gates`（**注意**：工具名与路径是 hey，唯独这些 render/title 文案仍写 "Uma"） | W:339,404 |

> 关于"内部冻结标识 vs 对外 hey 身份"：本包是 HeyWork 版本，源码里**工具名、插件 id、路径全部是 hey 字面值**，`hey_artifact_write/read` + `hey_gate_status`、`.hey/`、`tool-hey-workflow` 即为必须逐字保留的冻结值。源码中未出现 `uma_*` 工具名、`.uma/` 路径、`uma-*` 容器路径，也未出现 `UMA Studio local resource container v1` 密钥串（该串属 `dsh-skill-uma` 容器层，与本包无关）。唯一残留 "Uma" 的是上表列出的用户可见文案，按源码逐字保留，不替换成 hey。
>
> 证据缩写：`D` = `dsh-util-uma-delivery` 的 `src/types/index.ts`（本包的 gate 规则委托给它，详见 delivery.md）。

---

## 二、包导出面

`src/index.ts` 仅重导出 3 个符号（E:9）：`apply`、`inject`、`name`。三者的冻结值见 §一。`apply(ctx)` 调用后向 `ctx.tools.register(...)` 依次注册 3 个工具（顺序：write → read → gate，W:97/204/259）。本包无其他导出。

---

## 三、`hey_artifact_write`

- **签名**：`execute(args: WriteArgs, exec: WorkflowExec) => Promise<{ path, artifact, status, bytes, missingSections, placeholders, ready }>`
- **参数**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `artifact` | `ArtifactKind`（string） | 是 | 枚举 = 八类工件；`enum: [...ARTIFACTS]` |
| `content` | string | 是 | 不含 frontmatter 的 Markdown 正文；去首尾空白后必须非空 |
| `status` | `'draft' \| 'approved'` | 否 | 默认 `draft` |
| `owner` | string | 否 | 默认 `hey-team` |

  `exec` 需含 `exec.agent`（`{ id: string, session: unknown }`）与 `exec.signal: AbortSignal`（W:35-41）。
- **返回**：对象，字段全部 `required: true`、`additionalProperties: false`（W:122-160）：
  - `path: string` = 目标 `FsTarget.displayPath`
  - `artifact: string`（枚举八类）
  - `status: string`（`draft` / `approved`）
  - `bytes: integer` = `Buffer.byteLength(composedContent, "utf8")`（UTF-8 字节数，非字符数）
  - `missingSections: string[]` / `placeholders: string[]` / `ready: boolean` —— 三者来自对 **`args.content`（原始正文，非拼装后的全文）** 调用 `evaluateArtifact(artifact, content)` 的结果（W:186,192-194）
  - 渲染文本（`output.render`，W:161-168），三行以 `\n` 连接：
    1. `Wrote ${path} (${bytes} bytes, ${status}).`
    2. `missingSections.length === 0` → `Required sections present.`；否则 `Missing section checks: ${missingSections.join(", ")}.`
    3. `placeholders.length === 0` → `No placeholder markers.`；否则 `Placeholders to resolve: ${placeholders.join(", ")}.`
- **错误文本**（逐字含插值）：
  - `exec.agent === undefined` → `"hey_artifact_write requires an agent Session"`（W:171）
  - `args.content.trim().length === 0` → `"hey_artifact_write requires non-empty content"`（W:172）
  - `ctx.fs.sandboxMode !== undefined` 且 `ctx.get("sandboxPolicy") === undefined` → `ToolContextUnavailableError("Artifact writes require the mounted filesystem’s sandbox policy service")`（W:177；原文用的是弯引号 `’`）
  - 底层服务原生错误（workingDirectory.ensure / fs.resolve / waterfall / fs.writeText 抛出）不包装、直接传播
- **副作用**：
  - 写文件到当前工作区 `.hey/<artifact>.md`（`ctx.fs.resolve` 的 cwd 来自 `ctx.workingDirectory.ensure(agent, signal)`，`exec.signal` 透传）
  - 写入全文由 `compose` 生成（W:88-90）：
    ```
    ---
    artifact: <artifact>
    status: <status>
    owner: <owner>
    updated: <(new Date()).toISOString()>
    ---

    <content.trim()>\n
    ```
    即 frontmatter 四字段各占一行、`---` 定界、空行、正文去首尾空白后追加一个 `\n`
  - `intent` 由 `ctx.waterfall("fs/write-intent", target, exec, () => void 0)` 产生并传入 `fs.writeText`（fallback 为 no-op 返回 `undefined`）
  - 当 `sandboxMode` 有值时，先经 `ctx.get("sandboxPolicy")` 的 `policy.resolve({ session: exec.agent.session })` 得到 `sandbox` 并传给 `writeText`
  - `presentCall`（W:197-202）：`{ card: "generic", title: "Write .hey/<artifact>.md", kind: "other", rawInput: args }`
- **边界条件**：
  - 空：`content` 为 `""` 或纯空白（trim 后长度 0）→ 抛 `"requires non-empty content"`
  - 缺省：`status`/`owner` 未传分别取 `draft`/`hey-team`；传入 `null` 也走 `??` 默认路径
  - 超长：`content` 无长度上限；`bytes` 按 UTF-8 字节计（多字节字符 > 字符数）
  - 越权/无上下文：`exec.agent` 缺失 → 抛 session 错（在任何 fs 操作前）；`sandboxMode` 有值但无 sandboxPolicy 服务 → 抛 `ToolContextUnavailableError`
  - 不存在/并发：同名文件重复写会覆盖（源码无存在性检查、无追加/合并语义）；目录 `.hey/` 不存在时由 `workingDirectory.ensure` 负责准备，本工具不建目录
  - `artifact` 非法值：schema 层 `enum` 拦截；若绕过 schema，仍按 `.hey/<值>.md` 拼路径，但 `evaluateArtifact` 用未知 kind 取 section 表会得到 `undefined` 而在 delivery 内部抛错
  - `updated` 用执行时系统时间，golden 录制按模式处理
- **证据**：W:88-90, 96-203（重点 98-99, 100-121, 122-160, 161-168, 170-196, 197-202）

---

## 四、`hey_artifact_read`

- **签名**：`execute(args: ReadArgs, exec: WorkflowExec) => Promise<{ path, artifact, content }>`
- **参数**：`args.artifact: ArtifactKind`（必填，枚举八类）；`exec.agent` 与 `exec.signal` 同 §三（W:24-26, 35-41）
- **返回**：对象字段全部 `required: true`、`additionalProperties: false`（W:213-232）：
  - `path: string` = 目标 `displayPath`
  - `artifact: string`（枚举八类）
  - `content: string` = `ctx.fs.readText(target, exec.signal)` 的原文（**含 frontmatter，原样返回，不做 split/evaluate**）
  - 渲染文本（W:233-236）：单段文本，`text = value.content`（直接输出正文，无额外包装）
- **错误文本**（逐字）：
  - `exec.agent === undefined` → `"hey_artifact_read requires an agent Session"`（W:239）
  - 路径 `.hey/<artifact>.md` 不存在 → `fs.readText` 原生错误（如 ENOENT / FS_NOT_FOUND），**不包装、不转成友好文案**
  - workingDirectory.ensure / fs.resolve 抛出的原生错误直接传播
- **副作用**：只读，不写文件、不建目录；读后原样返回。`presentCall`（W:252-257）：`{ card: "generic", title: "Read .hey/<artifact>.md", kind: "other", rawInput: args }`
- **边界条件**：
  - 空文件 → `content: ""`，渲染为空文本段
  - 不存在：文件缺失直接抛原生错误（与 gate 工具不同，read **不**把 FS_NOT_FOUND 当正常分支）
  - 越权：`exec.agent` 缺失 → 抛 session 错
  - 非 UTF-8 / 编码：`readText` 行为由 `ctx.fs` 决定，本工具不解码、不校验
  - `artifact` 非法值：schema `enum` 拦截；绕过则读 `.hey/<值>.md`
- **证据**：W:204-258（重点 205-212, 213-232, 233-236, 238-250, 252-257）

---

## 五、`hey_gate_status` 与 gate 分级规则

### 5.1 工具

- **签名**：`execute(args: GateArgs, exec: WorkflowExec) => Promise<{ exists, ready, missing, blocked, artifacts }>`
- **参数**（W:28-32, 262-277）：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `depth` | `'patch' \| 'feature' \| 'product'` | 否 | 默认 `product`。patch：无仪式性文档；feature：spec/qa/handoff；product：全流程 |
| `phase` | `'documents' \| 'delivery'` | 否 | 默认 `delivery`。documents 只查实现前文档；delivery 查交接文档 |

  `exec.agent` / `exec.signal` 同前。
- **返回**：对象字段全部 `required: true`、`additionalProperties: false`（W:278-335）：
  - `exists: boolean`、`ready: boolean`
  - `missing: string[]`、`blocked: string[]`
  - `artifacts: Array<{ artifact: string(枚举八类), status: string, ready: boolean, missingSections: string[], placeholders: string[] }>`，按 `ARTIFACTS` 顺序排序（W:392）
  - 两条返回路径：
    1. **`.hey/` 目录不存在**（`listDir` 抛 `code === "FS_NOT_FOUND"`，W:361-376）：`exists:false`，`missing = [...requiredArtifacts(depth, phase)]`，`ready = missing.length === 0`，`blocked = missing`，`artifacts: []`
    2. **目录存在**：`exists:true`，逐文件评估后 `artifacts` 列表，`ready/missing/blocked` 取自 `evaluateCheckpoint(artifacts, depth, phase)`（W:393-400）
  - 渲染文本（W:336-349），各行以 `\n` 连接：
    1. `exists` → `Uma delivery state:`；否则 `No .hey directory exists.`
    2. 恒有：`Document checks only; this result does not prove tests, human approval or deployment.`
    3. `ready` → `Ready: every required artifact is present and clean.`；否则 `Blocked: ${blocked.join(", ")}.`
    4. `missing.length !== 0` → `Missing required artifacts: ${missing.join(", ")}.`
    5. 每个 artifact：`- ${artifact} (${artifact.status}, ${artifact.ready ? "ready" : "not ready"})`，其下按需追加 `  missing sections: ${...}`、`  placeholders: ${...}`
- **错误文本**（逐字）：
  - `exec.agent === undefined` → `"hey_gate_status requires an agent Session"`（W:352）
  - `listDir` 抛出且 `code !== "FS_NOT_FOUND"` → 原样 `throw error`（W:375）
  - `readText` 单个工件文件出错 → 原生错误直接传播
- **副作用**：只读；列目录 `.hey/`（`ctx.fs.resolve(".hey", ...)` + `ctx.fs.listDir`），对每个 `type === "file"` 且文件名去 `.md` 后命中 `ARTIFACTS` 的条目调 `ctx.fs.readText(entry.target, ...)` 并 `evaluateArtifact`（W:378-391）。`presentCall`（W:402-406）：`{ card: "generic", title: "Check Uma delivery gates", kind: "other" }`（**无 `rawInput` 字段**）
- **边界条件**：
  - 不存在：`.hey/` 目录缺失是**正常结果**而非错误，返回 `exists:false` 的上述对象；`depth=patch` 时 `requiredArtifacts` 返回 `[]` → `ready:true`、`missing:[]`、`blocked:[]`
  - 过滤规则：非 `file` 条目跳过；文件名 `replace(/\.md$/u, "")` 后不在 `ARTIFACTS` 中的跳过（如 `notes.md`、`.DS_Store`、`README` 都被忽略）；只认小写 `.md` 后缀
  - 缺省：`depth`/`phase` 未传分别取 `product`/`delivery`
  - 空目录：`.hey/` 存在但无工件文件 → `artifacts:[]`，`ready/missing/blocked` 由 `evaluateCheckpoint([], depth, phase)` 得出
  - 重复/脏数据：同名工件只按目录条目各评估一次；文件名大小写敏感（`QA.md` 去后缀为 `QA`，不在 ARTIFACTS，被忽略）
  - 越权：`exec.agent` 缺失 → 抛 session 错
- **证据**：W:28-32, 259-407（重点 261, 262-277, 278-335, 336-349, 351-400, 402-406）；规则来源 D（见下）

### 5.2 gate 分级规则（patch / feature / product × documents / delivery）

本工具把 `(depth, phase, artifacts)` 交给 `evaluateCheckpoint`，其判定规则（D:51-64, 196-206，详见 delivery.md）为对外可见语义，逐字照录：

| depth | phase | 必需工件（`requiredArtifacts(depth, phase)`） |
|---|---|---|
| `patch` | 任意 | `[]`（无必需工件；gate 恒 ready） |
| `feature` | `documents` | `["spec"]` |
| `feature` | `delivery` | `["spec", "qa", "delivery"]` |
| `product` | `documents` | `["research", "prd", "architecture", "uiux"]` |
| `product` | `delivery` | `REQUIRED_ARTIFACTS` = `["research","prd","architecture","uiux","spec","qa","delivery"]`（**`preview` 不在必需集**） |

`evaluateCheckpoint` 判定：只看上表所列必需工件 → `missing` = 必需但未出现的工件；`blocked` = `missing` ∪ 出现但 `ready === false` 的相关工件；`ready = blocked.length === 0`。非必需工件（含 `preview`）即使不 ready 也不阻塞 checkpoint（与 `evaluateGate` 不同，见 delivery.md）。工具 description 还声明：此结果只作文档检查，**不证明测试、人工批准或部署**（W:261,340）。

---

## 六、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `hey_artifact_write` / 正常 draft、approved+owner、content 纯空白 | 拼装 frontmatter、默认 owner、bytes、空 content 错 |
| `hey_artifact_write` / 缺 agent、有 sandboxMode 无 policy | 两条错误文本 + ToolContextUnavailableError |
| `hey_artifact_write` / 含 TODO、缺 section 的正文 | missingSections / placeholders / ready + render 三行 |
| `hey_artifact_read` / 正常、文件不存在、空文件、缺 agent | 原样返回、原生错误、空 content |
| `hey_gate_status` / `.hey/` 不存在 × 三 depth | exists:false 分支 + patch 恒 ready |
| `hey_gate_status` / 混合有效/无效/非 md 文件、未 ready 工件 | 过滤、排序、blocked、render 全行 |
| `hey_gate_status` / 缺 agent、listDir 非 FS_NOT_FOUND 错误 | 抛错传播 |

---

## 七、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字，含 `’` 弯引号与 `hey_` 前缀
- [ ] 没有出现"先 X 再 Y"这类实现描述
- [ ] 冻结契约单独列出；工具名/路径按源码 hey 字面值，未擅自改成 uma
- [ ] 边界覆盖空/超长/越权/不存在/缺省/非法 kind/编码
- [ ] 找一名没看过 src 的人读一遍，能复述出 3 个工具的参数、错误、副作用、边界
