import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { useAuthStore } from "@/store/useAuthStore"
import { ALL_FACILITIES, useFacilityStore } from "@/store/useFacilityStore"

export const AppShell = () => {
  const [navOpen, setNavOpen] = useState(false)
  const user = useAuthStore((state) => state.user)
  const can = useAuthStore((state) => state.can)
  const logout = useAuthStore((state) => state.logout)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const syncForUser = useFacilityStore((state) => state.syncForUser)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      return
    }

    const allowed = user.facilityIds ?? []
    const isAll = selectedFacilityId === ALL_FACILITIES
    const outOfScope = !isAll && !user.canViewAllFacilities && !allowed.includes(selectedFacilityId)
    const cannotUseAll = isAll && !user.canViewAllFacilities && allowed.length === 1

    if (outOfScope || cannotUseAll) {
      syncForUser(user)
    }
  }, [user, selectedFacilityId, syncForUser])

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <div className="flex min-h-svh bg-canvas">
      <Sidebar
        user={user}
        can={can}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        onLogout={handleLogout}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header user={user} onMenu={() => setNavOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
