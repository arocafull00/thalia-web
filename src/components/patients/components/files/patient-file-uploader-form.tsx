"use client";

import { CloudUpload, Plus } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import {
  Dropzone,
  DropZoneArea,
  DropzoneDescription,
  DropzoneFileList,
  DropzoneMessage,
  DropzoneTrigger,
  useDropzone,
} from "@/components/ui/dropzone";
import {
  PATIENT_FILE_CATEGORY_OPTIONS,
  PATIENT_FILES_COPY,
} from "@/copy/patient-files-copy";
import type { PatientFileFormValues } from "@/lib/hooks/use-patient-file-uploader";
import { MAX_FILE_SIZE_BYTES } from "@/lib/patient-file-storage";

import PatientFileUploaderDropzoneFileItem from "./patient-file-uploader-dropzone-file-item";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type PatientFileUploaderFormProps = {
  register: UseFormRegister<PatientFileFormValues>;
  control: Control<PatientFileFormValues>;
  errors: FieldErrors<PatientFileFormValues>;
  onFilesChanged: (files: File[]) => void;
};

export default function PatientFileUploaderForm({
  register,
  control,
  errors,
  onFilesChanged,
}: PatientFileUploaderFormProps) {
  const dropzone = useDropzone({
    onDropFile: async (file: File) => ({
      status: "success",
      result: file.name,
    }),
    validation: {
      accept: {
        "application/pdf": [".pdf"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
      maxSize: MAX_FILE_SIZE_BYTES,
    },
  });

  useEffect(() => {
    const files = dropzone.fileStatuses
      .filter((file) => file.status === "success")
      .map((file) => file.file);
    onFilesChanged(files);
  }, [dropzone.fileStatuses, onFilesChanged]);

  const hasFiles = dropzone.fileStatuses.length > 0;

  return (
    <div className="space-y-4">
      <Dropzone {...dropzone}>
        <div className="flex justify-between gap-4">
          <DropzoneDescription className="text-ink-secondary">
            {PATIENT_FILES_COPY.uploader.dropzone}
          </DropzoneDescription>
          <DropzoneMessage className="text-danger" />
        </div>

        {!hasFiles ? (
          <DropZoneArea className="rounded-2xl border border-dashed border-border bg-canvas px-4 py-2">
            <DropzoneTrigger className="flex w-full flex-col items-center gap-3 rounded-2xl bg-transparent p-6 text-center text-sm shadow-none hover:bg-transparent">
              <CloudUpload
                className="size-8 text-ink-muted"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-ink">
                  {PATIENT_FILES_COPY.uploader.chooseFile}
                </p>
                <p className="text-sm text-ink-secondary">
                  {dropzone.isDragActive
                    ? PATIENT_FILES_COPY.uploader.dropzoneActive
                    : PATIENT_FILES_COPY.uploader.dropzone}
                </p>
              </div>
            </DropzoneTrigger>
          </DropZoneArea>
        ) : null}

        {hasFiles ? (
          <DropzoneFileList className="space-y-2 p-0">
            {dropzone.fileStatuses.map((file) => (
              <PatientFileUploaderDropzoneFileItem key={file.id} file={file} />
            ))}
            <DropZoneArea className="rounded-xl border border-dashed border-border bg-canvas p-0">
              <DropzoneTrigger className="flex w-full items-center justify-center gap-2 rounded-xl bg-transparent px-4 py-3 text-center text-xs shadow-none hover:bg-transparent">
                <Plus className="size-4 text-ink-muted" aria-hidden="true" />
                <span className="font-medium text-ink-secondary">
                  {PATIENT_FILES_COPY.uploader.addMore}
                </span>
              </DropzoneTrigger>
            </DropZoneArea>
          </DropzoneFileList>
        ) : null}
      </Dropzone>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_FILES_COPY.uploader.fields.category}
        </span>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <AppSearchableCombobox
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              options={PATIENT_FILE_CATEGORY_OPTIONS}
              placeholder={PATIENT_FILES_COPY.uploader.categoryPlaceholder}
              searchPlaceholder={PATIENT_FILES_COPY.uploader.fields.category}
              showSearch={false}
            />
          )}
        />
        {errors.category ? (
          <span className="text-sm text-danger">{errors.category.message}</span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_FILES_COPY.uploader.fields.notes}
        </span>
        <textarea
          {...register("notes")}
          rows={3}
          className={`${inputClassName} resize-none`}
        />
        {errors.notes ? (
          <span className="text-sm text-danger">{errors.notes.message}</span>
        ) : null}
      </label>
    </div>
  );
}
