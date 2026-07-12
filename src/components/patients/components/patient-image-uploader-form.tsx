"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import PatientImageTreatmentSelect from "@/components/patients/components/patient-image-treatment-select";
import NewPatientDateField from "@/components/patients/new-patient-date-field";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientImageFormValues } from "@/lib/hooks/use-patient-image-uploader";
import { useTreatments } from "@/lib/hooks/use-treatment";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type PatientImageUploaderFormProps = {
  register: UseFormRegister<PatientImageFormValues>;
  control: Control<PatientImageFormValues>;
  errors: FieldErrors<PatientImageFormValues>;
  previewUrl: string | null;
  isDragActive: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function PatientImageUploaderForm({
  register,
  control,
  errors,
  previewUrl,
  isDragActive,
  onDragEnter,
  onDragLeave,
  onDrop,
  onFileChange,
}: PatientImageUploaderFormProps) {
  const { data: treatments = [] } = useTreatments();

  return (
    <div className="space-y-4">
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onDrop}
        className={`rounded-2xl border border-dashed p-6 text-center transition-colors ${
          isDragActive
            ? "border-primary bg-primary-subtle"
            : "border-border bg-canvas"
        }`}
      >
        {previewUrl ? (
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl">
            <Image
              src={previewUrl}
              alt={PATIENT_GALLERY_COPY.uploader.previewAlt}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="size-8 text-ink-muted" aria-hidden="true" />
            <p className="text-sm text-ink-secondary">
              {isDragActive
                ? PATIENT_GALLERY_COPY.uploader.dropzoneActive
                : PATIENT_GALLERY_COPY.uploader.dropzone}
            </p>
          </div>
        )}

        <label className="mt-4 inline-flex cursor-pointer rounded-button border border-border/60 px-3 py-1.5 text-sm text-ink-secondary hover:bg-[var(--hover-overlay)]">
          {PATIENT_GALLERY_COPY.uploader.chooseFile}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={onFileChange}
          />
        </label>
      </div>

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
          <select {...register("phase")} className={inputClassName}>
            <option value="">
              {PATIENT_GALLERY_COPY.uploader.phasePlaceholder}
            </option>
            <option value="antes">{PATIENT_GALLERY_COPY.phases.antes}</option>
            <option value="durante">
              {PATIENT_GALLERY_COPY.phases.durante}
            </option>
            <option value="despues">
              {PATIENT_GALLERY_COPY.phases.despues}
            </option>
          </select>
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
