# Phase 4 功能验收 — 对照 Mac 版 1:1

> 基线：Mac `UMA Studio 1.0.0-beta3.20261116.1`（dsh `0.2.2-rc.3`）
> 结论口径：**静态可证**（本机可复跑）与**需真机**（必须装到 Windows 上才能确认）分开记，不把推断写成事实。

## 0. 本轮最重要的一条：UMA 桌面层引用了 11 个公开仓库没有的包

Mac 包 `app.asar` 内 `dsh/node_modules/@deepseek-ai` 有 **362** 个包；上游公开仓库 `39163dd` 有 **406** 个包名，但两者差集里除了 12 个 UMA 产品包，还有 **11 个一等包只在 UMA 版构建里存在**：

| 包 | 角色 | 谁在挂它 |
|---|---|---|
| `dsh-knowledge` | 知识库服务（embedding / PDF 解析 / node:sqlite） | `uma-base` `insert:` |
| `dsh-task-query` | 任务查询服务 | `uma-base` `insert:` |
| `dsh-worktree` | git worktree（`coding-worktrees`，namePrefix `uma-`） | `uma-base` `insert:` |
| `dsh-coding-workbench` | 编码工作台：`coding_task/inspect/check/repair/review/acceptance/restore` | `uma-base` `insert:` |
| `dsh-tool-repo-wiki` | 项目 Wiki 工具族（`uma_wiki_lookup` + 10 个 `wiki_*`） | `uma-base` `insert:`、三个 preset |
| `dsh-util-repo-wiki` | Wiki 的底层工具库（`tool-repo-wiki` 的依赖） | 依赖闭包 |
| `dsh-client-ui-knowledge` | 知识库页面 | `uma-web` |
| `dsh-client-ui-repo-wiki` | 项目 Wiki 页面 | `uma-web` |
| `dsh-client-ui-design-studio` | 设计工作台页面 | `uma-web` |
| `dsh-api-account-controller` | 账号 API 控制器 | 账号链路 |
| `dsh-deepseek-account-platform` | 平台账号适配 | 账号链路 |

**为什么之前没被发现**：`prepare:dsh` 阶段的 runtime smoke 跑在注入**之前**（phase1 补丁里刻意保留上游 bundle 列表就是为了让它能过），所以「层里挂的包不存在」只会在用户第一次启动时炸；`pnpm build` 与 electron-builder 都不会校验 profile 层。

**处置**：`scripts/extract-mac-extras.mjs` 从 Mac asar 按依赖闭包抽取这 11 个包 → `uma-assets/packages/`（26.7MB，无原生二进制），抽取清单与逐包 SHA-256 记在 `uma-assets/packages.extras.json`。注入脚本改为**目录驱动**（23 个包），不再硬编码 12。

### 连带发现：`uma_wiki_lookup` 不是笔误

`uma-base/cordis.patch.yml` 的 persona 里让模型「用 uma_wiki_lookup 查 Wiki」，第一轮校验时该工具**没有任何包注册**——因为 `dsh-tool-repo-wiki` 正是缺的 11 个之一。补齐后它随 `wiki_*` 一起注册，40 个工具的清单才闭合。

### 第三方依赖池

11 个包的硬依赖里，`typescript`（`dsh-coding-workbench/lib/index.js` 顶层静态 import）、`pdfjs-dist`（PDF worker）、`zod`、`picomatch`、`js-yaml` 未必被上游组合进装上来的树。这 5 个一并抽到 `uma-assets/deps/`，注入时**仅在树里缺失才补**（树里已有则零成本），避免「打包成功、启动后某个包 import 失败」。

## 1. 门禁：`scripts/verify-uma-platform.mjs`

一条命令覆盖本轮所有静态可证项，CI 在打包前（源码模式、秒级）与注入后（`--tree` 模式、能看到真实 node_modules）各跑一次：

```bash
node scripts/verify-uma-platform.mjs                 # 源码 + uma-assets
node scripts/verify-uma-platform.mjs --tree <dsh树>  # 注入后、打包前
```

当前输出：

```
product patch: 22 switches — 8 enabled, 14 disabled
deepseek-account.desktopPlatform = win32 (x-client-platform: desktop-win)
drift guard: compared against uma-assets/uma-platform.patch.mac.yml (desktopPlatform exempt)
desktop profile = web template [dsh-base, dsh-web-app] + UMA pair
desktop layer stack: 4 bundles, 17 patch files, 269 mountable ids
injected packages: 23 (12 UMA + 11 first-party extras)
tools: 40 registered across 7 packages
skill container: 8.5 MB
locales: 20 localized packages × 8 languages
verify-uma-platform: OK — 22 switches, 40 tools, 23 packages
```

它证明的事：

1. **22 个开关全部有归属**：每个 id 都能在 `dsh-base + dsh-web-app + dsh-uma-base + dsh-uma-web` 的 269 个可挂载 id 里找到。产品补丁是最后叠加的一层，id 写错会被静默忽略——这正是需要门禁而不是人眼的原因。
2. **8 启用 / 14 禁用与 Mac 原文逐字段一致**，唯一允许的差异是 `desktopPlatform`：`darwin` → `win32`（Mac 原文留档为 `uma-platform.patch.mac.yml`，改名就是为了防止有人去「修」错文件）。
3. **`desktopPlatform = win32`** 对应 `packages/credentials/deepseek-account/src/client-metadata.ts:28` → `x-client-platform: desktop-win`；上游 base 层本就用 `process.platform` 推导同一个值（`packages/bundle/base/cordis.patch.yml:123`），这里显式钉住，防止环境异常时被降级成 `web` 而被 Platform 拒绝托管账号流程。
4. **层引用零悬空**：UMA 层里 `name:` 的每个 `@deepseek-ai/*` 都要么是上游包、要么在 23 个注入包里。
5. **40 个工具在册**，且客户端包必须带预构建 `lib/client.js`（否则窗口是空的，构建期看不出来）。

