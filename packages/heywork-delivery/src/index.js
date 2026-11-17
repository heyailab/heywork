/**
 * @heywork/delivery — pure delivery artifact / guidance contract.
 *
 * FROM SPEC, NOT COPIED: 本文件所有外部行为依据 specs/delivery.md 实现；
 * 不复制 uma-assets/packages/dsh-util-uma-delivery/src/ 下的还原实现逻辑。
 * spec 冻结契约（常量字面值、正则、错误文本、阈值、判定顺序）逐字重建：
 * 指南正文 / 规则摘要 / 来源元数据由 spec §5-§7 指定"按证据行Range字面保留"，
 * 因此仅取其中的数据字面值，行为代码全部按 spec §3-§16 自行实现。
 */

// ---------------------------------------------------------------------------
// 工件分级 / frontmatter / 门禁（spec §3-§4, §9-§15）
// ---------------------------------------------------------------------------

/** 八类受控工件，按流水线顺序。spec §3：运行时不冻结。 */
const ARTIFACTS = [
  "research",
  "prd",
  "architecture",
  "uiux",
  "spec",
  "preview",
  "qa",
  "delivery"
];

/** 交付必需工件；spec §4：preview 不在其中，运行时不冻结。 */
const REQUIRED_ARTIFACTS = [
  "research",
  "prd",
  "architecture",
  "uiux",
  "spec",
  "qa",
  "delivery"
];

/** spec §1.4 / I:76-93：每个工件至少命中一条模式；pattern.source 进 missingSections。 */
const REQUIRED_SECTIONS = {
  research: [/finding|发现/i, /open question|待定|未决/i],
  prd: [/goal|目标/i, /acceptance|验收/i],
  architecture: [
    /component|组件|模块/i,
    /data|数据/i,
    /api|接口/i
  ],
  uiux: [
    /token|令牌|变量/i,
    /state|状态/i,
    /responsive|响应/i
  ],
  spec: [/task|任务/i, /acceptance|验收/i],
  preview: [/preview|预览/i],
  qa: [/gate|门禁|result|结果/i],
  delivery: [/deliver|交付/i]
};

/** spec §9 / I:119：匹配后大写、去重、保持首次出现顺序。 */
function placeholdersIn(body) {
  return [...new Set([...body.matchAll(/\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum/giu)].map((match) => match[0].toUpperCase()))];
}

/** spec §15 / I:107：定界允许 CRLF，闭合 delimiter 后可跟换行或字符串结尾。 */
function splitFrontmatter(content) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content);
  return match === null ? {
    frontmatter: "",
    body: content
  } : {
    frontmatter: match[1] ?? "",
    body: content.slice(match[0].length)
  };
}

/** spec §9 / I:139-155：frontmatter 字段 + section 命中 + 占位符 → ready。 */
function evaluateArtifact(artifact, content) {
  const { frontmatter, body } = splitFrontmatter(content);
  const status = /^status:\s*(draft|approved)\s*$/mu.exec(frontmatter)?.[1];
  const owner = /^owner:\s*(\S+)\s*$/mu.exec(frontmatter)?.[1] ?? null;
  const updated = /^updated:\s*(\S+)\s*$/mu.exec(frontmatter)?.[1] ?? null;
  const missingSections = REQUIRED_SECTIONS[artifact].filter((pattern) => !pattern.test(body)).map((pattern) => pattern.source);
  const placeholders = placeholdersIn(body);
  return {
    status: status === "draft" || status === "approved" ? status : "unknown",
    owner,
    updated,
    body,
    missingSections,
    placeholders,
    ready: missingSections.length === 0 && placeholders.length === 0
  };
}

/** spec §12 / I:51-64：patch 空；feature 分两段；product 分两段；非等值落入默认分支。 */
function requiredArtifacts(depth, phase) {
  if (depth === "patch") return [];
  if (depth === "feature") return phase === "documents" ? ["spec"] : [
    "spec",
    "qa",
    "delivery"
  ];
  return phase === "documents" ? [
    "research",
    "prd",
    "architecture",
    "uiux"
  ] : REQUIRED_ARTIFACTS;
}

/** spec §10 / I:178-187：始终按全部 7 件必需集判缺失；所有 !ready 在场工件都进 blocked。 */
function evaluateGate(artifacts) {
  const present = new Set(artifacts.map((entry) => entry.artifact));
  const missing = REQUIRED_ARTIFACTS.filter((artifact) => !present.has(artifact));
  const blocked = [...missing, ...artifacts.filter((entry) => !entry.ready).map((entry) => entry.artifact)];
  return {
    ready: blocked.length === 0,
    missing,
    blocked
  };
}

