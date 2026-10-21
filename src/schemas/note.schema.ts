import { z } from "zod";

const titleSchema = z
    .string({ error: "Title must be a string." })
    .trim()
    .min(1, "Title must not be empty.")
    .max(200, "Title must be 200 or less.")

const contentSchema = z
    .string("Content must be a string.")
    .trim()
    .nullish()
    .transform((content) => content ?? "");

const tagsSchema = z
    .array(
        z.string({ error: "Each tag must be a string." }).trim(),
        { error: "Tags must be an array of strings." }
    )
    .nullish()
    .transform((tags) => (tags ?? []).filter(tag => tag.length > 0));

const noteIdSchema = z.uuid({ error: "Invalid id." });

export const createNoteSchema = z.object({
    title: titleSchema,
    content: contentSchema,
    tags: tagsSchema
});

export const updateNoteSchema = createNoteSchema;

export const noteIdParamSchema = z.object({ id: noteIdSchema });


export const createNoteRequestSchema = z.object({ body: createNoteSchema });

export const updateNoteRequestSchema = z.object({ 
    params: noteIdParamSchema,
    body: createNoteSchema 
});

export const noteIdRequestSchema = z.object({ params: noteIdParamSchema });


export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdParams = z.infer<typeof noteIdParamSchema>;