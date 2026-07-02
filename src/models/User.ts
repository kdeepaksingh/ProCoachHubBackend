import { Schema, model, Document } from "mongoose";
import { ROLES, type Role } from "../constants/roles";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: Date;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profileImage?: string;
  coachingInterest?: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  bio?: string;
  qualification?: string;
  organizationName?: string;
  emergencyContact?: string;
  role: Role;
  isVerified: boolean;
  tokenVersion: number;
  lastLoginAt?: Date | null;
  lastLoginIp?: string;
  lastLoginUserAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, default: "" },
    passwordHash: { type: String, required: true, select: false },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: undefined,
    },
    dateOfBirth: { type: Date, default: undefined },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    coachingInterest: { type: String, default: "" },
    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    bio: { type: String, default: "" },
    qualification: { type: String, default: "" },
    organizationName: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.STUDENT },
    isVerified: { type: Boolean, default: false },
    tokenVersion: { type: Number, default: 0 },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: "" },
    lastLoginUserAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export default model<IUser>("User", userSchema);
