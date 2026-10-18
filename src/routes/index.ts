import { Router } from "express";
import { healthRouter } from "./health.routes";
import { noteRouter } from "./note.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/notes", noteRouter);
