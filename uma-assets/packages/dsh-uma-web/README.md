---
description: "UMA browser modules, product presets and incremental standard/PTC capabilities."
kind: "package-bundle"
---

# @deepseek-ai/dsh-uma-web

English | [中文](README.zh.md)

## Summary

This private bundle adds UMA browser pages and incremental standard/PTC capabilities to the kernel Web application. Shared product presets live in UMA base and remain available without a browser. UMA Web and Desktop profiles select this layer explicitly; ordinary kernel Web profiles do not.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

The product profile contains the kernel base, kernel Web application, UMA base and this bundle in that order. Start the prepared source profile with `dsh --profile uma-web`; Desktop selects the same product layers through its reserved profile.

The account issuer and managed model catalog default to `https://studio.umayun.com`. `UMA_STUDIO_API_ORIGIN` selects another canonical service origin; an HTTP loopback account endpoint additionally requires `UMA_STUDIO_ALLOW_LOOPBACK_HTTP=1`. The account plugin validates the origin before activation. Later profile patches and the Desktop product overlay retain configuration ownership.

New UMA Web and Desktop installations create their default Workspace under the resolved Harness home's `workspaces/default-workspace`. A prepared profile with an explicit `DSH_HOME` keeps that directory inside the selected home. Existing Workspace registrations and Session paths remain unchanged; see the [default Workspace migration](../../../docs/upgrade-guide/v0.2.2-rc.1/uma-default-workspace/guide.md).

The product layer selects UMA browser authorization, published models and the four managed protocol routes. Direct DeepSeek credentials, upstream product telemetry, official branding and provider-editing pages are disabled in this composition. The kernel Web profile remains independent. Existing DeepSeek grants do not authorize UMA requests; see the [account migration](../../../docs/upgrade-guide/v0.2.2-rc.1/uma-web-managed-account/guide.md).

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

The patch declares the knowledge, design, delivery, repository Wiki and UMA brand modules. Its preset files retain the UMA design, office, team, Wiki, author and reviewer identities. Browser tools and pages keep their behavior in their owning packages.

[The patch declaration](cordis.patch.yml) and `package.json` maintain the runtime dependency set together. Product packages remain private and travel with the local distribution.

</details>

<a id="model-experience"></a>
## Model Experience

### Composed capabilities

#### What the model sees

The selected plugins contribute capabilities such as `coding_inspect`, `coding_check` and `standard` preset context to the Agent. Each plugin package owns its tool schemas and context text. This bundle makes no model request.

#### Token effect

Depends on the selected Agent composition; the contributing plugin packages define tool and context bounds.

#### KV Cache effect

Bundle, preset or configuration changes can replace tools and context in the request prefix. Provider cache availability and eviction are outside this bundle’s guarantees.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- This layer requires the Web transport and UMA Host services. The Office preset retains its Desktop availability rule. It is not suitable for a headless or SDK profile.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

Upstream owns the kernel profile templates and optional bundle list; UMA profiles explicitly select the product layers.

</details>
