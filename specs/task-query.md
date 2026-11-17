# spec: dsh-task-query（Service：`taskQuery` 任务查询投影）

> 重写目标：行为等价的 `dsh-task-query` 服务实现。
> 证据：只有 tsc 直出 `lib`，无还原 `src`。`uma-assets/packages/dsh-task-query/lib/index.js`（下称 **L**，91 行）。
> 行号仅供校对，不作为抄写依据。
> 范围：cordis `Service`，通过向 `sessionProjections` 注册一个有界投影，为 Code Wiki 与文档知识提供"当前任务检索提示"。
> 对外只有 **1 个公开方法** `current(session, claimed)` + 服务装配；**不是 `defineTool`**，没有工具 schema。
> 状态：**待横向评审**（写完需验证"没看过 lib 的人能否照此复述"）。

---

## 一、冻结契约（不可改，改了行为全废）

### 1.1 内部标识（逐字保留）

| 项 | 值 | 证据 |
|---|---|---|
| 服务注册名 | `taskQuery`（`super(ctx, 'taskQuery')`） | L:67 |
| `static inject` | `['sessionProjections']` | L:60 |
| 投影 key | `workspaceRetrievalQuery` | L:71 |
| 投影 `stateVersion` | `3`（整数） | L:72 |
| 状态窗口 `WINDOW` | `4000`（字符数上限） | L:5 |
| 投影初始状态 `EMPTY` | `{ task: '', latest: '', freshTurn: true }` | L:11-15 |
| 新任务来源 `NEW_TASK_SOURCES` | `Set(['user', 'schedule'])` | L:16 |
|  admissible 来源 `TASK_SOURCES` | `Set(['user','schedule','agent-message','team-message'])` | L:17-22 |
| 投影事件 | `turn/start`、`user/message` | L:51,55 |
| 投影 `apply` 函数名 | `fold` | L:75 |
| 错误文本（唯一） | `Task query projection is not ready` | L:85 |
| 品牌/对外口径 | `taskQuery` / `workspaceRetrievalQuery` 为内部标识，按 lib 逐字保留；对外品牌 `HeyWork`（`HEYWORK.md` §2） | L:67,71 |

### 1.2 状态 schema（zod，逐字）

`stateSchema = z.object({ task: z.string().max(WINDOW), latest: z.string().max(WINDOW), freshTurn: z.boolean() })`
（L:6-10）。`WINDOW = 4000`。

| 字段 | 类型 | 约束 |
|---|---|---|
| `task` | string | max 4000 |
| `latest` | string | max 4000 |
| `freshTurn` | boolean | 无额外约束 |

---

## 二、服务装配与生命周期

- `class TaskQuery extends Service`（L:59）。
  - `static inject = ['sessionProjections']`（L:60）。
  - 构造：`super(ctx, 'taskQuery')`（L:66-68），无 Config，无 `ctx.effect` 清理。
  - 字段 `handle`（投影句柄）初始未定义（L:61）。
- `[Service.init]`（L:69-77）：`await ctx.sessionProjections.register({...})`，注册项逐字：
  - `key: 'workspaceRetrievalQuery'`
  - `stateVersion: 3`
  - `stateSchema`（§1.2）
  - `init: () => EMPTY`
  - `apply: fold`
  - 把返回的句柄赋给 `this.handle`。
- 服务可见性：本类是"查询所有者"，作为普通 scoped 服务注册；重启/插件替换不擦除投影中活跃的任务查询（投影归 `sessionProjections` 所有）。

---

## 三、投影语义（对外可见的状态转移规则）

> 以下描述 `workspaceRetrievalQuery` 投影的**外部可见语义**，不是实现步骤。
> 状态为 `{ task, latest, freshTurn }`；所有文本经 `bounded` 限幅（§3.3）。

### 3.1 来源准入门槛（admit 语义）

| 消息 `source.kind` | 行为 |
|---|---|
| 不在 `TASK_SOURCES`（即非 user/schedule/agent-message/team-message） | 状态不变 |
| 文本为空（trim 后 `''`） | 状态不变 |
| `agent-message` / `team-message` 且 `task !== ''` | 作为 `latest`（转向/steering），`freshTurn=false`，`task` 不变 |
| `user` / `schedule`（新任务来源），或 `freshTurn===true`，或 `task===''` | 作为新 `task`（覆盖），`latest=''`，`freshTurn=false` |
| `agent-message` / `team-message` 且 `task===''` | 作为新 `task`（因为 task 为空），`latest=''`，`freshTurn=false` |

### 3.2 事件折叠（fold 语义）

| 事件 | 行为 |
|---|---|
| `turn/start` | 若 `freshTurn===true` → 状态不变；否则 → `freshTurn=true`（其余字段不变） |
| `user/message` 且 `source.kind` 在 `TASK_SOURCES` | 若 `typeof event.surfaceOp === 'object'` → 先以 `EMPTY` 为基准再 admit（相当于新回合重置）；否则以当前状态 admit |
| 其他事件 / 来源不在集合 | 状态不变 |

### 3.3 `bounded(text)` 限幅规则（逐字语义）

- `text.length <= 4000` → 原样返回。
- 否则：`head = 2000`，`tail = text.length - 1999`；若 `head` 处字符是 UTF-16 低代理项（`0xDC00..0xDFFF`）则 `head--`；若 `tail` 处字符是低代理项则 `tail++`；
  返回 `${text.slice(0, head)}\n${text.slice(tail)}`（头 2000 + 换行 + 尾 1999，并避免切断代理对）。
