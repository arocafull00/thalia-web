"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import ProfileActionMenuItem from "@/components/ui/profile/profile-action-menu-item";
import { cn } from "@/lib/utils";

type ProfileActionsMenuProps = {
  sections: ProfileActionSection[];
  ariaLabel: string;
  className?: string;
  /** Por defecto los tres puntos horizontales de las filas de tabla. */
  icon?: LucideIcon;
  contentClassName?: string;
};

export default function ProfileActionsMenu({
  sections,
  ariaLabel,
  className,
  icon: Icon = MoreHorizontal,
  contentClassName,
}: ProfileActionsMenuProps) {
  const visibleSections = sections.filter(
    (section) => section.actions.length > 0,
  );

  if (visibleSections.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          className={cn(className)}
        >
          <Icon size={18} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn(contentClassName)}>
        {visibleSections.map((section, sectionIndex) => (
          <div key={`${section.label}-${sectionIndex}`}>
            {sectionIndex > 0 ? <DropdownMenuSeparator /> : null}
            <DropdownMenuLabel>{section.label}</DropdownMenuLabel>
            {section.actions.map((action) => (
              <ProfileActionMenuItem key={action.label} action={action} />
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
