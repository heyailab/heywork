---
description: "UMA-owned browser Remote assembly for knowledge, coding evidence and project Wiki."
kind: "package-reference"
---

# @deepseek-ai/dsh-client-uma-remotes

English | [中文](README.zh.md)

## Summary

UMA knowledge, delivery and Wiki pages call their Host services through this browser assembly. It keeps product-specific Remote definitions out of the generic kernel assembly while preserving the existing namespace names and method behavior.

## Table of Contents

- [Use this package](#use-this-package)
- [Lifecycle](#lifecycle)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="use-this-package"></a>
## Use this package

The UMA Web bundle mounts this package after the generic API assembly. UMA pages declare it as a Client module dependency and import its client type face. The UMA base bundle supplies the corresponding Host services; mounting this Client assembly does not create Host services or grant access.

```yaml
- id: uma-remotes
  name: '@deepseek-ai/dsh-client-uma-remotes'
```

There are no configuration fields. The selected namespaces are `knowledge`, `codingWorkbench` and `projectWiki`. Their generated owner definitions remain authoritative; no methods or payloads are duplicated here.

<a id="lifecycle"></a>
## Lifecycle

Contributions mount through the existing Gateway. Failed activation withdraws earlier contributions. Unload awaits every disposer in reverse order, continues cleanup if a disposer fails and reports the accumulated errors. A later activation can mount the same namespaces again. Host authorization, cancellation and wire validation remain with their existing owners.

<a id="model-experience"></a>
## Model Experience

### Browser requests

#### What the model sees

The `knowledge`, `codingWorkbench` and `projectWiki` browser Remote namespaces add no tools, prompt content or Session events.

#### Token effect

The browser assembly consumes no model tokens; invoked Host capabilities own any model requests.

#### KV Cache effect

No direct effect; Host capabilities own any model-visible behavior they trigger.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Custom product profiles must mount the matching Host providers and this Client assembly together.
- This separation does not move private design assets to a server or change their distribution policy.

<a id="dev-note"></a>
### Dev Note

None.
