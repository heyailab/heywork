/** Project-authored Wiki plans, parsed as data without executable YAML tags. @module */
import { JSON_SCHEMA, load } from 'js-yaml';
import { z } from 'zod';
import { WikiError } from "./errors.js";
const notes = z.array(z.object({ text: z.string().min(1).max(8000) }).strict()).max(50);
/** A user-owned reader-oriented plan compatible with the documented Repo Wiki planning fields. */
export const wikiUserPlanSchema = z
    .object({
    version: z.literal(1),
    repowiki: z
        .object({
        template: z.enum(['architecture', 'product_requirement']).optional(),
        notes: notes.optional(),
        documents: z
            .array(z
            .object({
            title: z.string().min(1).max(180),
            goal: z.string().min(1).max(1200),
            parent: z.string().max(180).optional(),
            hints: z.array(z.string().max(2000)).max(30).optional(),
            template: z.string().max(8000).optional(),
        })
            .strict())
            .min(1)
            .max(100)
            .optional(),
    })
        .strict(),
    knowledgecard: z.object({ notes: notes.optional() }).strict().optional(),
})
    .strict();
/**
 * Parse a bounded project plan without JavaScript or custom YAML constructors.
 * @param text - UTF-8 YAML already bounded by the filesystem reader.
 * @returns validated audience notes, page goals, and card guidance.
 * @throws an actionable invalid-data failure on syntax, tags, or unsupported fields.
 */
export function parseWikiUserPlan(text) {
    try {
        return wikiUserPlanSchema.parse(load(text, { schema: JSON_SCHEMA }));
    }
    catch (error) {
        throw new WikiError('wiki/invalid-data', 'Invalid .hey/wiki/wiki_plan.yaml; correct its fields or YAML before generation', { cause: error });
    }
}
//# sourceMappingURL=plan.js.map