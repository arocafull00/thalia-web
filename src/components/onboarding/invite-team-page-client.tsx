"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { captureEvent } from "@/lib/analytics";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { useAuth } from "@/lib/hooks/use-auth";
import { normalizeInviteEmails, validateInviteEmails } from "@/lib/invite-team-emails";
import { navigateAfterAuth } from "@/lib/navigation/navigate-after-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import {
  hasPendingTeamInvites,
  OWNER_REGISTRATION_STEP_COUNT,
} from "@/lib/registration-metadata";
import { supabase } from "@/lib/supabase";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { ActionButton, Notice } from "@/components/ui/primitives";

export default function InviteTeamPageClient() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const clearIntent = useOnboardingIntentStore((state) => state.clearIntent);
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const [emails, setEmails] = useState([""]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && !user) {
    router.replace("/login");
    return null;
  }

  if (!loading && user && intent !== "owner" && !hasPendingTeamInvites(user)) {
    router.replace("/dashboard");
    return null;
  }

  if (user && ready && href && href !== "/invite-team" && !hasPendingTeamInvites(user)) {
    router.replace(href);
    return null;
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

    captureEvent(skipped ? "onboarding_invites_skipped" : "onboarding_invites_sent");
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
      setError(nextError instanceof Error ? nextError.message : "No se pudo continuar");
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

    setSubmitting(true);

    try {
      if (normalized.length === 0) {
        await finishInvites(true);
        return;
      }

      const failures: string[] = [];

      for (const inviteEmail of normalized) {
        const { error: invokeError } = await supabase.functions.invoke("invite-employee", {
          body: { email: inviteEmail, role: "employee" },
        });

        if (invokeError) {
          failures.push(`${inviteEmail}: ${invokeError.message}`);
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
      setError(nextError instanceof Error ? nextError.message : "No se pudo invitar al equipo");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-border bg-surface p-10 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-ink">Invita a tu equipo</h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Añade los correos de quienes trabajarán contigo.
            </p>
          </div>
          <span className="text-xs uppercase tracking-wide text-ink-muted">
            Paso 3 de {OWNER_REGISTRATION_STEP_COUNT}
          </span>
        </div>
        <div className="space-y-3">
          {emails.map((entry, index) => (
            <div key={`invite-${index}`} className="flex gap-2">
              <input
                value={entry}
                onChange={(event) =>
                  setEmails((current) =>
                    current.map((value, entryIndex) => (entryIndex === index ? event.target.value : value)),
                  )
                }
                type="email"
                placeholder="correo@clinica.com"
                className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm"
              />
              {emails.length > 1 ? (
                <button
                  type="button"
                  onClick={() => setEmails((current) => current.filter((_, entryIndex) => entryIndex !== index))}
                  className="rounded-xl border border-border px-3 text-sm text-ink-secondary"
                >
                  Quitar
                </button>
              ) : null}
            </div>
          ))}
          <button type="button" onClick={() => setEmails((current) => [...current, ""])} className="text-sm font-medium text-ink">
            Añadir otro correo
          </button>
        </div>
        {error ? <Notice tone="danger" message={error} /> : null}
        {notice ? <Notice message={notice} /> : null}
        <div className="flex justify-end gap-3">
          <Link href="/create-clinic" className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wide">
            Atrás
          </Link>
          <button type="button" onClick={() => void handleSkip()} className="px-4 py-2 text-xs uppercase tracking-wide text-ink-secondary">
            Saltar
          </button>
          <ActionButton title={submitting ? "Enviando..." : "Continuar"} disabled={submitting} onClick={() => void handleContinue()} />
        </div>
      </div>
    </div>
  );
}
