import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { useCreateEmployee } from "@/lib/hooks/use-employees";
import { employeeInviteSchema } from "@/lib/schemas/employee-schema";
import { notifySuccess } from "@/lib/sound";

const employeeFormSchema = employeeInviteSchema;

export type EmployeeFormValues = z.input<typeof employeeFormSchema>;

const defaultValues: EmployeeFormValues = {
  email: "",
  role: "employee",
};

export function useEmployeeInviteDialog(onSuccess: () => void) {
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
    mutate(data, {
      onSuccess: () => {
        notifySuccess(EMPLOYEE_INVITE_COPY.success);
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
