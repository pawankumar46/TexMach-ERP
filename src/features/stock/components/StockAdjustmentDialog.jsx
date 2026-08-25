import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input, Label, Select, Textarea } from "@/components/ui/input"
import { MOVEMENT_TYPES } from "@/constants/movement-types"
import { useStockStore } from "@/store/useStockStore"

const schema = z.object({
  quantityChange: z.coerce.number().refine((value) => value !== 0, "Enter a non-zero quantity"),
  movementType: z.string().min(1),
  reason: z.string().min(4, "Add a short reason"),
})

export const StockAdjustmentDialog = ({ stock, open, onClose }) => {
  const adjust = useStockStore((state) => state.adjust)
  const mutating = useStockStore((state) => state.mutating)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      quantityChange: 1,
      movementType: MOVEMENT_TYPES.ADJUSTMENT,
      reason: "Cycle count correction",
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await adjust({
        stockId: stock.id,
        ...values,
      })
      toast.success("Stock updated successfully.")
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
      title="Adjust stock"
      description={`${stock?.sku} · ${stock?.productName}`}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={mutating}>
            Cancel
          </Button>
          <Button type="submit" form="adjust-stock-form" loading={mutating}>
            Save adjustment
          </Button>
        </div>
      }
    >
      <form id="adjust-stock-form" className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="quantityChange">Quantity change</Label>
          <Input id="quantityChange" type="number" {...form.register("quantityChange")} />
          <p className="mt-1 text-xs text-muted">Use a negative number to reduce on-hand quantity.</p>
          {form.formState.errors.quantityChange ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.quantityChange.message}</p>
          ) : null}
        </div>
        <div>
          <Label htmlFor="movementType">Movement type</Label>
          <Select id="movementType" {...form.register("movementType")}>
            <option value={MOVEMENT_TYPES.ADJUSTMENT}>Stock count corrected</option>
            <option value={MOVEMENT_TYPES.DAMAGE}>Marked as damaged</option>
            <option value={MOVEMENT_TYPES.RETURN}>Returned to warehouse</option>
            <option value={MOVEMENT_TYPES.PURCHASE}>Bought from supplier</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="reason">Reason</Label>
          <Textarea id="reason" {...form.register("reason")} />
          {form.formState.errors.reason ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.reason.message}</p>
          ) : null}
        </div>
      </form>
    </Dialog>
  )
}
