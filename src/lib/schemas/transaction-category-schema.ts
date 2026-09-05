import { z } from "zod";

import { uuidSchema } from "@/lib/schemas/schema-helpers";

const categoryNameSchema = z
  .string()
  .trim()
  .min(1, "El nombre de la categoría es obligatorio.")
  .max(100, "El nombre de la categoría es demasiado largo.");

export const transactionCategoryCreateSchema = z.object({
  name: categoryNameSchema,
  type: z.enum(["income", "expense"]),
});

export const transactionCategoryRenameSchema = z.object({
  id: uuidSchema("La categoría no es válida."),
  name: categoryNameSchema,
});

export const transactionCategoryStatusSchema = z.object({
  id: uuidSchema("La categoría no es válida."),
});

export type TransactionCategoryCreateInput = z.infer<
  typeof transactionCategoryCreateSchema
>;

export type TransactionCategoryRenameInput = z.infer<
  typeof transactionCategoryRenameSchema
>;
