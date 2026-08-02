"use client";

import PwaInstallContent from "@/components/pwa/components/pwa-install-content";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";

type PwaInstallDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function PwaInstallDialog({
  open,
  onOpenChange,
}: PwaInstallDialogProps) {
  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>{PWA_INSTALL_COPY.title}</AppDialogTitle>
        </AppDialogHeader>
        <PwaInstallContent onInstallSuccess={() => onOpenChange(false)} />
      </AppSheetContent>
    </AppDialog>
  );
}
