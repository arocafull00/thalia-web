"use client";

import { useState } from "react";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { SIDEBAR_COPY } from "@/copy/sidebar-copy";
import { useAuth } from "@/lib/hooks/use-auth";

type SidebarSignOutConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SidebarSignOutConfirmDialog({
  open,
  onOpenChange,
}: SidebarSignOutConfirmDialogProps) {
  const { signOut } = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    setIsPending(true);
    setErrorMessage(null);

    try {
      await signOut();
      handleOpenChange(false);
    } catch {
      setErrorMessage(SIDEBAR_COPY.signOutConfirm.error);
      setIsPending(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrorMessage(null);
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={SIDEBAR_COPY.signOutConfirm.title}
      description={SIDEBAR_COPY.signOutConfirm.description}
      confirmLabel={SIDEBAR_COPY.signOutConfirm.confirm}
      cancelLabel={SIDEBAR_COPY.signOutConfirm.cancel}
      pendingLabel={SIDEBAR_COPY.signOutConfirm.pending}
      isPending={isPending}
      onConfirm={() => void handleConfirm()}
      errorMessage={errorMessage ?? undefined}
    />
  );
}
