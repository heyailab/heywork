---
description: "UMA session financial budget display and account-owned controls."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-uma-task-budget

English | [中文](README.zh.md)

## Summary

The UMA Web composition contributes a Task budget recovery action only to task-budget refusal messages; session headers have no budget button. The panel reads the authenticated Host service, shows settled spend, reservations, the shared root session and operations pause reasons, and updates the account-owned cap and state with the observed version.

## Table of Contents

- [Use this package](#use-this-package)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)

## Use this package

The [UMA Web bundle](../../bundle/uma-web/cordis.patch.yml) mounts this plugin. The plugin mounts and disposes its generated `uma-budget` Remote namespace; ordinary kernel Web profiles do not gain a UMA commercial dependency. The [Host budget service](../../credentials/uma-task-budget/README.md) owns account authorization, root resolution and financial admission.

Amounts remain CNY decimal strings with up to six fractional digits, or an explicit null for no additional task cap. A version conflict refreshes current server facts while preserving edits for review; it never blindly resends the update. Closing the panel or changing account cancels its pending operations and removes stale account data. Pausing or closing blocks new admissions; already accepted calls can still settle. Budget refusal actions open the same editor and never replay inference, recommend a recharge as a budget fix, or sign out a newer account.

The UI uses existing Button and Modal primitives, focus management, theme tokens and English/Chinese dictionaries. Other application languages use the complete English fallback. Both the current account and its Remote read permission must be available before the refusal recovery action appears.

## Model Experience

### Presentation only

#### What the model sees

None. The human invokes `uma-budget/read` and `uma-budget/update` through the refusal recovery action. The panel does not add model messages, tools, prompt sections or session events. Financial admission remains a Host and server responsibility.

#### Token effect

None; UI reads and metadata updates do not make model calls.

#### KV Cache effect

None; this package does not assemble provider requests.

## Known Limitations and Deferred Work

- The panel reads on open, after a version conflict, and on explicit refresh. It does not claim to stream continuously changing spending totals. Operations pauses remain distinct from an account-owned paused state and cannot be cleared by editing the task cap.

### Dev Note

Component tests cover exact decimal transport, conflict input preservation, refusal recovery, cancellation, shared budgets and account changes. The browser module composition test uses the real generated Remote contribution and slot registration, and verifies unload/reload disposal; only RPC responses and nondeterministic external account state are replaced.
