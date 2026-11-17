# 逆向还原的 TypeScript 源码（dsh-tool-uma-design）

## 这是什么

`src/*.ts` 是从发布包 `lib/*.js`（3 个文件，共 1839 行）**逆向还原**的可读 TypeScript，
由 esbuild bundle 的 `//#region` 标记与变量名 / 调用点推导而来。**它不是 DeepSeek 的原始源码**，
包内既没有 sourcemap，也没有 `.d.ts`（尽管 `package.json` 的 `types` 字段声明了
`lib/types/*.d.ts`，实际文件并不存在），因此没有可用于逐字校验的官方文档。

- 还原依据：`lib/index.js`、`lib/automatic.js`、`lib/rules-B-6_mXU8.js` 都是 esbuild bundle，
  `//#region lib/types/xxx.js` 精确标出了三个 bundle 内被内联的原始模块边界；
  `//#endregion` 之后的 `export { ... }` 给出了每个 bundle 的准确导出面。
- 推断部分：所有 `interface` / 类型注解 / 泛型参数由调用点反推，名字可能与原始定义不同。
  `ctx` 各服务（cordis / dsh-fs / dsh-tools / dsh-skill / subagents 等）的原始签名不可得，
  这里只给出自洽的最小形状。zod 在 `automatic.js` bundle 中被重命名为 `z$1`（schemastery 占用了 `z`），
  还原文件保留该别名以便与 lib 对照。
- 等价部分：控制流、字符串（含超长 systemPrompt / 工具 description / 错误文本）、正则、
  路径处理、工具描述符（`defineTool` 的 `name` / `parameters` / `output.schema` / `render` /
  `presentationMeta` / `execute` / `presentCall`）与 lib 逐行一致（逐条核对过）。
  为类型自洽新增的 `as` 断言、`: type` 注解、`as const` 均为类型层语法，编译后被擦除，
  不改变运行期逻辑。

## 怎么用（重要）

1. **运行时只认 `lib/*.js`**。注入脚本复制的是整个包目录，Node 按 `package.json` 的
   `main: lib/index.js` 与 `exports["./automatic"]: lib/automatic.js` 加载，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回对应 `lib/*.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. 要用 `tsc` 做完整类型检查，需要补齐上游类型包（`@deepseek-ai/*`、`node:*`、`papaparse`、
   `zod` 等）并自行写 `tsconfig`；仓库不提供这套配置，因为它不是构建路径。
   本目录仅用 `deps/typescript` 的 `transpileModule` 做**语法**校验。

## 文件结构（hash 文件名映射）

三个 lib bundle 的 region 边界 → 还原文件，一一对应：

| lib 文件（bundle） | 内含 region（原始模块名） | 还原文件 |
|---|---|---|
| `lib/index.js` | `lib/types/index.js` | `src/types/index.ts` |
| — | （bundle 入口重导出） | `src/index.ts` |
| `lib/automatic.js` | `lib/types/route.js` | `src/types/route.ts` |
| — | `lib/types/automatic.js` | `src/types/automatic.ts` |
| — | （bundle 入口重导出） | `src/automatic.ts` |
| `lib/rules-B-6_mXU8.js` | `lib/types/resources.js` | `src/types/resources.ts` |
| — | `lib/types/context.js` | `src/types/context.ts` |
| — | `lib/types/rules.js` | `src/types/rules.ts` |
| — | （bundle 入口重导出） | `src/rules.ts` |

**hash 原名映射记录**：`lib/rules-B-6_mXU8.js` → 语义名 `rules.ts`。
它是 `resources` / `context` / `rules` 三个原始模块的共享 chunk；还原时取其语义名作为入口
`src/rules.ts`（仅负责复刻该 bundle 的 6 个带别名导出），三个内部 region 分别落到
`src/types/{resources,context,rules}.ts`。原名 `rules-B-6_mXU8` 中的 hash `B-6_mXU8`
是 esbuild 内容哈希，不含语义信息，不做进一步解读。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/index.ts` | esbuild bundle 入口 | 高 | 仅重导出 4 符号，导出面与 lib 逐字一致 |
| `src/types/index.ts` | `lib/types/index.js` region（约 985 行） | 高 | 9 个工具描述符完整；ctx 服务类型为推断；4 个导出符号一致 |
| `src/automatic.ts` | esbuild bundle 入口 | 高 | 仅重导出 4 符号，导出面与 lib 逐字一致 |
| `src/types/automatic.ts` | `lib/types/automatic.js` region | 高 | ctx 服务类型为推断；4 个导出符号一致 |
| `src/types/route.ts` | `lib/types/route.js` region | 高 | zod 别名 `z$1` 保留；状态 / 事件 interface 为推断 |
| `src/rules.ts` | hash chunk 入口重导出 | 高 | 6 个别名导出 a/i/n/o/r/t 与 lib 逐字一致 |
| `src/types/resources.ts` | `lib/types/resources.js` region | 高 | 文本分页 / 路径校验逻辑原样；返回类型 interface 为推断 |
| `src/types/context.ts` | `lib/types/context.js` region | 高 | fs / exec interface 为推断；返回结构自洽 |
| `src/types/rules.ts` | `lib/types/rules.js` region | 高 | Papa 记录类型 / 入参 interface 为推断；BM25 公式原样 |

## 核对时保留的可疑点（未擅自「修正」）

以下点在 lib 中客观存在，还原时按铁律原样保留，仅在此登记：

1. `readBundledText`（`src/types/resources.ts`）的页尾判定
   `offset + slice.length === buffer.length && consumed !== slice.length`：
   流式解码在恰好读到文件末尾且末字节不完整时才判为非法，非末尾的半个字符留到下一页；
   这是 lib 原意，未改动。
2. `readBundledResource`（同文件）与 `readBundledText` 的 `catch` 会吞掉内部具体错误，
   统一抛向用户的一句泛化提示；原始错误文本仍保留在 `throw new Error(...)` 中。
3. `design_project_create`（`src/types/index.ts`）返回体的 `system` 字段被硬编码为 `'HEY'`，
   而非入参 `args.system`；与 lib 一致，未改动。
4. `maxSnippetChars` 上限写作 `2e3`（=2000），与 description 中「200 through 2000」一致。
5. `systemInfo` 的 `aliases` 用 `typeof item === 'string'` 过滤，未做去空 / 去重；
   与 lib 一致。

## 样本范围

本目录覆盖 `dsh-tool-uma-design`（1839 行 JS）一个包。三个 lib bundle 的 `//#region`
标记完整保留了原始模块边界，且导出面可由每个 bundle 末尾的 `export { ... }` 精确核对，
因此还原到 TS 级别的条件较 UI 客户端 bundle 更充分；但类型层信息仍只能推断，无法回到原始声明。
