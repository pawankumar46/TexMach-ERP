import { z } from "zod"

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Product name is required"),
  sku: z.string().trim().min(2, "SKU is required"),
  model: z.string().trim().optional(),
  brand: z.string().trim().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  image: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\//i.test(value), "Enter a valid image URL")
    .optional(),
  reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative"),
  costPrice: z.coerce.number().min(0, "Cost cannot be negative"),
})
