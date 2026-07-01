import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { PATIENT_CREATE_COPY } from "@/copy/patient-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreatePatient } from "@/lib/hooks/use-patients";
import { patientSchema } from "@/lib/schemas/patient-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";

const patientFormSchema = patientSchema
  .omit({ clinic_id: true, birth_date: true })
  .extend({
    birth_date: z.date().nullable(),
  });

export type PatientFormValues = z.input<typeof patientFormSchema>;

const defaultValues: PatientFormValues = {
  full_name: "",
  dni: "",
  birth_date: null,
  phone: "",
  email: "",
  address: "",
  notes: "",
};

export function usePatientCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutateAsync, isPending } = useCreatePatient();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!clinicId) {
      toast.error(PATIENT_CREATE_COPY.validation.clinicRequired);
      return;
    }

    const parsed = patientSchema.safeParse({
      clinic_id: clinicId,
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
      toast.error(formatZodError(parsed.error));
      return;
    }

    try {
      await mutateAsync(parsed.data);
      toast.success(PATIENT_CREATE_COPY.success);
      reset(defaultValues);
      onSuccess();
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : PATIENT_CREATE_COPY.error,
      );
    }
  });

  return {
    register,
    control,
    errors,
    isPending: isPending || isSubmitting,
    reset: () => reset(defaultValues),
    handleSubmit: onSubmit,
  };
}
