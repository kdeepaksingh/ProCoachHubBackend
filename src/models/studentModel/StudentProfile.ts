import mongoose, { Document, Schema } from "mongoose";

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  dateOfBirth?: Date;
  grade?: string;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    dateOfBirth: { type: Date },
    grade: { type: String },
    parentName: { type: String },
    parentPhone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
  },
  { timestamps: true },
);

export const StudentProfile = mongoose.model<IStudentProfile>(
  "StudentProfile",
  StudentProfileSchema,
);
