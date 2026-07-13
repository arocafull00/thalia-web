import { z } from "zod";

import {
  nullableDateString,
  nullableTrimmedString,
  uuidSchema,
} from "@/lib/schemas/schema-helpers";

const patientImagePhaseSchema = z
  .union([z.null(), z.literal(""), z.enum(["antes", "durante", "despues"])])
  .transform((value) => (value === "" ? null : value));

const patientImageTreatmentIdSchema = z
  .union([z.null(), z.literal(""), uuidSchema("El tratamiento no es válido.")])
  .transform((value) => (value === "" ? null : value));

export const patientImageUploadSchema = z.object({
  phase: patientImagePhaseSchema,
  treatment_id: patientImageTreatmentIdSchema,
  notes: nullableTrimmedString(1000, "Las notas son demasiado largas."),
  captured_at: nullableDateString(),
});

export type PatientImageUploadInput = z.infer<typeof patientImageUploadSchema>;
