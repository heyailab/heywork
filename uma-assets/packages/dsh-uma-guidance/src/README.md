# 逆向还原的 TypeScript 源码（dsh-uma-guidance）

## 这是什么

`src/*.ts` 是从发布包 `lib/index.js`（501 行）**逆向还原**的可读 TypeScript，由 esbuild bundle 的
`//#region` 标记与保留的 JSDoc / 变量名推导而来。**它不是 DeepSeek 的原始源码**，也没有
sourcemap 或 `.d.ts` 可供逐字校验。

- 还原依据：`lib/index.js` 是 esbuild bundle，`//#region lib/types/client.js` 与
  `//#region lib/types/index.js` 标出了两个原始模块边界；本包没有独立的 `lib/types/*.js`，
  模块拆分完全依赖 region 标记。
- 推断部分：`ctx` / Session / agent / args 等 interface 由调用点反推，`Receipt` / `Capabilities`
  用 `z.infer` 从 schema 反推，名字可能与原始定义不同。
- 等价部分：状态机（capabilities / request / status / cancel）、换号与来源变更判定、取消与
  恢复分支、zod schema 的每条约束与正则、全部错误文本与工具描述与 `lib` 逐行一致
  （用 tsc token 流逐 region 核对过）。

## 源文件与模块边界

| lib region | 还原文件 | 行数 | 包级导出 |
|---|---|---|---|
| `lib/types/client.js` | `src/types/client.ts` | 276 | 否（被 index.ts 引用） |
| `lib/types/index.js` | `src/types/index.ts` | 349 | 是（4 个符号） |
| bundle 入口重导出 | `src/index.ts` | 10 | 是（唯一对外导出面） |

## 怎么用（重要）

1. **运行时只认 `lib/index.js`**。注入脚本复制的是整个包目录，Node 按 `package.json` 的
   `main: lib/index.js` 加载，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回 `lib/index.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. 要用 `tsc` 校验这些文件，需要补齐上游类型包（`@deepseek-ai/dsh-brand` / `dsh-llm` /
   `dsh-tools` / `dsh-util-values` / `schemastery`、`zod` 等）并自行写 `tsconfig`；仓库不提供
   这套配置，因为它不是构建路径。本目录已用仓库自带的
   `hey-assets/deps/typescript/lib/typescript.js`（TS 6.0.3）`transpileModule`
   （target ES2022 / module ESNext / reportDiagnostics）做纯语法校验，0 error。

## 导出面对照（逐项）

```js
export { Config, apply, inject, name };
```

| 符号 | 来源 region | 在 `src/index.ts` 中 |
|---|---|---|
| `Config` | index | ✓ |
| `apply` | index | ✓ |
| `inject` | index | ✓ |
| `name` | index | ✓ |

`GuidanceClient` / `GuidanceTransportError` / `guidanceOrigin` / `guidanceOperationKey` /
`readJson` / `capability` / `file` / `result` / `receipt` / `capabilities` 都是 `client.js` region
的内部符号，不在包导出面。

## 发现（可疑点，一律未"修正"）

1. bundle 中 zod 的 `z` 被 esbuild 重命名为 `z$1`（因为 schemastery 的 `z` 已占用同名）。
   还原文件保留 `z$1` 别名以便与 lib 逐行对照；原始源码很可能是 `import { z } from 'zod'`。
2. `receipt` 的 `.refine((value) => value.status === "completed" === (value.result !== void 0))`
   是链式比较（先算 `=== "completed"` 得布尔，再与后半段比较）。未改写为更"清晰"的布尔式。
3. `submit()` 逐字段比对 `reasoning_effort` / `protocol` / `source_digest` / `model_id` /
   `task_id`，但**不比对** `capability` 与 `input`。这是原样逻辑，未补校验。
4. `apply()` 在 abort 时调用 `cancelKnown()`，其失败被 `catch (_unconfirmed) {}` 静默吞掉，
   随后由 `signal.throwIfAborted()` 抛出。照抄，未记录日志或改成 rethrow。
5. 传输层 `call()` 的 POST 永不自动重放；`outcome-unknown` / `invalid-response` 只通过
   `lookup(key, ...)` 恢复，且恢复失败才回退到 `failure("unknown", ...)`。照抄。
6. `source()` 用 `workspace.id\0fingerprint.digest` 的 sha256 作为来源指纹，
   workspace 由 `sessionIds.includes(agent.id)` 取第一个匹配。照抄。
7. `Config.origin` 只做 `min(1)`，真正的规范化校验在运行时函数 `guidanceOrigin()`：
   `url.origin !== config.origin` 必须完全相等，且仅允许显式开启的 IPv4 loopback HTTP。
   照抄，未前置到 schema。
8. esbuild 把 `class GuidanceTransportError` / `class GuidanceClient` 降级为
   `var X = class ...`；还原为 `class` 声明，语义等价。
9. `package.json` 的 `exports.types` 指向 `./lib/types/index.d.ts`，但包内没有任何 `.d.ts`
   文件（悬空引用）。本目录的 interface 全部为推断，见各文件头注释。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/types/client.ts` | bundle region，276 行 | 高 | interface 为推断；zod schema / 正则 / 错误分类逐字一致 |
| `src/types/index.ts` | bundle region，349 行 | 高 | ctx/Session/args 接口为推断；状态机与全部错误文本一致 |
| `src/index.ts` | bundle 入口 | 高 | 4 个导出符号同序复刻，无逻辑 |

## hash 文件名映射

无。本包 `lib/` 只有 `index.js`，没有 hash 命名的分片文件；包内无 sourcemap、无 `.d.ts`。
