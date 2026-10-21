import { pool } from "../lib/db";
import { Note, NoteRow } from "../types/note";

export async function createNoteDb(title: string, content: string, tags: string[]): Promise<Note> {
    const result = await pool.query<NoteRow>(`
    INSERT INTO notes(title, content, tags)
    VALUES ($1, $2, $3)
    RETURNING id, title, content, tags, created_at, updated_at;
    `, [title, content, tags]);

    return result.rows[0];
};

export async function getNotesDb(): Promise<Note[]> {
    const result = await pool.query<NoteRow>(`
    SELECT id, title, content, tags, created_at, updated_at 
    FROM notes
    ORDER BY created_at DESC;
    `);

    return result.rows;
};

export async function updateNoteDB(id: string, title: string, content: string, tags: string[]): Promise<Note | null> {
    const result = await pool.query<NoteRow>(`
    UPDATE notes
    SET title = $1, content = $2, tags = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING id, title, content, tags, created_at, updated_at;
    `, [title, content, tags, id]);

    return result.rows[0] ?? null;
};

export async function getNoteByIdDb(id: string): Promise<Note | null> {
    const result = await pool.query<NoteRow>(`
    SELECT id, title, content, tags, created_at, updated_at 
    FROM notes
    WHERE id = $1;
    `, [id]);

    return result.rows[0] ?? null;
};

export async function deleteNoteDb(id: string): Promise<boolean> {
    const result = await pool.query<NoteRow>(`
    DELETE FROM notes 
    WHERE id = $1
    RETURNING id, title, content, tags, created_at, updated_at;
    `, [id]);

    return (result.rowCount ?? 0) > 0;
};