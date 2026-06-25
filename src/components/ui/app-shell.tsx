"use client";

import type { ReactNode } from "react";

import AppSidebar from "@/components/ui/app-sidebar";
import AppTopbar from "@/components/ui/app-topbar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <AppSidebar />
      <div className="ml-[280px] flex min-h-screen flex-col">
        <AppTopbar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
