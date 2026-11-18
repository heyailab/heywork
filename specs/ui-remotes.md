# spec: dsh-client-uma-remotes（UI 挂载契约 / P4 重写需求）

> 这是**需求文档**，不是源码翻译。目标：`界面出现、挂在正确位置、调正确的服务、文案正确`，
> 不强求像素级还原；本包**没有界面**，契约核心是"立即加载 + Remote 装配 + 生命周期"。
> 证据来源与标注约定：
> - **[pkg]** = `package.json`（`dsh.client` 声明 / exports / deps）
> - **[host]** = `lib/index.js`（tsc 直出、可读、带注释）
> - **[locale]** = `locale/*.json`（未压缩文本）
> - **[bundle]** = 从 `lib/client.js` 压缩 bundle **静态提取**的稳定字符串
> - **[加载语义]** = `dsh-client-modules/src/client/manifest.ts` 对 `immediately` 的契约定义
> - **[推断]** = 基于提取信号的行为推断，非 bundle 逐字事实，需真机确认
>
> 静态不可见的内容如实标注"静态不可见，需真机确认"，不编造。
> 注：`lib/client.js` 实测 **258,502 字节 / 258,490 字符 / 3 行**（行数按 `\n` 切分）。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-uma-remotes` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 插件 id（`name`，Host 端 cordis id） | `hey-remotes`（[推断] 由 [pkg] description 与装配角色推得；Host `index.js` 未导出 `name`） | [推断] |
| `dsh.client.platform` | `web` | [pkg] |
| **`dsh.client.immediately`** | **`true`** | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| devDependencies | `dsh-api-remotes`、`dsh-api-gateway`、`dsh-knowledge`、`dsh-coding-workbench`、`dsh-tool-repo-wiki` | [pkg] |
| bundle 模块 id | `@deepseek-ai/dsh-client-uma-remotes`（`window.__ModuleLoader__.load({id:…})`） | [bundle] |
| license | `UNLICENSED`（四包中唯一；其余为 MIT） | [pkg] |

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（**仅 1 个**，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-api-remotes`

> 这是四包中**最特殊的 inject 面**：只有 1 项，且是**浏览器端 Remote 服务本身**。
> 与之对应，浏览器端 `inject = [\`remote\`]`（1 项 ctx 服务，见 §4.1）。
> **Host `index.js` 未导出 `inject`**。三者语义不同，不可互相替代。

### 1.3 `immediately: true` 的"立即加载"语义（重点）

[加载语义]（`dsh-client-modules/src/client/manifest.ts:44-68,125-132`）：

- `immediately` 是 **stage-one prefetch mark（第一阶段预取标记）**：
  逐字定义 —— `Stage-one prefetch mark: load the script for factory registration during module-face boot.`
- `inject` 是**包行依赖边**：逐字 —— `inject names package rows whose factories must arrive before this row materializes`，
  且 `Cordis separately uses the same package edges to compose entries`（插件组合另由 Cordis 负责）。
- `BootPluginRow.immediately` 逐字 —— `Stage-one prefetch tier (false when the wire omits it).`
- 校验：`dsh.client.immediately must be a boolean`（非布尔值报错）。

**因此本包的"立即加载"必须这样理解（不夸大、不缩水）：**

| 含义 | 说明 |
|---|---|
| ✅ 会立即发生 | 在 module-face boot 阶段，**预先加载本包脚本以完成 factory 注册**；属于 stage-one 预取层 |
| ✅ 依赖顺序 | `dsh-api-remotes`（inject 边）的 factory 必须先到达，本行才能 materialize [加载语义] |
| ❌ 不等价于 | "立即创建 Host 服务" —— [host] 逐字：`the Host services are provided by hey-base`；本包不创建 Host 服务 |
| ❌ 不等价于 | "立即挂载 Remote" —— 挂载是 `apply(ctx)` 执行时的行为（§6.1），由 Cordis 插件生命周期决定；`immediately` 只管脚本/工厂到达 |
| ⚠️ 静态不可见 | 与同批 `immediately` 包（`dsh-api-remotes`、`dsh-api-gateway`、`dsh-client-locale`、`dsh-client-ui-theme` 等）的实际启动批次/网络时序需真机确认 |

