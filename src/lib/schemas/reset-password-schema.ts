import { z } from "zod";

import { LOGIN_COPY } from "@/copy/login-copy";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, LOGIN_COPY.resetPassword.errors.tooShort),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: LOGIN_COPY.resetPassword.errors.mismatch,
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.input<typeof resetPasswordSchema>;
