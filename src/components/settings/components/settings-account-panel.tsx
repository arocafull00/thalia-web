"use client";

import { Lock, LogOut } from "lucide-react";

import SettingsActionRow from "@/components/settings/components/settings-action-row";
import { SETTINGS_COPY } from "@/copy/settings-copy";

type SettingsAccountPanelProps = {
  onChangePassword: () => void;
  onSignOut: () => void;
  passwordCooldownSeconds: number;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
};

export default function SettingsAccountPanel({
  onChangePassword,
  onSignOut,
  passwordCooldownSeconds,
  passwordSubmitting,
  signOutSubmitting,
}: SettingsAccountPanelProps) {
  const coolingDown = passwordCooldownSeconds > 0;
  return (
    <section aria-labelledby="settings-account-heading">
      <h2
        id="settings-account-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {SETTINGS_COPY.account.sectionTitle}
      </h2>
      <div className="divide-y divide-border-subtle pt-2">
        {/*
          Durante la espera el título pasa a ser la cuenta atrás. Sin eso el
          usuario pulsa, no ve nada y vuelve a pulsar, porque el envío anterior
          no deja rastro en la pantalla.
        */}
        <SettingsActionRow
          description={
            coolingDown
              ? SETTINGS_COPY.account.changePasswordCooldownHint
              : SETTINGS_COPY.account.changePasswordHint
          }
          disabled={passwordSubmitting || coolingDown}
          icon={Lock}
          iconClassName="bg-primary-subtle text-primary"
          loading={passwordSubmitting}
          loadingLabel={SETTINGS_COPY.account.changePasswordLoading}
          onClick={onChangePassword}
          title={
            coolingDown
              ? SETTINGS_COPY.account.changePasswordCooldown(
                  passwordCooldownSeconds,
                )
              : SETTINGS_COPY.account.changePassword
          }
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
