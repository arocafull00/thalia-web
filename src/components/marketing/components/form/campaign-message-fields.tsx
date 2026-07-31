import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppDialogError from "@/components/ui/app-dialog-error";
import type { CampaignFormValues } from "@/lib/hooks/use-campaign-create-dialog";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const { fields, sections } = MARKETING_COPY.createDialog;

type CampaignMessageFieldsProps = {
  register: UseFormRegister<CampaignFormValues>;
  errors: FieldErrors<CampaignFormValues>;
};

export default function CampaignMessageFields({
  register,
  errors,
}: CampaignMessageFieldsProps) {
  return (
    <div className="space-y-4">
      <AppDialogError message={errors.root?.message} />
      <h3 className="text-sm font-medium text-ink">{sections.message}</h3>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {fields.title}{" "}
          <span className="text-danger">{fields.requiredMark}</span>
        </span>
        <input
          {...register("title")}
          placeholder={fields.titlePlaceholder}
          className={inputClassName}
        />
        {errors.title ? (
          <span className="text-sm text-danger">{errors.title.message}</span>
        ) : null}
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {fields.content}{" "}
          <span className="text-danger">{fields.requiredMark}</span>
        </span>
        <textarea
          {...register("content")}
          rows={5}
          placeholder={fields.contentPlaceholder}
          className={inputClassName}
        />
        {errors.content ? (
          <span className="text-sm text-danger">{errors.content.message}</span>
        ) : null}
      </label>
      <h3 className="pt-2 text-sm font-medium text-ink">{sections.footer}</h3>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">{fields.footerText}</span>
        <input {...register("footer_text")} className={inputClassName} />
        {errors.footer_text ? (
          <span className="text-sm text-danger">
            {errors.footer_text.message}
          </span>
        ) : null}
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {fields.footerWebsite}
          </span>
          <input {...register("footer_website")} className={inputClassName} />
          {errors.footer_website ? (
            <span className="text-sm text-danger">
              {errors.footer_website.message}
            </span>
          ) : null}
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">
            {fields.footerPhone}
          </span>
          <input {...register("footer_phone")} className={inputClassName} />
          {errors.footer_phone ? (
            <span className="text-sm text-danger">
              {errors.footer_phone.message}
            </span>
          ) : null}
        </label>
      </div>
    </div>
  );
}
