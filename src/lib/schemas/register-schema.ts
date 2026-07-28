import { z } from "zod";

import { CREATE_CLINIC_COPY } from "@/copy/create-clinic-copy";
import { REGISTER_COPY } from "@/copy/register-copy";
import { REGISTER_EMPLOYEE_FORM_COPY } from "@/copy/register-employee-copy";
import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";

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

export const ownerRegistrationSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, REGISTER_OWNER_COPY.errors.fullNameRequired),
    email: z.string().trim(),
    password: z.string(),
    confirmPassword: z.string(),
    clinicName: z
      .string()
      .trim()
      .min(1, REGISTER_OWNER_COPY.errors.clinicNameRequired),
    address: z.string().trim(),
    clinicPhone: z.string().trim(),
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

export const createClinicSchema = z.object({
  clinicName: z
    .string()
    .trim()
    .min(1, CREATE_CLINIC_COPY.errors.clinicNameRequired),
  address: z.string().trim(),
  clinicPhone: z.string().trim(),
});

export type RegisterInvitationEmailFormValues = z.input<
  typeof registerInvitationEmailSchema
>;

export type CreateClinicFormValues = z.input<typeof createClinicSchema>;

export type RegisterEmployeeFormValues = z.input<typeof registerEmployeeSchema>;

export type OwnerRegistrationFormValues = z.input<
  typeof ownerRegistrationSchema
>;
