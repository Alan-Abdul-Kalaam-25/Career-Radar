import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ProfileRef {
  gender?: string;
  dob?: Date;
  educationLevel?: string;
  location?: string;
}

export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  profile?: Types.ObjectId;
  createdAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);


