import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { REGISTER_COPY } from "@/copy/register-copy";

type Props = {
  email: string;
  error: string | null;
  submitting: boolean;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export default function RegisterEmployeeEmail({
  email,
  error,
  submitting,
  onEmailChange,
  onSubmit,
  onBack,
}: Props) {
  const copy = REGISTER_COPY.employeeEmail;

  return (
    <div className="flex flex-1 items-center justify-center p-8">
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
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void onSubmit();
            }}
            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
            autoFocus
          />
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
            onClick={() => void onSubmit()}
          />
        </div>
      </div>
    </div>
  );
}
