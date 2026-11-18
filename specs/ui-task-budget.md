# spec: dsh-client-ui-uma-task-budget（UI 挂载契约 / P4 重写需求）

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
> 注：`lib/client.js` 实测 **26,614 字节 / 25,814 字符 / 3 行**（行数按 `\n` 切分）。

---

## 一、插件身份（name / platform / inject 完整清单）

### 1.1 身份常量

| 项 | 值 | 来源 |
|---|---|---|
| npm 包名 | `@deepseek-ai/dsh-client-ui-uma-task-budget` | [pkg] |
| 版本 | `0.2.2-rc.3` | [pkg] |
| 插件 id（`name`，Host 端 cordis id） | `ui-uma-task-budget`（[推断] 由包命名推得；Host `index.js` 未导出 `name`） | [推断] |
| `dsh.client.platform` | `web` | [pkg] |
| `dsh.client.immediately` | 未声明（非立即加载） | [pkg] |
| peerDependencies | `@deepseek-ai/cordis ~4.1.0` | [pkg] |
| devDependencies 关键项 | `dsh-api-remotes`、`dsh-api-remote-access`、`dsh-client-store`、`dsh-deepseek-account`、`dsh-uma-task-budget`、`dsh-typert-protocol`、`dsh-remote-mock`、`dsh-client-ui-chat` 等 | [pkg] |
| 浏览器端命名空间 `NS` | `umaTaskBudget` | [bundle] `const NS=\`umaTaskBudget\`` |

### 1.2 inject 完整清单 — package.json `dsh.client.inject`（6 个，逐项列出 [pkg]）

1. `@deepseek-ai/dsh-api-remotes`
2. `@deepseek-ai/dsh-api-remote-access`
3. `@deepseek-ai/dsh-client-locale`
4. `@deepseek-ai/dsh-client-ui-conversation`
5. `@deepseek-ai/dsh-client-ui-primitives`
6. `@deepseek-ai/dsh-client-ui-chat`

> 说明：以上是**包级组合依赖**（Host 组装时要注册到 composition 的 6 个包）。
> 与之不同，浏览器端 `inject = [\`slots\`,\`locale\`,\`remote\`,\`remote.account\`,\`remoteAccess\`]`（5 项，见 §4.1）；
> 子作用域另注入 `remote.uma-budget`（见 §4.3）。
> **Host `index.js` 未导出 `inject`**（只导出 `apply`）。三者语义不同，不可互相替代。

### 1.3 exports 面 [pkg]

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

- **Host 端无 Config**：`lib/index.js` 仅 `function apply(){}` + `export { apply }`（[host] 逐字，全文 5 行）。
- 浏览器端亦未见 `Config` 导出（仅 `exports.apply` / `exports.inject`）。

### 2.2 `apply()`

- `function apply() {}` — **空实现，无 Host 副作用**（[host] 逐字注释原文，逐字保留）：
  > `/** Loader entry; the browser contribution owns all budget controls. */`
- 结论：P4 重写时 Host 端按此直出源码还原即可；主体在浏览器端 `./client`。

### 2.3 Host 导出面 [host]

`export { apply };`

| 导出 | 值 / 形态 |
|---|---|
| `apply` | 空函数 |
| `Config` / `name` / `inject` | **均未从 Host 导出** |

### 2.4 浏览器端 `async apply(ctx)` [bundle]

浏览器半边是真正入口。`async function apply(ctx)` 逐字行为：

1. `const disposeRemote = await ctx.remote.$mount(TYPERT_REMOTE)` — 挂载 `uma-budget` Remote 贡献（见 §4.4）。
2. `ctx.effect(()=>ctx.locale.register(NS,{en,zh,ja,es,fr,de,ru,pt}))` — 注册字典（**无 effect 标签**）。
3. `const account = createSnapshotStore({revision:0, active:false})` — 账号状态快照。
4. `ctx.remoteAccess.whenAccess('account/watch', function*(){…})` — 订阅账号凭据变化（见 §6.2）。
5. `ctx.inject(['remote.uma-budget'], scope=>{…})` — 子作用域注册拒绝恢复动作（见 §4.3、§5.2）。
6. `return disposeRemote` — **返回卸载钩子**，插件卸载时释放挂载的 Remote。
7. 浏览器端导出面 [bundle]：`exports.apply`、`exports.inject`。

