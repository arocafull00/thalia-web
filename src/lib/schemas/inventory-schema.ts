import { z } from "zod";

import {
  clinicIdSchema,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";

const inventoryFieldsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(200, "El nombre es demasiado largo."),
  category: nullableTrimmedString(50, "La categoría es demasiado larga."),
  unit: nullableTrimmedString(50, "La unidad es demasiado larga."),
  stock: z.coerce
    .number({ message: "El stock no es válido." })
    .int("El stock debe ser un número entero.")
    .nonnegative("El stock no puede ser negativo."),
  min_stock: z.coerce
    .number({ message: "El stock mínimo no es válido." })
    .int("El stock mínimo debe ser un número entero.")
    .nonnegative("El stock mínimo no puede ser negativo."),
  unit_price: z
    .union([
      z.null(),
      z.literal(""),
      z.coerce
        .number({ message: "El precio unitario no es válido." })
        .nonnegative("El precio unitario no puede ser negativo."),
    ])
    .transform((value) => (value === "" ? null : value)),
});

export const inventorySchema = inventoryFieldsSchema.extend({
  clinic_id: clinicIdSchema(),
});

export type InventorySchemaInput = z.infer<typeof inventorySchema>;
