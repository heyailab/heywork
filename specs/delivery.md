# spec: dsh-util-uma-delivery（14 个导出）

> 重写目标：行为等价的 `heywork-util-delivery` 包。
> 证据（均为逆向还原的可读 TS）：
> `src/types/index.ts`（下称 I）、`src/types/coding-standards.ts`（下称 C）、
> `src/types/engineering-guides.ts`（下称 G）、`src/types/ssh-target.ts`（下称 S）、
> `src/types/redact.ts`（下称 R）、`src/index.ts`（下称 E）。行号仅供校对，不作为抄写依据。
> 状态：**待横向评审**（写完后需找人验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了数据全废）

这些不是"行为"，是**字节级常量**。重写时逐字保留：

### 1.1 身份与命名

| 项 | 值 | 证据 |
|---|---|---|
| 包名（JSDoc） | `@deepseek-ai/dsh-util-uma-delivery` | I:31 |
| 导出面 | 14 个符号，最终顺序见 E:13-28；`types/index.ts:213-221` 集中转出其中 7 个兄弟模块符号（顺序与 E 中对应子集一致），另 7 个由本模块 `export` | I:213-221, E:13-28 |
| 含 `Uma` 的导出名 | `parseUmaSshTarget`、`umaSshUri`（**源码就这么拼，不要改成 `hey*`**） | S:21,55 |
| 文案身份 | 规则/指南正文里用 `HEY` 与 `UMA 验证流程` / `UMA verification` 字样；无独立的 hey 前缀别名 | C:390-516, G:174-239 |

> 关于"内部冻结标识 vs 对外 hey 身份"：本包是纯函数工具包，源码里带 `Uma` 的冻结标识只有上表两个导出名（`parseUmaSshTarget`、`umaSshUri`）与正文文案里的 `UMA` 字样，均逐字保留、**不替换成 hey**。本包源码中**没有** `.uma/` 路径约定、没有 `uma-*` 容器路径、也没有 `UMA Studio local resource container v1` 密钥串（该串属 `dsh-skill-uma` 容器层，与本包无关）。对外重写包身份为 hey（`heywork-util-delivery`），但函数导出名按源码保留 Uma 拼写。

### 1.2 枚举与集合（冻结字面值）

| 项 | 值 | 证据 |
|---|---|---|
| `ArtifactKind`（8 类，流水线顺序） | `research` / `prd` / `architecture` / `uiux` / `spec` / `preview` / `qa` / `delivery` | I:16,34-43 |
| `RequiredArtifactKind` | `Exclude<ArtifactKind, 'preview'>` | I:25 |
| `REQUIRED_ARTIFACTS`（7 项，**`preview` 不在其中**） | `research` / `prd` / `architecture` / `uiux` / `spec` / `qa` / `delivery` | I:66-74 |
| `DeliveryDepth` | `patch` / `feature` / `product` | I:19 |
| `DeliveryPhase` | `documents` / `delivery` | I:22 |
| `RuleLevel` | `required-by-project` / `advisory` | G:29 |
| `VerificationMethod` | `test` / `review` / `lint` / `typecheck` | G:32 |
| `CATALOG_VERSION` | `2026.11.12.1` | C:39 |
| `[redacted]` 替换标记 | 四处脱敏统一替换为字面串 `[redacted]` | R:16 |

### 1.3 正则、长度、默认值（逐字）

