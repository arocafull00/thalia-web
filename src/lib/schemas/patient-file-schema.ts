import { z } from "zod";

import { nullableTrimmedString } from "@/lib/schemas/schema-helpers";
import type { PatientFileCategory } from "@/types/database.types";

export const patientFileCategorySchema = z.enum([
  "consentimiento",
  "historia_clinica",
  "receta",
  "analitica",
  "informe",
  "otro",
]);

export const patientFileUploadSchema = z.object({
  category: patientFileCategorySchema,
  notes: nullableTrimmedString(1000, "Las notas son demasiado largas."),
});

export const patientFileUpdateSchema = patientFileUploadSchema;

export type PatientFileUploadInput = z.infer<typeof patientFileUploadSchema>;

export type PatientFileCategoryOption = {
  value: PatientFileCategory;
  label: string;
};
