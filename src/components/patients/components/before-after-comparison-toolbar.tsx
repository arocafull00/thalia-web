"use client";

import { ArrowLeftRight, Columns2, Rows2, X } from "lucide-react";

import type { BeforeAfterOrientation } from "@/components/patients/components/before-after-comparison-slider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

type BeforeAfterComparisonToolbarProps = {
  orientation: BeforeAfterOrientation;
  onOrientationChange: (orientation: BeforeAfterOrientation) => void;
  onSwap: () => void;
  onClose: () => void;
};

export default function BeforeAfterComparisonToolbar({
  orientation,
  onOrientationChange,
  onSwap,
  onClose,
}: BeforeAfterComparisonToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <p className="min-w-0 truncate text-sm font-medium text-ink">
        {PATIENT_GALLERY_COPY.beforeAfter.title}
      </p>

      <div className="flex shrink-0 items-center gap-2">
        <ToggleGroup
          type="single"
          value={orientation}
          onValueChange={(value) => {
            if (!value) {
              return;
            }

            onOrientationChange(value as BeforeAfterOrientation);
          }}
          aria-label={PATIENT_GALLERY_COPY.beforeAfter.orientationLabel}
        >
          <ToggleGroupItem
            value="horizontal"
            aria-label={PATIENT_GALLERY_COPY.beforeAfter.orientationHorizontal}
          >
            <Columns2 className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
          <ToggleGroupItem
            value="vertical"
            aria-label={PATIENT_GALLERY_COPY.beforeAfter.orientationVertical}
          >
            <Rows2 className="size-4" aria-hidden="true" />
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onSwap}
          className="rounded-full"
          aria-label={PATIENT_GALLERY_COPY.beforeAfter.swap}
        >
          <ArrowLeftRight className="size-4" aria-hidden="true" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onClose}
          className="rounded-full"
          aria-label={PATIENT_GALLERY_COPY.beforeAfter.close}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
