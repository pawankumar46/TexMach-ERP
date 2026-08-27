import { X } from "lucide-react"
import { Input, Select } from "@/components/ui/input"
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
      <div className="relative">
        <Input
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
      <Select
        value={filters.category}
        onChange={(event) => onChange({ category: event.target.value })}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
      {hideBrand ? null : (
        <Select
          value={filters.brand}
          onChange={(event) => onChange({ brand: event.target.value })}
          aria-label="Filter by brand"
        >
          <option value="all">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </Select>
      )}
      {hideStatus ? null : (
        <Select
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value })}
          aria-label="Filter by stock status"
        >
          <option value="all">All stock statuses</option>
          <option value="in_stock">In stock</option>
          <option value="low_stock">Low stock</option>
          <option value="out_of_stock">Out of stock</option>
        </Select>
      )}
      <div className="flex rounded-lg border border-line p-1">
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
  )
}
