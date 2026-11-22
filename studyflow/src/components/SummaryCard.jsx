const accents = {
  default: "border-l-navy",
  success: "border-l-green-600",
  info: "border-l-blue-600",
  danger: "border-l-red-600",
};

/** One number on the Dashboard. The value is passed in - it is derived by the parent. */
export default function SummaryCard({ label, value, hint, tone = "default" }) {
  return (
    <div className={`rounded-xl border border-slate-200 border-l-4 bg-white p-4 shadow-sm ${accents[tone]}`}>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-3xl font-bold text-navy">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
