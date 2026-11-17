# 逆向还原的 TypeScript 源码（dsh-uma-base）

## 这是什么

`src/*.ts` 是从发布包 `lib/*.js` **逆向还原**的可读 TypeScript，由 esbuild bundle 的
`//#region` 标记、保留下来的 JSDoc / 英文注释与变量名推导而来。**它不是 DeepSeek 的原始源码**，
也**没有 sourcemap 或 `.d.ts` 可供逐字校验**。

- 还原依据：`lib/*.js` 全部是 esbuild bundle。`index.js` / `profiles.js` / `weknora.js` /
  `feedback.js` / `experience-capture.js` / `project-memory.js` 各含 1 个
  `//#region lib/types/*.js`；`operations-ssh.js` 含 4 个 region
  （`operations-files.js` / `operations-desktop.js` / `operations-ssh-terminal.js` /
  `operations-ssh.js`），这些就是原始模块边界，据此拆成 `src/types/*.ts`。
- 推断部分：所有 `interface` / 类型别名 / 泛型参数 / `ctx` 最小形状都由调用点反推，名字可能与
  原始定义不同。外部库（ssh2 / ws / cordis / `@deepseek-ai/*` / `node:sqlite`）本机无对应 `.d.ts`
  可校验，相关结构用 `any` 或最小接口并已注明。
- 等价部分：控制流、字符串、错误文本（含中文文案）、shell 命令、SQL、加解密参数、限额常数、
  路径处理与 `lib` 逐行一致，逐条核对过；发现的疑点只记录、不"修正"。

## 怎么用（重要）

1. **运行时只认 `lib/*.js`**。注入脚本复制的是整个包目录，Node 按 `package.json` 的
   `main: lib/index.js` 加载，不会编译 `src`。
2. **没有构建链**。改了 `src/*.ts` 必须手动同步回对应 `lib/*.js`，否则两边会分叉。
   建议把 `src` 当「可读参考 + 改动草稿」，确认后再落到 `lib`。
3. **src 不进构建**。仓库不提供 `tsconfig` / 编译脚本，因为这不是构建路径。
4. 要用 `tsc` 校验这些文件，需自行补齐上游类型包（`@deepseek-ai/*`、`node:sqlite` 的
   Node 24 类型、`ssh2`、`ws` 等）。本轮验证用的是仓库自带的
   `deps/typescript/lib/typescript.js`，只做 `transpileModule` 语法级校验，不做类型检查。

## 目录结构

| lib bundle | 顶层入口（导出面与 lib 逐字一致） | region 模块 |
|---|---|---|
| `lib/index.js` | `src/index.ts` | `src/types/index.ts` |
| `lib/profiles.js` | `src/profiles.ts` | `src/types/profiles.ts` |
| `lib/feedback.js` | `src/feedback.ts` | `src/types/feedback.ts` |
| `lib/weknora.js` | `src/weknora.ts` | `src/types/weknora.ts` |
| `lib/experience-capture.js` | `src/experience-capture.ts` | `src/types/experience-capture.ts` |
| `lib/project-memory.js` | `src/project-memory.ts` | `src/types/project-memory.ts` |
| `lib/operations-ssh.js` | `src/operations-ssh.ts` | `src/types/operations-{files,desktop,ssh-terminal,ssh}.ts` |

顶层入口只做重导出，一行对应 lib 末尾的 `export { ... };`，便于导出面逐字比对。
拆出的 region 模块之间原有顶层作用域共享，现改为显式 `import`（含把几个只在本 bundle 内使用
的内部函数提升为 `export`），这是模块化的必要结构改动，不改变任何执行逻辑。

## 还原度自评

