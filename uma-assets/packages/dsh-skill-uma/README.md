---
description: "Bundled Uma design and delivery skills: anti-slop art direction, UI/UX intelligence, OpenDesign systems and templates, product-team roles, delivery documents, and quality gates."
kind: "package-reference"
---

# @deepseek-ai/dsh-skill-uma

English | [中文](README.zh.md)

## Summary

Registers the bundled Uma skill catalog on `ctx.skills`. The catalog gives the default Web agent on-demand skills: a product-delivery team workflow, PRD/architecture/UIUX documents, design taste and craft playbooks, searchable UI/UX data, production DESIGN.md references, complete design systems, prototypes, dashboards, wireframes, mobile screens, decks, Apple platform review, design review, and a delivery quality gate.

## Table of Contents

- [Use this package](#use-this-package)
- [Skills](#skills)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Editable source assets live in the repository’s `assets/`; installations read their container on demand. The provider validates every `SKILL.md` frontmatter at registration, rejects invalid or duplicate names, and exposes an opaque resource hint naming `uma_resource_read`; installed directories are not sent to the model.

Installations ship `resources.umadb`, not the `assets/` source tree. `pnpm run build:uma-resources` builds the local SQLite container; resources are compressed and sealed, then read directly without plaintext extraction. This prevents casual file browsing and direct Markdown copying, not extraction by a device owner who can inspect application code or memory. Maintainers keep editable source assets in the repository and rebuild the container. Skills remain model-invocable but are absent from user invocation menus.

Mount it beside a skill registry inside an agent preset:

```yaml
- id: skill-uma
  name: '@deepseek-ai/dsh-skill-uma'
```

| Field | Default | Meaning |
|---|---|---|
| `assetRoot` | packaged `assets/` | Absolute directory containing skill folders |

The provider scans direct child directories only, matching the `skill-filesystem` layout. A directory without `SKILL.md`, an invalid kebab-case name, or an empty description fails the plugin at load instead of silently dropping a bundled skill.

Custom profiles that load these bundled skills must also mount `@deepseek-ai/dsh-tool-uma-design` and its declared services to read their resources. Metadata-only catalog consumers do not need resource tools.

<a id="skills"></a>
## Skills

| Skill | Purpose |
|---|---|
| `uma-impact-analysis` | Source-grounded change impact and regression planning |
| `uma-code-review` | Read-only review of concrete regressions in local changes |
| `uma-debug` | Failure reproduction, diagnosis, authorized repair and regression evidence |
| `uma-team` | Full product-delivery pipeline and role routing |
| `uma-delivery-docs` | PRD, architecture, UI/UX, and spec documents |
| `uma-design-taste` | Anti-slop visual direction for pages and app screens |
| `uma-design-craft` | Shape, critique, audit, polish, harden, and DESIGN.md capture |
| `uma-design-system` | Searchable palettes, type pairings, styles, UX rules, and stacks |
| `uma-design-md` | Complete production DESIGN.md reference catalog |
| `uma-design-systems` | Installed design systems with tokens and component references |
| `uma-design-brief` | Structured design brief to DESIGN.md |
| `uma-web-prototype` | Single-file HTML prototype composition |
| `uma-dashboard` | Live dashboard with KPIs, activity, and task table |
| `uma-wireframe` | Annotated lo-fi wireframe with spec panel |
| `uma-mobile-app` | Mobile app screen in a realistic device frame |
| `uma-deck` | HTML presentation decks |
| `uma-apple-review` | Apple HIG platform review with cross-platform translation |
| `uma-design-review` | Rendered-interface design QA |
| `uma-quality-gate` | Deterministic pre-delivery gates |

Team authors, reviewers and coordinators receive read-only design catalog, context and built-in knowledge tools; only implementation presets expose design scaffolding. Authors and reviewers also receive workspace-scoped experience recall. The Wiki teammate owns source-cited discovery and affected-page updates; publication requires the Wiki freshness check. Disabled collections and unrelated workspaces remain excluded.

For UI work, the delivery designer inspects the installed system catalog and honors an explicit selection, a copied design prompt or a natural-language style request. Without a specified style, the designer selects by product, audience, density and existing brand, and records the choice and project-specific layout and component decisions in the design and UI/UX artifacts. Frontend applies those decisions to the product and QA compares the rendered result with the design separately from functional checks. Later pages reuse the choice and adapt it to approved project tokens and components.

The project director can search the local UMA terminology library with `uma_knowledge_search` when informal language leaves an implementation choice. The library covers interface design, backend, product, testing, tools, AI, version control and visual styles. Its design critique guide translates reported defects into verifiable handoffs.

The installed library comes from normalized runtime files rather than upstream research dumps. `scripts/sync-uma-design-library.ts` generates the complete catalog, lazy detail modules and `library-source.json` digests; `--check` verifies their correspondence. Reference manifests list only shipped files and use `uma-design-system-reference/v1`. Native project scaffolds use `uma-design-project/v1`; they do not advertise upstream preview or audit files that were not copied.

The expanded brand references use attributed Simple Icons identity metadata and UMA-authored product-domain recipes. Identity colors and source URLs are distinct from authored layout, typography and component choices; these kits are not official brand component libraries. Each kit includes offline DESIGN.md, tokens.css, components.html and manifest.json. The metadata license ships as BRAND-METADATA-LICENSE.txt. Run `pnpm run generate-uma-brand-references`, then `pnpm exec tsx scripts/sync-uma-design-library.ts`; `pnpm run verify-uma-design-library` rejects stale or incomplete kits instead of silently excluding them.

Component specimens are offline visual references inside a script-disabled iframe. Native fields and selectors remain usable; specimen action buttons do not implement a business backend. The static preview gate rejects scripts, handlers, remote assets, missing accessible labels and divergent default tokens. The browser quality lane checks every installed specimen at 316 (embedded phone preview), 390, 768 and 1280 CSS pixels in light and dark environments, including document overflow, clipped labels and field focus. Systems without a declared alternate palette retain their intended appearance. The iframe document resolves links to tokens.css and DESIGN.md into native disclosures containing those exact files, while copied project assets retain their sibling-file links.

<a id="model-experience"></a>
## Model Experience

### Skill catalog

#### What the model sees

The model sees one catalog entry per `SKILL.md` with its frontmatter name and description; the `skill` tool loads the selected body on demand. It loads a body only when it selects the skill. Descriptions are short enough for the default tool-result pruner; reference files stay on disk and are read only when the loaded skill directs it.

#### Token effect

Catalog descriptions are fixed per session. Loading a skill adds its body to the turn as a tool result; reference files add tokens only when read.

#### KV Cache effect

The catalog is stable for a running session. Asset edits reach the next catalog lookup; a live Agent keeps its existing composition.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The bundled brand references and design systems describe third-party visual identities; they are structural references, not trademark licenses.
- Apple Human Interface Guidelines text is not bundled.
- The provider does not watch `assets/` for changes; a restart or plugin reload refreshes the catalog.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

The catalog is the runtime source for the Design Studio and Delivery Workbench static projections; keep package descriptions and workbench category summaries aligned when adding a skill.

</details>
