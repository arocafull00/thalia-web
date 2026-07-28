import { Check } from "lucide-react";

import { REGISTER_OWNER_COPY } from "@/copy/register-owner-copy";
import { cn } from "@/lib/utils";

type Props = {
  currentStep: number;
};

export default function OwnerRegistrationProgress({ currentStep }: Props) {
  return (
    <nav aria-label="Progreso del registro">
      <ol className="grid grid-cols-3">
        {REGISTER_OWNER_COPY.steps.map((step, index) => {
          const stepNumber = index + 1;
          const completed = stepNumber < currentStep;
          const active = stepNumber === currentStep;

          return (
            <li
              key={step.title}
              className="relative flex flex-col items-center text-center"
              aria-current={active ? "step" : undefined}
            >
              {index > 0 ? (
                <span
                  className={cn(
                    "absolute top-4 right-1/2 h-px w-full bg-border-subtle",
                    completed || active ? "bg-primary" : null,
                  )}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={cn(
                  "relative z-10 flex size-8 items-center justify-center rounded-full border bg-surface text-xs font-medium transition-colors",
                  completed
                    ? "border-primary bg-primary text-on-primary"
                    : active
                      ? "border-primary text-primary ring-4 ring-primary-subtle/50"
                      : "border-border text-ink-muted",
                )}
              >
                {completed ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : (
                  stepNumber
                )}
              </span>
              <span
                className={cn(
                  "mt-2 text-xs font-medium",
                  active ? "text-ink" : "text-ink-secondary",
                )}
              >
                {step.title}
              </span>
              <span className="mt-0.5 hidden text-xs text-ink-muted sm:block">
                {step.description}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
