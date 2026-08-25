import { useEffect } from "react"
import { MapPin } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { useWarehouseStore } from "@/store/useWarehouseStore"
import { useFacilityStore, ALL_FACILITIES } from "@/store/useFacilityStore"
import { formatCurrency, formatNumber } from "@/lib/utils"

export const WarehousesPage = () => {
  const facilities = useWarehouseStore((state) => state.facilities)
  const loading = useWarehouseStore((state) => state.loading)
  const error = useWarehouseStore((state) => state.error)
  const fetchFacilities = useWarehouseStore((state) => state.fetchFacilities)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const setFacility = useFacilityStore((state) => state.setFacility)

  useEffect(() => {
    fetchFacilities()
  }, [fetchFacilities, selectedFacilityId])

  if (loading && !facilities.length) {
    return <PageSkeleton />
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchFacilities} />
  }

  if (!facilities.length) {
    return (
      <EmptyState
        title="No facilities in scope"
        description="This persona cannot see warehouse records."
      />
    )
  }

  return (
    <div>
      <PageHeader
        title="Multi-facility warehouses"
        description="Facility → warehouse → bin hierarchy with utilization and stock value. Toggle a facility to scope every other screen."
        actions={
          <button
            type="button"
            className="h-10 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-navy-900 hover:bg-navy-50"
            onClick={() => setFacility(ALL_FACILITIES)}
          >
            Consolidated view
          </button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {facilities.map((facility) => (
          <Card
            key={facility.id}
            className={selectedFacilityId === facility.id ? "ring-2 ring-navy-700" : undefined}
            onClick={() => setFacility(facility.id)}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">{facility.code}</p>
                <h2 className="text-lg font-bold text-navy-900">{facility.name}</h2>
              </div>
              <Badge tone="navy">{facility.type}</Badge>
            </div>
            <p className="mb-4 flex items-start gap-2 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              {facility.address}, {facility.city}
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">SKUs</dt>
                <dd className="font-semibold text-navy-900">{formatNumber(facility.skuCount)}</dd>
              </div>
              <div>
                <dt className="text-muted">Units</dt>
                <dd className="font-semibold text-navy-900">{formatNumber(facility.occupied)}</dd>
              </div>
              <div>
                <dt className="text-muted">Value</dt>
                <dd className="font-semibold text-navy-900">{formatCurrency(facility.value)}</dd>
              </div>
              <div>
                <dt className="text-muted">Attention</dt>
                <dd className="font-semibold text-navy-900">{facility.lowStock} SKUs</dd>
              </div>
            </dl>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-xs text-muted">
                <span>Space utilization</span>
                <span>{facility.utilization}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-navy-700" style={{ width: `${facility.utilization}%` }} />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {facility.bins.map((bin) => (
                <Badge key={bin} tone="slate">
                  {bin}
                </Badge>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
