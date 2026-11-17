# spec: dsh-tool-uma-design（核心设计工具 7 个）

> 重写目标：行为等价的 `dsh-tool-uma-design` 实现。
> 证据：`uma-assets/packages/dsh-tool-uma-design/src/types/index.ts`（下称 **I**）、
> `src/types/resources.ts`（下称 **R**）、`src/types/context.ts`（下称 **C**）、
> `src/types/rules.ts`（下称 **Rules**）。这些是逆向还原的可读 TS，不是原始源码；行号仅供校对，不作为抄写依据。
> 范围：7 个工具（`design_context`、`hey_resource_read`、`design_rule_search`、`design_preview`、
> `design_asset_list`、`design_asset_get`、`hey_knowledge_search`）+ 模块导出面（`name`/`inject`/`Config`/`apply`）。
> `design_project_create` / `design_project_status` 不在本文件范围内（另一 spec 处理）。
> 状态：**待横向评审**（写完后需验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了行为全废）

这些不是"行为"，是**字节级字符串常量与内部标识**。重写时逐字保留，不要汉化、不要改用描述性措辞、不要替换成同义 id。

| 项 | 值 | 证据 |
|---|---|---|
| 工具名前缀 | `design-*`（`design_context`、`design_rule_search`、`design_preview`、`design_asset_list`、`design_asset_get`，以及不在本范围的 `design_project_create`、`design_project_status`） | I:334,414,458,527,653,877,1043 |
| 工具名（非 `design-*` 前缀者，逐字） | `hey_resource_read`、`hey_knowledge_search` | I:381,787 |
| 容器虚拟路径（设计系统根） | `uma-design-systems/systems` | I:370 |
| 容器虚拟路径（品牌引用根） | `uma-design-md/brands` | I:371 |
| 知识根 `KNOWLEDGE_ROOTS`（逐字） | `uma-team/references`、`uma-quality-gate/references`、`uma-delivery-docs/templates`、`uma-design-taste/references`、`uma-design-craft/references`、`uma-apple-review/references` | I:199-206 |
| 密钥派生串 | `UMA Studio local resource container v1`（SHA-256 后作 AES-256-GCM key；属底层 `dsh-skill-uma` 容器契约，本包通过 `@deepseek-ai/dsh-skill-uma/resources` 间接依赖，本包自身不实现加解密） | skill-uma.md §1；I:15 的导入 |
| 插件 `name` 导出字面值 | `tool-hey-design`（**定稿**：HeyWork 重写版的插件 id，对外身份用 hey） | I:161 |
| 启动期错误前缀 | `tool-hey-design:`（与上同，逐字） | I:369,375,376,379 |

> **命名口径已定稿（2026-11-18）**：插件 id 属于对外身份，用 `tool-hey-design`；
> 而容器虚拟路径（`uma-*`）、密钥串、工具名里的 `design_*` 是内部/契约标识，保持原样。
> 这与 `HEYWORK.md` §2 的命名边界一致，无需再评审。

---

## 二、模块导出面（I 模块）

### 2.1 导出清单

| 导出 | 类型 | 说明 |
|---|---|---|
| `name` | string | 插件 id，字面值 `'tool-hey-design'`（I:161，定稿见 §1） |
| `inject` | `string[]` | 恒为 `['tools', 'fs', 'workingDirectory', 'systemPrompt']`（I:163-168）：声明注入的注册表/服务 |
| `Config` | schemastery schema（`z.object`） | 配置校验器，字段见 §2.2 |
| `apply` | `(ctx, config?) => void` | 插件入口，见 §2.3 |

### 2.2 `Config`（z.object，I:170-180）

| 字段 | 类型 | 约束 | 默认值 |
|---|---|---|---|
| `resourceMaxBytes` | number | integer(`step(1)`)，1024–98304 | 32768 |
| `projectWrite` | boolean | — | true |
| `projectFileMaxBytes` | number | integer，min 1024（无上限） | 262144 |
| `assetRoot` | string | min 1；**无默认值（必填）** | — |
| `contextFileBytes` | number | integer，min 1024 | 32768 |
| `contextTotalBytes` | number | integer，min 1024 | 98304 |
| `ruleMaxResults` | number | integer，1–50 | 10 |
| `previewMaxBytes` | number | integer，min 1024 | 262144 |
| `catalogMaxPageSize` | number | integer，1–500 | 100 |

- 所有 `min`/`max`/`step` 由 schemastery 在配置校验阶段强制；非法配置在插件加载时失败，不属于任何工具调用的错误。
- `assetRoot` 未提供时 `apply` 内部另有回退路径（见 §2.3），但 schema 层仍要求 min 1——两者不矛盾：schema 校验的是显式传入的配置对象。

### 2.3 `apply(ctx, config = {}): void`（I:323-1157）

- **签名**：`(ctx: ToolContext, config?: Partial<ConfigFields>) => void`
  - `ctx` 需提供：`ctx.tools.register(tool)`、`ctx.systemPrompt.section({name, order, text})`、
    `ctx.fs`（含 `resolve`/`lstat`/`stat`/`contains`/`readBytes`/`writeText`/`listDir`、`sandboxMode`）、
    `ctx.workingDirectory.ensure(agent, signal)`、`ctx.get(name)`、`ctx.waterfall(event, target, exec, fallback)`。
  - `config` 为已校验配置的全部可选字段。
- **返回**：void；通过 `ctx.tools.register(...)` 注册工具，通过 `ctx.systemPrompt.section(...)` 注入系统提示词。
- **副作用**：
  - 注入固定系统提示词：`name: 'native-design-workflow'`、`order: 112`、固定英文正文（I:331，约 2.3 KB，描述 native UI design workflow；正文为字节级固定文本，重写时按 I:331 逐字保留）。
  - 计算资源根：`assetRoot = config.assetRoot ?? <dsh-skill-uma 包目录下的 assets/>`（I:367-368）；
    `systemsRoot = <assetRoot>/uma-design-systems/systems`（I:370）；
    `referencesRoot = <assetRoot>/uma-design-md/brands`（I:371）。
  - 启动期构建只读内存目录：`systems`（systemsRoot 的直接子目录，按名称升序）、`systemCatalog`（每个系统的 manifest 摘要）、`references`（referencesRoot 的直接子目录）、`knowledge`（遍历 §1 的六个 KNOWLEDGE_ROOTS，收集其中所有 `.md` 按标题切分的片段，见 §3.7 的 section 结构）。
  - 注册本 spec 的 7 个工具 + `design_project_status`；当 `config.projectWrite !== false` 时额外注册 `design_project_create`（后两者不在本 spec 范围）。
