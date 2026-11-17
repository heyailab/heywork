# 逆向还原的 TypeScript 源码（dsh-tool-uma-workflow）

## 这是什么

`src/*.ts` 是从发布包 `lib/index.js`（333 行）**逆向还原**的可读 TypeScript，由 esbuild bundle 的
`//#region` 标记与保留的 JSDoc / 变量名推导而来。**它不是 DeepSeek 的原始源码**，也没有
sourcemap 或 `.d.ts` 可供逐字校验。

- 还原依据：`lib/index.js` 是 esbuild bundle，只有一个 `//#region lib/types/index.js`；
  本包没有独立的 `lib/types/*.js`，模块拆分完全依赖该标记。
- 推断部分：`ctx` / args / exec / 目录条目等 interface 由调用点反推，名字可能与原始定义不同。
- 等价部分：三个工具（`uma_artifact_write` / `uma_artifact_read` / `uma_gate_status`）的参数、
  输出 schema、render 文本、gate 分级与全部错误文本与 `lib` 逐行一致
  （用 tsc token 流逐 region 核对过）。

## 源文件与模块边界

| lib region | 还原文件 | 行数 | 包级导出 |
|---|---|---|---|
| `lib/types/index.js` | `src/types/index.ts` | 408 | 是（3 个符号） |
| bundle 入口重导出 | `src/index.ts` | 9 | 是（唯一对外导出面） |

## 怎么用（重要）

1. **运行时只认 `lib/index.js`**。注入脚本复制的是整个包目录，Node 按 `package.json` 的
   `main: lib/index.js` 加载，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回 `lib/index.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. 要用 `tsc` 校验这些文件，需要补齐上游类型包（`@deepseek-ai/dsh-tools` /
   `dsh-util-uma-delivery` 等）并自行写 `tsconfig`；仓库不提供这套配置，因为它不是构建路径。
   本目录已用仓库自带的 `uma-assets/deps/typescript/lib/typescript.js`（TS 6.0.3）
   `transpileModule`（target ES2022 / module ESNext / reportDiagnostics）做纯语法校验，0 error。

## 导出面对照（逐项）

```js
export { apply, inject, name };
```

| 符号 | 来源 region | 在 `src/index.ts` 中 |
|---|---|---|
| `apply` | index | ✓ |
| `inject` | index | ✓ |
| `name` | index | ✓ |

`compose` 是 `lib/types/index.js` region 的内部函数，不在包导出面。

## 发现（可疑点，一律未"修正"）

1. `compose()` 用 `new Date().toISOString()` 写 frontmatter 的 `updated` 字段；
   esbuild 的 `/* @__PURE__ */` 注释在还原文件中保留（不影响逻辑）。
2. gate 分级来自 `@deepseek-ai/dsh-util-uma-delivery` 的 `requiredArtifacts(depth, phase)`：
   `patch` 返回空数组（因此 `ready=true`）；`feature` 在 `documents` 阶段只要 `spec`；
   `product` 在 `documents` 阶段要 4 份前置文档、在 `delivery` 阶段要全量 7 份。照抄。
3. `uma_gate_status` 在 `.uma` 目录不存在（`FS_NOT_FOUND`）时直接返回
   `exists:false` + 按 `requiredArtifacts` 算出的 `missing/blocked`，**不创建目录**。
   照抄，未改成"自动初始化"。
4. `uma_artifact_write` 的 sandbox 前置条件是 `ctx.fs.sandboxMode !== undefined && policy === undefined`
   才抛 `ToolContextUnavailableError`；`policy.resolve({ session })` 的结果直接透传给
   `ctx.fs.writeText`。注意它只传 `session`，未传其它上下文。照抄。
5. `ctx.waterfall("fs/write-intent", target, exec, () => void 0)` 的 fallback 返回 `undefined`；
   该 `intent` 被原样交给 `writeText`。照抄。
6. `evaluateArtifact(args.artifact, args.content)` 用的是**原始 content**（未加 frontmatter），
   与落盘的 `compose(...)` 结果不同——这是原样逻辑，未改成对落盘文本求值。
7. 目录扫描只认 `entry.type === "file"` 且文件名去掉 `.md` 后在 `ARTIFACTS` 中的条目；
   排序用 `ARTIFACTS.indexOf(left.artifact) - ARTIFACTS.indexOf(right.artifact)`。照抄。
8. `@deepseek-ai/dsh-tools` 与 `dsh-util-uma-delivery` 无 `.d.ts`，`defineTool` / `ARTIFACTS`
   等外部符号的类型在还原文件里视为未知；本地 interface 全部由用法推断。
9. `package.json` 的 `exports.types` 指向 `./lib/types/index.d.ts`，但包内没有任何 `.d.ts`
   文件（悬空引用）。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/types/index.ts` | bundle region，408 行 | 高 | ctx/args/entry 接口为推断；三工具 schema、render 文本与 gate 分级逐字一致 |
| `src/index.ts` | bundle 入口 | 高 | 3 个导出符号同序复刻，无逻辑 |

## hash 文件名映射

无。本包 `lib/` 只有 `index.js`，没有 hash 命名的分片文件；包内无 sourcemap、无 `.d.ts`。
