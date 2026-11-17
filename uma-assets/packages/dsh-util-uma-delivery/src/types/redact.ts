/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/redact.js` 反推，非 DeepSeek 原始源码。
 *
 * 四条脱敏规则、捕获组与替换标记逐字保留，不"修正"任何正则边界。
 * 运行时仍以 lib/*.js 为准，详见 src/README.md。
 */

/** Common credential-pattern redaction for model-visible development evidence. */
/**
* Mask common credential formats without modifying the retained source material.
* This is best-effort presentation filtering, not proof that arbitrary text contains no secrets.
* @param text - source text to project into model-visible evidence.
* @returns text with recognized credential values replaced by a marker.
*/
export function redactDevelopmentText(text: string): string {
  return text.replace(/(Bearer\s+)[a-z0-9._~+/=-]+/giu, "$1[redacted]").replace(/([?&](?:token|api[_-]?key|access[_-]?token|secret)=)[^\s&#"']+/giu, "$1[redacted]").replace(/((?:password|api[_-]?key|access[_-]?token|token|secret)\s*[:=]\s*)[^\s,;]+/giu, "$1[redacted]").replace(/\bsk-[A-Za-z0-9_-]{16,}\b/gu, "[redacted]");
}
