import { useEffect, useState } from "react"
import { MapPin } from "lucide-react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select } from "@/components/ui/input"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { useWarehouseStore } from "@/store/useWarehouseStore"
import { useFacilityStore, ALL_FACILITIES } from "@/store/useFacilityStore"
import { VENUE_TYPES, VENUE_TYPE_LABELS, getVenueTypeLabel } from "@/constants/venue-types"
import { formatCurrency, formatNumber } from "@/lib/utils"

export const WarehousesPage = () => {
  const facilities = useWarehouseStore((state) => state.facilities)
  const loading = useWarehouseStore((state) => state.loading)
  const error = useWarehouseStore((state) => state.error)
  const fetchFacilities = useWarehouseStore((state) => state.fetchFacilities)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const setFacility = useFacilityStore((state) => state.setFacility)
  const [venueTypeFilter, setVenueTypeFilter] = useState("all")

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
        title="No venues in scope"
        description="This account cannot see venue records."
      />
    )
  }

  const visibleVenues =
    venueTypeFilter === "all"
      ? facilities
      : facilities.filter((venue) => venue.type === venueTypeFilter)

  return (
    <div>
      <PageHeader
        title="Venues"
        description="Distributor offices and godowns / warehouses with bin locations, utilization, and stock value. Select a venue to scope the rest of the app."
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

      <div className="mb-5 max-w-sm rounded-2xl border border-line bg-white p-4 shadow-sm">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Venue type</span>
          <Select
            value={venueTypeFilter}
            onChange={(event) => setVenueTypeFilter(event.target.value)}
            aria-label="Filter by venue type"
          >
            <option value="all">All</option>
            <option value={VENUE_TYPES.DISTRIBUTOR_OFFICE}>
              {VENUE_TYPE_LABELS[VENUE_TYPES.DISTRIBUTOR_OFFICE]}
            </option>
            <option value={VENUE_TYPES.GODOWN_WAREHOUSE}>
              {VENUE_TYPE_LABELS[VENUE_TYPES.GODOWN_WAREHOUSE]}
            </option>
          </Select>
        </label>
      </div>

      {!visibleVenues.length ? (
        <EmptyState
          title="No venues match this filter"
          description="Try another venue type, or show all venue types."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleVenues.map((venue) => (
            <Card
              key={venue.id}
              className={selectedFacilityId === venue.id ? "ring-2 ring-navy-700" : undefined}
              onClick={() => setFacility(venue.id)}
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">
                    {venue.code}
                  </p>
                  <h2 className="text-lg font-bold text-navy-900">{venue.name}</h2>
                </div>
                <Badge tone={venue.type === VENUE_TYPES.GODOWN_WAREHOUSE ? "slate" : "navy"}>
                  {getVenueTypeLabel(venue.type)}
                </Badge>
              </div>
              <p className="mb-4 flex items-start gap-2 text-sm text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {venue.address}, {venue.city}
              </p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted">SKUs</dt>
                  <dd className="font-semibold text-navy-900">{formatNumber(venue.skuCount)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Units</dt>
                  <dd className="font-semibold text-navy-900">{formatNumber(venue.occupied)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Value</dt>
                  <dd className="font-semibold text-navy-900">{formatCurrency(venue.value)}</dd>
                </div>
                <div>
                  <dt className="text-muted">Attention</dt>
                  <dd className="font-semibold text-navy-900">{venue.lowStock} SKUs</dd>
                </div>
              </dl>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span>Space utilization</span>
                  <span>{venue.utilization}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full bg-navy-700" style={{ width: `${venue.utilization}%` }} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {venue.bins.map((bin) => (
                  <Badge key={bin} tone="slate">
                    {bin}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