- **启动期错误文本**（逐字，发生于注册工具之前，会阻止插件加载）：
  - `tool-hey-design: assetRoot must be an absolute directory`（I:369，`assetRoot` 非绝对路径时）
  - `tool-hey-design: no design systems under ${systemsRoot}`（I:375，`systems` 为空时；`${systemsRoot}` 为实际计算出的绝对路径）
  - `tool-hey-design: no DESIGN.md references under ${referencesRoot}`（I:376，`references` 为空时）
  - `tool-hey-design: no knowledge sections under ${assetRoot}`（I:379，`knowledge` 为空时）
  - `Missing design manifest: ${name}`（I:212，某系统的 `manifest.json` 不存在时；`${name}` 为系统目录名）
  - `Invalid design manifest: ${name}`（I:214，manifest 解析结果不是非数组对象时）
  - 底层容器的原生 fs / JSON.parse 错误（不包装）
- **边界**：
  - `config` 省略等价于 `{}`；除 `assetRoot` 外各字段都有 §2.2 的回退默认值。
  - `assetRoot` 为相对路径直接抛错，不做 CWD 解析。
  - `systems`/`references`/`knowledge` 任一为空即启动失败，不注册任何工具。
  - manifest 字段容错（I:218-231）：`category`/`description` 非字符串→空串；`name` 非字符串→用目录名；`aliases` 非字符串数组→过滤为仅字符串项；`description` 为空时以 `displayName` 兜底。
- **证据**：I:159-180, 210-235, 323-332, 367-379, 876, 1042；系统提示词全文 I:331。

---

## 三、工具行为规格

> 通用约定（适用于本节全部工具）：
> - 每个工具都经 `defineTool` 注册，具有 `name`/`description`/`parameters`/`output`/`execute`/`presentCall`（部分另有 `render`/`presentationMeta`）。
> - `output.schema` 描述 `execute` 返回值的**反序列化后结构**；`render` 把返回值映射为 `{type:'text', text}` 文本块数组供对话展示；`presentCall` 描述工具调用卡片的展示形态（`card` 恒为 `'generic'`，`kind` 取值 `search`/`read`/`other`，`rawInput` 是否携带原始入参逐工具列出）。
> - 全部 7 个工具对文件系统/容器**只读**：不写、不删、不创建任何文件，不执行项目代码。唯一的写操作来自不在本范围的 `design_project_create`。

### 3.1 `design_context`

**1) 签名**

- 工具名：`design_context`（I:334）
- 参数 schema（I:336-349）：`target?: string`、`project?: string`、`page?: string`，三者均**非必填**。
- 执行：`execute(args, exec)` → `Promise<string>`，返回 `JSON.stringify(await readDesignContext(ctx, exec, args, contextLimits))`（I:357-359）；
  `contextLimits = { fileBytes: config.contextFileBytes ?? 32768, totalBytes: config.contextTotalBytes ?? 98304 }`（I:324-327）。
- 输出 schema：`{ type: 'string' }`（I:351）。
- render：`(_args, value) => [{ type: 'text', text: value }]`（I:352-355）——即把 JSON 字符串原样作为文本块。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `target` | string | 否 | `'.'`（即执行目录） | 可选的 monorepo UI 包相对目录，如 `apps/web` |
| `project` | string | 否 | —（`''`） | 已存在的 kebab-case 项目 id，读取 `.design/<project>/` 与 `design-system/<project>/` 下的输入 |
| `page` | string | 否 | — | `design-system/<project>/pages/` 下的页面 id；提供时**必须**同时提供 `project` |

**3) 返回**

`execute` 返回 JSON 字符串；反序列化后为 `DesignContextResult`（C:67-75, 223-235）：

| 字段 | 类型 | 含义 |
|---|---|---|
| `target` | string | 生效的 target：`target || '.'` |
| `project` | string | `request.project ?? ''` |
| `files` | DesignFile[] | 逐输入文件的读取状态，见下 |
| `declaredStack` | string[] | 从成功读取（`state==='read'`）的 `package.json` 的 `dependencies`/`devDependencies`/`peerDependencies` 中提取、与已知框架列表取交集并去重后的名字 |
| `hasDesign` | boolean | 是否存在路径以 `DESIGN.md` 或 `MASTER.md` 结尾、`state==='read'` 且正文 `trim()` 非空的文件 |
| `complete` | boolean | 是否所有 `files` 的 `state` 都是 `'read'` 或 `'missing'` |
| `fingerprint` | string | `JSON.stringify(files.map(f => [f.path, f.state, f.sha256]))` 的 SHA-256 hex |

`DesignFile`（C:59-64）：`{ path: string, content: string, sha256: string, state: 'missing'|'non-file'|'oversized'|'budget-exceeded'|'read' }`。
非 `'read'` 状态时 `content`、`sha256` 均为空串。`state` 语义：
- `missing`：路径 `lstat` 为 `undefined`；
- `non-file`：路径存在但不是普通文件；
- `oversized`：文件 `size > fileBytes`；
- `budget-exceeded`：剩余总预算为 0，或文件 `size > remaining`；
- `read`：成功读取，`content` 为严格 UTF-8 解码正文，`sha256` 为原始字节哈希。

读取的输入路径集合（C:78-93, 155-161）：
- 根输入恒读：`PRODUCT.md`、`DESIGN.md`、`DESIGN.json`、`tokens.css`、`components.json`、`package.json`、`design-system/MASTER.md`；
- `target !== ''` 时，对每个根输入额外读 `<target>/<name>`；
- 提供 `project` 时读 `.design/<project>/{PROJECT.md,DESIGN.md,tokens.css,manifest.json,REVIEW.md}` 与 `design-system/<project>/MASTER.md`；
- 提供 `page` 时额外读 `design-system/<project>/pages/<page>.md`。

