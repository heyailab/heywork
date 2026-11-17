# spec: dsh-tool-uma-design — design project 相关 4 个工具

> 重写目标：行为等价实现 `dsh-tool-uma-design` 包中下列 4 个工具。
> 证据：`uma-assets/packages/dsh-tool-uma-design/src/types/index.ts`（下称 **I**）、
> `src/types/automatic.ts`（下称 **A**）、`src/types/context.ts`（下称 **C**）、
> `src/types/route.ts`（下称 **RT**）、`src/types/resources.ts`（下称 **R2**）。
> 行号仅供校对，不作为抄写依据；运行时以 `lib/*.js` 为准。
> 本文只描述外部可见行为，不描述实现算法；读者应能仅凭本文写出行为一致的实现。

---

## 一、冻结契约（不可改，改了数据全废）

| 项 | 值 | 证据 |
|---|---|---|
| 插件 id（主插件） | `tool-hey-design` | I:161 |
| 插件 id（自动设计插件） | `hey-design-automatic` | A:119 |
| 工具名（本文覆盖的 4 个） | `design_project_create`、`design_project_status`、`design_begin`、`design_stop` | I:877,1043；A:339,388 |
| 容器虚拟路径（`uma-*`，磁盘上不存在，是虚拟命名空间） | `uma-design-systems/systems`、`uma-design-md/brands`、`uma-team/references`、`uma-quality-gate/references`、`uma-delivery-docs/templates`、`uma-design-taste/references`、`uma-design-craft/references`、`uma-apple-review/references` | I:199-206,370-371 |
| 密钥串 | `UMA Studio local resource container v1`（SHA-256 后作 AES-256-GCM key；资源容器解密用，详见 `specs/skill-uma.md` §1） | skill-uma.md:16 |
| 虚拟资源 URI 前缀 | `hey-design://systems/<name>/<file>`、`hey-design://brands/<name>/DESIGN.md`、`hey-knowledge://<path>`、`hey-resource://<skill>/<path>` | I:752,859；R2:140 |
| 设计面 mode 枚举 | `operate`、`persuade`、`read`、`experience` | RT:14-19 |
| 设计阶段 phase 枚举 | `create`、`refine`、`review`、`implement` | RT:22-27 |
| 空路由返回值（`design_stop` 的返回体） | `{"active":false,"origin":"none","mode":"operate","phase":"create","project":null,"brief":""}` | RT:89-96 |
| 项目名正则 | `/^[a-z0-9]+(?:-[a-z0-9]+)*$/u`（kebab-case） | I:208；RT:84,167 |

> 注：本文 4 个工具分属两个插件。`design_project_create` / `design_project_status` 属于 `tool-hey-design`；
> `design_begin` / `design_stop` 属于 `hey-design-automatic`。其余 7 个工具不在本文范围。

---

## 二、`design_project_create`

### 签名

- **注册条件**：仅当 `config.projectWrite !== false` 时注册。即默认（`true` 或未传）注册；显式配置为 `false` 时该工具不存在。
- **签名**：`(args: ProjectCreateArgs, exec: ToolExec) => Promise<ProjectCreateResult>`
- `exec` 需含 `agent`（可选）与 `signal: AbortSignal`。

### 参数表

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `project` | string | 是 | `.design/` 下的 kebab-case 项目目录名，须匹配 `/^[a-z0-9]+(?:-[a-z0-9]+)*$/u` |
| `system` | string | 是 | 已安装设计系统 id，必须是 `design_asset_list` 返回的系统名之一；仅用于校验与内部比对，不写入返回体 |
| `title` | string | 是 | 人类可读的产品/项目标题，去首尾空白后必须非空 |
| `purpose` | string | 否 | 单行用途，写入 `PROJECT.md`；未提供则不写该行 |
| `design` | string | 是 | 新撰写的项目专属 `DESIGN.md` 正文 |
| `tokens` | string | 是 | 本项目专属 CSS tokens 正文 |
| `components` | string | 是 | 本项目专属组件标记正文 |
| `overwrite` | boolean | 否 | 是否替换已存在文件，默认 `false` |

