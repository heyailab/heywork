import { z } from "zod";
import { brandString } from "@deepseek-ai/dsh-brand";
//#region lib/types/schema.js
/** Validation of durable coding evidence and operator-authored workspace command configuration. */
/** Registered workspace identity, validated at wire and durable inputs. */
const workspaceIdSchema = z.string().min(1).transform(brandString);
/** Session identity supplied to a coding operation. */
const sessionIdSchema = z.string().min(1).transform(brandString);
/** Durable run identity. */
const runIdSchema = z.uuid().transform(brandString);
/** Durable finding identity. */
const findingIdSchema = z.uuid().transform(brandString);
/** Durable isolated task identity. */
const taskIdSchema = z.uuid().transform(brandString);
/** Complete observation metadata; incomplete scans cannot establish fresh acceptance. */
const fingerprintSchema = z.object({
	digest: z.string(),
	files: z.number().int().nonnegative(),
	bytes: z.number().int().nonnegative(),
	complete: z.boolean(),
	reason: z.string().nullable()
});
/** Compiler or language-server diagnostic. */
const diagnosticSchema = z.object({
	path: z.string(),
	line: z.number().int().positive(),
	column: z.number().int().positive(),
	severity: z.enum([
		"error",
		"warning",
		"info"
	]),
	message: z.string().max(8e3),
	code: z.string().nullable()
});
/** A literal argv selected explicitly by the operator or calling development task. */
const checkSchema = z.object({
	name: z.string().min(1).max(120),
	argv: z.array(z.string().max(8e3)).min(1).max(64),
	kind: z.enum([
		"test",
		"build",
		"lint",
		"typecheck",
		"custom"
	]),
	origin: z.string(),
	coverage: z.array(z.string().min(1).max(400)).max(64).optional()
});
/** Retained verification facts. */
const runSchema = z.object({
	sequence: z.number().int().positive().max(Number.MAX_SAFE_INTEGER).optional(),
	id: runIdSchema,
	workspaceId: workspaceIdSchema,
	sessionId: sessionIdSchema,
	name: z.string(),
	specRevision: z.number().int().positive().nullable(),
	argv: z.array(z.string()),
	cwd: z.string(),
	status: z.enum([
		"running",
		"passed",
		"failed",
		"cancelled",
		"timed-out",
		"interrupted",
		"error"
	]),
	startedAt: z.string(),
	finishedAt: z.string().nullable(),
	before: fingerprintSchema,
	after: fingerprintSchema.nullable(),
	exitCode: z.number().int().nullable(),
	stdout: z.string(),
	stderr: z.string(),
	truncated: z.boolean(),
	diagnostics: z.array(diagnosticSchema)
});
/** Revision-bound code-review finding. */
const findingSchema = z.object({
	id: findingIdSchema,
	workspaceId: workspaceIdSchema,
	sessionId: sessionIdSchema,
	path: z.string(),
	line: z.number().int().positive(),
	severity: z.enum([
		"critical",
		"high",
		"medium",
		"low"
	]),
	title: z.string().min(1).max(240),
	evidence: z.string().min(1).max(16e3),
	sourceHash: z.string(),
	state: z.enum([
		"open",
		"resolved",
		"dismissed"
	]),
	createdAt: z.string(),
	updatedAt: z.string()
});
/** Versioned acceptance criteria. */
const specSchema = z.object({
	workspaceId: workspaceIdSchema,
	revision: z.number().int().positive(),
	goal: z.string().min(1).max(8e3),
	independentVerificationOf: z.array(sessionIdSchema).min(1).max(100).optional(),
	criteria: z.array(z.object({
		id: z.string().min(1).max(80),
		text: z.string().min(1).max(4e3),
		checks: z.array(z.string().min(1).max(120)).min(1).max(32)
	})).min(1).max(100),
	updatedAt: z.string()
});
/** Retained checkout facts; removing the source folder never silently changes this record. */
const taskSchema = z.object({
	id: taskIdSchema,
	workspaceId: workspaceIdSchema,
	sessionId: sessionIdSchema,
	path: z.string(),
	branch: z.string(),
	baseCommit: z.string(),
	repositoryRoot: z.string(),
	createdAt: z.string(),
	state: z.enum([
		"active",
		"merged",
		"removed"
	])
});
/** Optional project-local checks; these are discovered but never automatically executed. */
const manifestSchema = z.object({
	version: z.literal(1),
	checks: z.array(checkSchema).max(100)
}).strict();
/** Durable repair identity. */
const repairIdSchema = z.uuid().transform(brandString);
/** Bounded repair progress and independent check receipts. */
const repairSchema = z.object({
	id: repairIdSchema,
	workspaceId: workspaceIdSchema,
	parentSessionId: sessionIdSchema,
	childSessionId: sessionIdSchema.nullable(),
	initialRunId: runIdSchema,
	maxAttempts: z.number().int().positive(),
	attempts: z.number().int().nonnegative(),
	runIds: z.array(runIdSchema),
	status: z.enum([
		"running",
		"passed",
		"failed",
		"cancelled",
		"interrupted"
	]),
	startedAt: z.string(),
	finishedAt: z.string().nullable(),
	error: z.string().nullable()
});
//#endregion
export { repairIdSchema as a, runSchema as c, taskIdSchema as d, taskSchema as f, manifestSchema as i, sessionIdSchema as l, findingSchema as n, repairSchema as o, workspaceIdSchema as p, fingerprintSchema as r, runIdSchema as s, findingIdSchema as t, specSchema as u };
