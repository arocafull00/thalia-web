import { Check } from "lucide-react";

export function LoaderRedirectCheckBadge() {
  return (
    <span
      className="loader-motion mt-7 inline-grid size-[30px] place-items-center rounded-full bg-success-subtle text-success-text animate-boot-reveal-check"
      aria-hidden="true"
    >
      <Check className="size-[17px]" strokeWidth={2} />
    </span>
  );
}
