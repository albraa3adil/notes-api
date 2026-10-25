export type Note = {
    id: string;
    title: string;
    content: string;
    tags: string[];
    created_at: Date;
    updated_at: Date;
}

export type NoteRow = Note;

export type Paginated<T> = {
    items: T[];
    total: number;
    page: number;
    limit: number;
}