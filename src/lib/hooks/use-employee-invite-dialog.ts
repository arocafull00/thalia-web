import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreateEmployee } from "@/lib/hooks/use-employees";
import { employeeSchema } from "@/lib/schemas/employee-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";

const employeeFormSchema = employeeSchema.omit({ clinicId: true, color: true });

export type EmployeeFormValues = z.input<typeof employeeFormSchema>;

const defaultValues: EmployeeFormValues = {
  fullName: "",
  email: "",
  role: "doctor",
  specialty: "",
  phone: "",
};

export function useEmployeeInviteDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateEmployee();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    if (!clinicId) {
      toast.error(EMPLOYEE_INVITE_COPY.validation.clinicRequired);
      return;
    }

    const parsed = employeeSchema.safeParse({
      clinicId,
      ...data,
      color: null,
    });

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        toast.success(EMPLOYEE_INVITE_COPY.success);
        reset(defaultValues);
        onSuccess();
      },
      onError: (cause) => {
        toast.error(cause.message || EMPLOYEE_INVITE_COPY.error);
      },
    });
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
