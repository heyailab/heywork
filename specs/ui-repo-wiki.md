# spec: dsh-client-ui-repo-wiki（UI 挂载契约 / P4 重写需求）

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
> 注：`lib/client.js` 实测 **117,927 字符 / 120,242 字节**；另有懒加载依赖块
> `lib/client.mermaid.min.js` 实测 **3,556,101 字节**（Mermaid 图表库）。上述数字以实测为准。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-ui-repo-wiki` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 描述 | `Project Wiki browser, generation controls, source citations and knowledge cards` | [pkg] |
| `private` / `type` | `true` / `module` | [pkg] |
| `dsh.client.platform` | `web` | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| 运行依赖 | `@deepseek-ai/schemastery ~3.19.0` | [pkg] |
| 浏览器端命名空间 `NS` | `repoWiki` | [bundle] `NS=\`repoWiki\`` |
| 挂载子槽 | `main.knowledge.wiki`（**无独立 `PANEL_ID` 常量**） | [bundle] |
| Host 端插件 id（`name`） | **Host `index.js` 未导出 `name`**（实测仅 `export { Config, apply }`，见 §2.3） | [host] |
| 关键 devDeps | `mermaid 11.17.2`、`@noble/hashes 2.4.0`、`dsh-util-repo-wiki`、`dsh-tool-repo-wiki`、`dsh-util-crypto`、`dsh-client-ui-knowledge`、`dsh-api-remotes` | [pkg] |

