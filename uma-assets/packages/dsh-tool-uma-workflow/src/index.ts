/**
 * 【逆向还原】由 `lib/index.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/index.js 是 esbuild bundle，只有一个 `//#region lib/types/index.js`：
 *   lib/types/index.js → src/types/index.ts（含 uma_artifact_write/read、uma_gate_status）
 *   入口重导出         → 本文件（导出面与 lib 逐字一致：只有 3 个符号）
 * 类型注解从用法推断，运行时仍以 lib/*.js 为准；详见 src/README.md。
 */
export { apply, inject, name } from './types/index.ts'