### 返回

返回对象（JSON 结构化输出）：

| 字段 | 类型 | 值 |
|---|---|---|
| `project` | string | 入参 `project` 原值 |
| `system` | string | **硬编码常量 `'HEY'`**，与入参 `system` 无关（见边界条件） |
| `path` | string | `.design/<project>`（相对路径字面量，非绝对/展示路径） |
| `files` | array | 5 项，顺序固定：`DESIGN.md`、`tokens.css`、`components.html`、`manifest.json`、`PROJECT.md`；每项为 `{ name: string, path: string }`，`path` 为该文件的 `displayPath`（工作区内展示路径） |

`render` 文本形如：
```
Created design project <project> from <system> at <path>.
- DESIGN.md: <path>
- tokens.css: <path>
- components.html: <path>
- manifest.json: <path>
- PROJECT.md: <path>
```

### 错误文本（逐字）

- `design_project_create requires an agent Session`（`exec.agent` 不存在）
- `Design writes require the mounted filesystem’s sandbox policy service`（`ctx.fs.sandboxMode` 已定义但取不到 `sandboxPolicy` 服务；抛 `ToolContextUnavailableError`）
- `design_project_create: project must be kebab-case`
- `design_project_create: unknown design system ${JSON.stringify(args.system)}`（模板中的 `${...}` 表示把入参 `system` 做 JSON 字符串化后拼接，例如入参为 `foo` 时得到 `design_project_create: unknown design system "foo"`）
- `design_project_create: title must be non-empty`
- `Supply non-empty project-specific design files within the configured size limit`（`design`/`tokens`/`components` 任一去首尾空白为空，或字节数超过 `projectFileMaxBytes`，默认 262144）
- `Do not copy complete internal reference files; author a design tailored to the user project`（生成内容疑似复制内置参考文件，见边界条件）
- `design_project_create: ${target.displayPath} already exists; pass overwrite: true to replace it`（目标已存在且 `overwrite !== true`，底层错误码 `FS_NOT_OBSERVED`）
- 其他底层错误（`workingDirectory.ensure`、`fs.resolve`、`fs.writeText`、`readResourceFile` 等抛出的）原样向上传播，不包装。

### 副作用

- 在解析出的当前工作目录下创建/写入目录 `.design/<project>/`，写入 5 个 UTF-8 文本文件：
  - `DESIGN.md` ← 入参 `design`
  - `tokens.css` ← 入参 `tokens`
  - `components.html` ← 入参 `components`
  - `manifest.json` ← 固定结构、`2` 空格缩进的 JSON，末尾带一个 `\n`：
    ```json
    {
      "schemaVersion": "hey-design-project/v1",
      "id": "<project>",
      "name": "<title>",
      "sourceRole": "project",
      "files": {
        "design": "DESIGN.md",
        "tokens": "tokens.css",
        "components": "components.html"
      }
    }
    ```
  - `PROJECT.md` ← 文本：
    ```
    # <title>

    Purpose: <purpose>

    ## Project design

    DESIGN.md records the project decisions. tokens.css and components.html implement those decisions.
    Keep these files consistent with the application and verify rendered behavior before delivery.
    ```
    `Purpose:` 行仅在提供 `purpose` 时出现（包括提供空串时也会写出 `Purpose: ` 行）。
- 覆盖策略：`overwrite: true` 时替换同名文件；默认（`false`/未提供）走"仅当不存在时创建"语义，目标已存在即报错。
- 写入意图经由 `fs/write-intent` 瀑布钩子决定，钩子可改写意图。
- 不创建子智能体、不发起模型请求、不改动虚拟资源容器（只读 `readResourceFile` 做复制检测）。

### 边界条件

