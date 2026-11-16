---
description: "Native coding evidence shared by standard agent tools and desktop delivery verification."
kind: "package-reference"
---

# @deepseek-ai/dsh-coding-workbench

English | [中文](README.zh.md)

## Summary

Owns workspace-bound command receipts, revisioned acceptance criteria, source-linked findings, retained changes, and isolated coding tasks. The shipped application mounts the service once and exposes its tools in standard, PTC, and Uma presets. Desktop delivery verification reads the same service; no separate UmaDev or super-dev runtime is required.

## Table of Contents

- [Use this package](#use)
- [Evidence rules](#evidence)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#limits)
- [Dev Note](#dev-note)

-----
## Use this package

The default export is the service class. Programmatic configuration validation uses its static `Config` schema; the named `Config` entry export is a type only.

`startCheck` optionally accepts `expectedArgv`; when supplied, admission compares it with the discovered command and rejects changed arguments before recording or executing the check. This verifies the command invocation, not immutable script contents.

<a id="use"></a>

The Web/Desktop bundle composes the provider and its filesystem, subprocess, sandbox, storage, Session, and worktree dependencies. Presets mount the `/tools` consumer beside the ordinary development tools, the `/policy` consumer that tracks post-edit verification, and the `/protocol` consumer that registers evidence-based completion instructions. Each consumer ships a separate runtime entry; the package includes every generated shared JavaScript chunk required by those entries. Deployment limits are validated by [Config](src/config.ts); project check argv and optional per-check coverage globs come from supported manifests or `.uma/coding.json`. Discovery does not execute commands or install dependencies.

UMA coding profiles use `advise`: project scaffolding and multi-file repairs can proceed without passing checks after every file. Verification debt and failure evidence remain; only actual passing checks clear eligible debt. Deployments may explicitly select `enforce` for a strict edit/check cadence.

`/standards-context` reads known manifests in the current execution directory before each request, records source hashes and selects shared guidance from observed languages/frameworks. It exposes no arbitrary manifest fields, runs no scripts and does not certify compliance; monorepos still require target-package inspection. Configurable `fileBytes` and `contextBytes` bound metadata reads and the complete contribution; failures or overflow explicitly request manual inspection. Selected guidance enters the Session log through existing runtime context, and unload cancels and joins preparation. Automatic preparation includes selected guide bodies; `guideLanguage` accepts `en` or `zh`, defaulting to `en`. Standards-mode `coding_inspect` accepts `guideId` and `contentLanguage` to read one applicable guide without manually importing a knowledge collection. The runtime file inventory includes `lib/standards-context.js` and its `lib/source-*.js` and `lib/process-*.js` chunks; workspace checks reject either omission.

The post-edit verification policy (`coding-edit-policy`, mode `off` / `advise` / `enforce`) tracks files mutated by `write`, `edit`, and `apply_patch` per Session. `advise` attaches a reminder to each edit result; `enforce` additionally requires fresh check feedback before the next mutation. A complete, unchanged, settled failed check permits the next repair of older edits but does not clear their verification debt or establish readiness; only a passing check clears eligible debt. Newer or still-running edits cannot borrow that failed check. Reading or cancelling historical runs, skipping every check, and incomplete source scans cannot clear pending edits. Discovery, reads, and `coding_check` itself stay allowed.

Native and PTC tool events retain verification obligations across policy replacement, Host restart, Session resume, and forks, including edits logged while the policy was unloaded or off. Failed or interrupted mutations remain owed unless the result proves dispatch never began. A passing check clears only edits settled before that check started; newer or still-running edits remain owed. Compact result metadata preserves the check evidence when command output is spilled.

`coding_inspect` with `mode: "standards"` and explicit `languages` selects the shared source-backed catalog. It returns conditional rules, official source identities, guide identities and actual discovered project check names with `verification: "not-run"`. The 14 original bilingual guides and 23 rules refer to 12 official source groups; company manuals are not bundled. Repository conventions take precedence over incompatible style preferences, and selection does not establish compliance. Link applicable checks to acceptance, execute them, and retain separate review evidence for rules that cannot be machine-checked.

`coding_check` supports `scope: "changed"`: paths are relative to the selected workspace or task directory, excluding sibling repository directories; coverage globs select affected checks, undeclared coverage always runs, and an incomplete change scan runs every check. An empty change set skips every check and leaves pending edits unverified.

The `/tools` capability mode defaults to `full`, retaining implementation tools. `coordinate` permits evidence reads, authored findings and revisioned acceptance definition, but no project-check execution/cancellation, repair start/cancel, task creation/merge/removal or source restoration. `read-only` additionally makes acceptance definition unavailable; it may still record review findings as metadata. The UMA team director uses `coordinate`; author/reviewer presets use source `read-only`. Tool schemas narrow the offered actions and executable definitions reject disallowed calls.

`coding_repair` exposes `start`, `read` and `cancel` for the current workspace. Start uses the current calling Agent as the policy owner, defaults to one attempt, and cannot exceed the deployment's repair limit. It requires an unchanged failed check; a stale or foreign-workspace id is not a repair authorization. Read-only and coordinator consumers may read retained repair state but cannot start or cancel it.

<details>
<summary>Policy integration</summary>

The `/policy` consumer requires `sessionProjections`, already supplied by the shipped base bundle. Its host-only projection stores distinct unverified paths and current-step pending calls. Relevant events cost time proportional to their input paths and retained state; full replay repeats that fold for each event. Getters perform no log scans or I/O. Projection cache version 2 rebuilds from retained events; this does not rewrite or migrate released Session events. Agent tool dispatch must provide the real Session logging coordinates before entering the policy; `enforce` rejects unlogged mutations. Required projection registration is awaited, and registration failure fails plugin activation.

</details>

The `/experience-recall` plugin automatically searches the current workspace's authored ledger, cited SessionQuery history and retained repair facts when a new user task is admitted. Chinese requests are segmented into words without requiring spaces; request filler is excluded and path/error literals are preserved. Query terms, lookup counts, matches and appended context are bounded. Historical snippets retain Session/event coordinates and are untrusted reference data, not instructions. SessionQuery failures stop admission. Ledger reads separately report `available`, `missing` or `unavailable`; a failed read is never proof that no ledger exists, and its safe notice reaches the model.

`experienceSearch` derives `repairMatches` on demand from already durable repair/check records: an eligible failure and subsequent independently passing original check, their run and Session ids, command, working directory, source transition and verification sequence. Duplicate observations collapse and relevant newer facts rank first. Model-visible fields are redacted. These facts prove only a historical check transition; `rootCause` and `fix` remain `null`, and `freshness` requires rechecking current source. They do not write a new project ledger, train model weights, certify a semantic fix or create a separately editable experience database.

The `/compaction-refresh` plugin keeps native compaction and appends current todos, freshly assessed acceptance, and open findings to the next admitted request. Its pending flag recovers from the Session log and clears only when the notice is admitted. The todo owner supplies replayed state through `todoState.read`; no tool-result cache is used. Both plugins preserve existing message prefixes and record additions as ordinary user-message events.

Sweep compares contiguous added-code windows using TypeScript tokens, normalizing identifier names while preserving literals. It reports structural similarity for review; it does not prove semantic equivalence.

Run `pnpm run test:eval /tmp/coding-eval-report.json` from the repository root to execute bug-fix, feature, and refactoring tasks through the prepared `uma-headless` profile. The runner owns temporary Git repositories, grades the resulting modules in independent processes, writes a report, and rejects failed or empty baselines. It uses the explicitly configured test model credential and consumes API credit. The trusted real-API CI job runs this baseline; these three small fixtures do not establish production-scale model quality.

The completion protocol routes full product-delivery requests to the UMA team workflow while focused changes remain direct implementation tasks. Team mode and existing permissions remain authoritative; a skill cannot invent independent reviewers or change tool authority.

## Evidence rules

<a id="evidence"></a>

`coding_acceptance` reads or defines concrete criteria linked to discovered check names. Updating a specification requires its expected revision and retains prior revisions. Criteria need executable checks; authored prose does not count as a successful run.

Acceptance specifications can set `independentVerificationOf` to the real implementation Session IDs. Each required check must then be executed by a different Session on the current source and specification revision. The latest run still decides: an implementer rerun, later failure or source change blocks acceptance until an eligible verifier runs again. This establishes execution independence from the declared owners; it does not certify code-review quality or discover undeclared contributors. Omission retains the previous selection; an empty list explicitly clears it. Specifications without this field permit any check owner. Declared owners must be header-validated members of the same workspace when supplied. Completed members remain eligible without being resumed; unrelated or unknown Session IDs are rejected.

`coding_check` retains actual argv, working directory, source fingerprints, status, exit code and bounded logs. Acceptance uses the latest execution of each named check, the current specification, and matching complete before/after/current source fingerprints. A later failure, cancellation, timeout, interruption or source change blocks reuse of an older pass. A persisted monotonic sequence orders receipts independently of wall-clock changes. Legacy receipts without this sequence remain readable but require a fresh check before acceptance. Open findings block acceptance.

`evidenceSnapshot` supplies the retained records, source-aware assessment and historical quality metrics from one coherent observation. If records change during assessment it retries up to three times, then reports `evidence-changing` rather than mixing an older pass with newer failures. Its record view caps each history at the smaller of `resultLimit` and 50, bounds output text and diagnostics, and reports totals and truncation explicitly. Historical pass rates are not current acceptance.

Desktop delivery verification displays paginated, read-only check, finding, repair and task details from that observation. Preparing a repair creates a standard-session draft for review; it does not silently send a model request or start a repair. The page does not reuse a delegated worker as the ordinary conversation. The observation is one-shot: refresh it after checks, repairs or source changes; it is not a live completion guarantee.

Installation-owned storage retains records through Host restart. Interrupted executions remain interrupted. Retained text changes support compare-before-restore; restoration refuses a later user edit instead of overwriting it. Task checkouts use the existing worktree provider. Task commits interpret selected files as literal paths, support tracked deletions, and preserve other staged changes. These operations retain the application's sandbox and approval policies.

Automatic repair starts from a failed check whose complete source fingerprint still matches. Every attempt uses a new standard implementation child, retaining the current caller's sandbox and approval policies. After that child stops, the service independently repeats the original literal arguments in the recorded working directory. It stops if a check manifest changes; a command with redacted arguments requires manual verification. The prior child closes before another attempt begins. The final child id identifies the latest attempt, while retained run receipts link to each attempt's Session. Cancellation joins the active work; stopped or interrupted records do not become passes.

<a id="model-experience"></a>
## Model Experience

### Native coding tools

#### What the model sees

A static system-prompt section directs ordinary coding tasks to inspect relevant source and Wiki/knowledge, keep patches small, and use executable acceptance. The normal development preset exposes `coding_inspect`, `coding_acceptance`, `coding_check`, `coding_repair`, `coding_review`, `coding_task` and `coding_restore`. Tool calls and results enter the normal Session log. The desktop verification section reads those same records without asking a model to score itself.

#### Token effect

Tool results include bounded evidence. Source trees and raw credentials are not appended wholesale.

#### KV Cache effect

Tool schemas are static; execution results append to the existing conversation.

## Known Limitations and Deferred Work

<a id="limits"></a>

- A fingerprint describes the configured source scan, not external databases, remote services or every runtime dependency.
- Experience facts are bounded historical views over retained records, not independent root-cause analysis or current acceptance. Authored notes remain untrusted references; automatic fact editing/deletion and model-weight training are not supplied.
- Document completeness, engineering checks, independent review, human approval and production deployment remain separate facts.
- Impact matches are text/import observations, not a complete semantic dependency graph.
- Coverage globs are operator-authored in `.uma/coding.json`; package-level coverage is not auto-detected, so checks without declared coverage always run in changed scope.
- The policy tracks native and PTC mutation records retained in the Session; out-of-band file changes are caught only by the fingerprint freshness rules, not by the policy. Older spilled check results without readable receipts remain unverified until a fresh check passes.
- Delivery shows a bounded, read-only evidence view, not the complete task/worktree-management UI. Automatic post-edit LSP diagnostic attachment and automatic task-board state reminders remain deferred. A current task-board record is not lost merely because its state was not appended to model context.

### Dev Note

<a id="dev-note"></a>

Non-authoritative: none.
