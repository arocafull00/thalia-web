"use client";

import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import GoogleSignInButton from "@/components/auth/components/google-sign-in-button";
import PasswordInput from "@/components/auth/components/password-input";
import { Input } from "@/components/ui/input";
import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import type { OwnerRegistrationFormValues } from "@/lib/schemas/register-schema";

type Props = {
  authDisabled: boolean;
  errors: FieldErrors<OwnerRegistrationFormValues>;
  hasSession: boolean;
  onGoogleSignIn: () => void;
  register: UseFormRegister<OwnerRegistrationFormValues>;
};

export default function OwnerAccountStep({
  authDisabled,
  errors,
  hasSession,
  onGoogleSignIn,
  register,
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const copy = REGISTER_OWNER_COPY.account;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium text-ink">{copy.title}</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-ink-secondary">
          {copy.subtitle}
        </p>
      </div>
      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-ink-secondary">
            {copy.fullNameLabel}
          </span>
          <Input
            {...register("fullName")}
            autoComplete="name"
            autoFocus
            placeholder={copy.fullNamePlaceholder}
            aria-invalid={Boolean(errors.fullName)}
            className="h-10"
          />
          {errors.fullName ? (
            <span className="text-sm text-danger">
              {errors.fullName.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-ink-secondary">
            {copy.emailLabel}
          </span>
          <Input
            {...register("email")}
            type="email"
            autoComplete="email"
            readOnly={hasSession}
            aria-readonly={hasSession}
            placeholder={copy.emailPlaceholder}
            aria-invalid={Boolean(errors.email)}
            className="h-10"
          />
          {errors.email ? (
            <span className="text-sm text-danger">{errors.email.message}</span>
          ) : null}
        </label>
        {!hasSession ? (
          <>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-ink-secondary">
                {copy.passwordLabel}
              </span>
              <PasswordInput
                {...register("password")}
                visible={showPassword}
                onToggleVisibility={() =>
                  setShowPassword((current) => !current)
                }
                autoComplete="new-password"
                placeholder={copy.passwordPlaceholder}
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password ? (
                <span className="text-sm text-danger">
                  {errors.password.message}
                </span>
              ) : null}
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-medium text-ink-secondary">
                {copy.confirmPasswordLabel}
              </span>
              <PasswordInput
                {...register("confirmPassword")}
                visible={showConfirmPassword}
                onToggleVisibility={() =>
                  setShowConfirmPassword((current) => !current)
                }
                autoComplete="new-password"
                placeholder={copy.passwordPlaceholder}
                aria-invalid={Boolean(errors.confirmPassword)}
              />
              {errors.confirmPassword ? (
                <span className="text-sm text-danger">
                  {errors.confirmPassword.message}
                </span>
              ) : null}
            </label>
            <div className="relative py-2">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-border-subtle" />
              </div>
              <p className="relative mx-auto w-fit bg-surface px-3 text-xs text-ink-muted">
                {copy.divider}
              </p>
            </div>
            <GoogleSignInButton
              label={copy.google}
              disabled={authDisabled}
              onClick={onGoogleSignIn}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
