import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { PATIENT_EDIT_COPY } from "@/copy/patient-edit-copy";
import type { PatientFormValues } from "@/lib/hooks/use-patient-create-dialog";
import { patientSchema } from "@/lib/schemas/patient-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { notifySuccess } from "@/lib/sound";
import { usePatientsStore } from "@/stores/patients-store";
import type { Patient } from "@/types/database.types";

const patientFormSchema = patientSchema
  .omit({ clinic_id: true, birth_date: true })
  .extend({
    birth_date: z.date().nullable(),
  });

function toFormValues(patient: Patient): PatientFormValues {
  return {
    full_name: patient.full_name,
    dni: patient.dni ?? "",
    birth_date: patient.birth_date ? parseISO(patient.birth_date) : null,
    phone: patient.phone ?? "",
    email: patient.email ?? "",
    address: patient.address ?? "",
    notes: patient.notes ?? "",
  };
}

export function usePatientEditDialog(patient: Patient, onSuccess: () => void) {
  const updatePatient = usePatientsStore((state) => state.updatePatient);
  const isPending = usePatientsStore((state) => state.updating);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: toFormValues(patient),
  });

  const fullName = watch("full_name");
  const avatarInitials = getProfileInitials(fullName);

  useEffect(() => {
    reset(toFormValues(patient));
  }, [patient, reset]);

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    const parsed = patientSchema.safeParse({
      clinic_id: patient.clinic_id,
      full_name: data.full_name,
      dni: data.dni,
      birth_date: data.birth_date
        ? format(data.birth_date, "yyyy-MM-dd")
        : null,
      phone: data.phone,
      email: data.email,
      address: data.address,
      notes: data.notes,
    });

    if (!parsed.success) {
      setError("root", { message: formatZodError(parsed.error) });
      return;
    }

    try {
      await updatePatient(patient.id, {
        full_name: parsed.data.full_name,
        dni: parsed.data.dni,
        birth_date: parsed.data.birth_date,
        phone: parsed.data.phone,
        email: parsed.data.email,
        address: parsed.data.address,
        notes: parsed.data.notes,
      });
      notifySuccess(PATIENT_EDIT_COPY.success);
      onSuccess();
    } catch (cause) {
      setError("root", {
        message:
          cause instanceof Error ? cause.message : PATIENT_EDIT_COPY.error,
      });
    }
  });

  return {
    register,
    control,
    errors,
    isPending: isPending || isSubmitting,
    reset: () => reset(toFormValues(patient)),
    handleSubmit: onSubmit,
    avatarInitials,
  };
}
