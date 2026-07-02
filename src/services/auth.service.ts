import { OTP_PURPOSE } from "../constants/otp";
import Otp from "../models/Otp";
import PasswordReset from "../models/PasswordReset";
import User from "../models/User";
import { ApiError } from "../utils/apiError";
import { verifyRefreshToken } from "../utils/jwt";
import { comparePassword, hashPassword } from "../utils/password";
import { sha256 } from "../utils/token";
import { sendEmail } from "./email.service";
import { createOtp } from "./otp.service";
import { sendSms } from "./sms.service";
import {
  createTokenPair,
  findRefreshToken,
  persistRefreshToken,
  revokeRefreshToken,
} from "./token.service";

const getUserByEmailOrPhone = async (emailOrPhone: string) => {
  return User.findOne({
    $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
  }).select("+passwordHash");
};

export const registerUser = async (input: any, profileImagePath?: string) => {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) throw new ApiError(409, "Email already registered");

  const passwordHash = await hashPassword(input.password);

  const user = await User.create({
    fullName: input.fullName,
    email: input.email.toLowerCase(),
    phone: input.phone || "",
    passwordHash,
    gender: input.gender,
    dateOfBirth: input.dateOfBirth || undefined,
    address: input.address || "",
    city: input.city || "",
    state: input.state || "",
    country: input.country || "",
    profileImage: profileImagePath || "",
    coachingInterest: input.coachingInterest || "",
    experienceLevel: input.experienceLevel || "beginner",
    bio: input.bio || "",
    qualification: input.qualification || "",
    organizationName: input.organizationName || "",
    emergencyContact: input.emergencyContact || "",
    role: input.role || "student",
    isVerified: false,
  });

  const otp = await createOtp(user._id.toString(), OTP_PURPOSE.VERIFY_EMAIL);
  const message = `You registered successfully on ProCoachHub. Please verify your account using OTP: ${otp}`;

  if (user.email)
    await sendEmail(user.email, "ProCoachHub Registration OTP", message);
  if (user.phone) await sendSms(user.phone, message);

  return user;
};

export const verifyUserOtp = async (emailOrPhone: string, otp: string) => {
  const user = await User.findOne({
    $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
  });

  if (!user) throw new ApiError(404, "User not found");

  const record = await Otp.findOne({
    userId: user._id,
    purpose: OTP_PURPOSE.VERIFY_EMAIL,
    usedAt: null,
  }).select("+codeHash");

  if (!record) throw new ApiError(400, "OTP not found or expired");
  if (record.expiresAt.getTime() < Date.now())
    throw new ApiError(400, "OTP expired");
  if (record.attempts >= 5) throw new ApiError(429, "Too many attempts");

  if (sha256(otp) !== record.codeHash) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  record.usedAt = new Date();
  await record.save();

  user.isVerified = true;
  await user.save();

  return user;
};

export const resendUserOtp = async (emailOrPhone: string) => {
  const user = await User.findOne({
    $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
  });

  if (!user) throw new ApiError(404, "User not found");
  if (user.isVerified) throw new ApiError(400, "User already verified");

  const otp = await createOtp(user._id.toString(), OTP_PURPOSE.VERIFY_EMAIL);
  const message = `Your new ProCoachHub OTP is: ${otp}`;

  if (user.email)
    await sendEmail(user.email, "ProCoachHub OTP Resend", message);
  if (user.phone) await sendSms(user.phone, message);

  return true;
};

