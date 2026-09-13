import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import SettingsLayoutClient from "@/components/settings/settings-layout-client";
import { getClinicById } from "@/dal/clinics.server.dal";
import { employeesServerQuery } from "@/lib/query/employees-server-query";
import { getQueryClient } from "@/lib/query/query-client";
import { getAppBootstrap } from "@/lib/server/bootstrap";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const bootstrap = await getAppBootstrap();
  const clinicId = bootstrap.activeClinicId;

  if (!bootstrap.user || !clinicId) {
    return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
  }

  const scope = { userId: bootstrap.user.id, clinicId };
  const queryClient = getQueryClient();
  const [clinic] = await Promise.all([
    getClinicById(clinicId),
    queryClient.fetchQuery(employeesServerQuery(scope)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsLayoutClient initialClinic={clinic}>
        {children}
      </SettingsLayoutClient>
    </HydrationBoundary>
  );
}
