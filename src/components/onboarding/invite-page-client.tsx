"use client";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { useAcceptInvitation } from "@/lib/hooks/use-accept-invitation";
import type { EmployeeRole } from "@/types/database.types";

const MEMBERSHIP_ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  employee: "Empleado",
  external: "Externo",
};

const EMPLOYEE_ROLE_OPTIONS: { value: EmployeeRole; label: string }[] = [
  { value: "doctor", label: "Doctor" },
  { value: "reception", label: "Recepción" },
  { value: "auxiliary", label: "Auxiliar" },
];

type Props = {
  token: string;
};

export default function InvitePageClient({ token }: Props) {
  const {
    state,
    submitting,
    employeeRole,
    setEmployeeRole,
    handleAccept,
    handleReject,
  } = useAcceptInvitation(token);

  if (state.status === "loading" || state.status === "unauthenticated") {
    return null;
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-10">
          <Notice tone="danger" message={state.message} />
        </div>
      </div>
    );
  }

  if (state.status === "accepted" || state.status === "rejected") {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-border bg-surface p-10">
        <div>
          <h1 className="text-2xl font-medium text-ink">Invitación recibida</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Te han invitado a unirte a{" "}
            <span className="font-medium text-ink">{state.clinicName}</span>{" "}
            como{" "}
            <span className="font-medium text-ink">
              {MEMBERSHIP_ROLE_LABELS[state.role] ?? state.role}
            </span>
            .
          </p>
        </div>
        {state.role !== "admin" ? (
          <label className="block space-y-1.5">
            <span className="text-sm text-ink-secondary">Tu profesión</span>
            <select
              value={employeeRole}
              onChange={(e) => setEmployeeRole(e.target.value as EmployeeRole)}
              className="w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
            >
              {EMPLOYEE_ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleReject()}
            disabled={submitting}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            Rechazar
          </Button>
          <ActionButton
            title={submitting ? "Procesando..." : "Aceptar invitación"}
            disabled={submitting}
            onClick={() => void handleAccept()}
          />
        </div>
      </div>
    </div>
  );
}
