import { type Request, type Response, type NextFunction } from "express";
import { env } from "../config/env";
import {
  changePassword,
  forgotPassword,
  getProfile,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  resendUserOtp,
  resetPassword,
  updateProfile,
  verifyUserOtp,
} from "../services/auth.service";
import { apiResponse } from "../utils/apiResponse";
import { COOKIE_NAMES } from "../constants/cookies";

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "strict" as const,
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const profileImagePath = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : "";
    const user = await registerUser(req.body, profileImagePath);
    res.status(201).json(
      apiResponse(true, "Registered successfully. OTP sent by email or SMS.", {
        userId: user._id,
        email: user.email,
        phone: user.phone,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await verifyUserOtp(req.body.emailOrPhone, req.body.otp);
    res.json(apiResponse(true, "OTP verified successfully"));
  } catch (error) {
    next(error);
  }
};

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await resendUserOtp(req.body.emailOrPhone);
    res.json(apiResponse(true, "OTP resent successfully"));
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loginMetadata: { ip?: string; userAgent?: string } = {
      ...(req.ip ? { ip: req.ip } : {}),
      userAgent: req.headers["user-agent"] || "",
    };

    const result = await loginUser(req.body, loginMetadata);

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, cookieOptions);

    res.json(
      apiResponse(true, "Login successful", {
        user: result.user,
        accessToken: result.accessToken,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] || req.body.refreshToken;
    const result = await refreshSession(token);

    res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, cookieOptions);

    res.json(
      apiResponse(true, "Token refreshed successfully", {
        user: result.user,
        accessToken: result.accessToken,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] || req.body.refreshToken;
    if (token) await logoutUser(token);
    res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, cookieOptions);
    res.json(apiResponse(true, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await forgotPassword(req.body.emailOrPhone);
    res.json(
      apiResponse(true, "If the account exists, reset instructions were sent"),
    );
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await resetPassword(req.body);
    res.json(apiResponse(true, "Password reset successfully"));
  } catch (error) {
    next(error);
  }
};

export const profile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const user = await getProfile(userId);
    res.json(apiResponse(true, "Profile fetched successfully", user));
  } catch (error) {
    next(error);
  }
};

export const updateProfileHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    const profileImagePath = req.file
      ? `/uploads/profiles/${req.file.filename}`
      : undefined;
    const user = await updateProfile(userId, req.body, profileImagePath);
    res.json(apiResponse(true, "Profile updated successfully", user));
  } catch (error) {
    next(error);
  }
};

export const changePasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = (req as any).user.userId;
    await changePassword(userId, req.body);
    res.json(apiResponse(true, "Password changed successfully"));
  } catch (error) {
    next(error);
  }
};
