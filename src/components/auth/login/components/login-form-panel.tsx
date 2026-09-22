import Link from "next/link";
import type { FormEvent } from "react";

import GoogleSignInButton from "@/components/auth/components/google-sign-in-button";
import LoginFormFields from "@/components/auth/login/components/login-form-fields";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { LOGIN_COPY } from "@/copy/login-copy";

type LoginFormPanelProps = {
  authDisabled: boolean;
  email: string;
  error: string | null;
  handleGoogleSignIn: () => void;
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
    <div className="w-full max-w-[440px]">
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
            {submitting ? LOGIN_COPY.submit.loading : LOGIN_COPY.submit.idle}
          </Button>
          <GoogleSignInButton
            label={LOGIN_COPY.google}
            disabled={authDisabled}
            onClick={() => void handleGoogleSignIn()}
            className="w-64"
          />
        </div>
      </form>
    </div>
  );
}
