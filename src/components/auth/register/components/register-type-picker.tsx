import { Building2, LogOut, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { REGISTER_COPY } from "@/copy/register-copy";

type Props = {
  onPickOwner: () => void;
  onPickEmployee: () => void;
  onSignOut: () => void;
};

export default function RegisterTypePicker({
  onPickOwner,
  onPickEmployee,
  onSignOut,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icon.png"
          alt="Thalia"
          width={56}
          height={56}
          className="mx-auto mb-4 rounded-xl"
        />
        <h1 className="text-2xl font-medium text-ink">{REGISTER_COPY.title}</h1>
        <p className="text-sm text-ink-secondary">{REGISTER_COPY.subtitle}</p>
      </div>
      <div className="divide-y divide-border-subtle border-y border-border-subtle">
        <button
          type="button"
          onClick={onPickOwner}
          className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <Building2 size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">{REGISTER_COPY.owner.title}</p>
            <p className="mt-0.5 text-sm text-ink-secondary">
              {REGISTER_COPY.owner.description}
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={onPickEmployee}
          className="flex w-full items-start gap-4 py-5 text-left transition-colors hover:bg-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
            <UserCheck size={20} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">
              {REGISTER_COPY.employee.title}
            </p>
            <p className="mt-0.5 text-sm text-ink-secondary">
              {REGISTER_COPY.employee.description}
            </p>
          </div>
        </button>
      </div>
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={onSignOut}
          className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs uppercase tracking-wide"
        >
          <LogOut size={14} aria-hidden="true" />
          Salir
        </Button>
      </div>
    </div>
  );
}
