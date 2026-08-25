import { create } from "zustand"
import { getUsers, updateUserStatus } from "@/services/user.service"

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  fetchUsers: async () => {
    set({ loading: true, error: null })
    try {
      const users = await getUsers()
      set({ users, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  setStatus: async (userId, status) => {
    await updateUserStatus(userId, status)
    await get().fetchUsers()
  },
}))
