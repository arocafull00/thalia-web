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

export type ActiveClinicBootstrap = Pick<
  AppBootstrap,
  "activeClinicId" | "activeClinicTimezone"
>;

type ServerIdentity = {
  userId: string;
  user: User;
};

const readActiveClinicCookie = cache(async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const value = cookieStore.get(ACTIVE_CLINIC_COOKIE_NAME)?.value;

  if (!value) {
    return null;
  }

  return decodeURIComponent(value);
});

const getServerIdentity = cache(async (): Promise<ServerIdentity | null> => {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== "string") {
    return null;
  }

  const { data: sessionData } = await supabase.auth.getSession();

  if (sessionData.session?.user.id === userId) {
    return { userId, user: sessionData.session.user };
  }

  const { data: userData } = await supabase.auth.getUser();

  if (userData.user?.id !== userId) {
    return null;
  }

  return { userId, user: userData.user };
});

const getCachedEmployee = cache((userId: string) => getEmployee(userId));
const getCachedMemberships = cache((userId: string) => getMemberships(userId));

function mapMembershipRow(row: ClinicMembershipRow): ClinicMembershipView {
  const clinicRaw = row.clinics;
  const clinic = Array.isArray(clinicRaw) ? clinicRaw[0] : clinicRaw;

  return {
    id: row.id,
    clinicId: row.clinic_id,
    clinicName: clinic?.name ?? "Clínica",
    clinicLogoUrl: clinic?.logo_url ?? null,
    clinicTimezone: clinic?.timezone ?? null,
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

function resolveActiveClinicBootstrap(
  cookieClinicId: string | null,
  membershipRows: ClinicMembershipRow[],
  profile: Employee | null,
): ActiveClinicBootstrap {
  const memberships = membershipRows.map(mapMembershipRow);
  const activeClinicId = resolveActiveClinicId(
    cookieClinicId,
    memberships,
    profile,
  );

  return {
    activeClinicId,
    activeClinicTimezone: resolveActiveClinicTimezone(
      activeClinicId,
      membershipRows,
    ),
  };
}

export const getActiveClinicBootstrap = cache(
  async (): Promise<ActiveClinicBootstrap> => {
    const identity = await getServerIdentity();

    if (!identity) {
      return {
        activeClinicId: null,
        activeClinicTimezone: null,
      };
    }

    const [cookieClinicId, membershipRows] = await Promise.all([
      readActiveClinicCookie(),
      getCachedMemberships(identity.userId),
    ]);
    const profile =
      membershipRows.length === 0
        ? await getCachedEmployee(identity.userId)
        : null;

    return resolveActiveClinicBootstrap(
      cookieClinicId,
      membershipRows,
      profile,
    );
  },
);

export const getAppBootstrap = cache(async (): Promise<AppBootstrap> => {
  const identity = await getServerIdentity();

  if (!identity) {
    return {
      user: null,
      profile: null,
      memberships: [],
      activeClinicId: null,
      activeClinicTimezone: null,
    };
  }

  const [profile, membershipRows, cookieClinicId] = await Promise.all([
    getCachedEmployee(identity.userId),
    getCachedMemberships(identity.userId),
    readActiveClinicCookie(),
  ]);

  const memberships = membershipRows.map(mapMembershipRow);
  const { activeClinicId, activeClinicTimezone } = resolveActiveClinicBootstrap(
    cookieClinicId,
    membershipRows,
    profile,
  );

  return {
    user: identity.user,
    profile,
    memberships,
    activeClinicId,
    activeClinicTimezone,
  };
});
