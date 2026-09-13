"use client";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { EXTERNAL_APPOINTMENT_COPY } from "@/copy/external-appointment-copy";

type ExternalAppointmentResponseDialogsProps = {
  rejectionOpen: boolean;
  overlapOpen: boolean;
  overlapDescription: string;
  isPending: boolean;
  errorMessage: string | null;
  onRejectionOpenChange: (open: boolean) => void;
  onOverlapOpenChange: (open: boolean) => void;
  onConfirmRejection: () => void;
  onConfirmOverlap: () => void;
};

export default function ExternalAppointmentResponseDialogs({
  rejectionOpen,
  overlapOpen,
  overlapDescription,
  isPending,
  errorMessage,
  onRejectionOpenChange,
  onOverlapOpenChange,
  onConfirmRejection,
  onConfirmOverlap,
}: ExternalAppointmentResponseDialogsProps) {
  return (
    <>
      <AppConfirmDialog
        open={rejectionOpen}
        onOpenChange={onRejectionOpenChange}
        title={EXTERNAL_APPOINTMENT_COPY.rejection.title}
        description={EXTERNAL_APPOINTMENT_COPY.rejection.description}
        confirmLabel={EXTERNAL_APPOINTMENT_COPY.rejection.confirm}
        cancelLabel={EXTERNAL_APPOINTMENT_COPY.rejection.cancel}
        pendingLabel={EXTERNAL_APPOINTMENT_COPY.rejection.pending}
        isPending={isPending}
        onConfirm={onConfirmRejection}
        confirmTone="danger"
        errorMessage={errorMessage ?? undefined}
      />
      <AppConfirmDialog
        open={overlapOpen}
        onOpenChange={onOverlapOpenChange}
        title={EXTERNAL_APPOINTMENT_COPY.overlap.title}
        description={overlapDescription}
        confirmLabel={EXTERNAL_APPOINTMENT_COPY.overlap.confirm}
        cancelLabel={EXTERNAL_APPOINTMENT_COPY.overlap.cancel}
        pendingLabel={EXTERNAL_APPOINTMENT_COPY.overlap.pending}
        isPending={isPending}
        onConfirm={onConfirmOverlap}
        errorMessage={errorMessage ?? undefined}
      />
    </>
  );
}
