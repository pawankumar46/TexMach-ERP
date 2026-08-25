import { cn } from "@/lib/utils"

export const Input = ({ className, ...props }) => {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink shadow-sm placeholder:text-slate-400 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-100",
        className,
      )}
      {...props}
    />
  )
}

export const Label = ({ className, children, htmlFor }) => {
  return (
    <label htmlFor={htmlFor} className={cn("mb-1.5 block text-sm font-medium text-slate-700", className)}>
      {children}
    </label>
  )
}

export const Select = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        "h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink shadow-sm focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-100",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export const Textarea = ({ className, ...props }) => {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-slate-400 focus:border-navy-600 focus:outline-none focus:ring-2 focus:ring-navy-100",
        className,
      )}
      {...props}
    />
  )
}
