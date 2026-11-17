# 逆向还原的 TypeScript 源码（dsh-uma-web）

## 这是什么：纯配置壳，无 TS 可还原

`lib/index.js` 全文只有一行 `export {};`。该包**没有任何可还原的 TypeScript 逻辑**——
它是一个**纯配置壳**：包体本身不注册工具、不导出类或函数，只通过随包分发的 YAML 补丁
（`cordis.patch.yml`、`presets/*.patch.yml`）向 profile 挂载配置。

因此 `src/` 下**只有本 README**，没有、也不应有人为编造 `src/*.ts`。这与同仓库的
`dsh-uma-task-budget`（5 个 JS 文件、约 1,205 行，已还原到 `src/`）不同。

## 在 profile 中的作用

`package.json` 的 `dsh.bundle.patch` 列出 4 个补丁文件，由打包器在生成 profile 时应用：

| 补丁 | 作用 |
|---|---|
| `cordis.patch.yml` | 挂载 UMA web 层 / 客户端插件 entry：把 `ui-uma-task-budget`、`uma-remotes`、`ui-uma-design`、`ui-knowledge`、`ui-design-studio`、`ui-repo-wiki`、`ui-uma-brand` 等客户端模块插入 Cordis 图；配置 `deepseek-account` / `llm-deepseek-account` / `llm-pi-ai` 指向 UMA Studio，并禁用 DeepSeek 官方 web 搜索、遥测等条目。 |
| `presets/standard.patch.yml` | 向内核 `standard` preset 注入 UMA 工具与技能（`skill-uma`、`tool-uma-design`、`tool-uma-workflow`、`coding-tools`、`repo-wiki-context` 等）及 persona 前后缀。 |
| `presets/ptc.patch.yml` | `ptc` preset 的同类 UMA 扩展。 |
| `presets/minimal.patch.yml` | `minimal` preset 的同类 UMA 扩展。 |

`package.json` 的 `dependencies` 同时把上述客户端 UI、Agent、coding、knowledge 等包拉进
打包闭包；`exports` 把 `.` 指向 `lib/index.js`，并把 `./cordis.patch.yml`、
`./presets/*.patch.yml` 暴露给打包器。**这就是它在 profile 里的全部作用：作为 UMA web 层
与客户端插件 entry 的清单载体。**

## 怎么用（重要）

1. **运行时只认 `lib/*.js`**（此处仅 `export {}`）与随包 YAML。注入脚本按 `package.json`
   的 `main: lib/index.js` 加载，不会编译 `src`。
2. **没有构建链**。本包无 TS 逻辑可改；若要调整挂载行为，改的是 YAML 补丁与 `package.json`，
   而不是 `src`。任何新增的 `src/*.ts` 都不会进入运行时，除非手动同步回 `lib` 并改导出配置。
3. `package.json` 声明 `lib/types/index.d.ts`，但发布包里没有该文件，也没有 sourcemap；
   无可供逐字校验的原始产物。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `lib/index.js`（1 行 `export {}`） | esbuild / tsc 空模块 | — | 无逻辑，无可还原代码；以 YAML 配置为准 |

## 发现

- `lib/index.js` 没有任何 import、export 值或语句体，确认是空入口壳。
- `exports` 中 `./types` 类型路径在 `package.json` 里被省略（仅 `./cordis.patch.yml` 等），
  与 `package.json` 顶层 `types: lib/types/index.d.ts` 的声明并存，二者皆为无实体的声明，
  不应据此反推源码。
