# 逆向还原的 TypeScript 源码（dsh-skill-uma）

## 这是什么

`src/*.ts` 是从发布包 `lib/*.js` **逆向还原**的可读 TypeScript，由 esbuild bundle 的
`//#region` 标记与 tsc 直出保留的 JSDoc / 变量名推导而来。**它不是 DeepSeek 的原始源码**，
也没有 sourcemap 或 `.d.ts` 可供逐字校验。

- 还原依据：`lib/types/*.js` 是 tsc 直出（注释、命名、函数签名完整）；`lib/index.js` 是
  esbuild bundle，用 `//#region lib/types/...` 标出原始模块边界。
- 推断部分：所有 `interface` / 类型注解 / 泛型参数由调用点反推，名字可能与原始定义不同。
- 等价部分：控制流、字符串、错误处理、加解密参数与 `lib` 逐行一致（逐条核对过）。

## 怎么用（重要）

1. **运行时只认 `lib/*.js`**。注入脚本 `scripts/inject-uma.mjs` 复制的是整个包目录，
   Node 按 `package.json` 的 `main: lib/index.js` 加载，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回对应 `lib/*.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. 要用 `tsc` 校验这些文件，需要补齐上游类型包（`@deepseek-ai/*`、`node:sqlite` 在
   Node 24 的类型、`zod` 等）并自行写 `tsconfig`；仓库不提供这套配置，因为它不是构建路径。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/types/resources.ts` | tsc 直出，152 行 | 高 | 类型别名/泛型名丢失；逻辑与注释近乎原样 |
| `src/types/index.ts` | tsc 直出，87 行 | 高 | 7 个 interface 为推断；导出面一致 |
| `src/index.ts` | esbuild bundle 入口 | 高 | 由 `//#region` 边界反推模块拆分，导出面一致 |

## 样本范围

本目录只覆盖 `dsh-skill-uma`（403 行 JS）一个包，用于评估「还原到 TS 级别」的可行性与质量。
UMA 自有 12 包中另有 7 个服务端包可做同等还原（合计约 6,000 行）；
4 个 UI 客户端包是压缩成单行的 bundle（最长单行 258K 字符），**不具备有意义的还原条件**。
