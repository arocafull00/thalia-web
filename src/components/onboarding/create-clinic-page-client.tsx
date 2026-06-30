"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { captureEvent } from "@/lib/analytics";
import { waitForAuthSessionReady } from "@/lib/auth/wait-for-auth-session";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import {
  buildCreateClinicPayloadFromProfile,
  validateClinicOnlyForm,
} from "@/lib/owner-clinic-form";
import {
  hasRegistrationProfile,
  OWNER_REGISTRATION_STEP_COUNT,
} from "@/lib/registration-metadata";
import { supabase } from "@/lib/supabase";
import { useClinicStore } from "@/stores/clinic-store";

export default function CreateClinicPageClient() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const fetchMemberships = useClinicStore((state) => state.fetchMemberships);
  const setActiveClinic = useClinicStore((state) => state.setActiveClinic);
  const [clinicName, setClinicName] = useState("");
  const [address, setAddress] = useState("");
  const [clinicPhone, setClinicPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!hasRegistrationProfile(user)) {
      router.replace("/register-employee");
      return;
    }
    if (ready && href && href !== "/create-clinic") {
      router.replace(href);
    }
  }, [loading, user, ready, href, router]);

  if (loading || !user) return null;
  if (ready && href && href !== "/create-clinic") return null;

  const handleContinue = async () => {
    const clinicValues = { clinicName, address, clinicPhone };
    const validationError = validateClinicOnlyForm(clinicValues);

    if (validationError) {
      setError(validationError);
      return;
    }

    const fullName =
      (typeof user?.user_metadata.full_name === "string" &&
        user.user_metadata.full_name.trim()) ||
      "";

    if (!fullName) {
      setError("Completa tu perfil antes de crear la clínica");
      return;
    }

    const payload = buildCreateClinicPayloadFromProfile(clinicValues, fullName);

    if (!payload) {
      setError("Completa los campos obligatorios");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke<{
        clinicId: string;
      }>("create-clinic", { body: payload });

      if (invokeError) {
        throw new Error(invokeError.message);
      }

      if (!data?.clinicId) {
        throw new Error("No se pudo crear la clínica");
      }

      captureEvent("clinic_created", { clinicId: data.clinicId });

      if (user?.id) {
        await fetchMemberships(user.id);
        setActiveClinic(data.clinicId);
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { registration_pending_invites: true },
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      await waitForAuthSessionReady();
      router.replace("/invite-team");
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "No se pudo crear la clínica",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-xl space-y-6 rounded-3xl border border-border bg-surface p-10 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-ink">Tu clínica</h1>
            <p className="mt-1 text-sm text-ink-secondary">
              Introduce los datos de tu clínica estética.
            </p>
          </div>
          <span className="text-xs uppercase tracking-wide text-ink-muted">
            Paso 2 de {OWNER_REGISTRATION_STEP_COUNT}
          </span>
        </div>
        <div className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-ink-secondary">
              Nombre
            </span>
            <input
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-ink-secondary">
              Dirección
            </span>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs uppercase tracking-wide text-ink-secondary">
              Teléfono
            </span>
            <input
              value={clinicPhone}
              onChange={(e) => setClinicPhone(e.target.value)}
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm"
            />
          </label>
        </div>
        {error ? <Notice tone="danger" message={error} /> : null}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wide"
          >
            <LogOut size={14} />
            Salir
          </button>
          <div className="flex gap-3">
            <Link
              href="/register-employee"
              className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wide"
            >
              Atrás
            </Link>
            <ActionButton
              title={submitting ? "Creando..." : "Continuar"}
              disabled={submitting}
              onClick={() => void handleContinue()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
