export const VENUE_TYPES = {
  DISTRIBUTOR_OFFICE: "distributor_office",
  GODOWN_WAREHOUSE: "godown_warehouse",
}

export const VENUE_TYPE_LABELS = {
  [VENUE_TYPES.DISTRIBUTOR_OFFICE]: "Distributor Office",
  [VENUE_TYPES.GODOWN_WAREHOUSE]: "Godown / Warehouse",
}

export const getVenueTypeLabel = (type) => {
  return VENUE_TYPE_LABELS[type] ?? type
}
