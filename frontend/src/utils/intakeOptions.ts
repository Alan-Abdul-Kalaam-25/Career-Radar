export type IntakeOption = {
  value: string;
  label: string;
  description?: string;
};

export const targetRoleOptions: IntakeOption[] = [
  {
    value: "frontend-architect",
    label: "Frontend architect for platform-scale interfaces",
    description:
      "Focus on design systems, high-traffic UI surfaces, and composable architectures.",
  },
  {
    value: "frontend-product",
    label: "Product-focused front-end lead",
    description:
      "Own user journeys, experimentation, and cross-functional discovery.",
  },
  {
    value: "frontend-performance",
    label: "Performance and accessibility specialist",
    description:
      "Elevate reliability, accessibility audits, and Core Web Vitals.",
  },
  {
    value: "backend-platform",
    label: "Backend platform architect",
    description:
      "Shape service boundaries, domain modeling, and platform guardrails.",
  },
  {
    value: "backend-data",
    label: "Data-rich backend systems owner",
    description:
      "Design data-intensive services, warehousing flows, and data contracts.",
  },
  {
    value: "backend-security",
    label: "Security-first backend engineer",
    description:
      "Lead hardening, policy automation, and threat modeling rituals.",
  },
  {
    value: "fullstack-builder",
    label: "Full-stack builder shipping end-to-end outcomes",
    description:
      "Deliver complete product slices from front-end polish to service reliability.",
  },
  {
    value: "fullstack-lead",
    label: "Full-stack technical lead",
    description:
      "Mentor teams, align product vision, and balance tech debt investment.",
  },
  {
    value: "ml-platform",
    label: "ML platform and MLOps engineer",
    description:
      "Operationalize model delivery, feature stores, and observability.",
  },
  {
    value: "data-science-product",
    label: "Product data scientist",
    description:
      "Shape experimentation, causal inference, and insight storytelling.",
  },
  {
    value: "product-strategist",
    label: "Product strategy leader",
    description:
      "Drive roadmap narratives, prioritization, and stakeholder orchestration.",
  },
  {
    value: "ux-lead",
    label: "UX and design systems lead",
    description:
      "Guide research, interaction patterns, and inclusive design governance.",
  },
  {
    value: "devops-sre",
    label: "DevOps and SRE accelerator",
    description: "Uplevel automation, observability, and delivery maturity.",
  },
  {
    value: "cloud-architect",
    label: "Cloud architect",
    description:
      "Optimize cloud topology, cost, and platform security posture.",
  },
  {
    value: "security-response",
    label: "Security response lead",
    description:
      "Coordinate incident response, forensics, and resilience programs.",
  },
  {
    value: "data-engineer-platform",
    label: "Data platform engineer",
    description: "Design batch/stream pipelines, contracts, and governance.",
  },
  {
    value: "tpm-platform",
    label: "Technical program manager",
    description:
      "Steer cross-org delivery, risk surfacing, and outcome alignment.",
  },
];

export const technicalSkillOptions: IntakeOption[] = [
  { value: "react", label: "React and component-driven architecture" },
  { value: "nextjs", label: "Next.js / server components / streaming" },
  { value: "typescript", label: "TypeScript systems and contracts" },
  { value: "tailwind", label: "Design token + Tailwind systems" },
  {
    value: "testinglibrary",
    label: "Testing Library / React testing strategy",
  },
  { value: "jest", label: "Jest unit + contract testing" },
  { value: "cypress", label: "Cypress / Playwright end-to-end suites" },
  { value: "redux", label: "State orchestration (Redux, Zustand, XState)" },
  { value: "graphql", label: "GraphQL / federation / API design" },
  { value: "node", label: "Node.js services and tooling" },
  { value: "express", label: "Express / REST service ecosystems" },
  { value: "nestjs", label: "NestJS or similar structured frameworks" },
  { value: "python", label: "Python data/ML engineering" },
  { value: "pandas", label: "Analytical Python stack (Pandas, NumPy)" },
  { value: "pyspark", label: "PySpark or distributed data processing" },
  { value: "airflow", label: "Airflow / orchestration pipelines" },
  { value: "kubernetes", label: "Kubernetes and container orchestration" },
  { value: "terraform", label: "Infrastructure as code (Terraform, Pulumi)" },
  { value: "docker", label: "Container runtime and supply chain" },
  { value: "aws", label: "AWS architecture" },
  { value: "azure", label: "Azure cloud patterns" },
  { value: "gcp", label: "Google Cloud architecture" },
  { value: "huggingface", label: "LLM / HuggingFace ecosystem" },
  { value: "promptengineering", label: "Prompt engineering and LLM ops" },
  { value: "spark", label: "Spark structured streaming / batch" },
  { value: "golang", label: "Go systems programming" },
  { value: "rust", label: "Rust for performance-critical services" },
];

