---
description: "Local team/project document knowledge with durable ingestion, source citations and development-time retrieval."
kind: "package-reference"
---

# @deepseek-ai/dsh-knowledge

English | [中文](README.zh.md)

## Summary

Import local documents or Markdown notes into team and project collections. Associate collections with existing workspaces so coding tasks automatically receive relevant, cited evidence. The service retains original snapshots and versions, resumes interrupted parsing, follows explicitly selected local sources, and excludes disabled, archived or changed sources from retrieval. Full-text search works without a model; optional embeddings enable hybrid retrieval.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The default export is the service class. Programmatic configuration validation uses its static `Config` schema; the named `Config` entry export is a type only.

Development experience retains collection scope and enabled state, with immutable revisions and candidate, reviewed, withdrawn or superseded states. Editing resets review; writes and deletion check the expected revision. Deletion removes content/history but retains source deduplication markers to prevent automatic recreation; existing Session citations remain intact. Operator review requires a solution, applicability, references and explanation, but certifies neither cause nor current code. Ordinary tasks retrieve reviewed records from the installation-wide library and active associated collections. HEY creates the global library locally and records failed checks, later passing checks and selected structured tool failures as candidates with evidence references. Project collections can opt into copies of failed-to-passing transitions. A candidate requires review before it becomes retrievable. SQLite upgrades to generation 2 while retaining existing material; old programs reject the new database. Rollback requires stopping the Host and restoring the matching backup.

Desktop and Web use the shared application composition. The global service owns the local catalog; development presets mount `@deepseek-ai/dsh-knowledge/context`. A project collection binds exactly one imported workspace. Team collections bind any explicitly selected workspaces. Team groups organize one installation; they do not create employee identities or publish materials to other machines.

```yaml
- id: knowledge
  name: '@deepseek-ai/dsh-knowledge'
```

Data lives below the resolved `DSH_HOME/knowledge/v1`: SQLite metadata/indexes, original objects and immutable parsed citations. One live Host owns a knowledge directory. A second Host refuses the active queue lease. Restart recovers interrupted parsing jobs. Use separate homes for independent concurrent Hosts.

Text/Markdown, CSV/TSV, JSON/YAML, PDF and Office documents are supported. Office conversion uses the existing Office-to-PDF service. PDF extraction runs in a deadline- and V8-heap-bounded Worker. Image-only PDFs report `ocr-required`; an empty parse is never published as ready. Following local sources is optional and runs only while the application is open. Interrupted or failed folder imports retain already-admitted documents.

The [Config source](src/config.ts) owns all byte, document, page, passage, queue, storage, timeout and synchronization limits. Defaults permit 20 MiB originals and 4 MiB extracted text per document, two parsing jobs, 15-second source checks, and separate 2 GiB object/index limits. Archived content and historical source citations are retained, so archive does not reclaim snapshot capacity.

`createNoteIfAbsent` admits a version-named Markdown reference only when its collection has no document with that name. The storage owner performs the absence check atomically, including edited, disabled, archived and local-source documents, so concurrent import cannot replace user material. It returns queue/unchanged admission results; ordinary `createNote` editing behavior is unchanged. Queued does not mean parsed or ready.

The UI can explicitly import the 14 original bilingual coding guides from the shared standards catalog into an existing chosen collection. Their 23 conditional rules cite 12 official source groups; upstream manuals are not copied. Import does not create or enable a collection, change workspace associations or silently re-enable documents. Once the operator enables and associates a collection and its content is ready and eligible, existing workspace retrieval can supply it to authorized coding/team Sessions.

Hybrid collections require `embeddingUrl` and `embeddingModel`; `embeddingKeyRef` resolves the existing credential store per call. The endpoint must provide OpenAI-compatible embeddings. Model-specific `queryPrefix` and `documentPrefix` are configurable. Missing, partial or failed provider settings are explicit errors; a hybrid collection never silently becomes lexical. Provider/prefix changes require reindexing existing hybrid documents.

Only collections currently set to hybrid contribute vectors. Switching to full text leaves existing vectors and revisions intact for future use but immediately excludes those vectors from retrieval.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The registry, SQLite provider and domain operations evolve together in this package. `types.ts` is the browser-safe vocabulary; generated Remote descriptors expose operator commands through the existing authenticated Gateway. No new browser filesystem capability or Electron IPC channel is introduced. Native file paths come from the existing preload bridge; remote imports use bounded encoded snapshots.

Code Wiki and document retrieval share the [task-query owner](../../context/task-query/README.md), so restart or plugin replacement does not erase the active task query.

Parent passages retain page/line context, while smaller overlapping children provide precise search units. Chinese word segmentation feeds FTS5/BM25. Configured dense vectors are evaluated only within eligible collections and fused with lexical candidates by reciprocal rank. Results expand to deduplicated parent passages. Source hashes and active flags are rechecked before evidence reaches a task, including after asynchronous provider and filesystem reads.

Original and citation files are published before the transactional revision/index switch. A document generation counter prevents an older parsing job from replacing newer input. Queue shutdown aborts and joins Workers, conversions, provider requests and owned operations before closing SQLite. Disabled/archived documents remain readable to their operator but never enter new retrieval results.

</details>

<a id="model-experience"></a>
## Model Experience

### Workspace evidence

#### What the model sees

The `hey:workspace-knowledge` runtime-context contributor supplies relevant collection/document names, headings, pages, immutable Markdown paths, line ranges and passage text. It derives scope from the actual Session workspace. Retrieved documents are reference data and cannot override user/system instructions. The existing durable runtime-context mechanism records every model-visible contribution.

#### Token effect

Source parsing and full-text search make no model request. Hybrid indexing/querying call the configured embedding provider. Coding receives only selected evidence bounded by `contextMaxBytes`; retrieval failure supplies an explicit unavailable notice rather than unverified facts.

#### KV Cache effect

Ordinary tool schemas remain unchanged; updated evidence changes the logged user-role runtime-context snapshot.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Team grouping and workspace retrieval boundaries are not employee SSO/RBAC or cross-device synchronization. Gateway authentication still governs operator access. Authorized readers of a shared development Session can see evidence already logged in that Session.
- OCR, audio transcription, external document-platform connectors and managed cloud indexing are not provided.
- Dense retrieval is bounded exact cosine evaluation, not a distributed ANN service. Oversized dense candidate sets reject explicitly.
- Hash verification establishes source identity, not the semantic truth of every document or generated answer.

<a id="dev-note"></a>
### Dev Note

None.
