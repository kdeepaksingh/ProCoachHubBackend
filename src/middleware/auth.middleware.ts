import { type NextFunction, type Request, type Response } from "express";
import { ApiError } from "../utils/apiError";
import { verifyAccessToken } from "../utils/jwt";

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) return next(new ApiError(401, "Unauthorized"));

  try {
    (req as any).user = verifyAccessToken(token);
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import { JwtPayload } from "../types/auth.types";

// export interface AuthRequest extends Request {
//   user: JwtPayload;
// }

// export const authMiddleware = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
