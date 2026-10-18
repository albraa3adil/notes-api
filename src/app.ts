import cors from "cors";
import express from "express";
import { apiRouter } from "./routes";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api", apiRouter)

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

