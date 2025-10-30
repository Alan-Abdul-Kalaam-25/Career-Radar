import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMe } from "../utils/auth";
import api from "../utils/api";
import type { Attempt, Profile, User } from "../utils/types";
import LoadingState from "../components/LoadingState";

const quickActions = [
  {
    title: "Run the questionnaire",
    description: "Answer adaptive prompts to surface fresh career ideas.",
    to: "/career/qa",
    accent: "bg-blue-500/30 text-blue-200",
  },
  {
    title: "Submit a career brief",
    description:
      "Capture your story, highlights, and focus areas for a rich recommendation.",
    to: "/career/intake",
    accent: "bg-purple-500/30 text-purple-200",
  },
  {
    title: "Update profile",
    description: "Tweak education or location to sharpen your radar.",
    to: "/profile",
    accent: "bg-cyan-500/30 text-cyan-200",
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [me, history] = await Promise.all([
          getMe(),
          api.get("/api/career/history").then((res) => res.data.attempts || []),
        ]);
        if (!active) return;
        setUser(me);
        setAttempts(history);
      } catch (err) {
        if (!active) return;
        console.error("Failed to hydrate dashboard", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const profileCompletion = useMemo(() => {
    const profile: Profile | undefined = user?.profile;
    if (!profile) return 0;
    const fields: (keyof Profile)[] = [
      "educationLevel",
      "currentRole",
      "yearsExperience",
      "coreSkills",
      "careerGoals",
      "preferredIndustries",
      "preferredWorkFormats",
    ];
    const filled = fields.filter((field) => {
      const value = profile?.[field];
      if (Array.isArray(value)) return value.length > 0;
      return value !== undefined && value !== null && value !== "";
    }).length;
    return Math.round((filled / fields.length) * 100);
  }, [user]);

  const latestAttempt = attempts[0];
  const methodLabels: Record<Attempt["method"], string> = {
    "user-details": "Profile snapshot (legacy)",
    "detailed-intake": "Career brief",
    "qa-general": "Questionnaire - general",
    "qa-career": "Questionnaire - targeted",
  };

  if (loading) {
    return <LoadingState label="Booting up your dashboard" />;
  }

  return (
    <div className="space-y-12">
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <div className="absolute -top-24 right-16 h-48 w-48 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="relative space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-blue-200/80">
            Dashboard overview
          </p>
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Welcome back, {user ? `${user.firstName}` : "Career Explorer"}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-200">
            Stay on top of your progress, unlock new recommendations, and move
            your career experiments forward. Everything you need lives here.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
            <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
              Profile completion {profileCompletion}%
            </span>
            {latestAttempt && (
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
                Last insight |{" "}
                {new Date(latestAttempt.createdAt).toLocaleDateString()}
              </span>
            )}
            <Link
              to="/resources"
              className="rounded-full border border-blue-200/40 bg-blue-200/20 px-4 py-2 text-blue-100 transition hover:border-blue-300/60 hover:text-white"
            >
              Explore resource hub
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Profile momentum
          </p>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold text-white">
                {profileCompletion}%
              </p>
              <p className="text-xs text-slate-400">
                Complete the essentials to improve recommendation accuracy.
              </p>
            </div>
            <Link
              to="/profile"
              className="rounded-full border border-blue-400/40 px-4 py-2 text-xs font-semibold text-blue-200 transition hover:border-blue-300 hover:text-white"
            >
              Edit profile
            </Link>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500"
              style={{ width: `${Math.max(profileCompletion, 6)}%` }}
            />
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Recent insight
          </p>
          {latestAttempt ? (
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  {methodLabels[latestAttempt.method] ?? "Assessment"}
                </span>
                <span className="text-xs text-slate-400">
                  {new Date(latestAttempt.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-lg font-semibold text-white">
                {latestAttempt.careerResults[0]?.careerName ?? "Explore more"}
              </p>
              <p>
                {latestAttempt.careerResults[0]?.explanation ??
                  "Run a new assessment to unlock personalised guidance."}
              </p>
              <Link
                to={`/results?id=${latestAttempt._id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition hover:text-white"
              >
                View full report -&gt;
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <p className="text-lg font-semibold text-white">
                You&rsquo;re ready for your first recommendation
              </p>
              <p>
                Submit a career brief or run the questionnaire to see where your
                strengths lead next.
              </p>
              <Link
                to="/career"
                className="inline-flex items-center gap-2 rounded-full border border-blue-300/40 bg-blue-300/20 px-4 py-2 text-xs font-semibold text-blue-100 transition hover:border-blue-200/60 hover:text-white"
              >
                Start exploring
              </Link>
            </div>
          )}
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Next best action
          </p>
          <div className="mt-5 space-y-4 text-sm text-slate-200">
            <p>
              Alternate between the deep-dive questionnaire and a refreshed
              career brief to explore a wider opportunity map.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/career/qa"
                className="rounded-full border border-purple-300/40 bg-purple-300/20 px-4 py-2 text-xs font-semibold text-purple-100 transition hover:border-purple-200/60 hover:text-white"
              >
                Run questionnaire
                <Link
                  to="/history"
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  Review attempts
                </Link>
              </Link>
            </div>
          </div>
        </article>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Quick launch
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Choose your next step
            </h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40 transition hover:-translate-y-1 hover:border-white/20 hover:shadow-blue-500/20"
            >
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] ${action.accent}`}
              >
                {action.title}
              </span>
              <p className="mt-4 text-sm text-slate-200">
                {action.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-200 transition group-hover:text-white">
                Continue -&gt;
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Recent activity
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Snapshot of your latest attempts
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Track how your career insights are evolving over time.
            </p>
          </div>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            View full history
          </Link>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {attempts.slice(0, 3).map((attempt) => (
            <article
              key={attempt._id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{methodLabels[attempt.method] ?? "Assessment"}</span>
                <time>{new Date(attempt.createdAt).toLocaleDateString()}</time>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">
                {attempt.careerResults[0]?.careerName ?? "No result captured"}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {attempt.careerResults[0]?.explanation ??
                  "Review your attempt for more detail."}
              </p>
              <Link
                to={`/results?id=${attempt._id}`}
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-blue-200 transition hover:text-white"
              >
                Open report -&gt;
              </Link>
            </article>
          ))}
          {attempts.length === 0 && (
            <p className="text-sm text-slate-300">
              Run your first assessment to start building a history timeline.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
