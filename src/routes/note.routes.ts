import { Request, Router } from "express";
import { createNote, deleteNote, getNoteById, getNotes, updateNote } from "../services/note.service";
import { validate } from "../middlewares/validate";
import { CreateNoteInput, ListNotesRequest, NoteIdParams, UpdateNoteInput, createNoteRequestSchema, listNotesRequestSchema, noteIdRequestSchema, updateNoteRequestSchema } from "../schemas/note.schema";

export const noteRouter = Router();

noteRouter.post("/", validate(createNoteRequestSchema), async (req, res, next) => {
    try {
        const input: CreateNoteInput = req.body;
        const note = await createNote(input);
        res.status(201).json({
            success: true,
            data: note
        })
    } catch (error) {
        next(error);
    }
});

noteRouter.get("/", validate(listNotesRequestSchema), async (_req, res, next) => {
    try {
        const { query } = res.locals.validated as ListNotesRequest;
        const { items, total, page, limit } = await getNotes(query);
        res.status(200).json({
            success: true,
            data: items,
            total, 
            page, 
            limit,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        next(error);
    }
});

noteRouter.get("/:id", validate(noteIdRequestSchema), async (req: Request<NoteIdParams>, res, next) => {
    try {
        const note = await getNoteById(req.params.id);
        res.status(200).json({
            success: true,
            data: note
        })
    } catch (error) {
        next(error);
    }
});

noteRouter.put("/:id", validate(updateNoteRequestSchema), async (req: Request<NoteIdParams>, res, next) => {
    try {
        const input: UpdateNoteInput = req.body;
        const note = await updateNote(req.params.id, input);
        
        res.status(200).json({
            success: true,
            data: note
        });  
    } catch (error) {
        next(error);
    }
});

noteRouter.delete("/:id", validate(noteIdRequestSchema), async (req: Request<NoteIdParams>, res, next) => {
    try {
        await deleteNote(req.params.id);
        res.status(200).json({
            success: true,
            message: "Note deleted successfully."
        })
    } catch (error) {
        next(error);
    }
});