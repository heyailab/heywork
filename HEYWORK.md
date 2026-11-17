# HeyWork — 理解机制后 1:1 重写的 Windows 桌面应用

> 起点：2026-11-17，从 `uma-windows-port` 完整复制（含 git 历史 `579d57a`）。
> 新项目名 `heywork`，对外身份 `uma` → `hey`。
> 旧仓库 `heyailab/uma-window` 与其全部产物**保留**作回滚基线与行为对照，不再改动。

## 1. 这是什么

参照 Mac 版 UMA Studio 的**功能面**，在官方开源
[`deepseek-ai/deepseek-harness`](https://github.com/deepseek-ai/deepseek-harness)（pinned `39163dd`，v0.2.2-rc.3）
之上，**理解完整运行机制后自己重写**等价实现。不是照搬编译产物，也不是把还原的 TS 直接编译回去。

三层边界（详见 [REWRITE-PLAN.md](REWRITE-PLAN.md)）：

| 层 | 处理 | 例子 |
|---|---|---|
| **数据** | 直接用 | `resources.umadb`（技能/设计系统/DESIGN.md）、品牌图、8 语 locale、22 开关原文 |
| **官方已有** | 直接用 | agent-team、worktree、sandbox（Windows ACL）、subprocess、ssh、typert、plugin-manager |
| **私有逻辑** | 理解后重写 | 设计工具族、交付门禁、预算、知识库、wiki、编码工作台、UI 面板 |

## 2. 命名边界（重要）

改名的目标是**对外身份**，不是把所有字节里的 `uma` 换成 `hey`。有几类标识符是
**字节级契约**，改了会让产品直接坏掉（这是 2026-11-17 反复验证得出的教训）：

| 类别 | UMA → HEY | 说明 |
|---|---|---|
| 项目 / 仓库名 | uma-window → **heywork** | 对外身份 |
| 品牌 | UMA Studio → **HeyWork** | 对外身份 |
| 协议 | `uma://` → `hey://` | 对外身份 |
| 数据根 | `~/.uma` → `~/.hey` | 对外身份 |
| 环境变量前缀 | `UMA_HOME`/`UMA_PORT_ROOT` → `HEY_HOME`/`HEY_ROOT` | 项目内部配置 |
| **容器密钥派生串** | **保持 `UMA Studio local resource container v1`** | 改了 20 技能全部解不开 |
| **容器内虚拟路径** | **保持 `uma-team/references` 等** | AAD 绑定，改了读不到 |
| **包名 / 目录名** | **保持 `@deepseek-ai/dsh-uma-*` / `dsh-skill-uma/`** | 物理绑定，改了门禁/注入全断 |
| **开关 id / typert 工具 id** | **保持 `uma-feedback` / `uma_session_budgets` 等** | 绑定产品补丁与插件层 |
| **文件名引用** | **保持 `uma-platform.patch.yml` 等** | 物理绑定 |
| 平台域名 | 待定 `studio.umayun.com` → 新域名 | 见 §4 |

> 一条规则：**凡是「对外可见的身份」改 hey，凡是「系统内部字节契约」保持 uma**。
> `scripts/rename-uma-to-hey.mjs --verify-frozen` 会断言所有冻结标识没有漂移。

## 3. 目录

```
heywork/
├── HEYWORK.md              ← 本文件（项目总纲）
├── REWRITE-PLAN.md         ← 重写方法论、M1–M3 里程碑、specs+golden 流程
├── README.md / PLAN.md / WINDOWS-DEV.md   ← 旧路线记录（回滚基线，保留）
├── specs/                  ← 【待建】每个重写单元的行为规格
├── golden/                 ← 【待建】工具输入→输出回归样例
├── scripts/
│   ├── rename-uma-to-hey.mjs      ← 改名脚本（--verify-frozen 守护契约）
│   ├── set-platform-origin.mjs    ← 域名集中替换（待真实域名）
│   └── ...（旧脚本保留，改 hey 的品牌表述但内部契约不动）
├── uma-assets/             ← 数据资产 + 旧插件包（物理名保持，重写用其 src/ 当规格）
├── patches/                ← 5 段壳层补丁（原始内容，可 apply 上游）
├── deepseek-harness/       ← 官方 dsh @ 39163dd + 5 段补丁（gitignore，已 clone）
└── .git                    ← 完整历史，HEAD 579d57a（未推送到新仓库）
```

物理目录名 `uma-assets/` 等**有意保持不变**——改它们会牵动所有脚本/补丁引用，
且与「对外身份」无关。

## 4. 唯一阻塞项：平台域名

`studio.umayun.com` 出现在约 20 个文件（托管账号、强更策略、反馈上传、知识库、app-update feed）。
这是**真实服务地址**，不能猜。给我新域名后执行：

```bash
node scripts/set-platform-origin.mjs --origin https://your.real.domain --dry-run
node scripts/set-platform-origin.mjs --origin https://your.real.domain
```

注意：构建期嵌入 origin 的地方（补丁、cordis.patch.yml）改域名后要重新出包才生效。

## 5. 当前状态（已验证）

- [x] 新目录 `~/heycode/heywork` 干净建立，完整项目 + git 历史（`579d57a`）
- [x] 对外身份改名完成（724 文件 / 6,851 处）
- [x] 字节级契约守护：`rename-uma-to-hey.mjs --verify-frozen` → OK
- [x] 双门禁通过：容器内容 20 技能 / 507 设计系统 / 84 品牌；平台 22 开关 / 40 工具 / 23 包
- [x] 上游 `deepseek-harness` @ `39163dd` + 5 段补丁已就位
- [ ] 真实新域名 → 执行 `set-platform-origin`
- [ ] 新建 `specs/` 与 `golden/`，从 M1（`dsh-skill-uma` 容器层 + design 工具族）开始重写
- [ ] 新建 GitHub 仓库 `heywork` 并推送（改名方案已稳定，可随时推）

## 6. 开发位置

Mac 为主（写 specs / 重写 / golden / 门禁 / 容器兼容测试），
Windows 只用于①平台行为验证（沙箱 ACL / PATHEXT / 协议 / 长路径）②最终出包 + 真机验收。
详见 [REWRITE-PLAN.md](REWRITE-PLAN.md) §1.5。
