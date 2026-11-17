# 对齐复核：还差什么、哪些没分析到位

> 复核时间：2026-11-17（第二轮，前一轮见 `phase4-acceptance.md`）
> 复核对象：本仓库的「功能面 1:1 对齐」结论，以及它对**当前这台 Mac 上的 UMA 包**是否仍然成立。
> 口径：每条结论都要能指到一处可复跑的证据；推断与事实分开写。

## 0. 一句话结论

功能面（23 包 / 40 工具 / 20 技能 / 7 个 UI / 22 开关）**已经对齐，本轮复核未发现新的功能缺口**；
但复核出 **2 个会真实影响用户所见行为的缺陷**（强更策略错配、容器内容零校验）和 **2 个需要你拍板的偏差**
（更新 feed 半开、壳层基线落后一个小版本）。前者已修，后者待决策。

| 类别 | 条数 | 状态 |
|---|---|---|
| 已确认无误（本轮新取证） | 6 | 通过 |
| 已修（会改变下次产物的行为） | 2 | 代码/CI 已改，门禁已加 |
| 待你决策 | 2 | 见 §4 |
| 真机才能验 | 4 | 见 §5（其中 2 条是新增验收项） |
| 文档缺口 | 3 | 已补进 README / WINDOWS-DEV / 本篇 |

---

## 1. 已确认无误（本轮新验证，之前只是推断）

### 1.1 技能容器里的设计资产是全的，而且**不在磁盘上**

`dsh-tool-uma-design` 在模块初始化时有三个硬断言，任何一个不满足就直接 `throw`，
后果不是「设计工具没了」，而是**整个桌面 profile 起不来**：

```js
// uma-assets/packages/dsh-tool-uma-design/lib/index.js:213-217
if (systems.length === 0) throw new Error(`tool-uma-design: no design systems under ${systemsRoot}`)
if (references.length === 0) throw new Error(`tool-uma-design: no DESIGN.md references under ${referencesRoot}`)
if (knowledge.length === 0) throw new Error(`tool-uma-design: no knowledge sections under ${assetRoot}`)
```

而 `assetRoot` 默认是 `join(skillRoot, 'assets')` ——**这个 `assets/` 目录在包里并不存在**（Mac 的
app.asar 与我们的 `uma-assets/packages/dsh-skill-uma` 都没有）。它能工作，是因为同包的
`lib/types/resources.js` 里 `locate()` 从该路径逐级向上找同级的 `resources.umadb`，
命中后把「相对 `assets/` 的 POSIX 路径」当作容器键去查：

```js
// resources.js:10-24
const assets = join(parent, 'assets')
if ((absolute === assets || absolute.startsWith(assets + sep)) && exists(store)) {
    return { store, name: relative(assets, absolute).split(sep).join('/') }
}
```

