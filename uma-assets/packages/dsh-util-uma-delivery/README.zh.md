---
description: "纯 Uma 交付工件契约：工件种类、必需集合、frontmatter/正文解析、章节与占位符检查、门禁阻塞及有来源的编码指南。"
kind: "package-reference"
---

# @deepseek-ai/dsh-util-uma-delivery

[English](README.md) | 中文

## 概述

导出 `dsh-tool-uma-workflow` 与 Web 交付工作台共用的交付工件契约。单一纯模块让 Host 门禁与客户端看板使用相同的工件种类、章节检查、占位符规则与阻塞顺序，因此看板可以直接从 `.uma/` 文件重算状态，无需 Host 工具调用或模型请求。

## 目录

- [使用本包](#use-this-package)
- [模型体验](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用

在任一平面导入契约：

```ts
import { evaluateArtifact, evaluateGate } from '@deepseek-ai/dsh-util-uma-delivery'

const content = '# Goal\nExport workspace usage.\n\n# Acceptance\nThe CSV includes each visible row.'
const evaluated = evaluateArtifact('prd', content)
const gate = evaluateGate([{ artifact: 'prd', ready: evaluated.ready }])
```

`requiredArtifacts(depth, phase)` 与 `evaluateCheckpoint` 按小修复、功能迭代、完整产品选择文档要求，并区分编码前文档与交付文档。小修复不要求流水线文档；功能迭代在编码前要求规格，交付时要求规格、QA 与交付说明；完整产品的文档确认只检查调研、PRD、架构和 UIUX，不要求后续 QA 或交付文件。这些函数只确定文档完整性，不证明命令执行、用户批准或部署。

`evaluateArtifact` 返回 frontmatter 的 `status`、`owner`、`updated`，Markdown `body`，未匹配的章节模式、占位符标记与 `ready`。`evaluateGate` 返回 `ready`、缺失的必需工件，以及按「缺失后未就绪」顺序排列的阻塞工件。

主入口同时导出 `CODING_STANDARD_SOURCES`、`CODING_STANDARD_RULES`、`BUILTIN_CODING_GUIDES` 和 `selectCodingStandards`。同一不可变目录提供 12 组官方来源、23 条条件化规则及 14 篇原创双语技术指南，并附来源/许可指针。显式语言与任务标签用于选取适用内容，不为未知栈猜测框架，通用指南可排除。项目现有约定优先于不兼容的风格偏好。选择不代表验证：已配置检查需要真实回执，仅能评审的义务需另留证据。

面向模型的 workbench 消费者把选定规则与来源元数据和发现的项目检查名称一起提供；知识库界面则通过 Host 的原子不替换笔记准入，将用户选定的指南正文存入知识库。本模块本身不读取文件、不写知识库、不改权限，也不发送提供方请求。

桌面运维共用 SSH 地址验证和只写凭据的 `OperationsVaultBridge`。向调用方返回的服务器资料包含连接信息及已验证的主机指纹。

<a id="model-experience"></a>
## 模型体验

### 无模型界面

#### 模型看到什么

本包不注册工具、提示词段落或 Session 事件。所属消费者可以通过正常工具与知识检索展示评估结果和选定编码指南；例如 `coding_inspect` 的 `mode: standards` 会读取 `selectCodingStandards` 选出的数据。目录来源、已导入指南或已选规则均不是合规认证。

#### Token 影响

纯模块不发起模型请求；下游工具与知识贡献者负责有界的模型可见结果及提供方调用。

#### KV Cache 影响

无；该包不组装或发送模型请求。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 章节检查是与 Host 工具共用的关键词启发式，不是完整的文档 schema。
- frontmatter 时间戳按原样返回；格式与时区展示由调用方负责。
- 策展规范不覆盖所有语言或组织。指南版本标识应用内原创摘要；来源核对日期不证明当前用户代码合格，也不表示获得发布方背书。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

Host 工具与交付工作台都导入本模块；在这里修改检查规则会有意同时改变两个界面。

</details>
