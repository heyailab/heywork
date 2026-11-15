---
description: "Pure Uma delivery artifact contract: artifact kinds, required set, frontmatter/body parsing, section and placeholder checks, gate blocking and source-backed coding guidance."
kind: "package-reference"
---

# @deepseek-ai/dsh-util-uma-delivery

English | [中文](README.zh.md)

## Summary

Exports the delivery artifact contract used by `dsh-tool-uma-workflow` and the Web Delivery Workbench. One pure module keeps the Host gate and the Client dashboard on identical artifact kinds, section checks, placeholder rules, and blocking order, so the dashboard can recompute status from `.uma/` files without a Host tool call or model request.

## Table of Contents

- [Use this package](#use-this-package)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Import the contract from either plane:

```ts
import { evaluateArtifact, evaluateGate } from '@deepseek-ai/dsh-util-uma-delivery'

const content = '# Goal\nExport workspace usage.\n\n# Acceptance\nThe CSV includes each visible row.'
const evaluated = evaluateArtifact('prd', content)
const gate = evaluateGate([{ artifact: 'prd', ready: evaluated.ready }])
```

`requiredArtifacts(depth, phase)` and `evaluateCheckpoint` size document checks for a patch, feature, or product and distinguish pre-implementation documents from handoff documents. Patches require no pipeline documents; features require a spec before implementation and spec/QA/handoff at delivery; product document review checks research/PRD/architecture/UIUX without demanding future QA or delivery files. These functions establish document completeness, never command execution, user approval, or deployment.

`evaluateArtifact` returns frontmatter `status`, `owner`, and `updated`, the Markdown `body`, unmatched section patterns, placeholder markers, and `ready`. `evaluateGate` returns `ready`, missing required artifacts, and blocked artifacts in missing-then-unready order.

The main entry also exports `CODING_STANDARD_SOURCES`, `CODING_STANDARD_RULES`, `BUILTIN_CODING_GUIDES` and `selectCodingStandards`. One immutable catalog contains 12 official source groups, 23 conditional rules and 14 original bilingual technical guides with source/license pointers. Explicit language/domain tags select applicable content; unknown stacks do not guess a framework, and general guidance can be excluded. Project conventions take precedence over incompatible style preferences. Selection is not verification: configured checks need actual receipts, and review-only obligations need explicit evidence.

The model-facing workbench consumer exposes selected rule and source metadata together with discovered project check names, while the knowledge UI materializes selected guide bodies through the Host's atomic non-replacing note admission. This module itself reads no files, writes no knowledge, changes no permissions and submits no provider request.

Desktop operations consumers share the validated SSH destination format and the write-only `OperationsVaultBridge`. Public profile results contain connection metadata and the verified host fingerprint.

<a id="model-experience"></a>
## Model Experience

### No model surface

#### What the model sees

The package registers no tool, prompt section or Session event. Its owners can expose evaluation results and selected coding guidance through their normal tools and knowledge retrieval; for example, `coding_inspect` with `mode: standards` reads the data selected by `selectCodingStandards`. A catalog source, imported guide or selected rule is not a compliance certificate.

#### Token effect

The pure module makes no model request. Downstream tools and knowledge contributors own bounded model-visible results and any provider use.

#### KV Cache effect

None; the package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Section checks are keyword heuristics shared with the Host tool, not a complete document schema.
- Frontmatter timestamps are returned verbatim; formatting and timezone display belong to the caller.
- The curated standards do not cover every language or organization. Guide versions identify the bundled original summaries, and source observation dates do not certify current user code or publisher endorsement.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

The Host tool and the Delivery Workbench both import this module; changing a check here intentionally changes both surfaces together.

</details>
