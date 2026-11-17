/**
 * 【逆向还原】由 `lib/profiles.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/profiles.js 是 esbuild bundle，用 //#region 标出原始模块边界：
 *   lib/types/profiles.js → src/types/profiles.ts（实现）
 *   入口重导出             → 本文件（导出面与 lib 逐字一致）
 * 运行时只认 lib/*.js，改 src 需手动同步回 lib，无构建链，详见 src/README.md。
 */
export { UMA_PROFILE_BUNDLES, isUmaProfileName, migrateUmaProfileBundles } from './types/profiles.ts'
