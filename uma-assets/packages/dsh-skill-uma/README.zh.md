---
description: "内置 Uma 设计与交付技能：反模板艺术指导、UI/UX 智能、OpenDesign 系统与模板、产品团队角色、交付文档与质量门禁。"
kind: "package-reference"
---

# @deepseek-ai/dsh-skill-uma

[English](README.md) | 中文

## 概述

在 `ctx.skills` 上注册内置 Uma 技能目录。目录为默认 Web Agent 提供按需加载的技能：产品交付团队工作流、PRD/架构/UIUX 文档、设计品味与工艺手册、可检索的 UI/UX 数据、生产级 DESIGN.md 参考、完整设计系统、原型、仪表盘、线框图、移动界面、演示稿、Apple 平台审查、设计走查与交付质量门禁。

## 目录

- [使用本包](#use-this-package)
- [技能](#skills)
- [模型体验](#model-experience)
- [已知限制与后续工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用

资源存放在 `assets/` 并按需读取。提供器在注册时验证每个 `SKILL.md` 的 frontmatter，拒绝无效或重复的名称，并以不透明资源提示指向 `hey_resource_read`，不向模型发送实际安装目录。

安装版分发 `resources.umadb`，不分发 `assets/` 源目录。`pnpm run build:hey-resources` 构建本地 SQLite 资源库；资料压缩封装后直接读取，不解包成明文目录。这用于防止普通文件浏览和直接复制 Markdown，不能阻止能检查应用代码或内存的设备所有者提取内容。维护者在仓库保留可编辑源资料并重建资源库。技能继续供模型调用，但不出现在用户调用菜单中。

在 Agent 预设中与技能注册表一起挂载：

```yaml
- id: skill-hey
  name: '@deepseek-ai/dsh-skill-uma'
```

| 字段 | 默认值 | 含义 |
|---|---|---|
| `assetRoot` | 包内 `assets/` | 包含技能目录的绝对路径 |

提供者只扫描直接子目录，与 `skill-filesystem` 布局一致。缺少 `SKILL.md`、名称不是合法 kebab-case 或描述为空的目录会让插件在加载时失败，而不是静默丢弃内置技能。

自定义配置若加载这些内置技能，还须挂载 `@deepseek-ai/dsh-tool-uma-design` 及其声明的服务，才能读取技能资源。仅浏览元数据目录的消费者无需挂载资源工具。

<a id="skills"></a>
## 技能

| 技能 | 用途 |
|---|---|
| `hey-impact-analysis` | 带源码依据的影响分析与回归规划 |
| `hey-code-review` | 对本地变更进行只读缺陷审查 |
| `hey-debug` | 复现报错、诊断、按授权修复与回归验证 |
| `hey-team` | 完整产品交付流水线与角色路由 |
| `hey-delivery-docs` | PRD、架构、UI/UX 与规格文档 |
| `hey-design-taste` | 面向页面与应用界面的反模板视觉方向 |
| `hey-design-craft` | 塑造、批评、审查、打磨、加固与 DESIGN.md 沉淀 |
| `hey-design-system` | 可检索的配色、字体搭配、风格、UX 规则与技术栈 |
| `uma-design-md` | 完整的生产 DESIGN.md 参考目录 |
| `uma-design-systems` | 含令牌与组件的完整设计系统目录 |
| `hey-design-brief` | 结构化设计简报转 DESIGN.md |
| `hey-web-prototype` | 单文件 HTML 原型组合 |
| `hey-dashboard` | 含 KPI、活动流与任务表的实时仪表盘 |
| `hey-wireframe` | 带规格面板的标注低保真线框图 |
| `hey-mobile-app` | 真实设备框架中的移动应用界面 |
| `hey-deck` | HTML 演示稿 |
| `hey-apple-review` | Apple HIG 平台审查与跨平台转译 |
| `hey-design-review` | 渲染界面的设计走查 |
| `hey-quality-gate` | 确定性的交付前门禁 |

团队作者、评审和协调角色具备只读设计目录、上下文及内置知识检索工具；只有实现预设暴露设计脚手架写入。作者与评审也接收工作区范围内的经验召回。Wiki 成员负责有源码引用的项目梳理和受影响页面更新，发布必须通过 Wiki 新鲜度检查。禁用的知识集合与无关工作区不参与检索。

涉及 UI 工作时，交付团队的设计师检查内置系统目录，优先遵循用户明确选择、复制的设计提示词或自然语言风格描述。用户未指定时，设计师根据产品、受众、信息密度和已有品牌自行选择，在设计与 UI/UX 工件中记录选择和适用于项目的布局与组件决策。前端将这些决策落实到产品中，QA 对照设计验收渲染结果，并单独报告功能测试。后续页面复用该选择，并适配项目已确认的令牌与组件。

口语需求可能对应不同实现时，项目总监可通过 `hey_knowledge_search` 检索本地 HEY 术语库。术语覆盖前端、后端、产品、测试、工具、AI、版本控制和视觉风格。设计走查指南将界面问题转成可验证的开发交接。

安装目录使用规范化运行文件，不混入上游研究转储。`scripts/sync-hey-design-library.ts` 生成完整目录、按需详情模块与 `library-source.json` 摘要，`--check` 校验对应关系。参考清单仅声明实际随包文件，使用 `hey-design-system-reference/v1`；原生项目脚手架使用 `hey-design-project/v1`，不声明未复制的上游预览或审计文件。

扩展品牌参考使用带来源记录的 Simple Icons 身份元数据，以及 HEY 编写的产品领域规则。身份配色与来源 URL 和自编的布局、字体、组件选择分开记录；这些资源不是品牌官方组件库。每套包含可离线使用的 DESIGN.md、tokens.css、components.html 和 manifest.json。元数据许可证随 BRAND-METADATA-LICENSE.txt 提供。运行 `pnpm run generate-hey-brand-references`，再运行 `pnpm exec tsx scripts/sync-hey-design-library.ts`；`pnpm run verify-hey-design-library` 会拒绝过期或不完整的资源，而不会静默排除它们。

组件示例是展示在禁用脚本 iframe 中的离线视觉参考。原生字段与选择器仍可使用；示例操作按钮不包含业务后端。静态预览检查拒绝脚本、事件处理器、外部资源、缺失的可访问标签及不一致的默认令牌。浏览器质量检查逐套验证所有已安装示例，在 316（手机内嵌预览）、390、768、1280 CSS 像素及深浅环境中检查页面溢出、文字裁切和字段焦点；没有声明另一套配色的系统保留其原定外观。iframe 文档将 tokens.css 和 DESIGN.md 链接转为包含对应原文的原生折叠区域；复制到项目的资源仍保留同目录文件链接。

<a id="model-experience"></a>
## 模型体验

### 技能目录

#### 模型看到什么

模型看到每个 `SKILL.md` 的一条目录项，包含 frontmatter 中的名称与描述；`skill` 工具按需加载选中的正文。只有模型选择技能时才加载正文。描述足够短，可被默认工具结果裁剪器容纳；参考文件保留在磁盘上，只在已加载技能指示时读取。

#### Token 影响

目录描述在每个会话中固定。加载技能会把正文作为工具结果加入当前回合；参考文件只在读取时增加 token。

#### KV Cache 影响

目录在运行中的会话里保持稳定。资产修改在下一次目录查询时生效；运行中的 Agent 保留其既有组合。

## 已知限制与后续工作

<a id="known-limitations-and-deferred-work"></a>

- 内置品牌参考与设计系统描述第三方视觉身份；它们是结构参考，不是商标许可。
- 不内置 Apple Human Interface Guidelines 原文。
- 提供者不监听 `assets/` 变化；重启或重载插件才会刷新目录。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

该目录是 Design Studio 与交付工作台静态投影的运行时来源；新增技能时同步更新包描述与工作台分类摘要。

</details>
