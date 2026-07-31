import type { FieldErrors, UseFormRegister } from "react-hook-form";

import CampaignImageField from "@/components/marketing/components/form/campaign-image-field";
import CampaignMessageFields from "@/components/marketing/components/form/campaign-message-fields";
import CampaignMessagePreview from "@/components/marketing/components/form/campaign-message-preview";
import CampaignRecipientsPreview from "@/components/marketing/components/form/campaign-recipients-preview";
import CampaignSegmentFields, {
  type TreatmentOption,
} from "@/components/marketing/components/form/campaign-segment-fields";
import type {
  CampaignFormValues,
  CampaignSegmentInputs,
} from "@/lib/hooks/use-campaign-create-dialog";

type CampaignCreateFormProps = {
  register: UseFormRegister<CampaignFormValues>;
  errors: FieldErrors<CampaignFormValues>;
  segmentInputs: CampaignSegmentInputs;
  treatments: TreatmentOption[];
  onSegmentChange: (field: keyof CampaignSegmentInputs, value: string) => void;
  onImageChange: (file: File | null) => void;
  previewContent: string;
  previewFooterText: string;
  previewFooterWebsite: string;
  previewFooterPhone: string;
  recipientCount: number | null;
  recipientsLoading: boolean;
  recipientsError: boolean;
};

export default function CampaignCreateForm({
  register,
  errors,
  segmentInputs,
  treatments,
  onSegmentChange,
  onImageChange,
  previewContent,
  previewFooterText,
  previewFooterWebsite,
  previewFooterPhone,
  recipientCount,
  recipientsLoading,
  recipientsError,
}: CampaignCreateFormProps) {
  return (
    <div className="mt-4 space-y-6">
      <CampaignMessageFields register={register} errors={errors} />
      <CampaignImageField onFileChange={onImageChange} />
      <CampaignMessagePreview
        content={previewContent}
        footerText={previewFooterText}
        footerWebsite={previewFooterWebsite}
        footerPhone={previewFooterPhone}
      />
      <CampaignSegmentFields
        inputs={segmentInputs}
        treatments={treatments}
        onChange={onSegmentChange}
      />
      <CampaignRecipientsPreview
        count={recipientCount}
        isLoading={recipientsLoading}
        hasError={recipientsError}
      />
    </div>
  );
}
