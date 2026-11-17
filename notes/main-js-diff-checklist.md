# main.js 与上游逐段比对清单

> HEY 侧：Mac 包 `app.asar` 内 `lib/main.js`（约 24,700 行 bundle，带 107 个 `//#region` 原始路径标记）
> 上游侧：`deepseek-harness/apps/desktop/src/*.ts`（main.ts 1619 行 + 92 个模块，v0.2.2-rc.3）
> 结论先行：**HEY 的壳层 = 上游 0.2.2-rc.3 + 7 个独有模块 + 少量定制点**。比对方法与复核建议见文末。

## 一、HEY 独有模块（7 个，必须搬运）★

| # | 模块 | main.js 行号 | 内容 | 移植决策 |
|---|---|---|---|---|
| 1 | `about` | 3748-3800 | HEY 品牌的"关于"页：产品版本 + 内核身份（"DeepSeek Harness {version}"）+ 诊断信息 | 整段搬运，纯函数 |
| 2 | `hey-home` | 9709-9720 | **独立数据根**：`HEY_HOME` 环境变量或 `~/.hey`，不读 DSH_HOME，不做旧数据迁移 | 整段搬运；Windows 上 `~/.hey` → `C:\Users\<u>\.hey`，`resolveDshHome` 上游已有 |
| 3 | `operations-vault` | 18655-19011（357行） | SSH 运维凭证保险库（id/fingerprint/auth/save/credentials/file/sealed 七类 schema，加密落盘） | 整段搬运；与 `dsh-uma-base/lib/operations-ssh.js` 配套；重点测 Windows 凭证存储路径 |
| 4 | `updates/electron-updater/http-executor` | 19108-19156 | 自定义 electron-updater HTTP 执行器（依赖 6.x 私有字段） | 整段搬运；Windows 上重点回归（块地图差分下载走这里） |
| 5 | `updates/electron-updater/channel` | 19199-19210 | `selectUpdateChannel` nightly/stable 通道选择 | 整段搬运 |
| 6 | `updates/electron-updater/discard` | 19239-19294 | **更新残留清理**：撤销 pending 目标、关闭本地 feed server、清空 cacheDir——这就是缓存残留的治理逻辑 | 整段搬运；**顺手排查 Mac 版双份 zip bug**：确认 quitAndInstall 路径是否真的走到了 discard |
| 7 | `desktop-origin-migration` | 24202-24289 | 旧 `hey://` scheme → 新 URL 的迁移（LEGACY_DESKTOP_SCHEME + MARKER 文档） | 整段搬运；Windows 首版可能无旧装机，可带空跑逻辑 |

## 二、共有模块（59 个）——按差异分层

> ⚠️ 评分方法：bundle 内单行字符串字面量 vs 上游 TS 源码差集。打包器会拆分模板串导致计数虚高，**数值只用于排序定位，精确等价需按文末方法复核**。

### ★ 高差异（真实定制，重点比对）
| 模块 | main.js 行 | 说明 |
|---|---|---|
| `locale` | 1735-3747 | **最大定制点**：8 语言全量文案字典，含大量 HEY 专属文案（"A equipe HEY está trabalhando"、团队/欢迎/更新文案）。Windows 版直接整体复用，只需审 win 专属键 |
| `main` | 24351-24673 | 主入口定制：菜单（speechMenu 等）、`manifest.umaProductVersion`、窗口创建分支。逐段对照上游 main.ts 搬差异 |

### ? 中差异（需人工确认是定制还是打包噪音）
`host-process`(13883) · `ipc`(1439) · `account-backend`(20799) · `mandatory-update-policy`(21662) · `file-actions`(1516) · `platform-view`(17137) · `command-management`(19672) · `web-document`(19898) · `update-coordinator`(19295) · `welcome-backend`(21062) · `policy-test-auth`(22419) · `mandatory-update-window`(21984) · `browser-guests`(22886) · `file-drag`(17549) · `welcome-window`(20660) · `keyboard`(23618) · `update-presentation`(21425) · `update-dialog`(22672) · `runtime-tree`(9725) · `operation-journal`(20304) · `welcome-api`(20637) · `update-journal`(21245) · `update-configuration`(9526)

### ≈/＝ 低或无差异（≈37 个）
`update-attention`、`platform-ipc`、`crash-report`、`project-manager`、`tray`、`settings*`、`paths`、`single-instance`、`startup-error`、`duration-env`、`directory-picker`、`core-package-set`、`client-metadata`、`backend-controller`、`fatal-recovery`、`node-environment`、`operation-report-job`、`quit-confirmation`、`keybindings`、`device-info`、`locale-cache`、`microphone-permissions`、`login-shell-environment`、`background-notice`、`update-*`（channel/attention/error/schedule/cleanup-log/overlay/window/settings）、`mandatory-update-ipc`、`file-drag-files`、`ipc` 等。
→ **策略：以上游源码为准，不搬运**（上游就是同一份）。

## 三、renderer 层差异（已逐文件 diff）

| 文件 | 结果 | 处理 |
|---|---|---|
| welcome.html / mandatory-update.html / mandatory-update.css / mandatory-update.js / update-close.svg / shell-theme.js | **完全一致** | 用上游 |
| welcome.css | ★差异 | 比对搬运（HEY 品牌样式；含 macOS vibrancy 降级注释） |
| mandatory-update-frame.js | ★差异 | 比对搬运 |
| update-dialog.html/.css/.js | ★差异 | 比对搬运（HEY 更新对话框定制） |
| assets/ | HEY 多 3 个：`heywork-mark.svg`、`welcome-brand-dark.svg`（上游 window-material.css 也有差异可能） | 复制 HEY 资产，注意上游 `welcome-brand.svg` 与 HEY 版可能不同，取 HEY 版 |
| welcome.js | 仅上游有 | 上游新增模块，检查 HEY welcome.html 是否引用 |
| lib/welcome/（字体/品牌 CSS） | HEY 侧在 `lib/welcome/`（montserrat woff2 等），上游位置需核对 | 整体搬运 |

## 四、上游独有、HEY bundle 未含（21 个）

`preload-*`（9 个，上游独立打包 preload 脚本）、`command-installation`、`command-manager-entry`、`host-protocol`、`operation-history`、`operation-report`、`operation-report-worker`、`owned-directory`、`parent-authentication`、`release`、`windows-layout`。
→ 均为上游标准组成（preload 单独入口编译，operation-report-worker 在 HEY 包里是独立文件 `lib/operation-report-worker.js`）。**全部用上游，无需搬运**。注意核对 HEY Mac 包 asar 内无 preload 文件——确认上游 electron-builder 的 files 配置会正确产出 preload。

## 五、精确复核方法（推荐在 Phase 0 后执行）

字面量比对的噪音无法完全消除。精确做法：
1. 用上游源码原样构建 0.2.2-rc.3 的 `lib/main.js`（同 tsdown/bundle 配置）
2. 对两个 bundle 按 `//#region` 切片，同名 region 做**规范化文本 diff**（剥注释/空白）
3. 差异 region = 真实 HEY 定制清单，与本文档 ★/? 名单对照，多退少补

## 六、搬运工作量估计

| 项 | 工作量 |
|---|---|
| 7 个独有模块 | 0.5 天（源码即取即用，重点是 Windows 路径回归） |
| locale 字典 | 0.5 天（整体复用 + win 文案审校） |
| main 定制段 | 1 天（按上游 diff 定位，改在上游 main.ts 上） |
| 中差异 23 模块确认 | 0.5-1 天（建议用第五节方法自动化） |
| renderer 差异 5 文件 + 资产 | 0.5 天 |
