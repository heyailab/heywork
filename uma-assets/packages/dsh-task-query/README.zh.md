---
description: "为知识检索插件提供可恢复、有界的任务及追加指令查询。"
kind: "package-reference"
---

# @deepseek-ai/dsh-task-query

[English](README.md) | 中文

## 概述

在重启、分支继续或插件替换后，仍为知识检索保留当前任务。服务预览新认领输入时不修改已保存状态，随后通过 Session 投影恢复已提交的任务及追加指令。代码 Wiki 与文档知识共用同一查询所有者。

用户和定时输入建立当前任务。智能体消息及历史团队消息追加最新交接检索提示，同时保留原任务。注入的参考资料不会成为新的检索请求。版本 3 的投影从日志事件重建旧缓存。


## 目录

- [使用本包](#use-this-package)
- [实现说明](#understand-the-implementation)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----
<a id="use-this-package"></a>
## 使用本包

与 `sessionProjections` 一起挂载。检索插件注入 `taskQuery`，在 pre-step 钩子中调用 `current(session, claimed)`，得到有界的首次任务和最新追加指令。固定提示格式每个字段最多保留 4,000 个 UTF-16 单元，返回值也最多为 4,000；截断不会拆开代理对。它用于检索，不代替完整用户提示词。

<a id="understand-the-implementation"></a>
## 实现说明

<details>
<summary>实现细节 — 点击展开</summary>

私有、仅 Host 使用的 Session 投影保存查询提示。用户和定时任务消息更新提示，运行时上下文与其他参考消息不更新。新的 turn 位置将下一个真实任务标为替换输入，同时为没有新用户文本的驱动继续保留提示。认领输入只在临时预览中折叠，pre-step 被拒绝时不会覆盖已保存提示。注册由服务 fiber 管理，消费者读取服务，不读取投影句柄或任意历史事件。

</details>

运行上下文或技能目录的替换不代表人的检索任务被替换。只有已接纳的任务来源能更新或替换恢复后的查询，刷新上下文快照不能清除任务。

<a id="model-experience"></a>
## 模型体验

### 检索提示

#### 模型可见内容

`taskQuery.current(session, claimed)` 为已挂载的检索插件选择查询。本服务不增加提示词或工具，来源明确的模型上下文由各检索插件负责。

#### Token 影响

查询服务不请求模型，有界检查点不随会话长度增长。

#### KV Cache 影响

没有直接影响；检索插件负责更新日志中的运行时上下文快照。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- 查询窗口不保留中间追加指令或长提示词的全部细节，原始用户消息仍保存在 Session 日志中。

<a id="dev-note"></a>
### 开发备注

无。
