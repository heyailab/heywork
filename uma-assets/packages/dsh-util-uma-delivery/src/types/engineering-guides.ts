/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/engineering-guides.js` 反推，非 DeepSeek 原始源码。
 *
 * 该模块在 esbuild bundle 中被内联，三个常量仅被 `coding-standards.ts` 引用，
 * 不属于包级公开导出面。类型（interface / 字面量联合）由数据形状推断；字符串、
 * 正则与数组顺序与 lib 逐字一致。运行时仍以 lib/*.js 为准，详见 src/README.md。
 */

/** 来源元数据：仅标识原始发布者与条款，不附带来源手册全文。 */
export interface EngineeringSource {
  id: string
  title: string
  publisher: string
  url: string
  license: string
  licenseUrl: string
  verifiedAt: string
  revision: string
  notice?: string
}

/** 中英双语摘要（summary / title / body 共用此形状）。 */
export interface LocalizedText {
  zh: string
  en: string
}

/** 规则等级；取值来自本模块与 coding-standards 中全部字面量。 */
export type RuleLevel = 'required-by-project' | 'advisory'

/** 验证方式；取值来自本模块与 coding-standards 中全部字面量。 */
export type VerificationMethod = 'test' | 'review' | 'lint' | 'typecheck'

/** 条件式实现/评审义务，绝不代表自动通过检查。 */
export interface EngineeringRule {
  id: string
  languages: string[]
  sourceIds: string[]
  level: RuleLevel
  summary: LocalizedText
  verification: VerificationMethod
}

/** 由来源摘要改写的 UMA 指南，非发布方手册或认证。 */
export interface EngineeringGuide {
  id: string
  version: string
  languages: string[]
  sourceIds: string[]
  title: LocalizedText
  body: LocalizedText
}

/** References identify original publishers and terms; source manuals are not bundled. */
export const ENGINEERING_SOURCES: EngineeringSource[] = [
  {
    id: "w3c-wcag22",
    title: "Web Content Accessibility Guidelines (WCAG) 2.2",
    publisher: "W3C",
    url: "https://www.w3.org/TR/2024/REC-WCAG22-20241212/",
    license: "W3C Document License 2023",
    licenseUrl: "https://www.w3.org/copyright/document-license-2023/",
    verifiedAt: "2026-11-12",
    revision: "Recommendation 2024-12-12",
    notice: "Copyright © 2020–2024 World Wide Web Consortium. WCAG 2.2, Recommendation 2024-12-12.\nCopyright © 2023 W3C®. This software or document includes material copied from or derived from WCAG 2.2 (https://www.w3.org/TR/WCAG22/)."},
  {
    id: "postgres-isolation",
    title: "PostgreSQL transaction isolation",
    publisher: "PostgreSQL Global Development Group",
    url: "https://www.postgresql.org/docs/18/transaction-iso.html",
    license: "PostgreSQL",
    licenseUrl: "https://www.postgresql.org/about/licence/",
    verifiedAt: "2026-11-12",
    revision: "PostgreSQL 18 documentation"
  },
  {
    id: "google-review",
    title: "What to look for in a code review",
    publisher: "Google",
    url: "https://github.com/google/eng-practices/blob/3bb3ec25b3b0199f4940b1aa75f0ac5c5753301c/review/reviewer/looking-for.md",
    license: "CC-BY-3.0",
    licenseUrl: "https://github.com/google/eng-practices/blob/master/LICENSE",
    verifiedAt: "2026-11-12",
    revision: "Archived reference; 3bb3ec25b3b0199f4940b1aa75f0ac5c5753301c"
  }
]

/** Conditional implementation/review obligations, never automatically passing checks. */
export const ENGINEERING_RULES: EngineeringRule[] = [
  {
    id: "UMA.STD.KEYBOARD_FOCUS",
    languages: ["frontend", "web"],
    sourceIds: ["w3c-wcag22"],
    level: "required-by-project",
    summary: {
      zh: "交互可用键盘完成，焦点可辨识且不被遮挡，缩放后主要操作仍可达。",
      en: "Verify keyboard operation, visible unobscured focus and usable controls after zoom."
    },
    verification: "test"
  },
  {
    id: "UMA.STD.ACCESSIBLE_ERRORS",
    languages: ["frontend", "web"],
    sourceIds: ["w3c-wcag22"],
    level: "required-by-project",
    summary: {
      zh: "字段有可识别名称，错误不只依赖颜色；验证辅助技术可读取状态。",
      en: "Label controls and expose errors and status beyond color alone."
    },
    verification: "test"
  },
  {
    id: "UMA.STD.TRANSACTION_RETRY",
    languages: ["postgresql", "database"],
    sourceIds: ["postgres-isolation"],
    level: "advisory",
    summary: {
      zh: "按一致性要求选择隔离；序列化失败重试整个事务，并核对外部副作用。",
      en: "Choose isolation deliberately; retry complete failed transactions without duplicating external effects."
    },
    verification: "test"
  },
  {
    id: "UMA.STD.REVIEW_COUNTEREXAMPLE",
    languages: ["all"],
    sourceIds: ["google-review"],
    level: "advisory",
    summary: {
      zh: "评审检查实际行为、并发与反例；区分缺陷和个人风格偏好。",
      en: "Review behavior, concurrency and counterexamples; distinguish defects from style preferences."
    },
    verification: "review"
  },
  {
    id: "UMA.STD.ORDER_REPLAY",
    languages: ["payments", "commerce"],
    sourceIds: ["microsoft-rest", "postgres-isolation"],
    level: "advisory",
    summary: {
      zh: "订单和入账采用稳定身份，验证重复、乱序、并发与未知回执下的恢复。",
      en: "Use stable operation identities and verify duplicate, reordered, concurrent and unknown payment outcomes."
    },
    verification: "test"
  },
  {
    id: "UMA.STD.TENANT_SCOPE",
    languages: [
      "saas",
      "backend",
      "web"
    ],
    sourceIds: ["owasp-asvs5"],
    level: "required-by-project",
    summary: {
      zh: "每次操作核对实际资源归属；列表、搜索、导出与异步任务均覆盖越权用例。",
      en: "Check resource ownership for operations, lists, search, export and background work."
    },
    verification: "test"
  }
]

/** Source-informed original summaries and UMA verification examples, not publisher manuals or certifications. */
export const ENGINEERING_GUIDES: EngineeringGuide[] = [
  {
    id: "accessible-product-ui",
    version: "2026.11.12.1",
    languages: ["frontend", "web"],
    sourceIds: ["w3c-wcag22"],
    title: {
      zh: "可访问交互与表单验收",
      en: "Accessible interaction and forms"
    },
    body: {
      zh: "# 可访问交互\n\n为控件提供名称；键盘能到达操作，焦点可见且不被浮层遮挡。错误与状态不只靠颜色传达；优先复用项目已有控件和设计系统。\n\nUMA 验证：用键盘走完主流程，检查放大与窄屏、表单错误和读屏反馈。自动扫描不能替代人工交互核验，本摘要不宣称达到整站合规。",
      en: "# Accessible interaction\n\nName controls, support keyboard operation and keep focus visible and unobscured. Expose errors and status beyond color; reuse the project’s existing controls.\n\nUMA verification: exercise navigation, zoom, narrow forms and assistive feedback. Automated scanning does not replace interactive review or establish site-wide conformance."
    }
  },
  {
    id: "database-concurrency",
    version: "2026.11.12.1",
    languages: ["postgresql", "database"],
    sourceIds: ["postgres-isolation"],
    title: {
      zh: "事务、竞争与失败重试",
      en: "Transactions, races and retries"
    },
    body: {
      zh: "# 数据一致性\n\n明确事务需要保护的不变量，按所用数据库选择隔离。PostgreSQL 的 Read Committed 不提供跨语句固定快照；序列化失败须重新执行事务。\n\nUMA 验证：并发复现竞争，核对提交与回滚结果；订单扣费等外部操作另有幂等身份，不随数据库重试重复执行。",
      en: "# Data consistency\n\nDefine the protected invariants and choose isolation for the actual database. PostgreSQL Read Committed does not preserve one snapshot across statements; serialization failures require transaction retries.\n\nUMA verification: reproduce races and inspect committed state. External effects need separate idempotency and must not repeat with database retries."
    }
  },
  {
    id: "review-evidence",
    version: "2026.11.12.1",
    languages: ["all"],
    sourceIds: ["google-review"],
    title: {
      zh: "独立评审与可复现发现",
      en: "Independent review and actionable findings"
    },
    body: {
      zh: "# 评审与证据\n\n检查设计是否契合现有系统、实际行为和边界、并发及测试是否有用；不要为猜想需求增加框架。将必须修复的缺陷与个人风格偏好分开。\n\nUMA 验证流程：评审者读取真实改动和验收条件；发现包含触发条件、影响和位置。修复后重新核对，不能复制作者自评作为独立结论。来源仓库已归档，作为历史工程参考，不代表仍在更新的产品规范。",
      en: "# Review and evidence\n\nInspect system fit, behavior, edge cases, concurrency and useful tests. Avoid speculative frameworks and distinguish defects from personal preferences.\n\nUMA verification workflow: reviewers inspect actual changes and acceptance criteria. Findings identify triggers, impact and location; verify fixes rather than copying the author’s verdict. The source repository is archived historical engineering guidance, not an actively maintained product standard."
    }
  },
  {
    id: "order-payment-lifecycle",
    version: "2026.11.12.1",
    languages: ["payments", "commerce"],
    sourceIds: [
      "microsoft-rest",
      "postgres-isolation",
      "owasp-asvs5"
    ],
    title: {
      zh: "订单、支付与入账状态",
      en: "Orders, payments and settlement"
    },
    body: {
      zh: "# 订单与支付\n\nUMA 场景指南：区分创建、待支付、受理、结算、关闭、退款与结果未知。回调先验证身份和订单归属；重复请求关联同一业务操作。\n\n验证覆盖重复回调、乱序、并发支付、部分退款、断连和对账。按数据库能力保护余额与状态转换，外部支付成功和本地入账分别保留证据。这里是软件流程设计，不是财务或监管认证。",
      en: "# Orders and payments\n\nUMA scenario guide: distinguish creation, pending payment, admission, settlement, closure, refund and unknown outcomes. Authenticate callbacks and verify ownership; repeated requests refer to one business operation.\n\nUMA verification covers duplicates, reordering, races, partial refunds, disconnects and reconciliation. Retain separate evidence of external payment and local posting. This is software workflow guidance, not financial or regulatory certification."
    }
  },
  {
    id: "saas-tenant-authorization",
    version: "2026.11.12.1",
    languages: [
      "saas",
      "backend",
      "web"
    ],
    sourceIds: ["owasp-asvs5", "microsoft-rest"],
    title: {
      zh: "企业 SaaS 组织与数据权限",
      en: "SaaS organizations and data authorization"
    },
    body: {
      zh: "# 组织与数据权限\n\nUMA 场景指南：区分用户身份、组织成员关系、角色和资源归属。可信服务端根据会话及对象确定范围，不能只依赖前端隐藏按钮。\n\n验证跨组织读取与写入、成员移除、权限撤销、导出和后台任务。缓存与搜索索引保留范围信息，权限变更后重新核对。列出需要人工判断的业务权限，不以一份通用角色表替代真实规则。",
      en: "# Organizations and authorization\n\nUMA scenario guide: distinguish identity, membership, roles and resource ownership. Trusted server operations derive scope from the Session and object, not hidden UI controls.\n\nUMA verification covers cross-organization access, removed members, revoked permissions, export and background work. Scope caches and indexes and recheck changed permissions. Record business-specific decisions instead of imposing a universal role matrix."
    }
  }
]
