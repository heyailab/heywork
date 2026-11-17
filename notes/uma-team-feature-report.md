# HEY 开发团队功能分析报告

> 基于 `deepseek-harness` 公开源码（commit `39163dd`，v0.2.2-rc.3）与 HEY Mac 版随包插件（`hey-assets/packages/`，与 app.asar 同源）的实证分析。
> 日期：2026-11-17 · 分析范围：团队协作（Agent Team）全链路——任务板、消息、角色、财务预算、编码流程、交付门禁。

---

## 0. 摘要

HEY 的「开发团队」**不是 HEY 私有的新系统，而是官方 dsh 的三层官方能力 + HEY 的五项增值**：

| 层 | 来源 | 内容 |
|---|---|---|
| 委派执行 | **官方** `dsh-subagent` 家族 | `subagent` / `subagent_fork` 启动子智能体，`list_agents` / `send_message` / `wait_agent` / `interrupt_agent` 控制与通讯 |
| 共享任务板 | **官方** `dsh-agent-team` + `dsh-tool-agent-team` | 持久化任务板（`team_task_create/get/list/update`），修订号乐观并发、依赖、写域声明 |
| 团队 UI | **官方** 客户端 `ui-agent-team` | 会话内团队卡片（`conversationCard: true`），展示角色与任务进度 |
| **HEY 增值 ①** | `dsh-uma-base` 层配置 | **新会话默认开启团队模式**（`defaultEnabled: true`）+ 约 1800 字的总监行为提示词（何时委派、角色命名、通讯纪律、验收纪律） |
| **HEY 增值 ②** | `dsh-uma-task-budget` | 团队共享**财务预算**：根会话与全部委派子会话共享同一服务端额度，委派不能绕过消费上限 |
| **HEY 增值 ③** | `hey-subagent-workspaces`（dsh-uma-base） | 把委派子会话归属到与父会话同一的规范工作区，保证「成员共享同一检出目录」 |
| **HEY 增值 ④** | `dsh-coding-workbench` + `dsh-worktree` | 团队编码的证据链：隔离 worktree、编辑后验证、自动修复、版本化验收 |
| **HEY 增值 ⑤** | `.hey/` 工件 + 门禁（`dsh-tool-uma-workflow` / `dsh-util-uma-delivery`） | 交付文档与三级门禁；**团队模式下编程验收要求任务板已收尾** |

一句话：**官方提供「子智能体 + 任务板」的协作原语，HEY 把它产品化成一个「项目总监模型」的开发流程**——默认开启、行为约束写进提示词、钱由服务端管、活由证据链和门禁把关。

---

## 1. 组件全景

### 1.1 官方协作原语（`deepseek-harness/packages/subagent/`、`packages/team/`）

| 包 | 职责 | 模型工具 |
|---|---|---|
| `dsh-subagent`（`packages/subagent/subagent`） | 子智能体运行时：启动、续聊、分叉、恢复；子代理各有独立 Session | `subagent`、`subagent_fork` |
| `dsh-tool-subagent-control` | 队员控制与通讯 | `list_agents`、`send_message`、`wait_agent`、`interrupt_agent` |
| 子代理实现家族 | `subagent-spawn-in-process`（同进程）、`subagent-fork-in-process`、`subagent-acp`、`subagent-claude-code`、`subagent-codex`、`subagent-dsh-sdk` | 不同运行时的委派后端 |
| `dsh-agent-team`（`packages/team/agent-team`） | **持久化共享任务板服务**：任务归属、依赖、修订并发、投影到客户端 | （无工具，纯服务） |
| `dsh-tool-agent-team` | 任务板工具 + 协作政策提示词 | `team_task_create`、`team_task_get`、`team_task_list`、`team_task_update` |

`dsh-agent-team` 的实现要点（`agent-team/src/`）：

