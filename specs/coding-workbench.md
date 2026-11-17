# spec: dsh-coding-workbench（8 工具 + 工作台服务）

> 重写目标：行为等价的 `heywork-coding-workbench` 包。
> 证据：`uma-assets/packages/dsh-coding-workbench/lib/` 下的 tsc 直出产物（注释与变量名保留、可读）：
> `index.js`（下称 I，2381 行）、`tools.js`（下称 T）、`process-UWH2go78.js`（下称 P）、
> `source-Zaq6hZwU.js`（下称 S）、`experience-KfwCcvuK.js`（下称 E）、
> `context-CjvSlQT_.js`（下称 C）、`schema-CYOnGiGF.js`（下称 Z）、
> `verification-2nCn2WCk.js`（下称 V）、`policy.js`（下称 POL）、
> `types/tools.js`（下称 TT，与 T 等价、未截断的长文案以此为准）。行号仅供校对，不作为抄写依据。
> 工件判定 / 编码规范：`selectCodingStandards` 与 `ArtifactKind`/`REQUIRED_ARTIFACTS`/`evaluateGate`/
> `evaluateCheckpoint` 等来自 `dsh-util-uma-delivery`，见 `specs/delivery.md` §八～§十二；本节不重复，仅引用。
> 状态：**待横向评审**。

---

## 一、冻结契约（不可改，改了数据全废）

### 1.1 身份与命名（逐字）

| 项 | 值 | 证据 |
|---|---|---|
| 包名 | `@deepseek-ai/dsh-coding-workbench` | package.json:2 |
| 版本 | `0.2.2-rc.3` | package.json:4 |
| 工具插件 id（`name`） | `coding-workbench-tools` | T:9, TT:8 |
| 工具插件 `inject` | `["tools", "codingWorkbench", "workspaceRegistry", "systemPrompt"]` | T:11-16 |
| 服务注入名 / service id | `codingWorkbench`（`super(ctx, "codingWorkbench")`） | I:943 |
| 存储域 `name` | `coding_workbench`，`version: 1`，`layout: "per-record"` | I:527-538 |
| 域表 | `runs` / `findings` / `specs` / `tasks` / `repairs`（分别绑定 runSchema/findingSchema/specSchema/taskSchema/repairSchema） | I:531-537 |
| 8 项对外工具/服务名 | `coding_task`、`coding_inspect`、`coding_check`、`coding_repair`、`coding_review`、`coding_acceptance`、`coding_restore`、`coding_workbench`（最后一项是工作台服务本体，非 `defineTool` 工具） | T:57,169,234,315,366,422,480；I:528,943 |
| 主导出 | `CodingWorkbench` 类，并 `as default` | I:2381 |

### 1.2 schema 约束（Z，逐字）

所有 id 经 `brandString` 品牌化（来自 `@deepseek-ai/dsh-brand`）：

| schema | 约束 | 证据 |
|---|---|---|
| `workspaceId` / `sessionId` | `string().min(1).transform(brandString)` | Z:6,8 |
| `runId` / `findingId` / `taskId` / `repairId` | `z.uuid().transform(brandString)` | Z:10-14,138 |
| `fingerprint` | `{ digest: string, files: int≥0, bytes: int≥0, complete: bool, reason: string\|null }` | Z:16-22 |
| `diagnostic` | `path: string, line: int>0, column: int>0, severity: error\|warning\|info, message: string≤8000, code: string\|null` | Z:24-35 |
| `check` | `name: 1..120, argv: array(string≤8000) 1..64, kind: test\|build\|lint\|typecheck\|custom, origin: string, coverage?: array(string 1..400)≤64` | Z:37-49 |
| `run.status` | `running\|passed\|failed\|cancelled\|timed-out\|interrupted\|error`；`sequence?: int>0≤MAX_SAFE_INTEGER` | Z:52,60-68 |
| `finding` | `severity: critical\|high\|medium\|low, title: 1..240, evidence: 1..16000, state: open\|resolved\|dismissed` | Z:80-102 |
| `spec` | `revision: int>0, goal: 1..8000, independentVerificationOf?: array(sessionId) 1..100, criteria: array({id:1..80,text:1..4000,checks:array(string 1..120) 1..32}) 1..100` | Z:104-115 |
| `task.state` | `active\|merged\|removed` | Z:117-131 |
| `manifest` | `{ version: literal 1, checks: array(check)≤100 }`，`.strict()`（拒绝未知键） | Z:132-136 |
| `repair.status` | `running\|passed\|failed\|cancelled\|interrupted` | Z:140-159 |

### 1.3 Config 默认与资源上限（I:26-55）

| 项 | 默认值 | 约束 |
|---|---|---|
| `dshHome` | 无默认（必填） | `string` |
| `leaseWaitMs` | `2000` | int≥1 |
| `maxFiles` | `20000` | int≥1 |
| `maxFileBytes` | `2*1024*1024`（2 MiB） | int≥1 |
| `maxSourceBytes` | `64*1024*1024`（64 MiB） | int≥1 |
| `maxOutputBytes` | `128*1024`（128 KiB） | int≥1 |
| `checkTimeoutMs` | `120000`（120 s） | int≥1 |
| `graceMs` | `2000` | int≥1 |
| `maxRecords` | `1000` | int≥1 |
| `duplicateWindowLines` | `6` | int 3..100 |
| `experienceQueryLimit` | `5` | int 1..20 |
| `resultLimit` | `100` | int≥1 |
| `concurrency` | `2` | int≥1 |
| `repairTimeoutMs` | `300000`（300 s） | int≥1 |
| `repairAttempts` | `3` | int 1..10 |
| `excludedDirectories` | `["node_modules","dist","build","coverage",".venv","venv","__pycache__","target",".next"]` | `string[]` |
| `exportMaxBytes` | `8*1024*1024`（8 MiB） | int≥1 |
| `contextBytes` | `32768`（32 KiB） | int≥1 |

其它冻结上限：上下文捕获 `MAX_CAPTURE_BYTES = 128*1024`、`MAX_SECTIONS = 128`（C:4-5）；最近变更索引上限 64（C:68-71,82）；经验账本 `TERM_LIMIT=64`、`SYMPTOM_LIMIT=4096`、`QUERY_MAX_CHARS=2000`（E:5-7）。

### 1.4 错误前缀与文本（逐字）

