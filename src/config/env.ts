import dotenv from "dotenv";
dotenv.config();

const requiredEnv = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || "8000",
  hostName: process.env.HOSTNAME || "127.0.0.1",
  clientUrl: process.env.CLIENT_URL,
  uploadBaseUrl: process.env.UPLOAD_BASE_URL,
  appName: process.env.APP_NAME || "ProCoachHub",
  cookieSecure: process.env.COOKIE_SECURE === "true",

  mongoUri: requiredEnv("MONGODB_URI"),
  jwtAccessSecret: requiredEnv("JWT_ACCESS_SECRET_KEY"),
  jwtRefreshSecret: requiredEnv("JWT_REFRESH_SECRET_KEY"),

  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  emailFrom: process.env.EMAIL_FROM || "no-reply@procoachhub.com",
  smsSender: process.env.SMS_SENDER || "ProCoachHub",
};
