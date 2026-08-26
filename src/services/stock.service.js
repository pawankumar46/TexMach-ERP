import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { mapStockItem } from "@/lib/stock-mappers"
import { STOCK_MOVEMENTS, getAvailableStock } from "@/data/inventory-seed"
import { deriveStockStatus } from "@/constants/stock-status"
import { getProductCatalog, getStockLedgerSnapshot, replaceStockLedger } from "@/services/inventory.service"
import { FACILITIES } from "@/data/facilities"

let movements = STOCK_MOVEMENTS.map((item) => ({ ...item }))

const scopeFacilityIds = (user, selectedFacilityId) => {
  if (selectedFacilityId && selectedFacilityId !== "all") {
    return [selectedFacilityId]
  }

  if (user?.canViewAllFacilities) {
    return null
  }

  return user?.facilityIds ?? []
}

export const getStockItems = async ({ user, selectedFacilityId, search = "", status } = {}) => {
  try {
    await delay()
    const facilityIds = scopeFacilityIds(user, selectedFacilityId)
    const productById = Object.fromEntries(getProductCatalog().map((product) => [product.id, product]))

    return getStockLedgerSnapshot()
      .filter((item) => !facilityIds || facilityIds.includes(item.facilityId))
      .map((item) => mapStockItem(item, productById[item.productId]))
      .filter((item) => {
        const haystack = `${item.productName} ${item.sku} ${item.bin}`.toLowerCase()
        const matchesSearch = haystack.includes(search.trim().toLowerCase())
        const matchesStatus = !status || status === "all" || item.stockStatus === status
        return matchesSearch && matchesStatus
      })
  } catch (error) {
    throw toAppError(error)
  }
}

export const getStockMovements = async ({ user, selectedFacilityId } = {}) => {
  try {
    await delay(260)
    const facilityIds = scopeFacilityIds(user, selectedFacilityId)
    return movements.filter((item) => !facilityIds || facilityIds.includes(item.facilityId))
  } catch (error) {
    throw toAppError(error)
  }
}

export const adjustStock = async ({ stockId, quantityChange, reason, movementType, userName }) => {
  try {
    await delay(520)
    const ledger = getStockLedgerSnapshot()
    const index = ledger.findIndex((item) => item.id === stockId)

    if (index < 0) {
      throw new Error("Stock record not found.")
    }

    const current = ledger[index]
    const nextQuantity = current.quantity + Number(quantityChange)

    if (nextQuantity < 0) {
      throw new Error("Quantity cannot go below zero.")
    }

    const product = getProductCatalog().find((entry) => entry.id === current.productId)
    const available = getAvailableStock(nextQuantity, current.reserved)
    const updated = {
      ...current,
      quantity: nextQuantity,
      available,
      stockStatus: deriveStockStatus(available, product?.reorderLevel ?? current.reorderLevel),
    }

    const nextLedger = [...ledger]
    nextLedger[index] = updated
    replaceStockLedger(nextLedger)

    movements = [
      {
        id: `mov-${Date.now()}`,
        productId: current.productId,
        sku: product?.sku,
        productName: product?.name,
        facilityId: current.facilityId,
        type: movementType,
        quantityChange: Number(quantityChange),
        newQuantity: nextQuantity,
        reason,
        userName,
        createdAt: new Date().toISOString(),
      },
      ...movements,
    ]

    return mapStockItem(updated, product)
  } catch (error) {
    throw toAppError(error)
  }
}

export const transferStock = async ({
  stockId,
  destinationFacilityId,
  quantity,
  reason,
  userName,
}) => {
  try {
    await delay(640)
    const ledger = getStockLedgerSnapshot()
    const sourceIndex = ledger.findIndex((item) => item.id === stockId)

    if (sourceIndex < 0) {
      throw new Error("Source stock record not found.")
    }

    const source = ledger[sourceIndex]
    const qty = Number(quantity)

    if (qty <= 0) {
      throw new Error("Transfer quantity must be greater than zero.")
    }

    if (qty > getAvailableStock(source.quantity, source.reserved)) {
      throw new Error("Not enough available stock to transfer.")
    }

    if (source.facilityId === destinationFacilityId) {
      throw new Error("Choose a different destination facility.")
    }

    const product = getProductCatalog().find((entry) => entry.id === source.productId)
    const destination = FACILITIES.find((facility) => facility.id === destinationFacilityId)

    if (!destination) {
      throw new Error("Destination facility not found.")
    }

    const nextLedger = [...ledger]
    const sourceAvailable = getAvailableStock(source.quantity - qty, source.reserved)
    nextLedger[sourceIndex] = {
      ...source,
      quantity: source.quantity - qty,
      available: sourceAvailable,
      stockStatus: deriveStockStatus(sourceAvailable, product?.reorderLevel ?? source.reorderLevel),
    }

    const destIndex = nextLedger.findIndex(
      (item) => item.productId === source.productId && item.facilityId === destinationFacilityId,
    )

    if (destIndex >= 0) {
      const dest = nextLedger[destIndex]
      const destAvailable = getAvailableStock(dest.quantity + qty, dest.reserved)
      nextLedger[destIndex] = {
        ...dest,
        quantity: dest.quantity + qty,
        available: destAvailable,
        stockStatus: deriveStockStatus(destAvailable, product?.reorderLevel ?? dest.reorderLevel),
      }
    } else {
      const destAvailable = qty
      nextLedger.push({
        id: `stk-${source.productId}-${destinationFacilityId}`,
        productId: source.productId,
        facilityId: destinationFacilityId,
        warehouseName: destination.name,
        bin: destination.bins[0],
        quantity: qty,
        reserved: 0,
        available: destAvailable,
        reorderLevel: product?.reorderLevel ?? 2,
        stockStatus: deriveStockStatus(destAvailable, product?.reorderLevel ?? 2),
        batch: source.batch,
        lastCountedAt: new Date().toISOString(),
      })
    }

    replaceStockLedger(nextLedger)

    movements = [
      {
        id: `mov-${Date.now()}`,
        productId: source.productId,
        sku: product?.sku,
        productName: product?.name,
        facilityId: source.facilityId,
        type: "transfer",
        quantityChange: -qty,
        newQuantity: source.quantity - qty,
        reason: `${reason} → ${destination.name}`,
        userName,
        createdAt: new Date().toISOString(),
      },
      ...movements,
    ]

    return true
  } catch (error) {
    throw toAppError(error)
  }
}

export const getMovementsSnapshot = () => movements

export const removeProductStockData = (productId) => {
  movements = movements.filter((entry) => entry.productId !== productId)
}