| 项 | 值 | 证据 |
|---|---|---|
| frontmatter 定界 | `/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u`（允许 CRLF，闭合 delimiter 后可跟 `\r?\n` 或字符串结尾） | I:107 |
| status 提取 | `/^status:\s*(draft|approved)\s*$/mu` | I:141 |
| owner 提取 | `/^owner:\s*(\S+)\s*$/mu` | I:142 |
| updated 提取 | `/^updated:\s*(\S+)\s*$/mu` | I:143 |
| 占位符匹配 | `/\b(TODO\|TBD\|FIXME\|XXX)\b\|lorem ipsum/giu`（匹配后 `toUpperCase()`，再去重） | I:119 |
| section 检查正则表 `REQUIRED_SECTIONS` | 见下 §1.4，逐字 | I:76-93 |
| SSH 输入长度上限 | `320`（`input.trim()` 后 `> 320` 直接返回 `undefined`） | S:24 |
| SSH `ssh ` 命令式正则 | `/^ssh\s+(?:-p\s+(\d{1,5})\s+)?(\S+)(?:\s+-p\s+(\d{1,5}))?$/u` | S:26 |
| SSH 地址正则 | `/^(?:ssh:\/\/)?([A-Za-z_][A-Za-z0-9_.-]{0,63})@(\[[a-fA-F0-9:.]+\]\|[A-Za-z0-9][A-Za-z0-9.-]{0,252})(?::(\d{1,5}))?$/u` | S:31 |
| SSH 端口范围 / 默认 | `1..65535`，缺省 `22` | S:33-34 |
| SSH IPv6 校验 | `new URL(\`ssh://${host}\`)`（仅当 host 以 `[` 开头） | S:36-41 |
| 域名标签校验 | `host.replace(/\.$/u, "").split(".")` 每标签 `/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/u` | S:42 |
| 脱敏规则 1 | `/(Bearer\s+)[a-z0-9._~+/=-]+/giu` → `$1[redacted]` | R:16 |
| 脱敏规则 2 | `/([?&](?:token\|api[_-]?key\|access[_-]?token\|secret)=)[^\s&#"']+/giu` → `$1[redacted]` | R:16 |
| 脱敏规则 3 | `/((?:password\|api[_-]?key\|access[_-]?token\|token\|secret)\s*[:=]\s*)[^\s,;]+/giu` → `$1[redacted]` | R:16 |
| 脱敏规则 4 | `/\bsk-[A-Za-z0-9_-]{16,}\b/gu` → `[redacted]` | R:16 |
| `ALIASES`（大小写/别名归一） | `ts→typescript`、`js→javascript`、`py→python`、`golang→go`、`c#→csharp`、`c++→cpp`、`.net→dotnet`、`node→nodejs`、`node.js→nodejs`、`react→frontend`、`vue→frontend`、`svelte→frontend`、`angular→frontend` | C:523-537 |
| `selectCodingStandards` 匹配式 | `tags.some((tag) => selected.has(tag) \|\| tag === "all" && options.includeGeneral !== false)`（`&&` 优先级高于 `\|\|`，**见 §8.4 已知行为**） | C:573 |

### 1.4 `REQUIRED_SECTIONS`（每个工件必须命中的 section 模式，至少一条命中才算齐全）

| 工件 | 模式（`pattern.source` 即 `missingSections` 里的字符串） | 证据 |
|---|---|---|
| research | `finding\|发现` / `open question\|待定\|未决`（均 `/i`） | I:77 |
| prd | `goal\|目标` / `acceptance\|验收`（均 `/i`） | I:78 |
| architecture | `component\|组件\|模块` / `data\|数据` / `api\|接口`（均 `/i`） | I:79-83 |
| uiux | `token\|令牌\|变量` / `state\|状态` / `responsive\|响应`（均 `/i`） | I:84-88 |
| spec | `task\|任务` / `acceptance\|验收`（均 `/i`） | I:89 |
| preview | `preview\|预览`（`/i`） | I:90 |
| qa | `gate\|门禁\|result\|结果`（`/i`） | I:91 |
| delivery | `deliver\|交付`（`/i`） | I:92 |

> 来源说明：`CODING_STANDARD_SOURCES` 的 URL / license / revision 是来源元数据，**不随包附带来源手册全文**；指南正文是 HEY 原创综述，不是发布方手册或认证（C:60, G:9,54,162）。所有规则/指南/来源对象经 `Object.freeze` 递归冻结（C:41-58）。

---

## 二、包导出面（14 个）

`src/index.ts`（E:13-28）按如下顺序导出；`types/index.ts` 自身定义了 `ARTIFACTS`/`REQUIRED_ARTIFACTS`/`evaluateArtifact`/`evaluateCheckpoint`/`evaluateGate`/`requiredArtifacts`/`splitFrontmatter` 并在 I:213-221 汇总兄弟模块符号：

