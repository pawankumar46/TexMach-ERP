import { cn } from "@/lib/utils"

const tones = {
  navy: "bg-navy-50 text-navy-800",
  slate: "bg-slate-100 text-slate-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-800",
  red: "bg-red-50 text-red-700",
  gold: "bg-gold-100 text-amber-800",
}

export const Badge = ({ children, tone = "slate", className }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
