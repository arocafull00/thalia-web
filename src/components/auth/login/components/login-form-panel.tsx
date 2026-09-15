import { Download } from "lucide-react";
import Link from "next/link";
import type { FormEvent } from "react";

import GoogleSignInButton from "@/components/auth/components/google-sign-in-button";
import LoginAuthTabs from "@/components/auth/login/components/login-auth-tabs";
import LoginFormFields from "@/components/auth/login/components/login-form-fields";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";

type LoginFormPanelProps = {
  authDisabled: boolean;
  email: string;
  error: string | null;
  handleGoogleSignIn: () => void;
  handleRegisterPress: () => void;
  handleSubmit: () => void;
  isSupabaseConfigured: boolean;
  onEmailChange: (value: string) => void;
  onInstallClick: () => void;
  onPasswordChange: (value: string) => void;
  onTogglePassword: () => void;
  password: string;
  showInstallCta: boolean;
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
  onInstallClick,
  onPasswordChange,
  onTogglePassword,
  password,
  showInstallCta,
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
              src="/icon.png"
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
              <GoogleSignInButton
                label={LOGIN_COPY.google}
                disabled={authDisabled}
                onClick={() => void handleGoogleSignIn()}
                className="w-64"
              />
              {showInstallCta ? (
                <Button
                  type="button"
                  variant="outline"
                  aria-label={LOGIN_COPY.install.ariaLabel}
                  data-testid="pwa-install-login"
                  onClick={onInstallClick}
                  className="min-h-11 w-64 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide"
                >
                  <Download size={14} strokeWidth={1.75} aria-hidden="true" />
                  {PWA_INSTALL_COPY.installButton}
                </Button>
              ) : null}
            </div>
          </form>
        </div>
      </div>

      <footer className="flex flex-col gap-3 border-t border-border-subtle px-6 py-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <span>{LOGIN_COPY.footer.copyright}</span>
        <div className="flex gap-4">
          <Link href="/terms" className="text-primary hover:text-primary-hover">
            {LOGIN_COPY.footer.terms}
          </Link>
          <a href="#" className="text-primary hover:text-primary-hover">
            {LOGIN_COPY.footer.privacy}
          </a>
        </div>
      </footer>
    </section>
  );
}
