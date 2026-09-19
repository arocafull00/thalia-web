"use client";

import { CalendarSync, Link2Off, TriangleAlert } from "lucide-react";

import SettingsActionRow from "@/components/settings/components/settings-action-row";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useGoogleCalendarConnection } from "@/lib/hooks/use-google-calendar-connection";

const COPY = SETTINGS_COPY.calendar;

export default function SettingsCalendarPanel() {
  const { connection, connect, disconnect, disconnecting, loading } =
    useGoogleCalendarConnection();

  const needsReauth = connection?.status === "needs_reauth";

  return (
    <section aria-labelledby="settings-calendar-heading">
      <h2
        id="settings-calendar-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {COPY.sectionTitle}
      </h2>

      {loading ? (
        <div className="mt-4 h-16 animate-pulse rounded-xl bg-surface" />
      ) : (
        <div className="divide-y divide-border-subtle pt-2">
          {/*
            Sin conexión y con la conexión caducada se ofrece lo mismo —volver a
            pasar por Google—, pero se nombran distinto: «caducada» explica por
            qué han dejado de sincronizarse las citas, y sin eso el usuario
            asume que la integración no funciona.
          */}
          {!connection || needsReauth ? (
            <SettingsActionRow
              description={
                needsReauth ? COPY.needsReauthHint : COPY.connectHint
              }
              icon={needsReauth ? TriangleAlert : CalendarSync}
              iconClassName={
                needsReauth
                  ? "bg-warning-subtle text-warning"
                  : "bg-primary-subtle text-primary"
              }
              loadingLabel={COPY.connectLoading}
              onClick={connect}
              title={needsReauth ? COPY.needsReauth : COPY.connect}
            />
          ) : (
            <SettingsActionRow
              description={COPY.connectedHint}
              icon={CalendarSync}
              iconClassName="bg-success-subtle text-success"
              loadingLabel={COPY.connectLoading}
              title={COPY.connectedAs(connection.google_email)}
            />
          )}

          {connection ? (
            <SettingsActionRow
              description={COPY.disconnectHint}
              disabled={disconnecting}
              icon={Link2Off}
              iconClassName="bg-danger-subtle text-danger"
              loading={disconnecting}
              loadingLabel={COPY.disconnectLoading}
              onClick={() => disconnect()}
              title={COPY.disconnect}
              titleClassName="text-ink group-hover:text-danger"
            />
          ) : null}
        </div>
      )}
    </section>
  );
}
