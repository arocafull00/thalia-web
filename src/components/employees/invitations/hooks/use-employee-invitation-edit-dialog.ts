"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import { employeeInviteSchema } from "@/lib/schemas/employee-schema";
import { useEmployeesStore } from "@/stores/employees-store";
import type { PendingEmployeeInvitation } from "@/types/database.types";
import type { z } from "zod";

type InvitationEditValues = z.input<typeof employeeInviteSchema>;

function getDefaultValues(
  invitation: PendingEmployeeInvitation,
): InvitationEditValues {
  return { email: invitation.email, role: invitation.role };
}

export function useEmployeeInvitationEditDialog(
  invitation: PendingEmployeeInvitation,
  onSuccess: () => void,
) {
  const replaceInvitation = useEmployeesStore(
    (state) => state.replaceInvitation,
  );
  const mutatingId = useEmployeesStore(
    (state) => state.invitationMutatingId,
  );
  const form = useForm<InvitationEditValues>({
    resolver: zodResolver(employeeInviteSchema),
    defaultValues: getDefaultValues(invitation),
  });

  useEffect(() => {
    form.reset(getDefaultValues(invitation));
  }, [form, invitation]);

  const submit = form.handleSubmit(async (values) => {
    form.clearErrors("root");

    try {
      await replaceInvitation(invitation.id, values);
      toast.success(EMPLOYEE_INVITATIONS_COPY.edit.success);
      onSuccess();
    } catch (cause) {
      const message =
        cause instanceof Error && cause.message
          ? cause.message
          : EMPLOYEE_INVITATIONS_COPY.edit.error;
      form.setError("root", { message });
      toast.error(message);
    }
  });

  return {
    register: form.register,
    control: form.control,
    errors: form.formState.errors,
    isDirty: form.formState.isDirty,
    isPending: mutatingId === invitation.id || form.formState.isSubmitting,
    submit,
  };
}
