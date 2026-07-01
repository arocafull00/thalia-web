import { z } from "zod";

export const SPANISH_PHONE_REGEX = /^(?:\+34|0034)?[6789]\d{8}$/;

const POSTGRES_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function uuidSchema(message: string) {
  return z.string().regex(POSTGRES_UUID_REGEX, message);
}

export function formatZodError(error: z.ZodError) {
  return error.issues.map((issue) => issue.message).join(", ");
}

export function nullableEmail() {
  return z
    .union([
      z.null(),
      z.literal(""),
      z
        .string()
        .trim()
        .email("El email no es válido.")
        .max(255, "El email es demasiado largo."),
    ])
    .transform((value) => (value === "" ? null : value));
}

export function nullableSpanishPhone() {
  return z
    .union([
      z.null(),
      z.literal(""),
      z
        .string()
        .trim()
        .regex(SPANISH_PHONE_REGEX, "El teléfono no tiene un formato válido."),
    ])
    .transform((value) => (value === "" ? null : value));
}

export function nullableDateString() {
  return z
    .union([
      z.null(),
      z.literal(""),
      z
        .string()
        .trim()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha no es válida."),
    ])
    .transform((value) => (value === "" ? null : value));
}

export function nullableTrimmedString(max: number, maxMessage: string) {
  return z
    .union([z.null(), z.literal(""), z.string().trim().max(max, maxMessage)])
    .transform((value) => (value === "" ? null : value));
}

export function clinicIdSchema() {
  return uuidSchema("La clínica no es válida.");
}
