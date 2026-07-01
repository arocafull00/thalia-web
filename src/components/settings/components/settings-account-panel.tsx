"use client";

import { Lock, LogOut } from "lucide-react";

import SettingsActionRow from "@/components/settings/components/settings-action-row";
import { Notice } from "@/components/ui/primitives/notice";
import { SETTINGS_COPY } from "@/copy/settings-copy";

type SettingsAccountPanelProps = {
  onChangePassword: () => void;
  onSignOut: () => void;
  passwordMessage: string | null;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
};

export default function SettingsAccountPanel({
  onChangePassword,
  onSignOut,
  passwordMessage,
  passwordSubmitting,
  signOutSubmitting,
}: SettingsAccountPanelProps) {
  return (
    <section>
      <h2 className="border-b border-border pb-3 text-lg font-medium text-ink">
        {SETTINGS_COPY.account.sectionTitle}
      </h2>
      <div className="mt-4 divide-y divide-border-subtle overflow-hidden rounded-2xl border border-border bg-surface">
        {passwordMessage ? (
          <div className="px-5 pt-4" role="status" aria-live="polite">
            <Notice message={passwordMessage} />
          </div>
        ) : null}
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
