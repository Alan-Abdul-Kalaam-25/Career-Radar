import type { Question, QuestionOption } from "../utils/types";

type Props = {
  question: Question;
  value: any;
  onChange: (val: any) => void;
};

export default function QuestionRenderer({ question, value, onChange }: Props) {
  if (question.type === "fill") {
    return (
      <textarea
        className="min-h-28 w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-blue-400/70 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Share your thoughts, experiences, or context."
      />
    );
  }

  if (question.type === "tf" || question.type === "mcq") {
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {question.options.map((opt) => (
          <OptionCard
            key={opt.id}
            option={opt}
            selected={Boolean(value?.id === opt.id)}
            onSelect={() => onChange(opt)}
            multiple={false}
          />
        ))}
      </div>
    );
  }

  const selectedIds: string[] = (value || []).map((v: QuestionOption) => v.id);
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {question.options.map((opt) => {
        const isSelected = selectedIds.includes(opt.id);
        return (
          <OptionCard
            key={opt.id}
            option={opt}
            selected={isSelected}
            onSelect={() => {
              if (isSelected) {
                onChange(
                  (value || []).filter((v: QuestionOption) => v.id !== opt.id)
                );
              } else {
                onChange([...(value || []), opt]);
              }
            }}
            multiple
          />
        );
      })}
    </div>
  );
}

function OptionCard({
  option,
  selected,
  onSelect,
  multiple,
}: {
  option: QuestionOption;
  selected: boolean;
  onSelect: () => void;
  multiple: boolean;
}) {
  const badge = option.tags?.[0];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group flex w-full flex-col items-start gap-3 rounded-3xl border px-5 py-4 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500/60 ${
        selected
          ? "border-blue-400/60 bg-blue-500/20 text-white shadow-lg shadow-blue-500/20"
          : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <p className="text-base font-semibold text-white">{option.text}</p>
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
            selected ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
          }`}
        >
          {selected ? (
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
          ) : multiple ? (
            <span className="text-base font-semibold">+</span>
          ) : (
            <span className="block h-2 w-2 rounded-full bg-current" />
          )}
        </span>
      </div>
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-300">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          {badge}
        </span>
      )}
    </button>
  );
}
