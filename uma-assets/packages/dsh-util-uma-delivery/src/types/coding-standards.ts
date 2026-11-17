/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/coding-standards.js` 反推，非 DeepSeek 原始源码。
 *
 * 三个集合与 selectCodingStandards 属于包级公开导出面；ALIASES / freezeRule / freezeGuide
 * 为模块内部实现。类型自洽推断：冻结后字段按 readonly 描述；数组顺序与全部字符串/正则与 lib 逐字一致。
 * 运行时仍以 lib/*.js 为准，详见 src/README.md。
 */
import {
  ENGINEERING_SOURCES,
  ENGINEERING_RULES,
  ENGINEERING_GUIDES,
  type EngineeringSource,
  type LocalizedText,
  type RuleLevel,
  type VerificationMethod,
} from './engineering-guides.ts'

/** 冻结后的规则：Object.freeze 递归冻结 languages / sourceIds / summary。 */
export interface CodingStandardRule {
  readonly id: string
  readonly languages: readonly string[]
  readonly sourceIds: readonly string[]
  readonly level: RuleLevel
  readonly summary: Readonly<LocalizedText>
  readonly verification: VerificationMethod
}

/** 冻结后的指南：Object.freeze 递归冻结 languages / sourceIds / title / body。 */
export interface CodingStandardGuide {
  readonly id: string
  readonly version: string
  readonly languages: readonly string[]
  readonly sourceIds: readonly string[]
  readonly title: Readonly<LocalizedText>
  readonly body: Readonly<LocalizedText>
}

/** Source-backed coding guidance shared by model tools and built-in technical knowledge. */
export const CATALOG_VERSION = "2026.11.12.1"

function freezeRule(value: CodingStandardRule): CodingStandardRule {
  return Object.freeze({
    ...value,
    languages: Object.freeze([...value.languages]),
    sourceIds: Object.freeze([...value.sourceIds]),
    summary: Object.freeze({ ...value.summary })
  })
}

function freezeGuide(value: CodingStandardGuide): CodingStandardGuide {
  return Object.freeze({
    ...value,
    languages: Object.freeze([...value.languages]),
    sourceIds: Object.freeze([...value.sourceIds]),
    title: Object.freeze({ ...value.title }),
    body: Object.freeze({ ...value.body })
  })
}

/** Verified official source metadata; guide text below is original HEY synthesis. */
export const CODING_STANDARD_SOURCES = Object.freeze([
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
])

/** Conditional rule records; required-by-project needs the project's selected policy. */
export const CODING_STANDARD_RULES = Object.freeze([
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
])

/** One maintained bilingual guide set for both skill lookup and knowledge import. */
export const BUILTIN_CODING_GUIDES = Object.freeze([
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
])

/** 别名表：键含特殊字符（c# / c++ / .net / node.js），故用 Record 索引签名描述。 */
const ALIASES: Readonly<Record<string, string>> = Object.freeze({
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
})

/** selectCodingStandards 的可选参数形状。 */
export interface SelectionOptions {
  includeGeneral?: boolean
}

/** selectCodingStandards 的冻结返回体。 */
export interface CodingStandardsSelection {
  readonly catalogVersion: string
  readonly languages: readonly string[]
  readonly rules: readonly CodingStandardRule[]
  readonly guides: readonly CodingStandardGuide[]
  readonly sources: readonly EngineeringSource[]
  readonly policy: {
    readonly projectRulesFirst: boolean
    readonly selectedRulesAreNotVerified: boolean
    readonly requiredChecksNeedReceipts: boolean
    readonly notes: Readonly<LocalizedText>
  }
}

/**
* Select guidance only for explicit language/domain tags, plus optional general references.
* Unknown tags never guess a framework. Selection does not run tools or certify compliance.
* @param languages - project languages or task domains, such as typescript, go, backend or http-api.
* @param options - whether shared guidance participates; true unless explicitly disabled.
* @returns matching immutable guidance with references and verification boundaries.
*/
export function selectCodingStandards(languages: string[], options: SelectionOptions = {}): CodingStandardsSelection {
  const normalized = [...new Set(languages.map((value) => {
    const key = value.trim().toLowerCase();
    return ALIASES[key] ?? key;
  }).filter((value) => value !== "" && value !== "all"))].sort();
  const selected = new Set(normalized);
  if (selected.has("nodejs")) selected.add("javascript");
  const matches = (tags: readonly string[]) => tags.some((tag) => selected.has(tag) || tag === "all" && options.includeGeneral !== false);
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
  })
}