- 领域错误统一由 `failed(reason)` 生成：`new RemoteError("coding/failed", "The coding operation could not be completed", { reason })`（I:539-541）。对外呈现为 code `coding/failed`、message `The coding operation could not be completed`、`details.reason = <reason>`。
- `reason` 全集（逐字，按出现处）：`unavailable`、`workspace-unavailable`、`open-workspace-session-first`、`session-workspace-mismatch`、`working-directory-outside-workspace`、`check-concurrency-limit`、`record-limit`、`check-command-changed`、`repair-check-changed`、`execution-sequence-exhausted`、`check-not-found`、`evidence-changing`、`source-not-found`、`finding-not-found`、`spec-version-conflict`、`duplicate-implementer`、`duplicate-criterion`、`task-not-found`、`task-path-mismatch`、`task-removed`、`git-inspection-failed`、`task-session-required`、`source-changed`、`path-outside-source-scope`、`commit-not-confirmed-inspect-task`、`source-checkout-session-required`、`task-not-clean-or-revision-changed`、`source-checkout-not-clean`、`merge-not-confirmed-inspect-source`、`merge-revision-not-confirmed`、`task-has-uncommitted-or-ignored-files`、`cleanup-not-confirmed-inspect-task`、`task-not-removed`、`model-not-configured`、`failed-check-required`、`repair-already-running`、`repair-command-redacted`、`repair-source-changed`、`repair-not-found`、`export-too-large`（I:1045-2371）。
- 唯一使用不同 message 的领域错误：`new RemoteError("coding/failed", "Use existing implementation Session IDs from this workspace; completed members are allowed.", { reason: "implementation-session-workspace-mismatch" })`（I:1670）。
- 工具层原生 `Error`（逐字，含插值）：
  - `This coding operation requires a workspace Session`（T:48）
  - `Import the current local folder as a workspace before using coding evidence tools`（T:50）
  - `` `${tool} ${action} is unavailable in a source read-only role` ``（T:40）
  - `Select at most 16 technical language names`（T:134）
  - `The guide is not applicable to the selected project languages`（T:137）
  - `Select either check or scope, not both`（T:285）
  - `Check execution is not in the current workspace`（T:305,347）
  - `Repair is not in the current workspace`（T:356）
  - `Finding is not in the current workspace`（T:409）
- 子过程原生错误（P/S，逐字）：`empty-command`（P:99）、`path-outside-source-scope`、`source-not-a-regular-file`、`source-file-too-large`、`source-changed-during-read`（S:24,27,48,50）、`unsupported-package-manager`、`duplicate-check-name`（S:215,249）。
- 写入记录的固定文本（非抛错）：`The check could not run: ${msg}`（I:1419）、`The Host stopped before a trusted completion was recorded.`（I:1007）、`The check was cancelled.`（I:1419）、`The Host stopped before repair completion was recorded.`（I:1013）、`Repair cancelled.` / `The check definition changed during repair. Review it and run the check again.` / `Repair stopped without verified success. Inspect its Session and check evidence.`（I:2303）、`The repair Session did not close cleanly. Inspect it before retrying.`（I:2314）。

### 1.5 品牌串 / 超时标签 / 提示词身份（逐字）

| 项 | 值 | 证据 |
|---|---|---|
| 证据导出格式串 | `hey-coding-evidence` | I:2361 |
| 证据导出文件名 | `hey-coding-evidence.json` | I:2373 |
| 修复委托提示首句 | `Use hey-debug to fix the root cause of this failed check in the current workspace.` | I:2246 |
| system prompt 节名 / 顺序 | `native-coding-evidence` / `order: 110` | T:43-44 |
| system prompt 品牌句 | `Use the full Uma team workflow only when the request warrants a complete product workflow.` | TT:52 |
| 超时标签 | `CODING_CHECK_TIMEOUT`、`CODING_REPAIR_TIMEOUT`、`CODING_HOME_IN_USE` | I:100,2233,986 |
| 领域错误 code | `coding/failed` | I:540 |
| 编辑义务拒绝码 | `CODING_CHECK_REQUIRED`（策略拒绝，不执行 mutation 体） | POL:10 |
| 可触发验证义务的工具名 | `write` / `edit` / `apply_patch` | V:5-9 |

### 1.6 命令白名单与来源（逐字）

- 允许的 package manager：`npm`、`pnpm`、`yarn`、`bun`（S:210-215）；`packageManager` 字段取 `@` 前缀，缺省 `npm`。
- 可由 `package.json` 派生的脚本名前缀：`test`、`build`、`lint`、`typecheck`（正则 `/^(test|build|lint|typecheck)(?:$|:)/u`，S:217）；其它脚本不生成 check。
- 固定建议命令：存在 `pyproject.toml` → `pytest` = `["python","-m","pytest"]`；存在 `pom.xml` → `maven-test` = `["mvn","test"]`（S:231-246）。
- 发现清单文件 `CHECK_MANIFESTS`：`".hey/coding.json"`、`"package.json"`、`"pyproject.toml"`、`"pom.xml"`（S:8-13）。
- Node 内建模块（导入扫描时视为已声明、永不报未声明）：`assert`、`buffer`、`child_process`、`cluster`、`crypto`、`dgram`、`dns`、`events`、`fs`、`http`、`http2`、`https`、`inspector`、`module`、`net`、`os`、`path`、`perf_hooks`、`process`、`punycode`、`querystring`、`readline`、`repl`、`stream`、`string_decoder`、`timers`、`tls`、`trace_events`、`tty`、`url`、`util`、`v8`、`vm`、`worker_threads`、`zlib`（I:223-259）。
- 命令执行时强制清理的 git 环境变量（置 undefined）：`GIT_DIR`、`GIT_WORK_TREE`、`GIT_COMMON_DIR`、`GIT_INDEX_FILE`、`GIT_OBJECT_DIRECTORY`、`GIT_ALTERNATE_OBJECT_DIRECTORIES`、`GIT_CONFIG`、`GIT_CONFIG_PARAMETERS`、`GIT_CONFIG_COUNT`、`GIT_REPLACE_REF_BASE`、`GIT_ATTR_SOURCE`；并写入 `GIT_CONFIG_COUNT:"0"`、`GIT_TERMINAL_PROMPT:"0"`、`GIT_OPTIONAL_LOCKS:"0"`、`GIT_NO_LAZY_FETCH:"1"`（P:107-129）。

---

## 二、coding_task

- **签名**：`defineTool` 工具 `coding_task`，`execute(args, exec) => string`（JSON）；注册在 `ctx.tools`，`presentCall` 卡片标题 `Coding task: ${args.action}`（T:421-478）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `action` | string enum | 是 | 非只读角色：`create\|inspect\|merge\|remove`；只读角色：仅 `inspect` |
| `id` | string | 否 | create 返回的任务 id；inspect/merge/remove 必填，经 `brandString` |
| `name` | string | 否 | create 的任务语义名 |
| `expectedCommit` | string | 否 | 上次 inspect 得到的 HEAD；merge 必填 |

