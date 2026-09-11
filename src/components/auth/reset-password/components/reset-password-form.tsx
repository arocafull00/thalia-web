"use client";

import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import PasswordInput from "@/components/auth/components/password-input";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";
import type { ResetPasswordFormValues } from "@/lib/schemas/reset-password-schema";

type ResetPasswordFormProps = {
  errors: FieldErrors<ResetPasswordFormValues>;
  isSubmitting: boolean;
  onSubmit: () => void;
  register: UseFormRegister<ResetPasswordFormValues>;
};

export default function ResetPasswordForm({
  errors,
  isSubmitting,
  onSubmit,
  register,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {LOGIN_COPY.resetPassword.newPassword}{" "}
            <span className="text-danger">
              {LOGIN_COPY.fields.requiredMark}
            </span>
          </span>
          <PasswordInput
            {...register("password")}
            visible={showPassword}
            onToggleVisibility={() => setShowPassword((current) => !current)}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password ? (
            <p className="text-sm text-danger">{errors.password.message}</p>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {LOGIN_COPY.resetPassword.confirmPassword}{" "}
            <span className="text-danger">
              {LOGIN_COPY.fields.requiredMark}
            </span>
          </span>
          <PasswordInput
            {...register("confirmPassword")}
            visible={showConfirmPassword}
            onToggleVisibility={() =>
              setShowConfirmPassword((current) => !current)
            }
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
          />
          {errors.confirmPassword ? (
            <p className="text-sm text-danger">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </label>
      </div>

      {errors.root?.message ? (
        <Notice tone="danger" message={errors.root.message} />
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
      >
        {isSubmitting
          ? LOGIN_COPY.resetPassword.submit.loading
          : LOGIN_COPY.resetPassword.submit.idle}
      </Button>
    </form>
  );
}
