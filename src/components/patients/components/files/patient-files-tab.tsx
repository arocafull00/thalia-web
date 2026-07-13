"use client";

import { Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { Separator } from "@/components/ui/separator";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import { getFileUrl } from "@/dal/patient-files.dal";
import { usePatientFiles } from "@/lib/hooks/use-patient-files";
import { usePatientFilesStore } from "@/stores/patient-files-store";
import type {
  Patient,
  PatientFile,
  PatientFileCategory,
} from "@/types/database.types";

import PatientFileCategoryFilter from "./patient-file-category-filter";
import PatientFileEditDialog from "./patient-file-edit-dialog";
import PatientFileRow from "./patient-file-row";
import PatientFileViewer from "./patient-file-viewer";

type PatientFilesTabProps = {
  patient: Patient;
  onOpenUploader: () => void;
};

function filterFilesByCategory(
  files: PatientFile[],
  category: PatientFileCategory | "",
) {
  if (!category) {
    return files;
  }

  return files.filter((file) => file.category === category);
}

export default function PatientFilesTab({
  patient,
  onOpenUploader,
}: PatientFilesTabProps) {
  const [category, setCategory] = useState<PatientFileCategory | "">("");
  const [viewerFile, setViewerFile] = useState<PatientFile | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [editFile, setEditFile] = useState<PatientFile | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const filesQuery = usePatientFiles(patient.id);
  const openDeleteConfirm = usePatientFilesStore(
    (state) => state.openDeleteConfirm,
  );

  const files = useMemo(() => filesQuery.data ?? [], [filesQuery.data]);

  const filteredFiles = useMemo(
    () => filterFilesByCategory(files, category),
    [files, category],
  );

  const handleDownload = async (file: PatientFile) => {
    try {
      const url = await getFileUrl(file);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = file.original_filename;
      anchor.rel = "noopener";
      anchor.target = "_blank";
      anchor.click();
    } catch {
      toast.error(PATIENT_FILES_COPY.errors.signedUrl);
    }
  };

  const handleView = (file: PatientFile) => {
    setViewerFile(file);
    setViewerOpen(true);
  };

  const handleEdit = (file: PatientFile) => {
    setEditFile(file);
    setEditOpen(true);
  };

  const handleDelete = (file: PatientFile) => {
    openDeleteConfirm(file);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {PATIENT_FILES_COPY.title}
            </h2>
            <p className="text-sm text-ink-secondary">
              {PATIENT_FILES_COPY.filesCount(filteredFiles.length)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 w-full sm:max-w-xs">
            <PatientFileCategoryFilter
              value={category}
              onChange={setCategory}
            />
          </div>
          <ActionButton
            title={PATIENT_FILES_COPY.actions.upload}
            icon={Upload}
            onClick={onOpenUploader}
          />
        </div>

        <Separator />

        <div>
          {filesQuery.error ? (
            <Notice tone="danger" message={PATIENT_FILES_COPY.errors.load} />
          ) : null}

          {!filesQuery.isLoading &&
          !filesQuery.error &&
          filteredFiles.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-secondary">
              {files.length === 0
                ? PATIENT_FILES_COPY.emptyFiles
                : PATIENT_FILES_COPY.empty}
            </p>
          ) : null}

          {!filesQuery.isLoading && !filesQuery.error
            ? filteredFiles.map((file) => (
                <PatientFileRow
                  key={file.id}
                  file={file}
                  onView={handleView}
                  onDownload={handleDownload}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            : null}
        </div>
      </div>

      <PatientFileViewer
        file={viewerFile}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        onDownload={handleDownload}
      />

      <PatientFileEditDialog
        patientId={patient.id}
        file={editFile}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
