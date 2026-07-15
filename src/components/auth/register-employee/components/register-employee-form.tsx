import { Eye, EyeOff, LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { REGISTER_EMPLOYEE_FORM_COPY } from "@/copy/register-employee-copy";

type RegisterEmployeeFormCopy = {
  title: string;
  subtitle: string;
};

type RegisterEmployeeFormProps = {
  authDisabled: boolean;
  copy: RegisterEmployeeFormCopy;
  email: string;
  error: string | null;
  fullName: string;
  hasSession: boolean;
  invitationEmail: string | null;
  isSupabaseConfigured: boolean;
  onContinue: () => void;
  onEmailChange: (value: string) => void;
  onFullNameChange: (value: string) => void;
  onLoginPress: () => void;
  onPasswordChange: (value: string) => void;
  onSignOut: () => void;
  password: string;
  submitting: boolean;
};

export default function RegisterEmployeeForm({
  authDisabled,
  copy,
  email,
  error,
  fullName,
  hasSession,
  invitationEmail,
  isSupabaseConfigured,
  onContinue,
  onEmailChange,
  onFullNameChange,
  onLoginPress,
  onPasswordChange,
  onSignOut,
  password,
  submitting,
}: RegisterEmployeeFormProps) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleContinue = () => {
    if (!hasSession && password !== confirmPassword) {
      setConfirmError(REGISTER_EMPLOYEE_FORM_COPY.errors.passwordMismatch);
      return;
    }
    setConfirmError(null);
    onContinue();
  };

  return (
    <section className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-medium text-ink">{copy.title}</h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.subtitle}</p>
        </div>
        <div className="space-y-4">
          {!hasSession && invitationEmail ? (
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wide text-ink-secondary">
                {REGISTER_EMPLOYEE_FORM_COPY.emailLabel}
              </span>
              <input
                value={invitationEmail}
                disabled
                type="email"
                className="w-full rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm text-ink-secondary outline-none"
              />
            </label>
          ) : null}
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-ink-secondary">
              {REGISTER_EMPLOYEE_FORM_COPY.fullNameLabel}
            </span>
            <input
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              placeholder={REGISTER_EMPLOYEE_FORM_COPY.fullNamePlaceholder}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
            />
          </label>
          {!hasSession ? (
            <>
              {!invitationEmail ? (
                <label className="block space-y-1">
                  <span className="text-xs uppercase tracking-wide text-ink-secondary">
                    {REGISTER_EMPLOYEE_FORM_COPY.emailLabel}
                  </span>
                  <input
                    value={email}
                    onChange={(event) => onEmailChange(event.target.value)}
                    type="email"
                    placeholder={REGISTER_EMPLOYEE_FORM_COPY.emailPlaceholder}
                    className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                  />
                </label>
              ) : null}
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.passwordLabel}
                </span>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(event) => onPasswordChange(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      REGISTER_EMPLOYEE_FORM_COPY.passwordPlaceholder
                    }
                    className="w-full rounded-xl border border-border px-3 py-2.5 pr-10 text-sm outline-none ring-primary focus:ring-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </label>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.confirmPasswordLabel}
                </span>
                <div className="relative">
                  <input
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={
                      REGISTER_EMPLOYEE_FORM_COPY.passwordPlaceholder
                    }
                    className="w-full rounded-xl border border-border px-3 py-2.5 pr-10 text-sm outline-none ring-primary focus:ring-2"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </Button>
                </div>
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
        {confirmError ? <Notice tone="danger" message={confirmError} /> : null}
        {error ? <Notice tone="danger" message={error} /> : null}
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={authDisabled}
            onClick={onSignOut}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-wide"
          >
            <LogOut size={14} />
            Salir
          </Button>
          <ActionButton
            title={
              submitting
                ? REGISTER_EMPLOYEE_FORM_COPY.savingButton
                : REGISTER_EMPLOYEE_FORM_COPY.continueButton
            }
            disabled={authDisabled}
            onClick={() => void handleContinue()}
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
      </div>
    </section>
  );
}