---

## 三、8 语 locale 文案

### 3.1 `locale/*.json` 的 `meta.title`（[locale] 逐字）

| 语 | 文件 | `meta.title` |
|---|---|---|
| 简体中文 | `zh.json` | `任务消费额度` |
| 英文 | `en.json` | `Task spending limit` |
| 日文 | `ja.json` | `タスク利用上限` |
| 德文 | `de.json` | `Ausgabenlimit für Aufgaben` |
| 俄文 | `ru.json` | `Лимит расходов задачи` |
| 葡萄牙文 | `pt.json` | `Limite de gastos das tarefas` |
| 法文 | `fr.json` | `Plafond de dépenses des tâches` |
| 西班牙文 | `es.json` | `Límite de gasto de tareas` |

> 所有 locale 文件**仅含 `meta.title` 一个字段**，无其他键。

### 3.2 bundle 内嵌字典（[bundle] 逐字）

- 注册：`ctx.locale.register(NS,{en,zh,ja,es,fr,de,ru,pt})`（无 effect 标签）。
- 语言顺序（bundle 逐字）：`en, zh, ja, es, fr, de, ru, pt`。
- **实际完全翻译的只有 `en` 与 `zh`，各 36 键**（实测）；其余 6 语在 bundle 中逐字为别名：
  `const ja=en; const es=en; const fr=en; const de=en; const ru=en; const pt=en;`（[bundle]）。
  → **日文/德文/俄文/葡文/法文/西文落到完整英文回退**，不是独立翻译。
