import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  actor?: string;
  action: string;
  meta?: any;
}

const AuditSchema: Schema = new Schema(
  {
    actor: { type: String },
    action: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditSchema);

export default AuditLog;
