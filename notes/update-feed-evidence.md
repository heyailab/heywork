# UMA 更新机制与 beta5 下载证据

> 记录时间：2026-11-18
> 触发原因：用户从应用内更新检查器看到 `beta5.20261118.3`，问完整下载 URL。
> 结论：**从真实更新过程抓到了版本化文件名与 feed URL**，并厘清了「手动下载」与「应用内更新」是两条不同通道。

## 1. beta5 的下载证据（实测抓取）

用户在 Mac 版 UMA 应用内点了"更新"，我在下载过程中抓到了缓存目录的变化：

| 项 | 值 |
|---|---|
| 版本 | `1.0.0-beta5.20261118.3` |
| 架构 | mac-arm64（Apple 芯片） |
| 下载中临时文件名 | `temp-uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip` |
| 完成后的正式文件名 | `uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip` |
| 文件大小 | 420,140,017 字节（400.7 MB） |
| SHA-512 | `uY8eKoHJhVgzHId5+fzrh2xXJMjsO7lwESgTzAUkH/MJI5pwFrFfcu4k5M2w9qcz80LR6/VOmSpWSP1pYDVHng==` |
| 缓存位置 | `~/Library/Caches/uma-studio-updater/pending/` |

`pending/update-info.json` 原文：

```json
{
  "fileName": "uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip",
  "sha512": "uY8eKoHJhVgzHId5+fzrh2xXJMjsO7lwESgTzAUkH/MJI5pwFrFfcu4k5M2w9qcz80LR6/VOmSpWSP1pYDVHng==",
  "isAdminRightsRequired": false
}
```

从安装包内 `Contents/Resources/app-update.yml` 读出的 feed 配置：

```yaml
provider: generic
url: https://studio.umayun.com/uma-studio/feeds/mac-arm64/
channel: nightly
updaterCacheDirName: uma-studio-updater
```

**完整下载 URL（electron-updater 拼接规则：feed URL + fileName）**：

```
https://studio.umayun.com/uma-studio/feeds/mac-arm64/uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip
```

`Contents/Info.plist` 确认 `CFBundleShortVersionString = 1.0.0-beta5.20261118.3`。

## 2. 两条不同的下载通道（重要）

| 通道 | URL | 用途 | 实测状态 |
|---|---|---|---|
| 官网手动下载 | `https://studio.umayun.com/desktop/uma-studio-latest-macos-arm64.dmg` | 新用户下载 | HTTP 200，但内容是 beta4（11/17 构建，302MB） |
| 官网 Intel 版 | `https://studio.umayun.com/desktop/uma-studio-latest-macos-x64.dmg` | 新用户下载 | HTTP 200，beta4（329MB） |
| **应用内更新 feed** | `https://studio.umayun.com/uma-studio/feeds/mac-arm64/` | 已安装用户更新 | **beta5 从这里下载**（应用内成功） |
| Windows feed | `https://studio.umayun.com/uma-studio/feeds/win-x64/` | 不存在 | HTTP 410 retired |

**结论**：`desktop/` 和 `feeds/` 是两个不同的分发路径，`desktop/` 的 latest 还是 beta4，
而 `feeds/` 已推 beta5。直接 curl feed URL 会拿到 410，但应用带完整 header 就能下载——
下载走腾讯云 EdgeOne CDN（`studio.umayun.com.eo.dnse0.com`，实测连 `43.163.177.32:443`），
不是直连源站。

## 3. 应用内更新检查器的机制（从 beta4 主进程逆向）

端点：

```
GET https://studio.umayun.com/api/v0/check_client_update?scenario=launch
```

请求头（`platformClientHeaders` + 额外三项）：

```
x-client-platform: desktop-darwin
x-client-bundle-id: studio.uma.desktop
x-client-version: 1.0.0-beta4.20261117.1
x-client-locale: zh
x-client-timezone-offset: 480
x-client-arch: arm64
x-client-update-channel: nightly
x-client-bundled-dsh-version: 0.2.2-rc.3
```

- 这是**强更策略**检查，返回策略与版本信息（用户看到 beta5 就是这里来的），不是安装包 URL
- 手动 curl 该端点返回 `{"code":"INVALID_DESKTOP_TARGET","status":400}` ——
  服务端已对无完整上下文的直连请求做了限制