```
ARTIFACTS, BUILTIN_CODING_GUIDES, CODING_STANDARD_RULES, CODING_STANDARD_SOURCES,
REQUIRED_ARTIFACTS, evaluateArtifact, evaluateCheckpoint, evaluateGate,
parseUmaSshTarget, redactDevelopmentText, requiredArtifacts, selectCodingStandards,
splitFrontmatter, umaSshUri
```

其中 `REQUIRED_SECTIONS`、`placeholdersIn`、`CATALOG_VERSION`、`ALIASES`、`ENGINEERING_*` 是模块内部/兄弟模块符号，**不在导出面**，但决定导出行为，已在 §1 冻结。

---

## 三、`ARTIFACTS`

- **签名**：`const ARTIFACTS: readonly ArtifactKind[]`（值导出，非函数）
- **参数**：无
- **返回**：八类工件字符串数组，顺序 `research, prd, architecture, uiux, spec, preview, qa, delivery`（§1.2）
- **错误文本**：无
- **副作用**：模块求值时创建数组；源码仅 TS 标注 `readonly`，**运行时未调 `Object.freeze`**（I:34）
- **边界**：`preview` 是合法成员（用于工具枚举/排序），但不是交付必需件（见 `REQUIRED_ARTIFACTS`）；数组运行时可变，调用方若强改会影响同一模块实例
- **证据**：I:16,34-43

## 四、`REQUIRED_ARTIFACTS`

- **签名**：`const REQUIRED_ARTIFACTS: readonly RequiredArtifactKind[]`（值导出）
- **参数**：无
- **返回**：7 件数组 `research, prd, architecture, uiux, spec, qa, delivery`
- **错误文本**：无
- **副作用**：模块求值时创建数组；运行时同样**未 `Object.freeze`**（I:66）
- **边界**：**已知行为如实记录——`preview` 不在 `REQUIRED_ARTIFACTS` 里**；因此 `evaluateGate` 永不要求它、workflow 的 product/delivery 必需集也不含它；`RequiredArtifactKind` 类型层面已排除 `preview`
- **证据**：I:25,66-74

## 五、`BUILTIN_CODING_GUIDES`

- **签名**：`const BUILTIN_CODING_GUIDES: readonly CodingStandardGuide[]`（值导出）
- **参数**：无
- **返回**：14 个冻结指南对象，顺序 = 9 个内置 HEY 指南 + `ENGINEERING_GUIDES`（5 个，C:519）逐项 `freezeGuide`：
  1. `architecture-and-naming`（languages `all`，version `2026.11.09.1`）
  2. `typescript-and-frontend`（`typescript, javascript, frontend`）
  3. `java-services`（`java`）
  4. `go-services`（`go`）
  5. `python-projects`（`python`）
  6. `dotnet-apis`（`csharp, dotnet`）
  7. `http-api-contracts`（`rest, http-api, backend`）
  8. `secure-boundaries`（`all`）
  9. `testing-and-review`（`all`）
  10-14. `ENGINEERING_GUIDES`：`accessible-product-ui`（`frontend, web`）、`database-concurrency`（`postgresql, database`）、`review-evidence`（`all`）、`order-payment-lifecycle`（`payments, commerce`）、`saas-tenant-authorization`（`saas, backend, web`），version `2026.11.12.1`
  - 每项形状：`{ id, version, languages: readonly string[], sourceIds: readonly string[], title: {zh,en}, body: {zh,en} }`
- **错误文本**：无
- **副作用**：每个对象及 `languages`/`sourceIds`/`title`/`body` 均 `Object.freeze`（C:50-58），模块加载后不可变
- **边界**：`body.zh`/`body.en` 是冻结的双语正文数据（含 UMA 验证流程段落），按 C:376-520 / G:163-242 字面保留；`sourceIds` 引用来源 id，可能指向不在 `CODING_STANDARD_SOURCES` 的项（如 `microsoft-rest`），选择时由 `selectCodingStandards` 过滤
- **证据**：C:28-36,376-520；G:44-52,163-242

## 六、`CODING_STANDARD_RULES`

