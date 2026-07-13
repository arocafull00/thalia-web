import { Button } from "@/components/ui/button";
import type { ProfileAction } from "@/components/ui/profile/profile-action";

const secondaryActionClassName = "text-ink-secondary hover:text-ink";

export function TopbarSecondaryAction({ action }: { action: ProfileAction }) {
  const Icon = action.icon;
  const variant = action.variant === "danger" ? "destructive" : "outline";
  const className =
    action.variant === "danger" ? undefined : secondaryActionClassName;

  if (action.href) {
    return (
      <Button variant={variant} size="sm" asChild className={className}>
        <a href={action.href}>
          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
          {action.label}
        </a>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="sm"
      onClick={action.onClick}
      className={className}
    >
      <Icon className="size-3.5 shrink-0" aria-hidden="true" />
      {action.label}
    </Button>
  );
}
