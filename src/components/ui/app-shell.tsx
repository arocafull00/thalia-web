"use client";

import type { ReactNode } from "react";

import AppBackdrop from "@/components/ui/app-backdrop";
import AppBottomNav from "@/components/ui/app-bottom-nav";
import AppSidebar from "@/components/ui/app-sidebar";
import AppTopbar from "@/components/ui/app-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type AppShellProps = {
  children: ReactNode;
  /**
   * Estado inicial del sidebar, leído de la cookie en el Server Component.
   *
   * `SidebarProvider` escribe la cookie al colapsar pero no la lee: si no se
   * le pasa este valor, recargar siempre devuelve el sidebar a expandido.
   * Tiene que resolverse en servidor para que el primer render ya salga con el
   * ancho correcto y no haya salto.
   */
  defaultSidebarOpen?: boolean;
};

export default function AppShell({
  children,
  defaultSidebarOpen = true,
}: AppShellProps) {
  return (
    <SidebarProvider
      defaultOpen={defaultSidebarOpen}
      className="relative h-svh min-h-0 overflow-hidden"
    >
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
