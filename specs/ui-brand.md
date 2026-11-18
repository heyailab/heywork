# spec: dsh-client-ui-uma-brand（UI 挂载契约 / P4 重写需求）

> 这是**需求文档**，不是源码翻译。目标：`界面出现、挂在正确位置、调正确的服务、文案正确`，
> 不强求像素级还原。
> 证据来源与标注约定：
> - **[pkg]** = `package.json`（`dsh.client` 声明 / exports / deps）
> - **[host]** = `lib/index.js`（tsc 直出、可读、带注释）
> - **[locale]** = `locale/*.json`（未压缩文本）
> - **[bundle]** = 从 `lib/client.js` 压缩 bundle **静态提取**的稳定字符串
> - **[推断]** = 基于提取信号的行为推断，非 bundle 逐字事实，需真机确认
>
> 静态不可见的内容（精确布局、CSS 视觉、像素、交互时序）如实标注"静态不可见，需真机确认"，不编造。
> 注：`lib/client.js` 实测 **39,532 字节 / 39,459 字符 / 3 行**（行数按 `\n` 切分）。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-ui-uma-brand` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 插件 id（`name`，Host 端 cordis id） | `ui-uma-brand`（[推断] 由包命名与 [host] 注释推得；Host `index.js` 未导出 `name` 字段） | [推断] |
| `dsh.client.platform` | `web` | [pkg] |
| `dsh.client.immediately` | 未声明（非立即加载） | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| devDependencies 关键项 | `dsh-client-ui-chat` / `dsh-client-ui-conversation` / `dsh-client-ui-renderer` / `dsh-client-ui-sidebar` / `dsh-client-ui-theme` / `dsh-client-locale` / `dsh-client-ui-settings` / `dsh-client-ui-slots` / `schemastery ~3.19.0` | [pkg] |
| 浏览器端运行依赖 | `react/jsx-runtime`、`schemastery`（来自 bundle `require`） | [bundle] |

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（5 个，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-client-ui-chat`
2. `@deepseek-ai/dsh-client-ui-conversation`
3. `@deepseek-ai/dsh-client-ui-renderer`
4. `@deepseek-ai/dsh-client-ui-sidebar`
5. `@deepseek-ai/dsh-client-ui-theme`

> 说明：以上是**包级组合依赖**（Host 组装时要注册到 composition 的 5 个包）。
> 与之不同，`lib/client.js` 浏览器端 `inject = [\`slots\`,\`theme\`,\`locale\`]`（3 项 ctx 服务，见 §4.1）。
> **Host `index.js` 未导出 `inject`**（只导出 `apply`）。三者语义不同，不可互相替代。

### 1.3 exports 面 [pkg]

| 子路径 | 指向 |
|---|---|
| `.` | `./lib/index.js`（types: `./lib/types/index.d.ts`） |
| `./client` | `./lib/client.js`（types: `./lib/types/client/index.d.ts`） |
| `./locale/*.json` | `./locale/*.json` |
| `./package.json` | `./package.json` |
| `./assets/*` | `./lib/assets/*` |

`files` 白名单：`locale/*.json`、`lib/index.js`、`lib/client.js`、`lib/assets`、`lib/types/**/*.d.ts`。
`lib/assets/` 实测 **8 个品牌资源文件**（[pkg] + 目录实测）：
`logo-primary-2b292e08eb81.png`、`logo-reverse-61597d630768.png`、
`mark-primary-7e1e71917449.png`、`mark-reverse-81513da7bcbd.png`、
`studio-logo-primary-36ce9a48591c.svg`、`studio-logo-reverse-b8accc5090f9.svg`、
`studio-mark-primary-404b4537ae0b.svg`、`studio-mark-reverse-0bda83daf75b.svg`。

---

## 二、Host 端行为（index.js，tsc 直出）

### 2.1 Config schema

- **Host 端无 Config**：`lib/index.js` 仅 `function apply(){}` + `export { apply }`（[host] 逐字，全文 10 行）。
- 浏览器端另有 `Config`（见 §2.4），Host 不导出它。

### 2.2 `apply()`

