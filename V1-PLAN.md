# HeyWork V1 — 纯官方壳 + 重写插件层（跟随官方升级）

> 决策：2026-11-18
> 取代 `REWRITE-PLAN.md` 的启动顺序：V1 **不打任何壳补丁**，账号/反馈/更新全用官方默认。
> 只维护一份资产 = 重写的 `heywork` 插件层（吸收 UMA 功能面）。官方壳零改动，跟着上游升级。

## 0. 一句话

**把 UMA 的功能变成"一组能装进官方 dsh 的插件"，而不是"一套改过的 dsh"。**

官方 dsh 原封不动；所有 UMA 能力以官方 profile/bundle/plugin 机制挂载；账号用 DeepSeek 官方账号，
不自建服务、不依赖 `studio.umayun.com`。升级时只动插件层，不动壳。

## 1. 为什么可以零补丁（证据）

| 原补丁做的事 | V1 怎么处理 | 官方原生能力 |
|---|---|---|
| 产品名/图标/协议/数据根 | **放弃**，接受官方 DSH 身份与 `~/.dsh` | 这些只是壳的品牌，不影响功能面 |
| 22 开关产品补丁 | **放弃**，插件层自己带启用配置 | profile 的 `cordis.patch.yml`（官方 plugin-manager 管理） |
| 账号指向 studio.umayun.com | **放弃**，用官方默认 | `platform.deepseek.com` / `api.deepseek.com`（已确认官方源码默认值） |
| 反馈/强更/更新 feed | **放弃**，用官方默认或关闭 | 官方 `command-feedback` / `message-feedback` 原样存在 |
| 插件挂载 | 走官方 profile 机制 | `loadProfileDirectory` + bundle 的 `dsh.profile.bundles` + `cordis.patch.yml` |

**关键发现**：我们之前的 `DSH_DESKTOP_PRODUCT_PATCH` 通道，消费端（`desktop-host/src/index.ts`）
官方有，但生产端（main.ts 传文件路径）和 `patchFiles` 参数是我们补丁加的。
V1 不走这条路，改走官方原生的 **profile 目录**（plugin-manager 管理的那套），
那里天然支持 `cordis.patch.yml` + bundle 挂载 + 版本兼容豁免（`compatibility.json`）。

## 2. 官方已提供 vs 我们要重写

### 直接用官方（不重写、不维护）

- 账号登录 / 模型推理：`dsh-deepseek-account`（DeepSeek 官方账号）
- 反馈：`dsh-command-feedback` / `dsh-message-feedback`
- 团队板：`dsh-agent-team` + `dsh-tool-agent-team`
- worktree：`dsh-worktree`（官方 experimental）
- 沙箱：Windows ACL / bash / pwsh
- 子进程 / SSH 底层 / typert / plugin-manager
- 8 语 locale 中的官方部分

### 必须自己重写（UMA 独有的功能面）

这些官方仓库里**根本没有**（已逐个核对），是 V1 的全部工作量：

| 组 | 能力 | 原 UMA 包 | 工具/功能 |
|---|---|---|---|
| **数据底座** | 技能容器读取 + 设计系统检索 | `dsh-skill-uma` + `dsh-tool-uma-design`（还原 357+2,376 行） | `uma_resource_read` + 11 个 `design_*` |
| **交付** | 工件门禁 + 编码规范 + 预算 | workflow / delivery / task-budget（还原 417+1,158+832 行） | artifact/gate/budget |
| **知识库** | 本地全文检索 | `dsh-knowledge`（官方无，8,975 行 lib） | 导入/检索/引用 |
| **Wiki** | 项目 wiki | `dsh-tool-repo-wiki` + util（5,430 行 lib） | `uma_wiki_lookup` + 10 个 `wiki_*` |
| **编码工作台** | 任务/检查/修复/评审 | `dsh-coding-workbench`（12,737 行 lib） | 7 个 `coding_*` |
| **UI 面板** | 6 处界面 | 7 个客户端包（压缩 bundle，按界面稿重写） | 品牌/设计/知识/wiki/预算/团队 |

### 数据直接用（不重写）

`resources.umadb`（20 技能 / 507 设计系统 / 84 DESIGN.md）、品牌图、8 语 locale、
22 开关原文（作为行为规格，不作为产品补丁）。

