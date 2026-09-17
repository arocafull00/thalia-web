import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import { cn } from "@/lib/utils";

type Props = {
  currentStep: number;
};

export default function OwnerRegistrationProgress({ currentStep }: Props) {
  return (
    <nav aria-label="Progreso del registro">
      <ol className="mx-auto grid max-w-48 grid-cols-3">
        {REGISTER_OWNER_COPY.steps.map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <li
              key={step.title}
              className="relative flex items-center justify-center"
              aria-current={active ? "step" : undefined}
              aria-label={`${stepNumber}. ${step.title}: ${step.description}`}
            >
              {index > 0 ? (
                <span
                  className={cn(
                    "absolute top-1/2 right-1/2 h-px w-full bg-border-subtle",
                    completed || active ? "bg-primary" : null,
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-7 items-center justify-center rounded-full border bg-surface text-xs font-medium transition-colors",
                  completed
                    ? "border-primary bg-primary text-on-primary"
                    : active
                      ? "border-primary text-primary ring-2 ring-primary-subtle"
                      : "border-border text-ink-muted",
                )}
              >
                {stepNumber}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
