/** Document extraction through an isolated PDF worker and the existing Office converter. @module */
import { Worker } from 'node:worker_threads';
import { extname } from 'node:path';
import { brandString } from '@deepseek-ai/dsh-brand';
import { z } from 'zod';
import { readKnowledgeFile } from "./files.js";
import { knowledgeHash } from "./text.js";
/**
 * Classify one supported operator-selected source; unsupported types are never executed.
 * @param name - display filename, independent of its native path.
 * @returns normalized file extension, or null when unsupported.
 */
export function knowledgeExtension(name) {
    const extension = extname(name).slice(1).toLowerCase();
    return [
        'md',
        'mdx',
        'txt',
        'csv',
        'tsv',
        'json',
        'yaml',
        'yml',
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
    ].includes(extension)
        ? extension
        : null;
}
async function pdfPages(bytes, config, signal) {
    signal.throwIfAborted();
    const sourceMode = import.meta.url.endsWith('.ts');
    const worker = new Worker(new URL(sourceMode ? './pdf-worker.ts' : './pdf-worker.js', import.meta.url), {
        workerData: { bytes, maxPages: config.maxPages, maxTextBytes: config.maxTextBytes },
        execArgv: sourceMode ? ['--import', 'tsx/esm'] : [],
        resourceLimits: { maxOldGenerationSizeMb: config.workerMemoryMb },
    });
    const lifetime = AbortSignal.any([signal, AbortSignal.timeout(config.parseTimeoutMs)]);
    let stop;
    try {
        return await new Promise((resolve, reject) => {
            stop = () => {
                reject(new Error(signal.aborted ? 'cancelled' : 'parse-timeout'));
            };
            lifetime.addEventListener('abort', stop, { once: true });
            if (lifetime.aborted) {
                stop();
                return;
            }
            worker.once('error', () => {
                reject(new Error('pdf-worker-failed'));
            });
            worker.once('exit', (code) => {
                if (code !== 0)
                    reject(new Error('pdf-worker-failed'));
            });
            worker.once('message', (message) => {
                const result = z
                    .discriminatedUnion('ok', [
                    z.object({ ok: z.literal(true), pages: z.array(z.string()).max(config.maxPages) }),
                    z.object({ ok: z.literal(false), reason: z.string().max(100) }),
                ])
                    .safeParse(message);
                if (!result.success) {
                    reject(new Error('invalid-pdf-worker-output'));
                    return;
                }
                if (!result.data.ok) {
                    reject(new Error(result.data.reason));
                    return;
                }
                resolve(result.data.pages);
            });
        });
    }
    finally {
        if (stop !== undefined)
            lifetime.removeEventListener('abort', stop);
        await worker.terminate();
    }
}
/**
 * Extract exact source text; scanned PDFs fail explicitly instead of indexing empty content.
 * @param ctx - existing Host Office conversion capability.
 * @param job - claimed immutable source version.
 * @param config - parsing limits.
 * @param signal - service/operation lifetime.
 * @returns normalized Markdown and page/line coordinates.
 */
export async function extractKnowledge(ctx, job, config, signal) {
    const extension = knowledgeExtension(job.name);
    if (extension === null)
        throw new Error('unsupported-format');
    let bytes;
    const read = async (readSignal, maxBytes) => {
        const value = await readKnowledgeFile(job.pending_path, Math.min(maxBytes, config.maxFileBytes), readSignal);
        if (knowledgeHash(value) !== job.pending_hash)
            throw new Error('knowledge-object-modified');
        return { bytes: value, version: job.pending_hash };
    };
    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
        const converted = await ctx.officeKit.convert({
            extension: extension,
            priority: 'foreground',
            source: {
                key: brandString(`knowledge:${job.id}`),
                version: job.pending_hash,
                bytes: job.bytes,
                read,
            },
        }, signal);
        if (converted.pdf.byteLength > config.maxFileBytes)
            throw new Error('file-too-large');
        bytes = converted.pdf;
    }
    else
        bytes = (await read(signal, config.maxFileBytes)).bytes;
    if (extension !== 'pdf' && !['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
        const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes).replaceAll('\r\n', '\n').replaceAll('\r', '\n');
        if (text.includes('\0') || text.trim() === '')
            throw new Error('empty-or-binary-text');
        if (Buffer.byteLength(text) > config.maxTextBytes)
            throw new Error('text-too-large');
        return { markdown: text, pages: [{ page: null, text, startLine: 1 }] };
    }
    const pages = await pdfPages(bytes, config, signal);
    let markdown = '';
    let line = 1;
    const indexed = pages.map((text, index) => {
        markdown += `<!-- page:${index + 1} -->\n`;
        line++;
        const result = { page: index + 1, text, startLine: line };
        markdown += `${text}\n\n`;
        line += text.split('\n').length + 1;
        return result;
    });
    return { markdown, pages: indexed };
}
//# sourceMappingURL=extract.js.map