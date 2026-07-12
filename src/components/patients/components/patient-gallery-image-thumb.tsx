"use client";

import { Check, Eye, Trash2 } from "lucide-react";
import Image from "next/image";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { usePatientImageUrl } from "@/lib/hooks/use-patient-images";
import { usePatientImagesStore } from "@/stores/patient-images-store";
import type { PatientImage } from "@/types/database.types";

type PatientGalleryImageThumbProps = {
  image: PatientImage;
  selectionMode: boolean;
  isSelected: boolean;
  onView: () => void;
  onToggleSelect: () => void;
};

export default function PatientGalleryImageThumb({
  image,
  selectionMode,
  isSelected,
  onView,
  onToggleSelect,
}: PatientGalleryImageThumbProps) {
  const imageUrl = usePatientImageUrl(image);
  const openDeleteConfirm = usePatientImagesStore(
    (state) => state.openDeleteConfirm,
  );

  const handleClick = () => {
    if (selectionMode) {
      onToggleSelect();
      return;
    }

    onView();
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          onClick={handleClick}
          className={`group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isSelected ? "ring-2 ring-primary" : ""}`}
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
        </button>
      </ContextMenuTrigger>

      {!selectionMode ? (
        <ContextMenuContent>
          <ContextMenuItem onClick={onView}>
            <Eye />
            {PATIENT_GALLERY_COPY.thumbActions.view}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            variant="destructive"
            onClick={() => openDeleteConfirm(image)}
          >
            <Trash2 />
            {PATIENT_GALLERY_COPY.thumbActions.delete}
          </ContextMenuItem>
        </ContextMenuContent>
      ) : null}
    </ContextMenu>
  );
}
