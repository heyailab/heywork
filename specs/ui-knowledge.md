# spec: dsh-client-ui-knowledge（UI 挂载契约 / P4 重写需求）

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
> 注：`lib/client.js` 实测 **170,921 字符 / 181,620 字节**；本包**没有** `lib/client.<theme>.js`（实测 0 个），
> 与 design-studio 的 508 个主题数据文件不同。上述数字以实测为准。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-ui-knowledge` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 描述 | `Desktop knowledge collections, local source import, retrieval testing and development integration` | [pkg] |
| `private` / `type` | `true` / `module` | [pkg] |
| `dsh.client.platform` | `web` | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| 运行依赖 | `@deepseek-ai/schemastery ~3.19.0` | [pkg] |
| 浏览器端命名空间 `NS` | `knowledge` | [bundle] `const NS=\`knowledge\`` |
| 主面板 id `PANEL_ID` | `knowledge` | [bundle] `const PANEL_ID=\`knowledge\`` |
| Host 端插件 id（`name`） | **Host `index.js` 未导出 `name`**（实测仅 `export { Config, apply }`，见 §2.3）；浏览器端身份以 `NS`/`PANEL_ID` 的 `knowledge` 为准 | [host]+[bundle] |

> 说明：本包 Host 端 `inject` 与 `name` **均未导出**（[host] 逐字），与 `ui-design-studio` 的
> `export { Config, apply, inject, name }` 不同。此处逐字记录当前形态，不擅自补齐。

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（9 个，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-api-workspace-files`
2. `@deepseek-ai/dsh-api-session-controller`
3. `@deepseek-ai/dsh-client-locale`
4. `@deepseek-ai/dsh-client-ui-layout`
5. `@deepseek-ai/dsh-client-ui-primitives`
6. `@deepseek-ai/dsh-client-ui-renderer`
7. `@deepseek-ai/dsh-client-ui-sidebar`
8. `@deepseek-ai/dsh-client-ui-workspace`
9. `@deepseek-ai/dsh-client-uma-remotes`

> 以上是**包级组合依赖**（Host 组装时注册到 composition 的 9 个包）。
> 与之不同，浏览器端 `apply()` 内部另有 6 项 ctx 服务 inject 数组（见 §4.1）。二者语义不同，不可互相替代。

### 1.3 exports 面 [pkg]

| 子路径 | 指向 |
|---|---|
| `.` | `./lib/index.js`（types: `./lib/types/index.d.ts`） |
| `./client` | `./lib/client.js`（types: `./lib/types/client/index.d.ts`） |
| `./locale/*.json` | `./locale/*.json` |
| `./package.json` | `./package.json` |

`files` 白名单：`locale/*.json`、`lib/index.js`、`lib/client.js`、`lib/types/**/*.d.ts`。
浏览器 bundle 末尾导出面 [bundle]：`exports.PANEL_ID`、`exports.apply`、`exports.inject`（**无 `Config`**）。

---

## 二、Host 端行为（index.js，tsc 直出）

### 2.1 Config schema [host]

```
Config = z.object({
  showBuiltinStandards: z.boolean().default(false),
  refreshMs: z.number().min(1e3).step(1).default(2e3)
})
```

| 字段 | 类型 | 默认值 | 约束 | 语义 |
|---|---|---|---|---|
| `showBuiltinStandards` | boolean | `false` | — | 是否展示内置技术规范/内置资料 [host+bundle] |
| `refreshMs` | number | `2000`（`2e3`） | `min(1000)`、`step(1)` | 浏览器端资料轮询间隔（毫秒）[host+bundle] |

引导键常量 [host]：`KNOWLEDGE_UI_CONFIG_GLOBAL = "__UMA_KNOWLEDGE_UI__"`。

> 浏览器 bundle 内**重复定义同一 schema**（[bundle] `const Config=Schema.object({showBuiltinStandards:Schema.boolean().default(false),refreshMs:Schema.number().min(1e3).step(1).default(2e3)})`），
> 与 Host 端逐字一致；浏览器从全局引导键取回配置后再次用该 schema 校验（见 §2.4）。

### 2.2 `apply(ctx, config)` — **非空实现，有 Host 副作用** [host]

- [host] 逐字行为：
  ```
  ctx.on("webserver/index-inject", (table) => {
    table.push({ kind: "global", name: KNOWLEDGE_UI_CONFIG_GLOBAL, value: config });
  });
  ```
- 效果：在 `webserver/index-inject` 事件上注册回调，向注入表 push 一条 `kind:"global"` 记录，
  `name` 为 `__UMA_KNOWLEDGE_UI__`，`value` 为经 `Config` 校验后的配置对象。
- 语义（[host] 注释原文，逐字保留）：
  "Publish the knowledge-library options before browser plugins activate."
  "Validate Host options and their public browser payload."
- 这是浏览器端能读到配置的唯一桥梁；**与 design-studio 的空 `apply()` 不同**，不能按空实现重写。

### 2.3 Host 导出面 [host]

`export { Config, apply };`

| 导出 | 值 / 形态 |
|---|---|
| `Config` | 上述 schemastery schema |
| `apply` | `apply(ctx, config)`，向 `webserver/index-inject` 注入全局配置 |

> 实测**没有** `name`、`inject` 导出。

### 2.4 浏览器端 `apply(ctx, config)` [bundle]

真正入口。`function apply(ctx)` 开头：

- `const config = Config(globalThis[\`__UMA_KNOWLEDGE_UI__\`] ?? {})`
  → [bundle] 从全局引导键读取并用 `Config` 二次校验；缺省为空对象（走 schema 默认值）。
- `ctx.effect(() => ctx.locale.register(NS, {en,zh,ja,de,es,fr,pt,ru}), \`knowledge: dictionaries\`)`
- `const t = ctx.locale.bind(NS)`
- 构造 `injected` 注入对象（见 §5.2）。
- `ctx.effect(() => async () => { lifetime.abort(); … }, \`knowledge: owned requests\`)`：生命周期清理。
- 4 组 `ctx.slots.inject` / `ctx.slots.register`（见 §5）。
- **精确消费时序静态不可见，需真机确认**（bundle 为压缩单行代码）。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `meta.title` / `meta.description`（[locale] 逐字）

| 语 | 文件 | `meta.title` | `meta.description` |
|---|---|---|---|
| 简体中文 | `zh.json` | `知识库` | `管理本机团队和项目资料、来源及检索。` |
| 英文 | `en.json` | `Knowledge base` | `Manage local team and project materials, sources and retrieval.` |
| 日文 | `ja.json` | `ナレッジベース` | `ローカルのチーム資料、プロジェクト資料、情報源、検索を管理します。` |
| 德文 | `de.json` | `Wissensdatenbank` | `Verwaltet lokale Team- und Projektunterlagen, Quellen und Suchvorgänge.` |
| 俄文 | `ru.json` | `База знаний` | `Управляет локальными материалами команд и проектов, источниками и поиском.` |
| 葡萄牙文 | `pt.json` | `Base de conhecimento` | `Gerencia materiais locais de equipes e projetos, suas fontes e pesquisas.` |
| 法文 | `fr.json` | `Base de connaissances` | `Gère les documents locaux des équipes et projets, leurs sources et leurs recherches.` |
| 西班牙文 | `es.json` | `Base de conocimiento` | `Gestiona los documentos locales de equipos y proyectos, sus fuentes y búsquedas.` |

> 每个文件含 `meta.title` 与 `meta.description` 两个字段（**比 design-studio 多一个 description**），无其他键。

### 3.2 bundle 内嵌完整字典 [bundle]

- 注册：`ctx.locale.register(NS, {en,zh,ja,de,es,fr,pt,ru})`，effect 标签 `knowledge: dictionaries`；
  `const t = ctx.locale.bind(NS)`。
- 语言顺序（bundle 逐字）：`en, zh, ja, de, es, fr, pt, ru`。
- 规模：`t(\`...\`)` 文案键 **157 个唯一**（216 次出现）；
  正则 `/[\u4e00-\u9fa5]{2,20}/g` 提取到 **609 个唯一中文片段**（644 次出现）。
  > 注意：其中相当一部分中文来自**内置技术规范/工程规范数据正文**（如"交互可用键盘完成""事务围绕一致性需求设计"等），
  > 并非 UI 文案；UI 文案以 `t()` 键及其字典值为准。
- 代表性 `t()` 键 [bundle]：
  `panel`、`subtitle`、`all`、`team`、`project`、`newBase`、`refresh`、`search`、`ask`、`askWorkspace`、
  `bindBeforeAsk`、`bindWorkspaces`、`catalog`、`detail`、`chunks`、`sources`、`fulltext`、`hybrid`、
  `embeddingsMissing`、`noHits`、`noSources`、`noWorkspaces`、`experience*`（New/Search/Title/Name/State/
  Refresh/Save/Capture/History/Review/Withdraw/Export…）、`homeNavigation`、`homeLibrary`、`homeWiki`、`note*`。
- 代表性中文文案 [bundle 静态提取，zh 字典]：
  `UMA 知识库`、`让团队经验与项目资料，真正参与每一次开发。`、`知识中心`、`资料库`、`项目 Wiki`、
  `全部知识库`、`团队知识库`、`项目知识库`、`新建知识库`、`刷新`、`检索测试`、`保存修改`、
  `当前环境尚未配置向量模型，可直接使用本地全文检索。`
- 说明：8 语字典全部内嵌在 bundle（en/zh 字典已静态取到，如 `panel:\`Knowledge base\``、`panel:\`UMA 知识库\``）。
  **逐语全量文案以 bundle 内嵌字典为准，`locale/*.json` 只提供标题与描述。**

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字，6 项）

```
const inject = ['slots', 'locale', 'remote', 'remote.knowledge', 'uiWorkspace', 'workspaces'];
```

> 注意：数组含 `workspaces`，但 bundle 中 `workspaces` 的用法是随 `injected` 传入子组件的 prop
> （如 `BaseEditor({t,base,catalog,workspaces})`），**未出现 `ctx.workspaces.*` 点号调用**（[bundle] 实测）。
> 该 inject 项是否另有用途，静态不可见，需真机确认。

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**8 个唯一**，逐项列出）

| # | 调用 | 出现次数 | 用途 [推断]，除标注外 |
|---|---|---|---|
| 1 | `ctx.remote.knowledge` | 27 | 知识库领域服务调用（25 个不同方法，见 §4.3）[bundle] |
| 2 | `ctx.slots.inject` | 4 | 向 4 个 slot 注入扩展（见 §5）[bundle] |
| 3 | `ctx.slots.register` | 4 | 在上述 slot 中注册具体条目 [bundle] |
| 4 | `ctx.locale.register` | 1 | 注册 `NS` 下 8 语字典 [bundle] |
| 5 | `ctx.locale.bind` | 1 | 取 `t` 翻译函数 [bundle] |
| 6 | `ctx.slots.entriesOfSlot` | 1 | 探测 `main.knowledge.wiki` 是否已有条目 → `wikiAvailable` [bundle] |
| 7 | `ctx.slots.subscribe` | 1 | 订阅 `main.knowledge.wiki` 变化 → `updateView` [bundle] |
| 8 | `ctx.uiWorkspace.startSession` | 1 | "在会话中提问"：`agentPreset:\`standard\``、`whenDraftExists:\`append\`` [bundle] |

> 计数说明：`ctx.<word>` 唯一服务 **5 个**：`remote, slots, effect, locale, uiWorkspace`；
> 另有 `ctx.effect` 2 次（effect 标签见 §4.4）。`scope.*` 正则提取为 **0 个**（本包无子作用域注入）。

### 4.3 `ctx.remote.knowledge.*` 方法清单（[bundle] 静态提取，25 个唯一 / 27 次调用）

`catalog`(2)、`importLocal`(2)、`detail`、`createTeam`、`createBase`、`updateBase`、`archiveBase`、
`upload`、`note`、`createNoteIfAbsent`、`syncSource`、`watchSource`、`updateDocument`、`retryDocument`、
`document`、`restoreRevision`、`original`、`search`、`experienceHistory`、`experienceCapture`、
`setExperienceCapture`、`listExperiences`、`saveExperience`、`transitionExperience`、`deleteExperience`。

> 语义归类 [推断]：目录/详情 (`catalog`/`detail`/`document`/`original`)、本地来源导入与同步
> (`importLocal`/`syncSource`/`watchSource`/`upload`)、知识库与团队 CRUD (`createBase`/`updateBase`/
> `archiveBase`/`createTeam`)、笔记与修订 (`note`/`createNoteIfAbsent`/`updateDocument`/
> `retryDocument`/`restoreRevision`)、检索 (`search`)、开发经验 (`experience*`)。
> **各方法的精确参数/返回结构静态不可见，需真机确认。**

### 4.4 `ctx.effect` 注册（effect 标签 [bundle] 逐字）

| effect 标签 | 用途 |
|---|---|
| `knowledge: dictionaries` | 注册 8 语字典 |
| `knowledge: owned requests` | 生命周期清理（abort 所有 `run()` 发起的 owned 请求） |

### 4.5 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 命名空间 / 面板 id | `knowledge`（`NS` / `PANEL_ID`） | locale 命名空间、主面板 key、侧栏 id |
| 全局引导键 | `__UMA_KNOWLEDGE_UI__`（`KNOWLEDGE_UI_CONFIG_GLOBAL`） | Host 注入、浏览器读取配置 |
| 主 slot | `main` | 主面板容器 |
| 子 slot | `main.knowledge.library`、`main.knowledge.wiki`、`main.knowledge.experience` | 主面板内三栏 [bundle] |
| 侧栏 slot | `sidebar.panellist` | 侧栏图标，`order:5` |
| 跨包契约 | `main.knowledge.wiki` | **本包仅探测/订阅，不注册；实际条目由 `dsh-client-ui-repo-wiki` 注册**（见 §6.4） |
| agentPreset | `standard` | `ask` 动作 `startSession` 预设 |
| 提问 prompt 前缀 | `UMA_KNOWLEDGE_BASE:${base}\n\n${question}\n\nUse the associated knowledge as evidence.` | 会话注入知识上下文 |
| 原生桥全局 | `__DSH_DIRECTORY_PICKER__`、`__DSH_HOST_PATHS__` | `canPickFolder` / `canFollowFiles` 能力探测 |

---

## 五、React 组件与面板挂载点

### 5.1 面板 ID 常量（[bundle] 逐字）

```
const PANEL_ID = 'knowledge';
const NS = 'knowledge';
```

### 5.2 挂载点映射（[bundle] 静态提取）

| slot | key/id | order | label 键 | 挂载组件 | 注入数据（[推断]，来自 `injected`） |
|---|---|---|---|---|---|
| `main` | `knowledge` | — | — | `KnowledgeHome` | `hooks:{...knowledgeUi, wikiAvailable}`、`updateView`、`wikiAvailable`（`entriesOfSlot('main.knowledge.wiki').length>0`）、`subscribe` |
| `main.knowledge.library` | — | — | — | `KnowledgePage` | `injected` 全量（`showBuiltinStandards`、`refreshMs`、`catalog`、`detail`、CRUD 动作、`canPickFolder`、`canFollowFiles`…） |
| `main.knowledge.experience` | — | — | — | `ExperiencePage` | `{catalog, history, capture, list, save, transition, delete…}`（经验/开发体验子面板） |
| `sidebar.panellist` | `knowledge` | `5` | `panel` | `KnowledgeIcon` | 侧栏图标（`IconDeliverDocRegular`） |

> `main` 注册的 `children` 逐字包含三个子槽：
> `{"main.knowledge.library":{kind:"single",scope:"root"},"main.knowledge.wiki":{kind:"single",scope:"root"},"main.knowledge.experience":{kind:"single",scope:"root"}}`。
> **`main.knowledge.wiki` 由 repo-wiki 包注册，本包只负责预留槽位与可用性探测。**
> **子槽在 `main` 内的视觉顺序、默认激活项静态不可见，需真机确认。**

### 5.3 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 **28 个大写候选**，其中：

- **真实 React 函数组件 10 个**（`function <Name>(` 定义）
- 其余为常量/配置对象、错误类、CSS module 导入，非组件。

**函数组件（10）及职责 [推断]：**

| 组件 | 职责 [推断] |
|---|---|
| `KnowledgeHome` | 知识库主页/导航容器（含内置规范开关、三子槽切换） |
| `KnowledgePage` | 资料库主页（知识库列表/团队/项目分类、检索测试） |
| `ExperiencePage` | 开发经验库主页（搜索、筛选、审阅/导出） |
| `BuiltinStandardsDialog` | 内置技术规范/内置资料弹窗（`showBuiltinStandards===true` 时渲染） |
| `CollectionExperiences` | 经验集合/条目集合展示 |
| `ExperienceEditor` | 经验条目编辑（名称/原因/方案/技术/适用/排除） |
| `ExperienceHistory` | 经验修订历史（分页 `offset/limit:20`） |
| `BaseEditor` | 知识库基础信息编辑（名称、团队、工作区绑定） |
| `ReferenceLink` | 来源/参考链接展示 |
| `KnowledgeIcon` | 侧栏图标（`IconDeliverDocRegular`） |

> 其余候选：`Config`、`Schema`、`ACCEPT`、`ALIASES`、`PANEL_ID`、`KNOWLEDGE_UI_CONFIG_GLOBAL`、
> `BUILTIN_CODING_GUIDES`、`CODING_STANDARD_RULES`、`CODING_STANDARD_SOURCES`、
> `ENGINEERING_GUIDES`、`ENGINEERING_RULES`、`ENGINEERING_SOURCES`（常量/数据）；
> `KnowledgeUiError`、`ValidationError`（错误类）；
> `BuiltinStandardsDialog_module_css_default`、`ExperiencePage_module_css_default`、
> `KnowledgeHome_module_css_default`、`KnowledgePage_module_css_default`（CSS module）。
> **无懒加载组件**（本包无 `client.<theme>.js` / `require.async` 组件块）。

### 5.4 轮询与能力探测 [bundle+推断]

- `props.refreshMs` 驱动 `setInterval`：`setRefresh(value => value+1)`；依赖数组 `[props.refreshMs]`；
  清理时 `clearInterval` 并 abort 正在进行的搜索控制器。
  → [推断] 资料列表按 `refreshMs` 周期性刷新。
- `canPickFolder = bridges().__DSH_DIRECTORY_PICKER__ !== undefined`、
  `canFollowFiles = bridges().__DSH_HOST_PATHS__ !== undefined`。
- `showBuiltinStandards===true` 时渲染内置规范弹窗/提示（`data-knowledge:true` 容器）。
- **轮询的目标数据源与 UI 刷新范围静态不可见，需真机确认。**

---

## 六、可观测副作用

### 6.1 注册清单

| 副作用 | 细节 | 来源 |
|---|---|---|
| 注册 8 语字典 | `ctx.locale.register('knowledge', {en,zh,ja,de,es,fr,pt,ru})`，effect 标签 `knowledge: dictionaries` | [bundle] |
| 绑定翻译函数 | `const t = ctx.locale.bind('knowledge')` | [bundle] |
| 注册 slot 条目 ×4 | `main`×1、`main.knowledge.library`×1、`main.knowledge.experience`×1、`sidebar.panellist`×1 | [bundle] |
| 注册请求生命周期清理 | `ctx.effect(..., 'knowledge: owned requests')`，abort `lifetime` 并清空 `operations` | [bundle] |
| slot 可用性探测 | `ctx.slots.entriesOfSlot('main.knowledge.wiki')` + `ctx.slots.subscribe('main.knowledge.wiki', listener)` | [bundle] |
| Host 全局注入 | `webserver/index-inject` push `{kind:'global', name:'__UMA_KNOWLEDGE_UI__', value:config}` | [host] |

### 6.2 会话 / 提问行为 [bundle+推断]

- `ask(workspace, base, question)` → `ctx.uiWorkspace.startSession(workspace, {
  agentPreset:\`standard\`, whenDraftExists:\`append\`, prompt:\`UMA_KNOWLEDGE_BASE:${base}\n\n${question}\n\nUse the associated knowledge as evidence. Cite the actual d…\` })`
  → [推断] 将所选知识库作为证据上下文注入新会话。完整 prompt 尾部静态截断，需真机确认。
- `run(signal, action)` 统一处理 `AbortSignal`：`lifetime.signal.throwIfAborted()` + `signal.throwIfAborted()`，
  请求登记到 `operations` Set，清理时逐个 delete。

### 6.3 跨包挂载契约 [bundle+推断]

- 本包在 `main` 的 `children` 中预留 `main.knowledge.wiki` 子槽；
  通过 `entriesOfSlot` 判断 wiki 是否可用（`wikiAvailable`），并 `subscribe` 其变化以触发 `updateView`。
- 实际 Wiki 界面由 `dsh-client-ui-repo-wiki` 向该子槽注册 `WikiPageView`（见另一份 spec）。
- **两包的注册顺序、子槽首次出现时机静态不可见，需真机确认。**

### 6.4 静态不可见项（需真机确认，不编造）

- 三子槽在 `main` 内的排列顺序、默认激活项、精确布局/CSS/图标资源细节。
- `remote.knowledge.*` 各方法的参数与返回结构。
- `refreshMs` 轮询实际触发的数据请求与 UI 刷新范围。
- `workspaces` inject 项的实际消费点（bundle 中仅作为 prop 传递）。
- `config` 除 `showBuiltinStandards`/`refreshMs` 外的消费路径（实测仅此两项）。
- 内置规范数据的完整条目与渲染效果。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全，另含 §4.1 浏览器 inject、§4.5 冻结标识 |
| inject 是否全列 | ✅ package.json `dsh.client.inject` 9 项逐项列出（§1.2）；浏览器 `inject` 6 项（§4.1）；并说明 Host 无 `inject` 导出 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出 title + description（§3.1） |
| 组件名是否来自 bundle 实数 | ✅ 10 个函数组件均由正则从 `client.js` 提取并二次验证；28 个候选中其余明确归类为常量/错误类/CSS module |
| ctx 调用是否来自 bundle 实数 | ✅ `ctx.service.method` 8 个唯一、`remote.knowledge` 25 个方法、`ctx.<word>` 5 个服务，均由正则提取；次数为脚本统计 |
| 冻结内部标识逐字保留 | ✅ `knowledge`、`__UMA_KNOWLEDGE_UI__`、`main.knowledge.library/wiki/experience`、`standard`、`UMA_KNOWLEDGE_BASE:`、`__DSH_DIRECTORY_PICKER__`、`__DSH_HOST_PATHS__` |
| 静态不可见项标注 | ✅ 布局/子槽顺序/remote 参数/轮询范围/跨包时序等均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：从 bundle 静态提取组件 10（函数，无懒加载）；
`ctx.service.method` 8 个唯一、`remote.knowledge` 25 个方法、`ctx.<word>` 5 个服务；
`ctx.effect` 2 个（effect 标签 2）；浏览器端 inject 6 项、包级 inject 9 项；
`locale/*.json` 8 语（含 title+description）；bundle 内嵌 157 个唯一 `t()` 键（216 次）、
609 个唯一中文片段（644 次）；`lib/client.js` 实测 170,921 字符 / 181,620 字节；
`lib/client.<theme>.js` 实测 0 个。
