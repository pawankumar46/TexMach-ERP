import { Link } from "react-router-dom"
import { ProductImage } from "@/components/inventory/ProductImage"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { Button } from "@/components/ui/button"
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

export const InventoryTable = ({ items, onEdit, onDelete }) => {
  const user = useAuthStore((state) => state.user)
  const hideStock = user?.role === USER_ROLES.VENDOR
  const showActions = items.some((item) => canManageInventoryItem(user, item))

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
      <table className="w-full min-w-[52rem] text-left text-sm">
        <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-800">
          <tr>
            <th className="px-4 py-3 font-semibold">Product</th>
            <th className="px-4 py-3 font-semibold">SKU</th>
            <th className="px-4 py-3 font-semibold">Brand</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            {hideStock ? null : (
              <>
                <th className="px-4 py-3 font-semibold">On hand</th>
                <th className="px-4 py-3 font-semibold">Facilities</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </>
            )}
            {showActions ? <th className="px-4 py-3 font-semibold">Actions</th> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-line hover:bg-navy-50/60">
              <td className="px-4 py-3">
                <Link to={`/inventory/${item.id}`} className="flex items-center gap-3">
                  <ProductImage src={item.image} alt="" className="h-12 w-12 rounded-lg" />
                  <span className="max-w-xs font-medium text-navy-900">{item.name}</span>
                </Link>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{item.sku}</td>
              <td className="px-4 py-3">{item.brand}</td>
              <td className="px-4 py-3">{item.category}</td>
              {hideStock ? null : (
                <>
                  <td className="px-4 py-3 font-semibold">{formatNumber(item.totalQuantity)}</td>
                  <td className="px-4 py-3">{item.facilityCount}</td>
                  <td className="px-4 py-3">
                    <StockStatusBadge status={productStatus(item)} />
                  </td>
                </>
              )}
              {showActions ? (
                <td className="px-4 py-3">
                  {canManageInventoryItem(user, item) ? (
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onEdit(item)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(item)}>
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
