/** Friendly message shown instead of an empty list. `children` is an optional action. */
export default function EmptyState({ title, message, children }) {
  return (
    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-600">{message}</p>
      {children && <div className="mt-4 flex justify-center">{children}</div>}
    </div>
  );
}
