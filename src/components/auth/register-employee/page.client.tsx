"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RegisterEmployeeForm from "@/components/auth/register-employee/components/register-employee-form";
import RegisterEmployeeSidebar from "@/components/auth/register-employee/components/register-employee-sidebar";
import { useRegisterEmployee } from "@/components/auth/register-employee/hooks/use-register-employee";
import { useAuth } from "@/lib/hooks/use-auth";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";
import { usePendingInviteStore } from "@/stores/pending-invite-store";

export default function RegisterEmployeePageClient() {
  const router = useRouter();
  const { signOut } = useAuth();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const resolvedIntent = intent ?? "owner";
  const {
    authDisabled,
    copy,
    currentStep,
    email,
    error,
    fullName,
    hasSession,
    invitationEmail,
    isSupabaseConfigured,
    onContinue,
    onEmailChange,
    onFullNameChange,
    onPasswordChange,
    password,
    redirectHref,
    stepTotal,
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
    return null;
  }

  if (submitting || isRedirecting || hasSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      <RegisterEmployeeSidebar
        intent={resolvedIntent}
        stepTotal={stepTotal}
        currentStep={currentStep}
      />
      <RegisterEmployeeForm
        authDisabled={authDisabled}
        copy={copy}
        email={email}
        error={error}
        fullName={fullName}
        hasSession={hasSession}
        invitationEmail={invitationEmail}
        isSupabaseConfigured={isSupabaseConfigured}
        onContinue={onContinue}
        onEmailChange={onEmailChange}
        onFullNameChange={onFullNameChange}
        onLoginPress={() => router.replace("/login")}
        onPasswordChange={onPasswordChange}
        onSignOut={() => {
          usePendingInviteStore.getState().clearToken();
          if (hasSession) {
            void signOut();
          } else {
            router.replace("/login");
          }
        }}
        password={password}
        submitting={submitting}
      />
    </div>
  );
}
