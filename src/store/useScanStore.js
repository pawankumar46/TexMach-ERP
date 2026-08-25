import { create } from "zustand"
import { completeScanTask, getScanTasks } from "@/services/scan.service"
import { useAuthStore } from "@/store/useAuthStore"
import { useFacilityStore } from "@/store/useFacilityStore"

export const useScanStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  completingId: null,
  activeType: "all",
  setActiveType: (type) => set({ activeType: type }),
  fetchTasks: async () => {
    const user = useAuthStore.getState().user
    const selectedFacilityId = useFacilityStore.getState().selectedFacilityId
    set({ loading: true, error: null })

    try {
      const tasks = await getScanTasks({
        user,
        selectedFacilityId,
        type: get().activeType,
      })
      set({ tasks, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  completeTask: async (taskId, scannedCode) => {
    const user = useAuthStore.getState().user
    set({ completingId: taskId, error: null })

    try {
      await completeScanTask({ taskId, scannedCode, userName: user?.name })
      set({ completingId: null })
      await get().fetchTasks()
    } catch (error) {
      set({ completingId: null })
      throw error
    }
  },
}))
