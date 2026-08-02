import { MARKETING_COPY } from "@/components/marketing/marketing-copy";

const { messagePreview, createDialog } = MARKETING_COPY;

type CampaignMessagePreviewProps = {
  content: string;
  footerText: string;
  footerWebsite: string;
  footerPhone: string;
};

/**
 * Reproduce cómo se verá el mensaje en el móvil del paciente. El pie se monta
 * a partir de los tres campos, separados por puntos, y sólo con los que tengan
 * valor: así el editor ve el resultado real y no una plantilla con huecos.
 *
 * Debe coincidir con buildBody() de supabase/functions/send-campaign/index.ts.
 */
export default function CampaignMessagePreview({
  content,
  footerText,
  footerWebsite,
  footerPhone,
}: CampaignMessagePreviewProps) {
  const footerParts = [
    footerText.trim(),
    footerWebsite.trim()
      ? `${messagePreview.footerWebsiteLabel}: ${footerWebsite.trim()}`
      : "",
    footerPhone.trim()
      ? `${messagePreview.footerPhoneLabel}: ${footerPhone.trim()}`
      : "",
  ].filter((part) => part.length > 0);

  const trimmedContent = content.trim();

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-ink">
        {createDialog.sections.preview}
      </h3>
      <div className="rounded-2xl bg-surface-secondary p-4">
        <div
          data-testid="campaign-message-preview"
          className="max-w-sm rounded-2xl rounded-tl-sm bg-primary-subtle px-4 py-3"
        >
          {trimmedContent ? (
            <p className="whitespace-pre-wrap text-sm text-ink">
              {trimmedContent}
            </p>
          ) : (
            <p className="text-sm italic text-ink-muted">
              {messagePreview.empty}
            </p>
          )}
          {footerParts.length > 0 ? (
            <p className="mt-3 border-t border-border-subtle pt-2 text-xs text-ink-secondary">
              {footerParts.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
