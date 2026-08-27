export const MOVEMENT_TYPES = {
  PURCHASE: "purchase",
  SALE: "sale",
  ADJUSTMENT: "adjustment",
  TRANSFER: "transfer",
  RETURN: "return",
  DAMAGE: "damage",
  GRN: "grn",
  PUTAWAY: "putaway",
  PICKING: "picking",
  ASSIGN_WAREHOUSE: "assign_warehouse",
  RETAIN_IN_STORE: "retain_in_store",
  SCRAP_RECOVERABLE: "scrap_recoverable",
  SCRAP_FINAL: "scrap_final",
  EXCHANGE: "exchange",
}

export const MOVEMENT_TYPE_LABELS = {
  [MOVEMENT_TYPES.PURCHASE]: "Bought from supplier",
  [MOVEMENT_TYPES.SALE]: "Sold to a customer",
  [MOVEMENT_TYPES.ADJUSTMENT]: "Stock count corrected",
  [MOVEMENT_TYPES.TRANSFER]: "Moved to another facility",
  [MOVEMENT_TYPES.RETURN]: "Returned to warehouse",
  [MOVEMENT_TYPES.DAMAGE]: "Marked as damaged",
  [MOVEMENT_TYPES.GRN]: "Received from vendor",
  [MOVEMENT_TYPES.PUTAWAY]: "Stored in the warehouse",
  [MOVEMENT_TYPES.PICKING]: "Picked for an order",
  [MOVEMENT_TYPES.ASSIGN_WAREHOUSE]: "Assigned to warehouse",
  [MOVEMENT_TYPES.RETAIN_IN_STORE]: "Retained in store",
  [MOVEMENT_TYPES.SCRAP_RECOVERABLE]: "Recoverable scrape",
  [MOVEMENT_TYPES.SCRAP_FINAL]: "Scraped",
  [MOVEMENT_TYPES.EXCHANGE]: "Exchanged",
}

export const MOVEMENT_TYPE_HINTS = {
  [MOVEMENT_TYPES.PURCHASE]: "New stock was purchased and added",
  [MOVEMENT_TYPES.SALE]: "This machine left stock because it was sold",
  [MOVEMENT_TYPES.ADJUSTMENT]: "Someone corrected the recorded quantity",
  [MOVEMENT_TYPES.TRANSFER]: "Stock was sent from this location to another HCA store",
  [MOVEMENT_TYPES.RETURN]: "An item came back into the warehouse",
  [MOVEMENT_TYPES.DAMAGE]: "This quantity can no longer be sold",
  [MOVEMENT_TYPES.GRN]: "A vendor delivery was booked into stock",
  [MOVEMENT_TYPES.PUTAWAY]: "Received goods were placed on a shelf or bin",
  [MOVEMENT_TYPES.PICKING]: "Items were taken out to fulfil a dispatch",
  [MOVEMENT_TYPES.ASSIGN_WAREHOUSE]: "Component was scanned and assigned to a warehouse bin",
  [MOVEMENT_TYPES.RETAIN_IN_STORE]: "Component was scanned and kept in the store",
  [MOVEMENT_TYPES.SCRAP_RECOVERABLE]: "Component scraped but marked recoverable",
  [MOVEMENT_TYPES.SCRAP_FINAL]: "Component scraped and written off",
  [MOVEMENT_TYPES.EXCHANGE]: "Component was exchanged / swapped",
}

export const formatQuantityChange = (quantityChange) => {
  const amount = Math.abs(Number(quantityChange) || 0)
  const unit = amount === 1 ? "unit" : "units"

  if (quantityChange > 0) {
    return `Added ${amount} ${unit}`
  }

  if (quantityChange < 0) {
    return `Removed ${amount} ${unit}`
  }

  return "No change"
}
