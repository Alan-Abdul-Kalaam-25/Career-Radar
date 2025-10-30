import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import type { Question } from "../utils/types";
import QuestionRenderer from "../components/QuestionRenderer";
import LoadingState from "../components/LoadingState";

const modeCards = [
  {
    id: "general" as const,
    title: "Explore every discipline",
    description:
      "Work through 50 prompts that sample product, engineering, data, and leadership signals for a holistic radar check.",
  },
  {
    id: "career" as const,
    title: "Target a specialty",
    description:
      "Focus on 50 prompts tailored to a specific craft area so you can benchmark depth and surface nuanced strengths.",
  },
];

function formatFieldName(field: string) {
  return field
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Questionnaire() {
  const [mode, setMode] = useState<"general" | "career">("general");
  const [careerField, setCareerField] = useState("");
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api
      .get("/api/questions", { params: { mode: "fields" } })
      .then((res) => {
        if (!active) return;
        const fields = (res.data?.fields as string[]) || [];
        setAvailableFields(fields);
        if (fields.length) {
          setCareerField((prev) => (prev ? prev : fields[0]));
        }
      })
      .catch((err) => {
        console.error("Failed to load available fields", err);
      })
      .finally(() => {
        if (active) setLoadingMeta(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (loadingMeta) return;
    if (mode === "career" && !careerField) {
      setQuestions([]);
      setAnswers({});
      setLoadingQuestions(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    setLoadingQuestions(true);
    setFetchError(null);
    setAnswers({});

    const params: Record<string, string> = {
      mode: mode === "career" ? "career" : "general",
      limit: "50",
    };
    if (mode === "career") params.field = careerField;

    api
      .get("/api/questions", { params, signal: controller.signal })
      .then((res) => {
        if (!active) return;
        const next = (res.data?.questions as Question[]) || [];
        setQuestions(next);
        if (res.data?.availableFields) {
          setAvailableFields(res.data.availableFields);
        }
      })
      .catch((err) => {
        if (!active || controller.signal.aborted) return;
        console.error("Failed to load questions", err);
        setQuestions([]);
        setFetchError(
          "We couldn't load questions. Try refreshing or switching modes."
        );
      })
      .finally(() => {
        if (active) setLoadingQuestions(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [mode, careerField, loadingMeta, refreshIndex]);

  const answeredCount = useMemo(() => {
    return questions.filter((question) => {
      const value = answers[question._id];
      if (!value) return false;
      if (question.type === "fill")
        return typeof value === "string" && value.trim().length > 0;
      if (question.type === "multi")
        return Array.isArray(value) && value.length > 0;
      return Boolean(value);
    }).length;
  }, [answers, questions]);

  const progress = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const submit = async () => {
    try {
      setSubmitError(null);
      setSubmitting(true);
      const payload = questions.map((q) => {
        const v = answers[q._id];
        if (q.type === "fill") return { type: "fill", value: v || "" };
        if (q.type === "multi") return { type: "multi", options: v || [] };
        return { type: q.type, options: v ? [v] : [] };
      });
      const res = await api.post("/api/career/qa/submit", {
        answers: payload,
        mode,
        careerField: mode === "career" ? careerField : undefined,
        questionIds: questions.map((q) => q._id),
      });
      const { attemptId } = res.data;
      navigate(`/results?id=${attemptId}`);
    } catch (err) {
      console.error("Failed to submit questionnaire", err);
      setSubmitError("We couldn't submit your responses. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMeta || loadingQuestions) {
    return <LoadingState label="Preparing a 50-question set" />;
  }

  const disableSubmit =
    submitting ||
    questions.length === 0 ||
    (mode === "career" && !careerField) ||
    fetchError !== null;

  return (
    <div className="space-y-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 px-6 py-8 shadow-2xl shadow-blue-500/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
              Adaptive questionnaire
            </p>
            <h1 className="text-3xl font-semibold text-white md:text-4xl">
              Share more context to sharpen your radar
            </h1>
            <p className="max-w-2xl text-sm text-slate-200">
              Every run includes 50 prompts. Pick a mode that aligns with your
              next move, answer thoughtfully, and we\'ll translate your
              instincts into a ranked career map.
            </p>
          </div>
          <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-slate-900/60 p-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
            <p>Progress</p>
            <p className="mt-2 text-3xl font-semibold text-white">
              {progress}%
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500"
                style={{ width: `${Math.max(progress, 6)}%` }}
              />
            </div>
            <p className="mt-3 text-[0.6rem] font-normal text-slate-400">
              {answeredCount} of {questions.length} answered
            </p>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {modeCards.map((card) => {
          const isActive = mode === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setMode(card.id)}
              className={`group flex h-full flex-col items-start gap-3 rounded-3xl border px-6 py-6 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
                isActive
                  ? "border-blue-400/60 bg-blue-500/15 text-white shadow-lg shadow-blue-500/20"
                  : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-blue-200">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isActive ? "bg-blue-300" : "bg-blue-500"
                  }`}
                />
                {card.id === "general" ? "Breadth" : "Focus"}
              </span>
              <h2 className="text-2xl font-semibold text-white">
                {card.title}
              </h2>
              <p className="text-sm text-slate-300">{card.description}</p>
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-200 ${
                  isActive ? "" : "group-hover:text-white"
                }`}
              >
                {isActive ? "Selected" : "Choose"}
              </span>
            </button>
          );
        })}
      </section>

      {mode === "career" && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
                Choose a craft focus
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                We\'ll assemble 50 prompts tailored to this specialty
              </h2>
            </div>
            {availableFields.length > 0 ? (
              <select
                value={careerField}
                onChange={(event) => setCareerField(event.target.value)}
                className="w-full max-w-xs rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {availableFields.map((field) => (
                  <option
                    key={field}
                    value={field}
                    className="bg-slate-900 text-slate-100"
                  >
                    {formatFieldName(field)}
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full max-w-xs rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                We\'re cataloging fields for this bank. Try switching modes or
                refreshing shortly.
              </div>
            )}
          </div>
          <p className="mt-3 text-xs text-slate-300">
            Don\'t see the field you\'re after? Capture it through the career
            brief path and we\'ll keep evolving these banks.
          </p>
        </div>
      )}

      {fetchError && (
        <div className="rounded-3xl border border-rose-400/40 bg-rose-400/15 p-4 text-sm text-rose-100">
          {fetchError}
          <button
            type="button"
            onClick={() => setRefreshIndex((idx) => idx + 1)}
            className="ml-3 inline-flex items-center rounded-full border border-white/20 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:border-white/40"
          >
            Try again
          </button>
        </div>
      )}

      {!fetchError && questions.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-10 text-center text-sm text-slate-300">
          No questions available for this combination right now. Refresh the set
          or switch modes.
        </div>
      )}

      <section className="space-y-6">
        {questions.map((q, idx) => (
          <article
            key={q._id}
            className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/40"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-200/80">
                  Question {idx + 1} of {questions.length}
                </p>
                <h2 className="mt-2 text-xl font-semibold text-white">
                  {q.text}
                </h2>
                {mode === "career" && q.careerField && (
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    {formatFieldName(q.careerField)} focus
                  </span>
                )}
              </div>
              <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-200">
                {q.type === "multi"
                  ? "Select all that apply"
                  : q.type === "fill"
                  ? "Open response"
                  : "Single choice"}
              </span>
            </div>
            <div className="mt-4">
              <QuestionRenderer
                question={q}
                value={answers[q._id]}
                onChange={(val) =>
                  setAnswers((prev) => ({ ...prev, [q._id]: val }))
                }
              />
            </div>
          </article>
        ))}
      </section>

      {submitError && (
        <p className="rounded-3xl border border-rose-400/40 bg-rose-400/15 px-4 py-3 text-sm text-rose-100">
          {submitError}
        </p>
      )}

      <div className="sticky bottom-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-blue-500/20">
        <div className="max-w-md text-xs text-slate-300">
          Submit whenever you\'re ready. Need a different perspective? Refresh
          the question set for a new blend of prompts.
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setRefreshIndex((idx) => idx + 1)}
            className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10 hover:text-white"
          >
            Refresh prompts
          </button>
          <button
            onClick={submit}
            disabled={disableSubmit}
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:via-cyan-400 hover:to-purple-400 disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit responses"}
          </button>
        </div>
      </div>
    </div>
  );
}
