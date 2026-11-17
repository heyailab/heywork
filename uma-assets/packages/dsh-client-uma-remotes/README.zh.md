---
description: "HEY 自有的浏览器 Remote 组合，连接知识库、编码证据和项目 Wiki。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-uma-remotes

[English](README.md) | 中文

## 概述

HEY 知识库、交付和 Wiki 页面通过此浏览器组合调用对应 Host 服务。它将产品专用 Remote 定义从通用内核组合中分离，同时保持现有命名空间名称及方法行为。

## 目录

- [使用此包](#use-this-package)
- [生命周期](#lifecycle)
- [模型体验](#model-experience)
- [已知限制与待办工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

<a id="use-this-package"></a>
## 使用此包

HEY Web bundle 在通用 API 组合之后挂载此包。HEY 页面声明对此 Client 模块的依赖，并导入其客户端类型入口。HEY base bundle 提供对应 Host 服务；挂载此 Client 组合不会创建 Host 服务或授予权限。

```yaml
- id: hey-remotes
  name: '@deepseek-ai/dsh-client-uma-remotes'
```

没有配置字段。所选命名空间为 `knowledge`、`codingWorkbench` 和 `projectWiki`。定义仍以所属包生成的接口为准，此处不复制方法或消息字段。

<a id="lifecycle"></a>
## 生命周期

通过现有 Gateway 挂载接口。激活失败时撤销先前已挂载的接口。卸载按相反顺序等待全部清理操作；某项清理失败后仍继续其他清理，并报告汇总错误。后续激活可重新挂载同一组命名空间。Host 鉴权、取消和消息校验继续由现有模块负责。

<a id="model-experience"></a>
## 模型体验

### 浏览器请求

#### 模型可见内容

`knowledge`、`codingWorkbench` 和 `projectWiki` 浏览器 Remote 命名空间不添加工具、提示词或 Session 事件。

#### Token 影响

浏览器组合不消耗模型 Token；被调用的 Host 能力负责其模型请求。

#### KV Cache 影响

没有直接影响；被触发的模型可见行为由对应 Host 能力负责。

## 已知限制与待办工作

<a id="known-limitations-and-deferred-work"></a>

- 自定义产品配置必须同时挂载匹配的 Host 提供器和此 Client 组合。
- 此次分离不将私有设计资源迁移到服务端，也不改变资源分发策略。

<a id="dev-note"></a>
### 开发备注

无。
