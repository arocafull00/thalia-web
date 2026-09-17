"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import RegisterEmployeeEmail from "@/components/auth/register/components/register-employee-email";
import RegisterTypePicker from "@/components/auth/register/components/register-type-picker";
import OwnerRegistrationPageClient from "@/components/auth/register/owner-registration-page.client";
import { RedirectScreen } from "@/components/loader/redirect-screen";
import { useRegisterType } from "@/lib/hooks/use-register-type";

type RegisterFlowProps = {
  showExit: boolean;
};

export default function RegisterFlow({ showExit }: RegisterFlowProps) {
  const router = useRouter();
  const {
    step,
    emailRegister,
    emailError,
    error,
    redirectHref,
    submitting,
    handlePickOwner,
    handlePickEmployee,
    handleBack,
    handleEmployeeEmailSubmit,
    handleOwnerExit,
    handleSignOut,
  } = useRegisterType();

  useEffect(() => {
    if (!redirectHref) {
      return;
    }

    router.replace(redirectHref);
  }, [redirectHref, router]);

  if (redirectHref) {
    return <RedirectScreen />;
  }

  if (step === "owner") {
    return <OwnerRegistrationPageClient onExit={handleOwnerExit} />;
  }

  if (step === "employee-email") {
    return (
      <RegisterEmployeeEmail
        emailRegister={emailRegister}
        emailError={emailError}
        error={error}
        submitting={submitting}
        onSubmit={handleEmployeeEmailSubmit}
        onBack={handleBack}
      />
    );
  }

  return (
    <RegisterTypePicker
      onPickOwner={handlePickOwner}
      onPickEmployee={handlePickEmployee}
      onSignOut={handleSignOut}
      showExit={showExit}
    />
  );
}