> 说明：本包 Host 端 `inject` 与 `name` **均未导出**（[host] 逐字），逐字记录当前形态，不擅自补齐。

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（10 个，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-api-workspace-files`
2. `@deepseek-ai/dsh-api-session-controller`
3. `@deepseek-ai/dsh-client-locale`
4. `@deepseek-ai/dsh-client-ui-layout`
5. `@deepseek-ai/dsh-client-ui-primitives`
6. `@deepseek-ai/dsh-client-ui-renderer`
7. `@deepseek-ai/dsh-client-ui-sidebar`
8. `@deepseek-ai/dsh-client-ui-workspace`
9. `@deepseek-ai/dsh-client-ui-knowledge`
10. `@deepseek-ai/dsh-client-uma-remotes`

> 以上是**包级组合依赖**（Host 组装时注册到 composition 的 10 个包）。
> 与之不同，浏览器端 `apply(ctx, config)` 内部另有 9 项 ctx 服务 inject 数组（见 §4.1）。二者语义不同，不可互相替代。
> 第 9 项 `@deepseek-ai/dsh-client-ui-knowledge` 是**跨包硬依赖**：Wiki 挂载到 knowledge 预留的 `main.knowledge.wiki` 子槽（见 §5）。

### 1.3 exports 面 [pkg]

| 子路径 | 指向 |
|---|---|
| `.` | `./lib/index.js`（types: `./lib/types/index.d.ts`） |
| `./client` | `./lib/client.js`（types: `./lib/types/client/index.d.ts`） |
| `./locale/*.json` | `./locale/*.json` |
| `./package.json` | `./package.json` |

`files` 白名单：`locale/*.json`、`lib/index.js`、`lib/client.js`、`lib/client.*.js`、`lib/types/**/*.d.ts`
（其中 `lib/client.*.js` 覆盖 `lib/client.mermaid.min.js`）。
浏览器 bundle 末尾导出面 [bundle]：`exports.Config`、`exports.apply`、`exports.inject`。

---

## 二、Host 端行为（index.js，tsc 直出）

### 2.1 Config schema [host]

```
Config = z.object({
  autoGenerateOnOpen: z.boolean().default(false),
  autoUpdateDefault: z.boolean().default(true),
  generationRefreshMs: z.number().step(1).min(1e3).default(3e3),
  autoUpdateIntervalMs: z.number().step(1).min(1e4).default(3e4),
  autoUpdateDebounceMs: z.number().step(1).min(100).default(1500)
})
```

| 字段 | 类型 | 默认值 | 约束 | 语义 |
|---|---|---|---|---|
| `autoGenerateOnOpen` | boolean | `false` | — | 打开时是否自动生成 Wiki [host+bundle] |
| `autoUpdateDefault` | boolean | `true` | — | 自动更新默认是否开启（受本机偏好开关约束）[host+bundle] |
| `generationRefreshMs` | number | `3000`（`3e3`） | `step(1)`, `min(1000)` | 生成状态轮询间隔（毫秒）[host+bundle] |
| `autoUpdateIntervalMs` | number | `30000`（`3e4`） | `step(1)`, `min(10000)` | 源码变化监督轮询间隔（毫秒）[host+bundle] |
| `autoUpdateDebounceMs` | number | `1500` | `step(1)`, `min(100)` | 自动更新防抖时长（毫秒）[host+bundle] |

> 浏览器 bundle 内**重复定义同一 schema**（[bundle] `const Config=Schema.object({…})`），与 Host 端逐字一致。

### 2.2 `apply()` — **空实现，无 Host 副作用** [host]

- `function apply() {}` — [host] 逐字注释："Mount the browser-owned Wiki feature without adding Host services."
- 另有模块注释："Repository Wiki browser plugin; Node entry has no Host effects."
- 结论：P4 重写时 Host 端按此直出源码还原即可；主体在浏览器端 `./client`。
  **与 knowledge 包不同**（该包 Host `apply` 会注入全局配置），本包配置不通过 Host `webserver` 注入。

### 2.3 Host 导出面 [host]

`export { Config, apply };`

| 导出 | 值 / 形态 |
|---|---|
| `Config` | 上述 5 字段 schemastery schema |
| `apply` | 空函数 |

> 实测**没有** `name`、`inject` 导出。

### 2.4 浏览器端 `apply(ctx, config)` [bundle]

真正入口。`function apply(ctx, config)` 开头：

- `ctx.effect(() => ctx.locale.register(NS, {en,zh,ja,es,fr,de,ru,pt}), \`repo-wiki: dictionaries\`)`
- `const automaticPreferenceKey = \`umaStudio.repoWiki.autoUpdate.v1\``
  → 本机自动更新偏好存储键；`readAutoConsent()` 从 `localStorage` 读取并按 `wikiAutoUpdatePreferencesSchema` 解析，
  失败时 `preferences.valid=false` 且 `console.warn(\`Repository Wiki automatic-update preferences could not be read; automatic generation is disabled.\`, error)`。
- `ctx.effect(..., \`repo-wiki: local automatic-generation consent\`)`：监听 `storage` 事件同步偏好变化。
- 构造自动更新控制器：`{ autoGenerateOnOpen, defaultUpdate: config.autoUpdateDefault, observe, exists, running, … }`。
- 构造 `injected` 注入对象（见 §5.4），挂载 `main.knowledge.wiki` 子槽。
- 启动源码变化监督定时器（见 §6.2）与 `repo-wiki: operation supervision` 清理 effect。
- **配置的精确消费时序静态不可见，需真机确认**（bundle 为压缩单行代码）。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `name` / `description`（[locale] 逐字）

| 语 | 文件 | `name` | `description` |
|---|---|---|---|
| 简体中文 | `zh.json` | `项目 Wiki` | `源码分析、文档生成、增量更新与项目知识检索。` |
| 英文 | `en.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |
| 日文 | `ja.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |
| 德文 | `de.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |
| 俄文 | `ru.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |
| 葡萄牙文 | `pt.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |
| 法文 | `fr.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |
| 西班牙文 | `es.json` | `Project Wiki` | `Source-backed repository documentation, incremental updates, and project knowledge retrieval.` |

> 实测：本包 locale 顶层键为 `name` / `description`（**不是 `meta.title`**）；
> 且**仅 `zh.json` 为中文，其余 7 个文件均为英文原文**（逐字记录，不擅自本地化）。

### 3.2 bundle 内嵌完整字典 [bundle]

- 注册：`ctx.locale.register(NS, {en,zh,ja,es,fr,de,ru,pt})`，effect 标签 `repo-wiki: dictionaries`；
  字典内语言顺序（bundle 逐字）：`en, zh, ja, es, fr, de, ru, pt`。
- 规模：`t(\`...\`)` 文案键 **101 个唯一**（135 次出现）；
  正则 `/[\u4e00-\u9fa5]{2,20}/g` 提取到 **156 个唯一中文片段**（166 次出现）。
- 代表性 `t()` 键 [bundle]：
  `title`、`subtitle`、`wikiOverview`、`repositories`、`selectedRepository`、`articleCount`、
  `articleTitle`、`cardCount`、`cards`、`generationStatus`、`generationHelp`、`progress`、`generate`、
  `goGenerate`、`generated`、`ready`、`idle`、`unavailable`、`update`、`updatedAt`、`dirty`、`branch`、
  `sourceTitle`、`sourceLines`、`sourceCoverage`、`sourcePreviewChanged`、`sourceFailed`、`sources`、`citation`、
  `diagram`、`diagrams`、`diagramFailed`、`grid`、`list`、`search`、`searchRepos`、`ask`、`openWiki`、
  `openTask`、`pause`、`resume`、`retry`、`regenerate`、`confirmRegenerate`、`export`、`import`、`language`、
  `autoUpdate`、`autoUpdateHelp`、`autoChecking`、`autoGenerating`、`autoCurrent`、`autoDisabled`、
  `autoEmpty`、`autoFailed`、`autoNeedsGeneration`、`autoPaused`、`settings`、`settingsHint`。
- 代表性中文文案 [bundle 静态提取，zh 字典]：
  `项目 Wiki`、`为已导入的本地工作区生成可追溯、可更新的项目知识库。`、`生成状态`、`{count} 篇文档`、
  `{count} 张知识卡片`、`正在生成`、`生成进度`、`生成设置`、`生成设置会在下一次生成或更新时保存`、
  `自动更新已关闭。`、`正在识别当前工作区…`、`正在自动生成或增量更新项目知识…`、
  `已识别本地工作区，点击生成即可建立首个 Wiki。`、`生成已暂停，可继续保留的任务。`、
  `已与当前源码保持一致`、`文档目录`、`知识卡片`、`图示预览失败`、`检索项目知识`、`源码引用`。
- 说明：8 语字典全部内嵌在 bundle（en/zh 字典已静态取到，如 `generationStatus:\`Generation status\``、
  `generationStatus:\`生成状态\``、`documentCount:\`{count} 篇文档\``）。
  **`locale/*.json` 只提供名称/描述，逐语全量 UI 文案以 bundle 内嵌字典为准。**

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字，9 项）

```
const inject = ['slots', 'locale', 'uiWorkspace', 'sessions', 'workspaces', 'remote', 'remote.session', 'remote.workspaceFiles', 'remote.projectWiki'];
```

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**12 个唯一**，逐项列出）

| # | 调用 | 出现次数 | 用途 [推断]，除标注外 |
|---|---|---|---|
| 1 | `ctx.sessions.list` | 5 | 会话快照/存在性校验（结合工作区 `sessionIds`）[bundle] |
| 2 | `ctx.remote.projectWiki` | 4 | Wiki 领域服务（4 个方法，见 §4.3）[bundle] |
| 3 | `ctx.workspaces.list` | 4 | 工作区快照 `getSnapshot().items`（生成/监督遍历）[bundle] |
| 4 | `ctx.remote.session` | 2 | 模型目录 `modelCatalog` / 取消 `cancel` [bundle] |
| 5 | `ctx.locale.register` | 1 | 注册 `NS` 下 8 语字典 [bundle] |
| 6 | `ctx.sessions.create` | 1 | 生成任务建会话：`agentPreset:\`repo-wiki\`` [bundle] |
| 7 | `ctx.sessions.using` | 1 | 占用会话并 prompt：`source:\`repoWiki\`` [bundle] |
| 8 | `ctx.uiWorkspace.currentWorkspace` | 1 | 当前工作区 hook 传给 WikiPageView [bundle] |
| 9 | `ctx.uiWorkspace.openSession` | 1 | 打开生成任务会话（`openTask`）[bundle] |
| 10 | `ctx.uiWorkspace.startSession` | 1 | 围绕本页提问 / 编辑 Wiki 页 [bundle] |
| 11 | `ctx.slots.inject` | 1 | 向 `main.knowledge.wiki` 注入扩展 [bundle] |
| 12 | `ctx.slots.register` | 1 | 注册 `WikiPageView` 到该子槽 [bundle] |

> 计数说明：`ctx.<word>` 唯一服务 **7 个**：`remote, sessions, slots, effect, locale, uiWorkspace, workspaces`；
> 另有 `ctx.effect` 3 次（effect 标签见 §4.4）。`scope.*` 正则提取为 **0 个**（本包无子作用域注入）。

### 4.3 领域子方法清单（[bundle] 静态提取）

| 服务 | 方法（唯一数） | 用途 [推断] |
|---|---|---|
| `ctx.remote.projectWiki`（4） | `readOwned`、`summary`、`observe`、`readSource` | 读 Wiki 项目/摘要/观察状态/读源码片段 |
| `ctx.remote.session`（2） | `modelCatalog`、`cancel` | 模型目录 / 取消生成任务 |
| `ctx.sessions`（3） | `list`、`create`、`using` | 会话列表 / 建会话 / 占用并 prompt |
| `ctx.uiWorkspace`（3） | `currentWorkspace`、`openSession`、`startSession` | 当前工作区 / 打开任务 / 提问与编辑 |
| `ctx.workspaces`（1） | `list` | 工作区快照 |

> `remote.projectWiki.readSummary` / `readManifest` / `readArticle` / `generate` 以 `injected` 内函数形式
> 暴露给组件（见 §5.4），其内部调用链静态不可见，需真机确认。

### 4.4 `ctx.effect` 注册（effect 标签 [bundle] 逐字）

| effect 标签 | 用途 |
|---|---|
| `repo-wiki: dictionaries` | 注册 8 语字典 |
| `repo-wiki: local automatic-generation consent` | 监听本机自动更新偏好（`storage` 事件）变化 |
| `repo-wiki: operation supervision` | 生命周期清理：`clearInterval` + `clearTimeout` + `stopTurnWatch` |

### 4.5 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 命名空间 | `repoWiki`（`NS`） | locale 命名空间 |
| 挂载子槽 | `main.knowledge.wiki` | knowledge 预留子槽，本包注册 `WikiPageView` |
| 本机偏好键 | `umaStudio.repoWiki.autoUpdate.v1`（`automaticPreferenceKey`） | `localStorage` 自动更新开关 |
| 偏好 schema | `wikiAutoUpdatePreferencesSchema` | 解析本机偏好 |
| Wiki 根目录 | `.uma/wiki`（`WIKI_ROOT`） | 文档与知识卡片存放路径 [推断] |
| Wiki 语言 | `['zh','en']`（`WIKI_LANGUAGES`） | 生成/更新的语言版本 |
| 容量上限 | `MAX_WIKI_PAGES=1000`、`MAX_WIKI_CARDS=3000`、`MAX_DIAGRAM_CHARACTERS` | 页面/卡片/图示字符上限 |
| agentPreset | `repo-wiki` | `sessions.create` 生成任务预设 |
| 会话占用来源 | `repoWiki`（`sessions.using({source:'repoWiki'})`） | 生成任务会话标记 |
| 懒加载块 | `./client.mermaid.min.js` | `require.async` 加载 Mermaid |
| Mermaid 配置 | `mermaid.initialize({startOnLoad:false,securityLevel:\`strict\`})`、`mermaid.render(\`wikiDiagram${uuid}\`,…)` | 图示渲染 |

---

## 五、React 组件与面板挂载点

### 5.1 挂载点（[bundle] 静态提取）

- 本包**没有 `PANEL_ID` 常量**，不注册独立主面板；
  而是向 knowledge 包预留的子槽挂载：
  ```
  ctx.slots.inject('main.knowledge.wiki', () =>
    ctx.slots.register({ name:'main.knowledge.wiki', locale:NS, inject:()=>injected }, WikiPageView)
  );
  ```
- 该子槽与 `main.knowledge.library`、`main.knowledge.experience` 并列（见 `ui-knowledge.md` §5.2）。
- **子槽内的具体布局、默认展开项静态不可见，需真机确认。**

### 5.2 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 **22 个大写候选**，其中：

- **真实 React 函数组件 3 个**（`function <Name>(` 定义，且以 props 解构 / JSX 为特征）
- 其余为 SHA-256 实现、常量、错误类、CSS module，非组件。

**函数组件（3）及职责 [推断]：**

| 组件 | 职责 [推断] |
|---|---|
| `WikiPageView` | 项目 Wiki 主页（工作区/语言选择、文档目录、生成控制、状态、引用、知识卡片、图示） |
| `DiagramPreviews` | 图示预览列表（`text` → 多个 mermaid 图） |
| `Diagram` | 单张图示渲染（懒加载 mermaid、`mermaid.render`、预览放大） |

> 非组件候选逐类说明（避免误计）：
> - SHA-256 实现：`function Chi(a,b,c)`、`function Maj(a,b,c)`、`HashMD`、`SHA2_32B`、`SHA256_K`、`SHA256_W`、`W15`
> - 常量/配置：`Config`、`Schema`、`MAX_DIAGRAM_CHARACTERS`、`MAX_WIKI_PAGES`、`MAX_WIKI_CARDS`、`WIKI_LANGUAGES`、`WIKI_ROOT`、`SHA256_IV`
> - 错误类：`WikiReadError`、`ValidationError`
> - CSS module：`DiagramPreview_module_css_default`、`WikiPage_module_css_default`

### 5.3 懒加载 Mermaid 块 [bundle]

- `const mermaid = (await require.async(\`./client.mermaid.min.js\`)).default`；
- `mermaid.initialize({startOnLoad:false, securityLevel:\`strict\`})`；
- `mermaid.render(\`wikiDiagram${randomUUID().replaceAll(\`-\`,\`\`)}\`, text)`；
- 依赖文件 `lib/client.mermaid.min.js` 实测 **3,556,101 字节**（[pkg] `files` 含 `lib/client.*.js`）。
- **图示渲染的视觉效果与 `MAX_DIAGRAM_CHARACTERS` 截断策略的具体表现静态不可见，需真机确认。**

### 5.4 注入对象 `injected`（[bundle] 静态提取，字段逐项）

| 字段 | 值 / 形态 | 用途 [推断] |
|---|---|---|
| `hooks.wikiRuntime` | `state` | Wiki 运行时状态（生成状态、自动更新开关等） |
| `hooks.currentWorkspace` | `ctx.uiWorkspace.currentWorkspace` | 当前工作区 |
| `autoUpdateDefault` | `preferences.valid && config.autoUpdateDefault` | 本机偏好有效时才启用自动更新 |
| `ensureAutomatic` | `(workspaceId, language, retry) => tracked(() => automatic.ensure(...))` | 确保自动生成/增量更新任务启动 |
| `generationRefreshMs` | `config.generationRefreshMs` | 生成状态轮询间隔 |
| `readSummary` / `readManifest` / `readArticle` | 函数 | 读 Wiki 摘要/目录/文档 |
| `generate` | 函数 | 触发生成 |
| `readSource` | `(request, signal) => ctx.remote.projectWiki.readSource(request, AbortSignal.any([signal, lifetime.signal]))`，失败抛 `WikiReadError` | 源码片段读取 |
| `setAutoUpdate` | `(workspaceId, language, enabled) => { remember(...); if(enabled) automatic.reset(...) }` | 切换自动更新并持久化 |
| `pause` | `ctx.remote.session.cancel({sessionId})` | 暂停生成任务 |
| `openTask` | `ctx.uiWorkspace.openSession(id)` | 打开任务会话 |
| `ask` | `(workspaceId,path,page,edit) => startSession(...)` | 围绕本页提问 / 编辑 Wiki 页 |

---

## 六、可观测副作用

### 6.1 注册清单

| 副作用 | 细节 | 来源 |
|---|---|---|
| 注册 8 语字典 | `ctx.locale.register('repoWiki', {en,zh,ja,es,fr,de,ru,pt})`，effect 标签 `repo-wiki: dictionaries` | [bundle] |
| 注册子槽条目 ×1 | `main.knowledge.wiki` → `WikiPageView` | [bundle] |
| 注册 effect ×3 | `repo-wiki: dictionaries` / `repo-wiki: local automatic-generation consent` / `repo-wiki: operation supervision` | [bundle] |
| 本机偏好读写 | `localStorage.getItem/setItem('umaStudio.repoWiki.autoUpdate.v1', JSON.stringify(next))` | [bundle] |
| 原生 `console.warn` | 偏好读取失败：`Repository Wiki automatic-update preferences could not be read; automatic generation is disabled.`；偏好写入失败：`Repository Wiki update preferences could not be saved.`（前缀 [bundle] 逐字）；监督停止：`Project Wiki source supervision stopped.` | [bundle] |

### 6.2 自动更新与监督行为 [bundle+推断]

- 偏好存储键 `umaStudio.repoWiki.autoUpdate.v1`，解析 schema `wikiAutoUpdatePreferencesSchema`；
  通过 `storage` 事件监听 `event.key===automaticPreferenceKey || event.key===null` 以同步偏好（含跨标签页/清除）。
- 监督定时器：`setInterval(() => { tracked(checkSources).catch(...) }, config.autoUpdateIntervalMs)`；
  `checkSources` 遍历 `ctx.workspaces.list.getSnapshot().items` × `['zh','en']`，
  对 `state.autoEnabled[wikiRunKey(workspaceId, language)] === true` 的项调用 `automatic.ensure(...)`。
- `config.autoUpdateDebounceMs` 参与更新调度（[bundle] 在 `apply` 尾部 effect 清理处出现）；
  其精确防抖对象/路径静态不可见，需真机确认。
- `generationRefreshMs` 驱动生成状态 `setInterval` 轮询（[bundle] `generationRefreshMs` 出现在两个 `useEffect` 依赖中）。

### 6.3 生成 / 会话行为 [bundle+推断]

- 生成任务建会话：`ctx.sessions.create({workspaceId, agentPreset:\`repo-wiki\`})`；
  占用：`ctx.sessions.using(run, {source:\`repoWiki\`, signal:lifetime.signal}, async reference => { await (await reference.ready).session.prompt([{type:'text',text:prompt}], 'queue', lifetime.signal) })`。
- 通过 `ctx.workspaces.list.getSnapshot().items` 校验工作区存在与会话归属
  （`value.sessionIds.includes(sessionId)`）。
- `ask`：`edit` 为 true 时使用 `wiki_read_page` 校验源码引用后再征求修改意见的 prompt；
  否则围绕本页提问。完整 prompt 静态截断，需真机确认。
- `pause` 调 `ctx.remote.session.cancel({sessionId})`；`openTask` 调 `ctx.uiWorkspace.openSession(id)`。

### 6.4 静态不可见项（需真机确认，不编造）

- `main.knowledge.wiki` 子槽内的布局、默认视图（列表/网格）、文档目录展开态。
- `remote.projectWiki.*` 与 `injected` 内 `readSummary/readManifest/readArticle/generate` 的精确参数与返回结构。
- `autoUpdateDebounceMs` 的具体防抖路径与 `autoGenerateOnOpen` 的触发时机。
- 生成状态文案与真实运行时状态的映射、图表渲染视觉效果。
- Mermaid 懒加载失败时的降级 UI（仅见 `diagramFailed` 文案键，行为需真机确认）。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全，另含 §4.1 浏览器 inject、§4.5 冻结标识 |
| inject 是否全列 | ✅ package.json `dsh.client.inject` 10 项逐项列出（§1.2）；浏览器 `inject` 9 项（§4.1）；并说明 Host 无 `inject` 导出 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出 name + description（§3.1），并逐字标注仅 zh 为中文 |
| 组件名是否来自 bundle 实数 | ✅ 3 个函数组件（WikiPageView/DiagramPreviews/Diagram）均由正则提取并验证；Chi/Maj 明确归为 SHA-256 辅助函数 |
| ctx 调用是否来自 bundle 实数 | ✅ `ctx.service.method` 12 个唯一、`ctx.<word>` 7 个服务、`remote.projectWiki` 4 方法，均由正则提取；次数为脚本统计 |
| 冻结内部标识逐字保留 | ✅ `repoWiki`、`main.knowledge.wiki`、`umaStudio.repoWiki.autoUpdate.v1`、`.uma/wiki`、`['zh','en']`、`repo-wiki`、`repoWiki`、`./client.mermaid.min.js`、`securityLevel:'strict'` |
| 静态不可见项标注 | ✅ 布局/参数/防抖路径/降级 UI 等均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：从 bundle 静态提取组件 3（函数，无懒加载 React 组件；1 个懒加载 JS 块为 mermaid 库）；
`ctx.service.method` 12 个唯一、`ctx.<word>` 7 个服务、`ctx.effect` 3 个（effect 标签 3）；
`remote.projectWiki` 4 个方法、`remote.session` 2 个；浏览器端 inject 9 项、包级 inject 10 项；
`locale/*.json` 8 语（name+description，仅 zh 中文）；bundle 内嵌 101 个唯一 `t()` 键（135 次）、
156 个唯一中文片段（166 次）；`lib/client.js` 实测 117,927 字符 / 120,242 字节；
`lib/client.mermaid.min.js` 实测 3,556,101 字节。
