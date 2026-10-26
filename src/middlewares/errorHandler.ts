import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { AppError } from "../errors/appError";
import { ZodError } from "zod";

// Errors raised by Express's body parser carry a `type` identifying the problem.
const BODY_PARSER_ERRORS: Record<string, { statusCode: number; message: string }> = {
    "entity.too.large": { statusCode: 413, message: "Request body is too large." },
    "entity.parse.failed": { statusCode: 400, message: "Malformed request body." },
    "encoding.unsupported": { statusCode: 415, message: "Unsupported request encoding." },
    "charset.unsupported": { statusCode: 415, message: "Unsupported request charset." }
};

function getBodyParserError(err: Error): { statusCode: number; message: string } | undefined {
    const type = (err as { type?: unknown }).type;

    return typeof type === "string" ? BODY_PARSER_ERRORS[type] : undefined;
};

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: err?.issues.map(issue => ({
                field: issue.path.slice(1).join(".") || issue.path.join("."),
                message: issue.message
            }))
        });
        return;
    }
    
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    };
    
    const bodyParserError = getBodyParserError(err);

    if (bodyParserError) {
        res.status(bodyParserError.statusCode).json({
            success: false,
            message: bodyParserError.message
        });
        return;
    }
    
    logger.error({err}, "Unhandled error");

    res.status(500).json({
        success: false,
        message: "Internal Server Error."
    });
}