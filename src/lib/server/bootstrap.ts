import "server-only";

import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { cache } from "react";

import {
  getMemberships,
  type ClinicMembershipRow,
} from "@/dal/clinics.server.dal";
import { getEmployee } from "@/dal/employees.server.dal";
import { ACTIVE_CLINIC_COOKIE_NAME } from "@/lib/active-clinic-cookie";
import { createClient } from "@/lib/supabase/server";
import type { ClinicMembershipView } from "@/types/clinic-membership";
import type {
  ClinicMembershipRole,
  ClinicMembershipStatus,
  Employee,
} from "@/types/database.types";

export type AppBootstrap = {
  user: User | null;
  profile: Employee | null;
  memberships: ClinicMembershipView[];
  activeClinicId: string | null;
  activeClinicTimezone: string | null;
};

async function readActiveClinicCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACTIVE_CLINIC_COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  return decodeURIComponent(value);
}

function mapMembershipRow(row: ClinicMembershipRow): ClinicMembershipView {
  const clinicRaw = row.clinics;
  const clinic = Array.isArray(clinicRaw) ? clinicRaw[0] : clinicRaw;

  return {
    id: row.id,
    clinicId: row.clinic_id,
    clinicName: clinic?.name ?? "Clínica",
    clinicLogoUrl: clinic?.logo_url ?? null,
    role: row.role as ClinicMembershipRole,
    status: row.status as ClinicMembershipStatus,
  };
}

export function resolveActiveClinicId(
  cookieClinicId: string | null,
  memberships: ClinicMembershipView[],
  profile: Employee | null,
): string | null {
  if (
    cookieClinicId &&
    memberships.some((membership) => membership.clinicId === cookieClinicId)
  ) {
    return cookieClinicId;
  }

  if (memberships[0]?.clinicId) {
    return memberships[0].clinicId;
  }

  return profile?.clinic_id ?? null;
}

function resolveActiveClinicTimezone(
  activeClinicId: string | null,
  rows: ClinicMembershipRow[],
): string | null {
  if (!activeClinicId) {
    return null;
  }

  const row = rows.find(
    (membership) => membership.clinic_id === activeClinicId,
  );

  if (!row) {
    return null;
  }

  const clinicRaw = row.clinics;
  const clinic = Array.isArray(clinicRaw) ? clinicRaw[0] : clinicRaw;

  return clinic?.timezone ?? null;
}

export const getAppBootstrap = cache(async (): Promise<AppBootstrap> => {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  const userId = user?.id ?? null;

  if (!userId) {
    return {
      user: null,
      profile: null,
      memberships: [],
      activeClinicId: null,
      activeClinicTimezone: null,
    };
  }

  const [profile, membershipRows] = await Promise.all([
    getEmployee(userId),
    getMemberships(userId),
  ]);

  const memberships = membershipRows.map(mapMembershipRow);
  const activeClinicId = resolveActiveClinicId(
    await readActiveClinicCookie(),
    memberships,
    profile,
  );
  const activeClinicTimezone = resolveActiveClinicTimezone(
    activeClinicId,
    membershipRows,
  );

  return {
    user,
    profile,
    memberships,
    activeClinicId,
    activeClinicTimezone,
  };
});
