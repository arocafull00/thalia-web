import { z } from "zod";

export const clinicBillingActionSchema = z.object({
  clinicId: z.string().uuid("La clínica no es válida."),
});

export type ClinicBillingActionInput = z.infer<
  typeof clinicBillingActionSchema
>;
