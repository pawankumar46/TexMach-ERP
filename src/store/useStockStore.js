import { create } from "zustand"
import { getStockItems, getStockMovements, adjustStock, transferStock } from "@/services/stock.service"
import { useAuthStore } from "@/store/useAuthStore"
import { useFacilityStore } from "@/store/useFacilityStore"

export const useStockStore = create((set, get) => ({
  items: [],
  movements: [],
  loading: false,
  movementsLoading: false,
  error: null,
  mutating: false,
  filters: {
    search: "",
    status: "all",
  },
  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } })
  },
  fetchStock: async () => {
    const user = useAuthStore.getState().user
    const selectedFacilityId = useFacilityStore.getState().selectedFacilityId
    set({ loading: true, error: null })

    try {
      const items = await getStockItems({
        user,
        selectedFacilityId,
        ...get().filters,
      })
      set({ items, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  fetchMovements: async () => {
    const user = useAuthStore.getState().user
    const selectedFacilityId = useFacilityStore.getState().selectedFacilityId
    set({ movementsLoading: true })

    try {
      const movements = await getStockMovements({ user, selectedFacilityId })
      set({ movements, movementsLoading: false })
    } catch (error) {
      set({ movementsLoading: false, error: error.message })
    }
  },
  adjust: async (payload) => {
    const user = useAuthStore.getState().user
    set({ mutating: true })
    try {
      await adjustStock({ ...payload, userName: user?.name })
      set({ mutating: false })
      await get().fetchStock()
      await get().fetchMovements()
    } catch (error) {
      set({ mutating: false })
      throw error
    }
  },
  transfer: async (payload) => {
    const user = useAuthStore.getState().user
    set({ mutating: true })
    try {
      await transferStock({ ...payload, userName: user?.name })
      set({ mutating: false })
      await get().fetchStock()
      await get().fetchMovements()
    } catch (error) {
      set({ mutating: false })
      throw error
    }
  },
}))
