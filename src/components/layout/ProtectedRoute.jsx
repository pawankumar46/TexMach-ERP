import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/useAuthStore"

export const ProtectedRoute = ({ permission }) => {
  const user = useAuthStore((state) => state.user)
  const can = useAuthStore((state) => state.can)

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (permission && !can(permission)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
