"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import AppSidebarNavPending from "@/components/ui/app-sidebar-nav-pending";
import AppSidebarNavSubmenu from "@/components/ui/app-sidebar-nav-submenu";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { AppNavItem } from "@/lib/hooks/use-app-nav-items";
import { cn } from "@/lib/utils";

type AppSidebarNavItemProps = {
  item: AppNavItem;
  active: boolean;
  pathname: string;
  onNavigate: () => void;
};

export default function AppSidebarNavItem({
  item,
  active,
  pathname,
  onNavigate,
}: AppSidebarNavItemProps) {
  const hasSubmenu = Boolean(item.subItems?.length);
  const [submenuOpenOverride, setSubmenuOpenOverride] = useState<
    boolean | null
  >(null);
  const submenuOpen = submenuOpenOverride ?? active;

  const buttonClassName = cn(
    "h-9 rounded-button px-[11px] text-[14px] font-normal transition-colors",
    "[&_svg]:size-[18px] [&_svg]:stroke-[1.6]",
    "text-ink-secondary hover:bg-(--hover-overlay) hover:text-primary-hover",
    "data-active:bg-[image:var(--gradient-primary)] data-active:font-medium data-active:text-on-primary data-active:shadow-nav-active data-active:hover:text-on-primary data-active:[&_svg]:text-on-primary",
  );

  if (hasSubmenu && item.subItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          type="button"
          isActive={active}
          size="default"
          aria-expanded={submenuOpen}
          className={buttonClassName}
          onClick={() => setSubmenuOpenOverride(!submenuOpen)}
        >
          {item.icon}
          <span>{item.label}</span>
          <ChevronRight
            aria-hidden="true"
            className={cn(
              "ml-auto transition-transform",
              submenuOpen && "rotate-90",
            )}
          />
        </SidebarMenuButton>
        {submenuOpen ? (
          <AppSidebarNavSubmenu
            items={item.subItems}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        size="default"
        className={buttonClassName}
      >
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          {item.icon}
          <span>{item.label}</span>
          <AppSidebarNavPending />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
