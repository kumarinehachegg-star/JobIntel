import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    custom: { type: Boolean, default: true },
    createdBy: { type: String },
  },
  { timestamps: true }
);

export const Skill = mongoose.model('Skill', SkillSchema);
