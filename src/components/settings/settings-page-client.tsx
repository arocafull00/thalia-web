"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";

import PwaInstallPanel from "@/components/pwa/components/pwa-install-panel";
import SettingsProfilePanel from "@/components/settings/settings-profile-panel";
import { ActionButton, Notice, PageHeader } from "@/components/ui/primitives";
import { buildProfileSubtitle, useSettingsPageActions } from "@/lib/hooks/use-settings-page";
import { useAuth } from "@/lib/hooks/use-auth";

export default function SettingsPageClient() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const {
    activeEmployeesCount,
    canViewClinicRequests,
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    isAdmin,
    localAvatarUri,
    passwordMessage,
    passwordSubmitting,
    pendingClinicRequests,
    signOutSubmitting,
    uploadAvatar,
  } = useSettingsPageActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <Notice tone="danger" message="No se pudo cargar el perfil." />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <PageHeader subtitle="Cuenta, preferencias y gestión de clínica." title="Ajustes" />
      <div className="mx-auto grid max-w-5xl gap-8 xl:grid-cols-[240px_1fr]">
        <div className="border-r border-border pr-8">
          <SettingsProfilePanel
            onPickAvatar={() => fileInputRef.current?.click()}
            uploadingAvatar={uploadAvatar.isPending}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (!file) {
                return;
              }

              handleAvatarPress(URL.createObjectURL(file));
            }}
          />
        </div>
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-medium">Cuenta</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">Correo electrónico</p>
                <p className="mt-1 text-ink">{user.email ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">Teléfono</p>
                <p className="mt-1 text-ink">{profile.phone ?? "—"}</p>
              </div>
            </div>
            {canViewClinicRequests ? (
              <Link href="/settings/clinic-requests" className="block rounded-2xl border border-border p-4 hover:bg-canvas">
                <p className="font-medium text-ink">Solicitudes de clínica</p>
                <p className="text-sm text-ink-secondary">
                  Clínicas que quieren trabajar contigo ({pendingClinicRequests.length})
                </p>
              </Link>
            ) : null}
            {passwordMessage ? <Notice message={passwordMessage} /> : null}
            <ActionButton
              title={passwordSubmitting ? "Enviando..." : "Cambiar contraseña"}
              variant="ghost"
              disabled={passwordSubmitting}
              onClick={() => void handleChangePassword()}
            />
          </section>
          {isAdmin ? (
            <section className="space-y-4">
              <h2 className="text-lg font-medium">Gestión de clínica</h2>
              <div className="space-y-3">
                <Link href="/settings/team" className="block rounded-2xl border border-border p-4 hover:bg-canvas">
                  Añadir al equipo
                </Link>
                <Link href="/settings/staff" className="block rounded-2xl border border-border p-4 hover:bg-canvas">
                  Personal y especialistas ({activeEmployeesCount} activos)
                </Link>
                <Link href="/settings/treatments" className="block rounded-2xl border border-border p-4 hover:bg-canvas">
                  Catálogo de servicios
                </Link>
              </div>
            </section>
          ) : null}
          <PwaInstallPanel />
          <section className="border-t border-border pt-6">
            <ActionButton
              title={signOutSubmitting ? "Cerrando sesión..." : "Cerrar sesión"}
              variant="ghost"
              disabled={signOutSubmitting}
              onClick={() => void handleSignOut()}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
