"use client";

import Link from "next/link";

import AppSidebarNavPending from "@/components/ui/app-sidebar-nav-pending";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { AppNavItem } from "@/lib/hooks/use-app-nav-items";
import { cn } from "@/lib/utils";

type AppSidebarNavItemProps = {
  item: AppNavItem;
  active: boolean;
  onNavigate: () => void;
};

export default function AppSidebarNavItem({
  item,
  active,
  onNavigate,
}: AppSidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        size="default"
        className={cn(
          "h-10 rounded-xl px-3 text-[14px] font-medium transition-colors",
          "[&_svg]:size-[18px] [&_svg]:stroke-[1.75]",
          "text-ink-secondary hover:bg-primary-subtle hover:text-primary",
          "data-active:bg-primary data-active:font-semibold data-active:text-on-primary data-active:hover:bg-primary-hover data-active:hover:text-on-primary data-active:[&_svg]:text-on-primary",
        )}
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