> [推断] 之所以需要 `immediately`：HEY 页面的 knowledge/coding/Wiki 行为依赖这三个 Remote 命名空间在页面早期可用，
> 若延迟到按需加载，首个调用会落在未装配状态。该动机未在 bundle 中逐字出现，需真机确认。

### 1.4 exports 面 [pkg]

| 子路径 | 指向 |
|---|---|
| `.` | `./lib/index.js`（types: `./lib/types/index.d.ts`） |
| `./client` | `./lib/client.js`（types: `./lib/types/client/index.d.ts`） |
| `./package.json` | `./package.json` |
| `./locale/*.json` | `./locale/*.json` |

`files` 白名单：`locale/*.json`、`lib/index.js`、`lib/client.js`、`lib/types/**/*.d.ts`。

---

## 二、Host 端行为（index.js，tsc 直出）

### 2.1 Config schema

- **Host 端无 Config**：`lib/index.js` 仅 `function apply(){}` + `export { apply }`（[host] 逐字，全文 6 行）。
- 浏览器端亦无 `Config`（仅 `exports.apply` / `exports.inject`）。

### 2.2 `apply()`

- `function apply() {}` — **空实现，无 Host 副作用**（[host] 逐字注释原文，逐字保留）：
  > `/** Host entry for the HEY browser Remote assembly; the Host services are provided by hey-base. */`
  > `/** Expose the browser plugin without duplicating Host services. */`
- 结论：P4 重写时 Host 端按此直出源码还原即可；**主体是浏览器端 Remote 装配，不是 UI**。

### 2.3 Host 导出面 [host]

`export { apply };`

| 导出 | 值 / 形态 |
|---|---|
| `apply` | 空函数 |
| `Config` / `name` / `inject` | **均未从 Host 导出** |

### 2.4 浏览器端 `async apply(ctx)` [bundle]

浏览器半边是真正入口。`async function apply(ctx)` 逐字行为：

```
async function apply(ctx) {
  const disposers = []
  try {
    for (const contribution of [TYPERT_REMOTE$2, TYPERT_REMOTE$1, TYPERT_REMOTE])
      disposers.push(await ctx.remote.$mount(contribution))
  } catch (error) {
    const errors = await release(disposers)
    if (errors.length > 0) throw new AggregateError([error, ...errors], `HEY Remote activation and cleanup failed`)
    throw error
  }
  return async () => {
    const errors = await release(disposers)
    if (errors.length > 0) throw new AggregateError(errors, `HEY Remote cleanup failed`)
  }
}
```

- `release(disposers)` 逐字行为：`for (const dispose of disposers.splice(0).reverse()) try { await dispose() } catch(error) { errors.push(error) }`
  → **逆序释放、单个失败不中断、聚合错误**。
- 浏览器端导出面 [bundle]：`exports.apply`、`exports.inject`。
- **无 `ctx.effect`、无 `ctx.locale.register`、无 `ctx.slots.*`**（见 §4.2）。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `meta.title`（[locale] 逐字）

| 语 | 文件 | `meta.title` |
|---|---|---|
| 简体中文 | `zh.json` | `HEY 客户端服务` |
| 英文 | `en.json` | `HEY client services` |
| 日文 | `ja.json` | `HEY クライアントサービス` |
| 德文 | `de.json` | `HEY-Clientdienste` |
| 俄文 | `ru.json` | `Клиентские службы HEY` |
| 葡萄牙文 | `pt.json` | `Serviços do cliente HEY` |
| 法文 | `fr.json` | `Services client HEY` |
| 西班牙文 | `es.json` | `Servicios del cliente HEY` |

> 所有 locale 文件**仅含 `meta.title` 一个字段**，无其他键。

