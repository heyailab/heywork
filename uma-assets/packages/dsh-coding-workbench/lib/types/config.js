/** Validated coding workbench resource and command-execution limits. */
import z from '@deepseek-ai/schemastery';
/** Defaults and integer validation shared by Loader, tests and direct consumers. */
export const Config = z.object({
    dshHome: z.string(),
    leaseWaitMs: z.number().step(1).min(1).default(2000),
    maxFiles: z.number().step(1).min(1).default(20000),
    maxFileBytes: z.number().step(1).min(1).default(2 * 1024 * 1024),
    maxSourceBytes: z.number().step(1).min(1).default(64 * 1024 * 1024),
    maxOutputBytes: z.number().step(1).min(1).default(128 * 1024),
    checkTimeoutMs: z.number().step(1).min(1).default(120000),
    graceMs: z.number().step(1).min(1).default(2000),
    maxRecords: z.number().step(1).min(1).default(1000),
    duplicateWindowLines: z.number().step(1).min(3).max(100).default(6),
    experienceQueryLimit: z.number().step(1).min(1).max(20).default(5),
    resultLimit: z.number().step(1).min(1).default(100),
    concurrency: z.number().step(1).min(1).default(2),
    repairTimeoutMs: z.number().step(1).min(1).default(300000),
    repairAttempts: z.number().step(1).min(1).max(10).default(3),
    excludedDirectories: z.array(z.string()).default(['node_modules', 'dist', 'build', 'coverage', '.venv', 'venv', '__pycache__', 'target', '.next']),
    exportMaxBytes: z.number().step(1).min(1).default(8 * 1024 * 1024),
    contextBytes: z.number().step(1).min(1).default(32768),
});
//# sourceMappingURL=config.js.map