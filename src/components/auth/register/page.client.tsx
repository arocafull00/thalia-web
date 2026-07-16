"use client";

import RegisterEmployeeEmail from "@/components/auth/register/components/register-employee-email";
import RegisterTypePicker from "@/components/auth/register/components/register-type-picker";
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
    handleSignOut,
  } = useRegisterType();

  return (
    <section className="flex min-h-screen flex-1 flex-col items-center justify-center bg-surface px-6 py-10">
      <div className="w-full max-w-[440px]">
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
    </section>
  );
}
