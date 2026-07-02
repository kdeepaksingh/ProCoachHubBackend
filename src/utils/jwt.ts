import jwt from "jsonwebtoken";
import { env } from "../config/env";

type Payload = {
  userId: string;
  role: string;
  tokenVersion?: number;
};

export const signAccessToken = (payload: Payload) =>
  jwt.sign(payload as object, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpiresIn as any,
  });

export const signRefreshToken = (payload: Payload) =>
  jwt.sign(payload as object, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn as any,
  });

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.jwtAccessSecret) as Payload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.jwtRefreshSecret) as Payload;
};
