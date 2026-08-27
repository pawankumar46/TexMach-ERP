import { Link } from "react-router-dom"
import { Layers } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * Flat list of BOM components matched by the current inventory search,
 * each linked to its parent machine.
 */
export const InventoryComponentMatches = ({ items, search }) => {
  const query = search?.trim()
  if (!query) {
    return null
  }

  const rows = items.flatMap((item) =>
    (item.matchedComponents ?? []).map((component) => ({
      ...component,
      machineId: item.id,
      machineName: item.name,
      machineSku: item.sku,
      machineImage: item.image,
    })),
  )

  if (!rows.length) {
    return null
  }

  return (
    <Card className="mb-5 border-navy-100 bg-navy-50/60">
      <div className="mb-3 flex items-center gap-2">
        <Layers className="h-4 w-4 text-navy-700" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-navy-900">
          Matching components ({rows.length})
        </h2>
      </div>
      <p className="mb-3 text-xs text-muted">
        Components that match “{query}”, with the main machine they belong to.
      </p>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-navy-800">
            <tr>
              <th className="px-3 py-2.5 font-semibold">Component</th>
              <th className="px-3 py-2.5 font-semibold">Component ID</th>
              <th className="px-3 py-2.5 font-semibold">Variant</th>
              <th className="px-3 py-2.5 font-semibold">Main machine</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.machineId}-${row.id}`} className="border-t border-line">
                <td className="px-3 py-2.5 font-medium text-navy-900">{row.componentName}</td>
                <td className="px-3 py-2.5 font-mono text-xs text-navy-700">{row.componentId}</td>
                <td className="px-3 py-2.5">
                  <Badge tone="slate">{row.variantName}</Badge>
                </td>
                <td className="px-3 py-2.5">
                  <Link
                    to={`/inventory/${row.machineId}`}
                    className="font-medium text-navy-800 hover:underline"
                  >
                    {row.machineName}
                  </Link>
                  <p className="font-mono text-xs text-muted">{row.machineSku}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
