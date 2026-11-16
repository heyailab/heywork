---
description: "校验可移植的项目 Wiki 数据、文档目录、源码引用和依赖变化影响。"
kind: "package-library"
---

# @deepseek-ai/dsh-util-repo-wiki

[English](README.md) | 中文

## 概述

在展示、导入或使用项目知识前校验仓库 Wiki。浏览器与生成工具共用同一组数据校验；文档保存源码哈希与行范围，已就绪版本必须有已发布文档和知识卡片。导入依赖的变化会沿依赖链使关联文档失效。

## 目录

- [使用本包](#use-this-package)
- [实现说明](#understand-the-implementation)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

通过工作区包名引用本库。`wikiManifestSchema`、`wikiIndexSchema` 和 `wikiCatalogSchema` 校验文件与传输输入；`validateWikiTree` 拒绝循环目录和缺失父项，`wikiImpact` 计算受影响文档。

<a id="understand-the-implementation"></a>
## 实现说明

<details>
<summary>实现细节 — 点击展开</summary>

数据以格式版本 1 存放在 `.uma/wiki` 中。文档标识先校验再赋予品牌类型；源码路径拒绝绝对根路径、目录穿越、反斜杠和控制字符。源码指纹描述文件内容，不依赖时间戳元数据。中英文问题经过分词后用于词项检索。

</details>

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- 本库根据索引元数据校验引用；具体工具仍须比对当前源码内容。
- 导入关系由索引器提供，本库不解析编程语言。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者工作上下文 — 点击展开</summary>

无。

</details>
