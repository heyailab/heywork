# specs/ — 重写行为规格

> **这是重写的需求文档，不是源码翻译。** 每个 spec 只描述"外部可见的行为"，
> 不描述内部算法。如果一份 spec 让读者能照着写出不同实现但行为一致，它就是合格的。

## 规则（写 spec 前必读）

1. **七段固定格式**：`签名 → 参数表 → 返回 → 错误文本 → 副作用 → 边界条件 → 证据出处`
2. **不写实现细节**：禁止"先遍历再排序""用 Map 缓存"这类描述。写"结果按名称升序"。
3. **错误文本逐字**：`"skill-uma: <path> has no YAML frontmatter"` 不能写成"报 frontmatter 错误"。
4. **副作用要具体**：写哪个路径、什么格式、是否会覆盖，不写"写入文件"。
5. **边界条件全覆盖**：空输入、null/undefined、超长、越权、路径不存在、并发、非 UTF-8。
6. **证据出处**：标到 `src/*.ts` 的行号，方便校对但不作为抄写依据。
7. **合格标准**：随机抽一份 spec 给没看过源码的人，能独立实现出来。

## 索引

| 包 | spec | 状态 | 工具/API 数 |
|---|---|---|---|
| `dsh-skill-uma` | [skill-uma.md](skill-uma.md) | **已冻结**（待 P0.7 评审） | 6 API + 4 导出 |
| `dsh-tool-uma-design` | tool-uma-design.md | 待写 | 11 工具 + 服务 |
| `dsh-uma-base`（非 SSH） | uma-base.md | 待写 | 4 工具 |
| `dsh-tool-uma-workflow` | workflow.md | 待写 | 3 工具 |
| `dsh-util-uma-delivery` | delivery.md | 待写 | 14 导出 |
| `dsh-uma-task-budget` | budget.md | 待写 | 1 工具（typert） |
| `dsh-uma-guidance` | guidance.md | 待写 | 1 工具 |
| `dsh-uma-web` | — | 不需要（配置壳） | 0 |

## 流程

```
spec 完成 → 录 golden（scripts/record-golden.mjs）→ 重写 → golden 比对 → 双门禁
```

每份 spec 完成后在此索引标记"已冻结"。
