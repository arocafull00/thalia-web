import Link from "next/link";
import type { FormEvent } from "react";

import LoginAuthTabs from "@/components/auth/login/components/login-auth-tabs";
import LoginFormFields from "@/components/auth/login/components/login-form-fields";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";

type LoginFormPanelProps = {
  authDisabled: boolean;
  email: string;
  error: string | null;
  handleGoogleSignIn: () => void;
  handleRegisterPress: () => void;
  handleSubmit: () => void;
  isSupabaseConfigured: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  password: string;
  showPassword: boolean;
  submitting: boolean;
};

export default function LoginFormPanel({
  authDisabled,
  email,
  error,
  handleGoogleSignIn,
  handleRegisterPress,
  handleSubmit,
  isSupabaseConfigured,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  password,
  showPassword,
  submitting,
}: LoginFormPanelProps) {
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
              {LOGIN_COPY.title}
            </h1>
            <p className="text-sm text-ink-secondary">{LOGIN_COPY.subtitle}</p>
          </div>

          <LoginAuthTabs onRegisterPress={handleRegisterPress} />

          <form className="space-y-6" onSubmit={onFormSubmit}>
            <LoginFormFields
              email={email}
              onEmailChange={onEmailChange}
              onPasswordChange={onPasswordChange}
              onTogglePassword={onTogglePassword}
              password={password}
              showPassword={showPassword}
            />

            <div className="text-center">
              <Link
                href="/forgot-password"
                className="text-sm text-ink-secondary hover:underline"
              >
                {LOGIN_COPY.forgotPassword.link}
              </Link>
            </div>

            {!isSupabaseConfigured ? (
              <Notice tone="warning" message={LOGIN_COPY.supabaseWarning} />
            ) : null}
            {error ? <Notice tone="danger" message={error} /> : null}

            <div className="flex flex-col items-center gap-3">
              <Button
                type="submit"
                disabled={authDisabled}
                className="min-h-11 w-64 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide"
              >
                {submitting
                  ? LOGIN_COPY.submit.loading
                  : LOGIN_COPY.submit.idle}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={authDisabled}
                onClick={() => void handleGoogleSignIn()}
                className="min-h-11 w-64 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {LOGIN_COPY.google}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border-subtle px-6 py-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>{LOGIN_COPY.footer.copyright}</span>
        <div className="flex gap-4">
          <a href="#" className="text-primary hover:text-primary-hover">
            {LOGIN_COPY.footer.terms}
          </a>
          <a href="#" className="text-primary hover:text-primary-hover">
            {LOGIN_COPY.footer.privacy}
          </a>
        </div>
      </footer>
    </section>
  );
}
