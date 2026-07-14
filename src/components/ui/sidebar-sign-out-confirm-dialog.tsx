"use client";

import { useState } from "react";
import { toast } from "react-toastify";

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

  const handleConfirm = async () => {
    setIsPending(true);

    try {
      await signOut();
      onOpenChange(false);
    } catch {
      toast.error(SIDEBAR_COPY.signOutConfirm.error);
      setIsPending(false);
    }
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={SIDEBAR_COPY.signOutConfirm.title}
      description={SIDEBAR_COPY.signOutConfirm.description}
      confirmLabel={SIDEBAR_COPY.signOutConfirm.confirm}
      cancelLabel={SIDEBAR_COPY.signOutConfirm.cancel}
      pendingLabel={SIDEBAR_COPY.signOutConfirm.pending}
      isPending={isPending}
      onConfirm={() => void handleConfirm()}
    />
  );
}
