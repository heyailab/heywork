# 逆向还原的 TypeScript 源码（dsh-util-uma-delivery）

## 这是什么

`src/*.ts` 是从发布包 `lib/index.js`（918 行）**逆向还原**的可读 TypeScript，由 esbuild bundle 的
`//#region` 标记与保留的 JSDoc / 变量名推导而来。**它不是 DeepSeek 的原始源码**，也没有
sourcemap 或 `.d.ts` 可供逐字校验。

- 还原依据：`lib/index.js` 是 esbuild bundle，`//#region lib/types/...` 标出了五个原始模块边界，
  它们被内联进单文件。本包没有独立的 `lib/types/*.js`（与样本包 `dsh-skill-uma` 不同），
  所以类型模块的拆分完全依赖 region 标记。
- 推断部分：所有 `interface` / 类型别名 / 字面量联合由数据形状与调用点反推，名字可能与原始定义不同。
- 等价部分：工件分级、gate 判定、CSV/frontmatter 解析、脱敏规则、SSH 目标解析的正则与
  控制流、全部中英文字符串与错误文本与 `lib` 逐行一致（用 tsc token 流逐 region 核对过）。

## 源文件与模块边界

| lib region | 还原文件 | 行数 | 包级导出 |
|---|---|---|---|
| `lib/types/engineering-guides.js` | `src/types/engineering-guides.ts` | 242 | 否（被 coding-standards 引用） |
| `lib/types/coding-standards.js` | `src/types/coding-standards.ts` | 593 | 是（4 个符号） |
| `lib/types/redact.js` | `src/types/redact.ts` | 17 | 是（1 个符号） |
| `lib/types/ssh-target.js` | `src/types/ssh-target.ts` | 57 | 是（2 个符号） |
| `lib/types/index.js` | `src/types/index.ts` | 221 | 是（7 个符号 + 7 个兄弟模块 re-export） |
| bundle 入口重导出 | `src/index.ts` | 28 | 是（唯一对外导出面） |

`src/types/index.ts` 作为 types 目录的聚合层，把兄弟模块的 7 个符号 re-export 出来，
使 `src/index.ts` 能以一条语句逐字复刻 lib 末尾的 `export { ... }`。

## 怎么用（重要）

1. **运行时只认 `lib/index.js`**。注入脚本复制的是整个包目录，Node 按 `package.json` 的
   `main: lib/index.js` 加载，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回 `lib/index.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. 要用 `tsc` 校验这些文件，需要补齐上游类型包（`@deepseek-ai/dsh-brand` 等）并自行写 `tsconfig`；
   仓库不提供这套配置，因为它不是构建路径。本目录已用仓库自带的
   `hey-assets/deps/typescript/lib/typescript.js`（TS 6.0.3）`transpileModule`
   （target ES2022 / module ESNext / reportDiagnostics）做纯语法校验，0 error。

## 导出面对照（逐项）

`lib/index.js` 末尾是一条单一导出语句，共 14 个符号；`src/index.ts` 逐字同序复刻：

```js
export { ARTIFACTS, BUILTIN_CODING_GUIDES, CODING_STANDARD_RULES, CODING_STANDARD_SOURCES, REQUIRED_ARTIFACTS, evaluateArtifact, evaluateCheckpoint, evaluateGate, parseUmaSshTarget, redactDevelopmentText, requiredArtifacts, selectCodingStandards, splitFrontmatter, umaSshUri };
```

| 符号 | 来源 region | 在 `src/index.ts` 中 |
|---|---|---|
| `ARTIFACTS` | index | ✓ |
| `BUILTIN_CODING_GUIDES` | coding-standards | ✓ |
| `CODING_STANDARD_RULES` | coding-standards | ✓ |
| `CODING_STANDARD_SOURCES` | coding-standards | ✓ |
| `REQUIRED_ARTIFACTS` | index | ✓ |
| `evaluateArtifact` | index | ✓ |
| `evaluateCheckpoint` | index | ✓ |
| `evaluateGate` | index | ✓ |
| `parseUmaSshTarget` | ssh-target | ✓ |
| `redactDevelopmentText` | redact | ✓ |
| `requiredArtifacts` | index | ✓ |
| `selectCodingStandards` | coding-standards | ✓ |
| `splitFrontmatter` | index | ✓ |
| `umaSshUri` | ssh-target | ✓ |

`ENGINEERING_SOURCES` / `ENGINEERING_RULES` / `ENGINEERING_GUIDES` / `CATALOG_VERSION` /
`REQUIRED_SECTIONS` / `placeholdersIn` / `ALIASES` / `freezeRule` / `freezeGuide` 是模块内部符号，
不在包导出面；其中前三者因 `coding-standards.ts` 需要而从 `engineering-guides.ts` 导出，
但这只是 TS 模块边界，不是包 API。

## 发现（可疑点，一律未"修正"）

1. `ARTIFACTS` 有 8 种，`REQUIRED_ARTIFACTS` 只有 7 种——`preview` 被刻意排除在交付门禁之外。
   `requiredArtifacts("feature", "documents")` 只要求 `spec`。照抄，不补 `preview`。
2. `selectCodingStandards` 的 `matches` 中 `tag === "all" && options.includeGeneral !== false`
   依赖 `&&` 优先于 `||`；未加括号改写。
3. `ENGINEERING_RULES` 里 `HEY.STD.ORDER_REPLAY` / `HEY.STD.TENANT_SCOPE` 引用了
   `microsoft-rest` / `owasp-asvs5`，但 `ENGINEERING_SOURCES` 只有 3 条；这两个来源在
   `CODING_STANDARD_SOURCES` 中补齐。`selectCodingStandards` 只返回命中 `sourceIds` 的来源，
   这是数据事实，未做"引用完整性修复"。
4. `redactDevelopmentText` 的四条规则是 best-effort 展示层过滤：`Bearer` 值字符集仅
   `[a-z0-9._~+/=-]+`，`sk-` 规则要求 16 位以上。注释也声明它不是"文本无秘密"的证明。照抄。
5. `parseUmaSshTarget` 用 `if (host.startsWith("[")) try { new URL(...) } catch { return } else if (...)`
   校验 IPv6；域名逐标签校验且允许结尾点。`new URL` 只判合法性、不规范化 host。照抄。
6. `package.json` 的 `exports.types` 指向 `./lib/types/index.d.ts`，但包内没有任何 `.d.ts`
   文件（悬空引用）。本目录的 interface 全部为推断，见各文件头注释。
7. `ALIASES` 把 `node` / `node.js` 都映射到 `nodejs`，把四个前端框架名都映射到 `frontend`；
   未识别标签原样小写保留、不猜测框架。照抄。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/types/engineering-guides.ts` | bundle region，242 行 | 高 | 数据字面量逐字一致；`interface` / 字面量联合为推断 |
| `src/types/coding-standards.ts` | bundle region，593 行 | 高 | 冻结返回类型、别名索引签名为推断；逻辑与字符串一致 |
| `src/types/redact.ts` | bundle region，17 行 | 高 | 仅函数签名注解为推断；四条正则逐字一致 |
| `src/types/ssh-target.ts` | bundle region，57 行 | 高 | `UmaSshTarget` interface 为推断；控制流逐行一致 |
| `src/types/index.ts` | bundle region，221 行 | 高 | 工件联合类型 / gate 接口为推断；分级与正则一致 |
| `src/index.ts` | bundle 入口 | 高 | 14 个导出符号同序复刻，无逻辑 |

## hash 文件名映射

无。本包 `lib/` 只有 `index.js`，没有 hash 命名的分片文件；包内无 sourcemap、无 `.d.ts`。
