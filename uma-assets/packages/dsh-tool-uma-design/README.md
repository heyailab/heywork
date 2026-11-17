---
description: "Native tools that inspect project design inputs, retrieve sourced UI rules and read bundled design references."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-uma-design

English | [中文](README.zh.md)

## Summary

Ground UI changes in the project’s existing brand, design files and declared frontend stack before choosing inspiration. Read exact, bounded design inputs, continue durable design projects, and select a suitable installed system from the full design-system and DESIGN.md reference catalogs. Explicit user selections, copied design prompts and natural-language style requests take precedence; otherwise the Agent selects by product, audience, density and existing brand. It records the choice in DESIGN.md and reuses it across pages while preserving approved project rules.

## Table of Contents

- [Use this package](#use-this-package)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Automatic design teammates honor explicit requests to work alone or not start members. A negated action in another clause, such as not changing an API, does not cancel an explicit request for a designer. Team mode and plan-mode restrictions continue to apply; read-only preparation may still run in the current conversation.

`design_project_create` requires project-authored `design`, `tokens` and `components` alongside the project identity. It does not copy internal reference files into the workspace. Complete reference-file copies are rejected, public project metadata omits internal reference identifiers, and ordinary tool presentation shows only project identity. Existing project files remain unchanged unless overwrite is explicit.

Design project writes use the calling Session’s sandbox policy and existing write-intent checks. A workspace-write Session can create the selected project files; a read-only Session cannot. No automatic permission escalation occurs.

Mount it beside the tool registry in an agent preset:

```yaml
- id: tool-hey-design
  name: '@deepseek-ai/dsh-tool-uma-design'
```

| Field | Default | Meaning |
|---|---|---|
| `projectWrite` | `true` | Expose design project creation; `false` keeps reference and inspection tools without workspace scaffolding |
| `assetRoot` | the `dsh-skill-uma` package assets | Absolute directory containing `uma-design-systems/` and `uma-design-md/` |
| `contextFileBytes` | `32768` | Maximum bytes per project design input |
| `contextTotalBytes` | `98304` | Maximum bytes across one design-context result |
| `ruleMaxResults` | `10` | Maximum complete rule records per search |
| `previewMaxBytes` | `262144` | Complete prototype source byte cap |
| `catalogMaxPageSize` | `100` | Maximum explicitly requested design catalog page size |

`design_asset_list` accepts optional `query`, `category`, `offset` and `limit`. Search includes canonical ids, display names and aliases. Results include the matched `total`, page `offset`, and `nextOffset` when another page exists. Omitting the page size retains the complete matching catalog. Use search or bounded pages for large libraries; every returned id remains readable by `design_asset_get`.

### Tools

| Tool | Purpose |
|---|---|
| `design_preview` | Snapshot actual saved HTML into bounded presentation metadata; static UI preview is not runtime verification |
| `design_rule_search` | Retrieve complete UX, visual and stack rules with source record ordinals |
| `design_context` | Read project rules, tokens, declared stack and exact input hashes without writing files |
| `design_asset_list` | List systems with category and purpose, plus reference names |
| `design_project_create` | Scaffold `.design/<project>/` with a contract from a bundled system |
| `design_project_status` | List design projects or report one project’s contract files |
| `design_asset_get` | Read `DESIGN.md`, tokens, and optional component markup for one asset |
| `hey_knowledge_search` | Search role methods, anti-slop rules, quality checklists, templates, and craft references |

`design_rule_search` reads the installed UI/UX corpus through the local resource store without launching Python or another agent. It uses BM25 and supported Chinese query expansion; an unmatched query returns no recommendation. Stack ids are restricted to installed CSV names. Returned records preserve complete fields and code examples, with record ordinals counting the header as one; these are not physical line numbers for multiline CSV. The corpus is a local reference, not verified current upstream documentation.

`design_context` reads fixed design filenames from the execution directory, an explicit relative monorepo target, and an optional `.design/<project>/`. It also reads `design-system/MASTER.md` and, for an explicit project/page, `design-system/<project>/MASTER.md` and its page override. Missing files are reported; oversized, non-file and budget omissions make the result incomplete. Invalid JSON, directory symlinks, canonical escapes, binary data and concurrent file changes fail visibly. Framework names reflect declared dependencies, not verified installed components. The fingerprint covers only these design inputs, not every implementation file.

The plugin adds a stable design-workflow system section wherever mounted. Approved branding and existing components take precedence over bundled inspiration. Production changes use the existing framework; single-file HTML requires an explicit prototype request. Visual and interaction acceptance still require actual rendered evidence.

`design_asset_get` accepts only names discovered at load and only the fixed asset file names. Reads are bounded per file and per call; a truncated file is marked in the result. `files[].path` and output headings contain virtual `hey-design://systems/<name>/<file>` or `hey-design://brands/<name>/<file>` references, never the installation directory. Knowledge results use `hey-knowledge://` references. These identifiers are not filesystem paths; retrieve content through the design tools. The model receives guidance to explain style choices without quoting internal identifiers. Project-owned files retain their normal paths.

Public catalog reads include a display name, types of files actually read and a truncation flag in presentation metadata. Custom asset roots and internal Markdown references receive no public identity. Project scaffolding writes the project-authored design, tokens and components under `.design/<project>/`.

The shipped standard, PTC and HEY design presets mount `@deepseek-ai/dsh-tool-uma-design/automatic` with automatic intent detection and designer activation disabled. The Agent judges intent and calls `design_begin` to read the workspace and load the applicable craft, brief, mode and review methods. It can call `design_stop` to leave design work. Follow-up choices and the selected project recover from the Session projection. Custom profiles can enable bounded intent detection with `autoDetect`. With detection, `teamDesign` and Team mode enabled, an explicit UI implementation can start one named, read-only design teammate on the current model route; planning mode skips this delegation.

### Automatic preparation

`@deepseek-ai/dsh-tool-uma-design/automatic` uses its own configuration: `autoDetect` defaults to `true`, `fileBytes` to `16384`, `projectBytes` to `24576`, `contextBytes` to `65536` and `candidateLimit` to `3`. Optional `assetRoot` is absolute and defaults to the packaged assets. Missing or disabled required methods fail preparation before dependent implementation; cancellation and unload join owned reads. Explicit UI requests, follow-up choices and semantic `design_begin` calls use the same Session. Operational context messages do not replace the human task. The Agent selects the actual reference; the runtime does not force a brand or guarantee aesthetics.

For a new UI or redesign, automatic preparation asks the Agent to apply the selected layout and component patterns and record a visual verdict separately from functional checks. A design teammate's handoff includes composition, content and asset needs, and concrete visual checks.

`hey_resource_read` reads installed skill text through a skill name and relative path. Omit `path` to browse; continue with the returned byte offset for text or entry offset for directories. `resourceMaxBytes` defaults to 32768 and bounds the complete rendered page. Absolute paths, parent traversal, escaping symlinks and non-UTF-8 content are rejected without returning physical installation paths. Configure the same `assetRoot` for the skill provider, these tools and automatic design preparation. Design asset output also counts UTF-8 bytes, including headings and truncation markers, against its total limit.

<a id="model-experience"></a>
## Model Experience

### Design asset tools

#### What the model sees

The model sees automatic task context when active, the native design-workflow system section, `design_begin`, `design_stop`, `design_preview`, `design_context`, `design_rule_search`, `design_asset_list`, `design_asset_get`, `design_project_create`, `design_project_status`, and `hey_knowledge_search`. The list tool returns system names, categories, purposes, and reference names; the get tool returns the requested DESIGN.md, tokens, and optional component markup; the knowledge tool returns ranked sections from the bundled delivery and design references. Bundled knowledge search prefers a complete phrase or several distinct matching terms over repetitions. It normalizes full-width input and searches Chinese phrases from the local handoff and terminology references.

#### Token effect

The prompt section and tool schemas are static. Automatic preparation is recorded through normal runtime-context messages. Preview HTML stays in bounded replayable presentation metadata while the model receives its path and digest. Project context is returned as logged tool output, with exact file hashes and explicit omissions. Asset results carry only the requested asset files, bounded per file and per call; a truncated file is marked in the result.

#### KV Cache effect

The tool schemas are static and prefix-stable. Tool results vary by request and are appended to the session log as ordinary tool output.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The assets are fixed at package install time; the tools do not watch for changes.
- Brand systems describe third-party visual identities and are structural references, not trademark licenses.
- Component markup is returned as source text; the tools do not render or validate it.
- Context inspection does not run a browser, exercise interactions, prove component-library integration or guarantee visual quality. REVIEW.md records must name actual evidence and unverified work.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

The default asset root resolves through the installed `dsh-skill-uma` package; an explicit `assetRoot` must contain both `uma-design-systems/` and `uma-design-md/`.

</details>
