"use client";

import type { ReactNode } from "react";

import AppBackdrop from "@/components/ui/app-backdrop";
import AppBottomNav from "@/components/ui/app-bottom-nav";
import AppSidebar from "@/components/ui/app-sidebar";
import AppTopbar from "@/components/ui/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider className="relative h-svh min-h-0 overflow-hidden">
      <AppBackdrop />
      <AppSidebar />
      {/* En md+ el hueco izquierdo lo aporta el padding del propio sidebar. */}
      {/* z-20 deja el contenido por encima del sidebar (z-10); la barra inferior es z-30. */}
      <SidebarInset className="z-20 h-svh overflow-hidden bg-transparent p-3.5 md:py-3.5 md:pl-0 md:pr-3.5">
        <AppTopbar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-[calc(4rem+var(--safe-area-bottom))] lg:pb-0">
          {children}
        </div>
      </SidebarInset>
      <AppBottomNav />
    </SidebarProvider>
  );
}
