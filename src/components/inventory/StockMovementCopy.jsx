import { MOVEMENT_TYPE_HINTS, MOVEMENT_TYPE_LABELS, formatQuantityChange } from "@/constants/movement-types"
import { cn } from "@/lib/utils"

export const StockMovementWhatHappened = ({ type }) => {
  return (
    <div>
      <p className="font-medium text-navy-900">{MOVEMENT_TYPE_LABELS[type] ?? type}</p>
      <p className="mt-0.5 max-w-xs text-xs leading-5 text-muted">
        {MOVEMENT_TYPE_HINTS[type] ?? "Stock quantity was updated"}
      </p>
    </div>
  )
}

export const StockMovementQty = ({ quantityChange }) => {
  const added = quantityChange > 0

  return (
    <span className={cn("font-semibold", added ? "text-emerald-700" : "text-red-700")}>
      {formatQuantityChange(quantityChange)}
    </span>
  )
}
