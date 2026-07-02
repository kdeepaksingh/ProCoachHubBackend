import { Schema, model, Document, Types } from "mongoose";

export interface IOtp extends Document {
  userId: Types.ObjectId;
  codeHash: string;
  purpose: "verify_email" | "reset_password";
  expiresAt: Date;
  attempts: number;
  usedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    codeHash: { type: String, required: true, select: false },
    purpose: {
      type: String,
      required: true,
      enum: ["verify_email", "reset_password"],
    },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model<IOtp>("Otp", otpSchema);
