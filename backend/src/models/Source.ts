import mongoose, { Schema, Document } from 'mongoose';

export interface ISource extends Document {
  name?: string;
  url: string;
  selector?: string;
  enabled: boolean;
  lastRun?: Date;
  lastResult?: string;
  credentials?: Record<string, any>;
}

const SourceSchema: Schema = new Schema(
  {
    name: { type: String },
    url: { type: String, required: true },
    selector: { type: String },
    enabled: { type: Boolean, default: true },
    lastRun: { type: Date },
    lastResult: { type: String },
    credentials: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Source = mongoose.model<ISource>('Source', SourceSchema);

export default Source;
