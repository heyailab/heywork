# P5 执行清单 — Windows 真机集成与验收

> 编写日期：2026-11-18。面向"回到 Windows 接着开发"的执行者。
> 前提：P0–P4 已全部完成（自研代码 13,067 行 / 58 次提交 / 已推送 `heyailab/uma-window`）。
> **这份清单是 V1 路线**（纯官方 dsh 壳、零壳补丁、只维护 heywork 插件层），
> 不是旧整合路线——注意与 `notes/phase4-acceptance.md` 的旧 9 步区分（那份已被本文件取代）。

---

## 0. 开始之前：新仓库迁移（用户会提供新地址）

当前 remote 指向旧仓库 `heyailab/uma-window`（私有）。拿到新仓库地址后：

```powershell
cd C:\path\to\heywork
git remote set-url origin <新仓库地址>
git push -u origin main          # 全部 58+ 提交
git remote -v                    # 确认
```

**必须带上但不在 git 里的东西**（deepseek-harness 是 gitignore 的，Windows 要重新 clone）：
- P5 端到端探针：本仓库 `p5/heywork-probe.spec.ts`（已从 Mac 的 dsh 树迁入）
- 官方 dsh 源码：到 Windows 后重新 clone（见 §1）

---

## 1. 环境准备（Windows）

| 项 | 版本 | 说明 |
|---|---|---|
| Node | **24.9.0** | 官方要求；本机 Mac 是 22，P0–P4 够用，P5 必须 24 |
| pnpm | **11.28.5** | `corepack enable` 激活；CI 里用的是这个版本 |
| Git for Windows | 任意新版 | SSH/operations 工具需要 Git bash 在 PATH |
| 磁盘 | ≥ 5 GB 空闲 | dsh 依赖树 + 出包产物 |

```powershell
# 用 nvm-windows 或 winget 装 Node 24 后：
node -v        # v24.x
corepack enable
corepack pnpm --version    # 应显示 11.x；若不符：corepack pnpm@11.28.5 --version
git --version
```

> 若官方 pin 的 pnpm 版本与本机不同，以 `deepseek-harness/package.json` 的
> `packageManager` 字段为准。

---

## 2. 拉取官方 dsh（干净基线，零补丁）

```powershell
cd C:\path\to\heywork
git clone https://github.com/deepseek-ai/deepseek-harness.git deepseek-harness
cd deepseek-harness
git checkout 39163dd30f703a79079e2d2446545cff3c453738    # V1 pin 的 commit
git status --short                                          # 必须干净：V1 不打任何补丁
cd ..
```

**关键**：`git status` 必须为空。V1 的价值就在于官方壳原封不动，跟着升级零冲突。
如果这里 apply 了任何 `patches/*.patch`，就走回旧整合路线了——不要做。

---

## 3. 装依赖 + 跑端到端探针（P5 第一道真实门槛）

这一步验证 V1 的核心假设：**heywork 通过官方 profile/bundle 挂载后，权限/能力/叠加顺序与原 UMA 等价**。

```powershell
cd deepseek-harness
corepack pnpm install --frozen-lockfile
# 把探针放回 dsh 树（它在 gitignore 目录里，必须从仓库的 p5/ 复制）
copy ..\p5\heywork-probe.spec.ts packages\boot\plugin-manager\tests\
corepack pnpm vitest run packages/boot/plugin-manager/tests/manager.spec.ts
corepack pnpm vitest run packages/boot/plugin-manager/tests/heywork-probe.spec.ts
```

**判断标准**（详见 `PROBE-RESULT.md` §6）：

| 结果 | 结论 / 动作 |
|---|---|
| 两个测试全绿 | V1 定案，走 profile bundle |
| manager 绿、探针有差异 | 逐项排查；叠加顺序问题就把 22 开关挪进 bundle patch |
| manager 都跑不起来 | 环境问题（Node/依赖），不是方案问题——先修环境 |

探针断言三组：① `ctx.subprocess/sandbox/tools/credentials` 都在（权限等价）；
② 22 开关最终值与原 UMA 一致（叠加等价）；③ 客户端 entry 能被 Loader 扫到（UI 挂载等价）。

> 如果探针因官方内部 API 变动失败（rc 阶段常见），**不要改官方源码**——
> 按 `PROBE-RESULT.md` §5 的 Plan B：保留打包期注入、但去掉账号/品牌补丁。

---

## 4. 组装 heywork profile bundle（脚本已完成 ✅）

`scripts/build-profile.mjs` 已写好并在 Mac 上验证通过（纯 Node，不依赖 pnpm）。
到 Windows 直接运行：

```powershell
node scripts\build-profile.mjs        # 生成 profile-build/ 并自校验
node scripts\build-profile.mjs --verify-only   # 只校验不重建
```

生成结构（格式依据官方 `profile.ts:198` 与 `manager.spec.ts:52` 实证）：

```
profile-build/
├── package.json          ← dsh.profile.bundles: ["heywork"]
├── cordis.patch.yml      ← 用户 patch 层（空 []）
├── pnpm-workspace.yaml   ← hoisted linker（官方模板逐字）
├── cordis.yml            ← []
├── compatibility.json    ← 版本豁免（默认空）
└── node_modules/heywork/ ← bundle
    ├── package.json      ← dsh.bundle.patch: './cordis.patch.yml'
    ├── cordis.patch.yml  ← 8 个 host 插件行（skill/design/workflow/budget/knowledge/task-query/wiki/coding）
    └── node_modules/@heywork/*
        ├── 9 个重写包
        ├── skill/resources.umadb  ← 技能容器（9.1MB，实测可读 20 技能）
        └── ui/src/*.client.js     ← 7 个 UI 模块 + barrel（已补 dsh.client 声明）
```

