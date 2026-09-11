"use client";

import { Lock, LogOut } from "lucide-react";

import SettingsActionRow from "@/components/settings/components/settings-action-row";
import { SETTINGS_COPY } from "@/copy/settings-copy";

type SettingsAccountPanelProps = {
  onChangePassword: () => void;
  onSignOut: () => void;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
};

export default function SettingsAccountPanel({
  onChangePassword,
  onSignOut,
  passwordSubmitting,
  signOutSubmitting,
}: SettingsAccountPanelProps) {
  return (
    <section aria-labelledby="settings-account-heading">
      <h2
        id="settings-account-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {SETTINGS_COPY.account.sectionTitle}
      </h2>
      <div className="divide-y divide-border-subtle pt-2">
        <SettingsActionRow
          description={SETTINGS_COPY.account.changePasswordHint}
          disabled={passwordSubmitting}
          icon={Lock}
          iconClassName="bg-primary-subtle text-primary"
          loading={passwordSubmitting}
          loadingLabel={SETTINGS_COPY.account.changePasswordLoading}
          onClick={onChangePassword}
          title={SETTINGS_COPY.account.changePassword}
        />
        <SettingsActionRow
          description={SETTINGS_COPY.account.signOutHint}
          disabled={signOutSubmitting}
          icon={LogOut}
          iconClassName="bg-danger-subtle text-danger"
          loading={signOutSubmitting}
          loadingLabel={SETTINGS_COPY.account.signOutLoading}
          onClick={onSignOut}
          title={SETTINGS_COPY.account.signOut}
          titleClassName="text-ink group-hover:text-danger"
        />
      </div>
    </section>
  );
}
