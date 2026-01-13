import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IApplication extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  jobId: mongoose.Types.ObjectId;
  appliedAt?: Date;
  method?: string;
  status?: string;
  proof?: any;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    appliedAt: Date,
    method: String,
    status: String,
    proof: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Application = mongoose.model<IApplication>("Application", ApplicationSchema);
