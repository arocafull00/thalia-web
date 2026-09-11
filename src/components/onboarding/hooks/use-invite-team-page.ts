"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { EMPLOYEE_INVITE_COPY } from "@/copy/employee-invite-copy";
import { inviteEmployee } from "@/dal/employees.dal";
import { captureEvent } from "@/lib/analytics";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import {
  normalizeInviteEmails,
  validateInviteEmails,
} from "@/lib/invite-team-emails";
import { navigateAfterAuth } from "@/lib/navigation/navigate-after-auth";
import { hasPendingTeamInvites } from "@/lib/registration-metadata";
import { supabase } from "@/lib/supabase";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";

export function useInviteTeamPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const clearIntent = useOnboardingIntentStore((state) => state.clearIntent);
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const clinicId = useClinicId();
  const [emails, setEmails] = useState([""]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const shouldRedirectToLogin = !loading && !user;
  const shouldRedirectToDashboard =
    !loading &&
    Boolean(user) &&
    intent !== "owner" &&
    !hasPendingTeamInvites(user);
  const shouldRedirectToPostAuth =
    !loading &&
    Boolean(user) &&
    ready &&
    Boolean(href) &&
    href !== "/invite-team" &&
    !hasPendingTeamInvites(user);

  useEffect(() => {
    if (shouldRedirectToLogin) {
      router.replace("/login");
      return;
    }

    if (shouldRedirectToDashboard) {
      router.replace("/dashboard");
      return;
    }

    if (shouldRedirectToPostAuth && href) {
      router.replace(href);
    }
  }, [
    href,
    router,
    shouldRedirectToDashboard,
    shouldRedirectToLogin,
    shouldRedirectToPostAuth,
  ]);

  const finishInvites = async (skipped: boolean) => {
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        registration_pending_invites: false,
        registration_invites_complete: true,
      },
    });

    if (updateError) {
      throw new Error(updateError.message);
    }

    captureEvent(
      skipped ? "onboarding_invites_skipped" : "onboarding_invites_sent",
    );
    clearIntent();
    await waitForAuthSessionReady();
    await navigateAfterAuth();
  };

  const handleSkip = async () => {
    setError(null);
    setSubmitting(true);

    try {
      await finishInvites(true);
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "No se pudo continuar",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleContinue = async () => {
    setError(null);
    setNotice(null);

    const normalized = normalizeInviteEmails(emails);
    const validationError = validateInviteEmails(emails);

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!clinicId) {
      setError(EMPLOYEE_INVITE_COPY.validation.clinicRequired);
      return;
    }

    setSubmitting(true);

    try {
      if (normalized.length === 0) {
        await finishInvites(true);
        return;
      }

      const failures: string[] = [];

      for (const inviteEmail of normalized) {
        try {
          await inviteEmployee({
            email: inviteEmail,
            role: "employee",
            clinicId,
          });
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : EMPLOYEE_INVITE_COPY.error;
          failures.push(`${inviteEmail}: ${message}`);
        }
      }

      if (failures.length === normalized.length) {
        throw new Error(failures[0] ?? "No se pudo enviar ninguna invitación");
      }

      if (failures.length > 0) {
        setNotice(
          `Algunas invitaciones no se registraron. ${failures.length} de ${normalized.length} fallaron.`,
        );
      }

      await finishInvites(false);
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "No se pudo invitar al equipo",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return {
    emails,
    error,
    handleContinue,
    handleSkip,
    loading,
    notice,
    setEmails,
    shouldRedirectToDashboard,
    shouldRedirectToLogin,
    shouldRedirectToPostAuth,
    submitting,
  };
}
