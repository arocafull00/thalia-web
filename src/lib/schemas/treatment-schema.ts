import { z } from "zod";

const treatmentInventoryLinkSchema = z.object({
  inventory_item_id: z.string().uuid(),
  quantity: z.coerce.number().positive(),
});

export const treatmentFormSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  category: z.string().trim().nullable(),
  duration_minutes: z.coerce
    .number()
    .int()
    .positive("La duración debe ser mayor que 0"),
  price: z
    .union([z.coerce.number().nonnegative(), z.literal(""), z.null()])
    .transform((value) => (value === "" ? null : value)),
  color: z
    .union([
      z.string().regex(/^#[0-9a-fA-F]{6}$/, "Color inválido"),
      z.literal(""),
      z.null(),
    ])
    .transform((value) => (value === "" ? null : value)),
  inventoryLinks: z.array(treatmentInventoryLinkSchema),
});