- `task-board.ts` + `task-graph.ts`：任务状态机（`pending → in_progress → completed`，`deleted`），`blockedBy` 依赖图，`writeScopes` 写域声明。
- `journal.ts`：**串行化的 Lead 日志事务**——所有任务修改经主会话日志追加，天然持久、可回放。
- `projection.ts`：从日志回放出 `agentTeam` 客户端视图；投影损坏时任务操作报 `TEAM_STATE_CORRUPT` 并停止追加（fail-loud，不静默丢数据）。
- `validation.ts` / `task-view.ts`：修订号（`revision`）乐观并发——陈旧修订的更新被拒，须重读后带新修订重试。
- 配置仅两项：`maxTasks`（默认 256）、`defaultEnabled`（默认 false，**HEY 置 true**）。

### 1.2 HEY 增值层（`hey-assets/packages/`）

| 包 | 身份 | 团队相关职责 |
|---|---|---|
| `dsh-uma-base` | HEY 私有 Host bundle | ① `agent-team` 挂载 + 默认开启；② `tool-agent-team` 挂载 + 总监提示词；③ `hey-subagent-workspaces` 生命周期消费者；④ `hey-experience-capture` / `hey-project-memory` 沉淀；⑤ HEY 4 profile 全部内置该 bundle（web / desktop / headless / sdk） |
| `dsh-uma-web` | HEY 私有浏览器层 | `ui-agent-team`（`conversationCard: true`）、`ui-hey-task-budget` 预算卡片 |
| `dsh-uma-task-budget` | HEY 私有财务服务 | 共享预算（见 §3） |
| `dsh-tool-uma-workflow` + `dsh-util-uma-delivery` | HEY 交付契约 | `.hey/` 工件工具 + 纯函数门禁（见 §4） |
| `dsh-coding-workbench` | HEY 私有编码服务 | 团队编码证据链（见 §5） |
| `dsh-worktree` | HEY 携带 | 隔离 git worktree（`<root>/.agents/worktrees/<name>`） |
| `dsh-skill-uma` | 技能容器 | `hey-team` 技能（项目总监模型）+ `collaboration-protocol.md` 跨角色协议（见 §2.3） |

### 1.3 挂载位置（桌面 profile 里的证据）

```yaml
# hey-base/cordis.patch.yml（摘录）
- id: agent-team
  name: '@deepseek-ai/dsh-agent-team'
  config: { maxTasks: 256, defaultEnabled: true }   # ← HEY 是团队产品：新会话默认带团队板
- id: tool-agent-team
  config: { guidance: |       # ← 总监行为约束，约 1800 字（何时委派/角色命名/通讯/验收）
      ... }
- insert:
    - id: hey-subagent-workspaces   # ← 委派子会话归属同一工作区
      name: '@deepseek-ai/dsh-uma-base'

# hey-web/cordis.patch.yml（摘录）
- id: ui-agent-team
  config: { conversationCard: true }   # ← 会话卡片显示角色与任务进度
- insert:
    - id: ui-hey-task-budget           # ← 预算卡片
```

---

## 2. 协作流程（总监模型）

### 2.1 完整生命周期

```
用户请求
  │
  ▼
总监（根会话）判断：普通问答→直接答；简单操作→本会话做；
  只有「需要不同角色的具体产出」才委派（用户说"单人做"必须尊重）
  │
  ├─ ① 启动具名队员：subagent / subagent_fork
  │     角色名 pm / designer / frontend / backend / qa / reviewer（可加数字后缀）
  │     每个队员 = 独立 Session + 独立上下文，共享同一检出目录
  │
  ├─ ② 任务板编排：team_task_create
  │     subject（用户可读）+ owner（具名队员）+ blockedBy（前置任务 ID）
  │     + writeScopes（允许写入的路径域）
  │     流程：list → get → claim（带 revision）→ 干活 → complete
  │
  ├─ ③ 通讯：send_message / wait_agent
  │     问题→责任角色；交接带改动文件与验证结果；评审发现→实现者
  │     ⚠ 任务板状态变更不会唤醒等待者，必须 send_message
  │     分歧升级到总监；禁止虚构讨论
  │
  ├─ ④ 财务准入（每个托管模型请求）：
  │     X-HEY-Task-ID + 预算标头 → 服务端冻结/结算/暂停裁定
  │
  ├─ ⑤ 独立评审：reviewer/QA 队员检查实现
  │     → send_message 缺陷给实现者 → 修复 → 复核 → 总监核对证据
  │
  ├─ ⑥ 交付门禁：hey_gate_status（patch / feature / product × documents / delivery）
  │     团队模式下：编程验收通过还要求任务板已收尾
  │
  └─ ⑦ 收尾沉淀：行为/架构变更 → 更新项目 Wiki；
        可复用坑与修复 → hey_experience_record（候选，复核后才可检索）
```