- **返回**：JSON 字符串（`jsonOutput`，渲染为单个 text block）。按 action：
  - `create` → 任务记录：`{id, workspaceId, sessionId, path, branch, baseCommit, repositoryRoot, createdAt, state:"active", ...worktrees.create 结果}`（I:1865-1888）。
  - `inspect` → `{task, head, currentBranch, status, diff, truncated, fingerprint}`；`head`/`currentBranch` 去尾空白，`status`/`diff` 为原始 stdout，`truncated` 为任一 git 命令输出被截断（I:1907-1954）。
  - `merge` → 任务记录，`state:"merged"`（I:2023-2029）。
  - `remove` → 任务记录，`state:"removed"`（I:2078-2084）。
- **错误文本**（逐字，`failed(reason)` 见 §1.4）：`record-limit`（任务数≥maxRecords）、`task-not-found`、`task-path-mismatch`（任务路径不在工作区内或仓库根不含工作区）、`task-removed`（inspect 已移除任务）、`git-inspection-failed`（inspect 任一 git 命令退出非 0/超时/取消）、`task-session-required`（commit 角色非该任务 session）、`source-changed`（fingerprint 与 expectedDigest 不符）、`path-outside-source-scope`（提交路径以 `-` 开头或含 `..`/`.git`/`.env*`）、`commit-not-confirmed-inspect-task`、`source-checkout-session-required`（merge/remove 的 cwd 非仓库根 / 误用任务 session）、`task-not-clean-or-revision-changed`、`source-checkout-not-clean`、`merge-not-confirmed-inspect-source`、`merge-revision-not-confirmed`、`task-has-uncommitted-or-ignored-files`、`cleanup-not-confirmed-inspect-task`、`task-not-removed`、`model-not-configured`（新建任务 agent 时无模型）。工具层：`This coding operation requires a workspace Session`、`Import the current local folder as a workspace before using coding evidence tools`、`${tool} ${action} is unavailable in a source read-only role`。
- **副作用**：
  - `create` 经 `ctx.worktrees.create` 建独立 worktree，创建新任务 Agent（`agentPreset: "standard"`，继承父 agent 的 sandbox mode 与 approval policy，`meta.cwd = workspace.path`），持久化任务记录并把 handle 记入 taskAgents（I:1870-1882,2110-2137）。
  - `inspect` 并行跑 4 条只读 git 命令（均经 sandbox `mode:"read-only"`、`workspaceRoot = workspace.path`）：`git rev-parse HEAD`、`git branch --show-current`、`git status --porcelain=v1 --untracked-files=all`、`git diff --no-ext-diff --no-textconv <baseCommit> --`（I:1916-1942）。
  - `merge` 先 inspect，再校验源 checkout 干净，执行 `git merge --ff-only --no-edit -- <task.branch>`，复核 HEAD 后写 `state:"merged"`（I:1986-2029）。
  - `remove` 要求任务 checkout `git status --porcelain=v1 --ignored --untracked-files=all` 为空，先归档任务 session、跑 `git worktree remove -- <task.path>`、释放 handle，写 `state:"removed"`；失败时若目录仍在且原本未归档则回滚归档/pin 状态（I:2037-2085）。
  - 另有内部 `commitTask`（仅 `--only` 提交显式选中路径，`git --literal-pathspecs commit --only -m <message> -- <paths>`，P:69-80）与 `restoreTask`（重建已移除 worktree，返回 `branchRecreated`）；二者不在 8 工具参数面内。
- **边界**：
  - 只读角色下 `action` 仅允许 `inspect`；其余 action 在 requireAction 阶段即抛错。
  - 任务 session 的 check 携带隔离 cwd，验收按"隔离 checkout 证据"处理（assess 中 reason `isolated-checkout`，I:1541）。
  - merge 要求源 checkout 与任务 checkout 双向干净且 expectedCommit 精确匹配；分叉分支被拒（仅 ff-only）。
  - remove 把 ignored 与 untracked 文件也视为阻塞；未提交/被忽略文件一律拒绝删除。
  - worktree 相关命令退出码/截断/取消/超时均使操作失败，不留半提交状态（I:1976,2013,2065）。
- **证据**：T:421-478；I:1865-2137；P:69-80；Z:117-131。

---

## 三、coding_inspect

- **签名**：`defineTool` 工具 `coding_inspect`，`execute(args, exec) => string`（JSON）；`presentCall` 标题 `Coding: ${args.mode}`（T:56-167）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `mode` | string enum | 是 | `environment\|status\|acceptance\|impact\|context\|quality\|sweep\|experience\|standards` |
| `query` | string | 否 | impact 模式的字面查询（必填语义）；experience 模式的主题/错误词 |
| `guideId` | string | 否 | standards 模式读取的精确指南 id |
| `contentLanguage` | string enum `en\|zh` | 否 | 指南正文语言，缺省 `en` |
| `languages` | string[] | 否 | standards 选择用的真实语言标签；`>16` 个或单个 `>40` 字符抛错 |

- **返回**（按 mode，均为 JSON 字符串）：
  - `environment` → doctor 结果：`{workspaceId, path, checks, runtimes, fingerprint, notices}`。`checks` 的 argv 经脱敏；`runtimes` 为 `{program, available, path}`（git、node 与各 check 首程序）；`notices` 含 `no-checks-discovered`（无 check）与 `source-inspection-incomplete`（扫描不完整）（I:1111-1151）。
  - `status` → `overview`：`{workspaceId, runs, findings, tasks, spec, repairs}`，runs 按 startedAt 倒序（I:1092-1104）。
  - `acceptance` → `assess` 结果；若启用 agentTeams 且非 subagent，会附加 `codingReady`、`ready`（=assessment.ready 且无未完成 task）、`team:{ready, openTasks[]}`（T:100-120；I:1535-1568）。
  - `impact` → `{workspaceId, fingerprint, matches, truncated, method:"text"}`；每条 match `{path, line, text(≤2000 字节), kind}`，kind 为 `test`/`import`/`source`（I:1575-1608）。
  - `context` → 最新捕获的运行时上下文，见 C/I:1692-1726。
  - `quality` → `computeQualityReport` 指标（settledRuns/passedRuns/failedRuns/abandonedRuns/passRate/distinctChecksPassed/repairCount/repairAttempts/repairsPassed/findingsOpen/findingsResolved/findingsDismissed/openBySeverity）（I:402-427,1178-1183）。
  - `sweep` → `{files, complete, reason, coverage:[{path,covered}], findings}`（I:1193-1267）。
  - `experience` → 经验检索结果，见下"经验账本"与 §九体验；`notices` 可含 `experience-ledger-unavailable`、`experience-change-list-incomplete`（I:1291-1311）。
  - `standards` → `selectCodingStandards(languages)` 结果 + `guides[]` + `guide`（当 guideId 命中时，`content` 取 `body[contentLanguage]`）+ `projectChecks` + `verification:"not-run"` + `next` 文案；标准选择与工件判定见 `specs/delivery.md` §八（T:132-158）。
