import { cn } from "@/lib/utils"

export const Card = ({ className, children, onClick }) => {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-white p-5 shadow-sm",
        onClick && "cursor-pointer transition-shadow duration-200 hover:shadow-md",
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