### 2.2 任务板机制细节（`dsh-tool-agent-team` + `dsh-agent-team`）

- **任务视图字段**（`TeamTaskView`）：`id`、`revision`、`subject`、`description`、`status`、`owner`、`blockedBy[]`、`writeScopes[]`、`ready`、`writeScopeWarnings[]`。
- **并发控制**：每次修改携带读取时的 `revision`，陈旧则拒绝；被拒绝的前置 ID 可用 `team_task_list` 重新查询后重试。
- **依赖编排**：先建前置任务，把返回的确切 ID 填进 `blockedBy`；独立任务不设依赖。
- **认领规则**：被口头指派的成员自己 claim；根会话可把任务改派给自己或任何可续聊后代。
- **写域**：`writeScopes` 是「建议性」的（advisory, not a lock）——成员共享同一文件系统，写域重叠不阻塞，但会把 `writeScopeWarnings` 报给调用方。真正的写入约束仍来自每个会话自己的沙箱策略。
- **就绪不启动**：任务 `ready` 永远不会自动唤醒队员——「任务板不是消息总线」，这是设计上的刻意分离。

### 2.3 总监提示词与 `hey-team` 技能

行为约束分两级：

1. **`tool-agent-team` 的 `guidance`（层配置，始终注入）**：何时委派 / 角色命名 / 通讯纪律 / 依赖用法 / 进度播报 / 完成时更新 Wiki 与经验。
2. **`hey-team` 技能（按需加载，容器内 `SKILL.md` + `references/`）**：
   - `collaboration-protocol.md`：跨角色交付协议——每个任务指派必须含输入来源、预期产出、允许写入路径、前置任务 ID、验收标准、验证负责人；8 类职责（产品/架构/设计/前端/后端/数据/安全/评审/文档）各自的「该问什么问题、该交什么证据」表格。
   - `plain-language-briefs.md`：把用户的口语需求翻译成「可观察行为 + 验收标准」的简报模板。
   - `standards/`、`terminology/`：术语库与标准索引，配合 `hey_knowledge_search` 消除歧义。
   - `roles/`：角色卡。

总监的关键纪律（提示词原文摘译）：「在完成之前等待必需的队员并核对其证据」「请独立评审或 QA 队员检查实现，把缺陷发给其所有者并复核修复」「UI 工作要在相关视口宽度下验证运行页面，检查对齐、共享组件、交互与空/加载/错误状态」。

---

## 3. 财务预算（`dsh-uma-task-budget`）——团队的钱袋

这是 HEY 把「团队协作」和「商业约束」绑定的地方：

- **共享口径**：记录中的根会话 + 全部 `subagent` 关系的委派子会话，绑定到**同一个服务端预算**（只追溯 subagent 关系，防绕过；超深度/循环拒绝）。**独立新根会话才有新预算**——队员不能靠开子会话获得更多消费能力。
- **服务端裁定**：冻结、消费、版本冲突、暂停（用户暂停 + 运营暂停）全部由服务端（`apps/hey-platform-go/internal/ledger/session_budgets.go`，PostgreSQL，整数货币单位）串行处理；客户端只发不含凭据的预算操作。
- **准入标头**：托管模型请求携带 `X-HEY-Task-ID` 与预算元数据；预算元数据读取失败会**阻止模型请求发出**（fail-closed）。凭据只存在 Host 请求状态，不进模型上下文。
- **额度操作**：`remote['hey-budget']` 提供 `read` / `update`；更新必须带读取到的版本号 + CNY 十进制字符串额度（`null` = 不加会上限，账号余额与 API key 额度仍生效）+ 目标状态；暂停不释放已受理请求的冻结金额。
- **本地存储刻意极简**：数据域 v1 只有 `{ installationId: null }` → 初始化写一个随机安装 UUID；发给服务端的会话引用 = hash(安装 UUID, 根会话 ID)，本地不存令牌、额度或用量。
- **并发**：并发子会话共享一次进行中的元数据读取；取消一个子会话只取消该调用方的等待；换账号登录后旧请求的响应不能继续授权。

