import { MARKETING_COPY } from "@/components/marketing/marketing-copy";

const { messagePreview, createDialog } = MARKETING_COPY;

type CampaignMessagePreviewProps = {
  content: string;
  footerText: string;
  footerWebsite: string;
  footerPhone: string;
  /** URL efímera de la imagen elegida; null si la campaña no lleva. */
  imageUrl: string | null;
  variant?: "editor" | "detail";
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
  imageUrl,
  variant = "editor",
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
    <div className={variant === "detail" ? "w-full" : "space-y-2"}>
      {variant === "editor" ? (
        <h3 className="text-sm font-medium text-ink">
          {createDialog.sections.preview}
        </h3>
      ) : null}
      {/* Un solo fondo: el contenedor exterior. La burbuja interior tenía el
          suyo propio y se veían dos superficies anidadas. */}
      <div
        className={
          variant === "detail"
            ? "mx-auto max-w-md overflow-hidden rounded-2xl bg-surface-secondary"
            : "rounded-2xl bg-surface-secondary p-4"
        }
      >
        <div data-testid="campaign-message-preview" className="w-full">
          {imageUrl ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={imageUrl}
              alt={messagePreview.imageAlt}
              data-testid={
                variant === "detail"
                  ? "campaign-detail-image"
                  : "campaign-message-preview-image"
              }
              className={
                variant === "detail"
                  ? "block h-auto w-full"
                  : "mb-2 max-h-64 w-full rounded-xl object-contain"
              }
            />
          ) : null}
          <div className={variant === "detail" ? "px-4 pb-4 pt-3" : ""}>
            {trimmedContent ? (
              <p className="whitespace-pre-wrap break-words text-sm text-ink">
                {trimmedContent}
              </p>
            ) : (
              <p className="text-sm italic text-ink-muted">
                {messagePreview.empty}
              </p>
            )}
            {footerParts.length > 0 ? (
              <p
                className={
                  variant === "detail"
                    ? "mt-3 break-words text-xs text-ink-secondary"
                    : "mt-3 border-t border-border-subtle pt-2 text-xs text-ink-secondary"
                }
              >
                {footerParts.join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