- **签名**：`const CODING_STANDARD_RULES: readonly CodingStandardRule[]`（值导出）
- **参数**：无
- **返回**：23 个冻结规则对象，顺序 = `ENGINEERING_RULES`（6 个，G:89-160）逐项 `freezeRule` + 17 个 HEY 规则（C:158-372）：
  - 来自 G：`HEY.STD.KEYBOARD_FOCUS`、`HEY.STD.ACCESSIBLE_ERRORS`（`required-by-project`/`test`）、`HEY.STD.TRANSACTION_RETRY`、`HEY.STD.REVIEW_COUNEXAMPLE`（`advisory`）、`HEY.STD.ORDER_REPLAY`、`HEY.STD.TENANT_SCOPE`（`required-by-project`/`test`）
  - C 新增（id 逐字）：`HEY.STD.PROJECT_PRECEDENCE`、`HEY.STD.SEMANTIC_NAMES`、`HEY.STD.JAVA_LAYERING`、`HEY.STD.JAVA_RESOURCE_LIFETIME`、`HEY.STD.TS_UNTRUSTED_TYPES`、`HEY.STD.TS_MODULE_BOUNDARIES`、`HEY.STD.PYTHON_PUBLIC_NAMES`、`HEY.STD.GO_PACKAGES`、`HEY.STD.GO_ERRORS_CONTEXT`、`HEY.STD.GO_GOROUTINE_LIFETIME`、`HEY.STD.DOTNET_PUBLIC_NAMING`、`HEY.STD.API_COMPATIBILITY`、`HEY.STD.AUTHORIZATION_RESOURCE`、`HEY.STD.INPUT_PARAMETERIZATION`、`HEY.STD.SECRET_HANDLING`、`HEY.STD.FILE_PATH_SCOPE`、`HEY.STD.OUTBOUND_TARGET_SCOPE`
  - 每项形状：`{ id, languages, sourceIds, level, summary: {zh,en}, verification }`；`level ∈ {required-by-project, advisory}`，`verification ∈ {test, review, lint, typecheck}`
- **错误文本**：无
- **副作用**：每对象及 `languages`/`sourceIds`/`summary` 递归 `Object.freeze`（C:41-48）
- **边界**：`HEY.STD.ORDER_REPLAY` 的 `sourceIds` 同时含 `microsoft-rest` 与 `postgres-isolation`（跨来源）；`all` language 的规则仅在 `includeGeneral !== false` 时参与选择（§8.4）
- **证据**：C:18-26,155-373；G:28-42,89-160

## 七、`CODING_STANDARD_SOURCES`

- **签名**：`const CODING_STANDARD_SOURCES: readonly ...[]`（值导出）
- **参数**：无
- **返回**：12 个冻结来源对象，顺序 = `ENGINEERING_SOURCES`（3 个，G:55-86）+ 9 个 C 新增（C:63-152）：
  - 来自 G：`w3c-wcag22`、`postgres-isolation`、`google-review`
  - C 新增：`alibaba-p3c`、`google-ts`、`python-pep8`、`go-review`、`microsoft-dotnet`、`microsoft-rest`、`uber-go`、`owasp-asvs5`、`tencent-secguide`
  - 每项形状：`{ id, title, publisher, url, license, licenseUrl, verifiedAt, revision, notice? }`（`notice` 可选，仅 `w3c-wcag22` 带长版权 notice，G:65）
- **错误文本**：无
- **副作用**：每对象 `Object.freeze`，数组 `Object.freeze`（C:61-153）
- **边界**：全部 `verifiedAt` 为 `2026-11-09`（C 新增）或 `2026-11-12`（G 三项）；`revision` 含仓库快照哈希，**逐字保留**；`selectCodingStandards` 返回的 `sources` 是本数组的子集（按被选中规则/指南的 `sourceIds` 过滤）
- **证据**：C:60-153；G:9-20,54-86

## 八、`selectCodingStandards`

