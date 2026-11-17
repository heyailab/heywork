---
description: "为 HEY 会话与委派代理提供自有财务任务预算。"
kind: "package-reference"
---

# @deepseek-ai/dsh-uma-task-budget

[English](README.md) | 中文

## 概述

这个 HEY 私有 Host 服务把记录中的根会话及其委派子会话关联到同一个服务端财务预算，提供不含凭据的预算操作，并为托管模型请求准备准入标头。冻结、消费、版本冲突与暂停状态均由服务端裁定。重新打开会话会保留原有额度与累计消费。

## 目录

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="use-this-package"></a>
## Use this package

HEY base 在 `storageDomain`、`sessionQuery` 和 `typert` 就绪后挂载此服务。可选的登录账号提供 UI 所用的服务端地址。托管原生协议和 Pi-AI 传输通过 HEY 配置开启预算准入；独立配置的供应商保留现有行为。`prepare()` 接收真实本地会话、已经捕获的服务端地址和凭据，以及请求取消信号。预算元数据读取失败会阻止模型请求发出。这个服务及其传输钩子都不会重试推理。

生成的 `remote['hey-budget']` 外观提供 `read` 和 `update`。更新必须携带读取到的版本号、CNY 十进制字符串额度或 `null`，以及目标状态。`null` 表示不增加会话消费上限，账号余额和 API 密钥额度仍然生效。暂停预算不会释放已受理请求的冻结金额，这些请求仍可完成结算。

<a id="understand-the-implementation"></a>
## Understand the implementation

`uma_session_budgets` 数据域从版本 1 开始，全局初值为 `{ installationId: null }`，没有数据表。初始化写入一个随机安装 UUID，不保存令牌、财务额度或模型用量。发给服务端的会话引用由安装 UUID 和记录中的根会话 ID 哈希生成。只追溯 `subagent` 关系，遇到循环或超出深度限制会拒绝处理。

并发子会话共享一次进行中的元数据读取。取消一个子会话只取消该调用方的等待，不影响另一个子会话。Host 卸载会取消进行中的工作并关闭数据域。元数据请求完成前后都会核对账号，因此旧请求的响应不能在替换账号登录后继续授权调用。短期绑定缓存不能替代服务端冻结检查。

`SessionBudgetView` 包含请求的 `sessionId`、记录中的 `rootSessionId`、是否为共享预算的 `shared`，以及一个 `SessionBudget`。后者包含 CNY 十进制字符串形式的额度、消费、冻结金额，以及版本、过期时间、用户与运营暂停状态。`BudgetRequest` 只属于 Host 准入数据，包括服务端地址、已经捕获的令牌、真实会话 ID 和设备/API 密钥类型，不会作为 Remote 入参或客户端显示值。

服务端使用整数货币单位与账号自有会话绑定，将冻结和额度修改串行处理，并独立执行运营暂停。HTTP 响应有大小限制，不跟随重定向，凭据只存在 Host 请求状态中。参见 [HTTP 与所有权测试](tests/budget-ownership.spec.ts)。

<a id="further-exploration"></a>
## Further Exploration

- [预算 UI](../../client/ui-hey-task-budget/README.zh.md)
- [服务端预算实现](../../../apps/hey-platform-go/internal/ledger/session_budgets.go)
- [原生推理集成](../../llm/llm-deepseek-account/src/managed-request.ts)

<a id="model-experience"></a>
## Model Experience

### Financial admission metadata

#### 模型所见

预算是独立于编程团队任务编号和模型提示词的财务准入约束。委派代理不能仅通过启动新的子会话获得更多消费能力。`X-HEY-Task-ID` 和凭据属于传输元数据，不会加入模型上下文。

#### Token 影响

本服务不增加提示 Token，也不改变响应 Token 计数。已发布的模型限制与服务端冻结策略决定一个请求能否被受理。

#### KV Cache 影响

读取预算和调整额度不会追加模型上下文，因此不会使提示前缀失效。消费者仍拥有模型请求与缓存策略。

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- 暂停前已经受理的请求仍可能产生经过验证的费用。此服务不提供自动退款、取消成功保证或离线余额。客户端开启必需准入前，必须先部署元数据接口。独立的新根会话使用新预算；账号和 API 密钥限制继续跨根会话生效。

<a id="dev-note"></a>
### 开发备注

修改此契约后，应运行 Host 所有权测试、真实 PostgreSQL 会话预算测试和托管传输回归测试。Typert 外观必须从源码声明生成，不要手改生成签名。