已知框架列表（C:94-108，逐字）：`react`、`vue`、`next`、`nuxt`、`svelte`、`@angular/core`、`electron`、`@tauri-apps/api`、`react-native`、`tailwindcss`、`@radix-ui/react-dialog`、`@mui/material`、`antd`。

- presentCall（I:360-365）：`{ card:'generic', title:'Read project design context', kind:'search', rawInput: args }`。

**4) 错误文本（逐字，含插值模板）**

| 字符串 | 触发条件 | 证据 |
|---|---|---|
| `design_context requires an agent Session` | `exec.agent === undefined` | C:146 |
| `design_context: target must be a relative directory without parent segments` | `target` 非法（见 §边界） | C:112 |
| `design_context: project must be kebab-case` | `project` 提供但非 `^[a-z0-9]+(?:-[a-z0-9]+)*$` | C:148 |
| `design_context: page requires an explicit project and a kebab-case page id` | `page` 提供但无 `project`，或 `page` 非 kebab-case | C:149 |
| `` design_context: expected a regular directory at ${parents.slice(0, depth).join('/')} `` | 某输入路径的父级段存在但不是目录 | C:169 |
| `` design_context: path leaves the execution directory: ${path} `` | 解析后的路径不在执行目录内 | C:209 |
| `` design_context: expected UTF-8 text at ${path} `` | 解码后正文含 NUL 字符 | C:212 |
| `` design_context: ${path} changed while reading; inspect again `` | 读取期间文件 version 与 lstat 时不一致 | C:213 |
| `design_context: package.json must contain an object` | package.json 顶层不是非数组对象 | C:118 |
| `` design_context: package.json ${key} must contain an object `` | 依赖字段名（`dependencies`/`devDependencies`/`peerDependencies`）的值不是非数组对象 | C:128 |
| `` design_context: package.json dependency ${name} must have a string version `` | 某依赖的版本值不是字符串 | C:130 |
| TextDecoder 原生 `TypeError`（`fatal:true`） | 文件字节不是合法 UTF-8（I:211 解码时抛出，未包装） | C:211 |

- `exec.signal.throwIfAborted()` 在中止时抛 `AbortError`（原生，C:165）。

**5) 副作用**

只读。读取工作目录中的上述输入文件；调用 `workingDirectory.ensure`（确定 cwd，不写设计文件）、`fs.resolve`/`fs.lstat`/`fs.readBytes`/`fs.stat`/`fs.contains`。不写文件、不执行项目代码。

**6) 边界条件**

- `target`：
  - `'.'` → 归一为 `''`（不追加 `<target>/` 前缀）；
  - 空串、含 `\`、含 NUL、以 `/` 开头、含 `:`、分段含 `''`/`.`/`..` → 抛 `target must be a relative directory without parent segments`。
- `project`/`page`：kebab-case 正则 `^[a-z0-9]+(?:-[a-z0-9]+)*$`；`page` 不能脱离 `project`。
- 输入文件不存在 → `state='missing'`，不抛；父级段是文件 → 抛；文件是目录 → `state='non-file'`。
- 单文件超过 `fileBytes`（默认 32768）→ `state='oversized'`；累计读取超过 `totalBytes`（默认 98304）→ 后续文件 `state='budget-exceeded'`。
- 非 UTF-8 字节（严格 `fatal:true` 解码失败）→ 原生 `TypeError`；合法 UTF-8 但含 NUL → `expected UTF-8 text` 错误。
- 并发一致性：读取期间文件 version 变化 → 抛 `changed while reading`。
- 越权：解析路径逃出执行目录 → 抛 `path leaves the execution directory`。
- 超长：无工具层字符串长度上限；文件体积由 `fileBytes`/`totalBytes` 两条预算约束（不是按字符数）。
- 特殊字符：路径含空格/Unicode 只要通过 kebab-case 与相对路径校验即可读取；含冒号/反斜杠/NUL/父级段被拒。

**7) 证据出处**：I:333-366；C:78-108, 110-135, 145-236。

---

### 3.2 `hey_resource_read`

**1) 签名**

- 工具名：`hey_resource_read`（I:381，冻结）
- 参数 schema（I:383-397）：
  - `skill: string` **必填**
  - `path?: string`
  - `offset?: integer`
- 执行（I:405）：`Promise.resolve(readBundledResource(assetRoot, args.skill, args.path ?? '', args.offset ?? 0, config.resourceMaxBytes ?? 32768))`
- 输出 schema：`{ type: 'string' }`（I:399）。
- render：`[{ type:'text', text: value }]`（I:400-403）。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `skill` | string | 是 | — | 精确的已安装 HEY skill 名（kebab-case） |
| `path` | string | 否 | `''`（列举该 skill 根目录） | 相对资源路径，如 `references/layouts.md`；省略表示列举目录 |
| `offset` | integer | 否 | 0 | 上次结果返回的续接偏移（目录分页为条目下标，文本分页为字节偏移） |

**3) 返回**

`execute` 返回字符串，两种形态（R:139-170）：

- **目录**（`path` 省略或指向目录）：JSON 字符串，结构
  `{ reference: string, kind: 'directory', entries: {name: string, kind: 'directory'|'file'}[], nextOffset: number|null }`。
  - `reference = \`hey-resource://${skill}/${path}\``（R:140）；
  - `entries` 按 `name.localeCompare` 升序，过滤掉符号链接，单页最多 100 条（`slice(offset, offset+100)`，R:145-149）；
  - 若整个 JSON 超过 `maximum`（即 `resourceMaxBytes`），返回条目数会被缩减；缩减到 0 仍超限则抛错（R:150-161）；
  - `nextOffset` 为 `null` 表示已到末页。
- **文本**（`path` 指向文件）：
  \`Resource: ${reference}\nNext byte offset: ${nextOffset < totalBytes ? String(nextOffset) : 'complete'}\n\n${content}\`（R:163-165）。
  - `content` 为分页的 UTF-8 文本；`nextOffset` 为下一页字节偏移，`complete` 表示已读完；
  - `totalBytes` 为文件总字节数。

分页读取语义（R:88-128）：单页最多 `maximum - header 开销 - 128` 字节；`content` 保持为合法 UTF-8 前缀（可能被截在不完整码点之前）。

- presentCall（I:406-411）：`{ card:'generic', title:\`Read HEY resource: ${args.skill}\`, kind:'other', rawInput: args }`。

**4) 错误文本（逐字，含插值模板）**

