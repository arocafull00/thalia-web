import { z } from "zod";

export const financesExportSchema = z
  .object({
    type: z.enum(["income", "expense", "all"]),
    from: z.date({ message: "La fecha inicial es obligatoria." }),
    to: z.date({ message: "La fecha final es obligatoria." }),
    categoryIds: z.array(z.string()),
  })
  .refine((data) => data.from <= data.to, {
    message: "La fecha inicial no puede ser posterior a la fecha final.",
    path: ["to"],
  });

export type FinancesExportFormValues = z.infer<typeof financesExportSchema>;
