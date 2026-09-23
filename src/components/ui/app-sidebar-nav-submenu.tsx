"use client";

import Link from "next/link";

import AppSidebarNavPending from "@/components/ui/app-sidebar-nav-pending";
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { AppNavSubItem } from "@/lib/hooks/use-app-nav-items";

type AppSidebarNavSubmenuProps = {
  items: AppNavSubItem[];
  pathname: string;
  onNavigate: () => void;
};

export default function AppSidebarNavSubmenu({
  items,
  pathname,
  onNavigate,
}: AppSidebarNavSubmenuProps) {
  return (
    <SidebarMenuSub className="mt-1 border-border-subtle">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <SidebarMenuSubItem key={item.href}>
            <SidebarMenuSubButton
              asChild
              isActive={active}
              className="h-9 rounded-lg text-ink-secondary hover:bg-primary-subtle hover:text-primary data-active:bg-primary-subtle data-active:font-medium data-active:text-primary"
            >
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={onNavigate}
              >
                <span>{item.label}</span>
                <AppSidebarNavPending />
              </Link>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        );
      })}
    </SidebarMenuSub>
  );
}
