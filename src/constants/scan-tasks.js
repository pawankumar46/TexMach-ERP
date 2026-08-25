export const SCAN_TASK_TYPES = {
  GRN: "grn",
  PUTAWAY: "putaway",
  PICKING: "picking",
  CYCLE_COUNT: "cycle_count",
}

export const SCAN_TASK_LABELS = {
  [SCAN_TASK_TYPES.GRN]: "A new machine arrived",
  [SCAN_TASK_TYPES.PUTAWAY]: "Put this machine on the shelf",
  [SCAN_TASK_TYPES.PICKING]: "This machine is going out",
  [SCAN_TASK_TYPES.CYCLE_COUNT]: "Check this machine is here",
}

export const SCAN_TASK_HINTS = {
  [SCAN_TASK_TYPES.GRN]: "A supplier sent this machine. Scan it so the system knows it has arrived.",
  [SCAN_TASK_TYPES.PUTAWAY]: "Scan it after you place it on the shelf, so we know where it is stored.",
  [SCAN_TASK_TYPES.PICKING]: "Scan it when you take it out for a customer, so stock goes down.",
  [SCAN_TASK_TYPES.CYCLE_COUNT]: "Scan it to confirm the machine is physically in the store.",
}

export const getScanTaskLabel = (type) => SCAN_TASK_LABELS[type] ?? "Scan this machine"
