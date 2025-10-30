import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { register as registerApi } from "../utils/auth";

const steps = [
  {
    title: "Complete your profile",
    detail:
      "Share essentials like education, skills, and location to power better matches.",
  },
  {
    title: "Run tailored questionnaires",
    detail:
      "Mix quick assessments and detailed prompts to surface your strengths.",
  },
  {
    title: "Activate guided actions",
    detail:
      "Translate recommendations into 30-60-90 day sprints with measurable outcomes.",
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const onSubmit = async (values: any) => {
    await registerApi(values);
    navigate("/dashboard");
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
      <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">
            Create your account
          </h2>
          <p className="text-sm text-slate-300">
            Already on Career Radar?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-300 transition hover:text-blue-200"
            >
              Sign in
            </Link>{" "}
            to jump back into your dashboard.
          </p>
        </div>
        <div className="mt-6">
          <AuthForm mode="register" onSubmit={onSubmit} />
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-purple-500/20 via-slate-900/50 to-blue-600/20 p-10 text-slate-100 shadow-2xl shadow-blue-500/20">
        <div className="absolute -right-20 top-16 h-60 w-60 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-purple-400/15 blur-3xl" />
        <div className="relative space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-blue-100/80">
            Launch your radar
          </p>
          <h1 className="text-5xl font-bold leading-tight text-white">
            Map the next chapter of your career journey
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-200">
            Career Radar blends your profile, ambitions, and skill signals into
            smart recommendations. Build momentum faster with personalised
            insights and resource playbooks.
          </p>
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.4em] text-blue-200">
                  {step.title}
                </p>
                <p className="mt-2 text-sm text-slate-100">{step.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
