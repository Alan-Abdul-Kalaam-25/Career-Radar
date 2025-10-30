import { useEffect, useState } from "react";
import api from "../utils/api";
import type { Attempt } from "../utils/types";
import AttemptCard from "../components/AttemptCard";
import LoadingState from "../components/LoadingState";

export default function History() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/career/history")
      .then((res) => {
        setAttempts(res.data.attempts || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Fetching your history" />;

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
          Attempt history
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">
          Track how your insights have evolved
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Each attempt shows your top recommendation and timestamp. Compare runs
          to see how changes in your profile or questionnaire responses
          influence outcomes.
        </p>
      </header>

      {attempts.length === 0 ? (
        <p className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-12 text-center text-sm text-slate-200">
          You haven't generated any recommendations yet. Run your first
          assessment to build your history.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {attempts.map((attempt, index) => (
            <div key={attempt._id} className="relative">
              <div className="absolute -left-6 top-0 hidden h-full w-px bg-white/10 md:block" />
              <div className="absolute -left-7 top-6 hidden h-3 w-3 rounded-full bg-blue-400 md:block" />
              <AttemptCard attempt={attempt} />
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500 md:pl-6">
                Attempt {index + 1}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
