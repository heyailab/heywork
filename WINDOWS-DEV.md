# Windows 本机开发指南

> 目标：在官方 dsh（开源）上加装 HEY 全部功能，本机出 Windows 安装包并迭代开发。
> 一句话链路：**官方 dsh 源码 @ `39163dd` + 5 段壳补丁 + 23 个 HEY 插件包 + 22 条产品开关**。
>
> 文档总入口见 [README.md](README.md)（含全文索引与阅读顺序）；本篇是「动手」部分。

## 0. 仓库里有什么、没有什么

`heyailab/heywork` 仓库内容（全部已入库）：

| 路径 | 内容 | 形态 |
|---|---|---|
| `patches/hey-phase1..3.patch`（5 个） | 壳层改动：注入 hook、产品身份/协议/`~/.hey`、8 语 locale、About、更新直配 | 对官方 TS 源码的 diff |
| `hey-assets/packages/`（23 个包） | HEY 功能面：12 个 HEY 产品包 + 11 个上游未发布的一等包 | **编译产物 `lib/*.js`**，与 Mac 版 app.asar 同源；40 工具 / 20 技能 / 6 UI 面板 |
| `hey-assets/deps/`（9 个） | 三方依赖池（zod/pdfjs-dist/typescript/yaml/ws/ssh2 等） | 注入时树里缺失才补 |
| `hey-assets/renderer/` + `brand/` | 欢迎页/更新页覆盖文件、图标 | 直接覆盖/读取 |
| `hey-assets/hey-platform.patch.mac.yml` | 22 条产品开关的 **Mac 原文**（留档）；真正随包的 win32 版由 phase1 补丁生成 | 参考文件，勿改 |
| `scripts/` | 注入、校验（平台合成 + 容器内容）、Mac 包事实读取、抽取、locale 移植等 10 个脚本 | Node ESM |
| `.github/workflows/build-win.yml` | 与下文「完整出包」完全相同的步骤 | GitHub Actions |

**不在仓库里**：官方 dsh 源码（`.gitignore` 排除，CI 按 pinned commit 拉取）——所以本机要先自己 clone。

**关于「源码」的准确口径**（2026-11-17 盘点）：23 个包的本体 100% 在仓库（`hey-assets/packages/`，
2,750 个文件，逐文件 SHA-256 见 `packages.extras.json`），但**不都是 TS 源码**：

| 形态 | 范围 | 能不能改 |
|---|---|---|
| `lib/*.js` 编译产物（未混淆、无 sourcemap） | 绝大多数包，含 `dsh-skill-uma`（仅 3 个 js） | **能**，直接改 js 再出包（见 §3a）；不需要 TS 构建链 |
| `src/*.ts` 原始源码 | 仅 3 个包附带：`dsh-api-account-controller`(2)、`dsh-deepseek-account-platform`(6)、`dsh-worktree`(8)，共 16 个文件 | 能，但改完要自己同步回 `lib`（没有构建链自动编译） |
| `resources.umadb` 加密技能容器 | `dsh-skill-uma` 内，20 个技能的 Markdown 文本 | 加密密钥/算法写在同包 `lib/types/resources.js` 里（非黑盒）；用 `scripts/inspect-skill-container.mjs` 可读 |

其余在包里看到的 ~332 个 `.ts` 是三方依赖 `zod/src/` 的公开源码，不是 HEY 私有代码。
DeepSeek 发布的就是编译形态，我们没有原始 TS；这不影响功能对齐与迭代（改 `lib` 重出包即可）。

## 1. 环境准备（Windows）

```powershell
# 版本对齐 CI：Node 24.9.0 + pnpm 11.28.5
# 国内建议先设 Electron 镜像
$env:ELECTRON_MIRROR = "https://npmmirror.com/mirrors/electron/"

git config --global core.autocrlf false   # 关键：防止补丁/脚本被换行转换
git clone git@github.com:heyailab/heywork.git heywork
cd heywork

git clone https://github.com/deepseek-ai/deepseek-harness deepseek-harness
git -C deepseek-harness checkout 39163dd30f703a79079e2d2446545cff3c453738
```

Node/pnpm 安装可用 nvm-windows 或直接装 Node 24；`corepack enable` 激活 pnpm。

**环境前置（缺了会在运行期而不是构建期炸）**：

| 依赖 | 是否必需 | 说明 |
|---|---|---|
| **Git for Windows** | **必需** | `dsh-tool-repo-wiki` / `dsh-worktree` / `dsh-coding-workbench` 都 spawn `git`（argv 形式、无 shell），靠官方 `resolveExecutable` 解析 PATHEXT。装完确认 `git --version` 在 PowerShell 里可用 |
| Python | **不需要** | 技能容器里有 18 个 `hey-design-system/scripts/*.py`（含测试），那是**构建/维护期资产**；运行期设计数据全部经 `hey_resource_read` / `design_*` 从容器读，不执行脚本 |
| Node 24.x | 必需（构建） | CI 用 24.9.0；运行时用的是 Electron 内置 Node 24，构建机版本只影响打包脚本 |
| 长期路径 | 建议 | `dsh-worktree` 会在项目旁建 `hey-*` worktree，路径总长接近 260 字符时 Windows 会失败；仓库别放太深 |

