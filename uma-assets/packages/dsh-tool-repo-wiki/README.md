---
description: "Generate and retrieve source-backed repository Wiki editions through normal logged Agent tasks."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-repo-wiki

English | [中文](README.zh.md)

## Summary

Generate an article tree and Knowledge Cards from real repository files, retain progress between tasks, and update affected pages when implementation changes. Source citations must match current hashes and line ranges. Export or import portable knowledge for Git sharing. The read-only context entry supplies relevant, fresh knowledge to ordinary tasks only when citation is enabled. Generation uses the configured model and its normal quota.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The context plugin provides `hey_wiki_lookup` for source-checked task evidence in the current branch. HEY presets set `automaticContext: false` and retrieve Wiki facts when the model calls this tool.

The Web bundle mounts generation tools in the `repo-wiki` Agent preset and `@deepseek-ai/dsh-tool-repo-wiki/context` in ordinary development presets. In the application, open **Project Wiki**, select a workspace and language, then generate.

```yaml
- id: tool-repo-wiki
  name: '@deepseek-ai/dsh-tool-repo-wiki'
```

| Field | Default | Meaning |
|---|---|---|
| `maxFiles` | 50000 | Candidate source count limit |
| `maxFileBytes` | 524288 | Per-source byte limit |
| `maxScanBytes` | 134217728 | Complete-scan aggregate bytes |
| `maxPageBytes` | 131072 | Article byte limit |
| `maxRecordBytes` | 33554432 | Index, manifest and import/export byte limit |
| `maxPages` | 200 | Planned article count |
| `gitTimeoutMs` | 30000 | Read-only Git command deadline |
| `gitOutputMaxBytes` | 8388608 | Complete Git output limit |
| `gitExecutable` | `git` | Execution-world executable |
| `allowUncitedPageReads` | `false` | Explicit maintenance access while citation is disabled |
| `contextMaxBytes` | 16384 | Ordinary-task knowledge context bytes |
| `maxFreshnessFiles` | 256 | Potentially changed sources verified per lookup |
| `searchLimit` | 8 | Relevance-ranked results |
| `maxSnippetChars` | 2000 | Search excerpt characters |
| `maxPlanBytes` | 32768 | Reader-authored YAML plan bytes |
| `sourceWindowMaxBytes` | 32768 | One model-visible source window |
| `catalogRetries` | 5 | Bounded catalog compare-and-swap attempts |
| `excludeDirectories` | See `Config` | Source directory exclusions; secret-file exclusions always apply |

A project can provide `.hey/wiki/wiki_plan.yaml` using `version: 1`, `repowiki.template`, reader `notes`, document `title`/`goal`/`parent`/`hints`/`template`, and `knowledgecard.notes`. The parser accepts data-only YAML and rejects executable tags.

Resume the recorded generation Session after interruption. An explicit takeover may transfer a stopped or unavailable writer; a locally running writer is refused. Failed publication preserves the committed checkpoint but may retain unreferenced immutable content. Restore a modified content-addressed file or import a valid export before continuing.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The indexer respects Git ignore rules, skips known secret names, and reads bounded UTF-8 sources. It stores hashes and relative and workspace-package import relationships without copying source text. Plans record page dependencies; source reads return exact citations. `wiki_write_page` publishes immutable Markdown before compare-and-swap checkpoint replacement, while `wiki_finish` rescans the source fingerprint before readiness. Branches and languages use separate checkpoints.

The workspace preview checks the catalog edition, published page, exact citation and index before reading the cited file. If the file changes, disappears or falls out of the eligible Git source list, the preview reports that the citation is stale and returns no source text. Wiki records and generated files must resolve within the physical `.hey/wiki/` directory.

The context entry checks changed paths, including uncommitted paths that existed during generation, and suppresses knowledge affected by transitive dependencies. Relevant facts enter the existing durable runtime-context mechanism. Lookup failure contributes an explicit unavailable notice instead of unverified facts; it does not block unrelated code work.

</details>

<a id="model-experience"></a>
## Model Experience

### Repository knowledge tools

#### What the model sees

The dedicated preset exposes `wiki_status`, `wiki_inventory`, `wiki_read_source`, `wiki_plan`, `wiki_write_page`, `wiki_read_page`, `wiki_search`, `wiki_finish`, `wiki_export`, and `wiki_import`. Ordinary presets retain their tool catalogs and receive only relevant source-verified knowledge when an enabled edition exists.

#### Token effect

Generation sends selected source windows through logged tool results. Ordinary knowledge context is bounded by `contextMaxBytes`; no full-repository source upload is performed by this plugin.

#### KV Cache effect

The generation preset has stable tool schemas; changing knowledge updates a user-role runtime-context snapshot.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Retrieval is lexical rather than embedding-based; Relative and workspace-package ECMAScript imports supplement explicit article dependencies.
- Source-range and hash checks establish citation identity, not the semantic truth of every generated sentence.
- Automatic source-change scheduling belongs to the client plugin; cloud team publishing is not provided.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
