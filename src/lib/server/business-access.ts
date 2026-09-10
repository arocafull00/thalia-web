import "server-only";

import { redirect } from "next/navigation";

import { getAppBootstrap } from "@/lib/server/bootstrap";

export async function requireBusinessOwner() {
  const bootstrap = await getAppBootstrap();
  const membership = bootstrap.memberships.find(
    (item) => item.clinicId === bootstrap.activeClinicId,
  );

  if (membership?.role !== "owner") {
    redirect("/dashboard");
  }
}
