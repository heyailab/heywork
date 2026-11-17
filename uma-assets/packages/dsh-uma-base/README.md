---
description: "HEY shared Host services for coding, local knowledge, isolated worktrees and product profiles."
kind: "package-bundle"
---

# @deepseek-ai/dsh-uma-base

English | [中文](README.zh.md)

## Summary

This private bundle supplies HEY Host services over the kernel runtime. HEY Web, Desktop and automation profiles select it explicitly. It does not select a browser transport or change the official profile templates. The local distribution supplies its packages; it is not an npm installation target.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The model decides whether the current task needs delegation or reference evidence. HEY’s standard and role presets expose explicit library lookup through `hey_workspace_search`, project history through `coding_inspect` and source-checked Wiki facts through `hey_wiki_lookup`. Design preparation runs when the model calls `design_begin`. Team mode makes delegation available for concrete work. It does not start teammates or load project references before the model sees the user’s request. Reviewed experience is historical evidence. Candidates require review before lookup returns them. With Team mode enabled, the root coding acceptance result also requires the shared task board to be settled; individual reviewer checks remain independent. Turning Team mode off retains tasks and allows solo acceptance.

The shared composition records check failures, check recoveries and selected structured tool failures as local global experience candidates. Startup recovers available coding receipts and the capture ledger deduplicates retries. Project collections may opt into copies of check recoveries. Captures use evidence references and omit command output and conversation text from global records.

New root conversations enable Team mode. The HEY workflow assigns named teammates and shared tasks to work requiring distinct owners. For a small change, the lead may implement directly with independent design or review. The design role reads the selected catalog reference and hands off decisions for UI work. The user can change Team mode for a conversation.

Standard and PTC conversations start a designer for an explicit user request in a UI task when Team mode is enabled. A solo instruction, disabled Team mode, or active planning prevents this dispatch. Other role and tool choices stay with the lead.

HEY Web and Desktop select the `./feedback` provider for `/feedback`: it submits only the explicit text to `/v1/me/support` on the signed-in HEY account origin and returns a confirmed ticket link. It adds no Session history, attachments or device metadata. `origin` defaults to `https://studio.umayun.com`, `allowLoopbackHttp` to `false`, and `requestTimeoutMs` to `15000`. Uncertain submissions are not automatically retried; check the support list before repeating them. Automation profiles retain the kernel local recorder.

Load this layer after the kernel mode bundle and before the HEY Web or automation layer. The distribution profile helper owns the ordered bundle lists. Existing profile patches remain later layers and can configure the declared rows.

Sign in and open an imported workspace to use `/memory save <name> <note>`, `/memory list`, `/memory show <name>` and `/memory delete <name>`. Saving the same name replaces its content. The store keys records by the signed-in account and canonical workspace and stays under `hey-project-memory` in the local Harness home. The Agent can recall these user-saved decisions on demand across Sessions through `hey_project_memory`. Deletion stops later recall. Previously displayed or model-visible content can remain in the conversation history.

Project memory ranks exact note names ahead of keyword matches in titles and contents. It segments Chinese and English locally and retains the most recent ordering for equal matches.

WeKnora is an optional read-only source. Enable the `hey-weknora` row in the local profile with `url`, `accountOrigin`, `accountId`, `workspaceId`, `apiKeyRef` and explicit `knowledgeBaseIds`. Use a read credential restricted to those collections. The tool sends the focused query to the configured service when called, only for the matched account and workspace, and returns passages tagged with document and chunk IDs. Local knowledge remains available independently. Text matching and vector indexing for local collections remain configured through the knowledge provider.

The request sets a result limit. Repeated source passages count once against the results returned to the Agent.

Set `HEY_KNOWLEDGE_EMBEDDING_URL` and `HEY_KNOWLEDGE_EMBEDDING_MODEL` in the HEY Host launch environment to make hybrid mode selectable for local collections. Set `HEY_KNOWLEDGE_EMBEDDING_KEY_REF` only when the endpoint requires a credential. A loopback OpenAI-compatible embedding endpoint keeps indexing and queries local. An external endpoint receives document passages and queries. The provider change requires reindexing existing hybrid collections.

HEY Web and Desktop mount the SSH transport on their authenticated Host. Interactive terminals, inspections and SFTP use connections opened by the Host owner. The SSH user’s permissions apply to remote actions. Transfers use a per-file limit configured by `transferBytes` (32 MiB by default). Uploads publish a temporary file to an unused destination after transfer. Failed uploads remove temporary files when the server channel is still reachable. The Linux health inspection adapts the [Octop CVM Doctor probes](NOTICE.md). A human can grant each live server to a conversation. Grants expire after one hour by default and are revoked independently when a connection closes. `hey_ssh_servers` returns only the live grants. `hey_ssh_run` uses a separate command channel. It requires a connection ID when several servers are granted and approval for each command. The SSH password and key passphrase are redacted if echoed in tool output.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The Host composition shares coding records, local knowledge, repository Wiki services and worktree creation with the selected application. Its services use the active Harness home and workspace registry. Workspace recall opens a separate derived SQLite history index on the first search; the index resides in the Harness home and does not replace Session records. No service in this layer requires `webStartup`.

The optional Forge and worktree tool bundles use the active HEY worktree provider. Their redundant provider entry is omitted from the runtime and Plugins page. Switching either bundle leaves the HEY provider and its recorded worktrees available.

The HEY-owned lifecycle consumer awaits serial `agent/created` handling before delegated model work begins. It attaches only a real subagent whose recorded parent already belongs to the same canonical imported workspace. Fresh and resumed children append to membership without reordering ordinary conversations; missing, mismatched or deleted ownership is not adopted. Failed attachment rolls back the newly added membership, and teardown cancels and joins its pending operations. This supplies the workspace identity used by coding checks, history recall and post-compaction refresh without weakening those services' ownership checks.

Shared Host presets define the design, office, Wiki, director, author and reviewer capabilities for both browser and automation profiles. Role permissions remain defined by each preset; this layer does not grant every role the full tool set. Author and reviewer teammates can discover and message collaborators without acquiring delegation, interruption or execution tools. Implementers report fixes to the requesting reviewer; the lead relays a fix that reaches only the lead.

[The patch declaration](cordis.patch.yml) and `package.json` maintain the runtime dependency set together. Product packages remain private and travel with the local distribution.

</details>

<a id="model-experience"></a>
## Model Experience

### Composed capabilities

#### What the model sees

The selected plugins contribute capabilities such as `coding_inspect`, `coding_check`, bounded `coding_repair` and `standard` preset context to the Agent. The shared preset definitions select full implementation capabilities, coordinator acceptance metadata, or source read-only evidence/review capabilities for each role; this shared Host layer does not grant every role the full set. Each plugin package owns its tool schemas and context text. This bundle makes no model request.

#### Token effect

Depends on the selected Agent composition; the contributing plugin packages define tool and context bounds.

#### KV Cache effect

Bundle, preset or configuration changes can replace tools and context in the request prefix. Provider cache availability and eviction are outside this bundle’s guarantees.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Workspace attachment covers existing imported ownership, not arbitrary directory adoption or automatic worktree orchestration. Task-board state reminders and a declarative nine-role roster remain separate work.
- It supplies services rather than a top-level Agent preset binding. The selected application owns Agent creation, resume policy and model-facing tool placement.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Upstream owns the kernel profile templates and optional bundle list; HEY profiles explicitly select the product layers.

</details>