`split(sep).join('/')` 把 Windows 的 `\` 归一化成 `/`，所以**Windows 侧不需要任何适配**。
容器内实测（`node scripts/verify-skill-container.mjs`）：

```
skills: 20
design systems: 507 (+all manifests)
DESIGN.md brands: 84
knowledge roots: 6/6 present
```

→ 结论：**不要为了「修好路径」去建一个真的 `assets/` 目录**。真建了，`exists(assets)` 之后
`readResourceFile` 会优先走明文磁盘分支，等于把 30MB 加密资产变明文、且 AAD 校验形同虚设。
这条已写进 README「已知坑」。

### 1.2 23 个包对 POSIX 零依赖

| 检查 | 结果 |
|---|---|
| `sh -c` / `/bin/sh` / `bash` 调用 | 0 处 |
| `chmod` / `symlink` 实际调用 | 0 处（命中的都是「跳过符号链接」的防御逻辑） |
| `process.platform` 分支 | 仅 `dsh-knowledge` 2 处（已显式跳过 win32 的 `O_NOFOLLOW`）+ `deepseek-account-platform` 的 schema 枚举 |
| 原生二进制（`.node/.dll/.dylib`） | 0 个 |

### 1.3 子进程调用全部是 argv 形式，Windows 可执行

`ctx.subprocess.spawn({ argv: [...] })`（无 `shell: true`），且编码工作台先过
`ctx.subprocess.resolveExecutable(...)` ——PATHEXT 解析由官方处理，`npm`/`git` 这类
`.cmd`/`.exe` 能被正确解析。**前提是 Git for Windows 在 PATH 里**（见 WINDOWS-DEV 新增的环境前置）。

### 1.4 编码工作台的沙箱在 Windows 上有实现

这是之前完全没查的一块：`dsh-coding-workbench` 的 confined 命令走 `ctx.sandbox.confine(...)`，
如果 Windows 没有后端，`coding_check/repair` 一族就是死工具。实际上游有
`packages/sandbox/sandbox-windows-acl`：restricted token + capability SID 的 allow ACE +
低完整性标签，`dsh-sandbox-local` 在 Windows 上选它。

官方自述的边界（照抄，别当成满分）：*"The guarantee stays partial: hard links alias file
objects and files ACL'd by another AppContainer tool stay unreadable."*
→ 结论：**机制存在**，但「`coding_*` 在 Windows 上真的跑通一次」仍需真机验证（§5.3）。

### 1.5 界面的 7 个客户端插件与 21 个注入目标全部可解析

门禁输出（`verify-uma-platform.mjs`）：`client packages: 7 mounted as loader entries, 21 distinct inject targets resolve`。
这条上一轮已加，本轮无变化。

### 1.6 beta4 的插件层没有漂移

你 Mac 上的 UMA 已经升到 **`1.0.0-beta4.20261117.1`**，我们冻结的基线是 `beta3.20261116.1`。
逐项核对如下（全部相同）：

| 项 | beta3（基线） | beta4（当前 Mac） | 结论 |
|---|---|---|---|
| dsh 内核 | 0.2.2-rc.3 | 0.2.2-rc.3 | 同 |
| `@deepseek-ai` 包数 | 362 | 362 | 同 |
| UMA 自有包 | 12 | 12（同名同集合） | 同 |
| `uma-platform.patch.yml` | — | 与 `uma-assets/uma-platform.patch.mac.yml` **逐字节相同** | 同 |

→ 插件层、开关层、工具层不用重做。但**壳层不一样**，见 §4.2。

---

## 2. 已修：强更策略错配（会让 Windows 首启弹出 Mac 上不存在的窗口）

这是本轮最有价值的发现。

**Mac 正式包里的事实**（`app.asar/package.json` → `dshMandatoryUpdatePolicy`）：

```json
{"origin":"https://studio.umayun.com","allowedPageOrigins":["https://studio.umayun.com"],"authentication":"anonymous"}
```

**我们 CI 原来的配置**：`AUTO_UPDATE_ENV=test` + `MANDATORY_UPDATE_TEST_ORIGIN=…` +
`MANDATORY_UPDATE_CONFIG={"allowedAuthOrigins":[…]}`。按
`apps/desktop/scripts/desktop-policy-environment.mjs`，`deployment === 'test'` 时产出的是：

```js
authentication: deployment === 'test' ? 'feishu-test' : 'anonymous'
```

**后果链**：`main.ts` 启动时 `void mandatoryPolicy.check('launch')` → 测试策略走 `feishu-test` →
拿到 `authentication-required` 就 `queuePolicyAuthentication()` → 弹出飞书测试登录窗口。
Mac 用户永远看不到这个窗口。构建、门禁、启动都不会报错，只是多一个不该有的登录窗。

**已改**（CI 与 `WINDOWS-DEV.md` 同步）：

```diff
-DSH_DESKTOP_AUTO_UPDATE_ENV=test
-DSH_DESKTOP_MANDATORY_UPDATE_TEST_ORIGIN=https://studio.umayun.com
-DSH_DESKTOP_MANDATORY_UPDATE_CONFIG={"allowedAuthOrigins":["https://studio.umayun.com"]}
+DSH_DESKTOP_AUTO_UPDATE_ENV=production
+DSH_DESKTOP_MANDATORY_UPDATE_PROD_ORIGIN=https://studio.umayun.com
```

注意 `production` 下**不能**再带 `MANDATORY_UPDATE_CONFIG`——`allowedAuthOrigins` 在正式策略里
是被拒绝的（`desktop package: production policy must not configure allowedAuthOrigins`），会直接打包失败。

**已加门禁**防回归：`verify-uma-platform.mjs` 现在读 `build-win.yml`，`AUTO_UPDATE_ENV != production`、
或 production 混用 `CONFIG`、或缺少 `PROD_ORIGIN`，三种情况都会 `::error::` 失败。实测把值改回
`test` 能立刻拦住：

```
::error::verify-uma-platform: CI uses DSH_DESKTOP_AUTO_UPDATE_ENV=test;
  the Mac build ships authentication=anonymous, which requires the production preset
