"use client";

import { ArrowLeft, ArrowRight, Building2 } from "lucide-react";

import OwnerAccountStep from "@/components/auth/register/components/owner-account-step";
import OwnerClinicStep from "@/components/auth/register/components/owner-clinic-step";
import OwnerConfirmationStep from "@/components/auth/register/components/owner-confirmation-step";
import OwnerRegistrationProgress from "@/components/auth/register/components/owner-registration-progress";
import { useOwnerRegistration } from "@/components/auth/register/hooks/use-owner-registration";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";

type Props = {
  onExit: () => void;
};

export default function OwnerRegistrationPageClient({ onExit }: Props) {
  const {
    disabled,
    errors,
    hasSession,
    isSupabaseConfigured,
    onBack,
    onNext,
    onSubmit,
    register,
    setStep,
    step,
    submitting,
    values,
  } = useOwnerRegistration();

  const handleBack = () => {
    if (step === 1) {
      onExit();
      return;
    }

    onBack();
  };

  return (
    <section className="flex min-h-screen flex-1 flex-col items-center justify-center bg-surface px-5 py-8 sm:px-8">
      <form
        className="w-full max-w-[520px]"
        onSubmit={(event) => {
          event.preventDefault();

          if (step === 3) {
            void onSubmit();
            return;
          }

          void onNext();
        }}
      >
        <OwnerRegistrationProgress currentStep={step} />
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          {step === 1 ? (
            <OwnerAccountStep
              errors={errors}
              hasSession={hasSession}
              register={register}
            />
          ) : null}
          {step === 2 ? (
            <OwnerClinicStep errors={errors} register={register} />
          ) : null}
          {step === 3 ? (
            <OwnerConfirmationStep
              values={values}
              onEditAccount={() => setStep(1)}
              onEditClinic={() => setStep(2)}
            />
          ) : null}
          {!isSupabaseConfigured ? (
            <div className="mt-5">
              <Notice
                tone="warning"
                message={REGISTER_OWNER_COPY.configurationWarning}
              />
            </div>
          ) : null}
          {errors.root?.message ? (
            <div className="mt-5">
              <Notice tone="danger" message={errors.root.message} />
            </div>
          ) : null}
          <div className="mt-7 flex items-center justify-between gap-3 border-t border-border-subtle pt-5">
            <Button
              type="button"
              variant="ghost"
              disabled={submitting}
              onClick={handleBack}
            >
              <ArrowLeft aria-hidden="true" />
              {REGISTER_OWNER_COPY.actions.back}
            </Button>
            {step === 3 ? (
              <ActionButton
                title={
                  submitting
                    ? REGISTER_OWNER_COPY.actions.creating
                    : REGISTER_OWNER_COPY.actions.create
                }
                icon={Building2}
                disabled={disabled}
                onClick={onSubmit}
              />
            ) : (
              <ActionButton
                title={REGISTER_OWNER_COPY.actions.continue}
                icon={ArrowRight}
                disabled={disabled}
                onClick={() => void onNext()}
              />
            )}
          </div>
        </div>
      </form>
    </section>
  );
}
