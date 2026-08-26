import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { SCAN_TASKS } from "@/data/inventory-seed"
import { adjustStock } from "@/services/stock.service"
import { getStockLedgerSnapshot } from "@/services/inventory.service"

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

    return tasks.filter((task) => {
      const inScope = !facilityIds || facilityIds.includes(task.facilityId)
      const matchesType = !type || type === "all" || task.type === type
      return inScope && matchesType
    })
  } catch (error) {
    throw toAppError(error)
  }
}

export const completeScanTask = async ({ taskId, scannedCode, userName }) => {
  try {
    await delay(480)
    const task = tasks.find((entry) => entry.id === taskId)

    if (!task) {
      throw new Error("This scan job could not be found.")
    }

    if (task.status === "completed") {
      throw new Error("This machine was already scanned.")
    }

    const normalizedScan = String(scannedCode || "").replace(/\s+/g, "").toLowerCase()
    const expected = String(task.barcode || "").replace(/\s+/g, "").toLowerCase()

    if (normalizedScan !== expected) {
      throw new Error("That code does not match this machine. Check the label and try again.")
    }

    const stock = getStockLedgerSnapshot().find(
      (item) => item.productId === task.productId && item.facilityId === task.facilityId,
    )

    if (stock && (task.type === "grn" || task.type === "putaway")) {
      await adjustStock({
        stockId: stock.id,
        quantityChange: task.expectedQty,
        reason: `${task.type.toUpperCase()} ${task.reference}`,
        movementType: task.type === "grn" ? "grn" : "putaway",
        userName,
      })
    }

    if (stock && task.type === "picking") {
      await adjustStock({
        stockId: stock.id,
        quantityChange: -Math.min(task.expectedQty, stock.available || stock.quantity),
        reason: `Picking ${task.reference}`,
        movementType: "picking",
        userName,
      })
    }

    tasks = tasks.map((entry) =>
      entry.id === taskId ? { ...entry, status: "completed", completedAt: new Date().toISOString() } : entry,
    )

    return tasks.find((entry) => entry.id === taskId)
  } catch (error) {
    throw toAppError(error)
  }
}

export const removeProductScanTasks = (productId) => {
  tasks = tasks.filter((entry) => entry.productId !== productId)
}
