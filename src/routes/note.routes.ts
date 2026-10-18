import { Router } from "express";
import { createNote } from "../services/note.service";

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
})