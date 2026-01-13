import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IReferral extends mongoose.Document {
  referrerUserId: mongoose.Types.ObjectId;
  referredEmail: string;
  jobId?: mongoose.Types.ObjectId;
  status: string;
  commission?: number;
}

const ReferralSchema = new Schema<IReferral>(
  {
    referrerUserId: { type: Schema.Types.ObjectId, ref: "User" },
    referredEmail: String,
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    status: { type: String, default: "created" },
    commission: Number,
  },
  { timestamps: true }
);

export const Referral = mongoose.model<IReferral>("Referral", ReferralSchema);
