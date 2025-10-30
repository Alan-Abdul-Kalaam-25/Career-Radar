import { Link } from "react-router-dom";

const entryPoints = [
  {
    title: "Submit a career brief",
    description:
      "Document your wins, leadership style, and focus areas. We translate it into a rich signal map and archive it for later review.",
    to: "/career/intake",
    badge: "Deep context",
    accent: "from-emerald-500 via-teal-400 to-emerald-500",
  },
  {
    title: "Answer questions",
    description:
      "Choose a targeted field or a general exploration path—either way you will work through 50 curated prompts that sharpen the radar.",
    to: "/career/qa",
    badge: "Deep dive",
    accent: "from-purple-500 via-indigo-400 to-purple-500",
  },
];

export default function CareerFinder() {
  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
          Career finder
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">
          Choose how you want to explore next
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Mix deep storytelling with skill-focused challenges. Submit a brief
          when you want a nuanced narrative, or jump into the knowledge checks
          when you want to stress test specific careers.
        </p>
      </header>

      <section
        className={`grid gap-6 ${
          entryPoints.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
        }`}
      >
        {entryPoints.map((point) => (
          <Link
            key={point.to}
            to={point.to}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-blue-500/20"
          >
            <div
              className={`absolute -top-24 right-0 h-48 w-48 rounded-full bg-linear-to-br ${point.accent} opacity-40 blur-3xl transition group-hover:opacity-70`}
            />
            <span className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-blue-200">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              {point.badge}
            </span>
            <div className="relative mt-5 space-y-3 text-slate-200">
              <h2 className="text-3xl font-semibold text-white">
                {point.title}
              </h2>
              <p className="text-sm leading-relaxed">{point.description}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition group-hover:text-white">
                Start now -&gt;
              </span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
