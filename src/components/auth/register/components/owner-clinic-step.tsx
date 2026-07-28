import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import type { OwnerRegistrationFormValues } from "@/lib/schemas/register-schema";

type Props = {
  errors: FieldErrors<OwnerRegistrationFormValues>;
  register: UseFormRegister<OwnerRegistrationFormValues>;
};

export default function OwnerClinicStep({ errors, register }: Props) {
  const copy = REGISTER_OWNER_COPY.clinic;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-medium text-ink">{copy.title}</h1>
        <p className="mt-1 max-w-[60ch] text-sm text-ink-secondary">
          {copy.subtitle}
        </p>
      </div>
      <div className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-medium text-ink-secondary">
            {copy.nameLabel}
          </span>
          <Input
            {...register("clinicName")}
            autoFocus
            placeholder={copy.namePlaceholder}
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
            {copy.addressLabel}
            <span className="font-normal text-ink-muted">
              {copy.optionalLabel}
            </span>
          </span>
          <Input
            {...register("address")}
            autoComplete="street-address"
            placeholder={copy.addressPlaceholder}
            className="h-10"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="flex items-center justify-between gap-3 text-xs font-medium text-ink-secondary">
            {copy.phoneLabel}
            <span className="font-normal text-ink-muted">
              {copy.optionalLabel}
            </span>
          </span>
          <Input
            {...register("clinicPhone")}
            type="tel"
            autoComplete="tel"
            placeholder={copy.phonePlaceholder}
            className="h-10"
          />
        </label>
      </div>
    </div>
  );
}
