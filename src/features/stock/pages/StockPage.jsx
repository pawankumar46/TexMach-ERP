import { useEffect, useState } from "react"
import { Download, PackageSearch } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Input, Label, Select } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { ProductImage } from "@/components/inventory/ProductImage"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { StockAdjustmentDialog } from "@/features/stock/components/StockAdjustmentDialog"
import { TransferDialog } from "@/features/stock/components/TransferDialog"
import { useStockStore } from "@/store/useStockStore"
import { useFacilityStore } from "@/store/useFacilityStore"
import { useAuthStore } from "@/store/useAuthStore"
import { PERMISSIONS } from "@/constants/roles"
import { FACILITIES, getFacilityById } from "@/data/facilities"
import { formatDateTime, formatNumber } from "@/lib/utils"
import { exportStockLedgerToExcel } from "@/lib/export-stock-excel"
import { StockMovementQty, StockMovementWhatHappened } from "@/components/inventory/StockMovementCopy"

export const StockPage = () => {
  const user = useAuthStore((state) => state.user)
  const can = useAuthStore((state) => state.can)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const items = useStockStore((state) => state.items)
  const movements = useStockStore((state) => state.movements)
  const loading = useStockStore((state) => state.loading)
  const error = useStockStore((state) => state.error)
  const filters = useStockStore((state) => state.filters)
  const setFilters = useStockStore((state) => state.setFilters)
  const fetchStock = useStockStore((state) => state.fetchStock)
  const fetchMovements = useStockStore((state) => state.fetchMovements)
  const [adjusting, setAdjusting] = useState(null)
  const [transferring, setTransferring] = useState(null)
  const [exporting, setExporting] = useState(false)

  const assignedIds = user?.facilityIds ?? []
  const facilityOptions = user?.canViewAllFacilities
    ? FACILITIES
    : FACILITIES.filter((facility) => assignedIds.includes(facility.id))

  useEffect(() => {
    if (filters.facilityId === "all") {
      return
    }

    const stillAllowed = facilityOptions.some((facility) => facility.id === filters.facilityId)
    if (!stillAllowed) {
      setFilters({ facilityId: "all", tag: "all" })
    }
  }, [facilityOptions, filters.facilityId, setFilters])

  const binOptions = (() => {
    const venues =
      filters.facilityId === "all"
        ? facilityOptions
        : facilityOptions.filter((facility) => facility.id === filters.facilityId)

    return [...new Set(venues.flatMap((facility) => facility.bins ?? []))].sort()
  })()

  useEffect(() => {
    if (filters.tag === "all") {
      return
    }

    if (!binOptions.includes(filters.tag)) {
      setFilters({ tag: "all" })
    }
  }, [binOptions, filters.tag, setFilters])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchStock()
      fetchMovements()
    }, filters.search ? 280 : 0)

    return () => window.clearTimeout(timer)
  }, [fetchStock, fetchMovements, filters, selectedFacilityId, user])

  const handleExport = async () => {
    if (!items.length) {
      toast.error("Nothing to export for the current filters.")
      return
    }

    setExporting(true)
    try {
      await exportStockLedgerToExcel(items)
      toast.success("Stock ledger exported to Excel.")
    } catch (exportError) {
      toast.error(exportError.message || "Unable to export Excel file.")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Stock ledger"
        description="On-hand, reserved, and available quantities by facility bin."
        actions={
          <Button
            variant="secondary"
            onClick={handleExport}
            loading={exporting}
            disabled={loading || !items.length}
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        }
      />
      <div className="mb-5 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="stock-search">Search</Label>
          <Input
            id="stock-search"
            value={filters.search}
            onChange={(event) => setFilters({ search: event.target.value })}
            placeholder="Search SKU, product, or bin"
            aria-label="Search stock"
          />
        </div>
        <div>
          <Label htmlFor="stock-venue">Venue</Label>
          <Select
            id="stock-venue"
            value={filters.facilityId}
            onChange={(event) => setFilters({ facilityId: event.target.value, tag: "all" })}
            aria-label="Filter by venue"
          >
            <option value="all">All</option>
            {facilityOptions.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name} ({facility.code})
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="stock-tag">Tags</Label>
          <Select
            id="stock-tag"
            value={filters.tag}
            onChange={(event) => setFilters({ tag: event.target.value })}
            aria-label="Filter by bin tag"
          >
            <option value="all">All</option>
            {binOptions.map((bin) => (
              <option key={bin} value={bin}>
                {bin}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="stock-status">Status</Label>
          <Select
            id="stock-status"
            value={filters.status}
            onChange={(event) => setFilters({ status: event.target.value })}
            aria-label="Filter stock status"
          >
            <option value="all">All</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </Select>
        </div>
      </div>

      {loading ? <TableSkeleton rows={8} /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={fetchStock} /> : null}
      {!loading && !error && !items.length ? (
        <EmptyState
          icon={PackageSearch}
          title="No stock rows"
          description="Nothing matches this facility or filter."
        />
      ) : null}

      {!loading && !error && items.length ? (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-5xl text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase text-navy-800">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Venue / bin</th>
                <th className="px-4 py-3">On hand</th>
                <th className="px-4 py-3">Reserved</th>
                <th className="px-4 py-3">Available</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const facility = getFacilityById(item.facilityId)
                return (
                  <tr key={item.id} className="border-t border-line">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage src={item.image} alt="" className="h-11 w-11 rounded-lg" />
                        <div>
                          <p className="max-w-xs font-medium text-navy-900">{item.productName}</p>
                          <p className="font-mono text-xs text-muted">{item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p>{facility?.name}</p>
                      <Badge tone="slate">{item.bin}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatNumber(item.quantity)}</td>
                    <td className="px-4 py-3">{item.reserved}</td>
                    <td className="px-4 py-3">{item.available}</td>
                    <td className="px-4 py-3">
                      <StockStatusBadge status={item.stockStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {can(PERMISSIONS.STOCK_ADJUST) ? (
                          <Button size="sm" variant="secondary" onClick={() => setAdjusting(item)}>
                            Adjust
                          </Button>
                        ) : null}
                        {can(PERMISSIONS.STOCK_TRANSFER) ? (
                          <Button size="sm" variant="secondary" onClick={() => setTransferring(item)}>
                            Transfer
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-navy-900">Movement history</h2>
        <p className="mb-3 mt-1 text-sm text-muted">
          A full list of stock adds and removes for the facilities you can see.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase text-navy-800">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">What happened</th>
                <th className="px-4 py-3">Stock change</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, 12).map((movement) => (
                <tr key={movement.id} className="border-t border-line">
                  <td className="px-4 py-3 text-muted">{formatDateTime(movement.createdAt)}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{movement.productName}</p>
                    <p className="text-xs text-muted">Code: {movement.sku}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StockMovementWhatHappened type={movement.type} />
                  </td>
                  <td className="px-4 py-3">
                    <StockMovementQty quantityChange={movement.quantityChange} />
                  </td>
                  <td className="px-4 py-3 text-muted">{movement.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {adjusting ? (
        <StockAdjustmentDialog stock={adjusting} open onClose={() => setAdjusting(null)} />
      ) : null}
      {transferring ? (
        <TransferDialog stock={transferring} open onClose={() => setTransferring(null)} />
      ) : null}
    </div>
  )
}
