import { Note } from "../types/note";
import { AppError } from "../errors/appError.ts"
import { createNoteDb, deleteNoteDb, getNoteByIdDb, getNotesDb, updateNoteDB } from "../repositories/note.repository.ts";
import { CreateNoteInput, UpdateNoteInput } from "../schemas/note.schema.ts";

export async function createNote(input: CreateNoteInput): Promise<Note> {
    return createNoteDb(input.title, input.content, input.tags);
};

export async function getNotes(): Promise<Note[]> {
    return await getNotesDb(); 
};

export async function getNoteById(id: string): Promise<Note | null> {
    const note = await getNoteByIdDb(id); 

    if (!note) {
      throw new AppError(404, "Note not found.");
    }

    return note;
};

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    const note = await updateNoteDB(id, input.title, input.content, input.tags);

    if (!note) {
      throw new AppError(404, "Note not found.");
    }

    return note;
};

export async function deleteNote(id: string): Promise<void> {
    const note = await deleteNoteDb(id); 

    if (!note) {
      throw new AppError(404, "Note not found.");
    }
};