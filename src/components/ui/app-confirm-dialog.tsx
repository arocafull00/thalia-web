"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { ActionButton } from "@/components/ui/primitives/action-button";

type AppConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  pendingLabel: string;
  isPending: boolean;
  onConfirm: () => void;
  confirmTone?: "danger" | "primary";
};

export default function AppConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pendingLabel,
  isPending,
  onConfirm,
  confirmTone = "primary",
}: AppConfirmDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent>
        <AppDialogHeader>
          <AppDialogTitle>{title}</AppDialogTitle>
          <AppDialogDescription>{description}</AppDialogDescription>
        </AppDialogHeader>
        <AppDialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          {confirmTone === "danger" ? (
            <button
              type="button"
              disabled={isPending}
              onClick={onConfirm}
              className="rounded-full bg-danger px-4 py-2 text-xs font-medium uppercase tracking-wide text-on-primary hover:opacity-90 disabled:opacity-50"
            >
              {isPending ? pendingLabel : confirmLabel}
            </button>
          ) : (
            <ActionButton
              title={isPending ? pendingLabel : confirmLabel}
              disabled={isPending}
              onClick={onConfirm}
            />
          )}
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
