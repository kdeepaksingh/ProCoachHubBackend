import { Schema, model, Document, Types } from "mongoose";

export interface IBatch extends Document {
  name: string;
  courseId: Types.ObjectId;
  teacherId: Types.ObjectId;
  subjects: Types.ObjectId[];
  startTime: Date;
  endTime: Date;
  schedule: {
    days: string[];
    time: string;
    mode: "online" | "offline";
    link?: string;
    room?: string;
  };
  maxStudents: number;
  enrolledCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BatchSchema = new Schema<IBatch>(
  {
    name: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    teacherId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    schedule: {
      days: [{ type: String }],
      time: { type: String, required: true },
      mode: { type: String, enum: ["online", "offline"], required: true },
      link: { type: String },
      room: { type: String },
    },
    maxStudents: { type: Number, default: 30 },
    enrolledCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Batch = model<IBatch>("Batch", BatchSchema);
