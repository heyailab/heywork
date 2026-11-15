---
description: "Web tool cards for the design_asset_list and design_asset_get tools: system chips, token swatches, font previews, without reference-document open actions."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-uma-design

English | [中文](README.zh.md)

## Summary

Show persistent conversation cards for design, knowledge, Wiki and development-experience operations. A public UMA Design catalog read shows the display name and which resource types were retrieved. Private names, queries and source content are excluded. Project design, artifact and preview cards retain user-owned outputs and their readiness.

## Table of Contents

- [Use this package](#use-this-package)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Resource receipts are derived from existing tool calls and results and experience-recall messages. They remain outside collapsed work details and replay when history reopens. Expand a receipt to see the operation, timing and outcome. A successful public reference read carries a tagged display summary. Earlier results without that summary retain a generic receipt. Each receipt belongs to the conversation where the operation occurred, so the director reads an agreed catalog reference in the main conversation during a team handoff.

Mount it in the Web composition beside the other client Tool views:

```yaml
- id: ui-uma-design
  name: '@deepseek-ai/dsh-client-ui-uma-design'
```

The package carries dictionaries for the eight shipped Client languages. It reads tool result text and validated preview presentation metadata; no new Session event or Host API is introduced.

`design_preview` renders bounded, tagged HTML presentation metadata from the actual saved source in an opaque script-disabled frame, using the shared static sanitizer and restrictive network policy. Its path and digest identify that snapshot; it is not a build, interaction test or deployment. The frontend action continues the exact source conversation with an appended draft, retaining its execution directory. Missing workspace ownership or malformed metadata is visible and never substitutes another project. Tags and source previews consume the shared tag and code materials; preview actions retain the shared keyboard focus ring.

<a id="model-experience"></a>
## Model Experience

### Presentation only

#### What the model sees

Nothing. The cards render logged `design_asset_list`, `design_asset_get`, `uma_artifact_write`, and `uma_gate_status` tool results and register no tool, prompt section, or Session event.

#### Token effect

None; the cards never construct model input or change request tokens.

#### KV Cache effect

None; the package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Color extraction recognizes direct hex, rgb, and hsl values in CSS custom properties; `var()` and `color-mix()` values are skipped rather than resolved.
- Public reference receipts show retrieval status. Project artifact cards retain normal file access, and visual acceptance requires rendered evidence.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Tool result text remains the single source; the cards never infer success from a missing field. `card-text.ts` owns the parsing that both card families share.

</details>
