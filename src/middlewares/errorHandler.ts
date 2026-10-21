import { NextFunction, Request, Response } from "express";
import { logger } from "../lib/logger";
import { AppError } from "../errors/appError";
import { ZodError } from "zod";

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
    }
    
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
        return;
    }
    
    logger.error({err}, "Unhandled error");

    res.status(500).json({
        success: false,
        message: "Internal Server Error."
    });
}