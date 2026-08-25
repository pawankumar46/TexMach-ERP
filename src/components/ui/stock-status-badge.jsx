import { STOCK_STATUS, STOCK_STATUS_LABELS } from "@/constants/stock-status"
import { Badge } from "@/components/ui/badge"

const TONE_BY_STATUS = {
  [STOCK_STATUS.IN_STOCK]: "green",
  [STOCK_STATUS.LOW_STOCK]: "amber",
  [STOCK_STATUS.OUT_OF_STOCK]: "red",
}

export const StockStatusBadge = ({ status }) => {
  return <Badge tone={TONE_BY_STATUS[status] ?? "slate"}>{STOCK_STATUS_LABELS[status] ?? "Unknown"}</Badge>
}
