import { cookies } from "next/headers";

import AppLayoutClient from "@/components/providers/app-layout-client";
import StoreHydrator from "@/components/providers/store-hydrator";
import { getAppBootstrap } from "@/lib/server/bootstrap";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ user, profile, memberships, activeClinicId }, cookieStore] =
    await Promise.all([getAppBootstrap(), cookies()]);

  // `SidebarProvider` guarda aquí si el sidebar quedó colapsado, pero no lee la
  // cookie por su cuenta. Resolverlo en servidor evita que el primer render
  // salga expandido y dé un salto al hidratar.
  const defaultSidebarOpen =
    cookieStore.get("sidebar_state")?.value !== "false";

  return (
    <StoreHydrator
      user={user}
      profile={profile}
      memberships={memberships}
      activeClinicId={activeClinicId}
    >
      <AppLayoutClient defaultSidebarOpen={defaultSidebarOpen}>
        {children}
      </AppLayoutClient>
    </StoreHydrator>
  );
}
