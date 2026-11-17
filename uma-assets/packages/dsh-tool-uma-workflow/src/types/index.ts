/**
 * 【逆向还原】由 `lib/index.js` 的 `//#region lib/types/index.js` 反推，非 DeepSeek 原始源码。
 *
 * name / inject / apply 为包级导出面；ctx、args、exec 等 interface 由调用点推断。
 * 三个工具（uma_artifact_write / uma_artifact_read / uma_gate_status）的参数、输出 schema、
 * render 文本、gate 分级（patch/feature/product × documents/delivery）与全部错误文本
 * 与 lib 逐行一致，未作"修正"。运行时仍以 lib/*.js 为准，详见 src/README.md。
 */
import { ToolContextUnavailableError, defineTool } from '@deepseek-ai/dsh-tools'
import { ARTIFACTS, evaluateArtifact, evaluateCheckpoint, requiredArtifacts } from '@deepseek-ai/dsh-util-uma-delivery'

/** 工件种类；取值与 dsh-util-uma-delivery 的 ARTIFACTS 一致（该包无 .d.ts，故本地列出）。 */
export type ArtifactKind = 'research' | 'prd' | 'architecture' | 'uiux' | 'spec' | 'preview' | 'qa' | 'delivery'

/** uma_artifact_write 的参数。 */
export interface WriteArgs {
  artifact: ArtifactKind
  content: string
  status?: 'draft' | 'approved'
  owner?: string
}

/** uma_artifact_read 的参数。 */
export interface ReadArgs {
  artifact: ArtifactKind
}

/** uma_gate_status 的参数；缺省 depth=product、phase=delivery。 */
export interface GateArgs {
  depth?: 'patch' | 'feature' | 'product'
  phase?: 'documents' | 'delivery'
}

/** 工具执行上下文的最小形状。 */
export interface WorkflowExec {
  agent?: {
    id: string
    session: unknown
  }
  signal: AbortSignal
}

/** 解析后的文件系统目标；displayPath 为模型可见路径。 */
export interface FsTarget {
  displayPath: string
}

/** listDir 返回的条目。 */
export interface DirEntry {
  type: string
  name: string
  target: FsTarget
}

/** sandboxPolicy 服务的形状（resolve 的具体返回类型不属于本模块）。 */
export interface SandboxPolicy {
  resolve(request: { session: unknown }): unknown
}

/** apply 所需 Context 的最小形状。 */
export interface WorkflowContext {
  tools: {
    register(tool: unknown): void
  }
  get(key: string): SandboxPolicy | undefined
  fs: {
    sandboxMode?: string
    resolve(path: string, options: { cwd: string; signal: AbortSignal }): Promise<FsTarget>
    writeText(target: FsTarget, content: string, intent: unknown, signal: AbortSignal, sandbox: unknown): Promise<void>
    readText(target: FsTarget, signal: AbortSignal): Promise<string>
    listDir(directory: FsTarget, signal: AbortSignal): Promise<DirEntry[]>
  }
  workingDirectory: {
    ensure(agent: NonNullable<WorkflowExec['agent']>, signal: AbortSignal): Promise<string>
  }
  waterfall(name: string, target: FsTarget, exec: WorkflowExec, fallback: () => void): Promise<unknown>
}

/** Cordis plugin identity. */
export const name = "tool-uma-workflow";
/** Tool, filesystem, and working-directory services used by the artifact tools. */
export const inject = [
  "tools",
  "fs",
  "workingDirectory"
];

function compose(artifact: ArtifactKind, status: string, owner: string, content: string): string {
  return `---\nartifact: ${artifact}\nstatus: ${status}\nowner: ${owner}\nupdated: ${(/* @__PURE__ */ new Date()).toISOString()}\n---\n\n${content.trim()}\n`;
}

