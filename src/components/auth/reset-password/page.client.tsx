"use client";

import ResetPasswordForm from "@/components/auth/reset-password/components/reset-password-form";
import ResetPasswordLinkError from "@/components/auth/reset-password/components/reset-password-link-error";
import ResetPasswordOpeningSession from "@/components/auth/reset-password/components/reset-password-opening-session";
import { LOGIN_COPY } from "@/copy/login-copy";
import { useResetPassword } from "@/lib/hooks/use-reset-password";

export default function ResetPasswordPageClient() {
  const { form, handleSubmit, linkError, status } = useResetPassword();

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

          {status === "loading" ? (
            <ResetPasswordOpeningSession
              message={LOGIN_COPY.resetPassword.validatingSession}
            />
          ) : null}

          {status === "invalid" && linkError ? (
            <ResetPasswordLinkError error={linkError} />
          ) : null}

          {status === "ready" ? (
            <ResetPasswordForm
              errors={form.formState.errors}
              isSubmitting={form.formState.isSubmitting}
              onSubmit={handleSubmit}
              register={form.register}
            />
          ) : null}

          {status === "success" ? (
            <ResetPasswordOpeningSession
              message={LOGIN_COPY.resetPassword.openingSession}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
