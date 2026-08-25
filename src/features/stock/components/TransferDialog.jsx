import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input, Label, Select, Textarea } from "@/components/ui/input"
import { FACILITIES } from "@/data/facilities"
import { useStockStore } from "@/store/useStockStore"
import { useAuthStore } from "@/store/useAuthStore"

const schema = z.object({
  destinationFacilityId: z.string().min(1, "Choose a destination"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  reason: z.string().min(4, "Add a transfer reason"),
})

export const TransferDialog = ({ stock, open, onClose }) => {
  const user = useAuthStore((state) => state.user)
  const transfer = useStockStore((state) => state.transfer)
  const mutating = useStockStore((state) => state.mutating)
  const destinations = FACILITIES.filter((facility) => {
    if (facility.id === stock?.facilityId) {
      return false
    }
    if (user?.canViewAllFacilities) {
      return true
    }
    return user?.facilityIds?.includes(facility.id)
  })

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      destinationFacilityId: destinations[0]?.id ?? "",
      quantity: 1,
      reason: "Rebalance safety stock",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await transfer({
        stockId: stock.id,
        ...values,
      })
      toast.success("Transfer posted to the ledger.")
      form.reset()
      onClose()
    } catch (error) {
      toast.error(error.message)
    }
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Inter-facility transfer"
      description={`${stock?.sku} currently at this location. Stock moves to the destination facility on confirm.`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={mutating}>
            Cancel
          </Button>
          <Button type="submit" form="transfer-form" loading={mutating}>
            Transfer stock
          </Button>
        </div>
      }
    >
      <form id="transfer-form" className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="destinationFacilityId">Destination facility</Label>
          <Select id="destinationFacilityId" {...form.register("destinationFacilityId")}>
            {destinations.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" type="number" min="1" {...form.register("quantity")} />
          <p className="mt-1 text-xs text-muted">Available: {stock?.available ?? 0}</p>
          {form.formState.errors.quantity ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.quantity.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea id="reason" {...form.register("reason")} />
        </div>
      </form>
    </Dialog>
  )
}
