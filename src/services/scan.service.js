import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { SCAN_TASKS } from "@/data/scan-seed"
import { SCAN_TASK_TYPES, SCRAP_DISPOSITIONS } from "@/constants/scan-tasks"

let tasks = SCAN_TASKS.map((task) => ({ ...task }))

export const getScanTasks = async ({ user, selectedFacilityId, type } = {}) => {
  try {
    await delay(280)
    const facilityIds =
      selectedFacilityId && selectedFacilityId !== "all"
        ? [selectedFacilityId]
        : user?.canViewAllFacilities
          ? null
          : user?.facilityIds ?? []

    const scopedProductIds = Array.isArray(user?.productIds) ? new Set(user.productIds) : null

    return tasks.filter((task) => {
      const inScope = !facilityIds || facilityIds.includes(task.facilityId)
      const inProductScope = !scopedProductIds || scopedProductIds.has(task.productId)
      const matchesType = !type || type === "all" || task.type === type
      return inScope && inProductScope && matchesType
    })
  } catch (error) {
    throw toAppError(error)
  }
}

export const completeScanTask = async ({
  taskId,
  scannedCode,
  disposition = null,
}) => {
  try {
    await delay(480)
    const task = tasks.find((entry) => entry.id === taskId)

    if (!task) {
      throw new Error("This scan job could not be found.")
    }

    if (task.status === "completed") {
      throw new Error("This component was already scanned.")
    }

    const normalizedScan = String(scannedCode || "").replace(/\s+/g, "").toLowerCase()
    const expected = String(task.barcode || "").replace(/\s+/g, "").toLowerCase()

    if (normalizedScan !== expected) {
      throw new Error("That code does not match this component. Check the label and try again.")
    }

    if (task.type === SCAN_TASK_TYPES.SCRAP) {
      if (
        disposition !== SCRAP_DISPOSITIONS.RECOVERABLE &&
        disposition !== SCRAP_DISPOSITIONS.FINAL
      ) {
        throw new Error("Choose recoverable scrape or scrape before finishing.")
      }
    }

    tasks = tasks.map((entry) =>
      entry.id === taskId
        ? {
            ...entry,
            status: "completed",
            disposition: task.type === SCAN_TASK_TYPES.SCRAP ? disposition : null,
            completedAt: new Date().toISOString(),
          }
        : entry,
    )

    return tasks.find((entry) => entry.id === taskId)
  } catch (error) {
    throw toAppError(error)
  }
}

export const removeProductScanTasks = (productId) => {
  tasks = tasks.filter((entry) => entry.productId !== productId)
}
