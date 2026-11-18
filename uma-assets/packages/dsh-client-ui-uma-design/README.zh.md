---
description: "design_asset_list 与 design_asset_get 工具的 Web 卡片：系统标签、令牌色板、字体预览，不提供参考文档打开操作。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-uma-design

[English](README.md) | 中文

## 概述

在会话记录中持续显示设计、知识库、Wiki 和开发经验操作卡片。读取 UMA Design 公开目录时展示风格名称和实际读取的资料类型，私有名称、查询词和资料正文不进入卡片。项目设计、工件和预览卡片保留用户自己的产出及就绪状态。

## 目录

- [使用本包](#use-this-package)
- [模型体验](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用

资源回执来自已有工具调用、结果和经验检索消息，显示在折叠工作详情之外，重新打开历史仍可恢复。展开可看操作、时间及结果。成功读取公开参考时附带展示摘要，历史结果缺少摘要时仍显示通用回执。回执归属于实际执行操作的会话，因此团队交接时项目总监会在主会话读取已确认的目录参考。

在 Web 组合中与其他客户端 Tool 视图一起挂载：

```yaml
- id: ui-uma-design
  name: '@deepseek-ai/dsh-client-ui-uma-design'
```

插件内置八种客户端语言的词典。它只读取工具结果文本，不新增 Session 事件或 Host API。

`design_preview` 从实际保存的源码读取有界且带标记的 HTML 展示元数据，使用共享静态清理器和严格网络策略，在不执行脚本的不透明框架中展示。路径与摘要标识该快照，不代表构建、交互测试或部署。前端入口在原会话追加草稿，保留实际执行目录；工作区归属丢失或元数据无效时明确显示，不改用其他项目。大目录在工具卡片的基础表面内部滚动。标签与源码预览使用共享标签和代码材质；预览操作保留共享键盘焦点环。

<a id="model-experience"></a>
## 模型体验

### 仅展示

#### 模型看到什么

无。卡片渲染已记录的 `design_asset_list`、`design_asset_get`、`uma_artifact_write` 与 `uma_gate_status` 工具结果，不注册工具、提示词段落或 Session 事件。

#### Token 影响

无；卡片不构造模型输入，也不改变请求 token。

#### KV Cache 影响

无；该包不组装或发送模型请求。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 颜色提取识别 CSS 自定义属性中的直接 hex、rgb 与 hsl 值；`var()` 与 `color-mix()` 会被跳过而不解析。
- 公开参考卡片展示读取状态。项目工件可正常打开，视觉验收需要渲染证据。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

工具结果文本是唯一来源；卡片不会因为字段缺失而推断成功。`card-text.ts` 负责两类卡片共享的解析逻辑。

</details>
