/** Source-preserving parent/child passages and Chinese-aware lexical queries. @module */
import { createHash } from 'node:crypto';
/**
 * Fingerprint exact file bytes or model/index configuration.
 * @param value - UTF-8 text or binary bytes.
 * @returns lowercase SHA-256.
 */
export function knowledgeHash(value) {
    return createHash('sha256').update(value).digest('hex');
}
const STOP_WORDS = new Set([
    '的',
    '了',
    '是',
    '在',
    '和',
    '与',
    '及',
    '或',
    '吗',
    '呢',
    '啊',
    '有',
    '这',
    '那',
    '我们',
    '你',
    '我',
    '一个',
    '什么',
    '怎么',
    '如何',
    '请',
    '请问',
    '哪些',
    '一下',
    'the',
    'a',
    'an',
    'is',
    'are',
    'to',
    'of',
    'and',
    'or',
    'for',
    'with',
    'in',
    'on',
    'please',
    'what',
    'how',
]);
/**
 * Segment Chinese words and programming identifiers without sending text to a service.
 * @param text - source passage or query.
 * @returns unique normalized terms, excluding whitespace and punctuation.
 */
export function knowledgeTerms(text) {
    const words = [...new Intl.Segmenter('zh', { granularity: 'word' }).segment(text.normalize('NFKC').toLowerCase())]
        .filter(item => item.isWordLike)
        .map(item => item.segment);
    return [...new Set(words.filter(word => !STOP_WORDS.has(word) && /[\p{L}\p{N}]/u.test(word)))];
}
/**
 * Form an escaped FTS5 disjunction; query syntax never comes from user input.
 * @param text - natural-language question.
 * @returns a quoted query, or null for punctuation-only input.
 */
export function knowledgeFtsQuery(text) {
    const terms = knowledgeTerms(text).slice(0, 32);
    return terms.length === 0 ? null : terms.map(term => `"${term.replaceAll('"', '""')}"`).join(' OR ');
}
function textBoundary(text, offset) {
    const current = text.charCodeAt(offset);
    const previous = text.charCodeAt(offset - 1);
    return current >= 0xdc00 && current <= 0xdfff && previous >= 0xd800 && previous <= 0xdbff ? offset - 1 : offset;
}
/**
 * Split headings/pages into bounded parents and overlapping child windows.
 * @param document - normalized text with original page identities.
 * @param config - parent/child sizes and document passage cap.
 * @returns search windows carrying their complete bounded parent context.
 * @throws when the complete document exceeds the configured passage count.
 */
export function knowledgeChunks(document, config) {
    const chunks = [];
    let parentNumber = 0;
    for (const page of document.pages) {
        const lines = page.text.split('\n');
        let heading = '';
        let buffer = [];
        let firstLine = page.startLine;
        const flush = () => {
            const parentText = buffer.join('\n').trimEnd();
            if (parentText.trim() === '') {
                buffer = [];
                return;
            }
            const parentId = `p${parentNumber++}`;
            const endLine = firstLine + buffer.length - 1;
            for (let offset = 0, number = 0; offset < parentText.length; number++) {
                const end = textBoundary(parentText, Math.min(offset + config.childChars, parentText.length));
                const text = parentText.slice(offset, end);
                chunks.push({
                    id: `${parentId}-c${number}`,
                    parentId,
                    heading,
                    text,
                    parentText,
                    page: page.page,
                    startLine: firstLine,
                    endLine,
                });
                if (chunks.length > config.maxChunks)
                    throw new Error('too-many-chunks');
                if (end === parentText.length)
                    break;
                offset = textBoundary(parentText, end - config.overlapChars);
            }
            buffer = [];
        };
        for (const [lineNumber, line] of lines.entries()) {
            if (/^#{1,6}\s/u.test(line)) {
                flush();
                heading = line.replace(/^#{1,6}\s+/u, '').trim();
            }
            if (buffer.join('\n').length + line.length + 1 > config.parentChars)
                flush();
            if (buffer.length === 0)
                firstLine = page.startLine + lineNumber;
            // A single long row still has an exact original line reference.
            if (line.length > config.parentChars) {
                for (let start = 0; start < line.length;) {
                    const end = textBoundary(line, Math.min(start + config.parentChars, line.length));
                    buffer = [line.slice(start, end)];
                    firstLine = page.startLine + lineNumber;
                    flush();
                    start = end;
                }
            }
            else
                buffer.push(line);
        }
        flush();
    }
    return chunks;
}
/**
 * Merge lexical and dense rankings by reciprocal rank, with deterministic tie order.
 * @param rankings - strongest-first identifiers for each retrieval method.
 * @returns identifiers with fused scores, strongest first.
 */
export function knowledgeFusion(rankings) {
    const scores = new Map();
    for (const ranking of rankings)
        for (const [rank, id] of ranking.entries()) {
            scores.set(id, (scores.get(id) ?? 0) + 1 / (60 + rank + 1));
        }
    return [...scores].map(([id, score]) => ({ id, score })).sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
/**
 * Compare validated finite vectors of one embedding profile.
 * @param left - query vector.
 * @param right - passage vector.
 * @returns cosine similarity, or zero for a zero-norm vector.
 * @throws when vector dimensions differ.
 */
export function knowledgeCosine(left, right) {
    if (left.length !== right.length)
        throw new Error('embedding-dimensions-changed');
    let leftScale = 0;
    let rightScale = 0;
    for (const value of left)
        leftScale = Math.max(leftScale, Math.abs(value));
    for (const value of right)
        rightScale = Math.max(rightScale, Math.abs(value));
    if (leftScale === 0 || rightScale === 0)
        return 0;
    let dot = 0;
    let a = 0;
    let b = 0;
    for (const [index, value] of left.entries()) {
        const normalized = value / leftScale;
        const other = right[index] / rightScale;
        dot += normalized * other;
        a += normalized * normalized;
        b += other * other;
    }
    return a === 0 || b === 0 ? 0 : dot / Math.sqrt(a * b);
}
//# sourceMappingURL=text.js.map