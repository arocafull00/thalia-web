"use client";

import BeforeAfterComparisonContent from "@/components/patients/components/before-after-comparison-content";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import type { PatientImage } from "@/types/database.types";

type BeforeAfterComparisonProps = {
  beforeImage: PatientImage;
  afterImage: PatientImage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function BeforeAfterComparison({
  beforeImage,
  afterImage,
  open,
  onOpenChange,
}: BeforeAfterComparisonProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppDialogContent
        className="inset-0 flex h-dvh max-h-dvh w-full max-w-none translate-none flex-col gap-0 rounded-none border-0 p-0 sm:rounded-none"
        showClose={false}
      >
        {open ? (
          <BeforeAfterComparisonContent
            key={`${beforeImage.id}-${afterImage.id}`}
            beforeImage={beforeImage}
            afterImage={afterImage}
            onClose={handleClose}
          />
        ) : null}
      </AppDialogContent>
    </AppDialog>
  );
}