export const coreToolOptions: IntakeOption[] = [
  { value: "figma", label: "Figma / design collaboration" },
  { value: "miro", label: "Miro / facilitation canvases" },
  { value: "storybook", label: "Storybook / component documentation" },
  { value: "postman", label: "Postman / API contract validation" },
  { value: "grafana", label: "Grafana dashboards" },
  { value: "datadog", label: "Datadog monitoring" },
  { value: "splunk", label: "Splunk observability" },
  { value: "sentry", label: "Sentry client monitoring" },
  { value: "jira", label: "Jira delivery governance" },
  { value: "notion", label: "Notion / knowledge sharing" },
  { value: "confluence", label: "Confluence / documentation" },
  { value: "githubactions", label: "GitHub Actions automation" },
  { value: "circleci", label: "CircleCI pipelines" },
  { value: "argo", label: "ArgoCD / GitOps" },
  { value: "dbt", label: "dbt analytics engineering" },
  { value: "tableau", label: "Tableau storytelling" },
  { value: "looker", label: "Looker semantic layers" },
  { value: "powerbi", label: "Power BI reporting" },
];

export const softSkillOptions: IntakeOption[] = [
  { value: "facilitation", label: "Facilitation and workshop design" },
  { value: "storytelling", label: "Narrative storytelling and influence" },
  { value: "mentoring", label: "Mentoring and sponsorship" },
  { value: "coaching", label: "Coaching and feedback craft" },
  { value: "negotiation", label: "Negotiation and tradeoff framing" },
  { value: "systemsThinking", label: "Systems thinking" },
  { value: "analyticalFraming", label: "Analytical framing and synthesis" },
  { value: "experimentation", label: "Experimentation leadership" },
  { value: "conflictNavigation", label: "Conflict navigation" },
  { value: "inclusiveLeadership", label: "Inclusive leadership rituals" },
];

export const workStyleOptions: IntakeOption[] = [
  { value: "asyncRemote", label: "Async-first remote collaboration" },
  { value: "hybrid", label: "Hybrid collaboration cadences" },
  { value: "colocated", label: "Co-located coaching and pairing" },
  { value: "rapidIteration", label: "Rapid iteration / continuous discovery" },
  { value: "regulated", label: "Regulated industries + compliance" },
  { value: "missionCritical", label: "Mission-critical / high resilience" },
  {
    value: "platformEnablement",
    label: "Platform enablement / internal products",
  },
];

export const learningGoalOptions: IntakeOption[] = [
  {
    value: "advancedArchitecture",
    label: "Advanced architecture and systems design",
  },
  { value: "llmApplied", label: "Applied AI / LLM strategy" },
  { value: "systemDesign", label: "System design mastery" },
  { value: "leadership", label: "Leadership and org design" },
  { value: "experimentationScience", label: "Experimentation science" },
  { value: "accessibility", label: "Accessibility depth" },
  { value: "observability", label: "Observability and diagnostics" },
  { value: "platformSecurity", label: "Platform security and governance" },
];

export const industryOptions: IntakeOption[] = [
  { value: "fintech", label: "Fintech and payments" },
  { value: "healthcare", label: "Healthcare / life sciences" },
  { value: "ecommerce", label: "E-commerce / retail" },
  { value: "media", label: "Media / content platforms" },
  { value: "saas", label: "B2B SaaS" },
  { value: "platform", label: "Platform / ecosystem products" },
  { value: "govtech", label: "GovTech / civic services" },
  { value: "climate", label: "Climate and sustainability" },
];

export const experienceOptions: { value: string; label: string }[] = [
  { value: "2", label: "0-2 years (emerging practitioner)" },
  { value: "4", label: "3-5 years (mid-level)" },
  { value: "7", label: "6-9 years (senior)" },
  { value: "12", label: "10+ years (principal / staff)" },
];
