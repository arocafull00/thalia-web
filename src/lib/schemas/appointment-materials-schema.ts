import { z } from "zod";

import { uuidSchema } from "@/lib/schemas/schema-helpers";

const appointmentInventoryLinkSchema = z.object({
  inventory_item_id: uuidSchema("Selecciona un material válido."),
  quantity: z.coerce
    .number()
    .int("La cantidad debe ser un número entero.")
    .positive("La cantidad debe ser mayor que 0."),
});

export const appointmentMaterialsFormSchema = z.object({
  items: z.array(appointmentInventoryLinkSchema),
});

export type AppointmentMaterialsFormValues = z.input<
  typeof appointmentMaterialsFormSchema
>;

export type AppointmentMaterialsSubmitValues = z.output<
  typeof appointmentMaterialsFormSchema
>;
