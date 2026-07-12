"use client";

import { Columns2, Download, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import BeforeAfterComparison from "@/components/patients/components/before-after-comparison";
import PatientGalleryDateGroup from "@/components/patients/components/patient-gallery-date-group";
import PatientGalleryFilters from "@/components/patients/components/patient-gallery-filters";
import PatientGalleryFiltersSheet from "@/components/patients/components/patient-gallery-filters-sheet";
import PatientImageViewer from "@/components/patients/components/patient-image-viewer";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { Separator } from "@/components/ui/separator";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import {
  usePatientImageViewerSlides,
  usePatientImages,
} from "@/lib/hooks/use-patient-images";
import { groupImagesByDate } from "@/lib/patient-gallery-grouping";
import type { Patient, PatientImage } from "@/types/database.types";

type PatientGalleryTabProps = {
  patient: Patient;
  onOpenUploader: () => void;
};

function filterImages(
  images: PatientImage[],
  search: string,
  category: string,
  phase: string,
  sortOrder: string,
) {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = images.filter((image) => {
    if (category && image.category !== category) {
      return false;
    }

    if (phase && image.phase !== phase) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const filename = image.original_filename?.toLowerCase() ?? "";
    const notes = image.notes?.toLowerCase() ?? "";

    return (
      filename.includes(normalizedSearch) || notes.includes(normalizedSearch)
    );
  });

  return filtered.toSorted((left, right) => {
    const leftDate = new Date(
      left.captured_at ?? left.created_at ?? 0,
    ).getTime();
    const rightDate = new Date(
      right.captured_at ?? right.created_at ?? 0,
    ).getTime();

    return sortOrder === "recent" ? rightDate - leftDate : leftDate - rightDate;
  });
}

export default function PatientGalleryTab({
  patient,
  onOpenUploader,
}: PatientGalleryTabProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [phase, setPhase] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const imagesQuery = usePatientImages(patient.id);

  const images = useMemo(() => imagesQuery.data ?? [], [imagesQuery.data]);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        images
          .map((image) => image.category)
          .filter((value): value is string => Boolean(value)),
      ),
    ];

    return uniqueCategories.map((entry) => ({ label: entry, value: entry }));
  }, [images]);

  const phaseOptions = [
    { label: PATIENT_GALLERY_COPY.phases.antes, value: "antes" },
    { label: PATIENT_GALLERY_COPY.phases.durante, value: "durante" },
    { label: PATIENT_GALLERY_COPY.phases.despues, value: "despues" },
  ];

  const filteredImages = useMemo(
    () => filterImages(images, search, category, phase, sortOrder),
    [images, search, category, phase, sortOrder],
  );

  const viewerSlides = usePatientImageViewerSlides(filteredImages);

  const visibleGroups = useMemo(
    () =>
      groupImagesByDate(
        filteredImages,
        sortOrder === "oldest" ? "oldest" : "recent",
      ),
    [filteredImages, sortOrder],
  );

  const totalPhotos = filteredImages.length;

  const selectedImages = useMemo(
    () =>
      images.filter((image) => selectedImageIds.includes(image.id)).slice(0, 2),
    [images, selectedImageIds],
  );

  const moreActions = [
    {
      label: PATIENT_GALLERY_COPY.actions.export,
      icon: Download,
      onClick: () => {},
    },
  ];

  const handleToggleSelect = (image: PatientImage) => {
    setSelectedImageIds((current) => {
      if (current.includes(image.id)) {
        return current.filter((id) => id !== image.id);
      }

      if (current.length >= 2) {
        return [current[1]!, image.id];
      }

      return [...current, image.id];
    });
  };

  const handleOpenViewer = (image: PatientImage) => {
    const index = filteredImages.findIndex((entry) => entry.id === image.id);

    if (index === -1) {
      return;
    }

    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleCloseSelectionMode = () => {
    setSelectionMode(false);
    setSelectedImageIds([]);
  };

  const handleOpenFiltersSheet = () => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  };

  const handleApplyFilters = (updates: {
    category: string;
    phase: string;
    sort: string;
  }) => {
    setCategory(updates.category);
    setPhase(updates.phase);
    setSortOrder(updates.sort);
  };

  const handleClearFilters = () => {
    setCategory("");
    setPhase("");
    setSortOrder("recent");
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {PATIENT_GALLERY_COPY.title}
            </h2>
            <p className="text-sm text-ink-secondary">
              {PATIENT_GALLERY_COPY.photosCount(totalPhotos)}
            </p>
          </div>
          <ProfileActionsMenu
            actions={moreActions}
            ariaLabel={PATIENT_GALLERY_COPY.actions.more}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <PatientGalleryFilters
              search={search}
              category={category}
              categoryOptions={categoryOptions}
              phase={phase}
              phaseOptions={phaseOptions}
              sort={sortOrder}
              onSearchChange={setSearch}
              onCategoryChange={setCategory}
              onPhaseChange={setPhase}
              onSortChange={setSortOrder}
              onOpenSheet={handleOpenFiltersSheet}
            />
          </div>
          <div className="flex items-center gap-2">
            <ActionButton
              title={PATIENT_GALLERY_COPY.actions.upload}
              icon={Upload}
              onClick={onOpenUploader}
            />
            {selectionMode ? (
              <>
                <ActionButton
                  title={PATIENT_GALLERY_COPY.actions.compare}
                  icon={Columns2}
                  disabled={selectedImageIds.length !== 2}
                  onClick={() => setComparisonOpen(true)}
                />
                <ActionButton
                  title={PATIENT_GALLERY_COPY.actions.cancelSelection}
                  variant="ghost"
                  onClick={handleCloseSelectionMode}
                />
              </>
            ) : (
              <ActionButton
                title={PATIENT_GALLERY_COPY.actions.beforeAfter}
                icon={Columns2}
                variant="ghost"
                onClick={() => setSelectionMode(true)}
              />
            )}
          </div>
        </div>

        {selectionMode ? (
          <p className="text-sm text-ink-secondary">
            {PATIENT_GALLERY_COPY.selection.title} ·{" "}
            {PATIENT_GALLERY_COPY.selection.hint(selectedImageIds.length)}
          </p>
        ) : null}

        <Separator />

        <div className="space-y-8">
          {imagesQuery.error ? (
            <Notice tone="danger" message={PATIENT_GALLERY_COPY.errors.load} />
          ) : null}

          {!imagesQuery.isLoading &&
          !imagesQuery.error &&
          visibleGroups.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-secondary">
              {images.length === 0
                ? PATIENT_GALLERY_COPY.emptyGallery
                : PATIENT_GALLERY_COPY.empty}
            </p>
          ) : null}

          {!imagesQuery.isLoading && !imagesQuery.error
            ? visibleGroups.map((group) => (
                <PatientGalleryDateGroup
                  key={group.dateGroupLabel}
                  label={group.dateGroupLabel}
                  images={group.images}
                  selectionMode={selectionMode}
                  selectedImageIds={selectedImageIds}
                  onViewImage={handleOpenViewer}
                  onToggleSelect={handleToggleSelect}
                />
              ))
            : null}
        </div>
      </div>

      <PatientImageViewer
        slides={viewerSlides}
        activeIndex={viewerIndex}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onActiveIndexChange={setViewerIndex}
      />

      {selectedImages.length === 2 ? (
        <BeforeAfterComparison
          beforeImage={selectedImages[0]!}
          afterImage={selectedImages[1]!}
          open={comparisonOpen}
          onOpenChange={setComparisonOpen}
        />
      ) : null}

      <PatientGalleryFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={{ category, phase, sort: sortOrder }}
        categoryOptions={categoryOptions}
        phaseOptions={phaseOptions}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onDismiss={() => setSheetOpen(false)}
      />
    </>
  );
}
