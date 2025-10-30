import mongoose, { Schema, Document, Types } from "mongoose";

export type AttemptMethod =
  | "user-details"
  | "detailed-intake"
  | "qa-general"
  | "qa-career";

export interface CareerResult {
  careerName: string;
  score: number;
  explanation: string;
  highlights: string[];
  nextSteps: string[];
}

export interface AttemptDocument extends Document {
  user: Types.ObjectId;
  method: AttemptMethod;
  inputSnapshot: Record<string, unknown>;
  scores: Record<string, number>;
  careerResults: CareerResult[];
  createdAt: Date;
}

const resultSchema = new Schema<CareerResult>(
  {
    careerName: { type: String, required: true },
    score: { type: Number, required: true },
    explanation: { type: String, required: true },
    highlights: { type: [String], default: [] },
    nextSteps: { type: [String], default: [] },
  },
  { _id: false }
);

const attemptSchema = new Schema<AttemptDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    method: {
      type: String,
      enum: ["user-details", "detailed-intake", "qa-general", "qa-career"],
      required: true,
    },
    inputSnapshot: { type: Schema.Types.Mixed, required: true },
    scores: { type: Schema.Types.Mixed, default: {} },
    careerResults: { type: [resultSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const AttemptModel = mongoose.model<AttemptDocument>(
  "Attempt",
  attemptSchema
);
