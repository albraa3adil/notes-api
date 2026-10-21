import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

export function validate(schema: ZodType) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
        });

        if (!result.success) {
            next(result.error);
            return;
        }

        const data = result.data as { body?: unknown };

        if (data.body !== undefined) {
            req.body = data.body;
        }

        next();
    }
}