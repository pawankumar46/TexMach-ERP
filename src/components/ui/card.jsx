import { cn } from "@/lib/utils"

export const Card = ({ className, children, onClick, interactive = false }) => {
  const isInteractive = Boolean(onClick) || interactive

  return (
    <div
      className={cn(
        "rounded-2xl border border-line/90 bg-white/95 p-5 shadow-[var(--shadow-card)] backdrop-blur-sm",
        isInteractive && "surface-card-interactive cursor-pointer",
        className,
      )}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
