"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import {
  useCancelEmployeeInvitation,
  usePendingEmployeeInvitations,
  useReplaceEmployeeInvitation,
} from "@/lib/hooks/use-employees";
import type { PendingEmployeeInvitation } from "@/types/database.types";

export type EmployeeInvitationAction = "reactivate" | "cancel";

export function useEmployeeInvitations() {
  const invitationsQuery = usePendingEmployeeInvitations();
  const replaceInvitation = useReplaceEmployeeInvitation();
  const cancelInvitation = useCancelEmployeeInvitation();
  const [editingInvitation, setEditingInvitation] =
    useState<PendingEmployeeInvitation | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    action: EmployeeInvitationAction;
    invitation: PendingEmployeeInvitation;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const requestAction = useCallback(
    (
      action: EmployeeInvitationAction,
      invitation: PendingEmployeeInvitation,
    ) => {
      setActionError(null);
      setPendingAction({ action, invitation });
    },
    [],
  );

  const closeAction = useCallback(() => {
    setActionError(null);
    setPendingAction(null);
  }, []);

  const confirmAction = useCallback(async () => {
    if (!pendingAction) {
      return;
    }

    const { action, invitation } = pendingAction;
    const copy = EMPLOYEE_INVITATIONS_COPY[action];
    setActionError(null);

    try {
      if (action === "reactivate") {
        await replaceInvitation.mutateAsync({
          invitationId: invitation.id,
          values: {
            email: invitation.email,
            role: invitation.role,
          },
        });
      } else {
        await cancelInvitation.mutateAsync(invitation.id);
      }

      toast.success(copy.success);
      closeAction();
    } catch (cause) {
      const message =
        cause instanceof Error && cause.message ? cause.message : copy.error;
      setActionError(message);
      toast.error(message);
    }
  }, [cancelInvitation, closeAction, pendingAction, replaceInvitation]);

  return {
    invitations: invitationsQuery.data ?? [],
    error: invitationsQuery.error,
    isLoading: invitationsQuery.isLoading,
    isMutating: replaceInvitation.isPending || cancelInvitation.isPending,
    editingInvitation,
    pendingAction,
    actionError,
    setEditingInvitation,
    requestAction,
    closeAction,
    confirmAction,
  };
}