**对开发团队流程的意义**：总监派活时不需要管钱；每个队员的每次推理都在同一预算下结算，成本可见（预算 UI 卡片）、可控（用户可暂停）、防失控（运营可暂停）。

---

## 4. 交付工件与门禁（`.hey/` 流程）

团队工作的「纸面轨迹」是 `.hey/<artifact>.md` 文件 + 纯函数门禁：

| 工件 | 必需章节 | 作用 |
|---|---|---|
| `research` | 发现、待定问题 | 调研结论 |
| `prd` | 目标、验收 | 产品需求 |
| `architecture` | 组件、数据、接口 | 技术方案 |
| `uiux` | 令牌、状态、响应式 | 设计系统对接 |
| `spec` | 任务、验收 | 拆解给队员的任务规格 |
| `preview` | 预览 | 可视确认 |
| `qa` | 门禁/结果 | 测试证据 |
| `delivery` | 交付 | 交付说明 |

- **就绪判定是硬规则**（`evaluateArtifact`）：全部必需章节存在 + 无 `TODO/TBD/FIXME/XXX/Lorem ipsum` 残留 → `ready: true`；frontmatter 记录 `status` / `owner` / `updated`（owner 字段直接服务团队分工）。
- **门禁三级**（`evaluateGate(depth, phase)`）：`patch`（小修复，不要求流水线文档）/ `feature`（编码前要 spec，交付时要 spec+qa+delivery）/ `product`（文档确认只查 research+prd+architecture+uiux，不阻塞后续 QA）。`hey_gate_status` 返回缺失清单和按「缺失后未就绪」排序的阻塞列表。
- **同一契约两端用**：`dsh-util-uma-delivery` 是纯模块，Host 工具和 Web 交付工作台看板从**同一份 `.hey/` 文件**各自重算状态——看板不需要调 Host 工具或模型请求。
- **与团队的联动**：`hey-base` README 明确——「团队模式开启时，根会话的编程验收结果还要求共享任务板已收尾；成员的独立检查不受此限制。关闭团队模式保留任务并允许单智能体验收。」即：**门禁和任务板是双重闸门**。

---

## 5. 编码证据链（`dsh-coding-workbench` + `dsh-worktree`）

团队里「写代码」的部分有一套独立的证据机制：

- **7 个工具**：`coding_task`（隔离任务管理）、`coding_inspect`（查历史修复经验/标准指南）、`coding_check`（执行项目检查，`scope: changed` 只测受影响检查）、`coding_repair`（start/read/cancel，受修复上限约束）、`coding_review`、`coding_acceptance`（版本化验收标准）、`coding_restore`。
- **编辑后验证策略**（`coding-edit-policy`，HEY 用 `advise` 模式）：跟踪 `write/edit/apply_patch` 改过的文件，每次编辑附提醒；**只有真实通过的检查才能解除待验证义务**——失败的检查不能给后续编辑背书，跳过检查也不能。
- **角色能力分档**（团队权限的关键）：工具 schema 有三档——`full`（完整工具）/ `coordinate`（总监：能读证据、记问题、定义验收，**不能执行/取消检查、不能启停修复**）/ `read-only`（文档作者与评审预设）。HEY 团队总监用 `coordinate`，「技能不能虚构独立审阅者或改变工具权限」。
- **经验自动召回**（`/experience-recall`）：新用户任务获准时自动检索手写台账 + SessionQuery 历史 + 保留的修复事实；中文无空格分词；历史片段标记为不可信参考数据。
- **压缩保护**（`/compaction-refresh`）：长会话压缩后，在下一次请求末尾追加当前待办、复验状态与未解决问题，团队长流程不丢上下文。
- **隔离执行**（`dsh-worktree`）：从本地提交创建隔离检出（`.agents/worktrees/<name>`），新分支、不动源检出；暂存/未跟踪文件不复制；`coding_acceptance` 验收的对象就是这些可恢复的隔离任务。