/**
* Register the `.uma/` artifact tools.
* @param ctx - Context carrying the tool, filesystem, and working-directory services.
*/
export function apply(ctx: WorkflowContext): void {
  ctx.tools.register(defineTool({
    name: "uma_artifact_write",
    description: "Write a controlling delivery artifact under `.uma/` in the current workspace: research, prd, architecture, uiux, spec, preview, qa, or delivery. Returns missing required sections and placeholder warnings so the artifact can be fixed before a confirmation gate.",
    parameters: {
      artifact: {
        type: "string",
        required: true,
        enum: [...ARTIFACTS],
        description: "Artifact kind; the file is `.uma/<artifact>.md`."
      },
      content: {
        type: "string",
        required: true,
        description: "Markdown body without frontmatter."
      },
      status: {
        type: "string",
        enum: ["draft", "approved"],
        description: "Review status written to the frontmatter. Defaults to draft."
      },
      owner: {
        type: "string",
        description: "Artifact owner written to the frontmatter. Defaults to uma-team."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          path: {
            type: "string",
            required: true
          },
          artifact: {
            type: "string",
            required: true,
            enum: [...ARTIFACTS]
          },
          status: {
            type: "string",
            required: true,
            enum: ["draft", "approved"]
          },
          bytes: {
            type: "integer",
            required: true
          },
          missingSections: {
            type: "array",
            required: true,
            items: { type: "string" }
          },
          placeholders: {
            type: "array",
            required: true,
            items: { type: "string" }
          },
          ready: {
            type: "boolean",
            required: true
          }
        }
      },
      render: (_args: WriteArgs, value: { path: string; bytes: number; status: string; missingSections: string[]; placeholders: string[] }) => [{
        type: "text",
        text: [
          `Wrote ${value.path} (${value.bytes} bytes, ${value.status}).`,
          value.missingSections.length === 0 ? "Required sections present." : `Missing section checks: ${value.missingSections.join(", ")}.`,
          value.placeholders.length === 0 ? "No placeholder markers." : `Placeholders to resolve: ${value.placeholders.join(", ")}.`
        ].join("\n")
      }]
    },
    async execute(args: WriteArgs, exec: WorkflowExec) {
      if (exec.agent === void 0) throw new Error("uma_artifact_write requires an agent Session");
      if (args.content.trim().length === 0) throw new Error("uma_artifact_write requires non-empty content");
      const status = args.status ?? "draft";
      const owner = args.owner ?? "uma-team";
      const content = compose(args.artifact, status, owner, args.content);
      const policy = ctx.get("sandboxPolicy");
      if (ctx.fs.sandboxMode !== void 0 && policy === void 0) throw new ToolContextUnavailableError("Artifact writes require the mounted filesystem’s sandbox policy service");
      const sandbox = policy?.resolve({ session: exec.agent.session });
      const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
      const target = await ctx.fs.resolve(`.uma/${args.artifact}.md`, {
        cwd,
        signal: exec.signal
      });
      const intent = await ctx.waterfall("fs/write-intent", target, exec, () => void 0);
      await ctx.fs.writeText(target, content, intent, exec.signal, sandbox);
      const evaluated = evaluateArtifact(args.artifact, args.content);
      return {
        path: target.displayPath,
        artifact: args.artifact,
        status,
        bytes: Buffer.byteLength(content, "utf8"),
        missingSections: evaluated.missingSections,
        placeholders: evaluated.placeholders,
        ready: evaluated.ready
      };
    },
    presentCall: (args: WriteArgs) => ({
      card: "generic",
      title: `Write .uma/${args.artifact}.md`,
      kind: "other",
      rawInput: args
    })
  }));
  ctx.tools.register(defineTool({
    name: "uma_artifact_read",
    description: "Read a controlling delivery artifact from `.uma/<artifact>.md` in the current workspace.",
    parameters: { artifact: {
      type: "string",
      required: true,
      enum: [...ARTIFACTS],
      description: "Artifact kind to read."
    } },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          path: {
            type: "string",
            required: true
          },
          artifact: {
            type: "string",
            required: true,
            enum: [...ARTIFACTS]
          },
          content: {
            type: "string",
            required: true
          }
        }
      },
      render: (_args: ReadArgs, value: { content: string }) => [{
        type: "text",
        text: value.content
      }]
    },
    async execute(args: ReadArgs, exec: WorkflowExec) {
      if (exec.agent === void 0) throw new Error("uma_artifact_read requires an agent Session");
      const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
      const target = await ctx.fs.resolve(`.uma/${args.artifact}.md`, {
        cwd,
        signal: exec.signal
      });
      const content = await ctx.fs.readText(target, exec.signal);
      return {
        path: target.displayPath,
        artifact: args.artifact,
        content
      };
    },
    presentCall: (args: ReadArgs) => ({
      card: "generic",
      title: `Read .uma/${args.artifact}.md`,
      kind: "other",
      rawInput: args
    })
  }));
  ctx.tools.register(defineTool({
    name: "uma_gate_status",
    description: "Report the delivery state of the `.uma/` artifacts: which controlling documents exist, their review status, missing sections, placeholder markers, and the exact artifacts that block delivery. Use before a confirmation gate, before reporting completion, or when resuming work.",
    parameters: {
      depth: {
        type: "string",
        enum: [
          "patch",
          "feature",
          "product"
        ],
        description: "patch: no ceremonial documents; feature: spec, QA and handoff; product: full pipeline. Defaults to product."
      },
      phase: {
        type: "string",
        enum: ["documents", "delivery"],
        description: "documents checks only the pre-implementation documents; delivery checks handoff documents. Defaults to delivery."
      }
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          exists: {
            type: "boolean",
            required: true
          },
          ready: {
            type: "boolean",
            required: true
          },
          missing: {
            type: "array",
            required: true,
            items: { type: "string" }
          },
          blocked: {
            type: "array",
            required: true,
            items: { type: "string" }
          },
          artifacts: {
            type: "array",
            required: true,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                artifact: {
                  type: "string",
                  required: true,
                  enum: [...ARTIFACTS]
                },
                status: {
                  type: "string",
                  required: true
                },
                ready: {
                  type: "boolean",
                  required: true
                },
                missingSections: {
                  type: "array",
                  required: true,
                  items: { type: "string" }
                },
                placeholders: {
                  type: "array",
                  required: true,
                  items: { type: "string" }
                }
              }
            }
          }
        }
      },
      render: (_args: GateArgs, value: { exists: boolean; ready: boolean; missing: string[]; blocked: string[]; artifacts: { artifact: ArtifactKind; status: string; ready: boolean; missingSections: string[]; placeholders: string[] }[] }) => [{
        type: "text",
        text: [
          value.exists ? "Uma delivery state:" : "No .uma directory exists.",
          "Document checks only; this result does not prove tests, human approval or deployment.",
          value.ready ? "Ready: every required artifact is present and clean." : `Blocked: ${value.blocked.join(", ")}.`,
          ...value.missing.length === 0 ? [] : [`Missing required artifacts: ${value.missing.join(", ")}.`],
          ...value.artifacts.map((artifact) => [
            `- ${artifact.artifact} (${artifact.status}, ${artifact.ready ? "ready" : "not ready"})`,
            ...artifact.missingSections.length === 0 ? [] : [`  missing sections: ${artifact.missingSections.join(", ")}`],
            ...artifact.placeholders.length === 0 ? [] : [`  placeholders: ${artifact.placeholders.join(", ")}`]
          ].join("\n"))
        ].join("\n")
      }]
    },
    async execute(args: GateArgs, exec: WorkflowExec) {
      if (exec.agent === void 0) throw new Error("uma_gate_status requires an agent Session");
      const depth = args.depth ?? "product";
      const phase = args.phase ?? "delivery";
      const cwd = await ctx.workingDirectory.ensure(exec.agent, exec.signal);
      const directory = await ctx.fs.resolve(".uma", {
        cwd,
        signal: exec.signal
      });
      let entries: DirEntry[];
      try {
        entries = await ctx.fs.listDir(directory, exec.signal);
      }
      catch (error) {
        if ((error as { code?: string }).code === "FS_NOT_FOUND") {
          const missing = [...requiredArtifacts(depth, phase)];
          return {
            exists: false,
            ready: missing.length === 0,
            missing,
            blocked: missing,
            artifacts: []
          };
        }
        throw error;
      }
      const artifacts: { artifact: ArtifactKind; status: string; ready: boolean; missingSections: string[]; placeholders: string[] }[] = [];
      for (const entry of entries) {
        if (entry.type !== "file") continue;
        const name = entry.name.replace(/\.md$/u, "");
        if (!ARTIFACTS.includes(name)) continue;
        const artifact = name as ArtifactKind;
        const evaluated = evaluateArtifact(artifact, await ctx.fs.readText(entry.target, exec.signal));
        artifacts.push({
          artifact,
          status: evaluated.status,
          ready: evaluated.ready,
          missingSections: evaluated.missingSections,
          placeholders: evaluated.placeholders
        });
      }
      artifacts.sort((left, right) => ARTIFACTS.indexOf(left.artifact) - ARTIFACTS.indexOf(right.artifact));
      const gate = evaluateCheckpoint(artifacts, depth, phase);
      return {
        exists: true,
        ready: gate.ready,
        missing: gate.missing,
        blocked: gate.blocked,
        artifacts
      };
    },
    presentCall: () => ({
      card: "generic",
      title: "Check Uma delivery gates",
      kind: "other"
    })
  }));
}
