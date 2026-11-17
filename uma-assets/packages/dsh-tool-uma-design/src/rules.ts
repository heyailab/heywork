/**
 * 【逆向还原】由 `lib/rules-B-6_mXU8.js` 反推，非 DeepSeek 原始源码。
 *
 * 该 hash 命名 chunk 是 esbuild bundle，用 //#region 标记保留了三个原始模块边界：
 *   lib/types/resources.js → src/types/resources.ts
 *   lib/types/context.js   → src/types/context.ts
 *   lib/types/rules.js     → src/types/rules.ts
 * 入口重导出 → 本文件（导出面与 lib 逐字一致：6 个符号，别名 a/i/n/o/r/t 原样保留）。
 * hash 原名到语义名的映射记录在 src/README.md。
 * 模块拆分与导出面据此还原；类型注解从用法推断，运行时仍以 lib/*.js 为准。
 */
export { readBundledText as a, readBundledResource as i, utf8Prefix as o } from './types/resources.ts'
export { searchDesignRules as n, RULE_DOMAINS as t } from './types/rules.ts'
export { readDesignContext as r } from './types/context.ts'
