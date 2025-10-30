export type QuestionType = "tf" | "mcq" | "multi" | "fill";

export type QuestionOption = {
  id: string;
  text: string;
  tags: string[];
  weight: number;
};

export type Question = {
  _id: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  scope: "general" | "career";
  careerField?: string | null;
  topic?: string;
};

export type CareerResult = {
  careerName: string;
  score: number;
  explanation: string;
  highlights: string[];
  nextSteps: string[];
};

export type Attempt = {
  _id: string;
  method: "user-details" | "detailed-intake" | "qa-general" | "qa-career";
  inputSnapshot: Record<string, unknown>;
  scores: Record<string, number>;
  careerResults: CareerResult[];
  createdAt: string;
};

export type Profile = {
  gender?: string;
  dob?: string;
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
};

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile?: Profile;
};
