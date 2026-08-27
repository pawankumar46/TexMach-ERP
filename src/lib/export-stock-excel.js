import { getFacilityById } from "@/data/facilities"
import { STOCK_STATUS_LABELS } from "@/constants/stock-status"

/**
 * Downloads the current stock ledger rows as an Excel (.xlsx) file.
 *
 * @param {Array<Object>} items
 * @param {{ fileName?: string }} [options]
 */
export const exportStockLedgerToExcel = async (items, options = {}) => {
  const XLSX = await import("xlsx")

  const rows = items.map((item) => {
    const facility = getFacilityById(item.facilityId)

    return {
      SKU: item.sku ?? "",
      Product: item.productName ?? "",
      Brand: item.brand ?? "",
      Category: item.category ?? "",
      Facility: facility?.name ?? "",
      "Facility code": facility?.code ?? "",
      City: facility?.city ?? "",
      Bin: item.bin ?? "",
      "On hand": item.quantity ?? 0,
      Reserved: item.reserved ?? 0,
      Available: item.available ?? 0,
      "Reorder level": item.reorderLevel ?? "",
      Status: STOCK_STATUS_LABELS[item.stockStatus] ?? item.stockStatus ?? "",
      Batch: item.batch ?? "",
    }
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet["!cols"] = [
    { wch: 14 },
    { wch: 36 },
    { wch: 12 },
    { wch: 18 },
    { wch: 28 },
    { wch: 12 },
    { wch: 12 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 12 },
    { wch: 12 },
    { wch: 12 },
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stock ledger")

  const stamp = new Date().toISOString().slice(0, 10)
  const fileName = options.fileName ?? `inventree-stock-ledger-${stamp}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