## 2. 完整出包（与 CI 逐步一致，唯一完全验证的路径）

在仓库根（PowerShell 或 Git Bash 均可，示例为 Git Bash）：

```bash
# ① 应用 5 段壳补丁（顺序敏感：1 → 2 → 2b → 2c → 3）
cd deepseek-harness
for name in hey-phase1 hey-phase2 hey-phase2b hey-phase2c hey-phase3; do
  git apply --whitespace=nowarn --verbose ../patches/$name.patch
done
git diff --stat   # 应看到 11 个文件的改动（见 patches/ 覆盖清单）

# ② 写产品身份环境（与 CI 相同的最小集合）
cat > apps/desktop/.env.windows <<'EOF'
DSH_DESKTOP_APP_ID=studio.hey.desktop
DSH_DESKTOP_PRODUCT_NAME=HeyWork
DSH_DESKTOP_PROTOCOL_SCHEME=hey
DSH_DESKTOP_ARTIFACT_BASE=heywork
DSH_DESKTOP_MANAGED_ACCOUNT=1
DSH_DESKTOP_AUTO_UPDATE_ENV=production
DSH_DESKTOP_UPDATE_CHANNEL=nightly
DSH_DESKTOP_UPDATE_PUBLIC_URL=https://studio.umayun.com/heywork/feeds/win-x64/
DSH_DESKTOP_MANDATORY_UPDATE_PROD_ORIGIN=https://studio.umayun.com
EOF

# ③ 覆盖 renderer 品牌资产 + 装依赖
cd ..
node scripts/overlay-renderer.mjs
cd deepseek-harness && pnpm install --frozen-lockfile

# ④ 秒级合成门禁（22 开关 / 40 工具 / 23 包 / 客户端挂载 / 容器内容 / 强更策略）
cd .. && node scripts/verify-hey-platform.mjs

# ⑤ 出包（60-120 分钟；产物在 deepseek-harness/apps/desktop/.desktop-build/targets/win-x64/unsigned-artifacts/）
cd deepseek-harness
DSH_DESKTOP_HEY_INJECT="$(pwd)/../scripts/inject-hey.mjs" \
HEY_ROOT="$(cd .. && pwd)" \
HEY_ASSETS_DIR="$(cd .. && pwd)/hey-assets" \
DSH_DESKTOP_BRAND_DIR="$(cd .. && pwd)/hey-assets/brand" \
  pnpm run package:desktop:win:x64:unsigned
```

> **② 里的策略必须与 Mac 一致**：Mac 包 `package.json` 的 `dshMandatoryUpdatePolicy` 是
> `{"origin":"https://studio.umayun.com","allowedPageOrigins":["…"],"authentication":"anonymous"}`。
> 若写 `AUTO_UPDATE_ENV=test`，产物会变成 `authentication: "feishu-test"`，首启
> `mandatoryPolicy.check('launch')` 拿到 `authentication-required` 就弹飞书测试登录窗（Mac 没有这个窗口）；
> 且 production 下**不能**再传 `DSH_DESKTOP_MANDATORY_UPDATE_CONFIG`（带 `allowedAuthOrigins` 打包直接报错）。

装完后的 `unsigned-artifacts/` 里就是 NSIS 安装包。不想本机等两小时，直接 push 让 Actions 出包（Actions 页下载 `heywork-baseline`）。

## 3. 日常开发怎么迭代

### 3a. 改 HEY 插件（工具 / 技能 / UI 面板）——最常见

插件没有 TS 构建链，**直接改 `hey-assets/packages/<包>/lib/*.js`** 即可，然后重跑第 ⑤ 步出包验证。
改工具记得同步更新 `scripts/verify-hey-platform.mjs` 的 `EXPECTED_TOOLS`（门禁会拦少注册的工具）。

快速试错技巧：出过一次包后，`deepseek-harness/apps/desktop/.desktop-build/targets/win-x64/dsh/node_modules/@deepseek-ai/` 里就是已注入的真实树——直接改树里的 `lib` 再用 `pnpm run package:dir` 重打（免整段 prepare），验证逻辑；**确认后务必把改动同步回 `hey-assets/packages/`（那是唯一的事实源）**。

### 3b. 改 dsh 壳层 / 官方包（TS）