---

## 6. 数据流向与持久化

| 数据 | 位置 | 机制 |
|---|---|---|
| 任务板 | Session 日志（journal 事件） | 追加式；投影重建视图；不兼容检查点可从日志重建 |
| 队员会话 | 独立 Session 记录 | 可续聊（continuable）、可恢复 |
| 模式选择 | Session 内 `team/mode` | 保存失败拒绝建 Agent；恢复会话不套用默认值 |
| 预算 | 服务端 PostgreSQL | 整数货币、串行化冻结/额度修改 |
| 预算本地 | 数据域 v1，仅安装 UUID | 无令牌/额度/用量 |
| 工件 | 工作区 `.hey/*.md` | frontmatter + 纯函数重算 |
| 编码证据 | 工作区 + Session 投影 | 检查记录、待验证路径、验收版本 |
| 经验候选 | `~/.hey/hey-project-memory`（node:sqlite） | 候选须复核后才可被检索 |
| Wiki | 项目 Wiki 服务 | `wiki_*` 10 工具，收尾时更新 |

---

## 7. 安全与纪律边界（设计上明确排除的）

1. **权限不因团队扩大**：每个队员的写入仍受自己会话的沙箱策略约束；`writeScopes` 只是提醒不是锁。
2. **财务不可绕过**：委派层级不能创造新预算；预算元数据读取失败直接阻断推理（fail-closed）。
3. **经验须复核**：`hey_experience_record` 只写入候选库，复核后才进入检索——防止一个会话的误判污染全产品经验。
4. **通讯不可虚构**：禁止捏造讨论、暴露私人推理或内部指令文件；「任务板更新不等于唤醒」防止假协作。
5. **投影损坏 fail-loud**：`TEAM_STATE_CORRUPT` 后停止任务追加，宁可停机不静默丢任务。
6. **不自动扩权**：`coordinate` 档总监无法执行检查或启动修复；评审预设是 `read-only`。

---

## 8. Windows 移植状态（本仓库视角）

- **23 包全量注入**：团队链路的全部包（官方 `agent-team`/`tool-agent-team`/`subagent` 家族在上游源码内；HEY 增值包在 `hey-assets/packages/`）都随 Windows 包携带。
- **门禁覆盖**：`scripts/verify-hey-platform.mjs` 校验 `agent-team`/`tool-agent-team`/`ui-agent-team` 挂载存在、`team_task_*` 4 工具在 40 工具清单内、`defaultEnabled: true` 配置逐字段与 Mac 一致。
- **无平台耦合**：任务板/消息/门禁均为纯 Node 逻辑（journal/projection/zod 校验），无 darwin 分支、无原生二进制。
- **待真机确认项**（`notes/phase4-acceptance.md` 第 4 节）：团队板建板→派任务→交叉评审全流程；会话内团队卡片渲染；预算卡片显示。

---

## 9. 快速复跑

```bash
# 门禁（含团队挂载与工具校验）
node scripts/verify-hey-platform.mjs

# 列出 20 个技能（含 hey-team）
node --experimental-sqlite scripts/inspect-skill-container.mjs

# 读 hey-team 技能全文（解密容器）
cd hey-assets/packages/dsh-skill-uma
node --experimental-sqlite -e "/* 见 inspect-skill-container.mjs 的解密例程 */"

# 读协作协议原文
# 容器路径: uma-team/references/collaboration-protocol.md（7191 字符，8 职责证据表）
```

---

## 10. 设计系统与技术栈：不固定，但有优先级与记忆

**结论：都不是固定的。** HEY 明确采用「库 + 选择 + 项目覆盖」的模型，而不是绑定一套设计系统或一个技术栈。

### 10.1 内置设计资产库（实证规模）