- **错误文本**（逐字）：`Select at most 16 technical language names`、`The guide is not applicable to the selected project languages`（T:134,137）；`This coding operation requires a workspace Session`、`Import the current local folder as a workspace before using coding evidence tools`（T:48,50）；impact 查询 `z.string().min(1).max(1000)` 校验失败为原生 zod 错误（I:1578）；`languages` 非数组/元素非字符串为原生 TypeError。
- **副作用**：
  - discovery 永不安装依赖、不运行项目脚本；只读取清单与文件系统（`doctor`/`discoverChecks`，S:199-253）。
  - `sweep` 对工作树变更集做机械扫描，不访问 registry 网络：仅从 `git diff -U0` 的新增行 + 未追踪文件提取文本，检出四类 finding：① `unverified-import`（裸包名未在工作区 manifest 声明）② `placeholder`（`/\b(?:TODO|FIXME|XXX)\b|lorem ipsum/u`）③ `secret`（高精度密钥正则：`sk-[A-Za-z0-9]{20,}`、`AKIA[0-9A-Z]{16}`、`ghp_[A-Za-z0-9]{36}`、`-----BEGIN [A-Z ]*PRIVATE KEY-----`）④ `duplicated-code`（连续窗口结构重复）。finding detail 文案逐字见 I:114-128,155,174,195,326。
  - `experience` 读账本与会话历史，见下。
- **诊断解析 `parseDiagnostics`**（S:260-276，输入输出格式，逐字）：
  - **输入**：`output`（已脱敏的 stdout+stderr 拼接串，按 `/\r?\n/u` 逐行）、`limit`（结果上限，取 `resultLimit`）。
  - **匹配正则**（任一行命中其一，先 TS 风格后 GCC 风格）：
    - `/^(.+?)\((\d+),(\d+)\):\s*(error|warning)\s*([^:]+):\s*(.+)$/u`（形如 `f.ts(3,9): error TS2322: msg`）
    - `/^(.+?):(\d+):(\d+):?\s*(error|warning)\s*([^:]*)[: ]\s*(.+)$/u`（形如 `f.c:3:9: error: msg`）
  - **输出项**：`{ path: match[1]??"", line: max(1, Number(match[2])), column: max(1, Number(match[3])), severity: match[4]==="warning"?"warning":"error", code: match[5]?.trim()||null, message: (match[6]??"").slice(0,8000) }`；无匹配行跳过；`diagnostics.length === limit` 时停止。
- **经验账本（读写路径与匹配规则）**（E）：
  - **读路径**：`.hey/experience.md`，经 `readSource` 有界读取（`maxFileBytes`）；三态 `missing`（文件不存在）/`available`/`unavailable`（读失败，记 debug 不进返回数据）；取消始终致命。
  - **条目格式**：`## YYYY-MM-DD — title` 分节，字段 `- Symptom:` / `- Root cause:` / `- Fix:` / `- Verification:` / `- Source:`（标题正则 `/^##\s+(\d{4}-\d{2}-\d{2})\s+[—–-]\s+(.+)$/u`，字段正则 `/^-\s+([A-Za-z ]+):\s*(.*)$/u`）；畸形分节静默跳过。UTF-8 以 `fatal:false` 解码。
  - **查询词**：取 query 前 2000 UTF-16 码元；非中文整词保留标点，中文用 `Intl.Segmenter("zh",{granularity:"word"})` 分词（单字与中文停用词表剔除）；文件 basename 词来自变更文件集；归一为小写去空白、Set 去重、截 64 项。
  - **匹配规则**：全文命中某词 `+2`，路径 basename（长度≥3）命中再 `+1`；有分者入选；按 `score` 降序 → `date` 降序 → 文件追加顺序 排序；以 `[可搜索文本, source]` 的 JSON 作键去重；结果再截 `resultLimit`。
  - **返回**：`{history, ledgerFound, ledgerState, notices, total, terms, matches, repairMatches}`；所有 model 可见文本经脱敏（E:372-398）。历史会话来自 `sessionQuery.searchSessions`（cwd 过滤 + `assistant/message`/`tool/result` 事件类型，排除请求方 session）。
- **边界**：
  - `standards` 无 languages 时按通用指南选择；guideId 不在选中目录抛错；selected rules ≠ 已验证检查（见 delivery.md §八）。
  - `impact` 跳过含 NUL 字节的文件；扫描不完整时 `truncated:true`。
  - `sweep` 仅覆盖 `.ts/.tsx/.js/.jsx/.mjs/.cjs/.mts/.cts`，其余文件标记 `covered:false` 并跳过导入检测；变更列表不完整则跑保守全集。
  - 诊断行号/列号至少为 1；message 截 8000 字符；`info` 级诊断不会被 parseDiagnostics 产生（仅 error/warning），但 schema 允许 info。
  - 经验账本缺失不阻断历史检索；账本不可用与"缺失"是不同状态。
- **证据**：T:56-167；I:1092-1183,1193-1311,1535-1608,1692-1726；S:8-13,199-276；E:5-7,53-225,372-398；C:4-24。

---

## 四、coding_check

- **签名**：`defineTool` 工具 `coding_check`，`execute(args, exec) => string`（JSON）；`output` 带 `presentationMeta: verificationMeta`；`presentCall` 标题 `Check: ${args.scope ?? args.check ?? args.id ?? args.action}`（T:233-313）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `action` | string enum | 是 | 非只读：`run\|read\|cancel`；只读：仅 `read` |
| `check` | string | 否 | run 时已发现的 check 名 |
| `scope` | string enum `changed` | 否 | 对变更集运行所有受影响 check，与 `check` 互斥 |
| `id` | string | 否 | read/cancel 用的执行 id，经 `brandString` |