- 拼接 `text` 时：仅取 `message.content` 中 `type === 'text'` 的部分的 `part.text`，用 `\n` 连接，再 `bounded`。
- `current` 返回时若 `latest !== ''`，返回 `bounded(\`${task}\n${latest}\`)`（可能再次限幅）。

---

## 四、公开 API 七段规格

### 4.1 `current(session, claimed)`

1. **签名**：`current(session, claimed)`（无 `async`，同步返回；L:84）。
   - `session` — 精确的开发 Session（用于 `handle.stateOf(session)` 取投影状态）。
   - `claimed` — 当前 pre-step 的用户输入数组；预览**永不写入持久化状态**。
2. **参数**：
   - `session`：传给投影 `stateOf(session)` 的 Session 标识（L:86）。
   - `claimed`：可迭代输入数组，逐项按 §3.1 admit 规则折叠到投影状态副本；每项形状为 `message`（含 `source.kind` 与 `content`）。
3. **返回**：`string` — 有界任务/转向查询：
   - `state.latest === ''` → 返回 `state.task`（L:87）。
   - 否则 → 返回 `bounded(\`${task}\n${latest}\`)`（L:87）。
   - 任何用户文本出现之前 → `''`（因 `EMPTY.task === ''` 且 `latest === ''`）。
4. **错误文本**（逐字）：
   - `this.handle === undefined`（投影未就绪）→ `Error('Task query projection is not ready')`（L:85）。
   - `claimed` 非可迭代 / `reduce` 回调异常 → 原生 `TypeError`（待确认是否需包装）。
5. **副作用**：**只读预览**——不写投影、不改持久化状态；仅 `claimed.reduce(admit, this.handle.stateOf(session))` 计算后返回。
6. **边界**：
   - 空 `claimed` → 返回当前投影状态的查询（空状态返回 `''`）。
   - `claimed` 中来源非 `TASK_SOURCES` 或文本全空白 → 该条被忽略。
   - 超长文本 → 经 `bounded` 限幅（头 2000 + 尾 1999，代理对安全）。
   - `latest` 非空时拼接 `task`+`latest` 后再次限幅到 4000。
   - `freshTurn=true` 时下一条新任务来源消息覆盖 `task` 并清 `latest`。
7. **证据出处**：L:84-88；语义 L:31-57；冻结契约 L:5-22。

### 4.2 服务装配 `[Service.init]`（注册投影）

1. **签名**：`async [Service.init]()`（L:69）。
2. **参数**：无显式参数；依赖注入的 `ctx.sessionProjections.register(...)`。
3. **返回**：`Promise<void>`；`this.handle` 被赋为注册返回的句柄（L:70-76）。
4. **错误文本**：`register` 自身抛出的错误原样上抛（未包装）；无本包自定义错误。
5. **副作用**：向 `sessionProjections` 注册 key=`workspaceRetrievalQuery`、version=3 的投影；投影状态跨重启保留。
6. **边界**：`stateOf` 由 `sessionProjections` 提供；投影状态若版本不匹配（stateVersion 3）由 `sessionProjections` 决定迁移/重置策略（本包不处理，待确认）。
7. **证据出处**：L:69-77；L:60-61。

---

## 五、对外交互面（谁消费 `current`）

- `taskQuery` 由 `dsh-knowledge/context` 的 `hey:workspace-knowledge` 上下文贡献器消费：
  在 `agent/pre-step` 调用 `ctx.taskQuery.current(agent.session, messages)` 得到 query，再用它调用
  `knowledge.forWorkspace(...)` 与 `knowledge.experiencesForWorkspace(...)`（见 `specs/knowledge.md` §7.31）。
- 本包**不直接发起检索、不调用模型、不写文件**；它只提供有界的当前任务提示字符串。

---

## 六、待确认（无还原 src，仅凭 91 行 lib 无法确定）

1. `ctx.sessionProjections.register` / `stateOf` 的完整契约（版本迁移、并发、abort 语义）由 `sessionProjections` 服务决定，不在本包内。
2. `claimed` 元素的精确运行时形状（`message.source.kind`、`message.content`、可选 `surfaceOp` 的类型）由调用方与投影共同约定；lib 只读取这些字段。
3. `typeof event.surfaceOp === 'object'` 中 `surfaceOp` 的语义（为何对象表示新回合）由上层约定；本包按 lib 逐字实现该判定。
4. 限幅后拼接得到的查询串是否再次经过 `stateSchema` 校验——`current` 直接返回 `bounded(...)`，未见显式 parse；需 golden 确认。
5. 错误 `Task query projection is not ready` 只在 `handle===undefined` 时出现；正常 `[Service.init]` 后不应触发。

---

## 七、自查结论（遮住 lib 后复述）

- 身份：能复述 `TaskQuery extends Service`、`super(ctx,'taskQuery')`、inject `['sessionProjections']`、投影 key `workspaceRetrievalQuery`、stateVersion 3、WINDOW 4000、三组常量（EMPTY / NEW_TASK_SOURCES / TASK_SOURCES）。
- API：能复述唯一公开方法 `current(session, claimed)` 的七段——同步、只读预览、返回有界查询串、唯一错误 `Task query projection is not ready`。
- 语义：能复述来源准入门槛、turn/start 的 freshTurn 重置、surfaceOp 对象触发 EMPTY 基准、新任务覆盖 task / 转向写 latest 的分支。
- 限幅：能复述 4000 上限、头 2000+尾 1999、代理对安全、拼接后再限幅。
- 交互：能复述它被 `hey:workspace-knowledge` 消费，自身不检索/不调用模型/不写文件。
- 缺口：仅 §六 5 项依赖外部服务/golden，不影响外部行为复述。
- 结论：**通过**——遮住 lib 可独立复述对外行为并据此写出行为等价实现。
