import { credentialRef } from '@deepseek-ai/dsh-credentials';
import { z } from 'zod';
import { knowledgeHash } from "./text.js";
/** Validated provider profile shared by ingestion and query embedding. */
export class KnowledgeEmbeddings {
    ctx;
    config;
    /** Fingerprint of the configured model and prefixes, or null when disabled. */
    profile;
    /**
     * Reject partial configuration before any document is admitted.
     * @param ctx - per-operation credential resolution.
     * @param config - explicit endpoint, model, prefixes and bounds.
     */
    constructor(ctx, config) {
        this.ctx = ctx;
        this.config = config;
        const enabled = config.embeddingUrl !== undefined || config.embeddingModel !== undefined || config.embeddingKeyRef !== undefined;
        if (enabled && (config.embeddingUrl === undefined || config.embeddingModel?.trim() === ''))
            throw new Error('incomplete-embedding-configuration');
        if (enabled && config.embeddingModel === undefined)
            throw new Error('incomplete-embedding-configuration');
        if (config.embeddingUrl !== undefined) {
            const url = new URL(config.embeddingUrl);
            if (!['http:', 'https:'].includes(url.protocol) ||
                url.username !== '' ||
                url.password !== '' ||
                url.search !== '' ||
                url.hash !== '')
                throw new Error('invalid-embedding-url');
        }
        this.profile = !enabled
            ? null
            : knowledgeHash(JSON.stringify({
                url: config.embeddingUrl,
                model: config.embeddingModel,
                queryPrefix: config.queryPrefix,
                documentPrefix: config.documentPrefix,
            }));
    }
    /**
     * Embed one bounded batch through the explicitly configured provider.
     * @param texts - query or passage strings.
     * @param query - select the model-specific query prefix.
     * @param signal - caller and service cancellation.
     * @returns finite, dimension-consistent vectors in input order.
     */
    async embed(texts, query, signal) {
        try {
            return await this.request(texts, query, signal);
        }
        catch (error) {
            if (signal.aborted)
                throw error;
            if (error instanceof Error &&
                ['embedding-not-configured', 'embedding-credential-missing', 'embedding-response-too-large'].includes(error.message))
                throw error;
            throw new Error('embedding-provider-failed');
        }
    }
    async request(texts, query, signal) {
        if (this.profile === null || this.config.embeddingUrl === undefined || this.config.embeddingModel === undefined)
            throw new Error('embedding-not-configured');
        const credential = this.config.embeddingKeyRef === undefined
            ? undefined
            : await this.ctx.credentials.resolve(credentialRef(this.config.embeddingKeyRef));
        if (this.config.embeddingKeyRef !== undefined && credential === undefined)
            throw new Error('embedding-credential-missing');
        const response = await fetch(this.config.embeddingUrl, {
            method: 'POST',
            signal: AbortSignal.any([signal, AbortSignal.timeout(this.config.embeddingTimeoutMs)]),
            headers: {
                'content-type': 'application/json',
                ...(credential === undefined ? {} : { authorization: `Bearer ${credential.value}` }),
            },
            body: JSON.stringify({
                model: this.config.embeddingModel,
                input: texts.map(text => `${query ? this.config.queryPrefix : this.config.documentPrefix}${text}`),
                encoding_format: 'float',
            }),
        });
        if (!response.ok || response.body === null) {
            await response.body?.cancel();
            throw new Error('embedding-provider-failed');
        }
        const reader = response.body.getReader();
        let bytes = 0;
        const chunks = [];
        try {
            for (;;) {
                const next = await reader.read();
                if (next.done)
                    break;
                bytes += next.value.byteLength;
                if (bytes > this.config.maxEmbeddingResponseBytes)
                    throw new Error('embedding-response-too-large');
                chunks.push(next.value);
            }
        }
        finally {
            await reader.cancel();
            reader.releaseLock();
        }
        const body = z
            .object({
            data: z
                .array(z.object({
                index: z.number().int().min(0),
                embedding: z
                    .array(z.number())
                    .min(1)
                    .max(this.config.maxEmbeddingDimensions)
                    .refine(vector => vector.some(value => value !== 0)),
            }))
                .length(texts.length),
        })
            .parse(JSON.parse(Buffer.concat(chunks).toString('utf8')));
        const ordered = body.data.toSorted((a, b) => a.index - b.index);
        if (ordered.some((item, index) => item.index !== index || item.embedding.length !== ordered[0]?.embedding.length))
            throw new Error('invalid-embedding-output');
        return ordered.map(item => item.embedding);
    }
}
//# sourceMappingURL=embedding.js.map