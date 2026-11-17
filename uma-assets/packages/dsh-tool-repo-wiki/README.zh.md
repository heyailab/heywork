---
description: "通过正常记录的 Agent 任务生成和检索有源码依据的仓库 Wiki 版本。"
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-repo-wiki

[English](README.md) | 中文

## 概述

从真实仓库文件生成文档目录和知识卡片，在任务间保留进度，并在实现变化后更新关联页面。源码引用必须匹配当前哈希与行范围。知识可导入导出，便于通过 Git 分享。只读上下文入口仅在允许引用时为普通任务提供相关且有效的知识。生成使用已配置模型及其正常额度。

## 目录

- [使用本包](#use-this-package)
- [实现说明](#understand-the-implementation)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

上下文插件提供 `hey_wiki_lookup`，按任务查阅当前分支经源文件验证的 Wiki 信息。HEY 预设设置 `automaticContext: false`，由模型调用此工具查阅。

Web 组合包在 `repo-wiki` Agent 预设中挂载生成工具，在普通开发预设中挂载 `@deepseek-ai/dsh-tool-repo-wiki/context`。在应用内打开**项目 Wiki**，选择工作区和语言后生成。

```yaml
- id: tool-repo-wiki
  name: '@deepseek-ai/dsh-tool-repo-wiki'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `maxFiles` | 50000 | 候选源码文件数上限 |
| `maxFileBytes` | 524288 | 单个源码文件字节上限 |
| `maxScanBytes` | 134217728 | 完整扫描的累计字节上限 |
| `maxPageBytes` | 131072 | 文档字节上限 |
| `maxRecordBytes` | 33554432 | 索引、检查点和导入导出的字节上限 |
| `maxPages` | 200 | 计划文档数上限 |
| `gitTimeoutMs` | 30000 | 只读 Git 命令截止时间 |
| `gitOutputMaxBytes` | 8388608 | 完整 Git 输出上限 |
| `gitExecutable` | `git` | 执行环境中的 Git 程序 |
| `allowUncitedPageReads` | `false` | 关闭引用后是否允许明确的维护操作读取文档 |
| `contextMaxBytes` | 16384 | 普通任务知识上下文字节上限 |
| `maxFreshnessFiles` | 256 | 每次检索可校验的潜在变更源码数 |
| `searchLimit` | 8 | 相关性排序结果数 |
| `maxSnippetChars` | 2000 | 检索片段字符上限 |
| `maxPlanBytes` | 32768 | 读者自定义 YAML 计划字节上限 |
| `sourceWindowMaxBytes` | 32768 | 单次模型可见源码窗口字节上限 |
| `catalogRetries` | 5 | 目录比较交换的有界重试次数 |
| `excludeDirectories` | See `Config` | 源码目录排除项见 `Config`；敏感文件排除规则始终生效 |

项目可通过 `.hey/wiki/wiki_plan.yaml` 指定 `version: 1`、`repowiki.template`、读者 `notes`、文档的 `title`/`goal`/`parent`/`hints`/`template`，以及 `knowledgecard.notes`。解析器只接受数据型 YAML，拒绝可执行标签。

中断后从记录的生成会话继续。明确的接管操作可转移已停止或不可用的写入者，但会拒绝接管本机正在运行的任务。发布失败时保留已提交检查点，可能留下未引用的不可变内容。手动改动内容寻址文件后，应先恢复该文件或导入有效导出包，再继续。

<a id="understand-the-implementation"></a>
## 实现说明

<details>
<summary>实现细节 — 点击展开</summary>

索引器遵循 Git 忽略规则，跳过已知敏感文件名，并读取有界 UTF-8 源码；保存哈希和相对路径与工作区包导入关系，不复制源码文本。计划记录文档依赖，源码读取返回准确引用。`wiki_write_page` 先发布不可变 Markdown，再通过比较交换替换检查点；`wiki_finish` 在标记就绪前重新核对源码指纹。分支和语言使用独立检查点。

工作区预览在读源码前核对目录中的版本、已发布文章、完整引用及源码索引。文件内容改变、文件消失或移出 Git 可索引列表时，预览报告引用已过期，不返回源码文本。Wiki 记录与生成文件的实际路径必须位于 `.hey/wiki/` 目录内。

上下文入口校验变更路径，也覆盖生成时已有、之后被还原的未提交文件，并排除受传递依赖变化影响的知识。相关事实通过现有持久化运行时上下文机制进入模型。检索失败会提供明确的不可用提示，不注入未经校验的事实，也不阻塞无关代码工作。

</details>

<a id="model-experience"></a>
## 模型体验

### 仓库知识工具

#### 模型可见内容

专用预设提供 `wiki_status`、`wiki_inventory`、`wiki_read_source`、`wiki_plan`、`wiki_write_page`、`wiki_read_page`、`wiki_search`、`wiki_finish`、`wiki_export` 和 `wiki_import`。普通预设保留原有工具目录，仅在存在已启用版本时接收相关且通过源码校验的知识。

#### Token 影响

生成通过已记录的工具结果发送选定源码窗口。普通知识上下文受 `contextMaxBytes` 限制；本插件不整体上传仓库源码。

#### KV Cache 影响

生成预设使用稳定工具定义；知识变化会更新 user 角色的运行时上下文快照。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- 检索基于词项而非向量嵌入；相对路径与工作区包 ECMAScript 导入关系补充显式文档依赖。
- 行范围与哈希校验确认引用对象，不等于验证每一句生成内容的语义真实性。
- 源码变化的自动调度由客户端插件负责；不提供云端团队发布。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

无。

</details>
