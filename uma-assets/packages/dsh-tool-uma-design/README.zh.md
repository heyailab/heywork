---
description: "原生工具：检查项目设计输入，检索带来源的 UI 规则，并读取内置设计参考。"
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-uma-design

[English](README.md) | 中文

## 概述

先依据项目已有品牌、设计文件和声明的前端技术栈进行 UI 修改，再选择灵感参考。读取准确且有界的设计输入，延续持久化设计项目；从完整的内置设计系统与 DESIGN.md 参考目录中选择合适系统。用户明确选择、复制的设计提示词和自然语言风格描述优先；未指定时由 Agent 根据产品、受众、信息密度和已有品牌自行选择。选择记录到 DESIGN.md，在保留项目已确认规则的前提下跨页面复用。

## 目录

- [使用本包](#use-this-package)
- [模型体验](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用

自动设计成员遵循用户明确的单人执行或不启动成员要求。其他分句中的否定要求（例如不修改接口）不会取消明确启动设计师的要求。团队模式和计划模式限制继续生效；当前会话内仍可进行只读设计准备。

`design_project_create` 除项目标识外，要求提交针对当前项目编写的 `design`、`tokens` 与 `components`。它不把内部参考文件复制到工作区；完整参考文件的复制会被拒绝，公开项目元数据不包含内部参考标识，普通工具展示仅显示项目标识。只有显式指定覆盖时才替换已有项目文件。

设计项目写入使用调用会话的沙箱策略和已有写入意图检查。工作区可写会话可以创建所选项目文件，只读会话不能写入；不会自动提升权限。

在 Agent 预设中与工具注册表一起挂载：

```yaml
- id: tool-uma-design
  name: '@deepseek-ai/dsh-tool-uma-design'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `projectWrite` | `true` | 是否暴露设计项目创建；`false` 保留参考与检查工具，不提供工作区脚手架写入 |
| `assetRoot` | `dsh-skill-uma` 包资产 | 包含 `uma-design-systems/` 与 `uma-design-md/` 的绝对路径 |
| `contextFileBytes` | `32768` | 每个项目设计输入的最大字节数 |
| `contextTotalBytes` | `98304` | 一次设计上下文结果的总字节上限 |
| `ruleMaxResults` | `10` | 每次检索返回的完整规则记录上限 |
| `previewMaxBytes` | `262144` | 完整原型源码的字节上限 |
| `catalogMaxPageSize` | `100` | 显式请求的设计目录分页大小上限 |

`design_asset_list` 支持可选的 `query`、`category`、`offset` 和 `limit`。搜索包含规范 id、显示名称和别名。结果包含匹配总量 `total`、分页起点 `offset`，以及存在下一页时的 `nextOffset`。省略分页大小时仍返回完整的匹配目录。大型资源库应使用搜索或有界分页；每个返回的 id 均可通过 `design_asset_get` 读取。

### 工具

| 工具 | 用途 |
|---|---|
| `design_preview` | 把实际保存的 HTML 快照写入有界展示元数据，静态预览不代表运行验收 |
| `design_rule_search` | 检索完整 UX、视觉与技术栈规则，保留来源记录序号 |
| `design_context` | 只读项目规则、令牌、声明的技术栈与输入哈希，不写入文件 |
| `design_asset_list` | 列出系统类别、用途与参考名称 |
| `design_project_create` | 基于内置系统在 `.design/<project>/` 中生成契约 |
| `design_project_status` | 列出设计项目或报告某个项目的契约文件 |
| `design_asset_get` | 读取一个资产的 `DESIGN.md`、令牌与可选组件标记 |
| `uma_knowledge_search` | 检索角色方法、反模板规则、质量清单、模板与工艺参考 |

`design_rule_search` 通过本地资源库读取已安装的 UI/UX 规则，不启动 Python 或另一套 Agent。它采用 BM25 和支持的中文查询扩展，未匹配查询不返回推荐。技术栈标识只允许已安装 CSV 名称。返回记录保留完整字段与代码示例，记录序号把表头计为一；多行 CSV 的记录序号不等于物理行号。资料是本地参考，不是已经验证仍最新的上游文档。

`design_context` 从执行目录、明确的相对多包目标目录和可选的 `.design/<project>/` 读取固定设计文件。它还读取 `design-system/MASTER.md`，以及明确指定项目及页面时的 `design-system/<project>/MASTER.md` 和页面覆盖文件。缺失文件会被报告；超限、非普通文件和预算省略会使结果标为不完整。无效 JSON、目录符号链接、规范路径越界、二进制数据和读取期间变化会明确失败。框架名称来自依赖声明，不代表已验证安装的组件。指纹只覆盖这些设计输入，不覆盖全部实现文件。

插件在挂载处加入稳定的设计流程系统提示段。已确认品牌与现有组件优先于内置灵感。正式修改使用现有框架；单文件 HTML 需要明确的原型请求。视觉与交互验收仍要求实际渲染证据。

`design_asset_get` 只接受加载时发现的名称和固定的资产文件名。读取受单文件与单次调用上限约束；被截断的文件会在结果中标注。`files[].path` 和输出标题使用 `uma-design://systems/<名称>/<文件>` 或 `uma-design://brands/<名称>/<文件>` 虚拟引用，不包含安装目录。知识检索结果使用 `uma-knowledge://` 引用。这些标识不是文件系统路径，内容通过设计工具读取。模型指引要求解释风格选择，不引用内部资源标识。用户项目文件保留正常路径。

公开目录读取的展示元数据包含风格名称、实际读取的文件类型及截断状态。自定义资产根目录及内部 Markdown 参考不提供公开名称。项目设计工具在 `.design/<project>/` 写入为当前项目编写的设计规范、令牌和组件。

内置标准、PTC 与 UMA 设计预设挂载 `@deepseek-ai/dsh-tool-uma-design/automatic`，关闭自动意图检测和设计师调度。Agent 判断意图后调用 `design_begin`，读取工作区并加载适用的工艺、简报、模式和走查方法；调用 `design_stop` 可离开设计工作。后续选择与选定项目通过 Session 投影恢复。自定义配置可通过 `autoDetect` 开启有界意图检测；同时开启检测、`teamDesign` 和团队模式时，明确的 UI 实现请求可在当前模型路由启动一位具名的只读设计成员。计划模式跳过该委派。

### 自动准备

`@deepseek-ai/dsh-tool-uma-design/automatic` 使用独立配置：`autoDetect` 默认 `true`，`fileBytes` 为 `16384`，`projectBytes` 为 `24576`，`contextBytes` 为 `65536`，`candidateLimit` 为 `3`。可选 `assetRoot` 必须是绝对路径，默认使用包内资产。必需方法缺失或禁用时，准备会在依赖的实现动作之前失败；取消和卸载会等待所属读取结束。明确 UI 请求、后续选择与语义触发 `design_begin` 共用同一个 Session，运行上下文消息不替换人的任务。实际参考由 Agent 选择，运行时不强制某个品牌，也不保证审美结果。

新建或重设计界面时，自动准备要求 Agent 应用选定的布局和组件模式，视觉验收结论与功能检查分开记录。团队设计师交接版式、内容及素材需求，并说明具体需要核查的视觉结果。

`uma_resource_read` 通过技能名称和相对路径读取安装资源。省略 `path` 可浏览目录；文本使用返回的字节偏移量续读，目录使用条目偏移量翻页。`resourceMaxBytes` 默认为 32768，限制完整渲染结果的字节数。绝对路径、上级目录跳转、逃逸符号链接及非 UTF-8 内容会被拒绝，错误不返回实际安装路径。技能提供器、这些工具与自动设计准备应配置相同的 `assetRoot`。设计资源输出的总预算同样按 UTF-8 字节计算，包含标题及截断提示。

<a id="model-experience"></a>
## 模型体验

### 设计资产工具

#### 模型看到什么

模型看到启用时的自动任务上下文、原生设计流程系统提示段、`design_begin`、`design_stop`、`design_preview`、`design_context`、`design_rule_search`、`design_asset_list`、`design_asset_get`、`design_project_create`、`design_project_status` 与 `uma_knowledge_search`。列表工具返回系统名称、类别、用途与参考名称；读取工具返回请求的 DESIGN.md、令牌与可选组件标记；知识工具返回内置交付与设计参考中排序后的章节。 内置知识检索优先匹配完整短语和不同的相关词，对重复词只计一次。检索统一全半角字符，可使用中文短语查找本地术语和交接方法。

#### Token 影响

提示段和工具 schema 是静态的。自动准备通过普通运行上下文消息记录。预览 HTML 保存在有界且可重放的展示元数据中，模型收到路径和摘要。项目上下文作为工具输出记录，带有准确文件哈希与明确省略说明。资产结果只携带请求的资产文件，并受单文件与单次调用上限约束；被截断的文件会在结果中标注。

#### KV Cache 影响

工具 schema 静态且前缀稳定。工具结果随请求变化，并作为普通工具输出追加到 Session 日志。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 资产在包安装时固定；工具不监听变化。
- 品牌系统描述第三方视觉身份，是结构参考而非商标许可。
- 组件标记以源文本返回；工具不渲染也不校验它。
- 上下文检查不会运行浏览器、执行交互、证明组件库接入或保证视觉质量。REVIEW.md 必须记录实际证据与未验证工作。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

默认资产根通过已安装的 `dsh-skill-uma` 包解析；显式 `assetRoot` 必须同时包含 `uma-design-systems/` 与 `uma-design-md/`。

</details>
