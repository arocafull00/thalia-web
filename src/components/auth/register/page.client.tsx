"use client";

import RegisterEmployeeEmail from "@/components/auth/register/components/register-employee-email";
import RegisterTypePicker from "@/components/auth/register/components/register-type-picker";
import OwnerRegistrationPageClient from "@/components/auth/register/owner-registration-page.client";
import { useRegisterType } from "@/lib/hooks/use-register-type";

export default function RegisterPageClient() {
  const {
    step,
    emailRegister,
    emailError,
    error,
    submitting,
    handlePickOwner,
    handlePickEmployee,
    handleBack,
    handleEmployeeEmailSubmit,
    handleOwnerExit,
    handleSignOut,
  } = useRegisterType();

  if (step === "owner") {
    return <OwnerRegistrationPageClient onExit={handleOwnerExit} />;
  }

  return (
    <section className="flex min-h-screen flex-1 flex-col bg-surface">
      <div className="flex flex-1 items-center justify-center px-6 py-10 lg:px-8">
        <div className="w-full max-w-110">
          {step === "employee-email" ? (
            <RegisterEmployeeEmail
              emailRegister={emailRegister}
              emailError={emailError}
              error={error}
              submitting={submitting}
              onSubmit={handleEmployeeEmailSubmit}
              onBack={handleBack}
            />
          ) : (
            <RegisterTypePicker
              onPickOwner={handlePickOwner}
              onPickEmployee={handlePickEmployee}
              onSignOut={handleSignOut}
            />
          )}
        </div>
      </div>
    </section>
  );
}