- 正则 `/\bt\(`([^`]+)`\)/g` 实测 **35 个唯一文案键**。
- 正则 `/[\u4e00-\u9fa5]{2,20}/g` 实测 **51 个唯一中文片段 / 51 次出现**。

**英文键 → 中文值（[bundle] 逐字，节选）：**

| 键 | 中文文案（zh） |
|---|---|
| `view` | `查看任务预算` |
| `title` | `任务预算` |
| `description` | `当前会话与其委派的智能体共用一个由服务端执行的预算。` |
| `close` | `关闭` |
| `loading` | `正在读取当前预算…` |
| `refresh` / `save` / `saving` / `cancel` | `刷新` / `保存预算` / `正在保存…` / `取消` |
| `cap` | `消费上限（CNY）` |
| `unlimited` | `不额外限制任务金额` |
| `spent` / `reserved` | `已结算消费` / `已受理调用预留` |
| `root` / `shared` | `共享根会话` / `此子会话与父会话共用任务预算。` |
| `active` / `paused` / `closed` | `可用` / `已暂停` / `已关闭` |
| `state` / `operator` / `reason` | `任务状态` / `运营已暂停` / `运营原因` |
| `pauseNote` | `暂停后不再受理新的调用，已受理的请求保留预留金额并继续结算。` |
| `closedNote` | `关闭后本任务停止受理新的调用，已有请求仍可能结算。` |
| `invalid` | `请输入非负 CNY 金额，最多保留六位小数。` |
| `failed` | `暂时无法读取或保存预算，请检查连接后重试。` |
| `conflict` | `预算已在其他地方修改。下方已刷新最新版本，你的输入已保留，请核对后重新保存。` |
| `committed` | `上限低于已消费及预留金额，请提高上限或等待请求结算后刷新。` |
| `account` | `请登录拥有当前会话的 UMA 账号。` |
| `upgrade` | `服务端需要升级后才能使用任务预算。` |
| `accountChanged` | `当前账号已变更，请重新打开面板读取新账号预算。` |
| `saved` / `version` / `retry` / `revert` | `预算已保存。` / `版本` / `重试` / `使用当前服务端配置` |
| `expired` | `有效期至` |
| `remainingNote` | `金额采用服务端返回的 CNY 十进制字符串，账号与 API 密钥限额同时生效。` |

> 逐语全量文案以 bundle 内嵌字典为准，`locale/*.json` 只提供标题；
> **6 个非中英语种文案为英文回退**这一事实必须保留，不得擅自补译。

---

## 四、ctx 服务 / 扩展点调用清单

### 4.1 浏览器端 inject 数组（[bundle] 逐字）

```
const inject = ['slots', 'locale', 'remote', 'remote.account', 'remoteAccess']
```

### 4.2 `ctx.*` 方法调用（正则 `/\bctx\.(\w+)\.(\w+)/g` 提取，**3 个唯一 / 3 次出现**）

| # | 调用 | 出现次数 | 用途 [推断]，除标注外 |
|---|---|---|---|
| 1 | `ctx.locale.register` | 1 | 注册 NS 字典（`en,zh,ja,es,fr,de,ru,pt`）[bundle] |
| 2 | `ctx.remoteAccess.whenAccess` | 1 | 注册 `account/watch` 访问授权订阅（generator 形式）[bundle] |
| 3 | `ctx.remote.account` | 1 | 账号流：`ctx.remote.$stream({name:'account', open:signal=>ctx.remote.account.watch(signal), ended:()=>new Error('account stream ended')})` [bundle] |

> 裸 `ctx.<word>` 唯一服务 **5 个**：`effect`、`inject`、`locale`、`remote`、`remoteAccess`。
> 另有 `ctx.remote.$mount(TYPERT_REMOTE)`（以 `$` 开头，未被二段正则计入，见 §4.4）、
> `ctx.remote.$stream(...)`（同上）。

### 4.3 子作用域 `scope.*` 调用与子注入（[bundle] 逐字）

| 调用 | 用途 |
|---|---|
| `ctx.inject(['remote.uma-budget'], scope => …)` | 仅向子作用域注入 `remote.uma-budget`，主作用域不暴露预算服务 |
| `scope.slots.inject` | 向 `conversation.chat.turn-error.actions` 注入扩展 |
| `scope.slots.register` | 注册 id `uma-task-budget` 的拒绝恢复动作（`TaskBudgetErrorAction`） |
| `scope.remote['uma-budget'].read` | 读预算：`{sessionId}, signal` |
| `scope.remote['uma-budget'].update` | 更新预算：`{sessionId, expectedVersion, cap, state}, signal` |

### 4.4 冻结的内部标识（[bundle] 逐字保留，不可改写）

| 标识 | 值 | 用途 |
|---|---|---|
| 浏览器 NS | `umaTaskBudget` | 字典命名空间 |
| Remote 包 | `@deepseek-ai/dsh-uma-task-budget` | `TYPERT_REMOTE.package` |
| Remote service | `umaTaskBudgets` | 两个方法的 `service` |
| Remote 方法 | `uma-budget/read`、`uma-budget/update` | 预算读/写 |
| slot + id | `conversation.chat.turn-error.actions` + `uma-task-budget` | 拒绝恢复动作挂载位 |
| 子注入 | `remote.uma-budget` | `ctx.inject` 的子服务名 |
| 访问门 | `account/watch`、`uma-budget/read` | `whenAccess` 通道 / `useAccess` 权限 |
| 错误码 | `UMA_TASK_BUDGET_ACCOUNT_CHANGED`、`UMA_TASK_BUDGET_EXCEEDED`、`UMA_TASK_BUDGET_PAUSED`、`UMA_TASK_BUDGET_UNAVAILABLE`、`uma-budget/failed` | 拒绝动作分支 / 解包异常 |
| Remote 错误文本 | `UMA budget operation failed`（`BudgetFailure` 的 message） | 解包失败 |
| 账号判定 | `product==='uma'` && `status==='credential-stored'` | 决定是否 `publish(true)` |
| 流结束错误 | `account stream ended` | `$stream` 的 `ended` 回调 |
| 状态枚举 | `active` / `paused` / `closed` | 预算状态 |
| 金额单位 | `CNY`，最多 6 位小数，`null` 表示不额外限制 | 输入校验与展示 |

---

## 五、React 组件与面板挂载点

### 5.1 挂载点（slot）清单（[bundle] 逐字）

- `conversation.chat.turn-error.actions` — **唯一挂载位**（会话轮次错误动作区），id `uma-task-budget`。
- **会话头无预算按钮**（bundle 仅此一个 slot 注册）。

### 5.2 挂载点映射（[bundle] 静态提取）

| slot | id | locale | inject 数据 | 挂载组件 |
|---|---|---|---|---|
| `conversation.chat.turn-error.actions` | `uma-task-budget` | NS | `{hooks:{account}, read, update}` | `TaskBudgetErrorAction` |

> `read`/`update` 为 async 包装：调 `scope.remote['uma-budget'].read/update` 后经 `unwrap(result)`；
> `unwrap` 在 `result.ok` 为假时抛 `BudgetFailure(result.error.code==='uma-budget/failed' ? result.error.details.reason : 'request-failed')`。
> `TaskBudgetErrorAction` 在弹窗打开时内联渲染 `TaskBudgetDialog`（非独立 slot）。
> **弹窗尺寸、遮罩、焦点陷阱、错误动作在动作区的排序静态不可见，需真机确认。**

### 5.3 组件清单（[bundle] 静态提取）

正则 `/(?:function|const|var)\s+([A-Z]\w{2,})/` 得 **8 个唯一候选**，其中：

- **真实 React 函数组件 2 个**：`TaskBudgetDialog`、`TaskBudgetErrorAction`。
- 其余 6 个为 typert 运行时类（`RemoteInfo`、`NamedInput`、`ResultValue`）、错误类（`BudgetFailure`）、
  Remote 元数据常量（`TYPERT_REMOTE`）、CSS module 对象（`TaskBudget_module_css_default`），非组件。

| 组件 | 职责 [推断] |
|---|---|
| `TaskBudgetErrorAction` | 拒绝恢复动作按钮 `t('view')`。`UMA_TASK_BUDGET_ACCOUNT_CHANGED` → 仅显示 `t('accountChanged')` 文本；错误码在 `[EXCEEDED, PAUSED, UNAVAILABLE]` 内且 `useAccess('uma-budget/read')` 允许且 `account.active` 为真 → 显示按钮；点击打开 `TaskBudgetDialog`。`account.revision` 变化时关闭弹窗 |
| `TaskBudgetDialog` | 预算编辑弹窗：读预算 → 显示已结算/预留/共享根会话/运营暂停原因 → 输入 `cap`（CNY，最多 6 位小数）与 `state`（active/paused/closed）→ 保存（带 `expectedVersion`）→ 版本冲突时刷新服务端值但保留用户输入 → 刷新/恢复为服务端值/关闭 |

> 组件使用 `dsh-client-ui-primitives` 的 `Button` / `Modal`（[bundle] `require` 与 JSX 调用可见），
> 但具体外观与键盘行为**静态不可见，需真机确认**。

---

## 六、可观测副作用

### 6.1 注册 class（[bundle]）

| 副作用 | 细节 | 来源 |
|---|---|---|
| 挂载 Remote ×1 | `await ctx.remote.$mount(TYPERT_REMOTE)`，卸载钩子 `disposeRemote` 由 `apply` 返回 | [bundle] |
| 注册 8 语字典 ×1 | `ctx.locale.register(NS,{en,zh,ja,es,fr,de,ru,pt})`（无 effect 标签）；6 语别名到 `en` | [bundle] |
| 访问授权订阅 ×1 | `ctx.remoteAccess.whenAccess('account/watch', function*(){…})` | [bundle] |
| 子作用域 slot 条目 ×1 | `conversation.chat.turn-error.actions` / `uma-task-budget` | [bundle] |
| 账号快照 store ×1 | `createSnapshotStore({revision:0, active:false})`，`publish(active)` 使 `revision+1` | [bundle] |

### 6.2 账号流行为（[bundle] + [推断]）

- `whenAccess('account/watch', generator)` 内：
  - `const stream = ctx.remote.$stream({name:'account', open: signal => ctx.remote.account.watch(signal), ended: () => new Error('account stream ended')})`。
  - `yield ()=>{ grant.ended=true; publish(false); return stream.dispose() }` — 授权撤销/卸载时停止流并标记账号未激活。
  - 异步迭代 `for await (const frame of stream)`：`grant.ended` 为真则 return；
    否则 `publish(frame.value.product==='uma' && frame.value.status==='credential-stored')`，`frame.accept()`。
  - `.catch(()=>{ if(!grant.ended) publish(false) })` — 流异常时回退为未激活。

### 6.3 预算读写与状态语义（[bundle] + [推断]）

- 读：`read({sessionId}, signal)` → `SessionBudgetView`，字段逐字：
  `sessionId`、`rootSessionId`、`shared`、`budget{id,purpose,cap,spent,reserved,state,operatorPaused,operatorReason,version,expiresAt}`。
  - 委托会话解析到记录的 root（`description` 逐字：
    `Read the root allowance for a real local session under the current UMA account.` /
    `local session; delegated sessions resolve to their recorded root.`）。
- 写：`update({sessionId, expectedVersion, cap, state}, signal)` — 带观察版本，避免覆盖并发修改。
  - 逐字描述：`Replace the reviewed root cap/state; accepted calls keep their reservations and can settle.`
- 金额：CNY 十进制字符串，最多 6 位小数；`cap=null` → 不额外限制任务金额。
- 状态：`active`/`paused`/`closed`；暂停/关闭阻止新受理，已受理请求仍可结算。
- 冲突：读到 `version` 不一致时刷新服务端最新值但保留用户输入（文案 `conflict` 逐字）。

### 6.4 权限门（[bundle] 逐字）

- 拒绝恢复动作出现条件（全部满足）：
  1. 错误码在 `UMA_TASK_BUDGET_EXCEEDED` / `UMA_TASK_BUDGET_PAUSED` / `UMA_TASK_BUDGET_UNAVAILABLE` 中；
  2. `useAccess('uma-budget/read')` 返回真；
  3. `account.active` 为真（由 `account/watch` 流维护）。
- 保存操作是否需要 `uma-budget/update` 权限：**静态不可见，需真机确认**（bundle 中 `useAccess` 仅见 `uma-budget/read`）。

### 6.5 静态不可见项（需真机确认，不编造）

- 弹窗视觉、尺寸、遮罩、焦点管理与键盘交互。
- 错误动作在 `conversation.chat.turn-error.actions` 中的显示顺序。
- `useAccess('uma-budget/update')` 是否存在于更高层（bundle 未出现）。
- `Expires`/`expired` 的具体时间格式与展示位置。
- 6 个英文回退语种的真实机翻效果（当前 bundle 明确为英文）。

---

## 自查结论（P4 重写前自检）

| 检查项 | 结果 |
|---|---|
| 六段格式齐全（身份 / Host 行为 / 8 语 locale / ctx 调用 / 组件与挂载点 / 副作用） | ✅ 六段齐全；另含 §4.4 冻结标识、§6.4 权限门 |
| inject 是否 6 个全列 | ✅ package.json `dsh.client.inject` 6 项逐项列出（§1.2）；并区分浏览器 5 项、子注入 1 项与 Host 未导出 |
| 8 语 locale 是否逐语列出 | ✅ zh/en/ja/de/ru/pt/fr/es 全部列出（§3.1）；§3.2 明确 en/zh 真翻译 + 6 语英文别名 |
| 组件名是否来自 bundle 实数 | ✅ 8 个候选由正则从 `client.js` 提取，二次验证得 2 个真实函数组件；未编造 |
| ctx 调用是否来自 bundle 实数 | ✅ `ctx.service.method` 3 个唯一（3 次）、`scope.*` 5 项，均由正则提取并标注；`$mount`/`$stream` 单独说明 |
| 冻结内部标识逐字保留 | ✅ NS、Remote 包/service/方法、slot+id、子注入、访问门、5 个错误码、状态枚举逐字保留 |
| 静态不可见项标注 | ✅ 弹窗视觉、动作排序、`uma-budget/update` 权限、时间格式、6 语回退等均标注"需真机确认" |
| 未改现有文件 / 未 git commit | ✅ 仅新建本文件 |

**统计**：文件 311 行；bundle 实测 26,614 字节 / 25,814 字符 / 3 行；
正则提取 `ctx.*` 3 个唯一（3 次）、`scope.*` 5 项、组件候选 8 个（真实函数组件 2）、
中文片段 51 个唯一（51 次出现）、`t()` 文案键 35 个；
浏览器 inject 5 项、包级 inject 6 项；字典 en/zh 各 36 键 + 6 语英文别名；
Remote 方法 2 个、错误码 5 个、slot 1 个。
