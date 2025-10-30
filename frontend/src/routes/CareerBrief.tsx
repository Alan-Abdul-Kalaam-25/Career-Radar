import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../utils/api";
import {
  targetRoleOptions,
  technicalSkillOptions,
  coreToolOptions,
  softSkillOptions,
  workStyleOptions,
  learningGoalOptions,
  industryOptions,
  experienceOptions,
} from "../utils/intakeOptions";

const intakeSchema = z.object({
  headline: z
    .string()
    .min(20, "Share a concise headline summarizing your ambition."),
  currentRole: z.string().min(10, "Describe your current role or focus area."),
  yearsExperience: z.string().min(1, "Select your experience range."),
  targetRoles: z
    .array(z.string())
    .min(1, "Choose at least one target focus so we can tailor results."),
  focusIndustries: z.array(z.string()).default([]),
  technicalSkills: z
    .array(z.string())
    .min(3, "Highlight at least three technical strengths."),
  coreTools: z
    .array(z.string())
    .min(2, "Add the platforms or tools you rely on the most."),
  softSkills: z
    .array(z.string())
    .min(2, "Select the people-centered strengths you lead with."),
  workStyles: z
    .array(z.string())
    .min(1, "Pick collaboration environments where you thrive."),
  learningGoals: z
    .array(z.string())
    .min(1, "Share the growth themes you are actively pursuing."),
  recentAchievements: z
    .string()
    .min(40, "Describe a recent outcome you're proud of."),
  challengeNarrative: z
    .string()
    .min(40, "Outline a complex challenge you're ready to tackle."),
  preferredTeamCulture: z
    .string()
    .min(15, "Capture the team dynamics that keep you energized."),
  locationPreference: z
    .string()
    .min(3, "Let us know your location or flexibility preferences."),
  portfolioLinks: z.string().default(""),
  additionalNotes: z.string().default(""),
});

type IntakeFormValues = z.infer<typeof intakeSchema>;

function ToggleChip({
  label,
  description,
  selected,
  onToggle,
}: {
  label: string;
  description?: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full flex-col items-start gap-1 rounded-2xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
        selected
          ? "border-blue-400/60 bg-blue-500/15 text-white shadow-lg shadow-blue-500/20"
          : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <span className="text-sm font-semibold text-white">{label}</span>
      {description && (
        <span className="text-xs text-slate-300">{description}</span>
      )}
    </button>
  );
}

