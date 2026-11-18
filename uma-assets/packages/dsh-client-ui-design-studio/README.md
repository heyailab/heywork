---
description: "The Design Studio and Delivery Workbench global pages: browse design systems, inspect tokens, launch UMA presets, and review the delivery pipeline."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-design-studio

English | [中文](README.zh.md)

## Summary

Design Studio browses installed references, tokens and component previews. Conversation **More actions → Task details** opens the existing right sidebar for the current project’s checks, acceptance, findings, repairs, tasks and documents. Verification and repair actions append a draft to that conversation without sending it. Browsing references and evidence does not request a model.

The fixed UMA Design entry opens the gallery and saved projects. UMA displays palettes, typography, design guides and component previews. Full reference documents stay in the local Agent resource store. Maintainers can inspect them in source builds with `showInternalLibrary: true`.

## Table of Contents

- [Use this package](#use-this-package)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

In **UMA Operations**, use **Add server** above the server cards to save a host, port, username and password, private key or local ssh-agent. Confirm the SSH host fingerprint with the administrator before connecting. Each connected server retains its own terminal while switching among servers. The desktop stores server records and their credentials in its [encrypted local vault](../../../apps/desktop/README.md#local-desktop-settings). Browser sessions can open temporary connections. With no saved or temporary servers, one card contains the empty state or the first server form.

**Overview** displays Linux CPU, memory, swap, disk and network probes over SSH. Open **Services**, **Containers** and **System logs** directly from the connected server. The service and container lists support start, stop and restart when the remote user has permission. In **Files**, click a folder or an ancestor in the path, search the current directory, or show hidden items. File uploads, downloads, folder creation, renaming and deletion of files or empty folders use SFTP. **Agent access** delegates the selected connection to one conversation. Each delegated command requires approval, and disconnecting revokes that server’s grant.

With SSH connected, open **VNC desktop** and enter the port of the VNC service listening on the server’s loopback address. The SSH service must permit forwarding to that loopback port. Use VNC credentials if required. Choose **View only** to suppress remote input, or click the desktop canvas to send the keyboard and mouse. Reconnect explicitly after network loss. The remote desktop viewer uses [noVNC 1.5.0](https://github.com/novnc/noVNC/tree/v1.5.0) under [MPL 2.0](https://www.mozilla.org/MPL/2.0/). Use **Full screen** to expand the viewer while keeping SSH connected.

The gallery separates brand references from general visual styles, filters by category, and searches names, canonical ids and aliases, including curated Chinese brand names. Every installed system has a generated card and a lazy detail module. Copying a prompt or starting a design session carries the canonical system id. Cards show the default root palette without mixing conditional dark-theme overrides. Palette values resolve aliases inside color functions and exclude shadows or unresolved custom properties.

These pages share PageLayout, PageHeader, NativeSelect, Input, Button and card primitives; feature styles own business layout rather than field or card materials. The gallery displays 36 entries per page, with page controls below the cards. Search and category filters cover the full catalog and reset pagination; turning a page resets the scroll position to the top. The reference detail has a fixed Back bar above the scrolling content. Back restores the gallery page and scroll position. Brand cards use shared palette and action layout without per-card backdrop filters.

Delivery Workbench separates document structure readiness from source-linked engineering acceptance; document frontmatter approval is a declaration, not an identity-bound review. The task directory supports search, paging, reopening conversations and explicitly confirmed turn interruption without interpreting idle as complete. The acceptance editor maps criteria to discovered checks and saves against the observed revision. Conflicts and uncertain saves retain input. Project checks show argv before confirmation and reject changed commands at Host admission; starting a check is distinct from passing it. Refresh reads retained results before further execution.

The engineering-verification section reads the native Coding Workbench through the shared resource provider. It reports current-source coverage, executable acceptance criteria, fresh passing receipts and open findings independently of document checks. Refresh rereads both sources. The verification action prepares a standard coding Session draft using the built-in acceptance and check tools; it does not send it. Document scope and checkpoint selectors use the same pure rules as the Host gate tool.

Mount it in the Web composition:

```yaml
- id: ui-design-studio
  name: '@deepseek-ai/dsh-client-ui-design-studio'
```

The package retains the `design` and compatibility `delivery` keyed main pages, with Design and UMA Operations in `sidebar.panellist`. Task details open through the conversation menu in the existing right sidebar. Design Studio reads `.design/` projects from the selected session, shows contract completeness plus a DESIGN.md preview, and can open the owning session; each system in the gallery has a sandboxed component preview. Selecting a design system also offers **Build a design brief**: a guided form captures product, surface, audience, tone, density, required pages, and constraints, then starts the UI Design Agent with a structured prompt that first reads `design_context`, preserves approved branding and existing implementation, and uses `design_project_create` only when a foundation is missing. Production UI uses the current stack; single-file HTML is reserved for explicit prototype requests. Selecting a delivery stage opens its Markdown; a missing or not-ready artifact offers **Ask the agent to complete**, which starts the UMA Delivery Team with the required sections and placeholder rules in the prompt. The gate panel lists the artifacts that currently block delivery and copies a structured gate report. The project picker scopes results to the chosen conversation. Gallery cards summarize only designs with distinctive descriptions.

Task details recheck membership of their owning Session and project rather than following global project selection; removing membership hides old evidence. Documents load on demand, and missing documents do not require a full document set. Design and the compatibility route can still prepare ordinary Agent drafts.

Delivery Workbench lists registered Workspaces, including ones without conversations. Selecting an empty workspace initializes or reuses a real blank Session without navigation or a model request; directory validation and artifact reads use the existing Session-scoped workspace-file permissions. Missing files show empty states; unreadable or truncated files show a retryable error. Starting a task prepares a draft in the selected workspace and preserves existing draft content. A removed selection requires reselection, and delayed attempts cannot navigate after switching. The Coding filter offers impact analysis, code review and failure diagnosis through the standard preset. Document checks assess section and placeholder completeness, not test execution or human approval.

Gallery cards and detail headings use localized reference summaries, and search includes their visible wording. Full design contracts, original attribution and license notices remain in the bundled reference assets.

Design Studio uses the complete installed catalog and loads the selected preview on demand. The target selector names an imported local workspace, including one with no existing conversation; it never silently chooses another project after a selected workspace disappears. A reference kit can prepare a standard frontend draft there. An existing design project can read actual saved HTML variants and continue its owning conversation, retaining history, working directory and existing draft. Project prototypes use a script-disabled preview with panel-fit and fixed 390, 768 and 1280 px widths for checking CSS breakpoints. If the panel is narrower than the selected width, the preview scrolls horizontally. Frontend handoff waits for the selected file to load successfully, including after refresh. Check interactions in the running frontend. Engineering verification lists unmet acceptance criteria and the check names still needed for each criterion.

The page headers and action rows use shared `PageHeader` and `Button` primitives. Workspace selectors use the common control scale. Category labels and category search are localized; equivalent imported category names share one filter. Reference form focus stays on one inset field edge.

Saved design projects are displayed twelve per page; every project in a complete directory listing remains reachable. A truncated directory listing fails visibly instead of appearing complete. Project metadata is read sequentially within the request deadline to bound concurrent filesystem requests.

<a id="model-experience"></a>
## Model Experience

### Presentation only

#### What the model sees

Nothing. The pages register the `main` and `sidebar.panellist` surfaces, read workspace files for display, and prefill session prompts; they add no tool, prompt section, or Session event.

#### Token effect

None; the page never constructs model input or changes request tokens.

#### KV Cache effect

None; the package neither assembles nor sends a provider request.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The catalog is generated from the bundled design systems; adding a system requires regenerating `src/client/catalog.ts`.
- Section checks and placeholder rules come from the shared `dsh-util-uma-delivery` contract used by `uma_gate_status`; artifact status and findings are read live from the selected workspace through its initialized Session.
- The pages start sessions with prompts prefilled; they do not submit on the user's behalf.
- Default root token values are shown; simple `var()` aliases resolve within the same stylesheet, while `color-mix()` remains a CSS expression.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Both catalogs are static projections. Regenerate `catalog.ts` when the bundled design systems change, and update `delivery-catalog.ts` when an artifact check or bundled skill changes.

</details>
