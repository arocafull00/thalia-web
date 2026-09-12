"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LoginFormPanel from "@/components/auth/login/components/login-form-panel";
import { useLogin } from "@/components/auth/login/hooks/use-login";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import PwaInstallDialog from "@/components/pwa/components/pwa-install-dialog";
import { usePwaInstall } from "@/components/pwa/hooks/use-pwa-install";

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
  const [pwaInstallOpen, setPwaInstallOpen] = useState(false);
  const { canPromptInstall, handleInstall, showInstallCta } = usePwaInstall();

  const handlePwaInstallClick = () => {
    if (canPromptInstall) {
      void handleInstall();
      return;
    }

    setPwaInstallOpen(true);
  };

  useEffect(() => {
    if (!redirectHref) {
      return;
    }

    router.replace(redirectHref);
  }, [redirectHref, router]);

  if (redirectHref) {
    return <RedirectScreen />;
  }

  return (
    <>
      <LoginFormPanel
        authDisabled={authDisabled}
        email={email}
        error={error}
        handleGoogleSignIn={handleGoogleSignIn}
        handleRegisterPress={handleRegisterPress}
        handleSubmit={handleSubmit}
        isSupabaseConfigured={isSupabaseConfigured}
        onEmailChange={setEmail}
        onInstallClick={handlePwaInstallClick}
        onPasswordChange={setPassword}
        onTogglePassword={() => setShowPassword((current) => !current)}
        password={password}
        showInstallCta={showInstallCta}
        showPassword={showPassword}
        submitting={submitting}
      />
      <PwaInstallDialog
        open={pwaInstallOpen}
        onOpenChange={setPwaInstallOpen}
      />
    </>
  );
}
