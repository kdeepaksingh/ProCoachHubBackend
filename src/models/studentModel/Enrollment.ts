import { Schema, model, Document, Types } from "mongoose";

export interface IEnrollment extends Document {
  studentId: Types.ObjectId;
  batchId: Types.ObjectId;
  courseId: Types.ObjectId;
  status: "active" | "completed" | "dropped";
  enrolledAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    status: {
      type: String,
      enum: ["active", "completed", "dropped"],
      default: "active",
    },
    enrolledAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

export const Enrollment = model<IEnrollment>("Enrollment", EnrollmentSchema);
