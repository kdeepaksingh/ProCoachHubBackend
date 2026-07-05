import { Schema, model, Document, Types } from "mongoose";

export interface ISubject extends Document {
  name: string;
  code: string;
  courseId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true },
);

export const Subject = model<ISubject>("Subject", SubjectSchema);
