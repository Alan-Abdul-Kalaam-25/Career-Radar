import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMe, updateProfile } from "../utils/auth";
import type { Profile as ProfileType } from "../utils/types";
import LoadingState from "../components/LoadingState";

const educationOptions = [
  "High school diploma",
  "Associate degree",
  "Bachelor's degree",
  "Master's degree",
  "Doctorate",
  "Bootcamp / Certification",
  "Other",
];

const genderOptions = ["Female", "Male", "Non-binary", "Prefer not to say"];

const workFormatOptions = [
  "Remote",
  "Hybrid",
  "On-site",
  "Flexible schedule",
  "Shift-based",
];

const industrySuggestions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Public sector",
  "Manufacturing",
  "Legal services",
  "Creative industries",
  "Hospitality",
];

function arrayToMultiline(values?: string[]) {
  return Array.isArray(values) && values.length > 0 ? values.join("\n") : "";
}

function toArray(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileType>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    let active = true;
    getMe()
      .then((u) => {
        if (!active) return;
        const base = u.profile || {};
        const rawDob = base.dob as string | undefined;
        let dobValue: string | undefined;
        if (rawDob) {
          const parsed = new Date(rawDob);
          dobValue = Number.isNaN(parsed.getTime())
            ? rawDob.slice(0, 10)
            : parsed.toISOString().slice(0, 10);
        }
        setProfile({
          ...base,
          dob: dobValue,
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (status !== "saved") return;
    const timeout = window.setTimeout(() => setStatus("idle"), 4000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const completion = useMemo(() => {
    const fields: (keyof ProfileType)[] = [
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
  }, [profile]);

  const handleChange = (field: keyof ProfileType, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof ProfileType, value: string) => {
    const next = toArray(value);
    setProfile((prev) => ({ ...prev, [field]: next }));
  };

  const handleArrayToggle = (field: keyof ProfileType, option: string) => {
    setProfile((prev) => {
      const current = Array.isArray(prev[field])
        ? (prev[field] as string[])
        : [];
      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, [field]: next };
    });
  };

  const handleYearsExperience = (value: string) => {
    if (value === "") {
      setProfile((prev) => ({ ...prev, yearsExperience: undefined }));
      return;
    }
    const parsed = Number(value);
    if (!Number.isNaN(parsed)) {
      setProfile((prev) => ({ ...prev, yearsExperience: parsed }));
    }
  };

  const sanitizeProfile = (input: ProfileType) => {
    const output: Record<string, unknown> = {};
    Object.entries(input).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const cleaned = value.map((item) => item.trim()).filter(Boolean);
        if (cleaned.length > 0) output[key] = cleaned;
      } else if (value !== undefined && value !== null && value !== "") {
        output[key] = value;
      }
    });
    return output as ProfileType;
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile(sanitizeProfile(profile));
      setStatus("saved");
    } catch (err) {
      console.error("Failed to update profile", err);
      setStatus("error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState label="Loading your profile" />;

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
          Profile intelligence
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">
          Build a richer profile to sharpen recommendations
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-200">
          Capture the roles you've held, the skills you rely on, and the
          direction you want to take. The more signal you provide, the more
          confidently Career Radar can score each career path.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
            Completion {completion}%
          </span>
          {status === "saved" && (
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/20 px-4 py-2 text-emerald-100">
              Saved successfully
            </span>
          )}
          {status === "error" && (
            <span className="rounded-full border border-rose-400/40 bg-rose-400/20 px-4 py-2 text-rose-100">
              Something went wrong. Try again.
            </span>
          )}
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Professional snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Capture where you are right now
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              These details help us understand your context, seniority, and the
              impact you're already making.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Back to dashboard
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Headline / elevator pitch
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="e.g. Product-minded web developer with a love for clean UX"
              value={profile.headline ?? ""}
              onChange={(e) => handleChange("headline", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Current role / title
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="e.g. Senior Frontend Engineer"
              value={profile.currentRole ?? ""}
              onChange={(e) => handleChange("currentRole", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Years of experience
            </label>
            <input
              type="number"
              min={0}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={profile.yearsExperience ?? ""}
              onChange={(e) => handleYearsExperience(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Target roles (one per line)
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={"e.g.\nWeb developer\nProduct manager"}
              value={arrayToMultiline(profile.targetRoles)}
              onChange={(e) => handleArrayChange("targetRoles", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Summary of experience
            </label>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Highlight recent wins, teams you lead, or industries you know well"
              value={profile.summary ?? ""}
              onChange={(e) => handleChange("summary", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Gender identity
            </label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={profile.gender ?? ""}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="" className="text-slate-900">
                Select an option
              </option>
              {genderOptions.map((option) => (
                <option key={option} value={option} className="text-slate-900">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Date of birth
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={profile.dob ?? ""}
              onChange={(e) => handleChange("dob", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Education level
            </label>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              value={profile.educationLevel ?? ""}
              onChange={(e) => handleChange("educationLevel", e.target.value)}
            >
              <option value="" className="text-slate-900">
                Select education level
              </option>
              {educationOptions.map((option) => (
                <option key={option} value={option} className="text-slate-900">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Location
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="e.g. Austin, TX"
              value={profile.location ?? ""}
              onChange={(e) => handleChange("location", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
            Skills & capabilities
          </p>
          <h2 className="text-2xl font-semibold text-white">Prove your edge</h2>
          <p className="text-sm text-slate-300">
            List the toolkits, disciplines, and human skills you rely on. Use
            one line per skill so we can tag and score them accurately.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Core skills / strengths
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={
                "e.g.\nStakeholder facilitation\nSystem design\nRapid prototyping"
              }
              value={arrayToMultiline(profile.coreSkills)}
              onChange={(e) => handleArrayChange("coreSkills", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Technical stack (one per line)
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={"e.g.\nReact\nNode.js\nPostgreSQL"}
              value={arrayToMultiline(profile.technicalSkills)}
              onChange={(e) =>
                handleArrayChange("technicalSkills", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Communication / leadership skills
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={
                "e.g.\nConflict resolution\nMentoring\nWorkshop facilitation"
              }
              value={arrayToMultiline(profile.softSkills)}
              onChange={(e) => handleArrayChange("softSkills", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Certifications & licenses
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={
                "e.g.\nAWS Solutions Architect\nRegistered Nurse (RN)"
              }
              value={arrayToMultiline(profile.certifications)}
              onChange={(e) =>
                handleArrayChange("certifications", e.target.value)
              }
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Languages spoken
            </label>
            <textarea
              className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={"e.g.\nEnglish\nSpanish (professional)"}
              value={arrayToMultiline(profile.languages)}
              onChange={(e) => handleArrayChange("languages", e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
            Direction & preferences
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Show us where you want to aim next
          </h2>
          <p className="text-sm text-slate-300">
            We use this to line up the right industries, work patterns, and
            growth moves.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Career goals
            </label>
            <textarea
              className="min-h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Describe what you want to achieve over the next 12-24 months."
              value={profile.careerGoals ?? ""}
              onChange={(e) => handleChange("careerGoals", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Preferred industries
            </label>
            <textarea
              className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder={industrySuggestions.join("\n")}
              value={arrayToMultiline(profile.preferredIndustries)}
              onChange={(e) =>
                handleArrayChange("preferredIndustries", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Preferred work formats
            </label>
            <div className="flex flex-wrap gap-2">
              {workFormatOptions.map((option) => {
                const selected = Array.isArray(profile.preferredWorkFormats)
                  ? profile.preferredWorkFormats.includes(option)
                  : false;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      handleArrayToggle("preferredWorkFormats", option)
                    }
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      selected
                        ? "border border-blue-400/60 bg-blue-500/20 text-white"
                        : "border border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Learning focus / upskilling plan
            </label>
            <textarea
              className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="e.g. Deepen knowledge of cloud architecture, advance negotiation skills"
              value={profile.learningFocus ?? ""}
              onChange={(e) => handleChange("learningFocus", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Availability / notice period
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="e.g. Open now, 30 days notice"
              value={profile.availability ?? ""}
              onChange={(e) => handleChange("availability", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Salary expectations
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="e.g. $90k - $110k USD"
              value={profile.salaryExpectation ?? ""}
              onChange={(e) =>
                handleChange("salaryExpectation", e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
            Portfolio & visibility
          </p>
          <h2 className="text-2xl font-semibold text-white">
            Make it easy to evaluate your work
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Portfolio or work samples URL
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="https://"
              value={profile.portfolioUrl ?? ""}
              onChange={(e) => handleChange("portfolioUrl", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              LinkedIn or public profile URL
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="https://www.linkedin.com/in/"
              value={profile.linkedInUrl ?? ""}
              onChange={(e) => handleChange("linkedInUrl", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:via-cyan-400 hover:to-purple-400 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
          <p className="text-xs text-slate-400">
            Need inspiration? Visit the{" "}
            <Link to="/resources" className="text-blue-200 hover:text-white">
              resource hub
            </Link>{" "}
            for curated growth sprints.
          </p>
        </div>
      </section>
    </div>
  );
}
