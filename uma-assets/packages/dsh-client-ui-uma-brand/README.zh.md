---
description: "侧边栏与对话欢迎区的优码云正式标识素材及可配置产品名称。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-uma-brand

[English](README.md) | 中文

## 概述

Web 应用在展开侧边栏中使用 UMA Studio 字标，在收起栏和对话欢迎区使用其云形标志。字标保留透明 SVG 的原始比例，侧栏显示尺寸为 156 × 26 px；浅色与深色配色选择主标和反白标。部署仍可使用母品牌优码云标识或自定义的可见产品名称。

## 目录

- [使用本包](#use-this-package)
- [实现说明](#understand-the-implementation)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

Web 组合包以产品名称挂载此插件：

```yaml
- id: ui-uma-brand
  name: '@deepseek-ai/dsh-client-ui-uma-brand'
  config:
    name: UMA Studio
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `name` | `UMA Studio` | `UMA Studio` 选择产品 SVG；`优码云` 保留母品牌标识，其他名称显示在云形标志旁 |

本包通过 `./assets/*` 发布引用的 SVG 与 PNG 文件，客户端构建将其输出到 `lib/assets`；打包分发时须保留该目录。Studio SVG 包含矢量路径，不嵌入位图，也不依赖字体。会话首页图标使用请求尺寸的 1.4 倍（标准 34px 插槽对应 48px），保持原始比例，与标语的总间距为 12px。

<a id="understand-the-implementation"></a>
## 实现说明

<details>
<summary>实现细节 — 点击展开</summary>

插件在 `sidebar.brand.identity` 注册完整展开标识，同时注册独立的后备标志/名称和欢迎区标志。优先级 `-1` 使此部署标识与官方默认贡献共存时被选中。slot 注入与注册释放遵循声明外壳的生命周期。

私有的 `src/client/uma-brand.css` 拥有黑灰调色板、主标/反白标显示别名和半透明银雾输入框材质，包含两种调色板及减少透明度的选择器。插件注入 `theme`，在 `ctx.effect` 内通过 `ctx.theme.overrideStylesheet` 注册完整样式；主题展示层将其放在 `design-platform.css` 之后、`focus.css` 之前。卸载和 HMR 会移除覆盖层，恢复底层调色板。焦点环在浅色模式下为 `#505257`，深色模式下为 `#C3CBD7`。组件通过 `object-fit: contain` 保留原始素材，不因图像生成标签、工具或 Session 记录。

</details>

-----

<a id="model-experience"></a>
## 模型体验

### 仅展示

#### 模型可见内容

无。浏览器品牌展示使用 `sidebar.brand.identity`、`sidebar.brand.mark`、`sidebar.brand.name` 与 `conversation.hero.brand.mark`，不提供工具、提示词片段或 Session 事件。

#### Token 影响

无；素材与产品名称仅用于浏览器展示。

#### KV Cache 影响

无；本包既不组装也不发送模型请求。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- 桌面安装包图标与原生欢迎窗口品牌由其他模块负责。
- `UMA Studio` 与 `优码云` 以外的名称使用云形标志旁的文字。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

无。

</details>
