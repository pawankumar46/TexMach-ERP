import { useEffect, useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/ui/error-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { getBomComponentStock } from "@/services/bom.service"
import { formatNumber } from "@/lib/utils"

export const ComponentStockDialog = ({ open, component, onClose }) => {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open || !component) {
      return undefined
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const stock = await getBomComponentStock(component.id)
        if (!cancelled) {
          setRows(stock)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [open, component])

  const totalQuantity = rows.reduce((sum, row) => sum + row.quantity, 0)

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={component?.componentName ?? "Component stock"}
      description={
        component
          ? `${component.componentId} · ${component.variantName} (${component.variantId})`
          : undefined
      }
      footer={
        <div className="flex items-center justify-between gap-3">
          {!loading && !error && rows.length ? (
            <p className="text-sm text-muted">
              Total on hand: <span className="font-semibold text-navy-900">{formatNumber(totalQuantity)}</span>
            </p>
          ) : (
            <span />
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      {loading ? <TableSkeleton rows={4} /> : null}
      {!loading && error ? (
        <ErrorState title="Unable to load component stock" message={error} />
      ) : null}
      {!loading && !error && !rows.length ? (
        <p className="text-sm text-muted">This component is not stocked at any facility yet.</p>
      ) : null}
      {!loading && !error && rows.length ? (
        <div className="overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase tracking-wide text-navy-800">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Facility</th>
                <th className="px-3 py-2.5 font-semibold">Bin</th>
                <th className="px-3 py-2.5 font-semibold">Quantity</th>
                <th className="px-3 py-2.5 font-semibold">Available</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-line">
                  <td className="px-3 py-2.5">
                    <p className="font-medium text-navy-900">{row.facilityName}</p>
                    <p className="text-xs text-muted">
                      {row.facilityCode} · {row.city}
                    </p>
                  </td>
                  <td className="px-3 py-2.5">
                    <Badge tone="slate">{row.bin}</Badge>
                  </td>
                  <td className="px-3 py-2.5 font-semibold text-navy-900">
                    {formatNumber(row.quantity)}
                  </td>
                  <td className="px-3 py-2.5">{formatNumber(row.available)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Dialog>
  )
}
