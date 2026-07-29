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
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientImageFormValues } from "@/lib/hooks/use-patient-image-uploader";
import { useTreatments } from "@/lib/hooks/use-treatment";

import NewPatientDateField from "../shared/new-patient-date-field";

import PatientImageTreatmentSelect from "./patient-image-treatment-select";
import PatientImageUploaderDropzoneFileItem from "./patient-image-uploader-dropzone-file-item";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const phaseOptions = [
  { label: PATIENT_GALLERY_COPY.phases.antes, value: "antes" },
  { label: PATIENT_GALLERY_COPY.phases.durante, value: "durante" },
  { label: PATIENT_GALLERY_COPY.phases.despues, value: "despues" },
];

type PatientImageUploaderFormProps = {
  register: UseFormRegister<PatientImageFormValues>;
  control: Control<PatientImageFormValues>;
  errors: FieldErrors<PatientImageFormValues>;
  onFilesChanged: (files: File[]) => void;
};

export default function PatientImageUploaderForm({
  register,
  control,
  errors,
  onFilesChanged,
}: PatientImageUploaderFormProps) {
  const { data: treatments = [] } = useTreatments();

  const dropzone = useDropzone({
    onDropFile: async (file: File) => ({
      status: "success",
      result: URL.createObjectURL(file),
    }),
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
    },
  });

  useEffect(() => {
    const files = dropzone.fileStatuses
      .filter((file) => file.status === "success")
      .map((file) => file.file);
    onFilesChanged(files);
  }, [dropzone.fileStatuses, onFilesChanged]);

  useEffect(() => {
    const fileStatuses = dropzone.fileStatuses;

    return () => {
      for (const file of fileStatuses) {
        if (file.status === "success" && typeof file.result === "string") {
          URL.revokeObjectURL(file.result);
        }
      }
    };
  }, [dropzone.fileStatuses]);

  const hasFiles = dropzone.fileStatuses.length > 0;

  return (
    <div className="space-y-4">
      <Dropzone {...dropzone}>
        <div className="flex justify-between gap-4">
          <DropzoneDescription className="text-ink-secondary">
            {PATIENT_GALLERY_COPY.uploader.dropzone}
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
                  {PATIENT_GALLERY_COPY.uploader.chooseFile}
                </p>
                <p className="text-sm text-ink-secondary">
                  {dropzone.isDragActive
                    ? PATIENT_GALLERY_COPY.uploader.dropzoneActive
                    : PATIENT_GALLERY_COPY.uploader.dropzone}
                </p>
              </div>
            </DropzoneTrigger>
          </DropZoneArea>
        ) : null}

        {hasFiles ? (
          <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
            {dropzone.fileStatuses.map((file) => (
              <PatientImageUploaderDropzoneFileItem key={file.id} file={file} />
            ))}
            <DropZoneArea className="rounded-xl border border-dashed border-border bg-canvas p-0">
              <DropzoneTrigger className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-xl bg-transparent p-3 text-center text-xs shadow-none hover:bg-transparent">
                <Plus className="size-5 text-ink-muted" aria-hidden="true" />
                <span className="font-medium text-ink-secondary">
                  {PATIENT_GALLERY_COPY.uploader.addMore}
                </span>
              </DropzoneTrigger>
            </DropZoneArea>
          </DropzoneFileList>
        ) : null}
      </Dropzone>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_GALLERY_COPY.uploader.fields.phase}
        </span>
        <Controller
          control={control}
          name="phase"
          render={({ field }) => (
            <AppSearchableCombobox
              testId="patient-image-phase-combobox"
              value={field.value || null}
              onValueChange={(value) => field.onChange(value ?? "")}
              options={phaseOptions}
              placeholder={PATIENT_GALLERY_COPY.uploader.phasePlaceholder}
              searchPlaceholder={PATIENT_GALLERY_COPY.uploader.fields.phase}
              allowClear
              clearLabel={PATIENT_GALLERY_COPY.uploader.phasePlaceholder}
              showSearch={false}
            />
          )}
        />
        {errors.phase ? (
          <span className="text-sm text-danger">{errors.phase.message}</span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_GALLERY_COPY.uploader.fields.treatment}
        </span>
        <Controller
          control={control}
          name="treatment_id"
          render={({ field }) => (
            <PatientImageTreatmentSelect
              treatments={treatments}
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
        {errors.treatment_id ? (
          <span className="text-sm text-danger">
            {errors.treatment_id.message}
          </span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_GALLERY_COPY.uploader.fields.capturedAt}
        </span>
        <Controller
          control={control}
          name="captured_at"
          render={({ field }) => (
            <NewPatientDateField
              value={field.value ?? null}
              onChange={field.onChange}
            />
          )}
        />
        {errors.captured_at ? (
          <span className="text-sm text-danger">
            {errors.captured_at.message}
          </span>
        ) : null}
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PATIENT_GALLERY_COPY.uploader.fields.notes}
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
