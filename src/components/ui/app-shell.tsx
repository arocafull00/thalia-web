"use client";

import type { ReactNode } from "react";

import AppBottomNav from "@/components/ui/app-bottom-nav";
import AppSidebar from "@/components/ui/app-sidebar";
import AppTopbar from "@/components/ui/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden bg-canvas">
        <AppTopbar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[calc(4rem+var(--safe-area-bottom))] lg:pb-0">
          {children}
        </div>
      </SidebarInset>
      <AppBottomNav />
    </SidebarProvider>
  );
}
