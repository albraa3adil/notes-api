import { CorsOptions } from "cors";
import { env } from "./env";

export const corsOptions: CorsOptions = {
    // Only these origins receive CORS headers. Requests without an Origin
    // header (curl, Postman, server-to-server) are not affected by CORS.
    origin: env.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    // Cookies / auth headers are not used yet; enable together with auth.
    credentials: false,
    // Let browsers cache preflight responses for 10 minutes.
    maxAge: 600,
    optionsSuccessStatus: 200
};