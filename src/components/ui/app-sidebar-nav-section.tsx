"use client";

import AppSidebarNavItem from "@/components/ui/app-sidebar-nav-item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { AppNavSection } from "@/lib/hooks/use-app-nav-items";
import { cn } from "@/lib/utils";

type AppSidebarNavSectionProps = {
  section: AppNavSection;
  pathname: string;
  onNavigate: () => void;
};

export default function AppSidebarNavSection({
  section,
  pathname,
  onNavigate,
}: AppSidebarNavSectionProps) {
  if (section.items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel
        className={cn(
          "h-auto px-2.5 pb-1.5 pt-3.5 text-[9.5px] font-medium uppercase tracking-[0.17em] text-ink-muted",
        )}
      >
        {section.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {section.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <AppSidebarNavItem
                key={item.href}
                item={item}
                active={active}
                pathname={pathname}
                onNavigate={onNavigate}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