对外只暴露一条包装错误——`readBundledResource` 的整个函数体被 try/catch 包裹（R:141,167-169），内部一切异常最终都被替换为：

| 字符串（对外唯一可观测） | 证据 |
|---|---|
| `HEY resource could not be read; use the installed skill name and its relative resource path` | R:168 |

下列为内部 `throw` 的逐字字符串（都会被上层包装成上述对外错误，列出作为逐字证据）：

| 内部字符串 | 触发条件 | 证据 |
|---|---|---|
| `Invalid HEY resource identifier` | `skill` 非 kebab-case；`path.length > 512`；`path` 含 `\`/`:`/控制字符；`path` 分段含 `''`/`.`/`..` | R:63 |
| `Unknown HEY skill` | 容器内无 `<skill>/SKILL.md`；或开发态 `<skill>/SKILL.md` 不是普通文件 | R:65, 73 |
| `Unknown HEY resource` | 容器内目标虚拟资源不存在 | R:67 |
| `HEY skill leaves the asset root` | 开发态 realpath 越出 assetRoot | R:72 |
| `HEY resource leaves its skill` | 开发态 realpath 越出该 skill 目录 | R:75 |
| `Invalid offset` | 目录分页 `offset` 非安全整数或 `< 0` | R:142 |
| `Invalid page` | 文本分页 `offset` 非安全整数/`< 0`，或 `bytes < 4` | R:90 |
| `Invalid page offset` | 容器分支 `offset > buffer.length` | R:94 |
| `Invalid UTF-8 resource` | 容器分支文本含 NUL、或首片解码为 0 字节、或末片在文件末尾处出现不完整码点 | R:98 |
| `Not a readable resource` | 磁盘分支目标非普通文件、或 `offset > info.size` | R:108 |
| `Incomplete UTF-8 resource` | 磁盘分支末片在文件末尾处出现不完整码点 | R:113 |
| `Not a text resource` | 磁盘分支正文含 NUL | R:114 |
| `HEY resource is unavailable or is not valid UTF-8 text; check its skill, relative path and page offset` | `readBundledText` 的 catch-all（R:125-127） | R:126 |
| `Resource page exceeds its limit` | 目录页即使裁到 0 条仍超字节上限 | R:161 |

**5) 副作用**

只读。容器分支读虚拟资源；开发态分支用 `realpathSync`/`statSync`/`readdirSync`/`openSync('r')`/`readSync`/`closeSync` 只读真实文件，句柄在 finally 中关闭（R:105-123）。不写任何文件。

**6) 边界条件**

- `skill`：必须 kebab-case；否则对外错误。
- `path`：省略→列举根目录；长度 > 512、含 `\`、含 `:`、含 `0x00-0x1f`/`0x7f` 控制字符、分段为空/`.`/`..` → 对外错误。
- `offset`：省略→0；非安全整数或 `< 0` → 对外错误；超过文件长度/目录长度 → 对外错误（目录分支超大 offset 返回空 entries + `nextOffset:null`）。
- 越权：realpath 越出 assetRoot 或 skill 目录 → 对外错误。
- 不存在：未知 skill、未知资源 → 对外错误。
- 编码：非 UTF-8、含 NUL、不完整码点 → 对外错误；分页按 UTF-8 安全边界切分，不返回半个码点。
- 超长：`path` 硬上限 512 字符；单页字节受 `resourceMaxBytes`（默认 32768）约束；目录单页最多 100 条。
- 特殊字符：路径含 POSIX `/` 分段合法；`\` 和 `:` 被明确拒绝（防止 Windows 路径与盘符逃逸）。

**7) 证据出处**：I:380-412；R:54-170；I:15（底层资源模块导入）。

---

### 3.3 `design_rule_search`

**1) 签名**

- 工具名：`design_rule_search`（I:414）
- 参数 schema（I:416-435）：`query: string` **必填**、`domain: string` **必填且 enum `RULE_DOMAINS`**、`stack?: string`、`limit?: integer`。
- `RULE_DOMAINS`（Rules:36-50，枚举逐字）：`ux`、`web`、`react`、`style`、`color`、`typography`、`chart`、`motion`、`product`、`layout`、`reasoning`、`icons`、`stack`。
- 执行（I:443-449）：
  - `limit = Math.min(Math.max(args.limit ?? 3, 1), config.ruleMaxResults ?? 10)`
  - 返回 `Promise.resolve(JSON.stringify(searchDesignRules(join(assetRoot,'uma-design-system/data'), { ...args, limit })))`
- 输出 schema：`{ type: 'string' }`（I:437）。
- render：`[{ type:'text', text: value }]`（I:438-441）。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `query` | string | 是 | — | 具体 UI 问题，中英文皆可，如 `keyboard focus` / `键盘焦点` |
| `domain` | string（enum） | 是 | — | 规则域，取值见 `RULE_DOMAINS` |
| `stack` | string | 否 | — | 显式 stack id（如 `react`/`vue`/`nextjs`/`shadcn`），**仅 `domain==='stack'` 时接受**；无效 id 会返回可用 id 列表（以错误形式） |
| `limit` | integer | 否 | 3 | 最大返回条数；被钳制到 `[1, ruleMaxResults]`（默认上限 10） |

**3) 返回**

`execute` 返回 JSON 字符串；反序列化后为 `RuleRecord[]`（Rules:26-32, 154-159）：

| 字段 | 类型 | 含义 |
|---|---|---|
| `source` | string | \`uma-design-system/data/${file}\`，`file` 为该域的 CSV 文件名（如 `ux-guidelines.csv`；stack 域为 `stacks/<stack>.csv`） |
| `row` | number | CSV 中的数据行号（表头算第 1 行，首条数据为 2） |
| `fields` | `Record<string,string>` | 该 CSV 记录的**全部字段**（含 do/dont、code sample、source 行等，逐字段原样返回） |
| `score` | number | BM25 相关度分数（大于 0） |

检索行为（Rules:116-160）：对中文 query 按固定词表扩展为英文词（如 `键盘`→`keyboard`、`焦点`→`focus`、`对比度`→`contrast` 等，完整表见 Rules:72-104）；过滤 `Status==='deprecated'` 的记录；按 `score` 降序、`row` 升序排序，截断到 `limit`。

域到 CSV 文件的映射（Rules:52-65，逐字）：`ux→ux-guidelines.csv`、`web→app-interface.csv`、`react→react-performance.csv`、`style→styles.csv`、`color→colors.csv`、`typography→typography.csv`、`chart→charts.csv`、`motion→motion.csv`、`product→products.csv`、`layout→landing.csv`、`reasoning→ui-reasoning.csv`、`icons→icons.csv`。`layout`/`reasoning` 域另有"主题字段"加权（分别为 `Pattern Name`/`UI_Category`，Rules:67-70）。

- presentCall（I:450-455）：`{ card:'generic', title:'Search design rules', kind:'search', rawInput: args }`。

**4) 错误文本（逐字，含插值模板）**

| 字符串 | 触发条件 | 证据 |
|---|---|---|
| `` design_rule_search: choose an available stack: ${stacks.join(', ')} `` | `domain==='stack'` 但未提供 `stack` 或 `stack` 不在可用列表；插值来自 `stacks/` 目录下 `.csv` 文件名（去掉扩展名），逗号拼接 | Rules:120 |
| `design_rule_search: stack is accepted only for the stack domain` | `domain!=='stack'` 却提供了 `stack` | Rules:124 |
| `` design_rule_search: invalid CSV at ${file}: ${parsed.errors[0]?.message} `` | CSV 解析产生错误；`${file}` 为 CSV 相对路径，`${parsed.errors[0]?.message}` 为 Papaparse 首条错误文本 | Rules:131 |
| `design_rule_search: query must contain searchable words` | query 无有效可检索词（词表扩展后仍为空） | Rules:139 |

- CSV 文件读取/容器读取的原生错误不包装，直接传播。

**5) 副作用**：只读。读容器内 CSV 与 `stacks/` 目录清单。不写文件。

**6) 边界条件**

- `query`：空串、纯空白、纯标点（无字母/数字、无中文命中）→ 抛 `query must contain searchable words`。
- `domain`：必须是枚举值（schema 层校验）；非法枚举在参数校验阶段失败，不会进入 `execute`。
- `stack`：`domain==='stack'` 时必填且必须在可用列表，否则错误文本携带可用 id 列表；非 stack 域携带 stack → 抛。
- `limit`：省略→3；小于 1→钳制为 1；大于 `ruleMaxResults`→钳制为上限；非整数由 schema 拒绝。
- 编码：CSV 按 UTF-8 严格读取；CSV 解析错误以逐字模板抛出。
- 不存在：CSV 文件不存在 → 底层读取原生错误传播。
- 超长：无显式字符长度上限；返回条数受 `limit` 与 `ruleMaxResults`（默认 10，最大 50）约束。
- 特殊字符：中文 query 经词表扩展；结果 fields 含 CSV 原始字符（含可能的多行正文），由 JSON 序列化转义。

**7) 证据出处**：I:413-456；Rules:36-50, 52-65, 67-70, 72-104, 116-161。

---

### 3.4 `design_preview`

**1) 签名**

- 工具名：`design_preview`（I:458）
- 参数 schema（I:460-464）：`path: string` **必填**。
- 输出 schema（I:466-483）：object，`additionalProperties:false`，`path`/`html`/`sha256` 均 `string` 且必填。
- render（I:484-487）：固定文本模板
  `` Static prototype snapshot: ${value.path}\nSource SHA-256: ${value.sha256}\nThis previews saved source only; runtime interactions and build/tests remain separate. ``
- presentationMeta（I:488-492）：`{ kind:'hey-design-preview', version:1, ...value }`（把 `path`/`html`/`sha256` 展开进元数据）。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `path` | string | 是 | — | 工作区相对路径，形如 `.design/<kebab-project>/<variant>.html`；必须是本任务已写入的已保存 HTML 文件 |

**3) 返回**

`execute(args, exec)` 返回对象 `{ path, html, sha256 }`（I:513-517）：
- `path`：原样返回入参 `path`；
- `html`：严格 UTF-8 解码后的完整 HTML 正文；
- `sha256`：原始字节的 SHA-256 hex。

展示形态：文本块给出静态快照路径与源哈希，并声明"仅预览已保存源码，运行时交互与构建/测试另行处理"。UI 展示的是静态、禁用脚本的快照，不是构建/测试或交互验证。

- presentCall（I:519-524）：`{ card:'generic', title:'Preview saved UI prototype', kind:'read', rawInput: args }`。

**4) 错误文本（逐字）**

| 字符串 | 触发条件 | 证据 |
|---|---|---|
| `design_preview requires an Agent Session` | `exec.agent === undefined` | I:495 |
| `design_preview requires a saved HTML variant under .design/<project>/` | `path` 不匹配路径正则（见边界） | I:496 |
| `design_preview requires a regular HTML file` | `lstat` 结果的 `type !== 'file'`（不存在、目录、符号链接等） | I:503 |
| `design_preview path leaves the workspace` | 解析后目标不在工作区根内（`!contains(root,target)`） | I:508 |
| `design_preview requires nonempty UTF-8 HTML text` | 正文含 NUL 或 `trim()` 后为空串 | I:511 |
| `Prototype changed while reading; retry the preview` | 读取期间文件 version 与 lstat 时不一致 | I:512 |
| TextDecoder 原生 `TypeError`（`fatal:true`） | 字节不是合法 UTF-8（I:510 解码时抛出，未包装） | I:510 |

**5) 副作用**：只读。读取工作区 HTML 字节（`fs.resolve`/`lstat`/`readBytes`/`stat`）。不写文件。

**6) 边界条件**

- `agent`：缺失→抛。
- 路径正则（I:496，逐字）：`^\.design\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.html$`。
  - 必须以 `.design/` 开头、项目名 kebab-case、variant 以字母或数字开头（其余可为字母/数字/`.`/`_`/`-`）、以 `.html` 结尾；
  - 绝对路径、`..`、`./`、非 `.design/`、非 `.html`、项目名/ variant 非法字符 → 抛。
- 不存在/类型：文件不存在、为目录、为符号链接（`lstat` 不跟随）→ `type!=='file'` → 抛。
- 越权：符号链接或路径解析逃出工作区 → 抛 `path leaves the workspace`。
- 编码：非 UTF-8 → 原生 `TypeError`；含 NUL 或空白正文 → 抛。
- 超长/体积：读取受 `previewMaxBytes`（默认 262144 字节）上限约束。
- 并发：读取期间文件变化 → 抛 `Prototype changed while reading`。
- 特殊字符：variant 允许 `.`/`_`/`-`，但不允许以 `.` 开头。

**7) 证据出处**：I:457-525。

---

### 3.5 `design_asset_list`

**1) 签名**

- 工具名：`design_asset_list`（I:527）
- 参数 schema（I:529-546）：`query?`、`category?`、`offset?: integer`、`limit?: integer`，均非必填。
- 输出 schema（I:547-593）：object，`additionalProperties:false`；字段 `systems`（必填，数组，元素为 `{name,category,description}` 全必填且 `additionalProperties:false`）、`references`（必填，`string[]`）、`total`/`catalogSize`/`offset`（必填 integer）、`nextOffset`（可选 integer）。
- render（I:594-604）：把返回对象拼成多行文本（文本形态见 §3）。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `query` | string | 否 | `''` | 按品牌/别名/类别/用途搜索 |
| `category` | string | 否 | —（不过滤） | 精确匹配的目录类别（区分大小写） |
| `offset` | integer | 否 | 0 | 匹配系统中的零基偏移 |
| `limit` | integer | 否 | —（返回全部匹配） | 页大小，受 `catalogMaxPageSize`（默认 100，最大 500）约束 |

**3) 返回**

`execute` 返回对象（I:633-644）：

| 字段 | 类型 | 含义 |
|---|---|---|
| `systems` | `{name,category,description}[]` | 当前页匹配的系统；每项取自 `systemCatalog` |
| `references` | string[] | 全部 DESIGN.md 品牌引用名（**不分页**，恒为全量） |
| `total` | integer | 匹配到的系统总数（分页前） |
| `catalogSize` | integer | 已安装设计系统总数（`systemCatalog.length`） |
| `offset` | integer | 生效的偏移 |
| `nextOffset` | integer（可选） | 有下一页时为 `offset + page.length`，否则该字段省略 |

匹配/排序语义（I:611-631，外部可见）：搜索词经 NFKC 归一 + 英文小写 + 去除非字母数字字符；精确命中身份（name/displayName/aliases）得分最高，命中任一字段次之；`category` 提供时先按精确类别过滤；结果按得分降序；分页由 `offset`/`limit` 决定。

render 文本形态（I:594-604，逐字模板）：
- 首行 `Design systems:`；
- 每个系统一行 `- ${name}${category.length === 0 ? '' : ` (${category})`}: ${description}`；
- `DESIGN.md references: ${references.join(', ')}`；
- `Catalog total: ${total}; offset: ${offset}; next offset: ${nextOffset === void 0 ? 'none' : String(nextOffset)}`；
- `Installed design systems: ${catalogSize}`；
- 当 `total===0 && catalogSize>0` 时追加 `No systems matched. Shorten the query or omit filters to browse the installed catalog.`

- presentCall（I:646-650）：`{ card:'generic', title:'List design assets', kind:'other' }`（**无 `rawInput`**）。

**4) 错误文本（逐字）**

| 字符串 | 触发条件 | 证据 |
|---|---|---|
| `design_asset_list: offset must be a nonnegative integer` | `offset` 非安全整数或 `< 0` | I:609 |
| `design_asset_list: limit must be a positive integer within catalogMaxPageSize` | `limit` 提供但非安全整数、`< 1` 或 `> catalogMaxPageSize`（默认 100） | I:610 |

**5) 副作用**：只读。基于启动期构建的 `systemCatalog`/`references` 内存目录计算，不访问文件系统，不写文件。

**6) 边界条件**

- `offset`：省略→0；非安全整数或负数 → 抛。
- `limit`：省略→返回全部匹配；非安全整数、`< 1` 或 `> catalogMaxPageSize` → 抛。
- `query`：省略/空→归一化为空串，此时所有系统均匹配（得分 1），等效浏览全目录；仅标点/符号被归一为空。
- `category`：精确匹配且区分大小写；无匹配 → `total=0`，render 追加提示行。
- 越权/不存在：不涉及路径输入；系统清单为空会在 `apply` 启动期失败（见 §2.3）。
- 编码：搜索词按 NFKC 归一、英文 locale 小写、去非字母数字；中文需以原始字符参与 `includes` 匹配。
- 超长：无字符长度上限；页大小硬约束 `catalogMaxPageSize`（默认 100，schema 上限 500）。
- 特殊字符：`references` 用 `', '` 连接展示；系统 `category` 为空串时 render 省略括号。

**7) 证据出处**：I:526-651；I:182-196, 210-235（目录构建）。

---

### 3.6 `design_asset_get`

**1) 签名**

- 工具名：`design_asset_get`（I:653）
- 参数 schema（I:655-675）：`kind: string` **必填 enum `['system','reference']`**、`name: string` **必填**、`include?: string[]`（元素 enum = `INCLUDES`）。
- `INCLUDE_FILES`（I:190-195）：`design→DESIGN.md`、`tokens→tokens.css`、`components→components.html`、`manifest→manifest.json`；`INCLUDES = ['design','tokens','components','manifest']`（I:196）。
- 输出 schema（I:676-717）：object，`additionalProperties:false`；`kind`（enum）、`name`、`files`（必填数组，元素 `{name,path,content,truncated}` 全必填）。
- render（I:718-727）：`files` 为空时一条文本 `No readable files for ${value.kind} ${value.name}.`；否则每个文件一条文本 `## ${file.path}\n\n${file.content}${file.truncated ? '\n\n[truncated at the read limit]' : ''}`。
- presentationMeta（I:728-739）：仅当 `config.assetRoot === undefined && kind==='system' && files.length>0` 时，用 `systemCatalog` 中同名系统的 `displayName` 作 `title` 并返回
  `{ kind:'hey-public-design-reference', version:1, title, hasDesign, hasTokens, hasComponents, partial }`；`title` 取不到或条件不满足时返回 `null`。四个布尔含义：`hasDesign/hasTokens/hasComponents` 分别为 files 中是否存在对应文件且 `content.length>0`；`partial` 为是否存在 `truncated===true` 的文件。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `kind` | string（enum） | 是 | — | `system`（完整设计系统）或 `reference`（DESIGN.md 库条目） |
