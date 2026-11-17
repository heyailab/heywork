# UMA Windows 版：从「整合移植」转向「理解后 1:1 重写」

> 决策时间：2026-11-17
> 取代关系：本文件定义**新方向**。`PLAN.md` / `WINDOWS-DEV.md` 保留为「整合移植」路线的完整记录与回滚基线；
> 两者冲突时，**功能范围以 `notes/parity-gap-review.md` 的差异矩阵为准，实施方式以本文件为准**。

## 0. 方向变更

| | 旧路线（已完成，保留） | 新路线（本次确定） |
|---|---|---|
| 代码来源 | 把 Mac 包里的 `lib/*.js` 原样 vendor 进来，注入官方 dsh | 理解运行机制后，**自己重写**等价实现 |
| 交付形态 | 23 个编译产物包 + 22 开关 | 自研包 + 22 开关 + 官方 dsh 基线 |
| 依据 | `lib` 逐字节复用，SHA-256 可追溯 | 行为 1:1（接口/输入输出/错误文本一致），内部实现自由 |
| 已有资产 | — | **45 个还原的 `.ts` 当规格说明书**，不是要编译的源码 |

**关键边界**：技能等**不加密的数据直接用**；其余 TS 逻辑自己重写。
我们刚做的 `src/*.ts` 还原件价值在这里升级——它不是「编译草稿」，而是**重写时的行为规格来源**：
它精确记录了工具名、参数 schema、错误文本、控制流和边界条件。

---

## 1. 分层决策：什么直接用、什么重写、什么借官方

这是整个计划的地基。先把 23 个包 + 数据资产分到三类。

### 1.1 A 类：纯数据，直接复用（不重写）

| 资产 | 内容 | 复用方式 |
|---|---|---|
| `resources.umadb` | 20 技能 + 507 设计系统 + 84 DESIGN.md 品牌 + 824 JSON / 657 CSS / 517 HTML / 37 CSV | 原样带上；容器解析逻辑重写但**格式不变**（AAD/密钥/压缩算法必须逐字节兼容，否则旧容器读不开） |
| `brand/` | 图标 ico/png/tray | 直接用 |
| `renderer/` | 欢迎页 / 更新页 / 强制更新帧覆盖 | 直接用（若确认保留品牌壳） |
| locale 8 语 | 20 包 × 8 语言 | 文案直接复用，键集合纳入回归门禁 |
| `uma-platform.patch.mac.yml` | 22 开关原文 | 作为行为规格，win32 覆写保留 |

**注意**：umadb 里的 18 个 `.py` 是构建期资产，运行期不执行；重写时保持「只读虚拟路径」语义即可。

### 1.2 B 类：官方 dsh 已有，直接复用或薄适配（不重写）

这些在官方 `39163dd` 里已存在，UMA 只是换配置或加了一层：

| 官方包 | 用途 | 我们的动作 |
|---|---|---|
| `team/agent-team` + `tool-agent-team` | 团队板原语 | 直接用，只保留 UMA preset 与总监提示词（A 类数据） |
| `experimental/worktree` + `tool-worktree` | git worktree | UMA 版 `dsh-worktree` 有 `uma-` namePrefix 等定制；**先评估差异**再决定薄适配还是重写（见 Phase 1） |
| `sandbox/*` | Windows ACL / bash / pwsh 沙箱 | 直接用，重写包只调用公开 API |
| `subprocess` / `sandbox-ssh` / `ssh` | 子进程与 SSH 底层 | 直接用；SSH 工具若做，复用这里的 `resolveExecutable` 与 confinement |
| `typert` / `boot/plugin-manager` / `skill` / `session` | 协议与服务注册 | 直接用，重写包按公开 API 接入 |
| `feedback` | 反馈通道 | UMA 的 `uma-feedback` 只是配置（origin/超时），大概率不需重写 |

### 1.3 C 类：必须自己重写（DeepSeek 私有、官方无对应）

按依赖顺序分四组，**共 12 个逻辑单元**：

