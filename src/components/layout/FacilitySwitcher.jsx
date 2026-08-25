import { Building2 } from "lucide-react"
import { FACILITIES } from "@/data/facilities"
import { USER_ROLES } from "@/constants/roles"
import { ALL_FACILITIES, useFacilityStore } from "@/store/useFacilityStore"
import { useAuthStore } from "@/store/useAuthStore"
import { Select } from "@/components/ui/input"

export const FacilitySwitcher = () => {
  const user = useAuthStore((state) => state.user)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const setFacility = useFacilityStore((state) => state.setFacility)

  if (!user || user.role === USER_ROLES.VENDOR) {
    return null
  }

  const assignedIds = user.facilityIds ?? []
  const options =
    user.canViewAllFacilities || assignedIds.length > 1
      ? FACILITIES.filter((facility) => user.canViewAllFacilities || assignedIds.includes(facility.id))
      : FACILITIES.filter((facility) => facility.id === assignedIds[0])

  const locked = options.length <= 1

  return (
    <label className="flex min-w-0 items-center gap-2">
      <Building2 className="hidden h-4 w-4 shrink-0 text-navy-700 sm:block" aria-hidden="true" />
      <span className="sr-only">Facility</span>
      <Select
        value={selectedFacilityId}
        disabled={locked}
        onChange={(event) => setFacility(event.target.value)}
        className="max-w-52 sm:max-w-64"
        aria-label="Select facility"
      >
        {!locked ? <option value={ALL_FACILITIES}>All facilities</option> : null}
        {options.map((facility) => (
          <option key={facility.id} value={facility.id}>
            {facility.name}
          </option>
        ))}
      </Select>
    </label>
  )
}
