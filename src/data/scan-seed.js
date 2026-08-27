import { PRODUCT_BOM, COMPONENT_FACILITY_STOCK } from "@/data/bom-seed"
import { PRODUCTS } from "@/data/inventory-seed"
import { SCAN_TASK_TYPES } from "@/constants/scan-tasks"

const TASK_TYPES = [
  SCAN_TASK_TYPES.ASSIGN_WAREHOUSE,
  SCAN_TASK_TYPES.RETAIN_IN_STORE,
  SCAN_TASK_TYPES.SCRAP,
  SCAN_TASK_TYPES.EXCHANGE,
]

/**
 * Component scan queue — seeded from BOM parts (not finished machines).
 * New arrivals / GRN are intentionally excluded.
 */
export const SCAN_TASKS = PRODUCT_BOM.slice(0, 16).map((bomRow, index) => {
  const product = PRODUCTS.find((entry) => entry.id === bomRow.productId)
  const stockRows = COMPONENT_FACILITY_STOCK.filter((row) => row.bomId === bomRow.id)
  const stock = stockRows[index % Math.max(stockRows.length, 1)] ?? stockRows[0]
  const type = TASK_TYPES[index % TASK_TYPES.length]
  const barcode = String(bomRow.componentId).replace(/\s+/g, "")

  return {
    id: `ctask-${index + 1}`,
    type,
    status: index % 6 === 0 ? "completed" : "open",
    productId: bomRow.productId,
    bomId: bomRow.id,
    componentId: bomRow.componentId,
    componentName: bomRow.componentName,
    variantId: bomRow.variantId,
    variantName: bomRow.variantName,
    sku: product?.sku,
    productName: product?.name,
    image: product?.image,
    facilityId: stock?.facilityId ?? "del-hq",
    barcode,
    expectedQty: 1,
    bin: stock?.bin ?? "A-01",
    reference:
      type === SCAN_TASK_TYPES.ASSIGN_WAREHOUSE
        ? `WH-ASN-${200 + index}`
        : type === SCAN_TASK_TYPES.RETAIN_IN_STORE
          ? `RET-${300 + index}`
          : type === SCAN_TASK_TYPES.SCRAP
            ? `SCR-${400 + index}`
            : `EXC-${500 + index}`,
    disposition: null,
    completedAt: index % 6 === 0 ? new Date(Date.now() - index * 7200000).toISOString() : null,
  }
})
