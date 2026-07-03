"use client";

import * as Popover from "@radix-ui/react-popover";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  MoreVertical,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import AppointmentPersonAvatar from "@/components/appointments/components/appointment-person-avatar";
import AppointmentStatusBadge from "@/components/appointments/components/appointment-status-badge";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import {
  formatAppointmentDetailDay,
  formatAppointmentDuration,
  formatAppointmentTimeRange,
} from "@/lib/format";
import type { AppointmentWithRelations } from "@/types/database.types";

type AppointmentHeaderProps = {
  appointment: AppointmentWithRelations;
  canChangeStatus: boolean;
  updatingStatus: boolean;
  onEdit: () => void;
  onMarkCompleted: () => void;
  onCancel: () => void;
};

export default function AppointmentHeader({
  appointment,
  canChangeStatus,
  updatingStatus,
  onEdit,
  onMarkCompleted,
  onCancel,
}: AppointmentHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const patientName = appointment.patients?.full_name ?? "Paciente";
  const patientPhone = appointment.patients?.phone ?? null;
  const hasMenuActions = Boolean(patientPhone) || canChangeStatus;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-4">
        <Link
          href="/appointments"
          className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {APPOINTMENT_DETAIL_COPY.back}
        </Link>
        <div className="flex flex-wrap items-start gap-4">
          <AppointmentPersonAvatar
            name={patientName}
            avatarUrl={appointment.patients?.avatar_url ?? null}
          />
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-medium tracking-tight text-ink">
                {patientName}
              </h1>
              <AppointmentStatusBadge status={appointment.status} />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-secondary">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                {formatAppointmentDetailDay(appointment.starts_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" aria-hidden="true" />
                {formatAppointmentTimeRange(
                  appointment.starts_at,
                  appointment.ends_at,
                )}
              </span>
              <span>{formatAppointmentDuration(appointment)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ActionButton title={APPOINTMENT_DETAIL_COPY.edit} onClick={onEdit} />
        {hasMenuActions ? (
          <Popover.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Popover.Trigger asChild>
              <button
                type="button"
                aria-label={APPOINTMENT_DETAIL_COPY.moreActions}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas"
              >
                <MoreVertical className="size-4" aria-hidden="true" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                align="end"
                sideOffset={8}
                className="z-100 min-w-52 rounded-2xl border border-border bg-surface p-2 shadow-lg"
              >
                {patientPhone ? (
                  <a
                    href={`tel:${patientPhone}`}
                    onClick={closeMenu}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-ink hover:bg-canvas"
                  >
                    <Phone
                      className="size-4 text-ink-muted"
                      aria-hidden="true"
                    />
                    {APPOINTMENT_DETAIL_COPY.callPatient}
                  </a>
                ) : null}
                {canChangeStatus ? (
                  <>
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => {
                        closeMenu();
                        onMarkCompleted();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-ink hover:bg-canvas disabled:opacity-50"
                    >
                      <CheckCircle
                        className="size-4 text-ink-muted"
                        aria-hidden="true"
                      />
                      {APPOINTMENT_DETAIL_COPY.markCompleted}
                    </button>
                    <button
                      type="button"
                      disabled={updatingStatus}
                      onClick={() => {
                        closeMenu();
                        onCancel();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-danger hover:bg-danger-subtle disabled:opacity-50"
                    >
                      {APPOINTMENT_DETAIL_COPY.cancel}
                    </button>
                  </>
                ) : null}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ) : null}
      </div>
    </div>
  );
}
