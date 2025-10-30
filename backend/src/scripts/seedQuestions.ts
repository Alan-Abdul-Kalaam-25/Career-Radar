import "dotenv/config";
import mongoose from "mongoose";
import { QuestionModel } from "../models/Question.js";

type RawOption = {
  text: string;
  tags: string[];
  weight: number;
};

type RawQuestion = {
  text: string;
  topic: string;
  options: RawOption[];
  type?: "mcq" | "tf";
};

type CareerQuestionSet = {
  label: string;
  questions: RawQuestion[];
};

const mongoUri = process.env.MONGO_URI ?? "";

if (!mongoUri) {
  throw new Error("MONGO_URI is required to seed questions.");
}

const careerQuestionSets: Record<string, CareerQuestionSet> = {
  "web-developer": {
    label: "Web Developer",
    questions: [
      {
        text: "Which HTTP status code indicates that a requested resource was not found on the server?",
        topic: "http-basics",
        options: [
          { text: "404", tags: ["web-development", "http"], weight: 3 },
          { text: "200", tags: ["web-development"], weight: 0 },
          { text: "500", tags: ["web-development"], weight: 0 },
          { text: "301", tags: ["web-development"], weight: 0 },
        ],
      },
      {
        text: "What does a browser's rendering engine primarily do?",
        topic: "rendering",
        options: [
          {
            text: "Parses HTML/CSS and paints the layout",
            tags: ["web-development", "frontend"],
            weight: 3,
          },
          {
            text: "Compiles TypeScript to JavaScript",
            tags: ["web-development"],
            weight: 0,
          },
          {
            text: "Handles database migrations",
            tags: ["web-development"],
            weight: 0,
          },
          {
            text: "Configures reverse proxies",
            tags: ["web-development"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which library is widely used for component-based rendering on the web?",
        topic: "component-architecture",
        options: [
          {
            text: "React",
            tags: ["web-development", "javascript", "component-based"],
            weight: 3,
          },
          {
            text: "Lodash",
            tags: ["javascript"],
            weight: 0,
          },
          {
            text: "Axios",
            tags: ["javascript"],
            weight: 0,
          },
          {
            text: "Sass",
            tags: ["frontend"],
            weight: 0,
          },
        ],
      },
      {
        text: "What is the primary role of a server in a client-server model?",
        topic: "architecture",
        options: [
          {
            text: "Serve resources and handle requests from clients",
            tags: ["web-development", "backend", "http"],
            weight: 3,
          },
          {
            text: "Render CSS animations",
            tags: ["web-development"],
            weight: 0,
          },
          {
            text: "Store cookies on the browser",
            tags: ["web-development"],
            weight: 0,
          },
          {
            text: "Compile JavaScript modules",
            tags: ["web-development"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which tool helps you inspect network requests directly in the browser?",
        topic: "debugging",
        options: [
          {
            text: "Developer tools network panel",
            tags: ["web-development", "debugging"],
            weight: 3,
          },
          { text: "npm audit", tags: ["web-development"], weight: 0 },
          { text: "Git bisect", tags: ["web-development"], weight: 0 },
          { text: "Jest", tags: ["web-development"], weight: 0 },
        ],
      },
    ],
  },
  doctor: {
    label: "Doctor",
    questions: [
      {
        text: "Which vital sign is most critical to assess first in an unresponsive patient?",
        topic: "triage",
        options: [
          {
            text: "Airway and breathing",
            tags: ["medical-diagnosis", "patient-care"],
            weight: 3,
          },
          { text: "Body temperature", tags: ["medical-diagnosis"], weight: 0 },
          { text: "Blood glucose", tags: ["medical-diagnosis"], weight: 0 },
          { text: "Weight", tags: ["medical-diagnosis"], weight: 0 },
        ],
      },
      {
        text: "Why are antibiotics ineffective against viral infections?",
        topic: "pharmacology",
        options: [
          {
            text: "Viruses lack the cellular structures antibiotics target",
            tags: ["medical-diagnosis", "pharmacology"],
            weight: 3,
          },
          {
            text: "Viruses replicate too quickly",
            tags: ["medical-diagnosis"],
            weight: 0,
          },
          {
            text: "Viruses cannot be detected by the immune system",
            tags: ["medical-diagnosis"],
            weight: 0,
          },
          {
            text: "Antibiotics only work at high temperatures",
            tags: ["medical-diagnosis"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which principle underpins patient confidentiality?",
        topic: "medical-ethics",
        options: [
          {
            text: "Respect for patient autonomy and privacy",
            tags: ["medical-ethics", "patient-care"],
            weight: 3,
          },
          {
            text: "Maximising clinical efficiency",
            tags: ["medical-ethics"],
            weight: 0,
          },
          {
            text: "Reducing healthcare cost",
            tags: ["medical-ethics"],
            weight: 0,
          },
          {
            text: "Protecting hospital reputation",
            tags: ["medical-ethics"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which imaging modality is best for evaluating soft tissue detail such as brain structures?",
        topic: "diagnostics",
        options: [
          {
            text: "MRI",
            tags: ["medical-diagnosis", "clinical-skills"],
            weight: 3,
          },
          { text: "X-ray", tags: ["medical-diagnosis"], weight: 0 },
          { text: "Ultrasound", tags: ["medical-diagnosis"], weight: 0 },
          { text: "CT scan", tags: ["medical-diagnosis"], weight: 0 },
        ],
      },
      {
        text: "Which symptom combination most strongly suggests sepsis?",
        topic: "clinical-assessment",
        options: [
          {
            text: "Fever, tachycardia, hypotension",
            tags: ["medical-diagnosis", "patient-care"],
            weight: 3,
          },
          {
            text: "Cough, mild fever, sore throat",
            tags: ["medical-diagnosis"],
            weight: 0,
          },
          {
            text: "Headache, photophobia, stiff neck",
            tags: ["medical-diagnosis"],
            weight: 0,
          },
          {
            text: "Nausea, vomiting, diarrhoea",
            tags: ["medical-diagnosis"],
            weight: 0,
          },
        ],
      },
    ],
  },
  lawyer: {
    label: "Lawyer",
    questions: [
      {
        text: "What is legal precedent?",
        topic: "case-law",
        options: [
          {
            text: "A prior judicial decision that guides future cases",
            tags: ["legal-reasoning", "case-law"],
            weight: 3,
          },
          {
            text: "A statute passed by the legislature",
            tags: ["legal-reasoning"],
            weight: 0,
          },
          {
            text: "An attorney's personal opinion",
            tags: ["legal-reasoning"],
            weight: 0,
          },
          {
            text: "A jury instruction",
            tags: ["legal-reasoning"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which element is required for a valid contract?",
        topic: "contracts",
        options: [
          {
            text: "Offer, acceptance, and consideration",
            tags: ["contracts", "legal-reasoning"],
            weight: 3,
          },
          {
            text: "Witness signatures only",
            tags: ["contracts"],
            weight: 0,
          },
          { text: "A notary stamp", tags: ["contracts"], weight: 0 },
          { text: "Court approval", tags: ["contracts"], weight: 0 },
        ],
      },
      {
        text: "Which objection challenges a question that leads the witness to a desired answer?",
        topic: "trial-advocacy",
        options: [
          {
            text: "Leading",
            tags: ["court-procedure", "legal-reasoning"],
            weight: 3,
          },
          { text: "Hearsay", tags: ["court-procedure"], weight: 0 },
          { text: "Speculation", tags: ["court-procedure"], weight: 0 },
          { text: "Foundation", tags: ["court-procedure"], weight: 0 },
        ],
      },
      {
        text: "Which document initiates a civil lawsuit?",
        topic: "civil-procedure",
        options: [
          {
            text: "Complaint",
            tags: ["legal-reasoning", "civil-procedure"],
            weight: 3,
          },
          { text: "Answer", tags: ["civil-procedure"], weight: 0 },
          {
            text: "Motion to dismiss",
            tags: ["civil-procedure"],
            weight: 0,
          },
          { text: "Subpoena", tags: ["civil-procedure"], weight: 0 },
        ],
      },
      {
        text: "What does attorney-client privilege protect?",
        topic: "legal-ethics",
        options: [
          {
            text: "Confidential communications made for legal advice",
            tags: ["legal-ethics", "legal-reasoning"],
            weight: 3,
          },
          {
            text: "All statements made in court",
            tags: ["legal-ethics"],
            weight: 0,
          },
          {
            text: "Documents filed with the clerk",
            tags: ["legal-ethics"],
            weight: 0,
          },
          {
            text: "Conversations with opposing counsel",
            tags: ["legal-ethics"],
            weight: 0,
          },
        ],
      },
    ],
  },
  "police-officer": {
    label: "Police Officer",
    questions: [
      {
        text: "What does the acronym BOLO stand for in law enforcement?",
        topic: "operative-knowledge",
        options: [
          {
            text: "Be On the Lookout",
            tags: ["law-enforcement", "situational-awareness"],
            weight: 3,
          },
          {
            text: "Bring Officers to Local Operations",
            tags: ["law-enforcement"],
            weight: 0,
          },
          {
            text: "Blend Operations, Limit Offenders",
            tags: ["law-enforcement"],
            weight: 0,
          },
          {
            text: "Brief Officers, Lead Outside",
            tags: ["law-enforcement"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which principle is foundational for preserving a crime scene?",
        topic: "investigation",
        options: [
          {
            text: "Limit contamination by securing entry and exit points",
            tags: ["investigation", "law-enforcement"],
            weight: 3,
          },
          {
            text: "Photograph after evidence collection",
            tags: ["investigation"],
            weight: 0,
          },
          {
            text: "Interview witnesses before securing the area",
            tags: ["investigation"],
            weight: 0,
          },
          {
            text: "Store evidence together to save space",
            tags: ["investigation"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which constitutional amendment protects citizens from unreasonable searches and seizures?",
        topic: "legal-knowledge",
        options: [
          {
            text: "Fourth Amendment",
            tags: ["law-enforcement", "criminal-law"],
            weight: 3,
          },
          { text: "First Amendment", tags: ["law-enforcement"], weight: 0 },
          { text: "Sixth Amendment", tags: ["law-enforcement"], weight: 0 },
          { text: "Tenth Amendment", tags: ["law-enforcement"], weight: 0 },
        ],
      },
      {
        text: "What is the primary purpose of a field training officer?",
        topic: "training",
        options: [
          {
            text: "Mentor and evaluate probationary officers on the job",
            tags: ["law-enforcement", "mentorship"],
            weight: 3,
          },
          {
            text: "Manage payroll and scheduling",
            tags: ["law-enforcement"],
            weight: 0,
          },
          {
            text: "Lead statewide operations",
            tags: ["law-enforcement"],
            weight: 0,
          },
          {
            text: "Oversee facility maintenance",
            tags: ["law-enforcement"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which tactic is emphasised in de-escalation training?",
        topic: "de-escalation",
        options: [
          {
            text: "Use calm communication and time to reduce tension",
            tags: ["law-enforcement", "public-safety"],
            weight: 3,
          },
          {
            text: "Apply physical restraint immediately",
            tags: ["law-enforcement"],
            weight: 0,
          },
          {
            text: "Raise your voice to assert control",
            tags: ["law-enforcement"],
            weight: 0,
          },
          {
            text: "Terminate communication to avoid escalation",
            tags: ["law-enforcement"],
            weight: 0,
          },
        ],
      },
    ],
  },
  teacher: {
    label: "Teacher",
    questions: [
      {
        text: "Which strategy best supports differentiated instruction in a mixed-ability classroom?",
        topic: "instructional-design",
        options: [
          {
            text: "Use tiered tasks that match student readiness levels",
            tags: ["education", "instructional-design"],
            weight: 3,
          },
          {
            text: "Assign the same worksheet to every student",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Rely solely on lecture-based teaching",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Grade only summative assessments",
            tags: ["education"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which assessment type helps monitor student progress during a unit?",
        topic: "assessment",
        options: [
          {
            text: "Formative assessment",
            tags: ["education", "assessment"],
            weight: 3,
          },
          {
            text: "Summative assessment",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Norm-referenced test",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Anecdotal note",
            tags: ["education"],
            weight: 0,
          },
        ],
      },
      {
        text: "What is the primary role of a learning objective in lesson planning?",
        topic: "lesson-planning",
        options: [
          {
            text: "Define the measurable outcome students should achieve",
            tags: ["education", "lesson-planning"],
            weight: 3,
          },
          {
            text: "List every activity planned for class",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Describe the teacher's script",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Outline classroom management rules",
            tags: ["education"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which approach best fosters student engagement through questioning?",
        topic: "student-engagement",
        options: [
          {
            text: "Ask open-ended questions that prompt critical thinking",
            tags: ["education", "student-engagement"],
            weight: 3,
          },
          {
            text: "Call on the same volunteers repeatedly",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Provide the answer immediately",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Avoid wait time to keep pace fast",
            tags: ["education"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which classroom management practice builds a positive learning climate?",
        topic: "classroom-management",
        options: [
          {
            text: "Establish routines and reinforce expectations consistently",
            tags: ["education", "classroom-management"],
            weight: 3,
          },
          {
            text: "Use punitive measures as the first response",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Ignore minor disruptions entirely",
            tags: ["education"],
            weight: 0,
          },
          {
            text: "Limit student voice in the classroom",
            tags: ["education"],
            weight: 0,
          },
        ],
      },
    ],
  },
  nurse: {
    label: "Nurse",
    questions: [
      {
        text: "Which action is a priority when administering high-alert medications?",
        topic: "medication-safety",
        options: [
          {
            text: "Perform an independent double-check with another nurse",
            tags: ["nursing", "patient-safety"],
            weight: 3,
          },
          {
            text: "Rely on patient memory for dosage",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Skip documentation until shift end",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Let pharmacy verify after administration",
            tags: ["nursing"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which vital sign combination signals potential shock?",
        topic: "clinical-assessment",
        options: [
          {
            text: "Low blood pressure and rapid pulse",
            tags: ["nursing", "patient-care"],
            weight: 3,
          },
          {
            text: "Normal blood pressure and slow pulse",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Elevated temperature and stable pulse",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Slightly lowered pulse oximetry",
            tags: ["nursing"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which infection control practice prevents hospital-acquired infections?",
        topic: "infection-control",
        options: [
          {
            text: "Perform hand hygiene before and after patient contact",
            tags: ["nursing", "infection-control"],
            weight: 3,
          },
          {
            text: "Wear gloves instead of washing hands",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Reuse single-use equipment when clean",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Document hygiene at shift end only",
            tags: ["nursing"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which task reflects patient advocacy?",
        topic: "patient-advocacy",
        options: [
          {
            text: "Communicating patient concerns to the physician promptly",
            tags: ["nursing", "patient-advocacy"],
            weight: 3,
          },
          {
            text: "Reducing time spent with family",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Prioritising paperwork before patient safety",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Encouraging patients to follow orders without explanation",
            tags: ["nursing"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which education topic is essential for patients with new insulin therapy?",
        topic: "patient-education",
        options: [
          {
            text: "Recognising signs of hypoglycaemia and response steps",
            tags: ["nursing", "patient-education"],
            weight: 3,
          },
          {
            text: "Skipping meals to improve glucose control",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Storing insulin at room temperature permanently",
            tags: ["nursing"],
            weight: 0,
          },
          {
            text: "Using expired insulin when supplies are low",
            tags: ["nursing"],
            weight: 0,
          },
        ],
      },
    ],
  },
  psychologist: {
    label: "Psychologist",
    questions: [
      {
        text: "Which therapeutic approach focuses on the relationship between thoughts, feelings, and behaviours?",
        topic: "therapy-approaches",
        options: [
          {
            text: "Cognitive behavioural therapy",
            tags: ["psychology", "therapy"],
            weight: 3,
          },
          { text: "Exposure therapy", tags: ["psychology"], weight: 0 },
          { text: "Family systems therapy", tags: ["psychology"], weight: 0 },
          { text: "Psychodynamic therapy", tags: ["psychology"], weight: 0 },
        ],
      },
      {
        text: "Which tool helps assess a client's baseline mental health functioning?",
        topic: "assessment",
        options: [
          {
            text: "Structured clinical interview",
            tags: ["psychology", "assessment"],
            weight: 3,
          },
          {
            text: "Open-ended journaling",
            tags: ["psychology"],
            weight: 0,
          },
          {
            text: "Observational guess",
            tags: ["psychology"],
            weight: 0,
          },
          {
            text: "Peer report only",
            tags: ["psychology"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which principle is central to maintaining therapeutic boundaries?",
        topic: "ethics",
        options: [
          {
            text: "Avoid dual relationships that may impair neutrality",
            tags: ["psychology", "ethics"],
            weight: 3,
          },
          {
            text: "Share personal struggles frequently",
            tags: ["psychology"],
            weight: 0,
          },
          {
            text: "Engage clients socially outside sessions",
            tags: ["psychology"],
            weight: 0,
          },
          {
            text: "Disclose other client cases for context",
            tags: ["psychology"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which technique helps clients reframe cognitive distortions?",
        topic: "intervention",
        options: [
          {
            text: "Guided discovery and thought challenging",
            tags: ["psychology", "therapy"],
            weight: 3,
          },
          {
            text: "Immediate exposure hierarchies",
            tags: ["psychology"],
            weight: 0,
          },
          { text: "Free association", tags: ["psychology"], weight: 0 },
          { text: "Dream analysis", tags: ["psychology"], weight: 0 },
        ],
      },
      {
        text: "Which factor best supports an effective treatment plan?",
        topic: "treatment-planning",
        options: [
          {
            text: "Collaborative goal setting with measurable outcomes",
            tags: ["psychology", "treatment-planning"],
            weight: 3,
          },
          {
            text: "Therapist-defined goals regardless of client input",
            tags: ["psychology"],
            weight: 0,
          },
          {
            text: "Focusing solely on diagnosis",
            tags: ["psychology"],
            weight: 0,
          },
          {
            text: "Avoiding plan adjustments once started",
            tags: ["psychology"],
            weight: 0,
          },
        ],
      },
    ],
  },
  "civil-engineer": {
    label: "Civil Engineer",
    questions: [
      {
        text: "Which soil test assesses load-bearing capacity for foundations?",
        topic: "geotechnical",
        options: [
          {
            text: "Standard penetration test",
            tags: ["civil-engineering", "geotechnical"],
            weight: 3,
          },
          {
            text: "Shear wave velocity",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Hydrometer analysis",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Nuclear density test",
            tags: ["civil-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which principle ensures equilibrium in structural analysis?",
        topic: "structural-analysis",
        options: [
          {
            text: "Sum of forces and moments equals zero",
            tags: ["civil-engineering", "structural-analysis"],
            weight: 3,
          },
          {
            text: "Stress equals strain",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Area equals inertia",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Load equals stiffness",
            tags: ["civil-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which construction document provides detailed material specifications?",
        topic: "construction-management",
        options: [
          {
            text: "Project specifications",
            tags: ["civil-engineering", "construction-management"],
            weight: 3,
          },
          {
            text: "Bill of quantities",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Change order form",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Punch list",
            tags: ["civil-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which factor is critical when designing stormwater management systems?",
        topic: "water-resources",
        options: [
          {
            text: "Runoff peak flow and detention capacity",
            tags: ["civil-engineering", "water-resources"],
            weight: 3,
          },
          { text: "Roadway striping", tags: ["civil-engineering"], weight: 0 },
          {
            text: "Building insulation",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Bridge aesthetics",
            tags: ["civil-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which regulation governs safety standards on construction sites?",
        topic: "safety",
        options: [
          {
            text: "Occupational Safety and Health Administration (OSHA) standards",
            tags: ["civil-engineering", "safety"],
            weight: 3,
          },
          {
            text: "National Electrical Code",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "HVAC design manual",
            tags: ["civil-engineering"],
            weight: 0,
          },
          {
            text: "Landscaping guidelines",
            tags: ["civil-engineering"],
            weight: 0,
          },
        ],
      },
    ],
  },
  "mechanical-engineer": {
    label: "Mechanical Engineer",
    questions: [
      {
        text: "Which law describes the relationship between pressure, volume, and temperature for an ideal gas?",
        topic: "thermodynamics",
        options: [
          {
            text: "Ideal gas law",
            tags: ["mechanical-engineering", "thermodynamics"],
            weight: 3,
          },
          {
            text: "Bernoulli's principle",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          { text: "Hooke's law", tags: ["mechanical-engineering"], weight: 0 },
          { text: "Pascal's law", tags: ["mechanical-engineering"], weight: 0 },
        ],
      },
      {
        text: "Which process reduces friction between moving parts?",
        topic: "mechanics",
        options: [
          {
            text: "Lubrication",
            tags: ["mechanical-engineering", "mechanics"],
            weight: 3,
          },
          {
            text: "Annealing",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Tempering",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Galvanising",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which analysis helps determine natural frequencies of a mechanical system?",
        topic: "vibrations",
        options: [
          {
            text: "Modal analysis",
            tags: ["mechanical-engineering", "vibrations"],
            weight: 3,
          },
          {
            text: "Stress-strain analysis",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Fluid flow analysis",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Thermal conduction analysis",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which manufacturing technique is best for producing complex shapes with minimal material waste?",
        topic: "manufacturing",
        options: [
          {
            text: "Additive manufacturing",
            tags: ["mechanical-engineering", "manufacturing"],
            weight: 3,
          },
          {
            text: "Forging",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Casting",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Milling",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which diagram represents energy losses in a thermodynamic cycle?",
        topic: "energy-systems",
        options: [
          {
            text: "Sankey diagram",
            tags: ["mechanical-engineering", "energy-systems"],
            weight: 3,
          },
          {
            text: "P-h diagram",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          {
            text: "Mollier chart",
            tags: ["mechanical-engineering"],
            weight: 0,
          },
          { text: "T-s diagram", tags: ["mechanical-engineering"], weight: 0 },
        ],
      },
    ],
  },
  "financial-analyst": {
    label: "Financial Analyst",
    questions: [
      {
        text: "Which statement best describes discounted cash flow (DCF) analysis?",
        topic: "valuation",
        options: [
          {
            text: "Estimating value by discounting future cash flows to present",
            tags: ["finance", "valuation"],
            weight: 3,
          },
          {
            text: "Comparing company ratios to industry peers",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Summarising historical revenue",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Analysing qualitative brand strength",
            tags: ["finance"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which ratio measures a company's ability to meet short-term obligations?",
        topic: "liquidity",
        options: [
          {
            text: "Current ratio",
            tags: ["finance", "liquidity"],
            weight: 3,
          },
          {
            text: "Debt-to-equity ratio",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Return on equity",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Gross margin",
            tags: ["finance"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which model evaluates the risk-adjusted return of an investment portfolio?",
        topic: "portfolio-management",
        options: [
          {
            text: "Capital Asset Pricing Model (CAPM)",
            tags: ["finance", "portfolio-management"],
            weight: 3,
          },
          {
            text: "DuPont analysis",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Altman Z-score",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Economic value added",
            tags: ["finance"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which financial statement shows a company's profitability over a period?",
        topic: "financial-statements",
        options: [
          {
            text: "Income statement",
            tags: ["finance", "financial-reporting"],
            weight: 3,
          },
          {
            text: "Balance sheet",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Cash flow statement",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Statement of retained earnings",
            tags: ["finance"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which technique stress-tests financial forecasts?",
        topic: "forecasting",
        options: [
          {
            text: "Scenario analysis",
            tags: ["finance", "forecasting"],
            weight: 3,
          },
          {
            text: "Linear regression",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Sensitivity analysis only",
            tags: ["finance"],
            weight: 0,
          },
          {
            text: "Variance analysis",
            tags: ["finance"],
            weight: 0,
          },
        ],
      },
    ],
  },
  politician: {
    label: "Politician",
    questions: [
      {
        text: "Which document outlines a candidate's policy positions and campaign goals?",
        topic: "policy",
        options: [
          {
            text: "Campaign platform",
            tags: ["public-policy", "campaign"],
            weight: 3,
          },
          {
            text: "Voting record",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Committee assignment",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Budget amendment",
            tags: ["public-policy"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which branch of government primarily drafts legislation?",
        topic: "civics",
        options: [
          {
            text: "Legislative branch",
            tags: ["civics", "public-policy"],
            weight: 3,
          },
          {
            text: "Executive branch",
            tags: ["civics"],
            weight: 0,
          },
          {
            text: "Judicial branch",
            tags: ["civics"],
            weight: 0,
          },
          {
            text: "Press corps",
            tags: ["civics"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which tactic helps build consensus across parties?",
        topic: "negotiation",
        options: [
          {
            text: "Hosting bipartisan policy working groups",
            tags: ["public-policy", "negotiation"],
            weight: 3,
          },
          {
            text: "Avoiding communication with opponents",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Focusing solely on party talking points",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Limiting town halls",
            tags: ["public-policy"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which statement best summarises constituent services?",
        topic: "public-service",
        options: [
          {
            text: "Helping residents navigate government programs and resources",
            tags: ["public-policy", "public-service"],
            weight: 3,
          },
          {
            text: "Organising campaign fundraisers",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Visiting foreign dignitaries",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Writing editorials",
            tags: ["public-policy"],
            weight: 0,
          },
        ],
      },
      {
        text: "Which practice supports transparency and accountability?",
        topic: "governance",
        options: [
          {
            text: "Publishing regular reports on legislative activity",
            tags: ["public-policy", "governance"],
            weight: 3,
          },
          {
            text: "Restricting press briefings",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Holding closed-door meetings exclusively",
            tags: ["public-policy"],
            weight: 0,
          },
          {
            text: "Limiting constituent feedback",
            tags: ["public-policy"],
            weight: 0,
          },
        ],
      },
    ],
  },
};

function buildOptionId(prefix: string, index: number) {
  return `${prefix}-opt-${index}`;
}

function mapQuestion(
  scope: "career" | "general",
  fieldKey: string | null,
  questionIndex: number,
  question: RawQuestion
) {
  const optionPrefix = `${scope}-${fieldKey ?? "general"}-${questionIndex}`;
  return {
    text: question.text,
    type: question.type ?? "mcq",
    options: question.options.map((option, optionIndex) => ({
      id: buildOptionId(optionPrefix, optionIndex),
      text: option.text,
      tags: option.tags,
      weight: option.weight,
    })),
    scope,
    careerField: fieldKey,
    topic: question.topic,
  };
}

function buildCareerDocuments() {
  return Object.entries(careerQuestionSets).flatMap(([fieldKey, config]) =>
    config.questions.map((question, index) =>
      mapQuestion("career", fieldKey, index, question)
    )
  );
}

function buildGeneralDocuments(limit: number) {
  const allQuestions = Object.entries(careerQuestionSets).flatMap(
    ([fieldKey, config]) =>
      config.questions.map((question, index) => ({
        question,
        fieldKey,
        index,
        label: config.label,
      }))
  );

  return allQuestions
    .slice(0, limit)
    .map(({ question, fieldKey, index, label }) => ({
      ...mapQuestion("general", null, index, question),
      text: `[${label}] ${question.text}`,
    }));
}

async function seed() {
  await mongoose.connect(mongoUri);

  const careerDocuments = buildCareerDocuments();
  const generalDocuments = buildGeneralDocuments(50);

  const total = careerDocuments.length + generalDocuments.length;

  await QuestionModel.deleteMany({});
  await QuestionModel.insertMany([...careerDocuments, ...generalDocuments]);

  console.log(`Inserted ${careerDocuments.length} career-specific questions.`);
  console.log(`Inserted ${generalDocuments.length} general questions.`);
  console.log(`Total documents: ${total}`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Failed to seed questions", error);
  void mongoose.disconnect();
  process.exit(1);
});
