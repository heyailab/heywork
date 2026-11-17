# HeyWork 开发计划 v2 — 从规格到可运行插件层

> 制定：2026-11-18
> 取代：散落在 `V1-PLAN.md` / `REWRITE-PLAN.md` 里的里程碑描述（那两份保留为背景与取证）.
> 本文件是**唯一执行入口**：每个阶段做什么、产出什么、怎么验收、卡住怎么办。

## 0. 已定案的前提（不再讨论）

| 决策 | 结论 | 依据 |
|---|---|---|
| 壳 | 官方 dsh 原封不动，**零补丁**，跟随上游升级 | V1 路线 |
| 账号/反馈/更新 | 全用官方默认，不自建、不等域名 | 官方账号 = `platform.deepseek.com` |
| 功能来源 | 理解 UMA 机制后**重写**，不照搬 lib | 用户明确 |
| 数据 | 技能容器/品牌/locale 直接用 | 非代码资产 |
| 挂载方式 | 官方 profile/bundle 机制 | 静态实测等价（`PROBE-RESULT.md`） |
| 环境 | Mac 开发为主，Windows 只做平台验证 + 出包 | `REWRITE-PLAN.md` §1.5 |

**端到端测试现状**：pnpm install 在本环境被沙箱拦截（非方案问题），
所以 V1 的等价性由**源码证据 + 静态实测**确认，端到端验证推迟到可运行 pnpm 的环境。
**不阻塞开发**——下面每个阶段的验收都不依赖 pnpm install。

## 1. 开发方法论：spec → golden → rewrite → verify

每个功能单元严格走四步，**不写 spec 不动手写代码**：

```
① spec     从还原的 src/*.ts 提取外部行为（签名/参数/返回/错误文本/副作用/边界）
② golden   从原 UMA 实现录输入输出样例（正常/空/边界/错误各一组）
③ rewrite  按 spec 自己实现，不抄源码（以行为一致为准，不以代码相似为准）
④ verify   golden 逐字段比对 + 双门禁
```

**spec 格式**（固定七段）：
```
签名 → 参数表 → 返回 → 错误文本 → 副作用 → 边界条件 → 证据出处（src 行号）
```

**golden 格式**：`golden/<包>/<工具>/<case>.json`，含 `input` / `expected` / `sideEffects`。

**红线**：spec 只描述**外部行为**，不描述内部算法。如果 spec 里出现"先遍历再排序"这类实现细节，说明在抄代码而不是理解行为。

## 2. 阶段总览

| 阶段 | 名称 | 核心产出 | 验收标准 | 依赖 |
|---|---|---|---|---|
| **P0 ✅** | 规格冻结 | 8 个服务端包的完整 specs（2,843 行，已入库 `c35d38b`） | 八份全部 7/7 段齐全，无算法描述 | 无 |
| **P1 ✅** | 数据底座 | 容器层（`a12cc6c`，23/23 golden + 双向兼容）+ design 11 工具（`6fa143d`，三自测 + 整体注册全过） | 20 技能/507 系统可读，11 工具注册 | P0 ✅ |
| **P2 ✅** | 交付链 | workflow / delivery / budget 三包（`5b93089`，自测 74+23+全过，exit=0） | artifact/gate/budget 行为对齐 spec | P1 ✅ |
| **P3** 🔄 | 一等包 | knowledge + wiki + coding-workbench：先从 lib 提取 spec（无还原件），再重写 | 40 工具在册 | P1,P2 ✅ |
| **P4** | UI 面板 | 6 处界面按界面稿重写 | 界面出现、inject 目标解析 | P3 |
| **P5** | 集成出包 | profile bundle 打包 + Windows 真机验证 | 装包后 9 步验收 | P1-P4 |

## 3. P0 — 规格冻结（现在开始）

### 目标

把 8 个服务端包的行为**完整提取成 spec**，作为后续所有重写的需求文档。
此阶段**不写任何运行时代码**。

### 任务

| # | 任务 | 产出 | 工作量估计 |
|---|---|---|---|
| P0.1 | 建 `specs/` 骨架 + spec 模板 + 索引 | `specs/README.md`、模板 | 小 |
| P0.2 | `dsh-skill-uma` 容器读取层 spec | `specs/skill-uma.md` | 中（6 个 API） |
| P0.3 | `dsh-tool-uma-design` 11 工具 spec | `specs/tool-uma-design.md` | 大（22 个 defineTool 中 11 个是工具） |
| P0.4 | workflow 3 工具 + delivery + budget spec | `specs/workflow.md` / `delivery.md` / `budget.md` | 中 |
| P0.5 | base 非 SSH 部分（4 工具）spec | `specs/uma-base.md` | 中 |
| P0.6 | guidance spec | `specs/guidance.md` | 小 |
| P0.7 | specs 交叉评审：检查每个 spec 有没有混入实现细节 | 评审记录 | 小 |