| 文件 | 来源形态 | 可读性 | 与原始 TS 的差距 |
|---|---|---|---|
| `src/index.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致（apply/inject/name） |
| `src/types/index.ts` | `//#region` 内联模块 | 高 | ctx/agent/workspace 接口为推断；逻辑与注释近乎原样 |
| `src/profiles.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致 |
| `src/types/profiles.ts` | `//#region` 内联模块 | 高 | 新增 `UmaProfileName` 别名；常量与迁移逻辑原样 |
| `src/feedback.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致 |
| `src/types/feedback.ts` | `//#region` 内联模块 | 高 | 注释精简、config/account/session 接口为推断；中文文案原样 |
| `src/weknora.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致 |
| `src/types/weknora.ts` | `//#region` 内联模块 | 中高 | config/ctx 接口为推断；URL 校验长表达式逐字保留 |
| `src/experience-capture.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致 |
| `src/types/experience-capture.ts` | `//#region` 内联模块 | 中高 | 大量内部 service 接口为推断；捕获/恢复逻辑原样 |
| `src/project-memory.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致 |
| `src/types/project-memory.ts` | `//#region` 内联模块 | 高 | Scope/Note/ctx 接口为推断；SQL 与中文文案原样 |
| `src/operations-ssh.ts` | esbuild bundle 入口重导出 | 高 | 仅重导出；导出面一致 |
| `src/types/operations-files.ts` | `//#region` 内联模块（4 段之一） | 中高 | SFTP/HTTP 结构用 any+注释；shell 命令逐字保留 |
| `src/types/operations-desktop.ts` | `//#region` 内联模块（4 段之二） | 中高 | ws/socket 结构为推断；`$1` 后缀已去除（见下） |
| `src/types/operations-ssh-terminal.ts` | `//#region` 内联模块（4 段之三，443 行） | 中 | ssh2/socket/exec 结构用 any+注释；长回调链原样 |
| `src/types/operations-ssh.ts` | `//#region` 内联模块（4 段之四） | 中高 | grant/approval/ctx 接口为推断；中文文案原样 |

## 还原边界与疑点记录（只记录，未改 lib 行为）

1. **`/* @__PURE__ */` 注释**：lib 里多处 `new Set()` / `new Map()` / `new Error()` 前有
   esbuild 的 `/* @__PURE__ */` 标记，属构建产物，还原时去掉；不影响逻辑。
2. **`var X = class extends Error {}`**：`operations-files` 里的 `TransferTooLarge` /
   `DestinationExists` 还原为等价的 `class X extends Error {}`。
3. **`$1` 后缀**：`operations-desktop` 里的 `path$1` / `handshakeMs$1` 是 esbuild 为避免与
   `operations-ssh-terminal` 中的 `path` / `handshakeMs` 同名而加的后缀。拆成独立模块后已改回
   `path` / `handshakeMs`（仅标识符名，值与控制流不变）。
4. **`weknora` URL 校验**：`if (!(A && B) && C || D || ...)` 依赖 JS 的 `&&` 先于 `||` 的优先级，
   可读性差但语义明确（仅放行 HTTPS 源或 loopback HTTP，且路径为空或 `/api/v1`）。逐字保留，
   未重排括号。
5. **`feedback` subject 生成**：`Array.from(text.split(/\r?\n/u, 1).join("")).slice(0, 80).join("")`
   中 `split(..., 1)` 只取首行、`.join("")` 对单元素数组是空操作，整体等价于「首行前 80 字」。
   看起来有冗余，但逐字保留。
6. **`experience-capture` 的 `.some()` 带副作用**：`capture()` 里用
   `bases.some(base => ... && ctx.knowledge.experienceCapture(...))` 在短路遍历中写入项目副本，
   命中第一个符合条件的 base 即停止。属于原始写法，未改为 `for` 循环。
7. **`operations-files` 的 `while (entries.length <= limit)`**：先取到 `limit+1` 条再 `slice(0, limit)`
   并用是否超出判断 `truncated`，边界值偏一但属原始实现，未改。
8. **`runConnectedSsh` 的 `captureBytes`**：`captureBytes = maxBytes + credentialLookahead`，
   输出先按加宽后的字节数捕获，再对脱敏后的字符串 `subarray(0, maxBytes)` 截断，为
   `[redacted]` 替换留出空间。按原样保留。
9. **`operations-ssh-terminal` 的 `relay`/`forward`**：大量 socket/channel 事件互相清理，无任何
   上游异常细节回传给浏览器；错误一律映射为固定 HTTP 文本，逐字保留。
10. **`catch (error) {}` 空块**：`upload()` 清理临时文件失败的 `catch (_cleanupError) {}` 是有意吞掉，
    保留空块语义。

## 验证

见最终报告：17 个 `.ts` 全部通过 `ts.transpileModule` + `reportDiagnostics`（target ES2022 /
module ESNext，0 error）；7 个顶层入口与对应 `lib/*.js` 的导出符号集合逐字一致。
