import { z } from "zod";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;


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

const limitSchema = z
    .coerce.number({ error: "Limit must be a number." })
    .int("Limit must be an integer.")
    .min(1, "Limit must be 1 or greater.")
    .max(MAX_LIMIT, `Limit must be ${MAX_LIMIT} or less.`)
    .default(DEFAULT_LIMIT);

const pageSchema = z
    .coerce.number({ error: "Page must be a number." })
    .int("Page must be an integer.")
    .min(1, "Page must me 1 or greater.")
    .default(DEFAULT_PAGE)

export const createNoteSchema = z.object({
    title: titleSchema,
    content: contentSchema,
    tags: tagsSchema
});

export const updateNoteSchema = createNoteSchema;

export const noteIdParamSchema = z.object({ id: noteIdSchema });

export const listNotesQuerySchema = z.object({ 
    page: pageSchema,
    limit: limitSchema
});


export const createNoteRequestSchema = z.object({ body: createNoteSchema });

export const updateNoteRequestSchema = z.object({ 
    params: noteIdParamSchema,
    body: createNoteSchema 
});

export const noteIdRequestSchema = z.object({ params: noteIdParamSchema });

export const listNotesRequestSchema = z.object({ query: listNotesQuerySchema });


export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdParams = z.infer<typeof noteIdParamSchema>;
export type ListNotesQuery = z.infer<typeof listNotesQuerySchema>;
export type ListNotesRequest = z.infer<typeof listNotesRequestSchema>;