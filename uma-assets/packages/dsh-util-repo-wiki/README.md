---
description: "Validate portable project Wiki records, document trees, source citations and incremental dependency impact."
kind: "package-library"
---

# @deepseek-ai/dsh-util-repo-wiki

English | [中文](README.zh.md)

## Summary

Validate a repository Wiki before displaying, importing, or using its knowledge. The same schemas protect the browser and generation tools. Pages carry exact source hashes and line ranges; ready editions require published articles and Knowledge Cards. Import dependency changes invalidate affected pages transitively.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Consume the library through its workspace package name. `wikiManifestSchema`, `wikiIndexSchema`, and `wikiCatalogSchema` validate file and wire inputs; `validateWikiTree` rejects cycles and missing parents, while `wikiImpact` computes affected pages.

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

Records use format version 1 under `.hey/wiki`. Article ids are validated before branding; source paths reject absolute roots, traversal, backslashes and control characters. Source fingerprints describe file content, independently of timestamp metadata. Chinese and English questions use word segmentation for lexical retrieval.

</details>

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- The library validates citations against indexed metadata; the owning tool must compare current source bytes.
- Import relationships are supplied by the indexer; the library does not parse programming languages.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
