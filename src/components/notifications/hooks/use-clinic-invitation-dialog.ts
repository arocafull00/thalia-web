"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { CLINIC_INVITATION_COPY } from "@/copy/clinic-invitation-copy";
import type { PendingClinicRequest } from "@/lib/clinic-requests";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicRequestsStore } from "@/stores/clinic-requests-store";

type InvitationAction = "accept" | "reject";

export function useClinicInvitationDialog(
  invitation: PendingClinicRequest,
  onClose: () => void,
) {
  const router = useRouter();
  const userId = useAuthStore((state) => state.session?.user.id ?? null);
  const { employeeRole } = useActiveClinic();
  const [pendingAction, setPendingAction] = useState<InvitationAction | null>(
    null,
  );
  const { respondToRequest, responseError } = useClinicRequestsStore(
    useShallow((state) => ({
      respondToRequest: state.respondToRequest,
      responseError: state.responseError,
    })),
  );

  const respond = async (action: InvitationAction) => {
    if (!userId) {
      toast.error(CLINIC_INVITATION_COPY.errors.default);
      return;
    }

    setPendingAction(action);

    try {
      if (action === "accept") {
        if (!employeeRole) {
          throw new Error(CLINIC_INVITATION_COPY.errors.employee_role_required);
        }

        await respondToRequest(
          { token: invitation.token, action, employeeRole },
          userId,
        );
      } else {
        await respondToRequest({ token: invitation.token, action }, userId);
      }

      if (action === "accept") {
        toast.success(
          CLINIC_INVITATION_COPY.toast.accepted(invitation.clinicName),
        );
      } else {
        toast.success(CLINIC_INVITATION_COPY.toast.rejected);
      }

      onClose();
      router.refresh();
    } catch (cause) {
      toast.error(
        cause instanceof Error
          ? cause.message
          : CLINIC_INVITATION_COPY.errors.default,
      );
    } finally {
      setPendingAction(null);
    }
  };

  return {
    errorMessage: responseError?.message ?? null,
    pendingAction,
    handleAccept: () => void respond("accept"),
    handleReject: () => void respond("reject"),
  };
}
