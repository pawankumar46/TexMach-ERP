import { toTitleCase } from "@/lib/utils"

export const mapInventoryProduct = (product, stockRows = []) => {
  const totalQuantity = stockRows.reduce((sum, row) => sum + (row.quantity ?? 0), 0)
  const totalAvailable = stockRows.reduce((sum, row) => sum + (row.available ?? 0), 0)
  const facilityCount = new Set(stockRows.map((row) => row.facilityId)).size

  return {
    ...product,
    totalQuantity,
    totalAvailable,
    facilityCount,
    stockRows,
  }
}

export const toProductPayload = (values) => {
  const sku = values.sku.trim()

  return {
    name: toTitleCase(values.name.trim()),
    sku,
    model: values.model?.trim() || sku,
    brand: values.brand.trim(),
    category: values.category,
    image: values.image?.trim() || "",
    reorderLevel: Number(values.reorderLevel),
    costPrice: Number(values.costPrice),
  }
}