用官方 `plugin_manager.installBundle(spec)` 把这个 bundle 装进 profile，或把 `profile-build/`
直接作为 profile 目录。自校验覆盖：profile 清单、bundle patch ≥8 行、10 个包齐全、
技能容器存在、UI barrel import 7 个模块。

**待真机验证的点**（静态无法证伪）：cordis 对 `export function apply` 的加载是否成功、
UI client 声明格式是否被官方 Loader 接受、bundle patch 的 `!!js` 表达式（本项目暂未用）。
若挂载失败，优先查 §3 探针；探针过但插件不出现，多半是 patch row 的 name/入口格式问题。

---

## 5. 开发循环（改代码时）

```powershell
# 快速门禁（不依赖 pnpm，随时可跑）
node scripts/verify-skill-container.mjs        # 20 技能/507 设计系统/84 品牌
node scripts/verify-uma-platform.mjs           # 22 开关/40 工具/23 包（旧口径，供参考）
node scripts/verify-client-ui-deps.mjs         # 401/401 inject 依赖闭合
node packages/heywork-ui/verify-mounts.mjs     # 17/17 UI slot 覆盖
for ($t in brand,design-studio,design-cards,knowledge,repo-wiki,task-budget,remotes) {
  node packages/heywork-ui/test-$t.mjs
}

# 出包（依赖就绪后）
cd deepseek-harness
pnpm run package:desktop:win:x64:unsigned
```

> 详细出包流程与三种迭代方式见 `WINDOWS-DEV.md`（注意那份文档部分命令是旧整合路线，
> 凡涉及 `inject-uma`/`uma-platform.patch`/品牌覆盖的步骤，V1 都不需要）。

---

## 6. 真机验收清单（V1 口径，替代旧的 9 步）

装好 Windows 包后按序做。**注意：V1 用官方 DeepSeek 身份和 `~/.dsh` 数据根，
不是 HEY 品牌和 `~/.hey`**——旧清单里的品牌页/账号部分不适用。

| # | 检查项 | 预期 | 失败说明 |
|---|---|---|---|
| 1 | 首次启动 | 官方 dsh 欢迎页（产品身份是官方，V1 主动放弃品牌壳） | 若出现 HEY 品牌，说明误用了旧补丁 |
| 2 | 数据根 | `%USERPROFILE%\.dsh` | 若写 `~/.hey`，说明旧配置残留 |
| 3 | 插件管理器 | 能看到 `@heywork/*` 9 个包 + 82 UI 依赖 + 11 一等包 | 缺包 → bundle 没装全 |
| 4 | 22 开关 | 与 `uma-platform.patch.mac.yml` 的 8 启用/14 禁用一致 | 用探针 §3 已静态验证，这里是真机复核 |
| 5 | 6 处 UI 出现 | 品牌卡/设计工作室/知识库/wiki/任务预算/团队板 | 少一处 → 浏览器模块图缺行（静态已验证 17/17 slot） |
| 6 | 工具自述 | 问"列出可用的 design/wiki/coding 工具" → 报出 `hey_wiki_lookup`/`coding_inspect` 等 | 工具没注册 → 层没挂上 |
| 7 | 技能读取 | `hey_resource_read` 读任一技能 | 失败 → resources.umadb 被打进 asar 了（必须 unpack） |
| 8 | 工件+门禁 | `hey_artifact_write` 写 feature 工件 → `hey_gate_status` 见分级 | 失败 → delivery 链未挂载 |
| 9 | 团队板 | 建板→派任务→交叉评审 | 用官方 agent-team 原语 |
| 10 | 8 语切换 | 切 ja/de 重启保持 | UI locale 未注册 |
| 11 | 登录链路 | 官方 DeepSeek 账号能登录 | V1 用官方账号，不走托管 |

**本期预期不出现**：`hey_ssh_servers` / `hey_ssh_run`（Operations 面板未移植，工具带 when 门控）。
SSH 中文路径、沙箱 ACL、PATHEXT 解析这些平台行为只能在此真机验证，Mac 上无法证伪。

---

## 7. 已知边界与待决策

- **更新 feed 状态**：`x-uma-download-state: held` 待观察，用 `scripts/probe-feed-status.mjs` 复查；
  结论未定（见 `notes/update-feed-evidence.md` §7），V1 用官方更新、不自建。
- **baseline commit**：官方 pin `39163dd`，Mac 已升 beta5 且 `dshBuildCommit=a7e944e3`；
  插件层逐字节一致，壳层 +6.6KB 差异（见 `notes/parity-gap-review.md`）。跟官方升级时重新核对。
- **beta5 备份**：Mac 包已上传私有仓库 Release（tag `uma-beta5-archive`），
  Windows 下载脚本 `scripts/download-beta5.ps1`（带 token，走 API 端点）。仅供分析，不可在 Windows 运行。

---

## 8. 一句话状态

P0–P4 全绿、静态证据充分；**§4 的 bundle 组装脚本已在 Mac 完成并验证**，
Windows 端剩两件事：① 跑 §3 端到端探针（验证 V1 挂载假设）② 出包 + §6 的 11 步真机验收。
其余都是环境问题（Node 24 / pnpm 11 / 出包）。静态无法证伪的部分（cordis 加载、UI entry、
像素/时序）已逐项标注为"需真机确认"，不要用推断代替。
