import AppLayoutClient from "@/components/providers/app-layout-client";
import StoreHydrator from "@/components/providers/store-hydrator";
import { getAppBootstrap } from "@/lib/server/bootstrap";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, memberships, activeClinicId } =
    await getAppBootstrap();

  return (
    <StoreHydrator
      user={user}
      profile={profile}
      memberships={memberships}
      activeClinicId={activeClinicId}
    >
      <AppLayoutClient>{children}</AppLayoutClient>
    </StoreHydrator>
  );
}
