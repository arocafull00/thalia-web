"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signInWithGoogleFlow } from "@/lib/auth/sign-in-with-google-flow";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";

export function useLogin() {
  const router = useRouter();
  const { signIn, user } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const setIntent = useOnboardingIntentStore((state) => state.setIntent);
  const { href, ready } = usePostAuthRedirect(Boolean(user));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const redirectHref = user && ready && href ? href : null;
  const authDisabled = submitting || !isSupabaseConfigured;

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

  const handleRegisterPress = () => {
    if (!intent) {
      setIntent("owner");
    }

    router.push("/register-employee");
  };

  return {
    authDisabled,
    email,
    error,
    handleGoogleSignIn,
    handleRegisterPress,
    handleSubmit,
    isSupabaseConfigured,
    password,
    redirectHref,
    setEmail,
    setPassword,
    setShowPassword,
    showPassword,
    submitting,
  };
}
