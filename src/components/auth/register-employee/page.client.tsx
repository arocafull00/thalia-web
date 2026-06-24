"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RegisterEmployeeForm from "@/components/auth/register-employee/components/register-employee-form";
import RegisterEmployeeSidebar from "@/components/auth/register-employee/components/register-employee-sidebar";
import { useRegisterEmployee } from "@/components/auth/register-employee/hooks/use-register-employee";
import { useOnboardingIntentStore } from "@/stores/onboarding-intent-store";

export default function RegisterEmployeePageClient() {
  const router = useRouter();
  const intent = useOnboardingIntentStore((state) => state.intent);
  const resolvedIntent = intent ?? "owner";
  const {
    authDisabled,
    copy,
    email,
    error,
    fullName,
    hasSession,
    isSupabaseConfigured,
    onContinue,
    onEmailChange,
    onFullNameChange,
    onPasswordChange,
    password,
    redirectHref,
    stepTotal,
    submitting,
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

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <RegisterEmployeeSidebar intent={resolvedIntent} stepTotal={stepTotal} />
      <RegisterEmployeeForm
        authDisabled={authDisabled}
        copy={copy}
        email={email}
        error={error}
        fullName={fullName}
        hasSession={hasSession}
        isSupabaseConfigured={isSupabaseConfigured}
        onContinue={onContinue}
        onEmailChange={onEmailChange}
        onFullNameChange={onFullNameChange}
        onLoginPress={() => router.replace("/login")}
        onPasswordChange={onPasswordChange}
        password={password}
        submitting={submitting}
      />
    </div>
  );
}
