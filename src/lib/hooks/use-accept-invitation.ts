import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuth } from "@/lib/hooks/use-auth";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";
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
  const [state, setState] = useState<InvitationState>({ status: "loading" });
  const [submitting, setSubmitting] = useState(false);
  const [employeeRole, setEmployeeRole] = useState<EmployeeRole>("doctor");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    let cancelled = false;

    if (!user) {
      supabase
        .from("invitation_tokens")
        .select("email")
        .eq("token", token.trim())
        .maybeSingle()
        .then(({ data }) => {
          if (cancelled) return;
          setToken(token, data?.email ?? undefined);
          setIntent("employee");
          router.replace("/register-employee");
        });
      return () => {
        cancelled = true;
      };
    }

    const fetchInvitation = async () => {
      const { data, error } = await supabase
        .from("invitation_tokens")
        .select("email, role, expires_at, used_at, clinics(name)")
        .eq("token", token.trim())
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
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
      const role = state.status === "ready" ? state.role : null;
      const body: Record<string, string> = { token, action: "accept" };

      if (role !== "admin") {
        body.employeeRole = employeeRole;
      }

      const { error } = await supabase.functions.invoke("accept-invitation", {
        body,
      });

      if (error) {
        throw new Error(error.message);
      }

      clearToken();
      setState({ status: "accepted" });

      if (user) {
        await useClinicStore.getState().fetchMemberships(user.id);
        await useAuthStore.getState().refreshProfile();
      }

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
      const { error } = await supabase.functions.invoke("accept-invitation", {
        body: { token, action: "reject" },
      });

      if (error) {
        throw new Error(error.message);
      }

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
