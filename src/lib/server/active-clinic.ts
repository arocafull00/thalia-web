import "server-only";

import { getActiveClinicBootstrap } from "@/lib/server/bootstrap";

export async function getServerActiveClinicId(): Promise<string | null> {
  const { activeClinicId } = await getActiveClinicBootstrap();
  return activeClinicId;
}

export async function getServerActiveClinicTimezone(): Promise<string | null> {
  const { activeClinicTimezone } = await getActiveClinicBootstrap();
  return activeClinicTimezone;
}
