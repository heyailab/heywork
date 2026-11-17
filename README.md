# heywork — HeyWork 的 Windows 版本（官方 dsh 基线 + 重写功能面）

> **V1 路线（2026-11-18 定）**：纯官方 dsh 壳、**零壳补丁**，账号/反馈/更新全用官方默认；
> 只维护重写的 `heywork` 插件层，跟随官方升级。见 **[V1-PLAN.md](V1-PLAN.md)**。

> **当前项目总纲见 [HEYWORK.md](HEYWORK.md)**（命名边界、目录、状态、域名待办都在这里）。
>
> **方向变更（2026-11-17）**：目标从「照搬/移植插件包」转为「理解完整机制后 1:1 重写功能」——
> 不加密的数据（技能 / 设计系统 / locale / 品牌）直接使用，其余 TS 逻辑自研实现。
> 新方向见 **[REWRITE-PLAN.md](REWRITE-PLAN.md)**；本文件描述的整合路线完整保留为**回滚基线与行为对照**，
> 两套产物都不删。

把 HeyWork（Mac）的功能面 1:1 搬到 Windows：**不改写桌面应用**，而是在官方开源
[`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness)（pinned `39163dd`，v0.2.2-rc.3）之上，
叠加 HEY 的插件层、产品配置、品牌与本地化，由 GitHub Actions 在 `windows-latest` 上出包。

功能面的 95% 是插件（23 个包：40 个工具 / 20 个技能 / 6 个 UI 面板 / 22 条产品开关），
壳层只有 5 段补丁（触及 11 个上游文件）。详见 [PLAN.md](PLAN.md) 的范围边界一节。

**基线口径**（2026-11-17 复核）：插件层、开关层、工具层与 Mac `1.0.0-beta4.20261117.1`
逐项一致（内核同为 `0.2.2-rc.3`、362 个包、12 个 HEY 包、开关文件逐字节相同）；
壳层补丁基于 `beta3` 的 `main.js`，与 beta4 相差 6,617 字节，且 Mac 的 `dshBuildCommit`
（`a7e944e3`）与我们 pin 的 `39163dd` 不同——这两点是**已知差异**，判断见
[notes/parity-gap-review.md](notes/parity-gap-review.md) §4.2。

---

## 一、文档索引（全部在本仓库，clone 即得）

| 文档 | 给谁看 | 内容 |
|---|---|---|
| **[REWRITE-PLAN.md](REWRITE-PLAN.md)** | **决定新方向后所有人（先读）** | 从「整合移植」转向「理解机制后 1:1 重写」：分层决策（数据直用 / 官方复用 / 自研重写）、specs+golden 方法论、M1–M3 里程碑、验收与风险 |
| **[WINDOWS-DEV.md](WINDOWS-DEV.md)** | **Windows 开发者（先读这篇）** | 环境准备、与 CI 逐步一致的出包流程、三种迭代方式、插件两条装载路线、提交纪律 |
| [PLAN.md](PLAN.md) | 所有人 | 目标与验收标准、阶段进度（Phase 1–4）、关键事实与范围边界、风险与取舍 |
| **[notes/hey-team-feature-report.md](notes/hey-team-feature-report.md)** | 想理解 HEY 产品机制的人 | 开发团队功能全链路：官方协作原语 + HEY 五项增值、任务板机制、财务预算、交付门禁、编码证据链、设计系统与技术栈的选择机制 |
| [notes/phase4-acceptance.md](notes/phase4-acceptance.md) | 做真机验收的人 | 缺口分析（11 个上游未发布包）、门禁说明、9 步真机验收清单、复跑方式 |
| **[notes/parity-gap-review.md](notes/parity-gap-review.md)** | **想知道「还差什么」的人** | 第二轮复核：6 条新取证、2 个已修缺陷（强更策略 / 容器门禁）、2 个待决策（更新 feed / 壳层基线）、4 条真机待验、**Mac↔Windows 单一差异矩阵** |
| [notes/main-js-diff-checklist.md](notes/main-js-diff-checklist.md) | 想核对壳层差异的人 | Mac 主进程与官方的 IPC/能力差异清单（50 通道 vs 42） |
| [notes/main-js-regions.txt](notes/main-js-regions.txt) | 同上 | Mac `lib/main.js` 的打包 region 索引（定位实现片段） |
| [notes/worklog/](notes/worklog/) | 接手的人 | 逐日工作日志：决策、踩坑、修复（Phase 1→4 全过程） |
| [notes/upstream-locale-0.2.2-rc.3.ts](notes/upstream-locale-0.2.2-rc.3.ts) | 改 locale 的人 | 上游原版 locale 留档（对照 HEY 232 键） |

### 阅读顺序建议

1. 只想跑起来出包 → **WINDOWS-DEV.md** 第 1–2 节
2. 要改功能 → **WINDOWS-DEV.md** 第 3 节 + **notes/hey-team-feature-report.md**（理解机制再动手）
3. 要判断能不能做 / 该不该做 → **PLAN.md** 范围边界 + **notes/phase4-acceptance.md**

---

## 二、仓库结构

```
heywork/
├── README.md                    ← 本文件（文档总入口）
├── WINDOWS-DEV.md               ← Windows 开发指南（出包 + 迭代）
├── PLAN.md                      ← 计划与验收
├── patches/                     ← 5 段壳层补丁（对上游 TS 源码的 diff，必须 LF）
│   ├── hey-phase1.patch         ← 注入 hook / asarUnpack / 产品补丁透传
│   ├── hey-phase2.patch         ← 产品身份 / 协议 / 数据根 ~/.hey / 图标
│   ├── hey-phase2b.patch        ← 8 语 locale
│   ├── hey-phase2c.patch        ← About 对话框
│   └── hey-phase3.patch         ← 更新 feed（已挂起，不验收）
├── hey-assets/                  ← 功能面本体（全部随包分发）
│   ├── packages/                ← 23 个插件包：12 HEY 自有 + 11 上游未发布的一等包
│   ├── deps/                    ← 9 个三方依赖池（树里缺失才补）
│   ├── dsh-skill-uma/           ← 技能容器 resources.umadb（20 技能 / 2895 文件，AES-256-GCM）
│   ├── brand/                   ← 图标（ico/png）
│   ├── renderer/                ← 欢迎页 / 更新页 / 强制更新帧
│   ├── shell/                   ← 托盘与菜单资源
│   ├── packages.extras.json     ← 抽取清单：逐文件 SHA-256 与体积（可追溯）
│   └── hey-platform.patch.mac.yml  ← Mac 原始 22 开关留档（真正随包的是 phase1 生成的 win32 版）
├── scripts/
│   ├── inject-hey.mjs           ← 打包期注入：复制包 → 挂载 → 重算 desktop-runtime.json
│   ├── verify-hey-platform.mjs  ← 合成门禁（源码模式 / --tree 模式）
│   ├── verify-skill-container.mjs ← 解密技能容器，断言技能/设计系统/品牌/知识根齐全
│   ├── inspect-mac-manifest.mjs ← 读 Mac 包的版本 / 内核 / commit / 强更策略（核对基线漂移）
│   ├── extract-mac-extras.mjs   ← 从 Mac app.asar 按闭包抽取（换 Mac 版本时用）
│   ├── inspect-skill-container.mjs ← 技能容器检查
│   ├── build-ico.mjs            ← 零依赖 PNG→ICO
│   ├── locale-port.mjs          ← locale 机械抽取
│   └── overlay-renderer.mjs     ← renderer 覆盖
├── notes/                       ← 分析、验收、工作日志（本文件索引）
├── .github/workflows/build-win.yml ← CI：出 Windows 包
└── deepseek-harness/            ← 官方源码（gitignore，本地 clone 后应用补丁）
```

---

## 三、Windows 首次上手（5 步）

完整版见 [WINDOWS-DEV.md](WINDOWS-DEV.md)。要点：

```powershell
# 1) 关闭换行转换（关键：补丁必须 LF）
git config --global core.autocrlf false

# 2) 取两个仓库
git clone git@github.com:heyailab/heywork.git
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness && git checkout 39163dd30f703a79079e2d2446545cff3c453738

# 3) 顺序应用 5 段补丁（顺序不可乱）
foreach ($p in "hey-phase1","hey-phase2","hey-phase2b","hey-phase2c","hey-phase3") {
  git apply --check ..\heywork\patches\$p.patch
  git apply ..\heywork\patches\$p.patch
}

# 4) 写 apps/desktop/.env.windows（内容见 WINDOWS-DEV.md 第 2 节）
pnpm install
node ..\heywork\scripts\verify-hey-platform.mjs     # 秒级门禁

# 5) 出包（约 1–2 小时；或直接 push 让 Actions 出）
pnpm run package:desktop:win:x64:unsigned
```

---

## 四、门禁（push 前先跑，秒级）

```bash
node scripts/verify-hey-platform.mjs          # 源码模式：开关 / 层引用 / 工具 / 客户端组合 / 强更策略
node scripts/verify-hey-platform.mjs --tree <已注入的树>   # 注入后：检查真实 node_modules
node scripts/verify-skill-container.mjs       # 容器内容：20 技能 / 507 设计系统 / 84 品牌 / 知识根
```

当前基线：**22 开关（8 启用 / 14 禁用）· 40 工具 · 23 包 · 7 个客户端插件全挂载 · 8 语种齐全 ·
强更策略 anonymous（与 Mac 一致）· 容器内 507 套设计系统 / 84 个 DESIGN.md 品牌**。

门禁能挡住的问题类型：开关指向不存在的插件 id（会被静默忽略）、层引用悬空、
客户端包缺 `lib/client.js`（UI 静默不出现）、`dsh.client.inject` 目标不可解析、
技能容器被误打进 asar、**容器缺设计资产（会让 profile 初始化直接抛错）**、
**强更策略被改成 test（会在首启弹 Mac 上不存在的登录窗）**。

---

## 五、范围边界（2026-11-17 定）

| 项 | 决定 | 原因 |
|---|---|---|
| 自动更新链路 | **不做** | 目标改为「在官方 dsh 上对齐 HEY 功能面」；`hey-phase3.patch` 保留但不验收 |
| HEY Operations（SSH 面板） | **不做** | Mac 专属菜单入口，Windows 本无入口；`hey_ssh_*` 工具带 `when` 门控，不出现 ≠ 报错 |
| 23 个插件的装载方式 | **打包期注入** | 11 个一等包是桌面层首启依赖，运行期安装救不了首启；且需要离线确定性 |

---

## 六、已知坑

1. **CRLF**：`.patch` 一旦被转成 CRLF，所有 hunk 都会 `patch does not apply`。
   `.gitattributes` 已把 `*.patch`、`hey-assets/{packages,deps}` 标记 `-text`，别改。
2. **别改错文件**：`hey-assets/hey-platform.patch.mac.yml` 是 Mac 留档，随包的 win32 版
   由 `hey-phase1.patch` 生成。
3. **注入早于 smoke**：`prepare:dsh` 的 runtime smoke 在注入之前跑，所以「构建通过」不代表
   插件层完好——必须靠 `verify-hey-platform.mjs`。
4. **技能容器必须留在 asar 外**（asarUnpack），否则 `node:sqlite` 打不开。
5. **别去「修」不存在的 `dsh-skill-uma/assets` 目录**。设计工具的 `assetRoot` 指向它，
   但该目录本来就该缺席：`resources.js` 的 `locate()` 会向上找到同级的 `resources.umadb`，
   用「相对 `assets/` 的 POSIX 路径」查容器。真建一个明文目录会让读取走磁盘分支，等于把
   30MB 加密资产变明文、AAD 校验形同虚设。详见 `notes/parity-gap-review.md` §1.1。
6. **强更策略必须是 production**：`AUTO_UPDATE_ENV=test` 会打成 `authentication: feishu-test`，
   Windows 首启就弹飞书测试登录窗（Mac 是 `anonymous`，没有这个窗口）。门禁已拦这条。

---

## 七、状态

- Phase 1（插件层注入）：完成，CI 出包通过
- Phase 2 / 2b / 2c（品牌、数据根、8 语、About）：完成
- Phase 4（功能验收）：静态可证项全部闭环（含容器内容门禁、强更策略门禁）；**待真机验收**
- Phase 3（更新）：挂起
- 第二轮复核（2026-11-17）：修掉强更策略错配 + 补齐容器内容门禁；**待你决策**更新 feed 去留、
  壳层是否升 beta4 —— 见 [notes/parity-gap-review.md](notes/parity-gap-review.md)

真机验收除原有 9 步外，新增 2 项必须验的：**账号登录链路**（`hey://` + safeStorage + 托管账号）
与 **`coding_*` 在 Windows ACL 沙箱下跑通一次**（机制存在，未实证）。
