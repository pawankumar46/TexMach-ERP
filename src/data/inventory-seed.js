import catalog from "@/data/hca-catalog.json"
import { deriveStockStatus } from "@/constants/stock-status"
import { MOVEMENT_TYPES } from "@/constants/movement-types"
import { FACILITIES } from "@/data/facilities"

const CATEGORY_RULES = [
  { test: /embroid|multi-head|9-color/i, category: "Embroidery" },
  { test: /cut|finish|press|pack|glue|cement|spray/i, category: "Cutting & Finishing" },
  { test: /auto|template|pocket|button feeder|ultrasonic|labeling/i, category: "Automation" },
  { test: /overlock|lockstitch|chain|coverstitch|flat|tacking|cord/i, category: "Sewing" },
  { test: /spare|attachment|needle/i, category: "Spares & Accessories" },
]

const hashString = (value) => {
  let hash = 2166136261
  for (const char of String(value)) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const pickCategory = (product) => {
  const haystack = `${product.name} ${product.sku} ${(product.tags || []).join(" ")}`
  const match = CATEGORY_RULES.find((rule) => rule.test.test(haystack))
  return match?.category ?? "Special Purpose"
}

export const PRODUCTS = catalog.map((item, index) => {
  const seed = hashString(item.handle || item.sku)
  const brand = item.category || "HCA"
  const reorderLevel = 2 + (seed % 4)
  const costPrice = 45000 + (seed % 85) * 12500
  const abcClass = ["A", "A", "B", "B", "C"][seed % 5]

  return {
    id: `prd-${item.sourceId}`,
    sourceId: item.sourceId,
    name: item.name,
    sku: item.sku,
    model: item.model || item.sku,
    brand,
    manufacturer: "Hari Chand Anand & Co.",
    category: pickCategory(item),
    image: item.image,
    handle: item.handle,
    catalogUrl: `https://www.grouphca.com/products/${item.handle}`,
    itemType: "fg",
    uom: "unit",
    reorderLevel,
    minQty: reorderLevel,
    maxQty: reorderLevel * 8,
    costPrice,
    abcClass,
    serialTracked: index % 3 !== 2,
  }
})

const facilityForIndex = (index, seed) => {
  if (seed % 11 === 0) {
    return FACILITIES
  }

  const count = 1 + (seed % 3)
  const start = (index + seed) % FACILITIES.length
  return Array.from({ length: count }, (_, offset) => {
    return FACILITIES[(start + offset) % FACILITIES.length]
  })
}

export const STOCK_ITEMS = PRODUCTS.flatMap((product, index) => {
  const seed = hashString(product.id)
  const facilities = facilityForIndex(index, seed)

  return facilities.map((facility, facilityIndex) => {
    const localSeed = hashString(`${product.id}-${facility.id}`)
    const quantity = localSeed % 17 === 0 ? 0 : 1 + (localSeed % 14)
    const reserved = quantity === 0 ? 0 : localSeed % 3
    const available = Math.max(quantity - reserved, 0)
    const bin = facility.bins[localSeed % facility.bins.length]
    const stockStatus = deriveStockStatus(available, product.reorderLevel)

    return {
      id: `stk-${product.id}-${facility.id}`,
      productId: product.id,
      facilityId: facility.id,
      warehouseName: facility.name,
      bin,
      quantity,
      reserved,
      available,
      reorderLevel: product.reorderLevel,
      stockStatus,
      batch: `LOT-${(localSeed % 9000) + 1000}`,
      lastCountedAt: new Date(Date.now() - (facilityIndex + 1) * 86400000 * ((localSeed % 6) + 1)).toISOString(),
    }
  })
})

const MOVEMENT_POOL = [
  MOVEMENT_TYPES.GRN,
  MOVEMENT_TYPES.PUTAWAY,
  MOVEMENT_TYPES.PICKING,
  MOVEMENT_TYPES.TRANSFER,
  MOVEMENT_TYPES.ADJUSTMENT,
  MOVEMENT_TYPES.SALE,
]

export const STOCK_MOVEMENTS = STOCK_ITEMS.slice(0, 36).map((item, index) => {
  const product = PRODUCTS.find((entry) => entry.id === item.productId)
  const type = MOVEMENT_POOL[index % MOVEMENT_POOL.length]
  const inbound = type === MOVEMENT_TYPES.GRN || type === MOVEMENT_TYPES.PUTAWAY || type === MOVEMENT_TYPES.ADJUSTMENT
  const quantityChange = inbound ? 1 + (index % 4) : -(1 + (index % 3))

  return {
    id: `mov-${index + 1}`,
    productId: item.productId,
    sku: product?.sku,
    productName: product?.name,
    facilityId: item.facilityId,
    type,
    quantityChange,
    newQuantity: Math.max(item.quantity, 0),
    reason:
      type === MOVEMENT_TYPES.TRANSFER
        ? "Sent to another HCA facility"
        : type === MOVEMENT_TYPES.GRN
          ? "Vendor delivery booked into stock"
          : type === MOVEMENT_TYPES.PICKING
            ? "Taken out for a customer order"
            : type === MOVEMENT_TYPES.SALE
              ? "Sold to a customer"
              : type === MOVEMENT_TYPES.PUTAWAY
                ? "Placed on a warehouse bin"
                : "Warehouse stock was updated",
    userName: index % 2 === 0 ? "Priya Nair" : "Rohit Mehra",
    createdAt: new Date(Date.now() - index * 3600000 * 5).toISOString(),
  }
})

export const getProductById = (productId) => {
  return PRODUCTS.find((product) => product.id === productId) ?? null
}

export const calculateStockValue = (quantity, costPrice) => {
  return quantity * costPrice
}

export const getAvailableStock = (quantity, reserved) => {
  return Math.max((quantity ?? 0) - (reserved ?? 0), 0)
}
