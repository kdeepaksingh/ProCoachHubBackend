import { Schema, model, Document, Types } from "mongoose";

export interface IAttendance extends Document {
  batchId: Types.ObjectId;
  date: Date;
  records: {
    studentId: Types.ObjectId;
    status: "present" | "absent" | "late";
  }[];
  markedBy: Types.ObjectId;
  markedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    date: { type: Date, required: true },
    records: [
      {
        studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
          type: String,
          enum: ["present", "absent", "late"],
          required: true,
        },
      },
    ],
    markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    markedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Attendance = model<IAttendance>("Attendance", AttendanceSchema);
