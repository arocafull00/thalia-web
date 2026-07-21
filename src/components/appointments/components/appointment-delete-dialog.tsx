"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { Button } from "@/components/ui/button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";

type AppointmentDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canRestoreStock: boolean;
  restoreStock: boolean;
  onRestoreStockChange: (restoreStock: boolean) => void;
  isPending: boolean;
  errorMessage?: string;
  onConfirm: () => void;
};

export default function AppointmentDeleteDialog({
  open,
  onOpenChange,
  canRestoreStock,
  restoreStock,
  onRestoreStockChange,
  isPending,
  errorMessage,
  onConfirm,
}: AppointmentDeleteDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent>
        <AppDialogHeader>
          <AppDialogTitle>{APPOINTMENT_DETAIL_COPY.deleteTitle}</AppDialogTitle>
          <AppDialogDescription>
            {APPOINTMENT_DETAIL_COPY.deleteDescription}
          </AppDialogDescription>
        </AppDialogHeader>

        {canRestoreStock ? (
          <label className="flex cursor-pointer items-start gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={restoreStock}
              onChange={(event) => onRestoreStockChange(event.target.checked)}
              disabled={isPending}
              className="mt-0.5 size-4 rounded border-border bg-surface accent-primary focus-visible:ring-2 focus-visible:ring-primary"
            />
            <span>{APPOINTMENT_DETAIL_COPY.deleteRestoreStock}</span>
          </label>
        ) : null}

        <AppDialogFooter errorMessage={errorMessage}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {APPOINTMENT_DETAIL_COPY.cancelDialogCancel}
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending
              ? APPOINTMENT_DETAIL_COPY.deletePending
              : APPOINTMENT_DETAIL_COPY.deleteConfirm}
          </Button>
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
