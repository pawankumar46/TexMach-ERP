import { useEffect, useState } from "react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ErrorState } from "@/components/ui/error-state"
import { TableSkeleton } from "@/components/ui/loading-skeleton"
import { PERSONAS } from "@/data/personas"
import { ROLE_LABELS } from "@/constants/roles"
import { useUserStore } from "@/store/useUserStore"
import { getFacilityById } from "@/data/facilities"

export const UsersPage = () => {
  const users = useUserStore((state) => state.users)
  const loading = useUserStore((state) => state.loading)
  const error = useUserStore((state) => state.error)
  const fetchUsers = useUserStore((state) => state.fetchUsers)
  const setStatus = useUserStore((state) => state.setStatus)
  const [pendingUser, setPendingUser] = useState(null)
  const [statusLoading, setStatusLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const confirmToggle = async () => {
    if (!pendingUser) {
      return
    }

    const next = pendingUser.status === "active" ? "inactive" : "active"
    setStatusLoading(true)
    await setStatus(pendingUser.id, next)
    setStatusLoading(false)
    toast.success(`${pendingUser.name} marked ${next}.`)
    setPendingUser(null)
  }

  return (
    <div>
      <PageHeader
        title="Users, roles & personas"
        description="Venue-scoped access for Super Admin, Store Manager, Store Executive, Vendor, and Category Manager."
      />

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        {PERSONAS.map((persona) => (
          <Card key={persona.id}>
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">
              {ROLE_LABELS[persona.role]}
            </p>
            <h2 className="mt-1 text-lg font-bold text-navy-900">{persona.name}</h2>
            <p className="text-sm text-muted">{persona.title}</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">{persona.summary}</p>
          </Card>
        ))}
      </div>

      {loading ? <TableSkeleton /> : null}
      {error ? <ErrorState message={error} onRetry={fetchUsers} /> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <thead className="bg-navy-50 text-xs uppercase text-navy-800">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Venues</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-line">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-900">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">{ROLE_LABELS[user.role]}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.facilityIds.length
                        ? user.facilityIds.map((facilityId) => (
                            <Badge key={facilityId} tone="slate">
                              {getFacilityById(facilityId)?.code ?? facilityId}
                            </Badge>
                          ))
                        : "—"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={user.status === "active" ? "green" : "red"}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="secondary" onClick={() => setPendingUser(user)}>
                      {user.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(pendingUser)}
        title={pendingUser?.status === "active" ? "Deactivate user?" : "Activate user?"}
        message={
          pendingUser
            ? `This updates ${pendingUser.name}'s access across the facilities assigned to them.`
            : ""
        }
        confirmLabel={pendingUser?.status === "active" ? "Deactivate" : "Activate"}
        loading={statusLoading}
        onCancel={() => setPendingUser(null)}
        onConfirm={confirmToggle}
      />
    </div>
  )
}
