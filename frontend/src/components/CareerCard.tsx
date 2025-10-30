import type { CareerResult } from "../utils/types";

export default function CareerCard({
  item,
  maxScore,
}: {
  item: CareerResult;
  maxScore: number;
}) {
  const relativeScore = maxScore
    ? Math.round((item.score / maxScore) * 100)
    : 0;

  return (
    <article className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40 transition hover:border-white/20 hover:shadow-blue-500/20">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-2xl font-semibold text-white">
            {item.careerName}
          </h3>
          <span className="rounded-full border border-blue-300/40 bg-blue-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-100">
            Score {item.score}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {item.explanation}
        </p>
        {item.highlights?.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-blue-200">
              Strength signals
            </p>
            <ul className="space-y-2 text-sm text-slate-200">
              {item.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-300" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {item.nextSteps?.length > 0 && (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-purple-200">
              Suggested next steps
            </p>
            <ul className="space-y-2 text-sm text-slate-200">
              {item.nextSteps.map((step) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-purple-300" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
          <span>Match strength</span>
          <span>{relativeScore}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500"
            style={{ width: `${Math.max(relativeScore, 6)}%` }}
          />
        </div>
      </div>
    </article>
  );
}
