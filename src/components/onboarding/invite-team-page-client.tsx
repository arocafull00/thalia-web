"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { BootLoadingScreen } from "@/components/loader/boot-loading-screen";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
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

export default function InviteTeamPageClient() {
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

  if (loading) {
    return <BootLoadingScreen authLoading={loading} clinicLoading={false} />;
  }

  if (!user) {
    router.replace("/login");
    return <RedirectScreen />;
  }

  if (user && intent !== "owner" && !hasPendingTeamInvites(user)) {
    router.replace("/dashboard");
    return <RedirectScreen />;
  }

  if (
    user &&
    ready &&
    href &&
    href !== "/invite-team" &&
    !hasPendingTeamInvites(user)
  ) {
    router.replace(href);
    return <RedirectScreen />;
  }

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-border bg-surface p-10 shadow-sm">
        <div>
          <h1 className="text-2xl font-medium text-ink">Invita a tu equipo</h1>
          <p className="mt-1 text-sm text-ink-secondary">
            Añade los correos de quienes trabajarán contigo.
          </p>
        </div>
        <div className="space-y-3">
          {emails.map((entry, index) => (
            <div key={`invite-${index}`} className="flex gap-2">
              <input
                value={entry}
                onChange={(event) =>
                  setEmails((current) =>
                    current.map((value, entryIndex) =>
                      entryIndex === index ? event.target.value : value,
                    ),
                  )
                }
                type="email"
                placeholder="correo@clinica.com"
                className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm"
              />
              {emails.length > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEmails((current) =>
                      current.filter((_, entryIndex) => entryIndex !== index),
                    )
                  }
                  className="rounded-xl px-3 text-sm"
                >
                  Quitar
                </Button>
              ) : null}
            </div>
          ))}
          <Button
            type="button"
            variant="link"
            onClick={() => setEmails((current) => [...current, ""])}
            className="text-sm font-medium"
          >
            Añadir otro correo
          </Button>
        </div>
        {error ? <Notice tone="danger" message={error} /> : null}
        {notice ? <Notice message={notice} /> : null}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => void handleSkip()}
            className="px-4 py-2 text-xs uppercase tracking-wide"
          >
            Saltar
          </Button>
          <ActionButton
            title={submitting ? "Enviando..." : "Continuar"}
            disabled={submitting}
            onClick={() => void handleContinue()}
          />
        </div>
      </div>
    </div>
  );
}
