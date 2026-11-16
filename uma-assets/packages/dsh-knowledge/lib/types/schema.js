/** Validation for operator requests and durable SQLite JSON records. @module */
import { z } from 'zod';
import { brandString } from '@deepseek-ai/dsh-brand';
/** Validated collection identity. */
export const baseIdSchema = z.uuid().transform(value => brandString(value));
/** Validated document identity. */
export const documentIdSchema = z.uuid().transform(value => brandString(value));
/** Validated source identity. */
export const sourceIdSchema = z.uuid().transform(value => brandString(value));
/** Validated team grouping identity. */
export const teamIdSchema = z.uuid().transform(value => brandString(value));
/** Workspace identities come from the registry, never from a filesystem slug. */
export const workspaceIdSchema = z
    .string()
    .min(1)
    .max(256)
    .transform(value => brandString(value));
/** Names are display data; no name is interpolated into an object path or SQL. */
export const nameSchema = z.string().trim().min(1).max(160);
/** Complete mutable collection fields. */
export const baseInputSchema = z
    .object({
    name: nameSchema,
    description: z.string().max(4000),
    kind: z.enum(['team', 'project']),
    teamId: teamIdSchema.nullable(),
    workspaceIds: z.array(workspaceIdSchema).max(100),
    mode: z.enum(['fulltext', 'hybrid']),
    enabled: z.boolean(),
})
    .strict()
    .superRefine((value, ctx) => {
    if (value.kind === 'project' && value.workspaceIds.length !== 1)
        ctx.addIssue({ code: 'custom', message: 'A project collection requires exactly one imported workspace' });
    if (value.kind === 'team' && value.teamId === null)
        ctx.addIssue({ code: 'custom', message: 'A team collection requires a team grouping' });
    if (new Set(value.workspaceIds).size !== value.workspaceIds.length)
        ctx.addIssue({ code: 'custom', message: 'Workspace bindings must be unique' });
});
/** Stored collection fields; counts are computed from current documents. */
export const storedBaseSchema = baseInputSchema.safeExtend({
    id: baseIdSchema,
    archived: z.boolean(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
/** Accepted filename, independent of its native source path. */
export const documentNameSchema = z
    .string()
    .trim()
    .min(1)
    .max(512)
    .refine(value => !/[\x00-\x1f]/u.test(value));
/** Embedding responses are checked before indexing or comparison. */
export const vectorSchema = z.array(z.number()).min(1);
//# sourceMappingURL=schema.js.map