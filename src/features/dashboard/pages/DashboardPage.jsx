import { useEffect } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Package,
  ScanLine,
  TrendingUp,
} from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ErrorState } from "@/components/ui/error-state"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { ProductImage } from "@/components/inventory/ProductImage"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { USER_ROLES } from "@/constants/roles"
import { getScanTaskLabel } from "@/constants/scan-tasks"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { calculateStockValue } from "@/data/inventory-seed"
import { useAuthStore } from "@/store/useAuthStore"
import { useFacilityStore } from "@/store/useFacilityStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import { useStockStore } from "@/store/useStockStore"
import { useWarehouseStore } from "@/store/useWarehouseStore"
import { useScanStore } from "@/store/useScanStore"
import { StockMovementQty, StockMovementWhatHappened } from "@/components/inventory/StockMovementCopy"

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const items = useInventoryStore((state) => state.items)
  const inventoryLoading = useInventoryStore((state) => state.loading)
  const inventoryError = useInventoryStore((state) => state.error)
  const fetchInventory = useInventoryStore((state) => state.fetchInventory)
  const movements = useStockStore((state) => state.movements)
  const fetchStock = useStockStore((state) => state.fetchStock)
  const fetchMovements = useStockStore((state) => state.fetchMovements)
  const facilities = useWarehouseStore((state) => state.facilities)
  const fetchFacilities = useWarehouseStore((state) => state.fetchFacilities)
  const tasks = useScanStore((state) => state.tasks)
  const fetchTasks = useScanStore((state) => state.fetchTasks)

  useEffect(() => {
    fetchInventory({ search: "", category: "all", brand: "all", status: "all" })
    if (user?.role !== USER_ROLES.VENDOR) {
      fetchStock()
      fetchMovements()
      fetchTasks()
    }
    if (user?.role === USER_ROLES.SUPER_ADMIN || user?.role === USER_ROLES.STORE_MANAGER) {
      fetchFacilities()
    }
  }, [fetchInventory, fetchStock, fetchMovements, fetchFacilities, fetchTasks, user, selectedFacilityId])

  if (inventoryLoading && !items.length) {
    return <PageSkeleton />
  }

  if (inventoryError) {
    return <ErrorState message={inventoryError} onRetry={fetchInventory} />
  }

  const skuCount = items.length
  const totalUnits = items.reduce((sum, item) => sum + item.totalQuantity, 0)
  const stockValue = items.reduce(
    (sum, item) => sum + calculateStockValue(item.totalQuantity, item.costPrice),
    0,
  )
  const lowStock = items.filter((item) =>
    item.stockRows.some((row) => row.stockStatus === "low_stock" || row.stockStatus === "out_of_stock"),
  )
  const openTasks = tasks.filter((task) => task.status === "open")

  if (user?.role === USER_ROLES.VENDOR) {
    return (
      <div>
        <PageHeader
          title={`Welcome, ${user.name}`}
          description="Add and update Duke catalog items. Warehouse stock, transfers, and scanning stay with HCA. PO/ASN lands in Phase 2."
          actions={
            <Link
              to="/inventory"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Manage catalog <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900">
            You can add new machines and edit name, SKU, photo, and category for Duke items. Internal stock quantities remain hidden.
          </p>
        </Card>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.slice(0, 6).map((item) => (
            <Link key={item.id} to={`/inventory/${item.id}`}>
              <Card className="flex gap-4 hover:shadow-md">
                <ProductImage src={item.image} alt={item.name} className="h-20 w-20 rounded-xl" />
                <div>
                  <p className="text-xs font-semibold text-navy-600">{item.sku}</p>
                  <p className="font-semibold text-navy-900">{item.name}</p>
                  <p className="text-xs text-muted">{item.category}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Good day, ${user?.name?.split(" ")[0]}`}
        description="Stock across HCA stores — what we have, what is running low, and what still needs to be scanned."
        actions={
          user?.role === USER_ROLES.USER ? (
            <Link
              to="/scan"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-800 px-4 text-sm font-semibold text-white hover:bg-navy-700"
            >
              Scan waiting machines <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Package} label="Different products" value={formatNumber(skuCount)} hint="How many machine models we stock" />
        <SummaryCard icon={Building2} label="Machines in store" value={formatNumber(totalUnits)} hint="Physical units at the stores you can see" />
        <SummaryCard icon={TrendingUp} label="Stock value" value={formatCurrency(stockValue)} hint="Number of machines × unit cost" />
        <SummaryCard
          icon={AlertTriangle}
          label="Running low"
          value={formatNumber(lowStock.length)}
          hint="Products that need restocking"
          tone="amber"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-navy-900">Running low</h2>
            <Link to="/inventory" className="text-sm font-medium text-navy-700 hover:underline">
              See all products
            </Link>
          </div>
          <div className="space-y-3">
            {lowStock.slice(0, 5).map((item) => (
              <Link key={item.id} to={`/inventory/${item.id}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-navy-50">
                <ProductImage src={item.image} alt="" className="h-12 w-12 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-navy-900">{item.name}</p>
                  <p className="text-xs text-muted">{item.sku}</p>
                </div>
                <StockStatusBadge
                  status={item.totalAvailable <= 0 ? "out_of_stock" : "low_stock"}
                />
              </Link>
            ))}
            {!lowStock.length ? <p className="text-sm text-muted">Nothing is running low right now.</p> : null}
          </div>
        </Card>

        <Card>
          <div className="mb-1 flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-navy-900">Machines waiting to be scanned</h2>
            <Badge tone="navy">{openTasks.length} left</Badge>
          </div>
          <p className="mb-4 text-sm leading-6 text-muted">
            A checklist for store staff. Point a handheld scanner at the machine — like ticking an item off a list — so the system knows what arrived, what was stored, or what went out.
          </p>
          {openTasks.length ? (
            <ul className="space-y-3">
              {openTasks.slice(0, 4).map((task) => (
                <li key={task.id} className="flex items-start gap-3">
                  <ScanLine className="mt-0.5 h-4 w-4 shrink-0 text-navy-700" />
                  <div>
                    <p className="text-sm font-medium text-navy-900">{getScanTaskLabel(task.type)}</p>
                    <p className="text-xs text-muted">{task.productName}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">Nothing is waiting to be scanned.</p>
          )}
          <Link to="/scan" className="mt-4 inline-flex text-sm font-medium text-navy-700 hover:underline">
            Go scan these machines
          </Link>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="text-base font-semibold text-navy-900">Recent stock movements</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            Each row is one change: which machine, what happened, and whether stock went up or down.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">What happened</th>
                  <th className="pb-3 font-semibold">Stock change</th>
                  <th className="pb-3 font-semibold">Done by</th>
                </tr>
              </thead>
              <tbody>
                {movements.slice(0, 6).map((movement) => (
                  <tr key={movement.id} className="border-t border-line">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-navy-900">{movement.productName}</p>
                      <p className="text-xs text-muted">Code: {movement.sku}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <StockMovementWhatHappened type={movement.type} />
                    </td>
                    <td className="py-3 pr-4">
                      <StockMovementQty quantityChange={movement.quantityChange} />
                    </td>
                    <td className="py-3 text-muted">{movement.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {facilities.length ? (
          <Card>
            <h2 className="mb-1 text-base font-semibold text-navy-900">How full each store is</h2>
            <p className="mb-4 text-sm text-muted">A higher bar means more of the warehouse space is in use.</p>
            <div className="space-y-4">
              {facilities.map((facility) => (
                <div key={facility.id}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-navy-900">{facility.name}</span>
                    <span className="text-muted">{facility.utilization}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-navy-700"
                      style={{ width: `${facility.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  )
}

const SummaryCard = ({ icon: Icon, label, value, hint, tone }) => {
  return (
    <Card className={tone === "amber" ? "border-amber-200" : undefined}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-800">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy-900">{value}</p>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </Card>
  )
}
