import { z } from "zod";

import {
  clinicIdSchema,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";

const campaignFieldsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "El título es obligatorio.")
    .max(120, "El título es demasiado largo."),
  content: z
    .string()
    .trim()
    .min(1, "El mensaje es obligatorio.")
    // WhatsApp corta los mensajes de texto largos; 1024 es el límite seguro
    // para el cuerpo de una plantilla con cabecera multimedia.
    .max(1024, "El mensaje es demasiado largo (máximo 1024 caracteres)."),
  footer_text: nullableTrimmedString(160, "El pie es demasiado largo."),
  footer_website: z
    .union([
      z.null(),
      z.literal(""),
      z
        .string()
        .trim()
        .url("La web no es una URL válida.")
        .max(200, "La web es demasiado larga."),
    ])
    .transform((value) => (value === "" ? null : value)),
  footer_phone: nullableTrimmedString(30, "El teléfono es demasiado largo."),
  image_url: z
    .union([z.null(), z.literal(""), z.string().trim()])
    .transform((value) => (value === "" ? null : value)),
});

export const campaignSchema = campaignFieldsSchema.extend({
  clinic_id: clinicIdSchema(),
});

export type CampaignSchemaInput = z.infer<typeof campaignSchema>;
