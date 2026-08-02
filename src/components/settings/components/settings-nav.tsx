"use client";

import SettingsNavItem from "@/components/settings/components/settings-nav-item";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import {
  SETTINGS_SECTIONS,
  type SettingsSectionId,
} from "@/lib/settings-sections";

const SETTINGS_NAV_ITEMS: ReadonlyArray<{
  id: SettingsSectionId;
  href: string;
  label: string;
}> = SETTINGS_SECTIONS.map((section) => ({
  ...section,
  label: SETTINGS_COPY.nav[section.id],
}));

type SettingsNavProps = {
  activeSection: SettingsSectionId;
  canManageClinic: boolean;
};

export default function SettingsNav({
  activeSection,
  canManageClinic,
}: SettingsNavProps) {
  const visibleItems = SETTINGS_NAV_ITEMS.filter(
    (item) => item.id !== "clinica" || canManageClinic,
  );

  return (
    <nav
      aria-label={SETTINGS_COPY.page.title}
      className="shrink-0 border-b border-border-subtle px-4 py-4 lg:hidden"
    >
      <ul className="flex flex-col gap-1 lg:gap-0.5">
        {visibleItems.map((item) => (
          <li key={item.id}>
            <SettingsNavItem
              href={item.href}
              label={item.label}
              active={activeSection === item.id}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
