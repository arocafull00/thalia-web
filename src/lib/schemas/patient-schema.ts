import { z } from "zod";

import {
  clinicIdSchema,
  nullableDateString,
  nullableEmail,
  nullableSpanishPhone,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";

const patientFieldsSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre es demasiado largo."),
  dni: nullableTrimmedString(20, "El DNI es demasiado largo."),
  birth_date: nullableDateString(),
  phone: nullableSpanishPhone(),
  email: nullableEmail(),
  address: nullableTrimmedString(255, "La dirección es demasiado larga."),
  notes: nullableTrimmedString(1000, "Las notas son demasiado largas."),
});

export const patientSchema = patientFieldsSchema.extend({
  clinic_id: clinicIdSchema(),
});

export const patientUpdateSchema = patientFieldsSchema.partial().passthrough();

export type PatientSchemaInput = z.infer<typeof patientSchema>;
export type PatientUpdateSchemaInput = z.infer<typeof patientUpdateSchema>;
