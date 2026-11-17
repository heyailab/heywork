/**
 * 【逆向还原】由 `lib/index.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/index.js 是 esbuild bundle：`//#region lib/types/index.js` 把真正的实现内联进来，
 * 入口本身只做重导出，末行 `export { UmaTaskBudgets, UmaTaskBudgets as default };`
 * 即本文件的导出面（与 lib 逐字一致，含 as default 别名）。
 * 实现模块见 `src/types/index.ts`（对应 tsc 直出的 `lib/types/index.js`）。
 * 运行时仍以 lib/*.js 为准；改动 src 后需手动同步回 lib，详见 src/README.md。
 */
export { UmaTaskBudgets, UmaTaskBudgets as default } from './types/index.ts'
