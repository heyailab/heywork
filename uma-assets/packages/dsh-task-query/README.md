---
description: "Recoverable bounded task/steering queries shared by knowledge retrieval contributors."
kind: "package-reference"
---

# @deepseek-ai/dsh-task-query

English | [中文](README.zh.md)

## Summary

Keep the current task available to knowledge retrieval after restart, fork continuation or plugin replacement. The service previews newly claimed inputs without mutating saved state, then reconstructs committed task and steering text from Session projections. Code Wiki and document knowledge use the same query owner.

User and scheduled inputs establish the current task. Agent and historical Team messages add the latest handoff query while retaining that task. Injected reference material does not become a new retrieval request. Projection version 3 rebuilds older caches from logged events.


## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----
<a id="use-this-package"></a>
## Use this package

Mount with `sessionProjections`. Retrieval contributors inject `taskQuery` and call `current(session, claimed)` from the pre-step hook. The result contains the bounded first task and latest steering text. The fixed hint format retains at most 4,000 UTF-16 units per field and returns at most 4,000; truncation preserves surrogate pairs. It is a retrieval hint, not the complete user prompt.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

A private, host-only Session projection keeps the task hint. User and scheduled task messages update it; runtime contexts and other reference messages do not. New turn positions mark the next genuine task as a replacement while retaining a hint for driver continuation without new user text. Claimed inputs are folded only in a temporary preview; rejected pre-step work cannot overwrite the saved hint. Registration belongs to the service fiber. Consumers read this service, never a projection handle or arbitrary event history.

</details>

Operational runtime-context or skill-catalog replacements do not replace the human retrieval task. Only admitted task sources can update or replace the recovered query; a refreshed context snapshot cannot clear it.

<a id="model-experience"></a>
## Model Experience

### Retrieval hint

#### What the model sees

`taskQuery.current(session, claimed)` selects a query for mounted retrieval contributors. This service adds no prompt or tool; each contributor owns its source-backed model context.

#### Token effect

The query owner makes no model request. Its bounded checkpoint is independent of conversation length.

#### KV Cache effect

No direct effect; retrieval contributors own changes to logged runtime-context snapshots.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Query windows omit intermediate steering and long-prompt detail. The original user messages remain in the Session log.

<a id="dev-note"></a>
### Dev Note

None.
