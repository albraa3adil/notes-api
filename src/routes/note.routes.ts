import { Router } from "express";
import { createNote, getNotes } from "../services/note.service";

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
})