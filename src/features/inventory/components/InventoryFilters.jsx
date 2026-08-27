import { X } from "lucide-react"
import { Input, Label, Select } from "@/components/ui/input"
import { getInventoryMeta } from "@/services/inventory.service"

export const InventoryFilters = ({
  filters,
  onChange,
  view,
  onViewChange,
  hideBrand = false,
  hideStatus = false,
}) => {
  const { categories, brands } = getInventoryMeta()
  const hasSearch = Boolean(filters.search?.trim())

  return (
    <div className="mb-5 grid gap-3 rounded-2xl border border-line bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-5">
      <div>
        <Label htmlFor="inventory-search">Search</Label>
        <div className="relative">
          <Input
            id="inventory-search"
            value={filters.search}
            onChange={(event) => onChange({ search: event.target.value })}
            placeholder="Search machine, component, SKU, or brand"
            aria-label="Search inventory"
            className={hasSearch ? "pr-10" : undefined}
          />
          {hasSearch ? (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition-colors hover:text-navy-800"
              aria-label="Clear search"
              onClick={() => onChange({ search: "" })}
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>
      <div>
        <Label htmlFor="inventory-category">Category</Label>
        <Select
          id="inventory-category"
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
          aria-label="Filter by category"
        >
          <option value="all">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      {hideBrand ? null : (
        <div>
          <Label htmlFor="inventory-brand">Brand</Label>
          <Select
            id="inventory-brand"
            value={filters.brand}
            onChange={(event) => onChange({ brand: event.target.value })}
            aria-label="Filter by brand"
          >
            <option value="all">All</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </Select>
        </div>
      )}
      {hideStatus ? null : (
        <div>
          <Label htmlFor="inventory-status">Status</Label>
          <Select
            id="inventory-status"
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
            aria-label="Filter by stock status"
          >
            <option value="all">All</option>
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </Select>
        </div>
      )}
      <div>
        <Label id="inventory-view-label">View</Label>
        <div
          className="flex rounded-lg border border-line p-1"
          role="group"
          aria-labelledby="inventory-view-label"
        >
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold ${view === "grid" ? "bg-navy-800 text-white" : "text-navy-800"}`}
            onClick={() => onViewChange("grid")}
          >
            Grid
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-semibold ${view === "table" ? "bg-navy-800 text-white" : "text-navy-800"}`}
            onClick={() => onViewChange("table")}
          >
            Table
          </button>
        </div>
      </div>
    </div>
  )
}
