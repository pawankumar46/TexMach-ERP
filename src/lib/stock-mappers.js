import { deriveStockStatus } from "@/constants/stock-status"

export const mapStockItem = (item, product) => {
  const available = Math.max((item.quantity ?? 0) - (item.reserved ?? 0), 0)

  return {
    ...item,
    available,
    stockStatus: deriveStockStatus(available, product?.reorderLevel ?? item.reorderLevel ?? 0),
    productName: product?.name,
    sku: product?.sku,
    image: product?.image,
    brand: product?.brand,
    category: product?.category,
    costPrice: product?.costPrice,
    reorderLevel: product?.reorderLevel ?? item.reorderLevel,
  }
}

export const toStockAdjustment = (values) => {
  return {
    stockId: values.stockId,
    quantityChange: Number(values.quantityChange),
    reason: values.reason,
    movementType: values.movementType,
  }
}
