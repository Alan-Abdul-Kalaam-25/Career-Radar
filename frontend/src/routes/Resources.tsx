const resourceCollections = [
  {
    title: "Career Building Essentials",
    summary:
      "Structured guides to help you refine your resume, stand out in interviews, and articulate your strengths with clarity.",
    items: [
      {
        name: "Resume Blueprint",
        type: "Guide",
        description:
          "Frame your experience with impact statements and quantify outcomes recruiters care about.",
        url: "https://www.coursera.org/articles/how-to-write-a-resume",
      },
      {
        name: "Interview Masterclass",
        type: "Workshop",
        description:
          "Prepare stories using the STAR framework and anticipate behavioral questions confidently.",
        url: "https://www.interviewkickstart.com/interview-preparation",
      },
      {
        name: "Personal Pitch Canvas",
        type: "Template",
        description:
          "Craft a compelling elevator pitch that communicates your value in under 60 seconds.",
        url: "https://www.notion.so/templates/personal-pitch-template",
      },
    ],
  },
  {
    title: "Upskilling Playlists",
    summary:
      "Invest in curated learning paths that align with high-growth industries and in-demand competencies.",
    items: [
      {
        name: "Product & UX Strategy",
        type: "Learning Path",
        description:
          "Level up your ability to experiment, test ideas, and build user-centric solutions.",
        url: "https://www.udemy.com/course/ux-strategy-fundamentals/",
      },
      {
        name: "Data Fluency Sprint",
        type: "Learning Path",
        description:
          "Blend SQL, dashboards, and storytelling to translate data signals into decisions.",
        url: "https://maven.com/school-of-data/data-storytelling",
      },
      {
        name: "AI Skills Accelerator",
        type: "Learning Path",
        description:
          "Understand applied AI workflows so you can plug automation into day-to-day projects.",
        url: "https://learn.microsoft.com/en-us/training/paths/beginner-machine-learning/",
      },
    ],
  },
  {
    title: "Momentum Boosters",
    summary:
      "Quick actions you can deploy this week to move closer to the roles you care about.",
    items: [
      {
        name: "Career Coffee Scripts",
        type: "Download",
        description:
          "Reach out to alumni or mentors with confidence-building outreach scripts.",
        url: "https://www.indeed.com/career-advice/career-development/informational-interview-questions",
      },
      {
        name: "Portfolio Audit Checklist",
        type: "Checklist",
        description:
          "Run a 20-minute audit to tighten storytelling, visuals, and calls-to-action across your portfolio.",
        url: "https://www.nngroup.com/articles/ux-portfolio-checklist/",
      },
      {
        name: "Goal Setting Canvas",
        type: "Notion Template",
        description:
          "Break ambitions into 30-60-90 day experiments with measurable checkpoints.",
        url: "https://www.notion.so/templates/goal-tracker",
      },
    ],
  },
];

export default function Resources() {
  return (
    <div className="space-y-12">
      <header className="rounded-3xl border border-white/10 bg-linear-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 px-8 py-10 shadow-2xl shadow-blue-500/10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-200/80">
          Resource Hub
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white md:text-5xl">
          Keep your momentum with curated learning fuel
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-200">
          Explore handpicked playbooks, templates, and workshops that pair with
          your Career Radar insights. Build the skills recruiters are scanning
          for and convert your strengths into job-ready proof.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        {resourceCollections.map((collection) => (
          <article
            key={collection.title}
            className="group flex flex-col rounded-3xl border border-white/5 bg-slate-900/60 p-8 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:border-blue-400/60 hover:shadow-blue-500/20"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-2xl font-semibold text-white">
                {collection.title}
              </h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-widest text-blue-200">
                {collection.items.length} picks
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{collection.summary}</p>
            <div className="mt-6 space-y-4">
              {collection.items.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-2xl border border-white/5 bg-slate-900/80 p-5 transition hover:border-blue-500/60 hover:bg-slate-900/90"
                >
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                      <span className="h-2 w-2 rounded-full bg-blue-400" />
                      {item.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      Opens in new tab
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-blue-500/30 bg-blue-500/10 p-8 text-center text-slate-100">
        <h2 className="text-3xl font-semibold">Want tailored sprints?</h2>
        <p className="mt-3 text-sm text-slate-200">
          Combine these resources with your latest Career Radar results. Pick a
          focus area, set a measurable milestone, and schedule a reminder to
          review your progress every Friday.
        </p>
        <p className="mt-5 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
          Shipping your future, one experiment at a time
        </p>
      </section>
    </div>
  );
}
