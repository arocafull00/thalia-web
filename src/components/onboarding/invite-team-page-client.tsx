"use client";

import { BootLoadingScreen } from "@/components/loader/boot-loading-screen";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import { useInviteTeamPage } from "@/components/onboarding/hooks/use-invite-team-page";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";

export default function InviteTeamPageClient() {
  const page = useInviteTeamPage();

  if (page.loading) {
    return (
      <BootLoadingScreen authLoading={page.loading} clinicLoading={false} />
    );
  }

  if (
    page.shouldRedirectToLogin ||
    page.shouldRedirectToDashboard ||
    page.shouldRedirectToPostAuth
  ) {
    return <RedirectScreen />;
  }

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
          {page.emails.map((entry, index) => (
            <div key={`invite-${index}`} className="flex gap-2">
              <input
                value={entry}
                onChange={(event) =>
                  page.setEmails((current) =>
                    current.map((value, entryIndex) =>
                      entryIndex === index ? event.target.value : value,
                    ),
                  )
                }
                type="email"
                placeholder="correo@clinica.com"
                className="flex-1 rounded-xl border border-border px-3 py-2.5 text-sm"
              />
              {page.emails.length > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    page.setEmails((current) =>
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
            onClick={() => page.setEmails((current) => [...current, ""])}
            className="text-sm font-medium"
          >
            Añadir otro correo
          </Button>
        </div>
        {page.error ? <Notice tone="danger" message={page.error} /> : null}
        {page.notice ? <Notice message={page.notice} /> : null}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => void page.handleSkip()}
            className="px-4 py-2 text-xs uppercase tracking-wide"
          >
            Saltar
          </Button>
          <ActionButton
            title={page.submitting ? "Enviando..." : "Continuar"}
            disabled={page.submitting}
            onClick={() => void page.handleContinue()}
          />
        </div>
      </div>
    </div>
  );
}
