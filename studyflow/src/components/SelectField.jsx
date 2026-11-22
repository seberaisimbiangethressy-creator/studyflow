import { useId } from "react";

/** Labelled <select>. The <option> elements are passed as `children`. */
export default function SelectField({ label, error, className = "", children, ...selectProps }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-800">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={error ? "true" : undefined}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 ${
          error ? "border-red-600" : "border-slate-300"
        }`}
        {...selectProps}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
