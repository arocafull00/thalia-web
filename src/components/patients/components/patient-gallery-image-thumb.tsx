"use client";

import { Check, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import PatientImageDeleteConfirmDialog from "@/components/patients/components/patient-image-delete-confirm-dialog";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { usePatientImageUrl } from "@/lib/hooks/use-patient-images";
import type { PatientImage } from "@/types/database.types";

type PatientGalleryImageThumbProps = {
  image: PatientImage;
  selectionMode: boolean;
  isSelected: boolean;
  onView: () => void;
  onDelete: () => void;
  onToggleSelect: () => void;
};

export default function PatientGalleryImageThumb({
  image,
  selectionMode,
  isSelected,
  onView,
  onDelete,
  onToggleSelect,
}: PatientGalleryImageThumbProps) {
  const imageUrl = usePatientImageUrl(image);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const thumbActions = selectionMode
    ? [
        {
          label: PATIENT_GALLERY_COPY.thumbActions.select,
          icon: Check,
          onClick: onToggleSelect,
        },
      ]
    : [
        {
          label: PATIENT_GALLERY_COPY.thumbActions.view,
          icon: Eye,
          onClick: onView,
        },
        {
          label: PATIENT_GALLERY_COPY.thumbActions.delete,
          icon: Trash2,
          onClick: () => setDeleteDialogOpen(true),
          variant: "danger" as const,
        },
      ];

  const handleClick = () => {
    if (selectionMode) {
      onToggleSelect();
      return;
    }

    onView();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`group relative aspect-square overflow-hidden rounded-xl bg-canvas ${
          isSelected ? "ring-2 ring-primary" : ""
        }`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 animate-pulse bg-border" />
        )}

        {selectionMode && isSelected ? (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
            <Check className="size-6 text-on-primary" aria-hidden="true" />
          </div>
        ) : null}

        {!selectionMode ? (
          <div className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100">
            <ProfileActionsMenu
              actions={thumbActions}
              ariaLabel={PATIENT_GALLERY_COPY.actions.more}
              className="bg-ink/50 text-on-primary hover:bg-ink/70"
            />
          </div>
        ) : null}
      </button>

      <PatientImageDeleteConfirmDialog
        patientId={image.patient_id}
        image={image}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={onDelete}
      />
    </>
  );
}
