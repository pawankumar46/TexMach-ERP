import { useMemo, useState } from "react"
import { Layers, Search, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { ComponentStockDialog } from "@/features/inventory/components/ComponentStockDialog"
import { formatNumber } from "@/lib/utils"

const matchesBomSearch = (row, query) => {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return [row.componentId, row.componentName, row.variantId, row.variantName]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(q))
}

export const BillOfMaterialsTable = ({ rows, loading, error, onRetry }) => {
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState("")

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesBomSearch(row, search)),
    [rows, search],
  )

  if (loading) {
    return <TableSkeleton rows={6} />
  }

  if (error) {
    return <ErrorState title="Unable to load bill of materials" message={error} onRetry={onRetry} />
  }

  if (!rows.length) {
    return (
      <EmptyState
        icon={Layers}
        title="No bill of materials yet"
        description="BOM components are available for the first five catalog machines. Other products will get full BOM coverage in a later pass."
      />
    )
  }

  return (
    <>
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9 pr-9"
            placeholder="Search components…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search bill of materials components"
          />
          {search ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted transition hover:bg-navy-50 hover:text-navy-900"
              onClick={() => setSearch("")}
              aria-label="Clear component search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
        <Badge tone="navy">
          {search.trim()
            ? `${formatNumber(filteredRows.length)} of ${formatNumber(rows.length)} components`
            : `${formatNumber(rows.length)} components`}
        </Badge>
      </div>

      {!filteredRows.length ? (
        <EmptyState
          icon={Search}
          title="No matching components"
          description="Try a different component ID, name, or variant."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-800">
              <tr>
                <th className="px-4 py-3 font-semibold">Component ID</th>
                <th className="px-4 py-3 font-semibold">Component name</th>
                <th className="px-4 py-3 font-semibold">Variant ID</th>
                <th className="px-4 py-3 font-semibold">Variant name</th>
                <th className="px-4 py-3 font-semibold">Est. time to procure</th>
                <th className="px-4 py-3 font-semibold">Vendors</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-t border-line transition-colors hover:bg-navy-50"
                  tabIndex={0}
                  aria-label={`View stock locations for ${row.componentName}`}
                  onClick={() => setSelected(row)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      setSelected(row)
                    }
                  }}
                >
                  <td className="px-4 py-3 font-mono text-xs text-navy-800">{row.componentId}</td>
                  <td className="px-4 py-3 font-medium text-navy-900">{row.componentName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{row.variantId}</td>
                  <td className="px-4 py-3">{row.variantName}</td>
                  <td className="px-4 py-3">
                    <Badge tone="slate">{row.estimatedTimeToProcure}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy-900">
                    {formatNumber(row.vendorCount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ComponentStockDialog
        open={Boolean(selected)}
        component={selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
