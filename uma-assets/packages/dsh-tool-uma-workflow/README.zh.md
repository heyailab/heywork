---
description: "面向模型的 `.uma/` 交付工件工具：写入与读取控制文档，并报告缺失章节或占位符标记。"
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-uma-workflow

[English](README.md) | 中文

## 概述

使用 `uma_artifact_write` 与 `uma_artifact_read`，在 Session 工作目录的 `.uma/` 下维护研究、PRD、架构、UI/UX、规格、预览、QA 和交付文档。

写入使用 `ctx.fs`、`fs/write-intent` waterfall 和调用会话的沙箱策略：允许已授权的工作区写入，只读会话仍被拒绝，权限不会扩大。工具通过 `@deepseek-ai/dsh-util-uma-delivery` 添加 frontmatter、验证必需章节并报告占位符，与 Web 交付工作台共用就绪检查和阻塞规则。

## 目录

- [使用本包](#use-this-package)
- [模型体验](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用

在 Agent 预设中与工具、文件系统和工作目录服务一起挂载：

```yaml
- id: tool-uma-workflow
  name: '@deepseek-ai/dsh-tool-uma-workflow'
```

### 工具

| 工具 | 用途 |
|---|---|
| `uma_artifact_write` | 写入 `.uma/<artifact>.md`，含状态、负责人、章节检查与占位符警告 |
| `uma_artifact_read` | 读取当前工作区中的一份工件 |
| `uma_gate_status` | 报告缺失或未就绪的必需工件，以及阻塞交付的原因 |

`uma_gate_status` 接受 `depth`（`patch`、`feature`、`product`）和 `phase`（`documents`、`delivery`），省略时保持完整产品交付检查。确认产品文档时使用 `depth: product, phase: documents`，后续实现与 QA 工件不阻塞此阶段。小修复可以在没有 `.uma/` 目录时通过文档检查；这不代表测试执行、用户批准或部署成功。

只有当该工件类型的全部必需章节都存在，且不残留 `TODO`、`TBD`、`FIXME`、`XXX` 或 `Lorem ipsum` 标记时，写入结果才报告 `ready: true`。草稿仍可写入；模型决定是否在确认门禁前解决发现的问题。

| 工件 | 必需章节检查 |
|---|---|
| `research` | 发现、待定问题 |
| `prd` | 目标、验收 |
| `architecture` | 组件、数据、接口 |
| `uiux` | 令牌、状态、响应式 |
| `spec` | 任务、验收 |
| `preview` | 预览 |
| `qa` | 门禁/结果 |
| `delivery` | 交付 |

英文与常见中文标题都能满足检查。

<a id="model-experience"></a>
## 模型体验

### 交付工件工具

#### 模型看到什么

模型看到 `uma_artifact_write`、`uma_artifact_read` 与 `uma_gate_status`。写入返回含缺失章节与占位符警告的就绪报告；读取返回工件正文；门禁工具返回缺失或未就绪的必需工件。

#### Token 影响

工具 schema 是静态的。写入结果是紧凑报告；工件正文保留在工作区，只在模型读取时进入请求。

#### KV Cache 影响

工具 schema 静态且前缀稳定。工件内容位于工作区，只在读取时追加到 Session 日志。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 章节检查是关键词启发式，不是完整的文档 schema。
- 除 frontmatter 时间戳外，工具不对工件做版本管理；历史由 Git 负责。
- 写入会替换整份工件；定向修改使用普通文件工具。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

工件顺序与必需章节启发式由交付工作台页面同步呈现；契约变化时请一并更新 `delivery-catalog.ts`。

</details>
