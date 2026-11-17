import { n as redactArgv, r as redactOutput } from "./process-UWH2go78.js";
import { createHash } from "node:crypto";
//#region lib/types/experience.js
/** Parsing and relevance matching for the team experience ledger (`.hey/experience.md`). */
const TERM_LIMIT = 64;
const SYMPTOM_LIMIT = 4096;
const QUERY_MAX_CHARS = 2e3;
const QUERY_STOP_WORDS = new Set([
	"请",
	"请问",
	"帮忙",
	"帮我",
	"一下",
	"我们",
	"这个",
	"那个",
	"这些",
	"那些",
	"一个",
	"现在",
	"目前",
	"已经",
	"还是",
	"继续",
	"然后",
	"以及",
	"还有",
	"可以",
	"需要",
	"什么",
	"怎么",
	"如何",
	"为什么",
	"是否",
	"进行",
	"相关",
	"问题",
	"功能",
	"出现",
	"发生",
	"导致",
	"修复",
	"解决",
	"处理",
	"修改",
	"优化",
	"检查",
	"排查",
	"分析",
	"实现"
]);
/** Redact common credentials before an authored lesson is returned to a model. */
function safeEntry(entry) {
	return {
		date: entry.date,
		title: redactOutput(entry.title),
		symptom: redactOutput(entry.symptom),
		rootCause: redactOutput(entry.rootCause),
		fix: redactOutput(entry.fix),
		verification: redactOutput(entry.verification),
		source: redactOutput(entry.source)
	};
}
function queryTerms(terms) {
	return [...new Set(terms.map(normalizeTerm).filter((term) => term !== ""))].slice(0, TERM_LIMIT);
}
/**
* Extract bounded lookup terms from natural-language tasks, including unspaced Chinese.
* Non-Chinese literals retain path/error punctuation and take priority over segmented words.
* @param query - Task text; at most its first 2000 UTF-16 code units are considered.
* @returns At most 64 distinct case-insensitive terms, excluding Chinese request filler.
*/
function experienceQueryTerms(query) {
	const text = query.slice(0, QUERY_MAX_CHARS);
	const literals = text.split(/\s+/u).flatMap((term) => {
		if (!/\p{Script=Han}/u.test(term)) return [term];
		const embedded = term.replace(/[\p{Script=Han}，。！？；：“”‘’、（）【】《》]+/gu, " ").split(/\s+/u).filter((value) => /[\p{L}\p{N}]/u.test(value));
		return /[/\\._:=]/u.test(term) ? [term, ...embedded] : embedded;
	}).filter((term) => /[\p{L}\p{N}]/u.test(term));
	const words = [...new Intl.Segmenter("zh", { granularity: "word" }).segment(text)].filter((item) => item.isWordLike && /\p{Script=Han}/u.test(item.segment) && Array.from(item.segment).length > 1 && !QUERY_STOP_WORDS.has(item.segment)).map((item) => item.segment);
	return queryTerms([...literals, ...words]);
}
function matchTerms(text, terms) {
	let score = 0;
	const matchedTerms = [];
	for (const term of terms) {
		const base = term.split("/").at(-1) ?? term;
		let hits = 0;
		if (text.includes(term)) hits += 2;
		if (base !== term && base.length >= 3 && text.includes(base)) hits += 1;
		if (hits > 0) {
			matchedTerms.push(redactOutput(term));
			score += hits;
		}
	}
	return {
		score,
		matchedTerms
	};
}
/**
* Parse the experience ledger written by the team skill. Entries are
* `## YYYY-MM-DD — title` sections with `- Symptom/- Root cause/- Fix/-
* Verification/- Source:` bullet fields; malformed sections are skipped so a
* hand-edited ledger never breaks the search.
* @param content - the ledger file text.
* @returns parsed entries in file order; matching prefers recent appended corrections.
*/
function parseExperienceLedger(content) {
	const entries = [];
	let current;
	const flush = () => {
		if (current === void 0) return;
		entries.push({
			date: current.date,
			title: current.title,
			symptom: current.fields.get("symptom") ?? "",
			rootCause: current.fields.get("root cause") ?? "",
			fix: current.fields.get("fix") ?? "",
			verification: current.fields.get("verification") ?? "",
			source: current.fields.get("source") ?? ""
		});
		current = void 0;
	};
	for (const line of content.split(/\r?\n/u)) {
		const head = /^##\s+(\d{4}-\d{2}-\d{2})\s+[—–-]\s+(.+)$/u.exec(line);
		if (head !== null) {
			flush();
			current = {
				date: head[1] ?? "",
				title: (head[2] ?? "").trim(),
				fields: /* @__PURE__ */ new Map()
			};
			continue;
		}
		if (current === void 0) continue;
		const field = /^-\s+([A-Za-z ]+):\s*(.*)$/u.exec(line);
		if (field !== null) current.fields.set((field[1] ?? "").toLowerCase().trim(), (field[2] ?? "").trim());
	}
	flush();
	return entries;
}
/** Lowercase a term and strip a leading path so `packages/web/src/x.ts` matches `x.ts` mentions. */
function normalizeTerm(term) {
	return term.toLowerCase().trim();
}
/** The searchable text of one entry: title plus the five fields. */
function entryText(entry) {
	return `${entry.title}\n${entry.symptom}\n${entry.rootCause}\n${entry.fix}\n${entry.verification}`.toLowerCase();
}
/**
* Match ledger entries against a query: file paths match by basename or full
* path, other terms by case-insensitive occurrence in the entry text. Pure so
* tests pin the relevance contract.
* @param entries - parsed ledger entries.
* @param terms - query terms (file paths, subsystem names, error fragments).
* @returns deduplicated relevant entries, ranked by score then recent date and append order.
*/
function matchExperience(entries, terms) {
	const normalized = queryTerms(terms);
	if (normalized.length === 0) return [];
	const matches = [];
	for (const [index, raw] of entries.entries()) {
		const entry = safeEntry(raw);
		const { score, matchedTerms } = matchTerms(entryText(entry), normalized);
		if (score > 0) matches.push({
			match: {
				entry,
				score,
				matchedTerms
			},
			index
		});
	}
	matches.sort((a, b) => b.match.score - a.match.score || b.match.entry.date.localeCompare(a.match.entry.date) || b.index - a.index);
	const seen = /* @__PURE__ */ new Set();
	return matches.filter(({ match }) => {
		const key = JSON.stringify([entryText(match.entry), match.entry.source]);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	}).map((value) => value.match);
}
/**
* Extract candidate query terms from the changed-file set: basenames of the
* touched files, so a ledger entry that mentions a touched file surfaces.
* @param changedFiles - workspace-relative changed paths.
* @returns one basename term per file, deduplicated.
*/
function termsFromChangedFiles(changedFiles) {
	const terms = [];
	for (const path of changedFiles) {
		const base = path.split("/").at(-1) ?? path;
		if (base !== "" && !terms.includes(base)) terms.push(base);
	}
	return terms;
}
/**
* Search a ledger source file for entries matching the query terms.
* @param file - the read ledger source (absent when the workspace has no ledger yet).
* @param terms - query terms.
* @param limit - result cap.
* @returns the search outcome.
*/
function searchLedger(file, terms, limit) {
	if (file === void 0) return {
		history: [],
		ledgerFound: false,
		ledgerState: "missing",
		notices: [],
		total: 0,
		terms: [],
		matches: []
	};
	const entries = parseExperienceLedger(new TextDecoder("utf-8", { fatal: false }).decode(file.bytes));
	return {
		history: [],
		ledgerFound: true,
		ledgerState: "available",
		notices: [],
		total: entries.length,
		terms: queryTerms(terms).map(redactOutput),
		matches: matchExperience(entries, terms).slice(0, limit)
	};
}
/**
* Keep an absent ledger distinct from an unavailable source, while cancellation remains fatal.
* @param read - bounded same-workspace source read owned by the workbench.
* @param signal - request and service lifetime.
* @param report - local diagnostic sink; native errors never enter the returned reference data.
* @returns the source and an explicit availability state.
*/
async function readExperienceLedger(read, signal, report) {
	signal.throwIfAborted();
	try {
		const file = await read();
		signal.throwIfAborted();
		return {
			file,
			state: file === void 0 ? "missing" : "available"
		};
	} catch (error) {
		signal.throwIfAborted();
		report(error);
		return {
			file: void 0,
			state: "unavailable"
		};
	}
}
/**
* Retrieve cited history through the workspace-filtered full-text service.
* @param search - existing SessionQuery search method.
* @param cwd - canonical workspace directory.
* @param terms - already bounded distinct lookup terms.
* @param exclude - requesting session, excluded from returned evidence.
* @param limit - maximum unique sessions retained.
* @param signal - operation cancellation.
* @returns unique session/event citations with bounded provider snippets.
*/
async function lookupWorkspaceHistory(search, cwd, terms, exclude, limit, signal) {
	const history = /* @__PURE__ */ new Map();
	for (const term of terms) {
		signal.throwIfAborted();
		const page = await search({
			query: term,
			sessionFilters: [{
				kind: "cwd",
				values: [cwd]
			}],
			eventFilters: [{
				kind: "type",
				values: ["assistant/message", "tool/result"]
			}],
			limit
		}, { signal });
		for (const hit of page.items) if (hit.header.id !== exclude && !history.has(hit.header.id) && history.size < limit) history.set(hit.header.id, {
			sessionId: hit.header.id,
			seq: hit.bestMatch.seq,
			snippet: redactOutput(hit.bestMatch.snippet)
		});
	}
	return [...history.values()];
}
function completeSource(value) {
	return value !== null && value.complete && value.reason === null && /^[a-f0-9]{64}$/u.test(value.digest);
}
function comparableCommand(initial, current) {
	return initial.workspaceId === current.workspaceId && initial.name === current.name && initial.cwd === current.cwd && initial.specRevision === current.specRevision && JSON.stringify(initial.argv) === JSON.stringify(current.argv);
}
/**
* Derive historical check-transition facts from existing durable repair and execution receipts.
* Root causes and fixes are deliberately unknown; a passing check does not certify a semantic lesson
* or current source. No project file or new persistent schema is written by this view.
* @param overview - records already scoped to one imported workspace.
* @param terms - bounded task/error/path terms used only for relevance ranking.
* @param limit - maximum matches returned after duplicate observations are collapsed.
* @param options - include unranked transitions for automatic candidate capture; off for task search.
* @returns cited historical transitions that must be checked again before reuse.
*/
function repairExperienceMatches(overview, terms, limit, options = {}) {
	const normalized = queryTerms(terms);
	if (normalized.length === 0 && !options.includeUnmatched || limit <= 0) return [];
	const runs = new Map(overview.runs.filter((run) => run.workspaceId === overview.workspaceId).map((run) => [run.id, run]));
	const matches = /* @__PURE__ */ new Map();
	for (const repair of overview.repairs) {
		if (repair.workspaceId !== overview.workspaceId || repair.status !== "passed" || repair.finishedAt === null || repair.attempts < 1 || repair.attempts !== repair.runIds.length || repair.attempts > repair.maxAttempts || new Set(repair.runIds).size !== repair.runIds.length || repair.runIds.includes(repair.initialRunId)) continue;
		const initial = runs.get(repair.initialRunId);
		const finalId = repair.runIds.at(-1);
		const final = finalId === void 0 ? void 0 : runs.get(finalId);
		if (initial === void 0 || final === void 0 || initial.finishedAt === null || final.finishedAt === null || initial.sequence === void 0 || final.sequence === void 0 || initial.sequence < 1 || final.sequence <= initial.sequence || ![
			"failed",
			"error",
			"timed-out"
		].includes(initial.status) || final.status !== "passed" || final.exitCode !== 0 || !completeSource(initial.before) || !completeSource(final.before) || !completeSource(final.after) || final.before.digest !== final.after.digest || repair.childSessionId !== final.sessionId) continue;
		if (initial.argv.some((argument) => argument.includes("[redacted]"))) continue;
		if (initial.status === "failed" && (initial.exitCode === null || initial.exitCode === 0)) continue;
		if (initial.after !== null && (!completeSource(initial.after) || initial.before.digest !== initial.after.digest)) continue;
		if (initial.after === null && initial.status !== "error") continue;
		if (repair.runIds.map((id) => runs.get(id)).some((run) => run === void 0 || !comparableCommand(initial, run))) continue;
		const symptom = redactOutput(initial.diagnostics.map((item) => `${item.path}:${item.line} ${item.message}`).join("\n") || initial.stderr || initial.stdout || `The check reported ${initial.status}.`).slice(0, SYMPTOM_LIMIT);
		const argv = redactArgv(final.argv);
		const { score, matchedTerms } = matchTerms(`${final.name}\n${argv.join(" ")}\n${symptom}`.toLowerCase(), normalized);
		if (score === 0 && !options.includeUnmatched) continue;
		const initialStatus = initial.status;
		if (initialStatus !== "failed" && initialStatus !== "error" && initialStatus !== "timed-out") continue;
		const match = {
			score,
			matchedTerms,
			experience: {
				repairId: repair.id,
				workspaceId: overview.workspaceId,
				initialRunId: initial.id,
				finalRunId: final.id,
				parentSessionId: repair.parentSessionId,
				initialSessionId: initial.sessionId,
				verificationSessionId: final.sessionId,
				check: redactOutput(final.name),
				argv,
				cwd: redactOutput(final.cwd),
				initialStatus,
				symptom,
				observedAt: repair.finishedAt,
				verificationSequence: final.sequence,
				sourceTransition: {
					before: { ...initial.before },
					verified: { ...final.after }
				},
				outcome: "verified-check-transition",
				freshness: "historical-recheck-required",
				rootCause: null,
				fix: null
			}
		};
		const key = createHash("sha256").update(JSON.stringify([
			final.name,
			argv,
			symptom.toLowerCase().replace(/\s+/gu, " "),
			initial.before.digest,
			final.after.digest
		])).digest("hex");
		const previous = matches.get(key);
		if (previous === void 0 || previous.experience.verificationSequence < final.sequence) matches.set(key, match);
	}
	return [...matches.values()].sort((a, b) => b.score - a.score || b.experience.verificationSequence - a.experience.verificationSequence).slice(0, limit);
}
/**
* Redact model-visible authored/history fields even when an older provider omitted new metadata.
* @param value Experience retrieval result from the current or an older provider.
* @returns A copy with common credential patterns redacted from all model-visible fields.
*/
function redactExperienceResult(value) {
	return {
		...value,
		terms: value.terms.map(redactOutput),
		...value.notices === void 0 ? {} : { notices: value.notices.map(redactOutput) },
		matches: value.matches.map((match) => ({
			...match,
			entry: safeEntry(match.entry),
			matchedTerms: match.matchedTerms.map(redactOutput)
		})),
		history: value.history.map((hit) => ({
			...hit,
			snippet: redactOutput(hit.snippet)
		})),
		...value.repairMatches === void 0 ? {} : { repairMatches: value.repairMatches.map((match) => ({
			...match,
			matchedTerms: match.matchedTerms.map(redactOutput),
			experience: {
				...match.experience,
				check: redactOutput(match.experience.check),
				argv: redactArgv(match.experience.argv),
				cwd: redactOutput(match.experience.cwd),
				symptom: redactOutput(match.experience.symptom)
			}
		})) }
	};
}
/**
* Pair failed and subsequently passing executions of the same project command.
* These are historical observations, not a claim about root cause or semantic repair.
* @param overview - records already scoped to an imported workspace.
* @returns distinct source-backed transitions in execution order, including ordinary development checks.
*/
function checkExperienceTransitions(overview) {
	const failures = /* @__PURE__ */ new Map();
	const transitions = [];
	const runs = overview.runs.filter((run) => run.workspaceId === overview.workspaceId && run.sequence !== void 0).sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
	for (const run of runs) {
		const key = JSON.stringify([
			run.name,
			run.argv,
			run.cwd
		]);
		if (run.finishedAt === null || !completeSource(run.before) || !completeSource(run.after) || run.before.digest !== run.after.digest || run.argv.some((value) => value.includes("[redacted]"))) {
			failures.delete(key);
			continue;
		}
		if (run.status === "failed" && run.exitCode !== null && run.exitCode !== 0) {
			failures.set(key, run);
			continue;
		}
		const initial = failures.get(key);
		if (initial === void 0 || run.status !== "passed" || run.exitCode !== 0) continue;
		failures.delete(key);
		if (run.sequence === void 0 || initial.sequence === void 0 || run.sequence <= initial.sequence) continue;
		transitions.push({
			workspaceId: overview.workspaceId,
			initialRunId: initial.id,
			finalRunId: run.id,
			initialSessionId: initial.sessionId,
			verificationSessionId: run.sessionId,
			check: redactOutput(run.name),
			symptom: redactOutput(initial.diagnostics.map((item) => `${item.path}:${item.line} ${item.message}`).join("\n") || initial.stderr || initial.stdout || `The check reported ${initial.status}.`).slice(0, SYMPTOM_LIMIT),
			observedAt: run.finishedAt,
			before: initial.before.digest,
			after: run.after.digest
		});
	}
	return transitions;
}
//#endregion
export { redactExperienceResult as a, termsFromChangedFiles as c, readExperienceLedger as i, experienceQueryTerms as n, repairExperienceMatches as o, lookupWorkspaceHistory as r, searchLedger as s, checkExperienceTransitions as t };
