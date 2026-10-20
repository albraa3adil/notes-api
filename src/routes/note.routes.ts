import { Router } from "express";
import { createNote, getNoteById, getNotes, updateNote } from "../services/note.service";

export const noteRouter = Router();

noteRouter.post("/", async (req, res, next) => {
    try {
        const { title, content, tags } = req.body;
        const note = await createNote(title, content, tags);
        res.status(201).json({
            success: true,
            data: { note }
        })
    } catch (error) {
        next(error);
    }
});

noteRouter.get("/", async (_req, res, next) => {
    try {
        const notes = await getNotes();
        res.status(200).json({
            success: true,
            data: { notes }
        })
    } catch (error) {
        next(error);
    }
});

noteRouter.put("/:id", async (req, res, next) => {
    try {
        const { title, content, tags} = req.body;
    
        const note = await updateNote(req.params.id, title, content, tags);
        
        res.status(200).json({
            success: true,
            data: { note }
        });  
    } catch (error) {
        next(error);
    }
});

noteRouter.get("/:id", async (req, res, next) => {
    try {
        const note = await getNoteById(req.params.id);
        res.status(200).json({
            success: true,
            data: { note }
        })
    } catch (error) {
        next(error);
    }
});