### 3.2 bundle 内嵌文案实测（[bundle]）

- **bundle 中没有字典注册**（无 `ctx.locale.register`、无 `locale.bind`、无 `NS` 常量）。
- 正则 `/[\u4e00-\u9fa5]{2,20}/g` 实测 **0 个中文片段** —— 与其余三个 UI 包不同，本包没有可提取的中文界面文案。
- bundle 中可见的英文字符串均为 Remote 元数据（`description` / `sourceLocation.file` 等）与错误信息，
  例如 `HEY Remote activation and cleanup failed`、`HEY Remote cleanup failed`、`account stream ended`（后者属于其他包）。
- **结论：本包 locale 仅 `meta.title` 一处可见标题；所有方法描述来自生成的 Remote 定义，非 UI 文案。**

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字）

```
const inject = ['remote']
```

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**0 个匹配**）

| 检查 | 结果 |
|---|---|
| `ctx.service.method` 正则 | **0 个唯一、0 次出现**（四包中唯一为 0） |
| 裸 `ctx.<word>` | **1 个**：`remote` |
| 实际调用 | `ctx.remote.$mount(contribution)` ×1（在 for 循环中调用 3 次，静态出现 1 次）；`$` 开头故未被二段正则匹配 |
| `ctx.effect` / `ctx.locale.register` / `ctx.slots.*` | **均未出现** |
| `scope.*` | 无（无 `ctx.inject` 子作用域） |

> **这是本包与其余三包的根本差异**：它不是 UI 插件，而是 Remote 装配插件。
> 唯一的服务交互是 `ctx.remote.$mount`。

### 4.3 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 浏览器 inject | `remote` | 唯一 ctx 服务 |
| 挂载 API | `ctx.remote.$mount` | 装配 Remote 贡献，返回 disposer |
| 错误文本 | `HEY Remote activation and cleanup failed` | 激活失败且清理也失败时的 `AggregateError` message |
| 错误文本 | `HEY Remote cleanup failed` | 卸载时清理失败的 `AggregateError` message |
| 贡献常量 | `TYPERT_REMOTE$2`、`TYPERT_REMOTE$1`、`TYPERT_REMOTE` | 三个 `createTypertRemoteInfo(...)` 产物，按此顺序挂载 |
| typert 运行时类 | `RemoteInfo`、`NamedInput`、`ResultValue` | 由 `createTypertRemoteInfo` 构造元数据/输入编解码 |

---

## 五、React 组件与面板挂载点

### 5.1 面板挂载点：**无**

- 正则 `/\bctx\.slots\./` 在 bundle 中 **0 次出现**；无 `ctx.slots.inject` / `ctx.slots.register`。
- 无 `main` / `sidebar.*` / `conversation.*` 面板或 slot 注册。
- **本包不产生任何可见 UI，不占用任何挂载点。**

### 5.2 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 **4 个唯一候选**：
`NamedInput`、`RemoteInfo`、`ResultValue`、`TYPERT_REMOTE`（出现 3 次）。

- **真实 React 函数组件：0 个**。
- 4 个候选全部是 typert Remote 元数据基础设施：
  - `RemoteInfo` — `class`，`spec` / `zod` 索引，`get package` / `get descriptors` / `get methods` / `resolve()`。
  - `NamedInput` — `class`，按 `parameters` 构造 strict/loose zod 对象与 `jsonSchema`。
  - `ResultValue` — `class`，包装 result schema 的 `mode` / `typeSymbol` / `create` / `decode`。
  - `TYPERT_REMOTE`（含 `$1`、`$2`）— `createTypertRemoteInfo({package, methods})` 的常量结果。
- 另有辅助函数 `createTypertRemoteInfo`、`optional`、`release`、`isNullable` 等，均非组件。

> **这是本包与其余三包的另一根本差异**：§5 在本包是"空"的，需求是"装配正确、可卸载"，不是"组件出现"。

