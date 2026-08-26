import { cn } from "@/lib/utils"

const variants = {
  primary:
    "bg-navy-800 text-white shadow-sm hover:bg-navy-700 hover:shadow-md active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none",
  secondary:
    "bg-white text-navy-900 border border-line shadow-sm hover:bg-navy-50 hover:border-navy-100 active:scale-[0.98] disabled:text-slate-400 disabled:shadow-none",
  ghost: "text-navy-800 hover:bg-navy-50 active:scale-[0.98]",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none",
  gold: "bg-gold-500 text-white shadow-sm hover:bg-amber-600 hover:shadow-md active:scale-[0.98]",
}

const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
}

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-[color,background-color,box-shadow,transform] duration-200 ease-out disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : null}
      {children}
    </button>
  )
}
