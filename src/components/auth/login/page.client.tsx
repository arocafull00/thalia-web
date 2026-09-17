"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LoginFooter from "@/components/auth/login/components/login-footer";
import LoginFormPanel from "@/components/auth/login/components/login-form-panel";
import LoginRegisterSlider from "@/components/auth/login/components/login-register-slider";
import { useLogin } from "@/components/auth/login/hooks/use-login";
import RegisterFlow from "@/components/auth/register/register-flow";
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
      <section className="flex min-h-screen min-w-0 flex-1 flex-col bg-surface">
        <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8">
          <LoginRegisterSlider
            loginContent={
              <LoginFormPanel
                authDisabled={authDisabled}
                email={email}
                error={error}
                handleGoogleSignIn={handleGoogleSignIn}
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
            }
            registerContent={<RegisterFlow showExit={false} />}
          />
        </div>
        <LoginFooter />
      </section>
      <PwaInstallDialog
        open={pwaInstallOpen}
        onOpenChange={setPwaInstallOpen}
      />
    </>
  );
}