/** spec §11 / I:196-206：只保留必需集内工件；非必需（含 preview）不阻塞。 */
function evaluateCheckpoint(artifacts, depth, phase) {
  const required = requiredArtifacts(depth, phase);
  const relevant = artifacts.filter((entry) => required.includes(entry.artifact));
  const missing = required.filter((artifact) => !relevant.some((entry) => entry.artifact === artifact));
  const blocked = [...missing, ...relevant.filter((entry) => !entry.ready).map((entry) => entry.artifact)];
  return {
    ready: blocked.length === 0,
    missing,
    blocked
  };
}

// ---------------------------------------------------------------------------
// SSH 目标解析（spec §13 / §16；保留 if..try/catch..else if 控制流）
// ---------------------------------------------------------------------------

/** spec §13 / S:21-48：登录目的地 / SSH URL / 常见 ssh 命令串 → 校验后的目标或 undefined。 */
function parseUmaSshTarget(input) {
  let value = input.trim();
  let commandPort;
  if (value.length > 320) return void 0;
  if (value.startsWith("ssh ")) {
    const command = /^ssh\s+(?:-p\s+(\d{1,5})\s+)?(\S+)(?:\s+-p\s+(\d{1,5}))?$/u.exec(value);
    if (command?.[2] === void 0 || command[1] !== void 0 && command[3] !== void 0) return void 0;
    value = command[2];
    commandPort = command[1] ?? command[3];
  }
  const address = /^(?:ssh:\/\/)?([A-Za-z_][A-Za-z0-9_.-]{0,63})@(\[[a-fA-F0-9:.]+\]|[A-Za-z0-9][A-Za-z0-9.-]{0,252})(?::(\d{1,5}))?$/u.exec(value);
  if (address?.[1] === void 0 || address[2] === void 0 || commandPort !== void 0 && address[3] !== void 0) return void 0;
  const port = Number(commandPort ?? address[3] ?? "22");
  if (port < 1 || port > 65535) return void 0;
  const host = address[2];
  if (host.startsWith("[")) try {
    new URL(`ssh://${host}`);
  }
  catch (_error) {
    return;
  }
  else if (!host.replace(/\.$/u, "").split(".").every((label) => /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/u.test(label))) return void 0;
  return {
    user: address[1],
    host: host.startsWith("[") ? host.slice(1, -1) : host,
    port
  };
}

/** spec §16 / S:55-57：格式化为 ssh URI；含冒号的 host 自动包方括号，不校验不转义。 */
function umaSshUri(target) {
  return `ssh://${target.user}@${target.host.includes(":") ? `[${target.host}]` : target.host}:${target.port}`;
}

// ---------------------------------------------------------------------------
// 展示层脱敏（spec §14 / R:8-17；best-effort，非安全证明）
// ---------------------------------------------------------------------------

