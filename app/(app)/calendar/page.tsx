import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import CalendarPageClient from "@/components/calendar/calendar-page-client";
import { getClinicById } from "@/dal/clinics.server.dal";
import { employeesServerQuery } from "@/lib/query/employees-server-query";
import { getQueryClient } from "@/lib/query/query-client";
import { getAppBootstrap } from "@/lib/server/bootstrap";

export default async function CalendarPage() {
  const bootstrap = await getAppBootstrap();
  const clinicId = bootstrap.activeClinicId;

  if (!bootstrap.user || !clinicId) {
    return <CalendarPageClient />;
  }

  const scope = { userId: bootstrap.user.id, clinicId };
  const queryClient = getQueryClient();
  const [clinic] = await Promise.all([
    getClinicById(clinicId),
    queryClient.fetchQuery(employeesServerQuery(scope)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CalendarPageClient initialClinic={clinic} />
    </HydrationBoundary>
  );
}
