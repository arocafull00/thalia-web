import "server-only";

import { getAppBootstrap } from "@/lib/server/bootstrap";

export async function getServerActiveClinicId(): Promise<string | null> {
  const { activeClinicId } = await getAppBootstrap();
  return activeClinicId;
}

export async function getServerActiveClinicTimezone(): Promise<string | null> {
  const { activeClinicTimezone } = await getAppBootstrap();
  return activeClinicTimezone;
}
