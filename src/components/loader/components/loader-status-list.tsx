import { LoaderProgressBar } from "@/components/loader/components/loader-progress-bar";
import { LoaderStatusRow } from "@/components/loader/components/loader-status-row";
import { LOADER_COPY } from "@/copy/loader-copy";

type LoaderStatusListProps = {
  activeStepIndex: number;
  progressValue: number;
};

export function LoaderStatusList({
  activeStepIndex,
  progressValue,
}: LoaderStatusListProps) {
  const { steps, tags, progressLabel } = LOADER_COPY.boot;

  return (
    <div
      className="mt-8 w-full max-w-[400px] border-t border-border-subtle pt-5"
      aria-label="Progreso de carga"
    >
      {steps.map((step, index) => {
        const state =
          index < activeStepIndex
            ? "done"
            : index === activeStepIndex
              ? "current"
              : "pending";

        const tag =
          state === "done"
            ? tags.done
            : state === "current"
              ? tags.current
              : tags.pending;

        return (
          <LoaderStatusRow
            key={step.label}
            label={step.label}
            tag={tag}
            state={state}
          />
        );
      })}
      <LoaderProgressBar
        ariaLabel={progressLabel}
        progressValue={progressValue}
      />
    </div>
  );
}
