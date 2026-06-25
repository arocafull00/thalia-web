import type { FormEvent } from "react";

import LoginAuthTabs from "@/components/auth/login/components/login-auth-tabs";
import LoginFormFields from "@/components/auth/login/components/login-form-fields";
import { LOGIN_COPY } from "@/components/auth/login/login-copy";
import { ActionButton, Notice } from "@/components/ui/primitives";

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
      <header className="p-6 lg:p-8">
        <span className="text-xl font-semibold tracking-tight text-ink">{LOGIN_COPY.brand}</span>
      </header>

      <div className="flex flex-1 items-center justify-center px-6 pb-6 lg:px-8">
        <div className="w-full max-w-[440px] space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-medium text-ink">{LOGIN_COPY.title}</h1>
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

            {!isSupabaseConfigured ? (
              <Notice tone="warning" message={LOGIN_COPY.supabaseWarning} />
            ) : null}
            {error ? <Notice tone="danger" message={error} /> : null}

            <button
              type="submit"
              disabled={authDisabled}
              className="w-full rounded-full bg-primary px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-on-primary hover:bg-primary-hover disabled:opacity-50"
            >
              {submitting ? LOGIN_COPY.submit.loading : LOGIN_COPY.submit.idle}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border-subtle" />
              <span className="text-xs text-ink-muted">{LOGIN_COPY.divider}</span>
              <div className="h-px flex-1 bg-border-subtle" />
            </div>

            <div className="w-full [&>button]:w-full">
              <ActionButton
                title={LOGIN_COPY.google}
                variant="ghost"
                disabled={authDisabled}
                onClick={() => void handleGoogleSignIn()}
              />
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