## 2. Phase 4 各项对照

| 验收项 | 机制（Windows 侧） | 静态证据 | 真机仍待确认 |
|---|---|---|---|
| 交付流水线 `uma_artifact_write/read` + gate 八工件 | `dsh-tool-uma-workflow` 3 个工具；`dsh-util-uma-delivery` 分级 patch/feature/product | 工具在册；包无平台分支 | 写入 `~/.uma` 与项目目录的实际落盘 |
| 设计工具族 10 个 | `dsh-tool-uma-design` 9 个 `design_*` + `uma_resource_read` + `uma_knowledge_search` | 校验器逐个断言；`assetRoot` 走 `dshHomePath` / 资源容器 | 设计稿预览、`design_preview` 静态快照渲染 |
| 任务预算 `uma_session_budgets` read/update | `dsh-uma-task-budget`（typert 描述符注册，非 `defineTool`） | 校验器单独解析该描述符 | 预算耗尽的拦截行为 |
| 专家指导 `uma_guidance` | `dsh-uma-guidance`，产品补丁里 `disabled: true`（与 Mac 一致），需要时由设置开启 | 开关状态 + 工具在册 | 开启后与 `studio.umayun.com` 的联通 |
| SSH 运维 | `uma_ssh_run` / `uma_ssh_servers`，底层 `ssh2` 1.17.0（纯 JS） | `uma-assets/deps/ssh2` 闭包（asn1/bcrypt-pbkdf/safer-buffer/tweetnacl）随包补齐 | Windows 路径 + 中文路径 + 私钥文件权限 |
| WeKnora 检索 | `uma_weknora_search`；`uma-weknora` 插件默认 `disabled: true` | 工具在册，层配置读 `UMA_*` 环境变量 | 开启后与知识库服务联通 |
| 项目记忆（node:sqlite） | `uma_project_memory` + `dsh-knowledge` 的 `DatabaseSync` | Electron 44 / 运行时 Node 24 支持 `node:sqlite`；`resources.umadb` 已 asarUnpack | 首次建库、并发写入 |
| 经验沉淀 | `uma_experience_record` | 工具在册 | 全局库待审队列 |
| 8 语种 locale | 20 个包 × 8 语言文件齐全 | 校验器断言文件存在（翻译质量不校验，与 Mac 同源） | 切换语言后 UI 文案 |
| 20 个内置技能 | `resources.umadb` 原样复用 | `node --experimental-sqlite scripts/inspect-skill-container.mjs` → 20 个技能 / 642 目录 / 2895 文件 | `uma_resource_read` 实际读取 |
| 团队模式 | `agent-team` 层 `defaultEnabled: true`；`uma-team` preset | 层配置；`tool-agent-team` 提示词已含 UMA 角色约定 | 建板、派活、交叉评审 |

## 3. 已知与 Mac 逐字相同的行为（不算移植缺陷）

- `dsh-api-account-controller` / `dsh-deepseek-account-platform` 的 `locale/en.json` 缺 `meta.description`，其它语种有。文件与 Mac 包逐字节相同，不做本地化修补。
- UMA 层给 `session-query-sqlite`、`uma-project-memory` 等用的是 `!!js dshHomePath(...)`，在 Windows 上落到 `%USERPROFILE%\.uma\...`——`packages/util/home-paths` 用 `node:path.join` 且有 Windows 专用的 realpath 归一化，不需要改。

## 4. 真机验收清单（装完 Windows 包后按序做）

1. 首次启动 → UMA 欢迎页品牌（不是 DSH 默认页）；数据写在 `%USERPROFILE%\.uma`，`dsh/profiles/desktop/cordis.patch.yml` 里的 bundle 列表含 `dsh-uma-base` / `dsh-uma-web`。
2. 插件管理器能看到 12 个 UMA 包 + 11 个一等包；`uma-platform.patch.yml` 的 8 启用 / 14 禁用与实际一致。
3. 问一句「列出你能用的 uma/design/wiki 工具」→ 应能报出 40 个里的相关项（尤其 `uma_wiki_lookup`、`coding_inspect`）。
4. `uma_resource_read` 读一遍任一技能（如 `uma-code-review`）。
5. `uma_artifact_write` 写一个 feature 级工件 → `uma_gate_status` 看到分级结果。
6. 团队模式建板 → 派任务 → 交叉评审。
7. SSH：连一台 Linux 机器，在中文路径下执行命令。
8. 切语言到 ja/de，重启后保持。
9. 检查更新走 `feeds/win-x64/`；装完看缓存目录只剩 `pending/` 三元组（Phase 3 的清扫）。

## 5. 复跑方式

```bash
# 重新抽取缺失包（换了 Mac 包版本时）
node scripts/extract-mac-extras.mjs --asar "<...>/UMA Studio.app/Contents/Resources/app.asar"

# 合成门禁
node scripts/verify-uma-platform.mjs

# 技能清单
node --experimental-sqlite scripts/inspect-skill-container.mjs
```
