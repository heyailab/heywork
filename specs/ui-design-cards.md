# spec: dsh-client-ui-uma-design（UI 挂载契约 / P4 重写需求）

> 这是**需求文档**，不是源码翻译。目标：`界面出现、挂在正确位置、调正确的服务、文案正确`，
> 不强求像素级还原。
> 证据来源与标注约定：
> - **[pkg]** = `package.json`（`dsh.client` 声明 / exports / deps）
> - **[host]** = `lib/index.js`（tsc 直出、可读、带注释）
> - **[locale]** = `locale/*.json`（未压缩文本）
> - **[bundle]** = 从 `lib/client.js` 压缩 bundle **静态提取**的稳定字符串
> - **[推断]** = 基于提取信号的行为推断，非 bundle 逐字事实，需真机确认
>
> 静态不可见的内容（精确布局、CSS、像素、交互时序）如实标注"静态不可见，需真机确认"，不编造。
> 注：`lib/client.js` 实测 **68,983 字节 / 64,091 字符 / 6 行**（行数按 `\n` 切分）。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-ui-uma-design` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 插件 id（`name`，Host 端 cordis id） | `ui-uma-design`（[推断] 由包命名与 [host] 注释推得；Host `index.js` 未导出 `name`） | [推断] |
| `dsh.client.platform` | `web` | [pkg] |
| `dsh.client.immediately` | 未声明（非立即加载） | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| devDependencies 关键项 | `dsh-client-locale` / `dsh-client-ui-conversation` / `dsh-client-ui-primitives` / `dsh-client-ui-renderer` / `dsh-client-ui-slots` / `dsh-client-ui-tool` / `dsh-client-ui-workspace` / `dsh-api-session-controller` / `dsh-session` / `dsh-util-values` | [pkg] |
| 浏览器端命名空间 `NS` | `ui-uma-design` | [bundle] `const NS=\`ui-uma-design\`` |

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（6 个，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-client-locale`
2. `@deepseek-ai/dsh-client-ui-renderer`
3. `@deepseek-ai/dsh-client-ui-tool`
4. `@deepseek-ai/dsh-client-ui-conversation`
5. `@deepseek-ai/dsh-client-ui-primitives`
6. `@deepseek-ai/dsh-client-ui-workspace`

> 说明：以上是**包级组合依赖**（Host 组装时要注册到 composition 的 6 个包）。
> 与之不同，浏览器端 `inject = [\`slots\`,\`locale\`,\`uiWorkspace\`,\`workspaces\`,\`uiConversation\`]`（5 项，见 §4.1）；
> **Host `index.js` 未导出 `inject`**（只导出 `apply`）。三者语义不同，不可互相替代。

### 1.3 exports 面 [pkg]

| 子路径 | 指向 |
|---|---|
| `.` | `./lib/index.js`（types: `./lib/types/index.d.ts`） |
| `./client` | `./lib/client.js`（types: `./lib/types/client/index.d.ts`） |
| `./locale/*.json` | `./locale/*.json` |
| `./package.json` | `./package.json` |

`files` 白名单：`locale/*.json`、`lib/index.js`、`lib/client.js`、`lib/types/**/*.d.ts`。

---

## 二、Host 端行为（index.js，tsc 直出）

### 2.1 Config schema

- **Host 端无 Config**：`lib/index.js` 仅 `function apply(){}` + `export { apply }`（[host] 逐字，全文 10 行）。
- 浏览器端亦未见 `Config` 导出（仅 `exports.apply` / `exports.inject`）。

### 2.2 `apply()`

- `function apply() {}` — **空实现，无 Host 副作用**（[host] 逐字注释原文，逐字保留）：
  > "Uma design-system cards, node half. Pure UI plugin: the empty apply exists
  > so the plugin appears in the host composition; the browser half ships via
  > exports[\"./client\"], discovered through the package.json dsh.client declaration."
- 另有逐字注释：`/** Host plugin body — no host-side behavior for this client presentation. */`。
- 结论：P4 重写时 Host 端按此直出源码还原即可；主体在浏览器端 `./client`。

### 2.3 Host 导出面 [host]

`export { apply };`

| 导出 | 值 / 形态 |
|---|---|
| `apply` | 空函数 |
| `Config` / `name` / `inject` | **均未从 Host 导出** |

### 2.4 浏览器端 `apply(ctx)` [bundle]

浏览器半边是真正入口。`function apply(ctx)` 逐字行为：

1. `registerResourceActivity(ctx)` — 注册会话资源活动事件与节点（见 §5、§6.1）。
2. `ctx.effect(()=>ctx.locale.register(NS,{zh,en,ja,es,fr,de,ru,pt}), 'ui-uma-design: dictionaries')` — 注册 8 语字典（见 §3.2）。
3. 向 `tool.call.toolview` 注册 **1 个有 UI 的卡**（`design_preview`）与 **4 个有 UI 的卡**（`uma_artifact_write` / `uma_gate_status` / `design_project_create` / `design_project_status`）。
4. 向 `tool.call.toolview` 注册 **8 个空占位**（返回 `()=>null`，见 §5.2）。
5. 浏览器端导出面 [bundle]：`exports.apply`、`exports.inject`。
6. `config` 参数未出现在 apply 签名中（`function apply(ctx)`）；**无 Host 配置面**。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `meta.title`（[locale] 逐字）

| 语 | 文件 | `meta.title` |
|---|---|---|
| 简体中文 | `zh.json` | `Uma 卡片` |
| 英文 | `en.json` | `Uma cards` |
| 日文 | `ja.json` | `Uma カード` |
| 德文 | `de.json` | `Uma-Karten` |
| 俄文 | `ru.json` | `Карточки Uma` |
| 葡萄牙文 | `pt.json` | `Cartões Uma` |
| 法文 | `fr.json` | `Cartes Uma` |
| 西班牙文 | `es.json` | `Tarjetas Uma` |

> 所有 locale 文件**仅含 `meta.title` 一个字段**，无其他键。

### 3.2 bundle 内嵌完整字典（[bundle]）

- 注册：`ctx.locale.register(NS, {zh,en,ja,es,fr,de,ru,pt})`，effect 标签 `ui-uma-design: dictionaries`；
  `const t = ctx.locale.bind(NS)`。
- 语言顺序（bundle 逐字）：`zh, en, ja, es, fr, de, ru, pt`。
- **8 语字典各 71 键**（实测：zh/en/ja/es/fr/de/ru/pt 均为 71），为真正逐语翻译，非空壳。
- 正则 `/\bt\(`([^`]+)`\)/g` 实测 **39 个唯一文案键**（含 2 个动态模板 `activity.${data.operation}`、`activity.${data.phase}`）。
- 正则 `/[\u4e00-\u9fa5]{2,20}/g` 实测 **157 个唯一中文片段 / 191 次出现**（含日文汉字，故数量偏大）。

**代表性文案键（[bundle] 逐字）：**

| 组 | 键（节选） |
|---|---|
| `activity.*` | `activity.design`、`activity.designReference`、`activity.referenceContent`、`activity.referenceDesign`、`activity.referenceTokens`、`activity.referenceComponents`、`activity.referencePartial`、`activity.knowledge`、`activity.wiki`、`activity.experience`、`activity.running`、`activity.completed`、`activity.failed`、`activity.operationLabel`、`activity.resultLabel`、`activity.startedLabel` |
| `preview.*` | `preview.loading`、`preview.title`、`preview.note`、`preview.source`、`preview.frontend`、`preview.unavailable`、`preview.handoffFailed`、`preview.handoffPrompt` |
| `card.*` | `card.listTitle`、`card.getTitle`、`card.preparing`、`card.failed`、`card.systems`、`card.noMatches`、`card.references`、`card.tokens`、`card.typography`、`card.open`、`card.empty`、`card.count` |
| `workflow.*` | `workflow.writeTitle`、`workflow.gateTitle`、`workflow.preparing`、`workflow.failed`、`workflow.ready`、`workflow.needsWork`、`workflow.missing`、`workflow.placeholders`、`workflow.open`、`workflow.missingArtifacts`、`workflow.blocked`、`workflow.allReady` |
| `project.*` | `project.createTitle`、`project.statusTitle`、`project.statusOneTitle`、`project.ready`、`project.incomplete`、`project.files`、`project.none`、`project.preparing`、`project.failed` |

**代表性中文文案（[bundle] 静态提取，节选）：**
`设计系统`、`设计参考`、`已读取`、`设计规范`、`设计变量`、`组件示例`、`部分内容达到读取上限`、
`知识库`、`项目 Wiki`、`开发经验库`、`查阅参考资料`、`检索相关资料`、`写入或更新资料`、
`核对项目设计方案`、`进行中`、`已完成`、`调用失败`、`已中断`、`操作`、`结果`、`开始时间`、
`正在执行操作`、`操作已完成`、`正在读取设计原型`、`设计原型快照`、`打开源文件`、
`继续前端开发`、`交付工件`、`交付门禁`、`已就绪`、`需要处理`、`缺失章节`、`占位符`、
`全部门禁通过`、`设计项目`、`契约完整`、`暂无设计项目`。

> `zh` 字典中 `preview.handoffPrompt` 为长文本模板，含 `{path}` / `{hash}` 插值；
> **逐语全量文案以 bundle 内嵌字典为准，`locale/*.json` 只提供标题。**

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字）

```
const inject = ['slots', 'locale', 'uiWorkspace', 'workspaces', 'uiConversation']
```

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**7 个唯一 / 19 次出现**）

| # | 调用 | 出现次数 | 用途 [推断]，除标注外 |
|---|---|---|---|
| 1 | `ctx.slots.inject` | 7 | 向 2 类 slot 注入扩展（`tool.call.toolview` ×6、`conversation.chat.node` ×1）[bundle] |
| 2 | `ctx.slots.register` | 7 | 7 次静态调用（其中 1 次在 8-key `for` 循环内），展开后共 14 条注册：13 个 toolview key + 1 个 chat.node key（见 §5.2）[bundle] |
| 3 | `ctx.locale.register` | 1 | 注册 NS 下 8 语字典 [bundle] |
| 4 | `ctx.locale.bind` | 1 | 在 `design_preview` 的 `inject` 内取翻译函数，组装 `preview.handoffPrompt` [bundle] |
| 5 | `ctx.uiConversation.events` | 1 | `ctx.uiConversation.events.register(resourceActivityDefinition)`（[bundle] 逐字，见 §6.1） |
| 6 | `ctx.workspaces.list` | 1 | `getSnapshot().items.find(item=>item.sessionIds.includes(sessionId))` 校验工作区归属 [bundle] |
| 7 | `ctx.uiWorkspace.openSession` | 1 | 前端接续：带 `whenDraftExists:'append'` 与 handoff prompt 打开会话 [bundle] |

> 裸 `ctx.<word>` 唯一服务 **6 个**：`effect`、`locale`、`slots`、`uiConversation`、`uiWorkspace`、`workspaces`。

### 4.3 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 浏览器 NS | `ui-uma-design` | 字典命名空间 |
| slot | `tool.call.toolview` | 工具卡片挂载位（共 13 个 key） |
| slot | `conversation.chat.node` | 会话节点挂载位（key `uma-resource-activity`） |
| 事件 kind | `uma-resource-activity` | `resourceActivityDefinition.kind`，target `chat` |
| 卡 key | `design_preview` | 设计原型快照卡（`data-tool` 同值） |
| 卡 key | `uma_artifact_write` / `uma_gate_status` / `design_project_create` / `design_project_status` | 交付/项目卡 |
| 空占位 key（8 个） | `design_asset_list`、`design_asset_get`、`uma_resource_read`、`uma_knowledge_search`、`design_rule_search`、`design_begin`、`uma_wiki_lookup`、`uma_workspace_search` | 注册 `()=>null`，抑制默认卡 |
| 预览元数据 kind | `uma-design-preview` | `readPreview` 校验的合法 kind |
| 预览元数据 version | `1` | `readPreview` 校验 |
| 预览路径正则 | `^\.design\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-zA-Z0-9][a-zA-Z0-9._-]*\.html$` | `readPreview` 校验 |
| SHA-256 正则 | `/^[a-f0-9]{64}$/u` | `readPreview` 校验摘要 |
| effect 标签 | `ui-uma-design: dictionaries` | 字典注册 |

---

## 五、React 组件与面板挂载点

### 5.1 挂载点（slot）清单（[bundle] 逐字）

- `tool.call.toolview` — 工具卡片位，注册 **13 个 key**（1 个 `design_preview` + 4 个业务卡 + 8 个空占位）。
- `conversation.chat.node` — 会话节点位，注册 **1 个 key**（`uma-resource-activity`）。

### 5.2 挂载点映射（[bundle] 静态提取）

| slot | key | locale | 挂载组件 / 行为 | 注入数据 [推断] |
|---|---|---|---|---|
| `tool.call.toolview` | `design_preview` | NS | `DesignPreviewCard` | `inject: sessionId => ({ applyFrontend(path,hash) })`，校验工作区归属后 `openSession` |
| `tool.call.toolview` | `uma_artifact_write` | NS | `UmaArtifactCard` | 默认 toolview 注入 |
| `tool.call.toolview` | `uma_gate_status` | NS | `UmaGateCard` | 默认 toolview 注入 |
| `tool.call.toolview` | `design_project_create` | NS | `DesignProjectCreateCard` | 默认 toolview 注入 |
| `tool.call.toolview` | `design_project_status` | NS | `DesignProjectStatusCard` | 默认 toolview 注入 |
| `tool.call.toolview` | `design_asset_list` 等 8 个 | NS | `()=>null`（空占位） | 无 |
| `conversation.chat.node` | `uma-resource-activity` | NS | `ResourceActivityCard` | `node` / `t` / `openFile` |

> 13 个 toolview key 中，`design_asset_list` 与 `design_asset_get` **在 bundle 中实际注册为
> `()=>null` 空占位**（[bundle] 实测）；卡片文案键 `card.*` 仍保留在字典中。
> 这两个工具名同时出现在 `resourceActivityDefinition` 的操作识别映射中（[bundle]），
> 即"活动回执可见、但 toolview 卡为空占位"，二者不矛盾。
> **卡片在会话中的排序、空占位是否完全遮蔽默认卡、折叠状态下的可见性静态不可见，需真机确认。**

### 5.3 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 **14 个唯一候选**，其中：

- **真实 React 函数组件 9 个**（`function <Name>(` 定义）
- 其余 5 个为 CSS module 对象（`DesignPreviewCard_module_css_default`、`ResourceActivity_module_css_default`、`WorkflowCards_module_css_default`）与函数内局部图标变量（`Icon`、`StatusIcon`，分别取 `IconLayersOutlineRegular`/`IconChecklistOutlineRegular`、`IconCheckOutlineRegular`/`IconWarningTriangleOutlineRegular`），非组件。

| 组件 | 职责 [推断] |
|---|---|
| `DesignPreviewCard` | 原型快照卡：校验 `uma-design-preview` 元数据 → 用 `createStaticHtmlDocument` 生成 `srcDoc` → `iframe sandbox='' referrerPolicy='no-referrer'` 渲染；含"打开源文件""继续前端开发"按钮与失败提示 |
| `ResourceActivityCard` | 资源活动回执卡：按 `node.data.resource`/`operation` 显示操作、时间、结果；`design` 显示色板 swatch，`delivery` 用 Workflow 图标 |
| `UmaArtifactCard` | 交付工件卡：解析 tool result 文本，展示路径、字节、状态（draft/approved）、缺失章节、占位符，含"打开工件" |
| `UmaGateCard` | 交付门禁卡：解析 ready/blocked/missing/artifacts，展示"全部门禁通过"/"阻断"等 |
| `DesignProjectCreateCard` | 设计项目创建卡：展示项目、系统、路径、文件列表 |
| `DesignProjectStatusCard` | 设计项目状态卡：展示项目列表、文件、契约完整度 |
| `CardHeader` | 卡片通用头：按 `ready` 切换 `IconCheckOutlineRegular` / `IconWarningTriangleOutlineRegular` |
| `FileList` | 文件列表：逐项按钮，`onClick` 调 `props.openFile(file.path)` |
| `Loading` | 准备态占位：`data-state='preparing'`，显示对应 `*.preparing` 文案 |

### 5.4 预览渲染约束（[bundle] 逐字）

- `readPreview(value)` 仅接受普通对象且 `kind==='uma-design-preview'`、`version===1`、`path` 匹配设计目录正则、`sha256` 为 64 位小写十六进制；否则返回 `null`。
- `phase!=='result'` → 显示 `preview.loading`；`preview===null` → `<p role='alert'>` 显示 `preview.unavailable`。
- `iframe`：`sandbox=''`、`referrerPolicy='no-referrer'`、`data-html-preview=true`、`title=t('preview.title')`。
- `applyFrontend(path,hash)` 仅当 `workspaces.list` 中存在包含该 `sessionId` 的 workspace 时返回 `true` 并 `openSession`；否则返回 `false` 并显示 `preview.handoffFailed`。

> 沙箱/网络策略的具体生效范围、iframe 尺寸静态不可见，需真机确认。

---

## 六、可观测副作用

### 6.1 注册 class（[bundle]）

| 副作用 | 细节 | 来源 |
|---|---|---|
| 注册会话事件定义 ×1 | `ctx.uiConversation.events.register(resourceActivityDefinition)`，kind `uma-resource-activity`，target `chat` | [bundle] |
| 注册 8 语字典 ×1 | `ctx.locale.register(NS,{zh,en,ja,es,fr,de,ru,pt})`，effect 标签 `ui-uma-design: dictionaries` | [bundle] |
| 绑定翻译函数 ×1 | `ctx.locale.bind(NS)`（在 `design_preview` 的 `inject` 中） | [bundle] |
| 注册 slot 条目 ×14 | `tool.call.toolview` ×13、`conversation.chat.node` ×1 | [bundle] |
| 运行时注入 CSS ×3 | 3 个 `client.js` 内嵌 CSS 字符串，按 `style[data-plugin-css="<tagId>"]` 去重后追加到 `document.head`（`data-plugin='@deepseek-ai/dsh-client-ui-uma-design'`） | [bundle] |

### 6.2 资源活动事件（[bundle] + [推断]）

- `match(event)`：
  - `tool/call` 且工具名/参数命中已注册操作 → `{id:String(event.data.callId), role:'start'}`。
  - `tool/result` → `{id:String(event.data.message.source.callId), role:'update'}`。
  - `user/message` 且 `data.source.kind==='experience-recall'` → `{id:'recall-'+event.seq, role:'start'}`。
- `start()`：产出 `{resource,operation,phase:'running',seq,time,startedAt}`；非 tool/call 或未知操作抛错（逐字：
  `Resource receipt requires a recorded call` / `Resource receipt requires a registered operation`）。
- `update()`：按 `isError`、`publicDesignReference(meta)`、tool result 文本推导 phase（running/completed/failed/interrupted）。
- 已注册操作映射（[bundle] 逐字工具名）含：`design_asset_list`、`design_asset_get`、`uma_artifact_write`、`uma_gate_status`、`design_project_create`、`design_project_status` 等；`artifactWrite` 正则逐字：
  `/^Wrote ([^\r\n]*?\.uma[\\/](?:research|prd|architecture|uiux|spec|preview|qa|delivery)\.md) \(\d+ bytes, (?:draft|approved)\)\.$/mu`。

### 6.3 前端接续行为（[bundle] 逐字 + [推断]）

`applyFrontend(path,hash)`：
1. `ctx.workspaces.list.getSnapshot().items.find(item=>item.sessionIds.includes(sessionId))` 不存在 → 返回 `false`。
2. 存在 → `ctx.uiWorkspace.openSession(sessionId, {whenDraftExists:'append', prompt: ctx.locale.bind(NS)('preview.handoffPrompt',{path,hash})})`，返回 `true`。
3. prompt 要求保留布局/交互/品牌与工作目录、读取 DESIGN.md/tokens.css、运行构建与测试并提供预览（[bundle] 内嵌长文案，逐字保留在字典中）。

### 6.4 静态不可见项（需真机确认，不编造）

- 各卡片在会话流中的视觉顺序、默认展开/折叠、动画。
- `card.*` 文案对应的卡片实际是否渲染（`design_asset_list`/`design_asset_get` 在当前 bundle 中为空占位）。
- `resourceActivityDefinition` 的完整 `update` 状态机分支与渲染细节。
- 3 个运行时 CSS 字符串的具体视觉规则（静态可见，但作用于哪些 DOM 需真机确认）。
- `iframe` 沙箱在真机上的脚本/网络行为与尺寸。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全；另含 §4.3 冻结标识、§5.4 预览约束 |
| inject 是否 6 个全列 | ✅ package.json `dsh.client.inject` 6 项逐项列出（§1.2）；并区分浏览器 5 项与 Host 未导出 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出（§3.1）；bundle 字典 8 语各 71 键（§3.2） |
| 组件名是否来自 bundle 实数 | ✅ 14 个候选由正则从 `client.js` 提取，二次验证得 9 个真实函数组件；未编造 |
| ctx 调用是否来自 bundle 实数 | ✅ `ctx.service.method` 7 个唯一 / 19 次出现，均由正则提取并标注出现次数 |
| 冻结内部标识逐字保留 | ✅ NS、2 个 slot 名、13 个卡 key、`uma-design-preview`、路径/SHA 正则、effect 标签逐字保留 |
| 静态不可见项标注 | ✅ 卡片排序/折叠、update 状态机、CSS 视觉、沙箱行为均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：文件 298 行；bundle 实测 68,983 字节 / 64,091 字符 / 6 行；
正则提取 `ctx.*` 7 个唯一（19 次）、组件候选 14 个（真实函数组件 9）、中文片段 157 个唯一（191 次出现）；
`t()` 文案键 39 个；浏览器 inject 5 项、包级 inject 6 项；8 语字典各 71 键；
toolview key 13 个（5 有 UI + 8 空占位）、chat.node key 1 个。