- 下载 URL 不由这个端点直接给出，而是由 `app-update.yml` 的 feed URL + `update-info.json` 的 fileName 拼出

## 4. 监测脚本

`scripts/watch-update.sh` —— 在应用内点更新时抓缓存目录变化，拿版本化文件名：

```bash
bash scripts/watch-update.sh start   # 记录基线，然后去点更新
bash scripts/watch-update.sh diff    # 点完对比，输出新增文件与 update-info.json
bash scripts/watch-update.sh watch 120    # 或直接监测 120 秒（轮询，边下边抓）
```

原理：electron-updater 下载时先写 `pending/temp-<fileName>`，完成后改名为 `<fileName>`
并更新 `update-info.json`。临时文件名里就有完整版本+架构，无需抓包。

## 5. 更新包形态与缓存行为（实测）

### 5.1 是完整安装包，不是增量

拆开 beta5 的 zip 验证：

| 项 | 值 |
|---|---|
| 条目数 | 7,637 个文件 |
| 解压后总大小 | 1,173,700,523 字节（1.09 GB） |
| Electron 框架 | `Electron Framework.framework/Versions/A/Electron Framework` = 201,521,216 字节（完整） |
| 压缩后 | 420,140,017 字节（400.7 MiB） |

包内那些 `.patch` 文件（`0001-disable-external-updates.patch` 等）是 libreoffice-kit 源码自带的
补丁素材，**不是更新用的 delta**。整个包是可独立安装的完整 `.app`，不依赖旧版本。

feed 里的 `current.blockmap` 是 electron-updater 用来做**分块断点续传**的，
不是增量更新——下载时可复用相同块，但最终产物是完整 zip。

### 5.2 装完不删更新包，且留两份

实测缓存目录（beta5 安装前后都在）：

```
~/Library/Caches/uma-studio-updater/
├── update.zip              ← 根级副本，装完不删（420 MB）
├── current.blockmap        ← 根级，装完不删
└── pending/
    ├── uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip   ← 正式下载包（420 MB）
    ├── current.blockmap    ← 又一份
    └── update-info.json
```

证据：beta4 那次的 `update.zip` 从 11/17 15:03 一直留到 11/18 08:24（近 17 小时），
beta5 下载完又是两份共存 → **累计约 840 MB 残留**。

原因（与之前 UMA 移植里的分析一致）：
- electron-updater 只清 `pending/`，且仅在切换更新通道时触发（`discard`）
- 根级的 `update.zip` + `current.blockmap` 从没人清
- Mac 官方版没有我们 Windows 移植里加的 `cache-sweep.ts` 修复

手动清理：删 `~/Library/Caches/uma-studio-updater/update.zip` 和根级 `current.blockmap` 即可
（pending 那份可保留作回滚）。

## 6. 对 HeyWork 项目的意义

1. **没有 Windows 版是事实**：官网只有 macOS 下载，Windows feed 返回 410。V1 方向（在官方 dsh 上自建 Windows 功能面）正确。
2. **更新链路不在 V1 范围**：用户已决定更新用官方默认/不做，本文件仅作机制留档。
3. **基线漂移更新**：Mac 正式版已从 `beta4.20261117.1` → `beta5.20261118.3`。
   `notes/parity-gap-review.md` 里"beta4 是最新"的表述已过时；但插件层是否变化需用
   `scripts/inspect-mac-manifest.mjs` 对 beta5 包重新核对（这台 Mac 升级后才有新 asar）。
4. **`desktop/latest` 与实际版本不一致**（显示 beta4、feed 是 beta5），说明官网手动下载链接是滞后的固定名。

## 7. feed 的 `held` 状态与下载机制逆向（2026-11-18，待观察）

> **状态：未证实的假设，保留观察，不下定论。** 结论会随后续复查更新。

### 7.1 已确证事实（有证据）

| 项 | 值 | 证据来源 |
|---|---|---|
| 下载成功时间 | 08:13 起，08:15:58 完成 | `update-info.json` / 缓存文件 mtime |
| 当下 feed 状态 | `HTTP 410` + `x-uma-download-state: held` | curl 响应头（08:37–08:52 多次一致） |
| retired 文案 | "This UMA Studio download is retired. Use the current release from studio.umayun.com." | 响应体 |
| 官网 latest dmg | 仍是 beta4，`last-modified: 11/17 21:51`，未变 | curl HEAD |
| CDN | EdgeOne（`studio.umayun.com.eo.dnse0.com`），多 IP 一致 410 | dig + curl `--resolve` |
| feed 所有路径 | 清单/zip/blockmap/目录索引全部 410 held | 枚举请求 |

