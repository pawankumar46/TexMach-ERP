import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loginWithCredentials, logoutSession } from "@/services/auth.service"
import { hasPermission } from "@/constants/roles"

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,
      login: async ({ email, password }) => {
        set({ loading: true, error: null })
        try {
          const user = await loginWithCredentials(email, password)
          set({ user, loading: false })
          return user
        } catch (error) {
          set({ error: error.message, loading: false })
          throw error
        }
      },
      logout: async () => {
        await logoutSession()
        set({ user: null, error: null })
      },
      clearError: () => set({ error: null }),
      can: (permission) => hasPermission(get().user?.role, permission),
    }),
    {
      name: "inventree-auth",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
