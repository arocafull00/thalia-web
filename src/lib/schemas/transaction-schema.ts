import { z } from "zod";

import {
  clinicIdSchema,
  nullableTrimmedString,
  uuidSchema,
} from "@/lib/schemas/schema-helpers";

const transactionFieldsSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce
    .number({ message: "El importe no es válido." })
    .positive("El importe debe ser mayor que cero."),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha no es válida."),
  category: nullableTrimmedString(100, "La categoría es demasiado larga."),
  description: nullableTrimmedString(500, "La descripción es demasiado larga."),
});

export const transactionSchema = transactionFieldsSchema.extend({
  clinic_id: clinicIdSchema(),
  appointment_id: z.null(),
  created_by: uuidSchema("El usuario no es válido."),
});

export type TransactionSchemaInput = z.infer<typeof transactionSchema>;
