/**
 * 【逆向还原】由 `lib/index.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/index.js 是 esbuild bundle，用 //#region 标记保留了原始模块边界：
 *   lib/types/index.js → src/types/index.ts（导出面与 lib 逐字一致：只有 4 个符号）
 * 其余 region 模块（resources / context / rules）来自同包的 hash chunk，见 src/README.md。
 * 模块拆分与导出面据此还原；类型注解从用法推断，运行时仍以 lib/*.js 为准。
 */
export { Config, apply, inject, name } from './types/index.ts'
