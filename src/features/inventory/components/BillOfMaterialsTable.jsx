import { useState } from "react"
import { Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { ErrorState } from "@/components/ui/error-state"
import { ComponentStockDialog } from "@/features/inventory/components/ComponentStockDialog"
import { formatNumber } from "@/lib/utils"

export const BillOfMaterialsTable = ({ rows, loading, error, onRetry }) => {
  const [selected, setSelected] = useState(null)

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
            {rows.map((row) => (
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

      <ComponentStockDialog
        open={Boolean(selected)}
        component={selected}
        onClose={() => setSelected(null)}
      />
    </>
  )
}
