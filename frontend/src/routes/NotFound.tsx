import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-slate-900/70 px-8 py-16 text-center shadow-xl shadow-black/40">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-blue-200/80">
        404 error
      </p>
      <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
      <p className="mt-3 text-sm text-slate-300">
        The page you are looking for might have been removed or is temporarily
        unavailable. Let's bring you back on track.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold uppercase tracking-[0.3em]">
        <Link
          to="/dashboard"
          className="rounded-full border border-blue-300/40 bg-blue-300/20 px-4 py-2 text-blue-100 transition hover:border-blue-200/60 hover:text-white"
        >
          Go to dashboard
        </Link>
        <Link
          to="/career"
          className="rounded-full border border-white/10 px-4 py-2 text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          Launch career finder
        </Link>
      </div>
    </div>
  );
}