- **返回**（JSON 字符串）：
  - `run`（单个）→ run 记录（字段见 §1.2 `run`）：含 `status`（`passed`/`failed`/`timed-out`/`cancelled`/`error`）、`before`/`after` 指纹、`exitCode`、`stdout`/`stderr`（已脱敏）、`truncated`、`diagnostics`（parseDiagnostics 结果，≤resultLimit）。
  - `run` + `scope:"changed"` → `{scope:"changed", changedFiles, complete, reason, runs, skipped}`；`skipped` 为未纳入的 `{name,included:false,reason}` 决策（T:293-300）。
  - `read`/`cancel` → 对应 run 记录。
  - 展示元数据 `verificationMeta(value)`：`{codingCheck:{version:1, receipts:[{status,exitCode,before,after}]}}`（V:90-100）；仅含精简收据、不含命令日志，供输出转储到溢出文件时保留证据。
- **错误文本**（逐字）：工具层 `Select either check or scope, not both`（同时给 check 与 scope）、`Check execution is not in the current workspace`（read/cancel 的 id 不属于本工作区）、`${tool} ${action} is unavailable in a source read-only role`（只读角色非 read）；领域 `check-concurrency-limit`（在跑 check 数≥concurrency）、`record-limit`、`check-not-found`（名称未发现 / 记录缺失）、`check-command-changed`（expectedArgv 与发现命令不一致）、`repair-check-changed`、`execution-sequence-exhausted`（sequence 达 MAX_SAFE_INTEGER）。
- **副作用**：
  - `startCheck` 序列化准入（`admitCheck`）：校验并发/记录上限 → 解析 workspace/session → 确认 cwd 在工作区内 → 按名称重新 `discoverChecks` → 指纹 `scanSources` → 生成 `runId`（uuid）+ `sequence` → 落一条 `status:"running"` 记录 → 启动 `execute` 并登记到 `checks`（I:1339-1395）。
  - `execute` 调用 `runCommand`（**命令构造与沙箱**，逐项）：
    1. `executable = argv[0]`，为空 → `empty-command`；
    2. 用 `deadline(signal, config.checkTimeoutMs, "CODING_CHECK_TIMEOUT")` 建超时 signal；
    3. `command = [await ctx.subprocess.resolveExecutable(executable, undefined, timeout.signal), ...argv.slice(1)]`（首参解析为真实可执行路径，其余为字面参数）；
    4. 沙箱策略：`policy.mode === "danger-full-access"` 时直接执行 `command`；否则 `command = (await ctx.sandbox.confine(command, {...policy, mode: policy.mode}, timeout.signal)).argv`（经沙箱包裹）；随后 `timeout.signal.throwIfAborted()`；
    5. `ctx.subprocess.spawn({ argv: confined, cwd, env, signal: timeout.signal, graceMs: config.graceMs, stdio: { stdin:"ignore", stdout:{maxBytes: config.maxOutputBytes}, stderr:{maxBytes: config.maxOutputBytes} } })`；`env` 按 §1.6 清理/设置 git 变量；
    6. 等待 `child.done`，读 `child.collected.stdout/stderr.readFrom(0)`；`timedOut = timeoutOf(timeout.signal,"CODING_CHECK_TIMEOUT") !== undefined`；返回 `{exitCode, stdout, stderr（均经 redactDevelopmentText）, truncated: stdout.lossy||stderr.lossy, timedOut, cancelled: aborted && !timedOut}`；
    7. `finally` 中 `child.terminate()` + `await child.waitForExit()`（P:91-161）。
  - 执行后再次 `scanSources` 得 `after` 指纹；状态映射：timedOut→`timed-out`、cancelled→`cancelled`、exitCode===0→`passed`、否则 `failed`；`diagnostics = parseDiagnostics(stdout+"\n"+stderr, resultLimit)`；写回 runs 表并 `ctx.serial("coding/check-settled", result)` 做经验捕获（失败仅告警，不影响结果）（I:1396-1430）。
  - `cancelCheck` 对在跑 record 调 `control.abort()` 后 join 结果；已结束记录不变（I:1454-1459）。
  - 工具层 `runOne` 在调用方 signal abort 时以独立 AbortController 触发 cancelCheck（异步，失败仅 logger.warn），并等待 waitForCheck（T:267-283）。
- **边界**：
  - `scope:"changed"` 的选择规则（`selectChecksForScope`，S:354-383）：变更扫描不完整→全部纳入，reason `changed-list-incomplete`；无变更→全部跳过，reason `no-changes`；check 未声明 coverage→纳入，reason `no-coverage-declared`；声明了 coverage 用 picomatch（`dot:true`）匹配变更文件→纳入 `coverage-match` / 跳过 `coverage-exclude`。coverage globs 在 `.hey/coding.json` 声明。
  - 变更列表来自 `changedFiles`（git diff HEAD + ls-files --others），不完整时 reason 为 `changed-list-truncated`/`changed-list-unavailable`/`git-unavailable`，此时保守跑全部 check（S:286-345）。
  - "通过 ≠ 新鲜验收"：source 变化或扫描不完整时 assess 不认（reason `source-changed`/`source-incomplete`），见 §三 acceptance 与 I:1538-1547。
  - `expectedArgv`（可选）仅校验调用参数是否一致，不校验脚本内容（README:27）。
  - 单次运行超时受 `checkTimeoutMs=120s`、进程退出宽限 `graceMs=2s`、stdout/stderr 各 `maxOutputBytes=128KiB` 约束；截断时 `truncated:true`。
- **证据**：T:233-313；I:1339-1459；P:91-161；S:260-276,286-383；V:90-100。

---

## 五、coding_repair

- **签名**：`defineTool` 工具 `coding_repair`，`execute(args, exec) => string`（JSON）；`presentCall` 标题 `Repair: ${args.action}`（T:314-364）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `action` | string enum | 是 | 非只读：`start\|read\|cancel`；只读：仅 `read` |
| `runId` | string | 否 | start 必填：本工作区失败 check 的执行 id，经 `brandString` |
| `id` | string | 否 | read/cancel 必填：start 返回的 repair id，经 `brandString` |
| `maxAttempts` | integer | 否 | start 的显式尝试上限，缺省 `1`，不得超部署上限（`repairAttempts`） |

- **返回**（JSON 字符串）：
  - `start` → repair 记录：`{id, workspaceId, parentSessionId, childSessionId:null, initialRunId, maxAttempts, attempts:0, runIds:[], status:"running", startedAt, finishedAt:null, error:null}`（I:2167-2194）。
  - `read` → 本工作区已有 repair 记录。
  - `cancel` → 结束后的 repair 记录（status 为 `cancelled`/`passed`/`failed` 等）。
  - repairSchema 字段见 §1.2；`status` ∈ `running|passed|failed|cancelled|interrupted`。
