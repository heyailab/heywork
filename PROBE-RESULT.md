# 实测：layer vs bundle 挂载的等价性

> 时间：2026-11-18
> 问题：V1 走官方 profile/bundle 挂载，会不会影响权限、能力、配置叠加顺序？效果是否与原 UMA 1:1？
> 结论：**权限与能力等价（源码可证）；配置叠加顺序等价（静态实测通过）；端到端 Loader 验证待依赖安装完成。**

## 1. 权限 / 能力：等价（源码证据）

cordis 的能力通过 `ctx` 注入，与插件"怎么挂进来"无关。官方 `dsh-base` bundle 挂载了全部关键服务：

```
packages/bundle/base/cordis.patch.yml:
  - id: subprocess          → dsh-subprocess-local
  - id: sandbox             → dsh-sandbox-local
  - id: sandbox-policy      → mode: workspace-write（默认权限边界）
  - id: authorization / credentials / storage / session / agent / tools / ...
```

官方 desktop profile = `dsh-base + dsh-web-app`，**base 一定在**。所以无论插件通过
product patch 通道还是 profile bundle 挂载，拿到的 `ctx` 是同一个：
`ctx.subprocess.spawn`、`ctx.sandbox.confine`、`ctx.credentials`、`ctx.tools.register` 全部一致。

权限边界由 `sandbox-policy` 的 `mode: workspace-write` 和 `authorization` 服务定义，
这两者都在 base 层，不由插件挂载方式决定。

## 2. 挂载机制：原 UMA 其实也是 bundle，不是特殊通道

原 UMA 的 desktop profile bundle 列表（来自 `patches/uma-phase1.patch:245-248`）：

```ts
const UMA_DESKTOP_BUNDLES = [
  '@deepseek-ai/dsh-base',
  '@deepseek-ai/dsh-web-app',
  '@deepseek-ai/dsh-uma-base',
  '@deepseek-ai/dsh-uma-web',
]
```

UMA 层是通过改 `project-manager.ts` 把这个列表写死进 profile 初始化的——**本质仍是 bundle 挂载**。
V1 只是把这个列表从"补丁写死"改成"profile 的 package.json 里由 plugin-manager 管理"。

差别仅在于生效路径：

| | 原 UMA | V1 |
|---|---|---|
| bundle 列表来源 | phase1 补丁写进 `project-manager.ts` | profile 的 `package.json` → `dsh.profile.bundles` |
| 22 开关来源 | product patch 文件（`DSH_DESKTOP_PRODUCT_PATCH` 通道） | profile 的 `cordis.patch.yml` |
| 最终合并算法 | 官方 `readProfilePatches` | **同一个**官方 `readProfilePatches` |

## 3. 叠加顺序：静态实测通过

官方合并算法（`packages/boot/app-boot/src/profile-context.ts:74-85`）：

```
[...bundlePatches, ...profilePatch, ...homePatch, ...overlays, ...(telemetry?)]
```

后置 patch 覆盖先置（Loader 语义）。原 UMA 的 22 开关在 product patch（最后），
V1 放在 profile patch（也是 bundle 之后）——**位置等价**。

实测脚本复刻该算法，用真实的 UMA patch 文件跑两种布局：

```
原 UMA bundle ids: 52  product switches: 22
合并后总 rows: 126 (V1: 126)
结论：叠加顺序等价 —— 每个 id 的最终生效来源类别一致

最终 22 开关的生效层（抽样）：
  ui-skill               ← [profile patch] ui-skill
  uma-feedback           ← [profile patch] uma-feedback
  deepseek-account       ← [profile patch] deepseek-account
  ...
```

**边界说明**：这是按官方源码复刻算法的静态实测，不是跑真正的 cordis Loader。
端到端确认需要装依赖后跑官方 `packages/boot/plugin-manager/tests/manager.spec.ts`
的 profile 夹具（它构造 bundle + patch 并 boot，检查 `ctx` 里的服务）。
依赖安装进行中，完成后补这一项。

## 4. 功能 1:1 判定

| 维度 | 是否 1:1 | 说明 |
|---|---|---|
| 权限 / 能力 / 工具注册 | ✅ 是 | 同一个 `dsh-base` 的 `ctx`，与挂载方式无关 |
| 配置叠加顺序 | ✅ 是（静态实测） | 两种布局下每个 id 的生效来源类别一致 |
| 功能面（40 工具 / 20 技能 / UI） | 取决于重写 | 由 specs + golden 保证，与挂载方式无关 |
| 品牌壳 / 账号 / 反馈 / 更新 | ❌ 不是 | V1 主动放弃（用官方默认），这是产品身份选择，不是挂载方式问题 |

## 5. 如果端到端实测不通过：Plan B

按用户预案，回退到"之前的 UMA 方式"，但保留一个简化：

- **保留**：打包期注入（把重写的插件放进 dsh 的 node_modules）+ 层 patch 挂载
- **保留**：最小的壳补丁（仅注入 hook + 品牌资源），不再动账号体系
- **去掉**：账号/反馈/强更/更新相关的产品配置（用官方 DeepSeek 默认）
- **去掉**：`~/.uma` 数据根、`uma://` 协议等纯品牌定制

这个折中保住了"官方账号 + UMA 功能面"的核心目标，代价是保留 1-2 段壳补丁，
跟着官方升级时需要 rebase——但只 rebase 注入 hook 那一小段，比原来的 5 段轻得多。

## 6. 待办

- [ ] 依赖装完后跑官方 `manager.spec.ts`，端到端确认 `ctx` 服务一致
- [ ] 把静态实测脚本固化进仓库（`scripts/probe-overlay.mjs`），作为可复跑证据
- [ ] 若端到端通过 → V1 定案走 profile bundle；若不通过 → 切 §5 的 Plan B