| `name` | string | 是 | — | 来自 `design_asset_list` 的精确名称 |
| `include` | string[]（元素 enum） | 否 | `system`→`['design','tokens']`；`reference`→`['design']` | 要返回的文件逻辑名，取值 `design`/`tokens`/`components`/`manifest` |

**3) 返回**

`execute` 返回对象 `{ kind, name, files }`（I:773-777）。`files[]`：
- `name`：实际文件名（`DESIGN.md`/`tokens.css`/`components.html`/`manifest.json`）；
- `path`：虚拟引用 `\`hey-design://${kind==='system'?'systems':'brands'}/${encodeURIComponent(name)}/${fileName}\``（I:752）；
- `content`：有界 UTF-8 文本；
- `truncated`：是否被截断。

读取预算（I:197-198, 746-771）：单文件上限 `MAX_FILE_BYTES=32768`，总预算 `MAX_TOTAL_BYTES=98304`；按 `include` 顺序读取，预算耗尽即停止，故 `files` 可能少于 `include` 请求数。仅 `SYSTEM_FILES`（`DESIGN.md`/`tokens.css`/`components.html`/`manifest.json`/`tailwind-v4.css`/`USAGE.md`，I:182-189）中且实际存在的资源会被返回；`reference` 类只允许 `DESIGN.md`。

