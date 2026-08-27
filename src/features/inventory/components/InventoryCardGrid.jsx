import { Link } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Stagger, StaggerItem } from "@/components/ui/motion"
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

export const InventoryCardGrid = ({ items, onEdit, onDelete }) => {
  const user = useAuthStore((state) => state.user)
  const hideStock = user?.role === USER_ROLES.VENDOR

  return (
    <Stagger className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <StaggerItem key={item.id}>
          <Card interactive className="flex h-full flex-col overflow-hidden p-0">
            <Link to={`/inventory/${item.id}`} className="group block overflow-hidden">
              <ProductImage
                src={item.image}
                alt={item.name}
                className="h-44 w-full bg-slate-50 transition-transform duration-300 ease-out group-hover:scale-[1.03]"
              />
            </Link>
            <div className="flex flex-1 flex-col p-4">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold text-navy-700">{item.sku}</p>
                {hideStock ? (
                  <Badge tone="slate">{item.brand}</Badge>
                ) : (
                  <StockStatusBadge status={productStatus(item)} />
                )}
              </div>
              <Link to={`/inventory/${item.id}`}>
                <h3 className="line-clamp-2 text-base font-semibold text-navy-900 transition-colors hover:text-navy-700 hover:underline">
                  {item.name}
                </h3>
              </Link>
              <p className="mt-1 text-sm text-muted">
                {item.brand} · {item.category}
              </p>

              {item.matchedComponents?.length ? (
                <div className="mt-3 rounded-xl border border-navy-100 bg-navy-50/80 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">
                    Matched components
                  </p>
                  <p className="mt-1 text-xs text-muted">On machine: {item.name}</p>
                  <ul className="mt-2 space-y-1.5">
                    {item.matchedComponents.slice(0, 4).map((component) => (
                      <li key={component.id} className="text-sm text-navy-900">
                        <span className="font-medium">{component.componentName}</span>
                        <span className="mt-0.5 block font-mono text-xs text-muted">
                          {component.componentId} · {component.variantName}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {item.matchedComponents.length > 4 ? (
                    <p className="mt-2 text-xs text-muted">
                      +{item.matchedComponents.length - 4} more in bill of materials
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                {hideStock ? (
                  <Badge tone="gold">Supplier catalog</Badge>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-navy-900">
                      {formatNumber(item.totalQuantity)} units
                    </span>
                    <Badge tone="slate">{item.facilityCount} venues</Badge>
                  </>
                )}
                {canManageInventoryItem(user, item) ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
                      Delete
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        </StaggerItem>
      ))}
    </Stagger>
  )
}
