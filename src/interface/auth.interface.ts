import { Request } from "express";
import { JwtPayload } from "../types/auth.types";

export interface AuthRequest extends Request {
  user: JwtPayload;
}
