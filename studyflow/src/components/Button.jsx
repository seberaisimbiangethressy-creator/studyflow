const variants = {
  primary: "bg-accent text-white hover:bg-accent-dark",
  secondary: "bg-white text-navy border border-slate-300 hover:bg-slate-50",
  danger: "bg-white text-red-700 border border-red-300 hover:bg-red-50",
  ghost: "text-accent hover:bg-accent-soft",
};

const sizes = {
  md: "px-4 py-2 text-sm",
  sm: "px-3 py-1.5 text-sm",
  lg: "px-6 py-3 text-base",
};

/** The one button style used on every page. */
export default function Button({
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
