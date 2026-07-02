import crypto from "crypto";

export const generateOtp = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
};

export const sha256 = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const randomToken = () => crypto.randomBytes(32).toString("hex");
