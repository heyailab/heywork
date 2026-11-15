---
description: "Model-facing `.uma/` delivery artifact tools: write and read the controlling documents and report missing sections or placeholder markers."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-uma-workflow

English | [中文](README.zh.md)

## Summary

Use `uma_artifact_write` and `uma_artifact_read` to maintain research, PRD, architecture, UI/UX, spec, preview, QA, and delivery documents in `.uma/` under the Session’s working directory.

Writes use `ctx.fs`, the `fs/write-intent` waterfall, and the calling Session’s sandbox policy: authorized workspace writes succeed, while read-only Sessions remain denied. Permissions never expand. The tools add frontmatter, validate required sections, and report placeholders through `@deepseek-ai/dsh-util-uma-delivery`, sharing readiness checks and blocking rules with the Web Delivery Workbench.

## Table of Contents

- [Use this package](#use-this-package)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Mount it beside the tool, filesystem, and working-directory services in an agent preset:

```yaml
- id: tool-uma-workflow
  name: '@deepseek-ai/dsh-tool-uma-workflow'
```

### Tools

| Tool | Purpose |
|---|---|
| `uma_artifact_write` | Write `.uma/<artifact>.md` with status, owner, section checks, and placeholder warnings |
| `uma_artifact_read` | Read one artifact from the current workspace |
| `uma_gate_status` | Report which required artifacts are missing or not ready and what blocks delivery |

`uma_gate_status` accepts `depth` (`patch`, `feature`, `product`) and `phase` (`documents`, `delivery`). Omitting both preserves full-product delivery checks. Before reviewing product documents, use `depth: product, phase: documents`; future implementation and QA artifacts do not block that checkpoint. A patch may pass document checks with no `.uma/` directory. This never reports test execution, user approval, or deployment success.

The write result reports `ready: true` only when every required section for that artifact kind is present and no `TODO`, `TBD`, `FIXME`, `XXX`, or `Lorem ipsum` marker remains. A draft may still be written; the model decides whether to resolve the findings before a confirmation gate.

| Artifact | Required section checks |
|---|---|
| `research` | findings, open questions |
| `prd` | goals, acceptance |
| `architecture` | components, data, API |
| `uiux` | tokens, states, responsive |
| `spec` | tasks, acceptance |
| `preview` | preview |
| `qa` | gate/result |
| `delivery` | delivery |

English and common Chinese headings both satisfy the checks.

<a id="model-experience"></a>
## Model Experience

### Delivery artifact tools

#### What the model sees

The model sees `uma_artifact_write`, `uma_artifact_read`, and `uma_gate_status`. A write returns a readiness report with missing section checks and placeholder warnings; a read returns the artifact body; the gate tool returns the required artifacts that are missing or not ready.

#### Token effect

The tool schemas are static. A write result is a compact report; the artifact body remains in the workspace and enters the request only when the model reads it.

#### KV Cache effect

The tool schemas are static and prefix-stable. Artifact contents live in the workspace and are appended to the session log only when read.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The section checks are keyword heuristics, not a complete document schema.
- The tools do not version artifacts beyond the frontmatter timestamp; Git owns history.
- A write replaces the whole artifact; targeted edits use the ordinary filesystem tools.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Artifact order and required-section heuristics are mirrored by the Delivery Workbench page; update `delivery-catalog.ts` beside this file when the contract changes.

</details>
