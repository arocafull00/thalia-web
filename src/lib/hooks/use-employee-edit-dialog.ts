import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { EMPLOYEE_EDIT_COPY } from "@/copy/employee-edit-copy";
import { useUpdateEmployee } from "@/lib/hooks/use-employees";
import {
  formatZodError,
  nullableSpanishPhone,
  nullableTrimmedString,
} from "@/lib/schemas/schema-helpers";
import type { Employee, EmployeeRole } from "@/types/database.types";

const employeeEditFormSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre es demasiado largo."),
  role: z.enum(["admin", "reception", "doctor", "auxiliary"], {
    message: "El rol no es válido.",
  }),
  specialty: nullableTrimmedString(100, "La especialidad es demasiado larga."),
  phone: nullableSpanishPhone(),
});

export type EmployeeEditFormValues = z.input<typeof employeeEditFormSchema>;

function toFormValues(employee: Employee): EmployeeEditFormValues {
  return {
    full_name: employee.full_name,
    role: employee.role,
    specialty: employee.specialty ?? "",
    phone: employee.phone ?? "",
  };
}

export function useEmployeeEditDialog(
  employee: Employee,
  onSuccess: () => void,
) {
  const { mutate, isPending } = useUpdateEmployee();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeEditFormValues>({
    resolver: zodResolver(employeeEditFormSchema),
    defaultValues: toFormValues(employee),
  });

  useEffect(() => {
    reset(toFormValues(employee));
  }, [employee, reset]);

  const onSubmit = handleSubmit((data) => {
    const parsed = employeeEditFormSchema.safeParse(data);

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    mutate(
      {
        id: employee.id,
        values: {
          full_name: parsed.data.full_name,
          role: parsed.data.role as EmployeeRole,
          specialty: parsed.data.specialty,
          phone: parsed.data.phone,
        },
      },
      {
        onSuccess: () => {
          toast.success(EMPLOYEE_EDIT_COPY.success);
          onSuccess();
        },
        onError: (cause) => {
          toast.error(cause.message || EMPLOYEE_EDIT_COPY.error);
        },
      },
    );
  });

  return {
    register,
    control,
    errors,
    isPending: isPending || isSubmitting,
    reset: () => reset(toFormValues(employee)),
    handleSubmit: onSubmit,
  };
}
