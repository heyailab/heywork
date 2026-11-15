---
description: "Request server-side UMA engineering guidance without transferring private reference libraries to the desktop."
kind: "package-reference"
---

# @deepseek-ai/dsh-uma-guidance

English | [中文](README.zh.md)

## Summary

Request task-specific engineering, design or review guidance through a signed-in UMA account. The selected managed model and the Session’s task budget fund one additional inference call. Only explicit task text is uploaded; private reference names, contents and usage details stay on the server. Results propose work without executing it or granting filesystem permission. Source changes, account changes and uncertain submissions prevent automatic result delivery or resubmission.

The request retains the current managed provider protocol. The immutable receipt must match that protocol; a different or missing protocol is rejected. Changing the protocol with the same operation ID is a conflict.


## Table of Contents

- [Use this package](#use)
- [Transport and lifecycle](#transport)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#limitations)

-----

<a id="use"></a>
## Use this package

Mount `@deepseek-ai/dsh-uma-guidance` as a Host plugin beside the account, budget, imported-workspace and coding services. Configure a canonical `origin`; HTTPS is required unless `allowLoopbackHttp` explicitly permits `127.0.0.1`. `requestTimeoutMs` bounds submission, `recoveryTimeoutMs` bounds reads and cancellation, and `maxResponseBytes` bounds complete JSON responses. The server owns private resources and capability publication; see the [platform API](../../../apps/uma-platform-go/README.md#private-guidance-api).

`uma_guidance` exposes `capabilities`, `request`, `status` and `cancel`. Request requires `mode: managed`, an already selected UMA account model, a capability, explicit task text and an `operation_id` containing 8–64 ASCII letters, digits, underscores or hyphens. Use a distinct operation name for each new intent and retain it for recovery. Custom-provider requests fail locally without rerouting their traffic or reading their API keys. Capability discovery and recovery do not create inference requests.

The tool hashes the imported workspace ID and its complete coding-workbench source fingerprint before submission. Completed results are withheld if that observation changes; stale results retain only public accounting references. Fingerprint coverage follows the workbench’s source exclusions. The caller must still review proposed files and use ordinary write permissions. No files or whole-repository snapshots are uploaded automatically.

<a id="transport"></a>
## Transport and lifecycle

Operation keys are derived from the actual calling Session and the supplied operation name. A network failure causes one read-only lookup, never another submission. Cancellation performs a bounded owned lookup and cancellation request; unconfirmed outcomes remain recoverable through the tool arguments already recorded in the Session. Plugin disposal aborts and drains its active work before dependencies can be released.

The captured account grant is checked before requests and after replies. Redirects are rejected; credentials only reach the configured issuer. Responses reject unknown fields, invalid relative artifact paths and oversized bodies before any model-visible delivery. Account changes or credential refreshes withhold the old response; recovery under the current account still requires server ownership. Authentication, provider errors and malformed JSON never expose raw response bodies.

<a id="model-experience"></a>
## Model Experience

### Task-specific guidance

#### What the model sees

The model sees `uma_guidance`, its public tool description, `operation_id`, operation state and task-specific results. It never receives the private resource catalog or reference bodies. Failures do not claim that unavailable references were used.

#### Token effect

One additional managed-model request consumes the current task budget. Public result text enters ordinary Session history; private model inputs remain server-side.

#### KV Cache effect

The local tool schema remains prefix-stable. Returned guidance appends to ordinary tool history; it does not replace the local system prompt with private resources.

## Known Limitations and Deferred Work

<a id="limitations"></a>

- The tool requires a device-grant UMA account and an imported workspace with a complete source fingerprint. It does not support private guidance through a standalone SDK key. Runtime source exclusions also exclude those files from freshness detection. The current server chooses the published model’s primary protocol and its reasoning defaults; preserving an explicitly selected alternate protocol and reasoning effort remains required adaptation work. Full corpus import, broader retrieval, removal of local private assets and private-mode quality comparisons remain migration work; this tool alone does not establish confidentiality or unchanged task quality.

<a id="dev-note"></a>
### Dev Note

None.
