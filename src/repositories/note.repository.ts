import { pool } from "../lib/db";
import { Note } from "../types/note";

type NoteRow = Note;

export async function createNoteDb(title: string, content: string, tags: string[]): Promise<Note> {
    const result = await pool.query<NoteRow>(`
    INSERT INTO notes(title, content, tags)
    VALUES ($1, $2, $3)
    RETURNING id, title, content, tags, created_at, updated_at;
    `, [title, content, tags]);

    return result.rows[0];
};