---
description: "Desktop knowledge manager for team/project collections, local imports, parsing progress and cited retrieval."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-knowledge

English | [中文](README.zh.md)

## Summary

Manage team standards and project materials from the desktop sidebar. Import files/folders or write Markdown notes, inspect actual parsing progress, browse retained source passages, test retrieval and associate knowledge with imported workspaces. Coding tasks then use relevant evidence automatically. Asking from this page opens the existing conversation flow and preserves drafts.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The Development experience tab offers collection selection, search, state filters, pagination, details, editing, review, withdrawal, export, history, restoration as a new candidate and batch withdrawal/deletion with individual outcomes. Failed forms retain drafts; revision conflicts preserve other edits. The tab opens the installation-wide library by default. Project collections can also enable copies of failed-to-passing check transitions. Reviewed means an operator inspected the experience, not that current code passed acceptance. Capture and retrieval preserve collection scope without silently enabling team sharing.

The single HeyWork knowledge sidebar entry contains **Reference library** and **Project Wiki**. The library keeps team/project collections; the Wiki reader is contributed through `main.knowledge.wiki`. Switching sections retains the library navigation source. If the Wiki provider is disabled, the page returns to the library rather than showing an empty panel. On macOS, the empty space in the top navigation row drags the window. The library and Wiki buttons remain clickable. Tab hover emphasis applies only to hover-capable pointers; the active section remains emphasized on touch devices.

Open **Knowledge base** in the desktop sidebar. Create a project collection for one existing workspace, or a team collection for explicitly selected workspaces. In short windows the editor scrolls between its fixed header and footer actions. Document previews and note forms scroll below their fixed headers. Import local sources, wait for actual ready states, then use **Retrieval test** to inspect evidence. Documents can be disabled, archived and restored; historical snapshots remain readable.

**Built-in technical standards** opens the guide browser from the HEY library header, including while viewing a collection. Filter by topic, technical language and content language, preview the original summary and source/license links, select guides and explicitly choose an existing target collection. Version/language document names keep imports traceable. Each guide goes through `createNoteIfAbsent`; an existing name is preserved even if its document was edited, disabled, archived or follows a local file. Normal note editing is unchanged.

The result reports queued, unchanged/skipped and failed items individually. Cancelling stops remaining submissions; already admitted jobs remain visible and continue through normal parsing. Queue admission is not ready status. Import never changes collection enabling or workspace association. After the user enables and associates a ready collection, the existing development-context retrieval supplies relevant evidence to the team; opening this dialog alone makes no model request.

Desktop selection reuses the existing native file/directory bridges. Local sources can follow changes while the app is open. Browser compatibility uploads create snapshots. Knowledge is local to the current installation; the interface distinguishes team grouping from employee accounts and cross-machine sharing.

| Field | Default | Meaning |
|---|---|---|
| `showBuiltinStandards` | Enabled by the HEY bundle | Built-in technical standards entry in the library header |
| `refreshMs` | 2000 | Metadata/progress refresh while this page is open |

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The page uses root slots, typed locale dictionaries, the Workspace store, generated `remote.knowledge` methods and the shared conversation owner. Components receive domain operations rather than Cordis Context. Owned requests abort on unmount, late reads cannot replace another collection, and transient read failures retain existing content. Navigation survives reopening the page.

The [Host package](../../knowledge/knowledge/README.md) owns parsing, persistence, source freshness and retrieval scope. The page reports queue admission separately from completion and surfaces individual import failures. Citations open immutable parsed Markdown through the existing file-preview behavior.

The page and its editors use the shared [UI primitives](../ui-primitives/README.md) for page layout, cards and form controls; package styles own content arrangement.

</details>

<a id="model-experience"></a>
## Model Experience

### Associated development knowledge

#### What the model sees

Reading collections, importing ordinary documents and full-text retrieval tests do not submit chat prompts. **Ask in a conversation** stages an explicit question in a standard development Session; its `HEY_KNOWLEDGE_BASE` marker narrows retrieval to the selected associated collection.

#### Token effect

Only explicit chat tasks and configured embedding operations consume model tokens; local full-text management does not.

#### KV Cache effect

The page never assembles provider requests. The Host context contributor owns model evidence and its durable snapshots.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Chinese and English copy is provided, with English fallback for other locales.
- Team groups are local organization, not a user-invitation or SSO interface.
- Scanned PDFs need a text/OCR source. Hybrid search is unavailable until an embedding provider is configured.

<a id="dev-note"></a>
### Dev Note

None.
