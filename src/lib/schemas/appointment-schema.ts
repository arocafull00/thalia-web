import { z } from "zod";

import {
  clinicIdSchema,
  nullableTrimmedString,
  uuidSchema,
} from "@/lib/schemas/schema-helpers";

const appointmentCommonFieldsSchema = z.object({
  patientId: uuidSchema("El paciente no es válido."),
  employeeId: uuidSchema("El profesional no es válido."),
  treatmentIds: z.array(uuidSchema("El tratamiento no es válido.")),
  notes: nullableTrimmedString(1000, "Las notas son demasiado largas."),
});

export const appointmentFormSchema = appointmentCommonFieldsSchema.extend({
  startsAt: z.date(),
});

export const appointmentSchema = appointmentCommonFieldsSchema.extend({
  clinicId: clinicIdSchema(),
  startsAtIso: z.string().datetime({ offset: true }),
});

export const appointmentUpdateSchema = appointmentCommonFieldsSchema.extend({
  id: uuidSchema("La cita no es válida."),
  clinicId: clinicIdSchema(),
  startsAtIso: z.string().datetime({ offset: true }),
});

export type AppointmentSchemaInput = z.infer<typeof appointmentSchema>;
export type AppointmentUpdateSchemaInput = z.infer<
  typeof appointmentUpdateSchema
>;
