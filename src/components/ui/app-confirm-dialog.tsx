"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { Button } from "@/components/ui/button";
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
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            {cancelLabel}
          </Button>
          {confirmTone === "danger" ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={onConfirm}
            >
              {isPending ? pendingLabel : confirmLabel}
            </Button>
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
