import mongoose, { Schema, Document } from "mongoose";

export type QuestionType = "tf" | "mcq" | "multi" | "fill";
export type QuestionScope = "general" | "career";

export interface QuestionOption {
  id: string;
  text: string;
  tags: string[];
  weight: number;
}

export interface QuestionDocument extends Document {
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  scope: QuestionScope;
  careerField?: string | null;
  topic?: string;
}

const optionSchema = new Schema<QuestionOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    tags: { type: [String], default: [] },
    weight: { type: Number, default: 1 },
  },
  { _id: false }
);

const questionSchema = new Schema<QuestionDocument>(
  {
    text: { type: String, required: true },
    type: {
      type: String,
      enum: ["tf", "mcq", "multi", "fill"],
      required: true,
    },
    options: { type: [optionSchema], default: [] },
    scope: {
      type: String,
      enum: ["general", "career"],
      required: true,
      index: true,
    },
    careerField: { type: String, default: null, index: true },
    topic: { type: String },
  },
  { timestamps: true, versionKey: false }
);

export const QuestionModel = mongoose.model<QuestionDocument>(
  "Question",
  questionSchema
);
