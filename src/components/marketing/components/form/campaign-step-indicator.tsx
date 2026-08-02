import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { CAMPAIGN_STEPS } from "@/lib/hooks/use-campaign-create-dialog";

const { steps } = MARKETING_COPY.createDialog;

type CampaignStepIndicatorProps = {
  stepIndex: number;
};

export default function CampaignStepIndicator({
  stepIndex,
}: CampaignStepIndicatorProps) {
  return (
    <div className="space-y-2" data-testid="campaign-step-indicator">
      <p className="text-xs text-ink-muted">
        {steps.progress(stepIndex + 1, CAMPAIGN_STEPS.length)} ·{" "}
        {steps[CAMPAIGN_STEPS[stepIndex]]}
      </p>
      <div className="flex gap-1.5" aria-hidden="true">
        {CAMPAIGN_STEPS.map((step, index) => (
          <span
            key={step}
            className={`h-1 flex-1 rounded-full ${
              index <= stepIndex ? "bg-primary" : "bg-border-subtle"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
