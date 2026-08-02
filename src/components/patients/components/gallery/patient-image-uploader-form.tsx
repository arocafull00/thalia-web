"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { PatientImageFormValues } from "@/lib/hooks/use-patient-image-uploader";
import { useTreatments } from "@/lib/hooks/use-treatment";

import NewPatientDateField from "../shared/new-patient-date-field";

import PatientImageTreatmentSelect from "./patient-image-treatment-select";
import PatientImageUploaderDropzone from "./patient-image-uploader-dropzone";

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

  return (
    <div className="space-y-4">
      <PatientImageUploaderDropzone onFilesChanged={onFilesChanged} />

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
