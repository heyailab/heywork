---
description: "UMA 浏览器模块、产品预设以及 standard/PTC 的增量能力。"
kind: "package-bundle"
---

# @deepseek-ai/dsh-uma-web

[English](README.md) | 中文

## 概述

此私有 bundle 为内核 Web 应用添加 UMA 浏览器页面和 standard/PTC 增量能力。共享产品预设归 UMA base 所有，在无浏览器环境下仍可使用。UMA Web 与 Desktop 显式选择此层，普通内核 Web 配置不选择它。

## 目录

- [使用此包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [模型体验](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用此包

产品配置依次包含内核 base、内核 Web 应用、UMA base 与此 bundle。通过 `dsh --profile uma-web` 启动已准备的源码配置；桌面通过其保留配置选择相同的产品层。

账号签发方与托管模型目录默认使用 `https://studio.umayun.com`。`UMA_STUDIO_API_ORIGIN` 可选择另一个规范的服务源站；使用 HTTP 回环账号接口还需设置 `UMA_STUDIO_ALLOW_LOOPBACK_HTTP=1`。账号插件会在启用前校验源站。后续配置补丁与桌面产品覆盖层仍可管理这些配置。

新安装的 UMA Web 与桌面端将默认工作区创建在解析后的 Harness home 下的 `workspaces/default-workspace`。已准备的配置若显式设置 `DSH_HOME`，该目录就位于所选 home 内。已有工作区登记与会话路径保持不变，详见[默认工作区迁移](../../../docs/upgrade-guide/v0.2.2-rc.1/uma-default-workspace/guide.zh.md)。

产品层选择 UMA 浏览器授权、已发布模型和四种托管协议路由；此装配关闭 DeepSeek 直连凭据、上游产品遥测、官方品牌及供应商编辑页面。内核 Web 配置保持独立。已有 DeepSeek 授权不能用于 UMA 请求，详见[账号迁移](../../../docs/upgrade-guide/v0.2.2-rc.1/uma-web-managed-account/guide.zh.md)。

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节 — 点击展开</summary>

补丁声明知识、设计、交付、仓库 Wiki 与 UMA 品牌模块。预设文件保留 UMA 设计、办公、团队、Wiki、作者与审查者身份。浏览器工具与页面的行为仍由各自包负责。

[补丁声明](cordis.patch.yml)与 `package.json` 共同维护生产依赖。所有产品包保持私有，并随本地发行版提供。

</details>

<a id="model-experience"></a>
## 模型体验

### 组合能力

#### 模型看到什么

通过所挂载的 `coding_inspect`、`coding_check` 工具与 `standard` 预设间接影响模型；各插件包拥有其工具 schema 与上下文文本。此 bundle 不发起模型请求。

#### Token 影响

取决于所选 Agent 装配；工具和上下文的上限由对应插件包定义。

#### KV 缓存影响

bundle、预设或配置的更改可能替换请求前缀中的工具和上下文。提供商缓存的可用性与淘汰不属于此 bundle 的保证。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 此层需要 Web 传输和 UMA Host 服务。办公预设保留桌面可用性规则。此层不适用于无界面或 SDK 配置。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

内核配置模板与可选 bundle 列表由上游维护；UMA 配置显式选择产品层。

</details>
