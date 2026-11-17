/**
 * 【逆向还原】由 `lib/feedback.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/feedback.js 是 esbuild bundle，用 //#region 标出原始模块边界：
 *   lib/types/feedback.js → src/types/feedback.ts（实现）
 *   入口重导出             → 本文件（导出面与 lib 逐字一致）
 * 运行时只认 lib/*.js，改 src 需手动同步回 lib，无构建链，详见 src/README.md。
 */
export { Config, apply, inject, name, submitUmaFeedback } from './types/feedback.ts'
