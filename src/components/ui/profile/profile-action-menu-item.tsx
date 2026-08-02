import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import type { ProfileAction } from "@/components/ui/profile/profile-action";

export default function ProfileActionMenuItem({
  action,
}: {
  action: ProfileAction;
}) {
  const Icon = action.icon;
  const variant = action.variant === "danger" ? "destructive" : "default";

  if (action.href) {
    return (
      <DropdownMenuItem
        variant={variant}
        disabled={action.disabled}
        data-testid={action.testId}
        asChild
      >
        <a href={action.href}>
          <Icon aria-hidden="true" />
          {action.label}
        </a>
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuItem
      variant={variant}
      disabled={action.disabled}
      data-testid={action.testId}
      onClick={action.onClick}
    >
      <Icon aria-hidden="true" />
      {action.label}
    </DropdownMenuItem>
  );
}
