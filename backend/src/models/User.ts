import mongoose from "mongoose";

const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  email: string;
  passwordHash: string;
  name?: string;
  phone?: string;
  roles: string[];
  tier: string;
  notificationPrefs: {
    email: boolean;
    whatsapp: boolean;
    telegram: boolean;
  };
  consent?: {
    autoApply?: boolean;
    timestamp?: Date;
  };
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: String,
    phone: String,
    roles: { type: [String], default: ["user"] },
    tier: { type: String, default: "free" },
    notificationPrefs: {
      email: { type: Boolean, default: true },
      whatsapp: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false },
    },
    consent: {
      autoApply: { type: Boolean, default: false },
      timestamp: Date,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
