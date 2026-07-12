"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import type { FormEvent } from "react";

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
    submitting,
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
              src="/logo.png"
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

          <form className="space-y-6" onSubmit={onFormSubmit}>
            <div className="space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm text-ink-secondary">
                  {LOGIN_COPY.resetPassword.newPassword}{" "}
                  <span className="text-danger">
                    {LOGIN_COPY.fields.requiredMark}
                  </span>
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-10 text-sm outline-none ring-primary focus:ring-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </label>

              <label className="block space-y-1.5">
                <span className="text-sm text-ink-secondary">
                  {LOGIN_COPY.resetPassword.confirmPassword}{" "}
                  <span className="text-danger">
                    {LOGIN_COPY.fields.requiredMark}
                  </span>
                </span>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="w-full rounded-xl border border-border bg-surface py-2.5 pr-10 pl-10 text-sm outline-none ring-primary focus:ring-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted hover:text-ink-secondary"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </label>
            </div>

            {error ? <Notice tone="danger" message={error} /> : null}

            <Button
              type="submit"
              disabled={submitting || !password || !confirmPassword}
              className="w-full rounded-full px-4 py-2.5 text-xs font-medium uppercase tracking-wide"
            >
              {submitting
                ? LOGIN_COPY.resetPassword.submit.loading
                : LOGIN_COPY.resetPassword.submit.idle}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
