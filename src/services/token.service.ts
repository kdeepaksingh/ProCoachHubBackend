import RefreshToken from "../models/RefreshToken";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { sha256 } from "../utils/token";

export const createTokenPair = (payload: {
  userId: string;
  role: string;
  tokenVersion?: number;
}) => {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return { accessToken, refreshToken };
};

export const persistRefreshToken = async (params: {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
  userAgent?: string;
  ip?: string;
}) => {
  await RefreshToken.create({
    userId: params.userId,
    tokenHash: sha256(params.refreshToken),
    expiresAt: params.expiresAt,
    userAgent: params.userAgent || "",
    ip: params.ip || "",
  });
};

export const findRefreshToken = async (refreshToken: string) => {
  return RefreshToken.findOne({
    tokenHash: sha256(refreshToken),
    revokedAt: null,
  }).select("+tokenHash");
};

export const revokeRefreshToken = async (refreshToken: string) => {
  await RefreshToken.updateOne(
    { tokenHash: sha256(refreshToken), revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
};