/** spec §1.3 / §14：四条 replace 顺序链式；不修正任何正则边界。 */
function redactDevelopmentText(text) {
  return text.replace(/(Bearer\s+)[a-z0-9._~+/=-]+/giu, "$1[redacted]")
    .replace(/([?&](?:token|api[_-]?key|access[_-]?token|secret)=)[^\s&#"']+/giu, "$1[redacted]")
    .replace(/((?:password|api[_-]?key|access[_-]?token|token|secret)\s*[:=]\s*)[^\s,;]+/giu, "$1[redacted]")
    .replace(/\bsk-[A-Za-z0-9_-]{16,}\b/gu, "[redacted]");
}

// ---------------------------------------------------------------------------
// 编码规范目录（spec §5-§8；数据字面值冻结，行为由 spec 实现）
// ---------------------------------------------------------------------------

/** spec §1.2 / C:39。 */
const CATALOG_VERSION = "2026.11.12.1";

/** G:55-86：内部来源元数据（spec §7 顺序前 3 项）。 */
const ENGINEERING_SOURCES = [
  {
    id: "w3c-wcag22",
    title: "Web Content Accessibility Guidelines (WCAG) 2.2",
    publisher: "W3C",
    url: "https://www.w3.org/TR/2024/REC-WCAG22-20241212/",
    license: "W3C Document License 2023",
    licenseUrl: "https://www.w3.org/copyright/document-license-2023/",
    verifiedAt: "2026-11-12",
    revision: "Recommendation 2024-12-12",
    notice: "Copyright © 2020–2024 World Wide Web Consortium. WCAG 2.2, Recommendation 2024-12-12.\nCopyright © 2023 W3C®. This software or document includes material copied from or derived from WCAG 2.2 (https://www.w3.org/TR/WCAG22/)."
  },
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
];

/** spec §7 / C:61-153：12 个冻结来源，逐字保留 URL / license / revision / notice。 */
const CODING_STANDARD_SOURCES = Object.freeze([
  ...ENGINEERING_SOURCES.map((value) => Object.freeze(value)),
  Object.freeze({
    id: "alibaba-p3c",
    title: "Alibaba Java Coding Guidelines / P3C",
    publisher: "Alibaba",
    url: "https://github.com/alibaba/p3c",
    license: "Apache-2.0",
    licenseUrl: "https://github.com/alibaba/p3c/blob/master/license.txt",
    verifiedAt: "2026-11-09",
    revision: "黄山版; repository snapshot 6c59c8c36ecd8722c712d5685b8c3822c1c8b030"
  }),
  Object.freeze({
    id: "google-ts",
    title: "Google TS/JS Style Guide",
    publisher: "Google",
    url: "https://google.github.io/styleguide/tsguide.html",
    license: "CC-BY-3.0",
    licenseUrl: "https://github.com/google/styleguide/blob/gh-pages/LICENSE",
    verifiedAt: "2026-11-09",
    revision: "repository snapshot 7c3eb00dd3a3308003c5c8a79c4290dc1c8a8c53"
  }),
  Object.freeze({
    id: "python-pep8",
    title: "PEP 8 — Style Guide for Python Code",
    publisher: "Python community",
    url: "https://peps.python.org/pep-0008/",
    license: "Public-domain-statement",
    licenseUrl: "https://peps.python.org/pep-0008/#copyright",
    verifiedAt: "2026-11-09",
    revision: "PEP 8; repository snapshot efec2601611c2fa53b1b1791b09b0368840c038c"
  }),
  Object.freeze({
    id: "go-review",
    title: "Go Code Review Comments",
    publisher: "Go project",
    url: "https://go.dev/wiki/CodeReviewComments",
    license: "CC-BY-4.0-docs/BSD-code",
    licenseUrl: "https://go.dev/copyright",
    verifiedAt: "2026-11-09",
    revision: "repository snapshot fe2268bb04c953cd65bcae752e978912f5cbddaa"
  }),
  Object.freeze({
    id: "microsoft-dotnet",
    title: "Framework Design Guidelines — Naming",
    publisher: "Microsoft",
    url: "https://learn.microsoft.com/en-us/dotnet/standard/design-guidelines/naming-guidelines",
    license: "CC-BY-4.0",
    licenseUrl: "https://github.com/dotnet/docs/blob/main/LICENSE",
    verifiedAt: "2026-11-09",
    revision: "repository snapshot 231641a1728ed3a54392a3dd27efb2ef2d4504e4"
  }),
  Object.freeze({
    id: "microsoft-rest",
    title: "Microsoft Azure REST API Guidelines",
    publisher: "Microsoft",
    url: "https://github.com/microsoft/api-guidelines/blob/vNext/azure/Guidelines.md",
    license: "CC-BY-4.0",
    licenseUrl: "https://github.com/microsoft/api-guidelines/blob/vNext/license.txt",
    verifiedAt: "2026-11-09",
    revision: "repository snapshot 1c58ca7f1eb51768cb4e21facd6ce0154ee4db64"
  }),
  Object.freeze({
    id: "uber-go",
    title: "Uber Go Style Guide",
    publisher: "Uber",
    url: "https://github.com/uber-go/guide/blob/master/style.md",
    license: "Apache-2.0",
    licenseUrl: "https://github.com/uber-go/guide/blob/master/LICENSE",
    verifiedAt: "2026-11-09",
    revision: "repository snapshot 1d60a91aa5e87d443002e23c21903c49489dbde5"
  }),
  Object.freeze({
    id: "owasp-asvs5",
    title: "Application Security Verification Standard 5.0.0",
    publisher: "OWASP",
    url: "https://asvs.owasp.org/",
    license: "CC-BY-SA-4.0",
    licenseUrl: "https://github.com/OWASP/ASVS/blob/v5.0.0_release/LICENSE.md",
    verifiedAt: "2026-11-09",
    revision: "5.0.0; repository snapshot 5cf9b032440be53ce345ab3c130fda46ba1ce7a2"
  }),
  Object.freeze({
    id: "tencent-secguide",
    title: "Tencent Secure Coding Guide",
    publisher: "Tencent / THL A29 Limited",
    url: "https://github.com/Tencent/secguide",
    license: "CC-BY-SA-4.0",
    licenseUrl: "https://github.com/Tencent/secguide/blob/main/LICENSE",
    verifiedAt: "2026-11-09",
    revision: "unversioned; repository snapshot bfda087142e3bb3f5840cbc6af82c1982d1d14e4"
  })
]);

/** G:89-160：内部工程规则（spec §6 顺序前 6 项）。 */
const ENGINEERING_RULES = [
  {
    id: "HEY.STD.KEYBOARD_FOCUS",
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
    id: "HEY.STD.ACCESSIBLE_ERRORS",
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
    id: "HEY.STD.TRANSACTION_RETRY",
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
    id: "HEY.STD.REVIEW_COUNTEREXAMPLE",
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
    id: "HEY.STD.ORDER_REPLAY",
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
    id: "HEY.STD.TENANT_SCOPE",
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
];

/** spec §6 / C:41-48：递归冻结 languages / sourceIds / summary。 */
function freezeRule(value) {
  return Object.freeze({
    ...value,
    languages: Object.freeze([...value.languages]),
    sourceIds: Object.freeze([...value.sourceIds]),
    summary: Object.freeze({ ...value.summary })
  });
}

/** spec §5 / C:50-58：递归冻结 languages / sourceIds / title / body。 */
function freezeGuide(value) {
  return Object.freeze({
    ...value,
    languages: Object.freeze([...value.languages]),
    sourceIds: Object.freeze([...value.sourceIds]),
    title: Object.freeze({ ...value.title }),
    body: Object.freeze({ ...value.body })
  });
}

/** spec §6 / C:156-373：23 个冻结规则 = 6 ENGINEERING_RULES + 17 HEY 规则。 */
const CODING_STANDARD_RULES = Object.freeze([
  ...ENGINEERING_RULES.map(freezeRule),
  freezeRule({
    id: "HEY.STD.PROJECT_PRECEDENCE",
    languages: ["all"],
    sourceIds: ["python-pep8", "google-ts"],
    level: "advisory",
    summary: {
      zh: "先识别仓库约定、语言和已配置检查；风格冲突采用项目约定并说明取舍。",
      en: "Select existing project conventions and checks before external guidance."
    },
    verification: "review"
  }),
  freezeRule({
    id: "HEY.STD.SEMANTIC_NAMES",
    languages: ["all"],
    sourceIds: [
      "google-ts",
      "go-review",
      "microsoft-dotnet"
    ],
    level: "advisory",
    summary: {
      zh: "使用清楚且一致的领域名称，按语言习惯区分类型、值、常量与缩写。",
      en: "Use meaningful domain names and the naming conventions of the current language."
    },
    verification: "lint"
  }),
  freezeRule({
    id: "HEY.STD.JAVA_LAYERING",
    languages: ["java"],
    sourceIds: ["alibaba-p3c"],
    level: "advisory",
    summary: {
      zh: "在已有业务分层中明确接口、业务规则、数据与外部适配责任，避免无边界跨模块调用。",
      en: "Respect declared Java module responsibilities; choose layers proportional to the project."
    },
    verification: "review"
  }),
  freezeRule({
    id: "HEY.STD.JAVA_RESOURCE_LIFETIME",
    languages: ["java"],
    sourceIds: ["alibaba-p3c"],
    level: "advisory",
    summary: {
      zh: "资源使用结构化关闭或显式所有权；异常保留有意义的原因与失败语义。",
      en: "Give resources an owner and preserve meaningful exception outcomes."
    },
    verification: "test"
  }),
  freezeRule({
    id: "HEY.STD.TS_UNTRUSTED_TYPES",
    languages: ["typescript"],
    sourceIds: ["google-ts"],
    level: "advisory",
    summary: {
      zh: "边界输入先验证并收窄；避免使用 any、双重断言或忽略指令掩盖错误契约。",
      en: "Validate and narrow unknown boundary values instead of hiding contract errors."
    },
    verification: "typecheck"
  }),
  freezeRule({
    id: "HEY.STD.TS_MODULE_BOUNDARIES",
    languages: ["typescript", "javascript"],
    sourceIds: ["google-ts"],
    level: "advisory",
    summary: {
      zh: "保持模块职责内聚，公开面有意设计；类型导入和导出遵从当前工具链。",
      en: "Keep modules cohesive and deliberately control public exports and dependencies."
    },
    verification: "review"
  }),
  freezeRule({
    id: "HEY.STD.PYTHON_PUBLIC_NAMES",
    languages: ["python"],
    sourceIds: ["python-pep8"],
    level: "advisory",
    summary: {
      zh: "按项目及 Python 惯例组织模块、名称和导入，明确公开接口与内部实现。",
      en: "Keep Python names, imports and public interfaces consistent with project conventions."
    },
    verification: "lint"
  }),
  freezeRule({
    id: "HEY.STD.GO_PACKAGES",
    languages: ["go"],
    sourceIds: ["go-review", "uber-go"],
    level: "advisory",
    summary: {
      zh: "包名简洁且有意义，包保持内聚，避免循环依赖与杂项堆积。",
      en: "Use cohesive Go packages with meaningful names and no import cycles."
    },
    verification: "review"
  }),
  freezeRule({
    id: "HEY.STD.GO_ERRORS_CONTEXT",
    languages: ["go"],
    sourceIds: ["go-review", "uber-go"],
    level: "advisory",
    summary: {
      zh: "按调用语境传递 Context，保留可判断的错误，避免重复处理或静默吞掉失败。",
      en: "Preserve useful errors and propagate request cancellation through Go call chains."
    },
    verification: "review"
  }),
  freezeRule({
    id: "HEY.STD.GO_GOROUTINE_LIFETIME",
    languages: ["go"],
    sourceIds: ["uber-go"],
    level: "advisory",
    summary: {
      zh: "并发任务有所有者、停止路径及等待结束的机制，资源在工作结束后释放。",
      en: "Give concurrent Go work a stop path and wait for it before releasing resources."
    },
    verification: "test"
  }),
  freezeRule({
    id: "HEY.STD.DOTNET_PUBLIC_NAMING",
    languages: ["csharp", "dotnet"],
    sourceIds: ["microsoft-dotnet"],
    level: "advisory",
    summary: {
      zh: "公开类型、成员与命名空间沿用 .NET 和项目约定，重命名需审查兼容影响。",
      en: "Use established .NET public naming and review compatibility before renaming APIs."
    },
    verification: "lint"
  }),
  freezeRule({
    id: "HEY.STD.API_COMPATIBILITY",
    languages: ["rest", "http-api"],
    sourceIds: ["microsoft-rest"],
    level: "advisory",
    summary: {
      zh: "调整公开接口时核对兼容性、失败响应与重试语义，并验证实际消费者。",
      en: "Classify API compatibility and verify actual clients, errors and retry behavior."
    },
    verification: "test"
  }),
  freezeRule({
    id: "HEY.STD.AUTHORIZATION_RESOURCE",
    languages: [
      "web",
      "backend",
      "http-api"
    ],
    sourceIds: ["owasp-asvs5"],
    level: "required-by-project",
    summary: {
      zh: "服务端同时检查操作权限与具体数据归属；字段权限也按需要验证。",
      en: "Check server-side operation, resource and relevant field permissions."
    },
    verification: "test"
  }),
  freezeRule({
    id: "HEY.STD.INPUT_PARAMETERIZATION",
    languages: [
      "web",
      "backend",
      "http-api"
    ],
    sourceIds: ["owasp-asvs5"],
    level: "required-by-project",
    summary: {
      zh: "数据库和值使用参数机制；动态结构显式白名单，操作系统调用避免拼接不可信命令。",
      en: "Keep untrusted values separate from query structure and executable commands."
    },
    verification: "test"
  }),
  freezeRule({
    id: "HEY.STD.SECRET_HANDLING",
    languages: ["all"],
    sourceIds: ["owasp-asvs5"],
    level: "required-by-project",
    summary: {
      zh: "秘密进入受控配置与访问流程；源码、日志和导出避免泄露有效凭据。",
      en: "Keep real credentials out of source, public output and unrestricted logs."
    },
    verification: "lint"
  }),
  freezeRule({
    id: "HEY.STD.FILE_PATH_SCOPE",
    languages: [
      "web",
      "backend",
      "nodejs",
      "go",
      "java",
      "python",
      "c",
      "cpp"
    ],
    sourceIds: ["tencent-secguide"],
    level: "required-by-project",
    summary: {
      zh: "文件读写先核准目录与目标，处理路径穿越、符号链接及名称来源风险。",
      en: "Constrain untrusted file paths to the approved filesystem scope."
    },
    verification: "test"
  }),
  freezeRule({
    id: "HEY.STD.OUTBOUND_TARGET_SCOPE",
    languages: [
      "web",
      "backend",
      "nodejs",
      "go",
      "java",
      "python"
    ],
    sourceIds: ["tencent-secguide"],
    level: "required-by-project",
    summary: {
      zh: "不可信 URL 请求按明确网络策略核目标及重定向，避免越界访问内部资源。",
      en: "Constrain untrusted outbound destinations and redirects to the approved network policy."
    },
    verification: "test"
  })
]);

/** G:163-242：内部工程指南（spec §5 顺序后 5 项）。 */
const ENGINEERING_GUIDES = [
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
];

/** spec §5 / C:376-520：14 个冻结指南 = 9 个内置 + 5 个 ENGINEERING_GUIDES。 */
const BUILTIN_CODING_GUIDES = Object.freeze([
  freezeGuide({
    id: "architecture-and-naming",
    title: {
      zh: "按项目选择架构、分层与命名",
      en: "Project architecture, boundaries and naming"
    },
    languages: ["all"],
    sourceIds: [
      "alibaba-p3c",
      "python-pep8",
      "google-ts"
    ],
    body: {
      zh: "# 架构与命名\n\n先读项目现有规范、入口、依赖图和检查配置，再选择本次改动真正涉及的规则。小修复沿用已有结构；新模块明确职责、数据所有者和公开契约。Java 分层示例不等于 Go、插件系统或脚本都要 Controller/Service/DAO。分包以职责内聚和边界清晰为目标，不按文件数量机械拆包，也不为统一风格批量重命名公开 API。\n\nUMA 验证流程：发现真实检查，把适用规则关联验收或人工评审证据；记录不适用或冲突原因。没有执行检查时保持未验证。",
      en: "# Architecture and naming\n\nRead the project conventions, entry points, dependencies and check configuration first. Keep a patch within the existing structure. Give new modules clear responsibilities, data ownership and public contracts. Java layering examples do not require every Go package, plugin or script to adopt Controller/Service/DAO. Do not rename public APIs merely for style.\n\nUMA verification: link selected rules to existing checks or explicit review evidence. Record conflicts and non-applicability. Unrun checks remain unverified."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "typescript-and-frontend",
    title: {
      zh: "TypeScript 与前端边界",
      en: "TypeScript and frontend boundaries"
    },
    languages: [
      "typescript",
      "javascript",
      "frontend"
    ],
    sourceIds: ["google-ts", "tencent-secguide"],
    body: {
      zh: "# TypeScript 与前端\n\n沿用项目 formatter、模块解析、框架与组件库。TypeScript 边界值先验证并收窄，不用双重断言掩盖契约错误。模块出口与状态所有者清楚，异步操作覆盖加载、空结果、失败及取消。外部文本按数据展示，富文本采用项目批准的净化方案。\n\nUMA 验证流程：运行已配置的 lint、类型检查与相关组件测试；跨页面或网络状态的变化补边界测试。Google 的分号与特定导入偏好不能覆盖当前项目。",
      en: "# TypeScript and frontend\n\nKeep the project formatter, module resolution, framework and component system. Validate unknown TypeScript boundary values instead of hiding contract errors with double assertions. Make module exports and state ownership explicit; cover loading, empty, failed and cancelled operations. Display external text as data and use the approved sanitizer for rich content.\n\nUMA verification: run configured lint, type checks and relevant component or boundary tests. Google formatting preferences do not override the project."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "java-services",
    title: {
      zh: "Java 服务与资源所有权",
      en: "Java services and resource ownership"
    },
    languages: ["java"],
    sourceIds: ["alibaba-p3c", "tencent-secguide"],
    body: {
      zh: "# Java 服务\n\n遵从现有框架和模块边界，按复杂度选择分层。接口适配、业务不变量、持久化和外部调用需要明确职责，但不要求每个项目都新增四套类。资源采用结构化关闭或可核对的所有权约定；异常保留有用原因。事务围绕一致性需求设计，不等同一个方法一个事务。\n\nUMA 验证流程：优先项目已有 PMD/P3C、构建和测试；验证资源失败路径、参数绑定及实际调用方。不可把历史示例里的所有偏好当作当前项目强制项。",
      en: "# Java services\n\nFollow the existing framework and module boundaries. Separate transport, invariants, persistence and external adapters where the project needs them; do not invent four sets of classes for every change. Give resources structured cleanup or documented ownership and preserve useful exception causes. Choose transaction boundaries from consistency needs.\n\nUMA verification: use configured PMD/P3C, builds and tests. Check cleanup failures, parameter binding and real consumers rather than enforcing every historical example."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "go-services",
    title: {
      zh: "Go 包、错误与并发生命周期",
      en: "Go packages, errors and concurrent work"
    },
    languages: ["go"],
    sourceIds: [
      "go-review",
      "uber-go",
      "tencent-secguide"
    ],
    body: {
      zh: "# Go 工程\n\n包按职责内聚并使用清楚名称，公共接口遵从项目的 Go 习惯。错误保留调用方需要判断的信息；请求相关工作传递 Context。并发任务必须有所有者、停止机制和等待结束的路径，资源关闭前确认工作已结束。共享切片或映射的所有权应明确，不机械复制所有数据。\n\nUMA 验证流程：运行项目的 gofmt、静态检查和相关测试；涉及并发、取消或共享状态时加入 race 与关闭流程验证。不自动引入 Uber 专用库。",
      en: "# Go engineering\n\nUse cohesive packages and meaningful names. Preserve useful errors and propagate request contexts. Concurrent work needs an owner, a stopping mechanism and a way to join before resources close. Document ownership of shared slices and maps instead of copying everything mechanically.\n\nUMA verification: use the project formatting, static checks and tests; add race and shutdown coverage where concurrency changes. Do not automatically introduce Uber-specific libraries."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "python-projects",
    title: {
      zh: "Python 接口、导入与项目风格",
      en: "Python interfaces, imports and project style"
    },
    languages: ["python"],
    sourceIds: ["python-pep8", "tencent-secguide"],
    body: {
      zh: "# Python 工程\n\n优先项目已有风格与工具。按 Python 惯例组织模块、名称与导入，区分公开接口和内部实现。避免可变默认参数等共享状态意外；公共输入、动态执行和文件操作依照实际信任边界处理。不要为套用行宽而重排无关文件。\n\nUMA 验证流程：使用现有 formatter、lint、类型检查和测试；清楚标记哪些工具未配置。对路径越界、异常与资源清理补可复现用例。",
      en: "# Python engineering\n\nPrefer the existing project style and tools. Keep names, modules and imports idiomatic and distinguish public interfaces from internals. Avoid accidental shared state such as mutable defaults. Treat public input, dynamic execution and file operations according to their trust boundaries. Do not reformat unrelated files solely for line length.\n\nUMA verification: use configured formatters, linters, type checks and tests; report missing tools and test boundary failures."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "dotnet-apis",
    title: {
      zh: ".NET 公共契约与命名",
      en: ".NET public contracts and naming"
    },
    languages: ["csharp", "dotnet"],
    sourceIds: ["microsoft-dotnet"],
    body: {
      zh: "# .NET 公共契约\n\n公开类型、成员和命名空间保持 .NET 及项目已有命名一致，名称表达用途而不是实现细节。更改公开名称或签名时，检查消费者和序列化契约。不要将 Go、Python 或 Java 的名称规则移植到 C#。\n\nUMA 验证流程：沿用现有 .editorconfig、分析器、构建和测试。兼容性要求由项目确定；未运行 API 或调用方检查时，不能宣称兼容已验证。",
      en: "# .NET public contracts\n\nKeep public types, members and namespaces consistent with .NET and project naming. Names should express purpose. Review consumers and serialization contracts before changing a public name or signature. Do not transplant naming conventions from other languages.\n\nUMA verification: use configured .editorconfig rules, analyzers, builds and tests. The project defines compatibility requirements; unrun consumer checks do not prove compatibility."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "http-api-contracts",
    title: {
      zh: "HTTP 接口、兼容与重试",
      en: "HTTP APIs, compatibility and retries"
    },
    languages: [
      "rest",
      "http-api",
      "backend"
    ],
    sourceIds: ["microsoft-rest", "owasp-asvs5"],
    body: {
      zh: "# HTTP 接口\n\n沿用当前资源、版本、响应和错误约定；变更前判断兼容性，并同步真实消费者。将认证、资源授权、输入验证与业务执行分别核对。对可能重试的写入设计幂等、并发冲突和恢复语义。Azure 的特定路径、分页与响应格式只适用于相应约定，不覆盖 RPC 或既有 API。\n\nUMA 验证流程：用项目契约和 SDK 测试验证成功、拒绝、重复、冲突与超时路径；保持支付、余额和历史记录不被重复写入。",
      en: "# HTTP APIs\n\nKeep the current resource, version, response and error conventions. Classify compatibility and update real consumers. Check authentication, resource authorization, input validation and execution separately. Design retryable writes for idempotency, conflicts and recovery. Azure-specific formats do not replace RPC or established API contracts.\n\nUMA verification: exercise success, denial, duplicate, conflict and timeout paths through project contract and SDK tests."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "secure-boundaries",
    title: {
      zh: "安全边界、秘密与外部数据",
      en: "Security boundaries, secrets and external data"
    },
    languages: ["all"],
    sourceIds: ["owasp-asvs5", "tencent-secguide"],
    body: {
      zh: "# 安全边界\n\n先列信任边界，再验证操作权限、数据归属及需要的字段权限。把不可信值与查询或命令结构分开，动态结构使用明确白名单。文件和出站请求限制在产品批准的范围，合法企业内网与本地开发按显式策略处理。秘密进入受控配置，不进入公开日志、代码或导出。\n\nUMA 验证流程：为拒绝、越权、注入、路径穿越、重定向和脱敏建立适用测试。扫描告警需核实误报；本指南不等同完整安全审计或官方认证。",
      en: "# Security boundaries\n\nIdentify trust boundaries and check operation, data and relevant field permissions. Separate untrusted values from query or command structure. Constrain file and outbound access to approved scopes, including explicitly authorized enterprise networks. Keep secrets in controlled configuration rather than public output.\n\nUMA verification: select applicable authorization, injection, traversal, redirect and redaction tests. Review scanner findings; this guide is not a complete security audit or certification."
    },
    version: "2026.11.09.1"
  }),
  freezeGuide({
    id: "testing-and-review",
    title: {
      zh: "检查回执、失败恢复与独立评审",
      en: "Check receipts, failure recovery and independent review"
    },
    languages: ["all"],
    sourceIds: ["owasp-asvs5"],
    body: {
      zh: "# 验证与评审\n\n以下是 HEY 的验证流程，安全用例参考 ASVS。发现项目已有检查，以行为和失败路径选择合适测试层；边界变化采用真实集成验证。不要用复刻实现的测试、任意覆盖率数字或模型自评代替证据。\n\n执行检查后记录命令、目录、源码指纹和退出状态。失败、取消、来源不完整及过期结果不能作为当前通过。独立评审记录触发条件、后果与源码位置；未解决问题继续阻塞验收。历史通过率和文档勾选都不是当前源码通过或部署成功。",
      en: "# Verification and review\n\nThis is the HEY verification workflow; ASVS informs applicable security cases. Discover existing checks and select test layers from behavior and failure boundaries. Avoid tests that merely repeat implementation, arbitrary coverage targets and model self-grades.\n\nRetain commands, directories, source fingerprints and exit outcomes. Failed, cancelled, incomplete or stale evidence is not a current pass. Record actionable independent findings. Historical pass rates and document checkboxes do not certify current source or deployment."
    },
    version: "2026.11.09.1"
  }),
  ...ENGINEERING_GUIDES.map(freezeGuide)
]);

/** spec §1.3 / C:523-537：别名归一表。 */
const ALIASES = Object.freeze({
  ts: "typescript",
  js: "javascript",
  py: "python",
  golang: "go",
  "c#": "csharp",
  "c++": "cpp",
  ".net": "dotnet",
  node: "nodejs",
  "node.js": "nodejs",
  react: "frontend",
  vue: "frontend",
  svelte: "frontend",
  angular: "frontend"
});

/**
 * spec §8 / C:566-593：按显式标签选择规则与指南。
 * 注意 C:573 的匹配式 `selected.has(tag) || tag === "all" && options.includeGeneral !== false`
 * 因 && 优先于 ||，语义为「标签在选中集 或（标签为 all 且未显式关闭通用项）」；
 * 按 spec 禁止加括号改成 (selected.has(tag) || tag === "all") && ...。
 */
function selectCodingStandards(languages, options = {}) {
  const normalized = [...new Set(languages.map((value) => {
    const key = value.trim().toLowerCase();
    return ALIASES[key] ?? key;
  }).filter((value) => value !== "" && value !== "all"))].sort();
  const selected = new Set(normalized);
  if (selected.has("nodejs")) selected.add("javascript");
  const matches = (tags) => tags.some((tag) => selected.has(tag) || tag === "all" && options.includeGeneral !== false);
  const rules = Object.freeze(CODING_STANDARD_RULES.filter((rule) => matches(rule.languages)));
  const guides = Object.freeze(BUILTIN_CODING_GUIDES.filter((guide) => matches(guide.languages)));
  const sourceIds = new Set([...rules, ...guides].flatMap((value) => value.sourceIds));
  return Object.freeze({
    catalogVersion: CATALOG_VERSION,
    languages: Object.freeze([...selected].sort()),
    rules,
    guides,
    sources: Object.freeze(CODING_STANDARD_SOURCES.filter((source) => sourceIds.has(source.id))),
    policy: Object.freeze({
      projectRulesFirst: true,
      selectedRulesAreNotVerified: true,
      requiredChecksNeedReceipts: true,
      notes: Object.freeze({
        zh: "项目规则优先；外部规范按语言和任务选用。选择规则不等于验证通过；缺少实际检查或评审证据时保持未验证。",
        en: "Project rules take precedence. Select external guidance by language and task; selection is not verification. Missing check or review evidence remains unverified."
      })
    })
  });
}

// spec §2 / E:13-28：14 个导出，顺序逐字保留。
export {
  ARTIFACTS,
  BUILTIN_CODING_GUIDES,
  CODING_STANDARD_RULES,
  CODING_STANDARD_SOURCES,
  REQUIRED_ARTIFACTS,
  evaluateArtifact,
  evaluateCheckpoint,
  evaluateGate,
  parseUmaSshTarget,
  redactDevelopmentText,
  requiredArtifacts,
  selectCodingStandards,
  splitFrontmatter,
  umaSshUri
};
