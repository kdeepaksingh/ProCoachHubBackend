import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  userId: Types.ObjectId;
  title: string;
  message: string;
  type: "system" | "fee" | "class" | "exam" | "announcement";
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["system", "fee", "class", "exam", "announcement"],
      required: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification = model<INotification>(
  "Notification",
  NotificationSchema,
);