```

---

## 3. 已修：技能容器只校验了「大小」，没校验「内容」

原来的门禁对 `resources.umadb` 只有一条检查：文件存在 + 打印体积（`8.5 MB`）。
但 §1.1 那三条 `throw` 完全取决于容器**内容**。换一个不含 `uma-design-systems` 的容器、
或者抽取时截断，门禁照样绿，用户首启直接黑屏/报错。

新增 `scripts/verify-skill-container.mjs`（自解密容器，无额外依赖，Node < 24 自动带
`--experimental-sqlite` 重启一次），断言：

- 技能目录 ≥ 20，且每个都有 `SKILL.md`
- `uma-design-systems/systems` ≥ 400，且每个都有 `manifest.json`（实测 507）
- `uma-design-md/brands` ≥ 60，且每个都有 `DESIGN.md`（实测 84）
- `KNOWLEDGE_ROOTS`（**从 `dsh-tool-uma-design/lib/index.js` 里读出来，不复制常量**）逐个非空

阈值取**下限**而不是精确值：Mac 出 beta5 时多几套设计系统不该让门禁红，少一半才该红。
`verify-uma-platform.mjs` 会调它并把结果并进门禁输出：

```
skill container content: skills: 20, design systems: 507 (+all manifests), DESIGN.md brands: 84, knowledge roots: 6/6 present
```

---

## 4. 待你决策

### 4.1 更新 feed 是「半开」状态

现状：功能上不做更新，但 CI 仍设了 `DSH_DESKTOP_UPDATE_PUBLIC_URL=https://studio.umayun.com/uma-studio/feeds/win-x64/`。
按 `electron-builder-config.mjs:110`，**只要设了它，未签名构建也会产出 `app-update.yml`**：

```js
const update = explicitFeedUrl !== undefined
  ? { publicUrl: explicitFeedUrl, channel: resolveDesktopUpdateChannel(env) }
  : unsigned ? undefined : resolveDesktopAutoUpdateConfig(...)
```

而 `feeds/win-x64/` 服务端没建（Phase 3 已挂起）。所以用户点「检查更新」会拿到 404。

三个选项，代价从小到大：

| 选项 | 行为 | 代价 |
|---|---|---|
| A. 保持现状 | 点检查更新 → 404 报错 | 0；但留下一个「能点但会报错」的按钮 |
| B. 去掉这个 env | `update = undefined` → 更新器永久关闭，UI 显示「当前构建不支持」 | 0；要恢复时加回一行 + 建目录 |
| C. 建 `feeds/win-x64/` 并上传首次产物 | 更新真能用 | 需要你在 studio.umayun.com 建路径，且要签名 |

我的建议是 **B**：既然本期不做更新，就让状态诚实地表现为「不支持」，而不是「报错」。
但这会改变产物形态（不再有 `app-update.yml`），所以留给你决定，我没有直接改。

### 4.2 壳层基线落后一个小版本（beta3 → beta4）

`main.js` 实测：beta3 `1,045,645` 字节 → beta4 `1,052,262` 字节（**+6,617**）。
`lib/` 下的窗口类型没变（`preload-app / preload-mandatory / preload-platform-account /
preload-update-dialog / preload-welcome / operation-report-worker` 一致），说明加的不是新窗口，
而是主进程内部的改动（菜单、托盘、IPC、恢复逻辑之类）。

另外一个细节：Mac 包 `dshBuildCommit = a7e944e3…`，与我们 pin 的 `39163dd` **不是同一个 commit**
（版本号都是 `0.2.2-rc.3`）。之前文档里写的「版本完全一致」只在版本号层面成立，commit 层面不成立。

两个选择：

| 选项 | 说明 |
|---|---|
| A. 维持 beta3 基线 | 功能面已验证一致；壳层那 6.6KB 增量属于「我们不知道改了什么」，登记为已知差异。风险低但存在盲区 |
| B. 升到 beta4 重做壳补丁 | 5 段补丁要重新 `git apply` 并修冲突（phase2/2b/2c 都改 `main.ts`/`locale.ts`），预计半天到一天；之后 `extract-mac-extras` 也要重跑一遍 |

我倾向 **A + 登记**：功能面（插件层）在 beta4 下逐字节未变，壳层 6.6KB 还没有任何证据表明影响功能。
真要升，等 beta5 或正式版一次做到位更划算。这条也留给你决定。

---

