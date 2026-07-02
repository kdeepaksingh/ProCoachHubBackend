import { type NextFunction, type Request, type Response } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/apiError";

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(
        new ApiError(400, result.error.issues[0]?.message || "Invalid request"),
      );
    }
    req.body = result.data;
    next();
  };
