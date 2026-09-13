"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import { useReplaceEmployeeInvitation } from "@/lib/hooks/use-employees";
import { employeeInviteSchema } from "@/lib/schemas/employee-schema";
import type { PendingEmployeeInvitation } from "@/types/database.types";

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
  const replaceInvitation = useReplaceEmployeeInvitation();
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
      await replaceInvitation.mutateAsync({
        invitationId: invitation.id,
        values,
      });
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
    isPending: replaceInvitation.isPending || form.formState.isSubmitting,
    submit,
  };
}
