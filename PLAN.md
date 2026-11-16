# UMA Studio Windows 移植开发计划

> 基线依据：Mac 版 UMA Studio `1.0.0-beta3.20261116.1`（dsh `0.2.2-rc.3`）逆向分析结论
> 源码基线：`deepseek-harness` 官方仓库 `39163dd`（2026-11-13），**版本 0.2.2-rc.3 与 Mac 包完全一致**
> 分析产物：`../uma-analysis/`（插件源码 / 解密技能库 / 壳层代码）

## goal（目标）

在官方 dsh 开源 Windows 桌面基线上，叠加 UMA 专属插件层与产品配置，产出可安装、可自动更新、功能与 Mac 版 1:1 的 Windows 版本。

## acceptance（验收标准）

- [ ] Windows x64 安装包可安装、可签名验证、可启动进入 UMA 欢迎页
- [ ] 20 个内置技能全部可通过 `uma_resource_read` 加载（resources.umadb 原样复用）
- [ ] `.uma/` 工件写入 + `uma_gate_status` 门禁全链路可用
- [ ] 团队模式（agent-team）可建板、派任务、交叉评审
- [ ] 自动更新走 `feeds/win-x64/` 通道，且更新完成后无缓存残留（修复 Mac 版遗留 bug）
- [ ] `uma-platform.patch.yml` 中 22 个功能开关行为与 Mac 版一致（遥测类保持禁用）

## 关键事实（逆向已确认，移植时直接引用）

1. **12 个 uma 插件包 0 平台耦合**：无 darwin 引用、无 process.platform 分支，依赖的 dsh 核心包（dsh-tools/skill/credentials/llm/session/storage-domain/typert-protocol/cordis/schemastery）全部在本仓库 packages/ 内。
2. **壳层已内置 win32 支持**：Mac 包 `lib/main.js` 含 `uma.cmd` 启动器、`node.exe` 路径、win32 路径比较、`desktop-win` 客户端标识等分支——上游开源壳同版本应已包含等价逻辑，个别 UMA 定制（如欢迎页/更新文案）需比对搬运。
3. **resources.umadb 跨平台**：AES-256-GCM 解密在 Node 层（密钥 sha256('UMA Studio local resource container v1')），Windows 直接可用。
4. **`desktopPlatform` 必改**：`uma-platform.patch.yml` → `deepseek-account` 配置中 `"darwin"` → `"win32"`。
5. **Mac 版遗留 bug**：更新缓存目录双份 update.zip（798MB 残留）。Windows 版实现时安装成功后必须清理 `pending/` 与根目录 `update.zip`。

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

## Phase 3 — 更新通道 + 缓存清理修复

> 实测（2026-11-16，Mac 版 `~/Library/Caches/uma-studio-updater/`，798MB）：
> - `pending/uma-studio-1.0.0-beta3.20261116.1-mac-arm64.zip` 418MB + `pending/current.blockmap` 424KB + `pending/update-info.json`（electron-updater 的 pending 三元组，正常）
> - **根目录另有一份 `update.zip`（418MB）与 `current.blockmap`（424KB）**，后者与 `pending/current.blockmap` **逐字节相同**
> - 上游 `src/updates/electron-updater/discard.ts` 已存在（与 UMA 版字段集一致），但它只清 `helper.cacheDirForPendingUpdate`（即 `pending/`），**根级这对文件从无人清** → 双份共存 = 798MB
> - 结论：不是 discard 缺失，而是「安装成功后没人回收根级暂存」+「discard 只在切换通道时触发」

- [ ] `app-update.yml`：generic provider，url 指向 `https://studio.umayun.com/uma-studio/feeds/win-x64/`，channel nightly，`updaterCacheDirName: uma-studio-updater`
- [ ] 服务端建 `feeds/win-x64/` 目录，上传 latest.yml + 安装包 + blockmap
- [ ] **修 bug（根因见上）**：应用启动后、无下载在飞（`updateState.phase === 'idle'`、journal 无 in-flight）时清扫缓存目录根级的 `update.zip` / `current.blockmap`，并复用 `recordUpdateCleanupFailure` 记录失败；`pending/` 仍只交给 `discardDesktopUpdate` 处理，避免破坏可恢复的下载
- [ ] **验收**：检查更新→下载→安装→重启后，缓存目录只剩 `pending/` 三元组且无根级残留；再切一次通道，`pending/` 被 discard 清空

## Phase 4 — 功能验收（对照 Mac 版 1:1）

- [ ] 交付流水线：`uma_artifact_write/read` + gate 八工件分级（patch/feature/product）
- [ ] 设计工具族 10 个工具：design_context / design_asset_list/get / design_rule_search 等
- [ ] 任务预算 `uma_session_budgets` read/update
- [ ] 专家指导 `uma_guidance`
- [ ] SSH 运维（ssh2 跨平台，重点测 Windows 路径 + 中文路径）
- [ ] WeKnora 知识库检索、项目记忆（node:sqlite）、经验沉淀
- [ ] 多语言 8 语种 locale 正常显示

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

```
uma-windows-port/
├── PLAN.md                  ← 本文件
├── deepseek-harness/        ← 官方源码（git 39163dd, 0.2.2-rc.3）
├── scripts/                 ← copy-uma-assets.sh 等搬运脚本
├── notes/                   ← 移植过程中的记录（差异比对、问题）
└── dist/                    ← 构建产物输出
```
