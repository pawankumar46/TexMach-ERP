import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductImage } from "@/components/inventory/ProductImage"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { formatNumber } from "@/lib/utils"
import { USER_ROLES, canManageInventoryItem } from "@/constants/roles"
import { useAuthStore } from "@/store/useAuthStore"

const productStatus = (item) => {
  if (item.totalAvailable <= 0) {
    return "out_of_stock"
  }

  if (item.stockRows.some((row) => row.stockStatus === "low_stock")) {
    return "low_stock"
  }

  return "in_stock"
}

export const InventoryCardGrid = ({ items, onEdit }) => {
  const user = useAuthStore((state) => state.user)
  const hideStock = user?.role === USER_ROLES.VENDOR

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id} className="flex h-full flex-col overflow-hidden p-0">
          <Link to={`/inventory/${item.id}`} className="block">
            <ProductImage src={item.image} alt={item.name} className="h-44 w-full bg-slate-50" />
          </Link>
          <div className="flex flex-1 flex-col p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-navy-700">{item.sku}</p>
              {hideStock ? <Badge tone="slate">{item.brand}</Badge> : <StockStatusBadge status={productStatus(item)} />}
            </div>
            <Link to={`/inventory/${item.id}`}>
              <h3 className="line-clamp-2 text-base font-semibold text-navy-900 hover:underline">{item.name}</h3>
            </Link>
            <p className="mt-1 text-sm text-muted">
              {item.brand} · {item.category}
            </p>
            <div className="mt-4 flex items-center justify-between gap-2">
              {hideStock ? (
                <Badge tone="gold">Supplier catalog</Badge>
              ) : (
                <>
                  <span className="text-sm font-semibold text-navy-900">
                    {formatNumber(item.totalQuantity)} units
                  </span>
                  <Badge tone="slate">{item.facilityCount} facilities</Badge>
                </>
              )}
              {canManageInventoryItem(user, item) ? (
                <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
                  Edit
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
