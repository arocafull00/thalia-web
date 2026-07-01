import { z } from "zod";

import {
  clinicIdSchema,
  nullableTrimmedString,
  uuidSchema,
} from "@/lib/schemas/schema-helpers";

const appointmentFieldsSchema = z.object({
  patientId: uuidSchema("El paciente no es válido."),
  employeeId: uuidSchema("El profesional no es válido."),
  startsAt: z
    .date()
    .refine(
      (date) => date.getTime() > Date.now(),
      "La fecha no puede ser en el pasado.",
    ),
  treatmentTypeIds: z.array(uuidSchema("El tratamiento no es válido.")),
  notes: nullableTrimmedString(1000, "Las notas son demasiado largas."),
});

export const appointmentSchema = appointmentFieldsSchema.extend({
  clinicId: clinicIdSchema(),
});

export const appointmentUpdateSchema = appointmentFieldsSchema
  .extend({
    id: uuidSchema("La cita no es válida."),
  })
  .extend({
    clinicId: clinicIdSchema(),
  });

export type AppointmentSchemaInput = z.infer<typeof appointmentSchema>;
export type AppointmentUpdateSchemaInput = z.infer<
  typeof appointmentUpdateSchema
>;
