import mongoose, { Schema, Document } from "mongoose";

export interface ProfileDocument extends Document {
  gender?: string;
  dob?: Date;
  educationLevel?: string;
  location?: string;
  headline?: string;
  currentRole?: string;
  yearsExperience?: number;
  targetRoles?: string[];
  summary?: string;
  coreSkills?: string[];
  technicalSkills?: string[];
  softSkills?: string[];
  certifications?: string[];
  languages?: string[];
  preferredIndustries?: string[];
  preferredWorkFormats?: string[];
  careerGoals?: string;
  learningFocus?: string;
  availability?: string;
  salaryExpectation?: string;
  portfolioUrl?: string;
  linkedInUrl?: string;
}

const profileSchema = new Schema<ProfileDocument>(
  {
    gender: { type: String },
    dob: { type: Date },
    educationLevel: { type: String },
    location: { type: String },
    headline: { type: String },
    currentRole: { type: String },
    yearsExperience: { type: Number, min: 0 },
    targetRoles: { type: [String], default: [] },
    summary: { type: String },
    coreSkills: { type: [String], default: [] },
    technicalSkills: { type: [String], default: [] },
    softSkills: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    preferredIndustries: { type: [String], default: [] },
    preferredWorkFormats: { type: [String], default: [] },
    careerGoals: { type: String },
    learningFocus: { type: String },
    availability: { type: String },
    salaryExpectation: { type: String },
    portfolioUrl: { type: String },
    linkedInUrl: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const ProfileModel = mongoose.model<ProfileDocument>(
  "Profile",
  profileSchema
);
