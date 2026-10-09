"use client";

import { AlertTriangle, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { APPOINTMENT_STATUS_COPY } from "@/copy/appointment-status-copy";
import {
  getAppointmentStatusErrorMessage,
  isAppointmentStockError,
} from "@/lib/appointment-errors";
import type { AppointmentStockIssue } from "@/lib/appointment-stock";

type AppointmentStatusErrorToastProps = {
  issue: AppointmentStockIssue;
  onClose: () => void;
};

/**
 * Aviso de que no hay material para completar la cita.
 *
 * Pinta su propia superficie porque `toast.custom` NO envuelve el contenido en
 * el contenedor con estilo de sonner: las clases de `toastOptions` del `Toaster`
 * solo se aplican a los toasts normales. Sin fondo propio, esto se veía
 * transparente sobre la página.
 *
 * Y lleva botón de cerrar porque vive con `duration: Infinity`: se queda hasta
 * que alguien lo lee, que es lo que se quiere para un error que nombra un
 * producto, pero sin botón no había forma de quitarlo de en medio.
 */
export default function AppointmentStatusErrorToast({
  issue,
  onClose,
}: AppointmentStatusErrorToastProps) {
  return (
    <div
      role="alert"
      className="flex w-full items-start gap-3 rounded-dialog border border-danger/25 bg-danger-subtle p-3.5 shadow-panel"
    >
      <AlertTriangle
        className="mt-0.5 size-4 shrink-0 text-danger"
        aria-hidden="true"
      />
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <p className="text-sm text-ink">
          {APPOINTMENT_STATUS_COPY.stockError(issue)}
        </p>
        <Button asChild variant="outline" size="xs">
          <Link href={`/inventory/${issue.inventoryItemId}`} onClick={onClose}>
            {APPOINTMENT_STATUS_COPY.viewProduct}
          </Link>
        </Button>
      </div>
      <button
        type="button"
        onClick={onClose}
        aria-label={APPOINTMENT_STATUS_COPY.dismiss}
        className="-mr-1 -mt-1 shrink-0 rounded-button p-1.5 text-ink-muted transition-colors hover:bg-(--hover-overlay) hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function notifyAppointmentStatusError(cause: unknown) {
  if (!isAppointmentStockError(cause)) {
    toast.error(getAppointmentStatusErrorMessage(cause));
    return;
  }

  toast.custom(
    (t) => (
      <AppointmentStatusErrorToast
        issue={cause.stockIssue}
        onClose={() => toast.dismiss(t)}
      />
    ),
    { duration: Infinity },
  );
}
