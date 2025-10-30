import { Request, Response } from "express";
import { QuestionModel } from "../models/Question.js";

export async function getQuestions(req: Request, res: Response) {
  try {
    const mode =
      typeof req.query.mode === "string" ? req.query.mode : "general";

    if (mode === "fields") {
      const fields = await QuestionModel.distinct("careerField", {
        scope: "career",
      });
      return res.json({ fields: fields.filter(Boolean).sort() });
    }

    const normalizedMode = mode === "career" ? "career" : "general";
    const field =
      typeof req.query.field === "string" && req.query.field.trim().length > 0
        ? req.query.field.trim()
        : null;
    if (normalizedMode === "career" && !field) {
      return res
        .status(400)
        .json({ message: "Career field is required for targeted questions." });
    }

    const limit = Math.min(Number(req.query.limit) || 50, 75);
    const match: Record<string, unknown> = { scope: normalizedMode };
    if (field) match.careerField = field;

    const pipeline: Record<string, unknown>[] = [{ $match: match }];
    pipeline.push({ $sample: { size: limit } });

    const questions = await QuestionModel.aggregate(pipeline);
    const availableFields = await QuestionModel.distinct("careerField", {
      scope: "career",
    });
    return res.json({
      questions,
      availableFields: availableFields.filter(Boolean).sort(),
    });
  } catch (err) {
    console.error("Failed to fetch questions", err);
    return res.status(500).json({ message: "Server error" });
  }
}
