import SettingsLayoutClient from "@/components/settings/settings-layout-client";

type SettingsLayoutProps = { children: React.ReactNode };

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
}
