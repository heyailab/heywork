# UMA Studio Windows 移植开发计划

> 基线依据：Mac 版 UMA Studio `1.0.0-beta3.20261116.1`（dsh `0.2.2-rc.3`）逆向分析结论
> 源码基线：`deepseek-harness` 官方仓库 `39163dd`（2026-11-13），**版本 0.2.2-rc.3 与 Mac 包完全一致**
> 分析产物：`../uma-analysis/`（插件源码 / 解密技能库 / 壳层代码）

## goal（目标）

在官方 dsh 开源 Windows 桌面基线上，叠加 UMA 专属插件层与产品配置，让 **UMA 的功能面在 Windows 上与 Mac 版一致**。

范围口径（2026-11-17 明确）：**要功能对齐，不要更新链路**。UMA 的产品功能全部由插件承载
（详见下方「范围边界」），壳层只保留让这些插件跑起来的最小改动；自动更新（Phase 3）不作为本期交付项。

## acceptance（验收标准）

- [ ] Windows x64 安装包可安装、可启动进入 UMA 欢迎页
- [ ] 20 个内置技能全部可通过 `uma_resource_read` 加载（resources.umadb 原样复用）
- [ ] `.uma/` 工件写入 + `uma_gate_status` 门禁全链路可用
- [ ] 团队模式（agent-team）可建板、派任务、交叉评审
- [ ] `uma-platform.patch.yml` 中 22 个功能开关行为与 Mac 版一致（遥测类保持禁用）
- [ ] 7 个客户端插件在窗口内正常挂载（注入目标全部可解析）
- [ ] ~~自动更新走 `feeds/win-x64/` 通道~~ → 移出本期，见 Phase 3

## 范围边界（哪些是插件，哪些必须动壳）

逆向结论：**功能在插件里，壳只剩「让插件跑起来 + 品牌」**。

| 层 | 承载方式 | Windows 侧动作 | 状态 |
|---|---|---|---|
| 工具 / 技能 / 知识库 / 设计 / 预算 / 交付门禁 / 团队板 / 项目 wiki / 编码工作台 | 23 个插件包 + 22 个产品开关 | 注入 + 配置，零代码改动 | 完成 |
| UI 面板（brand / design studio / knowledge / repo-wiki / task-budget / remotes） | 6 个客户端插件，`dsh.client.inject` 注入上游 client 包；`dsh-client-modules` 按 **Loader entry** 扫 `dsh.client` 组浏览器模块图 | 只需挂成 entry（`dsh-uma-web/cordis.patch.yml` 已做） | 完成，门禁已加 |
| 品牌壳（productName / 图标 / `uma://` / `~/.uma` / 单实例） | Electron 主进程 + 打包配置 | Phase 2 补丁 | 完成 |
| 8 语文案 + 欢迎页 / 更新页 / mandatory 渲染层 | `src/locale.ts` + renderer 覆盖 | Phase 2b | 完成 |
| About 对话框 / 版本通道 | 主进程 | Phase 2c | 完成 |
| UMA Operations（SSH 面板） | 主进程 `OperationsVault`（safeStorage）+ Mac 专属菜单项 | **不做**（理由见 Phase 4） | 挂起 |
| 自动更新 + 缓存清扫 | 主进程 | **不做**（用户 2026-11-17 明确） | 挂起 |

判据：Mac 主进程注册的 50 个 IPC 通道里，官方 `39163dd` 的 42 个**全部**存在（官方 ⊂ UMA，无独有项），
UMA 只多 8 个：`operations-{list,save,remove,connect,trust}`（5 个，Operations 面板）、`tray-publish`、
`product-version`、`boot-mounted`。也就是说 UMA 的壳不是另一套应用，而是官方壳 + 薄增量；功能差异由插件携带。


## 关键事实（逆向已确认，移植时直接引用）

1. **12 个 uma 插件包本体 0 平台耦合**：无 darwin 引用、无 process.platform 分支。但**依赖面不止这 12 个**——UMA 层还挂载 11 个公开仓库未发布的一等包（见 Phase 4 与 `uma-assets/packages.extras.json`），它们同样无原生二进制，需一并 vendor。
2. **壳层已内置 win32 支持**：Mac 包 `lib/main.js` 含 `uma.cmd` 启动器、`node.exe` 路径、win32 路径比较、`desktop-win` 客户端标识等分支——上游开源壳同版本应已包含等价逻辑，个别 UMA 定制（如欢迎页/更新文案）需比对搬运。
3. **resources.umadb 跨平台**：AES-256-GCM 解密在 Node 层（密钥 sha256('UMA Studio local resource container v1')），Windows 直接可用。
4. **`desktopPlatform` 必改**：`uma-platform.patch.yml` → `deepseek-account` 配置中 `"darwin"` → `"win32"`。
5. ~~**Mac 版遗留 bug**：更新缓存目录双份 update.zip（798MB 残留）~~ —— 本期不修（更新链路已挂起），代码在 `patches/uma-phase3.patch` 里保留。