- **签名**：`(languages: string[], options: SelectionOptions = {}) => CodingStandardsSelection`
- **参数**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `languages` | `string[]` | 是 | 语言或任务域标签（如 `typescript`/`go`/`backend`/`http-api`）；未知标签不猜测框架 |
| `options.includeGeneral` | `boolean` | 否 | 默认：等价于 `!== false`（即**除显式传 `false` 外都为 true**），控制 `all` 标签的通用规则/指南是否参与 |

- **返回**：`CodingStandardsSelection`，递归冻结（C:544-593）：

| 字段 | 值 |
|---|---|
| `catalogVersion` | `2026.11.12.1` |
| `languages` | 归一后 `selected` 的升序去重副本；`selected` 含 `nodejs` 时连带纳入 `javascript` |
| `rules` | `CODING_STANDARD_RULES.filter(rule => matches(rule.languages))` |
| `guides` | `BUILTIN_CODING_GUIDES.filter(guide => matches(guide.languages))` |
| `sources` | `CODING_STANDARD_SOURCES.filter(s => sourceIds.has(s.id))`，`sourceIds` = 选中 rules+guides 的 `sourceIds` 并集 |
| `policy` | `{ projectRulesFirst: true, selectedRulesAreNotVerified: true, requiredChecksNeedReceipts: true, notes: {zh,en} }`（notes 逐字见 C:588-589） |

  - 归一步骤（行为）：每个标签 `trim().toLowerCase()` → 查 `ALIASES`（§1.3）→ 过滤掉 `""` 与 `"all"` → Set 去重 → 排序；`selected` 若含 `nodejs` 则追加 `javascript`
- **错误文本**：无自定义错误文本（函数不 `throw` 业务错误）；`languages` 为 `null`/`undefined` 等非数组时 `.map` 抛原生 TypeError，不包装
- **副作用**：只读；返回全新冻结对象/数组，不修改入参或全局集合
- **边界条件**：
  - 空：`languages = []` → 无标签命中除 `all` 外的规则；`includeGeneral !== false` 时仍选中所有 `all` 标签项，`languages` 返回 `[]`
  - 缺省/别名：`ts`→`typescript`、`node`/`node.js`→`nodejs`（并连带 `javascript`）、大小写与首尾空白被归一
  - **已知行为——`&& ||` 优先级如实记录**：匹配式为 `selected.has(tag) || tag === "all" && options.includeGeneral !== false`（C:573）。因 `&&` 优先于 `||`，语义是"标签在 selected 中 **或** （标签为 `all` **且** `includeGeneral !== false`）"。**不要**给它加括号改成 `(selected.has(tag) || tag === "all") && ...`；即使 `includeGeneral === false`，只要某规则 language 已在 selected 中仍会命中
  - 越权/不存在：未知标签（如 `ruby`）不报错、只不命中任何带该标签的规则/指南；不猜测框架
  - 选择 ≠ 验证：返回体 `policy.selectedRulesAreNotVerified: true`，选中规则不代表检查已通过（C:585,589）
  - 去重：`languages` 内重复标签经 Set 归一；`nodejs` 触发的 `javascript` 也去重
- **证据**：C:39,41-58,522-593；G:9-86

## 九、`evaluateArtifact`

- **签名**：`(artifact: ArtifactKind, content: string) => ArtifactEvaluation`
- **参数**：`artifact` — 应用哪套 section 检查的工件种类；`content` — 完整工件文本（可含 frontmatter）
- **返回**：`{ status, owner, updated, body, missingSections, placeholders, ready }`（I:123-155）：
  - `body` = `splitFrontmatter(content).body`
  - `status` = frontmatter 中 `^status:\s*(draft|approved)\s*$`（`mu`）捕获值；仅 `draft`/`approved` 原样返回，否则 `unknown`
  - `owner` = `^owner:\s*(\S+)\s*$`（`mu`）捕获值，无则 `null`
  - `updated` = `^updated:\s*(\S+)\s*$`（`mu`）捕获值，无则 `null`
  - `missingSections` = `REQUIRED_SECTIONS[artifact].filter(p => !p.test(body)).map(p => p.source)`（§1.4，**未命中模式的 source 串**）
  - `placeholders` = `placeholdersIn(body)` = `[...new Set([...body.matchAll(/\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum/giu)].map(m => m[0].toUpperCase()))]`（大写、去重、保持首次出现顺序）
  - `ready` = `missingSections.length === 0 && placeholders.length === 0`
