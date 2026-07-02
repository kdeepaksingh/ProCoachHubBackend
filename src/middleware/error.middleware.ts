import { type NextFunction, type Request, type Response } from "express";
import { ApiError } from "../utils/apiError";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  const message = err instanceof Error ? err.message : "Internal Server Error";
  return res.status(500).json({
    success: false,
    message,
  });
};
