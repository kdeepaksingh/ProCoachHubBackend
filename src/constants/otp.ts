export const OTP_PURPOSE = {
  VERIFY_EMAIL: "verify_email",
  RESET_PASSWORD: "reset_password",
} as const;

export const OTP_LENGTH = 6;
export const OTP_EXPIRES_MINUTES = 10;
