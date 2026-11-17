---
description: "HEY 会话财务预算展示与账号自助管理。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-uma-task-budget

[English](README.md) | 中文

## 概述

HEY Web 组合仅在任务预算拒绝提示中提供预算恢复入口，会话顶部不显示预算按钮。面板读取已认证的 Host 服务，展示已结算消费、预留金额、共享根会话与运营暂停原因，并使用读取时的版本更新当前账号拥有的上限和状态。

## 目录

- [使用此包](#use-this-package)
- [模型体验](#model-experience)
- [已知限制与待完善事项](#known-limitations-and-deferred-work)

<a id="use-this-package"></a>
## 使用此包

[HEY Web 组合](../../bundle/hey-web/cordis.patch.yml)加载该插件。插件自行挂载并释放生成的 `hey-budget` Remote 命名空间，普通内核 Web 配置不会引入 HEY 商业依赖。[Host 预算服务](../../credentials/hey-task-budget/README.zh.md)负责账号授权、根会话解析及财务受理。

金额全程保留为最多六位小数的 CNY 十进制字符串，明确使用 null 表示不额外限制任务金额。版本冲突会刷新当前服务端数据，同时保留用户输入供核对，不会自动重复提交更新。关闭面板或切换账号会取消待完成操作，移除旧账号数据。暂停或关闭阻止新的受理，已经受理的调用仍可结算。预算错误入口打开同一编辑器，不重放推理，不以充值代替调整预算，也不退出新账号。

界面复用现有 Button、Modal、焦点管理、主题令牌和中英文字典，其余应用语言使用完整英文回退。当前账号可用并拥有 Remote 读取权限时才显示拒绝提示中的恢复入口。

<a id="model-experience"></a>
## 模型体验

### 仅展示

#### 模型看到什么

无。用户通过错误提示中的恢复入口调用 `hey-budget/read` 和 `hey-budget/update`。面板不添加模型消息、工具、提示词章节或会话事件，财务受理仍由 Host 与服务端负责。

#### Token 影响

无。界面读取及元数据更新不调用模型。

#### KV Cache 影响

无。该包不组装供应商请求。

<a id="known-limitations-and-deferred-work"></a>
## 已知限制与待完善事项

- 面板在打开、版本冲突后或用户明确刷新时读取数据，不声称持续推送变化中的消费总额。运营暂停与账号自助暂停分开记录，修改任务上限不能解除运营暂停。

### 开发备注

组件测试覆盖十进制精确传输、冲突输入保留、错误恢复、取消、共享预算及账号变化。浏览器模块组合测试使用真实生成的 Remote 与插槽注册，验证卸载和重新加载的释放行为，仅替换 RPC 响应及不可确定的外部账号状态。