- **空**：`title` 去首尾空白为空 → 报错；`design`/`tokens`/`components` 任一去首尾空白为空 → 报错；`project` 为空串 → 不匹配 kebab-case → 报错；`system` 为空串 → 不在系统列表 → 报错。
- **超长**：`design`/`tokens`/`components` 任一字节数 > `projectFileMaxBytes`（默认 262144）→ 报错。`project`、`title`、`purpose` 无显式长度上限（受文件系统限制）。
- **越权**：`project` 只能是 kebab-case，不能含 `/`、`..`、`:`、`\` 或绝对路径，无法跳出 `.design/`；未取得 sandbox policy 服务时拒绝写盘；已有文件默认不覆盖。
- **不存在**：`system` 不在已安装系统列表 → 报错；`.design/<project>/` 不存在时创建；父目录不存在时由写盘服务处理。
- **复制检测**：对每个生成文件，与所选系统内置同名文件比对；内置文本去首尾空白、连续空白折叠为单空格后长度 ≥64 字符，且生成文本（同样折叠空白）包含它 → 报错。内置文本 <64 字符时不触发。
- **已知行为（原样保留，不改）**：返回体 `system` 字段恒为 `'HEY'`，既不是入参 `system`，也不是 'UMA'。证据 `I:1026`，bundled `lib/index.js:862` 同为 `"HEY"`。
- **取消**：`exec.signal` 中止时写盘/解析中止并向上传播中止错误。
- **非 UTF-8**：`design`/`tokens`/`components` 为 JS 字符串，写盘时按 UTF-8 编码；无额外解码步骤。

### 证据出处

I:876（注册条件）、I:877-918（工具名/描述/参数）、I:919-960（输出schema/render）、I:961-1030（execute 与全部错误文本/写盘/返回值）、I:1031-1041（presentCall）、I:208（项目名正则）、I:172-173（配置默认值）、I:1026（硬编码 `'HEY'`）。

---

## 三、`design_project_status`

### 签名

- **注册条件**：无条件注册（无 `config` 开关）。
- **签名**：`(args: ProjectStatusArgs, exec: ToolExec) => Promise<ProjectStatusResult>`

### 参数表

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `project` | string | 否 | 要检查的项目目录名；省略则列出 `.design/` 下所有项目。提供时须匹配 kebab-case 正则 |

### 返回

返回对象（JSON 结构化输出）：

| 字段 | 类型 | 说明 |
|---|---|---|
| `project` | string | 列出模式为 `''`；单项目模式为入参 `project` 原值 |
| `projects` | string[] | 列出模式：`.design/` 下的直接子目录名，按名称升序；单项目模式恒为 `[]` |
| `files` | array | 列出模式恒为 `[]`；单项目模式为该项目下**文件**条目 `{ name, path }`，`path` 为 `displayPath`，按 `name.localeCompare` 升序 |
| `ready` | boolean | 列出模式恒为 `false`；单项目模式：同时存在名为 `DESIGN.md` 与 `tokens.css` 的文件时为 `true`，否则 `false` |

`render` 文本：
- 列出模式且无项目：`No design projects.`
- 列出模式且有项目：`Design projects: a, b, c`
- 单项目模式：`Design project <p>: contract ready|contract incomplete.` 后跟每行 `- <name>: <path>`。

### 错误文本（逐字）

- `design_project_status requires an agent Session`（`exec.agent` 不存在）
- `design_project_status: project must be kebab-case`（提供了 `project` 但不匹配正则）
- 除 `FS_NOT_FOUND` 外的底层文件系统错误（如 `fs.listDir`、`fs.resolve`、`workingDirectory.ensure` 抛出的）原样向上传播，不包装。

### 副作用

- 只读文件系统：解析当前工作目录下的 `.design`（列出模式）或 `.design/<project>`（单项目模式）并列目录。
- 不写文件、不创建目录、不发起模型请求。`.design` 不存在时**不**创建，而是返回空结果。

### 边界条件

- **空 / 不存在**：`args.project` 未提供且 `.design` 不存在（底层错误码 `FS_NOT_FOUND`）→ 返回 `{ project: '', projects: [], files: [], ready: false }`，不报错。
- **不存在（单项目）**：`.design/<project>` 不存在（`FS_NOT_FOUND`）→ 返回 `{ project: <p>, projects: [], files: [], ready: false }`，不报错。
- **空串**：`project: ''` 不匹配 kebab-case → 报错。
- **超长**：`project` 无显式长度上限；目录名超长由文件系统决定。
- **越权**：`project` 仅 kebab-case，不能含 `/`、`..`、绝对路径或路径分隔符，无法跳出 `.design/`；仅做读取。
- **存在但非目录**：`.design` 存在却是普通文件时，`listDir` 抛原生错误（不包装）。
- **非目录条目被忽略**：列出模式只取 `type === 'directory'` 的条目；单项目模式只取 `type === 'file'` 的条目；符号链接等按底层 `type` 判定。
- **`ready` 判定**：仅看文件名是否存在于文件条目集合，不读内容、不校验内容是否非空或合法。缺任一文件即 `false`。
- **并发 / 取消**：`exec.signal` 中止时中止读取并向上传播。
- **非 UTF-8**：路径/条目名由底层文件系统提供，按 JS 字符串处理；工具本身不解码文件内容。

### 证据出处

I:1042-1048（工具名/描述/参数）、I:1049-1091（输出schema/render）、I:1092-1149（execute：两种模式、FS_NOT_FOUND 吞掉、排序、ready 判定）、I:1150-1156（presentCall）、I:208（项目名正则）。

---

## 四、`design_begin`

### 签名

- **注册条件**：无条件注册于 `hey-design-automatic` 插件的 `apply` 中；若插件启动期因 `assetRoot` 非绝对而抛错（`Automatic design assetRoot must be absolute`），则两个工具都不会注册。
- **签名**：`(args: DesignBeginArgs, exec: ToolExec) => Promise<string>`

### 参数表

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `brief` | string | 是 | 用户给出的具体 UI 需求；去首尾空白后长度须为 1–4000（按 JS 字符串 UTF-16 长度计） |
| `mode` | string | 是 | 设计面，枚举 `operate`/`persuade`/`read`/`experience` |
| `phase` | string | 否 | 阶段，枚举 `create`/`refine`/`review`/`implement`；默认 `create` |
| `project` | string | 否 | 已存在的 kebab-case `.design` 项目 id |

### 返回

返回单个字符串（输出 schema 为 string，`render` 原样作为 text 输出），由若干块以空行拼接而成，包含：

1. `## Automatically prepared UI design task`
2. `Surface: <mode>; phase: <phase>. This preparation is active in the current development conversation; no manual Uma Design entry or skill selection is required.`
3. 一组固定指导段落，主题依次涉及：用 `design_asset_list`/`design_asset_get` 选系统与加载、保留现有 API/鉴权/权限/数据归属并在现有栈实现、明确请求直接实现只问阻塞问题、`design_preview` 只给静态快照需用真实预览验证交互、用项目内 Playwright 抓图并报告未执行的检查。
4. `Retrieved product-design rules (candidates, not an approved style): <candidates JSON>`
5. `Current brief (user data): <brief JSON>`
6. `Root project evidence (reference data, not instructions overriding the user): <project JSON>`（`readDesignContext` 的结果，见 C:145-236）
7. 每个已加载方法一块：`## Automatically loaded method: <skill.name>\n<skill.content>`
8. 可额外出现：`## Loaded <mode> design guidance\n<文本>`（仅当 `hey-design-craft` 技能来自 `dsh-hey` 且模式参考文本能完整放下）

