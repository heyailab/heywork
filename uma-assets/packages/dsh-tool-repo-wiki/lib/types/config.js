/** Deployment bounds for repository Wiki indexing and generation. @module */
import z from '@deepseek-ai/schemastery';
import { MAX_WIKI_PAGES } from '@deepseek-ai/dsh-util-repo-wiki';
/** Parse all deployment-varying scanner and publication limits. */
export const Config = z.object({
    automaticContext: z.boolean().default(true),
    maxFiles: z.number().step(1).min(1).default(50000),
    maxFileBytes: z.number().step(1).min(1024).default(524288),
    maxScanBytes: z.number().step(1).min(1024).default(134217728),
    maxPageBytes: z.number().step(1).min(1024).default(131072),
    maxRecordBytes: z.number().step(1).min(1024).default(33554432),
    maxPages: z.number().step(1).min(1).max(MAX_WIKI_PAGES).default(200),
    gitTimeoutMs: z.number().step(1).min(1000).default(30000),
    gitOutputMaxBytes: z.number().step(1).min(1024).default(8388608),
    allowUncitedPageReads: z.boolean().default(false),
    contextMaxBytes: z.number().step(1).min(1024).default(16384),
    maxFreshnessFiles: z.number().step(1).min(1).default(256),
    searchLimit: z.number().step(1).min(1).max(50).default(8),
    maxSnippetChars: z.number().step(1).min(100).default(2000),
    maxPlanBytes: z.number().step(1).min(1024).default(32768),
    sourceWindowMaxBytes: z.number().step(1).min(1024).default(32768),
    catalogRetries: z.number().step(1).min(1).max(20).default(5),
    gitExecutable: z.string().default('git'),
    excludeDirectories: z
        .array(z.string())
        .default([
        'node_modules',
        'vendor',
        'dist',
        'lib',
        'build',
        'coverage',
        '.git',
        '.uma',
        '.next',
        '.cache',
        '.playwright-mcp',
    ]),
});
//# sourceMappingURL=config.js.map