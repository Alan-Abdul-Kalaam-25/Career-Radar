export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-slate-800/60 bg-slate-950/80 py-10 text-slate-400">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 text-sm md:flex-row md:items-center md:justify-between">
        <p className="font-medium text-slate-300">Career Radar</p>
        <p className="max-w-xl leading-relaxed">
          Navigate your next career move with confidence. Discover tailored
          pathways, track your progress, and turn insights into action.
        </p>
        <p>
          &copy; {new Date().getFullYear()} Career Radar. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
