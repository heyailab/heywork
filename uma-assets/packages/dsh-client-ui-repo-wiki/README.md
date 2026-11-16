---
description: "Browse project Wiki editions, generate source-backed knowledge and inspect progress, articles, cards and source references."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-repo-wiki

English | [中文](README.zh.md)

New Wiki generation requires an available default model before creating a Session. If none is selected, the page asks the user to sign in or configure and select a personal model.

## Summary

Open **Knowledge base → Project Wiki** to choose a registered workspace, generate Chinese or English knowledge, and browse articles alongside their source ranges. Generation is a real Agent task with durable per-page progress; pause, resume, incremental update and regeneration retain prior revisions. Export portable knowledge or import a bundle placed in the project. Imported local workspaces appear automatically; first generation starts only when requested.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The Web bundle mounts this page by default. **Generate Wiki** submits the configured task without replacing the current conversation draft. **Open generation task** reveals its full model/tool trace. Select a source reference for a bounded, version-checked preview.

The workspace list directly reuses local folders imported through the sidebar. No separate project registration or Git connection is required. The overview shows generation filters and real edition counts. Opening a project retains its collapsible document tree beside the overview and article reader.

```yaml
- id: ui-repo-wiki
  name: '@deepseek-ai/dsh-client-ui-repo-wiki'
```

| Field | Default | Meaning |
|---|---|---|
| `generationRefreshMs` | `3000` | Progress refresh interval during an active task |
| `autoUpdateIntervalMs` | `30000` | Source fingerprint check interval for enabled editions |
| `autoUpdateDebounceMs` | `1500` | Delay after development tasks finish |
| `autoGenerateOnOpen` | `false` | Generate a missing edition without a manual request |
| `autoUpdateDefault` | `true` | Initial automatic-update choice |

Generation settings apply to the next submitted generation/update. First generation is explicit by default. Automatic updates are selected by default and run only while the application is open. Source fingerprints detect uncommitted Git changes and changes in ordinary folders. One attempted update per fingerprint prevents repeated model consumption after a failed run; Retry from the failure notice to check the same source again, or resume a paused writing checkpoint manually.

The application stores the automatic-update choice per workspace and language on this installation. Clearing the checkbox revokes scheduling immediately; pause any already-running task separately. A stopped writing checkpoint requires manual resume. Concurrent checks share one request within the application instance.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The knowledge page owns `main.knowledge.wiki`; this plugin contributes its reader there and has no separate sidebar entry. Workspace and Session identities are explicit; the reader never borrows an unrelated current conversation. Read-only catalog, source observation and file reads use the `projectWiki` remote service with Workspace identity and need no associated Session; generation uses the Session Controller, and all UI-owned requests are cancelled when their owner leaves.

Mermaid is loaded only when a diagram preview is expanded. Strict parsing disables interactions and configuration overrides; the resulting SVG is displayed as an inert image. Article Markdown remains available, including its original diagram source. Read failures retain previously loaded content and provide a retry action.

The page and its editors use the shared [UI primitives](../ui-primitives/README.md) for page layout, cards and form controls; package styles own content arrangement.

</details>

Workspace cards separate identity, path, status and the shared action button. Paths are limited to two visible lines with the full value available on hover. A failed workspace read displays an unavailable message instead of a loading label.

<a id="model-experience"></a>
## Model Experience

### Explicit generation tasks

#### What the model sees

Generate, update, import and resume submit visible prompts to an ordinary `repo-wiki` Session. Reading and searching the page UI make no model request.

#### Token effect

Only submitted Agent tasks and explicitly enabled automatic updates consume model tokens.

#### KV Cache effect

Prompts use the normal Session pipeline; this page does not assemble provider requests.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Interface copy is Chinese and English, with English fallback for other application locales.
- Automatic scheduling belongs to the running client; it is not a durable Host queue or a reservation shared by multiple application windows.
- Import accepts a portable JSON bundle already placed under `.uma/wiki/`; cloud team-account synchronization is separate.
- Source previews show up to 500 lines from the exact cited revision. Update the Wiki to preview a new citation when the cited revision is unavailable.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
