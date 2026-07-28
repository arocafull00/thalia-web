"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RegisterEmployeeForm from "@/components/auth/register-employee/components/register-employee-form";
import { useRegisterEmployee } from "@/components/auth/register-employee/hooks/use-register-employee";
import { BootLoadingScreen } from "@/components/loader/boot-loading-screen";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import { useAuth } from "@/lib/hooks/use-auth";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

export default function RegisterEmployeePageClient() {
  const router = useRouter();
  const { signOut } = useAuth();
  const {
    authDisabled,
    copy,
    errors,
    hasSession,
    invitationEmail,
    isSupabaseConfigured,
    onContinue,
    redirectHref,
    register,
    submitting,
    isRedirecting,
  } = useRegisterEmployee();

  useEffect(() => {
    if (!redirectHref) {
      return;
    }

    router.replace(redirectHref);
  }, [redirectHref, router]);

  if (redirectHref) {
    return <RedirectScreen />;
  }

  if (isRedirecting) {
    return <BootLoadingScreen authLoading clinicLoading={false} />;
  }

  return (
    <section className="flex min-h-screen flex-1 flex-col items-center justify-center bg-surface px-6 py-10">
      <div className="w-full max-w-[440px]">
        <RegisterEmployeeForm
          authDisabled={authDisabled}
          copy={copy}
          errors={errors}
          hasSession={hasSession}
          invitationEmail={invitationEmail}
          isSupabaseConfigured={isSupabaseConfigured}
          onContinue={onContinue}
          onLoginPress={() => router.replace("/login")}
          onSignOut={() => {
            usePendingInviteStore.getState().clearToken();
            if (hasSession) {
              void signOut();
            } else {
              router.replace("/login");
            }
          }}
          register={register}
          submitting={submitting}
        />
      </div>
    </section>
  );
}
