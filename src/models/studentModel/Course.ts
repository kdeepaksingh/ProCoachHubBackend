import { Schema, model, Document } from "mongoose";

export interface ICourse extends Document {
  name: string;
  code: string;
  description?: string;
  durationMonths: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    description: { type: String },
    durationMonths: { type: Number, default: 12 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Course = model<ICourse>("Course", CourseSchema);
