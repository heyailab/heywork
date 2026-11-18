# spec: dsh-client-ui-design-studio（UI 挂载契约 / P4 重写需求）

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
> 注：`lib/client.js` 实测约 98 万字符 / 1,021,072 字节（任务描述的 212K 字符与实际不符，以实测为准）；
> `lib/client.*.js` 实测 508 个（含 1 个 `client.OperationsViewers.js` 懒加载组件块，其余为主题数据）。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-ui-design-studio` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 插件 id（`name`，Host 端 cordis id） | `ui-design-studio` | [host] |
| `dsh.client.platform` | `web` | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| 运行依赖 | `@deepseek-ai/schemastery ~3.19.0` | [pkg] |
| 浏览器端命名空间 `NS` | `uiDesignStudio` | [bundle] `const NS=\`uiDesignStudio\`` |

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（15 个，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-api-workspace-controller`
2. `@deepseek-ai/dsh-api-workspace-files`
3. `@deepseek-ai/dsh-client-locale`
4. `@deepseek-ai/dsh-client-ui-layout`
5. `@deepseek-ai/dsh-client-ui-primitives`
6. `@deepseek-ai/dsh-client-ui-renderer`
7. `@deepseek-ai/dsh-client-ui-sidebar`
8. `@deepseek-ai/dsh-client-ui-workspace`
9. `@deepseek-ai/dsh-client-resources`
10. `@deepseek-ai/dsh-api-session-controller`
11. `@deepseek-ai/dsh-client-ui-session`
12. `@deepseek-ai/dsh-client-uma-remotes`
13. `@deepseek-ai/dsh-client-ui-conversation`
14. `@deepseek-ai/dsh-client-ui-sidebar-right`
15. `@deepseek-ai/dsh-client-ui-context-menu`

> 说明：以上是**包级组合依赖**（Host 组装时要注册到 composition 的 15 个包）。
> 与之不同，`lib/index.js` 的 Host 端 `inject = []`（[host]）；浏览器端 `apply()` 内部另有
> 11 项 ctx 服务 inject 数组（见 §4.1）。三者语义不同，不可互相替代。

### 1.3 exports 面 [pkg]

| 子路径 | 指向 |
|---|---|
| `.` | `./lib/index.js`（types: `./lib/types/index.d.ts`） |
| `./client` | `./lib/client.js`（types: `./lib/types/client/index.d.ts`） |
| `./locale/*.json` | `./locale/*.json` |
| `./package.json` | `./package.json` |

`files` 白名单：`locale/*.json`、`lib/index.js`、`lib/client.js`、`lib/client.*.js`、`NOTICE.md`、`lib/types/**/*.d.ts`。

---

## 二、Host 端行为（index.js，tsc 直出）

### 2.1 Config schema [host]

```
Config = z.object({ showInternalLibrary: z.boolean().default(false) })
```

| 字段 | 类型 | 默认值 | 语义 |
|---|---|---|---|
| `showInternalLibrary` | boolean | `false` | 源码注释：Raw reference documents are disabled in ordinary profiles（普通配置下禁用原始参考文档）。[host] |

> [推断] 该 Host 配置在浏览器端可能对应注入对象的 `showRawReference: false`（见 §5.2），
> 但 bundle 中未出现 `showInternalLibrary` 字符串，二者是否直接关联**静态不可见，需真机确认**。

### 2.2 `apply()`

- `function apply() {}` — **空实现，无 Host 副作用**（[host] 逐字： Client-owned presentation; no Host side effects）。
- 存在意义（[host] 注释原文，逐字保留）：
  "Pure UI plugin: the empty apply exists so the plugin appears in the host composition;
  the browser half ships via exports['./client'], discovered through the package.json dsh.client declaration."
- 结论：P4 重写时 Host 端按此直出源码还原即可；主体在浏览器端 `./client`。

### 2.3 Host 导出面 [host]

`export { Config, apply, inject, name };`

| 导出 | 值 / 形态 |
|---|---|
| `name` | `"ui-design-studio"` |
| `inject` | `[]`（空数组） |
| `Config` | 上述 schemastery schema |
| `apply` | 空函数 |

### 2.4 浏览器端 `apply(ctx, config = {})` [bundle]

浏览器半边是真正入口。`function apply(ctx,config={})` 开头：

- `const desktop = typeof document !== 'undefined' && document.documentElement.hasAttribute('data-platform')`
  → [推断] 通过 `data-platform` 属性判定桌面端；后续影响 `startSession` 的 `agentPreset`（见 §6）。
- 其余注册行为见 §4、§5、§6。**`config` 在 bundle 中的具体消费点静态不可见，需真机确认**（仅见 `config={}` 默认参数）。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `meta.title`（[locale] 逐字）

| 语 | 文件 | `meta.title` |
|---|---|---|
| 简体中文 | `zh.json` | `设计工作台` |
| 英文 | `en.json` | `Design Studio` |
| 日文 | `ja.json` | `デザインスタジオ` |
| 德文 | `de.json` | `Designstudio` |
| 俄文 | `ru.json` | `Студия дизайна` |
| 葡萄牙文 | `pt.json` | `Estúdio de design` |
| 法文 | `fr.json` | `Studio de design` |
| 西班牙文 | `es.json` | `Estudio de diseño` |

> 所有 locale 文件**仅含 `meta.title` 一个字段**，无其他键。

### 3.2 bundle 内嵌完整字典 [bundle]

- 注册：`ctx.locale.register(NS, {zh,en,ja,es,fr,de,ru,pt})`（effect 标签 `ui-design-studio: dictionaries`）；
  `const t = ctx.locale.bind(NS)`。
- 语言顺序（bundle 逐字）：`zh, en, ja, es, fr, de, ru, pt`。
- 规模：bundle 中 `t(\`...\`)` 文案键 **263 个**；正则 `/[\u4e00-\u9fa5]{2,20}/g` 提取到 **1462 个唯一中文片段**（1938 次出现，含日文汉字，故数量偏大）。
- 代表性文案键 [bundle]：`panel`、`operations.title`、`task.details`、`brief.*`（title/name/surface/tone/density/pages/audience/constraints/start/cancel…）、
  `delivery.*`（title/subtitle/pipeline/skills/gate/verificationTitle/startDesign/startTeam…）、`evidence.*`（title/runs/findings/repairs/command/stdout/stderr/…）。
- 代表性中文文案 [bundle 静态提取]：
  `设计系统`、`交付工作台`、`设计工作台`、`设计简报`、`定制设计简报`、`设计原型`、`组件预览`、`令牌`、`配色`、`字体`、`信息密度`、`交付流水线`、`交付文档`、`启动交付团队`、`开放会话/打开会话`、`项目资料`、`项目目标`、`项目会话`、`验收`、`添加验收项`、`编辑验收标准`、`工程记录`、`隔离任务`、`准备修复任务`、`检查记录`、`问题证据`、`修复记录`、`运行项目检查`、`预览宽度`、`场景指南`、`开发任务`。
- 说明：日文/其他语种字典同样内嵌在 bundle（如 `operations.fileType.file: \`Arquivo\`` 为葡文片段）。
  **逐语全量文案以 bundle 内嵌字典为准，locale/*.json 只提供标题。**

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字）

```
const inject = [
  'slots', 'locale', 'layout', 'uiWorkspace', 'remote',
  'remote.commands', 'remote.workspaceFiles', 'remote.codingWorkbench',
  'workspaces', 'resources', 'sessions'
];
```

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**18 个唯一**，逐项列出）

| # | 调用 | 出现次数 | 用途 [推断]，除标注外 |
|---|---|---|---|
| 1 | `ctx.effect` | 4 | 注册生命周期副作用（字典、资源协议、原生菜单订阅、右键菜单）[bundle+推断] |
| 2 | `ctx.locale.register` | 1 | 注册 `NS` 下 8 语字典 |
| 3 | `ctx.locale.bind` | 1 | 取 `t` 翻译函数 |
| 4 | `ctx.resources.register` | 2 | 注册 2 个虚拟资源协议（见 §6.2） |
| 5 | `ctx.slots.inject` | 5 | 向 slot 注入扩展（见 §5） |
| 6 | `ctx.slots.register` | 5 | 在 slot 中注册具体条目（见 §5） |
| 7 | `ctx.layout.selectPanel` | 1 | 原生菜单触发时切到 `uma-operations` 面板 |
| 8 | `ctx.uiWorkspace.currentWorkspace` | 2 | 作为 hook 传给 DesignStudioPage |
| 9 | `ctx.uiWorkspace.startSession` | 2 | 新建会话（web 端带 `agentPreset:'uma-design'`） |
| 10 | `ctx.uiWorkspace.openSession` | 5 | 打开已有会话（`whenDraftExists:'append'`） |
| 11 | `ctx.uiWorkspace.connectWorkspace` | 3 | 工作区 → 会话连接，拿 sessionId |
| 12 | `ctx.workspaces.list` | 13 | `getSnapshot().items` 解析工作区/校验存在 |
| 13 | `ctx.sessions.list` | 2 | `getSnapshot().byId` 校验会话有效性 |
| 14 | `ctx.remote.codingWorkbench.*` | 7 | 工程证据：`evidenceSnapshot` / `overview` / `cancelCheck` / `doctor`（方法名 [bundle]） |
| 15 | `ctx.remote.workspaceFiles.*` | 6 | 读交付文档/`.uma/*.md`/`.design` 预览：`list` / `read`（方法名 [bundle]） |
| 16 | `ctx.remote.commands` / `ctx.remote.session` / `ctx.remote.subagents` | 各 1 | 出现在 inject 数组并有点号调用，子方法静态不可见（需真机确认） |
| 17 | `ctx.logger.warn` | 2 | 验证/文档读取失败时告警："Could not read delivery verification." / "Could not read delivery documents." |
| 18 | `ctx.inject` | 1 | 子作用域注入 `['sidebarRight','sidebarRightTabs','contextMenus']` |

> 计数说明：`ctx.<word>` 唯一服务 11 个：`remote, workspaces, uiWorkspace, slots, effect, locale, logger, resources, sessions, inject, layout`。

### 4.3 子作用域 `scope.*` 调用（正则 `/\bscope\.(\w+)\.(\w+)/g` 提取，**8 个唯一**）

| 调用 | 用途 [推断] |
|---|---|
| `scope.contextMenus.register` | 注册 2 个右键菜单（见 §6.3） |
| `scope.sidebarRight.openResourceIn` | 在右侧栏打开资源 |
| `scope.sidebarRightTabs.register` | 注册右侧栏 tab |
| `scope.slots.inject` / `scope.slots.register` | 注入并注册右侧栏 tab、会话头菜单 |
| `scope.uiWorkspace.connectWorkspace` / `scope.uiWorkspace.openSession` | 子作用域内的会话操作 |
| `scope.workspaces.list` | 子作用域内的工作区快照 |

### 4.4 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 资源协议 | `uma-verification` | `ctx.resources.register` 注册的协议 |
| 资源协议 | `uma-delivery-artifacts` | `ctx.resources.register` 注册的协议 |
| URI scheme | `dsh-resource://` | `props.useResource('dsh-resource://uma-verification/…')` 等 |
| 任务详情 id | `uma-task-details`、`uma-project-task-details` | 右侧 tab / 会话头菜单 / 右键菜单 id |
| SSH 路径 | `/uma/operations/ssh`（`const SSH_PATH`） | 运维 SSH 入口 |
| 原生桥 | `window.umaOperations`（`vault`、`subscribeOpen`） | 原生菜单/凭据桥接 |
| agentPreset | `uma-design` | web 端 `startSession` 预设 |
| 懒加载块 | `./client.OperationsViewers.js` | `RemoteDesktop` / `RemoteTerminal` 来源 |

---

## 五、React 组件与面板挂载点

### 5.1 面板 ID 常量（[bundle] 逐字）

```
const PANEL_ID = 'design';
const DELIVERY_PANEL_ID = 'delivery';
const OPERATIONS_PANEL_ID = 'uma-operations';
```

### 5.2 挂载点映射（[bundle] 静态提取）

| slot | key/id | order | label 键 | 挂载组件 | 注入数据（[推断]，来自 inject 对象） |
|---|---|---|---|---|---|
| `main` | `design` | — | — | `DesignStudioPage` | `showRawReference:false`；`hooks.currentWorkspace`；`startSession`；`startFrontend`；`listDesignProjects`；`openSession` |
| `main` | `delivery` | — | — | `DeliveryPage` | `deliveryActions()`（含 `cancelProjectCheck` / `startProjectCheck` / `prepareTask` / `openDetails` 等） |
| `main` | `uma-operations` | — | — | `OperationsPage` | `vault`；`currentConnections`；`rememberConnection`；`forgetConnection`；`setAgentAccess`；`openAgentSession` |
| `sidebar.panellist` | `uma-operations` | 8 | `operations.title` | `OperationsIcon` | 侧栏图标 |
| `sidebar.panellist` | `design` | 7 | `panel` | `DesignStudioIcon` | 侧栏图标 |
| `sidebar.right.pane.tab` | `uma-task-details` | — | — | `TaskDetailsTab` | `sessionId → {…deliveryActions(sessionId), prepareTask, …}` |
| `conversation.session.header.menu` | `uma-task-details` | — | — | `TaskDetailsMenu` | `sessionId → { openDetails }` |

> 三个主面板均以 `ctx.slots.inject('main', () => ctx.slots.register({name:'main', key:<ID>, locale:NS, inject:…}, <Component>))` 形式挂载。
> **面板在 `main` slot 内的视觉顺序、默认激活面板静态不可见，需真机确认。**

### 5.3 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 60 个大写候选，其中：
- **真实 React 函数组件 21 个**（`function <Name>(` 定义）
- **懒加载组件 2 个**（`react.lazy` + `require.async('./client.OperationsViewers.js')`）
- 其余为 CSS module 导入（`*_module_css_default`）、常量/配置对象（`DESIGN_SYSTEMS`、`BRIEF_*`、`DELIVERY_STAGES`、`SSH_PATH` 等），非组件。

**函数组件（21）及职责 [推断]：**

| 组件 | 职责 [推断] |
|---|---|
| `DesignStudioPage` | 设计系统画廊 / 设计项目前端主页（搜索、kind/category 过滤、分页） |
| `DeliveryPage` | 交付流水线主页（filter/depth/phase 过滤，验收与交付文档） |
| `OperationsPage` | 运维主页（连接管理、SSH、文件浏览、检查） |
| `DesignBriefDialog` | 定制设计简报弹窗（name/surface/tone/density/pages/audience/constraints 字段） |
| `SkillDetailDialog` | 技能详情弹窗（含 `SKILL_WHEN_TO_USE`） |
| `AcceptanceEditor` | 验收标准编辑（goal + 验收项，带 revision） |
| `EngineeringEvidence` | 工程记录（runs/findings/repairs/tasks tab，分页） |
| `ProjectChecks` | 项目检查列表（运行/取消项目检查） |
| `WorkspaceTasks` | 工作区开发任务列表（query/page 过滤） |
| `TaskRow` | 单条任务行（状态/访问控制） |
| `TaskDocuments` | 任务文档（`dsh-resource://uma-delivery-artifacts/…`） |
| `TaskDetailsTab` | 右侧栏任务详情 tab |
| `TaskDetailsMenu` | 会话头菜单项（打开详情） |
| `TaskDetailsBody` | 任务详情正文（文档、刷新） |
| `RunDetails` | 单次检查运行详情（取消/修复按钮） |
| `ServerForm` | SSH 服务器连接表单（保存/信任/验证） |
| `OperationsFiles` | 运维文件浏览（路径输入、列表） |
| `OperationsInspection` | 运维检查结果（services/container 等 kind） |
| `PlainOutput` | 纯文本输出（截断至 `TEXT_LIMIT`） |
| `DesignStudioIcon` | 侧栏图标（`IconSparkleRegular`） |
| `OperationsIcon` | 侧栏图标（`IconSettingsOutlineRegular`） |

**懒加载组件（2）：** `RemoteDesktop`（`OperationsDesktop`）、`RemoteTerminal`（`OperationsTerminal`），均来自 `./client.OperationsViewers.js`。

### 5.4 主题数据文件（非组件）

`lib/client.<theme>.js` 实测 **508 个**（[pkg] `files` 含 `lib/client.*.js`）。
按品牌命名（如 `client.acer.js`、`client.razer.js`，11–16KB），为**设计主题数据**（设计系统画廊用），
不是组件源码；1 个例外 `client.OperationsViewers.js`（880KB）是懒加载组件块。这些主题数据可作为数据复用。
**单文件内主题 schema 的精确字段静态可见，但渲染时的具体视觉表现需真机确认。**

---

## 六、可观测副作用

### 6.1 注册 class

| 副作用 | 细节 | 来源 |
|---|---|---|
| 注册 8 语字典 | `ctx.locale.register('uiDesignStudio', {zh,en,ja,es,fr,de,ru,pt})`，effect 标签 `ui-design-studio: dictionaries` | [bundle] |
| 绑定翻译函数 | `const t = ctx.locale.bind('uiDesignStudio')` | [bundle] |
| 注册资源协议 ×2 | `uma-verification`、`uma-delivery-artifacts`，均带 `async *open(address,{signal})` | [bundle] |
| 注册 slot 条目 ×7 | `main`×3、`sidebar.panellist`×2、`sidebar.right.pane.tab`×1、`conversation.session.header.menu`×1 | [bundle] |
| 注册右键菜单 ×2 | `uma-project-task-details`（target `workspace`）、`uma-task-details`（target `session`），`order:440` | [bundle] |
| 原生菜单订阅 | `window.umaOperations.subscribeOpen` → `ctx.layout.selectPanel('uma-operations')`，effect 标签 `UMA Operations: native menu` | [bundle] |
| 子作用域注入 | `ctx.inject(['sidebarRight','sidebarRightTabs','contextMenus'], scope => …)` | [bundle] |

### 6.2 资源协议行为 [bundle+推断]

- `uma-verification`：`address` 形如 `dsh-resource://uma-verification/<workspaceId>?refresh=<n>`；
  解析 `new URL(address).pathname.slice(1)` → decodeURIComponent → 在 `workspaces.list` 中找 workspace；
  调 `ctx.remote.codingWorkbench.evidenceSnapshot({workspaceId}, signal)` 产出工程证据快照；
  失败时 `yield {ok:false,error: RemoteError}`，并 `ctx.logger.warn('Could not read delivery verification.', error)`。
- `uma-delivery-artifacts`：`dsh-resource://uma-delivery-artifacts/<workspaceId>?refresh=<n>`；
  调 `ctx.remote.workspaceFiles.list/read` 读 `.uma/<stage>.md`、`.design/*` 等交付文档；
  失败时 `ctx.logger.warn('Could not read delivery documents.', error)`。
- 两个协议都遵循 `signal.aborted` 中止语义（[bundle]）。

### 6.3 右键菜单行为 [bundle+推断]

- `uma-project-task-details`：`target:'workspace'`，`order:440`，`observe:[workspaces.list, locale]`；
  resolve 返回详情/打开资源等动作。
- `uma-task-details`：`target:'session'`，`order:440`，仅当 `workspaces.list` 中该 workspace 的 `sessionIds` 含目标 session 时出现。

### 6.4 会话 / 面板行为 [bundle+推断]

- `startSession(prompt, workspaceId)` → `ctx.uiWorkspace.startSession(workspaceId, {…(desktop ? {} : {agentPreset:'uma-design'}), prompt, whenDraftExists:'append'})`。
- `openSession(sessionId)` → `ctx.uiWorkspace.openSession(sessionId, {prompt, whenDraftExists:'append'})`。
- `connectWorkspace(workspaceId)` → 返回 sessionId，供交付/任务动作绑定。
- 原生菜单 `subscribeOpen` 触发 → 切换到 `uma-operations` 面板（`layout.selectPanel`）。
- `desktop` 由 `data-platform` 属性判定，决定 `agentPreset` 是否注入。

### 6.5 静态不可见项（需真机确认，不编造）

- 三个主面板在 `main` slot 内的排列顺序与默认激活态。
- 精确布局、尺寸、CSS、动画、图标资源细节。
- `remote.commands` / `remote.session` / `remote.subagents` 的具体子方法名与参数。
- `config` 在浏览器端的具体消费路径（仅见默认参数 `config = {}`）。
- 各主题数据文件的运行时渲染效果。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全，另含 §4.1 浏览器 inject、§4.4 冻结标识 |
| inject 是否 15 个全列 | ✅ package.json `dsh.client.inject` 15 项逐项列出（§1.2）；并区分 Host `inject=[]` 与浏览器 11 项 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出（§3.1） |
| 组件名是否来自 bundle 实数 | ✅ 21 个函数组件 + 2 个懒加载组件，均由正则从 `client.js` 提取并二次验证定义；未编造 |
| ctx 调用是否来自 bundle 实数 | ✅ `ctx.service.method` 18 个唯一、`scope.service.method` 8 个唯一，均由正则提取；出现次数为脚本统计 |
| 冻结内部标识逐字保留 | ✅ `uma-verification`、`uma-delivery-artifacts`、`dsh-resource://`、`uma-task-details`、`/uma/operations/ssh`、`window.umaOperations`、`uma-design`、`./client.OperationsViewers.js` |
| 静态不可见项标注 | ✅ 布局/CSS/默认值激活/部分 remote 子方法等均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：文件 340 行；从 bundle 静态提取组件 21（函数）+ 2（懒加载）= 23 个；
`ctx.*` 调用 18 个唯一服务方法、`scope.*` 8 个；浏览器端 inject 11 项、包级 inject 15 项；
`locale/*.json` 标题 8 语；bundle 内嵌 263 个 `t()` 键、1462 个唯一中文片段；
`client.<theme>.js` 508 个（含 1 个懒加载组件块）。
