import { z } from "zod";

import {
  clinicIdSchema,
  nullableSpanishPhone,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";

const employeeRoleSchema = z.enum(
  ["admin", "reception", "doctor", "auxiliary"],
  { message: "El rol no es válido." },
);

const employeeFieldsSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre es demasiado largo."),
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio.")
    .email("El email no es válido.")
    .max(255, "El email es demasiado largo."),
  phone: nullableSpanishPhone(),
  role: employeeRoleSchema,
  specialty: nullableTrimmedString(100, "La especialidad es demasiado larga."),
  color: nullableTrimmedString(20, "El color es demasiado largo."),
});

export const employeeSchema = employeeFieldsSchema.extend({
  clinicId: clinicIdSchema(),
});

export const employeeUpdateSchema = z
  .object({
    full_name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres.")
      .max(100, "El nombre es demasiado largo.")
      .optional(),
    email: z
      .string()
      .trim()
      .email("El email no es válido.")
      .max(255, "El email es demasiado largo.")
      .optional(),
    phone: nullableSpanishPhone().optional(),
    role: employeeRoleSchema.optional(),
    specialty: nullableTrimmedString(
      100,
      "La especialidad es demasiado larga.",
    ).optional(),
    color: nullableTrimmedString(20, "El color es demasiado largo.").optional(),
    active: z.boolean().nullable().optional(),
    avatar_url: nullableTrimmedString(
      500,
      "La URL del avatar es demasiado larga.",
    ).optional(),
  })
  .passthrough();

export type EmployeeSchemaInput = z.infer<typeof employeeSchema>;
export type EmployeeUpdateSchemaInput = z.infer<typeof employeeUpdateSchema>;
