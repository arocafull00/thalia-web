import { z } from "zod";

import { REGISTER_COPY } from "@/copy/register-copy";
import { REGISTER_EMPLOYEE_FORM_COPY } from "@/copy/register-employee-copy";

const emailSchema = z
  .string()
  .trim()
  .min(1, REGISTER_COPY.employeeEmail.errors.emailRequired)
  .email("Introduce un email válido.");

export const registerInvitationEmailSchema = z.object({
  email: emailSchema,
});

export const registerEmployeeSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, REGISTER_EMPLOYEE_FORM_COPY.errors.fullNameRequired),
    email: z.string().trim(),
    password: z.string(),
    confirmPassword: z.string(),
    requiresCredentials: z.boolean(),
  })
  .superRefine((data, context) => {
    if (!data.requiresCredentials) {
      return;
    }

    const emailResult = emailSchema.safeParse(data.email);
    if (!emailResult.success) {
      context.addIssue({
        code: "custom",
        path: ["email"],
        message:
          emailResult.error.issues[0]?.message ?? "Introduce un email válido.",
      });
    }

    if (data.password.length < 8) {
      context.addIssue({
        code: "custom",
        path: ["password"],
        message: "La contraseña debe tener al menos 8 caracteres.",
      });
    }

    if (data.password !== data.confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: REGISTER_EMPLOYEE_FORM_COPY.errors.passwordMismatch,
      });
    }
  });

export type RegisterInvitationEmailFormValues = z.input<
  typeof registerInvitationEmailSchema
>;

export type RegisterEmployeeFormValues = z.input<typeof registerEmployeeSchema>;
