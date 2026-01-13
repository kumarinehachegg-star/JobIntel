import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IRevenue extends mongoose.Document {
  companyId?: mongoose.Types.ObjectId;
  jobId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  type: 'job_posting' | 'premium_feature' | 'subscription' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paymentMethod?: string;
  description?: string;
  metadata?: any;
}

const RevenueSchema = new Schema<IRevenue>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: "Company", index: true },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    amount: { type: Number, required: true, default: 500 },
    currency: { type: String, default: 'INR' },
    type: { 
      type: String, 
      enum: ['job_posting', 'premium_feature', 'subscription', 'other'],
      default: 'job_posting'
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
      index: true
    },
    transactionId: { type: String, index: true },
    paymentMethod: String,
    description: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Index for revenue reports
RevenueSchema.index({ createdAt: -1 });
RevenueSchema.index({ status: 1, createdAt: -1 });

export const Revenue = mongoose.model<IRevenue>("Revenue", RevenueSchema);
