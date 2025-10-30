import { Response } from "express";
import { createRequire } from "module";
import { AuthRequest } from "../middleware/auth.js";
import { AttemptModel } from "../models/Attempt.js";
import { ProfileModel } from "../models/Profile.js";
import {
  calculateCareerResults,
  findTagsFromKeywords,
} from "../utils/scoring.js";
import { getCareerDetail } from "../utils/careerDetails.js";

const require = createRequire(import.meta.url);
const careerMap = require("../utils/careerMap.json");
const keywords = require("../utils/keywords.json");

export async function suggestFromUserDetails(req: AuthRequest, res: Response) {
  try {
    const profile = await ProfileModel.findById(
      req.body.profileId || undefined
    );
    const inputSnapshot = profile ? profile.toObject() : req.body.profile || {};

    const answers = buildAnswersFromProfile(inputSnapshot);
    const { tagScores, results } = calculateCareerResults(
      answers as any,
      careerMap as any,
      keywords as any
    );
    const withExplanations = decorateCareerResults(results, tagScores);
    const attempt = await AttemptModel.create({
      user: req.userId!,
      method: "user-details",
      inputSnapshot,
      scores: tagScores,
      careerResults: withExplanations,
    });
    return res.json({ attemptId: attempt._id, results: withExplanations });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

function buildAnswersFromProfile(p: Record<string, unknown>) {
  const values = new Set<string>();

  const addString = (value: unknown) => {
    if (typeof value === "string" && value.trim()) {
      values.add(value.trim().toLowerCase());
    }
  };

  const addArray = (items: unknown) => {
    if (Array.isArray(items)) {
      items.forEach((item) => addString(item));
    }
  };

  addString(p.educationLevel);
  addString(p.location);
  addString(p.headline);
  addString(p.currentRole);
  addString(p.summary);
  addString(p.careerGoals);
  addString(p.learningFocus);
  addString(p.availability);
  addString(p.salaryExpectation);

  if (
    typeof p.yearsExperience === "number" &&
    Number.isFinite(p.yearsExperience)
  ) {
    values.add(`${p.yearsExperience} years experience`);
  }

  addArray(p.targetRoles);
  addArray(p.coreSkills);
  addArray(p.technicalSkills);
  addArray(p.softSkills);
  addArray(p.certifications);
  addArray(p.languages);
  addArray(p.preferredIndustries);
  addArray(p.preferredWorkFormats);

  return Array.from(values).map((value) => ({ type: "fill", value }));
}

export async function submitQuestionnaire(req: AuthRequest, res: Response) {
  try {
    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    if (answers.length === 0) {
      return res.status(400).json({ message: "Answers are required." });
    }

    const mode = req.body.mode === "career" ? "career" : "general";
    const careerField =
      mode === "career" &&
      typeof req.body.careerField === "string" &&
      req.body.careerField.trim().length > 0
        ? req.body.careerField.trim()
        : null;
    if (mode === "career" && !careerField) {
      return res.status(400).json({
        message: "Career field is required for targeted questionnaires.",
      });
    }

    const { tagScores, results } = calculateCareerResults(
      answers,
      careerMap as any,
      keywords as any
    );
    const decorated = decorateCareerResults(results, tagScores);
    const attempt = await AttemptModel.create({
      user: req.userId!,
      method: mode === "career" ? "qa-career" : "qa-general",
      inputSnapshot: {
        answers,
        mode,
        careerField,
        questionIds: req.body.questionIds || [],
      },
      scores: tagScores,
      careerResults: decorated,
    });
    return res.json({ attemptId: attempt._id, results: decorated });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const attempts = await AttemptModel.find({ user: req.userId }).sort({
      createdAt: -1,
    });
    return res.json({ attempts });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getAttempt(req: AuthRequest, res: Response) {
  try {
    const attempt = await AttemptModel.findOne({
      _id: req.params.id,
      user: req.userId,
    });
    if (!attempt) return res.status(404).json({ message: "Not found" });
    return res.json({ attempt });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function submitDetailedIntake(req: AuthRequest, res: Response) {
  try {
    const intake =
      typeof req.body.intake === "object" && req.body.intake !== null
        ? req.body.intake
        : null;
    if (!intake) {
      return res.status(400).json({ message: "Intake payload is required." });
    }

    const normalizedIntake = normalizeIntake(intake);
    const intakeAnswers = buildAnswersFromIntake(normalizedIntake);
    if (intakeAnswers.length === 0) {
      return res.status(400).json({
        message:
          "Provide enough detail in the intake form so we can generate recommendations.",
      });
    }

    const { tagScores, results } = calculateCareerResults(
      intakeAnswers as any,
      careerMap as any,
      keywords as any
    );
    const decorated = decorateCareerResults(results, tagScores);
    const attempt = await AttemptModel.create({
      user: req.userId!,
      method: "detailed-intake",
      inputSnapshot: { intake: normalizedIntake },
      scores: tagScores,
      careerResults: decorated,
    });

    return res.json({ attemptId: attempt._id, results: decorated });
  } catch (err) {
    console.error("Failed to submit detailed intake", err);
    return res.status(500).json({ message: "Server error" });
  }
}

type ScoreMap = Record<string, number>;

function decorateCareerResults(
  results: { careerName: string; score: number }[],
  tagScores: ScoreMap
): {
  careerName: string;
  score: number;
  explanation: string;
  highlights: string[];
  nextSteps: string[];
}[] {
  const topSignals = Object.entries(tagScores)
    .filter(([, score]) => score > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([tag]) => humanizeTag(tag));

  return results.slice(0, 5).map((item) => {
    const detail = getCareerDetail(item.careerName);
    const signalHighlight = topSignals.length
      ? `Primary signals powering this match: ${topSignals.join(", ")}.`
      : "Your responses supplied balanced signals across several competency areas.";

    return {
      careerName: item.careerName,
      score: item.score,
      explanation: detail.summary,
      highlights: [signalHighlight, ...detail.highlights],
      nextSteps: detail.nextSteps,
    };
  });
}

function humanizeTag(tag: string) {
  return tag
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .replace("Ci Cd", "CI/CD");
}

function normalizeIntake(raw: Record<string, unknown>) {
  const normalized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      normalized[key] = value.trim();
    } else if (Array.isArray(value)) {
      normalized[key] = value.filter(
        (item) => typeof item === "string" && item.trim().length > 0
      );
    } else {
      normalized[key] = value;
    }
  }
  return normalized;
}

function buildAnswersFromIntake(intake: Record<string, any>) {
  const answers: any[] = [];

  addSelectionAnswers(answers, intake.targetRoles, TARGET_ROLE_TAGS, 5);
  addSelectionAnswers(answers, intake.technicalSkills, TECH_SKILL_TAGS, 4);
  addSelectionAnswers(answers, intake.coreTools, TOOL_TAGS, 3);
  addSelectionAnswers(answers, intake.softSkills, SOFT_SKILL_TAGS, 3);
  addSelectionAnswers(answers, intake.workStyles, WORK_STYLE_TAGS, 2);
  addSelectionAnswers(answers, intake.learningGoals, LEARNING_FOCUS_TAGS, 2);
  addSelectionAnswers(answers, intake.focusIndustries, INDUSTRY_TAGS, 1);

  if (
    typeof intake.yearsExperience === "string" ||
    typeof intake.yearsExperience === "number"
  ) {
    const years = Number(intake.yearsExperience);
    if (!Number.isNaN(years)) {
      const buckets =
        years >= 10
          ? ["mentorship", "strategy"]
          : years >= 6
          ? ["strategy", "program-execution"]
          : years >= 3
          ? ["product-thinking", "end-to-end"]
          : ["analysis", "product-thinking"];
      answers.push({ type: "multi", options: [{ tags: buckets, weight: 2 }] });
    }
  }

  const textFields = [
    "headline",
    "currentRole",
    "recentAchievements",
    "challengeNarrative",
    "preferredTeamCulture",
    "locationPreference",
    "portfolioLinks",
    "additionalNotes",
  ];
  for (const field of textFields) {
    const value = intake[field];
    if (typeof value === "string" && value.trim().length > 0) {
      answers.push({ type: "fill", value: value.trim() });
    }
  }

  return answers;
}

function addSelectionAnswers(
  answers: any[],
  rawValues: unknown,
  dictionary: Record<string, string[]>,
  weight: number
) {
  if (!Array.isArray(rawValues)) return;
  for (const entry of rawValues) {
    const key = typeof entry === "string" ? entry : "";
    if (!key) continue;
    const tags = dictionary[key];
    if (tags && tags.length) {
      answers.push({ type: "multi", options: [{ tags, weight }] });
    }
  }
}

const TARGET_ROLE_TAGS: Record<string, string[]> = {
  "frontend-architect": [
    "frontend",
    "ui-architecture",
    "design-systems",
    "performance",
  ],
  "frontend-product": ["frontend", "product-thinking", "design-systems"],
  "frontend-performance": ["frontend", "performance", "accessibility"],
  "backend-platform": ["backend", "distributed-systems", "api-design"],
  "backend-data": ["backend", "databases", "scalability"],
  "backend-security": ["backend", "security", "distributed-systems"],
  "fullstack-builder": ["frontend", "backend", "end-to-end"],
  "fullstack-lead": ["frontend", "backend", "mentorship", "product"],
  "ml-platform": ["ml-engineering", "ml-ops", "automation"],
  "data-science-product": ["data-science", "storytelling", "analysis"],
  "product-strategist": ["product", "strategy", "stakeholder"],
  "ux-lead": ["design", "ux-research", "design-systems"],
  "devops-sre": ["devops", "automation", "observability"],
  "cloud-architect": ["cloud", "infrastructure", "cost-optimization"],
  "security-response": ["security", "incident-response", "threat-modeling"],
  "data-engineer-platform": ["data-engineering", "pipelines", "governance"],
  "tpm-platform": ["tpm", "program-execution", "strategy"],
};

const TECH_SKILL_TAGS: Record<string, string[]> = {
  react: ["frontend", "design-systems", "ui-architecture"],
  nextjs: ["frontend", "performance", "ui-architecture"],
  typescript: ["typescript", "frontend", "ui-architecture"],
  tailwind: ["frontend", "design-systems"],
  testinglibrary: ["testing", "frontend"],
  jest: ["testing", "frontend"],
  cypress: ["testing", "automation"],
  redux: ["state-management", "frontend"],
  graphql: ["apis", "product-thinking"],
  node: ["backend", "apis"],
  express: ["backend", "api-design"],
  nestjs: ["backend", "distributed-systems"],
  python: ["python", "data-science"],
  pandas: ["analytics", "data-science"],
  pyspark: ["data-engineering", "pipelines"],
  airflow: ["pipelines", "automation"],
  kubernetes: ["devops", "automation"],
  terraform: ["infrastructure", "automation"],
  docker: ["devops", "automation"],
  aws: ["cloud", "infrastructure"],
  azure: ["cloud", "infrastructure"],
  gcp: ["cloud", "infrastructure"],
  huggingface: ["machine-learning", "ml-engineering"],
  promptengineering: ["machine-learning", "analysis"],
  spark: ["data-engineering", "pipelines"],
  golang: ["backend", "distributed-systems"],
  rust: ["backend", "performance"],
};

const TOOL_TAGS: Record<string, string[]> = {
  figma: ["design", "design-systems"],
  miro: ["ux-research", "communication"],
  storybook: ["design-systems", "frontend"],
  postman: ["api-design", "testing"],
  grafana: ["observability", "monitoring"],
  datadog: ["observability", "monitoring"],
  splunk: ["security", "monitoring"],
  sentry: ["observability", "frontend"],
  jira: ["program-execution", "stakeholder"],
  notion: ["product", "communication"],
  confluence: ["communication", "stakeholder"],
  githubactions: ["ci-cd", "automation"],
  circleci: ["ci-cd", "automation"],
  argo: ["ci-cd", "automation"],
  dbt: ["pipelines", "governance"],
  tableau: ["analytics", "storytelling"],
  looker: ["analytics", "storytelling"],
  powerbi: ["analytics", "storytelling"],
};

const SOFT_SKILL_TAGS: Record<string, string[]> = {
  facilitation: ["stakeholder", "communication"],
  storytelling: ["storytelling", "communication"],
  mentoring: ["mentorship", "communication"],
  coaching: ["mentorship", "communication"],
  negotiation: ["stakeholder", "strategy"],
  systemsThinking: ["strategy", "distributed-systems"],
  analyticalFraming: ["analysis", "strategy"],
  experimentation: ["analysis", "product"],
  conflictNavigation: ["stakeholder", "communication"],
  inclusiveLeadership: ["mentorship", "stakeholder"],
};

const WORK_STYLE_TAGS: Record<string, string[]> = {
  asyncRemote: ["communication", "product-thinking"],
  hybrid: ["communication", "stakeholder"],
  colocated: ["mentorship", "communication"],
  rapidIteration: ["product-thinking", "analysis"],
  regulated: ["governance", "risk"],
  missionCritical: ["risk", "incident-response"],
  platformEnablement: ["program-execution", "strategy"],
};

const LEARNING_FOCUS_TAGS: Record<string, string[]> = {
  advancedArchitecture: ["ui-architecture", "distributed-systems"],
  llmApplied: ["machine-learning", "analysis"],
  systemDesign: ["distributed-systems", "strategy"],
  leadership: ["mentorship", "strategy"],
  experimentationScience: ["analysis", "product"],
  accessibility: ["accessibility", "frontend"],
  observability: ["observability", "devops"],
  platformSecurity: ["security", "governance"],
};

const INDUSTRY_TAGS: Record<string, string[]> = {
  fintech: ["risk", "compliance"],
  healthcare: ["governance", "risk"],
  ecommerce: ["product-thinking", "analytics"],
  media: ["storytelling", "creativity"],
  saas: ["product-thinking", "strategy"],
  platform: ["program-execution", "strategy"],
  govtech: ["governance", "risk"],
  climate: ["strategy", "analysis"],
};