| 组 | 包 | 工具/能力 | 还原件规模 | 优先级 |
|---|---|---|---|---|
| **C1 数据底座** | `dsh-skill-uma`（重写容器读取层） | `uma_resource_read` + 技能注册 | 357 行 | P0（所有人依赖它） |
| | `dsh-tool-uma-design` | 11 个 `design_*` + `uma_knowledge_search` | 2,376 行 | P0 |
| **C2 交付与团队** | `dsh-tool-uma-workflow` | `uma_artifact_write/read` + gate | 417 行 | P0 |
| | `dsh-util-uma-delivery` | 工件分级 / 脱敏 / SSH target 解析 | 1,158 行 | P0 |
| | `dsh-uma-task-budget` | `uma_session_budgets`（typert） | 832 行 | P1 |
| | `dsh-uma-guidance` | `uma_guidance`（默认禁用） | 635 行 | P2 |
| | `dsh-uma-base`（非 SSH 部分） | `uma_workspace_search` / `uma_project_memory` / `uma_experience_record` / `uma_weknora_search` | 约 800 行 | P1 |
| **C3 一等包缺失能力** | `dsh-knowledge` | embedding / PDF / node:sqlite | 8,975 行 lib | P1，需拆细 |
| | `dsh-tool-repo-wiki` + `dsh-util-repo-wiki` | `uma_wiki_lookup` + 10 个 `wiki_*` | 5,430 行 lib | P1 |
| | `dsh-coding-workbench` | 7 个 `coding_*` | 12,737 行 lib | P1，需拆细 |
| | `dsh-task-query` / 账号适配 2 个 / UI 3 个 | 服务与面板 | 视验收需要 | P2 |
| **C4 UI 面板** | 7 个客户端包 | 6 处 UI（品牌 / 设计工作室 / 知识库 / wiki / 任务预算 / remotes） | 压缩 bundle，无还原件 | P2，**按界面稿重写** |

> C3/C4 的 lib 行数大且 UI 不可还原。这部分**不建议一上来全重写**，见 §3 的收敛策略。

---

## 1.5 在哪里开发：Mac 为主，Windows 只用在两个节点

**问**：在现在的 Mac 上重写可以吗，还是要回 Windows？
**答**：**绝大部分工作在 Mac 上做，且 Mac 有 Windows 没有的优势**。只有两件事必须回 Windows。

| 工作 | 在哪做 | 原因 |
|---|---|---|
| 读还原件写 `specs/` / 写重写代码 / 单元测试 / golden 回放 | **Mac（本机）** | 纯 TS，跨平台；还原件、数据、官方文档全在本机 |
| 录 golden 基线（对照行为） | **Mac（本机）** | 本机就装着真实 UMA `1.0.0-beta4`（`/Applications/UMA Studio.app`），这是**比整合版更权威的黄金对照**——直接跑它取真实输入输出，不必等 Windows 出包 |
| 容器格式兼容测试（旧 umadb 可读） | **Mac（本机）** | Node 22.22 实测 `node:sqlite` 免 flag 可用，加解密与 brotli 全在 Node 层，与平台无关 |
| 22 开关 / 层配置 / 工具在册门禁 | **Mac（本机）** | `verify-uma-platform.mjs` 是纯文本/JSON 分析 |
| **① Windows 平台行为验证** | **必须 Windows** | 沙箱 ACL（restricted token）、`PATHEXT` 可执行解析、`~/.uma` 路径、长路径、`uma://` 协议注册、SmartScreen —— 这些在 Mac 上**无法证伪** |
| **② 最终真机出包 + 9 步验收** | **必须 Windows** | 交付物是 Windows 安装包；真实 UI 挂载与登录链只能装包验 |

**本机环境现状（2026-11-17 实测）**：Node v22.22.2（内置 sqlite 可用）、pnpm 未启用
（`corepack enable` 即可）、本地 dsh 树在 `4ee92289`（已打补丁），**但上游包尚无 `lib/` 编译产物**
（需先 `pnpm install && pnpm build`）。也就是说：

- **录 golden 有两条路**：
  1. **最准**：直接用本机 `/Applications/UMA Studio.app`（真实 beta4）跑工具调用，取真实返回；
  2. **最快**：本地 dsh 树 `pnpm install && pnpm build` 后 headless 调包（一次性成本，之后每次回放秒级）。
  建议 M1 用 ① 定基线、② 做日常回放，两者结果应一致。
