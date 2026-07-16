"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import PasswordInput from "@/components/auth/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { REGISTER_EMPLOYEE_FORM_COPY } from "@/copy/register-employee-copy";
import type { RegisterEmployeeFormValues } from "@/lib/schemas/register-schema";

type RegisterEmployeeFormCopy = {
  title: string;
  subtitle: string;
};

type RegisterEmployeeFormProps = {
  authDisabled: boolean;
  copy: RegisterEmployeeFormCopy;
  errors: FieldErrors<RegisterEmployeeFormValues>;
  hasSession: boolean;
  invitationEmail: string | null;
  isSupabaseConfigured: boolean;
  onContinue: () => void;
  onLoginPress: () => void;
  onSignOut: () => void;
  register: UseFormRegister<RegisterEmployeeFormValues>;
  submitting: boolean;
};

export default function RegisterEmployeeForm({
  authDisabled,
  copy,
  errors,
  hasSession,
  invitationEmail,
  isSupabaseConfigured,
  onContinue,
  onLoginPress,
  onSignOut,
  register,
  submitting,
}: RegisterEmployeeFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <section className="flex flex-1 items-center justify-center p-8">
      <form
        className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-border bg-surface p-8 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void onContinue();
        }}
      >
        <div>
          <h2 className="text-2xl font-medium text-ink">{copy.title}</h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.subtitle}</p>
        </div>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-ink-secondary">
              {REGISTER_EMPLOYEE_FORM_COPY.fullNameLabel}
            </span>
            <Input
              {...register("fullName")}
              placeholder={REGISTER_EMPLOYEE_FORM_COPY.fullNamePlaceholder}
              aria-invalid={Boolean(errors.fullName)}
              className="h-10 rounded-xl"
            />
            {errors.fullName ? (
              <span className="text-sm text-danger">
                {errors.fullName.message}
              </span>
            ) : null}
          </label>
          {!hasSession ? (
            <>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.emailLabel}
                </span>
                <Input
                  {...register("email")}
                  type="email"
                  readOnly={Boolean(invitationEmail)}
                  aria-readonly={Boolean(invitationEmail)}
                  placeholder={REGISTER_EMPLOYEE_FORM_COPY.emailPlaceholder}
                  aria-invalid={Boolean(errors.email)}
                  className="h-10 rounded-xl"
                />
                {errors.email ? (
                  <span className="text-sm text-danger">
                    {errors.email.message}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.passwordLabel}
                </span>
                <PasswordInput
                  {...register("password")}
                  visible={showPassword}
                  onToggleVisibility={() =>
                    setShowPassword((current) => !current)
                  }
                  autoComplete="new-password"
                  placeholder={REGISTER_EMPLOYEE_FORM_COPY.passwordPlaceholder}
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password ? (
                  <span className="text-sm text-danger">
                    {errors.password.message}
                  </span>
                ) : null}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.confirmPasswordLabel}
                </span>
                <PasswordInput
                  {...register("confirmPassword")}
                  visible={showConfirmPassword}
                  onToggleVisibility={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  autoComplete="new-password"
                  placeholder={REGISTER_EMPLOYEE_FORM_COPY.passwordPlaceholder}
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                {errors.confirmPassword ? (
                  <span className="text-sm text-danger">
                    {errors.confirmPassword.message}
                  </span>
                ) : null}
              </label>
            </>
          ) : null}
        </div>
        {!isSupabaseConfigured ? (
          <Notice
            tone="warning"
            message={REGISTER_EMPLOYEE_FORM_COPY.supabaseWarning}
          />
        ) : null}
        {errors.root?.message ? (
          <Notice tone="danger" message={errors.root.message} />
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={authDisabled}
            onClick={onSignOut}
            className="rounded-full px-4 py-2 text-xs uppercase tracking-wide"
          >
            <LogOut data-icon="inline-start" />
            Salir
          </Button>
          <ActionButton
            title={
              submitting
                ? REGISTER_EMPLOYEE_FORM_COPY.savingButton
                : REGISTER_EMPLOYEE_FORM_COPY.continueButton
            }
            disabled={authDisabled}
            onClick={onContinue}
          />
        </div>
        {!hasSession ? (
          <Button
            type="button"
            variant="link"
            onClick={onLoginPress}
            className="w-full text-center text-sm"
          >
            {REGISTER_EMPLOYEE_FORM_COPY.loginPrompt}{" "}
            <span className="font-medium text-ink">
              {REGISTER_EMPLOYEE_FORM_COPY.loginAction}
            </span>
          </Button>
        ) : null}
      </form>
    </section>
  );
}
