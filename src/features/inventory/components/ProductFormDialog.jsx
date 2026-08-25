import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input, Label, Select } from "@/components/ui/input"
import { productFormSchema } from "@/features/inventory/product.schema"
import { getInventoryMeta } from "@/services/inventory.service"
import { useInventoryStore } from "@/store/useInventoryStore"
import { useAuthStore } from "@/store/useAuthStore"

const EMPTY_VALUES = {
  name: "",
  sku: "",
  model: "",
  brand: "",
  category: "Sewing",
  image: "",
  reorderLevel: 2,
  costPrice: 0,
}

export const ProductFormDialog = ({ open, product, onClose, onSaved }) => {
  const user = useAuthStore((state) => state.user)
  const createItem = useInventoryStore((state) => state.createItem)
  const updateItem = useInventoryStore((state) => state.updateItem)
  const mutating = useInventoryStore((state) => state.mutating)
  const { categories, brands } = getInventoryMeta()
  const brandLocked = Boolean(user?.brandFilter)
  const isEdit = Boolean(product)

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    const meta = getInventoryMeta()

    form.reset(
      product
        ? {
            name: product.name,
            sku: product.sku,
            model: product.model ?? "",
            brand: product.brand,
            category: product.category,
            image: product.image ?? "",
            reorderLevel: product.reorderLevel ?? 2,
            costPrice: product.costPrice ?? 0,
          }
        : {
            ...EMPTY_VALUES,
            brand: user?.brandFilter || meta.brands[0] || "Duke",
          },
    )
  }, [open, product, user, form])

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const saved = isEdit ? await updateItem(product.id, values) : await createItem(values)
      toast.success(isEdit ? "Item updated successfully." : "Item added to the catalog.")
      onSaved?.(saved)
      onClose()
    } catch (error) {
      toast.error(error.message)
    }
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit catalog item" : "Add catalog item"}
      description={
        brandLocked
          ? `This item is saved to the ${user.brandFilter} supplier catalog. HCA warehouse quantities stay hidden.`
          : "Update name, SKU, photo, and commercial fields for this catalog item."
      }
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={mutating}>
            Cancel
          </Button>
          <Button type="submit" form="product-form" loading={mutating}>
            {isEdit ? "Save changes" : "Add item"}
          </Button>
        </div>
      }
    >
      <form id="product-form" className="space-y-4" onSubmit={onSubmit}>
        <div>
          <Label htmlFor="name">Product name</Label>
          <Input id="name" autoFocus {...form.register("name")} />
          {form.formState.errors.name ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.name.message}</p>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" {...form.register("sku")} />
            {form.formState.errors.sku ? (
              <p className="mt-1 text-xs text-red-600">{form.formState.errors.sku.message}</p>
            ) : null}
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input id="model" {...form.register("model")} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="brand">Brand</Label>
            {brandLocked ? (
              <Input id="brand" readOnly {...form.register("brand")} />
            ) : (
              <Select id="brand" {...form.register("brand")}>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Select>
            )}
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select id="category" {...form.register("category")}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="image">Product image URL</Label>
          <Input id="image" placeholder="https://..." {...form.register("image")} />
          <p className="mt-1 text-xs text-muted">Optional. Paste a photo URL, or leave blank for a placeholder.</p>
          {form.formState.errors.image ? (
            <p className="mt-1 text-xs text-red-600">{form.formState.errors.image.message}</p>
          ) : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="reorderLevel">Reorder level</Label>
            <Input id="reorderLevel" type="number" min="0" {...form.register("reorderLevel")} />
          </div>
          <div>
            <Label htmlFor="costPrice">Unit cost (INR)</Label>
            <Input id="costPrice" type="number" min="0" {...form.register("costPrice")} />
          </div>
        </div>
      </form>
    </Dialog>
  )
}
