/**
 * 【逆向还原】由 `lib/index.js` 反推，非 DeepSeek 原始源码。
 *
 * lib/index.js 是 esbuild bundle，`//#region lib/types/...` 标记保留了五个原始模块边界：
 *   engineering-guides.js → src/types/engineering-guides.ts（被内联，未出现在包导出面）
 *   coding-standards.js   → src/types/coding-standards.ts
 *   redact.js             → src/types/redact.ts
 *   ssh-target.js         → src/types/ssh-target.ts
 *   index.js              → src/types/index.ts（聚合层，含 export 汇总）
 * 本文件对应 bundle 入口的重导出，导出面与 lib 末尾 export 语句逐字一致（14 个符号，顺序相同）。
 * 类型注解由用法推断，运行时仍以 lib/*.js 为准；详见 src/README.md。
 */
export {
  ARTIFACTS,
  BUILTIN_CODING_GUIDES,
  CODING_STANDARD_RULES,
  CODING_STANDARD_SOURCES,
  REQUIRED_ARTIFACTS,
  evaluateArtifact,
  evaluateCheckpoint,
  evaluateGate,
  parseUmaSshTarget,
  redactDevelopmentText,
  requiredArtifacts,
  selectCodingStandards,
  splitFrontmatter,
  umaSshUri
} from './types/index.ts'
