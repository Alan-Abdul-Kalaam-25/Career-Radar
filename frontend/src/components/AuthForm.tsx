import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormValues = {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
};

const loginSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export default function AuthForm({
  mode,
  onSubmit,
}: {
  mode: "login" | "register";
  onSubmit: (values: any) => Promise<void>;
}) {
  const isRegister = mode === "register";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {isRegister && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              First name
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Alex"
              autoComplete="given-name"
              {...register("firstName" as const)}
            />
            {errors.firstName && (
              <p className="text-xs font-medium text-rose-300/90">
                {String(errors.firstName.message)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
              Last name
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="Morgan"
              autoComplete="family-name"
              {...register("lastName" as const)}
            />
            {errors.lastName && (
              <p className="text-xs font-medium text-rose-300/90">
                {String(errors.lastName.message)}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
          Email
        </label>
        <input
          type="email"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email" as const)}
        />
        {errors.email && (
          <p className="text-xs font-medium text-rose-300/90">
            {String(errors.email.message)}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
          Password
        </label>
        <input
          type="password"
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          placeholder="Enter password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          {...register("password" as const)}
        />
        <p className="text-xs text-slate-400">
          Use at least 6 characters with a mix of numbers and letters.
        </p>
        {errors.password && (
          <p className="text-xs font-medium text-rose-300/90">
            {String(errors.password.message)}
          </p>
        )}
      </div>
      <button
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-full bg-linear-to-r from-blue-500 via-cyan-500 to-purple-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:via-cyan-400 hover:to-purple-400 disabled:opacity-60"
      >
        {isRegister ? "Create account" : "Login"}
      </button>
    </form>
  );
}
