"use client";

import { User, Users } from "lucide-react";

import SettingsManagementLink from "@/components/settings/components/settings-management-link";
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
] as const;

export default function SettingsManagementPanel() {
  return (
    <section aria-labelledby="settings-management-heading">
      <h2
        id="settings-management-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {SETTINGS_COPY.management.sectionTitle}
      </h2>
      <div className="divide-y divide-border-subtle">
        {MANAGEMENT_LINKS.map((link) => (
          <SettingsManagementLink key={link.href} {...link} />
        ))}
      </div>
    </section>
  );
}