## 3. 怎么装进官方 dsh（V1 的交付形态）

一个 **heywork 组合包（bundle）**，放进官方 profile 目录即可：

```
profile 目录/
├── package.json          ← dsh.profile.bundles 里加 heywork（官方 plugin-manager 管理）
├── cordis.patch.yml      ← 挂载 heywork 各插件 + 启用配置（官方 patch 格式）
├── compatibility.json    ← 版本豁免（跨官方版本升级时的安全带）
└── node_modules/
    └── @heywork/*        ← 重写的插件（或 npm 名发布后由 plugin-manager 安装）
```

安装方式（都是官方现成能力，二选一或组合）：
1. **运行期安装**：用官方 `plugin_manager` 工具 `installBundle(spec)`，spec 支持 npm 名 / git / 本地目录；
2. **随 profile 分发**：把组合包放进 profile 目录，官方 `loadProfileDirectory` 开机自动加载。

> 首启依赖问题（原 UMA 的 11 个一等包必须开机就有）在 V1 消失：
> 因为 V1 不需要那个改过的桌面层 profile——官方 profile 自己就是完整的。

## 4. 跟随官方升级：影响与对策

| 升级会动的东西 | 影响 | 对策 |
|---|---|---|
| 官方壳源码 9 个文件 | **零影响**（V1 不打补丁） | 无需 rebase 补丁 |
| 官方账号 / 反馈 API | 低（官方自己维护向后兼容） | 我们不动这些 |
| 官方 profile 机制 / `cordis.patch.yml` 格式 | 中（我们依赖它挂载） | `compatibility.json` 版本豁免 + 每次升级跑双门禁 |
| 插件 API（`defineTool` / `dsh.client` / ctx 服务） | 中（rc 阶段可能改签名） | golden 回放：升级后跑同一批输入，输出必须逐字段一致 |
| 官方补齐 knowledge/worktree 等能力 | 中（可能与我们的重写撞车） | 到时评估切官方版还是并存；至少不是破坏性变更 |

**协议安全带**：官方 `desktop-runtime.json` 有 `hostProtocolVersion` + `schemaVersion`，
不兼容时明确拒绝启动而不是静默出错——升级出问题时是"看得见的失败"。

**唯一的长期负担**：11 个上游未发布的一等包（`dsh-knowledge` / `dsh-coding-workbench` / wiki 系列）
官方没有，永远要自己维护。这不是升级带来的，是 UMA 功能面本身的成本。

## 5. V1 里程碑（重排）

| 阶段 | 范围 | 完成标志 |
|---|---|---|
| **V1.0 骨架** | 建 heywork bundle 骨架 + 官方 profile 挂载验证 | 官方 dsh 能加载一个空的 heywork bundle，`plugin_manager list` 能看到它 |
| **V1.1 数据底座** | 重写容器读取层 + 设计工具族（11 工具） | 20 技能可读、507 设计系统可检索，golden 全过 |
| **V1.2 交付链** | workflow + delivery + budget | artifact/gate/budget golden 全过 |
| **V1.3 一等包** | knowledge + wiki + coding-workbench | 40 工具在册，golden 全过 |
| **V1.4 UI** | 6 处面板按界面稿重写 | 界面出现、切语言正常 |

每个阶段都用 **specs + golden**：写行为规格 → 录官方/UMA 基线输入输出 → 重写 → 逐字段比对。

## 6. 与旧资产的关系

- 旧 5 段壳补丁、22 开关产品补丁、vendor 的 23 个 lib 包：**全部留在 `uma-assets/`、`patches/` 作行为对照与回滚基线，V1 不使用**
- 还原的 45 个 `src/*.ts`：**升级为重写规格来源**（不是编译目标）
- `deepseek-harness/`：V1 保持**完全干净**（不 apply 补丁），跟着官方版本走

## 7. 当前状态

- [x] 纯官方壳方案确定；已确认官方 profile/bundle 挂载路径与账号默认值
- [x] `~/heycode/heywork` 干净基线（git 历史 `579d57a` + 本地提交 `ebf7d60`）
- [ ] V1.0：建 heywork bundle 骨架，验证官方 dsh 能加载
- [ ] 升官方版本一次，实测升级路径（验证 §4 的对策）
- [ ] 推送到新的 heywork 仓库（待定仓库名）
