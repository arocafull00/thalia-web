"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useEmployeesStore } from "@/stores/employees-store";
import { isInitialLoading } from "@/stores/query-state";
import type { PendingEmployeeInvitation } from "@/types/database.types";

export type EmployeeInvitationAction = "reactivate" | "cancel";

export function useEmployeeInvitations() {
  const clinicId = useClinicId();
  const entry = useEmployeesStore((state) => state.invitations);
  const fetchPendingInvitations = useEmployeesStore(
    (state) => state.fetchPendingInvitations,
  );
  const replaceInvitation = useEmployeesStore(
    (state) => state.replaceInvitation,
  );
  const cancelInvitation = useEmployeesStore((state) => state.cancelInvitation);
  const invitationMutatingId = useEmployeesStore(
    (state) => state.invitationMutatingId,
  );
  const [editingInvitation, setEditingInvitation] =
    useState<PendingEmployeeInvitation | null>(null);
  const [pendingAction, setPendingAction] = useState<{
    action: EmployeeInvitationAction;
    invitation: PendingEmployeeInvitation;
  } | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!clinicId) {
      return;
    }

    void fetchPendingInvitations();
  }, [clinicId, fetchPendingInvitations]);

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
        await replaceInvitation(invitation.id, {
          email: invitation.email,
          role: invitation.role,
        });
      } else {
        await cancelInvitation(invitation.id);
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
    invitations: entry.data ?? [],
    error: entry.error,
    isLoading: entry.data == null && isInitialLoading(entry),
    isMutating:
      pendingAction !== null &&
      invitationMutatingId === pendingAction.invitation.id,
    editingInvitation,
    pendingAction,
    actionError,
    setEditingInvitation,
    requestAction,
    closeAction,
    confirmAction,
  };
}