export const loginUser = async (
  input: { emailOrPhone: string; password: string },
  meta?: { ip?: string; userAgent?: string },
) => {
  const user = await getUserByEmailOrPhone(input.emailOrPhone);
  if (!user) throw new ApiError(401, "Invalid credentials");

  const ok = await comparePassword(input.password, user.passwordHash);
  if (!ok) throw new ApiError(401, "Invalid credentials");
  if (!user.isVerified)
    throw new ApiError(403, "Please verify your account first");

  user.lastLoginAt = new Date();
  user.lastLoginIp = meta?.ip || "";
  user.lastLoginUserAgent = meta?.userAgent || "";
  await user.save();

  const tokens = createTokenPair({
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  const refreshTokenData: {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
    userAgent?: string;
    ip?: string;
  } = {
    userId: user._id.toString(),
    refreshToken: tokens.refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  if (meta?.userAgent) refreshTokenData.userAgent = meta.userAgent;
  if (meta?.ip) refreshTokenData.ip = meta.ip;

  await persistRefreshToken(refreshTokenData);

  const safeUser = await User.findById(user._id).select("-passwordHash");
  return { user: safeUser, ...tokens };
};

export const refreshSession = async (refreshTokenValue: string) => {
  const stored = await findRefreshToken(refreshTokenValue);
  if (!stored) throw new ApiError(401, "Invalid refresh token");

  const decoded = verifyRefreshToken(refreshTokenValue);
  const user = await User.findById(decoded.userId);
  if (!user) throw new ApiError(401, "User not found");

  stored.revokedAt = new Date();
  await stored.save();

  const tokens = createTokenPair({
    userId: user._id.toString(),
    role: user.role,
    tokenVersion: user.tokenVersion,
  });

  await persistRefreshToken({
    userId: user._id.toString(),
    refreshToken: tokens.refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  const safeUser = await User.findById(user._id).select("-passwordHash");
  return { user: safeUser, ...tokens };
};

export const logoutUser = async (refreshTokenValue: string) => {
  await revokeRefreshToken(refreshTokenValue);
  return true;
};

export const forgotPassword = async (emailOrPhone: string) => {
  const user = await User.findOne({
    $or: [{ email: emailOrPhone.toLowerCase() }, { phone: emailOrPhone }],
  });

  if (!user) return true;

  await PasswordReset.deleteMany({ userId: user._id });
  const otp = await createOtp(user._id.toString(), OTP_PURPOSE.RESET_PASSWORD);

  await PasswordReset.create({
    userId: user._id,
    tokenHash: sha256(otp),
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const message = `Use this ProCoachHub reset OTP to reset your password: ${otp}`;

  if (user.email)
    await sendEmail(user.email, "ProCoachHub Password Reset", message);
  if (user.phone) await sendSms(user.phone, message);

  return true;
};

export const resetPassword = async (input: {
  emailOrPhone: string;
  otp: string;
  newPassword: string;
}) => {
  const user = await User.findOne({
    $or: [
      { email: input.emailOrPhone.toLowerCase() },
      { phone: input.emailOrPhone },
    ],
  }).select("+passwordHash");

  if (!user) throw new ApiError(404, "User not found");

  const record = await PasswordReset.findOne({
    userId: user._id,
    usedAt: null,
  }).select("+tokenHash");
  if (!record) throw new ApiError(400, "Reset OTP not found");
  if (record.expiresAt.getTime() < Date.now())
    throw new ApiError(400, "Reset OTP expired");
  if (sha256(input.otp) !== record.tokenHash)
    throw new ApiError(400, "Invalid OTP");

  user.passwordHash = await hashPassword(input.newPassword);
  user.tokenVersion += 1;
  await user.save();

  record.usedAt = new Date();
  await record.save();

  return true;
};

export const getProfile = async (userId: string) => {
  const user = await User.findById(userId).select("-passwordHash");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const updateProfile = async (
  userId: string,
  input: any,
  profileImagePath?: string,
) => {
  const updateData: any = { ...input };
  if (profileImagePath) updateData.profileImage = profileImagePath;

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-passwordHash");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const changePassword = async (
  userId: string,
  input: { currentPassword: string; newPassword: string },
) => {
  const user = await User.findById(userId).select("+passwordHash");
  if (!user) throw new ApiError(404, "User not found");

  const ok = await comparePassword(input.currentPassword, user.passwordHash);
  if (!ok) throw new ApiError(400, "Current password is incorrect");

  user.passwordHash = await hashPassword(input.newPassword);
  user.tokenVersion += 1;
  await user.save();

  return true;
};
