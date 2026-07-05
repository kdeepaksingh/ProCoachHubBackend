import { Schema, model, Document, Types } from "mongoose";

export interface ITestResult extends Document {
  testId: Types.ObjectId;
  studentId: Types.ObjectId;
  marksObtained: number;
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TestResultSchema = new Schema<ITestResult>(
  {
    testId: { type: Schema.Types.ObjectId, ref: "Test", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    marksObtained: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const TestResult = model<ITestResult>("TestResult", TestResultSchema);
