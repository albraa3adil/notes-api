import { Note } from "../types/note";
import { AppError } from "../errors/appError.ts"
import { createNoteDb, getNotesDb, updateNoteDB } from "../repositories/note.repository.ts";
import { validate as isValidUUID } from 'uuid';

function validateId(id: unknown): string {
    if (!isValidUUID(id)) {
        throw new AppError(400, "Invalid id.");
    }

    return id as string;
};

function validateTitle(title: unknown): string {
    if (typeof title !== 'string' || !title.trim()) {
        throw new AppError(400, "Title is required.");
    }

    const trimmedTitle = title.trim();

    if (trimmedTitle.length > 200) {
        throw new AppError(400, "Title must be 200 or less.");
    }

    return trimmedTitle;
};

function validateContent(content: unknown): string {
    if (typeof content !== 'undefined' 
    && typeof content !== 'string'
    && content !== null
    ) {
        throw new AppError(400, "Content must be a string.");
    } 

    const validContent = content?.trim();

    return validContent ?? '';
};

function validateTags(tags: unknown): string[] {
  if (tags === undefined || tags === null) {
    return [];
  }

  if (!Array.isArray(tags)) {
    throw new AppError(400, 'Tags must be an array of strings.');
  }

  const validTags = tags.map((tag) => {
    if (typeof tag !== 'string') {
      throw new AppError(400, 'Each tag must be a string.');
    }
    return tag.trim();
  }).filter((tag) => tag.length > 0);

  return validTags;
};

export async function createNote(title: unknown, content: unknown, tags: unknown): Promise<Note> {
    const validTitle = validateTitle(title);
    const validContent = validateContent(content);
    const validTags = validateTags(tags);

    return createNoteDb(validTitle, validContent, validTags);
};

export async function getNotes(): Promise<Note[]> {
    return await getNotesDb(); 
};

export async function updateNote(id: unknown, title: unknown, content: unknown, tags: unknown): Promise<Note> {
    const validId = validateId(id);
    const validTitle = validateTitle(title);
    const validContent = validateContent(content);
    const validTags = validateTags(tags);

    const note = await updateNoteDB(validId, validTitle, validContent, validTags);

    if (!note) {
      throw new AppError(404, "Note not found.");
    }

    return note;
}