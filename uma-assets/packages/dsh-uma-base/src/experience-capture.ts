/**
 * 【逆向还原】由 `lib/experience-capture.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/experience-capture.js 是 esbuild bundle，用 //#region 标出原始模块边界：
 *   lib/types/experience-capture.js → src/types/experience-capture.ts（实现）
 *   入口重导出                       → 本文件（导出面与 lib 逐字一致）
 * 运行时只认 lib/*.js，改 src 需手动同步回 lib，无构建链，详见 src/README.md。
 */
export { apply, inject, name } from './types/experience-capture.ts'
