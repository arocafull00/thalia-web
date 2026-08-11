"use client";

import { Columns2, Upload } from "lucide-react";

import type { PatientGalleryFilterValues } from "@/components/patients/components/gallery/hooks/use-patient-gallery";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientGalleryDensity } from "@/lib/patient-gallery-density";

import PatientGalleryDensityToggle from "./patient-gallery-density-toggle";
import PatientGalleryFilters from "./patient-gallery-filters";

type PatientGalleryToolbarProps = {
  filters: PatientGalleryFilterValues;
  search: string;
  loaded: number;
  total: number;
  density: PatientGalleryDensity;
  selectionMode: boolean;
  selectedCount: number;
  phaseOptions: Array<{ label: string; value: string }>;
  treatmentOptions: Array<{ label: string; value: string }>;
  onSearchChange: (value: string) => void;
  onFiltersChange: (updates: Partial<PatientGalleryFilterValues>) => void;
  onOpenFiltersSheet: () => void;
  onDensityChange: (density: PatientGalleryDensity) => void;
  onOpenUploader: () => void;
  onStartSelection: () => void;
  onCancelSelection: () => void;
  onCompare: () => void;
};

export default function PatientGalleryToolbar({
  filters,
  search,
  loaded,
  total,
  density,
  selectionMode,
  selectedCount,
  phaseOptions,
  treatmentOptions,
  onSearchChange,
  onFiltersChange,
  onOpenFiltersSheet,
  onDensityChange,
  onOpenUploader,
  onStartSelection,
  onCancelSelection,
  onCompare,
}: PatientGalleryToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">
            {PATIENT_GALLERY_COPY.title}
          </h2>
          <p className="text-sm text-ink-secondary">
            {PATIENT_GALLERY_COPY.photosProgress(loaded, total)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 w-full overflow-x-auto sm:flex-1">
          <PatientGalleryFilters
            search={search}
            phase={filters.phase}
            phaseOptions={phaseOptions}
            treatmentId={filters.treatmentId}
            treatmentOptions={treatmentOptions}
            from={filters.from}
            to={filters.to}
            sort={filters.sort}
            onSearchChange={onSearchChange}
            onPhaseChange={(phase) => onFiltersChange({ phase })}
            onTreatmentChange={(treatmentId) =>
              onFiltersChange({ treatmentId })
            }
            onFromChange={(from) => onFiltersChange({ from })}
            onToChange={(to) => onFiltersChange({ to })}
            onClearDates={() => onFiltersChange({ from: "", to: "" })}
            onSortChange={(sort) =>
              onFiltersChange({
                sort: sort === "oldest" ? "oldest" : "recent",
              })
            }
            onOpenSheet={onOpenFiltersSheet}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PatientGalleryDensityToggle
            density={density}
            onChange={onDensityChange}
          />
          <ActionButton
            title={PATIENT_GALLERY_COPY.actions.upload}
            icon={Upload}
            testId="patient-gallery-upload-trigger"
            onClick={onOpenUploader}
          />
          {selectionMode ? (
            <>
              <ActionButton
                title={PATIENT_GALLERY_COPY.actions.compare}
                icon={Columns2}
                disabled={selectedCount !== 2}
                testId="patient-gallery-compare-trigger"
                onClick={onCompare}
              />
              <ActionButton
                title={PATIENT_GALLERY_COPY.actions.cancelSelection}
                variant="ghost"
                onClick={onCancelSelection}
              />
            </>
          ) : (
            <ActionButton
              title={PATIENT_GALLERY_COPY.actions.beforeAfter}
              icon={Columns2}
              variant="ghost"
              testId="patient-gallery-before-after-trigger"
              onClick={onStartSelection}
            />
          )}
        </div>
      </div>

      {selectionMode ? (
        <p className="text-sm text-ink-secondary">
          {PATIENT_GALLERY_COPY.selection.title} ·{" "}
          {PATIENT_GALLERY_COPY.selection.hint(selectedCount)}
        </p>
      ) : null}
    </div>
  );
}
