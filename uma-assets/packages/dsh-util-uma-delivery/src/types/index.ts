/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/index.js` 反推，非 DeepSeek 原始源码。
 *
 * Pure Uma delivery artifact contract shared by the Host tools and the Web
 * Delivery Workbench: artifact kinds, required artifacts, frontmatter fields,
 * section checks, placeholder detection, gate blocking, and source-backed coding guidance.
 *
 * 工件分级（patch 返回空 / feature 按 documents|delivery 分段 / product 全量）、
 * 正则、缺失字段判定与 gate 逻辑逐行等价；类型由调用点推断，运行时仍以 lib/*.js 为准。
 */
import { selectCodingStandards, BUILTIN_CODING_GUIDES, CODING_STANDARD_RULES, CODING_STANDARD_SOURCES } from './coding-standards.ts'
import { parseUmaSshTarget, umaSshUri } from './ssh-target.ts'
import { redactDevelopmentText } from './redact.ts'

/** 八个受控工件种类，按流水线顺序。 */
export type ArtifactKind = 'research' | 'prd' | 'architecture' | 'uiux' | 'spec' | 'preview' | 'qa' | 'delivery'

/** 开发范围分级。 */
export type DeliveryDepth = 'patch' | 'feature' | 'product'

/** 检查点阶段。 */
export type DeliveryPhase = 'documents' | 'delivery'

/** 交付前必须存在的工件种类。 */
export type RequiredArtifactKind = Exclude<ArtifactKind, 'preview'>

/**
* Pure Uma delivery artifact contract shared by the Host tools and the Web
* Delivery Workbench: artifact kinds, required artifacts, frontmatter fields,
* section checks, placeholder detection, gate blocking, and source-backed coding guidance.
* @module @deepseek-ai/dsh-util-uma-delivery
*/
/** Every controlling artifact kind, in pipeline order. */
export const ARTIFACTS: readonly ArtifactKind[] = [
  "research",
  "prd",
  "architecture",
  "uiux",
  "spec",
  "preview",
  "qa",
  "delivery"
];

/**
* Select document obligations proportionally to the requested development scope.
* @param depth - Small correction, feature, or complete product workflow.
* @param phase - Current checkpoint; future documents cannot block an earlier checkpoint.
* @returns The artifact kinds required at this checkpoint, in pipeline order.
*/
export function requiredArtifacts(depth: DeliveryDepth, phase: DeliveryPhase): ArtifactKind[] {
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
/** Artifacts that must exist before delivery. */
export const REQUIRED_ARTIFACTS: readonly RequiredArtifactKind[] = [
  "research",
  "prd",
  "architecture",
  "uiux",
  "spec",
  "qa",
  "delivery"
];
/** Section checks reported for each artifact; at least one pattern must match the body. */
export const REQUIRED_SECTIONS: Record<ArtifactKind, RegExp[]> = {
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

/** splitFrontmatter 的返回形状。 */
export interface SplitFrontmatter {
  frontmatter: string
  body: string
}

/**
* Split a Markdown artifact into its leading frontmatter and body.
* @param content - complete artifact file text.
* @returns the frontmatter text without delimiters and the body.
*/
export function splitFrontmatter(content: string): SplitFrontmatter {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(content);
  return match === null ? {
    frontmatter: "",
    body: content
  } : {
    frontmatter: match[1] ?? "",
    body: content.slice(match[0].length)
  };
}

/** Placeholder markers that keep a delivery artifact from being ready. */
export function placeholdersIn(body: string): string[] {
  return [...new Set([...body.matchAll(/\b(TODO|TBD|FIXME|XXX)\b|lorem ipsum/giu)].map((match) => match[0].toUpperCase()))];
}

/** evaluateArtifact 的返回形状。 */
export interface ArtifactEvaluation {
  status: 'draft' | 'approved' | 'unknown'
  owner: string | null
  updated: string | null
  body: string
  missingSections: string[]
  placeholders: string[]
  ready: boolean
}

/**
* Evaluate one artifact body against its section checks and placeholders.
* @param artifact - artifact kind whose checks apply.
* @param content - complete artifact file text, including optional frontmatter.
* @returns frontmatter fields, body, findings, and readiness.
*/
export function evaluateArtifact(artifact: ArtifactKind, content: string): ArtifactEvaluation {
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

/** gate 判定读取的最小工件条目形状（其余字段由调用方附加）。 */
export interface ArtifactCheck {
  artifact: ArtifactKind
  ready: boolean
  status?: string
  missingSections?: string[]
  placeholders?: string[]
}

/** evaluateGate / evaluateCheckpoint 的返回形状。 */
export interface GateResult {
  ready: boolean
  missing: ArtifactKind[]
  blocked: ArtifactKind[]
}

/**
* Evaluate the delivery gate from the artifacts present in a workspace.
* @param artifacts - one entry per present artifact.
* @returns readiness plus the missing and blocked artifact kinds.
*/
export function evaluateGate(artifacts: ArtifactCheck[]): GateResult {
  const present = new Set(artifacts.map((entry) => entry.artifact));
  const missing = REQUIRED_ARTIFACTS.filter((artifact) => !present.has(artifact));
  const blocked = [...missing, ...artifacts.filter((entry) => !entry.ready).map((entry) => entry.artifact)];
  return {
    ready: blocked.length === 0,
    missing,
    blocked
  };
}

/**
* Evaluate only the documents required by the selected scope and checkpoint.
* @param artifacts - Observed artifact checks; these are not executable test evidence or user approval.
* @param depth - Selected development scope.
* @param phase - Current checkpoint.
* @returns Document readiness without requiring later-stage or unrelated artifacts.
*/
export function evaluateCheckpoint(artifacts: ArtifactCheck[], depth: DeliveryDepth, phase: DeliveryPhase): GateResult {
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

/*
 * types/ 是五个 region 模块的聚合层：下面按 lib 末尾的单一 export 语句顺序汇总 14 个公开符号，
 * src/index.ts 再逐字复刻该导出面。ARTIFACTS / REQUIRED_ARTIFACTS 由本模块定义，
 * 其余来自 coding-standards / ssh-target / redact 三个兄弟模块。
 */
export {
  BUILTIN_CODING_GUIDES,
  CODING_STANDARD_RULES,
  CODING_STANDARD_SOURCES,
  parseUmaSshTarget,
  redactDevelopmentText,
  selectCodingStandards,
  umaSshUri
};