- `function apply() {}` — **空实现，无 Host 副作用**（[host] 逐字注释原文，逐字保留）：
  > "Uma brand identity, node half. Pure UI plugin: the empty apply exists so the
  > plugin appears in the host composition; the browser half ships via
  > exports[\"./client\"], discovered through the package.json dsh.client declaration."
- 另有逐字注释：`/** Host plugin body — no host-side behavior for this client presentation. */`。
- 结论：P4 重写时 Host 端按此直出源码还原即可；主体在浏览器端 `./client`。

### 2.3 Host 导出面 [host]

`export { apply };`

| 导出 | 值 / 形态 |
|---|---|
| `apply` | 空函数 |
| `Config` / `name` / `inject` | **均未从 Host 导出** |

### 2.4 浏览器端 `apply(ctx, config)` [bundle]

浏览器半边是真正入口。`function apply(ctx,config)` 逐字行为：

- `ctx.effect(()=>ctx.theme.overrideStylesheet('@deepseek-ai/dsh-client-ui-uma-brand/uma-brand.css', uma_brand_css_default), 'ui-uma-brand: product stylesheet')`
  → 注入主题样式覆盖（见 §6.1）。
- `ctx.effect(()=>ctx.locale.register('uma-running', runningCopy), 'ui-uma-brand: running status copy')`
  → 注册运行态文案字典（见 §3.2）。
- 5 处 slot 注入 / 注册（见 §5）。
- **浏览器端 `Config`**：`const Config = Schema.object({ name: Schema.string().default('UMA Studio') })` [bundle]。
  - `name` 默认值 `UMA Studio`；接入方式由 §5 的 `inject:()=>({name:config.name})` 传给侧栏组件。
  - 组件内另有分支常量判断：`'UMA Studio'` 走 Studio SVG；`'优码云'` 走父品牌锁屏；其他名字走"云标 + 文本"。
- 浏览器端导出面 [bundle]：`exports.Config`、`exports.apply`、`exports.inject`。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `meta.title`（[locale] 逐字）

| 语 | 文件 | `meta.title` |
|---|---|---|
| 简体中文 | `zh.json` | `Uma 品牌` |
| 英文 | `en.json` | `Uma brand` |
| 日文 | `ja.json` | `Uma ブランド` |
| 德文 | `de.json` | `Uma-Marke` |
| 俄文 | `ru.json` | `Бренд Uma` |
| 葡萄牙文 | `pt.json` | `Marca Uma` |
| 法文 | `fr.json` | `Marque Uma` |
| 西班牙文 | `es.json` | `Marca Uma` |

> 所有 locale 文件**仅含 `meta.title` 一个字段**，无其他键。

### 3.2 bundle 内嵌运行态字典 `uma-running`（[bundle] 逐字）

- 注册：`ctx.locale.register('uma-running', runningCopy)`，effect 标签 `ui-uma-brand: running status copy`。
- 语言顺序：`zh, en, ja, es, fr, de, ru, pt`（8 语齐全）。
- 每语 **2 个键**：`running`、`elapsed`（`elapsed` 含插值 `{duration}`）。

| 语 | `running` | `elapsed` |
|---|---|---|
| zh | `Uma 正在处理` | `Uma 正在处理，已用时 {duration}` |
| en | `Uma is working` | `Uma is working · {duration}` |
| ja | `Uma が処理中` | `Uma が処理中 · {duration}` |
| es | `Uma está trabajando` | `Uma está trabajando · {duration}` |
| fr | `Uma travaille` | `Uma travaille · {duration}` |
| de | `Uma arbeitet` | `Uma arbeitet · {duration}` |
| ru | `Uma работает` | `Uma работает · {duration}` |
| pt | `Uma está trabalhando` | `Uma está trabalhando · {duration}` |

> 正则 `/[\u4e00-\u9fa5]{2,20}/g` 从 bundle 实测 **4 个唯一中文片段 / 6 次出现**：
> `正在处理`(2)、`処理中`(2，日文汉字被正则捕获)、`优码云`(1)、`已用时`(1)。
> 逐语全量文案以上表 bundle 内嵌字典为准，`locale/*.json` 只提供标题。

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字）

```
const inject = ['slots', 'theme', 'locale']
```

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**5 个唯一 / 13 次出现**）

| # | 调用 | 出现次数 | 用途 [推断]，除标注外 |
|---|---|---|---|
| 1 | `ctx.slots.inject` | 5 | 向 5 个 slot 注入扩展（见 §5.2）[bundle] |
| 2 | `ctx.slots.register` | 5 | 在 slot 中注册具体组件（见 §5.2）[bundle] |
| 3 | `ctx.slots.registerFactory` | 1 | 在 `conversation.chat.assistant.brand` 注册工厂（`scope:'root'`）[bundle] |
| 4 | `ctx.theme.overrideStylesheet` | 1 | 覆盖产品样式表（effect 标签 `ui-uma-brand: product stylesheet`）[bundle] |
| 5 | `ctx.locale.register` | 1 | 注册 `uma-running` 8 语字典 [bundle] |

> 裸 `ctx.<word>` 唯一服务 **4 个**：`effect`、`locale`、`slots`、`theme`。
> `ctx.effect` 以裸调用出现（3 处），未匹配二段正则。

### 4.3 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 浏览器 NS | `uma-running` | `ctx.locale.register` 的字典命名空间 |
| slot | `sidebar.brand.identity` | 侧栏完整品牌标识位（priority `-1`） |
| slot | `sidebar.brand.mark` | 侧栏云标位（priority `-1`） |
| slot | `sidebar.brand.name` | 侧栏产品名位（priority `-1`） |
| slot | `conversation.hero.brand.mark` | 会话 hero 品牌标位（priority `-1`） |
| slot | `conversation.chat.running-indicator` | 会话运行态指示位 |
| slot | `conversation.chat.assistant.brand` | 助手品牌工厂位（`scope:'root'`） |
| 样式表 id | `@deepseek-ai/dsh-client-ui-uma-brand/uma-brand.css` | `ctx.theme.overrideStylesheet` 参数 |
| effect 标签 | `ui-uma-brand: product stylesheet` / `ui-uma-brand: running status copy` | 仅这两处 `ctx.effect` 带标签；`registerFactory` 所在 effect **无标签** [bundle] |
| 配置枚举 | `UMA Studio` / `优码云` | 品牌形态分支常量 [bundle] |

---

## 五、React 组件与面板挂载点

### 5.1 挂载点（slot）清单（[bundle] 逐字）

本包**不新增主面板**，只占用 6 个既有 slot。

### 5.2 挂载点映射（[bundle] 静态提取）

| slot | priority / scope | locale | inject 数据 | 挂载组件 |
|---|---|---|---|---|
| `conversation.chat.running-indicator` | — | `uma-running` | — | `RunningIndicator` |
| `conversation.chat.assistant.brand` | `scope:'root'`（registerFactory） | — | — | `ProjectDirectorMark` |
| `sidebar.brand.identity` | `-1` | — | `()=>({name:config.name})` | `SidebarBrandIdentity` |
| `sidebar.brand.mark` | `-1` | — | — | `SidebarBrandMark` |
| `sidebar.brand.name` | `-1` | — | `()=>({name:config.name})` | `SidebarBrandName` |
| `conversation.hero.brand.mark` | `-1` | — | — | `HeroBrandMark` |

> 5 处使用 `ctx.slots.inject(slot, ()=>ctx.slots.register({name:slot, priority:-1, …}, Component))`；
> 1 处使用 `ctx.effect(()=>ctx.slots.registerFactory({name:'conversation.chat.assistant.brand', scope:'root'}, ProjectDirectorMark))`（该 effect **无标签**）。
> **priority `-1` 与官方默认占位共存时的最终胜出者、6 处 slot 的视觉位置静态不可见，需真机确认。**

### 5.3 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 **12 个唯一候选**，其中：

- **真实 React 函数组件 8 个**（`function <Name>(` 定义）
- 其余 4 个为 schemastery 常量（`Config`、`Schema`、`ValidationError`）与 CSS module 对象（`UmaBrand_module_css_default`），非组件。

| 组件 | 职责 [推断] |
|---|---|
| `UmaBrandMark` | 云标本体：并列渲染 primary / reverse 两张图，由 CSS 按明暗主题切换显示 |
| `SidebarBrandIdentity` | 侧栏完整标识：`name==='UMA Studio'` 用 Studio 锁标（156×26）；`name==='优码云'` 用父品牌锁标（132×40）；其他名字用 `UmaBrandMark`+`BrandName` |
| `SidebarBrandMark` | 侧栏云标：转发 `props.size` 给 `UmaBrandMark` |
| `SidebarBrandName` | 侧栏产品名：转发 `name` 给 `BrandName` |
| `BrandName` | 纯文本产品名 `<span>` |
| `HeroBrandMark` | 会话 hero 云标：`size` 取 `Math.round(props.size*1.4)`，附加 `heroMark` class |
| `ProjectDirectorMark` | 助手品牌工厂标：用 `mark-primary` / `mark-reverse` 资源，按明暗主题切换 |
| `RunningIndicator` | 运行态指示：`holding` 为真时不显示公告；`duration` 缺省用 `t('running')`，否则 `t('elapsed',{duration})`；含 `role=status` / `aria-live=polite` |

### 5.4 主题样式覆盖（[bundle] 逐字）

`uma_brand_css_default` 为内嵌 CSS 字符串，通过 `ctx.theme.overrideStylesheet` 注入，覆盖 `body` 与 `body[data-ds-dark-theme]` 上的 `--dsw-*` 设计令牌，包含：

- 浅色：`--dsw-alias-bg-base:#f7f8fa`、`--dsw-alias-brand-primary:#191a1d`、
  `--dsw-focus-ring-color:#505257`、`--dsw-alias-composer-background:linear-gradient(...)` 等。
- 深色：`--dsw-alias-bg-base:#15171b`、`--dsw-alias-brand-primary:#edf0f4`、
  `--dsw-focus-ring-color:#c3cbd7`。
- `@media (prefers-reduced-transparency:reduce)` 下替换 composer 背景并关闭 backdrop。
- 品牌显隐别名：`--dsw-alias-brand-primary-display` / `--dsw-alias-brand-reverse-display` 在明暗主题间互换。

> CSS 令牌清单静态可见；**具体视觉观感、主题层叠顺序、卸载后回退效果静态不可见，需真机确认**。

---

## 六、可观测副作用

### 6.1 注册 class（[bundle]）

| 副作用 | 细节 | 来源 |
|---|---|---|
| 主题样式覆盖 ×1 | `ctx.theme.overrideStylesheet('@deepseek-ai/dsh-client-ui-uma-brand/uma-brand.css', uma_brand_css_default)`，effect 标签 `ui-uma-brand: product stylesheet` | [bundle] |
| 注册 8 语字典 ×1 | `ctx.locale.register('uma-running', runningCopy)`，effect 标签 `ui-uma-brand: running status copy` | [bundle] |
| slot 注入/注册 ×5 | 见 §5.2（含 1 个 `registerFactory`） | [bundle] |
| 品牌资源文件 ×8 | `lib/assets/*` 随包发布，由 `./assets/*` exports 暴露 | [pkg] + 目录实测 |

### 6.2 品牌形态分支（[bundle] 逐字）

- `SidebarBrandIdentity` 按 `config.name` 三分支：
  1. `name==='UMA Studio'` → Studio 锁标 SVG（primary/reverse 双图）。
  2. `name!=='优码云'` → 云标 `UmaBrandMark` + `BrandName` 文本。
  3. 其余（即 `'优码云'`）→ 父品牌 PNG 锁标（132×40）。
- `config.name` 默认值 `UMA Studio`；`config` 在浏览器端的其他消费点静态不可见，需真机确认。

### 6.3 静态不可见项（需真机确认，不编造）

- 6 个 slot 在页面中的精确位置、尺寸、z-order、与官方占位组件的竞争结果。
- priority `-1` 的最终生效规则、`scope:'root'` 工厂的调用时机。
- CSS 令牌在具体组件上的视觉呈现、主题切换动画、卸载/HMR 后的样式回退。
- 品牌资源 PNG/SVG 的实际裁切、object-fit、暗色反转效果。
- `name` 为非中文/非英文时的排版细节。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全；另含 §4.3 冻结标识、§5.4 样式覆盖 |
| inject 是否 5 个全列 | ✅ package.json `dsh.client.inject` 5 项逐项列出（§1.2）；并区分浏览器 3 项与 Host 未导出 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出（§3.1）；运行态字典 8 语 2 键逐语列出（§3.2） |
| 组件名是否来自 bundle 实数 | ✅ 12 个候选由正则从 `client.js` 提取，二次验证得 8 个真实函数组件；未编造 |
| ctx 调用是否来自 bundle 实数 | ✅ `ctx.service.method` 5 个唯一 / 13 次出现，均由正则提取并标注出现次数 |
| 冻结内部标识逐字保留 | ✅ 6 个 slot 名、`uma-running`、样式表 id、effect 标签、`UMA Studio`/`优码云` 均逐字保留 |
| 静态不可见项标注 | ✅ slot 位置/优先级竞争、CSS 视觉、卸载回退等均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：文件 281 行；bundle 实测 39,532 字节 / 39,459 字符 / 3 行；
正则提取 `ctx.*` 5 个唯一（13 次）、组件候选 12 个（真实函数组件 8）、中文片段 4 个唯一（6 次出现）；
浏览器 inject 3 项、包级 inject 5 项；`locale/*.json` 标题 8 语；运行态字典 8 语 × 2 键；
品牌资源文件 8 个。
