import { OTP_EXPIRES_MINUTES } from "../constants/otp";
import Otp from "../models/Otp";
import { generateOtp, sha256 } from "../utils/token";

export const createOtp = async (
  userId: string,
  purpose: "verify_email" | "reset_password",
) => {
  const otp = generateOtp(6);
  const codeHash = sha256(otp);

  await Otp.deleteMany({ userId, purpose });

  await Otp.create({
    userId,
    codeHash,
    purpose,
    expiresAt: new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000),
    attempts: 0,
  });

  return otp;
};
