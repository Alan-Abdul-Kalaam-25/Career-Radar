type LoadingStateProps = {
  label?: string;
};

export default function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-300">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-blue-400" />
      <p className="text-sm font-medium tracking-wide">
        {label ?? "Loading your experience"}
      </p>
    </div>
  );
}