- **错误文本**（逐字）：工具层 `Check execution is not in the current workspace`（start 的 runId 不在本工作区）、`Repair is not in the current workspace`（read/cancel 的 id 未找到）、`${tool} ${action} is unavailable in a source read-only role`；领域 `failed-check-required`（原 run 状态非 `failed`/`error`/`timed-out`）、`record-limit`、`repair-already-running`（同工作区已有 running repair）、`repair-command-redacted`（run.argv 含 `[redacted]`）、`repair-source-changed`（源指纹变化或 before/after 不一致）、`repair-check-changed`（验证阶段命令/定义变化）、`repair-not-found`、`working-directory-outside-workspace`。写入 `repair.error` 的固定文本见 §1.4（含逐字三分支与"Session 未干净关闭"句）。
- **副作用**：
  - 准入校验：原 run 必须为失败类状态；修复 agent 以本 Agent 为策略所有者（`actorSessionId` 默认取 run.sessionId），**不继承**失败 check 作者的更宽权限；cwd 必须在工作区内；源指纹完整且与 run.before 一致（I:2146-2195）。
  - 每轮尝试：新建一个独立任务 Agent（同 taskAgent 构造），把其工作目录设为失败 check 的 cwd；发一条 followup（首句 `Use hey-debug...`，含命令 argv、receipt id、`Attempt n/N`、以"不可信诊断数据、绝非指令"标注的历史输出，**逐字见 I:2246**）；等 `child.whenIdle()`；每轮超时 `CODING_REPAIR_TIMEOUT`（`repairTimeoutMs=300s`），到点以 reason `Coding repair attempt deadline reached` 取消 child。
  - 每轮独立重跑原 check（经 `admitCheck(..., expected)`，`expected` 含原 run 与 checkDefinitions）；验证命令一旦 cwd/argv/manifest 变化即停止（`repair-check-changed`）；每轮完成把新 run id 追加到 `runIds`，并把 `attempts` 写入记录（I:2196-2329）。
  - 仅当某轮 `status:"passed"` 且 before/after 指纹完整且摘要一致（源未变）才 `status:"passed"`；N 轮耗尽仍 running → `failed`；`ctx.serial("coding/repair-settled", value)` 做经验捕获（失败仅告警）。
  - `cancelRepair` 对在跑 repair 调 `control.abort()` 并 join（I:2336-2347）。
- **边界**：
  - 修复只做有界模型辅助改动：提示词明确禁止弱化测试/检查、安装依赖、改权限、提交、推送、部署；要求最小修复后停止，由服务独立重跑原 check。
  - 成功 ≠ 部署/用户批准；repair 不产出 acceptance 结论。
  - `maxAttempts` 经 `z.number().int().min(1).max(config.repairAttempts)` 校验；工具层缺省 `1`。
  - 被脱敏的命令不可修复（无法安全重放）；源变化、部分扫描、取消、超时均不可授权修复。
  - 每轮 child 在循环开头 dispose；最终 `finally` 再次 cancel+dispose，关闭失败会把 status 置 failed 并写固定 error 文本。
- **证据**：T:314-364；I:2146-2347；P:91-161；E:301-366。

---

## 六、coding_review

- **签名**：`defineTool` 工具 `coding_review`，`execute(args, exec) => string`（JSON）；`presentCall` 标题固定 `Code review finding`（T:365-420）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `action` | string enum | 是 | `add\|update` |
| `path` | string | add | 工作区相对源文件路径（必存在，否则 `source-not-found`） |
| `line` | integer | add | 行号，缺省 `0` |
| `severity` | string enum | add | `critical\|high\|medium\|low`，缺省 `medium` |
| `title` | string | add | 缺省 `""` |
| `evidence` | string | add | 缺省 `""` |
| `id` | string | update | finding id，经 `brandString` |
| `state` | string enum | update | `open\|resolved\|dismissed`，缺省 `open` |

- **返回**（JSON 字符串）：finding 记录（findingSchema）：`{id, workspaceId, sessionId, path, line, severity, title, evidence, sourceHash, state, createdAt, updatedAt}`。`add` 时 `state:"open"`、`sourceHash` 为所读文件 bytes 的 sha256、`createdAt`/`updatedAt` 为当前 ISO 时间（I:1615-1653）。
- **错误文本**（逐字）：工具层 `Finding is not in the current workspace`（update 的 id 不在本工作区）、`This coding operation requires a workspace Session`、`Import the current local folder as a workspace before using coding evidence tools`；领域 `record-limit`（findings 数≥maxRecords）、`source-not-found`（path 读不到）、`finding-not-found`（update 记录缺失）。`findingSchema.parse` 失败为原生 zod 错误（如 title>240、evidence>16000）。
- **副作用**：`add` 对目标文件做 `readSource`（受路径范围/大小/读取期间变更校验），把 finding 落 `findings` 表；`update` 以新 state 覆盖原记录并刷新 `updatedAt`。二者经 `serialize` 串行化，`owned` 绑定调用方与服务生命周期（I:1615-1653）。
- **边界**：
  - finding 是"评审元数据"，不是源码改动，也不是验证通过的证明；state 是人工评审决定。
  - 源文件之后变化时，`assess` 用 `file.hash === finding.sourceHash` 判断该 finding 的 freshness（I:1559-1565）。
  - `line` 无正数校验（工具层缺省 0）；字段长度上限由 findingSchema 约束。
  - 路径越界/符号链接/非普通文件由 `readSource` 拒绝（S:22-57）。
- **证据**：T:365-420；I:1615-1653,1559-1565；Z:80-102；S:22-57。

---

## 七、coding_acceptance

- **签名**：`defineTool` 工具 `coding_acceptance`，`execute(args, exec) => string`（JSON）；`presentCall` 标题 `Acceptance: ${args.action}`（T:168-232）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `action` | string enum | 是 | 可定义角色：`read\|define`；只读角色：仅 `read` |
| `expectedRevision` | integer | define | 当前 revision（来自 read）；仅在无规范时省略，工具层转 `null` |
| `goal` | string | define | 具体开发目标，缺省 `""`；schema 要求 1..8000 |
| `independentVerificationOf` | string[] | 否 | 实现方 session id 列表；省略保留原选择，空数组清空；逐项经 `SessionId` |
| `criteria` | object[] | define | 每项 `{id, text, checks[]}`，`additionalProperties:false`，缺省 `[]`；checks 必须引用真实 check 名 |

- **返回**（JSON 字符串）：
  - `read` → 当前 spec 记录（specSchema）或 `null`（`overview().spec`）。
  - `define` → 新提交的 spec 记录：`revision = 当前 revision + 1`，`updatedAt` 为当前 ISO 时间，`independentVerificationOf` 为空数组时省略该字段（I:1660-1685）。