### 5.3 三个 Remote 贡献（[bundle] 静态提取）

| 常量 | package | service | 方法数 | 方法名（逐字） |
|---|---|---|---|---|
| `TYPERT_REMOTE$2` | `@deepseek-ai/dsh-knowledge` | `knowledge` | **25** | `knowledge/archiveBase`、`knowledge/catalog`、`knowledge/createBase`、`knowledge/createNoteIfAbsent`、`knowledge/createTeam`、`knowledge/deleteExperience`、`knowledge/detail`、`knowledge/document`、`knowledge/experienceCapture`、`knowledge/experienceHistory`、`knowledge/importLocal`、`knowledge/listExperiences`、`knowledge/note`、`knowledge/original`、`knowledge/restoreRevision`、`knowledge/retryDocument`、`knowledge/saveExperience`、`knowledge/search`、`knowledge/setExperienceCapture`、`knowledge/syncSource`、`knowledge/transitionExperience`、`knowledge/updateBase`、`knowledge/updateDocument`、`knowledge/upload`、`knowledge/watchSource` |
| `TYPERT_REMOTE$1` | `@deepseek-ai/dsh-coding-workbench` | `codingWorkbench` | **27** | `codingWorkbench/addFinding`、`codingWorkbench/assess`、`codingWorkbench/cancelCheck`、`codingWorkbench/cancelRepair`、`codingWorkbench/changes`、`codingWorkbench/commitTask`、`codingWorkbench/context`、`codingWorkbench/createTask`、`codingWorkbench/diff`、`codingWorkbench/doctor`、`codingWorkbench/evidenceSnapshot`、`codingWorkbench/experienceSearch`、`codingWorkbench/exportEvidence`、`codingWorkbench/impact`、`codingWorkbench/inspectTask`、`codingWorkbench/mergeTask`、`codingWorkbench/overview`、`codingWorkbench/planChecks`、`codingWorkbench/qualityReport`、`codingWorkbench/removeTask`、`codingWorkbench/restoreFile`、`codingWorkbench/restoreTask`、`codingWorkbench/saveSpec`、`codingWorkbench/startCheck`、`codingWorkbench/startRepair`、`codingWorkbench/sweep`、`codingWorkbench/updateFinding` |
| `TYPERT_REMOTE` | `@deepseek-ai/dsh-tool-repo-wiki` | `projectWiki` | **5** | `projectWiki/catalog`、`projectWiki/observe`、`projectWiki/readOwned`、`projectWiki/readSource`、`projectWiki/summary` |

**合计 57 个端点**（25 + 27 + 5），全部 `invocation.kind==='direct'`，全部带 `cancellation.parameter==='signal'`（[bundle] 实测每个端点 1 处 cancellation 字段，共 57）。

> 各端点的 `parameters` / `result` JSON Schema 与 `sourceLocation` 均在 bundle 内嵌（如 repo-wiki 的
> `packages/skill/tool-repo-wiki/src/workspace.ts`），属于生成元数据；**逐方法 schema 全量内容静态可见但篇幅巨大，
> 本文只列方法名与计数，未逐字段抄写**。

---

## 六、可观测副作用

### 6.1 注册 class（[bundle]）

| 副作用 | 细节 | 来源 |
|---|---|---|
| 挂载 Remote 贡献 ×3 | 按 `TYPERT_REMOTE$2` → `TYPERT_REMOTE$1` → `TYPERT_REMOTE` 顺序 `await ctx.remote.$mount(contribution)` | [bundle] |
| 返回 disposer ×1 | `apply` 返回 `async()=>release(disposers)`，供 Cordis 卸载时调用 | [bundle] |
| 字典注册 | **无** | [bundle] |
| slot 注册 | **无** | [bundle] |
| 组件渲染 | **无** | [bundle] |

### 6.2 激活失败回滚（[bundle] 逐字）

