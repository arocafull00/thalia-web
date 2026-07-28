import { Building2, Pencil, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import type { OwnerRegistrationFormValues } from "@/lib/schemas/register-schema";

type Props = {
  values: OwnerRegistrationFormValues;
  onEditAccount: () => void;
  onEditClinic: () => void;
};

function displayValue(value: string) {
  return value.trim() || REGISTER_OWNER_COPY.confirmation.emptyValue;
}

export default function OwnerConfirmationStep({
  values,
  onEditAccount,
  onEditClinic,
}: Props) {
  const copy = REGISTER_OWNER_COPY.confirmation;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium text-ink">{copy.title}</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-ink-secondary">
          {copy.subtitle}
        </p>
      </div>
      <div className="divide-y divide-border-subtle rounded-2xl border border-border">
        <section className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <UserRound className="size-4 text-primary" aria-hidden="true" />
              {copy.accountTitle}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onEditAccount}
            >
              <Pencil aria-hidden="true" />
              {copy.editAction}
            </Button>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-muted">Nombre</dt>
              <dd className="mt-0.5 text-sm text-ink">
                {displayValue(values.fullName)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Email</dt>
              <dd className="mt-0.5 break-all text-sm text-ink">
                {displayValue(values.email)}
              </dd>
            </div>
          </dl>
        </section>
        <section className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <Building2 className="size-4 text-primary" aria-hidden="true" />
              {copy.clinicTitle}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={onEditClinic}
            >
              <Pencil aria-hidden="true" />
              {copy.editAction}
            </Button>
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-xs text-ink-muted">Nombre</dt>
              <dd className="mt-0.5 text-sm text-ink">
                {displayValue(values.clinicName)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-muted">Teléfono</dt>
              <dd className="mt-0.5 text-sm text-ink">
                {displayValue(values.clinicPhone)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs text-ink-muted">Dirección</dt>
              <dd className="mt-0.5 text-sm text-ink">
                {displayValue(values.address)}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