- **错误文本**（逐字）：工具层 `${tool} ${action} is unavailable in a source read-only role`；领域 `record-limit`（specs 数≥maxRecords）、`spec-version-conflict`（expectedRevision 与当前 revision 不符）、`duplicate-implementer`（implementers 去重后数量不等）、`check-not-found`（criterion.checks 引用了未发现的 check 名）、`duplicate-criterion`（criteria id 重复）；以及唯一不同 message 的 `Use existing implementation Session IDs from this workspace; completed members are allowed.`（reason `implementation-session-workspace-mismatch`，当显式给出的 session 不在本工作区 sessionIds）。`specSchema.parse` 失败为原生 zod 错误。
- **副作用**：`define` 串行执行：校验 revision/记录上限 → 处理 implementers（省略=保留原 selection；空数组=清空）→ 依 `discoverChecks` 校验所有 criterion.checks 都是真实 check → 校验 criterion id 唯一 → 以 key `${workspaceId}_${revision}` 写 `specs` 表，旧 revision 保留用于审计/导出（I:1660-1685）。
- **边界**：
  - 替换规范会使旧 check 证据失效（assess 比对 `run.specRevision !== spec.revision` 视为 missingCheck，I:1547）。
  - `independentVerificationOf` 是"执行独立性"，不是代码评审结论；名单必须来自本工作区真实 roster（允许已完成成员）。
  - 每条 criterion 至少 1 个 check、至多 32 个；criteria 1..100 条；goal 1..8000。
  - 只读角色只能 read；`expectedRevision` 工具层缺省 `null`，仅当无规范时匹配成功。
- **证据**：T:168-232；I:1660-1685,1543-1554；Z:104-115；TT:124-149。

---

## 八、coding_restore

- **签名**：`defineTool` 工具 `coding_restore`，`execute(args, exec) => string`（JSON）；注册时带 `{ when: () => !readOnly }`（只读角色不注册此工具）；`presentCall` 标题 `Restore captured file`（T:479-510）。
- **参数表**：

| 参数 | 类型 | 必填 | 约束 / 默认 |
|---|---|---|---|
| `seq` | integer | 是 | 本 Session 中 `workspace/changes` 事件序号，`z.number().int().nonnegative()` |
| `index` | integer | 是 | 该事件摘要中的文件位置，`z.number().int().nonnegative()` |

- **返回**（JSON 字符串，`restoreFile` 结果）：`{path, status, reason}`。status/reason 组合（逐字，I:1773-1857）：
  - `status:"unavailable"`, `reason:"capture-not-found"`（seq/index 无对应捕获，path 为 `""`）
  - `status:"unsupported"`, `reason:"only-bounded-text-can-be-restored"`（捕获不是文本，或当前目标是目录/超过 maxFileBytes）
  - `status:"unsupported"`, `reason:"outside-workspace"`（解析后文件不在工作区内）
  - `status:"conflict"`, `reason:"current-content-differs-from-capture"`（当前内容 ≠ 捕获的 after-state）
  - `status:"conflict"`, `reason:"observed-version-changed"`（写入/删除意向被改）
  - `status:"restored"`, `reason:"already-absent"`（before 为 null 且当前已不存在）
  - `status:"restored"`, `reason:"captured-before-state-restored"`（成功恢复）
- **错误文本**（逐字）：领域 `session-workspace-mismatch`（捕获工作区不含该 actor session）、`This coding operation requires a workspace Session`、`Import the current local folder as a workspace before using coding evidence tools`。注意本工具绝大多数"失败"以 `status/reason` 返回，**不抛错**。
- **副作用**：
  - 先读 `workspaceChanges.summary(sessionId, seq).files[index]` 与 `contents(...)`（要求 `kind:"text"`），再校验 actor session 属于捕获工作区、路径在工作区内、当前文件大小≤maxFileBytes。
  - 关键安全条件：仅当当前文件内容仍等于捕获的 after-state（且 stat.version 未变）才写入 before-state；否则返回 conflict，不覆盖用户后续编辑。
  - 经 `ctx.emit("fs/observed", ...)` 与 `waterfall("fs/delete-intent" / "fs/write-intent", ...)` 走现有文件写/删策略（带 version 条件：`createIfAbsent` 或 `replaceIfVersion`）；before 为 null 时删文件，否则写回文本（I:1817-1851）。
  - 工具层把 `sessionId` 同时作为 `actorSessionId` 传入（T:498-503）。
- **边界**：
  - 只恢复有界文本文件；不撤销数据库、外部服务或进程副作用。
  - 需要"显式用户请求恢复此文件"为前提（工具描述，TT:267）。
  - 二进制/大文件/越界路径一律 unsupported；并发修改导致的 version 变化一律 conflict。
- **证据**：T:479-510,265-276；I:1773-1857；TT:265-277。

---

## 九、coding_workbench（工作台服务本体，第 8 项）

- **签名**：cordis/typert 远程服务类 `CodingWorkbench extends TypertRemoteService`，构造 `new CodingWorkbench(ctx, config)`，`super(ctx, "codingWorkbench")`；导出 `CodingWorkbench` 与 `default`（I:543-573,943,2381）。`static Config = Config`；`static inject` 列出 `typert/storageDomain/workspaceRegistry/fs/subprocess/sandbox/sandboxPolicy/agents/workingDirectory/workspaceChanges/sessionProjections/sessionQuery/agentPresets/worktrees/approval`（I:907-924）。
- **参数表**：构造参数 `config` 即 §1.3 的 Config（经 `Config(config)` 校验）；运行期方法以 `{workspaceId, sessionId?, ...}` 请求对象 + `signal` 为通用入参。对外 `Remote` 方法面（I:576-602,943）：
  `overview`、`doctor`、`qualityReport`、`sweep`、`experienceSearch`、`planChecks`、`startCheck`、`cancelCheck`、`assess`、`evidenceSnapshot`、`impact`、`addFinding`、`updateFinding`、`saveSpec`、`context`、`changes`、`diff`、`restoreFile`、`createTask`、`inspectTask`、`commitTask`、`mergeTask`、`removeTask`、`restoreTask`、`startRepair`、`cancelRepair`、`exportEvidence`。
