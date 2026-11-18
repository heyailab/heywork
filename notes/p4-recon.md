# P4 侦察结论 — UI 包的真实形态与依赖链

> 侦察日期：2026-11-18。目的是在写 spec / 重写之前，先弄清 7 个 UMA 客户端包的真实形态、依赖关系和可用素材。
> **这份文档改变了对 P4 工作量的估计**，是策略决策依据，不是 spec。

## 1. 一个反直觉的发现：Host 端极简，浏览器端才是主体

7 个客户端包都遵循 dsh 的 `dsh.client` 双半模型：

| 半边 | 文件 | 形态 | 内容 |
|---|---|---|---|
| Host（Node）端 | `lib/index.js` | **tsc 直出、带完整注释**、几行到几十行 | 几乎全是 `function apply(){}` 空实现 + `Config`/`inject`/`name` |
| 浏览器端 | `lib/client.js` | **压缩 bundle**、单行 25K–324K 字符 | 全部 UI 逻辑（React 组件、面板、按钮、交互） |

Host 端 `index.js` 注释原文（多个包一致）：
> "Pure UI plugin: the empty apply exists so the plugin appears in the host composition;
> the browser half ships via exports['./client'], discovered through the package.json dsh.client declaration."

**结论**：P4 的重写主体是浏览器端 React UI，不是 Host 端逻辑（后者几乎是空的）。

## 2. 最大的约束：核心 UI 依赖包是官方未发布的

从 7 个包的 `package.json → dsh.client.inject` 提取的依赖，涉及约 18 个官方核心 UI/API 包：

```
dsh-client-ui-layout / renderer / sidebar / primitives / workspace / chat /
conversation / tool / theme / sidebar-right / context-menu / session /
dsh-client-locale / dsh-client-resources / dsh-api-remotes /
dsh-api-workspace-controller / workspace-files / session-controller / remote-access
```

**这些包在上游开源仓库 `deepseek-harness@39163dd` 里全部不存在**（`find packages -type d` 与 `git ls-files` 双重确认）。

但它们**全部存在于 beta5 的 Mac 包里**——`app.asar` 的 `@deepseek-ai` scope 共 362 个包，其中客户端/API 相关 **77 个**，包括上述所有核心包。

**这意味着**：V1 "纯官方壳"路线在 UI 层有个硬缺口——官方 dsh 开源版连 layout/renderer/sidebar 这些基础 UI 框架都没有，无法只靠"重写 7 个 UMA 包"就拼出界面。这 77 个包和之前的 11 个一等包性质相同：官方未发布、需自备。

## 3. 可直接复用的素材

- **8 语 locale JSON**：7 个包各有 8 个 `locale/*.json`（未压缩文本），但内容只有标题级（如 `{"meta":{"title":"设计工作台"}}`），真正的界面文案在 client.js bundle 里。
- **bundle 内中文文案可从压缩代码提取**：例如
  - knowledge：简体中文/概览/展开/收起/生成状态/篇文档
  - uma-design：设计系统/设计参考/已读取/设计规范/设计变量/组件示例
  - uma-task-budget：查看任务预算/任务预算/当前会话…共用一个预算/关闭/正在读取当前预算
  - design-studio：交互可用键盘完成/焦点可辨识且不被遮挡/缩放后主要操作仍可达（无障碍清单）
- **design-studio 的 510 个 `client.<theme>.js`**：均为 11–12KB 的**设计主题数据**（按品牌命名，如 `client.acer.js`/`client.razer.js`），不是组件源码，可作为数据复用。

## 4. 对 P4 工作量与策略的影响

原计划："按运行时截图 + DOM + 21 个 inject 目标重写 6 处界面"。

侦察后需要修正为两条并存的工作线：

1. **基础 UI 框架（77 个未发布包）**：这是硬依赖。要么从 beta5 抽取复用（像 11 个一等包那样），要么放弃——但放弃就没有 layout/renderer/sidebar，7 个 UMA 包无法挂载。
2. **7 个 UMA 包浏览器端**：压缩 bundle，按可观测契约（inject 目标 + 文案 + 挂载点）重写，不强求像素级。Host 端可直接按 tsc 直出源码还原（极简）。

**待用户决策**：77 个基础 UI 包如何处理（抽取复用 / 只用官方开源替代 / 放弃 UI 层）。

## 5. 证据位置

- inject 依赖：`uma-assets/packages/dsh-client-*/package.json` → `dsh.client.inject`
- Host 端形态：`uma-assets/packages/dsh-client-*/lib/index.js`（tsc 直出注释）
- 浏览器端形态：`uma-assets/packages/dsh-client-*/lib/client.js`（压缩 bundle）
- 77 包清单：beta5 `app.asar` → `dsh/node_modules/@deepseek-ai`
- 上游缺失：`deepseek-harness/packages/` + `git ls-files` 无匹配
