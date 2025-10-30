import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import type { Attempt, CareerResult } from "../utils/types";
import CareerCard from "../components/CareerCard";
import LoadingState from "../components/LoadingState";

export default function Results() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const [results, setResults] = useState<CareerResult[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("No attempt id provided.");
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get(`/api/career/attempt/${id}`)
      .then((res) => {
        const attemptData = res.data.attempt;
        setAttempt(attemptData ?? null);
        setResults(attemptData?.careerResults || []);
      })
      .catch((err) => {
        console.error("Failed to load attempt", err);
        setError("We couldn't load this attempt. Try again from history.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const maxScore = useMemo(() => {
    return results.reduce((max, item) => Math.max(max, item.score), 0);
  }, [results]);

  const topCareer = results[0];
  const methodLookup: Record<Attempt["method"], string> = {
    "user-details": "Profile snapshot",
    "detailed-intake": "Career brief",
    "qa-general": "Questionnaire - general",
    "qa-career": "Questionnaire - targeted",
  };

  if (loading) return <LoadingState label="Preparing your results" />;

  if (error) {
    return (
      <div className="rounded-3xl border border-rose-400/40 bg-rose-400/20 px-6 py-10 text-center text-sm text-rose-100">
        {error} <br />
        <Link
          to="/history"
          className="mt-4 inline-block text-blue-100 hover:text-white"
        >
          Go to history
        </Link>
      </div>
    );
  }

  if (!attempt || results.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-10 text-center text-sm text-slate-200">
        No results found. Run a new assessment from the dashboard.
      </div>
    );
  }

  const methodBadge = methodLookup[attempt.method] ?? "Assessment";

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
          Recommendation summary
        </p>
        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl">
              {topCareer?.careerName ?? "Fresh insights"}
            </h1>
            <p className="max-w-2xl text-sm text-slate-200">
              {topCareer?.explanation ??
                "Review how your responses shaped these insights and decide your next move."}
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {methodBadge}
              </span>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                {new Date(attempt.createdAt).toLocaleString()}
              </span>
              <Link
                to="/history"
                className="rounded-full border border-blue-200/40 bg-blue-200/20 px-4 py-2 text-blue-100 transition hover:border-blue-300/60 hover:text-white"
              >
                View history
              </Link>
            </div>
          </div>
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900/70 p-6 text-sm text-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Next experiment
            </p>
            <p className="mt-3 font-semibold text-white">
              Start a fresh skill check or capture a new brief to compare how
              your strengths land.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                to="/career/qa"
                className="rounded-full border border-purple-300/40 bg-purple-300/20 px-4 py-2 text-xs font-semibold text-purple-100 transition hover:border-purple-200/60 hover:text-white"
              >
                Run questionnaire
              </Link>
              <Link
                to="/career/intake"
                className="rounded-full border border-blue-300/40 bg-blue-300/20 px-4 py-2 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60 hover:text-white"
              >
                Submit career brief
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {results.map((result) => (
          <CareerCard
            key={result.careerName}
            item={result}
            maxScore={maxScore}
          />
        ))}
      </section>
    </div>
  );
}
