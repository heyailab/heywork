# spec: dsh-skill-uma（容器读取层 + 技能注册）

> 重写目标：行为等价的 `heywork-skill` 包。
> 证据：`uma-assets/packages/dsh-skill-uma/src/types/resources.ts`（下称 R）、
> `src/types/index.ts`（下称 I）。行号仅供校对，不作为抄写依据。
> 状态：**待横向评审**（写完后需找人验证"没看过源码的人能否照此实现"）。

---

## 一、冻结契约（不可改，改了数据全废）

这些不是"行为"，是**字节级常量**。重写时逐字保留：

| 项 | 值 | 证据 |
|---|---|---|
| 密钥派生串 | `UMA Studio local resource container v1`（SHA-256 后作 AES-256-GCM key） | R:41 |
| 容器文件名 | `resources.umadb` | R:50 |
| 虚拟目录名 | `assets`（**该目录在磁盘上不存在**，是虚拟命名空间） | R:53 |
| 表结构 | `resources(id TEXT PRIMARY KEY, kind INTEGER, nonce BLOB, value BLOB, tag BLOB)` | R:162 |
| id 算法 | SHA-256(虚拟路径).hex | R:43 |
| AAD | `` `${kind}:${virtualPath}` `` | R:76 |
| 压缩 | brotli，解压上限 2 MiB | R:42,79 |
| nonce | 12 字节随机 | R:166 |
| 虚拟路径分隔符 | POSIX `/`（Windows 上 `\` 必须转成 `/` 再作 key） | R:55 |

---

## 二、资源读取层 API（R 模块）

### 2.1 `isBundledPath(path: string): boolean`

- **签名**：输入路径字符串，返回布尔
- **参数**：`path` — 虚拟资源路径（不可为空；非绝对路径按进程 CWD 解析）
- **返回**：true 当且仅当"沿 path 向上能找到一个祖先目录 P，使得 `P/assets` 覆盖 path 且 `P/resources.umadb` 存在"
- **错误文本**：无（永不抛错）
- **副作用**：只读文件系统（存在性检查）
- **边界**：
  - path 正好等于 `P/assets` → true
  - path 不在任何 `assets/` 下 → false
  - `P/resources.umadb` 不存在但 `P/assets` 存在 → false
  - asar 打包场景：`P/app.asar/resources.umadb` 的虚拟路径要映射到 `app.asar.unpacked/resources.umadb` 检查存在性（R:51）
- **证据**：R:46-60, 90-92

### 2.2 `resourceExists(path: string): boolean`

- **签名**：`(path: string) => boolean`
- **参数**：同上
- **返回**：
  - 非容器路径 → 磁盘文件是否存在
  - 容器路径 → 该虚拟路径在容器中是否有记录（解密成功才算存在）
- **错误文本**：无。解密失败/记录损坏一律吞掉，返回 false（R:103-106）
- **副作用**：只读
- **边界**：
  - 容器存在但记录缺失 → false
  - 容器损坏（认证失败）→ false（不向上传播）
  - 非容器路径不存在 → false
- **证据**：R:98-107

### 2.3 `resourceIsDirectory(path: string): boolean`

- **签名**：`(path: string) => boolean`
- **参数**：同上
- **返回**：容器记录 `kind === 1` → true；`kind === 0` → false；非容器路径 → 磁盘 `statSync(path).isDirectory()`
- **错误文本**：
  - 非容器路径且磁盘路径不存在 → `statSync` 原生 ENOENT 错误（不包装）
  - 容器记录不存在 → 由 lookup 抛 `"Unknown internal resource"`（R:71）
- **副作用**：只读
- **边界**：kind 非 0/1 的整数 → 按 `=== 1` 判断（非 1 即视为文件）
- **证据**：R:113-116

### 2.4 `readResourceFile(path, encoding?): Buffer | string`

- **签名**：重载
  - `readResourceFile(path: string): Buffer`
  - `readResourceFile(path: string, encoding: string): string`
- **参数**：
  - `path` — 虚拟或磁盘路径
  - `encoding` — 任何非 undefined 值都触发"按 UTF-8 严格解码"（实现只看是否传了，不看值内容）
- **返回**：
  - 不传 encoding → Buffer（容器里的解密字节，或磁盘 `readFile`）
  - 传 encoding → 用 `TextDecoder('utf-8', { fatal: true })` 解码的字符串
- **错误文本**：
  - 目标是目录 → `"Resource is a directory"`（R:123）
  - 非 UTF-8 字节且传了 encoding → TextDecoder 原生 TypeError
  - 磁盘文件不存在 → `readFile` 原生 ENOENT
- **副作用**：只读
- **边界**：
  - 容器里没有该记录 → 回退读磁盘真实路径（R:124 的 `??`）
  - 空文件 → 返回空 Buffer / 空字符串
- **证据**：R:119-126

### 2.5 `listResourceDirectory(path, options?): ResourceEntry[]`

- **签名**：`(path: string, options?: { withFileTypes?: boolean }) => ResourceEntry[]`
- **参数**：`path` — 虚拟或磁盘目录；`options` — 与 `fs.readdir` 的 options 同形（容器分支忽略此参数）
- **返回**：直接子项数组，每项形状：
  ```
  { name: string, isDirectory(): boolean, isFile(): boolean, isSymbolicLink(): false }
  ```
  - 容器分支：`isSymbolicLink()` 恒为 false（容器不允许符号链接）
  - 非容器分支：直接返回 `fs.readdir(path, options)` 的结果（原生 Dirent[]）
- **错误文本**：
  - 容器记录是文件而非目录 → `"Resource is not a directory"`
  - 容器目录内容不是 JSON 数组 → `"Invalid resource directory"`
  - 数组元素不合法 → `"Invalid resource entry"`
  - 元素不合法的条件（任一即抛）：null / 非对象 / 缺 name / name 非字符串 / 缺 directory / directory 非布尔 / name 为 `""` / `"."` / `".."` / name 含 `/`、`\` 或 NUL
  - 非容器路径不存在 → readdir 原生 ENOENT
- **副作用**：只读
- **边界**：
  - 空目录 → `[]`
  - 顺序 = 容器中存储的顺序（构建时按名称 localeCompare 排序写入，见 2.6）
- **证据**：R:133-147

### 2.6 `buildResourceStore(root, output): number`

- **签名**：`(root: string, output: string) => number`（返回写入的文件数）
- **参数**：
  - `root` — 源资源目录，必须已存在且可读
  - `output` — 新容器路径，必须不存在且不在 root 之内
- **返回**：写入的文件条目数（不含目录条目）
- **错误文本**（逐字）：
  - output 已存在或位于 root 内 → `"Resource output must be new and outside assets"`
  - 单个文件 > 2 MiB → `"Resource exceeds container limit"`
  - 遇到符号链接 → `"Resource symlinks are not allowed"`
- **副作用**：
  - 创建 output 数据库，表结构见 §1
  - 写入 `PRAGMA user_version=1`
  - 提交后执行 `VACUUM`
  - 对每个文件写一条记录：id = SHA-256(POSIX 相对路径)、kind=0、nonce=12 随机字节、value=密文、tag=认证标签
  - 对每个目录（含 root 本身）写一条 kind=1 记录，value 是子项清单 JSON（`[{name, directory}]`，按 name 排序）
  - root 自身的相对路径是空字符串 `""`
- **边界**：
  - 空目录 → 只写 root 的 kind=1 记录，返回 0
  - 路径含 Windows `\` → 写入前转成 `/`（R:181,185）
  - 异常时 db 必须 close（try/finally，R:191-193）
  - 大文件 > 2 MiB 抛错后，已写入的记录不回滚（无 savepoint）——这是**已知行为**，重写时保持一致
- **证据**：R:155-194

---

## 三、技能注册层 API（I 模块）

### 3.1 导出面

| 导出 | 类型 | 说明 |
|---|---|---|
| `name` | string，恒为 `"skill-uma"` | cordis 插件 id（**冻结**，见命名边界） |
| `inject` | `["skills"]` | 声明注入到 skills 注册表 |
| `Config` | schemastery schema | `{ assetRoot: string(min 1) }`，无默认值 |
| `apply` | `(ctx, config?) => void` | 插件入口 |

### 3.2 `apply(ctx, config?): void`

- **签名**：`(ctx: { skills: { registerProvider(factory) } }, config?: { assetRoot?: string }) => void`
- **参数**：
  - `ctx` — 需含 `ctx.skills.registerProvider(factory)`；factory 无参数，返回 provider 对象
  - `config.assetRoot` — 可选；未提供时用 `new URL('../assets/', import.meta.url)` 转成的绝对路径
- **返回**：void；通过 `ctx.skills.registerProvider(() => provider)` 注册一个 provider
- **provider 形状**：
  ```
  {
    name: "dsh-uma",
    list: () => Promise<SkillCandidate[]>,
    get: (candidate, options: {signal?: AbortSignal}) => Promise<LoadedSkill>
  }
  ```
- **错误文本**：
  - 任一技能目录的 SKILL.md 无 frontmatter → `"skill-uma: <path> has no YAML frontmatter"`
  - frontmatter 不是对象 → `"skill-uma: <path> has no metadata object"`
  - name 缺失/非法 → `"skill-uma: <path> has an invalid skill name"`
  - description 缺失/空 → `"skill-uma: <path> has no description"`
  - `disable-model-invocation` / `user-invocable` 字段存在但非布尔 → `"skill-uma: <path> has a non-boolean <field>"`
  - 非容器目录读取抛出的原生 fs 错误（不包装）
- **副作用**：
  - 启动期：列举 assetRoot 下的直接子目录（只要目录，不要文件），按名称排序，逐个读 `SKILL.md`，解析 frontmatter，生成 candidate
  - `get()` 调用时：检查 `options.signal` 是否已中止（中止则抛 AbortError），重新读该 candidate 的 SKILL.md，返回去掉 rank/locator、加上 content（正文）的对象
- **candidate 字段**（逐字段，冻结）：
  | 字段 | 值 |
  |---|---|
  | name | frontmatter.name |
  | description | frontmatter.description |
  | whenToUse | frontmatter.whenToUse（空字符串时不带此字段） |
  | invocation.modelInvocable | `disable-model-invocation !== true` |
  | invocation.userInvocable | **恒为 false**（即使 frontmatter 里 user-invocable 为 true） |
  | provider | `"dsh-uma"` |
  | source | `"bundled"` |
  | rank | `BUNDLED_SKILL_RANK`（来自 `@deepseek-ai/dsh-skill`） |
  | resourceBase.kind | `"opaque"` |
  | resourceBase.description | 固定提示词，含 `hey_resource_read` 与技能名插值，见 I:120 |
  | locator | `join(directory, "SKILL.md")` |
- **边界**：
  - SKILL.md 正文 = frontmatter 结束标记之后的全部内容，去掉首尾空白
  - frontmatter 定界符：`^---\r?\n ... \r?\n---(?:\r?\n|$)`，允许 CRLF
  - `whenToUse` 存在但为空串 → 视同未提供
  - `user-invocable` 字段解析出来了但 candidate 里恒 false（**这是原行为，不是 bug**）
  - `get()` 返回的 summary 里不含 rank 和 locator；content 是重新读盘的最新正文（不是 list 时缓存的）
- **证据**：I:79-147

---

## 四、待录 golden 清单

| case | 覆盖点 |
|---|---|
| `isBundledPath` / 容器内、容器外、不在 assets 下 | 三分支 |
| `resourceExists` / 记录存在、缺失、容器损坏 | 含异常吞掉 |
| `readResourceFile` / 文件、目录、非 UTF-8、磁盘回退 | 四分支 |
| `listResourceDirectory` / 正常、文件当目录、非法 entry、非法 JSON | 四分支 |
| `buildResourceStore` / 正常构建、output 存在、符号链接、超大文件 | 四分支 + 返回的 count |
| `apply` / SKILL.md 正常、缺 frontmatter、缺 description、CRLF、user-invocable=true | 五分支 |

---

## 五、评审检查表（P0.7 用）

- [ ] 七段格式齐全（签名/参数/返回/错误文本/副作用/边界/证据）
- [ ] 错误文本逐字，无"报错"这类概括
- [ ] 没有出现"先 X 再 Y"这类实现描述
- [ ] 冻结契约单独列出，未混入行为描述
- [ ] 边界覆盖空/超长/越权/不存在/并发/编码
- [ ] 找一名没看过 src 的人读一遍，能复述出至少 4 个 API 的行为
