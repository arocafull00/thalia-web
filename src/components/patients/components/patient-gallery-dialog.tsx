"use client";

import { Columns2, Download, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import BeforeAfterComparison from "@/components/patients/components/before-after-comparison";
import PatientGalleryDateGroup from "@/components/patients/components/patient-gallery-date-group";
import PatientImageUploader from "@/components/patients/components/patient-image-uploader";
import PatientImageViewer from "@/components/patients/components/patient-image-viewer";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import FilterPills from "@/components/ui/filter-pills";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { Separator } from "@/components/ui/separator";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import { usePatientImages } from "@/lib/hooks/use-patient-images";
import { groupImagesByDate } from "@/lib/patient-gallery-grouping";
import type { Patient, PatientImage } from "@/types/database.types";

type PatientGalleryDialogProps = {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const SHEET_CLASS_NAME =
  "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-2xl flex-col border-l border-border bg-surface p-6 shadow-lg outline-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out";

function filterImages(
  images: PatientImage[],
  category: string,
  phase: string,
  sortOrder: string,
) {
  const filtered = images.filter((image) => {
    if (category && image.category !== category) {
      return false;
    }

    return !phase || image.phase === phase;
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

export default function PatientGalleryDialog({
  patient,
  open,
  onOpenChange,
}: PatientGalleryDialogProps) {
  const [category, setCategory] = useState("");
  const [phase, setPhase] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");
  const [uploaderOpen, setUploaderOpen] = useState(false);
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

    return [
      { label: PATIENT_GALLERY_COPY.filters.allCategories, value: "" },
      ...uniqueCategories.map((entry) => ({ label: entry, value: entry })),
    ];
  }, [images]);

  const phaseOptions = [
    { label: PATIENT_GALLERY_COPY.filters.allPhases, value: "" },
    { label: PATIENT_GALLERY_COPY.phases.antes, value: "antes" },
    { label: PATIENT_GALLERY_COPY.phases.durante, value: "durante" },
    { label: PATIENT_GALLERY_COPY.phases.despues, value: "despues" },
  ];

  const sortOptions = [
    { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
    { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
  ];

  const filteredImages = useMemo(
    () => filterImages(images, category, phase, sortOrder),
    [images, category, phase, sortOrder],
  );

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

  return (
    <>
      <AppDialog open={open} onOpenChange={onOpenChange}>
        <AppSheetContent className={SHEET_CLASS_NAME}>
          <AppDialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <AppDialogTitle>{PATIENT_GALLERY_COPY.title}</AppDialogTitle>
                <AppDialogDescription>
                  {patient.full_name} ·{" "}
                  {PATIENT_GALLERY_COPY.photosCount(totalPhotos)}
                </AppDialogDescription>
              </div>
              <ProfileActionsMenu
                actions={moreActions}
                ariaLabel={PATIENT_GALLERY_COPY.actions.more}
              />
            </div>
          </AppDialogHeader>

          <div className="flex shrink-0 flex-wrap gap-2 pt-4">
            <ActionButton
              title={PATIENT_GALLERY_COPY.actions.upload}
              icon={Upload}
              onClick={() => setUploaderOpen(true)}
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

          {selectionMode ? (
            <p className="pt-3 text-sm text-ink-secondary">
              {PATIENT_GALLERY_COPY.selection.title} ·{" "}
              {PATIENT_GALLERY_COPY.selection.hint(selectedImageIds.length)}
            </p>
          ) : null}

          <Separator className="my-4 shrink-0" />

          <div className="flex shrink-0 flex-col gap-2">
            <FilterPills
              options={categoryOptions}
              active={category}
              onChange={setCategory}
              ariaLabel={PATIENT_GALLERY_COPY.filters.allCategories}
            />
            <FilterPills
              options={phaseOptions}
              active={phase}
              onChange={setPhase}
              ariaLabel={PATIENT_GALLERY_COPY.filters.allPhases}
            />
            <FilterPills
              options={sortOptions}
              active={sortOrder}
              onChange={setSortOrder}
              ariaLabel={PATIENT_GALLERY_COPY.filters.sortRecent}
            />
          </div>

          <Separator className="my-4 shrink-0" />

          <div className="min-h-0 flex-1 space-y-8 overflow-y-auto">
            {imagesQuery.isLoading ? <SkeletonList /> : null}

            {imagesQuery.error ? (
              <Notice
                tone="danger"
                message={PATIENT_GALLERY_COPY.errors.load}
              />
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
                    onDeleteSuccess={() => {}}
                  />
                ))
              : null}
          </div>
        </AppSheetContent>
      </AppDialog>

      <PatientImageUploader
        patientId={patient.id}
        open={uploaderOpen}
        onOpenChange={setUploaderOpen}
      />

      <PatientImageViewer
        patientId={patient.id}
        images={filteredImages}
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
    </>
  );
}
