import { Schema, model, Document, Types } from "mongoose";

export interface IAssignment extends Document {
  batchId: Types.ObjectId;
  title: string;
  description?: string;
  type: "assignment" | "note" | "material";
  attachmentUrl?: string;
  dueDate?: Date;
  postedBy: Types.ObjectId;
  postedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    batchId: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["assignment", "note", "material"],
      required: true,
      default: "assignment",
    },
    attachmentUrl: { type: String },
    dueDate: { type: Date },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export const Assignment = model<IAssignment>("Assignment", AssignmentSchema);
