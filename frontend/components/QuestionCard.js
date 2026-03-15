"use client";

// Strip leading "A)", "B.", etc. so we never duplicate the label (backend may send pre-labeled text).
function stripOptionLabel(text) {
  if (text == null || typeof text !== "string") return text;
  return text.replace(/^[A-D][.)]\s*/i, "").trim() || text;
}

export default function QuestionCard({
  question,
  options,
  selected,
  onSelect,
}) {
  return (
    <div className="w-full max-w-2xl rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-xl shadow-violet-900/30 backdrop-blur">
      <p className="mb-5 text-sm text-slate-200">{question}</p>
      <div className="grid gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.key;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelect(opt.key)}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                isSelected
                  ? "border-violet-500 bg-violet-500/25 text-slate-100 shadow-md shadow-violet-500/20"
                  : "border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-600 hover:bg-slate-800/80"
              }`}
            >
              <span className="mr-2 font-semibold text-violet-300">
                {opt.key}.
              </span>
              {stripOptionLabel(opt.text)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

