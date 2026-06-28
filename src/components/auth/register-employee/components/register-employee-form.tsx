import { LogOut } from "lucide-react";

import { REGISTER_EMPLOYEE_FORM_COPY } from "@/components/auth/register-employee/register-employee-copy";
import { ActionButton, Notice } from "@/components/ui/primitives";

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
  return (
    <section className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-surface p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-medium text-ink">{copy.title}</h2>
          <p className="mt-1 text-sm text-ink-secondary">{copy.subtitle}</p>
        </div>
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-ink-secondary">
              {REGISTER_EMPLOYEE_FORM_COPY.fullNameLabel}
            </span>
            <input
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
            />
          </label>
          {!hasSession ? (
            <>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.emailLabel}
                </span>
                <input
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  type="email"
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wide text-ink-secondary">
                  {REGISTER_EMPLOYEE_FORM_COPY.passwordLabel}
                </span>
                <input
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  type="password"
                  className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
                />
              </label>
            </>
          ) : null}
        </div>
        {!isSupabaseConfigured ? (
          <Notice tone="warning" message={REGISTER_EMPLOYEE_FORM_COPY.supabaseWarning} />
        ) : null}
        {error ? <Notice tone="danger" message={error} /> : null}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wide"
          >
            <LogOut size={14} />
            Salir
          </button>
          <ActionButton
            title={submitting ? REGISTER_EMPLOYEE_FORM_COPY.savingButton : REGISTER_EMPLOYEE_FORM_COPY.continueButton}
            disabled={authDisabled}
            onClick={() => void onContinue()}
          />
        </div>
        {!hasSession ? (
          <button type="button" onClick={onLoginPress} className="w-full text-center text-sm text-ink-secondary">
            {REGISTER_EMPLOYEE_FORM_COPY.loginPrompt}{" "}
            <span className="font-medium text-ink">{REGISTER_EMPLOYEE_FORM_COPY.loginAction}</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
