"use client";

import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import PatientImageDeleteConfirmDialog from "@/components/patients/components/patient-image-delete-confirm-dialog";
import PatientImageViewerImage from "@/components/patients/components/patient-image-viewer-image";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { formatInputDate } from "@/lib/format";
import type { PatientImage } from "@/types/database.types";

type PatientImageViewerProps = {
  patientId: string;
  images: PatientImage[];
  activeIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActiveIndexChange: (index: number) => void;
};

function getPhaseLabel(phase: PatientImage["phase"]) {
  if (!phase) {
    return PATIENT_GALLERY_COPY.viewer.emptyMetadata;
  }

  return PATIENT_GALLERY_COPY.phases[phase];
}

export default function PatientImageViewer({
  patientId,
  images,
  activeIndex,
  open,
  onOpenChange,
  onActiveIndexChange,
}: PatientImageViewerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const activeImage = images[activeIndex];

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && activeIndex > 0) {
        onActiveIndexChange(activeIndex - 1);
      }

      if (event.key === "ArrowRight" && activeIndex < images.length - 1) {
        onActiveIndexChange(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex, images.length, onActiveIndexChange, open]);

  if (!activeImage) {
    return null;
  }

  const capturedAt = activeImage.captured_at ?? activeImage.created_at;

  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange}>
        <AppDialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 rounded-none border-0 p-0 sm:rounded-none">
          <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-medium text-ink">
                {activeImage.category ??
                  PATIENT_GALLERY_COPY.viewer.emptyMetadata}
              </p>
              <p className="text-xs text-ink-secondary">
                {capturedAt
                  ? formatInputDate(capturedAt)
                  : PATIENT_GALLERY_COPY.viewer.emptyMetadata}
                {" · "}
                {getPhaseLabel(activeImage.phase)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas"
                aria-label={PATIENT_GALLERY_COPY.viewer.delete}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas"
                aria-label={PATIENT_GALLERY_COPY.viewer.close}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1">
            <PatientImageViewerImage
              image={activeImage}
              label={
                activeImage.original_filename ?? PATIENT_GALLERY_COPY.title
              }
            />

            {activeIndex > 0 ? (
              <button
                type="button"
                onClick={() => onActiveIndexChange(activeIndex - 1)}
                className="absolute top-1/2 left-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-on-primary hover:bg-ink/70"
                aria-label={PATIENT_GALLERY_COPY.viewer.previous}
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
            ) : null}

            {activeIndex < images.length - 1 ? (
              <button
                type="button"
                onClick={() => onActiveIndexChange(activeIndex + 1)}
                className="absolute top-1/2 right-3 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/50 text-on-primary hover:bg-ink/70"
                aria-label={PATIENT_GALLERY_COPY.viewer.next}
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            ) : null}
          </div>

          {activeImage.notes ? (
            <div className="border-t border-border px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {PATIENT_GALLERY_COPY.viewer.metadata.notes}
              </p>
              <p className="mt-1 text-sm text-ink-secondary">
                {activeImage.notes}
              </p>
            </div>
          ) : null}
        </AppDialogContent>
      </AppDialog>

      <PatientImageDeleteConfirmDialog
        patientId={patientId}
        image={activeImage}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          if (images.length <= 1) {
            onOpenChange(false);
            return;
          }

          if (activeIndex >= images.length - 1) {
            onActiveIndexChange(activeIndex - 1);
          }
        }}
      />
    </>
  );
}