补丁应用后 `deepseek-harness` 就是一棵「dsh + HEY 壳」的可开发工作树，直接改 TS、走上游的构建与测试：

```bash
cd deepseek-harness/apps/desktop
pnpm build            # tsc -b + bundle
pnpm dev              # 开发循环：构建并启动未打包的 Electron 壳（对当前工作区）
```

> 注意：`pnpm dev` 要让 HEY 层可解析，需先把插件拷进工作区根 node_modules：
> `cp -r ../hey-assets/packages/* node_modules/@deepseek-ai/`（缺谁补谁）。
> dev 循环对 HEY 层的兼容未在 CI 验证，**逻辑验证请以第 2 节完整出包为准**。

### 3c. 新写功能（在官方 dsh 上加新东西）

按上游的插件模型加新 cordis 包即可：工具用 `defineTool`（`packages/tools/*` 有大量样例）、
UI 面板声明 `dsh.client`（`packages/client/*` 样例）、挂载到桌面层就在
`apps/desktop/src/project-manager.ts` 的 `UMA_DESKTOP_BUNDLES` 或层 `cordis.patch.yml` 里加 id。
改完跑 `node scripts/verify-hey-platform.mjs`，门禁会校验新引用是否悬空。

### 3d. 插件的两条装载路线（都走官方机制，只是时机不同）

HEY 插件**符合官方标准**——23 个包在 Windows 构建里全部经未改动的官方 Loader 加载，
API 面（`defineTool` / `dsh.client` / `ctx.subprocess.spawn` / home-paths 表达式 / 凭据键）与
上游公开包一致。区别只在「怎么进树」：

1. **打包期整合（现状，23 个核心包走这条）**：`inject-hey.mjs` 把包复制进
   `node_modules` + 层 yml 挂载 + 重算 `desktop-runtime.json`。理由：桌面层引用
   `dsh-uma-base`/`hey-web` 挂载的 11 个一等包，缺一个首次启动即失败；且需要离线确定性。
   新写功能想随包分发也走这条（3c）。
2. **运行期安装（官方插件管理器，适合增量功能）**：`plugin-manager` 服务 + 工具
   在 base/web-app 层挂载，桌面组合里**本来就有**——`installBundle(spec)` 支持
   npm 名 / git 仓库 / 本地目录三种 spec，装进 profile 目录
   （`~/.hey/dsh/profiles/...` 的 dependencies，不在应用安装目录内），支持
   enable/disable/remove/update。符合官方格式的新插件（含你自己新写的）可以直接
   用这条路装，不动应用本体；UI 入口是设置里的插件管理器面板。
   注意：单个运行期安装的包不会自动带上 HEY 的层接线（层 patch 仍在 profile 的
   cordis.patch.yml 里）——跨包联动仍要写进层配置或打包期整合。


## 4. 提交纪律

- 文档也是代码的一部分：每轮的决策/踩坑记进 `notes/`，会话工作日志同步到 `notes/worklog/<日期>.md`
  （多机协作时另一台机器只能看到 git 里的东西）
- 改壳层 → 重新生成对应 patch：在 `deepseek-harness` 里 `git diff > ../patches/hey-phaseN.patch`
  （**保持 LF**；`.gitattributes` 已把 `*.patch` 标记 `-text`，但生成时注意别引入 CRLF）
- 改插件/renderer/脚本 → 直接提交 `hey-assets/`、`scripts/`、`patches/` 的改动
- push 前本地先跑：`node scripts/verify-hey-platform.mjs`（秒级，能挡住绝大多数组合断裂）
- 两个已知勿动点：`hey-assets/hey-platform.patch.mac.yml` 是留档（真版本在 phase1 补丁里）；
  `hey-assets/{packages,deps}` 被标记 `-text`，CRLF 归一化会让抽取件 SHA 失真

## 5. 已知范围边界（2026-11-17 定）

- **不做**：自动更新链路（Phase 3 代码在 patch 里保留，不验收）、HEY Operations SSH 面板
  （工具带 `when` 门控，不出现 ≠ 报错）。详见 `PLAN.md`「范围边界」表。
- **待决策**（见 `notes/parity-gap-review.md` §4）：
  - 更新 feed 半开——CI 仍设 `UPDATE_PUBLIC_URL`，未签名包也会带 `app-update.yml`，而
    `feeds/win-x64/` 没部署，点「检查更新」会 404。建议去掉该变量（UI 变「不支持」）或建目录。
  - 壳层基线是 beta3，Mac 已 beta4（`main.js` +6,617 字节）。插件层未变，壳层差异未逐一比对。
- **待真机验收**：`notes/phase4-acceptance.md` 第 4 节 9 步 + `notes/parity-gap-review.md` §5 的 4 项
  （CI 完整出包记录、账号登录、`coding_*` 在 ACL 沙箱下跑通、卸载重装）。
