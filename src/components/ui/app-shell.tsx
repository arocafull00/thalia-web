"use client";

import type { ReactNode } from "react";

import AppSidebar from "@/components/ui/app-sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-canvas">
      <AppSidebar />
      <div className="ml-[280px] flex min-h-screen flex-col">
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
