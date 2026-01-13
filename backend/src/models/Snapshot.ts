import mongoose, { Schema, Document } from 'mongoose';

export interface ISnapshot extends Document {
  url: string;
  hash: string;
  sourceId?: string;
  lastSeen?: Date;
}

const SnapshotSchema: Schema = new Schema(
  {
    url: { type: String, required: true, index: true, unique: true },
    hash: { type: String, required: true },
    sourceId: { type: Schema.Types.ObjectId, ref: 'Source' },
    lastSeen: { type: Date },
  },
  { timestamps: true }
);

export const Snapshot = mongoose.model<ISnapshot>('Snapshot', SnapshotSchema);

export default Snapshot;