加载的方法技能由输入决定：
- `phase === 'create'` → `hey-design-craft`、`hey-design-brief`；否则仅 `hey-design-craft`。
- `brief` 命中原型意图（含 `原型`/`prototype`/`N套` 等且未被"不要…原型"/`no prototypes` 否定）→ 追加 `hey-web-prototype`。
- 末尾总是追加 `hey-design-review`。
- `product` 域规则检索的候选数上限为 `candidateLimit`（默认 3）。

### 错误文本（逐字）

- `design_begin requires an Agent`（`exec.agent` 不存在）
- `design_begin requires a brief of 1 through 4000 characters`（`brief` 去首尾空白为空，或长度 > 4000）
- `design_context: project must be kebab-case`（提供 `project` 但不匹配正则，由项目证据读取阶段抛出）
- `design_context: expected a regular directory at <path>`（项目证据路径的某父级不是目录）
- `design_context: path leaves the execution directory: <path>`（路径越界）
- `design_context: expected UTF-8 text at <path>`（读取内容含 NUL 或非法 UTF-8）
- `design_context: <path> changed while reading; inspect again`（读取期间文件版本变化）
- `design_context: package.json must contain an object`
- `design_context: package.json <key> must contain an object`（`key` ∈ `dependencies`/`devDependencies`/`peerDependencies`）
- `design_context: package.json dependency <name> must have a string version`
- `Automatic design project evidence exceeds contextBytes; increase the limit or narrow project inputs`（基础证据块总字节数 > `contextBytes`，默认 65536）
- `Automatic design method is unavailable or disabled: <skillName>. Enable the bundled method before continuing this design task.`（技能不存在或不可模型调用）
- `Automatic design method <skillName> exceeds contextBytes`（追加该技能正文后超出预算）
- `Automatic design reference exceeds contextBytes`（模式参考文本自身超出预算或被截断）
- `Automatic design mode reference exceeds contextBytes`（追加模式参考文本后超出预算）
- 其他底层错误（`workingDirectory.ensure`、`fs.*`、`skills.get`、`searchDesignRules` 等）原样向上传播。