---

## Phase 0 — 基线构建（先让官方 Windows 包跑起来）

- [ ] 环境：Node ≥ 24.9、pnpm 11.28.5（`corepack enable`）、Windows 构建机或 CI（GitHub Actions windows-latest）
- [ ] `pnpm install && pnpm build`（根目录，scripts/build.ts）
- [ ] `apps/desktop`：`electron-builder.config.mjs` 出 win 目标安装包（未签名）
- [ ] **验收**：安装包可装、可启动官方 DSH Desktop 界面

## Phase 1 — UMA 插件层注入

仓库中无 uma 痕迹（grep 确认），Mac 版的做法是把 12 个包打进 `dsh/node_modules/`。推荐两条路线（二选一）：

- **路线 A（贴近原版）**：新增 `packages/uma/*` workspace 包，构建脚本把它们 vendor 进 desktop 产物的 dsh node_modules（对齐 Mac 版布局）
- **路线 B（更开源友好）**：作为 product bundle 资源随安装包分发，经 plugin-manager 的 patch.yml 分层加载（`packages/boot/plugin-manager` 已支持）

无论哪条，搬运清单见 `scripts/copy-uma-assets.sh`：

| 资产 | 来源（uma-analysis/） | 去向 |
|---|---|---|
| 12 个 uma 包源码 | `uma-plugins/@deepseek-ai/` | packages/uma/* |
| 技能库 | `UMA Studio.app/Contents/Resources/app.asar.unpacked/dsh/node_modules/@deepseek-ai/dsh-skill-uma/resources.umadb` | dsh-skill-uma 包内（unpacked 资源） |
| 产品 patch | `UMA Studio.app/Contents/Resources/uma-platform.patch.yml` | 桌面资源目录（改 desktopPlatform=win32） |
| 壳层参考 | `shell/lib/main.js`、`shell/renderer/` | 与上游 apps/desktop/src 逐段比对，搬运 UMA 定制 |
| 品牌图 | `shell/renderer/assets/*.svg` | 直接复用；`icon.icns` 需另出 `.ico` |

- [ ] **验收**：插件管理器中 12 个 UMA 插件注册成功；patch 中 8 启用/14 禁用与 Mac 版一致

## Phase 2 — 产品壳定制

> 已完成（`patches/uma-phase2.patch`）：产品身份全部改为环境变量驱动，未设置时上游行为不变。
> - electron-builder：`DSH_DESKTOP_PRODUCT_NAME`（productName + NSIS 显示名）、`DSH_DESKTOP_PROTOCOL_SCHEME`（protocols + 打包清单）、`DSH_DESKTOP_ARTIFACT_BASE`（产物名）、`DSH_DESKTOP_MANAGED_ACCOUNT=1`（写入 `dshDesktopManagedAccount`）、`DSH_DESKTOP_BRAND_DIR`（icon.ico/tray.ico/icon.png，缺文件直接报错）
> - 数据根：`paths.ts` 新增 `resolveUmaDesktopHome()`（`$UMA_HOME` → `~/.uma`，不读 DSH_HOME、不做迁移）；`main.ts` 模块级 `productHome` 供 recovery 复用，并把 `DSH_HOME` 传给 Host 进程
> - 协议：`uma://`（`dshDesktopProtocolScheme`）+ `open-url` 比较同步；受 `managedAccount` 与 `DSH_DESKTOP_ISOLATED_INSTANCE` 双重门控
> - 图标：`uma-assets/brand/` 由 Mac 包 `icon.icns` 提取（`scripts/build-ico.mjs` 组装 PNG 条目 ICO：16/24/32/48/64/128/256 + 托盘 16/24/32）

- [x] `apps/desktop` electron-builder 配置：`appId: studio.uma.desktop`、`productName: UMA Studio`、icon.ico、NSIS 目标
- [x] 8 语种 locale 字典：`patches/uma-phase2b.patch`（`scripts/locale-port.mjs` 从 UMA bundle 抽取，键级比对：上游 4 键回填、UMA 新增 47 键含 `trayRoles` 嵌套对象；`DesktopMessages` 改为条件映射放宽字面量类型）
- [x] renderer 品牌覆盖：`scripts/overlay-renderer.mjs`（welcome.css、update-dialog.html/css/js、mandatory-update-frame.js[uma-app→dsh-app]、3 个品牌 svg）
- [x] about 流程：`patches/uma-phase2c.patch`（新增 `src/about.ts` 纯函数 + `update-dialog` 的 `about` 视图与带标签 `keepOpenAction` + 主进程富「关于」对话框：检查更新/复制诊断/官网/许可证）
- [ ] 菜单定制（main 区段 speechMenu / operationsMenu 等，配合 trayRoles）
- [ ] DevTools 门控（UMA 用 `debugging = development && DSH_DESKTOP_OPEN_DEVTOOLS !== '0'` 去掉 release 的 toggleDevTools 菜单与 F12；会改动上游 2 处测试断言，暂缓）
- [ ] lib/welcome 源（`src/client/welcome.tsx` 的 UMA 版 + ui-theme 品牌字体，编译进 `lib/welcome/welcome.js`）
- [ ] 签名：`apps/desktop/config/windows-packaging/windows-signing.env.example` 按样例配置 Authenticode（建议 EV 证书防 SmartScreen 误报）
- [ ] **验收**：启动页为 UMA 品牌；`uma://` 链接可唤起应用；数据写入 `~/.uma`；更新对话框含 UMA 品牌样式

## Phase 3 — 更新通道 + 缓存清理（**挂起，不在本期范围**）

> 2026-11-17 用户明确：更新功能不用管，只要在官方 dsh 上对齐 UMA 功能。
> 下面的代码已实现且随 CI 应用（不影响功能验收，也不阻挡启动），但**不作为交付验收项**；
> 服务端 `feeds/win-x64/` 与签名链路一并挂起。若日后要恢复，直接从「待办」两条接上即可。

> 实测（2026-11-16，Mac 版 `~/Library/Caches/uma-studio-updater/`，798MB）：
> - `pending/uma-studio-1.0.0-beta3.20261116.1-mac-arm64.zip` 418MB + `pending/current.blockmap` 424KB + `pending/update-info.json`（electron-updater 的 pending 三元组，正常）
> - **根目录另有一份 `update.zip`（418MB）与 `current.blockmap`（424KB）**，后者与 `pending/current.blockmap` **逐字节相同**
> - 上游 `src/updates/electron-updater/discard.ts` 已存在（与 UMA 版字段集一致），但它只清 `helper.cacheDirForPendingUpdate`（即 `pending/`），**根级这对文件从无人清** → 双份共存 = 798MB
> - 结论：不是 discard 缺失，而是「安装成功后没人回收根级暂存」+「discard 只在切换通道时触发」

- [x] 更新 feed 直配：`patches/uma-phase3.patch` 新增 `DSH_DESKTOP_UPDATE_PUBLIC_URL`（https + 尾斜杠校验），设了就绕过 `dsh-desk/<releaseId>` 部署布局 —— 关键是它让 **unsigned 构建也产出 app-update.yml**（上游 `update = unsigned ? undefined : …`，否则产物里更新链路永久关闭）
- [x] **修 bug（根因见上）**：`src/updates/electron-updater/cache-sweep.ts`，启动后、首次检查前清缓存根级 `update.zip` + `current.blockmap`；目录用 app-update.yml 的 `updaterCacheDirName` 解析（与 electron-updater 的 `join(baseCachePath, dirName || app.name)` 同源），`pending/` 一律不碰，失败走 `recordUpdateCleanupFailure`
- [ ] 服务端建 `feeds/win-x64/` 目录，上传 CI 产出的 `latest.yml` + 安装包 + `.blockmap`（**需要你在 studio.umayun.com 上建路径**，否则检查更新会 404）
- [ ] **验收**：检查更新→下载→安装→重启后，缓存目录只剩 `pending/` 三元组且无根级残留；再切一次通道，`pending/` 被 discard 清空

## Phase 4 — 功能验收（对照 Mac 版 1:1）

> 详见 `notes/phase4-acceptance.md`。**本轮关键发现**：UMA 桌面层挂载了 11 个公开仓库
> 未发布的一等包（knowledge / task-query / worktree / coding-workbench / tool-repo-wiki /
> util-repo-wiki / client-ui-knowledge / client-ui-repo-wiki / client-ui-design-studio /
> api-account-controller / deepseek-account-platform）。缺了它们 Host 起不来 profile，
> 而 prepare 阶段的 runtime smoke 跑在注入之前，所以构建期完全看不出来。
> 已用 `scripts/extract-mac-extras.mjs` 从 Mac asar 按闭包抽取补齐（26.7MB，无原生二进制，
> 清单见 `uma-assets/packages.extras.json`），注入清单改为目录驱动 23 个包。

- [x] 合成门禁 `scripts/verify-uma-platform.mjs`：22 开关全部落到 269 个可挂载 id；8 启用/14 禁用与 Mac 原文逐字段一致；`desktopPlatform=win32`；层引用零悬空；40 个工具在册；8 语种齐全。源码模式（打包前，秒级）+ `--tree` 模式（注入后，看真实 node_modules）各跑一次
- [x] **客户端组合门禁**：7 个客户端插件必须各自被某层挂成 Loader entry（`id` 或 `name` 命中），且 `dsh.client.inject` 的 21 个目标全部可解析——否则浏览器模块图少一行，界面静默不出现、构建期零报错
- [x] 缺失包补齐 + 三方依赖池（typescript / pdfjs-dist / zod / picomatch / js-yaml，树里已有则不复制）
- [x] 交付流水线：`uma_artifact_write/read` + gate 分级（`dsh-tool-uma-workflow` + `dsh-util-uma-delivery`）
- [x] 设计工具族 9 个 + `uma_resource_read` / `uma_knowledge_search`（`dsh-tool-uma-design`）
- [x] 任务预算 `uma_session_budgets`（typert 描述符注册，非 `defineTool`，校验器单独解析）
- [x] 专家指导 `uma_guidance`（产品补丁内 `disabled: true`，与 Mac 一致）
- [x] SSH 运维工具进包：`ssh2` 1.17.0 纯 JS 闭包随包；工具走 `ctx.subprocess.spawn`
- [x] WeKnora / 项目记忆（node:sqlite，Electron 44 = Node 24）/ 经验沉淀
- [x] 20 个内置技能可枚举：`node --experimental-sqlite scripts/inspect-skill-container.mjs` → 20 技能 / 642 目录 / 2895 文件
- [ ] **真机验收**：按 `notes/phase4-acceptance.md` 第 4 节在装好的 Windows 包上走一遍（启动、44 个工具自述、工件 + 门禁、团队板、切语言）

### UMA Operations（SSH 面板）——判定为不做

非插件的唯一一块功能。事实链：

1. Mac 上入口是**菜单项**，且被 `...darwin ? [{ label: operationsMenu, click }] : []` 包住——Windows 上本来就没有这个入口；
2. 主进程 `OperationsVault(app.getPath('userData'))` 用 `safeStorage` 存连接凭据，挂在 `if (managedAccount)` 分支里，业务是 `list/save/remove/connect/trust` + `open-operations` 发 IPC 给渲染层；
3. 插件侧 `dsh-uma-base/lib/operations-ssh.js` 起一个 local webServer 端点，`scope.connection.admit(request)` 接收「委派某台服务器给本次会话」，然后 `uma_ssh_servers` / `uma_ssh_run` 才有对象；
4. 两个工具都带 `when: ({ agent }) => active(agent).length > 0` —— **没有委派就是工具不出现**，不是报错、不影响启动，也不影响其它 38 个工具。

结论：不追 1:1 时这块可以不做。真要做，成本 = vault + 5 个 IPC + 一个 Windows 侧入口（菜单已无，需放设置页或托盘），并要重做 UI（Mac 的面板在 dsh-web-app 渲染层，不是插件）。


## Phase 5 — 发布

- [ ] 版本号对齐规范：`1.0.0-betaX.YYYYMMDD.N`（与 Mac 版节奏一致）
- [ ] 产物：签名 NSIS 安装包 + latest.yml + blockmap → `feeds/win-x64/`
- [ ] 留存 SHA512 清单（update-info.json 机制对齐）

---

## 风险与对策

| 风险 | 对策 |
|---|---|
| 上游是 developer preview，插件 API 可能不兼容 | 已锁定 0.2.2-rc.3 同版本；升级前跑 uma 插件测试 |
| libreoffice-kit 等原生包（Mac 版 153MB）Windows 发行版缺失 | 属 dsh 官方 Windows 桌面自带范围，核对官方 win 安装包是否包含；不包含则参考其 runtime 准备脚本 |
| 12 个 uma 包源码是从打包产物反推的（无原始 TS） | 逻辑可读性已验证足够；类型从用法反推，逐步补 .d.ts |
| SmartScreen 拦截未签名包 | EV 证书 + 提前积累安装量信誉 |

## 目录说明

```text
uma-windows-port/
├── PLAN.md                  ← 本文件（计划 + 范围边界）
├── WINDOWS-DEV.md           ← Windows 本机开发指南（出包 / 迭代 / 提交纪律）
├── patches/                 ← 5 段壳层补丁（对官方 TS 源码的 diff，顺序敏感）
├── uma-assets/              ← UMA 功能面：23 个插件包 + 9 个三方依赖池 + renderer/brand 资产
├── scripts/                 ← 注入 / 校验 / 抽取 / locale 移植脚本
├── notes/                   ← 移植过程记录（phase4-acceptance.md 为验收清单）
├── deepseek-harness/        ← 官方源码（gitignored，按 pinned commit 39163dd 自行拉取）
└── dist/                    ← 构建产物输出
```

**开发入口看 `WINDOWS-DEV.md`**：环境准备、完整出包（与 CI 逐步一致）、插件/壳层/新功能的迭代方式、提交纪律。

