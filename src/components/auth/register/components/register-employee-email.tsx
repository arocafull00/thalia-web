import { ArrowLeft } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { REGISTER_COPY } from "@/copy/register-copy";

type Props = {
  emailRegister: UseFormRegisterReturn<"email">;
  emailError?: string;
  error: string | null;
  submitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

export default function RegisterEmployeeEmail({
  emailRegister,
  emailError,
  error,
  submitting,
  onSubmit,
  onBack,
}: Props) {
  const copy = REGISTER_COPY.employeeEmail;

  return (
    <form
      className="flex flex-1 items-center justify-center p-8"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit();
      }}
    >
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-surface p-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium text-ink">{copy.title}</h1>
          <p className="text-sm text-ink-secondary">{copy.subtitle}</p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs uppercase tracking-wide text-ink-secondary">
            {copy.emailLabel}
          </span>
          <input
            type="email"
            {...emailRegister}
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
            autoFocus
            placeholder={copy.emailPlaceholder}
            aria-invalid={Boolean(emailError)}
          />
          {emailError ? (
            <span className="text-sm text-danger">{emailError}</span>
          ) : null}
        </label>
        {error ? <Notice tone="danger" message={error} /> : null}
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-wide"
          >
            <ArrowLeft size={14} />
            {copy.backButton}
          </Button>
          <ActionButton
            title={submitting ? "Verificando..." : copy.continueButton}
            disabled={submitting}
            onClick={onSubmit}
          />
        </div>
      </div>
    </form>
  );
}
