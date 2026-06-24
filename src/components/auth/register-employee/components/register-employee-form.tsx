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
  password,
  submitting,
}: RegisterEmployeeFormProps) {
  return (
    <section className="flex flex-1 items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-2xl font-medium text-zinc-900">{copy.title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{copy.subtitle}</p>
        </div>
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-zinc-500">
              {REGISTER_EMPLOYEE_FORM_COPY.fullNameLabel}
            </span>
            <input
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-900 focus:ring-2"
            />
          </label>
          {!hasSession ? (
            <>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  {REGISTER_EMPLOYEE_FORM_COPY.emailLabel}
                </span>
                <input
                  value={email}
                  onChange={(event) => onEmailChange(event.target.value)}
                  type="email"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-900 focus:ring-2"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs uppercase tracking-wide text-zinc-500">
                  {REGISTER_EMPLOYEE_FORM_COPY.passwordLabel}
                </span>
                <input
                  value={password}
                  onChange={(event) => onPasswordChange(event.target.value)}
                  type="password"
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-900 focus:ring-2"
                />
              </label>
            </>
          ) : null}
        </div>
        {!isSupabaseConfigured ? (
          <Notice tone="warning" message={REGISTER_EMPLOYEE_FORM_COPY.supabaseWarning} />
        ) : null}
        {error ? <Notice tone="danger" message={error} /> : null}
        <ActionButton
          title={submitting ? REGISTER_EMPLOYEE_FORM_COPY.savingButton : REGISTER_EMPLOYEE_FORM_COPY.continueButton}
          disabled={authDisabled}
          onClick={() => void onContinue()}
        />
        {!hasSession ? (
          <button type="button" onClick={onLoginPress} className="w-full text-center text-sm text-zinc-500">
            {REGISTER_EMPLOYEE_FORM_COPY.loginPrompt}{" "}
            <span className="font-medium text-zinc-900">{REGISTER_EMPLOYEE_FORM_COPY.loginAction}</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
