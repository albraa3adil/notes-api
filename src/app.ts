import cors from "cors";
import express from "express";
import { apiRouter } from "./routes";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import { errorHandler } from "./middlewares/errorHandler";
import helmet from "helmet";
import { corsOptions } from "./config/cors";

export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json({ limit: "100kb" }));
    app.use(express.urlencoded({ extended: true, limit: "100kb" }));

    app.use("/api", apiRouter)

    app.use(notFoundHandler);
    app.use(errorHandler);

    return app;
};