- **重写代码本身不需要 pnpm / 不需要 dsh build**：自研包是独立 TS 文件，
  写 specs 和 golden 样例阶段一行上游代码都不用编译。

**Mac 上写、Windows 上跑的防坑约定**（这是从前面平台核对里提炼的，写码时就要守）：

1. 路径一律 `node:path.join` / `resolve`，不硬编码 `/` 或 `C:\`；用户目录走官方 `home-paths` 服务。
2. 不依赖符号链接 / `O_NOFOLLOW`（`dsh-knowledge` 已在 win32 跳过，重写时照抄这个分支）。
3. 子进程用 `ctx.subprocess.spawn({ argv })` + `resolveExecutable`，不写 `sh -c` / `bash -lc`。
4. 容器内部路径用 POSIX 相对名（`split(sep).join('/')`），Windows 的 `\` 在写入前归一化。
5. `.patch` 与 umadb 保持二进制/原样，别让 git 做 CRLF 归一化（`.gitattributes` 已护住）。
6. Windows 长路径：worktree 名前缀短一点，仓库别放太深（260 字符限制）。
7. UI 文案全部走 8 语 locale，不内嵌中文/英文硬编码。

→ **结论：不用现在切 Windows**。从 Mac 上的 M1 开始，等 M1 的 golden 全过、
需要验证「沙箱/路径/协议」这类平台行为时，再切一次 Windows 做节点验收即可。

---

## 2. 重写的方法论：先锁行为，再换实现

这是「1:1」能不能成立的关键。**不要对照还原的 TS 抄代码**——那还是同一份实现的复制品，
既没有降低耦合，也无法证明是独立实现。正确顺序是：

### 2.1 第一步：为每个重写单元写「行为规格」（Behavior Spec）

从三处提取，缺一不可：

1. **工具契约**：工具名、参数 schema（ zod/typert descriptor 逐字段）、返回结构、`render`/`presentCall` 形态
   —— 来源：还原件的 `defineTool({...})` 段、`lib` 的字符串字面量。
2. **错误与提示文本**：逐字列出所有错误码、`reason`、给用户看的说明文案
   —— 来源：`notes/parity-gap-review.md` 已验过 1,393 个唯一运行时字符串。
3. **副作用与边界**：写哪些文件、路径怎么算、超时/截断/并发/权限如何
   —— 来源：还原件 README 里登记的「可疑但逐字保留」点（如 `design_project_create` 的 `system='UMA'`、
   `redactDevelopmentText` 只是 best-effort、`evaluateArtifact` 用原始 content）。

规格文件放进 `specs/<包名>.md`，每个工具一节，格式固定：
`签名 → 参数表 → 返回 → 错误文本 → 副作用 → 边界条件 → 证据出处（还原件行号 / lib 文件）`。

### 2.2 第二步：建立「黄金样例」回归基线（Golden Master）

在动任何重写代码之前，**用当前可运行的整合版**跑出输入输出样例：

- 对每个工具准备 3–5 组典型输入（正常 / 空 / 边界 / 错误）
- 记录 stdout、返回 JSON、生成的文件清单与内容 hash、错误文本
- 存为 `golden/<工具名>/<case>.json`，作为重写的验收标准

**这条是整个计划的安全带**：重写后拿同样输入跑，输出必须逐字段一致。
没有 golden，所谓「1:1」只是主观判断。

> 注意：`uma_resource_read` 的 golden 要直接从 `resources.umadb` 取真实数据跑，
> 因为 A 类数据是原样复用的，它天然就是对照组。

### 2.3 第三步：逐个替换，一次一个包

顺序：`C1 → C2 → C3 → C4`。每个包走同一循环：

```
写 specs → 录 golden → 自己实现 → 跑 golden 对比 → 过门禁 → 提交
```

每完成一个包，就用自研包**替换**注入清单里的旧包，跑 `verify-uma-platform.mjs`（扩展后含 golden 校验）。
任何一个包失败就停，不叠加。

### 2.4 重写的技术约定

- 用 TypeScript 写，遵循官方 cordis 插件模型（`defineTool` / `dsh.client` / ctx 服务），
  与官方包同构——这样 22 开关、层配置、profile 机制全部不动。
- 对外接口（工具名、schema、错误文本、容器格式、`.uma/` 文件布局）**逐字一致**；
  内部实现（数据结构、算法、模块拆分、类型命名）自由。
- 依赖只用官方公开 API + Node 标准库；A 类数据通过重写后的容器读取层访问。
- 每个重写包自带单元测试 + golden 回放测试，不依赖整包出包。

---

## 3. 收敛策略：先做「能闭环的最小集」

全量重写 12 个单元 + 4 个 UI 面板是长期工程。为了避免「写到一半没法验证」，建议按三个里程碑收敛：

| 里程碑 | 范围 | 完成标志 |
|---|---|---|
| **M1 数据底座闭环** | C1（`dsh-skill-uma` 容器层 + `dsh-tool-uma-design` 11 工具）+ A 类数据 | 20 技能可读、507 设计系统可检索、`uma_resource_read` golden 全过；**不依赖任何私有一等包** |
| **M2 交付流水线闭环** | C2 的 workflow + delivery + budget + base（非 SSH） | `uma_artifact_write/read` + `uma_gate_status` + 预算 golden 全过；团队 preset 可用 |
| **M3 一等包与 UI** | C3 的 knowledge / wiki / coding-workbench + C4 的 7 个 UI | 40 工具 golden 全过、6 处 UI 出现、切语言正常 |

**M1 是最关键的验证点**：如果数据底座能在完全自研代码上跑通，就证明了方向可行；
M2/M3 只是同一模式的复制。建议在 M1 完成后就做一次阶段评审，再决定是否继续全量。

**C4 UI 面板按界面稿重写**：4 个 UI 包是压缩 bundle，没有可读源码。
重写依据改为「运行时截图 + DOM 结构 + inject 目标清单（21 个已验证）」，
用官方 `dsh.client` 模型重新实现。这部分工作量最大，但也是最能体现「重写而非照搬」的部分。

---

## 4. 验收标准（重写版）

旧验收（1:1 对齐）侧重于「包在不在、开关对不对」；重写版改为「行为对不对」：

- [ ] 每个重写包有 `specs/<包>.md` 行为规格，覆盖全部工具
- [ ] 每个工具有 golden 样例，重写后逐字段一致（含错误文本与副作用）
- [ ] 40 个工具的在册检查继续保留（`verify-uma-platform.mjs` 不退化）
- [ ] 22 开关、8 语 locale、7 个 UI entry、21 个 inject 目标继续保留在门禁里
- [ ] `resources.umadb` 格式兼容：重写后的读取层能读旧容器，反之亦然
- [ ] 真机 Windows 验收（沿用 `notes/parity-gap-review.md` §5 的 4 项 + 原 9 步）

---

## 5. 风险与对策

| 风险 | 对策 |
|---|---|
| 「重写」变成「照抄还原件」 | 以 golden 行为为准而非代码相似度；specs 只描述外部行为，不抄内部实现 |
| C3 一等包体积大（coding-workbench 12K 行），重写失控 | M1/M2 先闭环；C3 按工具拆成独立单元逐个做，不整包重写 |
| UI 无源码，界面 1:1 难保证 | 以截图 + DOM + inject 清单为规格；接受像素级差异，优先交互与入口一致 |
| 容器格式改坏，旧 umadb 读不开 | 容器作为不可变契约；重写读取层时先写格式兼容性测试（AAD/密钥/压缩/目录结构） |
| 两套实现并存导致分叉 | 每个包重写完成即替换注入清单，旧 `lib` 目录归档到 `legacy/` 只读留档，不长期双跑 |

---

## 6. 立即下一步（等你确认后执行）

1. **建 `specs/` 与 `golden/` 骨架**，把 M1 两个包（`dsh-skill-uma` / `dsh-tool-uma-design`）
   的行为规格从还原件里抽出来 —— 这是纯分析，不改任何运行时代码。
2. **录第一轮 golden**：用当前整合版跑 `uma_resource_read` + 11 个 `design_*`，存样例。
3. **M1 重写**：先写 `dsh-skill-uma` 的容器读取层（最底层的依赖），golden 过后再做 design 工具族。
4. M1 完成后阶段评审。

> 旧路线的所有产物（`lib` 包、还原的 `src`、注入脚本、门禁、CI）**全部保留**，
> 既是回滚基线，也是重写时的行为对照。不要删。
