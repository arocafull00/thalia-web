"use client";

import { CloudUpload } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import PatientImageTreatmentSelect from "@/components/patients/components/patient-image-treatment-select";
import PatientImageUploaderDropzoneFileItem from "@/components/patients/components/patient-image-uploader-dropzone-file-item";
import NewPatientDateField from "@/components/patients/new-patient-date-field";
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

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const phaseOptions = [
  { label: PATIENT_GALLERY_COPY.phases.antes, value: "antes" },
  { label: PATIENT_GALLERY_COPY.phases.durante, value: "durante" },
  { label: PATIENT_GALLERY_COPY.phases.despues, value: "despues" },
];

type PatientImageUploaderFormProps = {
  register: UseFormRegister<PatientImageFormValues>;
  control: Control<PatientImageFormValues>;
  errors: FieldErrors<PatientImageFormValues>;
  onFileSelected: (file: File | null) => void;
};

export default function PatientImageUploaderForm({
  register,
  control,
  errors,
  onFileSelected,
}: PatientImageUploaderFormProps) {
  const { data: treatments = [] } = useTreatments();

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      onFileSelected(file);
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    onRemoveFile: async () => {
      onFileSelected(null);
    },
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".webp"],
      },
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

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

  return (
    <div className="space-y-4">
      <Dropzone {...dropzone}>
        <div className="flex justify-between gap-4">
          <DropzoneDescription className="text-ink-secondary">
            {PATIENT_GALLERY_COPY.uploader.dropzone}
          </DropzoneDescription>
          <DropzoneMessage className="text-danger" />
        </div>

        {dropzone.fileStatuses.length === 0 ? (
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

        <DropzoneFileList className="grid grid-cols-3 gap-3 p-0">
          {dropzone.fileStatuses.map((file) => (
            <PatientImageUploaderDropzoneFileItem key={file.id} file={file} />
          ))}
        </DropzoneFileList>
      </Dropzone>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_GALLERY_COPY.uploader.fields.category}
          </span>
          <input {...register("category")} className={inputClassName} />
          {errors.category ? (
            <span className="text-sm text-danger">
              {errors.category.message}
            </span>
          ) : null}
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PATIENT_GALLERY_COPY.uploader.fields.phase}
          </span>
          <Controller
            control={control}
            name="phase"
            render={({ field }) => (
              <AppSearchableCombobox
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
      </div>

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
