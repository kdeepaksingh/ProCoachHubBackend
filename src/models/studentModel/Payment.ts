import { Schema, model, Document, Types } from "mongoose";

export interface IPayment extends Document {
  studentId: Types.ObjectId;
  feePlanId: Types.ObjectId;
  installmentIndex: number;
  amountPaid: number;
  paymentDate: Date;
  paymentMode: "cash" | "upi" | "card" | "bank";
  transactionId?: string;
  receiptUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    feePlanId: { type: Schema.Types.ObjectId, ref: "FeePlan", required: true },
    installmentIndex: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    paymentMode: {
      type: String,
      enum: ["cash", "upi", "card", "bank"],
      required: true,
    },
    transactionId: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>("Payment", PaymentSchema);
