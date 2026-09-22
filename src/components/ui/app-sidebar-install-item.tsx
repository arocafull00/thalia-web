"use client";

import { Download } from "lucide-react";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { PWA_INSTALL_COPY } from "@/copy/pwa-install-copy";
import { cn } from "@/lib/utils";

type AppSidebarInstallItemProps = {
  onClick: () => void;
};

export default function AppSidebarInstallItem({
  onClick,
}: AppSidebarInstallItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        type="button"
        size="default"
        tooltip={PWA_INSTALL_COPY.installButton}
        data-testid="pwa-install-sidebar"
        className={cn(
          "h-9 rounded-button px-[11px] text-[14px] font-normal transition-colors",
          "[&_svg]:size-[18px] [&_svg]:stroke-[1.6]",
          "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0!",
          "text-ink-secondary hover:bg-(--hover-overlay) hover:text-primary-hover",
        )}
        onClick={onClick}
      >
        <Download size={18} strokeWidth={1.5} />
        <span
          className={cn(
            "overflow-hidden whitespace-nowrap transition-[opacity,width]",
            "duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)]",
            "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0",
          )}
        >
          {PWA_INSTALL_COPY.installButton}
        </span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
