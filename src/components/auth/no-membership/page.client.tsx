"use client";

import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/hooks/use-auth";

export default function NoMembershipPageClient() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-surface px-6">
      <div className="w-full max-w-[440px] space-y-6 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Thalia"
          width={56}
          height={56}
          className="mx-auto rounded-xl"
        />
        <h1 className="text-2xl font-medium text-ink">Thalia</h1>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-ink">
            Sin acceso a ninguna clínica
          </h2>
          <p className="text-sm text-ink-secondary">
            Este usuario no tiene membresía con ninguna clínica. Contacta con el
            administrador de tu clínica para recibir una invitación.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="rounded-full border border-border px-6 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-border-subtle"
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}
