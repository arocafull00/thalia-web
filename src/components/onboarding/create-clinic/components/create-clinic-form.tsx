import { ArrowLeft, Building2, LogOut } from "lucide-react";
import Link from "next/link";
import type { FieldErrors, UseFormRegister } from "react-hook-form";

import OwnerRegistrationProgress from "@/components/auth/register/components/owner-registration-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { Notice } from "@/components/ui/primitives/notice";
import { CREATE_CLINIC_COPY } from "@/copy/create-clinic-copy";
import { LOGIN_COPY } from "@/copy/login-copy";
import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import type { CreateClinicFormValues } from "@/lib/schemas/register-schema";

type Props = {
  disabled: boolean;
  errors: FieldErrors<CreateClinicFormValues>;
  isSupabaseConfigured: boolean;
  onSignOut: () => Promise<void>;
  onSubmit: () => void;
  register: UseFormRegister<CreateClinicFormValues>;
  submitting: boolean;
};

export default function CreateClinicForm({
  disabled,
  errors,
  isSupabaseConfigured,
  onSignOut,
  onSubmit,
  register,
  submitting,
}: Props) {
  return (
    <section className="flex min-h-screen flex-1 flex-col bg-canvas">
      <div className="flex flex-1 flex-col px-6 py-8 lg:px-12 lg:py-10">
        <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col">
          <OwnerRegistrationProgress currentStep={2} />

          <form
            className="mt-10 flex flex-1 flex-col justify-center"
            onSubmit={(event) => {
              event.preventDefault();
              void onSubmit();
            }}
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-balance text-2xl font-medium text-ink">
                  {CREATE_CLINIC_COPY.title}
                </h1>
                <p className="max-w-[60ch] text-pretty text-sm text-ink-secondary">
                  {CREATE_CLINIC_COPY.subtitle}
                </p>
              </div>

              <div className="space-y-5">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-ink-secondary">
                    {CREATE_CLINIC_COPY.nameLabel}
                  </span>
                  <Input
                    {...register("clinicName")}
                    autoFocus
                    placeholder={CREATE_CLINIC_COPY.namePlaceholder}
                    aria-invalid={Boolean(errors.clinicName)}
                    className="h-10"
                  />
                  {errors.clinicName ? (
                    <span className="text-sm text-danger">
                      {errors.clinicName.message}
                    </span>
                  ) : null}
                </label>

                <label className="block space-y-1.5">
                  <span className="flex items-center justify-between gap-3 text-xs font-medium text-ink-secondary">
                    {CREATE_CLINIC_COPY.addressLabel}
                    <span className="font-normal text-ink-muted">
                      {CREATE_CLINIC_COPY.optionalLabel}
                    </span>
                  </span>
                  <Input
                    {...register("address")}
                    autoComplete="street-address"
                    placeholder={CREATE_CLINIC_COPY.addressPlaceholder}
                    className="h-10"
                  />
                </label>

                <label className="block space-y-1.5">
                  <span className="flex items-center justify-between gap-3 text-xs font-medium text-ink-secondary">
                    {CREATE_CLINIC_COPY.phoneLabel}
                    <span className="font-normal text-ink-muted">
                      {CREATE_CLINIC_COPY.optionalLabel}
                    </span>
                  </span>
                  <Input
                    {...register("clinicPhone")}
                    type="tel"
                    autoComplete="tel"
                    placeholder={CREATE_CLINIC_COPY.phonePlaceholder}
                    className="h-10"
                  />
                </label>
              </div>

              {!isSupabaseConfigured ? (
                <Notice
                  tone="warning"
                  message={REGISTER_OWNER_COPY.configurationWarning}
                />
              ) : null}
              {errors.root?.message ? (
                <Notice tone="danger" message={errors.root.message} />
              ) : null}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3 border-t border-border-subtle pt-6">
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => void onSignOut()}
                className="gap-1.5"
              >
                <LogOut className="size-4" aria-hidden="true" />
                {CREATE_CLINIC_COPY.actions.signOut}
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  disabled={disabled}
                  asChild
                >
                  <Link href="/register-employee">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    {CREATE_CLINIC_COPY.actions.back}
                  </Link>
                </Button>
                <ActionButton
                  title={
                    submitting
                      ? CREATE_CLINIC_COPY.actions.creating
                      : CREATE_CLINIC_COPY.actions.continue
                  }
                  icon={Building2}
                  disabled={disabled}
                  onClick={onSubmit}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <footer className="border-t border-border-subtle px-6 py-4 text-xs text-ink-muted lg:px-12">
        <span>{LOGIN_COPY.footer.copyright}</span>
      </footer>
    </section>
  );
}
