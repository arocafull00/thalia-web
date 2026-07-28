import { LoaderRedirectCheckBadge } from "@/components/loader/components/loader-redirect-check-badge";
import { LoaderRedirectVisual } from "@/components/loader/components/loader-redirect-visual";
import { LoaderScreenShell } from "@/components/loader/loader-screen-shell";
import { LOADER_COPY } from "@/copy/loader-copy";

export function RedirectScreen() {
  const { eyebrow, title, description, footer } = LOADER_COPY.redirect;

  return (
    <LoaderScreenShell footer={footer}>
      <LoaderRedirectVisual />
      <div className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.12em] text-primary uppercase">
        <span className="loader-motion size-1.5 rounded-full bg-primary animate-boot-pulse" />
        {eyebrow}
      </div>
      <h1 className="max-w-[520px] text-[clamp(2.125rem,5vw,3rem)] leading-[1.04] font-semibold tracking-[-0.055em] text-ink">
        {title}
      </h1>
      <p className="mt-4 max-w-[430px] text-base leading-relaxed text-ink-secondary">
        {description}
      </p>
      <LoaderRedirectCheckBadge />
    </LoaderScreenShell>
  );
}