- 第 n 个 `$mount` 抛错时：
  1. `release(disposers)` 对**已成功挂载的前 n-1 个**贡献逆序 dispose（正在失败的贡献不进入 disposers）。
  2. 若清理也出错 → `throw new AggregateError([error, ...errors], 'HEY Remote activation and cleanup failed')`。
  3. 否则 `throw error`（原错误透传）。
- 语义：**要么三个命名空间全部可用，要么已挂载的都被撤回**，不留半装配状态。

### 6.3 卸载行为（[bundle] 逐字 + [推断]）

- 卸载钩子：`await release(disposers)` —— 逆序、逐项 `await dispose()`、单项失败继续、最后聚合成
  `AggregateError(errors, 'HEY Remote cleanup failed')`。
- [推断] 重新激活可再次 `$mount` 同一批命名空间（disposer 由本次 `apply` 持有，不共享全局状态）。
- [host] 逐字边界：`the Host services are provided by hey-base` —— 本包**不提供、不复制** Host 服务。

### 6.4 可见性边界（[推断]，需真机确认）

- 页面**不会因本包直接出现新按钮/面板/文案**；其效果体现在 knowledge/coding-workbench/project-wiki 页面调用 Remote 时可用。
- `immediately:true` 使脚本在 stage-one 预取，但**实际首个调用是否命中已装配状态**取决于启动批次与其他 `immediately` 包的顺序（[加载语义]，需真机确认）。
- `$mount` 是否触发网络请求、是否产生可见 loading 态：**bundle 中无相关代码，静态不可见，需真机确认**。

### 6.5 静态不可见项（需真机确认，不编造）

- `immediately` 在本包与 `dsh-api-remotes` / `dsh-api-gateway` / `dsh-client-locale` 等之间的实际启动批次顺序。
- `$mount` 内部行为（由 `dsh-api-remotes` 提供，不在本 bundle 中）。
- 各 Remote 方法被调用时的网络/鉴权/取消表现（归属 Host 能力与 gateway）。
- 57 个端点逐字段 schema 在生成侧的源码位置与校验细节（bundle 内嵌，未在本文逐条展开）。
- 本包插件 id 是否为 `hey-remotes`（[host] 未导出 `name`，[推断] 值）。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全；§3.2、§4.2、§5.1 如实记录"无字典/无 ctx.X.Y/无组件"，并给出实测依据 |
| inject 是否全列 | ✅ package.json `dsh.client.inject` **仅 1 项**已逐项列出（§1.2）；并区分浏览器 `remote` 与 Host 未导出 |
| `immediately` 语义是否写清 | ✅ §1.3 逐字区分"stage-one 预取/工厂注册"与"创建 Host 服务/挂载 Remote"，标注 [加载语义] 出处 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出（§3.1）；§3.2 明确 bundle 中文为 0、无字典注册 |
| 组件名是否来自 bundle 实数 | ✅ 4 个候选由正则提取，二次验证为 0 个 React 组件、全部 typert 基础设施；未编造 |
| ctx 调用是否来自 bundle 实数 | ✅ 二段正则实测 0 个，裸 `ctx.*` 仅 `remote`；`ctx.remote.$mount` 单列说明，未虚报 |
| 冻结内部标识逐字保留 | ✅ `$mount`、两条 `AggregateError` 文本、3 个贡献常量名、3 个 package/service、57 个端点名逐字保留 |
| 静态不可见项标注 | ✅ 启动批次、`$mount` 内部、首个调用可见性、插件 id 推断均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：文件 293 行；bundle 实测 258,502 字节 / 258,490 字符 / 3 行；
正则提取 `ctx.service.method` **0 个**、裸 `ctx.<word>` 1 个（`remote`）、组件候选 4 个、
其中 React 组件 **0 个**、中文片段 **0 个**；
浏览器 inject 1 项、包级 inject **1 项**、`immediately:true` 1 处；
Remote 贡献 3 个（knowledge 25 / codingWorkbench 27 / projectWiki 5 = **57 个端点**）；
`locale/*.json` 标题 8 语。
