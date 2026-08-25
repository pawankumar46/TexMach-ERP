import { create } from "zustand"
import { persist } from "zustand/middleware"

export const ALL_FACILITIES = "all"

export const useFacilityStore = create(
  persist(
    (set, get) => ({
      selectedFacilityId: ALL_FACILITIES,
      setFacility: (facilityId) => set({ selectedFacilityId: facilityId }),
      syncForUser: (user) => {
        if (!user) {
          set({ selectedFacilityId: ALL_FACILITIES })
          return
        }

        if (user.canViewAllFacilities || (user.facilityIds?.length ?? 0) > 1) {
          set({ selectedFacilityId: ALL_FACILITIES })
          return
        }

        set({ selectedFacilityId: user.facilityIds?.[0] ?? ALL_FACILITIES })
      },
      isConsolidated: () => get().selectedFacilityId === ALL_FACILITIES,
    }),
    {
      name: "inventree-facility",
      partialize: (state) => ({ selectedFacilityId: state.selectedFacilityId }),
    },
  ),
)
