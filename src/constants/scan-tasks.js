export const SCAN_TASK_TYPES = {
  ASSIGN_WAREHOUSE: "assign_warehouse",
  RETAIN_IN_STORE: "retain_in_store",
  SCRAP: "scrap",
  EXCHANGE: "exchange",
}

export const SCRAP_DISPOSITIONS = {
  RECOVERABLE: "scrap_recoverable",
  FINAL: "scrap_final",
}

export const SCAN_TASK_LABELS = {
  [SCAN_TASK_TYPES.ASSIGN_WAREHOUSE]: "Assign to warehouse",
  [SCAN_TASK_TYPES.RETAIN_IN_STORE]: "Retain in store",
  [SCAN_TASK_TYPES.SCRAP]: "Scrape",
  [SCAN_TASK_TYPES.EXCHANGE]: "Exchange",
}

export const SCAN_TASK_HINTS = {
  [SCAN_TASK_TYPES.ASSIGN_WAREHOUSE]:
    "Scan the component first and assign it to a warehouse bin so the system knows where it lives.",
  [SCAN_TASK_TYPES.RETAIN_IN_STORE]:
    "Scan to keep this component in the store — it stays available for use.",
  [SCAN_TASK_TYPES.SCRAP]:
    "Scan a component that will be scraped. Choose recoverable scrape or final scrape.",
  [SCAN_TASK_TYPES.EXCHANGE]:
    "Scan a component that is being exchanged (swap out / replace).",
}

export const SCRAP_DISPOSITION_LABELS = {
  [SCRAP_DISPOSITIONS.RECOVERABLE]: "Recoverable scrape",
  [SCRAP_DISPOSITIONS.FINAL]: "Scrape",
}

export const SCRAP_DISPOSITION_HINTS = {
  [SCRAP_DISPOSITIONS.RECOVERABLE]:
    "Part can be recovered or refurbished later.",
  [SCRAP_DISPOSITIONS.FINAL]:
    "Part is written off and removed from usable stock.",
}

export const getScanTaskLabel = (type) => SCAN_TASK_LABELS[type] ?? "Scan component"

export const getScrapDispositionLabel = (disposition) =>
  SCRAP_DISPOSITION_LABELS[disposition] ?? "Scrape"
