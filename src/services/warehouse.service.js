import { delay } from "@/lib/utils"
import { toAppError } from "@/lib/api-errors"
import { FACILITIES } from "@/data/facilities"
import { calculateStockValue } from "@/data/inventory-seed"
import { getProductCatalog, getStockLedgerSnapshot } from "@/services/inventory.service"

const scopeFacilities = (user) => {
  if (user?.canViewAllFacilities) {
    return FACILITIES
  }

  const allowed = new Set(user?.facilityIds ?? [])
  return FACILITIES.filter((facility) => allowed.has(facility.id))
}

export const getFacilities = async (user) => {
  try {
    await delay(300)
    const ledger = getStockLedgerSnapshot()
    const productById = Object.fromEntries(getProductCatalog().map((product) => [product.id, product]))

    return scopeFacilities(user).map((facility) => {
      const rows = ledger.filter((item) => item.facilityId === facility.id)
      const occupied = rows.reduce((sum, item) => sum + item.quantity, 0)
      const value = rows.reduce((sum, item) => {
        const product = productById[item.productId]
        return sum + calculateStockValue(item.quantity, product?.costPrice ?? 0)
      }, 0)
      const skuCount = new Set(rows.map((item) => item.productId)).size
      const lowStock = rows.filter((item) => item.stockStatus === "low_stock" || item.available <= 0).length
      const utilization = Math.min(Math.round((occupied / facility.capacityUnits) * 100), 100)

      return {
        ...facility,
        occupied,
        value,
        skuCount,
        lowStock,
        utilization,
      }
    })
  } catch (error) {
    throw toAppError(error)
  }
}
