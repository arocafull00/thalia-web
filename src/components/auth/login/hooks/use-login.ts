"use client";

import { useState } from "react";

import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { signInWithGoogleFlow } from "@/lib/auth/sign-in-with-google-flow";
import { isSupabaseConfigured } from "@/lib/environment";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePostAuthRedirect } from "@/lib/hooks/use-post-auth-redirect";
import { navigateAfterAuth } from "@/lib/navigation/navigate-after-auth";

export function useLogin() {
  const { signIn, user } = useAuth();
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
      await navigateAfterAuth();
    } catch (nextError) {
      setError(getAuthErrorMessage(nextError));
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setSubmitting(true);

    const result = await signInWithGoogleFlow();

    if (result.error) {
      setError(result.error);
    }

    setSubmitting(false);
  };

  return {
    authDisabled,
    email,
    error,
    handleGoogleSignIn,
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
