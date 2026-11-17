# 逆向还原的 TypeScript 源码（dsh-uma-task-budget）

## 这是什么

`src/*.ts` 是从发布包 `lib/*.js` **逆向还原**的可读 TypeScript，由 tsc 直出保留的
JSDoc / 变量名 / 排版、esbuild 的 `//#region` 模块边界标记，以及 typert generator
内嵌的描述符文本推导而来。**它不是 DeepSeek 的原始源码**，也没有 sourcemap 或
`.d.ts` 可供逐字校验（`lib/types/index.js`、`lib/types/types.js` 末尾有
`//# sourceMappingURL=*.js.map` 注释，但发布包里并不带 `.map` 文件；
`package.json` 声明的 `lib/**/*.d.ts` 也未随包提供）。

本包通过 **typert 描述符**注册工具，不是 `defineTool`：
- `lib/index.js` 是 esbuild bundle，入口只重导出，导出面为
  `export { UmaTaskBudgets, UmaTaskBudgets as default };`（含 `as default` 别名）。
- `lib/typert.host.js` 导出 `TYPERT`（`face: 'host'`，带 `get invocations()` 与 `model` 段）。
- `lib/typert.remote-client.js` 同时导出 `TYPERT_REMOTE` 与 `default`。

## 文件对应关系

| lib | src | 来源形态 |
|---|---|---|
| `lib/index.js`（482 行） | `src/index.ts` | esbuild bundle，仅重导出；被内联的实现来自下一行 |
| `lib/types/index.js`（383 行） | `src/types/index.ts` | tsc 直出，保留 JSDoc / 变量名 / 排版 |
| `lib/types/types.js`（1 行） | `src/types/types.ts` | 运行时 `export {}`；类型从描述符内嵌声明恢复 |
| `lib/typert.host.js`（202 行） | `src/typert.host.ts` | tsc 直出的 generator 产物，近乎逐字 |
| `lib/typert.remote-client.js`（137 行） | `src/typert.remote-client.ts` | tsc 直出的 generator 产物，近乎逐字 |

## 怎么用（重要）

1. **运行时只认 `lib/*.js`**。注入脚本按 `package.json` 的 `main: lib/index.js` 加载，
   子路径 `./typert` / `./remote` / `./types` 分别指向对应 `lib` 文件，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回对应 `lib/*.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. 要用 `tsc` 校验这些文件，需要补齐上游类型包（`@deepseek-ai/cordis`、
   `@deepseek-ai/dsh-typert-protocol`、`@deepseek-ai/dsh-storage-domain`、
   `@deepseek-ai/dsh-session`、`@deepseek-ai/dsh-llm`、`zod` 等）并自行写 `tsconfig`；
   仓库不提供这套配置，因为它不是构建路径。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/index.ts` | esbuild bundle 入口 | 高 | 仅重导出；导出面与 lib 逐字一致 |
| `src/types/index.ts` | tsc 直出，383 行 | 高 | interface 为推断；`@Remote('read'/'update')`、`using`、`[Service.init]` 由编译产物还原；逻辑/字符串/错误文本逐行等价 |
| `src/types/types.ts` | `export {}` + 描述符声明 | 中 | 类型声明取自 typert `model.types` 原文；`BRAND` 的声明位置不可考 |
| `src/typert.host.ts` | generator 直出，202 行 | 高 | 描述符字段/jsonSchema/sourceLocation 逐字保留；仅补 schema 缓存变量类型 |
| `src/typert.remote-client.ts` | generator 直出，137 行 | 高 | 同上；导出面含 `TYPERT_REMOTE` + `default` |

## 可疑点（不影响等价性，但无法从 lib 证实）

1. `lib/index.js` 与 `lib/types/index.js` 是**同一模块**的 esbuild bundle 与 tsc 直出两种形态
   （bundle 中 `//#region lib/types/index.js` 已标明）。因此只有一个实现文件
   `src/types/index.ts`，入口 `src/index.ts` 仅做重导出，符合 `dsh-skill-uma` 的既有还原约定。
2. 数字字面量在两份产物中写法不同（`1e4` vs `10_000`、`15e3` vs `15_000`），数值相同，
   `src` 采用 tsc 直出版本的可读写法。
3. `SessionId` 从 `@deepseek-ai/dsh-session` 以**值**导入（`prepare` 中调用
   `SessionId(request.sessionId)`）；typert 描述符另声明了一个 branded 类型 `SessionId`。
   二者同名但来源不同，`src/types/index.ts` 的字段类型按运行期字符串处理，避免臆造别名。
4. `BudgetContext` / `DeepSeekAccountCapability` / `SessionObservation` / `BudgetDomain`
   等 interface 是按 `ctx.effect`、`ctx.on`、`ctx.get`、`observeSession`、`global.get/set`、
   `domain.close` 的调用点推断的最小形状，原始定义可能来自 cordis Context 与各 dsh 包扩展。
5. `rootOf` 中的 `using observation = await ...` 由 tsc 的 `__addDisposableResource(env, …, false)`
   / `__disposeResources` 变换反推；原对象是否满足 `Symbol.dispose` 契约以观察对象的真实定义为准。
6. `typert` 描述符里的 `sourceLocation.file` 指向
   `packages/credentials/uma-task-budget/src/index.ts`，是本包在 DeepSeek 仓库中的原始路径，
   与本仓库路径无关，按要求原样保留。

## 样本范围

本目录覆盖 `dsh-uma-task-budget`（约 1,205 行 JS）一个包。`dsh-uma-web` 是纯配置壳，
其 `src/README.md` 单独说明，无 TS 可还原。