- **返回**：各方法返回其领域数据（详见 §二～§八 与上文各工具返回），均为可序列化对象/JSON；`evidenceSnapshot` 返回 `{assessment, quality, overview, totals, truncated}`（I:1476-1534）；`exportEvidence` 返回 `{name:"hey-coding-evidence.json", json}`（I:2354-2376）。
- **错误文本**（逐字）：`data` getter 在服务未就绪/生命周期中止时抛 `failed("unavailable")`；`workspace(id)` 找不到→`workspace-unavailable`；`agent(id)` 找不到→`open-workspace-session-first`，session 不属于 workspace→`session-workspace-mismatch`；`operationDirectory`'s `requireWorkspaceDirectory`→`working-directory-outside-workspace`；evidenceSnapshot 连续三次并发变化→`failed("evidence-changing")`（I:1044-1082,1476-1479）。其余 reason 见 §1.4。
- **副作用**：
  - `[Service.init]`：`resolveDshHome(dshHome)/coding-workbench` 目录 `mkdir(recursive, mode:448)`；以 `withFileLock(.../execution-owner, {waitMs: leaseWaitMs, signal: deadline(...,"CODING_HOME_IN_USE")})` 取得独占执行权；打开 `defineDomain` 存储域；把启动时仍为 `running` 的 run/repair 改写为 `interrupted` 并写固定文本（§1.4）；注册两个 session 投影 `codingContextInspector`（init=emptyContext, apply=foldContext）与 `codingRecentChanges`（init=[], apply=foldChangeIndex）（I:973-1043）。
  - 生命周期销毁：abort 所有 check/repair control，join operations/done，cancel+dispose 所有 taskAgents，await mutations，close domain，释放 lease（I:945-971）。
  - `owned()` 把调用方 signal 与服务 lifetime 组合（`AbortSignal.any`），并跟踪 operations；`serialize()` 串行化所有变更（I:1048-1060）。
  - `exportEvidence` 汇总 overview+assessment+所有 spec+每个 run session 的 context，整体经 `redactDevelopmentText`，超过 `exportMaxBytes` 抛 `export-too-large`（I:2354-2376）。
  - 所有 id 通过 `brandString` 品牌化，执行 id 用 `randomUUID()`。
- **边界**：
  - 单实例独占（文件锁）；租约等待超时标签 `CODING_HOME_IN_USE`。
  - `evidenceSnapshot` 用 `captureCodingEvidence` 三次比对 `evidenceState`，不一致返回 null→`evidence-changing`（I:379-392）。
  - 工具展示截断：runs 按 sequence 倒序取 `min(resultLimit,50)`；diagnostics 取 `min(limit,20)`、message 截 `min(textLimit,1024)`；证据文本截 `min(contextBytes,16384)`；任何裁剪置 `truncated:true`（I:1481-1532）。
  - 快照文本截断用 `boundedText`（按 UTF-8 字节、不切坏码点，C:31-37）。
- **证据**：I:527-573,907-971,973-1085,1476-1534,2354-2381；C:31-37,44-83；Z:6-159。

---

## 十、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `parseDiagnostics` / TS 风格、GCC 风格、warning/error、无匹配、code 空、message 超长、limit | 两正则 + 字段归一化 + 上限 |
| `runCommand` / danger-full-access 放行、沙箱包裹、空命令、超时、输出截断、取消、git env 清理 | spawn 构造 + 沙箱策略 + 上限 |
| `discoverChecks` / coding.json、package scripts、packageManager 白名单、pyproject、pom、重名 | 命令来源 + 白名单 |
| `selectChecksForScope` / 变更为空、不完整、无 coverage、命中、未命中 | 变更范围决策 |
| `experience` / 账本缺失、可读、分词、basename 命中、排序去重、脱敏 | 账本三态 + 匹配规则 |
| `coding_check` / run 单命令、scope=changed、read、cancel、check+scope 互斥、只读角色 | 四 action + 错误 |
| `coding_repair` / start 准入、失败类状态、已脱敏命令、源变化、多轮成功/失败、cancel | 修复边界 |
| `coding_review` / add 成功、文件不存在、update 不存在、字段超限 | finding 生命周期 |
| `coding_acceptance` / read、define 首版、revision 冲突、未知 check、重复 criterion、独立验证名单 | spec 版本与校验 |
| `coding_task` / create、inspect、merge（干净/分叉）、remove（含 ignored）、只读角色 | worktree 生命周期 |
| `coding_restore` / 成功、conflict、unsupported、capture-not-found | 恢复安全条件 |
| `evidenceSnapshot` / 并发变化重试、文本截断、truncated | 快照一致性 |

---

## 十一、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数表/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字，含插值模板；`coding/failed` 与 reason 集合完整
- [ ] 没有出现"先 X 再 Y"这类实现/算法描述
- [ ] 冻结契约单列；Config 默认值、schema 约束、白名单、品牌串逐字
- [ ] `runCommand` 命令构造、沙箱 confine、超时/输出上限写清
- [ ] `parseDiagnostics` 输入输出格式、经验账本路径与匹配规则写清
- [ ] 工件判定/编码规范只引用 `specs/delivery.md`，未重复
- [ ] 不明处标"待确认"，未猜测

---

## 十二、自查结论（遮住 lib 复述）

遮住 lib 后逐工具复述验证结果：

| 工具 | 能否复述 | 备注 |
|---|---|---|
| coding_task | 能 | 四 action、worktree 命令、合并/删除前置条件、错误 reason 均可复述 |
| coding_inspect | 能 | 9 mode、sweep 四类 finding、诊断两正则、账本三态与匹配规则可复述 |
| coding_check | 能 | spawn 六步构造、沙箱二分支、超时/上限、scope 决策、状态映射可复述 |
| coding_repair | 能 | 准入五条件、每轮独立重跑、成功判据、错误文本可复述 |
| coding_review | 能 | add/update、sourceHash、state 语义可复述 |
| coding_acceptance | 能 | revision 冲突、check 校验、独立验证名单、spec 版本可复述 |
| coding_restore | 能 | 7 种 status/reason、version 条件写回、conflict 语义可复述 |
| coding_workbench | 能 | init/销毁、独占锁、Remote 方法面、快照一致性可复述 |

**不确定项（标"待确认"，未猜测）**：
1. `coding_workbench` 是否应视作"第 8 个工具"单独成节，还是并入 `coding_inspect`/服务导出面——用户明确列为 8 工具之一，故按独立节处理；若 golden 以 `defineTool` 数量为准则为 7 工具，需评审确认。
2. `context` 投影（`codingContextInspector`）的完整 `contextSchema` 字段语义由 `C:7-24` 给出，但 `runtime-context` 事件的来源写入方不在本包，其 `form:"snapshot"` 之外分支的精确行为待确认（本包折叠逻辑为 `form!=="snapshot"` 时 sections 取空）。
3. `compaction-refresh`、`experience-recall`、`standards-context`、`completion` 等旁支入口不在用户指定的 8 工具范围，本文未展开；如需完整导出面规格须另立 spec（待确认）。

结论：8 项均可依据本文独立复述其参数、错误、副作用与边界；三处不确定项已标注，未作猜测。
