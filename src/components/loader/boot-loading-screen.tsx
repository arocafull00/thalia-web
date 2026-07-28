import { LoaderOrbitalVisual } from "@/components/loader/components/loader-orbital-visual";
import { LoaderStatusList } from "@/components/loader/components/loader-status-list";
import { useBootLoadingPhase } from "@/components/loader/hooks/use-boot-loading-phase";
import { LoaderScreenShell } from "@/components/loader/loader-screen-shell";
import { LOADER_COPY } from "@/copy/loader-copy";

type BootLoadingScreenProps = {
  authLoading: boolean;
  clinicLoading: boolean;
};

export function BootLoadingScreen({
  authLoading,
  clinicLoading,
}: BootLoadingScreenProps) {
  const { activeStepIndex, progressValue } = useBootLoadingPhase({
    authLoading,
    clinicLoading,
  });
  const { eyebrow, title, description, footer } = LOADER_COPY.boot;

  return (
    <LoaderScreenShell footer={footer}>
      <LoaderOrbitalVisual />
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
      <LoaderStatusList
        activeStepIndex={activeStepIndex}
        progressValue={progressValue}
      />
    </LoaderScreenShell>
  );
}