export default function CareerBrief() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeSchema) as any,
    defaultValues: {
      headline: "",
      currentRole: "",
      yearsExperience: "",
      targetRoles: [],
      focusIndustries: [],
      technicalSkills: [],
      coreTools: [],
      softSkills: [],
      workStyles: [],
      learningGoals: [],
      recentAchievements: "",
      challengeNarrative: "",
      preferredTeamCulture: "",
      locationPreference: "Remote friendly",
      portfolioLinks: "",
      additionalNotes: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setValue,
    watch,
  } = form;

  const selections = {
    targetRoles: watch("targetRoles"),
    focusIndustries: watch("focusIndustries"),
    technicalSkills: watch("technicalSkills"),
    coreTools: watch("coreTools"),
    softSkills: watch("softSkills"),
    workStyles: watch("workStyles"),
    learningGoals: watch("learningGoals"),
  };

  const selectionCounts = useMemo(
    () => ({
      roles: selections.targetRoles?.length || 0,
      skills: selections.technicalSkills?.length || 0,
      tools: selections.coreTools?.length || 0,
      soft: selections.softSkills?.length || 0,
      work: selections.workStyles?.length || 0,
      learning: selections.learningGoals?.length || 0,
    }),
    [
      selections.targetRoles,
      selections.technicalSkills,
      selections.coreTools,
      selections.softSkills,
      selections.workStyles,
      selections.learningGoals,
    ]
  );

  type ArrayField =
    | "targetRoles"
    | "focusIndustries"
    | "technicalSkills"
    | "coreTools"
    | "softSkills"
    | "workStyles"
    | "learningGoals";

  const toggleValue = (field: ArrayField, value: string) => {
    const current = new Set((watch(field) as string[]) || []);
    if (current.has(value)) current.delete(value);
    else current.add(value);
    setValue(field, Array.from(current), { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<IntakeFormValues> = async (values) => {
    try {
      setSubmitError(null);
      const payload = {
        ...values,
        yearsExperience: Number(values.yearsExperience),
        portfolioLinks: values.portfolioLinks?.trim() ?? "",
        additionalNotes: values.additionalNotes?.trim() ?? "",
      };
      const response = await api.post("/api/career/intake", {
        intake: payload,
      });
      const attemptId = response.data?.attemptId;
      if (attemptId) {
        navigate(`/results?id=${attemptId}`);
      } else {
        throw new Error("Missing attempt id");
      }
    } catch (err) {
      console.error("Failed to submit intake", err);
      setSubmitError(
        "We couldn't process that insight brief. Please double-check your answers and try again."
      );
    }
  };

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-8 py-10 shadow-2xl shadow-blue-500/20">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
          Career brief
        </p>
        <h1 className="mt-4 text-4xl font-bold text-white">
          Capture your story so Career Radar can respond in kind
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-200">
          This intake is designed for moments when your profile alone isn't
          enough. Share the outcomes you are driving, the systems you work
          within, and the challenges you crave. We'll preserve this snapshot,
          score it across our career graph, and surface the top five matches
          with tailored guidance.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
            Minimum 15 minutes of depth
          </span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">
            Richer recommendations
          </span>
          <Link
            to="/career"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-blue-100 transition hover:border-blue-200/60 hover:text-white"
          >
            Choose another path
          </Link>
        </div>
      </header>

      <form
        onSubmit={
          handleSubmit(onSubmit as SubmitHandler<IntakeFormValues>) as any
        }
        className="space-y-10"
        noValidate
      >
        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40 space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Professional snapshot
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Start with the headlines
            </h2>
            <p className="text-sm text-slate-300">
              Frame where you are today and where you intend to direct your
              momentum. Be specific—the richer the signal, the sharper the
              guidance.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Career headline
              </span>
              <textarea
                {...register("headline")}
                className="min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="e.g. Staff-level front-end leader translating customer insight into resilient design systems"
              />
              {errors.headline && (
                <span className="text-xs text-rose-400">
                  {errors.headline.message}
                </span>
              )}
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Current role + scope
              </span>
              <textarea
                {...register("currentRole")}
                className="min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Summarize the teams, products, and responsibilities on your plate."
              />
              {errors.currentRole && (
                <span className="text-xs text-rose-400">
                  {errors.currentRole.message}
                </span>
              )}
            </label>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Experience range
              </span>
              <select
                {...register("yearsExperience")}
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="">Select your range</option>
                {experienceOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-slate-900 text-slate-100"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.yearsExperience && (
                <span className="text-xs text-rose-400">
                  {errors.yearsExperience.message}
                </span>
              )}
            </label>
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Location or flexibility
              </span>
              <input
                {...register("locationPreference")}
                type="text"
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Remote-friendly across EU time zones"
              />
              {errors.locationPreference && (
                <span className="text-xs text-rose-400">
                  {errors.locationPreference.message}
                </span>
              )}
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40 space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Technical signal
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Pinpoint the craft you bring to the table
            </h2>
            <p className="text-sm text-slate-300">
              Select the capabilities that reflect your current depth. We'll use
              them to match you with teams that need your brand of excellence.
            </p>
          </header>

          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>Target roles ({selectionCounts.roles} selected)</span>
                {errors.targetRoles && (
                  <span className="text-rose-400">
                    {errors.targetRoles.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {targetRoleOptions.map((option) => (
                  <ToggleChip
                    key={option.value}
                    label={option.label}
                    description={option.description}
                    selected={
                      selections.targetRoles?.includes(option.value) ?? false
                    }
                    onToggle={() => toggleValue("targetRoles", option.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>
                  Technical strengths ({selectionCounts.skills} selected)
                </span>
                {errors.technicalSkills && (
                  <span className="text-rose-400">
                    {errors.technicalSkills.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {technicalSkillOptions.map((option) => (
                  <ToggleChip
                    key={option.value}
                    label={option.label}
                    selected={
                      selections.technicalSkills?.includes(option.value) ??
                      false
                    }
                    onToggle={() =>
                      toggleValue("technicalSkills", option.value)
                    }
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>
                  Tools + platforms ({selectionCounts.tools} selected)
                </span>
                {errors.coreTools && (
                  <span className="text-rose-400">
                    {errors.coreTools.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {coreToolOptions.map((option) => (
                  <ToggleChip
                    key={option.value}
                    label={option.label}
                    selected={
                      selections.coreTools?.includes(option.value) ?? false
                    }
                    onToggle={() => toggleValue("coreTools", option.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40 space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Human-centered strengths
            </p>
            <h2 className="text-2xl font-semibold text-white">
              How do you rally teams and stakeholders?
            </h2>
            <p className="text-sm text-slate-300">
              These signals help us align you with environments that value your
              leadership style, facilitation habits, and collaboration
              preferences.
            </p>
          </header>

          <div className="space-y-8">
            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>People strengths ({selectionCounts.soft} selected)</span>
                {errors.softSkills && (
                  <span className="text-rose-400">
                    {errors.softSkills.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {softSkillOptions.map((option) => (
                  <ToggleChip
                    key={option.value}
                    label={option.label}
                    selected={
                      selections.softSkills?.includes(option.value) ?? false
                    }
                    onToggle={() => toggleValue("softSkills", option.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>Work environments ({selectionCounts.work} selected)</span>
                {errors.workStyles && (
                  <span className="text-rose-400">
                    {errors.workStyles.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {workStyleOptions.map((option) => (
                  <ToggleChip
                    key={option.value}
                    label={option.label}
                    selected={
                      selections.workStyles?.includes(option.value) ?? false
                    }
                    onToggle={() => toggleValue("workStyles", option.value)}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                <span>
                  Learning focus ({selectionCounts.learning} selected)
                </span>
                {errors.learningGoals && (
                  <span className="text-rose-400">
                    {errors.learningGoals.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {learningGoalOptions.map((option) => (
                  <ToggleChip
                    key={option.value}
                    label={option.label}
                    selected={
                      selections.learningGoals?.includes(option.value) ?? false
                    }
                    onToggle={() => toggleValue("learningGoals", option.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40 space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Domain context
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Where do you apply your craft today?
            </h2>
            <p className="text-sm text-slate-300">
              Optional, but helpful when you want to lean into sector-specific
              momentum.
            </p>
          </header>

          <div className="grid gap-3 md:grid-cols-2">
            {industryOptions.map((option) => (
              <ToggleChip
                key={option.value}
                label={option.label}
                selected={
                  selections.focusIndustries?.includes(option.value) ?? false
                }
                onToggle={() => toggleValue("focusIndustries", option.value)}
              />
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40 space-y-6">
          <header className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
              Narrative depth
            </p>
            <h2 className="text-2xl font-semibold text-white">
              Tell us about the work that energizes you
            </h2>
            <p className="text-sm text-slate-300">
              These prompts capture the qualitative nuance behind your momentum.
              Add links where helpful.
            </p>
          </header>

          <div className="space-y-6">
            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Recent achievement
              </span>
              <textarea
                {...register("recentAchievements")}
                className="min-h-32 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Describe the measurable outcomes, collaborators, and impact you delivered."
              />
              {errors.recentAchievements && (
                <span className="text-xs text-rose-400">
                  {errors.recentAchievements.message}
                </span>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Challenge you want next
              </span>
              <textarea
                {...register("challengeNarrative")}
                className="min-h-32 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="What ambitious challenge or transformation do you want to own next?"
              />
              {errors.challengeNarrative && (
                <span className="text-xs text-rose-400">
                  {errors.challengeNarrative.message}
                </span>
              )}
            </label>

            <label className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                Preferred team culture
              </span>
              <textarea
                {...register("preferredTeamCulture")}
                className="min-h-24 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                placeholder="Think rituals, leadership styles, product philosophy."
              />
              {errors.preferredTeamCulture && (
                <span className="text-xs text-rose-400">
                  {errors.preferredTeamCulture.message}
                </span>
              )}
            </label>

            <div className="grid gap-6 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Portfolio or proof links
                </span>
                <textarea
                  {...register("portfolioLinks")}
                  className="min-h-20 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Drop URLs, case studies, or artifacts you'd like us to consider."
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200">
                  Additional notes
                </span>
                <textarea
                  {...register("additionalNotes")}
                  className="min-h-20 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  placeholder="Any context, constraints, or aspirations we should weigh."
                />
              </label>
            </div>
          </div>
        </section>

        {submitError && (
          <p className="rounded-3xl border border-rose-400/40 bg-rose-400/15 px-4 py-3 text-sm text-rose-100">
            {submitError}
          </p>
        )}

        <footer className="sticky bottom-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-blue-500/20">
          <div className="max-w-lg text-xs text-slate-300">
            Your brief is saved alongside the recommendations so you can revisit
            or iterate later. Take your time and make this snapshot
            representative of the path you want to pursue.
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:via-cyan-400 hover:to-purple-400 disabled:opacity-60"
          >
            {isSubmitting
              ? "Scoring your brief..."
              : "Generate tailored recommendations"}
          </button>
        </footer>
      </form>

      {isSubmitSuccessful && (
        <p className="text-center text-xs text-slate-400">
          Redirecting you to results...
        </p>
      )}
    </div>
  );
}