- **错误文本**：无自定义错误；`artifact` 为未知种类时 `REQUIRED_SECTIONS[artifact]` 为 `undefined`，`.filter` 抛原生 TypeError，不包装
- **副作用**：只读，不修改入参
- **边界**：
  - 空：`content = ""` → 无 frontmatter，`body = ""`、status `unknown`、owner/updated `null`、所有 section 模式都未命中 → `missingSections` 为全部模式 source、placeholders `[]`、`ready:false`
  - 不存在字段：`status` 缺失/非法（如 `reviewed`）→ `unknown`；owner/updated 缺失 → `null`
  - 占位符：`lorem ipsum` 匹配后大写为 `LOREM IPSUM`；多个 TODO 去重为单个 `TODO`；`\b` 词边界，`TODOX` 不匹配
  - 超长/编码：无长度上限；按 JS 字符串处理（正则带 `u` flag）
  - CRLF：frontmatter 定界支持 `\r?\n`
- **证据**：I:95-155（重点 106-115,118-120,139-155）

## 十、`evaluateGate`

- **签名**：`(artifacts: ArtifactCheck[]) => GateResult`
- **参数**：`artifacts` — 每个在场工件一条，元素至少含 `{ artifact, ready }`，可带 `status`/`missingSections`/`placeholders`（I:157-164）
- **返回**：`{ ready, missing, blocked }`：
  - `present = new Set(artifacts.map(e => e.artifact))`
  - `missing = REQUIRED_ARTIFACTS.filter(a => !present.has(a))`（**始终全套 7 件，不看 depth/phase**）
  - `blocked = [...missing, ...artifacts.filter(e => !e.ready).map(e => e.artifact)]`
  - `ready = blocked.length === 0`
- **错误文本**：无自定义错误；非数组入参抛原生 TypeError
- **副作用**：只读
- **边界**：
  - 空：`artifacts = []` → `missing` = 全部 7 件、`blocked` 同、`ready:false`
  - **已知行为**：`blocked` 把所有 `!ready` 的在场工件都加进去，**不限制在必需集**——即使 `preview` 在场且不 ready 也会进入 `blocked`（与 `evaluateCheckpoint` 不同）
  - 重复：同一 artifact 多条且都不 ready → `blocked` 出现重复项；`missing` 只看 Set 存在性
  - `ready` 字段缺失（非 boolean）→ `!e.ready` 按 falsy 处理，视为未 ready
- **证据**：I:157-187

## 十一、`evaluateCheckpoint`

- **签名**：`(artifacts: ArtifactCheck[], depth: DeliveryDepth, phase: DeliveryPhase) => GateResult`
- **参数**：`artifacts` 同 §十；`depth`/`phase` 见 §1.2
- **返回**：`{ ready, missing, blocked }`：
  - `required = requiredArtifacts(depth, phase)`（§十三）
  - `relevant = artifacts.filter(e => required.includes(e.artifact))`（**只保留必需集内的工件**）
  - `missing = required.filter(a => !relevant.some(e => e.artifact === a))`
  - `blocked = [...missing, ...relevant.filter(e => !e.ready).map(e => e.artifact)]`
  - `ready = blocked.length === 0`
- **错误文本**：无自定义错误；非数组入参抛原生 TypeError
- **副作用**：只读
- **边界**：
  - 空：`artifacts = []` → 按 depth/phase 的 `required` 计算 `missing`；`patch` 时 `required = []` → `ready:true`
  - 非必需工件：不在 `required` 的工件（含 `preview`）**即使不 ready 也不进 `blocked`**——与 `evaluateGate` 的关键差异
  - 缺省/非法 depth/phase：`requiredArtifacts` 非 patch/非 feature 一律走 product 分支；phase 非 `documents` 一律走 delivery 分支（I:52-63）
  - 重复：`relevant` 中同 artifact 多条不 ready → `blocked` 重复
- **证据**：I:157-164,189-206

