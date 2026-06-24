import type { User } from "@supabase/supabase-js";

import {
  hasPendingTeamInvites,
  hasRegistrationProfile,
  isOwnerRegistration,
} from "@/lib/registration-metadata";
import type { ClinicMembershipView } from "@/stores/clinic-store";
import type { OnboardingIntent } from "@/stores/onboarding-intent-store";

export type PostAuthRouteInput = {
  pendingInviteToken: string | null;
  onboardingIntent: OnboardingIntent | null;
  introCompleted: boolean;
  memberships: ClinicMembershipView[];
  activeClinicId: string | null;
  isAuthenticated: boolean;
  user: User | null;
};

export type PostAuthRouteResult = {
  href: string;
  setActiveClinicId?: string;
};

function externalMemberships(memberships: ClinicMembershipView[]) {
  return memberships.filter((membership) => membership.role === "external");
}

function needsClinicSelector(memberships: ClinicMembershipView[], activeClinicId: string | null) {
  const external = externalMemberships(memberships);

  if (external.length < 2) {
    return false;
  }

  if (!activeClinicId) {
    return true;
  }

  return !external.some((membership) => membership.clinicId === activeClinicId);
}

export function resolvePostAuthRoute(input: PostAuthRouteInput): PostAuthRouteResult {
  if (input.pendingInviteToken) {
    return { href: `/invite/${input.pendingInviteToken}` };
  }

  if (!input.isAuthenticated) {
    if (!input.introCompleted) {
      return { href: "/login" };
    }

    if (input.pendingInviteToken) {
      return { href: "/login" };
    }

    return { href: "/login" };
  }

  const activeMemberships = input.memberships.filter(
    (membership) => membership.status === "active",
  );

  if (activeMemberships.length === 1 && hasPendingTeamInvites(input.user)) {
    return {
      href: "/invite-team",
      setActiveClinicId: activeMemberships[0].clinicId,
    };
  }

  if (activeMemberships.length === 1) {
    return {
      href: "/dashboard",
      setActiveClinicId: activeMemberships[0].clinicId,
    };
  }

  if (activeMemberships.length >= 2) {
    const nonExternal = activeMemberships.some((membership) => membership.role !== "external");

    if (nonExternal) {
      return { href: "/login" };
    }

    if (needsClinicSelector(activeMemberships, input.activeClinicId)) {
      return { href: "/login" };
    }

    if (input.activeClinicId) {
      return { href: "/dashboard" };
    }

    return { href: "/login" };
  }

  if (input.onboardingIntent === "employee") {
    if (!hasRegistrationProfile(input.user)) {
      return { href: "/register-employee" };
    }

    return { href: "/login" };
  }

  if (input.onboardingIntent === "owner" || isOwnerRegistration(input.user)) {
    if (!hasRegistrationProfile(input.user)) {
      return { href: "/register-employee" };
    }

    return { href: "/create-clinic" };
  }

  if (activeMemberships.length === 0 && input.isAuthenticated) {
    return { href: "/login" };
  }

  return { href: "/login" };
}

export function resolveUnauthenticatedRoute(
  introSeen: boolean,
  pendingInviteToken: string | null,
): string {
  if (pendingInviteToken) {
    return "/login";
  }

  if (!introSeen) {
    return "/login";
  }

  return "/login";
}