## 5. 真机才能验（其中 2 条是这次新加的验收项）

| # | 项 | 为什么必须真机 | 怎么验 |
|---|---|---|---|
| 5.1 | **CI 在 23 包改造后是否完整跑通过** | Phase 4 把注入从 12 包改到 23 包、门禁加了两道之后，仓库里没有一次「带注入的完整出包」记录；静态门禁全绿不等于 electron-builder 能过 | 看 Actions 最近一次 `build-windows` 是否绿；绿的话下载 `uma-window-baseline` |
| 5.2 | **账号登录链路**（新增） | `uma://` 协议回调 + `safeStorage` + `platform-account` + `deepseek-account` 托管账号。原 9 步验收里**一条都没有登录**，而这是产品能不能用的前提 | 装包 → 登录 → 看 `%USERPROFILE%\.uma` 下凭据落盘 → 退出重进是否免登 |
| 5.3 | **`coding_*` 在 Windows ACL 沙箱下能否执行**（新增） | §1.4 只证明了「后端存在」，没证明「能跑」。这是开发团队功能的核心动作 | 在 Windows 上开一个工作区 → `coding_inspect` → `coding_check` 跑一次 lint/test |
| 5.4 | 卸载 / 重装 / 多实例 | `~/.uma` 是否保留、单实例锁是否生效、`uma://` 二次唤起是否聚焦 | 装 → 卸载 → 看 `.uma` 是否被删；双开图标看是否只起一个 |

原来的 9 步（启动品牌页、6 处 UI、44 工具自述、`uma_resource_read`、工件 + gate、团队板、
SSH 中文路径、切语言、数据位置）仍然有效，见 `phase4-acceptance.md` 第 4 节。

---

## 6. 文档缺口（本轮已补）

1. **缺一张 Mac↔Windows 单一差异表** —— 之前差异散在 README/PLAN/phase4 三处，没有一页能一眼看完。→ 见 §7。
2. **WINDOWS-DEV 缺环境前置** —— 没写「Git for Windows 必须在 PATH」「不需要 Python」「Node 版本为什么是 24.9」。→ 已补。
3. **设计资产「在容器里、用虚拟路径访问」没写清** —— 这条直接决定「要不要 vendor 30MB assets 目录」这个判断题。→ 已写进 §1.1 + README 已知坑。

---

## 7. Mac ↔ Windows 差异矩阵（单一登记表）

| 维度 | Mac（`1.0.0-beta4.20261117.1`） | Windows（本仓库） | 判定 |
|---|---|---|---|
| dsh 内核 | `0.2.2-rc.3` | `0.2.2-rc.3`（pin `39163dd`） | 同版本；**commit 不同**（见 §4.2） |
| `@deepseek-ai` 包 | 362 | 上游 + 23 注入 | 对齐 |
| UMA 自有包 | 12 | 12 | 对齐 |
| 上游未发布一等包 | 11 | 11（`packages.extras.json` 逐包 SHA-256） | 对齐 |
| 工具 | 40 | 40（门禁 `EXPECTED_TOOLS`） | 对齐 |
| 内置技能 | 20 / 2895 文件 | 同一容器逐字节复用 | 对齐 |
| UI 面板 | 6 处 / 7 个客户端插件 | 7 个 entry、21 个 inject 目标全解析 | 对齐 |
| 产品开关 | 22（8 启用 / 14 禁用） | 同，仅 `desktopPlatform: darwin→win32` | 对齐 |
| 主进程 IPC | 50 | 42（官方全含），差 8 | 8 个是 `operations-*`×5 / `tray-publish` / `product-version` / `boot-mounted` |
| SSH 运维面板 | 有（Mac 专属菜单入口） | 不做（工具带 `when` 门控，不出现≠报错） | 已知边界 |
| 强更策略 | `anonymous` | `production` → `anonymous` | **本轮修正后对齐** |
| 更新 feed | `feeds/mac-arm64/` 已部署 | `feeds/win-x64/` 未部署 | 待决策（§4.1） |
| 数据根 | `~/Library/Application Support/...` | `%USERPROFILE%\.uma` | 设计如此 |
| 协议 | `uma://` | `uma://` | 对齐 |
| 命令沙箱 | macOS sandbox | `sandbox-windows-acl`（restricted token） | 上游支持，待真机验 |
| 语言 | 8 | 8（20 个本地化包 × 8 语言） | 对齐 |
| 壳层代码 | beta4 `main.js` 1,052,262 B | 基于 beta3 1,045,645 B | **差 6,617 B**，待决策（§4.2） |
| 签名 | Apple Developer ID + 公证 | 未签名（Phase 5） | 待办 |