## 十二、`requiredArtifacts`

- **签名**：`(depth: DeliveryDepth, phase: DeliveryPhase) => ArtifactKind[]`
- **参数**：`depth`、`phase`（§1.2）
- **返回**（I:51-64）：

| depth | phase | 返回 |
|---|---|---|
| `patch` | 任意 | `[]` |
| `feature` | `documents` | `["spec"]` |
| `feature` | `delivery` | `["spec", "qa", "delivery"]` |
| `product` | `documents` | `["research", "prd", "architecture", "uiux"]` |
| `product` | `delivery` | `REQUIRED_ARTIFACTS`（7 件，含 `spec`/`qa`/`delivery`，**不含 `preview`**） |

- **错误文本**：无
- **副作用**：无；`patch`/`feature` 返回新数组字面量，`product/delivery` 直接返回模块常量 `REQUIRED_ARTIFACTS` 的引用（I:63）
- **边界**：
  - **已知行为**：`preview` 永不出现在任何分支的必需集里
  - 缺省/非法值：非 `patch`/`feature` 的 depth 落入 product 分支；非 `documents` 的 phase 落入 delivery 分支（源码只判断等值，无枚举校验）
  - `patch` 恒返回空 → gate 无文档阻塞
- **证据**：I:45-64

## 十三、`parseUmaSshTarget`

- **签名**：`(input: string) => UmaSshTarget | undefined`
- **参数**：`input` — 登录目的地、SSH URL 或常见 `ssh` 命令串；先 `input.trim()`
- **返回**：成功 `{ user: string, host: string, port: number }`（host 去掉 IPv6 方括号），不支持/非法输入返回 `undefined`（I:9-14,21-48）：
  - `user` = 地址正则第 1 组（首字母/下划线，后接至多 63 个 `[A-Za-z0-9_.-]`）
  - `host` = 第 2 组；方括号 IPv6 时返回去掉首尾 `[`/`]` 的内容
  - `port` = `Number(commandPort ?? address[3] ?? "22")`
- **错误文本**：无自定义错误；所有失败路径返回 `undefined`（`new URL` 的异常在 catch 中 `return`，I:36-41）
- **副作用**：只读；唯一外部交互是 `new URL` 构造（仅 IPv6 分支）
- **边界条件**：
  - 超长：`trim()` 后长度 `> 320` → `undefined`
  - `ssh ` 命令式：`ssh [ -p N ] <dest> [ -p N ]`；两个 `-p` 同时出现 → `undefined`（I:27）
  - 双端口冲突：命令式带了 `-p` 且地址又带 `:port` → `undefined`（I:32）
  - 端口：`Number` 后 `< 1` 或 `> 65535` → `undefined`；缺省 `22`
  - IPv6：host 以 `[` 开头时用 `new URL("ssh://" + host)` 校验，构造失败 → `undefined`；正则只允许 `[a-fA-F0-9:.]`
  - 域名：去掉末尾 `.` 后逐标签校验（每标签 1–63 字符、字母数字开头结尾、中间可含 `-`），任一标签非法 → `undefined`（I:42）
  - 不存在/不支持：不接受密码、shell 语法或任意 SSH 选项；不匹配地址正则 → `undefined`
  - 空/纯空白：`trim()` 后为空 → 正则不匹配 → `undefined`
- **证据**：S:9-48

## 十四、`redactDevelopmentText`

- **签名**：`(text: string) => string`
- **参数**：`text` — 要投影到模型可见证据的原始文本
- **返回**：应用 §1.3 四条 `replace` 后的字符串；命中值替换为 `[redacted]`，保留捕获前缀（如 `Bearer `、`?token=`）
- **错误文本**：无；非字符串入参 `.replace` 抛原生 TypeError
- **副作用**：只读，不修改保留的源材料（R:10 "without modifying the retained source material"）
- **边界条件**：
  - **已知行为如实记录——这是 best-effort 展示层过滤，不是"任意文本无秘密"的证明**（R:11 "not proof that arbitrary text contains no secrets"）；不要把它当作安全保证
  - 四条规则按顺序链式替换；规则 1–3 带 `giu`（忽略大小写、全局），规则 4 `gu`（`sk-` 小写敏感，后接至少 16 个 `[A-Za-z0-9_-]`）
  - 规则 2 的查询值字符类排除 `\s & # " '`；规则 3 的值排除 `\s , ;`
  - 空串 → 空串；无命中 → 原文返回
  - 不修正任何正则边界（源码注释明确"不修正任何正则边界"，R:4）