- presentCall（I:779-784）：`{ card:'generic', title:\`Read design asset: ${args.name}\`, kind:'other', rawInput: args }`。

**4) 错误文本（逐字，含插值模板）**

| 字符串 | 触发条件 | 证据 |
|---|---|---|
| `` unknown ${args.kind} ${JSON.stringify(args.name)}; call design_asset_list for valid names `` | `name` 不在对应清单（`kind==='system'` 用 `systems`，`kind==='reference'` 用 `references`）中；`${JSON.stringify(args.name)}` 为带引号的 JSON 形式 | I:742 |
| `` Unable to read ${reference}. Verify the installed design assets and retry. `` | 读取某文件抛出异常（含非 UTF-8 解码失败）；`${reference}` 为 `hey-design://...` 引用；非 `Error` 对象原样重抛 | I:759-762 |

**5) 副作用**：只读。读容器内设计资源。不写文件。

**6) 边界条件**

- `kind`：必须是 `system`/`reference`（schema 层校验）。
- `name`：必须是 `design_asset_list` 返回过的精确名称，否则抛 `unknown ...`；名称含特殊字符时以 `encodeURIComponent` 编码进引用。
- `include`：省略用默认；含非法逻辑名由 schema 拒绝；`reference` 类只返回 `DESIGN.md`，其余逻辑名被静默跳过。
- 不存在：请求的文件在资源中不存在 → 静默跳过（不抛），可能导致 `files=[]`。
- 预算：单文件 > 32768 字节 → 返回 UTF-8 安全前缀并置 `truncated=true`；累计接近 98304 字节时提前停止，`truncated` 可能为 true。
- 编码：非 UTF-8 解码失败 → 包装为 `Unable to read ...`；截断处保持合法 UTF-8 前缀（`utf8Prefix`，R:54-59）。
- 超长/特殊字符：正文可能含 Markdown/HTML/CSS 特殊字符，由 render 拼入文本块、由 JSON 负责转义。
- 无可读文件 → `render` 输出 `No readable files for <kind> <name>.`

