import Link from "next/link";

import { ContextMenuItem } from "@/components/ui/context-menu";
import type { ProfileAction } from "@/components/ui/profile/profile-action";

export default function ProfileActionContextMenuItem({
  action,
}: {
  action: ProfileAction;
}) {
  const Icon = action.icon;
  const variant = action.variant === "danger" ? "destructive" : "default";

  if (action.href) {
    return (
      <ContextMenuItem
        variant={variant}
        disabled={action.disabled}
        data-testid={action.testId}
        asChild
      >
        <Link href={action.href} prefetch={action.prefetch}>
          <Icon aria-hidden="true" />
          {action.label}
        </Link>
      </ContextMenuItem>
    );
  }

  return (
    <ContextMenuItem
      variant={variant}
      disabled={action.disabled}
      data-testid={action.testId}
      onClick={action.onClick}
    >
      <Icon aria-hidden="true" />
      {action.label}
    </ContextMenuItem>
  );
}
