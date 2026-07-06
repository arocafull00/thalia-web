"use client";

import RegisterEmployeeEmail from "@/components/auth/register/components/register-employee-email";
import RegisterTypePicker from "@/components/auth/register/components/register-type-picker";
import RegisterEmployeeSidebar from "@/components/auth/register-employee/components/register-employee-sidebar";
import { useRegisterType } from "@/lib/hooks/use-register-type";

export default function RegisterPageClient() {
  const {
    step,
    email,
    error,
    submitting,
    setEmail,
    handlePickOwner,
    handlePickEmployee,
    handleBack,
    handleEmployeeEmailSubmit,
    handleSignOut,
  } = useRegisterType();

  return (
    <div className="flex min-h-screen bg-canvas">
      <RegisterEmployeeSidebar
        intent="employee"
        stepTotal={step === "employee-email" ? 2 : 1}
        currentStep={1}
      />
      {step === "employee-email" ? (
        <RegisterEmployeeEmail
          email={email}
          error={error}
          submitting={submitting}
          onEmailChange={setEmail}
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
  );
}
