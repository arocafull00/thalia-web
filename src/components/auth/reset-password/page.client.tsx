"use client";

import type { FormEvent } from "react";

import PasswordInput from "@/components/auth/components/password-input";
import ResetPasswordOpeningSession from "@/components/auth/reset-password/components/reset-password-opening-session";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";
import { useResetPassword } from "@/lib/hooks/use-reset-password";

export default function ResetPasswordPageClient() {
  const {
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loading,
    submitting,
    success,
    error,
    handleSubmit,
  } = useResetPassword();

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit();
  };

  return (
    <section className="flex min-h-screen flex-1 flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center px-6 pb-6 lg:px-8">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="space-y-2 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Thalia"
              width={56}
              height={56}
              className="mx-auto mb-4 rounded-xl"
            />
            <h1 className="text-2xl font-medium text-ink">
              {LOGIN_COPY.resetPassword.title}
            </h1>
            <p className="text-sm text-ink-secondary">
              {LOGIN_COPY.resetPassword.description}
            </p>
          </div>

          {success ? (
            <ResetPasswordOpeningSession />
          ) : (
            <form className="space-y-6" onSubmit={onFormSubmit}>
              <div className="space-y-4">
                <label className="block space-y-1.5">
                  <span className="text-sm text-ink-secondary">
                    {LOGIN_COPY.resetPassword.newPassword}{" "}
                    <span className="text-danger">
                      {LOGIN_COPY.fields.requiredMark}
                    </span>
                  </span>
                  <PasswordInput
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    visible={showPassword}
                    onToggleVisibility={() =>
                      setShowPassword((current) => !current)
                    }
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="text-sm text-ink-secondary">
                    {LOGIN_COPY.resetPassword.confirmPassword}{" "}
                    <span className="text-danger">
                      {LOGIN_COPY.fields.requiredMark}
                    </span>
                  </span>
                  <PasswordInput
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    visible={showConfirmPassword}
                    onToggleVisibility={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    autoComplete="new-password"
                    required
                    minLength={8}
                  />
                </label>
              </div>

              {error ? <Notice tone="danger" message={error} /> : null}

              <Button
                type="submit"
                disabled={
                  loading || submitting || !password || !confirmPassword
                }
                className="w-full rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
              >
                {submitting
                  ? LOGIN_COPY.resetPassword.submit.loading
                  : LOGIN_COPY.resetPassword.submit.idle}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
