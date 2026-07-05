import { Schema, model, Document, Types } from "mongoose";

export interface IFeePlan extends Document {
  studentId: Types.ObjectId;
  courseId: Types.ObjectId;
  batchId?: Types.ObjectId;
  totalAmount: number;
  discount?: number;
  installments: {
    dueDate: Date;
    amount: number;
    description?: string;
    paid: boolean;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FeePlanSchema = new Schema<IFeePlan>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    batchId: { type: Schema.Types.ObjectId, ref: "Batch" },
    totalAmount: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    installments: [
      {
        dueDate: { type: Date, required: true },
        amount: { type: Number, required: true },
        description: { type: String },
        paid: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

export const FeePlan = model<IFeePlan>("FeePlan", FeePlanSchema);