**7) 证据出处**：I:652-785；I:182-198, 237-244（有界读取）。

---

### 3.7 `hey_knowledge_search`

**1) 签名**

- 工具名：`hey_knowledge_search`（I:787，冻结）
- 参数 schema（I:789-803）：`query: string` **必填**、`limit?: integer`、`maxSnippetChars?: integer`。
- 输出 schema（I:804-840）：object，`additionalProperties:false`；`query`（string，必填）、`results`（必填数组，元素 `{path,heading,snippet,score:integer}` 全必填）。
- render（I:841-847）：`results` 为空时一条文本 `` No bundled knowledge matched ${JSON.stringify(value.query)}. ``；否则每条结果一条文本 `` ## ${result.heading}\n${result.path}\n\n${result.snippet} ``。

**2) 参数表**

| 字段 | 类型 | 必填 | 默认值 | 含义 |
|---|---|---|---|---|
| `query` | string | 是 | — | 描述所需指引的关键词，如 `design tokens contrast` / `PRD acceptance criteria` |
| `limit` | integer | 否 | 5 | 最大结果数，钳制到 `[1,10]` |
| `maxSnippetChars` | integer | 否 | 600 | 每条片段最大字符数，钳制到 `[200,2000]` |

**3) 返回**

`execute` 返回对象 `{ query, results }`（I:864-867）：
- `query`：原样返回入参 `query`（未归一化）；
- `results[]`：
  - `path`：\`hey-knowledge://${result.section.path}\`（I:859），`section.path` 是容器内 `.md` 的相对路径；
  - `heading`：命中的 Markdown 标题（若无 `#` 标题则为文件名）；
  - `snippet`：截取的正文片段，前后可能带省略号 `…`（I:306-312）；
  - `score`：相关度整数分数（大于 0）。

检索行为（I:279-304, 849-868）：query 先 `trim`+NFKC+小写；英文按空白分词，中文连续串按单字（长度 1）或相邻二元字组（长度 ≥2）展开并去重；打分对完整短语命中（长度 ≥4）加权、对标题命中加权；结果按 `score` 降序、`path` 的 `localeCompare` 升序排序，截断到 `limit`。

知识片段来源：§1 的六个 KNOWLEDGE_ROOTS 下所有 `.md` 文件，按 `#`/`##`/`###` 标题切分为 section（I:246-277）。