### 7.2 下载链路逆向（beta5 主进程 `/tmp/beta5-main.js`，已导出留档）

- `downloadUpdate()` → `updates.download(version, revision)` → `this.updater.downloadUpdate()`
- `DesktopUpdateHttpExecutor extends ElectronHttpExecutor`，**只重写超时处理**
  （`addErrorAndTimeoutHandlers`），**无签名、无 token、无自定义 header**
- `selectUpdateChannel()` 仅设 `channel/allowDowngrade/allowPrerelease`
- 强更策略 API `check_client_update`：`credentials: "omit"`（anonymous），
  header 为 5 个 `x-client-*`（bundle-id 故意留空、locale=`zh_CN`、offset 为字符串）；
  完整 header 下返回 `code:0, biz_data:null`（正常，与包分发无关）
- feed URL 来自 `app-update.yml`：`https://studio.umayun.com/uma-studio/feeds/mac-arm64/`

**推论**：zip 下载本身是匿名标准 electron-updater 请求，不存在可复现的"客户端签名"。

### 7.3 已排除的假设

- ❌ 客户端签名 —— 源码无签名逻辑
- ❌ header 精确匹配 —— 带全套源码 header 后策略 API 正常但 zip 仍 410
- ❌ 账号灰度 —— 内测用户少、全员可收（用户判断）
- ❌ 单节点缓存 —— 多 CDN IP 一致

### 7.4 待观察假设（保留）

`held` 可能是 beta5 发布后被临时暂停分发（如发现问题紧急回滚），
或分发窗口的常态机制。**当前不区分这两者**。判定方法：定期跑
`scripts/probe-feed-status.mjs`，观察 `x-uma-download-state` 是否从 `held` 变化，
以及官网 latest dmg 的 `last-modified` 是否更新到 beta5。若长期 held 且官网
始终 beta4，则倾向"beta5 被撤回"；若状态恢复，则为临时窗口。

### 7.5 对用户质疑的记录（重要）

用户质疑："若服务端关了，其他 beta4 用户如何升 beta5？" —— 该质疑成立，
推翻了"服务端恶意关门导致用户升不了"的说法。已升级用户不受影响，
未升级用户停在完整可用的 beta4，不存在用户被卡住的情况。此点必须保留，
防止后续把假设误当成"产品下线"的结论。

## 8. beta5 安装包备份（GitHub Release）

官方 feed 外部不可下（§7），故把 Mac 上已下好的 zip 备份到私有仓库 Release，
供 Windows 端留存/分析。**仓库为私有，浏览器直链会 404，必须带 token 走 API。**

| 项 | 值 |
|---|---|
| Release tag | `uma-beta5-archive` |
| Release id | `449374944` |
| 资产 id | `761257352` |
| 资产名 | `uma-studio-1.0.0-beta5.20261118.3-mac-arm64.zip` |
| 大小 | 420,140,017 字节（API 核对一致，state=uploaded） |
| SHA-256 | `d79a560cfef0d12d6be3bf32ccad87c8f00e37db269be6feeb2cfe6c6b8e55c4` |
| 上传脚本（Mac） | `scripts/upload-release-asset.sh`（token 从 `~/.github-token` 读） |
| 下载脚本（Windows） | `scripts/download-beta5.ps1`（填 token，走 API 端点，自动校验大小+SHA256） |

> 浏览器直链（仅公开仓库可用，本仓库私有**不可用**）：
> `https://github.com/heyailab/uma-window/releases/download/uma-beta5-archive/<asset>`
>
> 可靠的下载方式是 Windows PowerShell 跑 `scripts/download-beta5.ps1`，
> 它调用 `GET /repos/{owner}/{repo}/releases/assets/{id}` + `Accept: octet-stream`，
> 由 GitHub 重定向到带签名的 CDN（已实测返回 206 并可取数据）。

**注意**：这是 macOS 安装包，Windows 上只能留存/解包分析，不能安装运行。