---

## 8. 复跑本轮所有结论

```bash
# 容器内容（§1.1 / §3）
node scripts/verify-skill-container.mjs

# 全量合成门禁：开关 / 包 / 工具 / 客户端 / 容器内容 / 强更策略（§1.5 / §2 / §3）
node scripts/verify-uma-platform.mjs

# 平台耦合静态检查（§1.2 / §1.3）
grep -rn --include=*.js -E "sh -c|/bin/sh|bash -lc|chmod|symlink" uma-assets/packages | grep -v client.js

# Mac 侧事实：版本 / 内核 / 构建 commit / 强更策略 / 包数（§2 / §4.2 / §6）
node scripts/inspect-mac-manifest.mjs
```

---

## 附：TS 源码还原可行性（2026-11-17 追加）

**问题**：UMA 自有 12 个包能不能还原成 `src/*.ts` 级别？

**关键纠正**：本仓库里 3 个带原始 `src/*.ts` 的包（`dsh-worktree`、`dsh-deepseek-account-platform`、
`dsh-api-account-controller`）**都是上游一等包，不是 UMA 自有的**。UMA 12 包一个原始 TS 都没有，
全部是 Mac 包里的 `lib/*.js`（362 包内 sourcemap = 0、`.d.ts` = 0）。

| UMA 包分组 | 规模 | 编译形态 | 还原判断 |
|---|---|---|---|
| 8 个服务端包（base / design / task-budget / delivery / guidance / skill-uma / workflow / web） | 约 6,300 行 | tsc 直出或 esbuild 轻度打包，JSDoc + 变量名保留 | **可还原成可读 TS**，类型靠推断，逻辑可逐行等价 |
| 4 个 UI 包（3 × client-ui-uma + remotes） | 50 行但单行 25K–258K 字符 | 压缩 bundle | **不可还原**，硬转只是给压缩代码标 `any` |

**已完成全部 8 个服务端包的还原**（2026-11-17）：每个包的 `src/` 下是还原的 TypeScript，
共 **45 个 `.ts` / 7,554 行 + 8 份 README**（`dsh-uma-web` 是配置壳，只有 README）。
4 个 UI 包保持 lib 原样。还原依据：

- `lib/types/*.js` 是 tsc 直出（注释、命名、函数签名完整）；
- `lib/index.js` 是 esbuild bundle，`//#region lib/types/...` 标记保留了原始模块边界；
- 推断部分：`interface` / 类型注解 / 泛型参数由调用点反推，名字可能与原始定义不同；
- 等价部分：控制流、字符串、加解密参数、错误文本与 `lib` 逐行核对一致。

**独立验收结果**（不依赖各 agent 自报）：

| 检查项 | 结果 |
|---|---|
| `git status`：只新增 `src/`，`lib/` 与 `package.json` 零改动 | 通过 |
| 45 个 `.ts` 用仓库内 TypeScript `transpileModule` 校验 | **0 语法错误** |
| 17 个入口的运行时导出符号集合 vs 对应 lib | **17/17 完全一致** |
| 1,393 个唯一运行时字符串字面量覆盖（7 个代码包） | 除 17 个 tsc 内联 helper 文本外全覆盖（见下） |

关于那 17 个「缺失」字符串：全部来自 `dsh-uma-task-budget` 的 lib，是 tsc 为 `using` 语法内联的
`__esDecorate` / `__disposeResources` helper 的错误文本（如 `Function expected`、`SuppressedError`）。
还原件把它写回 TS 原生 `using` 声明，这些文本由编译器重新生成，属于**正确的反向编译**，不是遗漏。
该处理已在 `dsh-uma-task-budget/src/README.md` 第 5 条记录。

**注意**：`src` 是只读参考 + 改动草稿，不是构建输入。`package.json` 仍指向 `lib/index.js`，
改 `src` 必须手动同步回 `lib`，否则两边分叉。每份 `src/README.md` 都记录了还原边界、
hash 文件名映射（如 `rules-B-6_mXU8.js` → `rules.ts`）以及「可疑但逐字保留」的代码点，
例如 design 包 `design_project_create` 返回体 `system` 硬编码 `'UMA'`（非入参）等——
这类问题只登记、不擅自修正。