### P0 验收标准

- [ ] 每个工具都有七段完整 spec
- [ ] 错误文本逐字抄录（不是"报错"这种概括）
- [ ] 边界条件覆盖：空输入、超长、越权、路径不存在、并发
- [ ] 每个 spec 都有证据出处（哪个 src 文件第几行）
- [ ] 随机抽 3 个 spec，能让没看过源码的人独立实现出来

### 为什么 P0 最重要

这是"重写"和"照抄"的分水岭。spec 写得好，P1-P4 就是照着需求实现；
spec 写得差，就会退化成对着 src 逐行翻译——那等于换了个名字照抄。

## 4. P1 — 数据底座（第一个可运行的东西）

### 目标

重写 `dsh-skill-uma` 的容器读取层 + `dsh-tool-uma-design` 的设计工具族，
让 20 技能可读、507 设计系统可检索。

### 任务

| # | 任务 | 产出 | 验收 |
|---|---|---|---|
| P1.1 | 建 golden 录制工具 | `scripts/record-golden.mjs` | 能从原 UMA lib 录输入输出 |
| P1.2 | 录容器读取层 golden | `golden/skill-uma/*.json` | 覆盖 6 个 API 的正常/边界 |
| P1.3 | 重写容器读取层（AES-GCM/brotli/虚拟路径） | `packages/heywork-skill/src/` | 能读旧 umadb，golden 全过 |
| P1.4 | 录 11 个 design 工具 golden | `golden/design/*.json` | 每工具 3-5 组 |
| P1.5 | 重写 design 工具族 | `packages/heywork-design/src/` | golden 全过 |
| P1.6 | 容器格式兼容测试 | 测试脚本 | 旧 umadb 能读、新容器旧代码也能读 |

### P1 验收标准

- [ ] 20 个技能全部可通过 `hey_resource_read` 加载
- [ ] 507 设计系统可列举、manifest 可读
- [ ] 84 个 DESIGN.md 品牌可读取
- [ ] 所有 golden 逐字段一致（含错误文本）
- [ ] 容器密钥/虚拟路径/AAD 与旧版字节级兼容（冻结标识不变）

### P1 的特殊意义

P1 做完，你就有了**第一个不依赖任何旧 lib 的自研组件**——
它能读旧数据，但代码是你自己的。这验证了整个重写路线。

## 5. P2-P5 摘要（展开见后续每阶段开始时细化）

| 阶段 | 关键任务 | 最重要的验收 |
|---|---|---|
| **P2 交付链** | 录 artifact/gate/budget golden → 重写 → 验证 `.hey/` 落盘 | 工件分级、预算拦截行为一致 |
| **P3 一等包** | knowledge（本地检索）+ wiki（10 工具）+ coding-workbench（7 工具） | 40 工具全在册；注意这三个官方没有，是长期维护负担 |
| **P4 UI** | 按运行时截图 + DOM + 21 个 inject 目标重写 6 处界面 | 界面出现、8 语切换正常 |
| **P5 集成** | 打包成官方 profile bundle → Windows 真机装包 | 9 步验收全过；账号走官方 DeepSeek |

## 6. 现实约束与应对

| 约束 | 影响 | 应对 |
|---|---|---|
| pnpm install 被沙箱拦截 | 端到端测试跑不了 | P0-P4 不依赖它；P5 前换到能装依赖的环境（Windows 或本机非沙箱终端） |
| Node 22 vs 官方要 24 | 部分测试可能不兼容 | P0-P4 用 Node 22 足够（纯 TS 分析）；P5 用 Node 24 |
| 域名待定 | 账号/反馈/更新 | V1 全用官方默认，**不阻塞** |
| 新仓库名待定 | 无法推送 | 本地提交先走，命名稳定后再推 |

## 7. 立刻开始

**下一步：P0.1 — 建 specs 骨架和模板。**

然后按 P0.2 → P0.7 顺序冻结规格。P0 全程不写运行时代码，
只产出"能让别人照着实现"的需求文档。

## 8. 文档导航

| 文档 | 作用 |
|---|---|
| **本文件（DEV-PLAN.md）** | **唯一执行入口** |
| `HEYWORK.md` | 项目总纲、命名边界 |
| `V1-PLAN.md` | V1 路线背景、升级影响分析 |
| `REWRITE-PLAN.md` | 重写方法论详述、A/B/C 分层 |
| `PROBE-RESULT.md` | 挂载等价性取证、端到端方案 |
| `README.md` / `PLAN.md` / `WINDOWS-DEV.md` | 旧路线记录（回滚基线，不改） |
