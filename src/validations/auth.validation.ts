import { z } from "zod";

export const registerSchema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(7).optional(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    gender: z.enum(["male", "female", "other"]).optional(),
    dateOfBirth: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    coachingInterest: z.string().optional(),
    experienceLevel: z
      .enum(["beginner", "intermediate", "advanced"])
      .optional(),
    bio: z.string().optional(),
    qualification: z.string().optional(),
    organizationName: z.string().optional(),
    emergencyContact: z.string().optional(),
    role: z.enum(["student", "coach"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  emailOrPhone: z.string().min(3),
  password: z.string().min(1),
});

export const verifyOtpSchema = z.object({
  emailOrPhone: z.string().min(3),
  otp: z.string().min(4).max(8),
});

export const verifyForgotOtpSchema = z.object({
  emailOrPhone: z.string().min(1, "Email or phone is required"),
  otp: z.string().min(1, "OTP is required").length(6, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
  emailOrPhone: z.string().min(3),
});

export const forgotPasswordSchema = z.object({
  emailOrPhone: z.string().min(3),
});

export const resetPasswordSchema = z
  .object({
    emailOrPhone: z.string().min(3),
    otp: z.string().min(4).max(8),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(7).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  coachingInterest: z.string().optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  bio: z.string().optional(),
  qualification: z.string().optional(),
  organizationName: z.string().optional(),
  emergencyContact: z.string().optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmNewPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });
