"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { signInWithGoogleFlow } from "@/lib/auth/sign-in-with-google-flow";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { ActionButton, Notice } from "@/components/ui/primitives";

export default function LoginPageClient() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user && ready && href) {
    router.replace(href);
    return null;
  }

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email.trim(), password);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "No se pudo iniciar sesión");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);

    if (!intent) {
      setIntent("owner");
    }

    const result = await signInWithGoogleFlow();

    if (result.error) {
      setError(result.error);
    }

    setSubmitting(false);
  };

  const authDisabled = submitting || !isSupabaseConfigured;

  const handleCreateAccountPress = () => {
    if (!intent) {
      setIntent("owner");
    }

    router.push("/register-employee");
  };

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <section className="hidden flex-1 flex-col justify-center gap-6 border-r border-zinc-200 bg-white p-10 lg:flex">
        <div>
          <h1 className="text-5xl font-medium tracking-tight text-zinc-900">Thalia</h1>
          <p className="mt-3 max-w-md text-lg text-zinc-500">
            Gestiona tu clínica con elegancia. Citas, pacientes, inventario y finanzas en un solo lugar.
          </p>
        </div>
        <ul className="space-y-3 text-zinc-600">
          {[
            "Agenda y calendario unificados",
            "Gestión de pacientes y historial",
            "Control de inventario y alertas",
            "Métricas financieras en tiempo real",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-zinc-900" />
              {feature}
            </li>
          ))}
        </ul>
      </section>
      <section className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div>
            <h2 className="text-2xl font-medium text-zinc-900">Bienvenido de nuevo</h2>
            <p className="mt-1 text-sm text-zinc-500">Inicia sesión para continuar.</p>
          </div>
          <div className="space-y-4">
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wide text-zinc-500">Correo electrónico</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="tu@correo.com"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-900 focus:ring-2"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs uppercase tracking-wide text-zinc-500">Contraseña</span>
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-200 px-3 py-2.5 text-sm outline-none ring-zinc-900 focus:ring-2"
              />
            </label>
          </div>
          {!isSupabaseConfigured ? (
            <Notice
              tone="warning"
              message="Configura NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY."
            />
          ) : null}
          {error ? <Notice tone="danger" message={error} /> : null}
          <div className="space-y-3">
            <ActionButton
              title={submitting ? "Entrando..." : "Entrar"}
              disabled={authDisabled}
              onClick={() => void handleSubmit()}
            />
            <ActionButton
              title="Continuar con Google"
              variant="ghost"
              disabled={authDisabled}
              onClick={() => void handleGoogleSignIn()}
            />
          </div>
          <button type="button" onClick={handleCreateAccountPress} className="w-full text-center text-sm text-zinc-500">
            ¿No tienes cuenta? <span className="font-medium text-zinc-900">Crear cuenta</span>
          </button>
        </div>
      </section>
    </div>
  );
}
