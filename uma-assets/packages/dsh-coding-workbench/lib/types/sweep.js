/** Pure diff-sweep detectors for the mechanical pathologies AI-written code recurs to. */
import { createScanner, LanguageVariant, ScriptTarget, SyntaxKind } from 'typescript';
/** Languages the sweep understands today; everything else is reported as skipped. */
const COVERED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.mts', '.cts']);
/**
 * Check whether the sweep supports a changed file's language.
 * @param path - The changed file path.
 * @returns Whether the file extension is supported.
 */
export function isCoveredPath(path) {
    const dot = path.lastIndexOf('.');
    if (dot <= 0)
        return false;
    return COVERED_EXTENSIONS.has(path.slice(dot).toLowerCase());
}
/**
 * Extract added lines from one unified diff body (`git diff -U0` for one file): lines starting
 * with `+` but not `+++`, numbered by their position in the new version.
 * Pure; tests pin the hunk arithmetic.
 * @param path - the file the diff body belongs to.
 * @param diffBody - the unified diff for that file.
 * @returns the added lines with new-version line numbers.
 */
export function addedLinesFromDiff(path, diffBody) {
    const added = [];
    let newline = 0;
    for (const line of diffBody.split(/\r?\n/u)) {
        const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/u.exec(line);
        if (hunk !== null) {
            newline = Number(hunk[1]);
            continue;
        }
        if (newline === 0)
            continue;
        if (line.startsWith('+')) {
            added.push({ path, line: newline, text: line.slice(1) });
            newline += 1;
        }
        else if (line.startsWith('-') || line.startsWith('\\')) {
            continue;
        }
        else {
            newline += 1;
        }
    }
    return added;
}
/** High-precision secret patterns; each match is a finding, near-misses are not listed. */
const SECRET_PATTERNS = [
    { re: /sk-[A-Za-z0-9]{20,}/u, detail: 'Possible API key (sk-…). Move it to configuration and rotate the exposed value.' },
    { re: /AKIA[0-9A-Z]{16}/u, detail: 'Possible AWS access key id. Remove and rotate.' },
    { re: /ghp_[A-Za-z0-9]{36}/u, detail: 'Possible GitHub token. Remove and rotate.' },
    { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/u, detail: 'A private key body must never enter the repository.' },
];
/** Placeholder marker: the artifact gate rejects these in documents; code must not carry them either. */
const PLACEHOLDER_RE = /\b(?:TODO|FIXME|XXX)\b|lorem ipsum/u;
/** Bare import/require specifier extraction for TS/JS. */
const IMPORT_RE = /(?:^|\n)\s*(?:import\s[^'"]*from\s*|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/gu;
/**
 * Detect bare module imports that are absent from the declared dependency manifest — the
 * mechanical defense against hallucinated packages (slopsquatting). Relative imports and node
 * builtins are skipped; only package.json unresolvable names are findings.
 * @param added - added lines of one covered file.
 * @param declared - package names declared in the workspace manifest (dependencies + devDependencies).
 * @returns one finding per undeclared bare specifier, at its first occurrence.
 */
export function detectUnverifiedImports(added, declared) {
    const findings = [];
    const seen = new Set();
    for (const { path, line, text } of added) {
        for (const match of text.matchAll(IMPORT_RE)) {
            const specifier = match[1] ?? '';
            const bare = specifier.startsWith('@') ? specifier.split('/').slice(0, 2).join('/') : specifier.split('/')[0];
            if (bare === undefined || bare === '' || declared.has(bare) || seen.has(bare))
                continue;
            if (specifier.startsWith('.') || specifier.startsWith('#'))
                continue;
            seen.add(bare);
            findings.push({
                kind: 'unverified-import',
                path,
                line,
                snippet: specifier.slice(0, 200),
                detail: `Import "${bare}" is not declared in the workspace manifest. Verify the package exists, add it with a pinned version, or use an already-declared dependency — a model-invented package is a supply-chain attack waiting for a build.`,
            });
        }
    }
    return findings;
}
/**
 * Detect placeholder markers on added lines.
 * @param added - added lines of one covered file.
 * @returns placeholder findings.
 */
export function detectPlaceholders(added) {
    const findings = [];
    for (const { path, line, text } of added) {
        if (!PLACEHOLDER_RE.test(text))
            continue;
        findings.push({
            kind: 'placeholder',
            path,
            line,
            snippet: text.trim().slice(0, 200),
            detail: 'Placeholder marker on an added line. A shipped change carries real behavior, not TODO/FIXME bodies.',
        });
    }
    return findings;
}
/**
 * Detect high-precision secret patterns on added lines.
 * @param added - added lines of one covered file.
 * @returns secret findings.
 */
export function detectSecrets(added) {
    const findings = [];
    for (const { path, line, text } of added) {
        for (const pattern of SECRET_PATTERNS) {
            const match = pattern.re.exec(text);
            if (match === null)
                continue;
            findings.push({
                kind: 'secret',
                path,
                line,
                snippet: `${match[0].slice(0, 6)}…`,
                detail: pattern.detail,
            });
        }
    }
    return findings;
}
/**
 * Split one Git diff into per-file bodies keyed by the new-side path.
 * @param diff - Unified Git diff text.
 * @returns Matched file paths and their diff text.
 */
export function splitDiffByFile(diff) {
    const files = [];
    let current;
    for (const line of diff.split(/\r?\n/u)) {
        const start = /^diff --git a\/(.+) b\/(.+)$/u.exec(line);
        if (start !== null) {
            if (current !== undefined)
                files.push([current.path, current.body.join('\n')]);
            current = { path: start[2] ?? '', body: [] };
            continue;
        }
        if (current !== undefined)
            current.body.push(line);
    }
    if (current !== undefined)
        files.push([current.path, current.body.join('\n')]);
    return files;
}
/** Node builtins are always resolvable; the import detector never flags them. */
export const BUILTIN_MODULE_NAMES = new Set([
    'assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'events', 'fs', 'http', 'http2',
    'https', 'inspector', 'module', 'net', 'os', 'path', 'perf_hooks', 'process', 'punycode', 'querystring',
    'readline', 'repl', 'stream', 'string_decoder', 'timers', 'tls', 'trace_events', 'tty', 'url', 'util',
    'v8', 'vm', 'worker_threads', 'zlib',
]);
/** Whether one normalized line is content-bearing (not empty or a pure comment). */
function isContentLine(line) {
    const trimmed = line.trim();
    if (trimmed === '')
        return false;
    return !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
}
/** Compare token structure while preserving literals and repeated identifier relationships. */
function structuralKey(text) {
    const scanner = createScanner(ScriptTarget.Latest, true, LanguageVariant.Standard, text);
    const names = new Map();
    const tokens = [];
    for (let kind = scanner.scan(); kind !== SyntaxKind.EndOfFileToken; kind = scanner.scan()) {
        const value = scanner.getTokenText();
        if (kind === SyntaxKind.Identifier) {
            if (!names.has(value))
                names.set(value, names.size);
            tokens.push(`id:${names.get(value)}`);
        }
        else {
            tokens.push(`${kind}:${value}`);
        }
    }
    return tokens.join('|');
}
/**
 * Detect duplicated code blocks across the added lines: structurally matching
 * contiguous six-line windows appearing at two non-overlapping locations (different
 * files, or far apart in one file). This is the mechanical defense against
 * the copy-paste-a-helper-into-two-files pathology; identifier renaming is normalized, while literals remain distinct.
 * @param addedByFile - added lines grouped by file path.
 * @param limit - result cap.
 * @param windowSize - contiguous line count; callers pass their deployment setting.
 * @returns one finding per duplicated location beyond the first, bounded.
 */
export function detectDuplicatedBlocks(addedByFile, limit, windowSize = 6) {
    const windows = [];
    for (const [path, lines] of addedByFile) {
        const normalized = lines.map(line => ({ ...line, norm: line.text.trim() }));
        for (let i = 0; i + windowSize <= normalized.length; i++) {
            const windowLines = normalized.slice(i, i + windowSize);
            if (windowLines.some((line, offset) => line.line !== (windowLines[0]?.line ?? 0) + offset))
                continue;
            const content = windowLines.filter(line => isContentLine(line.text));
            // A window that is mostly blank or import scaffolding is not a copied block.
            if (content.length < windowSize - 1)
                continue;
            if (windowLines.every(line => /^import\b|^from\b/.test(line.norm)))
                continue;
            const key = structuralKey(windowLines.map(line => line.text).join('\n'));
            windows.push({ key, path, startLine: windowLines[0]?.line ?? 0, start: i });
        }
    }
    const findings = [];
    const firstByKey = new Map();
    for (const window of windows) {
        if (findings.length >= limit)
            break;
        const first = firstByKey.get(window.key);
        if (first === undefined) {
            firstByKey.set(window.key, window);
            continue;
        }
        if (first.path === window.path && window.start - first.start < windowSize)
            continue;
        findings.push({
            kind: 'duplicated-code', path: window.path, line: window.startLine,
            snippet: window.key.slice(0, 200),
            detail: `A ${windowSize}-line block structurally matching ${first.path}:${first.startLine} appears here. Review whether the shared logic should be extracted.`,
        });
    }
    return findings;
}
//# sourceMappingURL=sweep.js.map