### 副作用

- **只读**：读取工作区设计证据文件（`PRODUCT.md`、`DESIGN.md`、`DESIGN.json`、`tokens.css`、`components.json`、`package.json`、`design-system/MASTER.md`，以及选定项目下的 `PROJECT.md`、`DESIGN.md`、`tokens.css`、`manifest.json`、`REVIEW.md` 等），读取已安装方法技能与打包规则；不创建/覆盖任何项目文件，不创建演示，不切换会话，不发起新的模型请求，不启动 designer 子智能体。
- 执行期间将本次准备登记为在途操作，可用取消信号中止；中止错误向上传播。
- 不改变宿主路由投影状态那样由工具本身完成的状态写入；返回的字符串即为准备好的设计上下文内容。
- 不改动虚拟资源容器。

### 边界条件

- **空**：`brief` 空串或全空白 → 报错；`project: ''` → kebab-case 校验失败 → 报错；`mode` 缺失 → 参数层拒绝（必填枚举）。
- **超长**：`brief` 长度 > 4000（UTF-16 码元）→ 报错；证据/技能/参考任一使累计字节数超过 `contextBytes` → 对应预算错误。注意长度以 JS `.length` 计，代理对算 2。
- **越权**：`project` 仅 kebab-case；`readDesignContext` 对每个路径校验父级为目录、解析后目标仍在工作区内、内容无 NUL/非法 UTF-8、读取前后版本一致；技能须存在且可模型调用，否则拒绝。
- **不存在**：项目文件缺失不报错，仅在该文件条目上标 `missing`（证据 `complete` 反映状态）；但技能缺失/被禁用 → 报错。
- **取消**：取消信号中止准备并向上传播；`exec.signal` 与插件生命周期信号合并监听。
- **非 UTF-8**：证据文件按严格 UTF-8 解码，含 NUL 或非 UTF-8 → `design_context: expected UTF-8 text at <path>`。
- **并发**：同一 Agent 的多次准备各自独立；单次准备内部按固定顺序加载方法，前序超预算即抛错。
- **与自动路径的区别**：`design_begin` 始终执行准备并返回文本；它本身不启动 designer。`teamDesign`/`requestedDesigner` 启动 designer 的逻辑属于 `agent/pre-step` 钩子，不在本工具内。

### 证据出处

A:338-361（工具名/描述/参数）、A:362-368（输出schema/render）、A:369-380（execute：两种错误）、A:209-269（`prepare`：加载技能、预算错误、返回文本结构）、A:156-168（assetRoot 校验/注册前置）、RT:14-27（mode/phase 枚举）、RT:89-96（空路由）、C:110-114,145-236（`readDesignContext` 校验/错误/返回）、R2:88-128（`readBundledText` 预算与 UTF-8 处理）。

