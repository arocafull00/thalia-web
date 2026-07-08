import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";

import ProfileColorField from "@/components/settings/components/profile-color-field";
import { PROFILE_EDIT_COPY } from "@/copy/profile-edit-copy";
import type { ProfileEditFormValues } from "@/lib/hooks/use-profile-edit-dialog";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type ProfileEditFormProps = {
  register: UseFormRegister<ProfileEditFormValues>;
  control: Control<ProfileEditFormValues>;
  errors: FieldErrors<ProfileEditFormValues>;
};

export default function ProfileEditForm({
  register,
  control,
  errors,
}: ProfileEditFormProps) {
  return (
    <div className="mt-4 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {PROFILE_EDIT_COPY.fields.fullName}{" "}
          <span className="text-danger">
            {PROFILE_EDIT_COPY.fields.requiredMark}
          </span>
        </span>
        <input {...register("full_name")} className={inputClassName} />
        {errors.full_name ? (
          <span className="text-sm text-danger">
            {errors.full_name.message}
          </span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PROFILE_EDIT_COPY.fields.specialty}
          </span>
          <input {...register("specialty")} className={inputClassName} />
          {errors.specialty ? (
            <span className="text-sm text-danger">
              {errors.specialty.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {PROFILE_EDIT_COPY.fields.phone}
          </span>
          <input {...register("phone")} type="tel" className={inputClassName} />
          {errors.phone ? (
            <span className="text-sm text-danger">{errors.phone.message}</span>
          ) : null}
        </label>
      </div>
      <ProfileColorField control={control} />
    </div>
  );
}
