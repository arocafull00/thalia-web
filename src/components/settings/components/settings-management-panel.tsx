"use client";

import { Scissors, User, Users } from "lucide-react";

import SettingsManagementTile from "@/components/settings/components/settings-management-tile";
import { SETTINGS_COPY } from "@/copy/settings-copy";

const MANAGEMENT_LINKS = [
  {
    description: SETTINGS_COPY.management.teamDescription,
    href: "/settings/team",
    icon: Users,
    title: SETTINGS_COPY.management.team,
  },
  {
    description: SETTINGS_COPY.management.staffDescription,
    href: "/settings/staff",
    icon: User,
    title: SETTINGS_COPY.management.staff,
  },
  {
    description: SETTINGS_COPY.management.treatmentsDescription,
    href: "/settings/treatments",
    icon: Scissors,
    title: SETTINGS_COPY.management.treatments,
  },
] as const;

export default function SettingsManagementPanel() {
  return (
    <section>
      <h2 className="border-b border-border pb-3 text-lg font-medium text-ink">
        {SETTINGS_COPY.management.sectionTitle}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {MANAGEMENT_LINKS.map((link) => (
          <SettingsManagementTile key={link.href} {...link} />
        ))}
      </div>
    </section>
  );
}