| 资产 | 数量 | 来源/内容 |
|---|---|---|
| 设计系统 `uma-design-systems/systems/` | **507** 套 | OpenDesign 源归档；每套含 `DESIGN.md`、`tokens.css`、`design-tokens.json`、`tailwind-v4.css`、`components.html`、`components.manifest.json`、`USAGE.md` |
| DESIGN.md 参考 `uma-design-md/brands/` | **84** 套 | awesome-design-md 源归档（品牌级交互配方） |
| 品牌身份元数据 | **445** 个 | Simple Icons（CC0） |
| 设计数据表 `hey-design-system/data/` | **35** 个 CSV | colors 193 / google-fonts 1935 / icons 106 / products 193 / landing 35 / app-interface 33 / charts 26 / motion 18 … |

即：不是「HEY 只有一套设计语言」，而是「507 套可选 + 项目自有品牌优先」。

### 10.2 选择优先级（README 原文语义）

```
1. 用户明确选择（点名某系统 / 上传设计稿 / 指定品牌）
2. 复制来的设计提示词、自然语言风格描述
3. Agent 按产品类型、受众、信息密度、已有品牌自行选择
   —— 且「已确认品牌与现有组件优先于内置灵感」
```

选择结果**记录到 `DESIGN.md`**，跨页面复用；`design_project_create` 在 `.design/<project>/` 写本项目专属的 `design` / `tokens` / `components`（不复制内部参考文件）。后续会话通过 Session 投影恢复「选定项目」。

### 10.3 项目级覆盖机制

- `design-system/MASTER.md` —— 项目级设计主文件（`design_context` 优先读取）
- `design-system/<project>/MASTER.md` + 页面覆盖文件 —— 多包/多产品细分覆盖
- `.design/<project>/` —— 由 `design_project_create` 生成的三件套契约
- 读取有硬约束：单项目 32KB、单次 96KB、非普通文件/符号链接/路径越界/二进制一律拒绝并标为不完整

### 10.4 技术栈同样不固定

- `design_context` **从执行目录读取项目声明的依赖与框架**，不预设栈；「正式修改使用现有框架」，单文件 HTML 只在明确原型请求时使用。
- 设计系统资产同时提供 **CSS 变量（tokens.css）与 Tailwind v4（tailwind-v4.css）两种交付格式**，按项目现状选用。
- 编码侧同理：`coding_inspect` 标准模式按项目清单识别语言/框架，从 **14 篇双语指南 / 23 条条件化规则 / 12 组官方来源** 中选择；**仓库现有约定优先于不兼容的风格偏好**，且「选择规范不代表合规通过」。

### 10.5 团队流程中的三条硬约束

1. 设计动作以 `design_begin` 开始、`design_stop` 结束，设计决策交接给前端时须说明「版式与组件应如何呈现」，并在运行页面上核对。
2. 门禁的 `uiux` 工件必须含「令牌、状态、响应式」三章节，否则不算就绪——**设计系统选择的产物要落到文档里**。
3. 总监提示词明确：尊重用户选择与**已批准的品牌**；不得擅自更改业务规则或选用不兼容技术栈（`hey-team` 技能同款约束）。

### 10.6 一致性怎么保证（不固定但不漂移）

- 选择一次性记录在 `DESIGN.md` + `.design/<project>/`，后续页面复用而非重新选型。
- 项目级 `MASTER.md` 覆盖优先级高于内置库，保证「同一项目一套语言」。
- 交接必须携带设计决策（令牌/组件/状态），评审用运行截图核对——不靠口头一致。

---

## 附：与「官方直接装」的关系

团队功能全部组件**符合官方插件标准**（§见 WINDOWS-DEV.md 3d）：官方部分（subagent 家族、agent-team）本就是上游 workspace 成员；HEY 增值包经未改动 Loader 加载。若想在官方 dsh（非 HEY 打包版）上复现团队功能，最小配置是官方 README 给出的两行：

```yaml
- name: '@deepseek-ai/dsh-agent-team'
- name: '@deepseek-ai/dsh-tool-agent-team'
```

再加 `defaultEnabled: true` 即得「新会话默认带团队板」；HEY 的其余增值（预算需要服务端 ledger、门禁需要 `dsh-util-uma-delivery`、总监提示词在层配置里）按需逐项叠加。
