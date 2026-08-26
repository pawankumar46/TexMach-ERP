import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, ExternalLink, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { ErrorState } from "@/components/ui/error-state"
import { PageSkeleton } from "@/components/ui/loading-skeleton"
import { ProductImage } from "@/components/inventory/ProductImage"
import { StockStatusBadge } from "@/components/ui/stock-status-badge"
import { ProductFormDialog } from "@/features/inventory/components/ProductFormDialog"
import { getInventoryItemById } from "@/services/inventory.service"
import { useAuthStore } from "@/store/useAuthStore"
import { useFacilityStore } from "@/store/useFacilityStore"
import { useInventoryStore } from "@/store/useInventoryStore"
import { formatCurrency, formatNumber } from "@/lib/utils"
import { getFacilityById } from "@/data/facilities"
import { USER_ROLES, canManageInventoryItem } from "@/constants/roles"

export const InventoryDetailPage = () => {
  const { productId } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const selectedFacilityId = useFacilityStore((state) => state.selectedFacilityId)
  const deleteItem = useInventoryStore((state) => state.deleteItem)
  const mutating = useInventoryStore((state) => state.mutating)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const item = await getInventoryItemById(productId, { user, selectedFacilityId })
        if (!cancelled) {
          setProduct(item)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [productId, user, selectedFacilityId])

  if (loading) {
    return <PageSkeleton />
  }

  if (error) {
    return <ErrorState title="Unable to load product" message={error} />
  }

  const hideQty = user?.role === USER_ROLES.VENDOR
  const canEdit = canManageInventoryItem(user, product)

  const handleDelete = async () => {
    try {
      await deleteItem(product.id)
      toast.success(`${product.name} removed from the catalog.`)
      navigate("/inventory")
    } catch (deleteError) {
      toast.error(deleteError.message)
    }
  }

  return (
    <div>
      <Link
        to="/inventory"
        className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-navy-800 hover:text-navy-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to inventory
      </Link>
      <PageHeader
        title={product.name}
        description={`${product.brand} · ${product.category} · model ${product.model}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {canEdit ? (
              <>
                <Button variant="secondary" onClick={() => setFormOpen(true)}>
                  <Pencil className="h-4 w-4" />
                  Edit item
                </Button>
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </>
            ) : null}
            {product.catalogUrl ? (
              <a
                href={product.catalogUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-semibold text-navy-900 hover:bg-navy-50"
              >
                View on grouphca.com <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <Card className="overflow-hidden p-0">
          <ProductImage src={product.image} alt={product.name} className="h-64 w-full" />
        </Card>
        <Card>
          <dl className="grid gap-4 sm:grid-cols-2">
            <Info label="SKU" value={product.sku} />
            <Info label="Item type" value="Finished goods" />
            <Info label="ABC class" value={product.abcClass} />
            <Info label="Reorder level" value={product.reorderLevel} />
            <Info label="Unit cost" value={formatCurrency(product.costPrice)} />
            <Info label="Serial tracked" value={product.serialTracked ? "Yes" : "No"} />
          </dl>
        </Card>
      </div>

      {!hideQty ? (
        <div className="mt-6">
          <h2 className="mb-3 text-lg font-semibold text-navy-900">Stock by facility</h2>
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-navy-50 text-xs uppercase text-navy-800">
                <tr>
                  <th className="px-4 py-3">Facility</th>
                  <th className="px-4 py-3">Bin</th>
                  <th className="px-4 py-3">On hand</th>
                  <th className="px-4 py-3">Reserved</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {product.stockRows.map((row) => {
                  const facility = getFacilityById(row.facilityId)
                  return (
                    <tr key={row.id} className="border-t border-line">
                      <td className="px-4 py-3">
                        <p className="font-medium">{facility?.name}</p>
                        <p className="text-xs text-muted">{facility?.code}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge tone="slate">{row.bin}</Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatNumber(row.quantity)}</td>
                      <td className="px-4 py-3">{row.reserved}</td>
                      <td className="px-4 py-3">{row.available}</td>
                      <td className="px-4 py-3">
                        <StockStatusBadge status={row.stockStatus} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <p className="text-sm text-amber-900">
            Internal warehouse quantities stay with HCA. You can add and edit Duke catalog details here. PO, ASN, and invoices arrive in Phase 2.
          </p>
        </Card>
      )}

      <ProductFormDialog
        open={formOpen}
        product={product}
        onClose={() => setFormOpen(false)}
        onSaved={setProduct}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete catalog item?"
        message={`Remove “${product.name}” (${product.sku}) from the catalog? Related warehouse stock for this SKU will also be cleared.`}
        confirmLabel="Delete item"
        loading={mutating}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

const Info = ({ label, value }) => {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-navy-900">{value}</dd>
    </div>
  )
}
