export interface CareerDetail {
  summary: string;
  highlights: string[];
  nextSteps: string[];
}

export const careerDetails: Record<string, CareerDetail> = {
  "Frontend Developer": {
    summary:
      "You excel at translating complex requirements into resilient, high-performing interfaces that delight users and stakeholders alike.",
    highlights: [
      "Strong command of modern UI frameworks and component architecture patterns",
      "Demonstrated ability to optimize rendering, bundle delivery, and accessibility at scale",
      "Comfortable partnering with design, product, and platform teams to ship polished experiences",
    ],
    nextSteps: [
      "Deepen expertise in performance profiling, streaming SSR, and design systems governance",
      "Lead cross-team initiatives around accessibility audits or progressive enhancement strategies",
      "Mentor junior engineers on state management, testing, and maintainable front-end patterns",
    ],
  },
  "Backend Developer": {
    summary:
      "You thrive on architecting reliable services, resilient data flows, and APIs that power mission-critical user journeys.",
    highlights: [
      "Hands-on experience with service decomposition, observability, and scaling patterns",
      "Comfortable designing data models, query strategies, and resiliency guardrails",
      "Champions engineering rigor with robust testing, CI/CD automation, and clear documentation",
    ],
    nextSteps: [
      "Drive performance tuning or reliability programs for a high-throughput service",
      "Explore advanced topics such as event-driven choreography or distributed consensus",
      "Shape technical direction for platform capabilities like authentication, billing, or analytics",
    ],
  },
  "Full Stack Developer": {
    summary:
      "You bridge product, front-end polish, and backend reliability—delivering features end-to-end with empathy for every layer.",
    highlights: [
      "Comfortable context-switching between UI delivery, API design, and data modeling",
      "Balances user-centric thinking with strong engineering instincts and tradeoff awareness",
      "Regularly ships measurable improvements driven by telemetry, experimentation, and feedback loops",
    ],
    nextSteps: [
      "Champion vertical slices that align UX ambition with scalable service boundaries",
      "Invest in platform accelerators such as component libraries or deployment pipelines",
      "Coach teammates on sustainable delivery practices from discovery to release",
    ],
  },
  "Data Scientist": {
    summary:
      "You draw actionable insight from messy data, framing experiments and models that influence strategic product decisions.",
    highlights: [
      "Confident with statistical rigor, causal inference, and storytelling through data",
      "Experienced building predictive models, evaluation frameworks, and stakeholder-ready dashboards",
      "Partners seamlessly with engineering and product squads to embed insight into user experiences",
    ],
    nextSteps: [
      "Harden ML deployment workflows and model observability to production-grade standards",
      "Lead experimentation strategy for a product area, aligning metrics with business outcomes",
      "Explore applied ML specializations such as recommendation systems or forecasting",
    ],
  },
  "Machine Learning Engineer": {
    summary:
      "You operationalize intelligent systems—connecting research breakthroughs with robust production pipelines.",
    highlights: [
      "Experienced designing feature stores, training workflows, and evaluation infrastructure",
      "Balances experimentation velocity with governance over model fairness, drift, and security",
      "Collaborates across data, product, and platform teams to drive ML-backed experiences",
    ],
    nextSteps: [
      "Invest in scalable serving architectures for low-latency inference and monitoring",
      "Push experimentation with generative AI, large-language-model tooling, or retrieval augmentation",
      "Formalize internal playbooks for responsible AI adoption and incident response",
    ],
  },
  "Product Manager": {
    summary:
      "You orchestrate discovery, prioritization, and delivery—ensuring teams ship product value with clear narrative.",
    highlights: [
      "Skillful at synthesizing qualitative insight, quantitative signals, and strategic goals",
      "Creates clarity through roadmaps, alignment rituals, and transparent prioritization",
      "Builds trusted partnerships with engineering, design, go-to-market, and leadership teams",
    ],
    nextSteps: [
      "Pilot outcome-driven OKRs and experimentation frameworks for your product pillar",
      "Elevate stakeholder influence with sharper storytelling and executive-ready artifacts",
      "Mentor associate PMs on discovery cadences, user research, and decision hygiene",
    ],
  },
  "UI/UX Designer": {
    summary:
      "You craft inclusive, systemized experiences—merging research, interaction design, and visual finesse.",
    highlights: [
      "Lead discovery with mixed-method research and crisp synthesis of user sentiment",
      "Deliver holistic design systems, prototypes, and usability benchmarks that scale",
      "Elevate cross-functional collaboration through clear storytelling and design critiques",
    ],
    nextSteps: [
      "Run multi-round usability studies or diary research to inform roadmap tradeoffs",
      "Advance motion design, accessibility audits, or design tokens strategy",
      "Mentor designers on interaction patterns, heuristics, and collaborative workflows",
    ],
  },
  "DevOps Engineer": {
    summary:
      "You bring reliability, velocity, and observability to engineering teams by evolving automation and delivery ecosystems.",
    highlights: [
      "Well-versed in infrastructure-as-code, CI/CD orchestration, and progressive delivery",
      "Drives incident response maturity with proactive monitoring, runbooks, and postmortems",
      "Advocates for developer experience improvements and sustainable platform operations",
    ],
    nextSteps: [
      "Implement automated resilience testing, chaos experiments, or SLO governance",
      "Scale platform self-service through golden paths, templates, and paved roads",
      "Explore platform security practices including supply chain hardening and zero trust",
    ],
  },
  "Cloud Engineer": {
    summary:
      "You architect composable cloud platforms with an eye for cost efficiency, security, and operational excellence.",
    highlights: [
      "Confident designing multi-region architectures, networking strategies, and IAM guardrails",
      "Drives cost transparency, capacity planning, and performance optimization",
      "Partners with security and compliance stakeholders to maintain resilient infrastructure",
    ],
    nextSteps: [
      "Lead cloud migration or modernization programs across a critical application suite",
      "Advance serverless patterns, edge strategies, or hybrid connectivity solutions",
      "Develop internal reference architectures and workshops for engineering teams",
    ],
  },
  "Cybersecurity Analyst": {
    summary:
      "You safeguard systems through proactive detection, threat modeling, and human-centered security guidance.",
    highlights: [
      "Experienced with SOC tooling, vulnerability triage, and incident coordination",
      "Translates technical risk into business impact to influence senior decision-makers",
      "Establishes security education programs and resilient response playbooks",
    ],
    nextSteps: [
      "Pursue specialization in cloud security, red teaming, or governance risk and compliance",
      "Strengthen threat intelligence sharing and automation pipelines across the org",
      "Lead tabletop exercises and cross-functional readiness drills",
    ],
  },
  "Data Engineer": {
    summary:
      "You design and sustain trustworthy data platforms that empower analysts, scientists, and downstream applications.",
    highlights: [
      "Experienced building batch and streaming pipelines with clear lineage and quality gates",
      "Balances schema governance with flexible exploration sandboxes for diverse teams",
      "Automates data contracts, observability, and cost monitoring across ingestion layers",
    ],
    nextSteps: [
      "Roll out data mesh or domain ownership models with self-serve tooling",
      "Optimize lakehouse architectures, query engines, and workload orchestration",
      "Mentor peers on data reliability, reproducibility, and catalog hygiene",
    ],
  },
  "Technical Program Manager": {
    summary:
      "You turn bold strategies into well-executed programs, aligning multi-team delivery with measurable outcomes.",
    highlights: [
      "Expert at dependency management, risk mitigation, and stakeholder cadence design",
      "Balances technical nuance with crisp communication to keep leadership informed",
      "Builds delivery frameworks that scale across portfolios and cross-functional groups",
    ],
    nextSteps: [
      "Pilot objective-based planning rituals that improve predictability and quality",
      "Coach teams on execution health metrics, retrospectives, and continuous improvement",
      "Drive org-wide initiatives such as platform migrations or compliance readiness",
    ],
  },
};

export function getCareerDetail(name: string): CareerDetail {
  return (
    careerDetails[name] || {
      summary:
        "This career path aligns strongly with your current strengths and focus areas. Lean into the highlighted capabilities to differentiate yourself further.",
      highlights: [
        "Sustain momentum by documenting recent wins and measurable outcomes",
        "Seek mentorship or communities that keep your skills sharp and relevant",
        "Track market trends to anticipate the next wave of opportunities in this domain",
      ],
      nextSteps: [
        "Identify a flagship project or certification to elevate your credibility",
        "Schedule regular reflection to adjust your roadmap as goals evolve",
        "Share your progress with your network to unlock collaboration and visibility",
      ],
    }
  );
}
