import { create } from "zustand"
import { getFacilities } from "@/services/warehouse.service"
import { useAuthStore } from "@/store/useAuthStore"

export const useWarehouseStore = create((set) => ({
  facilities: [],
  loading: false,
  error: null,
  fetchFacilities: async () => {
    const user = useAuthStore.getState().user
    set({ loading: true, error: null })

    try {
      const facilities = await getFacilities(user)
      set({ facilities, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
}))
