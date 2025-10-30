import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../utils/auth";
import api from "../utils/api";
import LoadingState from "../components/LoadingState";

const profileFields = [
  { key: "gender", label: "Gender identity", placeholder: "Not provided" },
  { key: "dob", label: "Date of birth", placeholder: "Not provided" },
  {
    key: "educationLevel",
    label: "Education level",
    placeholder: "Not provided",
  },
  { key: "location", label: "Location", placeholder: "Not provided" },
];

export default function UserDetailsForm() {
  const [profile, setProfile] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    getMe()
      .then((u) => {
        if (!active) return;
        setProfile(u.profile || {});
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    const total = profileFields.length;
    const filled = profileFields.filter((field) =>
      Boolean(profile[field.key])
    ).length;
    return Math.round((filled / total) * 100);
  }, [profile]);

  const submit = async () => {
    try {
      setError(null);
      setSubmitting(true);
      const res = await api.post("/api/career/user-details", { profile });
      const { attemptId } = res.data;
      navigate(`/results?id=${attemptId}`);
    } catch (err) {
      console.error("Failed to submit profile", err);
      setError("We couldn't generate recommendations. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingState label="Gathering your profile" />;

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
          Profile-powered insight
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">
          Unlock instant suggestions with your saved details
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          We'll translate your profile into the skills and tags Career Radar
          uses for scoring. Review your info below and update anything that's
          out of date before generating a recommendation.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
          Profile readiness {completion}%
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Quick review
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Confirm your profile snapshot
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Need to update something? Head back to the profile page before
              running this method for best accuracy.
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Edit profile
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {profileFields.map((field) => {
            const rawValue = profile[field.key];
            let value = rawValue;
            if (field.key === "dob" && rawValue) {
              const parsed = new Date(rawValue as string);
              value = Number.isNaN(parsed.getTime())
                ? rawValue
                : parsed.toLocaleDateString();
            }
            return (
              <div
                key={field.key}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  {field.label}
                </p>
                <p className="mt-3 text-sm text-slate-200">
                  {value ? String(value) : field.placeholder}
                </p>
              </div>
            );
          })}
        </div>

        <details className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
            View raw profile JSON
          </summary>
          <pre className="mt-3 max-h-64 overflow-auto rounded-2xl bg-slate-950/70 p-4 text-xs text-slate-300">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </details>

        {error && (
          <p className="mt-6 rounded-2xl border border-rose-400/40 bg-rose-400/15 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:via-cyan-400 hover:to-purple-400 disabled:opacity-60"
          >
            {submitting ? "Generating..." : "Generate recommendations"}
          </button>
          <p className="text-xs text-slate-400">
            Tip: Alternate between this method and the questionnaire to explore
            different angles.
          </p>
        </div>
      </section>
    </div>
  );
}
