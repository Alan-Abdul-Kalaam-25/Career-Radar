import { Link } from "react-router-dom";
import type { Attempt } from "../utils/types";

export default function AttemptCard({ attempt }: { attempt: Attempt }) {
  const top = attempt.careerResults[0];
  const methodLabel: Record<Attempt["method"], string> = {
    "user-details": "Profile snapshot (legacy)",
    "detailed-intake": "Career brief",
    "qa-general": "Questionnaire - general",
    "qa-career": "Questionnaire - targeted",
  };

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40 transition hover:border-white/20 hover:shadow-blue-500/20">
      <div className="space-y-3 text-sm text-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {methodLabel[attempt.method] ?? "Assessment"}
          </span>
          <time>{new Date(attempt.createdAt).toLocaleString()}</time>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            Top recommendation
          </p>
          <p className="mt-2 text-lg font-semibold text-white">
            {top?.careerName ?? "No recommendation captured"}
          </p>
          <p className="mt-2 text-sm text-slate-300">
            {top?.explanation ?? "Run another attempt to generate insights."}
          </p>
        </div>
      </div>
      <Link
        to={`/results?id=${attempt._id}`}
        className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 transition hover:text-white"
      >
        View details -&gt;
      </Link>
    </article>
  );
}
