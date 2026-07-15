"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

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

export default function AppointmentStatusErrorToast({
  issue,
  onClose,
}: AppointmentStatusErrorToastProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-2">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-danger"
          aria-hidden="true"
        />
        <p className="text-sm text-ink">
          {APPOINTMENT_STATUS_COPY.stockError(issue)}
        </p>
      </div>
      <Button asChild variant="outline" size="xs" className="ml-6 w-fit">
        <Link href={`/inventory/${issue.inventoryItemId}`} onClick={onClose}>
          {APPOINTMENT_STATUS_COPY.viewProduct}
        </Link>
      </Button>
    </div>
  );
}

export function notifyAppointmentStatusError(cause: unknown) {
  if (!isAppointmentStockError(cause)) {
    toast.error(getAppointmentStatusErrorMessage(cause));
    return;
  }

  toast.error(
    ({ closeToast }) => (
      <AppointmentStatusErrorToast
        issue={cause.stockIssue}
        onClose={() => closeToast()}
      />
    ),
    { autoClose: false, icon: false },
  );
}
