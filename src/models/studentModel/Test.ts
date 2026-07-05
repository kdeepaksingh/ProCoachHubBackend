import { Schema, model, Document, Types } from "mongoose";

export interface ITest extends Document {
  batchId: Types.ObjectId;
  title: string;
  type: "mock" | "chapter" | "full";
  subjectId?: Types.ObjectId;
  scheduledAt: Date;
  durationMinutes: number;
  maxMarks: number;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<ITest>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ["mock", "chapter", "full"],
      required: true,
    },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    scheduledAt: { type: Date, required: true },
    durationMinutes: { type: Number, required: true },
    maxMarks: { type: Number, required: true },
    link: { type: String },
  },
  { timestamps: true },
);

export const Test = model<ITest>("Test", TestSchema);
