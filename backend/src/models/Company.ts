import mongoose from "mongoose";

const { Schema } = mongoose;

export interface ICompany extends mongoose.Document {
  name: string;
  website?: string;
  careerPage?: string;
  metadata?: any;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, index: true },
    website: String,
    careerPage: String,
    metadata: Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>("Company", CompanySchema);
