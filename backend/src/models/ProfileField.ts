import mongoose from 'mongoose';

const ProfileFieldSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    type: { type: String, default: 'text' },
    required: { type: Boolean, default: false },
    options: { type: [String], default: [] },
    adminOnly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProfileField = mongoose.model('ProfileField', ProfileFieldSchema);