---

## 五、`design_stop`

### 签名

- **注册条件**：无条件注册于 `hey-design-automatic` 插件的 `apply` 中（前置同 `design_begin`）。
- **签名**：`(_args: {}, exec: ToolExec) => Promise<string>`

### 参数表

| 参数 | 类型 | 必填 | 说明 |
|---|---|---|---|
| （无） | — | — | 参数对象为空 `{}`，不接受任何字段 |

### 返回

返回单个 JSON 字符串（输出 schema 为 string，`render` 原样作为 text 输出），内容恒为冻结的空路由：
```
{"active":false,"origin":"none","mode":"operate","phase":"create","project":null,"brief":""}
```
该值与入参、`exec` 状态无关，恒定不变。

### 错误文本（逐字）

- 无。该工具不主动抛错，也不做参数校验。

### 副作用

- 若 `exec.agent` 存在，删除该 Agent 对应的"自动准备设计上下文"缓存条目；若不存在则无此动作。
- 不写文件、不删除项目文件或设计决策、不停止 designer 子智能体、不发起模型请求、不改动虚拟资源容器或路由投影持久状态。
- 仅影响后续 `systemPrompt` 上下文中是否注入自动准备的设计文本。

### 边界条件

- **空 / 无参**：正常调用，返回空路由字符串。
- **无 Agent**：`exec.agent` 不存在时不清理缓存，仍返回同样的空路由字符串，不报错。
- **不存在 / 幂等**：重复调用无累积副作用，每次都返回相同字符串。
- **越权**：无参数，无可越界路径；不触碰文件系统。
- **超长 / 非 UTF-8**：不适用（无输入文本）。
- **并发 / 取消**：无异步 I/O，不读取 `exec.signal`；取消信号不影响其执行。

### 证据出处

A:387-406（工具名/描述/空参数/输出schema/render/execute/presentCall）、A:398-400（清理 `contexts` 与返回 `JSON.stringify(EMPTY_DESIGN_ROUTE)`）、A:270-279（`systemPrompt` 使用 `contexts`）、RT:89-96（`EMPTY_DESIGN_ROUTE` 冻结值）。

---

## 六、自查（遮住 src，仅凭本文复述）

| 工具 | 参数可复述 | 错误文本可逐字复述 | 副作用可复述 | 边界可复述 |
|---|---|---|---|---|
| `design_project_create` | ✅ 8 参 + 注册条件 | ✅ 8 条 + 底层不包装 | ✅ 5 文件/覆盖/复制检测 | ✅ 空/超长/越权/不存在/已知行为 |
| `design_project_status` | ✅ 1 参（可选） | ✅ 3 条 | ✅ 只读/两模式 | ✅ 空/不存在/越权/非目录 |
| `design_begin` | ✅ 4 参 | ✅ 15 条（含子模块） | ✅ 只读/加载/在途登记 | ✅ 空/超长/越权/不存在/取消 |
| `design_stop` | ✅ 无参 | ✅ 无 | ✅ 清缓存/不动文件 | ✅ 幂等/无 Agent |

自查结论：四段均满足"签名 → 参数表 → 返回 → 错误文本 → 副作用 → 边界条件 → 证据出处"七段齐全；错误文本逐字；无"先 X 再 Y"式算法描述；冻结契约独立成节。遮住 src 后，读者可仅凭本文复述每个工具的参数、错误、副作用与边界，满足 README 的合格标准。

> 校对备注（已定稿 2026-11-18）：任务描述称 `design_project_create` 返回体 `system` 硬编码为 `'UMA'`；
> 但证据来源 `src/types/index.ts:1026` 与打包运行时 `lib/index.js:862` 均为 `'HEY'`。
> `'HEY'` 是 HeyWork 改名后的正确值，本 spec 按证据逐字记录，重写时保持该硬编码不变。
