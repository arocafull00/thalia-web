"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import LoginFormPanel from "@/components/auth/login/components/login-form-panel";
import { useLogin } from "@/components/auth/login/hooks/use-login";

export default function LoginPageClient() {
  const router = useRouter();
  const {
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
  } = useLogin();

  useEffect(() => {
    if (!redirectHref) {
      return;
    }

    router.replace(redirectHref);
  }, [redirectHref, router]);

  if (redirectHref) {
    return null;
  }

  return (
    <LoginFormPanel
      authDisabled={authDisabled}
      email={email}
      error={error}
      handleGoogleSignIn={handleGoogleSignIn}
      handleRegisterPress={handleRegisterPress}
      handleSubmit={handleSubmit}
      isSupabaseConfigured={isSupabaseConfigured}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onTogglePassword={() => setShowPassword((current) => !current)}
      password={password}
      showPassword={showPassword}
      submitting={submitting}
    />
  );
}