- presentCall（I:869-874）：`{ card:'generic', title:\`Search Uma knowledge: ${args.query}\`, kind:'other', rawInput: args }`。

**4) 错误文本（逐字）**

| 字符串 | 触发条件 | 证据 |
|---|---|---|
| `hey_knowledge_search requires at least one search term` | `query` 归一化后无任何检索词（`terms.length===0`） | I:852 |

- 知识 `.md` 读取/容器读取的原生错误不包装，直接传播。

**5) 副作用**：只读。基于启动期构建的 `knowledge` 内存索引计算（索引内容来自容器内 `.md`）。不写文件。

**6) 边界条件**

- `query`：空串、纯空白、纯符号（NFKC+小写后无可检索词）→ 抛 `requires at least one search term`。
- `limit`：省略→5；`< 1`→钳制为 1；`> 10`→钳制为 10（静默钳制，不抛）；非整数由 schema 拒绝。
- `maxSnippetChars`：省略→600；`< 200`→钳制为 200；`> 2000`→钳制为 2000（静默钳制，不抛）。
- 中文：连续汉字串展开为单字或 bigram；单字直接作为词，长度 ≥2 的串按相邻两字切分。
- 无匹配 → `results=[]`，render 输出 `No bundled knowledge matched <JSON 形式的 query>.`
- 编码：query 按 NFKC 归一；`.md` 按 UTF-8 读取。
- 超长：单条片段受 `maxSnippetChars`（钳制后 200–2000）约束，超出部分以 `…` 标示；结果数受 `limit` 约束。
- 不存在：知识根为空会在 `apply` 启动期失败（见 §2.3），工具本身不会遇到空索引。
- 特殊字符：query 中的引号等在 render 无结果文本里由 `JSON.stringify` 转义。

**7) 证据出处**：I:786-875；I:199-206, 246-312。

---

## 四、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `design_context` / 正常、target+project+page、缺 Session、非法 target、非 UTF-8、预算超限、version 变化 | 三态 files + 多类错误 |
| `hey_resource_read` / 目录列举、文本分页、未知 skill、越界路径、非 UTF-8、超大目录页 | 对外统一错误 + reference 形态 |
| `design_rule_search` / 正常、中文扩展、stack 缺失、stack 越域、CSV 损坏、空 query | 四错误 + fields 完整性 |
| `design_preview` / 正常、路径正则失败、非文件、越界、非 UTF-8、version 变化 | 六错误 + render/presentationMeta |
| `design_asset_list` / 正常、空 query、category 过滤、分页 nextOffset、非法 offset/limit、零匹配提示 | 两错误 + render 各行 |
| `design_asset_get` / system 默认 include、reference 只 DESIGN.md、未知 name、截断、无法读取、空 files | 两错误 + 预算截断 + presentationMeta |
| `hey_knowledge_search` / 正常、中文 bigram、limit/maxSnippet 钳制、空 query、零匹配 | 一错误 + 片段形态 |
| `apply` / 正常、assetRoot 相对、空 systems/references/knowledge、坏 manifest | 六启动期错误 |

---

## 五、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字，无"报错"这类概括，含插值模板
- [ ] 没有出现"先 X 再 Y"这类实现描述
- [ ] 命名冲突（§1）已由评审定稿，id 字符串全局一致
- [ ] 冻结契约单独列出，未混入行为描述
- [ ] 边界覆盖空/超长/越权/不存在/并发/编码
- [ ] render / presentCall / presentationMeta 形态齐全
- [ ] 找一名没看过 src 的人读一遍，能复述出至少 4 个工具的行为

---

## 六、自查结果（写完后遮住 src 复述）

方法：随机抽取 `design_preview`（§3.4）与 `hey_knowledge_search`（§3.7），遮住全部 `src/*.ts`，
仅凭本 spec 复述两者的参数、错误文本、边界，再与源码逐条比对。

### 6.1 `design_preview`

- **参数**：仅 `path: string` 必填，形如 `.design/<kebab-project>/<variant>.html`。
- **返回**：`{ path, html, sha256 }`；render 为固定文本"Static prototype snapshot…"，presentationMeta `kind='hey-design-preview', version=1` 并展开三个字段。
- **错误文本**（复述出 6 条具名 + 1 条原生）：
  1. `design_preview requires an Agent Session`
  2. `design_preview requires a saved HTML variant under .design/<project>/`
  3. `design_preview requires a regular HTML file`
  4. `design_preview path leaves the workspace`
  5. `design_preview requires nonempty UTF-8 HTML text`
  6. `Prototype changed while reading; retry the preview`
  7. `TextDecoder` 的 `TypeError`（非 UTF-8，未包装）
- **边界**：无 Agent→抛；路径正则（kebab 项目名、variant 首字符字母数字、`.html` 后缀）→不符即抛；非普通文件（含符号链接）→抛；逃出工作区→抛；非 UTF-8 / 含 NUL / 空白正文→抛；读取期间文件变化→抛；体积受 `previewMaxBytes` 约束。

### 6.2 `hey_knowledge_search`

- **参数**：`query: string` 必填；`limit` 可选默认 5、钳制 `[1,10]`；`maxSnippetChars` 可选默认 600、钳制 `[200,2000]`。
- **返回**：`{ query（原样）, results: [{ path='hey-knowledge://…', heading, snippet, score }] }`；零结果 render 为 `No bundled knowledge matched <JSON(query)>.`
- **错误文本**（复述出唯一 1 条）：`hey_knowledge_search requires at least one search term`。
- **边界**：空/纯空白/纯符号 query→抛；`limit`/`maxSnippetChars` 越界为静默钳制而非抛错；中文按单字/bigram 展开；片段截断带 `…`；结果按分数降序、路径升序；知识来自六个 `uma-*` KNOWLEDGE_ROOTS。

### 6.3 结论

两个工具的参数表、错误文本（含插值模板与逐字措辞）、边界条件均可仅凭 spec 完整复述并与源码逐条吻合，
说明规格已达到"行为等价、实现独立"的合格标准。**唯一待决项**：§1 的命名冲突——
任务书冻结标记 `tool-uma-design` 与源码字面值 `tool-hey-design` 不一致，本 spec 按红线逐字保留错误文本前缀
`tool-hey-design:`，请评审定稿后全局统一。
