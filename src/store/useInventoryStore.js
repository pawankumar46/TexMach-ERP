import { create } from "zustand"
import { createInventoryItem, getInventoryItems, updateInventoryItem } from "@/services/inventory.service"
import { useAuthStore } from "@/store/useAuthStore"
import { useFacilityStore } from "@/store/useFacilityStore"

export const useInventoryStore = create((set, get) => ({
  items: [],
  loading: false,
  error: null,
  mutating: false,
  filters: {
    search: "",
    category: "all",
    brand: "all",
    status: "all",
  },
  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } })
  },
  fetchInventory: async (overrides = {}) => {
    const user = useAuthStore.getState().user
    const selectedFacilityId = useFacilityStore.getState().selectedFacilityId
    set({ loading: true, error: null })

    try {
      const items = await getInventoryItems({
        user,
        selectedFacilityId,
        ...get().filters,
        ...overrides,
      })
      set({ items, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  createItem: async (values) => {
    const user = useAuthStore.getState().user
    set({ mutating: true })
    try {
      const created = await createInventoryItem(values, user)
      set({ mutating: false })
      await get().fetchInventory()
      return created
    } catch (error) {
      set({ mutating: false })
      throw error
    }
  },
  updateItem: async (productId, values) => {
    const user = useAuthStore.getState().user
    set({ mutating: true })
    try {
      const updated = await updateInventoryItem(productId, values, user)
      set({ mutating: false })
      await get().fetchInventory()
      return updated
    } catch (error) {
      set({ mutating: false })
      throw error
    }
  },
}))
