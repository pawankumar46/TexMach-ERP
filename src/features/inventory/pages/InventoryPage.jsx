import { useEffect, useState } from "react"
import { PackageSearch, Plus } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"
import { CardGridSkeleton, TableSkeleton } from "@/components/ui/loading-skeleton"
import { InventoryFilters } from "@/features/inventory/components/InventoryFilters"
import { InventoryCardGrid } from "@/features/inventory/components/InventoryCardGrid"
import { InventoryTable } from "@/features/inventory/components/InventoryTable"
import { ProductFormDialog } from "@/features/inventory/components/ProductFormDialog"
import { useInventoryStore } from "@/store/useInventoryStore"
import { useFacilityStore } from "@/store/useFacilityStore"
import { useAuthStore } from "@/store/useAuthStore"
import { PERMISSIONS } from "@/constants/roles"

export const InventoryPage = () => {
  const [view, setView] = useState("grid")
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const user = useAuthStore((state) => state.user)
  const can = useAuthStore((state) => state.can)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const items = useInventoryStore((state) => state.items)
  const loading = useInventoryStore((state) => state.loading)
  const error = useInventoryStore((state) => state.error)
  const mutating = useInventoryStore((state) => state.mutating)
  const filters = useInventoryStore((state) => state.filters)
  const setFilters = useInventoryStore((state) => state.setFilters)
  const fetchInventory = useInventoryStore((state) => state.fetchInventory)
  const deleteItem = useInventoryStore((state) => state.deleteItem)
  const canManage = can(PERMISSIONS.INVENTORY_MANAGE)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      fetchInventory()
    }, filters.search ? 280 : 0)

    return () => window.clearTimeout(timer)
  }, [fetchInventory, filters, selectedFacilityId, user])

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setFormOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deleting) {
      return
    }

    try {
      await deleteItem(deleting.id)
      toast.success(`${deleting.name} removed from the catalog.`)
      setDeleting(null)
    } catch (deleteError) {
      toast.error(deleteError.message)
    }
  }

  return (
    <div>
      <PageHeader
        title="Inventory management"
        description={
          user?.brandFilter
            ? `Add, update, or remove ${user.brandFilter} catalog items. Photos and names can be edited; HCA warehouse stock stays hidden.`
            : "Machine catalog with photos and names from grouphca.com, mapped onto the Phase 1 stock ledger."
        }
        actions={
          canManage ? (
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          ) : null
        }
      />
      <InventoryFilters
        filters={filters}
        onChange={setFilters}
        view={view}
        onViewChange={setView}
        hideBrand={Boolean(user?.brandFilter)}
        hideStatus={Boolean(user?.brandFilter)}
      />
      {loading ? view === "grid" ? <CardGridSkeleton /> : <TableSkeleton /> : null}
      {!loading && error ? <ErrorState message={error} onRetry={fetchInventory} /> : null}
      {!loading && !error && !items.length ? (
        <EmptyState
          icon={PackageSearch}
          title="No inventory found"
          description="Try another search or add a catalog item."
          action={
            canManage ? (
              <Button onClick={openCreate}>
                <Plus className="h-4 w-4" />
                Add item
              </Button>
            ) : null
          }
        />
      ) : null}
      {!loading && !error && items.length
        ? view === "grid"
          ? <InventoryCardGrid items={items} onEdit={openEdit} onDelete={setDeleting} />
          : <InventoryTable items={items} onEdit={openEdit} onDelete={setDeleting} />
        : null}

      <ProductFormDialog
        open={formOpen}
        product={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete catalog item?"
        message={
          deleting
            ? `Remove “${deleting.name}” (${deleting.sku}) from the catalog? Related warehouse stock for this SKU will also be cleared.`
            : ""
        }
        confirmLabel="Delete item"
        loading={mutating}
        onCancel={() => setDeleting(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