- **证据**：R:8-17

## 十五、`splitFrontmatter`

- **签名**：`(content: string) => SplitFrontmatter`（`{ frontmatter: string, body: string }`）
- **参数**：`content` — 完整工件文件文本
- **返回**（I:95-115）：
  - 匹配定界正则 → `{ frontmatter: match[1] ?? "", body: content.slice(match[0].length) }`（frontmatter 不含 `---` 定界行；body 为闭合 `---` 之后的全部内容）
  - 不匹配 → `{ frontmatter: "", body: content }`
- **错误文本**：无；非字符串入参正则 `.exec` 抛原生 TypeError
- **副作用**：只读
- **边界**：
  - 空串 → `{ frontmatter: "", body: "" }`
  - 无开头 `---` / 无闭合 `---` → 整段当作 body，frontmatter 为空
  - CRLF：定界正则允许 `\r?\n`
  - 闭合 delimiter 后紧跟字符串结尾（无换行）也可匹配（`( ?:\r?\n|$)`）
  - 非贪婪 `([\s\S]*?)`：取第一处闭合 delimiter
- **证据**：I:95-115

## 十六、`umaSshUri`

- **签名**：`(target: UmaSshTarget) => string`
- **参数**：`target` — `{ user, host, port }`（通常来自 `parseUmaSshTarget`）
- **返回**：`ssh://${target.user}@${target.host.includes(":") ? \`[${target.host}]\` : target.host}:${target.port}`（S:55-57）
- **错误文本**：无自定义错误；`target` 为 `null`/缺字段时属性访问抛原生 TypeError
- **副作用**：只读，纯格式化
- **边界**：
  - host 含 `:`（IPv6）→ 自动包方括号 `[...]`；不含则原样
  - 不做任何校验/转义（与 `parseUmaSshTarget` 不同，此处信任入参）
  - port 直接插值（即便越界也原样输出）
- **证据**：S:50-57

---

## 十七、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `requiredArtifacts` / patch+任意、feature+两 phase、product+两 phase | 5 分支 + preview 缺席 |
| `evaluateArtifact` / 正常 frontmatter、缺 status、含 TODO/lorem、纯空 | status 三态、missingSections、placeholders 去重大写、ready |
| `splitFrontmatter` / 正常、CRLF、无闭合、空串 | 定界解析四分支 |
| `evaluateGate` / 全套齐、缺件、preview 不 ready | missing/blocked 差异、重复项 |
| `evaluateCheckpoint` / patch 恒 ready、feature 分段、非必需不阻塞 | 与 evaluateGate 差异 |
| `parseUmaSshTarget` / `ssh -p`、`ssh://`、IPv6、双端口、超长、非法域名、空 | undefined 各路径 + 默认 22 |
| `umaSshUri` / IPv6 带冒号、普通 host | 方括号包裹 |
| `redactDevelopmentText` / Bearer、query token、key=value、sk-、无命中 | 四条规则 + best-effort 声明 |
| `selectCodingStandards` / `ts`+`node`、空数组、`includeGeneral:false`、未知标签、`all` 优先级 | 别名归一、优先级、选择≠验证 |

---

## 十八、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字；无自定义错误者已如实标注"无"
- [ ] 没有出现"先 X 再 Y"这类实现描述
- [ ] 冻结契约单独列出；正则/别名/版本/limit 逐字，含 `&& ||` 优先级原样
- [ ] 三条已知行为已如实记录：preview 不在必需集、redact 为 best-effort、选择≠验证
- [ ] 边界覆盖空/超长/越权/不存在/非法值/CRLF/重复
- [ ] 找一名没看过 src 的人读一遍，能复述出至少 6 个导出的参数、错误、副作用、边界
