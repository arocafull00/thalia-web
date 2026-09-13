import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { lookupEmployeeInvitationByToken } from "@/dal/employees.dal";
import { useAuth } from "@/lib/hooks/use-auth";
import { useClinicRequestsStore } from "@/stores/clinic-requests-store";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";
import type { EmployeeRole } from "@/types/database.types";

type InvitationState =
  | { status: "loading" }
  | { status: "unauthenticated" }
  | { status: "ready"; clinicName: string; role: string; email: string }
  | { status: "error"; message: string }
  | { status: "accepted" }
  | { status: "rejected" };

export function useAcceptInvitation(token: string) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const setToken = usePendingInviteStore((state) => state.setToken);
  const clearToken = usePendingInviteStore((state) => state.clearToken);
  const respondToRequest = useClinicRequestsStore(
    (store) => store.respondToRequest,
  );
  const [state, setState] = useState<InvitationState>({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);
  const [employeeRole, setEmployeeRole] = useState<EmployeeRole>("doctor");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let cancelled = false;

    if (!user) {
      lookupEmployeeInvitationByToken(token.trim())
        .then((invitation) => {
          if (cancelled) return;
          setToken(token, invitation?.email ?? undefined);
          setIntent("employee");
          router.replace("/register-employee");
        })
        .catch(() => {
          if (cancelled) return;
          setState({ status: "error", message: "Invitación no encontrada." });
        });
      return () => {
        cancelled = true;
      };
    }

    const fetchInvitation = async () => {
      const data = await lookupEmployeeInvitationByToken(token.trim()).catch(
        () => null,
      );

      if (cancelled) return;

      if (!data) {
        setState({ status: "error", message: "Invitación no encontrada." });
        return;
      }

      if (data.used_at) {
        setState({
          status: "error",
          message: "Esta invitación ya ha sido usada.",
        });
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setState({ status: "error", message: "Esta invitación ha caducado." });
        return;
      }

      const clinicName =
        data.clinics && "name" in data.clinics
          ? (data.clinics as { name: string }).name
          : "la clínica";

      setState({
        status: "ready",
        clinicName,
        role: data.role,
        email: data.email,
      });
    };

    void fetchInvitation();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, token, setToken, setIntent, router]);

  const handleAccept = async () => {
    setSubmitting(true);

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para aceptar la invitación.");
      }

      const role = state.status === "ready" ? state.role : null;
      await respondToRequest(
        {
          token,
          action: "accept",
          employeeRole: role === "admin" ? "admin" : employeeRole,
        },
        user.id,
      );

      clearToken();
      setState({ status: "accepted" });

      router.replace("/dashboard");
    } catch (cause) {
      setState({
        status: "error",
        message:
          cause instanceof Error
            ? cause.message
            : "No se pudo aceptar la invitación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    setSubmitting(true);

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión para rechazar la invitación.");
      }

      await respondToRequest({ token, action: "reject" }, user.id);

      clearToken();
      setState({ status: "rejected" });
      router.replace("/dashboard");
    } catch (cause) {
      setState({
        status: "error",
        message:
          cause instanceof Error
            ? cause.message
            : "No se pudo rechazar la invitación.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    state,
    submitting,
    employeeRole,
    setEmployeeRole,
    handleAccept,
    handleReject,
  };
}
