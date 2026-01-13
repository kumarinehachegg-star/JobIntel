import mongoose from "mongoose";

const { Schema } = mongoose;

export interface INotificationLog extends mongoose.Document {
  userId?: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  channel: string;
  payload?: any;
  status: string;
  attempts: number;
  lastError?: string;
}

const NotificationLogSchema = new Schema<INotificationLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    channel: String,
    payload: Schema.Types.Mixed,
    status: String,
    attempts: { type: Number, default: 0 },
    lastError: String,
  },
  { timestamps: true }
);

export const NotificationLog = mongoose.model<INotificationLog>("NotificationLog", NotificationLogSchema);
