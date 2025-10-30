import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { login as loginApi } from "../utils/auth";

const highlights = [
  "Curated career insights crafted around your goals",
  "Smart questionnaires that adapt to your choices",
  "Actionable guidance to keep momentum between attempts",
];

export default function Login() {
  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    await loginApi(values);
    navigate("/dashboard");
  };

  return (
    <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-blue-500/25 via-slate-900/40 to-purple-600/25 p-10 text-slate-100 shadow-2xl shadow-blue-500/20">
        <div className="absolute -left-20 bottom-10 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="relative space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.5em] text-blue-100/80">
            Welcome back
          </p>
          <h1 className="text-5xl font-bold leading-tight text-white">
            Reconnect with your personalised career radar
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-200">
            Pick up where you left off, explore new career pathways, and
            experiment with next-step actions that convert insights into
            results.
          </p>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/70 text-xs font-bold">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path
                      d="M5 10.5 8.2 13.5 15 6.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-xl shadow-black/40">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-white">Sign in</h2>
          <p className="text-sm text-slate-300">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-blue-300 transition hover:text-blue-200"
            >
              Create an account
            </Link>{" "}
            to unlock your dashboard.
          </p>
        </div>
        <div className="mt-6">
          <AuthForm mode="login" onSubmit={onSubmit} />
        </div>
      </section>
    </div>
  );
}
