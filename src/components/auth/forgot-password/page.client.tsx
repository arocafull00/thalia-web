"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";

import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";
import { useForgotPassword } from "@/lib/hooks/use-forgot-password";

export default function ForgotPasswordPageClient() {
  const { email, setEmail, submitting, submitted, error, handleSubmit } =
    useForgotPassword();

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit();
  };

  return (
    <section className="flex min-h-screen flex-1 flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center px-6 pb-6 lg:px-8">
        <div className="w-full max-w-[440px] space-y-3">
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
              {LOGIN_COPY.brand}
            </h1>
            <p className="text-sm text-ink-secondary">
              {LOGIN_COPY.forgotPassword.title}
            </p>
            {!submitted ? (
              <p className="text-sm text-ink-secondary pt-6">
                {LOGIN_COPY.forgotPassword.description}
              </p>
            ) : null}
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="rounded-xl bg-primary/15 px-4 py-3 text-sm font-medium text-primary">
                {LOGIN_COPY.forgotPassword.success}
              </div>
              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-ink-secondary underline hover:text-ink"
                >
                  {LOGIN_COPY.forgotPassword.backToLogin}
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onFormSubmit}>
              <label className="block space-y-1.5">
                <span className="text-sm text-ink-secondary">
                  {LOGIN_COPY.fields.emailLabel}{" "}
                  <span className="text-danger">
                    {LOGIN_COPY.fields.requiredMark}
                  </span>
                </span>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoComplete="email"
                    required
                    placeholder={LOGIN_COPY.fields.emailPlaceholder}
                    className="w-full rounded-xl border border-border bg-surface py-2.5 pr-3 pl-10 text-sm outline-none ring-primary focus:ring-2"
                  />
                </div>
              </label>

              {error ? <Notice tone="danger" message={error} /> : null}

              <button
                type="submit"
                disabled={submitting || !email.trim()}
                className="w-full rounded-full bg-primary px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-on-primary hover:bg-primary-hover disabled:opacity-50"
              >
                {submitting
                  ? LOGIN_COPY.forgotPassword.submit.loading
                  : LOGIN_COPY.forgotPassword.submit.idle}
              </button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-ink-secondary underline hover:text-ink"
                >
                  {LOGIN_COPY.forgotPassword.backToLogin}
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
